// Hook especializado para barbeiros
// Endpoints necessários para barbeiros gerenciarem suas filas

import { useState, useEffect, useCallback, useRef } from 'react';
import { filaService, barbeariasService, usuariosService } from '@/services/api.js';
import { useAuth } from '@/contexts/AuthContext.jsx';
import { useEstatisticas } from '@/hooks/useEstatisticas.js';

// Cache para dados de fila
const filaCache = {
  data: {},
  lastUpdate: {},
  timeout: 60000, // 60 segundos (1 minuto)

  async getFila(serviceFunction, barbeariaId) {
    const now = Date.now();
    const lastUpdate = this.lastUpdate[barbeariaId] || 0;
    
    if (this.data[barbeariaId] && (now - lastUpdate) < this.timeout) {
      return this.data[barbeariaId];
    }
    
    const response = await serviceFunction(barbeariaId);
    this.data[barbeariaId] = response;
    this.lastUpdate[barbeariaId] = now;
    
    return response;
  },

  invalidate(barbeariaId) {
    delete this.data[barbeariaId];
    delete this.lastUpdate[barbeariaId];
  }
};

// Cache para dados de barbeiros
const barbeirosCache = {
  data: {},
  lastUpdate: {},
  timeout: 60000, // 1 minuto

  async getBarbeiros(serviceFunction, barbeariaId) {
    const now = Date.now();
    const lastUpdate = this.lastUpdate[barbeariaId] || 0;
    
    if (this.data[barbeariaId] && (now - lastUpdate) < this.timeout) {
      return this.data[barbeariaId];
    }
    
    const response = await serviceFunction(barbeariaId);
    this.data[barbeariaId] = response;
    this.lastUpdate[barbeariaId] = now;
    
    return response;
  },

  invalidate(barbeariaId) {
    delete this.data[barbeariaId];
    delete this.lastUpdate[barbeariaId];
  }
};

