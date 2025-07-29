// Utilitários para autenticação
export const authUtils = {
  // Verificar se o usuário está autenticado
  async isAuthenticated() {
    try {
      console.log('🔍 authUtils.isAuthenticated - Iniciando verificação...');
      
      // Usar authService para verificar via API
      const { authService } = await import('@/services/api.js');
      console.log('🔍 authUtils.isAuthenticated - authService importado');
      
      const response = await authService.checkAuthStatus();
      console.log('🔍 authUtils.isAuthenticated - API response:', response);
      
      const isAuth = response.authenticated || false;
      console.log('🔍 authUtils.isAuthenticated - Resultado:', isAuth);
      
      return isAuth;
    } catch (error) {
      console.error('❌ authUtils.isAuthenticated - Erro:', error);
      
      // Fallback para cookies (para compatibilidade)
      try {
        const { CookieManager } = await import('@/utils/cookieManager.js');
        const token = CookieManager.getAdminToken();
        const userInfo = CookieManager.getUserInfo();
        
        const fallbackAuth = !!(token && userInfo);
        console.log('🔍 authUtils.isAuthenticated - Fallback cookies:', fallbackAuth);
        
        return fallbackAuth;
      } catch (cookieError) {
        console.log('🔍 authUtils.isAuthenticated - Sem fallback disponível');
        return false;
      }
    }
  },

  // Fazer logout e limpar dados da sessão
  logout() {
    // Limpar cookies
    try {
      const { CookieManager } = require('@/utils/cookieManager.js');
      CookieManager.clearAdminCookies();
    } catch (error) {
      console.log('CookieManager não disponível para logout');
    }
    
    // Redirecionar para login
    if (window.location.pathname.startsWith('/admin')) {
      window.location.href = '/admin/login';
    }
  },

  // Verificar se o token expirou baseado no tempo
  isTokenExpired() {
    try {
      const { CookieManager } = require('@/utils/cookieManager.js');
      const token = CookieManager.getAdminToken();
      // Se não há token, consideramos expirado
      return !token;
    } catch (error) {
      return true;
    }
  },

  // Armazenar dados de autenticação
  storeAuthData(token, userData) {
    // Salvar apenas nos cookies
    try {
      const { CookieManager } = require('@/utils/cookieManager.js');
      CookieManager.setAdminToken(token);
      CookieManager.setUserInfo(userData);
    } catch (error) {
      console.log('CookieManager não disponível para salvar dados');
    }
  },

  // Obter dados do usuário atual
  async getCurrentUser() {
    try {
      // Usar authService para obter via API
      const { authService } = await import('@/services/api.js');
      const response = await authService.getCurrentUser();
      
      console.log('🔍 authUtils.getCurrentUser - API response:', response);
      
      if (response.data && response.data.user) {
        return response.data.user;
      }
      
      return null;
    } catch (error) {
      console.error('❌ authUtils.getCurrentUser - Erro:', error);
      
      // Fallback para cookies (para compatibilidade)
      try {
        const { CookieManager } = await import('@/utils/cookieManager.js');
        const token = CookieManager.getAdminToken();
        const userInfo = CookieManager.getUserInfo();
        
        if (token && userInfo) {
          return userInfo;
        }
      } catch (cookieError) {
        console.log('CookieManager não disponível para fallback');
      }
      
      return null;
    }
  },

  // Verificar se o usuário tem uma role específica
  hasRole(requiredRole) {
    // Obter dos cookies
    try {
      const { CookieManager } = require('@/utils/cookieManager.js');
      const userRole = CookieManager.getUserRole();
      return userRole === requiredRole;
    } catch (error) {
      console.log('CookieManager não disponível');
      return false;
    }
  },

  // Verificar se o usuário tem qualquer uma das roles
  hasAnyRole(roles) {
    // Obter dos cookies
    try {
      const { CookieManager } = require('@/utils/cookieManager.js');
      const userRole = CookieManager.getUserRole();
      return roles.includes(userRole);
    } catch (error) {
      console.log('CookieManager não disponível');
      return false;
    }
  }
}; 