const { callGemini, callGeminiCoverLetter, callGeminiKeywords } = require('../services/aiService');
const { saveAnalysis, getHistory, getUsageCount, clearHistory, getAnalysisById } = require('../services/historyService');
const { calculateScore } = require('../services/scoringService');

const { OAuth2Client } = require('google-auth-library');
const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

async function verifyGoogleToken(token) {
  if (!token) return null;
  try {
    const ticket = await googleClient.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    return ticket.getPayload();
  } catch (err) {
    console.error('Google token verification failed:', err.message);
    throw new Error('Invalid authentication token');
  }
}

async function getVerifiedUserAndPlan(token) {
  let email = null;
  if (token) {
    try {
      const payload = await verifyGoogleToken(token);
      email = payload?.email ? payload.email.toLowerCase() : null;
    } catch (err) {
      throw new Error('Invalid authentication token');
    }
  }

  const devEmail = (process.env.DEV_EMAIL || 'macmilanmage@gmail.com').toLowerCase();
  let plan = 'free';
  if (email && (email === devEmail || email === 'macmilanmage@gmail.com')) {
    plan = 'pro';
  }
  
  return { email, plan };
}

async function analyzeResume(req, res) {
  const { resume, jd, token } = req.body;
  if (!resume?.trim()) return res.status(400).json({ error: 'resume is required' });
  if (!jd?.trim())     return res.status(400).json({ error: 'jd is required' });

  let email, plan;
  try {
    const auth = await getVerifiedUserAndPlan(token);
    email = auth.email;
    plan = auth.plan;
  } catch (err) {
    return res.status(401).json({ error: err.message });
  }

  console.log(`[analyzeController] Plan check: email=${email}, assignedPlan=${plan}`);

  // Check usage limit
  if (plan === 'free') {
    const usageCount = email ? getUsageCount(email) : 0;
    if (usageCount >= 5) {
      return res.status(403).json({ error: 'Usage limit reached. Upgrade to Pro for unlimited analyses.' });
    }
  }

  console.log('[analyzeController] analyzeResume → calling AI (resume length:', resume.length, ', jd length:', jd.length, ')');
  try {
    const aiResult = await callGemini(resume.trim(), jd.trim());
    
    // Run rule-based scoring deterministically in Node.js
    const finalResult = calculateScore(resume.trim(), aiResult);
    
    // Inject the plan into the result so frontend knows
    finalResult.plan = plan;
    
    console.log('[analyzeController] analyzeResume ← Math engine calculated score:', finalResult.score);
    
    saveAnalysis(resume.trim(), jd.trim(), finalResult, email);
    
    return res.json(finalResult);
  } catch (err) {
    console.error('[analyzeController] analyzeResume FAILED:', err.message);
    console.error(err.stack);
    return res.status(502).json({
      error:   'AI processing failed',
      details: err.message || 'Unknown error from AI service',
    });
  }
}

async function getCoverLetter(req, res) {
  const { resume, jd, name, token } = req.body;
  if (!resume?.trim()) return res.status(400).json({ error: 'resume is required' });
  if (!jd?.trim())     return res.status(400).json({ error: 'jd is required' });

  let plan;
  try {
    const auth = await getVerifiedUserAndPlan(token);
    plan = auth.plan;
  } catch (err) {
    return res.status(401).json({ error: err.message });
  }

  console.log('[analyzeController] getCoverLetter → calling AI');
  try {
    const result = await callGeminiCoverLetter(resume.trim(), jd.trim(), (name || 'Applicant').trim());
    result.plan = plan; // Include plan status
    console.log('[analyzeController] getCoverLetter ← AI OK');
    return res.json(result);
  } catch (err) {
    console.error('[analyzeController] getCoverLetter FAILED:', err.message);
    console.error(err.stack);
    return res.status(502).json({
      error:   'AI processing failed',
      details: err.message || 'Unknown error from AI service',
    });
  }
}

async function getKeywords(req, res) {
  const { resume, jd, token } = req.body;
  if (!resume?.trim()) return res.status(400).json({ error: 'resume is required' });
  if (!jd?.trim())     return res.status(400).json({ error: 'jd is required' });

  let plan;
  try {
    const auth = await getVerifiedUserAndPlan(token);
    plan = auth.plan;
  } catch (err) {
    return res.status(401).json({ error: err.message });
  }

  console.log('[analyzeController] getKeywords → calling AI');
  try {
    const result = await callGeminiKeywords(resume.trim(), jd.trim());
    result.plan = plan; // Include plan status
    console.log('[analyzeController] getKeywords ← AI OK');
    return res.json(result);
  } catch (err) {
    console.error('[analyzeController] getKeywords FAILED:', err.message);
    console.error(err.stack);
    return res.status(502).json({
      error:   'AI processing failed',
      details: err.message || 'Unknown error from AI service',
    });
  }
}

async function getAnalysesHistory(req, res) {
  const { token } = req.query; // History usually fetched via GET params if not using headers
  console.log('[analyzeController] getAnalysesHistory → reading history');
  
  let email = null;
  if (token) {
    try {
      const auth = await getVerifiedUserAndPlan(token);
      email = auth.email;
    } catch (err) {
      return res.status(401).json({ error: 'Auth failed for history fetch' });
    }
  }

  const history = getHistory(email);
  return res.json(history);
}

async function getAnalysisDetail(req, res) {
  const { id } = req.params;
  const { token } = req.query;
  
  let email = null;
  if (token) {
    try {
      const auth = await getVerifiedUserAndPlan(token);
      email = auth.email;
    } catch (err) {
      return res.status(401).json({ error: 'Auth failed' });
    }
  }

  const result = getAnalysisById(id, email);
  if (!result) return res.status(404).json({ error: 'Analysis not found' });
  return res.json(result);
}

async function clearAnalysesHistory(req, res) {
  const { token } = req.query; 
  console.log('[analyzeController] clearAnalysesHistory → processing clear request');
  
  let email = null;
  if (token) {
    try {
      const auth = await getVerifiedUserAndPlan(token);
      email = auth.email;
    } catch (err) {
      return res.status(401).json({ error: 'Invalid authentication token' });
    }
  }

  const success = clearHistory(email);
  return res.json({ 
    success: true, 
    message: success ? 'History cleared permanently' : 'No history found to clear' 
  });
}

async function verifyAuth(req, res) {
  const { token } = req.body;
  try {
    const { email, plan } = await getVerifiedUserAndPlan(token);
    return res.json({ success: true, email, plan });
  } catch (err) {
    return res.status(401).json({ error: err.message });
  }
}

module.exports = { analyzeResume, getCoverLetter, getKeywords, getAnalysesHistory, verifyAuth, clearAnalysesHistory, getAnalysisDetail };
