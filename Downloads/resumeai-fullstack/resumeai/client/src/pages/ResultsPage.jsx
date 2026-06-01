import React from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { useResults } from '../context/ResultContext.jsx';

const RecommendationCards = ({ rewrites }) => (
  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
    {rewrites.slice(0, 3).map((item, i) => (
      <div key={i} className="group p-10 bg-white border border-slate-100 rounded-[2.5rem] hover:border-blue-100 hover:shadow-2xl hover:shadow-blue-500/5 transition-all duration-500 relative overflow-hidden">
        <div className="flex items-center gap-4 mb-8">
          <div className="w-12 h-12 bg-slate-50 text-slate-400 rounded-2xl flex items-center justify-center font-black group-hover:bg-blue-600 group-hover:text-white transition-all duration-300">
            {i + 1}
          </div>
          <span className="material-icons-outlined text-slate-200 group-hover:text-blue-600 transition-colors">auto_fix_high</span>
        </div>
        <h4 className="text-xl font-black text-slate-900 mb-4">Optimization Tip</h4>
        <p className="text-sm text-slate-500 leading-relaxed italic mb-6">"{item.original}"</p>
        <div className="p-4 bg-orange-50 border border-orange-100 rounded-2xl text-[11px] font-bold text-orange-600 uppercase tracking-widest">
           Priority Rewrite Required
        </div>
        <div className="absolute top-0 right-0 p-6 opacity-[0.03] group-hover:opacity-[0.07] transition-opacity">
           <span className="material-icons-outlined text-8xl">lightbulb</span>
        </div>
      </div>
    ))}
  </div>
);

const ProgressCard = ({ label, value, status, icon }) => (
  <div className="p-10 bg-white border border-slate-100 rounded-[3rem] flex flex-col justify-between h-full shadow-sm hover:shadow-md transition-shadow">
    <div>
      <div className="flex justify-between items-start mb-6">
        <div className="text-[10px] font-black tracking-[0.2em] text-blue-600 uppercase">{label}</div>
        <span className="material-icons-outlined text-slate-200">{icon}</span>
      </div>
      <h3 className="text-2xl font-black text-slate-900 mb-2">{label}</h3>
    </div>
    <div className="mt-10">
      <div className="flex justify-between items-end mb-5">
        <div className="text-5xl font-black text-slate-900 tracking-tighter">{value}%</div>
        <div className="px-3 py-1 bg-slate-50 text-slate-400 text-[10px] font-black uppercase rounded-md mb-2 tracking-widest">
          {status}
        </div>
      </div>
      <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
        <div 
          className="h-full bg-blue-600 rounded-full shadow-lg shadow-blue-200 transition-all duration-1000 ease-out" 
          style={{ width: `${value}%` }}
        ></div>
      </div>
    </div>
  </div>
);

