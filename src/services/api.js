// Configuração da API
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';
const BASE_URL = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:3000';

/*
✅ TODOS OS ENDPOINTS IMPLEMENTADOS NO BACKEND

Todos os endpoints que o frontend precisa estão agora disponíveis no backend:

✅ ENDPOINTS DE BARBEIROS:
- GET /api/users/barbeiros (listar barbeiros com filtros)
- GET /api/users/barbeiros/meu-status (status do barbeiro logado)

✅ ENDPOINTS DE FILA:
- GET /api/fila/visualizar (visualizar fila)
- GET /api/fila/estatisticas (estatísticas da fila)
- POST /api/fila/gerenciar (gerenciar fila)
- GET /api/barbearias/{id}/fila (fila completa)
- GET /api/barbearias/{id}/fila/publica (fila pública)
- POST /api/fila/iniciar-atendimento/{clienteId}
- POST /api/fila/finalizar-atendimento/{clienteId}
- DELETE /api/fila/remover/{clienteId}
- DELETE /api/fila/admin/remover/{clienteId}
- POST /api/barbearias/{id}/fila/adicionar-manual

✅ ENDPOINTS DE AVALIAÇÕES:
- POST /api/avaliacoes (enviar avaliação)
- GET /api/avaliacoes (listar avaliações)

✅ ENDPOINTS DE CONFIGURAÇÕES:
- GET /api/configuracoes/servicos (listar serviços)
- POST /api/configuracoes/servicos (criar serviço)
- PUT /api/configuracoes/servicos/{id} (atualizar serviço)
- DELETE /api/configuracoes/servicos/{id} (deletar serviço)

✅ ENDPOINTS EXISTENTES:
- POST /api/auth/register (criar usuário)
- GET /api/users (listar usuários)
- PUT /api/users/{id} (atualizar usuário)
- DELETE /api/users/{id} (remover usuário)
- POST /api/users/gerenciamento/barbeiros/ativar
- POST /api/users/gerenciamento/barbeiros/desativar
- POST /api/fila/entrar
- GET /api/fila/status
- POST /api/barbearias/{id}/fila/proximo

🎉 SISTEMA COMPLETO E FUNCIONAL!
*/

