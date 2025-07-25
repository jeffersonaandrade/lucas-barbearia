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

    if (this.token) {
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
    return this.publicRequest(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    });
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

  // Chamar próximo cliente (BARBEIRO)
  async chamarProximo(barbeariaId) {
    return api.post(`/barbearias/${barbeariaId}/fila/proximo`);
  },

  // Listar barbeiros (MISTO)
  async listarBarbeiros(filtros = {}) {
    const params = new URLSearchParams();
    
    // Parâmetros suportados
    if (filtros.barbearia_id) params.append('barbearia_id', filtros.barbearia_id);
    if (filtros.ativo) params.append('ativo', filtros.ativo);
    if (filtros.disponivel) params.append('disponivel', filtros.disponivel);
    if (filtros.page) params.append('page', filtros.page);
    if (filtros.limit) params.append('limit', filtros.limit);
    
    const queryString = params.toString();
    const endpoint = queryString ? `/users/barbeiros?${queryString}` : '/users/barbeiros';
    
    return api.get(endpoint);
  },

  // Listar barbeiros (PÚBLICO - para clientes escolherem)
  async listarBarbeirosPublicos(barbeariaId) {
    return api.publicGet(`/users/barbeiros?barbearia_id=${barbeariaId}&ativo=true&disponivel=true`);
  },

  // Ativar barbeiro (ADMIN/GERENTE)
  async ativarBarbeiro(barbeariaId, barbeiroId) {
    return api.post(`/users/barbeiros/ativar`, { barbearia_id: barbeariaId, barbeiro_id: barbeiroId });
  },

  // Desativar barbeiro (ADMIN/GERENTE)
  async desativarBarbeiro(barbeariaId, barbeiroId) {
    return api.post(`/users/barbeiros/desativar`, { barbearia_id: barbeariaId, barbeiro_id: barbeiroId });
  }
};

