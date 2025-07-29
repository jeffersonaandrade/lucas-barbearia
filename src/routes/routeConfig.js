// Configuração de rotas e constantes
export const ROUTES = {
  // Rotas públicas
  HOME: '/',
  ENTRAR_FILA: '/entrar-fila',
  BARBEARIA_ENTRAR_FILA: '/barbearia/:id/entrar-fila',
  DEV_ENTRAR_FILA: '/dev/barbearia/:id/entrar-fila',
  BARBEARIA_STATUS_FILA: '/barbearia/:id/status-fila',
  BARBEARIA_VISUALIZAR_FILA: '/barbearia/:id/visualizar-fila',
  QR_CODE: '/qr-code/:barbeariaId',
  BARBEARIAS: '/barbearias',
  BARBEARIA_AGENDAR: '/barbearia/:id/agendar',
  PRIVACIDADE: '/privacidade',
  TERMOS: '/termos',
  BARBEARIA_AVALIACAO: '/barbearia/:id/avaliacao',
  AVALIACOES: '/avaliacoes',
  TEST_USER_CREATION: '/test-user-creation',
  API_TEST: '/api-test',
  
  // Rotas administrativas
  ADMIN_LOGIN: '/admin/login',
  ADMIN_RECUPERAR_SENHA: '/admin/recuperar-senha',
  ADMIN_USUARIOS: '/admin/usuarios',
  ADMIN_BARBEARIAS: '/admin/barbearias',
  ADMIN_FUNCIONARIOS: '/admin/funcionarios',
  ADMIN_ADICIONAR_FILA: '/admin/adicionar-fila',
  ADMIN_FILAS: '/admin/filas',
  ADMIN_RELATORIOS: '/admin/relatorios',
  ADMIN_CONFIGURACOES: '/admin/configuracoes',
  ADMIN_DASHBOARD: '/admin/dashboard',
  ADMIN_UNAUTHORIZED: '/admin/unauthorized',
  ADMIN: '/admin'
};

// Configuração de permissões por rota
export const ROUTE_PERMISSIONS = {
  [ROUTES.ADMIN_USUARIOS]: ['admin'],
  [ROUTES.ADMIN_BARBEARIAS]: ['admin'],
  [ROUTES.ADMIN_FUNCIONARIOS]: ['admin'],
  [ROUTES.ADMIN_ADICIONAR_FILA]: ['admin', 'gerente', 'barbeiro'],
  [ROUTES.ADMIN_FILAS]: ['admin', 'gerente', 'barbeiro'],
  [ROUTES.ADMIN_RELATORIOS]: ['admin'],
  [ROUTES.ADMIN_CONFIGURACOES]: ['admin'],
  [ROUTES.ADMIN_DASHBOARD]: ['admin', 'gerente', 'barbeiro'],
  [ROUTES.ADMIN_UNAUTHORIZED]: ['admin', 'gerente', 'barbeiro'],
  [ROUTES.ADMIN]: ['admin', 'gerente', 'barbeiro']
};

// Configuração de metadados das rotas
export const ROUTE_METADATA = {
  [ROUTES.HOME]: {
    title: 'Lucas Barbearia - Início',
    description: 'Barbearia de qualidade com atendimento personalizado',
    requiresAuth: false
  },
  [ROUTES.ENTRAR_FILA]: {
    title: 'Entrar na Fila',
    description: 'Entre na fila da barbearia',
    requiresAuth: false
  },
  [ROUTES.ADMIN_LOGIN]: {
    title: 'Login Administrativo',
    description: 'Acesso ao painel administrativo',
    requiresAuth: false
  },
  [ROUTES.ADMIN_DASHBOARD]: {
    title: 'Dashboard Administrativo',
    description: 'Painel de controle da barbearia',
    requiresAuth: true
  }
};

// Função para gerar URL com parâmetros
export const generateUrl = (route, params = {}) => {
  let url = route;
  
  Object.keys(params).forEach(key => {
    url = url.replace(`:${key}`, params[key]);
  });
  
  return url;
};

// Função para verificar se rota requer autenticação
export const requiresAuth = (route) => {
  return ROUTE_PERMISSIONS[route] !== undefined;
};

// Função para obter permissões de uma rota
export const getRoutePermissions = (route) => {
  return ROUTE_PERMISSIONS[route] || [];
}; 