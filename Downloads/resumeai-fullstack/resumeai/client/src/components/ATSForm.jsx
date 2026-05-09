import React, { useState, useRef, useEffect } from 'react';
import { analyzeResume } from '../api.js';
import { useNavigate } from 'react-router-dom';
import { useResults } from '../context/ResultContext.jsx';

const SAMPLE = {
  resume: `Priya Sharma | priya.sharma@email.com | Mumbai\nSoftware Engineer — 3 years experience\n\nEXPERIENCE\nJunior Software Engineer — TechCorp India (2021–present)\n• Built REST APIs using Node.js and Express serving 50k daily users\n• Developed React.js dashboards for internal analytics tools\n• Wrote unit tests with Jest, maintained 85% code coverage\n• Collaborated using Agile/Scrum methodology\n\nSKILLS\nJavaScript, React.js, Node.js, HTML/CSS, Git, MySQL, REST APIs, Jest\n\nEDUCATION\nB.E. Computer Science — Mumbai University (2021)`,
  jd: `We are looking for a Software Engineer to join our product team.\n\nRequirements:\n• 2+ years experience in JavaScript and React\n• Strong knowledge of Node.js and REST API development\n• Experience with AWS or GCP cloud platforms\n• Familiarity with CI/CD pipelines and Docker\n• Good understanding of SQL and NoSQL databases\n• Agile/Scrum team experience\n\nNice to have:\n• TypeScript experience\n• Redis or caching experience`,
};

const COOLDOWN = 2500;

export default function ATSForm({ remaining, plan, isProUser, showToast, userToken, autoFillSample }) {
  const [resume,  setResume]  = useState('');
  const [jd,      setJd]      = useState('');
  const [loading, setLoading] = useState(false);
  const lastRun = useRef(0);
  const running = useRef(false);
  const navigate = useNavigate();
  const { setAnalysisResult } = useResults();
  const hasAutoFilled = useRef(false);

  useEffect(() => {
    if (autoFillSample && !hasAutoFilled.current) {
      fillSample();
      hasAutoFilled.current = true;
    }
  }, [autoFillSample]);

  function fillSample() {
    setResume(SAMPLE.resume);
    setJd(SAMPLE.jd);
    showToast('Example data loaded');
  }

  function handleClear() {
    setResume('');
    setJd('');
    showToast('Inputs cleared');
  }

  async function handleSubmit() {
    if (!resume.trim() || !jd.trim()) { 
      showToast('Please provide both resume and job description'); 
      return; 
    }
    if (plan !== 'pro' && remaining <= 0 && !userToken) { 
      navigate('/pricing'); 
      return; 
    }
    if (running.current) return;
    if (Date.now() - lastRun.current < COOLDOWN) { 
      showToast('Wait a second...'); 
      return; 
    }

    running.current = true;
    lastRun.current = Date.now();
    setLoading(true);

    try {
      const result = await analyzeResume(resume, jd);
      // Build basic rewrite data from result
      const rawRewrites = result.rewritten_bullets || [];
      const rewrites = rawRewrites.slice(0, isProUser ? 3 : 1).map((s, i) => ({
        index: i + 1,
        original: s.before || s,
        rewritten: s.after || s,
      }));
      
      // If no rewritten bullets, but we have actions, use those
      if (rewrites.length === 0 && result.top_3_actions) {
        result.top_3_actions.slice(0, 3).forEach((a, i) => {
          rewrites.push({ index: i + 1, original: a, rewritten: a });
        });
      }

      setAnalysisResult(result, { rewrites, totalWeak: (result.rewritten_bullets?.length || result.top_3_actions?.length || 0) });
      navigate('/results');
    } catch (err) {
      console.error(err);
      showToast('Analysis failed — ' + err.message);
    } finally {
      setLoading(false);
      running.current = false;
    }
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Usage Indicator */}
      <div className="flex items-center justify-between p-6 bg-slate-50 border border-slate-100 rounded-2xl shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
          <span className="text-[11px] font-black text-slate-500 uppercase tracking-widest">
            Credits Remaining: <span className="text-blue-600 ml-1">{isProUser ? 'Unlimited ∞' : `${remaining} / 5`}</span>
          </span>
        </div>
        {!isProUser && (
          <button onClick={() => navigate('/pricing')} className="text-[10px] font-black text-orange-600 uppercase tracking-[0.2em] border-b border-orange-200 hover:border-orange-500 transition-all">
            Get Unlimited Access
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Resume Input */}
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between mb-4">
            <label className="text-xs font-black text-slate-900 uppercase tracking-widest flex items-center gap-2">
               <span className="material-icons-outlined text-sm text-blue-600">article</span> 
               1. Paste Resume
            </label>
            <div className="flex gap-4">
              <button 
                onClick={fillSample} 
                className="text-[10px] font-bold text-blue-600 hover:bg-blue-50 px-3 py-1.5 rounded-lg transition-all"
              >
                Use Example
              </button>
            </div>
          </div>
          <textarea 
            value={resume} 
            onChange={e => setResume(e.target.value)} 
            placeholder="Experience: Software Engineer at... Skills: React, Node.js..."
            className="flex-1 w-full min-h-[300px] p-8 text-sm text-slate-700 bg-slate-50/30 border border-slate-200 rounded-[2.5rem] font-medium focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all outline-none leading-relaxed placeholder:text-slate-300 shadow-sm"
          />
        </div>

        {/* JD Input */}
        <div className="flex flex-col h-full">
          <label className="text-xs font-black text-slate-900 uppercase tracking-widest flex items-center gap-2 mb-4">
            <span className="material-icons-outlined text-sm text-blue-600">work_outline</span>
            2. Job Description
          </label>
          <textarea 
            value={jd} 
            onChange={e => setJd(e.target.value)} 
            placeholder="Role Requirements: • 2+ years experience... • Strong proficiency in..."
            className="flex-1 w-full min-h-[300px] p-8 text-sm text-slate-700 bg-slate-50/30 border border-slate-200 rounded-[2.5rem] font-medium focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all outline-none leading-relaxed placeholder:text-slate-300 shadow-sm"
          />
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4">
        <button 
          onClick={handleClear}
          className="px-10 py-5 bg-white border border-slate-200 text-slate-400 hover:text-red-500 hover:border-red-100 hover:bg-red-50/50 font-black text-xs uppercase tracking-widest rounded-[2.5rem] transition-all active:scale-95"
        >
          Clear All
        </button>
        <button 
          onClick={handleSubmit} 
          disabled={loading} 
          className="flex-1 px-10 py-5 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 text-white font-black text-xs uppercase tracking-[0.2em] rounded-[2.5rem] shadow-2xl shadow-blue-200 transition-all active:scale-95 flex items-center justify-center gap-4 group"
        >
          {loading ? (
            <>
              <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
              Processing Data...
            </>
          ) : (
            <>
              Analyze Candidate Match
              <span className="material-icons-outlined group-hover:translate-x-1 transition-transform">rocket_launch</span>
            </>
          )}
        </button>
      </div>

      <p className="text-center text-[10px] text-slate-300 font-bold uppercase tracking-widest">
        Secure processing via encrypted industry-standard algorithms
      </p>
    </div>
  );
}