export const useBarbeiroFila = (barbeariaId = null) => {
  const { user } = useAuth(); // Obter dados do usuário do contexto de autenticação
  const [fila, setFila] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [barbeiros, setBarbeiros] = useState([]);
  // Usar hook centralizado para estatísticas
  const { estatisticas, carregarEstatisticas } = useEstatisticas(barbeariaId);
  const [barbeariaInfo, setBarbeariaInfo] = useState(null);
  const [apiStatus, setApiStatus] = useState('checking');
  const [statusBarbeiro, setStatusBarbeiro] = useState({});
  const [atendendoAtual, setAtendendoAtual] = useState(null);

  // Refs para controlar chamadas duplicadas
  const statusCallInProgress = useRef(false);
  const lastStatusCall = useRef(0);
  const statusCallTimeout = 10000; // 10 segundos entre chamadas
  
  // Controle adicional para fila
  const filaCallInProgress = useRef(false);
  const lastFilaCall = useRef(0);
  const filaCallTimeout = 5000; // 5 segundos entre chamadas de fila

  // Controle de carregamento inicial
  const initialLoadDone = useRef(false);

  // ✅ Definir função carregarStatusBarbeiro com useCallback
  const carregarStatusBarbeiro = useCallback(async () => {
    // Evitar chamadas simultâneas
    if (statusCallInProgress.current) {
      return;
    }

    const now = Date.now();
    
    // Evitar chamadas muito frequentes
    if (lastStatusCall.current > 0 && (now - lastStatusCall.current) < statusCallTimeout) {
      return;
    }

    try {
      statusCallInProgress.current = true;
      lastStatusCall.current = now;
      
      const response = await usuariosService.obterStatusBarbeiro();
      
      // ✅ Extrair dados corretamente da estrutura do backend
      const statusData = response.data || response;
      
      setStatusBarbeiro(statusData);
    } catch (error) {
      console.error('❌ Erro ao carregar status do barbeiro:', error);
      setStatusBarbeiro({});
    } finally {
      statusCallInProgress.current = false;
    }
  }, []);

  // ✅ Definir função carregarFilaAtual com useCallback
  const carregarFilaAtual = useCallback(async () => {
    // Evitar chamadas simultâneas
    if (filaCallInProgress.current) {
      return;
    }

    const now = Date.now();
    
    // Evitar chamadas muito frequentes (reduzido para 2 segundos)
    if (lastFilaCall.current > 0 && (now - lastFilaCall.current) < 2000) {
      return;
    }

    try {
      filaCallInProgress.current = true;
      lastFilaCall.current = now;
      
      // ✅ SEMPRE invalidar cache para forçar nova chamada
      filaCache.invalidate(barbeariaId);
      
      const filaData = await filaCache.getFila(
        filaService.obterFilaBarbeiro,
        barbeariaId
      );
      
      const filaArray = filaData.data?.clientes || filaData.clientes || filaData.fila || [];
      
      setFila(filaArray);
      
      // ✅ ATUALIZAR ATENDENDO ATUAL - Verificar se há cliente em atendimento
      const clienteEmAtendimento = filaArray.find(cliente => 
        cliente.status === 'atendendo' || 
        cliente.status === 'em_atendimento'
      );
      
      if (clienteEmAtendimento) {
        setAtendendoAtual(clienteEmAtendimento);
      } else {
        // ✅ SEMPRE LIMPAR SE NÃO ENCONTRAR CLIENTE EM ATENDIMENTO
        // Também limpar se o cliente atual foi finalizado
        if (atendendoAtual && (atendendoAtual.status === 'finalizado' || atendendoAtual.status === 'concluido')) {
          setAtendendoAtual(null);
        } else if (!clienteEmAtendimento) {
          setAtendendoAtual(null);
        }
      }
      
      // Estatísticas são carregadas automaticamente pelo hook useEstatisticas
      try {
        await carregarEstatisticas();
      } catch (estatErr) {
        console.error('❌ Erro ao carregar estatísticas:', estatErr);
      }
    } catch (err) {
      console.error('❌ Erro ao carregar fila atual:', err);
    } finally {
      filaCallInProgress.current = false;
    }
  }, [barbeariaId, carregarEstatisticas, atendendoAtual]);

  // Carregar dados iniciais
  useEffect(() => {
    if (!barbeariaId) {
      return;
    }

    // Evitar carregamento duplicado
    if (initialLoadDone.current) {
      return;
    }

    initialLoadDone.current = true;

    const carregarDados = async () => {
      try {
        setLoading(true);
        setError(null);
        setApiStatus('checking');

        // Carregar informações da barbearia com cache
        try {
          const barbeariaData = await barbeirosCache.getBarbearia(
            barbeariasService.obterBarbearia,
            barbeariaId
          );
          setBarbeariaInfo(barbeariaData.data || barbeariaData);
        } catch (err) {
          try {
            const barbeariasData = await barbeariasService.listarBarbearias();
            const barbeariasArray = barbeariasData.data || barbeariasData;
            
            if (barbeariasArray && barbeariasArray.length > 0) {
              const primeiraBarbearia = barbeariasArray[0];
              setBarbeariaInfo(primeiraBarbearia);
            } else {
              throw new Error('Nenhuma barbearia encontrada');
            }
          } catch (listErr) {
            console.error('❌ Erro ao listar barbearias:', listErr);
            throw err;
          }
        }
        
        // Carregar barbeiros com cache
        try {
          const barbeirosData = await barbeariasService.listarBarbeirosAtivos(barbeariaId);
          const barbeirosArray = barbeirosData.data || barbeirosData;
          setBarbeiros(barbeirosArray);
        } catch (err) {
          setBarbeiros([]);
        }
        
        setApiStatus('available');

        // Carregar fila atual com cache
        try {
          await carregarFilaAtual();
        } catch (err) {
          // Silenciar erro de carregamento inicial
        }

      } catch (err) {
        console.error('Erro ao carregar dados da fila:', err);
        setError('Erro ao conectar com o servidor. Verifique sua conexão.');
        setApiStatus('unavailable');
      } finally {
        setLoading(false);
      }
    };

    carregarDados();
  }, [barbeariaId]);

  // Reset do controle quando barbearia mudar
  useEffect(() => {
    initialLoadDone.current = false;
  }, [barbeariaId]);

  // Carregar status do barbeiro quando usuário estiver autenticado
  useEffect(() => {
    if (user && user.id) {
      carregarStatusBarbeiro();
    }
  }, [user, carregarStatusBarbeiro]);

  // Carregar status do barbeiro quando API estiver disponível
  useEffect(() => {
    if (apiStatus === 'available') {
      carregarStatusBarbeiro();
    }
  }, [apiStatus, carregarStatusBarbeiro]);

  // Carregar fila quando status do barbeiro for carregado e houver barbearia
  useEffect(() => {
    if (statusBarbeiro && Object.keys(statusBarbeiro).length > 0 && barbeariaId) {
      carregarFilaAtual();
    }
  }, [statusBarbeiro, barbeariaId, carregarFilaAtual]);

  // Carregar fila quando API estiver disponível
  useEffect(() => {
    if (apiStatus === 'available' && barbeariaId) {
      carregarFilaAtual();
    }
  }, [apiStatus, barbeariaId, carregarFilaAtual]);

  // Atualização automática da fila
  useEffect(() => {
    if (apiStatus !== 'available') return;

    const interval = setInterval(() => {
      carregarFilaAtual();
    }, 60000); // Atualiza a cada 60 segundos (1 minuto)

    return () => clearInterval(interval);
  }, [barbeariaId, apiStatus, carregarFilaAtual]);

  // Verificar se o barbeiro está ativo
  const isBarbeiroAtivo = useCallback((barbeariaId) => {
    // Se não há dados de status, retornar false
    if (!statusBarbeiro || Object.keys(statusBarbeiro).length === 0) {
      return false;
    }
    
    // ✅ ESTRUTURA CORRETA DO BACKEND: statusBarbeiro.barbeiro.ativo
    if (statusBarbeiro?.barbeiro?.ativo !== undefined) {
      const isAtivo = statusBarbeiro.barbeiro.ativo;
      const barbeariaIdBarbeiro = statusBarbeiro.barbeiro.barbearia?.id;
      
      // Se o barbeiro está ativo e a barbearia corresponde
      if (isAtivo && barbeariaIdBarbeiro === parseInt(barbeariaId)) {
        return true;
      }
      
      return false;
    }
    
    // Estrutura antiga (fallback): statusBarbeiro.barbearias
    if (statusBarbeiro?.barbearias && Array.isArray(statusBarbeiro.barbearias)) {
      const isAtivo = statusBarbeiro.barbearias.some(barbearia => 
        barbearia.barbearia_id === parseInt(barbeariaId) && barbearia.ativo === true
      );
      return isAtivo;
    }
    
    // Estrutura alternativa: statusBarbeiro.ativo (diretamente)
    if (statusBarbeiro?.ativo !== undefined) {
      const isAtivo = statusBarbeiro.ativo;
      return isAtivo;
    }
    
    // Estrutura alternativa: statusBarbeiro.status
    if (statusBarbeiro?.status) {
      const isAtivo = statusBarbeiro.status === 'ativo' || statusBarbeiro.status === true;
      return isAtivo;
    }
    
    return false;
  }, [statusBarbeiro]);

  // FUNÇÕES ESPECÍFICAS PARA BARBEIROS

  // Chamar próximo cliente (BARBEIRO)
  const chamarProximo = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await filaService.chamarProximo(barbeariaId);
      
      // Invalidar cache da fila
      filaCache.invalidate(barbeariaId);

      // Atualizar estado local
      await carregarFilaAtual();

      // ✅ Forçar atualização adicional após um pequeno delay para garantir sincronização
      setTimeout(async () => {
        await carregarFilaAtual();
      }, 1000);

    } catch (err) {
      console.error('❌ Erro ao chamar próximo cliente:', err);
      setError('Erro ao chamar próximo cliente.');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [barbeariaId]);

  // Finalizar atendimento (BARBEIRO)
  const finalizarAtendimento = useCallback(async (clienteId, dados) => {
    setLoading(true);
    setError(null);

    try {
      // ✅ VERIFICAR SE O BARBEIRO ESTÁ ATIVO
      if (!isBarbeiroAtivo(barbeariaId)) {
        throw new Error('Você precisa estar ativo na barbearia para finalizar atendimentos');
      }

      if (!clienteId) {
        throw new Error('ID do cliente não fornecido');
      }

      // ✅ LIMPAR ATENDENDO ATUAL IMEDIATAMENTE ANTES DA CHAMADA
      setAtendendoAtual(null);

      // ✅ USAR O NOVO ENDPOINT SIMPLIFICADO
      const response = await filaService.finalizarAtendimentoSimplificado(clienteId, dados);

      // Invalidar cache da fila
      filaCache.invalidate(barbeariaId);

      // Atualizar estado local com múltiplas tentativas
      await carregarFilaAtual();

      // Forçar atualizações adicionais para garantir sincronização
      setTimeout(async () => {
        await carregarFilaAtual();
      }, 500);

      setTimeout(async () => {
        await carregarFilaAtual();
      }, 1500);

      setTimeout(async () => {
        await carregarFilaAtual();
      }, 3000);

      // Garantir que atendendoAtual esteja limpo
      setTimeout(() => {
        setAtendendoAtual(null);
      }, 100);

      return response;
    } catch (err) {
      console.error('❌ Erro ao finalizar atendimento:', err);
      setError('Erro ao finalizar atendimento.');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [barbeariaId, isBarbeiroAtivo, carregarFilaAtual]);

  // Adicionar cliente manualmente (BARBEIRO)
  const adicionarClienteManual = useCallback(async (dadosCliente) => {
    setLoading(true);
    setError(null);

    try {
      // Usar o endpoint que existe: POST /fila/entrar
      await filaService.entrarNaFila({
        ...dadosCliente,
        barbearia_id: barbeariaId
      });
      
      // Invalidar cache da fila
      filaCache.invalidate(barbeariaId);

      // Atualizar estado local
      await carregarFilaAtual();

      console.log('✅ Cliente adicionado manualmente com sucesso');
    } catch (err) {
      setError('Erro ao adicionar cliente.');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [barbeariaId]);

  // Remover cliente da fila (BARBEIRO)
  const removerCliente = useCallback(async (clienteId) => {
    setLoading(true);
    setError(null);

    try {
      await filaService.removerCliente(clienteId);
      
      // Invalidar cache da fila
      filaCache.invalidate(barbeariaId);

      // Atualizar estado local
      await carregarFilaAtual();

      console.log('✅ Cliente removido da fila com sucesso');
    } catch (err) {
      setError('Erro ao remover cliente.');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [barbeariaId]);

  // Ativar/desativar status do barbeiro (BARBEIRO)
  const toggleStatusBarbeiro = useCallback(async (acao) => {
    setLoading(true);
    setError(null);

    try {
      // Verificar se temos os dados necessários
      if (!barbeariaId) {
        throw new Error('Barbearia não selecionada');
      }
      
      // Para obter o ID do barbeiro, vamos usar o contexto de autenticação
      // ou os dados que já temos disponíveis
      let barbeiroId = null;
      
      // Primeiro, tentar obter do contexto de autenticação
      if (user?.id) {
        barbeiroId = user.id;
      }
      // Se não temos do contexto, tentar dos dados de status
      else if (statusBarbeiro?.barbeiro?.id) {
        barbeiroId = statusBarbeiro.barbeiro.id;
      } else if (statusBarbeiro?.id) {
        barbeiroId = statusBarbeiro.id;
      } else if (statusBarbeiro?.user_id) {
        barbeiroId = statusBarbeiro.user_id;
      } else {
        throw new Error('Não foi possível identificar o barbeiro. Tente fazer login novamente.');
      }
      
      if (!barbeiroId) {
        throw new Error('Dados do barbeiro não carregados. Tente recarregar a página.');
      }

      // REGRA: Se está ativando, primeiro desativar em todas as outras barbearias
      if (acao === 'ativar') {
        try {
          // Obter lista de barbearias onde o barbeiro pode trabalhar
          const barbeariasResponse = await barbeariasService.listarBarbearias();
          const barbearias = barbeariasResponse.data || barbeariasResponse;
          
          // Desativar em todas as barbearias exceto a atual
          const promessasDesativacao = barbearias
            .filter(barbearia => barbearia.id !== parseInt(barbeariaId))
            .map(async (barbearia) => {
              try {
                const dadosDesativacao = {
                  barbearia_id: barbearia.id,
                  barbeiro_id: barbeiroId
                };
                await usuariosService.atualizarStatusBarbeiro('desativar', dadosDesativacao);
                return { success: true, barbearia: barbearia.id };
              } catch (error) {
                return { success: false, barbearia: barbearia.id, error: error.message };
              }
            });
          
          // Aguardar todas as desativações
          await Promise.allSettled(promessasDesativacao);
          
        } catch (error) {
          // Continuar mesmo se houver erro na desativação
        }
      }

      const dados = {
        barbearia_id: barbeariaId,
        barbeiro_id: barbeiroId
      };

      await usuariosService.atualizarStatusBarbeiro(acao, dados);
      
      // Invalidar cache de barbeiros
      barbeirosCache.invalidate(barbeariaId);

      // Recarregar status do barbeiro
      try {
        const response = await usuariosService.obterStatusBarbeiro();
        setStatusBarbeiro(response.data);
      } catch (statusError) {
        // Mesmo que não consigamos recarregar o status, a operação foi bem-sucedida
        // Vamos atualizar o estado local baseado na ação realizada
        const novoStatus = {
          barbeiro: {
            id: barbeiroId,
            ativo: acao === 'ativar',
            barbearia: { id: barbeariaId }
          }
        };
        setStatusBarbeiro(novoStatus);
      }

    } catch (err) {
      console.error(`❌ Erro ao ${acao} status do barbeiro:`, err);
      setError(`Erro ao ${acao} status do barbeiro: ${err.message}`);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [barbeariaId, statusBarbeiro, user]);

  // Iniciar atendimento (BARBEIRO)
  const iniciarAtendimento = useCallback(async (clienteId, dados) => {
    setLoading(true);
    setError(null);

    try {
      // ✅ VERIFICAR SE O BARBEIRO ESTÁ ATIVO
      if (!isBarbeiroAtivo(barbeariaId)) {
        throw new Error('Você precisa estar ativo na barbearia para iniciar atendimentos');
      }

      if (!clienteId) {
        throw new Error('ID do cliente não fornecido');
      }

      // ✅ USAR O NOVO ENDPOINT SIMPLIFICADO
      const response = await filaService.iniciarAtendimentoSimplificado(clienteId, dados);

      // Invalidar cache da fila
      filaCache.invalidate(barbeariaId);

      // Atualizar estado local com múltiplas tentativas
      await carregarFilaAtual();

      // Forçar atualizações adicionais para garantir sincronização
      setTimeout(async () => {
        await carregarFilaAtual();
      }, 500);

      setTimeout(async () => {
        await carregarFilaAtual();
      }, 1500);

      setTimeout(async () => {
        await carregarFilaAtual();
      }, 3000);

      return response;
    } catch (err) {
      console.error('❌ Erro ao iniciar atendimento:', err);
      setError('Erro ao iniciar atendimento.');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [barbeariaId, isBarbeiroAtivo, carregarFilaAtual]);

  // Obter fila filtrada por barbeiro
  const getFilaBarbeiro = useCallback(() => {
    // ✅ Usar a estrutura correta: statusBarbeiro.barbeiro.id
    const barbeiroId = statusBarbeiro?.barbeiro?.id || statusBarbeiro?.id;
    
    if (!barbeiroId) {
      return [];
    }
    
    return fila.filter(cliente => 
      cliente.barbeiro_id === barbeiroId || 
      cliente.barbeiro === 'Fila Geral'
    );
  }, [fila, statusBarbeiro]);

  // Função para verificar status da API
  const verificarStatusAPI = useCallback(async () => {
    try {
      await barbeariasService.obterBarbearia(barbeariaId);
      setApiStatus('available');
      return true;
    } catch (error) {
      setApiStatus('unavailable');
      return false;
    }
  }, [barbeariaId]);

  return {
    // Estado
    fila,
    loading,
    error,
    barbeiros,
    estatisticas,
    barbeariaInfo,
    apiStatus,
    statusBarbeiro,
    atendendoAtual,
    
    // Funções específicas para barbeiros
    chamarProximo,
    finalizarAtendimento,
    adicionarClienteManual,
    removerCliente,
    toggleStatusBarbeiro,
    iniciarAtendimento,
    
    // Funções auxiliares
    carregarFilaAtual,
    verificarStatusAPI,
    isBarbeiroAtivo,
    getFilaBarbeiro
  };
};