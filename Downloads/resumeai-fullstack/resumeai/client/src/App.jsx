import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import LandingPage from './pages/LandingPage.jsx';
import AnalyzePage from './pages/AnalyzePage.jsx';
import ResultsPage from './pages/ResultsPage.jsx';
import HistoryPage from './pages/HistoryPage.jsx';
import Navbar from './components/Navbar.jsx';
import { AuthProvider, useAuth } from './context/AuthContext.jsx';
import { ResultProvider } from './context/ResultContext.jsx';
import { setApiLogout } from './api.js';

const LIMIT = 5;

export default function App() {
  return (
    <AuthProvider>
      <ResultProvider>
        <BrowserRouter>
          <AppContent />
        </BrowserRouter>
      </ResultProvider>
    </AuthProvider>
  );
}

function AppContent() {
  const [usageCount, setUsageCount] = useState(() => parseInt(localStorage.getItem('rai_usage') || '0'));
  const [billingYearly, setBillingYearly] = useState(false);
  const [toast, setToast] = useState(null);
  const { loading, userEmail, userToken, plan, isProUser, login, logout, setPlan } = useAuth();

  // Need to pass these down
  const remaining = Math.max(0, LIMIT - usageCount);

  function handleLoginSuccess(data) {
    login(data);
    showToast(`Logged in successfully`);
  }

  function handleLogout() {
    logout();
    showToast('Logged out safely');
  }

  useEffect(() => {
    // Bind the API logout wrapper to trigger our React context logout natively without window events
    setApiLogout(() => {
       logout();
       showToast('Session expired. Please log in again.');
    });
  }, [logout]);

  function showToast(msg, duration = 3000) {
    setToast(msg);
    setTimeout(() => setToast(null), duration);
  }

  function consumeUsage() {
    if (isProUser) return;
    const next = Math.min(usageCount + 1, LIMIT);
    setUsageCount(next);
    localStorage.setItem('rai_usage', next);
  }

  useEffect(() => {
    if (!localStorage.getItem('rai_visited')) {
      localStorage.setItem('rai_visited', '1');
    }
  }, []);

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <>
      <UsageBanner isProUser={isProUser} remaining={remaining} />

      <Navbar 
        userToken={userToken}
        userEmail={userEmail}
        isProUser={isProUser}
        handleLoginSuccess={handleLoginSuccess}
        handleLogout={handleLogout}
      />

      {/* Pages */}
      <main className="min-h-screen bg-gray-50/30">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route 
            path="/analyze" 
            element={
              <AnalyzePage
                remaining={remaining}
                statusPlan={plan}
                isProUser={isProUser}
                consumeUsage={consumeUsage}
                showToast={showToast}
                userToken={userToken}
                setIsProUser={setPlan}
              />
            } 
          />
          <Route path="/results" element={<ResultsPage isProUser={isProUser} />} />
          <Route path="/history" element={<HistoryPage showToast={showToast} />} />
          <Route 
            path="/pricing" 
            element={
              <PricingPage 
                billingYearly={billingYearly} 
                setBillingYearly={setBillingYearly}
                showToast={showToast}
              />
            } 
          />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </main>

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-10 right-10 z-[1000] animate-in slide-in-from-right-10 duration-500">
          <div className="bg-slate-900 text-white text-sm font-black px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-4 min-w-[280px] max-w-[320px] border border-white/10 backdrop-blur-md">
            <span className="material-icons-outlined text-blue-400">notifications_active</span>
            <span className="flex-1">{toast}</span>
            <button onClick={() => setToast(null)} className="hover:bg-white/10 rounded-lg p-1 transition-colors">
              <span className="material-icons-outlined text-xs">close</span>
            </button>
          </div>
        </div>
      )}
    </>
  );
}

function UsageBanner({ isProUser, remaining }) {
  if (isProUser) return null;

  return (
    <div className={`text-center text-[11px] font-bold py-2 tracking-wide uppercase transition-colors ${
      remaining === 0 ? 'bg-red-50 text-red-600' : 'bg-blue-600 text-white'
    }`}>
      {remaining > 0
        ? `✦ ${remaining} free ${remaining === 1 ? 'analysis' : 'analyses'} remaining — no sign-up needed`
        : "You've used all 5 free analyses"}
      <a
        href="/pricing"
        className="ml-3 underline decoration-white/30 hover:decoration-white transition-all"
      >
        {remaining === 0 ? 'Join waitlist →' : 'See plans →'}
      </a>
    </div>
  );
}

