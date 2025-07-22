import filaData from '@/data/fila.json';
import barbeariasData from '@/data/barbearias.json';

const STORAGE_KEY = 'lucas_barbearia_fila_data';
const BARBEARIAS_STORAGE_KEY = 'lucas_barbearia_barbearias_data';

// Função para obter dados da fila do localStorage ou usar dados padrão
export const getFilaData = () => {
  try {
    const storedData = localStorage.getItem(STORAGE_KEY);
    if (storedData) {
      const parsedData = JSON.parse(storedData);
      // Verificar se a estrutura está correta
      if (parsedData && parsedData.barbearias) {
        return parsedData;
      } else {
        console.warn('Dados do localStorage com estrutura inválida, usando dados padrão');
        localStorage.removeItem(STORAGE_KEY);
      }
    }
    // Se não há dados salvos ou são inválidos, usar dados padrão do JSON
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filaData));
    return filaData;
  } catch (error) {
    console.error('Erro ao carregar dados da fila:', error);
    // Limpar dados corrompidos
    localStorage.removeItem(STORAGE_KEY);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filaData));
    return filaData;
  }
};

// Função para obter dados de uma barbearia específica
export const getBarbeariaData = (barbeariaId) => {
  try {
    const data = getFilaData();
    
    if (!data || !data.barbearias) {
      console.error('Estrutura de dados inválida:', data);
      return null;
    }
    
    // Converter barbeariaId para string para garantir compatibilidade
    const barbeariaKey = String(barbeariaId);
    const barbeariaData = data.barbearias[barbeariaKey];
    
    if (!barbeariaData) {
      console.warn(`Barbearia ${barbeariaId} não encontrada nos dados`);
      return null;
    }
    
    return barbeariaData;
  } catch (error) {
    console.error('Erro ao carregar dados da barbearia:', error);
    return null;
  }
};

// Função para obter informações da barbearia
export const getBarbeariaInfo = (barbeariaId) => {
  try {
    const storedData = localStorage.getItem(BARBEARIAS_STORAGE_KEY);
    let data;
    
    if (storedData) {
      data = JSON.parse(storedData);
    } else {
      data = barbeariasData;
      localStorage.setItem(BARBEARIAS_STORAGE_KEY, JSON.stringify(barbeariasData));
    }
    
    return data.barbearias.find(b => b.id === parseInt(barbeariaId)) || null;
  } catch (error) {
    console.error('Erro ao carregar informações da barbearia:', error);
    return barbeariasData.barbearias.find(b => b.id === parseInt(barbeariaId)) || null;
  }
};

// Função para salvar dados da fila no localStorage
export const saveFilaData = (data) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    return true;
  } catch (error) {
    console.error('Erro ao salvar dados da fila:', error);
    return false;
  }
};

// Função para adicionar novo cliente à fila
export const adicionarCliente = (dadosCliente, barbeariaId) => {
  const data = getFilaData();
  const barbeariaKey = String(barbeariaId);
  const barbeariaData = data.barbearias[barbeariaKey];
  const barbeariaInfo = getBarbeariaInfo(barbeariaId);
  
  if (!barbeariaData || !barbeariaInfo) {
    throw new Error('Barbearia não encontrada');
  }
  
  const novoId = Math.max(...barbeariaData.fila.map(c => c.id), 0) + 1;
  const novaPosicao = barbeariaData.fila.length + 1;
  const tempoEstimado = novaPosicao * barbeariaInfo.configuracoes.tempoMedioPorCliente;
  
  const novoCliente = {
    id: novoId,
    nome: dadosCliente.nome,
    telefone: dadosCliente.telefone,
    barbeiro: dadosCliente.barbeiro,
    status: 'aguardando',
    posicao: novaPosicao,
    tempoEstimado,
    token: dadosCliente.token,
    dataEntrada: new Date().toISOString()
  };

  barbeariaData.fila.push(novoCliente);
  barbeariaData.estatisticas.clientesAtivos = barbeariaData.fila.length;
  
  saveFilaData(data);
  return novoCliente;
};

// Função para remover cliente da fila
export const removerCliente = (token, barbeariaId) => {
  const data = getFilaData();
  const barbeariaKey = String(barbeariaId);
  const barbeariaData = data.barbearias[barbeariaKey];
  const barbeariaInfo = getBarbeariaInfo(barbeariaId);
  
  if (!barbeariaData || !barbeariaInfo) {
    return false;
  }
  
  const clienteIndex = barbeariaData.fila.findIndex(c => c.token === token);
  
  if (clienteIndex !== -1) {
    barbeariaData.fila.splice(clienteIndex, 1);
    
    // Reorganizar posições
    barbeariaData.fila.forEach((cliente, index) => {
      cliente.posicao = index + 1;
      cliente.tempoEstimado = (index + 1) * barbeariaInfo.configuracoes.tempoMedioPorCliente;
    });
    
    barbeariaData.estatisticas.clientesAtivos = barbeariaData.fila.length;
    barbeariaData.estatisticas.totalAtendidos += 1;
    
    saveFilaData(data);
    return true;
  }
  
  return false;
};

// Função para obter cliente por token
export const obterClientePorToken = (token, barbeariaId) => {
  const data = getFilaData();
  const barbeariaKey = String(barbeariaId);
  const barbeariaData = data.barbearias[barbeariaKey];
  
  if (!barbeariaData) {
    return null;
  }
  
  return barbeariaData.fila.find(c => c.token === token);
};

