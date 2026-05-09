import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import ATSForm       from '../components/ATSForm.jsx';
import CoverLetterForm from '../components/CoverLetterForm.jsx';
import KeywordsForm   from '../components/KeywordsForm.jsx';

export default function AnalyzePage({ remaining, statusPlan, isProUser, consumeUsage, showToast, userToken, setIsProUser }) {
  const [searchParams] = useSearchParams();
  const autoFillSample = searchParams.get('sample') === 'true';

  const [activeTab, setActiveTab] = useState('score');
  const [coverLetter, setCoverLetter] = useState('');
  const [kwResult,    setKwResult]    = useState(null);

  function handleCoverLetterResult(result) {
    if (result.plan) {
      setIsProUser(result.plan);
    }
    setCoverLetter(result.cover_letter || result);
    consumeUsage();
  }

  function handleKeywordsResult(result) {
    if (result.plan) {
      setIsProUser(result.plan);
    }
    setKwResult(result);
    consumeUsage();
  }

  const tabs = [
    { id: 'score',    label: 'ATS Score Analysis', icon: 'assessment' },
    { id: 'cover',    label: 'AI Cover Letter',    icon: 'description' },
    { id: 'keywords', label: 'Keyword Gap Analysis', icon: 'manage_search' },
  ];

  return (
    <div className="min-h-screen bg-slate-50/50 py-20 px-6">
      <div id="tool-section" className="max-w-5xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-16 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div className="inline-flex items-center gap-2 px-3 py-1 mb-6 text-[10px] font-black tracking-[0.2em] text-orange-600 uppercase bg-orange-50 rounded-md border border-orange-100">
            <span className="material-icons-outlined text-xs">auto_awesome</span>
            AI-Powered Optimizer
          </div>
          <h1 className="text-5xl font-black text-slate-900 tracking-tight mb-4">Optimize your application</h1>
          <p className="text-slate-500 font-medium max-w-xl mx-auto leading-relaxed">
            Upload your resume and the target job description to bridge the qualification gap with 98% algorithm accuracy.
          </p>
        </div>

        {/* Workspace Card */}
        <div className="bg-white border border-slate-200 rounded-[3rem] overflow-hidden shadow-2xl shadow-blue-900/5 min-h-[600px] flex flex-col">
          {/* Enhanced Tabs - No BG to fix corner bleed */}
          <div className="flex border-b border-slate-100 bg-white px-8 pt-8 pb-2 gap-4">
            {tabs.map(t => (
              <button
                key={t.id}
                onClick={() => setActiveTab(t.id)}
                className={`flex-1 flex items-center justify-center gap-3 py-5 rounded-[1.5rem] transition-all duration-300 font-black text-xs uppercase tracking-widest ${
                  activeTab === t.id 
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-200' 
                    : 'bg-slate-50 text-slate-400 hover:text-slate-600 hover:bg-slate-100'
                }`}
              >
                <span className="material-icons-outlined text-lg">{t.icon}</span>
                {t.label}
              </button>
            ))}
          </div>

          {/* Form Content */}
          <div className="flex-1 p-8 md:p-14">
            {activeTab === 'score' && (
              <ATSForm
                remaining={remaining}
                plan={statusPlan}
                isProUser={isProUser}
                showToast={showToast}
                userToken={userToken}
                autoFillSample={autoFillSample}
              />
            )}
            {activeTab === 'cover' && (
              <CoverLetterForm
                remaining={remaining}
                plan={statusPlan}
                isProUser={isProUser}
                onResult={handleCoverLetterResult}
                showToast={showToast}
                consumeUsage={consumeUsage}
                userToken={userToken}
              />
            )}
            {activeTab === 'keywords' && (
              <KeywordsForm
                remaining={remaining}
                plan={statusPlan}
                isProUser={isProUser}
                onResult={handleKeywordsResult}
                showToast={showToast}
                consumeUsage={consumeUsage}
                userToken={userToken}
              />
            )}
          </div>
        </div>

        {/* Contextual Results - Cover Letter / Keywords (if not routing away) */}
        {activeTab === 'cover' && coverLetter && (
          <div className="mt-12 bg-white border border-slate-200 rounded-[2.5rem] p-10 shadow-xl animate-in fade-in slide-in-from-bottom-6 duration-700">
            <div className="flex justify-between items-center mb-8 pb-6 border-b border-slate-50">
               <div>
                  <h4 className="text-xl font-black text-slate-900">Your Generated Cover Letter</h4>
                  <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mt-1">Ready for submission</p>
               </div>
               <button 
                 onClick={() => navigator.clipboard.writeText(coverLetter).then(() => showToast('Copied to clipboard'))} 
                 className="flex items-center gap-3 text-xs font-black text-blue-600 bg-blue-50/50 hover:bg-blue-600 hover:text-white px-6 py-3 rounded-xl transition-all uppercase tracking-widest active:scale-95"
               >
                 <span className="material-icons-outlined text-sm">content_copy</span> Copy to clipboard
               </button>
            </div>
            <div className="bg-slate-50/50 rounded-2xl p-8 border border-slate-100">
               <pre className="text-sm text-slate-700 leading-relaxed whitespace-pre-wrap font-inter font-medium">{coverLetter}</pre>
            </div>
          </div>
        )}

        {activeTab === 'keywords' && kwResult && (
          <div className="mt-12 bg-white border border-slate-200 rounded-[2.5rem] p-10 shadow-xl animate-in fade-in slide-in-from-bottom-6 duration-700">
            <h4 className="text-xl font-black text-slate-900 mb-8 px-2">Keyword Analysis Report</h4>
            <div className="grid gap-8 md:grid-cols-2">
              {kwResult.present?.length > 0 && (
                <div className="p-8 bg-green-50/30 rounded-[2rem] border border-green-100 shadow-sm">
                  <div className="flex items-center gap-3 text-green-700 font-black text-[10px] uppercase tracking-widest mb-6">
                    <span className="material-icons-outlined text-sm">check_circle</span> Optimized Keywords
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {kwResult.present.map(k => <span key={k} className="px-4 py-2 bg-white text-green-700 text-xs font-bold rounded-xl border border-green-200 shadow-xs">{k}</span>)}
                  </div>
                </div>
              )}
              {kwResult.critical?.length > 0 && (
                <div className="p-8 bg-red-50/30 rounded-[2rem] border border-red-100 shadow-sm">
                  <div className="flex items-center gap-3 text-red-700 font-black text-[10px] uppercase tracking-widest mb-6">
                    <span className="material-icons-outlined text-sm">error_outline</span> Missing (Immediate Priority)
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {kwResult.critical.map(k => <span key={k} className="px-4 py-2 bg-white text-red-700 text-xs font-bold rounded-xl border border-red-200 shadow-xs">{k}</span>)}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
        {/* ATS Explainer Section */}
        <div className="mt-16 bg-slate-900 rounded-[3rem] p-12 border border-white/5 border-l-[8px] border-l-blue-600 flex flex-col md:flex-row items-center gap-12 animate-in fade-in slide-in-from-bottom-8 duration-1000 shadow-2xl relative overflow-hidden">
           {/* High-Intensity Aesthetic Glows */}
           <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
              <div className="absolute top-[-20%] right-[-10%] w-[50%] h-[60%] bg-blue-600/20 rounded-full blur-3xl"></div>
              <div className="absolute bottom-[-20%] left-[-10%] w-[40%] h-[60%] bg-white/5 rounded-full blur-3xl"></div>
           </div>

           <div className="relative z-10 flex flex-col md:flex-row items-center gap-12">
             <div className="w-24 h-24 bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl flex items-center justify-center flex-shrink-0">
               <span className="material-icons-outlined text-4xl text-blue-400">help_outline</span>
             </div>
             <div>
                <h3 className="text-2xl font-black text-white mb-4 tracking-tight">What is ATS?</h3>
                <p className="text-slate-400 font-medium leading-relaxed">
                  Applicant Tracking Systems (ATS) are software used by over 95% of Fortune 500 companies to filter resumes based on keywords, formatting, and relevance before a human recruiter ever sees them. Our engine mimics these algorithms to ensure your resume passes the "digital gatekeeper."
                </p>
             </div>
           </div>
        </div>
      </div>
    </div>
  );
}
