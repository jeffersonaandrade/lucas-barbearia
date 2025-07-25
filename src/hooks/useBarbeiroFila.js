// Hook especializado para barbeiros
// Endpoints necessários para barbeiros gerenciarem suas filas

import { useState, useEffect, useCallback } from 'react';
import { filaService, barbeariasService, usuariosService } from '@/services/api.js';
import { filaCache, barbeariasCache, barbeirosCache } from '@/utils/cache.js';

export const useBarbeiroFila = (barbeariaId = null) => {
  const [fila, setFila] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [barbeiros, setBarbeiros] = useState([]);
  const [estatisticas, setEstatisticas] = useState({});
  const [barbeariaInfo, setBarbeariaInfo] = useState(null);
  const [apiStatus, setApiStatus] = useState('checking');
  const [statusBarbeiro, setStatusBarbeiro] = useState({});
  const [atendendoAtual, setAtendendoAtual] = useState(null);

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
          const barbeirosData = await barbeirosCache.getBarbeiros(
            barbeariasService.listarBarbeiros,
            { barbearia_id: barbeariaId, status: 'ativo' }
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

  // Carregar status do barbeiro
  useEffect(() => {
    const carregarStatusBarbeiro = async () => {
      try {
        const response = await usuariosService.obterStatusBarbeiro();
        console.log('Status do barbeiro carregado:', response.data);
        setStatusBarbeiro(response.data);
      } catch (error) {
        console.error('Erro ao carregar status do barbeiro:', error);
        setStatusBarbeiro({});
      }
    };

    if (apiStatus === 'available') {
      carregarStatusBarbeiro();
    }
  }, [apiStatus]);

  // Atualização automática da fila
  useEffect(() => {
    if (apiStatus !== 'available') return;

    const interval = setInterval(() => {
      carregarFilaAtual();
    }, 30000); // Atualiza a cada 30 segundos

    return () => clearInterval(interval);
  }, [barbeariaId, apiStatus]);

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

  // FUNÇÕES ESPECÍFICAS PARA BARBEIROS

  // Chamar próximo cliente (BARBEIRO)
  const chamarProximo = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      await filaService.chamarProximo(barbeariaId);
      
      // Invalidar cache da fila
      filaCache.invalidate(barbeariaId);

      // Atualizar estado local
      await carregarFilaAtual();

      console.log('✅ Próximo cliente chamado com sucesso');
    } catch (err) {
      setError('Erro ao chamar próximo cliente.');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [barbeariaId]);

  // Finalizar atendimento (BARBEIRO)
  const finalizarAtendimento = useCallback(async (clienteId) => {
    setLoading(true);
    setError(null);

    try {
      await filaService.finalizarAtendimento(barbeariaId, clienteId);
      
      // Invalidar cache da fila
      filaCache.invalidate(barbeariaId);

      // Atualizar estado local
      await carregarFilaAtual();

      // Limpar atendimento atual se for o mesmo cliente
      if (atendendoAtual && atendendoAtual.id === clienteId) {
        setAtendendoAtual(null);
      }

      console.log('✅ Atendimento finalizado com sucesso');
    } catch (err) {
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
      await filaService.adicionarClienteManual(barbeariaId, dadosCliente);
      
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
      await filaService.removerCliente(barbeariaId, clienteId);
      
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
      const dados = {
        barbearia_id: barbeariaId,
        barbeiro_id: statusBarbeiro.id || statusBarbeiro.user_id
      };

      await usuariosService.atualizarStatusBarbeiro(acao, dados);
      
      // Invalidar cache de barbeiros
      barbeirosCache.invalidate(barbeariaId);

      // Recarregar status do barbeiro
      const response = await usuariosService.obterStatusBarbeiro();
      setStatusBarbeiro(response.data);

      console.log(`✅ Status do barbeiro ${acao === 'ativar' ? 'ativado' : 'desativado'} com sucesso`);
    } catch (err) {
      setError(`Erro ao ${acao} status do barbeiro.`);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [barbeariaId, statusBarbeiro]);

  // Iniciar atendimento (BARBEIRO)
  const iniciarAtendimento = useCallback(async (clienteId = null) => {
    setLoading(true);
    setError(null);

    try {
      // Se não foi passado clienteId, pegar o primeiro da fila
      if (!clienteId && fila.length > 0) {
        const primeiroCliente = fila.find(cliente => cliente.status === 'aguardando');
        if (primeiroCliente) {
          clienteId = primeiroCliente.id;
        }
      }

      if (!clienteId) {
        throw new Error('Nenhum cliente disponível para atendimento');
      }

      // Atualizar status do cliente para 'atendendo'
      const cliente = fila.find(c => c.id === clienteId);
      if (cliente) {
        setAtendendoAtual(cliente);
      }

      // Invalidar cache da fila
      filaCache.invalidate(barbeariaId);

      // Atualizar estado local
      await carregarFilaAtual();

      console.log('✅ Atendimento iniciado com sucesso');
    } catch (err) {
      setError('Erro ao iniciar atendimento.');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [barbeariaId, fila]);

  // Verificar se o barbeiro está ativo
  const isBarbeiroAtivo = useCallback((barbeariaId) => {
    if (!statusBarbeiro.barbearias) return false;
    
    return statusBarbeiro.barbearias.some(barbearia => 
      barbearia.barbearia_id === parseInt(barbeariaId) && barbearia.ativo === true
    );
  }, [statusBarbeiro]);

  // Obter fila filtrada por barbeiro
  const getFilaBarbeiro = useCallback(() => {
    if (!statusBarbeiro.id) return [];
    
    return fila.filter(cliente => 
      cliente.barbeiro_id === statusBarbeiro.id || 
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