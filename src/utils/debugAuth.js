// Utilitário para debug de autenticação
import { CookieManager } from './cookieManager.js';

export const debugAuth = {
  // Verificar estado atual da autenticação
  checkAuthStatus() {
    console.log('🔍 === DEBUG AUTENTICAÇÃO ===');
    
    // Verificar cookies
    console.log('🍪 Cookies:');
    CookieManager.debugCookies();
    
    // Verificar sessionStorage (apenas para debug, não usado mais)
    console.log('💾 SessionStorage (deprecated):');
    console.log('adminToken:', sessionStorage.getItem('adminToken'));
    console.log('userRole:', sessionStorage.getItem('userRole'));
    console.log('userEmail:', sessionStorage.getItem('userEmail'));
    console.log('userData:', sessionStorage.getItem('userData'));
    
    // Verificar se está autenticado
    console.log('✅ Status de Autenticação:');
    console.log('CookieManager.isAdminAuthenticated():', CookieManager.isAdminAuthenticated());
    console.log('authUtils.isAuthenticated():', require('./authUtils.js').authUtils.isAuthenticated());
    
    console.log('🔍 === FIM DEBUG ===');
  },

  // Verificar se os cookies estão sendo enviados nas requisições
  async testAuthRequest() {
    try {
      console.log('🧪 Testando requisição autenticada...');
      
      const response = await fetch('/api/auth/me', {
        method: 'GET',
        credentials: 'include', // Importante: incluir cookies
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      console.log('📡 Resposta da requisição de teste:');
      console.log('Status:', response.status);
      console.log('OK:', response.ok);
      
      if (response.ok) {
        const data = await response.json();
        console.log('Dados:', data);
      } else {
        console.log('Erro na requisição');
      }
      
    } catch (error) {
      console.error('❌ Erro no teste de requisição:', error);
    }
  },

  // Limpar todos os dados de autenticação
  clearAllAuth() {
    console.log('🧹 Limpando todos os dados de autenticação...');
    
    // Limpar cookies
    CookieManager.clearAdminCookies();
    CookieManager.clearFilaCookies();
    
    // Limpar sessionStorage (apenas para debug, não usado mais)
    sessionStorage.removeItem('adminToken');
    sessionStorage.removeItem('userRole');
    sessionStorage.removeItem('userEmail');
    sessionStorage.removeItem('userData');
    sessionStorage.removeItem('userPassword');
    sessionStorage.removeItem('tokenTimestamp');
    
    console.log('✅ Dados de autenticação limpos');
  }
}; 