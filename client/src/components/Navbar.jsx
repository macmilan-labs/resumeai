import React from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import GoogleLogin from './GoogleLogin.jsx';

export default function Navbar({ userToken, userEmail, isProUser, handleLoginSuccess, handleLogout }) {
  const navigate = useNavigate();

  return (
    <nav className="flex justify-between items-center px-8 lg:px-12 py-5 bg-white/90 backdrop-blur-md border-b border-slate-100 sticky top-0 z-50">
      <div className="flex items-center gap-12">
        <Link
          to="/"
          className="text-2xl font-black tracking-tighter text-blue-600 flex items-center gap-2 group transition-all"
        >
          <div className="w-2.5 h-2.5 rounded-full bg-orange-500 group-hover:scale-125 transition-transform" />
          <span className="font-outfit">ResumeAI</span>
        </Link>
        <div className="hidden md:flex gap-8 text-[13px] font-bold uppercase tracking-widest text-slate-400">
          <NavLink to="/" className={({ isActive }) => isActive ? "text-blue-600 border-b-2 border-blue-600 pb-1" : "hover:text-blue-600 transition-colors"}>Home</NavLink>
          <NavLink to="/analyze" className={({ isActive }) => isActive ? "text-blue-600 border-b-2 border-blue-600 pb-1" : "hover:text-blue-600 transition-colors"}>Analyze</NavLink>
          <NavLink to="/history" className={({ isActive }) => isActive ? "text-blue-600 border-b-2 border-blue-600 pb-1" : "hover:text-blue-600 transition-colors"}>History</NavLink>
          <NavLink to="/pricing" className={({ isActive }) => isActive ? "text-blue-600 border-b-2 border-blue-600 pb-1" : "hover:text-blue-600 transition-colors"}>Pricing</NavLink>
        </div>
      </div>

      <div className="flex items-center gap-6">
        {/* Auth State */}
        {!userToken ? (
          <GoogleLogin onLoginSuccess={handleLoginSuccess} />
        ) : (
          <div className="flex items-center gap-4">
            <div className="hidden lg:flex flex-col items-end">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Authenticated</span>
              <span className="text-xs font-bold text-slate-900">{userEmail}</span>
            </div>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-slate-50 text-slate-500 hover:text-red-600 hover:bg-red-50 text-xs font-bold rounded-2xl transition-all duration-300 active:scale-95"
            >
              Logout
            </button>
          </div>
        )}

        {/* Action Button */}
        {isProUser ? (
          <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-600 text-[10px] font-black uppercase tracking-widest rounded-full border border-blue-100 shadow-sm animate-pulse-slow">
            <span className="material-icons-outlined text-sm">workspace_premium</span>
            Pro Member
          </div>
        ) : (
          <button
            onClick={() => navigate('/pricing')}
            className="hidden sm:flex items-center gap-2 px-6 py-2.5 bg-orange-500 hover:bg-orange-600 text-white text-[11px] font-black uppercase tracking-[0.15em] rounded-2xl shadow-lg shadow-orange-200 transition-all duration-300 hover:shadow-orange-300 active:scale-95 animate-in fade-in"
          >
            Upgrade <span className="material-icons-outlined text-sm">trending_up</span>
          </button>
        )}

        {/* Avatar */}
        <div className="w-10 h-10 rounded-full bg-slate-50 border-2 border-white shadow-sm overflow-hidden flex-shrink-0">
          <img
            src={`https://ui-avatars.com/api/?name=${userEmail || 'User'}&background=2563EB&color=fff&bold=true&font-size=0.33`}
            alt="Profile"
          />
        </div>
      </div>
    </nav>
  );
}
