const canonicalMap = {
  // SQL group
  'mysql': 'sql', 'postgresql': 'sql', 'postgres': 'sql', 'mariadb': 'sql', 'sql database': 'sql', 'sql databases': 'sql',
  // REST group
  'rest api': 'rest api', 'rest apis': 'rest api', 'restful': 'rest api', 'restful api': 'rest api', 'rest api development': 'rest api',
  // Agile group
  'agile': 'agile', 'scrum': 'agile', 'agilescrum': 'agile', 'kanban': 'agile',
  // JS/TS
  'nodejs': 'node', 'node': 'node',
  'reactjs': 'react', 'react': 'react',
  'vuejs': 'vue', 'vue': 'vue',
  'typescript': 'ts', 'ts': 'ts',
  'javascript': 'js', 'js': 'js',
  'nextjs': 'nextjs', 'next': 'nextjs'
};

function normalizeString(str) {
  if (!str) return '';
  return str.toLowerCase()
    .replace(/[^\w\s]|_/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function getCanonical(term) {
  const norm = normalizeString(term);
  if (canonicalMap[norm]) return canonicalMap[norm];
  
  // Try partial mapping for common prefixes
  for (const [key, val] of Object.entries(canonicalMap)) {
    if (norm.includes(key)) return val;
  }
  return norm;
}

function isMatch(skillA, skillB) {
  const normA = normalizeString(skillA);
  const normB = normalizeString(skillB);
  
  if (normA === normB) return true;
  
  const canA = getCanonical(normA);
  const canB = getCanonical(normB);
  if (canA === canB) return true;

  // Fuzzy phrase matching: if one contains the other (above length 3)
  if (normA.length > 3 && normB.length > 3) {
     if (normA.includes(normB) || normB.includes(normA)) return true;
  }
  
  return false;
}

function getVariants(skill) {
  const s = normalizeString(skill);
  const variants = new Set([s]);
  const can = getCanonical(s);
  if (can !== s) variants.add(can);
  
  // Plural handling
  if (s.endsWith('s') && s.length > 3) variants.add(s.slice(0, -1));
  else variants.add(s + 's');
  
  return Array.from(variants);
}

function calculateScore(resumeText, aiResult) {
  const matched_keywords = [];
  const matched_skills = [];
  const missing_skills = [];
  
  const resumeSkillsRaw = aiResult.extracted_resume_skills || [];
  const aiFallbackMap = new Map();
  const normalizedResumeSet = new Set();
  
  resumeSkillsRaw.forEach(item => {
    let s = typeof item === 'object' ? item.skill : item;
    let fallback = typeof item === 'object' ? item.strength : 'medium';
    const norm = normalizeString(s);
    normalizedResumeSet.add(norm);
    aiFallbackMap.set(norm, fallback || 'medium');
  });

  const parsedSections = parseSections(resumeText);

  const criticalJDSkills = aiResult.extracted_jd_critical_skills || [];
  const totalCritical = criticalJDSkills.length;
  let matchedCriticalCount = 0;
  let sumCriticalMultipliers = 0;

  const niceJDSkills = aiResult.extracted_jd_nice_to_have_skills || [];
  const totalNice = niceJDSkills.length;
  let matchedNiceCount = 0;

  // Evaluate critical skills
  criticalJDSkills.forEach(skill => {
    let matchedInResume = false;
    let fallbackStrength = 'medium';

    // Step 1: Check if it exists in the AI extracted set (using canonical match)
    for (const [resSkill, strength] of aiFallbackMap.entries()) {
      if (isMatch(skill, resSkill)) {
        matchedInResume = true;
        fallbackStrength = strength;
        break;
      }
    }

    if (matchedInResume) {
      const strengthData = determineSkillStrength(skill, resumeText, parsedSections, fallbackStrength);
      matched_keywords.push(skill);
      matched_skills.push({ skill, strength: strengthData.strengthString });
      
      matchedCriticalCount++;
      sumCriticalMultipliers += strengthData.finalMultiplier;
    } else {
      missing_skills.push({
        skill,
        priority: 'high',
        impact: `+${Math.round(60 / (totalCritical || 1))}%`
      });
    }
  });

  // Evaluate nice-to-have skills
  niceJDSkills.forEach(skill => {
    let matchedInResume = false;
    let fallbackStrength = 'medium';

    for (const [resSkill, strength] of aiFallbackMap.entries()) {
      if (isMatch(skill, resSkill)) {
        matchedInResume = true;
        fallbackStrength = strength;
        break;
      }
    }
    
    if (matchedInResume) {
      const strengthData = determineSkillStrength(skill, resumeText, parsedSections, fallbackStrength);
      matched_keywords.push(skill);
      matched_skills.push({ skill, strength: strengthData.strengthString });
      matchedNiceCount++;
    } else {
      missing_skills.push({
        skill,
        priority: 'low',
        impact: `+${Math.round(20 / (totalNice || 1))}%`
      });
    }
  });

  // Scoring Logic: (criticalMatch % * 60) + (niceMatch % * 20) + (expDepth % * 20)
  const criticalRatio = totalCritical > 0 ? (matchedCriticalCount / totalCritical) : 1;
  const niceRatio     = totalNice > 0     ? (matchedNiceCount / totalNice)         : 1;
  const expRatio      = totalCritical > 0 ? (sumCriticalMultipliers / totalCritical) : 1;

  const keywordPoints = criticalRatio * 60;
  const nicePoints    = niceRatio * 20;
  const expPoints     = expRatio * 20;

  let finalScore = Math.round(keywordPoints + nicePoints + expPoints);
  
  // Clamping for zero match edge case
  if (matchedCriticalCount === 0 && matchedNiceCount === 0) {
    finalScore = Math.min(finalScore, 10);
  }

  finalScore = Math.max(0, Math.min(100, finalScore));

  // Spam Detection
  const spam_signals = [];
  const getRawKeywordCount = (skill, text) => {
    const variants = getVariants(skill);
    const sortedVariants = [...variants].sort((a, b) => b.length - a.length);
    const escapedVariants = sortedVariants.map(v => v.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
    const regex = new RegExp(`\\b(?:${escapedVariants.join('|')})\\b`, 'gi');
    const matches = text.match(regex);
    return matches ? matches.length : 0;
  };

  const allConsideredSkills = new Set([
      ...criticalJDSkills, 
      ...niceJDSkills, 
      ...resumeSkillsRaw.map(s => typeof s === 'object' ? s.skill : s)
  ]);

  allConsideredSkills.forEach(skill => {
    const rawCount = getRawKeywordCount(skill, resumeText);
    if (rawCount > 6) spam_signals.push({ skill, count: rawCount });
  });

  return {
    ...aiResult,
    score: finalScore,
    score_breakdown: {
      critical_match: Math.round(keywordPoints),
      nice_to_have_match: Math.round(nicePoints),
      experience_depth: Math.round(expPoints)
    },
    matched_keywords,
    matched_skills,
    missing_skills,
    spam_signals
  };
}

function parseSections(resumeText) {
  const lines = resumeText.split('\n');
  let currentSection = 'unclassified';
  const sections = {
    skills: [],
    experience: [],
    unclassified: []
  };

  const skillsHeaderRegex = /^(skills|technical skills|technologies|core competencies)[:\-]?$/i;
  const experienceHeaderRegex = /^(experience|work experience|employment history|projects|professional experience|personal projects)[:\-]?$/i;
  const educationHeaderRegex = /^(education|academic|academic background)[:\-]?$/i;

  for (let line of lines) {
    const trimmed = line.trim();
    if (!trimmed) continue;

    if (trimmed.length < 50) {
      if (skillsHeaderRegex.test(trimmed)) {
        currentSection = 'skills';
        continue;
      } else if (experienceHeaderRegex.test(trimmed)) {
        currentSection = 'experience';
        continue;
      } else if (educationHeaderRegex.test(trimmed)) {
        currentSection = 'unclassified';
        continue;
      }
    }

    if (sections[currentSection]) {
      sections[currentSection].push(trimmed);
    }
  }
  
  return {
    skills: sections.skills.join('\n'),
    experience: sections.experience.join('\n'),
    unclassified: sections.unclassified.join('\n')
  };
}

function determineSkillStrength(skill, resumeText, parsedSections, aiFallbackStrength) {
  const metricsRegex = /(\d+%|increased|reduced|improved|optimized|scaled|reduced|accelerated)/i;
  const experienceVerbsRegex = /(built|developed|implemented|deployed|engineered|led|managed|designed)/i;

  const lineContainsSkill = (line) => isMatch(line, skill);

  let foundWithMetrics = false;
  let foundWithVerbs = false;
  let experienceMentions = 0;

  const processSegments = (text, isExperienceSec) => {
    if (!text) return;
    const segments = text.split(/(?:\n|(?<=[.?!])\s+)/);
    for (const seg of segments) {
      if (!seg.trim()) continue;
      if (lineContainsSkill(seg)) {
        const hasVerb = experienceVerbsRegex.test(seg);
        const hasMetric = metricsRegex.test(seg);

        if (hasVerb) foundWithVerbs = true;
        if (hasMetric) foundWithMetrics = true;

        if (isExperienceSec) {
          experienceMentions++;
        }
      }
    }
  };

  processSegments(parsedSections.experience, true);
  processSegments(parsedSections.unclassified, false);
  processSegments(parsedSections.skills, false);

  // Strict Definition Implementation:
  // Strong: Verb + Metric
  // Medium: Verb
  // Weak: List only
  let strengthString = 'weak';
  if (foundWithVerbs && foundWithMetrics) strengthString = 'strong';
  else if (foundWithVerbs) strengthString = 'medium';
  else strengthString = aiFallbackStrength || 'weak';

  const STRENGTH_MULTIPLIER = { strong: 1.5, medium: 1.0, weak: 0.5 };
  let baseStrength = STRENGTH_MULTIPLIER[strengthString] || 0.5;

  let experienceBonus = 0;
  if (experienceMentions >= 3) experienceBonus += 0.3; // Rewarding depth of experience

  const finalMultiplier = Math.min(1.8, baseStrength + experienceBonus);
  return { strengthString, finalMultiplier };
}

module.exports = { calculateScore, determineSkillStrength, parseSections };
