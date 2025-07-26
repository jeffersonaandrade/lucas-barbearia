import { useState, useEffect, useCallback } from 'react';
import { filaService, barbeariasService } from '@/services/api.js';

export const useFilaBackend = (barbeariaId = null) => {
  const [fila, setFila] = useState([]);
  const [clienteAtual, setClienteAtual] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [barbeiros, setBarbeiros] = useState([]);
  const [estatisticas, setEstatisticas] = useState({});
  const [barbeariaInfo, setBarbeariaInfo] = useState(null);
  const [apiStatus, setApiStatus] = useState('checking'); // 'checking', 'available', 'unavailable'

  // Carregar dados iniciais
  useEffect(() => {
    console.log('🔄 useEffect useFilaBackend chamado com barbeariaId:', barbeariaId);
    
    // Se não há barbeariaId, não carregar dados
    if (!barbeariaId) {
      console.log('⚠️ Nenhum barbeariaId fornecido, aguardando...');
      return;
    }

    const carregarDados = async () => {
      console.log('🚀 Iniciando carregamento de dados para barbearia:', barbeariaId);
      try {
        setLoading(true);
        setError(null);
        setApiStatus('checking');

        // Tentar carregar informações da barbearia específica
        try {
          const barbeariaResponse = await barbeariasService.obterBarbearia(barbeariaId);
          const barbeariaData = barbeariaResponse.data || barbeariaResponse;
          setBarbeariaInfo(barbeariaData);
        } catch (err) {
          console.log('⚠️ Barbearia específica não encontrada, tentando listar todas...');
          
          // Se a barbearia específica não existe, tentar listar todas
          try {
            const barbeariasResponse = await barbeariasService.listarBarbearias();
            const barbeariasData = barbeariasResponse.data || barbeariasResponse;
            
            if (barbeariasData && barbeariasData.length > 0) {
              const primeiraBarbearia = barbeariasData[0];
              console.log('✅ Usando primeira barbearia disponível:', primeiraBarbearia);
              setBarbeariaInfo(primeiraBarbearia);
              
              // Atualizar o barbeariaId para usar o ID da primeira barbearia
              window.history.replaceState(null, '', `/barbearia/${primeiraBarbearia.id}/visualizar-fila`);
            } else {
              throw new Error('Nenhuma barbearia encontrada');
            }
          } catch (listErr) {
            console.error('❌ Erro ao listar barbearias:', listErr);
            throw err; // Re-throw o erro original
          }
        }
        
        // Tentar carregar barbeiros (pode falhar se não autenticado)
        try {
          console.log('🔄 Carregando barbeiros para barbearia:', barbeariaId);
          console.log('🔍 Barbearia ID:', barbeariaId, 'Tipo:', typeof barbeariaId);
          
          // Primeiro tentar o método público (para clientes)
          try {
            const barbeirosResponse = await barbeariasService.listarBarbeirosPublicos(barbeariaId);
            console.log('📦 Response dos barbeiros (público):', barbeirosResponse);
            
            // Corrigido: extrair barbeiros da estrutura correta
            let barbeirosArray = [];
            
            if (barbeirosResponse.data && barbeirosResponse.data.barbeiros) {
              // Estrutura: { data: { barbeiros: [...] } }
              barbeirosArray = barbeirosResponse.data.barbeiros;
            } else if (barbeirosResponse.barbeiros) {
              // Estrutura: { barbeiros: [...] }
              barbeirosArray = barbeirosResponse.barbeiros;
            } else if (Array.isArray(barbeirosResponse)) {
              // Estrutura: [...] (array direto)
              barbeirosArray = barbeirosResponse;
            } else if (Array.isArray(barbeirosResponse.data)) {
              // Estrutura: { data: [...] }
              barbeirosArray = barbeirosResponse.data;
            }
            
            console.log('🪓 barbeirosData:', barbeirosResponse);
            console.log('👥 Array de barbeiros extraído:', barbeirosArray);
            
            if (Array.isArray(barbeirosArray)) {
              setBarbeiros(barbeirosArray);
              console.log('✅ Barbeiros carregados:', barbeirosArray.length);
              
              // Se os dados incluem informações da barbearia, atualizar também
              if (barbeirosResponse.data && barbeirosResponse.data.barbearia && !barbeariaInfo) {
                console.log('🏪 Atualizando informações da barbearia:', barbeirosResponse.data.barbearia);
                setBarbeariaInfo(barbeirosResponse.data.barbearia);
              }
            } else {
              setBarbeiros([]);
              console.log('⚠️ Nenhum barbeiro encontrado na resposta.');
            }
          } catch (err) {
            console.log('⚠️ Não foi possível carregar barbeiros:', publicErr.message);
            console.error('❌ Erro completo:', publicErr);
            setBarbeiros([]);
          }
        } catch (err) {
          console.log('⚠️ Não foi possível carregar barbeiros (pode requerer autenticação):', err.message);
          setBarbeiros([]);
        }
        setApiStatus('available');

        // Tentar carregar fila atual (pode falhar se não autenticado)
        try {
          await carregarFilaAtual();
        } catch (err) {
          console.log('⚠️ Não foi possível carregar fila atual (pode requerer autenticação):', err.message);
          // Não definir erro aqui para não interromper a experiência do usuário
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

  // Verificar se há cliente ativo na sessão
  useEffect(() => {
    const verificarClienteAtivo = async () => {
      try {
        // Verificar se há token no localStorage
        const token = localStorage.getItem('fila_token');
        const barbeariaIdStorage = localStorage.getItem('fila_barbearia_id');

        if (token && barbeariaIdStorage && parseInt(barbeariaIdStorage) === barbeariaId) {
          console.log('🔍 Verificando cliente ativo no localStorage...');
          console.log('🎫 Token encontrado:', token);
          console.log('🏪 Barbearia ID:', barbeariaId);
          
                      try {
              const cliente = await filaService.obterStatusCliente(token, barbeariaId);
              console.log('📦 Response do status do cliente:', cliente);
              
              if (cliente) {
                // Verificar se a resposta tem a estrutura esperada
                const clienteData = cliente.data || cliente;
                console.log('✅ Cliente encontrado no servidor:', clienteData);
                
                // Garantir que o token esteja no objeto cliente
                const clienteComToken = {
                  ...clienteData,
                  token: token
                };
                setClienteAtual(clienteComToken);
              } else {
                console.log('⚠️ Cliente não encontrado no servidor, limpando localStorage...');
                limparLocalStorage();
              }
          } catch (statusError) {
            console.log('⚠️ Erro ao verificar status no servidor, tentando carregar do localStorage...');
            // Tentar carregar do localStorage como fallback
            const clienteData = localStorage.getItem('cliente_data');
            if (clienteData) {
              try {
                const cliente = JSON.parse(clienteData);
                console.log('✅ Cliente carregado do localStorage:', cliente);
                setClienteAtual(cliente);
              } catch (parseError) {
                console.log('❌ Erro ao parsear dados do localStorage, limpando...');
                limparLocalStorage();
              }
            } else {
              console.log('❌ Nenhum dado encontrado, limpando localStorage...');
              limparLocalStorage();
            }
          }
        }
      } catch (err) {
        console.error('❌ Erro ao verificar cliente ativo:', err);
        limparLocalStorage();
      }
    };

    if (apiStatus === 'available') {
      verificarClienteAtivo();
    }
  }, [barbeariaId, apiStatus]);

  // Atualização automática da fila
  useEffect(() => {
    if (apiStatus !== 'available') return;

    const interval = setInterval(() => {
      carregarFilaAtual();
    }, 30000); // Atualiza a cada 30 segundos

    return () => clearInterval(interval);
  }, [barbeariaId, apiStatus]);

  // Funções auxiliares
  const limparLocalStorage = () => {
    localStorage.removeItem('fila_token');
    localStorage.removeItem('fila_barbearia_id');
    localStorage.removeItem('cliente_data');
    localStorage.removeItem('fila_timestamp');
    setClienteAtual(null);
  };

  const carregarFilaAtual = async () => {
    try {
      console.log('🔄 Carregando fila atual para barbearia:', barbeariaId);
      const response = await filaService.obterFilaCompleta(barbeariaId);
      console.log('📦 Response da fila:', response);
      
      const filaData = response.data || response;
      console.log('📋 Dados da fila:', filaData);
      
      const filaArray = filaData.clientes || [];
      
      // Buscar estatísticas do endpoint específico
      try {
        const estatisticasResponse = await filaService.getEstatisticas(barbeariaId);
        const estatisticasData = estatisticasResponse.data || estatisticasResponse;
        
        console.log('📊 Estatísticas do endpoint:', estatisticasData);
        
        // Mapear os dados do novo formato
        const estatisticasMapeadas = {
          total: estatisticasData.fila?.total || 0,
          aguardando: estatisticasData.fila?.aguardando || 0,
          atendendo: estatisticasData.fila?.atendendo || 0,
          proximo: estatisticasData.fila?.proximo || 0,
          finalizado: estatisticasData.fila?.finalizado || 0,
          removido: estatisticasData.fila?.removido || 0,
          barbeirosTotal: estatisticasData.barbeiros?.total || 0,
          barbeirosAtendendo: estatisticasData.barbeiros?.atendendo || 0,
          barbeirosDisponiveis: estatisticasData.barbeiros?.disponiveis || 0,
          tempoMedioEspera: estatisticasData.tempos?.medioEspera || 0,
          tempoMedioAtendimento: estatisticasData.tempos?.medioAtendimento || 0,
          tempoEstimadoProximo: estatisticasData.tempos?.estimadoProximo || 0,
          totalAtendidos24h: estatisticasData.ultimas24h?.totalAtendidos || 0,
          tempoMedioEspera24h: estatisticasData.ultimas24h?.tempoMedioEspera || 0,
          clientesPorHora: estatisticasData.ultimas24h?.clientesPorHora || 0
        };
        
        setEstatisticas(estatisticasMapeadas);
      } catch (err) {
        console.error('❌ Erro ao buscar estatísticas:', err);
        // Fallback para estatísticas básicas
        const estatisticasBasicas = {
          total: filaArray.length,
          aguardando: filaArray.filter(c => c.status === 'aguardando').length,
          atendendo: filaArray.filter(c => c.status === 'em_atendimento' || c.status === 'atendendo').length,
          proximo: filaArray.filter(c => c.status === 'próximo' || c.status === 'proximo').length,
          tempoMedioEspera: 15
        };
        setEstatisticas(estatisticasBasicas);
      }
      
      console.log('👥 Fila array:', filaArray);
      
      setFila(filaArray);
    } catch (err) {
      console.error('❌ Erro ao carregar fila atual:', err);
      // Não definir dados mockados - deixar como está
    }
  };



  // Entrar na fila
  const entrarNaFila = useCallback(async (dados) => {
    console.log('🚀 entrarNaFila chamada com dados:', dados);
    console.log('🏪 barbeariaId no hook:', barbeariaId);
    
    setLoading(true);
    setError(null);

    // Debug: verificar estado atual dos barbeiros
    console.log('🔍 Estado atual dos barbeiros no hook:', barbeiros);
    console.log('🔍 Tipo de barbeiros:', typeof barbeiros);
    console.log('🔍 É array?', Array.isArray(barbeiros));
    console.log('🔍 Quantidade:', barbeiros?.length);
    
    // Se não há barbeiros no estado, tentar carregar novamente
    if (!barbeiros || barbeiros.length === 0) {
      console.log('⚠️ Barbeiros não carregados, tentando carregar novamente...');
      
      try {
        const barbeirosResponse = await barbeariasService.listarBarbeirosPublicos(barbeariaId);
        console.log('📦 Nova resposta dos barbeiros:', barbeirosResponse);
        
        // Extrair barbeiros da resposta
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
        
        console.log('👥 Barbeiros extraídos:', barbeirosArray);
        
        if (!barbeirosArray || barbeirosArray.length === 0) {
          console.log('❌ Nenhum barbeiro disponível após recarregamento');
          setError('Não é possível entrar na fila. A barbearia está fechada no momento.');
          setLoading(false);
          return;
        }
        
        // Usar os barbeiros recarregados
        console.log(`✅ Usando ${barbeirosArray.length} barbeiros recarregados`);
        
      } catch (err) {
        console.error('❌ Erro ao recarregar barbeiros:', err);
        setError('Erro ao verificar disponibilidade de barbeiros.');
        setLoading(false);
        return;
      }
    } else {
      console.log(`✅ Barbeiros já carregados: ${barbeiros.length}`);
    }

    try {
      const dadosCliente = {
        nome: dados.nome,
        telefone: dados.telefone
      };

      // Adicionar barbeiro_id apenas se não for 'Fila Geral'
      if (dados.barbeiro && dados.barbeiro !== 'Fila Geral') {
        dadosCliente.barbeiro_id = dados.barbeiro;
      }

      console.log('📤 Dados do cliente sendo enviados:', dadosCliente);
      console.log('🎯 Barbeiro selecionado:', dados.barbeiro);
      console.log('🆔 Barbeiro ID:', dadosCliente.barbeiro_id);
      console.log('🏪 Barbearia ID:', barbeariaId);

      // Adicionar barbearia_id aos dados
      const dadosCompletos = {
        ...dadosCliente,
        barbearia_id: barbeariaId
      };

      console.log('📦 Dados completos sendo enviados:', dadosCompletos);
      console.log('🔍 Verificando se barbearia_id está presente:', dadosCompletos.barbearia_id);

      console.log('📤 Dados completos sendo enviados:', dadosCompletos);

      const response = await filaService.entrarNaFila(dadosCompletos);
      
      console.log('📦 Response do servidor:', response);
      console.log('🔍 Estrutura da resposta:', {
        hasResponse: !!response,
        hasCliente: !!response?.cliente,
        hasData: !!response?.data,
        hasToken: !!response?.token,
        responseKeys: response ? Object.keys(response) : 'undefined'
      });

      // Verificar se a resposta tem a estrutura esperada
      const cliente = response.cliente || response.data?.cliente || response;
      const token = response.token || response.data?.token || response.data?.cliente?.token || response.id;
      
      // Verificar se há token na resposta do backend
      if (!token) {
        console.error('❌ Nenhum token encontrado na resposta do backend');
        throw new Error('Token não foi gerado pelo servidor. Tente novamente.');
      }
      
      console.log('🔍 Dados extraídos:', {
        cliente: cliente,
        token: token,
        clienteKeys: cliente ? Object.keys(cliente) : 'undefined'
      });

      // Verificar se a resposta é válida
      if (!response) {
        console.error('❌ Resposta vazia do servidor');
        throw new Error('Resposta vazia do servidor');
      }

      // Verificar se há erro na resposta
      if (response.error) {
        console.error('❌ Erro na resposta:', response.error);
        throw new Error(response.error || 'Erro desconhecido');
      }
      
      // Se há mensagem de sucesso, logar mas não tratar como erro
      if (response.message) {
        console.log('✅ Mensagem do servidor:', response.message);
      }

      // Atualizar estado local
      await carregarFilaAtual();

      // Salvar no localStorage
      console.log('💾 Salvando dados no localStorage...');
      console.log('🎫 Token:', token);
      console.log('📋 Cliente:', cliente);
      console.log('🏪 Barbearia ID:', barbeariaId);
      
      localStorage.setItem('fila_token', token);
      localStorage.setItem('cliente_data', JSON.stringify(cliente));
      localStorage.setItem('fila_barbearia_id', barbeariaId.toString());
      localStorage.setItem('fila_timestamp', Date.now().toString());

      console.log('✅ Dados salvos no localStorage');
      console.log('🔍 Verificando localStorage:');
      console.log('  - fila_token:', localStorage.getItem('fila_token'));
      console.log('  - cliente_data:', localStorage.getItem('cliente_data'));
      console.log('  - fila_barbearia_id:', localStorage.getItem('fila_barbearia_id'));
      
      // Garantir que o token esteja no objeto cliente
      const clienteComToken = {
        ...cliente,
        token: token
      };
      setClienteAtual(clienteComToken);

      const resultado = { 
        token: token, 
        posicao: cliente?.posicao || cliente?.position || 1, 
        tempoEstimado: cliente?.tempo_estimado || cliente?.estimated_time || 15 
      };

      console.log('🎯 Resultado retornado:', resultado);
      console.log('🔍 Verificando se resultado é válido:', {
        hasToken: !!resultado?.token,
        hasPosicao: !!resultado?.posicao,
        hasTempoEstimado: !!resultado?.tempoEstimado
      });
      return resultado;
    } catch (err) {
      setError('Erro ao entrar na fila. Verifique sua conexão e tente novamente.');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [barbeariaId]);

  // Sair da fila
  const sairDaFila = useCallback(async (token) => {
    setLoading(true);
    setError(null);

    try {
      await filaService.sairDaFila(barbeariaId, token);
      
      // Atualizar estado local
      await carregarFilaAtual();

      // Limpar localStorage
      console.log('🧹 Limpando dados do localStorage...');
      limparLocalStorage();
      console.log('✅ Dados limpos do localStorage');

      return true;
    } catch (err) {
      setError('Erro ao sair da fila. Tente novamente.');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [barbeariaId]);

  // Obter status da fila
  const obterStatusFila = useCallback(async (token) => {
    setLoading(true);
    setError(null);

    try {
      const cliente = await filaService.obterStatusCliente(token, barbeariaId);

      if (!cliente) {
        throw new Error('Cliente não encontrado na fila');
      }

      return cliente;
    } catch (err) {
      setError('Erro ao obter status da fila.');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [barbeariaId]);

  // Obter fila atual
  const obterFilaAtual = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const filaData = await filaService.obterFilaPublica(barbeariaId);
      return filaData.fila || [];
    } catch (err) {
      setError('Erro ao obter fila atual.');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [barbeariaId]);

  // Atualizar posição manualmente
  const atualizarPosicao = useCallback(async (token) => {
    setLoading(true);
    setError(null);

    try {
      const cliente = await filaService.obterStatusCliente(token, barbeariaId);

      if (!cliente) {
        throw new Error('Cliente não encontrado na fila');
      }

      // Atualizar dados da fila
      await carregarFilaAtual();

      // Atualizar cliente atual
      setClienteAtual(cliente);
      localStorage.setItem('cliente_data', JSON.stringify(cliente));

      return cliente;
    } catch (err) {
      setError('Erro ao atualizar posição.');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [barbeariaId]);

  // Funções para admin/barbeiro
  const chamarProximo = useCallback(async () => {
    try {
      await filaService.chamarProximo(barbeariaId);
      await carregarFilaAtual();
    } catch (err) {
      setError('Erro ao chamar próximo cliente.');
      throw err;
    }
  }, [barbeariaId]);

  const finalizarAtendimento = useCallback(async (clienteId) => {
    try {
      await filaService.finalizarAtendimento(clienteId);
      await carregarFilaAtual();
    } catch (err) {
      setError('Erro ao finalizar atendimento.');
      throw err;
    }
  }, [barbeariaId]);

  const adicionarClienteManual = useCallback(async (dadosCliente) => {
    try {
      await filaService.adicionarClienteManual(barbeariaId, dadosCliente);
      await carregarFilaAtual();
    } catch (err) {
      setError('Erro ao adicionar cliente.');
      throw err;
    }
  }, [barbeariaId]);

  const removerCliente = useCallback(async (clienteId) => {
    try {
      await filaService.removerCliente(clienteId);
      await carregarFilaAtual();
    } catch (err) {
      setError('Erro ao remover cliente.');
      throw err;
    }
  }, [barbeariaId]);

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
    clienteAtual,
    loading,
    error,
    barbeiros,
    estatisticas,
    barbeariaInfo,
    apiStatus,
    
    // Funções para clientes
    entrarNaFila,
    sairDaFila,
    obterStatusFila,
    obterFilaAtual,
    atualizarPosicao,
    
    // Funções para admin/barbeiro
    chamarProximo,
    finalizarAtendimento,
    adicionarClienteManual,
    removerCliente,
    
    // Funções auxiliares
    carregarFilaAtual,
    limparLocalStorage,
    verificarStatusAPI
  };
}; 