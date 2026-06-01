import React, { createContext, useContext, useState, useEffect } from 'react';
import { verifySession } from '../api.js';

const AuthContext = createContext(null);

export function AuthProvider({ children, onLogoutCallback }) {
  const [loading, setLoading] = useState(true);
  const [userEmail, setUserEmail] = useState(null);
  const [userToken, setUserToken] = useState(null);
  const [plan, setPlanState] = useState('free');

  const isProUser = plan === 'pro';

  useEffect(() => {
    async function initAuth() {
      try {
        // Hydrate from localStorage
        const storedEmail = localStorage.getItem('user_email');
        const storedToken = localStorage.getItem('user_token');
        const storedPlan  = localStorage.getItem('rai_plan') || 'free';
        
        if (storedEmail) setUserEmail(storedEmail);
        if (storedToken) setUserToken(storedToken);
        setPlanState(storedPlan);

        // If we have a token, verify it with the backend immediately
        if (storedToken) {
          try {
            const data = await verifySession();
            if (data.success) {
              if (data.email) {
                setUserEmail(data.email);
                localStorage.setItem('user_email', data.email);
              }
              if (data.plan) {
                setPlanState(data.plan);
                localStorage.setItem('rai_plan', data.plan);
              }
            }
          } catch (apiErr) {
            console.warn('Session verification failed on startup:', apiErr.message);
            // If it's a 401, the interceptor in api.js will handle logout logic, 
            // but we can also safely reset here if needed.
          }
        }
      } catch (err) {
        console.error('Auth initialization error:', err);
      } finally {
        setLoading(false);
      }
    }

    initAuth();
  }, []);

  const login = async (data) => {
    if (data.email) {
      setUserEmail(data.email);
      localStorage.setItem('user_email', data.email);
    }
    setUserToken(data.token);
    localStorage.setItem('user_token', data.token);
    
    // Sync plan immediately from backend if no plan was provided in input
    if (data.plan) {
      setPlanState(data.plan);
      localStorage.setItem('rai_plan', data.plan);
    } else {
      try {
        const verified = await verifySession();
        if (verified.success && verified.plan) {
          setPlanState(verified.plan);
          localStorage.setItem('rai_plan', verified.plan);
        }
      } catch (err) {
        console.warn('[AuthContext] Plan sync failed:', err.message);
      }
    }
  };

  const logout = () => {
    setUserToken(null);
    setUserEmail(null);
    setPlanState('free');
    localStorage.removeItem('user_token');
    localStorage.removeItem('user_email');
    localStorage.removeItem('rai_plan');
    if (onLogoutCallback) onLogoutCallback();
  };

  const setPlan = (newPlan) => {
    const p = newPlan || 'free';
    setPlanState(p);
    localStorage.setItem('rai_plan', p);
  };

  return (
    <AuthContext.Provider value={{ loading, userEmail, userToken, plan, isProUser, login, logout, setPlan }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
