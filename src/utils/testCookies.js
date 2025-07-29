// Teste de migração para cookies
import { testService, debugService } from '@/services/api.js';

// Teste de login
export const testLogin = async () => {
  try {
    const data = await testService.testLogin();
    console.log('Login:', data);
    return data;
  } catch (error) {
    console.error('Erro no login:', error);
    return null;
  }
};

// Teste de verificação de autenticação
export const testAuth = async () => {
  try {
    const data = await testService.testAuth();
    console.log('Auth check:', data);
    return data;
  } catch (error) {
    console.error('Erro na verificação:', error);
    return null;
  }
};

// Teste de logout
export const testLogout = async () => {
  try {
    const data = await testService.testLogout();
    console.log('Logout:', data);
    return data;
  } catch (error) {
    console.error('Erro no logout:', error);
    return null;
  }
};

// Teste de status da fila
export const testFilaStatus = async () => {
  try {
    const data = await testService.testFilaStatus();
    console.log('Fila status:', data);
    return data;
  } catch (error) {
    console.error('Erro no status da fila:', error);
    return null;
  }
};

// Teste de entrar na fila
export const testEntrarFila = async (dados) => {
  try {
    const data = await testService.testEntrarFila(dados);
    console.log('Entrar fila:', data);
    return data;
  } catch (error) {
    console.error('Erro ao entrar na fila:', error);
    return null;
  }
};

// Verificar cookies no navegador
export const checkCookies = () => {
  return debugService.checkCookies();
};

// Função para executar todos os testes
export const runAllTests = async () => {
  return debugService.runAllTests();
}; 