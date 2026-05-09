import React, { useState } from 'react';
import ATSForm       from '../components/ATSForm.jsx';
import Results       from '../components/Results.jsx';
import RewriteSection from '../components/RewriteSection.jsx';
import CoverLetterForm from '../components/CoverLetterForm.jsx';
import KeywordsForm   from '../components/KeywordsForm.jsx';

// Stitch UI Components
const Hero = ({ setPage }) => (
  <header className="py-24 px-8 text-center max-w-4xl mx-auto">
    <div className="inline-block px-4 py-1.5 mb-6 text-xs font-bold tracking-widest text-[#2563EB] uppercase bg-blue-50 rounded-full">
      Free ATS checker for Indian job seekers
    </div>
    <h1 className="text-6xl md:text-7xl font-black text-gray-900 leading-[1.1] mb-8">
      Stop getting rejected by <span className="text-[#2563EB]">ATS filters.</span>
    </h1>
    <p className="text-xl text-gray-500 mb-12 max-w-2xl mx-auto leading-relaxed font-inter">
      Our precision AI analyzes your resume against 500+ corporate algorithms. Bridge the skill gap and secure more callbacks with data-driven curation.
    </p>
    <div className="flex flex-col sm:flex-row justify-center gap-4">
      <button 
        onClick={() => document.getElementById('tool-section')?.scrollIntoView({ behavior:'smooth' })}
        className="px-8 py-4 bg-[#F97316] hover:bg-[#EA580C] text-white font-bold rounded-xl shadow-lg shadow-orange-200 transition-all active:scale-95"
      >
        Check my resume free →
      </button>
      <button 
        onClick={() => setPage('pricing')}
        className="px-8 py-4 bg-white border border-gray-200 text-gray-700 font-bold rounded-xl hover:bg-gray-50 transition-all active:scale-95"
      >
        See Pricing
      </button>
    </div>
    <p className="mt-8 text-xs font-bold text-gray-400 uppercase tracking-widest">
      No sign-up · No credit card · 5 free analyses
    </p>
  </header>
);

const StatsSection = () => (
  <section className="py-20 bg-white border-y border-gray-100">
    <div className="max-w-7xl mx-auto px-8 grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
      <div>
        <div className="text-5xl font-black text-[#2563EB] mb-2 tracking-tighter">1.2M+</div>
        <div className="text-gray-400 text-sm font-bold uppercase tracking-widest">Resumes Analyzed</div>
      </div>
      <div>
        <div className="text-5xl font-black text-[#2563EB] mb-2 tracking-tighter">150K+</div>
        <div className="text-gray-400 text-sm font-bold uppercase tracking-widest">Active Users</div>
      </div>
      <div>
        <div className="text-5xl font-black text-[#2563EB] mb-2 tracking-tighter">85%</div>
        <div className="text-gray-400 text-sm font-bold uppercase tracking-widest">Higher Callback Rate</div>
      </div>
    </div>
  </section>
);

const FeatureCards = () => (
  <section className="py-24 max-w-7xl mx-auto px-8">
    <div className="text-center mb-16">
      <div className="inline-block px-3 py-1 mb-4 text-[10px] font-bold tracking-[0.2em] text-[#2563EB] uppercase bg-blue-50 rounded-md">
        Core Capabilities
      </div>
      <h2 className="text-4xl font-black text-gray-900 tracking-tight">Engineered for Results</h2>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      {[
        { title: 'ATS Score Analysis', icon: 'assessment', desc: 'Proprietary scoring model based on current ATS algorithms used by Fortune 500 companies.' },
        { title: 'Skill Gap Detection', icon: 'psychology', desc: 'Automated comparison against target job descriptions to identify missing technical and soft skills.' },
        { title: 'AI Suggestions', icon: 'auto_awesome', desc: 'Editorial-grade phrasing suggestions that emphasize impact and results over simple tasks.' }
      ].map((f, i) => (
        <div key={i} className="group p-10 bg-white border border-gray-100 rounded-3xl hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-300">
          <div className="w-14 h-14 bg-[#2563EB] text-white rounded-xl flex items-center justify-center mb-8 shadow-lg shadow-blue-200 group-hover:scale-110 transition-transform">
            <span className="material-icons-outlined text-3xl">{f.icon}</span>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-4">{f.title}</h3>
          <p className="text-gray-500 leading-relaxed mb-8">{f.desc}</p>
          <a href="#" className="text-[#2563EB] font-bold flex items-center gap-2 group-hover:translate-x-1 transition-transform">
            Learn more <span className="material-icons-outlined text-lg">arrow_forward</span>
          </a>
        </div>
      ))}
    </div>
  </section>
);