export const filaService = {
  // Cliente entra na fila (SEM autenticação)
  async entrarNaFila(barbeariaId, dadosCliente) {
    return api.publicPost(`/fila/entrar`, {
      ...dadosCliente,
      barbearia_id: barbeariaId // Garantir que o barbearia_id seja o correto
    });
  },

  // Obter fila completa (BARBEIRO)
  async obterFilaCompleta(barbeariaId) {
    return api.get(`/fila/${barbeariaId}`);
  },

  // Obter fila gerente (GERENTE)
  async obterFilaGerente(barbeariaId) {
    return api.get(`/fila-gerente/${barbeariaId}`);
  },

  // Obter estatísticas públicas (PÚBLICO)
  async obterFilaPublica(barbeariaId) {
    return api.publicGet(`/fila-publica/${barbeariaId}`);
  },

  // Obter status do cliente (SEM autenticação)
  async obterStatusCliente(token) {
    return api.publicGet(`/fila/status/${token}`);
  },

  // Chamar próximo cliente (BARBEIRO)
  async chamarProximo(barbeariaId) {
    return api.post(`/fila/proximo/${barbeariaId}`);
  },

  // Iniciar atendimento (BARBEIRO)
  async iniciarAtendimento(clienteId) {
    return api.post(`/fila/iniciar/${clienteId}`);
  },

  // Finalizar atendimento (BARBEIRO)
  async finalizarAtendimento(clienteId, observacoes = '') {
    return api.post(`/fila/finalizar/${clienteId}`, { observacoes });
  },

  // Remover cliente da fila (BARBEIRO)
  async removerCliente(clienteId) {
    return api.delete(`/fila/remover/${clienteId}`);
  },

  // Obter fila (BARBEIRO)
  async obterFila(barbeariaId) {
    return api.get(`/fila/${barbeariaId}`);
  },

  // Cliente sair da fila (SEM autenticação)
  async sairDaFila(barbeariaId, token) {
    return api.publicPost(`/fila/sair`, { barbearia_id: barbeariaId, token });
  },

  // Adicionar cliente manualmente (BARBEIRO)
  async adicionarClienteManual(barbeariaId, dadosCliente) {
    return api.post(`/fila/adicionar-manual`, {
      ...dadosCliente,
      barbearia_id: barbeariaId
    });
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
  // Obter histórico de atendimentos (ADMIN/GERENTE)
  async obterHistorico(filtros = {}) {
    const params = new URLSearchParams();
    
    // Parâmetros suportados
    if (filtros.barbearia_id) params.append('barbearia_id', filtros.barbearia_id);
    if (filtros.data_inicio) params.append('data_inicio', filtros.data_inicio);
    if (filtros.data_fim) params.append('data_fim', filtros.data_fim);
    if (filtros.barbeiro_id) params.append('barbeiro_id', filtros.barbeiro_id);
    if (filtros.limit) params.append('limit', filtros.limit);
    if (filtros.offset) params.append('offset', filtros.offset);
    
    const queryString = params.toString();
    const endpoint = queryString ? `/historico?${queryString}` : '/historico';
    
    return api.get(endpoint);
  },

  // Obter relatórios e estatísticas (ADMIN/GERENTE)
  async obterRelatorios(filtros = {}) {
    const params = new URLSearchParams();
    
    // Parâmetros suportados
    if (filtros.barbearia_id) params.append('barbearia_id', filtros.barbearia_id);
    if (filtros.data_inicio) params.append('data_inicio', filtros.data_inicio);
    if (filtros.data_fim) params.append('data_fim', filtros.data_fim);
    if (filtros.tipo) params.append('tipo', filtros.tipo); // diario, semanal, mensal
    
    const queryString = params.toString();
    const endpoint = queryString ? `/historico/relatorios?${queryString}` : '/historico/relatorios';
    
    return api.get(endpoint);
  },

  // MÉTODOS LEGACY (mantidos para compatibilidade, mas deprecated)
  async obterHistoricoBarbearia(barbeariaId, filtros = {}) {
    console.warn('DEPRECATED: Use obterHistorico({ barbearia_id: barbeariaId, ...filtros }) instead');
    return this.obterHistorico({ barbearia_id: barbeariaId, ...filtros });
  },

  async obterHistoricoBarbeiro(barbeiroId, filtros = {}) {
    console.warn('DEPRECATED: Use obterHistorico({ barbeiro_id: barbeiroId, ...filtros }) instead');
    return this.obterHistorico({ barbeiro_id: barbeiroId, ...filtros });
  },

  async obterRelatoriosBarbearia(barbeariaId, filtros = {}) {
    console.warn('DEPRECATED: Use obterRelatorios({ barbearia_id: barbeariaId, ...filtros }) instead');
    return this.obterRelatorios({ barbearia_id: barbeariaId, ...filtros });
  },
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
    if (acao === 'ativar') {
      return api.post('/users/barbeiros/ativar', dados);
    } else if (acao === 'desativar') {
      return api.post('/users/barbeiros/desativar', dados);
    }
    throw new Error('Ação inválida: deve ser "ativar" ou "desativar"');
  },

  // Obter status do barbeiro atual
  async obterStatusBarbeiro() {
    return api.get('/users/barbeiros/meu-status');
  },

  // MÉTODOS LEGACY (mantidos para compatibilidade, mas deprecated)
  async listarBarbeirosLegacy() {
    console.warn('DEPRECATED: Use listarUsuarios({ role: "barbeiro" }) instead');
    return this.listarUsuarios({ role: 'barbeiro' });
  },

  async listarBarbeirosDisponiveisLegacy(barbeariaId) {
    console.warn('DEPRECATED: Use barbeariasService.listarBarbeiros({ barbearia_id: barbeariaId, status: "disponivel" }) instead');
    return barbeariasService.listarBarbeiros({ barbearia_id: barbeariaId, status: 'disponivel' });
  },

  async listarBarbeirosAtivosLegacy(barbeariaId) {
    console.warn('DEPRECATED: Use barbeariasService.listarBarbeiros({ barbearia_id: barbeariaId, status: "ativo" }) instead');
    return barbeariasService.listarBarbeiros({ barbearia_id: barbeariaId, status: 'ativo' });
  },
};

// Exportar instância da API para uso direto
export { api };

// Função para configurar interceptors (opcional)
export const setupApiInterceptors = () => {
  // Aqui você pode adicionar interceptors para tratamento global de erros
  // Por exemplo, refresh token automático, redirecionamento em caso de 401, etc.
};

export default api; 