// Configurações da API
export const API_CONFIG = {
  // URL base da API
  BASE_URL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
  
  // Timeout das requisições (em ms)
  TIMEOUT: 10000,
  
  // Intervalo de atualização da fila (em ms)
  UPDATE_INTERVAL: 30000,
  
  // Configurações de retry
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000,
  
  // Headers padrão
  DEFAULT_HEADERS: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  
  // Endpoints UNIFICADOS
  ENDPOINTS: {
    // Autenticação
    AUTH: {
      LOGIN: '/auth/login',
      LOGOUT: '/auth/logout',
      ME: '/auth/me',
    },
    
    // Barbearias
    BARBEARIAS: {
      LIST: '/barbearias',
      GET: (id) => `/barbearias/${id}`,
      CREATE: '/barbearias',
      UPDATE: (id) => `/barbearias/${id}`,
      DELETE: (id) => `/barbearias/${id}`,
      BARBEIROS: (filtros = {}) => {
        const params = new URLSearchParams();
        if (filtros.barbearia_id) params.append('barbearia_id', filtros.barbearia_id);
        if (filtros.status) params.append('status', filtros.status);
        if (filtros.public) params.append('public', filtros.public);
        const queryString = params.toString();
        return queryString ? `/users/barbeiros?${queryString}` : '/users/barbeiros';
      },
      ATIVAR_BARBEIRO: (barbeariaId, barbeiroId) => `/barbearias/${barbeariaId}/barbeiros/${barbeiroId}/ativar`,
      DESATIVAR_BARBEIRO: (barbeariaId, barbeiroId) => `/barbearias/${barbeariaId}/barbeiros/${barbeiroId}/desativar`,
    },
    
    // Fila UNIFICADA
    FILA: {
      ENTRAR: '/fila/entrar',
      GET: (barbeariaId) => `/fila-publica/${barbeariaId}`,
      STATUS: (token) => `/fila/status/${token}`,
      SAIR: (barbeariaId, token) => `/fila/${barbeariaId}/sair/${token}`,
      PROXIMO: (barbeariaId) => `/fila/${barbeariaId}/proximo`,
      FINALIZAR: (barbeariaId, clienteId) => `/fila/${barbeariaId}/finalizar/${clienteId}`,
      ADICIONAR: (barbeariaId) => `/fila/${barbeariaId}/adicionar`,
      REMOVER: (clienteId) => `/fila/remover/${clienteId}`,
    },
    
    // Avaliações com filtros
    AVALIACOES: {
      CREATE: '/avaliacoes',
      LIST: (filtros = {}) => {
        const params = new URLSearchParams();
        if (filtros.barbearia_id) params.append('barbearia_id', filtros.barbearia_id);
        if (filtros.barbeiro_id) params.append('barbeiro_id', filtros.barbeiro_id);
        if (filtros.page) params.append('page', filtros.page);
        if (filtros.limit) params.append('limit', filtros.limit);
        if (filtros.rating) params.append('rating', filtros.rating);
        const queryString = params.toString();
        return queryString ? `/avaliacoes?${queryString}` : '/avaliacoes';
      },
    },
    
    // Histórico com filtros
    HISTORICO: {
      GET: (barbeariaId, filtros = {}) => {
        const params = new URLSearchParams();
        if (filtros.data_inicio) params.append('data_inicio', filtros.data_inicio);
        if (filtros.data_fim) params.append('data_fim', filtros.data_fim);
        if (filtros.barbeiro_id) params.append('barbeiro_id', filtros.barbeiro_id);
        if (filtros.page) params.append('page', filtros.page);
        if (filtros.limit) params.append('limit', filtros.limit);
        const queryString = params.toString();
        return queryString ? `/barbearias/${barbeariaId}/historico?${queryString}` : `/barbearias/${barbeariaId}/historico`;
      },
      BARBEIRO: (barbeiroId, filtros = {}) => {
        const params = new URLSearchParams();
        if (filtros.data_inicio) params.append('data_inicio', filtros.data_inicio);
        if (filtros.data_fim) params.append('data_fim', filtros.data_fim);
        if (filtros.page) params.append('page', filtros.page);
        if (filtros.limit) params.append('limit', filtros.limit);
        const queryString = params.toString();
        return queryString ? `/historico?barbeiro_id=${barbeiroId}&${queryString}` : `/historico?barbeiro_id=${barbeiroId}`;
      },
      RELATORIOS: (barbeariaId, filtros = {}) => {
        const params = new URLSearchParams();
        if (filtros.data_inicio) params.append('data_inicio', filtros.data_inicio);
        if (filtros.data_fim) params.append('data_fim', filtros.data_fim);
        if (filtros.tipo) params.append('tipo', filtros.tipo);
        const queryString = params.toString();
        return queryString ? `/relatorios/barbearias/${barbeariaId}?${queryString}` : `/relatorios/barbearias/${barbeariaId}`;
      },
    },
    
    // Usuários com filtros
    USUARIOS: {
      LIST: (filtros = {}) => {
        const params = new URLSearchParams();
        if (filtros.role) params.append('role', filtros.role);
        if (filtros.ativo) params.append('ativo', filtros.ativo);
        if (filtros.page) params.append('page', filtros.page);
        if (filtros.limit) params.append('limit', filtros.limit);
        const queryString = params.toString();
        return queryString ? `/users?${queryString}` : '/users';
      },
      CREATE: '/users',
      UPDATE: (id) => `/users/${id}`,
      DELETE: (id) => `/users/${id}`,
      BARBEIROS_STATUS: '/users/barbeiros/meu-status',
      BARBEIROS_ATIVAR: '/users/barbeiros/ativar',
      BARBEIROS_DESATIVAR: '/users/barbeiros/desativar',
    },
  },
  
  // ESTRUTURA DE RESPOSTA PADRONIZADA
  RESPONSE_STRUCTURE: {
    success: true,
    data: null,
    message: '',
    errors: [],
    pagination: {
      total: 0,
      page: 1,
      limit: 10,
      hasMore: false
    }
  },
  
  // Configurações de erro
  ERROR_MESSAGES: {
    NETWORK_ERROR: 'Erro de conexão. Verifique sua internet.',
    TIMEOUT_ERROR: 'Tempo limite excedido. Tente novamente.',
    UNAUTHORIZED: 'Sessão expirada. Faça login novamente.',
    FORBIDDEN: 'Acesso negado.',
    NOT_FOUND: 'Recurso não encontrado.',
    SERVER_ERROR: 'Erro interno do servidor.',
    VALIDATION_ERROR: 'Dados inválidos.',
  },
  
  // Status codes
  STATUS_CODES: {
    OK: 200,
    CREATED: 201,
    NO_CONTENT: 204,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    CONFLICT: 409,
    UNPROCESSABLE_ENTITY: 422,
    INTERNAL_SERVER_ERROR: 500,
  },
};

