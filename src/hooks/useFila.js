import { useState, useEffect, useCallback } from 'react';
import { 
  getFilaData, 
  adicionarCliente, 
  removerCliente, 
  obterClientePorToken, 
  atualizarStatusFila, 
  obterEstatisticas, 
  obterBarbeiros,
  getBarbeariaData,
  getBarbeariaInfo,
  inicializarDados,
  limparLocalStorage
} from '@/services/filaDataService.js';

export const useFila = (barbeariaId = 1) => {
  const [fila, setFila] = useState([]);
  const [clienteAtual, setClienteAtual] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [barbeiros, setBarbeiros] = useState([]);
  const [estatisticas, setEstatisticas] = useState({});
  const [barbeariaInfo, setBarbeariaInfo] = useState(null);

    // Carregar dados iniciais
  useEffect(() => {
    const carregarDados = () => {
      try {
        // Verificar se os dados estão inicializados
        const storedData = localStorage.getItem('lucas_barbearia_fila_data');
        if (!storedData) {
          console.log('Inicializando dados pela primeira vez...');
          inicializarDados();
        }
        
        // Verificar se a estrutura está correta
        const filaData = getFilaData();
        if (!filaData || !filaData.barbearias) {
          console.log('Estrutura de dados inválida, reinicializando...');
          limparLocalStorage();
          inicializarDados();
        }
        
        const data = getBarbeariaData(barbeariaId);
        const info = getBarbeariaInfo(barbeariaId);
        
        if (data && info) {
          setFila(data.fila);
          setBarbeiros(obterBarbeiros(barbeariaId));
          setEstatisticas(obterEstatisticas(barbeariaId));
          setBarbeariaInfo(info);
        } else {
          console.error('Barbearia não encontrada:', barbeariaId);
          setError('Barbearia não encontrada');
        }
      } catch (err) {
        console.error('Erro ao carregar dados da fila:', err);
        setError('Erro ao carregar dados da fila');
      }
    };

    carregarDados();
  }, [barbeariaId]);

  // Carregar dados do cliente do localStorage
  useEffect(() => {
    console.log('🔄 useFila - Carregando dados do cliente...');
    const token = localStorage.getItem('fila_token');
    const clienteData = localStorage.getItem('cliente_data');
    const barbeariaId = localStorage.getItem('fila_barbearia_id');

    console.log('🎫 Token encontrado:', token);
    console.log('📋 Cliente data encontrado:', clienteData);
    console.log('🏪 Barbearia ID encontrado:', barbeariaId);

    if (token && clienteData && barbeariaId) {
      try {
        const cliente = JSON.parse(clienteData);
        console.log('✅ Cliente carregado com sucesso:', cliente);
        
        // Verificar se o cliente ainda existe na fila
        const clienteNaFila = obterClientePorToken(token, parseInt(barbeariaId));
        if (clienteNaFila) {
          console.log('✅ Cliente ainda está na fila:', clienteNaFila);
          setClienteAtual(clienteNaFila);
        } else {
          console.log('⚠️ Cliente não está mais na fila, limpando dados...');
          localStorage.removeItem('fila_token');
          localStorage.removeItem('cliente_data');
          localStorage.removeItem('fila_barbearia_id');
        }
      } catch (err) {
        console.error('❌ Erro ao carregar dados do cliente:', err);
        localStorage.removeItem('fila_token');
        localStorage.removeItem('cliente_data');
        localStorage.removeItem('fila_barbearia_id');
      }
    } else {
      console.log('⚠️ Dados incompletos no localStorage, limpando...');
      localStorage.removeItem('fila_token');
      localStorage.removeItem('cliente_data');
      localStorage.removeItem('fila_barbearia_id');
    }
  }, [barbeariaId]);

  // Simular atualização automática da fila
  useEffect(() => {
    const interval = setInterval(() => {
      try {
        const dataAtualizada = atualizarStatusFila(barbeariaId);
        const barbeariaData = dataAtualizada.barbearias[barbeariaId];
        if (barbeariaData) {
          setFila(barbeariaData.fila);
          setEstatisticas(obterEstatisticas(barbeariaId));
        }
      } catch (err) {
        console.error('Erro ao atualizar fila:', err);
      }
    }, 60000); // Atualiza a cada minuto

    return () => clearInterval(interval);
  }, [barbeariaId]);

  // Gerar token único
  const gerarToken = useCallback(() => {
    return 'token_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }, []);

  // Entrar na fila
  const entrarNaFila = useCallback(async (dados) => {
    setLoading(true);
    setError(null);

    try {
      // Simular delay da API
      await new Promise(resolve => setTimeout(resolve, 1500));

      const token = gerarToken();
      
      const novoCliente = adicionarCliente({
        nome: dados.nome,
        telefone: dados.telefone,
        barbeiro: dados.barbeiro,
        token
      }, barbeariaId);

      // Atualizar estado local
      const dataAtualizada = getBarbeariaData(barbeariaId);
      if (dataAtualizada) {
        setFila(dataAtualizada.fila);
        setEstatisticas(obterEstatisticas(barbeariaId));
      }

      // Salvar no localStorage
      console.log('💾 Salvando dados no localStorage...');
      console.log('🎫 Token:', token);
      console.log('📋 Cliente:', novoCliente);
      console.log('🏪 Barbearia ID:', barbeariaId);
      
      localStorage.setItem('fila_token', token);
      localStorage.setItem('cliente_data', JSON.stringify(novoCliente));
      localStorage.setItem('fila_barbearia_id', barbeariaId.toString());
      localStorage.setItem('fila_timestamp', Date.now().toString());

      console.log('✅ Dados salvos no localStorage');
      console.log('🔍 Verificando se foram salvos:');
      console.log('🎫 Token verificado:', localStorage.getItem('fila_token'));
      console.log('📋 Cliente verificado:', localStorage.getItem('cliente_data'));
      console.log('🏪 Barbearia ID verificado:', localStorage.getItem('fila_barbearia_id'));
      console.log('⏰ Timestamp verificado:', localStorage.getItem('fila_timestamp'));

      setClienteAtual(novoCliente);

      return { token, posicao: novoCliente.posicao, tempoEstimado: novoCliente.tempoEstimado };
    } catch (err) {
      setError('Erro ao entrar na fila. Tente novamente.');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [gerarToken]);

  // Sair da fila
  const sairDaFila = useCallback(async (token) => {
    setLoading(true);
    setError(null);

    try {
      // Simular delay da API
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Remover da fila
      const sucesso = removerCliente(token, barbeariaId);
      
      if (sucesso) {
        // Atualizar estado local
        const dataAtualizada = getBarbeariaData(barbeariaId);
        if (dataAtualizada) {
          setFila(dataAtualizada.fila);
          setEstatisticas(obterEstatisticas(barbeariaId));
        }

        // Limpar localStorage
        console.log('🧹 Limpando dados do localStorage...');
        localStorage.removeItem('fila_token');
        localStorage.removeItem('cliente_data');
        localStorage.removeItem('fila_barbearia_id');
        localStorage.removeItem('fila_timestamp');
        setClienteAtual(null);
        console.log('✅ Dados limpos do localStorage');
      }

      return sucesso;
    } catch (err) {
      setError('Erro ao sair da fila. Tente novamente.');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

    // Obter status da fila
  const obterStatusFila = useCallback(async (token) => {
    setLoading(true);
    setError(null);

    try {
      // Simular delay da API
      await new Promise(resolve => setTimeout(resolve, 800));

      const cliente = obterClientePorToken(token, barbeariaId);

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

  // Obter fila atual
  const obterFilaAtual = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      // Simular delay da API
      await new Promise(resolve => setTimeout(resolve, 500));

      const data = getBarbeariaData(barbeariaId);
      return data ? data.fila : [];
    } catch (err) {
      setError('Erro ao obter fila atual.');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

    // Atualizar posição manualmente
  const atualizarPosicao = useCallback(async (token) => {
    setLoading(true);
    setError(null);

    try {
      // Simular delay da API
      await new Promise(resolve => setTimeout(resolve, 500));

      const cliente = obterClientePorToken(token, barbeariaId);

      if (!cliente) {
        throw new Error('Cliente não encontrado na fila');
      }

      // Atualizar dados da fila
      const dataAtualizada = atualizarStatusFila(barbeariaId);
      const barbeariaData = dataAtualizada.barbearias[barbeariaId];
      if (barbeariaData) {
        setFila(barbeariaData.fila);
        setEstatisticas(obterEstatisticas(barbeariaId));
      }

      // Buscar cliente atualizado
      const clienteAtualizado = obterClientePorToken(token, barbeariaId);
      if (clienteAtualizado) {
        setClienteAtual(clienteAtualizado);
        localStorage.setItem('cliente_data', JSON.stringify(clienteAtualizado));
      }

      return clienteAtualizado;
    } catch (err) {
      setError('Erro ao atualizar posição.');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    fila,
    clienteAtual,
    loading,
    error,
    barbeiros,
    estatisticas,
    barbeariaInfo,
    entrarNaFila,
    sairDaFila,
    obterStatusFila,
    obterFilaAtual,
    atualizarPosicao,
    gerarToken
  };
}; 