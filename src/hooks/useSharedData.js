import { useState, useEffect, useCallback, useRef } from 'react';
import { useDashboard } from '@/contexts/DashboardContext.jsx';
import { CookieManager } from '@/utils/cookieManager.js';

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

  // Função para obter headers de autorização
  const getAuthHeaders = () => {
    const token = CookieManager.getAdminToken();
    return {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    };
  };

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
    const isValid = (now - cache.timestamp) < CACHE_DURATION;
    
    console.log(`🔍 Cache ${cacheKey}:`, {
      timestamp: cache.timestamp,
      now,
      diff: now - cache.timestamp,
      duration: CACHE_DURATION,
      isValid
    });
    
    return isValid;
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

      const response = await fetch(`/api/avaliacoes?barbearia_id=${barbeariaId}&user_role=${userRole}`, {
        headers: getAuthHeaders()
      });
      
      if (!response.ok) {
        throw new Error('Erro ao carregar avaliações');
      }

      const responseData = await response.json();
      
      // Extrair dados da resposta do backend
      const data = responseData.success ? responseData.data : responseData;
      
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
    
    console.log('🔄 loadDashboardStats chamado:', { userRole, barbeariaId, cacheKey });
    
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

      // Usar endpoints que existem no backend
      let data = {};
      
      if (userRole === 'barbeiro') {
        // Para barbeiros, usar o endpoint da fila que já existe
        const response = await fetch(`/api/fila/${barbeariaId}`, {
          headers: getAuthHeaders()
        });
        
        if (!response.ok) {
          throw new Error('Erro ao carregar dados da fila');
        }

        const responseData = await response.json();
        const filaData = responseData.data || responseData;
        data = filaData.estatisticas || {};
        
      } else if (userRole === 'gerente') {
        // Para gerentes, usar o endpoint de relatórios que existe
        const response = await fetch(`/api/relatorios/dashboard?barbearia_id=${barbeariaId}`, {
          headers: getAuthHeaders()
        });
        
        if (!response.ok) {
          throw new Error('Erro ao carregar relatórios');
        }

        const responseData = await response.json();
        data = responseData.data || responseData;
        
      } else {
        // Para admin, usar o endpoint de relatórios gerais
        const response = await fetch('/api/relatorios/dashboard', {
          headers: getAuthHeaders()
        });
        
        if (!response.ok) {
          throw new Error('Erro ao carregar relatórios');
        }

        const responseData = await response.json();
        data = responseData.data || responseData;
      }
      
      // Atualizar cache
      dataCache.dashboardStats.data = data;
      dataCache.dashboardStats.timestamp = Date.now();
      dataCache.dashboardStats.loading = false; // <-- Atualize aqui!
      
      console.log('✅ Dashboard stats salvos no cache:', {
        data,
        timestamp: dataCache.dashboardStats.timestamp,
        loading: dataCache.dashboardStats.loading
      });
      
      // Notificar subscribers
      notifySubscribers();
      
      return data;
    } catch (error) {
      dataCache.dashboardStats.error = error.message;
      throw error;
    } // Remover o finally que atualizava loading = false
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

      // Carregar dados da fila
      const filaResponse = await fetch(`/api/fila/${barbeariaId}`, {
        headers: getAuthHeaders()
      });
      
      if (!filaResponse.ok) {
        console.warn('⚠️ Erro ao carregar dados da fila:', filaResponse.status, filaResponse.statusText);
        // Não fazer logout para erros 403/401, apenas retornar dados vazios
        if (filaResponse.status === 403 || filaResponse.status === 401) {
          console.log('🔄 Retornando dados vazios devido a erro de autorização');
          return {
            clientes: [],
            estatisticas: {},
            statusBarbeiro: {}
          };
        }
        throw new Error('Erro ao carregar dados da fila');
      }

      const filaData = await filaResponse.json();
      
      // Carregar status do barbeiro
      let statusBarbeiro = {};
      let statusAtual = null;
      let barbeiro = null;
      
      try {
        console.log('🔄 Carregando status do barbeiro...');
        const statusResponse = await fetch(`/api/users/barbeiros/meu-status?barbearia_id=${barbeariaId}`, {
          headers: getAuthHeaders()
        });
        
        console.log('📡 Status response:', {
          ok: statusResponse.ok,
          status: statusResponse.status,
          statusText: statusResponse.statusText
        });
        
        if (statusResponse.ok) {
          const statusData = await statusResponse.json();
          console.log('📡 Status data raw:', statusData);
          
          // Transformar a estrutura para ser indexada por barbeariaId
          if (statusData.success && statusData.data) {
            console.log('📡 Status data detalhado:', statusData.data);
            
            // Usar o barbeariaId do parâmetro da função se não estiver na resposta
            const barbeariaIdFromData = statusData.data.barbearia_id;
            const barbeariaIdToUse = barbeariaIdFromData || barbeariaId;
            
            console.log('🔍 BarbeariaId para usar:', {
              fromData: barbeariaIdFromData,
              fromParam: barbeariaId,
              final: barbeariaIdToUse
            });
            
            // Verificar se temos status_atual na resposta
            statusAtual = statusData.data.status_atual;
            barbeiro = statusData.data.barbeiro;
            
            const ativoValue = statusAtual?.ativo || barbeiro?.ativo || false;
            const disponivelValue = statusAtual?.disponivel || barbeiro?.disponivel || false;
            
            console.log('🔍 Valores extraídos:', {
              statusAtualAtivo: statusAtual?.ativo,
              barbeiroAtivo: barbeiro?.ativo,
              ativoFinal: ativoValue,
              statusAtualDisponivel: statusAtual?.disponivel,
              barbeiroDisponivel: barbeiro?.disponivel,
              disponivelFinal: disponivelValue
            });
            
            statusBarbeiro = {
              [barbeariaIdToUse]: {
                ativo: ativoValue,
                disponivel: disponivelValue,
                barbeiro_id: barbeiro?.id || statusData.data.barbeiro_id,
                barbearia_id: statusAtual?.barbearia_id || barbeiro?.barbearia_id || barbeariaId
              }
            };
          } else {
            statusBarbeiro = {};
          }
          
          console.log('✅ Status do barbeiro carregado e transformado:', statusBarbeiro);
          console.log('🔍 Detalhes do status_atual:', statusAtual);
          console.log('🔍 Detalhes do barbeiro:', barbeiro);
          console.log('🔍 Estrutura completa do statusBarbeiro:', JSON.stringify(statusBarbeiro, null, 2));
        } else {
          console.warn('⚠️ Erro ao carregar status do barbeiro:', statusResponse.status);
        }
      } catch (statusError) {
        console.warn('❌ Erro ao carregar status do barbeiro:', statusError);
        statusBarbeiro = {};
      }

      // Combinar dados da fila com status do barbeiro
      const data = {
        ...(filaData.success ? filaData.data : filaData),
        statusBarbeiro
      };
      
      // Atualizar cache
      dataCache.filaData.data = data;
      dataCache.filaData.timestamp = Date.now();
      dataCache.filaData.loading = false; // <-- Atualizar aqui!
      
      console.log('✅ Fila data salvos no cache:', {
        data,
        timestamp: dataCache.filaData.timestamp,
        loading: dataCache.filaData.loading
      });
      
      // Notificar subscribers
      notifySubscribers();
      
      return data;
    } catch (error) {
      console.warn('⚠️ Erro ao carregar dados da fila:', error);
      dataCache.filaData.error = error.message;
      dataCache.filaData.loading = false;
      
      // Não fazer logout para erros de fila, apenas retornar dados vazios
      if (error.message.includes('403') || error.message.includes('401')) {
        console.log('🔄 Retornando dados vazios devido a erro de autorização');
        return {
          clientes: [],
          estatisticas: {},
          statusBarbeiro: {}
        };
      }
      
      throw error;
    }
  }, [isCacheValid, notifySubscribers]);

  // Invalidar cache
  const invalidateCache = useCallback((cacheKey = null) => {
    console.log('🗑️ invalidateCache chamado:', { cacheKey, allCaches: Object.keys(dataCache) });
    
    if (cacheKey) {
      if (dataCache[cacheKey]) {
        console.log(`🗑️ Invalidando cache específico: ${cacheKey}`);
        dataCache[cacheKey].timestamp = null;
        dataCache[cacheKey].data = null;
      }
    } else {
      // Invalidar todos os caches
      console.log('🗑️ Invalidando todos os caches');
      Object.keys(dataCache).forEach(key => {
        dataCache[key].timestamp = null;
        dataCache[key].data = null;
      });
    }
    
    console.log('📡 Notificando subscribers após invalidação');
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

    console.log('🎯 useSharedDashboardStats inicializado:', {
      userRole,
      barbeariaId,
      initialData: dataCache.dashboardStats.data,
      initialLoading: dataCache.dashboardStats.loading,
      initialError: dataCache.dashboardStats.error
    });

    useEffect(() => {
      const updateState = () => {
        setData(dataCache.dashboardStats.data);
        setLoading(dataCache.dashboardStats.loading);
        setError(dataCache.dashboardStats.error);
      };

      const unsubscribe = addSubscriber(updateState);

      // Atualiza imediatamente ao montar
      updateState();

      // Carregar dados se necessário
      if (!isCacheValid('dashboardStats') && !dataCache.dashboardStats.loading) {
        loadDashboardStats(userRole, barbeariaId).catch(console.error);
      }

      // Atualização automática a cada 5 minutos
      const interval = setInterval(() => {
        console.log('🔄 Atualizando dashboard stats automaticamente...');
        invalidateCache('dashboardStats');
        loadDashboardStats(userRole, barbeariaId).catch(console.error);
      }, 300000); // 5 minutos

      return () => {
        unsubscribe();
        clearInterval(interval);
      };
    }, [userRole, barbeariaId, addSubscriber, isCacheValid, loadDashboardStats, invalidateCache]);

    // Log adicional para debug do retorno
    console.log('🔄 useSharedDashboardStats retornando:', {
      stats: data,
      loading,
      error,
      dataType: typeof data,
      dataKeys: data ? Object.keys(data) : null
    });

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

    console.log('🎯 useSharedFilaData inicializado:', {
      barbeariaId,
      initialData: dataCache.filaData.data,
      initialLoading: dataCache.filaData.loading,
      initialError: dataCache.filaData.error
    });

    useEffect(() => {
      const updateState = () => {
        console.log('📡 useSharedFilaData - Subscriber notificado:', {
          data: dataCache.filaData.data,
          loading: dataCache.filaData.loading,
          error: dataCache.filaData.error
        });
        setData(dataCache.filaData.data);
        setLoading(dataCache.filaData.loading);
        setError(dataCache.filaData.error);
      };

      const unsubscribe = addSubscriber(updateState);

      // Atualiza imediatamente ao montar
      updateState();

      // Carregar dados se necessário
      if (barbeariaId && !isCacheValid('filaData') && !dataCache.filaData.loading) {
        console.log('🔄 useSharedFilaData - Carregando dados...');
        loadFilaData(barbeariaId).catch(console.error);
      }

      return unsubscribe;
    }, [barbeariaId, addSubscriber, isCacheValid, loadFilaData]);

    // Log adicional para debug do retorno
    console.log('🔄 useSharedFilaData retornando:', {
      filaData: data,
      loading,
      error,
      dataType: typeof data,
      dataKeys: data ? Object.keys(data) : null
    });

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