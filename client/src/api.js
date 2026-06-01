const BASE = '/api';

let apiLogout = null;
export function setApiLogout(fn) {
  apiLogout = fn;
}

async function post(path, body) {
  let res;
  try {
    const token = localStorage.getItem('user_token');
    const finalBody = { ...body };
    if (token) {
      finalBody.token = token;
    }

    res = await fetch(`${BASE}${path}`, {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify(finalBody),
    });
  } catch (networkErr) {
    throw new Error('Cannot reach server — is the backend running? (' + networkErr.message + ')');
  }

  if (res.status === 401) {
    localStorage.removeItem('user_token');
    localStorage.removeItem('user_email');
    if (apiLogout) {
      apiLogout();
    }
  }

  const rawText = await res.text();

  let data;
  try {
    data = JSON.parse(rawText);
  } catch {
    console.error(`[api] ${path} → non-JSON response (${res.status}):`, rawText.slice(0, 200));
    throw new Error(`Server error ${res.status} — unexpected response format`);
  }

  if (!res.ok) {
    throw new Error(data?.error || data?.details || `Server error ${res.status}`);
  }

  return data;
}

export const analyzeResume  = (resume, jd)        => post('/analyze',      { resume, jd });
export const getCoverLetter = (resume, jd, name)  => post('/cover-letter', { resume, jd, name });
export const getKeywords    = (resume, jd)        => post('/keywords',     { resume, jd });
export const verifySession  = ()                  => post('/verify',       {});

export async function fetchHistory() {
  const token = localStorage.getItem('user_token');
  const url = token ? `${BASE}/history?token=${token}` : `${BASE}/history`;
  const res = await fetch(url);
  if (!res.ok) throw new Error('Failed to fetch history');
  return res.json();
}

export async function fetchAnalysisById(id) {
  const token = localStorage.getItem('user_token');
  const url = token ? `${BASE}/history/${id}?token=${token}` : `${BASE}/history/${id}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error('Failed to fetch analysis details');
  return res.json();
}

export async function clearHistory() {
  const token = localStorage.getItem('user_token');
  const url = token ? `${BASE}/history?token=${token}` : `${BASE}/history`;
  const res = await fetch(url, {
    method: 'DELETE'
  });
  
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error || 'Failed to clear history');
  }
  return res.json();
}

export async function deleteAnalysisById(id) {
  const token = localStorage.getItem('user_token');
  const url = token ? `${BASE}/history/${id}?token=${token}` : `${BASE}/history/${id}`;
  const res = await fetch(url, {
    method: 'DELETE'
  });
  
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error || 'Failed to delete record');
  }
  return res.json();
}