// Configurações de desenvolvimento
export const DEV_CONFIG = {
  // Simular delay da API (em ms)
  API_DELAY: 0,
  
  // Logs detalhados
  VERBOSE_LOGS: true,
  
  // Mock data (para desenvolvimento sem backend)
  USE_MOCK_DATA: false,
  
  // Configurações de debug
  DEBUG: {
    API_CALLS: true,
    STATE_CHANGES: true,
    LOCAL_STORAGE: true,
  },
};

// Configurações de produção
export const PROD_CONFIG = {
  API_DELAY: 0,
  VERBOSE_LOGS: false,
  USE_MOCK_DATA: false,
  DEBUG: {
    API_CALLS: false,
    STATE_CHANGES: false,
    LOCAL_STORAGE: false,
  },
};

// Configuração baseada no ambiente
export const CONFIG = import.meta.env.DEV ? DEV_CONFIG : PROD_CONFIG;

// Função para obter configuração completa
export const getApiConfig = () => ({
  ...API_CONFIG,
  ...CONFIG,
});

// Função para validar se a API está disponível
export const checkApiHealth = async () => {
  try {
    const response = await fetch(`${API_CONFIG.BASE_URL}/health`, {
      method: 'GET',
      headers: API_CONFIG.DEFAULT_HEADERS,
    });
    
    return response.ok;
  } catch (error) {
    console.warn('API não está disponível:', error);
    return false;
  }
};

// Função para obter URL completa do endpoint
export const getApiUrl = (endpoint) => {
  return `${API_CONFIG.BASE_URL}${endpoint}`;
};

// Função para padronizar resposta da API
export const standardizeResponse = (data, message = '', errors = []) => {
  return {
    success: errors.length === 0,
    data,
    message,
    errors,
    timestamp: new Date().toISOString()
  };
};

// Função para adicionar paginação à resposta
export const addPagination = (response, pagination) => {
  return {
    ...response,
    pagination: {
      total: pagination.total || 0,
      page: pagination.page || 1,
      limit: pagination.limit || 10,
      hasMore: pagination.hasMore || false
    }
  };
};

export default API_CONFIG; 