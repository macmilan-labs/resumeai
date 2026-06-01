const fs = require('fs');
const path = require('path');

const HISTORY_FILE = path.join(__dirname, '../data/history.json');

// Ensure data directory exists
if (!fs.existsSync(path.join(__dirname, '../data'))) {
  fs.mkdirSync(path.join(__dirname, '../data'), { recursive: true });
}

function saveAnalysis(resume, jd, result, email) {
  const normEmail = email ? email.toLowerCase() : null;
  try {
    let history = [];
    if (fs.existsSync(HISTORY_FILE)) {
      history = JSON.parse(fs.readFileSync(HISTORY_FILE, 'utf-8'));
    }

    const entry = {
      id: Date.now().toString() + Math.random().toString(36).substring(2, 7),
      timestamp: new Date().toISOString(),
      score: result.score,
      summary: result.summary || result.verdict || 'No summary available',
      email: normEmail,
      result: result
    };

    history.unshift(entry);
    fs.writeFileSync(HISTORY_FILE, JSON.stringify(history, null, 2));
    return entry;
  } catch (err) {
    console.error('Failed to save history mapping', err);
  }
}

function getHistory(email) {
  const normEmail = email ? email.toLowerCase() : null;
  try {
    if (fs.existsSync(HISTORY_FILE)) {
      let history = JSON.parse(fs.readFileSync(HISTORY_FILE, 'utf-8'));
      
      // Filter by email if provided
      if (normEmail) {
        history = history.filter(h => h.email === normEmail);
      } else {
        history = history.filter(h => !h.email);
      }

      return history.map(h => ({
        id: h.id,
        timestamp: h.timestamp,
        score: h.score,
        summary: h.summary
      }));
    }
  } catch (err) {
    console.error('Failed to read history mapping', err);
  }
  return [];
}

function getAnalysisById(id, email) {
  const normEmail = email ? email.toLowerCase() : null;
  try {
    if (fs.existsSync(HISTORY_FILE)) {
      const history = JSON.parse(fs.readFileSync(HISTORY_FILE, 'utf-8'));
      const entry = history.find(h => h.id === id);
      
      // Security Check: Match email or both null
      if (entry && entry.email === normEmail) {
        return entry;
      }
    }
  } catch (err) {
    console.error('Failed to read history entry', id, err);
  }
  return null;
}

function clearHistory(email) {
  const normEmail = email ? email.toLowerCase() : null;
  try {
    if (fs.existsSync(HISTORY_FILE)) {
      let history = JSON.parse(fs.readFileSync(HISTORY_FILE, 'utf-8'));
      const initialLength = history.length;
      
      // If email is null, we clear anonymous records (where h.email is null)
      // Otherwise we clear records for that normalized email
      history = history.filter(h => normEmail ? h.email !== normEmail : h.email !== null);
      
      if (history.length !== initialLength) {
        fs.writeFileSync(HISTORY_FILE, JSON.stringify(history, null, 2));
        return true;
      }
    }
  } catch (err) {
    console.error('Failed to clear history for email', normEmail, err);
  }
  return false;
}

function getUsageCount(email) {
  const normEmail = email ? email.toLowerCase() : null;
  if (!normEmail) return 0;
  try {
    if (fs.existsSync(HISTORY_FILE)) {
      const history = JSON.parse(fs.readFileSync(HISTORY_FILE, 'utf-8'));
      return history.filter(h => h.email === normEmail).length;
    }
  } catch (err) {
    console.error('Failed to read history mapping for usage count', err);
  }
  return 0;
}

module.exports = { saveAnalysis, getHistory, getUsageCount, clearHistory, getAnalysisById };
