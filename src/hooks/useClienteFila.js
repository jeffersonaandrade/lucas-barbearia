// Hook especializado para clientes
// Apenas endpoints necessários para clientes

import { useState, useEffect, useCallback } from 'react';
import { filaService, barbeariasService } from '@/services/api.js';
import { CookieManager } from '@/utils/cookieManager.js';
import { useEstatisticas } from '@/hooks/useEstatisticas.js';

/**
 * Hook centralizado para gerenciar fila de clientes
 * Usa endpoints públicos e centraliza a lógica
 */
export const useClienteFila = (barbeariaId = null) => {
  const [fila, setFila] = useState([]);
  const [clienteAtual, setClienteAtual] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [barbeiros, setBarbeiros] = useState([]);
  const [barbeariaInfo, setBarbeariaInfo] = useState(null);
  const [apiStatus, setApiStatus] = useState('checking');

  // Usar hook centralizado para estatísticas
  const { estatisticas, carregarEstatisticas } = useEstatisticas(barbeariaId);

  // Carregar dados iniciais
  useEffect(() => {
    console.log('🔄 useEffect useClienteFila chamado com barbeariaId:', barbeariaId);
    
    if (!barbeariaId) {
      setError('Nenhuma barbearia selecionada.');
      setApiStatus('unavailable');
      return;
    }

    const carregarDados = async () => {
      console.log('🚀 Iniciando carregamento de dados para barbearia:', barbeariaId);
      try {
        setLoading(true);
        setError(null);
        setApiStatus('checking');

        // Carregar informações da barbearia
        try {
          const barbeariaResponse = await barbeariasService.obterBarbearia(barbeariaId);
          const barbeariaData = barbeariaResponse.data || barbeariaResponse;
          setBarbeariaInfo(barbeariaData);
        } catch (err) {
          setError('Barbearia não encontrada.');
          setApiStatus('unavailable');
          setLoading(false);
          return;
        }
        
        // Carregar barbeiros públicos
        try {
          console.log('🔄 Carregando barbeiros públicos para barbearia:', barbeariaId);
          const barbeirosResponse = await barbeariasService.listarBarbeirosPublicos(barbeariaId);
          console.log('📦 Response dos barbeiros:', barbeirosResponse);
          
          let barbeirosArray = [];
          if (barbeirosResponse.data && barbeirosResponse.data.barbeiros) {
            barbeirosArray = barbeirosResponse.data.barbeiros;
          } else if (barbeirosResponse.barbeiros) {
            barbeirosArray = barbeirosResponse.barbeiros;
          } else if (Array.isArray(barbeirosResponse)) {
            barbeirosArray = barbeirosResponse;
          } else if (Array.isArray(barbeirosResponse.data)) {
            barbeirosArray = barbeirosResponse.data;
          }
          
          console.log('👥 Array de barbeiros extraído:', barbeirosArray);
          setBarbeiros(barbeirosArray);
          
          // Atualizar informações da barbearia se disponível
          if (barbeirosResponse.data && barbeirosResponse.data.barbearia && !barbeariaInfo) {
            setBarbeariaInfo(barbeirosResponse.data.barbearia);
          }
        } catch (err) {
          console.log('⚠️ Não foi possível carregar barbeiros:', err.message);
          setBarbeiros([]);
        }

        setApiStatus('available');

        // Carregar fila pública
        await carregarFilaAtual();
        
        // Verificar se o cliente está na fila
        await verificarClienteAtivo();
        
        // Carregar estatísticas
        await carregarEstatisticas();

      } catch (err) {
        console.error('❌ Erro ao carregar dados:', err);
        setError('Erro ao carregar dados da barbearia.');
        setApiStatus('unavailable');
      } finally {
        setLoading(false);
      }
    };

    carregarDados();
  }, [barbeariaId, carregarEstatisticas]);

  // Verificar se o cliente está na fila
  const verificarClienteAtivo = async () => {
    try {
      const token = CookieManager.getFilaToken();
      const clienteData = CookieManager.getClienteData();
      const barbeariaIdCookie = CookieManager.getBarbeariaId();
      
      console.log('🔍 Verificando cliente ativo:');
      console.log('  - Token:', token ? '✅ Presente' : '❌ Ausente');
      console.log('  - Cliente Data:', clienteData ? '✅ Presente' : '❌ Ausente');
      console.log('  - Barbearia ID Cookie:', barbeariaIdCookie, '(tipo:', typeof barbeariaIdCookie, ')');
      console.log('  - Barbearia ID Atual:', barbeariaId, '(tipo:', typeof barbeariaId, ')');
      console.log('  - IDs coincidem (===):', barbeariaIdCookie === barbeariaId);
      console.log('  - IDs coincidem (==):', barbeariaIdCookie == barbeariaId);
      
      if (token) {
        console.log('🔍 Cliente ativo encontrado, verificando status...');
        console.log('📤 Fazendo request para:', `/api/fila/status/${token}`);
        
        const response = await filaService.obterStatusCliente(token);
        console.log('📦 Response do status do cliente:', response);
        
        const clienteResponse = response.data?.cliente || response.cliente || response.data || response;
        
        if (clienteResponse && clienteResponse.id) {
          console.log('✅ Cliente ativo confirmado:', clienteResponse);
          setClienteAtual(clienteResponse);
        } else {
          console.log('❌ Cliente não encontrado ou token inválido');
          limparLocalStorage();
        }
      } else {
        console.log('🔍 Nenhum cliente ativo encontrado');
        setClienteAtual(null);
      }
    } catch (err) {
      console.error('❌ Erro ao verificar cliente ativo:', err);
      limparLocalStorage();
    }
  };

  // Carregar fila atual (CLIENTES - lista limitada de clientes)
  const carregarFilaAtual = async () => {
    try {
      console.log('🔄 Carregando fila pública para barbearia:', barbeariaId);
      const response = await filaService.obterFilaPublica(barbeariaId);
      console.log('📦 Response da fila pública:', response);
      
      const filaData = response.data || response;
      console.log('📋 Dados da fila pública:', filaData);
      
      // Agora a fila pública retorna lista limitada de clientes
      const filaArray = filaData.clientes || [];
      
      console.log('👥 Fila array (clientes limitados):', filaArray);
      setFila(filaArray);
    } catch (err) {
      console.error('❌ Erro ao carregar fila pública:', err);
      setFila([]);
    }
  };

  // Limpar dados locais
  const limparLocalStorage = () => {
    CookieManager.clearFilaCookies();
    setClienteAtual(null);
  };

  // Entrar na fila
  const entrarNaFila = useCallback(async (dados) => {
    console.log('🚀 entrarNaFila chamada com dados:', dados);
    
    setLoading(true);
    setError(null);

    try {
      const dadosCliente = {
        nome: dados.nome,
        telefone: dados.telefone,
        barbearia_id: barbeariaId
      };

      // Adicionar barbeiro_id apenas se não for 'Fila Geral'
      if (dados.barbeiro && dados.barbeiro !== 'Fila Geral') {
        dadosCliente.barbeiro_id = dados.barbeiro;
      }

      console.log('📤 Dados do cliente sendo enviados:', dadosCliente);

      const response = await filaService.entrarNaFila(dadosCliente);
      console.log('📦 Response da entrada na fila:', response);

      const clienteData = response.data?.cliente || response.cliente || response.data || response;
      
      if (clienteData && clienteData.token) {
        console.log('✅ Cliente adicionado à fila com sucesso:', clienteData);
        
        // Salvar dados no localStorage
        CookieManager.setFilaToken(clienteData.token);
        CookieManager.setClienteData(clienteData);
        CookieManager.setBarbeariaId(barbeariaId);
        
        setClienteAtual(clienteData);
        
        // Recarregar fila
        await carregarFilaAtual();
        
        return clienteData;
      } else {
        throw new Error('Resposta inválida do servidor');
      }
    } catch (err) {
      console.error('❌ Erro ao entrar na fila:', err);
      setError('Erro ao entrar na fila. Tente novamente.');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [barbeariaId]);

  // Sair da fila
  const sairDaFila = useCallback(async (token) => {
    try {
      console.log('🚪 Saindo da fila com token:', token);
      await filaService.sairDaFila(null, token);
      console.log('✅ Saída da fila realizada com sucesso');
      
      limparLocalStorage();
      
      // Recarregar fila
      await carregarFilaAtual();
    } catch (err) {
      console.error('❌ Erro ao sair da fila:', err);
      throw err;
    }
  }, []);

  // Atualizar posição do cliente
  const atualizarPosicao = useCallback(async (token) => {
    try {
      console.log('🔄 Atualizando posição do cliente com token:', token);
      const response = await filaService.obterStatusCliente(token);
      console.log('📦 Response da atualização:', response);
      
      const clienteData = response.data?.cliente || response.cliente || response.data || response;
      
      if (clienteData && clienteData.id) {
        console.log('✅ Posição atualizada:', clienteData);
        setClienteAtual(clienteData);
        
        // Atualizar dados no localStorage
        CookieManager.setClienteData(clienteData);
        
        return clienteData;
      } else {
        console.log('❌ Cliente não encontrado, limpando dados');
        limparLocalStorage();
        return null;
      }
    } catch (err) {
      console.error('❌ Erro ao atualizar posição:', err);
      limparLocalStorage();
      return null;
    }
  }, []);

  // Obter fila atual (para atualização manual)
  const obterFilaAtual = useCallback(async () => {
    await carregarFilaAtual();
  }, [barbeariaId]);

  return {
    // Estado
    fila,
    clienteAtual,
    loading,
    error,
    estatisticas,
    barbeiros,
    barbeariaInfo,
    apiStatus,
    
    // Funções
    entrarNaFila,
    sairDaFila,
    atualizarPosicao,
    obterFilaAtual,
    verificarClienteAtivo,
    limparLocalStorage
  };
}; 