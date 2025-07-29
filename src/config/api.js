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
  
  // Endpoints ALINHADOS com o backend
  ENDPOINTS: {
    // Autenticação
    AUTH: {
      LOGIN: '/auth/login',
      LOGOUT: '/auth/logout',
      ME: '/auth/me',           // Verificar autenticação atual
      REGISTER: '/auth/register', // Para criar usuários (admin apenas)
    },
    
    // Barbearias
    BARBEARIAS: {
      LIST: '/barbearias',
      GET: (id) => `/barbearias/${id}`,
      CREATE: '/barbearias',
      UPDATE: (id) => `/barbearias/${id}`,
      DELETE: (id) => `/barbearias/${id}`,
      PROXIMO_FILA: (id) => `/barbearias/${id}/fila/proximo`, // Chamar próximo cliente
    },
    
    // Usuários/Barbeiros
    USUARIOS: {
      BARBEIROS: (filtros = {}) => {
        const params = new URLSearchParams();
        if (filtros.barbearia_id) params.append('barbearia_id', filtros.barbearia_id);
        if (filtros.status) params.append('status', filtros.status);
        if (filtros.public) params.append('public', filtros.public);
        const queryString = params.toString();
        return queryString ? `/users/barbeiros?${queryString}` : '/users/barbeiros';
      },
      ATIVAR_BARBEIRO: '/users/barbeiros/ativar',
      DESATIVAR_BARBEIRO: '/users/barbeiros/desativar',
      MEU_STATUS: '/users/barbeiros/meu-status',
      PERFIL: '/users/perfil',
      GERENCIAMENTO: '/users/gerenciamento',
    },
    
    // Fila ALINHADA com o backend
    FILA: {
      ENTRAR: '/fila/entrar',
      VISUALIZAR: '/fila/visualizar',
      STATUS: '/fila/status',
      GERENCIAR: '/fila/gerenciar',
      ESTATISTICAS: '/fila/estatisticas',
    },
    
    // Avaliações
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
      GET: (id) => `/avaliacoes/${id}`,
    },
    
    // Histórico ALINHADO com o backend
    HISTORICO: {
      GET: (filtros = {}) => {
        const params = new URLSearchParams();
        if (filtros.barbearia_id) params.append('barbearia_id', filtros.barbearia_id);
        if (filtros.data_inicio) params.append('data_inicio', filtros.data_inicio);
        if (filtros.data_fim) params.append('data_fim', filtros.data_fim);
        if (filtros.barbeiro_id) params.append('barbeiro_id', filtros.barbeiro_id);
        if (filtros.limit) params.append('limit', filtros.limit);
        if (filtros.offset) params.append('offset', filtros.offset);
        const queryString = params.toString();
        return queryString ? `/historico?${queryString}` : '/historico';
      },
      RELATORIOS: '/historico/relatorios',
    },
    
    // Relatórios
    RELATORIOS: {
      DASHBOARD: (filtros = {}) => {
        const params = new URLSearchParams();
        if (filtros.barbearia_id) params.append('barbearia_id', filtros.barbearia_id);
        if (filtros.data_inicio) params.append('data_inicio', filtros.data_inicio);
        if (filtros.data_fim) params.append('data_fim', filtros.data_fim);
        if (filtros.periodo) params.append('periodo', filtros.periodo);
        const queryString = params.toString();
        return queryString ? `/relatorios/dashboard?${queryString}` : '/relatorios/dashboard';
      },
      DOWNLOAD: (filtros = {}) => {
        const params = new URLSearchParams();
        if (filtros.tipo) params.append('tipo', filtros.tipo);
        if (filtros.barbearia_id) params.append('barbearia_id', filtros.barbearia_id);
        if (filtros.data_inicio) params.append('data_inicio', filtros.data_inicio);
        if (filtros.data_fim) params.append('data_fim', filtros.data_fim);
        const queryString = params.toString();
        return queryString ? `/relatorios/download?${queryString}` : '/relatorios/download';
      },
    },
    
    // Configurações
    CONFIGURACOES: {
      SERVICOS: {
        LIST: '/configuracoes/servicos',
        CREATE: '/configuracoes/servicos',
        UPDATE: (id) => `/configuracoes/servicos/${id}`,
        DELETE: (id) => `/configuracoes/servicos/${id}`,
      },
      HORARIOS: {
        LIST: '/configuracoes/horarios',
        CREATE: '/configuracoes/horarios',
      },
    },
    
    // Health Check
    HEALTH: '/health',
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
  // Logs mínimos
  VERBOSE_LOGS: false,
  
  // Sem mock data
  USE_MOCK_DATA: false,
  
  // Debug desabilitado
  DEBUG: {
    API_CALLS: false,
    STATE_CHANGES: false,
    LOCAL_STORAGE: false,
  },
};

// Função para obter configuração baseada no ambiente
export const getApiConfig = () => ({
  ...API_CONFIG,
  ...(import.meta.env.DEV ? DEV_CONFIG : PROD_CONFIG),
});

// Função para verificar saúde da API
export const checkApiHealth = async () => {
  try {
    const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';
    const response = await fetch(`${API_BASE_URL.replace('/api', '')}/health`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    if (response.ok) {
      const data = await response.json();
      return { success: true, data };
    }
    
    return { success: false, error: `HTTP ${response.status}` };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Função para gerar URL completa
export const getApiUrl = (endpoint) => {
  return `${API_CONFIG.BASE_URL}${endpoint}`;
};

// Função para padronizar resposta
export const standardizeResponse = (data, message = '', errors = []) => {
  return {
    success: true,
    data,
    message,
    errors,
    timestamp: new Date().toISOString(),
  };
};

// Função para adicionar paginação
export const addPagination = (response, pagination) => {
  return {
    ...response,
    pagination: {
      total: pagination.total || 0,
      page: pagination.page || 1,
      limit: pagination.limit || 10,
      hasMore: pagination.hasMore || false,
      totalPages: Math.ceil((pagination.total || 0) / (pagination.limit || 10)),
    },
  };
};

// Função genérica para requisições HTTP
export const apiFetch = async (endpoint, options = {}) => {
  const url = getApiUrl(endpoint);
  
  const config = {
    headers: {
      ...API_CONFIG.DEFAULT_HEADERS,
      ...options.headers,
    },
    ...options,
  };

  try {
    const response = await fetch(url, config);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`API Error (${endpoint}):`, error);
    throw error;
  }
}; 