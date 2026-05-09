# ResumeAI Frontend Export: React + Tailwind CSS

This document contains the production-ready React components and page structures for **ResumeAI**, based on the production-ready designs ({{DATA:SCREEN:SCREEN_8}} and {{DATA:SCREEN:SCREEN_6}}).

---

## 1. Landing Page Components

### Navbar.jsx
```jsx
import React from 'react';

const Navbar = () => {
  return (
    <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <span className="text-2xl font-black tracking-tighter text-[#2563EB]">ResumeAI</span>
          <div className="hidden md:flex items-center gap-6">
            <a href="#" className="text-sm font-medium text-slate-600 hover:text-[#2563EB] transition-colors">Dashboard</a>
            <a href="#" className="text-sm font-medium text-slate-600 hover:text-[#2563EB] transition-colors">Analyze</a>
            <a href="#" className="text-sm font-medium text-slate-600 hover:text-[#2563EB] transition-colors">Reports</a>
            <a href="#" className="text-sm font-medium text-slate-600 hover:text-[#2563EB] transition-colors">Billing</a>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <button className="p-2 text-slate-400 hover:text-slate-600 transition-colors">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
          </button>
          <a href="#" className="text-sm font-semibold text-[#2563EB] px-4 py-2 hover:bg-blue-50 rounded-lg transition-all">Pro Plan</a>
          <button className="bg-[#F97316] text-white px-6 py-2.5 rounded-lg font-bold hover:bg-[#EA580C] hover:scale-[1.02] active:scale-[0.98] transition-all shadow-lg shadow-orange-500/20">
            Analyze Resume
          </button>
          <img src="/api/placeholder/40/40" alt="Profile" className="w-10 h-10 rounded-full border-2 border-slate-100 ml-2" />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
```

### Hero.jsx
```jsx
import React from 'react';

const Hero = () => {
  return (
    <section className="pt-40 pb-20 px-6 bg-slate-50/50">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div>
          <span className="inline-block px-3 py-1 rounded-full bg-blue-50 text-[#2563EB] text-xs font-bold uppercase tracking-wider mb-6">
            AI-Powered Recruitment Intelligence
          </span>
          <h1 className="text-7xl font-black text-slate-900 leading-[1.1] tracking-tight mb-8">
            Stop getting rejected by <span className="text-[#2563EB]">ATS filters.</span>
          </h1>
          <p className="text-xl text-slate-600 leading-relaxed mb-10 max-w-xl">
            Our precision AI analyzes your resume against 500+ corporate algorithms. Bridge the skill gap and secure more callbacks with data-driven curation.
          </p>
          <div className="flex items-center gap-4">
            <button className="bg-[#F97316] text-white px-10 py-5 rounded-xl font-bold text-lg hover:bg-[#EA580C] hover:shadow-xl hover:shadow-orange-500/30 transition-all active:scale-95">
              Analyze Resume Now
            </button>
            <button className="bg-blue-50 text-[#2563EB] px-10 py-5 rounded-xl font-bold text-lg hover:bg-blue-100 transition-all">
              View Sample Report
            </button>
          </div>
          <div className="mt-12 flex items-center gap-8">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Trusted by candidates at</span>
            <div className="flex gap-6 opacity-40 grayscale">
               {/* Brand Logos Placeholder */}
               <span className="text-lg font-bold">Google</span>
               <span className="text-lg font-bold">Stripe</span>
               <span className="text-lg font-bold">Meta</span>
            </div>
          </div>
        </div>
        <div className="relative">
          {/* Main Hero Visual Card */}
          <div className="bg-white p-8 rounded-[2rem] shadow-2xl shadow-slate-200 border border-slate-100">
             <div className="flex justify-between items-center mb-6">
                <div>
                  <h4 className="font-bold text-slate-900">Resume Analysis</h4>
                  <p className="text-sm text-slate-400">Senior Product Designer.pdf</p>
                </div>
                <div className="bg-blue-600 text-white px-3 py-1 rounded-md font-bold text-sm">87/100</div>
             </div>
             <div className="w-full h-2 bg-slate-100 rounded-full mb-8 overflow-hidden">
                <div className="h-full bg-blue-600 w-[87%]"></div>
             </div>
             <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                  <p className="text-[10px] font-bold text-blue-600 uppercase tracking-widest mb-1">Keywords Found</p>
                  <p className="text-2xl font-black text-slate-900">24 / 30</p>
                </div>
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                  <p className="text-[10px] font-bold text-blue-600 uppercase tracking-widest mb-1">Formatting Score</p>
                  <p className="text-2xl font-black text-slate-900">98%</p>
                </div>
             </div>
          </div>
          {/* Floater Insight Card */}
          <div className="absolute -bottom-10 -left-10 bg-white p-6 rounded-2xl shadow-xl border border-slate-100 max-w-xs animate-bounce-slow">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-orange-50 rounded-lg text-orange-500">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
              </div>
              <p className="font-bold text-slate-900">+85% Callbacks</p>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">Users who applied AI suggestions saw a significant increase in interview invites within 14 days.</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
```

