import { useState, useCallback } from 'react';

export const useLoading = (initialState = false) => {
  const [loading, setLoading] = useState(initialState);
  const [loadingStates, setLoadingStates] = useState({});

  // Loading geral
  const startLoading = useCallback(() => setLoading(true), []);
  const stopLoading = useCallback(() => setLoading(false), []);
  const setLoadingState = useCallback((state) => setLoading(state), []);

  // Loading específico por chave
  const startLoadingFor = useCallback((key) => {
    setLoadingStates(prev => ({ ...prev, [key]: true }));
  }, []);

  const stopLoadingFor = useCallback((key) => {
    setLoadingStates(prev => ({ ...prev, [key]: false }));
  }, []);

  const isLoadingFor = useCallback((key) => {
    return loadingStates[key] || false;
  }, [loadingStates]);

  // Wrapper para operações assíncronas
  const withLoading = useCallback(async (asyncFn, key = null) => {
    try {
      if (key) {
        startLoadingFor(key);
      } else {
        startLoading();
      }
      
      const result = await asyncFn();
      return result;
    } finally {
      if (key) {
        stopLoadingFor(key);
      } else {
        stopLoading();
      }
    }
  }, [startLoading, stopLoading, startLoadingFor, stopLoadingFor]);

  return {
    loading,
    loadingStates,
    startLoading,
    stopLoading,
    setLoadingState,
    startLoadingFor,
    stopLoadingFor,
    isLoadingFor,
    withLoading
  };
}; 