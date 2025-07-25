import { useState, useEffect, useCallback } from 'react';
import { useFilaAPI } from './useFilaAPI.js';
import { useFila } from './useFila.js';
import { shouldUseAPI } from '@/utils/migration.js';

export const useFilaHybrid = (barbeariaId = null) => {
  const [useAPI, setUseAPI] = useState(false);
  const [apiAvailable, setApiAvailable] = useState(false);
  const [loading, setLoading] = useState(true);

  // Hooks para ambos os modos
  const apiHook = useFilaAPI(barbeariaId);
  const localStorageHook = useFila(barbeariaId);

  // Verificar disponibilidade da API
  useEffect(() => {
    const checkApiAvailability = async () => {
      try {
        setLoading(true);
        const isAvailable = await shouldUseAPI();
        setApiAvailable(isAvailable);
        setUseAPI(isAvailable);
        
        console.log(`🔍 API disponível: ${isAvailable}`);
        console.log(`📡 Usando: ${isAvailable ? 'API' : 'localStorage'}`);
      } catch (error) {
        console.warn('Erro ao verificar API:', error);
        setApiAvailable(false);
        setUseAPI(false);
      } finally {
        setLoading(false);
      }
    };

    checkApiAvailability();
  }, []);

  // Hook ativo baseado na disponibilidade da API
  const activeHook = useAPI ? apiHook : localStorageHook;

  // Função para alternar entre API e localStorage
  const toggleMode = useCallback(async () => {
    if (apiAvailable) {
      setUseAPI(!useAPI);
      console.log(`🔄 Alternando para: ${!useAPI ? 'API' : 'localStorage'}`);
    } else {
      console.warn('⚠️ API não está disponível, não é possível alternar');
    }
  }, [useAPI, apiAvailable]);

  // Função para forçar uso da API
  const forceAPI = useCallback(() => {
    if (apiAvailable) {
      setUseAPI(true);
      console.log('🔧 Forçando uso da API');
    } else {
      console.warn('⚠️ API não está disponível');
    }
  }, [apiAvailable]);

  // Função para forçar uso do localStorage
  const forceLocalStorage = useCallback(() => {
    setUseAPI(false);
    console.log('🔧 Forçando uso do localStorage');
  }, []);

  // Função para verificar status da API
  const checkApiStatus = useCallback(async () => {
    try {
      const isAvailable = await shouldUseAPI();
      setApiAvailable(isAvailable);
      
      if (useAPI && !isAvailable) {
        console.warn('⚠️ API ficou indisponível, alternando para localStorage');
        setUseAPI(false);
      }
      
      return isAvailable;
    } catch (error) {
      console.error('Erro ao verificar status da API:', error);
      return false;
    }
  }, [useAPI]);

  // Retornar dados do hook ativo + funcionalidades extras
  return {
    // Estado do hook ativo
    ...activeHook,
    
    // Estado do sistema
    useAPI,
    apiAvailable,
    loading: loading || activeHook.loading,
    
    // Funções de controle
    toggleMode,
    forceAPI,
    forceLocalStorage,
    checkApiStatus,
    
    // Informações de debug
    debug: {
      currentMode: useAPI ? 'API' : 'localStorage',
      apiAvailable,
      barbeariaId,
      timestamp: new Date().toISOString()
    }
  };
}; 