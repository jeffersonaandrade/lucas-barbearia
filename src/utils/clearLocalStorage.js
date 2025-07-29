// Utilitário para limpar cookies e verificar dados
import { CookieManager } from './cookieManager.js';

export const clearLocalStorage = () => {
  console.log('🧹 Limpando cookies...');
  
  // Verificar dados antes de limpar
  const dadosAntes = {
    fila_token: CookieManager.getFilaToken(),
    cliente_data: CookieManager.getClienteData(),
    fila_barbearia_id: CookieManager.getBarbeariaId(),
    qr_access: CookieManager.getQRAccess()
  };
  
  console.log('📋 Dados encontrados nos cookies:', dadosAntes);
  
  // Limpar dados relacionados à fila
  CookieManager.clearFilaCookies();
  
  console.log('✅ Cookies limpos com sucesso!');
  
  return dadosAntes;
};

export const checkLocalStorage = () => {
  const dados = {
    fila_token: CookieManager.getFilaToken(),
    cliente_data: CookieManager.getClienteData(),
    fila_barbearia_id: CookieManager.getBarbeariaId(),
    qr_access: CookieManager.getQRAccess()
  };
  
  console.log('🔍 Verificação dos cookies:', dados);
  
  if (dados.fila_token) {
    console.log('🎫 Token encontrado:', dados.fila_token);
  }
  
  if (dados.cliente_data) {
    console.log('👤 Dados do cliente:', dados.cliente_data);
  }
  
  if (dados.fila_barbearia_id) {
    console.log('🏪 ID da barbearia:', dados.fila_barbearia_id);
  }
  
  if (dados.qr_access) {
    console.log('📱 Dados de acesso QR:', dados.qr_access);
  }
  
  return dados;
}; 