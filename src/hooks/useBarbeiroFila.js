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
  timeout: 30000, // 30 segundos

  async getFila(serviceFunction, barbeariaId) {
    const now = Date.now();
    const lastUpdate = this.lastUpdate[barbeariaId] || 0;
    
    console.log('🔍 Cache check - barbeariaId:', barbeariaId);
    console.log('🔍 Cache check - has data:', !!this.data[barbeariaId]);
    console.log('🔍 Cache check - time diff:', now - lastUpdate);
    console.log('🔍 Cache check - timeout:', this.timeout);
    
    if (this.data[barbeariaId] && (now - lastUpdate) < this.timeout) {
      console.log('📊 Usando cache da fila para barbearia:', barbeariaId);
      return this.data[barbeariaId];
    }
    
    console.log('🔄 Carregando dados da fila para barbearia:', barbeariaId);
    console.log('🔄 Chamando serviceFunction...');
    const response = await serviceFunction(barbeariaId);
    console.log('🔄 Response recebida:', response);
    this.data[barbeariaId] = response;
    this.lastUpdate[barbeariaId] = now;
    
    return response;
  },

  invalidate(barbeariaId) {
    delete this.data[barbeariaId];
    delete this.lastUpdate[barbeariaId];
    console.log('🗑️ Cache da fila invalidado para barbearia:', barbeariaId);
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
      console.log('📊 Usando cache de barbeiros para barbearia:', barbeariaId);
      return this.data[barbeariaId];
    }
    
    console.log('🔄 Carregando dados de barbeiros para barbearia:', barbeariaId);
    const response = await serviceFunction(barbeariaId);
    this.data[barbeariaId] = response;
    this.lastUpdate[barbeariaId] = now;
    
    return response;
  },

  invalidate(barbeariaId) {
    delete this.data[barbeariaId];
    delete this.lastUpdate[barbeariaId];
    console.log('🗑️ Cache de barbeiros invalidado para barbearia:', barbeariaId);
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
      
      console.log('🔍 Carregando status do barbeiro...');
      const response = await usuariosService.obterStatusBarbeiro();
      
      // ✅ Extrair dados corretamente da estrutura do backend
      const statusData = response.data || response;
      console.log('✅ Status do barbeiro carregado:', statusData);
      
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
    
    // Evitar chamadas muito frequentes
    if (lastFilaCall.current > 0 && (now - lastFilaCall.current) < filaCallTimeout) {
      return;
    }

    try {
      filaCallInProgress.current = true;
      lastFilaCall.current = now;
      
      console.log('🔄 Carregando fila para barbearia:', barbeariaId);
      
      // ✅ Invalidar cache para forçar nova chamada
      filaCache.invalidate(barbeariaId);
      
      const filaData = await filaCache.getFila(
        filaService.obterFilaBarbeiro,
        barbeariaId
      );
      
      console.log('📦 Response da fila:', filaData);
      
      // ✅ Debug detalhado da estrutura da resposta
      console.log('🔍 Estrutura da resposta:', {
        success: filaData?.success,
        hasData: !!filaData?.data,
        dataType: typeof filaData?.data,
        dataKeys: filaData?.data ? Object.keys(filaData.data) : 'null',
        hasClientes: !!filaData?.data?.clientes,
        clientesType: typeof filaData?.data?.clientes,
        clientesLength: filaData?.data?.clientes?.length,
        clientes: filaData?.data?.clientes
      });
      
      const filaArray = filaData.data?.clientes || filaData.clientes || filaData.fila || [];
      console.log('👥 Clientes na fila:', filaArray.length);
      console.log('👥 Array extraído:', filaArray);
      
      // ✅ Debug: Verificar se há clientes na fila
      if (filaArray.length > 0) {
        console.log('🔍 Clientes na fila após atualização:', filaArray.length);
        console.log('🔍 Primeiro cliente:', {
          id: filaArray[0].id,
          nome: filaArray[0].nome,
          status: filaArray[0].status
        });
      }
      
      setFila(filaArray);
      console.log('✅ Estado da fila atualizado com', filaArray.length, 'clientes');
      
      // ✅ ATUALIZAR ATENDENDO ATUAL - Verificar se há cliente em atendimento
      const clienteEmAtendimento = filaArray.find(cliente => 
        cliente.status === 'atendendo' || cliente.status === 'em_atendimento'
      );
      
      if (clienteEmAtendimento) {
        console.log('🔍 Cliente em atendimento encontrado:', clienteEmAtendimento.nome);
        setAtendendoAtual(clienteEmAtendimento);
      } else {
        console.log('🔍 Nenhum cliente em atendimento encontrado');
        setAtendendoAtual(null);
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
  }, [barbeariaId, carregarEstatisticas]);

  // Carregar dados iniciais
  useEffect(() => {
    if (!barbeariaId) {
      console.log('⚠️ Nenhum barbeariaId fornecido, aguardando...');
      return;
    }

    // Evitar carregamento duplicado
    if (initialLoadDone.current) {
      console.log('🔄 Carregamento inicial já feito, pulando...');
      return;
    }

    console.log('🔄 Iniciando carregamento inicial para barbearia:', barbeariaId);
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
          console.log('⚠️ Barbearia específica não encontrada, tentando listar todas...');
          
          try {
            const barbeariasData = await barbeariasService.listarBarbearias();
            const barbeariasArray = barbeariasData.data || barbeariasData;
            
            if (barbeariasArray && barbeariasArray.length > 0) {
              const primeiraBarbearia = barbeariasArray[0];
              console.log('✅ Usando primeira barbearia disponível:', primeiraBarbearia);
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
          console.log('🔄 Carregando barbeiros para barbearia:', barbeariaId);
          console.log('📞 Chamando barbeariasService.listarBarbeiros...');
          
          // Usar a função correta do serviço
          const barbeirosData = await barbeariasService.listarBarbeirosAtivos(barbeariaId);
          console.log('📦 Response dos barbeiros:', barbeirosData);
          
          const barbeirosArray = barbeirosData.data || barbeirosData;
          console.log('👥 Array de barbeiros extraído:', barbeirosArray);
          setBarbeiros(barbeirosArray);
        } catch (err) {
          console.log('⚠️ Não foi possível carregar barbeiros:', err.message);
          setBarbeiros([]);
        }
        
        setApiStatus('available');

        // Carregar fila atual com cache
        try {
          await carregarFilaAtual();
        } catch (err) {
          console.log('⚠️ Não foi possível carregar fila atual:', err.message);
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
      console.log('👤 Usuário autenticado, carregando status...');
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
      console.log('🚀 Status carregado, carregando fila...');
      carregarFilaAtual();
    }
  }, [statusBarbeiro, barbeariaId, carregarFilaAtual]);

  // Carregar fila quando API estiver disponível
  useEffect(() => {
    if (apiStatus === 'available' && barbeariaId) {
      console.log('🚀 API disponível, carregando fila...');
      carregarFilaAtual();
    }
  }, [apiStatus, barbeariaId, carregarFilaAtual]);

  // Atualização automática da fila
  useEffect(() => {
    if (apiStatus !== 'available') return;

    const interval = setInterval(() => {
      carregarFilaAtual();
    }, 30000); // Atualiza a cada 30 segundos

    return () => clearInterval(interval);
  }, [barbeariaId, apiStatus, carregarFilaAtual]);

  // FUNÇÕES ESPECÍFICAS PARA BARBEIROS

  // Chamar próximo cliente (BARBEIRO)
  const chamarProximo = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      console.log('🚀 Chamando próximo cliente para barbearia:', barbeariaId);
      const response = await filaService.chamarProximo(barbeariaId);
      console.log('✅ Resposta do chamar próximo:', response);
      
      // Invalidar cache da fila
      filaCache.invalidate(barbeariaId);

      // Atualizar estado local
      await carregarFilaAtual();

      // ✅ Forçar atualização adicional após um pequeno delay para garantir sincronização
      setTimeout(async () => {
        console.log('🔄 Forçando atualização adicional após chamar próximo...');
        await carregarFilaAtual();
      }, 1000);

      console.log('✅ Próximo cliente chamado com sucesso');
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
      console.log('🏁 Finalizando atendimento:', { clienteId, dados });
      
      // ✅ VERIFICAR SE O BARBEIRO ESTÁ ATIVO
      if (!isBarbeiroAtivo(barbeariaId)) {
        throw new Error('Você precisa estar ativo na barbearia para finalizar atendimentos');
      }

      if (!clienteId) {
        throw new Error('ID do cliente não fornecido');
      }

      // ✅ USAR O NOVO ENDPOINT SIMPLIFICADO
      const response = await filaService.finalizarAtendimentoSimplificado(clienteId, dados);
      console.log('✅ Resposta da API finalizar atendimento:', response);

      // Invalidar cache da fila
      console.log('🔄 Invalidando cache da fila para barbearia:', barbeariaId);
      filaCache.invalidate(barbeariaId);

      // Atualizar estado local
      await carregarFilaAtual();

      // Limpar atendimento atual se for o mesmo cliente
      if (atendendoAtual && atendendoAtual.id === clienteId) {
        setAtendendoAtual(null);
      }

      console.log('✅ Atendimento finalizado com sucesso');
      return response;
    } catch (err) {
      console.error('❌ Erro ao finalizar atendimento:', err);
      setError('Erro ao finalizar atendimento.');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [barbeariaId, atendendoAtual]);

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
    console.log('🔄 toggleStatusBarbeiro chamado:', {
      acao,
      barbeariaId,
      statusBarbeiro
    });
    
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
        console.log('✅ ID do barbeiro obtido do contexto de autenticação:', barbeiroId);
      }
      // Se não temos do contexto, tentar dos dados de status
      else if (statusBarbeiro?.barbeiro?.id) {
        barbeiroId = statusBarbeiro.barbeiro.id;
        console.log('✅ ID do barbeiro obtido dos dados de status:', barbeiroId);
      } else if (statusBarbeiro?.id) {
        barbeiroId = statusBarbeiro.id;
        console.log('✅ ID do barbeiro obtido dos dados de status (estrutura antiga):', barbeiroId);
      } else if (statusBarbeiro?.user_id) {
        barbeiroId = statusBarbeiro.user_id;
        console.log('✅ ID do barbeiro obtido dos dados de status (user_id):', barbeiroId);
      } else {
        console.error('❌ ID do barbeiro não encontrado em nenhuma fonte:', {
          user,
          statusBarbeiro
        });
        throw new Error('Não foi possível identificar o barbeiro. Tente fazer login novamente.');
      }
      
      if (!barbeiroId) {
        console.error('❌ ID do barbeiro não encontrado:', statusBarbeiro);
        throw new Error('Dados do barbeiro não carregados. Tente recarregar a página.');
      }

      // REGRA: Se está ativando, primeiro desativar em todas as outras barbearias
      if (acao === 'ativar') {
        console.log('🔄 Ativando barbeiro - Primeiro desativando em outras barbearias...');
        
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
                console.log(`🔄 Desativando em barbearia ${barbearia.id} (${barbearia.nome})`);
                await usuariosService.atualizarStatusBarbeiro('desativar', dadosDesativacao);
                return { success: true, barbearia: barbearia.id };
              } catch (error) {
                console.log(`⚠️ Erro ao desativar em barbearia ${barbearia.id}:`, error.message);
                return { success: false, barbearia: barbearia.id, error: error.message };
              }
            });
          
          // Aguardar todas as desativações
          const resultados = await Promise.allSettled(promessasDesativacao);
          console.log('📊 Resultados das desativações:', resultados);
          
        } catch (error) {
          console.log('⚠️ Erro ao desativar em outras barbearias:', error.message);
          // Continuar mesmo se houver erro na desativação
        }
      }
      
      console.log(`🔄 ${acao === 'ativar' ? 'Ativando' : 'Desativando'} barbeiro na barbearia ${barbeariaId}`);

      const dados = {
        barbearia_id: barbeariaId,
        barbeiro_id: barbeiroId
      };

      console.log('🔄 Enviando dados para API:', dados);

      await usuariosService.atualizarStatusBarbeiro(acao, dados);
      
      // Invalidar cache de barbeiros
      barbeirosCache.invalidate(barbeariaId);

      // Recarregar status do barbeiro
      try {
        const response = await usuariosService.obterStatusBarbeiro();
        console.log('🔄 Resposta da API após alteração:', response.data);
        setStatusBarbeiro(response.data);
        
        // Verificar se o estado foi atualizado
        console.log('🔄 Estado atualizado:', {
          novoStatus: response.data,
          barbeiroAtivo: response.data?.barbeiro?.ativo,
          barbeariaIdBarbeiro: response.data?.barbeiro?.barbearia?.id
        });
      } catch (statusError) {
        console.log('⚠️ Não foi possível recarregar o status após alteração:', statusError.message);
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

      console.log(`✅ Status do barbeiro ${acao === 'ativar' ? 'ativado' : 'desativado'} com sucesso`);
    } catch (err) {
      console.error(`❌ Erro ao ${acao} status do barbeiro:`, err);
      setError(`Erro ao ${acao} status do barbeiro: ${err.message}`);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [barbeariaId, statusBarbeiro, user]);

  // Verificar se o barbeiro está ativo
  const isBarbeiroAtivo = useCallback((barbeariaId) => {
    console.log('🔍 Verificando se barbeiro está ativo:', {
      barbeariaId,
      statusBarbeiro,
      barbeiroAtivo: statusBarbeiro?.barbeiro?.ativo,
      barbeariaIdBarbeiro: statusBarbeiro?.barbeiro?.barbearia?.id
    });
    
    // Se não há dados de status, retornar false
    if (!statusBarbeiro || Object.keys(statusBarbeiro).length === 0) {
      console.log('❌ Nenhum dado de status disponível');
      return false;
    }
    
    // ✅ ESTRUTURA CORRETA DO BACKEND: statusBarbeiro.barbeiro.ativo
    if (statusBarbeiro?.barbeiro?.ativo !== undefined) {
      const isAtivo = statusBarbeiro.barbeiro.ativo;
      const barbeariaIdBarbeiro = statusBarbeiro.barbeiro.barbearia?.id;
      
      // Se o barbeiro está ativo e a barbearia corresponde
      if (isAtivo && barbeariaIdBarbeiro === parseInt(barbeariaId)) {
        console.log('✅ Barbeiro está ativo para esta barbearia');
        return true;
      }
      
      console.log('❌ Barbeiro não está ativo ou barbearia não corresponde');
      return false;
    }
    
    // Estrutura antiga (fallback): statusBarbeiro.barbearias
    if (statusBarbeiro?.barbearias && Array.isArray(statusBarbeiro.barbearias)) {
      const isAtivo = statusBarbeiro.barbearias.some(barbearia => 
        barbearia.barbearia_id === parseInt(barbeariaId) && barbearia.ativo === true
      );
      console.log('🔍 Verificação via barbearias (fallback):', { barbearias: statusBarbeiro.barbearias, isAtivo });
      return isAtivo;
    }
    
    // Estrutura alternativa: statusBarbeiro.ativo (diretamente)
    if (statusBarbeiro?.ativo !== undefined) {
      const isAtivo = statusBarbeiro.ativo;
      console.log('🔍 Verificação via ativo direto (fallback):', { ativo: isAtivo });
      return isAtivo;
    }
    
    // Estrutura alternativa: statusBarbeiro.status
    if (statusBarbeiro?.status) {
      const isAtivo = statusBarbeiro.status === 'ativo' || statusBarbeiro.status === true;
      console.log('🔍 Verificação via status (fallback):', { status: statusBarbeiro.status, isAtivo });
      return isAtivo;
    }
    
    console.log('❌ Estrutura de dados não reconhecida:', statusBarbeiro);
    return false;
  }, [statusBarbeiro]);

  // Iniciar atendimento (BARBEIRO)
  const iniciarAtendimento = useCallback(async (clienteId, dados) => {
    setLoading(true);
    setError(null);

    try {
      console.log('🚀 Iniciando atendimento:', { clienteId, dados });
      
      // ✅ VERIFICAR SE O BARBEIRO ESTÁ ATIVO
      console.log('🔍 Verificando permissões para iniciar atendimento:', {
        clienteId,
        barbeariaId,
        statusBarbeiro: statusBarbeiro?.barbeiro,
        isBarbeiroAtivo: isBarbeiroAtivo(barbeariaId)
      });
      
      if (!isBarbeiroAtivo(barbeariaId)) {
        throw new Error('Você precisa estar ativo na barbearia para iniciar atendimentos');
      }

      if (!clienteId) {
        throw new Error('ID do cliente não fornecido');
      }

      // ✅ USAR O NOVO ENDPOINT SIMPLIFICADO
      const response = await filaService.iniciarAtendimentoSimplificado(clienteId, dados);
      console.log('✅ Resposta da API iniciar atendimento:', response);

      // Invalidar cache da fila
      console.log('🔄 Invalidando cache da fila para barbearia:', barbeariaId);
      filaCache.invalidate(barbeariaId);

      // Atualizar estado local
      console.log('🔄 Recarregando fila atual...');
      await carregarFilaAtual();

      // Forçar atualização adicional após um pequeno delay
      setTimeout(async () => {
        console.log('🔄 Forçando atualização adicional da fila...');
        await carregarFilaAtual();
      }, 1000);

      console.log('✅ Atendimento iniciado com sucesso');
      return response;
    } catch (err) {
      console.error('❌ Erro ao iniciar atendimento:', err);
      setError('Erro ao iniciar atendimento.');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [barbeariaId, isBarbeiroAtivo]);

  // Obter fila filtrada por barbeiro
  const getFilaBarbeiro = useCallback(() => {
    // ✅ Usar a estrutura correta: statusBarbeiro.barbeiro.id
    const barbeiroId = statusBarbeiro?.barbeiro?.id || statusBarbeiro?.id;
    
    if (!barbeiroId) {
      console.log('⚠️ ID do barbeiro não encontrado para filtrar fila');
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