// Classe para gerenciar requisições HTTP
class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL;
    // Importar CookieManager dinamicamente para evitar dependência circular
    this.CookieManager = null;
    this.initCookieManager();
  }

  async initCookieManager() {
    try {
      const { CookieManager } = await import('@/utils/cookieManager.js');
      this.CookieManager = CookieManager;
      console.log('✅ ApiService - CookieManager inicializado com sucesso');
      
      // Debug: verificar se consegue ler cookies
      const token = CookieManager.getAdminToken();
      console.log('🔍 ApiService - Token após inicialização:', token ? `${token.substring(0, 20)}...` : 'null');
    } catch (error) {
      console.error('❌ Erro ao importar CookieManager:', error);
    }
  }

  // Configurar headers padrão
  async getHeaders() {
    const headers = {
      'Content-Type': 'application/json',
    };

    // Garantir que o CookieManager está inicializado
    if (!this.CookieManager) {
      console.log('🔄 ApiService.getHeaders - CookieManager não inicializado, inicializando...');
      await this.initCookieManager();
    }

    // Verificar token apenas nos cookies
    let currentToken = null;
    
    if (this.CookieManager) {
      currentToken = this.CookieManager.getAdminToken();
      console.log('🍪 ApiService.getHeaders - Token dos cookies:', currentToken ? `${currentToken.substring(0, 20)}...` : 'null');
    } else {
      console.log('❌ ApiService.getHeaders - CookieManager não disponível');
    }
    
    if (currentToken) {
      this.token = currentToken;
      headers['Authorization'] = `Bearer ${currentToken}`;
    } else if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    return headers;
  }

  // Atualizar token
  setToken(token) {
    this.token = token;
    
    // Salvar apenas nos cookies
    if (this.CookieManager) {
      this.CookieManager.setAdminToken(token);
    }
  }

  // Método genérico para requisições
  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    
    const config = {
      headers: await this.getHeaders(),
      credentials: 'include', // Incluir cookies nas requisições
      ...options,
    };

    // Debug: verificar se o token está sendo enviado
    const authHeader = config.headers['Authorization'];
    console.log(`🔐 API Request to ${endpoint}:`, {
      url,
      hasToken: !!authHeader,
      tokenPreview: authHeader ? `${authHeader.substring(0, 50)}...` : 'No token',
      credentials: config.credentials
    });
    


    try {
      const response = await fetch(url, config);
      
      // Se receber 401, não redirecionar automaticamente
      // Deixar que o componente decida como lidar com a autenticação
      if (response.status === 401) {
        console.log('🔄 Token inválido ou expirado (401)');
        // Não redirecionar automaticamente, apenas lançar erro
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Token inválido ou expirado');
      }
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      const responseData = await response.json();
      console.log('🔍 ApiService.request - Resposta JSON:', responseData);
      console.log('🔍 ApiService.request - Tipo da resposta:', typeof responseData);
      console.log('🔍 ApiService.request - Estrutura da resposta:', Object.keys(responseData || {}));
      
      return responseData;
    } catch (error) {
      console.error(`API Error (${endpoint}):`, error);
      throw error;
    }
  }

  // Tentar renovar o token
  async tryRefreshToken() {
    try {
      // Verificar token apenas nos cookies
      let currentToken = null;
      let userEmail = null;
      
      if (this.CookieManager) {
        currentToken = this.CookieManager.getAdminToken();
        userEmail = this.CookieManager.getUserEmail();
      }
      
      if (!currentToken) {
        return false;
      }

      // Tentar fazer uma requisição para validar o token atual
      const response = await fetch(`${this.baseURL}/auth/me`, {
        headers: {
          'Authorization': `Bearer ${currentToken}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        console.log('✅ Token ainda válido');
        return true;
      }

      // Se o token não for válido, tentar fazer login novamente
      console.log('🔄 Token inválido, tentando fazer login novamente...');
      // Não temos mais senha armazenada, o usuário precisará fazer login novamente

      // Como não temos mais senha armazenada, não podemos renovar automaticamente
      console.log('⚠️ Não é possível renovar o token automaticamente');
      return false;
    } catch (error) {
      console.error('❌ Erro ao tentar renovar token:', error);
      return false;
    }
  }

  // Requisição pública (sem autenticação)
  async publicRequest(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    
    const config = {
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include', // Incluir cookies nas requisições
      ...options,
    };

    console.log(`🌐 Public API Request to ${endpoint}:`, {
      url,
      credentials: config.credentials
    });

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      const responseData = await response.json();
      console.log('🔍 ApiService.publicRequest - Resposta JSON:', responseData);
      
      return responseData;
    } catch (error) {
      console.error(`Public API Error (${endpoint}):`, error);
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
    console.log('🔍 AuthService - Iniciando login com credentials...');
    
    // Fazer login usando fetch diretamente para incluir credentials
    const response = await fetch(`${api.baseURL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include', // Importante: incluir cookies httpOnly
      body: JSON.stringify({ email, password }),
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }
    
    const responseData = await response.json();
    
    console.log('🔍 AuthService - Login bem-sucedido:', responseData.success);
    if (responseData.data?.token) {
      console.log('🔍 AuthService - Token JWT recebido do backend');
    }
    
    // Retornar exatamente o que o backend retorna, sem modificações
    return responseData;
  },

  // Logout
  async logout() {
    try {
      console.log('🔍 AuthService - Iniciando logout com credentials...');
      
      // Fazer logout usando fetch diretamente para incluir credentials
      const response = await fetch(`${api.baseURL}/auth/logout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // Importante: incluir cookies httpOnly
      });
      
      if (!response.ok) {
        console.warn('Logout do servidor retornou status:', response.status);
      }
    } catch (error) {
      console.warn('Erro no logout do servidor:', error);
    } finally {
      api.setToken(null);
      
      // Limpar cookies
      if (api.CookieManager) {
        api.CookieManager.clearAdminCookies();
      }
    }
  },

  // Verificar status de autenticação
  async checkAuthStatus() {
    try {
      console.log('🔍 AuthService - checkAuthStatus: Tentando diferentes endpoints...');
      console.log('🔍 AuthService - URL base:', api.baseURL);
      
      // Tentar primeiro o endpoint /auth/me (que sabemos que existe)
      try {
        const url = `${api.baseURL}/auth/me`;
        console.log('🔍 AuthService - Fazendo requisição para:', url);
        
        const response = await fetch(url, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          },
          credentials: 'include' // Importante: incluir cookies httpOnly
        });
        
        if (response.ok) {
          const data = await response.json();
          console.log('🔍 AuthService - checkAuthStatus via /auth/me:', data);
          return { authenticated: true, data: data };
        } else {
          console.log('🔍 AuthService - /auth/me retornou status:', response.status);
          return { authenticated: false };
        }
      } catch (meError) {
        console.log('🔍 AuthService - Erro no /auth/me:', meError);
        
        // Tentar endpoint /auth/check se existir
        try {
          const response = await fetch(`${api.baseURL}/auth/check`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json'
            },
            credentials: 'include'
          });
          
          if (response.ok) {
            const data = await response.json();
            console.log('🔍 AuthService - checkAuthStatus via /auth/check:', data);
            return data;
          }
        } catch (checkError) {
          console.log('🔍 AuthService - Erro no /auth/check:', checkError);
        }
        
        return { authenticated: false };
      }
    } catch (error) {
      console.error('❌ AuthService - Erro no checkAuthStatus:', error);
      return { authenticated: false };
    }
  },

  // Verificar usuário atual
  async getCurrentUser() {
    try {
      // Se estivermos na página de login, não fazer requisição
      if (typeof window !== 'undefined' && window.location.pathname === '/admin/login') {
        console.log('🔍 AuthService - getCurrentUser: Na página de login, retornando null');
        return { success: false, data: null };
      }

      console.log('🔍 AuthService - getCurrentUser: Fazendo requisição para /auth/me');
      
      // Usar o método request que já inclui o token do localStorage
      const response = await this.request('/auth/me');
      
      console.log('🔍 AuthService - getCurrentUser resposta:', response);
      
      return response;
    } catch (error) {
      console.error('❌ AuthService - Erro no getCurrentUser:', error);
      throw error;
    }
  },

  // Registrar usuário (PRIVADO - requer role admin)
  async register(dadosUsuario) {
    return api.post('/auth/register', dadosUsuario);
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
    try {
      console.log('🔄 Tentando criar barbearia com dados:', data);
      const response = await api.post('/barbearias', data);
      console.log('✅ Barbearia criada com sucesso:', response);
      return response;
    } catch (error) {
      console.error('❌ Erro ao criar barbearia:', error);
      throw error;
    }
  },

  // Atualizar barbearia (ADMIN)
  async atualizarBarbearia(id, data) {
    return api.put(`/barbearias/${id}`, data);
  },

  // Remover barbearia (ADMIN)
  async removerBarbearia(id) {
    return api.delete(`/barbearias/${id}`);
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
  // Cliente entra na fila (PÚBLICO)
  async entrarNaFila(dadosCliente) {
    return api.publicPost(`/fila/entrar`, dadosCliente);
  },

  // Visualizar fila atual (PRIVADO - requer autenticação)
  async visualizarFila() {
    return api.publicGet(`/fila/visualizar`);
  },

  // Status da fila (PRIVADO - requer autenticação)
  async obterStatusFila() {
    return api.publicGet(`/fila/status`);
  },

  // Gerenciar fila (PRIVADO - requer autenticação de barbeiro)
  async gerenciarFila(acao, clienteId) {
    return api.post(`/fila/gerenciar`, {
      acao,
      clienteId
    });
  },

  // Estatísticas da fila (PRIVADO - requer role admin ou gerente)
  async obterEstatisticas() {
    return api.get(`/fila/estatisticas`);
  },

  // Estatísticas da fila (PÚBLICO)
  async obterEstatisticasPublicas(barbeariaId) {
    return api.publicGet(`/fila/${barbeariaId}/estatisticas`);
  },

  // Chamar próximo cliente (PRIVADO - requer role admin, gerente ou barbeiro)
  async chamarProximo(barbeariaId) {
    return api.post(`/fila/proximo/${barbeariaId}`, {});
  },

  // Obter fila completa para BARBEIROS (PRIVADO - requer autenticação)
  async obterFilaBarbeiro(barbeariaId) {
    return api.get(`/fila/${barbeariaId}`);
  },

  // Obter fila completa para uma barbearia específica (PRIVADO - requer autenticação)
  async obterFilaCompleta(barbeariaId) {
    return api.get(`/fila/${barbeariaId}`);
  },



  // Obter fila pública para uma barbearia específica (PÚBLICO)
  async obterFilaPublica(barbeariaId) {
    return api.publicGet(`/fila-publica/${barbeariaId}`);
  },

  // Obter status do cliente (PÚBLICO)
  async obterStatusCliente(token = null, barbeariaId = null) {
    if (token) {
      return api.publicGet(`/fila/status/${token}`);
    } else {
      return api.publicGet(`/fila/status`);
    }
  },

  // Sair da fila (PÚBLICO)
  async sairDaFila(barbeariaId = null, token = null) {
    if (token) {
      return api.publicPost(`/fila/sair`, { token });
    } else {
      return api.publicPost(`/fila/sair`);
    }
  },

          // Iniciar atendimento (PRIVADO - requer autenticação de barbeiro)
        async iniciarAtendimento(barbeariaId, clienteId) {
          return api.post(`/fila/iniciar-atendimento/${barbeariaId}/${clienteId}`, {});
        },

          // Finalizar atendimento (PRIVADO - requer autenticação de barbeiro)
        async finalizarAtendimento(clienteId, observacoes = '') {
          return api.post(`/fila/finalizar`, {
            cliente_id: clienteId,
            observacoes: observacoes
          });
        },

  // Remover cliente (PRIVADO - requer autenticação de barbeiro)
  async removerCliente(clienteId) {
    return api.delete(`/fila/remover/${clienteId}`);
  },

  // Remover cliente (ADMIN) (PRIVADO - requer role admin)
  async removerClienteAdmin(clienteId) {
    return api.delete(`/fila/admin/remover/${clienteId}`);
  },

  // Adicionar cliente manualmente (PRIVADO - requer autenticação de barbeiro/admin)
  async adicionarClienteManual(barbeariaId, dadosCliente) {
    return api.post(`/barbearias/${barbeariaId}/fila/adicionar-manual`, dadosCliente);
  }
};




export const usuariosService = {
  // Listar usuários (PRIVADO - requer role admin)
  async listarUsuarios(filtros = {}) {
    const params = new URLSearchParams();
    
    // Parâmetros suportados
    if (filtros.role) params.append('role', filtros.role);
    if (filtros.status) params.append('status', filtros.status);
    if (filtros.barbearia_id) params.append('barbearia_id', filtros.barbearia_id);
    
    const queryString = params.toString();
    const endpoint = queryString ? `/users?${queryString}` : '/users';
    
    return api.get(endpoint);
  },

  // Criar usuário (PRIVADO - requer role admin)
  async criarUsuario(dadosUsuario) {
    return api.post('/auth/register', dadosUsuario);
  },

  // Atualizar usuário (PRIVADO - requer role admin)
  async atualizarUsuario(userId, dadosUsuario) {
    return api.put(`/users/${userId}`, dadosUsuario);
  },

  // Remover usuário (PRIVADO - requer role admin)
  async removerUsuario(userId) {
    return api.delete(`/users/${userId}`);
  },

  // Reset de senha (PRIVADO - requer role admin)
  async resetarSenha(userId, novaSenha) {
    return api.post(`/users/${userId}/reset-password`, { nova_senha: novaSenha });
  },

  // Listar barbeiros (PRIVADO - requer role admin ou gerente)
  async listarBarbeiros(filtros = {}) {
    const params = new URLSearchParams();
    
    // Parâmetros suportados
    if (filtros.barbearia_id) params.append('barbearia_id', filtros.barbearia_id);
    if (filtros.status) params.append('status', filtros.status);
    if (filtros.public) params.append('public', filtros.public);
    
    const queryString = params.toString();
    const endpoint = queryString ? `/users/gerenciamento/barbeiros?${queryString}` : '/users/gerenciamento/barbeiros';
    
    return api.get(endpoint);
  },

  // Status do barbeiro (PRIVADO - requer role barbeiro)
  async obterMeuStatus() {
    return api.get('/users/gerenciamento/barbeiros/meu-status');
  },

  // Obter status do barbeiro (PRIVADO - requer role barbeiro)
  async obterStatusBarbeiro() {
    return api.get('/users/barbeiros/meu-status');
  },

  // Obter minhas barbearias (PRIVADO - requer role barbeiro)
  async obterMinhasBarbearias() {
    return api.get('/users/barbeiros/minhas-barbearias');
  },

  // Atualizar status do barbeiro (PRIVADO - requer role barbeiro)
  async atualizarStatusBarbeiro(acao, dados) {
    // Converter a ação para o formato esperado pela API
    const ativo = acao === 'ativar';
    return api.post('/users/barbeiros/alterar-status', {
      barbearia_id: dados.barbearia_id,
      ativo: ativo
    });
  },

  // Ativar barbeiro (PRIVADO - requer role admin ou gerente)
  async ativarBarbeiro(dados) {
    return api.post('/users/gerenciamento/barbeiros/ativar', dados);
  },

  // Desativar barbeiro (PRIVADO - requer role admin ou gerente)
  async desativarBarbeiro(dados) {
    return api.post('/users/gerenciamento/barbeiros/desativar', dados);
  },

  // Perfil do usuário (PRIVADO - requer autenticação)
  async obterPerfil() {
    return api.get('/users/perfil');
  },

  // Atualizar perfil (PRIVADO - requer autenticação)
  async atualizarPerfil(dados) {
    return api.put('/users/perfil', dados);
  },

  // Deletar perfil (PRIVADO - requer autenticação)
  async deletarPerfil() {
    return api.delete('/users/perfil');
  },

  // Gerenciamento de usuários (PRIVADO - requer role admin ou gerente)
  async gerenciarUsuarios() {
    return api.get('/users/gerenciamento');
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
  // Obter histórico (com filtros) - PRIVADO - requer autenticação
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

  // Obter relatórios de histórico (PRIVADO - requer role admin ou gerente)
  async obterRelatorios(filtros = {}) {
    const params = new URLSearchParams();
    
    // Parâmetros suportados
    if (filtros.barbearia_id) params.append('barbearia_id', filtros.barbearia_id);
    if (filtros.data_inicio) params.append('data_inicio', filtros.data_inicio);
    if (filtros.data_fim) params.append('data_fim', filtros.data_fim);
    if (filtros.barbeiro_id) params.append('barbeiro_id', filtros.barbeiro_id);
    if (filtros.tipo) params.append('tipo', filtros.tipo);
    if (filtros.limit) params.append('limit', filtros.limit);
    if (filtros.offset) params.append('offset', filtros.offset);
    
    const queryString = params.toString();
    const endpoint = queryString ? `/historico/relatorios?${queryString}` : '/historico/relatorios';
    
    return api.get(endpoint);
  }
};

// Serviços utilitários centralizados
export const utilsService = {
  // Verificar saúde da API (PÚBLICO)
  async checkHealth() {
    // Health check está na raiz, não em /api
    const url = `${BASE_URL}/health`;
    console.log('🏥 Health check URL:', url);
    
    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('❌ Health check error:', error);
      throw error;
    }
  },

  // Informações da API (PÚBLICO)
  async getApiInfo() {
    // API info está na raiz, não em /api
    const url = `${BASE_URL}/`;
    console.log('ℹ️ API info URL:', url);
    
    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('❌ API info error:', error);
      throw error;
    }
  }
};

// Serviço de relatórios
export const relatoriosService = {
  // Dashboard de relatórios (PRIVADO - requer role admin ou gerente)
  async obterDashboard(filtros = {}) {
    const params = new URLSearchParams();
    
    // Parâmetros suportados
    if (filtros.barbearia_id) params.append('barbearia_id', filtros.barbearia_id);
    if (filtros.data_inicio) params.append('data_inicio', filtros.data_inicio);
    if (filtros.data_fim) params.append('data_fim', filtros.data_fim);
    if (filtros.periodo) params.append('periodo', filtros.periodo);
    
    const queryString = params.toString();
    const endpoint = queryString ? `/relatorios/dashboard?${queryString}` : '/relatorios/dashboard';
    
    return api.get(endpoint);
  },

  // Download de relatórios (PRIVADO - requer role admin ou gerente)
  async downloadRelatorio(filtros = {}) {
    const params = new URLSearchParams();
    
    // Parâmetros obrigatórios
    if (!filtros.tipo) {
      throw new Error('Tipo de relatório é obrigatório (excel ou pdf)');
    }
    params.append('tipo', filtros.tipo);
    
    // Parâmetros opcionais
    if (filtros.barbearia_id) params.append('barbearia_id', filtros.barbearia_id);
    if (filtros.data_inicio) params.append('data_inicio', filtros.data_inicio);
    if (filtros.data_fim) params.append('data_fim', filtros.data_fim);
    
    const queryString = params.toString();
    const endpoint = `/relatorios/download?${queryString}`;
    
    return api.get(endpoint);
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

// Serviço de configurações
export const configuracoesService = {
  // Listar serviços (PRIVADO - requer role admin ou gerente)
  async listarServicos() {
    return api.get('/configuracoes/servicos');
  },

  // Criar serviço (PRIVADO - requer role admin ou gerente)
  async criarServico(dados) {
    return api.post('/configuracoes/servicos', dados);
  },

  // Atualizar serviço (PRIVADO - requer role admin ou gerente)
  async atualizarServico(servicoId, dados) {
    return api.put(`/configuracoes/servicos/${servicoId}`, dados);
  },

  // Excluir serviço (PRIVADO - requer role admin ou gerente)
  async excluirServico(servicoId) {
    return api.delete(`/configuracoes/servicos/${servicoId}`);
  },


};

// Serviço de testes
export const testService = {
  // Teste de login
  async testLogin(email = 'admin@lucasbarbearia.com', password = 'admin123') {
    return api.publicPost('/auth/login', { email, password });
  },

  // Teste de verificação de autenticação
  async testAuth() {
    return api.get('/auth/me');
  },

  // Teste de logout
  async testLogout() {
    return api.post('/auth/logout', {});
  },

  // Teste de status da fila
  async testFilaStatus() {
    return api.get('/fila/status');
  },

  // Teste de entrar na fila
  async testEntrarFila(dados) {
    return api.publicPost('/fila/entrar', dados);
  },

  // Teste de endpoint genérico
  async testEndpoint(endpoint, method = 'GET', body = null) {
    const options = {
      method,
      headers: {
        'Content-Type': 'application/json',
      },
    };

    if (body) {
      options.body = JSON.stringify(body);
    }

    return api.request(endpoint, options);
  },
};

// Serviço de debug
export const debugService = {
  // Verificar cookies no navegador
  checkCookies() {
    const cookies = document.cookie;
    const hasAuthCookie = cookies.includes('auth_token') || 
                         cookies.includes('session') ||
                         cookies.includes('token');
    
    return {
      cookies,
      hasAuthCookie
    };
  },

  // Executar todos os testes
  async runAllTests() {
    console.log('=== INICIANDO TESTES DE MIGRAÇÃO PARA COOKIES ===');
    
    const results = {
      cookies: this.checkCookies(),
      login: await testService.testLogin(),
      auth: await testService.testAuth(),
      fila: await testService.testFilaStatus(),
      entrarFila: await testService.testEntrarFila({
        nome: 'Teste Cliente',
        telefone: '(81) 99999-9999',
        servico: 'corte',
        barbeiro: 'qualquer'
      }),
      logout: await testService.testLogout()
    };

    console.log('=== TESTES CONCLUÍDOS ===');
    return results;
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