// Função para atualizar status da fila (simular progresso)
export const atualizarStatusFila = (barbeariaId) => {
  const data = getFilaData();
  const barbeariaKey = String(barbeariaId);
  const barbeariaData = data.barbearias[barbeariaKey];
  const barbeariaInfo = getBarbeariaInfo(barbeariaId);
  
  if (!barbeariaData || !barbeariaInfo) {
    return data;
  }
  
  let mudancas = false;

  // Simular progresso da fila
  barbeariaData.fila.forEach((cliente, index) => {
    if (cliente.status === 'atendendo' && cliente.tempoEstimado > 0) {
      cliente.tempoEstimado = Math.max(0, cliente.tempoEstimado - 1);
      mudancas = true;
      
      // Se terminou o atendimento, remover da fila
      if (cliente.tempoEstimado === 0) {
        barbeariaData.fila.splice(index, 1);
        barbeariaData.estatisticas.totalAtendidos += 1;
      }
    }
  });

  // Reorganizar posições após remoções
  if (mudancas) {
    barbeariaData.fila.forEach((cliente, index) => {
      cliente.posicao = index + 1;
      if (cliente.status === 'aguardando') {
        cliente.tempoEstimado = (index + 1) * barbeariaInfo.configuracoes.tempoMedioPorCliente;
      }
    });
    
    // Atualizar status "próximo"
    if (barbeariaData.fila.length > 0) {
      barbeariaData.fila[0].status = 'atendendo';
      if (barbeariaData.fila.length > 1) {
        barbeariaData.fila[1].status = 'próximo';
      }
    }
    
    barbeariaData.estatisticas.clientesAtivos = barbeariaData.fila.length;
    saveFilaData(data);
  }

  return data;
};

// Função para obter estatísticas
export const obterEstatisticas = (barbeariaId) => {
  try {
    const barbeariaData = getBarbeariaData(barbeariaId);
    
    if (!barbeariaData) {
      return {
        total: 0,
        atendendo: 0,
        proximo: 0,
        aguardando: 0,
        tempoMedio: 0,
        totalAtendidos: 0,
        avaliacaoMedia: 0
      };
    }
    
    return {
      total: barbeariaData.fila.length,
      atendendo: barbeariaData.fila.filter(c => c.status === 'atendendo').length,
      proximo: barbeariaData.fila.filter(c => c.status === 'próximo').length,
      aguardando: barbeariaData.fila.filter(c => c.status === 'aguardando').length,
      tempoMedio: barbeariaData.estatisticas.tempoMedioEspera,
      totalAtendidos: barbeariaData.estatisticas.totalAtendidos,
      avaliacaoMedia: barbeariaData.estatisticas.avaliacaoMedia
    };
  } catch (error) {
    console.error('Erro ao obter estatísticas:', error);
    return {
      total: 0,
      atendendo: 0,
      proximo: 0,
      aguardando: 0,
      tempoMedio: 0,
      totalAtendidos: 0,
      avaliacaoMedia: 0
    };
  }
};

// Função para obter lista de barbeiros da barbearia
export const obterBarbeiros = (barbeariaId) => {
  const barbeariaInfo = getBarbeariaInfo(barbeariaId);
  
  if (!barbeariaInfo) {
    return [];
  }
  
  // Filtrar apenas barbeiros disponíveis (sem filtro por dia)
  const barbeirosDisponiveis = barbeariaInfo.barbeiros.filter(barbeiro => 
    barbeiro.disponivel === true
  );
  
  return [
    { id: 'geral', nome: 'Fila Geral', disponivel: true },
    ...barbeirosDisponiveis
  ];
};

// Função para resetar dados (útil para testes)
export const resetarDados = () => {
  localStorage.removeItem(STORAGE_KEY);
  localStorage.removeItem(BARBEARIAS_STORAGE_KEY);
  return getFilaData();
};

// Função para inicializar dados (útil para primeira execução)
export const inicializarDados = () => {
  try {
    console.log('🚀 Inicializando dados...');
    
    // Limpar dados existentes
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(BARBEARIAS_STORAGE_KEY);
    
    // Salvar dados padrão
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filaData));
    localStorage.setItem(BARBEARIAS_STORAGE_KEY, JSON.stringify(barbeariasData));
    
    console.log('✅ Dados inicializados com sucesso');
    console.log('📊 Fila data:', filaData);
    console.log('🏪 Barbearias data:', barbeariasData);
    
    // Verificar se os dados foram salvos corretamente
    const storedBarbearias = localStorage.getItem(BARBEARIAS_STORAGE_KEY);
    const parsedBarbearias = JSON.parse(storedBarbearias);
    console.log('💾 Dados salvos no localStorage:', parsedBarbearias);
    
    // Verificar barbeiros da primeira barbearia
    if (parsedBarbearias.barbearias && parsedBarbearias.barbearias[0]) {
      console.log('👥 Barbeiros da primeira barbearia:', parsedBarbearias.barbearias[0].barbeiros);
    }
    
    return true;
  } catch (error) {
    console.error('❌ Erro ao inicializar dados:', error);
    return false;
  }
};

// Função para limpar completamente o localStorage
export const limparLocalStorage = () => {
  try {
    localStorage.clear();
    console.log('localStorage limpo completamente');
    return true;
  } catch (error) {
    console.error('Erro ao limpar localStorage:', error);
    return false;
  }
};

// Função para exportar dados (útil para backup)
export const exportarDados = () => {
  const data = getFilaData();
  const dataStr = JSON.stringify(data, null, 2);
  const dataBlob = new Blob([dataStr], { type: 'application/json' });
  
  const link = document.createElement('a');
  link.href = URL.createObjectURL(dataBlob);
  link.download = `fila_barbearia_${new Date().toISOString().split('T')[0]}.json`;
  link.click();
};

// Função para importar dados (útil para backup)
export const importarDados = (jsonData) => {
  try {
    const data = JSON.parse(jsonData);
    saveFilaData(data);
    return true;
  } catch (error) {
    console.error('Erro ao importar dados:', error);
    return false;
  }
}; 