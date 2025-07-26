// Configuração da API
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

// Classe para gerenciar requisições HTTP
class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL;
    this.token = sessionStorage.getItem('adminToken');
  }

  // Configurar headers padrão
  getHeaders() {
    const headers = {
      'Content-Type': 'application/json',
    };

    // Sempre verificar o token atual no sessionStorage
    const currentToken = sessionStorage.getItem('adminToken');
    if (currentToken) {
      this.token = currentToken; // Atualizar token interno se necessário
      headers['Authorization'] = `Bearer ${currentToken}`;
    } else if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    return headers;
  }

  // Atualizar token
  setToken(token) {
    this.token = token;
  }

  // Método genérico para requisições
  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    
    const config = {
      headers: this.getHeaders(),
      ...options,
    };

    // Debug: verificar se o token está sendo enviado
    const authHeader = config.headers['Authorization'];
    console.log(`🔐 API Request to ${endpoint}:`, {
      url,
      hasToken: !!authHeader,
      tokenPreview: authHeader ? `${authHeader.substring(0, 20)}...` : 'No token'
    });

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
  }

  // Método para endpoints públicos (sem autenticação)
  async publicRequest(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    
    const config = {
      headers: {
        'Content-Type': 'application/json',
      },
      ...options,
    };

    console.log('🌐 publicRequest URL:', url);
    console.log('⚙️ publicRequest config:', config);

    try {
      const response = await fetch(url, config);
      console.log('📡 Response status:', response.status);
      console.log('📡 Response ok:', response.ok);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('❌ HTTP Error:', errorData);
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      const jsonResponse = await response.json();
      console.log('📦 publicRequest JSON response:', jsonResponse);
      return jsonResponse;
    } catch (error) {
      console.error(`API Error (${endpoint}):`, error);
      throw error;
    }
  }

  // GET request
  async get(endpoint) {
    return this.request(endpoint, { method: 'GET' });
  }

  // GET request público (sem autenticação)
  async publicGet(endpoint) {
    return this.publicRequest(endpoint, { method: 'GET' });
  }

  // POST request
  async post(endpoint, data) {
    return this.request(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // POST request público (sem autenticação)
  async publicPost(endpoint, data) {
    console.log('📤 publicPost chamado:', endpoint, data);
    try {
      const response = await this.publicRequest(endpoint, {
        method: 'POST',
        body: JSON.stringify(data),
      });
      console.log('📦 publicPost response:', response);
      return response;
    } catch (error) {
      console.error('❌ publicPost error:', error);
      throw error;
    }
  }

  // PUT request
  async put(endpoint, data) {
    return this.request(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  // DELETE request
  async delete(endpoint) {
    return this.request(endpoint, { method: 'DELETE' });
  }
}

// Instância global da API
const api = new ApiService();

// Serviços específicos
export const authService = {
  // Login
  async login(email, password) {
    const response = await api.post('/auth/login', { email, password });
    
    // O backend retorna { success, message, data: { user, token } }
    if (response.data && response.data.token) {
      api.setToken(response.data.token);
      sessionStorage.setItem('adminToken', response.data.token);
      sessionStorage.setItem('userRole', response.data.user.role);
      sessionStorage.setItem('userEmail', response.data.user.email);
      
      // Retornar no formato esperado pelo frontend
      return {
        success: response.success,
        message: response.message,
        user: response.data.user,
        token: response.data.token
      };
    }
    
    return response;
  },

  // Logout
  async logout() {
    try {
      await api.post('/auth/logout');
    } catch (error) {
      console.warn('Erro no logout do servidor:', error);
    } finally {
      api.setToken(null);
      sessionStorage.removeItem('adminToken');
      sessionStorage.removeItem('userRole');
      sessionStorage.removeItem('userEmail');
    }
  },

  // Verificar usuário atual
  async getCurrentUser() {
    return api.get('/auth/me');
  },
};

export const barbeariasService = {
  // Listar todas as barbearias (PÚBLICO)
  async listarBarbearias() {
    return api.publicGet('/barbearias');
  },

  // Obter barbearia específica (PÚBLICO)
  async obterBarbearia(id) {
    return api.publicGet(`/barbearias/${id}`);
  },

  // Criar barbearia (ADMIN)
  async criarBarbearia(data) {
    return api.post('/barbearias', data);
  },

  // Atualizar barbearia (ADMIN)
  async atualizarBarbearia(id, data) {
    return api.put(`/barbearias/${id}`, data);
  },

  // Remover barbearia (ADMIN)
  async removerBarbearia(id) {
    return api.delete(`/barbearias/${id}`);
  },

  // Verificar status da barbearia (PÚBLICO)
  async verificarStatus(barbeariaId) {
    console.log('🔍 Verificando status da barbearia:', barbeariaId);
    return api.publicGet(`/barbearias/${barbeariaId}/status`);
  },

  // Listar barbeiros (PÚBLICO - para clientes escolherem)
  async listarBarbeirosPublicos(barbeariaId) {
    const params = new URLSearchParams();
    params.append('status', 'ativo');
    params.append('public', 'true');
    params.append('barbearia_id', barbeariaId);
    
    const queryString = params.toString();
    const endpoint = `/users/barbeiros?${queryString}`;
    
    console.log('🔗 Chamando endpoint de barbeiros públicos:', endpoint);
    
    try {
      const response = await api.publicGet(endpoint);
      console.log('📦 Resposta bruta da API de barbeiros:', response);
      console.log('🔍 Estrutura da resposta:', {
        hasData: !!response?.data,
        hasBarbeiros: !!response?.data?.barbeiros,
        hasBarbeirosDirect: !!response?.barbeiros,
        isArray: Array.isArray(response),
        isDataArray: Array.isArray(response?.data)
      });
      return response;
    } catch (error) {
      console.error('❌ Erro ao buscar barbeiros:', error);
      throw error;
    }
  },

  // Listar barbeiros ativos (PÚBLICO - para validação de disponibilidade)
  async listarBarbeirosAtivos(barbeariaId = null) {
    const params = new URLSearchParams();
    params.append('status', 'ativo');
    params.append('public', 'true');
    
    if (barbeariaId) {
      params.append('barbearia_id', barbeariaId);
    }
    
    const queryString = params.toString();
    const endpoint = `/users/barbeiros?${queryString}`;
    
    return api.publicGet(endpoint);
  }
};

export const filaService = {
  // Cliente entra na fila (SEM autenticação)
  async entrarNaFila(dadosCliente) {
    return api.publicPost(`/fila/entrar`, dadosCliente);
  },

  // Cliente entra na fila (LEGACY - manter compatibilidade)
  async entrarNaFilaLegacy(barbeariaId, dadosCliente) {
    return api.publicPost(`/fila/entrar`, {
      ...dadosCliente,
      barbearia_id: barbeariaId
    });
  },

  // Obter fila completa (BARBEIRO)
  async obterFilaCompleta(barbeariaId) {
    return api.get(`/fila/${barbeariaId}`);
  },

  // Obter fila pública (CLIENTES)
  async obterFilaPublica(barbeariaId) {
    return api.publicGet(`/fila-publica/${barbeariaId}`);
  },

  // Obter status do cliente (SEM autenticação)
  async obterStatusCliente(token, barbeariaId = null) {
    // Se não tem barbeariaId, tentar pegar do localStorage
    if (!barbeariaId) {
      barbeariaId = localStorage.getItem('fila_barbearia_id');
    }
    
    if (!barbeariaId) {
      throw new Error('Barbearia ID não encontrado');
    }
    
    return api.publicGet(`/fila/${barbeariaId}/status/${token}`);
  },

  // Cliente sair da fila (SEM autenticação) - NÃO IMPLEMENTADO NO BACKEND
  async sairDaFila(barbeariaId, token) {
    console.warn('Endpoint DELETE /fila/:barbeariaId/sair/:token não implementado no backend');
    throw new Error('Funcionalidade de sair da fila não implementada no backend');
  },

  // Chamar próximo cliente (BARBEIRO)
  async chamarProximo(barbeariaId) {
    return api.post(`/fila/proximo/${barbeariaId}`);
  },

  // Iniciar atendimento (BARBEIRO)
  async iniciarAtendimento(clienteId) {
    return api.post(`/fila/iniciar-atendimento/${clienteId}`);
  },

  // Finalizar atendimento (BARBEIRO)
  async finalizarAtendimento(clienteId) {
    return api.post(`/fila/finalizar-atendimento/${clienteId}`);
  },

  // Remover cliente da fila (BARBEIRO)
  async removerCliente(clienteId) {
    return api.post(`/fila/remover/${clienteId}`);
  },

  // Remover cliente da fila (ADMIN)
  async removerClienteAdmin(clienteId) {
    // Enviar POST com body vazio para evitar erro do Fastify
    return api.post(`/fila/admin/remover/${clienteId}`, {});
  },

  // Buscar estatísticas da fila
  async getEstatisticas(barbeariaId) {
    return api.get(`/fila/${barbeariaId}/estatisticas`);
  },

  // Adicionar cliente manualmente (BARBEIRO)
  async adicionarClienteManual(barbeariaId, dadosCliente) {
    return api.publicPost(`/fila/entrar`, {
      ...dadosCliente,
      barbearia_id: barbeariaId
    });
  }
};




export const usuariosService = {
  // Listar usuários (admin)
  async listarUsuarios(filtros = {}) {
    const params = new URLSearchParams();
    
    // Parâmetros suportados
    if (filtros.role) params.append('role', filtros.role);
    if (filtros.ativo) params.append('ativo', filtros.ativo);
    if (filtros.page) params.append('page', filtros.page);
    if (filtros.limit) params.append('limit', filtros.limit);
    
    const queryString = params.toString();
    const endpoint = queryString ? `/users?${queryString}` : '/users';
    
    return api.get(endpoint);
  },

  // Criar usuário (admin)
  async criarUsuario(dadosUsuario) {
    return api.post('/users', dadosUsuario);
  },

  // Atualizar usuário (admin)
  async atualizarUsuario(id, dadosUsuario) {
    return api.put(`/users/${id}`, dadosUsuario);
  },

  // Remover usuário (admin)
  async removerUsuario(id) {
    return api.delete(`/users/${id}`);
  },

  // Atualizar status do barbeiro (ativar/desativar)
  async atualizarStatusBarbeiro(acao, dados) {
    const payload = {
      barbearia_id: dados.barbearia_id,
      ativo: acao === 'ativar'
    };
    
    return api.post('/users/barbeiros/alterar-status', payload);
  },

  // Obter status do barbeiro atual
  async obterStatusBarbeiro() {
    return api.get('/users/barbeiros/meu-status');
  }
};

export const avaliacoesService = {
  // Enviar avaliação (PÚBLICO)
  async enviarAvaliacao(dadosAvaliacao) {
    return api.publicPost('/avaliacoes', dadosAvaliacao);
  },

  // Listar avaliações (com filtros) - ADMIN/GERENTE
  async listarAvaliacoes(filtros = {}) {
    const params = new URLSearchParams();
    
    // Parâmetros suportados
    if (filtros.barbearia_id) params.append('barbearia_id', filtros.barbearia_id);
    if (filtros.barbeiro_id) params.append('barbeiro_id', filtros.barbeiro_id);
    if (filtros.page) params.append('page', filtros.page);
    if (filtros.limit) params.append('limit', filtros.limit);
    if (filtros.rating) params.append('rating', filtros.rating);
    
    const queryString = params.toString();
    const endpoint = queryString ? `/avaliacoes?${queryString}` : '/avaliacoes';
    
    return api.get(endpoint);
  }
};

export const historicoService = {
  // Obter histórico (com filtros) - ADMIN/GERENTE
  async obterHistorico(filtros = {}) {
    const params = new URLSearchParams();
    
    // Parâmetros suportados
    if (filtros.data_inicio) params.append('data_inicio', filtros.data_inicio);
    if (filtros.data_fim) params.append('data_fim', filtros.data_fim);
    if (filtros.barbearia_id) params.append('barbearia_id', filtros.barbearia_id);
    if (filtros.barbeiro_id) params.append('barbeiro_id', filtros.barbeiro_id);
    if (filtros.page) params.append('page', filtros.page);
    if (filtros.limit) params.append('limit', filtros.limit);
    
    const queryString = params.toString();
    const endpoint = queryString ? `/historico?${queryString}` : '/historico';
    
    return api.get(endpoint);
  },

  // Obter relatórios (com filtros) - ADMIN/GERENTE
  async obterRelatorios(filtros = {}) {
    const params = new URLSearchParams();
    
    // Parâmetros suportados
    if (filtros.data_inicio) params.append('data_inicio', filtros.data_inicio);
    if (filtros.data_fim) params.append('data_fim', filtros.data_fim);
    if (filtros.barbearia_id) params.append('barbearia_id', filtros.barbearia_id);
    if (filtros.barbeiro_id) params.append('barbeiro_id', filtros.barbeiro_id);
    if (filtros.tipo) params.append('tipo', filtros.tipo);
    if (filtros.page) params.append('page', filtros.page);
    if (filtros.limit) params.append('limit', filtros.limit);
    
    const queryString = params.toString();
    const endpoint = queryString ? `/historico/relatorios?${queryString}` : '/historico/relatorios';
    
    return api.get(endpoint);
  }
};

// Serviços utilitários centralizados
export const utilsService = {
  // Verificar saúde da API
  async checkHealth() {
    return api.publicGet('/health');
  }
};

// Serviço de desenvolvimento (bypass)
export const devService = {
  // Entrar na fila diretamente (para testes)
  async enterQueueDirectly(barbeariaId, dadosCliente) {
    return api.publicPost('/fila/entrar', {
      nome: dadosCliente.nome,
      telefone: dadosCliente.telefone,
      barbearia_id: barbeariaId,
      barbeiro_id: dadosCliente.barbeiro === 'Fila Geral' ? null : dadosCliente.barbeiro
    });
  }
};

// Exportar instância da API para uso direto
export { api };

// Função para configurar interceptors (opcional)
export const setupApiInterceptors = () => {
  // Aqui você pode adicionar interceptors para tratamento global de erros
  // Por exemplo, refresh token automático, redirecionamento em caso de 401, etc.
};

export default api; 