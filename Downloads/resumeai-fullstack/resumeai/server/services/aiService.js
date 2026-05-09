// ─── Gemini API Configuration ────────────────────────────────────────────────
// Endpoint: v1beta · gemini-2.5-flash · generateContent
// Auth:     x-goog-api-key header ONLY (no ?key= query param — dual-auth can cause 400/403)
const GEMINI_ENDPOINT =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent";

// ─── Core fetch wrapper ───────────────────────────────────────────────────────
async function geminiPost(prompt) {
  // ── 1. Guard: API key ────────────────────────────────────────────────────────
  const key = process.env.GEMINI_API_KEY;
  if (!key) {
    throw new Error('GEMINI_API_KEY environment variable is not set — check server/.env');
  }

  // ── 2. Guard: native fetch (Node 18+) ────────────────────────────────────────
  if (typeof fetch === 'undefined') {
    throw new Error('fetch is not available — upgrade to Node 18+ or install node-fetch');
  }

  // ── 3. Debug: log what we are about to send ───────────────────────────────────
  console.log('[aiService] → Sending request to Gemini');
  console.log('[aiService]   endpoint  :', GEMINI_ENDPOINT);
  console.log('[aiService]   promptLen :', prompt.length, 'chars');

  // ── 4. HTTP request (header-only auth — no ?key= query param) ────────────────
  let res;
  try {
    res = await fetch(GEMINI_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-goog-api-key': key,          // ← sole auth mechanism
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [{ text: prompt }],
          },
        ],
        generationConfig: {
          responseMimeType: 'application/json',
        },
      }),
    });
  } catch (networkErr) {
    throw new Error('Network error reaching Gemini API: ' + networkErr.message);
  }

  // ── 5. Read raw body once (text, so we can log it before parsing) ─────────────
  const rawText = await res.text();
  console.log('[aiService] ← Gemini responded | status:', res.status, '| bodyLen:', rawText.length);
  console.log('[aiService]   body (first 300 chars):', rawText.slice(0, 300));

  // ── 6. Non-OK HTTP status ─────────────────────────────────────────────────────
  if (!res.ok) {
    console.error('[aiService] ✗ Gemini HTTP error:', res.status);
    console.error('[aiService]   full body:', rawText.slice(0, 500));
    throw new Error(`Gemini API error ${res.status}: ${rawText.slice(0, 200)}`);
  }

  // ── 7. Parse outer JSON envelope ──────────────────────────────────────────────
  let data;
  try {
    data = JSON.parse(rawText);
  } catch (parseErr) {
    console.error('[aiService] ✗ Could not parse Gemini envelope:', parseErr.message);
    console.error('[aiService]   raw:', rawText.slice(0, 300));
    throw new Error('Gemini returned an unparseable response: ' + parseErr.message);
  }

  // ── 8. Guard: missing candidates (prompt-level blocks, quota, etc.) ───────────
  const candidate = data?.candidates?.[0];
  if (!candidate) {
    const blockReason = data?.promptFeedback?.blockReason || 'none';
    console.error('[aiService] ✗ No candidates in response');
    console.error('[aiService]   blockReason:', blockReason);
    console.error('[aiService]   full data:', JSON.stringify(data).slice(0, 400));
    throw new Error(
      `Gemini returned no candidates (blockReason: ${blockReason}). ` +
      'The prompt may have been blocked by safety filters.'
    );
  }

  // ── 9. Guard: SAFETY finish reason ────────────────────────────────────────────
  const finishReason = candidate?.finishReason;
  if (finishReason === 'SAFETY') {
    const safetyRatings = candidate?.safetyRatings
      ? JSON.stringify(candidate.safetyRatings)
      : 'unavailable';
    console.error('[aiService] ✗ Gemini blocked response due to SAFETY policy');
    console.error('[aiService]   safetyRatings:', safetyRatings);
    throw new Error(
      'Gemini blocked this response due to its safety policy. ' +
      'Please rephrase your input and try again. (finishReason: SAFETY)'
    );
  }

  // ── 10. Guard: empty / missing content text ────────────────────────────────────
  const content = candidate?.content?.parts?.[0]?.text;
  if (!content || !content.trim()) {
    console.error('[aiService] ✗ Gemini returned empty content');
    console.error('[aiService]   finishReason:', finishReason || 'undefined');
    console.error('[aiService]   candidate:', JSON.stringify(candidate).slice(0, 300));
    throw new Error(
      `Gemini returned empty content (finishReason: ${finishReason || 'unknown'})`
    );
  }

  console.log('[aiService] ✓ Received content | contentLen:', content.length, 'chars');

  // ── 11. Strip markdown code fences (```json … ```) ─────────────────────────────
  const cleaned = content
    .replace(/^```json\s*/i, '')  // opening fence with optional language tag
    .replace(/^```\s*/, '')    // opening fence without tag (fallback)
    .replace(/```\s*$/, '')    // closing fence
    .trim();

  // ── 12. Parse inner JSON (the actual AI payload) ───────────────────────────────
  try {
    const parsed = JSON.parse(cleaned);
    console.log('[aiService] ✓ JSON parsed successfully');
    return parsed;
  } catch (jsonErr) {
    console.error('[aiService] ✗ Failed to parse AI JSON payload:', jsonErr.message);
    console.error('[aiService]   cleaned content (first 400 chars):', cleaned.slice(0, 400));
    throw new Error('AI returned malformed JSON — ' + jsonErr.message);
  }
}

// ─── Public API functions ─────────────────────────────────────────────────────

function callGemini(resume, jd) {
  return geminiPost(`You are an expert ATS resume analyser. 
Critically analyse the provided resume against the job description. Make the output highly actionable, intelligent, and decision-oriented. Ensure it feels like a professional career tool, not generic AI advice.
You MUST respond ONLY with a perfectly valid JSON object. Do NOT wrap the JSON in markdown code blocks. Do not add any text before or after the JSON.

Resume:
${resume}

Job Description:
${jd}

Return exactly this JSON structure:
{
  "summary": "<sharp, decision-oriented summary. Ex: 'Strong frontend profile but lacks DevOps exposure, limiting backend role competitiveness.'>",
  "extracted_resume_skills": [
    {
      "skill": "<skill_name>",
      "strength": "<strong|medium|weak based on resume context>"
    }
  ],
  "extracted_jd_critical_skills": ["skill1", "skill2"],
  "extracted_jd_nice_to_have_skills": ["skill3", "skill4"],
  "top_3_actions": [
    "<specific action 1, e.g.: 'Add Docker project with CI/CD pipeline -> +12%'>",
    "<specific action 2>",
    "<specific action 3>"
  ],
  "rewritten_bullets": [
    {
      "before": "<original weak bullet from resume>",
      "after": "<highly tailored, metric-driven replacement bullet>"
    }
  ]
}`);
}

function callGeminiCoverLetter(resume, jd, name) {
  return geminiPost(`Write a professional, concise cover letter for a job applicant and return ONLY a JSON object.

Applicant name: ${name}
Resume:
${resume}

Job Description:
${jd}

Instructions:
- Must be exactly 300–500 words in length
- Confident, specific, and professional tone
- Match keywords from the JD naturally
- No generic openers like "I am writing to apply"
- End with a clear call to action

Return exactly this structure:
{
  "cover_letter": "<full cover letter text with \\n for line breaks>",
  "keywords_used": ["keyword1", "keyword2"],
  "tone": "professional"
}`);
}

function callGeminiKeywords(resume, jd) {
  return geminiPost(`Analyse keyword gaps between this resume and job description.

Job Description:
${jd}

Resume:
${resume}

Return exactly this structure:
{
  "present": ["skill1", "skill2"],
  "critical": ["skill1", "skill2"],
  "nice_to_have": ["skill1", "skill2"],
  "match_percentage": <integer 0-100>,
  "tip": "<one actionable sentence on how to add missing keywords naturally>"
}`);
}

module.exports = { callGemini, callGeminiCoverLetter, callGeminiKeywords };
