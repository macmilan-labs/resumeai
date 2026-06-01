import React, { useState, useRef } from 'react';
import { getKeywords } from '../api.js';
import { useNavigate } from 'react-router-dom';

const COOLDOWN = 2500;

const SAMPLE_RESUME = `Priya Sharma | Mumbai\nSoftware Engineer — 3 years experience\nSKILLS: JavaScript, React.js, Node.js, MySQL, REST APIs, Jest`;
const SAMPLE_JD = `Software Engineer needed.\nRequirements:\n• JavaScript and React\n• Node.js and REST APIs\n• AWS or GCP\n• Docker\n• TypeScript`;

export default function KeywordsForm({ remaining, plan, isProUser, onResult, showToast, consumeUsage, userToken }) {
  const navigate = useNavigate();
  const [resume,  setResume]  = useState('');
  const [jd,      setJd]      = useState('');
  const [loading, setLoading] = useState(false);
  const lastRun = useRef(0);
  const running = useRef(false);

  function fillSample() {
    setResume(SAMPLE_RESUME);
    setJd(SAMPLE_JD);
    showToast('Example data loaded');
  }

  async function handleSubmit() {
    if (!resume.trim() || !jd.trim()) { showToast('Provide both resume and JD'); return; }
    if (plan !== 'pro' && remaining <= 0 && !userToken) { navigate('/pricing'); return; }
    if (running.current) return;
    if (Date.now() - lastRun.current < COOLDOWN) { showToast('Wait a second...'); return; }

    running.current = true;
    lastRun.current = Date.now();
    setLoading(true);
    try {
      const data = await getKeywords(resume, jd);
      onResult(data);
      consumeUsage();
      showToast('Analysis complete - see below');
    } catch (err) {
      showToast('Failed — ' + err.message);
    } finally {
      setLoading(false);
      running.current = false;
    }
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center justify-between p-6 bg-slate-50 border border-slate-100 rounded-2xl shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
          <span className="text-[11px] font-black text-slate-500 uppercase tracking-widest">
            Credits Remaining: <span className="text-blue-600 ml-1">{isProUser ? 'Unlimited ∞' : `${remaining} / 5`}</span>
          </span>
        </div>
        <button onClick={() => navigate('/pricing')} className="text-[10px] font-black text-orange-600 uppercase tracking-[0.2em] border-b border-orange-200">
          Get Unlimited
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        <div>
           <div className="flex items-center justify-between mb-4">
            <label className="text-xs font-black text-slate-900 uppercase tracking-widest flex items-center gap-2">
               <span className="material-icons-outlined text-sm text-blue-600">travel_explore</span> 
               1. Scrape Job Profile
            </label>
            <button onClick={fillSample} className="text-[10px] font-bold text-blue-600 hover:bg-blue-50 px-3 py-1.5 rounded-lg transition-all">Use Sample</button>
          </div>
          <textarea 
            value={jd} 
            onChange={e => setJd(e.target.value)} 
            placeholder="Paste the target job description here..."
            className="w-full min-h-[300px] p-8 text-sm text-slate-700 bg-slate-50/30 border border-slate-200 rounded-[2.5rem] font-medium focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all outline-none leading-relaxed placeholder:text-slate-300 shadow-sm"
          />
        </div>
        <div>
          <label className="text-xs font-black text-slate-900 uppercase tracking-widest flex items-center gap-2 mb-4">
            <span className="material-icons-outlined text-sm text-blue-600">history_edu</span>
            2. Your Resume Draft
          </label>
          <textarea 
            value={resume} 
            onChange={e => setResume(e.target.value)} 
            placeholder="Paste your resume content to find gaps..."
            className="w-full min-h-[300px] p-8 text-sm text-slate-700 bg-slate-50/30 border border-slate-200 rounded-[2.5rem] font-medium focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all outline-none leading-relaxed placeholder:text-slate-300 shadow-sm"
          />
        </div>
      </div>

      <button 
        onClick={handleSubmit} 
        disabled={loading} 
        className="w-full px-10 py-5 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 text-white font-black text-xs uppercase tracking-[0.2em] rounded-[2.5rem] shadow-2xl shadow-blue-200 hover:shadow-blue-300 transition-all duration-300 flex items-center justify-center gap-4 group active:scale-95"
      >
        {loading ? (
          <>
            <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
            Calculating Gaps...
          </>
        ) : (
          <>
            Run Keyword Optimization
            <span className="material-icons-outlined group-hover:translate-x-1 transition-transform">find_replace</span>
          </>
        )}
      </button>
    </div>
  );
}
