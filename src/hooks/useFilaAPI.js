import { useState, useEffect, useCallback } from 'react';
import { filaService, barbeariasService } from '@/services/api.js';

export const useFilaAPI = (barbeariaId = null) => {
  const [fila, setFila] = useState([]);
  const [clienteAtual, setClienteAtual] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [barbeiros, setBarbeiros] = useState([]);
  const [estatisticas, setEstatisticas] = useState({});
  const [barbeariaInfo, setBarbeariaInfo] = useState(null);

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
          const barbeirosResponse = await barbeariasService.listarBarbeiros(barbeariaId);
          const barbeirosData = barbeirosResponse.data || barbeirosResponse;
          setBarbeiros(barbeirosData.barbeiros || barbeirosData);
        } catch (err) {
          console.log('⚠️ Não foi possível carregar barbeiros (pode requerer autenticação):', err.message);
          setBarbeiros([]);
        }

        // Tentar carregar fila atual (pode falhar se não autenticado)
        try {
          await carregarFilaAtual();
        } catch (err) {
          console.log('⚠️ Não foi possível carregar fila atual (pode requerer autenticação):', err.message);
          // Não definir erro aqui para não interromper a experiência do usuário
        }

      } catch (err) {
        console.error('Erro ao carregar dados da fila:', err);
        setError('Erro ao carregar dados da fila');
      } finally {
        setLoading(false);
      }
    };

    carregarDados();
  }, [barbeariaId]);

  // Carregar dados do cliente do localStorage (para compatibilidade)
  useEffect(() => {
    console.log('🔄 useFilaAPI - Carregando dados do cliente...');
    const token = localStorage.getItem('fila_token');
    const clienteData = localStorage.getItem('cliente_data');
    const barbeariaIdStorage = localStorage.getItem('fila_barbearia_id');

    console.log('🎫 Token encontrado:', token);
    console.log('📋 Cliente data encontrado:', clienteData);
    console.log('🏪 Barbearia ID encontrado:', barbeariaIdStorage);

    if (token && clienteData && barbeariaIdStorage && parseInt(barbeariaIdStorage) === barbeariaId) {
      try {
        const cliente = JSON.parse(clienteData);
        console.log('✅ Cliente carregado com sucesso:', cliente);
        
        // Verificar se o cliente ainda existe na fila
        verificarStatusCliente(token);
      } catch (err) {
        console.error('❌ Erro ao carregar dados do cliente:', err);
        limparDadosCliente();
      }
    } else {
      console.log('⚠️ Dados incompletos no localStorage, limpando...');
      limparDadosCliente();
    }
  }, [barbeariaId]);

  // Atualização automática da fila
  useEffect(() => {
    const interval = setInterval(() => {
      carregarFilaAtual();
    }, 30000); // Atualiza a cada 30 segundos

    return () => clearInterval(interval);
  }, [barbeariaId]);

  // Funções auxiliares
  const limparDadosCliente = () => {
    localStorage.removeItem('fila_token');
    localStorage.removeItem('cliente_data');
    localStorage.removeItem('fila_barbearia_id');
    localStorage.removeItem('fila_timestamp');
    setClienteAtual(null);
  };

  const carregarFilaAtual = async () => {
    try {
      const response = await filaService.obterFila(barbeariaId);
      const filaData = response.data || response;
      setFila(filaData.fila || []);
      setEstatisticas(filaData.estatisticas || {});
    } catch (err) {
      console.error('Erro ao carregar fila atual:', err);
      // Não definir dados mockados - deixar como está
    }
  };

  const verificarStatusCliente = async (token) => {
    try {
      const cliente = await filaService.obterStatusCliente(token);
      if (cliente) {
        console.log('✅ Cliente ainda está na fila:', cliente);
        setClienteAtual(cliente);
        localStorage.setItem('cliente_data', JSON.stringify(cliente));
      } else {
        console.log('⚠️ Cliente não está mais na fila, limpando dados...');
        limparDadosCliente();
      }
    } catch (err) {
      console.error('❌ Erro ao verificar status do cliente:', err);
      limparDadosCliente();
    }
  };

  // Entrar na fila
  const entrarNaFila = useCallback(async (dados) => {
    setLoading(true);
    setError(null);

    try {
      const dadosCliente = {
        nome: dados.nome,
        telefone: dados.telefone,
        barbeiro_id: dados.barbeiro === 'Fila Geral' ? null : dados.barbeiro
      };

      const response = await filaService.entrarNaFila(barbeariaId, dadosCliente);

      // Extrair dados da resposta
      const cliente = response.cliente || response.data?.cliente || response;
      const token = response.token || response.data?.token || response.data?.cliente?.token || response.id;

      if (!token) {
        console.error('❌ Nenhum token encontrado na resposta do backend');
        throw new Error('Token não foi gerado pelo servidor. Tente novamente.');
      }

      // Atualizar estado local
      await carregarFilaAtual();

      // Salvar no localStorage para compatibilidade
      console.log('💾 Salvando dados no localStorage...');
      console.log('🎫 Token:', token);
      console.log('📋 Cliente:', cliente);
      console.log('🏪 Barbearia ID:', barbeariaId);
      
      localStorage.setItem('fila_token', token);
      localStorage.setItem('cliente_data', JSON.stringify(cliente));
      localStorage.setItem('fila_barbearia_id', barbeariaId.toString());
      localStorage.setItem('fila_timestamp', Date.now().toString());

      console.log('✅ Dados salvos no localStorage');
      setClienteAtual(cliente);

      return { 
        token: token, 
        posicao: cliente?.posicao || cliente?.position || 1, 
        tempoEstimado: cliente?.tempo_estimado || cliente?.estimated_time || 15 
      };
    } catch (err) {
      setError('Erro ao entrar na fila. Tente novamente.');
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
      limparDadosCliente();
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
      const filaData = await filaService.obterFila(barbeariaId);
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

  return {
    // Estado
    fila,
    clienteAtual,
    loading,
    error,
    barbeiros,
    estatisticas,
    barbeariaInfo,
    
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
    limparDadosCliente
  };
}; 