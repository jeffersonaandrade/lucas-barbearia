// Script de teste para verificar o sistema de autenticação
import { CookieManager } from './cookieManager.js';

export const testAuthSystem = () => {
  console.log('🧪 Testando sistema de autenticação...');
  
  // Teste 1: Verificar se o token está no localStorage
  const token = CookieManager.getAdminToken();
  console.log('🔍 Token no localStorage:', token ? '✅ Presente' : '❌ Ausente');
  
  // Teste 2: Verificar se as informações do usuário estão no localStorage
  const userInfo = CookieManager.getUserInfo();
  console.log('🔍 User info no localStorage:', userInfo ? '✅ Presente' : '❌ Ausente');
  
  if (userInfo) {
    console.log('👤 Dados do usuário:', {
      id: userInfo.id,
      email: userInfo.email,
      role: userInfo.role,
      nome: userInfo.nome
    });
  }
  
  // Teste 3: Verificar se está autenticado
  const isAuthenticated = CookieManager.isAdminAuthenticated();
  console.log('🔍 Está autenticado:', isAuthenticated ? '✅ Sim' : '❌ Não');
  
  // Teste 4: Debug completo
  console.log('🔍 Debug completo:');
  CookieManager.debugCookies();
  
  return {
    hasToken: !!token,
    hasUserInfo: !!userInfo,
    isAuthenticated,
    userInfo
  };
};

// Função para limpar dados de teste
export const clearTestData = () => {
  console.log('🧹 Limpando dados de teste...');
  CookieManager.clearAdminCookies();
  console.log('✅ Dados limpos');
};

// Função para simular dados de teste
export const simulateTestData = () => {
  console.log('🎭 Simulando dados de teste...');
  
  const testUser = {
    id: 'test-user-id',
    email: 'test@example.com',
    role: 'admin',
    nome: 'Usuário Teste'
  };
  
  const testToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.test.token';
  
  CookieManager.setAdminToken(testToken);
  CookieManager.setUserInfo(testUser);
  
  console.log('✅ Dados de teste simulados');
  return { user: testUser, token: testToken };
}; 