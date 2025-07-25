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
    // Se não há barbeariaId, não carregar dados
    if (!barbeariaId) {
      console.log('⚠️ Nenhum barbeariaId fornecido, aguardando...');
      return;
    }

    const carregarDados = async () => {
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
          
          // Primeiro tentar o método público (para clientes)
          try {
            const barbeirosResponse = await barbeariasService.listarBarbeirosPublicos(barbeariaId);
            console.log('📦 Response dos barbeiros (público):', barbeirosResponse);
            
            const barbeirosData = barbeirosResponse.data || barbeirosResponse;
            console.log('👨‍💼 Dados dos barbeiros:', barbeirosData);
            
            const barbeirosArray = barbeirosData.barbeiros || barbeirosData;
            console.log('👥 Array de barbeiros:', barbeirosArray);
            
            setBarbeiros(barbeirosArray);
          } catch (publicErr) {
            console.log('⚠️ Método público falhou, tentando método autenticado...');
            
            // Se o método público falhar, tentar o método autenticado
            const barbeirosResponse = await barbeariasService.listarBarbeiros({ 
              barbearia_id: barbeariaId,
              ativo: true,
              disponivel: true
            });
            console.log('📦 Response dos barbeiros (autenticado):', barbeirosResponse);
            
            const barbeirosData = barbeirosResponse.data || barbeirosResponse;
            console.log('👨‍💼 Dados dos barbeiros:', barbeirosData);
            
            const barbeirosArray = barbeirosData.barbeiros || barbeirosData;
            console.log('👥 Array de barbeiros:', barbeirosArray);
            
            setBarbeiros(barbeirosArray);
          }
          
          // Se os dados incluem informações da barbearia, atualizar também
          if (barbeirosData.barbearia && !barbeariaInfo) {
            console.log('🏪 Atualizando informações da barbearia:', barbeirosData.barbearia);
            setBarbeariaInfo(barbeirosData.barbearia);
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
              const cliente = await filaService.obterStatusCliente(token);
              console.log('📦 Response do status do cliente:', cliente);
              
              if (cliente) {
                // Verificar se a resposta tem a estrutura esperada
                const clienteData = cliente.data || cliente;
                console.log('✅ Cliente encontrado no servidor:', clienteData);
                setClienteAtual(clienteData);
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
      const response = await filaService.obterFilaPublica(barbeariaId);
      console.log('📦 Response da fila:', response);
      
      const filaData = response.data || response;
      console.log('📋 Dados da fila:', filaData);
      
      const filaArray = filaData.fila || [];
      const estatisticasObj = filaData.estatisticas || {};
      
      console.log('👥 Fila array:', filaArray);
      console.log('📊 Estatísticas:', estatisticasObj);
      
      // Log detalhado da estrutura da fila
      if (filaArray.length > 0) {
        console.log('🔍 Primeiro item da fila:', filaArray[0]);
        console.log('🔍 Estrutura do primeiro item:', Object.keys(filaArray[0]));
      }
      
      // Log detalhado da estrutura das estatísticas
      console.log('🔍 Estrutura das estatísticas:', Object.keys(estatisticasObj));
      console.log('🔍 Conteúdo das estatísticas:', estatisticasObj);
      
      // Log detalhado da estrutura da fila
      console.log('🔍 Estrutura da fila:', Object.keys(filaArray));
      console.log('🔍 Conteúdo da fila:', filaArray);
      
      // Log da estrutura completa da resposta
      console.log('🔍 Estrutura completa da resposta:', {
        hasFila: !!filaData.fila,
        hasEstatisticas: !!filaData.estatisticas,
        filaLength: filaArray.length,
        estatisticasKeys: Object.keys(estatisticasObj)
      });
      
      setFila(filaArray);
      setEstatisticas(estatisticasObj);
    } catch (err) {
      console.error('❌ Erro ao carregar fila atual:', err);
      // Não definir dados mockados - deixar como está
    }
  };

  // Gerar token único
  const gerarToken = useCallback(() => {
    return 'token_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }, []);

  // Entrar na fila
  const entrarNaFila = useCallback(async (dados) => {
    setLoading(true);
    setError(null);

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

      const response = await filaService.entrarNaFila(barbeariaId, dadosCliente);
      
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
      let token = response.token || response.data?.token || response.id;
      
      // Se não há token na resposta, gerar um token único
      if (!token) {
        console.log('⚠️ Nenhum token encontrado na resposta, gerando token único...');
        token = 'token_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
      }
      
      console.log('🔍 Dados extraídos:', {
        cliente: cliente,
        token: token,
        clienteKeys: cliente ? Object.keys(cliente) : 'undefined'
      });

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
      
      setClienteAtual(cliente);

      return { 
        token: token, 
        posicao: cliente?.posicao || cliente?.position || 1, 
        tempoEstimado: cliente?.tempo_estimado || cliente?.estimated_time || 15 
      };
    } catch (err) {
      setError('Erro ao entrar na fila. Verifique sua conexão e tente novamente.');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [gerarToken, barbeariaId]);

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
      const cliente = await filaService.obterStatusCliente(token);

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
      const cliente = await filaService.obterStatusCliente(token);

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
      await filaService.finalizarAtendimento(barbeariaId, clienteId);
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
      await filaService.removerCliente(barbeariaId, clienteId);
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
    gerarToken,
    
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