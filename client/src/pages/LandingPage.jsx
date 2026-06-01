import React from 'react';
import { useNavigate, Link } from 'react-router-dom';

const Hero = () => {
  const navigate = useNavigate();
  return (
    <header className="pt-24 pb-28 px-8 text-center max-w-5xl mx-auto animate-in fade-in slide-in-from-top-4 duration-1000">
      <div className="inline-flex items-center gap-2 px-4 py-1.5 mb-8 text-[11px] font-black tracking-[0.2em] text-blue-600 uppercase bg-blue-50/50 rounded-full border border-blue-100/50">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-600"></span>
        </span>
        Precision ATS Optimization Engine
      </div>
      <h1 className="text-6xl md:text-8xl font-black text-slate-900 leading-[0.95] mb-10 tracking-tight">
        Static resumes don't <br />
        <span className="text-blue-600 bg-clip-text">get callbacks.</span>
      </h1>
      <p className="text-lg md:text-xl text-slate-500 mb-14 max-w-3xl mx-auto leading-relaxed font-inter font-medium">
        Our proprietary analysis tool maps your qualifications against critical job description parameters to supply the exact keywords and phrasing needed to optimize your candidacy.
      </p>
      <div className="flex justify-center items-center">
        <button 
          onClick={() => navigate('/analyze')}
          className="group w-full sm:w-auto px-12 py-6 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-2xl shadow-2xl shadow-blue-200 transition-all active:scale-95 flex items-center justify-center gap-3 text-sm tracking-wider uppercase"
        >
          Analyze Resume
          <span className="material-icons-outlined group-hover:translate-x-1 transition-transform">arrow_forward</span>
        </button>
      </div>
      <div className="mt-16 flex flex-wrap justify-center items-center gap-x-12 gap-y-6 opacity-60">
        {[
          { text: 'ATS Compatible', icon: 'check_circle' },
          { text: 'Recruiter Friendly', icon: 'groups' },
          { text: 'Keyword Optimized', icon: 'manage_search' },
          { text: 'Privacy Safe', icon: 'security' }
        ].map((tag, i) => (
          <div key={i} className="flex items-center gap-2 text-sm font-black text-slate-400 uppercase tracking-widest">
            <span className="material-icons-outlined text-blue-500 text-lg">{tag.icon}</span>
            {tag.text}
          </div>
        ))}
      </div>
    </header>
  );
};

const TrustSection = () => (
  <section className="py-16 bg-slate-50 border-y border-slate-100">
    <div className="max-w-7xl mx-auto px-8 grid grid-cols-2 md:grid-cols-4 gap-8">
      {[
        { title: 'ATS Keyword Matching', icon: 'auto_fix_high', color: 'text-blue-600' },
        { title: 'AI Resume Suggestions', icon: 'psychology', color: 'text-orange-500' },
        { title: 'Instant Job Fit Scoring', icon: 'analytics', color: 'text-blue-600' },
        { title: 'Privacy Safe Analysis', icon: 'shield', color: 'text-green-600' }
      ].map((item, i) => (
        <div key={i} className="flex flex-col md:flex-row items-center gap-4 text-center md:text-left">
          <div className={`w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm border border-slate-100`}>
            <span className={`material-icons-outlined ${item.color}`}>{item.icon}</span>
          </div>
          <div className="text-sm font-bold text-slate-700 tracking-tight leading-tight">{item.title}</div>
        </div>
      ))}
    </div>
  </section>
);