---

## 2. Dashboard Components

### ATSDashboard.jsx (Layout Shell)
```jsx
import React from 'react';
import RecommendationCards from './RecommendationCards';

const ATSDashboard = () => {
  return (
    <main className="pt-28 pb-20 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-6">
        {/* Dashboard Header */}
        <div className="flex justify-between items-end mb-12">
          <div>
            <span className="text-xs font-bold text-blue-600 uppercase tracking-widest">Analysis Results</span>
            <h1 className="text-5xl font-black text-slate-900 tracking-tight mt-2">Senior Product Designer</h1>
            <p className="text-slate-500 mt-2">Report generated for <span className="font-bold">Alex Thompson's Portfolio Resume</span></p>
          </div>
          <div className="flex gap-3">
            <button className="flex items-center gap-2 bg-blue-50 text-blue-600 px-6 py-3 rounded-xl font-bold hover:bg-blue-100 transition-all">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
              Export PDF
            </button>
            <button className="flex items-center gap-2 bg-blue-50 text-blue-600 px-6 py-3 rounded-xl font-bold hover:bg-blue-100 transition-all">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" /></svg>
              Share Report
            </button>
          </div>
        </div>

        {/* Top Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 flex flex-col items-center justify-center text-center">
             <div className="relative w-32 h-32 mb-4">
                <svg className="w-full h-full transform -rotate-90">
                  <circle cx="64" cy="64" r="58" stroke="currentColor" strokeWidth="12" fill="transparent" className="text-slate-100" />
                  <circle cx="64" cy="64" r="58" stroke="currentColor" strokeWidth="12" fill="transparent" strokeDasharray="364.4" strokeDashoffset="80.1" className="text-blue-600" />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-3xl font-black text-slate-900 leading-none">78</span>
                  <span className="text-[10px] font-bold text-slate-400 uppercase">/ 100</span>
                </div>
             </div>
             <div className="bg-blue-50 text-blue-600 px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest">Good Match</div>
             <p className="text-xs text-slate-500 mt-4 leading-relaxed">Alex's profile is in the top 15% of candidates analyzed for this role.</p>
          </div>

          <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 col-span-1">
             <span className="text-[10px] font-bold text-blue-600 uppercase tracking-widest">Coverage</span>
             <h4 className="text-xl font-black text-slate-900 mt-1 mb-8">Skill Match</h4>
             <div className="mt-auto">
               <div className="flex justify-between items-end mb-2">
                 <span className="text-4xl font-black text-slate-900">92%</span>
                 <span className="text-[10px] font-bold text-blue-600 uppercase tracking-widest">Exceptional</span>
               </div>
               <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                 <div className="h-full bg-blue-600 w-[92%]"></div>
               </div>
             </div>
          </div>
          
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 col-span-1">
             <span className="text-[10px] font-bold text-blue-600 uppercase tracking-widest">Context</span>
             <h4 className="text-xl font-black text-slate-900 mt-1 mb-8">Experience Depth</h4>
             <div className="mt-auto">
               <div className="flex justify-between items-end mb-2">
                 <span className="text-4xl font-black text-slate-900">64%</span>
                 <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Moderate</span>
               </div>
               <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                 <div className="h-full bg-blue-600 w-[64%]"></div>
               </div>
             </div>
          </div>

          <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 col-span-1">
             <span className="text-[10px] font-bold text-blue-600 uppercase tracking-widest">SEO</span>
             <h4 className="text-xl font-black text-slate-900 mt-1 mb-8">Keywords</h4>
             <div className="mt-auto">
               <div className="flex justify-between items-end mb-2">
                 <span className="text-4xl font-black text-slate-900">81%</span>
                 <span className="text-[10px] font-bold text-blue-600 uppercase tracking-widest">Strong</span>
               </div>
               <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                 <div className="h-full bg-blue-600 w-[81%]"></div>
               </div>
             </div>
          </div>
        </div>

        {/* Two Column Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
             <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-blue-600 text-white rounded-lg">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                </div>
                <h3 className="text-2xl font-black text-slate-900 tracking-tight">Top 3 Actions to Improve</h3>
             </div>
             <RecommendationCards />
          </div>

          <div className="lg:col-span-2 space-y-8">
             <div className="bg-white p-10 rounded-[2.5rem] shadow-sm border border-slate-100">
               <div className="flex items-center justify-between mb-8">
                 <div className="flex items-center gap-3">
                    <div className="w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center text-white text-[10px]">
                      <svg fill="currentColor" viewBox="0 0 24 24" className="w-3 h-3"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" /></svg>
                    </div>
                    <h3 className="text-2xl font-black text-slate-900 tracking-tight">Matched Skills</h3>
                 </div>
                 <span className="bg-blue-50 text-blue-600 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest">14 Found</span>
               </div>
               <div className="flex flex-wrap gap-3">
                 {['Product Strategy', 'UI/UX Design', 'Figma Master', 'Design Systems', 'Agile Methodology', 'Stakeholder Management', 'Prototyping', 'Visual Design'].map(skill => (
                   <span key={skill} className="px-5 py-3 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold text-slate-700 hover:border-blue-200 hover:text-blue-600 cursor-default transition-all">
                     {skill}
                   </span>
                 ))}
               </div>

               <hr className="my-10 border-slate-100" />

               <div className="flex items-center justify-between mb-8">
                 <div className="flex items-center gap-3">
                    <div className="w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-white text-[10px]">
                      <svg fill="currentColor" viewBox="0 0 24 24" className="w-3 h-3"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" /></svg>
                    </div>
                    <h3 className="text-2xl font-black text-slate-900 tracking-tight">Missing Skills</h3>
                 </div>
                 <span className="bg-red-50 text-red-500 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest">4 Missing</span>
               </div>
               <div className="flex flex-wrap gap-3">
                 {['Framer', 'WCAG 2.1', 'React Basics', 'A/B Testing'].map(skill => (
                   <span key={skill} className="px-5 py-3 bg-red-50/50 border border-red-100 rounded-2xl text-sm font-bold text-red-600 transition-all">
                     {skill}
                   </span>
                 ))}
               </div>
             </div>

             <div className="relative overflow-hidden bg-slate-900 rounded-[2.5rem] p-12 text-white">
                <div className="relative z-10">
                  <h3 className="text-4xl font-black tracking-tight mb-4">Precision Career Mapping</h3>
                  <p className="text-slate-400 text-lg max-w-xl mb-8 leading-relaxed">Our AI detected a gap between your current title and the role responsibilities. To bridge this, emphasize your "End-to-End Ownership" of the checkout flow project at your previous company.</p>
                  <button className="bg-[#F97316] text-white px-10 py-5 rounded-xl font-bold text-lg hover:bg-[#EA580C] transition-all">Upgrade Your Resume</button>
                </div>
                {/* Decorative Pattern Component Placeholder */}
                <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-500 via-transparent to-transparent"></div>
             </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default ATSDashboard;
```