const CTASection = ({ setPage }) => (
  <section className="px-8 pb-24">
    <div className="max-w-7xl mx-auto bg-[#2563EB] rounded-[3rem] p-16 md:p-24 text-center relative overflow-hidden shadow-2xl shadow-blue-200">
      <div className="relative z-10">
        <h2 className="text-5xl md:text-6xl font-black text-white mb-8 tracking-tighter">Ready to bypass the digital gatekeepers?</h2>
        <p className="text-xl text-blue-100 mb-12 max-w-2xl mx-auto leading-relaxed">
          Join 150,000+ professionals who have transformed their career search with ResumeAI's precision analysis.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <button 
             onClick={() => document.getElementById('tool-section')?.scrollIntoView({ behavior:'smooth' })}
             className="px-10 py-5 bg-[#F97316] hover:bg-[#EA580C] text-white font-bold rounded-2xl shadow-xl transition-all active:scale-95"
          >
            Get Started for Free
          </button>
          <button 
             onClick={() => setPage('pricing')}
             className="px-10 py-5 bg-white/10 hover:bg-white/20 text-white border border-white/20 font-bold rounded-2xl transition-all backdrop-blur-md"
          >
            See Pro Plans
          </button>
        </div>
      </div>
      <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-[radial-gradient(circle,white_1px,transparent_1px)] bg-[size:32px_32px]"></div>
      </div>
    </div>
  </section>
);

