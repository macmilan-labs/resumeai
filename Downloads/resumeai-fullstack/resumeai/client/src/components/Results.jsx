import React, { useState } from 'react';

export default function Results({ result, isProUser, setPage }) {
  const [copied, setCopied] = useState(false);
  if (!result) return null;

  const score   = result.score ?? 0;
  const pct     = (score / 100) * 360;
  const verdict = getVerdict(score);

  const plainText = buildPlainText(result);

  async function copyResults() {
    await navigator.clipboard.writeText(plainText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  async function shareScore() {
    const msg = `I just checked my resume's ATS score — got ${score}%. Find out yours: ${window.location.href}`;
    await navigator.clipboard.writeText(msg);
  }

  return (
    <div style={{ marginTop:'1.5rem', background:'var(--bg)', border:'1px solid var(--border2)', borderRadius:'var(--radius)', padding:'1.5rem' }}>
      {/* Score ring + verdict */}
      <div style={{ display:'flex', alignItems:'center', gap:'1rem', marginBottom:'1.5rem' }}>
        <div style={{
          width:72, height:72, borderRadius:'50%', flexShrink:0, position:'relative',
          background:`conic-gradient(${verdict.color} ${pct}deg, var(--border2) ${pct}deg)`,
        }}>
          <div style={{
            position:'absolute', inset:6, borderRadius:'50%', background:'var(--bg)',
            display:'flex', alignItems:'center', justifyContent:'center',
            fontFamily:'var(--serif)', fontSize:22,
          }}>{score}%</div>
        </div>
        <div>
          <h3 style={{ fontSize:16, fontWeight:500, marginBottom:4 }}>ATS Match Score</h3>
          <span style={{
            display:'inline-block', fontSize:11, fontWeight:500, padding:'3px 10px',
            borderRadius:999, background: verdict.bgColor, color: verdict.color,
          }}>{verdict.label}</span>
        </div>
      </div>

      {/* Summary */}
      {(result.summary || result.explanation) && (
        <p style={{ fontSize:13, color:'var(--ink2)', marginBottom:'1rem', lineHeight:1.65 }}>
          <strong>📊 Exec Summary:</strong> {result.summary || result.explanation}
        </p>
      )}

      {/* Insight */}
      {score > 0 && (
        <div style={{ fontSize:12, color:'var(--accent2)', fontWeight:500, padding:'8px 12px', background:'var(--warn-bg)', borderRadius:8, marginBottom:'1rem' }}>
          {getInsight(score, result.missing_skills?.filter(m => m.priority === 'high').length || result.critical?.length || 0)}
        </div>
      )}

      {/* Keywords & Breakdown */}
      <div style={{ fontSize:13, color:'var(--ink2)', lineHeight:1.7, whiteSpace:'pre-wrap' }}>
        {result.matched_skills?.length > 0 ? (
          <div style={{ marginTop:8, marginBottom: 16 }}>
            <strong style={{ color:'var(--ink)', display:'block', marginBottom:8 }}>✓ Matched Skills:</strong>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {result.matched_skills.map((m,i) => {
                const colors = { strong: '#1A7A5E', medium: '#D4521F', weak: 'var(--ink3)' };
                const bgs = { strong: '#E2F4EE', medium: '#fff3e0', weak: 'var(--surface2)' };
                return (
                  <span key={i} style={{ display:'inline-flex', alignItems: 'center', padding: '4px 8px', background: bgs[m.strength] || 'var(--surface2)', borderRadius:6, fontSize:12, border: `1px solid ${colors[m.strength] || 'var(--border)'}40` }}>
                    <span style={{ fontWeight: 500, color: 'var(--ink)' }}>{m.skill}</span>
                    <span style={{ color: colors[m.strength], marginLeft: 6, fontSize: 11, fontWeight: 500 }}>{m.strength}</span>
                  </span>
                );
              })}
            </div>
          </div>
        ) : result.matched_keywords?.length > 0 && (
          <p><strong style={{ color:'var(--ink)' }}>✓ Matched keywords:</strong> {result.matched_keywords.join(', ')}</p>
        )}
        {result.missing_skills?.length > 0 && (
          <div style={{ marginTop:8 }}>
            <strong style={{ color:'var(--ink)' }}>🔴 Critical Gaps & Missing Skills:</strong>
            {result.missing_skills.map((m,i) => (
              <p key={i} style={{ paddingLeft:16 }}>
                • <strong style={{ color:'var(--ink)' }}>{m.skill}</strong> 
                <span style={{ fontSize: 11, color: m.priority === 'high' ? '#c0392b' : 'var(--ink3)', marginLeft: 8 }}>
                  ({m.priority} priority {m.impact && `| ${m.impact}`})
                </span>
              </p>
            ))}
          </div>
        )}
        {/* Support old format too */}
        {result.critical?.length > 0 && (
          <p style={{ marginTop:8 }}><strong style={{ color:'var(--ink)' }}>🔴 Critical gaps:</strong> {result.critical.join(', ')}</p>
        )}
        
        {result.top_3_actions?.length > 0 && (
          <div style={{ marginTop:24, display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <strong style={{ color:'var(--ink)', fontSize: 11, fontWeight: 900, textTransform: 'uppercase', tracking: '0.1em', marginBottom: 4 }}>💡 Top 3 Actions to Improve Score:</strong>
            {result.top_3_actions.map((act,i) => (
              <div key={i} style={{ 
                background: 'white', 
                border: '1px solid var(--border2)', 
                borderLeft: '6px solid var(--accent)', 
                padding: '16px 20px', 
                borderRadius: '16px',
                display: 'flex',
                gap: '16px',
                alignItems: 'center',
                boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)'
              }}>
                <span style={{ fontSize: 24, fontStyle: 'italic', fontWeight: 900, color: 'var(--accent)', opacity: 0.15, minWidth: 20 }}>{i+1}</span>
                <p style={{ color: 'var(--ink)', fontSize: 13, fontWeight: 600, margin: 0, lineHeight: 1.5 }}>{act}</p>
              </div>
            ))}
          </div>
        )}

        {result.score_breakdown && (
          <div style={{ marginTop:16, borderTop: '1px solid var(--border2)', paddingTop: 12 }}>
            <strong style={{ color:'var(--ink)' }}>📈 Score Breakdown:</strong>
            <p style={{ paddingLeft:16 }}>• Skill Coverage: <strong style={{ color: 'var(--accent)' }}>+{result.score_breakdown.critical_match}</strong></p>
            <p style={{ paddingLeft:16 }}>• Experience Depth: <strong style={{ color: 'var(--accent)' }}>+{result.score_breakdown.experience_depth}</strong></p>
          </div>
        )}
      </div>

      {/* Pro breakdown */}
      {isProUser && result.matchedCount != null && (
        <div style={{ marginTop:'1.5rem', padding:'1rem', background:'var(--surface2)', borderRadius:'var(--radius)', fontSize:13, color:'var(--ink2)' }}>
          <strong style={{ color:'var(--ink)' }}>🎯 Job Match Score:</strong> {Math.min(98, Math.max(25, score + Math.round((result.matchedCount / (result.totalCount||10)) * 12) - 3))}%
        </div>
      )}

      {/* Actions */}
      <div style={{ display:'flex', gap:8, justifyContent:'flex-end', marginTop:'1rem' }}>
        <button onClick={shareScore} style={copyBtnStyle}>Share my score</button>
        <button onClick={copyResults} style={copyBtnStyle}>{copied ? 'Copied ✓' : 'Copy results'}</button>
      </div>

      {/* Upgrade nudge (free only) */}
      {!isProUser && (
        <div style={{ marginTop:'1rem', background:'var(--accent-light)', border:'1px solid rgba(26,122,94,0.15)', borderRadius:8, padding:'12px 16px', fontSize:12, color:'var(--accent)', display:'flex', alignItems:'center', justifyContent:'space-between', gap:'1rem' }}>
          <span>Unlock full rewrite suggestions, job match % and more</span>
          <button onClick={() => setPage('pricing')} style={{ fontSize:12, fontWeight:500, background:'var(--accent)', color:'white', border:'none', padding:'6px 14px', borderRadius:6, cursor:'pointer', fontFamily:'var(--sans)' }}>See plans</button>
        </div>
      )}
    </div>
  );
}

function getVerdict(score) {
  if (score < 50) return { label:'Your resume will likely be rejected', color:'#c0392b', bgColor:'#fdecea' };
  if (score < 75) return { label:'Decent but not competitive',          color:'#D4521F', bgColor:'#fff3e0' };
  return                  { label:'Strong match',                        color:'#1A7A5E', bgColor:'#E2F4EE' };
}

function getInsight(score, critCount) {
  if (critCount >= 3) return 'Fixing the critical gaps above could increase your callback chances by 3–4×.';
  if (critCount >= 1) return 'Fixing these issues could increase your callback chances by 2–3×.';
  if (score < 65)     return 'Adding the missing keywords above could meaningfully improve your score.';
  return 'Your resume is in good shape — minor tweaks could push you to the top of the shortlist.';
}

function buildPlainText(r) {
  let t = `ATS Score: ${r.score}%\nVerdict: ${getVerdict(r.score).label}\n\n${r.explanation || ''}\n\n`;
  if (r.matched_skills?.length)   t += `✓ Matched: ${r.matched_skills.map(m => `${m.skill} (${m.strength})`).join(', ')}\n\n`;
  else if (r.matched_keywords?.length) t += `✓ Matched: ${r.matched_keywords.join(', ')}\n\n`;
  if (r.critical?.length)         t += `🔴 Critical: ${r.critical.join(', ')}\n\n`;
  if (r.nice?.length)             t += `🟡 Nice-to-have: ${r.nice.join(', ')}\n\n`;
  if (r.suggestions?.length)      t += `💡 Improvements:\n${r.suggestions.map(s=>'  • '+s).join('\n')}`;
  return t;
}

const copyBtnStyle = {
  fontSize:12, color:'var(--ink3)', background:'none', border:'1px solid var(--border)',
  padding:'5px 12px', borderRadius:6, cursor:'pointer', fontFamily:'var(--sans)',
};
