import React, { createContext, useContext, useState } from 'react';

const ResultContext = createContext();

export function ResultProvider({ children }) {
  const [atsResult, setAtsResult] = useState(null);
  const [rewriteData, setRewriteData] = useState(null);

  const setAnalysisResult = (result, rewrites) => {
    setAtsResult(result);
    setRewriteData(rewrites);
  };

  return (
    <ResultContext.Provider value={{ atsResult, rewriteData, setAnalysisResult }}>
      {children}
    </ResultContext.Provider>
  );
}

export function useResults() {
  const context = useContext(ResultContext);
  if (!context) {
    throw new Error('useResults must be used within a ResultProvider');
  }
  return context;
}