const FeatureCards = () => {
  const navigate = useNavigate();
  return (
    <section className="pt-32 pb-8 max-w-7xl mx-auto px-8">
      <div className="text-center mb-20">
        <div className="inline-block px-3 py-1 mb-6 text-[11px] font-black tracking-[0.2em] text-blue-600 uppercase bg-blue-50 rounded-md">
          How it Works
        </div>
        <h2 className="text-5xl font-black text-slate-900 tracking-tight leading-tight">Engineered for Results</h2>
        <p className="mt-4 text-slate-500 font-medium">Three steps to a job-winning resume.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-20">
        {[
          { title: 'Score Analysis', icon: 'troubleshoot', desc: 'Get an immediate ATS score based on 15+ critical data points found in JD algorithms.' },
          { title: 'Gap Detection', icon: 'find_in_page', desc: 'We identify exactly which skills and keywords are missing from your current profile.' },
          { title: 'Rewrite Insights', icon: 'edit_note', desc: 'AI-powered suggestions to rewrite your bullet points for maximum impact and readability.' }
        ].map((f, i) => (
          <div 
            key={i} 
            className="group p-10 bg-white border border-slate-100 border-l-[6px] border-l-blue-600 rounded-[2.5rem] hover:shadow-2xl hover:shadow-blue-500/10 hover:border-blue-100 transition-all duration-500 relative overflow-hidden"
          >
            <div className="w-16 h-16 bg-blue-600 text-white rounded-2xl flex items-center justify-center mb-10 shadow-xl shadow-blue-200 group-hover:rotate-6 transition-all duration-300">
              <span className="material-icons-outlined text-3xl">{f.icon}</span>
            </div>
            <h3 className="text-2xl font-black text-slate-900 mb-5">{f.title}</h3>
            <p className="text-slate-500 leading-relaxed mb-4 font-medium">{f.desc}</p>
            <div className="absolute top-0 right-0 p-8 opacity-0 group-hover:opacity-10 transition-opacity">
              <span className="text-8xl font-black text-slate-900 leading-none">{i + 1}</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

const WhyResumeAI = () => (
  <section className="px-8 py-8">
    <div className="max-w-7xl mx-auto bg-slate-900 rounded-[3.5rem] border-l-[12px] border-l-blue-600 overflow-hidden relative">
      {/* Abstract Aesthetic Glows */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
         <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-500/10 rounded-full blur-3xl"></div>
         <div className="absolute bottom-[-20%] left-[-10%] w-[30%] h-[30%] bg-white/5 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-7xl mx-auto px-12 md:px-24 flex flex-col lg:flex-row items-center gap-20 py-20 relative z-10">
        <div className="flex-1 text-center lg:text-left">
          <div className="text-blue-400 font-black text-xs uppercase tracking-widest mb-6">Why Professionals Choose Us</div>
          <h2 className="text-4xl md:text-5xl font-black text-white mb-8 tracking-tighter leading-tight">Beyond simple keyword <br /> matching.</h2>
          <div className="grid gap-6">
            {[
              { t: 'Semantic Understanding', d: 'Our AI understands the context of your skills, not just the text.' },
              { t: 'Industry Specific', d: 'Tailored analysis for Tech, Product, Finance, and Creative roles.' },
              { t: 'Success Tracking', d: 'Monitor your progress as you optimize and rescore your resume.' }
            ].map((item, i) => (
              <div key={i} className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-white/5 backdrop-blur-md border border-white/10 flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="material-icons-outlined text-xs text-blue-400">check</span>
                </div>
                <div>
                  <h4 className="text-white font-bold text-lg mb-1">{item.t}</h4>
                  <p className="text-slate-400 text-sm leading-relaxed">{item.d}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="flex-1 relative">
          <div className="p-8 bg-white/5 backdrop-blur-3xl border border-white/10 rounded-[3rem] shadow-2xl">
            <div className="flex items-center gap-4 mb-10">
              <div className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center font-black text-white">AI</div>
              <div>
                <div className="text-white font-bold">ResumeAI Optimizer</div>
                <div className="text-blue-400 text-xs font-bold">Scanning JD Compatibility...</div>
              </div>
            </div>
            <div className="space-y-4">
               <div className="h-3 bg-white/10 rounded-full w-3/4"></div>
               <div className="h-3 bg-white/10 rounded-full w-full"></div>
               <div className="h-3 bg-white/10 rounded-full w-1/2"></div>
               <div className="h-12 bg-blue-600/20 border border-blue-500/30 rounded-2xl w-full mt-8 flex items-center px-6">
                  <span className="text-blue-400 text-xs font-black">Score Impact: +42%</span>
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
);

const CTASection = () => {
  const navigate = useNavigate();
  return (
    <section className="px-8 pb-32">
      <div className="max-w-7xl mx-auto bg-slate-900 rounded-[3.5rem] border-l-[12px] border-l-blue-600 p-16 md:p-32 text-center relative overflow-hidden shadow-2xl">
        <div className="relative z-10">
          <h2 className="text-5xl md:text-7xl font-black text-white mb-10 tracking-tighter leading-none">Ready to land <br /> the interview?</h2>
          <p className="text-xl text-slate-300 mb-14 max-w-2xl mx-auto leading-relaxed font-inter font-medium opacity-90">
            Stop letting algorithms ignore your talent. Get the high-precision insights you need to bypass digital gatekeepers and land your dream role.
          </p>
          <div className="flex justify-center items-center">
            <button 
              onClick={() => navigate('/analyze')}
              className="w-full sm:w-auto px-12 py-6 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-2xl shadow-xl transition-all active:scale-95 whitespace-nowrap text-sm tracking-wider uppercase"
            >
              Analyze Resume
            </button>
          </div>
        </div>
        {/* Abstract Background Shapes */}
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
           <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-white/10 rounded-full blur-3xl"></div>
           <div className="absolute bottom-[-10%] right-[-5%] w-[40%] h-[40%] bg-blue-400/20 rounded-full blur-3xl"></div>
        </div>
      </div>
    </section>
  );
};

export default function LandingPage() {
  return (
    <div className="bg-white selection:bg-blue-100 selection:text-blue-600 overflow-x-hidden">
      <Hero />
      <TrustSection />
      <FeatureCards />
      <WhyResumeAI />
      <CTASection />
      <Footer />
    </div>
  );
}

const Footer = () => (
  <footer className="py-24 px-8 border-t border-slate-100 bg-white">
    <div className="max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start gap-12 mb-20">
        <div className="max-w-xs">
          <div className="text-3xl font-black text-blue-600 tracking-tighter mb-6 font-outfit">ResumeAI</div>
          <p className="text-slate-500 font-medium leading-relaxed">Reverse-engineering hiring algorithms so you can land your dream job in record time.</p>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-16">
          <div className="flex flex-col gap-4">
            <h5 className="font-black text-slate-800 text-xs uppercase tracking-widest mb-2">Product</h5>
            <Link to="/analyze" className="text-slate-500 text-sm font-bold hover:text-blue-600 transition-colors">Analyzer</Link>
            <Link to="/pricing" className="text-slate-500 text-sm font-bold hover:text-blue-600 transition-colors">Pricing</Link>
            <Link to="/history" className="text-slate-500 text-sm font-bold hover:text-blue-600 transition-colors">Dashboard</Link>
          </div>
          <div className="flex flex-col gap-4">
             <h5 className="font-black text-slate-800 text-xs uppercase tracking-widest mb-2">Company</h5>
             <a href="#" className="text-slate-500 text-sm font-bold hover:text-blue-600 transition-colors">About</a>
             <a href="#" className="text-slate-500 text-sm font-bold hover:text-blue-600 transition-colors">Privacy</a>
             <a href="#" className="text-slate-500 text-sm font-bold hover:text-blue-600 transition-colors">Terms</a>
          </div>
          <div className="flex flex-col gap-4">
             <h5 className="font-black text-slate-800 text-xs uppercase tracking-widest mb-2">Support</h5>
             <a href="#" className="text-slate-500 text-sm font-bold hover:text-blue-600 transition-colors">Contact</a>
             <a href="#" className="text-slate-500 text-sm font-bold hover:text-blue-600 transition-colors">Help Center</a>
             <a href="#" className="text-slate-500 text-sm font-bold hover:text-blue-600 transition-colors">Status</a>
          </div>
        </div>
      </div>
      <div className="pt-12 border-t border-slate-50 flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="text-xs font-black text-slate-400 uppercase tracking-widest">© 2026 ResumeAI Analytics. Standardized for Excellence.</div>
        <div className="flex gap-6">
           <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 hover:text-blue-600 transition-colors cursor-pointer">
              <span className="material-icons-outlined text-xl">facebook</span>
           </div>
           <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 hover:text-blue-600 transition-colors cursor-pointer">
              <span className="material-icons-outlined text-xl">twitter</span>
           </div>
           <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 hover:text-blue-600 transition-colors cursor-pointer">
              <span className="material-icons-outlined text-xl">share</span>
           </div>
        </div>
      </div>
    </div>
  </footer>
);