function PricingPage({ billingYearly, setBillingYearly, showToast }) {
  const navigate = useNavigate();
  const proAmt = billingYearly ? '₹209' : '₹299';
  const entAmt = billingYearly ? '₹559' : '₹799';
  const proBill = billingYearly ? '₹2,508 / year' : 'billed monthly via UPI';
  const entBill = billingYearly ? '₹6,708 / year' : 'billed monthly via UPI';

  const plans = [
    { name: 'Starter', amt: '₹0', bill: 'forever free', features: ['5 ATS analyses', 'Score dashboard', 'Skill gap report', 'AI Cover letter'], cta: 'Start for free', href: '/analyze', featured: false },
    { name: 'Pro Member', amt: proAmt, bill: proBill, features: ['Unlimited analyses', 'Priority processing', 'Enhanced written insights', 'Full history tracking', 'Priority support'], cta: 'Join Waitlist', href: '#', featured: true },
    { name: 'Enterprise', amt: entAmt, bill: entBill, features: ['Everything in Pro', 'Team usage limits', 'Bulk resume reviews', 'Admin dashboard', 'Dedicated support'], cta: 'Join Waitlist', href: '#', featured: false },
  ];

  return (
    <div className="min-h-screen bg-slate-50/50 py-24 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 mb-6 text-[10px] font-black tracking-[0.2em] text-blue-600 uppercase bg-blue-50 rounded-md border border-blue-100">
             <span className="material-icons-outlined text-xs">payments</span>
             Flexible Pricing
          </div>
          <h2 className="text-5xl font-black text-slate-900 tracking-tight leading-none mb-4 font-outfit">Simple, fair pricing</h2>
          <p className="text-slate-500 font-medium max-w-xl mx-auto">Choose the plan that best fits your career goals. Join our early access program today.</p>
        </div>

        {/* Toggle */}
        <div className="flex items-center justify-center gap-6 mb-16">
          <span className={`text-xs font-black uppercase tracking-widest ${!billingYearly ? 'text-blue-600' : 'text-slate-400'}`}>Monthly</span>
          <button 
            onClick={() => setBillingYearly(!billingYearly)}
            className="w-14 h-8 bg-slate-200 rounded-full p-1 relative transition-colors duration-300 focus:outline-none"
          >
            <div className={`w-6 h-6 bg-white rounded-full shadow-md transition-transform duration-300 ${billingYearly ? 'translate-x-6' : 'translate-x-0'}`} />
          </button>
          <div className="flex items-center gap-3">
             <span className={`text-xs font-black uppercase tracking-widest ${billingYearly ? 'text-blue-600' : 'text-slate-400'}`}>Yearly</span>
             {billingYearly && <span className="px-2 py-1 bg-green-100 text-green-700 text-[9px] font-black rounded uppercase tracking-widest">Save 30%</span>}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((p, i) => (
            <div 
              key={i}
              className={`relative p-10 ${p.featured ? 'bg-slate-900 border-white/5 border-l-[8px] border-l-blue-600 shadow-2xl shadow-blue-500/10' : 'bg-white border-slate-100'} rounded-[3rem] transition-all duration-500 hover:shadow-xl`}
            >
              {p.featured && (
                <>
                  {/* High-Intensity Aesthetic Glows - Moved to inner wrapper to prevent badge clipping */}
                  <div className="absolute inset-0 rounded-[3rem] overflow-hidden pointer-events-none">
                     <div className="absolute top-[-20%] right-[-10%] w-[50%] h-[60%] bg-blue-600/20 rounded-full blur-3xl"></div>
                     <div className="absolute bottom-[-20%] left-[-10%] w-[40%] h-[60%] bg-white/5 rounded-full blur-3xl"></div>
                  </div>
                  <div className="absolute top-0 right-10 -translate-y-1/2 bg-blue-600 text-white text-[10px] font-black uppercase tracking-widest px-4 py-1.5 rounded-full shadow-lg shadow-blue-200 z-20">
                    Most Popular
                  </div>
                </>
              )}
              
              <div className="relative z-10">
                <div className={`text-[10px] font-black uppercase tracking-widest mb-6 ${p.featured ? 'text-blue-400' : 'text-slate-400'}`}>{p.name}</div>
                <div className="flex items-baseline gap-2 mb-2">
                  <span className={`text-5xl font-black tracking-tighter ${p.featured ? 'text-white' : 'text-slate-900'}`}>{p.amt}</span>
                  <span className="text-slate-400 font-bold">/ month</span>
                </div>
                <div className="text-xs font-bold text-slate-400 mb-8 lowercase tracking-wide">{p.bill}</div>
                
                <div className={`h-px mb-8 ${p.featured ? 'bg-white/5' : 'bg-slate-50'}`} />
                
                <ul className="space-y-4 mb-10">
                  {p.features.map((f, idx) => (
                    <li key={idx} className={`flex items-center gap-3 text-sm font-medium ${p.featured ? 'text-slate-300' : 'text-slate-600'}`}>
                      <span className={`material-icons-outlined text-sm ${p.featured ? 'text-blue-400' : 'text-blue-600'}`}>check_circle</span>
                      {f}
                    </li>
                  ))}
                </ul>

                <button 
                  onClick={() => p.href !== '#' ? navigate(p.href) : showToast('Early access only — launch soon!')}
                  className={`w-full py-5 rounded-2xl font-black text-xs uppercase tracking-widest transition-all active:scale-95 ${
                    p.featured 
                      ? 'bg-blue-600 text-white shadow-xl shadow-blue-500/20 hover:bg-blue-700' 
                      : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  {p.cta}
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-20 text-center">
            <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">Ready to beat the corporate algorithms?</p>
            <div className="mt-8 flex justify-center gap-12 opacity-30 grayscale items-center">
                <div className="text-xl font-black tracking-tighter text-slate-900">Visa</div>
                <div className="text-xl font-black tracking-tighter text-slate-900">Mastercard</div>
                <div className="text-xl font-black tracking-tighter text-slate-900">UPI</div>
                <div className="text-xl font-black tracking-tighter text-slate-900">PayPal</div>
            </div>
        </div>
      </div>
    </div>
  );
}

function LoadingScreen() {
  return (
    <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', color: 'var(--ink)' }}>
      <div style={{ width: 32, height: 32, border: '3px solid var(--border)', borderTop: '3px solid var(--accent)', borderRadius: '50%', animation: 'spin 1s linear infinite', marginBottom: 16 }} />
      <div style={{ fontFamily: 'var(--sans)', fontSize: 13, fontWeight: 500, color: 'var(--ink2)' }}>Initializing session...</div>
      <style>{`
        @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}
