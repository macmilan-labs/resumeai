import React, { useState } from 'react';

export default function RewriteSection({ data, isProUser, setPage }) {
  if (!data || !data.rewrites?.length) return null;

  return (
    <div style={{ marginTop:'1rem', background:'var(--surface)', border:'1px solid var(--border2)', borderRadius:'var(--radius-lg)', padding:'1.5rem', position:'relative', overflow:'hidden' }}>
      <div style={{ position:'absolute', top:0, left:0, right:0, height:3, background:'linear-gradient(90deg,var(--accent),#2ecc71,var(--accent))', backgroundSize:'200% 100%' }} />
      <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:'1.25rem', paddingBottom:'1rem', borderBottom:'1px solid var(--border2)' }}>
        <div style={{ width:40, height:40, borderRadius:10, background:'var(--accent-light)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:20, flexShrink:0 }}>🔧</div>
        <div>
          <h3 style={{ fontSize:15, fontWeight:500, color:'var(--ink)', marginBottom:2 }}>Smart CV Rewrite</h3>
          <p style={{ fontSize:12, color:'var(--ink3)', lineHeight:1.4 }}>We improved your weakest bullet points to be more impactful and professionally written.</p>
        </div>
      </div>

      {data.rewrites.map(rw => (
        <RewriteCard key={rw.index} rw={rw} />
      ))}

      {!isProUser && (
        <div style={{ background:'var(--accent-light)', border:'1px solid rgba(26,122,94,0.18)', borderRadius:10, padding:'14px 18px', fontSize:13, color:'var(--accent)', display:'flex', alignItems:'center', justifyContent:'space-between', gap:'1rem', marginTop:'0.25rem' }}>
          <span>🔒 {data.totalWeak > 1 ? `${data.totalWeak - 1} more weak bullet${data.totalWeak > 2 ? 's' : ''} found — ` : ''}Unlock full CV rewrite (3 improvements) with Pro</span>
          <button onClick={() => setPage('pricing')} style={{ fontSize:12, fontWeight:500, background:'var(--accent)', color:'white', border:'none', padding:'8px 18px', borderRadius:8, cursor:'pointer', fontFamily:'var(--sans)', whiteSpace:'nowrap' }}>
            Upgrade to Pro
          </button>
        </div>
      )}

      <div style={{ fontSize:12, color:'var(--ink3)', marginTop:'0.75rem', paddingTop:'0.75rem', borderTop:'1px solid var(--border2)' }}>
        <strong style={{ color:'var(--ink2)' }}>{data.totalWeak} weak bullet{data.totalWeak !== 1 ? 's' : ''}</strong> identified
      </div>
    </div>
  );
}

function RewriteCard({ rw }) {
  const [copied, setCopied] = useState(false);

  async function copyImproved() {
    await navigator.clipboard.writeText(rw.rewritten);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div style={{ background:'var(--bg)', border:'1px solid var(--border2)', borderRadius:'var(--radius)', padding:'1.25rem', marginBottom:'1rem' }}>
      <div style={{ fontSize:11, fontWeight:600, textTransform:'uppercase', letterSpacing:'0.06em', color:'var(--accent)', marginBottom:'0.85rem' }}>
        ✏️ Bullet Improvement #{rw.index}
      </div>
      <div style={{ background:'#fef2f0', borderLeft:'3px solid #d45a3f', borderRadius:'0 8px 8px 0', padding:'12px 16px', fontSize:13, color:'#8b3223', lineHeight:1.65 }}>
        <span style={{ fontSize:10, fontWeight:700, letterSpacing:'0.08em', textTransform:'uppercase', marginBottom:4, display:'block', color:'#c0392b' }}>Before</span>
        "{rw.original}"
      </div>
      <div style={{ display:'flex', alignItems:'center', justifyContent:'center', padding:'6px 0', color:'var(--ink3)', fontSize:16 }}>↓</div>
      <div style={{ background:'#edfaf3', borderLeft:'3px solid var(--accent)', borderRadius:'0 8px 8px 0', padding:'12px 16px', fontSize:13, color:'#0d5a44', lineHeight:1.65 }}>
        <span style={{ fontSize:10, fontWeight:700, letterSpacing:'0.08em', textTransform:'uppercase', marginBottom:4, display:'block', color:'var(--accent)' }}>After</span>
        "{rw.rewritten}"
      </div>
      <div style={{ display:'flex', justifyContent:'flex-end', marginTop:8 }}>
        <button onClick={copyImproved} style={{ fontSize:11, color:'var(--ink3)', background:'none', border:'1px solid var(--border)', padding:'4px 10px', borderRadius:6, cursor:'pointer', fontFamily:'var(--sans)' }}>
          {copied ? 'Copied ✓' : 'Copy improved bullet'}
        </button>
      </div>
    </div>
  );
}
