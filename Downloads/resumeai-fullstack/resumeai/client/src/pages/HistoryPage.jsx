import React, { useState, useEffect } from 'react';
import { fetchHistory as getHistory, clearHistory, fetchAnalysisById } from '../api.js';
import { useNavigate } from 'react-router-dom';
import { useResults } from '../context/ResultContext.jsx';

export default function HistoryPage({ showToast }) {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeLoadingId, setActiveLoadingId] = useState(null);
  const [error, setError] = useState(null);
  const [showClearModal, setShowClearModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const navigate = useNavigate();
  const { setAnalysisResult } = useResults();

  const loadHistory = () => {
    setLoading(true);
    getHistory()
      .then(data => {
        setHistory(data || []);
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
  }, []);

  const handleClearHistory = async () => {
    setIsDeleting(true);
    try {
      await clearHistory();
      setHistory([]);
      setShowClearModal(false);
      if (showToast) showToast('All history cleared permanently');
    } catch (err) {
      alert('Failed to clear history: ' + err.message);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleViewDashboard = async (id) => {
    setActiveLoadingId(id);
    try {
      const entry = await fetchAnalysisById(id);
      if (entry && entry.result) {
        // Hydrate the global context so ResultsPage can render it
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

  return (
    <div className="min-h-screen bg-slate-50/50 py-20 px-6">
      <div className="max-w-4xl mx-auto">
        <header className="mb-16 flex flex-col md:flex-row justify-between items-start md:items-end gap-8">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 mb-6 text-[10px] font-black tracking-[0.2em] text-blue-600 uppercase bg-blue-50 rounded-md border border-blue-100">
               <span className="material-icons-outlined text-xs">history</span>
               Activity Logs
            </div>
            <h1 className="text-4xl font-black text-slate-900 tracking-tight mb-2">Analysis History</h1>
            <p className="text-slate-500 font-medium">Review and track your resume optimization progress over time.</p>
          </div>
          
          {history.length > 0 && !loading && (
            <button 
              onClick={() => setShowClearModal(true)}
              className="flex items-center gap-3 px-6 py-3 bg-white border border-red-100 text-red-600 font-black text-[10px] uppercase tracking-widest rounded-xl hover:bg-red-50 transition-all shadow-sm active:scale-95"
            >
              <span className="material-icons-outlined text-sm">delete_sweep</span>
              Clear All History
            </button>
          )}
        </header>
        
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 bg-white border border-slate-200 rounded-[3rem] shadow-sm">
             <div className="w-8 h-8 border-4 border-slate-100 border-t-blue-600 rounded-full animate-spin mb-4" />
             <div className="text-slate-400 font-bold uppercase tracking-widest text-xs">Retrieving session history...</div>
          </div>
        ) : error ? (
          <div className="p-8 bg-red-50 text-red-600 border border-red-100 rounded-[2rem] font-bold text-sm flex items-center gap-4">
            <span className="material-icons-outlined">error_outline</span>
            Critical Error: {error}
          </div>
        ) : history.length === 0 ? (
          <div className="text-center py-24 bg-white border border-slate-200 rounded-[3rem] shadow-sm">
            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6 text-slate-300">
               <span className="material-icons-outlined text-3xl">inbox</span>
            </div>
            <h3 className="text-xl font-black text-slate-900 mb-2">No analyses history yet</h3>
            <p className="text-slate-500 mb-8 font-medium">You haven't run any resume analyses in this account.</p>
            <button 
              onClick={() => navigate('/analyze')}
              className="px-8 py-4 bg-blue-600 text-white font-black text-xs uppercase tracking-widest rounded-2xl shadow-xl shadow-blue-100 active:scale-95 transition-all"
            >
              Start First Analysis
            </button>
          </div>
        ) : (
          <div className="grid gap-6">
            {history.map((record, i) => (
              <div 
                key={record.id || i} 
                className="group p-8 bg-white border border-slate-100 rounded-[2.5rem] shadow-sm hover:shadow-xl hover:border-blue-100 transition-all duration-300"
              >
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 mb-8">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-blue-600 group-hover:text-white transition-all">
                       <span className="material-icons-outlined">description</span>
                    </div>
                    <div>
                      <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Generated On</div>
                      <div className="text-sm font-black text-slate-900">
                        {new Date(record.timestamp).toLocaleString(undefined, {
                          year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
                        })}
                      </div>
                    </div>
                  </div>
                  <div className="px-6 py-2 bg-blue-600 text-white font-black text-sm rounded-xl shadow-lg shadow-blue-100">
                    Match: {record.score}%
                  </div>
                </div>
                
                <p className="text-slate-500 font-medium leading-relaxed mb-6">
                  {record.summary || (record.resume?.slice(0, 150) + '...') || 'Resume data processed.'}
                </p>

                <div className="flex gap-4">
                   <button 
                    onClick={() => handleViewDashboard(record.id)}
                    disabled={activeLoadingId === record.id}
                    className="flex-1 sm:flex-none px-6 py-3 bg-slate-50 text-slate-500 hover:text-blue-600 hover:bg-blue-50 font-black text-[10px] uppercase tracking-widest rounded-xl transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                   >
                     {activeLoadingId === record.id ? (
                       <>
                         <div className="w-3 h-3 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                         Loading...
                       </>
                     ) : (
                       'View Full Dashboard'
                     )}
                   </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Clear History Modal */}
        {showClearModal && (
          <div className="fixed inset-0 z-[1100] flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
            <div className="bg-white rounded-[2.5rem] p-10 max-w-md w-full shadow-2xl border border-slate-100 animate-in zoom-in-95 duration-300">
              <div className="w-16 h-16 bg-red-50 text-red-600 rounded-3xl flex items-center justify-center mb-8">
                <span className="material-icons-outlined text-3xl">warning</span>
              </div>
              <h3 className="text-2xl font-black text-slate-900 mb-4 tracking-tight">Clear all history?</h3>
              <p className="text-slate-500 font-medium leading-relaxed mb-10">
                This will permanently delete all your analysis records from our servers. This action cannot be undone.
              </p>
              <div className="flex gap-4">
                <button 
                  onClick={() => setShowClearModal(false)}
                  disabled={isDeleting}
                  className="flex-1 px-6 py-4 bg-slate-50 text-slate-600 font-black text-xs uppercase tracking-widest rounded-2xl hover:bg-slate-100 transition-all disabled:opacity-50"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleClearHistory}
                  disabled={isDeleting}
                  className="flex-1 px-6 py-4 bg-red-600 text-white font-black text-xs uppercase tracking-widest rounded-2xl shadow-xl shadow-red-100 hover:bg-red-700 transition-all active:scale-95 flex items-center justify-center gap-2 group disabled:opacity-50"
                >
                  {isDeleting ? 'Deleting...' : 'Yes, Clear All'}
                  {!isDeleting && <span className="material-icons-outlined text-sm group-hover:translate-x-1 transition-transform">delete</span>}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
