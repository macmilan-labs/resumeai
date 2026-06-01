import React, { useState, useEffect } from 'react';
import { fetchHistory as getHistory, clearHistory, fetchAnalysisById, deleteAnalysisById } from '../api.js';
import { useNavigate } from 'react-router-dom';
import { useResults } from '../context/ResultContext.jsx';
import { useAuth } from '../context/AuthContext.jsx';

export default function HistoryPage({ showToast }) {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeLoadingId, setActiveLoadingId] = useState(null);
  const [activeDeletingId, setActiveDeletingId] = useState(null);
  const [error, setError] = useState(null);
  const [showClearModal, setShowClearModal] = useState(false);
  const [isDeletingAll, setIsDeletingAll] = useState(false);
  const navigate = useNavigate();
  const { setAnalysisResult } = useResults();
  const { userEmail, isProUser } = useAuth();

  const loadHistory = () => {
    setLoading(true);
    getHistory()
      .then(data => {
        // Guarantee newest first sorting in frontend
        const sorted = (data || []).sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
        setHistory(sorted);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setError(err.message);
        setLoading(false);
      });
  };

  useEffect(() => {
    loadHistory();
  }, [userEmail]); // Reload history if active user changes

  const handleClearHistory = async () => {
    setIsDeletingAll(true);
    try {
      await clearHistory();
      setHistory([]);
      setShowClearModal(false);
      if (showToast) showToast('All history cleared permanently');
    } catch (err) {
      if (showToast) showToast('Failed to clear history: ' + err.message);
    } finally {
      setIsDeletingAll(false);
    }
  };

  const handleDeleteRecord = async (e, id) => {
    e.stopPropagation(); // Avoid triggering card view clicks
    setActiveDeletingId(id);
    try {
      await deleteAnalysisById(id);
      setHistory(prev => prev.filter(item => item.id !== id));
      if (showToast) showToast('Report deleted successfully');
    } catch (err) {
      if (showToast) showToast('Failed to delete report: ' + err.message);
    } finally {
      setActiveDeletingId(null);
    }
  };

  const handleViewDashboard = async (id) => {
    setActiveLoadingId(id);
    try {
      const entry = await fetchAnalysisById(id);
      if (entry && entry.result) {
        // Hydrate global context
        const rawRes = entry.result;
        const mappedRewrites = (rawRes.rewritten_bullets || []).map((s, i) => ({
          index: i + 1,
          original: s.before || s,
          rewritten: s.after || s,
        }));

        setAnalysisResult(
          rawRes, 
          { 
            rewrites: mappedRewrites, 
            totalWeak: rawRes.rewritten_bullets?.length || 0 
          }
        );
        navigate('/results');
      } else {
        throw new Error('Analysis record is incomplete or corrupted.');
      }
    } catch (err) {
      if (showToast) showToast('Failed to load dashboard: ' + err.message);
    } finally {
      setActiveLoadingId(null);
    }
  };

  const getScoreColor = (score) => {
    if (score >= 80) return { bg: 'bg-green-50 text-green-700 border-green-100', text: 'Exceptional' };
    if (score >= 60) return { bg: 'bg-blue-50 text-blue-700 border-blue-100', text: 'Strong' };
    if (score >= 40) return { bg: 'bg-orange-50 text-orange-700 border-orange-100', text: 'Moderate' };
    return { bg: 'bg-red-50 text-red-700 border-red-100', text: 'Weak' };
  };

  return (
    <div className="min-h-screen bg-slate-50/50 py-24 px-6 selection:bg-blue-100 selection:text-blue-600">
      <div className="max-w-5xl mx-auto">
        
        {/* Upper Header */}
        <header className="mb-16 flex flex-col md:flex-row justify-between items-start md:items-center gap-8 bg-white border border-slate-100 p-8 rounded-[2.5rem] shadow-sm">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 text-[10px] font-black tracking-[0.2em] text-blue-600 uppercase bg-blue-50/80 rounded-xl border border-blue-100/50">
               <span className="material-icons-outlined text-xs animate-pulse">history</span>
               Security-Verified Activity Logs
            </div>
            <h1 className="text-4xl font-black text-slate-900 tracking-tight">Analysis History</h1>
            <p className="text-sm text-slate-500 font-medium max-w-lg leading-relaxed">
              Track your ATS score progress, match trends, and review past iterations under your account.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full md:w-auto">
            {userEmail ? (
              <div className="px-5 py-3 bg-slate-50 border border-slate-100 rounded-2xl flex items-center gap-3">
                <span className="w-2.5 h-2.5 bg-green-500 rounded-full animate-pulse" />
                <div className="text-left">
                  <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Active Profile</div>
                  <div className="text-xs font-bold text-slate-700">{userEmail}</div>
                </div>
                {isProUser && (
                  <span className="px-2 py-0.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-[8px] font-black text-white uppercase rounded-md tracking-widest ml-1 shadow-sm">
                    PRO
                  </span>
                )}
              </div>
            ) : (
              <div className="px-5 py-3 bg-amber-50/50 border border-amber-100 rounded-2xl flex items-center gap-3">
                <span className="material-icons-outlined text-amber-500 text-sm">lock</span>
                <div className="text-left">
                  <div className="text-[9px] font-black text-amber-600 uppercase tracking-widest leading-none mb-1">Local Session Only</div>
                  <div className="text-xs font-bold text-slate-600">Sign in to back up data</div>
                </div>
              </div>
            )}

            {history.length > 0 && !loading && (
              <button 
                onClick={() => setShowClearModal(true)}
                className="flex items-center justify-center gap-2 px-6 py-4 bg-red-50 hover:bg-red-100 border border-red-100 text-red-600 font-black text-[10px] uppercase tracking-widest rounded-2xl transition-all shadow-sm active:scale-95 whitespace-nowrap"
              >
                <span className="material-icons-outlined text-sm">delete_sweep</span>
                Clear History
              </button>
            )}
          </div>
        </header>

        {/* Content Body */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-32 bg-white border border-slate-100 rounded-[3rem] shadow-sm">
             <div className="w-10 h-10 border-4 border-slate-100 border-t-blue-600 rounded-full animate-spin mb-6" />
             <div className="text-slate-400 font-black uppercase tracking-widest text-xs">Retrieving session database...</div>
          </div>
        ) : error ? (
          <div className="p-8 bg-red-50 text-red-600 border border-red-100 rounded-[2.5rem] font-bold text-sm flex items-center gap-4 shadow-sm animate-in fade-in">
            <span className="material-icons-outlined">error_outline</span>
            Failed to sync history: {error}
          </div>
        ) : history.length === 0 ? (
          <div className="text-center py-24 bg-white border border-slate-100 rounded-[3rem] shadow-lg shadow-slate-200/20 max-w-3xl mx-auto animate-in fade-in zoom-in-95 duration-500">
            <div className="w-20 h-20 bg-slate-50 border border-slate-100 rounded-full flex items-center justify-center mx-auto mb-8 text-slate-300">
               <span className="material-icons-outlined text-4xl">inbox</span>
            </div>
            <h3 className="text-2xl font-black text-slate-900 mb-3 tracking-tight">No Resume Analyses Yet</h3>
            <p className="text-slate-500 mb-10 font-medium max-w-md mx-auto leading-relaxed">
              Your generated score reports, gap analytics, and AI phrasing rewrites will populate here for quick comparison.
            </p>
            <button 
              onClick={() => navigate('/analyze')}
              className="px-10 py-5 bg-blue-600 hover:bg-blue-700 text-white font-black text-xs uppercase tracking-[0.2em] rounded-2xl shadow-xl shadow-blue-500/20 hover:shadow-blue-500/30 active:scale-95 transition-all"
            >
              Start First Precision Analysis
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {history.map((record, i) => {
              const scoreMeta = getScoreColor(record.score);
              return (
                <div 
                  key={record.id || i} 
                  onClick={() => handleViewDashboard(record.id)}
                  className="group relative p-8 bg-white border border-slate-100 hover:border-blue-200 rounded-[2.5rem] shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-8 animate-in fade-in slide-in-from-bottom-4"
                  style={{ animationDelay: `${i * 80}ms` }}
                >
                  <div className="flex-1 space-y-4">
                    <div className="flex flex-wrap items-center gap-4">
                      <div className="w-11 h-11 rounded-2xl bg-slate-50 group-hover:bg-blue-600 group-hover:text-white text-slate-400 flex items-center justify-center transition-colors">
                         <span className="material-icons-outlined text-lg">description</span>
                      </div>
                      <div>
                        <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Generated At</div>
                        <div className="text-sm font-bold text-slate-800">
                          {new Date(record.timestamp).toLocaleString(undefined, {
                            year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
                          })}
                        </div>
                      </div>
                    </div>
                    
                    <p className="text-slate-500 text-sm font-medium leading-relaxed max-w-2xl line-clamp-2">
                      {record.summary || 'Resume analysis completed successfully with precise ATS algorithm checks.'}
                    </p>
                  </div>

                  <div className="flex items-center gap-6 self-end md:self-auto">
                    {/* Score badge */}
                    <div className={`px-4 py-2 border rounded-2xl text-center min-w-[100px] ${scoreMeta.bg}`}>
                      <div className="text-2xl font-black tracking-tighter leading-none mb-1">{record.score}%</div>
                      <div className="text-[8px] font-black uppercase tracking-widest">{scoreMeta.text}</div>
                    </div>

                    {/* View Report & Trash actions */}
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={() => handleViewDashboard(record.id)}
                        disabled={activeLoadingId === record.id}
                        className="p-3 bg-slate-50 hover:bg-blue-50 text-slate-400 hover:text-blue-600 rounded-xl transition-all"
                        title="View Full Report"
                      >
                        {activeLoadingId === record.id ? (
                          <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                        ) : (
                          <span className="material-icons-outlined text-xl leading-none">arrow_forward</span>
                        )}
                      </button>

                      <button 
                        onClick={(e) => handleDeleteRecord(e, record.id)}
                        disabled={activeDeletingId === record.id}
                        className="p-3 bg-slate-50 hover:bg-red-50 text-slate-400 hover:text-red-600 rounded-xl transition-all"
                        title="Delete Report"
                      >
                        {activeDeletingId === record.id ? (
                          <div className="w-5 h-5 border-2 border-red-600 border-t-transparent rounded-full animate-spin" />
                        ) : (
                          <span className="material-icons-outlined text-xl leading-none">delete</span>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Clear All Confirmation Modal */}
        {showClearModal && (
          <div className="fixed inset-0 z-[1100] flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
            <div className="bg-white rounded-[2.5rem] p-10 max-w-md w-full shadow-2xl border border-slate-100 animate-in zoom-in-95 duration-300">
              <div className="w-16 h-16 bg-red-50 text-red-600 rounded-3xl flex items-center justify-center mb-8">
                <span className="material-icons-outlined text-3xl">warning</span>
              </div>
              <h3 className="text-2xl font-black text-slate-900 mb-4 tracking-tight">Clear all history?</h3>
              <p className="text-slate-500 font-medium leading-relaxed mb-10">
                This will permanently delete all your analysis records. This operation is fully permanent and cannot be reversed.
              </p>
              <div className="flex gap-4">
                <button 
                  onClick={() => setShowClearModal(false)}
                  disabled={isDeletingAll}
                  className="flex-1 px-6 py-4 bg-slate-50 text-slate-600 font-black text-xs uppercase tracking-widest rounded-2xl hover:bg-slate-100 transition-all disabled:opacity-50"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleClearHistory}
                  disabled={isDeletingAll}
                  className="flex-1 px-6 py-4 bg-red-600 text-white font-black text-xs uppercase tracking-widest rounded-2xl shadow-xl shadow-red-100 hover:bg-red-700 transition-all active:scale-95 flex items-center justify-center gap-2 group disabled:opacity-50"
                >
                  {isDeletingAll ? 'Clearing...' : 'Yes, Delete All'}
                  {!isDeletingAll && <span className="material-icons-outlined text-sm group-hover:translate-x-1 transition-transform">delete</span>}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