export default function ResultsPage({ isProUser }) {
  const { atsResult, rewriteData } = useResults();
  const navigate = useNavigate();

  if (!atsResult) return <Navigate to="/analyze" />;

  const score = atsResult.score || 0;
  const matchedSkills = (atsResult.matched_skills || []).map(s => typeof s === 'object' ? s.skill : s).filter(Boolean);
  const missingSkills = (atsResult.missing_skills || []).map(s => typeof s === 'object' ? s.skill : s).filter(Boolean);
  const breakdown = atsResult.score_breakdown || {};

  const getStatus = (val) => {
    if (val >= 80) return 'Exceptional';
    if (val >= 60) return 'Strong';
    if (val >= 40) return 'Moderate';
    return 'Weak';
  };

  const getHeadline = (val) => {
     if (val >= 90) return { prefix: 'is ', t: 'Highly Competitive.', c: 'text-green-600' };
     if (val >= 75) return { prefix: 'is a ', t: 'Strong Match.', c: 'text-blue-600' };
     if (val >= 60) return { prefix: 'needs ', t: 'Deep Optimization.', c: 'text-orange-500' };
     return { prefix: 'has ', t: 'Serious Gaps.', c: 'text-red-600' };
  };

  const headline = getHeadline(score);

  return (
    <div className="min-h-screen bg-white font-inter selection:bg-blue-100 selection:text-blue-600">
      {/* Hero Analysis Section */}
      <section className="pt-20 pb-24 px-8 max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row gap-20 items-center">
          {/* Centered Score Circle (No Tilt) */}
          <div className="relative w-80 h-80 flex-shrink-0">
            <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="44" fill="none" stroke="#F1F5F9" strokeWidth="8" />
              <circle 
                cx="50" cy="50" r="44" fill="none" stroke="#2563EB" 
                strokeWidth="8" strokeDasharray="276.46" 
                strokeDashoffset={276.46 - (276.46 * score) / 100}
                strokeLinecap="round" 
                className="drop-shadow-[0_0_12px_rgba(37,99,235,0.25)] transition-all duration-1500 ease-out"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <div className="text-8xl font-black text-slate-900 tracking-tighter leading-none hover:scale-110 transition-transform cursor-default">{score}</div>
              <div className="text-xs font-black text-slate-300 mt-3 uppercase tracking-[0.3em]">Match Score</div>
            </div>
          </div>

          {/* Verdict Info */}
          <div className="flex-1 text-center lg:text-left animate-in fade-in slide-in-from-right-4 duration-1000">
            <div className="inline-flex items-center gap-3 px-5 py-2 bg-blue-50 text-blue-600 text-[10px] font-black uppercase tracking-[0.2em] rounded-full mb-10 border border-blue-100">
              <span className="material-icons-outlined text-sm">verified_user</span>
              Algorithm Verdict: {atsResult.verdict || 'Processed'}
            </div>
            <h1 className="text-6xl md:text-7xl font-black text-slate-900 mb-8 leading-[0.9] tracking-tight">
              Your Resume <br />
              <span className="text-slate-400 font-normal">{headline.prefix}</span>
              <span className={headline.c}>{headline.t}</span>
            </h1>
            <p className="text-lg text-slate-500 leading-relaxed font-medium mb-12 max-w-2xl">
              {atsResult.verdict_long || 'Our AI has mapped your qualifications against the provided job description. Follow the prioritized actions below to secure the callback.'}
            </p>
            <div className="flex flex-col sm:flex-row gap-5 justify-center lg:justify-start">
              <button 
                onClick={() => navigate('/analyze')}
                className="px-10 py-5 bg-blue-600 hover:bg-blue-700 text-white font-black text-xs uppercase tracking-[0.2em] rounded-2xl shadow-2xl shadow-blue-200 transition-all active:scale-95 flex items-center justify-center gap-3"
              >
                <span className="material-icons-outlined text-lg">add_circle</span>
                Analyze Another
              </button>
              <button 
                onClick={() => window.print()}
                className="px-10 py-5 bg-white border border-slate-200 text-slate-600 font-black text-xs uppercase tracking-[0.2em] rounded-2xl hover:bg-slate-50 transition-all active:scale-95 flex items-center justify-center gap-3"
              >
                <span className="material-icons-outlined text-lg">picture_as_pdf</span>
                Export Report
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Skills Analysis Matrix */}
      <section className="bg-slate-50/50 py-32 border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-24">
            {/* Matched Skills */}
            <div className="p-14 bg-white border border-slate-100 rounded-[3.5rem] shadow-sm hover:shadow-xl transition-all duration-500 group">
              <div className="flex items-center justify-between mb-12">
                 <h3 className="text-2xl font-black text-slate-900">Skill Alignment</h3>
                 <span className="px-4 py-1.5 bg-green-50 text-green-600 text-[10px] font-black uppercase tracking-widest rounded-xl border border-green-100">Matched Content</span>
              </div>
              <div className="flex flex-wrap gap-4">
                {matchedSkills.length > 0 ? matchedSkills.map((skill) => (
                  <div key={skill} className="px-5 py-3 bg-blue-50/50 text-blue-600 font-bold text-sm rounded-2xl border border-blue-100/50 flex items-center gap-3 group-hover:bg-blue-600 group-hover:text-white transition-all">
                    <span className="material-icons-outlined text-sm">check_circle</span>
                    {skill}
                  </div>
                )) : (
                  <p className="text-sm text-slate-400 font-medium italic">No major keyword matches identified.</p>
                )}
              </div>
            </div>

            {/* Missing Skills */}
            <div className="p-14 bg-white border border-slate-100 rounded-[3.5rem] shadow-sm hover:shadow-xl transition-all duration-500 group">
              <div className="flex items-center justify-between mb-12">
                 <h3 className="text-2xl font-black text-slate-900">Critical Gaps</h3>
                 <span className="px-4 py-1.5 bg-red-50 text-red-600 text-[10px] font-black uppercase tracking-widest rounded-xl border border-red-100">Action Required</span>
              </div>
              <div className="flex flex-wrap gap-4">
                {missingSkills.length > 0 ? missingSkills.map((skill) => (
                  <div key={skill} className="px-5 py-3 bg-red-50/50 text-red-600 font-bold text-sm rounded-2xl border border-red-100 flex items-center gap-3 group-hover:bg-red-600 group-hover:text-white transition-all">
                    <span className="material-icons-outlined text-sm">report_problem</span>
                    {skill}
                  </div>
                )) : (
                  <p className="text-sm text-slate-400 font-medium italic">No critical missing skills found.</p>
                )}
              </div>
            </div>
          </div>

          {/* Actionable Intelligence Pass */}
          <div className="mb-32 grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Verdict Card */}
            <div className="lg:col-span-2 p-12 bg-white border border-slate-100 rounded-[3rem] shadow-sm">
               <div className="flex items-center gap-4 mb-8">
                  <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center">
                    <span className="material-icons-outlined">psychology</span>
                  </div>
                  <h3 className="text-2xl font-black text-slate-900">Resume Verdict</h3>
               </div>
               <div className="space-y-6">
                  <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
                    <div className="text-[10px] font-black text-blue-600 uppercase tracking-widest mb-2">Core Strength</div>
                    <p className="text-sm text-slate-600 font-medium">
                      {matchedSkills.length > 5 
                        ? "Your resume demonstrates strong technical alignment with the core requirements of this role."
                        : "You have a solid foundation in some key areas, but the direct keyword overlap is currently low."}
                    </p>
                  </div>
                  <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
                    <div className="text-[10px] font-black text-orange-600 uppercase tracking-widest mb-2">Main Weakness</div>
                    <p className="text-sm text-slate-600 font-medium">
                      {missingSkills.length > 3 
                        ? `Critical gaps in ${missingSkills.slice(0, 2).join(' and ')} are significantly dragging down your score.`
                        : "Your resume lacks quantifiable metrics in some experience descriptions."}
                    </p>
                  </div>
               </div>
            </div>

            {/* Readability & Match Chance */}
            <div className="space-y-8">
              {/* Recruiter Check Card */}
              <div className="p-10 bg-slate-900 rounded-[3rem] text-white overflow-hidden relative border border-white/5 border-l-[8px] border-l-blue-600 shadow-2xl group">
                {/* High-Intensity Aesthetic Glows */}
                <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
                   <div className="absolute top-[-20%] right-[-10%] w-[50%] h-[60%] bg-blue-600/20 rounded-full blur-3xl"></div>
                   <div className="absolute bottom-[-20%] left-[-10%] w-[40%] h-[60%] bg-white/5 rounded-full blur-3xl"></div>
                </div>

                <div className="relative z-10">
                  <div className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-4">Recruiter Check</div>
                  <h4 className="text-xl font-black mb-2">Readability: {score > 70 ? 'High' : 'Medium'}</h4>
                  <p className="text-slate-400 text-sm font-medium leading-relaxed">
                    Visual hierarchy is {score > 70 ? 'clean' : 'developing'}. Focus on bullet point density.
                  </p>
                </div>
                <span className="material-icons-outlined absolute -bottom-4 -right-4 text-9xl text-white/5 transition-transform group-hover:scale-110 duration-700">visibility</span>
              </div>
              
              {/* Job Match Summary Card */}
              <div className="p-10 bg-slate-900 rounded-[3rem] text-white overflow-hidden relative border border-white/5 border-l-[8px] border-l-blue-600 shadow-2xl group">
                {/* High-Intensity Aesthetic Glows */}
                <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
                   <div className="absolute top-[-40%] left-[-10%] w-[50%] h-[80%] bg-blue-600/20 rounded-full blur-3xl"></div>
                   <div className="absolute bottom-[-20%] right-[-10%] w-[40%] h-[60%] bg-white/5 rounded-full blur-3xl"></div>
                </div>

                <div className="relative z-10">
                  <div className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-4">Job Match Summary</div>
                  <div className="text-4xl font-black mb-4 tracking-tighter">{score > 75 ? 'Strong' : score > 50 ? 'Moderate' : 'Low'} Chance</div>
                  <p className="text-slate-400 text-sm font-medium leading-relaxed">Likelihood of passing the initial ATS filter based on current content alignment.</p>
                </div>
                <span className="material-icons-outlined absolute -bottom-4 -right-4 text-9xl text-white/5 transition-transform group-hover:rotate-12 duration-700">track_changes</span>
              </div>
            </div>
          </div>

          {/* Top 3 Priority Fixes */}
          <div className="mb-32">
             <div className="flex items-center gap-4 mb-12 px-2">
                <div className="w-1.5 h-10 bg-orange-500 rounded-full" />
                <h3 className="text-4xl font-black text-slate-900 tracking-tight">Top 3 Priority Fixes</h3>
             </div>
             <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {[
                  { t: `Integrate ${missingSkills[0] || 'Keywords'}`, d: `Missing ${missingSkills[0] || 'critical'} keywords are the #1 reason for rejection.`, icon: 'key' },
                  { t: 'Add Achievement Stats', d: 'Recruiters look for numbers. Add 3-5 quantifiable metrics.', icon: 'trending_up' },
                  { t: 'Optimize Formatting', d: 'Ensure your section headers are standard and ATS-readable.', icon: 'format_paint' }
                ].map((fix, i) => (
                  <div key={i} className="p-10 bg-white border border-slate-100 rounded-[2.5rem] shadow-sm flex flex-col items-center text-center">
                    <div className="w-14 h-14 bg-orange-50 text-orange-600 rounded-full flex items-center justify-center mb-6">
                      <span className="material-icons-outlined">{fix.icon}</span>
                    </div>
                    <h5 className="text-lg font-black text-slate-900 mb-2">{fix.t}</h5>
                    <p className="text-slate-500 text-sm font-medium">{fix.d}</p>
                  </div>
                ))}
             </div>
          </div>

          {/* AI Bullet Rewrites Section */}
          <div className="mb-32 p-12 bg-slate-50 border border-slate-200 rounded-[3.5rem] relative overflow-hidden group">
             {/* Subtle Glow for Pro */}
             {isProUser && (
               <div className="absolute top-0 right-0 w-full h-full pointer-events-none overflow-hidden">
                  <div className="absolute top-[-20%] right-[-10%] w-[40%] h-[50%] bg-blue-600/5 rounded-full blur-3xl"></div>
               </div>
             )}

             <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-8 mb-12">
                <div className="text-center md:text-left">
                   <h3 className="text-3xl font-black text-slate-900 tracking-tight">
                     {isProUser ? "AI Optimization: Bullet Rewrites" : "AI Bullet Rewrite Preview"}
                   </h3>
                   <p className="text-slate-500 font-medium max-w-xl">
                     {isProUser 
                        ? "High-impact, metric-driven phrasing improvements generated specifically for your resume." 
                        : "One example of how we improve your phrasing to target corporate algorithms."}
                   </p>
                </div>
                <div className={`px-5 py-2 rounded-full text-xs font-black uppercase tracking-widest ${isProUser ? 'bg-slate-900 text-blue-400' : 'bg-blue-600 text-white'}`}>
                   {isProUser ? 'PRO INSIGHT' : 'Premium PREVIEW'}
                </div>
             </div>

             <div className="space-y-8">
               {(isProUser ? (atsResult.rewritten_bullets || []) : (atsResult.rewritten_bullets?.slice(0, 1) || [])).map((item, idx) => (
                 <div key={idx} className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-in fade-in slide-in-from-bottom-4" style={{ animationDelay: `${idx * 150}ms` }}>
                    <div className="p-8 bg-white border border-slate-200 rounded-3xl shadow-sm hover:shadow-md transition-shadow">
                       <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Before (Your Version)</div>
                       <p className="text-slate-600 text-sm font-medium italic leading-relaxed">
                         "{item.before || "Founding a startup and managing operations."}"
                       </p>
                    </div>
                    <div className="p-8 bg-white border-2 border-blue-600 rounded-3xl relative shadow-xl shadow-blue-500/5 hover:border-blue-500 transition-colors">
                       <div className="text-[10px] font-black text-blue-600 uppercase tracking-widest mb-4">After (Optimized)</div>
                       <p className="text-slate-900 text-sm font-bold leading-relaxed">
                         "{item.after || "Orchestrated end-to-end operations for an early-stage startup, achieving a 40% growth in efficiency through automated workflows."}"
                       </p>
                       <span className="material-icons-outlined absolute top-6 right-6 text-blue-600">stars</span>
                    </div>
                 </div>
               ))}

               {(!atsResult.rewritten_bullets || atsResult.rewritten_bullets.length === 0) && (
                 <p className="text-center text-slate-400 italic py-10">No specific bullet rewrites identified for this section.</p>
               )}
             </div>
          </div>

          {/* Top Actions Section */}
          {rewriteData && rewriteData.rewrites?.length > 0 && (
            <div className="animate-in fade-in slide-in-from-bottom-6 duration-1000">
               <div className="flex items-center gap-4 mb-12 px-2">
                  <div className="w-1.5 h-10 bg-orange-500 rounded-full" />
                  <h3 className="text-4xl font-black text-slate-900 tracking-tight">Full Improvement List</h3>
               </div>
               <RecommendationCards rewrites={rewriteData.rewrites} />
            </div>
          )}

          {/* Breakdown Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-24">
            <ProgressCard label="Skill Coverage" icon="hub" value={breakdown.critical_match || 0} status={getStatus(breakdown.critical_match)} />
            <ProgressCard label="Experience Depth" icon="history_edu" value={breakdown.experience_depth || 0} status={getStatus(breakdown.experience_depth)} />
            <ProgressCard label="Keyword Relevance" icon="radar" value={breakdown.nice_to_have_match || 0} status={getStatus(breakdown.nice_to_have_match)} />
          </div>

          {/* Pro Upsell Banner */}
          {!isProUser && (
            <div 
              onClick={() => navigate('/pricing')}
              className="group p-1 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-[3.5rem] shadow-2xl shadow-blue-400/30 overflow-hidden cursor-pointer active:scale-[0.99] transition-all"
            >
              <div className="bg-slate-900/40 backdrop-blur-2xl p-16 flex flex-col lg:flex-row justify-between items-center gap-12 border border-white/10 rounded-[3.4rem]">
                <div className="text-center lg:text-left">
                  <h4 className="text-4xl md:text-5xl font-black text-white mb-4 tracking-tighter">Accelerate Your Search.</h4>
                  <p className="text-blue-100 text-lg font-medium opacity-80 max-w-xl">
                    Unlock unlimited analyses, semantic career mapping, and auto-generated cover letters for every application.
                  </p>
                </div>
                <button className="px-12 py-6 bg-white text-blue-600 font-black text-xs uppercase tracking-[0.2em] rounded-2xl shadow-xl hover:bg-slate-50 transition-all active:scale-95 whitespace-nowrap">
                  Get Lifetime Pro
                </button>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