### RecommendationCards.jsx
```jsx
import React from 'react';

const recommendations = [
  {
    id: 1,
    title: 'Quantify Design Impact',
    text: 'Add specific metrics like "increased conversion by 12%" to your past experience bullets to trigger senior-level ATS filters.',
    points: '+12 pts'
  },
  {
    id: 2,
    title: 'Strengthen Web Accessibility',
    text: 'The job description mentions WCAG 2.1 four times. Explicitly state your expertise in accessibility audits.',
    points: '+8 pts'
  },
  {
    id: 3,
    title: 'Missing Tool: Framer',
    text: 'The hiring team prioritizes high-fidelity prototyping. Ensure "Framer" is listed under your technical skills section.',
    points: '+5 pts'
  }
];

const RecommendationCards = () => {
  return (
    <div className="space-y-4">
      {recommendations.map((item, idx) => (
        <div key={item.id} className="group relative bg-white p-8 rounded-3xl shadow-sm border border-slate-100 hover:border-blue-200 hover:shadow-xl hover:shadow-blue-500/5 transition-all duration-300">
           <div className="flex items-start justify-between mb-4">
              <div className="w-10 h-10 bg-slate-50 text-slate-900 rounded-xl flex items-center justify-center font-black group-hover:bg-blue-600 group-hover:text-white transition-colors">
                {idx + 1}
              </div>
              <span className="text-[10px] font-bold text-blue-600 uppercase tracking-widest">{item.points}</span>
           </div>
           <h4 className="text-lg font-black text-slate-900 mb-2 leading-snug">{item.title}</h4>
           <p className="text-sm text-slate-500 leading-relaxed">{item.text}</p>
        </div>
      ))}
    </div>
  );
};

export default RecommendationCards;
```