export default function Home({ remaining, statusPlan, isProUser, consumeUsage, showToast, setPage, userToken, setIsProUser }) {
  const [activeTab, setActiveTab] = useState('score');
  const [atsResult, setAtsResult] = useState(null);
  const [rewriteData, setRewriteData] = useState(null);
  const [coverLetter, setCoverLetter] = useState('');
  const [kwResult,    setKwResult]    = useState(null);

  function handleATSResult(result, rewrites) {
    if (result.plan) {
       console.log(`[Home] Received plan from API (ATS): ${result.plan}`);
       setIsProUser(result.plan);
    }
    setAtsResult(result);
    setRewriteData(rewrites);
    consumeUsage();
  }

  function handleCoverLetterResult(result) {
    if (result.plan) {
      console.log(`[Home] Received plan from API (CoverLetter): ${result.plan}`);
      setIsProUser(result.plan);
    }
    setCoverLetter(result.cover_letter || result);
    consumeUsage();
  }

  function handleKeywordsResult(result) {
    if (result.plan) {
      console.log(`[Home] Received plan from API (Keywords): ${result.plan}`);
      setIsProUser(result.plan);
    }
    setKwResult(result);
    consumeUsage();
  }

  const tabs = [
    { id: 'score',    label: 'ATS Score Analysis' },
    { id: 'cover',    label: 'AI Cover Letter' },
    { id: 'keywords', label: 'Keyword Gap Analysis' },
  ];

  return (
    <div className="bg-gray-50/20 selection:bg-blue-100 selection:text-blue-600">
      <Hero setPage={setPage} />
      
      <StatsSection />

      {/* Tool Section */}
      <div id="tool-section" className="max-w-4xl mx-auto py-24 px-8 scroll-mt-24">
        <div className="text-center mb-12">
          <div className="inline-block px-3 py-1 mb-4 text-[10px] font-bold tracking-[0.2em] text-[#F97316] uppercase bg-orange-50 rounded-md">
            Interactive Analysis Tool
          </div>
          <h2 className="text-4xl font-black text-gray-900 tracking-tight">Try it now</h2>
        </div>

        <div className="bg-white border border-gray-100 rounded-[2.5rem] overflow-hidden shadow-2xl shadow-blue-500/5">
          {/* Tabs */}
          <div className="flex border-b border-gray-50 bg-gray-50/50 p-2">
            {tabs.map(t => (
              <button
                key={t.id}
                onClick={() => setActiveTab(t.id)}
                className={`flex-1 text-xs font-bold py-4 rounded-2xl transition-all ${
                  activeTab === t.id 
                    ? 'bg-white text-[#2563EB] shadow-sm' 
                    : 'text-gray-400 hover:text-gray-600'
                }`}
              >{t.label}</button>
            ))}
          </div>

          <div className="p-8 md:p-12">
            {activeTab === 'score' && (
              <ATSForm
                remaining={remaining}
                plan={statusPlan}
                isProUser={isProUser}
                onResult={handleATSResult}
                showToast={showToast}
                setPage={setPage}
                userToken={userToken}
              />
            )}
            {activeTab === 'cover' && (
              <CoverLetterForm
                remaining={remaining}
                plan={statusPlan}
                isProUser={isProUser}
                onResult={handleCoverLetterResult}
                showToast={showToast}
                setPage={setPage}
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
                setPage={setPage}
                consumeUsage={consumeUsage}
                userToken={userToken}
              />
            )}
          </div>
        </div>

        {/* ATS Results */}
        {activeTab === 'score' && atsResult && (
          <div className="mt-12 space-y-8 animate-in fade-in slide-in-from-bottom-5 duration-700">
            <Results result={atsResult} isProUser={isProUser} setPage={setPage} />
            {rewriteData && <RewriteSection data={rewriteData} isProUser={isProUser} setPage={setPage} />}
          </div>
        )}

        {/* Cover letter result */}
        {activeTab === 'cover' && coverLetter && (
          <div className="mt-12 bg-white border border-gray-100 rounded-3xl p-8 shadow-xl animate-in fade-in slide-in-from-bottom-5 duration-700">
            <div className="flex justify-between items-center mb-6">
               <h4 className="text-lg font-bold text-gray-900">Your AI Cover Letter</h4>
               <button 
                 onClick={() => navigator.clipboard.writeText(coverLetter).then(() => showToast('Copied to clipboard'))} 
                 className="flex items-center gap-2 text-xs font-bold text-[#2563EB] hover:bg-blue-50 px-4 py-2 rounded-lg transition-all"
               >
                 <span className="material-icons-outlined text-sm">content_copy</span> Copy
               </button>
            </div>
            <pre className="text-sm text-gray-600 leading-relaxed whitespace-pre-wrap font-inter">{coverLetter}</pre>
          </div>
        )}

        {/* Keywords result */}
        {activeTab === 'keywords' && kwResult && (
          <div className="mt-12 bg-white border border-gray-100 rounded-3xl p-8 shadow-xl animate-in fade-in slide-in-from-bottom-5 duration-700">
            <h4 className="text-lg font-bold text-gray-900 mb-6">Keyword Analysis Report</h4>
            <div className="grid gap-6 md:grid-cols-2">
              {kwResult.present?.length > 0 && (
                <div className="p-6 bg-green-50 rounded-2xl border border-green-100">
                  <div className="flex items-center gap-2 text-green-700 font-bold text-xs uppercase tracking-widest mb-4">
                    <span className="material-icons-outlined text-sm">check_circle</span> Optimized
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {kwResult.present.map(k => <span key={k} className="px-3 py-1 bg-white text-green-700 text-xs font-bold rounded-full border border-green-200">{k}</span>)}
                  </div>
                </div>
              )}
              {kwResult.critical?.length > 0 && (
                <div className="p-6 bg-red-50 rounded-2xl border border-red-100">
                  <div className="flex items-center gap-2 text-red-700 font-bold text-xs uppercase tracking-widest mb-4">
                    <span className="material-icons-outlined text-sm">error_outline</span> Missing
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {kwResult.critical.map(k => <span key={k} className="px-3 py-1 bg-white text-red-700 text-xs font-bold rounded-full border border-red-200">{k}</span>)}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      <FeatureCards />
      
      <CTASection setPage={setPage} />

      <footer className="py-20 px-8 border-t border-gray-100 bg-white">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8 text-center md:text-left">
          <div>
            <div className="text-2xl font-black text-[#2563EB] tracking-tighter mb-2">ResumeAI</div>
            <p className="text-sm text-gray-400 font-medium">Empowering 150K+ professionals to beat the ATS.</p>
          </div>
          <div className="flex gap-8 text-xs font-bold text-gray-400 uppercase tracking-widest">
            <a href="#" className="hover:text-gray-900 transition-colors">Terms</a>
            <a href="#" className="hover:text-gray-900 transition-colors">Privacy</a>
            <a href="#" className="hover:text-gray-900 transition-colors">Support</a>
          </div>
          <div className="text-xs font-bold text-gray-400 uppercase tracking-widest whitespace-nowrap">© 2026 ResumeAI. Built for success.</div>
        </div>
      </footer>
    </div>
  );
}
