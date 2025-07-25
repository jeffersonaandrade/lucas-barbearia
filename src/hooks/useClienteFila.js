// Hook especializado para clientes
// Apenas endpoints necessários para clientes

import { useState, useEffect, useCallback } from 'react';
import { filaService, barbeariasService } from '@/services/api.js';
import { filaCache, barbeariasCache } from '@/utils/cache.js';

export const useClienteFila = (barbeariaId = null) => {
  const [fila, setFila] = useState([]);
  const [clienteAtual, setClienteAtual] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [barbeiros, setBarbeiros] = useState([]);
  const [estatisticas, setEstatisticas] = useState({});
  const [barbeariaInfo, setBarbeariaInfo] = useState(null);
  const [apiStatus, setApiStatus] = useState('checking');

  // Carregar dados iniciais
  useEffect(() => {
    if (!barbeariaId) {
      console.log('⚠️ Nenhum barbeariaId fornecido, aguardando...');
      return;
    }

    const carregarDados = async () => {
      try {
        setLoading(true);
        setError(null);
        setApiStatus('checking');

        // Carregar informações da barbearia com cache
        try {
          const barbeariaData = await barbeariasCache.getBarbearia(
            barbeariasService.obterBarbearia,
            barbeariaId
          );
          setBarbeariaInfo(barbeariaData.data || barbeariaData);
        } catch (err) {
          console.log('⚠️ Barbearia específica não encontrada, tentando listar todas...');
          
          try {
            const barbeariasData = await barbeariasCache.getBarbearias(
              barbeariasService.listarBarbearias
            );
            const barbeariasArray = barbeariasData.data || barbeariasData;
            
            if (barbeariasArray && barbeariasArray.length > 0) {
              const primeiraBarbearia = barbeariasArray[0];
              console.log('✅ Usando primeira barbearia disponível:', primeiraBarbearia);
              setBarbeariaInfo(primeiraBarbearia);
              
              // Atualizar o barbeariaId para usar o ID da primeira barbearia
              window.history.replaceState(null, '', `/barbearia/${primeiraBarbearia.id}/visualizar-fila`);
            } else {
              throw new Error('Nenhuma barbearia encontrada');
            }
          } catch (listErr) {
            console.error('❌ Erro ao listar barbearias:', listErr);
            throw err;
          }
        }
        
        // Carregar barbeiros com cache (endpoint público)
        try {
          console.log('🔄 Carregando barbeiros para barbearia:', barbeariaId);
          const barbeirosData = await barbeariasCache.getBarbeiros(
            barbeariasService.listarBarbeiros,
            { barbearia_id: barbeariaId, status: 'ativo', public: true }
          );
          
          const barbeirosArray = barbeirosData.data || barbeirosData;
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

  // Verificar se há cliente ativo na sessão
  useEffect(() => {
    const verificarClienteAtivo = async () => {
      try {
        const token = localStorage.getItem('fila_token');
        const barbeariaIdStorage = localStorage.getItem('fila_barbearia_id');

        if (token && barbeariaIdStorage && parseInt(barbeariaIdStorage) === barbeariaId) {
          console.log('🔍 Verificando cliente ativo no localStorage...');
          
          try {
            const cliente = await filaService.obterStatusCliente(token);
            
            if (cliente) {
              const clienteData = cliente.data || cliente;
              console.log('✅ Cliente encontrado no servidor:', clienteData);
              setClienteAtual(clienteData);
            } else {
              console.log('⚠️ Cliente não encontrado no servidor, limpando localStorage...');
              limparLocalStorage();
            }
          } catch (statusError) {
            console.log('⚠️ Erro ao verificar status no servidor, tentando carregar do localStorage...');
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
      
      const filaData = await filaCache.getFila(
        filaService.obterFila,
        barbeariaId
      );
      
      const filaArray = filaData.fila || [];
      const estatisticasObj = filaData.estatisticas || {};
      
      setFila(filaArray);
      setEstatisticas(estatisticasObj);
    } catch (err) {
      console.error('❌ Erro ao carregar fila atual:', err);
    }
  };

  // Gerar token único
  const gerarToken = useCallback(() => {
    return 'token_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }, []);

  // Entrar na fila (CLIENTE)
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

      const response = await filaService.entrarNaFila(barbeariaId, dadosCliente);
      
      const cliente = response.cliente || response.data?.cliente || response;
      let token = response.token || response.data?.token || response.id;
      
      if (!token) {
        console.log('⚠️ Nenhum token encontrado na resposta, gerando token único...');
        token = gerarToken();
      }

      // Invalidar cache da fila
      filaCache.invalidate(barbeariaId);

      // Atualizar estado local
      await carregarFilaAtual();

      // Salvar no localStorage
      localStorage.setItem('fila_token', token);
      localStorage.setItem('cliente_data', JSON.stringify(cliente));
      localStorage.setItem('fila_barbearia_id', barbeariaId.toString());
      localStorage.setItem('fila_timestamp', Date.now().toString());
      
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

  // Sair da fila (CLIENTE)
  const sairDaFila = useCallback(async (token) => {
    setLoading(true);
    setError(null);

    try {
      await filaService.sairDaFila(barbeariaId, token);
      
      // Invalidar cache da fila
      filaCache.invalidate(barbeariaId);

      // Atualizar estado local
      await carregarFilaAtual();

      // Limpar localStorage
      limparLocalStorage();

      return true;
    } catch (err) {
      setError('Erro ao sair da fila. Tente novamente.');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [barbeariaId]);

  // Obter status da fila (CLIENTE)
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
  }, []);

  // Obter fila atual (CLIENTE)
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

  // Atualizar posição manualmente (CLIENTE)
  const atualizarPosicao = useCallback(async (token) => {
    setLoading(true);
    setError(null);

    try {
      const cliente = await filaService.obterStatusCliente(token);

      if (!cliente) {
        throw new Error('Cliente não encontrado na fila');
      }

      // Invalidar cache da fila
      filaCache.invalidate(barbeariaId);

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
    
    // Funções para clientes (APENAS)
    entrarNaFila,
    sairDaFila,
    obterStatusFila,
    obterFilaAtual,
    atualizarPosicao,
    gerarToken,
    
    // Funções auxiliares
    carregarFilaAtual,
    limparLocalStorage,
    verificarStatusAPI
  };
}; 