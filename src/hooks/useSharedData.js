import { useState, useEffect, useCallback, useRef } from 'react';
import { useDashboard } from '@/contexts/DashboardContext.jsx';

// Cache global para dados compartilhados
const dataCache = {
  avaliacoes: {
    data: null,
    timestamp: null,
    loading: false,
    error: null
  },
  dashboardStats: {
    data: null,
    timestamp: null,
    loading: false,
    error: null
  },
  filaData: {
    data: null,
    timestamp: null,
    loading: false,
    error: null
  }
};

// Tempo de cache em milissegundos (5 minutos)
const CACHE_DURATION = 5 * 60 * 1000;

export const useSharedData = () => {
  const { barbeariaAtual } = useDashboard();
  const [subscribers, setSubscribers] = useState(new Set());
  const subscribersRef = useRef(new Set());

  // Função para notificar todos os subscribers
  const notifySubscribers = useCallback(() => {
    subscribersRef.current.forEach(callback => callback());
  }, []);

  // Função para adicionar subscriber
  const addSubscriber = useCallback((callback) => {
    subscribersRef.current.add(callback);
    return () => {
      subscribersRef.current.delete(callback);
    };
  }, []);

  // Verificar se o cache está válido
  const isCacheValid = useCallback((cacheKey) => {
    const cache = dataCache[cacheKey];
    if (!cache || !cache.timestamp) return false;
    
    const now = Date.now();
    return (now - cache.timestamp) < CACHE_DURATION;
  }, []);

  // Carregar avaliações
  const loadAvaliacoes = useCallback(async (barbeariaId, userRole) => {
    const cacheKey = `avaliacoes_${barbeariaId}_${userRole}`;
    
    // Se já está carregando, aguardar
    if (dataCache.avaliacoes.loading) {
      return new Promise((resolve) => {
        const checkLoading = () => {
          if (!dataCache.avaliacoes.loading) {
            resolve(dataCache.avaliacoes.data);
          } else {
            setTimeout(checkLoading, 100);
          }
        };
        checkLoading();
      });
    }

    // Se cache válido, retornar dados em cache
    if (isCacheValid('avaliacoes')) {
      return dataCache.avaliacoes.data;
    }

    // Carregar dados da API
    try {
      dataCache.avaliacoes.loading = true;
      dataCache.avaliacoes.error = null;

      const response = await fetch(`/api/avaliacoes?barbearia_id=${barbeariaId}&user_role=${userRole}`);
      
      if (!response.ok) {
        throw new Error('Erro ao carregar avaliações');
      }

      const data = await response.json();
      
      // Atualizar cache
      dataCache.avaliacoes.data = data;
      dataCache.avaliacoes.timestamp = Date.now();
      
      // Notificar subscribers
      notifySubscribers();
      
      return data;
    } catch (error) {
      dataCache.avaliacoes.error = error.message;
      throw error;
    } finally {
      dataCache.avaliacoes.loading = false;
    }
  }, [isCacheValid, notifySubscribers]);

  // Carregar estatísticas do dashboard
  const loadDashboardStats = useCallback(async (userRole, barbeariaId = null) => {
    const cacheKey = `stats_${userRole}_${barbeariaId || 'all'}`;
    
    // Se já está carregando, aguardar
    if (dataCache.dashboardStats.loading) {
      return new Promise((resolve) => {
        const checkLoading = () => {
          if (!dataCache.dashboardStats.loading) {
            resolve(dataCache.dashboardStats.data);
          } else {
            setTimeout(checkLoading, 100);
          }
        };
        checkLoading();
      });
    }

    // Se cache válido, retornar dados em cache
    if (isCacheValid('dashboardStats')) {
      return dataCache.dashboardStats.data;
    }

    // Carregar dados da API
    try {
      dataCache.dashboardStats.loading = true;
      dataCache.dashboardStats.error = null;

      let url = `/api/dashboard/stats?user_role=${userRole}`;
      if (barbeariaId) {
        url += `&barbearia_id=${barbeariaId}`;
      }

      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error('Erro ao carregar estatísticas');
      }

      const data = await response.json();
      
      // Atualizar cache
      dataCache.dashboardStats.data = data;
      dataCache.dashboardStats.timestamp = Date.now();
      
      // Notificar subscribers
      notifySubscribers();
      
      return data;
    } catch (error) {
      dataCache.dashboardStats.error = error.message;
      throw error;
    } finally {
      dataCache.dashboardStats.loading = false;
    }
  }, [isCacheValid, notifySubscribers]);

  // Carregar dados da fila
  const loadFilaData = useCallback(async (barbeariaId) => {
    if (!barbeariaId) return null;
    
    // Se já está carregando, aguardar
    if (dataCache.filaData.loading) {
      return new Promise((resolve) => {
        const checkLoading = () => {
          if (!dataCache.filaData.loading) {
            resolve(dataCache.filaData.data);
          } else {
            setTimeout(checkLoading, 100);
          }
        };
        checkLoading();
      });
    }

    // Se cache válido, retornar dados em cache
    if (isCacheValid('filaData')) {
      return dataCache.filaData.data;
    }

    // Carregar dados da API
    try {
      dataCache.filaData.loading = true;
      dataCache.filaData.error = null;

      const response = await fetch(`/api/fila/barbeiro?barbearia_id=${barbeariaId}`);
      
      if (!response.ok) {
        throw new Error('Erro ao carregar dados da fila');
      }

      const data = await response.json();
      
      // Atualizar cache
      dataCache.filaData.data = data;
      dataCache.filaData.timestamp = Date.now();
      
      // Notificar subscribers
      notifySubscribers();
      
      return data;
    } catch (error) {
      dataCache.filaData.error = error.message;
      throw error;
    } finally {
      dataCache.filaData.loading = false;
    }
  }, [isCacheValid, notifySubscribers]);

  // Invalidar cache
  const invalidateCache = useCallback((cacheKey = null) => {
    if (cacheKey) {
      if (dataCache[cacheKey]) {
        dataCache[cacheKey].timestamp = null;
        dataCache[cacheKey].data = null;
      }
    } else {
      // Invalidar todos os caches
      Object.keys(dataCache).forEach(key => {
        dataCache[key].timestamp = null;
        dataCache[key].data = null;
      });
    }
    
    // Notificar subscribers
    notifySubscribers();
  }, [notifySubscribers]);

  // Hook para usar dados compartilhados
  const useSharedAvaliacoes = useCallback((barbeariaId, userRole) => {
    const [data, setData] = useState(dataCache.avaliacoes.data);
    const [loading, setLoading] = useState(dataCache.avaliacoes.loading);
    const [error, setError] = useState(dataCache.avaliacoes.error);

    useEffect(() => {
      const unsubscribe = addSubscriber(() => {
        setData(dataCache.avaliacoes.data);
        setLoading(dataCache.avaliacoes.loading);
        setError(dataCache.avaliacoes.error);
      });

      // Carregar dados se necessário
      if (!isCacheValid('avaliacoes') && !dataCache.avaliacoes.loading) {
        loadAvaliacoes(barbeariaId, userRole).catch(console.error);
      }

      return unsubscribe;
    }, [barbeariaId, userRole, addSubscriber, isCacheValid, loadAvaliacoes]);

    return {
      avaliacoes: data,
      loading,
      error,
      refetch: () => {
        invalidateCache('avaliacoes');
        return loadAvaliacoes(barbeariaId, userRole);
      }
    };
  }, [addSubscriber, isCacheValid, loadAvaliacoes, invalidateCache]);

  const useSharedDashboardStats = useCallback((userRole, barbeariaId = null) => {
    const [data, setData] = useState(dataCache.dashboardStats.data);
    const [loading, setLoading] = useState(dataCache.dashboardStats.loading);
    const [error, setError] = useState(dataCache.dashboardStats.error);

    useEffect(() => {
      const unsubscribe = addSubscriber(() => {
        setData(dataCache.dashboardStats.data);
        setLoading(dataCache.dashboardStats.loading);
        setError(dataCache.dashboardStats.error);
      });

      // Carregar dados se necessário
      if (!isCacheValid('dashboardStats') && !dataCache.dashboardStats.loading) {
        loadDashboardStats(userRole, barbeariaId).catch(console.error);
      }

      return unsubscribe;
    }, [userRole, barbeariaId, addSubscriber, isCacheValid, loadDashboardStats]);

    return {
      stats: data,
      loading,
      error,
      refetch: () => {
        invalidateCache('dashboardStats');
        return loadDashboardStats(userRole, barbeariaId);
      }
    };
  }, [addSubscriber, isCacheValid, loadDashboardStats, invalidateCache]);

  const useSharedFilaData = useCallback((barbeariaId) => {
    const [data, setData] = useState(dataCache.filaData.data);
    const [loading, setLoading] = useState(dataCache.filaData.loading);
    const [error, setError] = useState(dataCache.filaData.error);

    useEffect(() => {
      const unsubscribe = addSubscriber(() => {
        setData(dataCache.filaData.data);
        setLoading(dataCache.filaData.loading);
        setError(dataCache.filaData.error);
      });

      // Carregar dados se necessário
      if (barbeariaId && !isCacheValid('filaData') && !dataCache.filaData.loading) {
        loadFilaData(barbeariaId).catch(console.error);
      }

      return unsubscribe;
    }, [barbeariaId, addSubscriber, isCacheValid, loadFilaData]);

    return {
      filaData: data,
      loading,
      error,
      refetch: () => {
        invalidateCache('filaData');
        return loadFilaData(barbeariaId);
      }
    };
  }, [addSubscriber, isCacheValid, loadFilaData, invalidateCache]);

  return {
    useSharedAvaliacoes,
    useSharedDashboardStats,
    useSharedFilaData,
    invalidateCache,
    loadAvaliacoes,
    loadDashboardStats,
    loadFilaData
  };
}; 