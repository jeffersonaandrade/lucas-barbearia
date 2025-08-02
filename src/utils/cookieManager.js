// Utilitário para gerenciar cookies de forma segura
export class CookieManager {
  static setCookie(name, value, options = {}) {
    const {
      expires = 7, // 7 dias por padrão
      path = '/',
      secure = window.location.protocol === 'https:', // true apenas em HTTPS
      sameSite = 'Strict'
    } = options;

    let cookieString = `${name}=${encodeURIComponent(JSON.stringify(value))}`;
    
    if (expires) {
      const date = new Date();
      // Se expires < 30, tratar como horas, senão como dias
      const isHours = expires < 30;
      const multiplier = isHours ? 60 * 60 * 1000 : 24 * 60 * 60 * 1000;
      date.setTime(date.getTime() + (expires * multiplier));
      cookieString += `; expires=${date.toUTCString()}`;
    }
    
    if (path) cookieString += `; path=${path}`;
    if (secure) cookieString += '; secure';
    if (sameSite) cookieString += `; samesite=${sameSite}`;
    
    document.cookie = cookieString;
    console.log(`🍪 Cookie ${name} definido:`, value);
  }

  static getCookie(name) {
    const nameEQ = name + "=";
    const ca = document.cookie.split(';');
    
    for (let i = 0; i < ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) === ' ') c = c.substring(1, c.length);
      if (c.indexOf(nameEQ) === 0) {
        try {
          const value = c.substring(nameEQ.length, c.length);
          return JSON.parse(decodeURIComponent(value));
        } catch (error) {
          console.error(`❌ Erro ao parsear cookie ${name}:`, error);
          return null;
        }
      }
    }
    return null;
  }

  static removeCookie(name, path = '/') {
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=${path};`;
    console.log(`🗑️ Cookie ${name} removido`);
  }

  static hasCookie(name) {
    return this.getCookie(name) !== null;
  }

  // Métodos específicos para dados da fila
  static setFilaToken(token) {
    // SOLUÇÃO TEMPORÁRIA: Usar localStorage em vez de cookies para desenvolvimento
    localStorage.setItem('fila_token', token);
    // Salvar timestamp de expiração (4 horas = 4 * 60 * 60 * 1000 ms)
    const expirationTime = Date.now() + (4 * 60 * 60 * 1000);
    localStorage.setItem('fila_token_expires', expirationTime.toString());
    console.log('🍪 Fila token salvo no localStorage:', token ? `${token.substring(0, 20)}...` : 'null');
    console.log('⏰ Token expira em:', new Date(expirationTime).toLocaleString());
  }

  static getFilaToken() {
    // SOLUÇÃO TEMPORÁRIA: Usar localStorage em vez de cookies para desenvolvimento
    const token = localStorage.getItem('fila_token');
    const expirationTime = localStorage.getItem('fila_token_expires');
    
    // Verificar se o token expirou
    if (token && expirationTime) {
      const now = Date.now();
      const expiresAt = parseInt(expirationTime);
      
      if (now > expiresAt) {
        console.log('⏰ Token da fila expirado, limpando dados...');
        this.clearFilaCookies();
        return null;
      }
      
      const remainingTime = expiresAt - now;
      const remainingHours = Math.floor(remainingTime / (60 * 60 * 1000));
      const remainingMinutes = Math.floor((remainingTime % (60 * 60 * 1000)) / (60 * 1000));
      
      console.log(`🔍 CookieManager.getFilaToken - Token válido por mais ${remainingHours}h ${remainingMinutes}m`);
    }
    
    console.log('🔍 CookieManager.getFilaToken - Token do localStorage:', token ? `${token.substring(0, 20)}...` : 'null');
    return token;
  }

  static setClienteData(clienteData) {
    // SOLUÇÃO TEMPORÁRIA: Usar localStorage em vez de cookies para desenvolvimento
    localStorage.setItem('cliente_data', JSON.stringify(clienteData));
    // Salvar timestamp de expiração (4 horas = 4 * 60 * 60 * 1000 ms)
    const expirationTime = Date.now() + (4 * 60 * 60 * 1000);
    localStorage.setItem('cliente_data_expires', expirationTime.toString());
    console.log('🍪 Cliente data salvo no localStorage:', clienteData);
    console.log('⏰ Dados expiram em:', new Date(expirationTime).toLocaleString());
  }

  static getClienteData() {
    // SOLUÇÃO TEMPORÁRIA: Usar localStorage em vez de cookies para desenvolvimento
    const clienteData = localStorage.getItem('cliente_data');
    const expirationTime = localStorage.getItem('cliente_data_expires');
    
    // Verificar se os dados expiraram
    if (clienteData && expirationTime) {
      const now = Date.now();
      const expiresAt = parseInt(expirationTime);
      
      if (now > expiresAt) {
        console.log('⏰ Dados do cliente expirados, limpando...');
        this.clearFilaCookies();
        return null;
      }
      
      const remainingTime = expiresAt - now;
      const remainingHours = Math.floor(remainingTime / (60 * 60 * 1000));
      const remainingMinutes = Math.floor((remainingTime % (60 * 60 * 1000)) / (60 * 1000));
      
      console.log(`🔍 Dados do cliente válidos por mais ${remainingHours}h ${remainingMinutes}m`);
    }
    
    if (clienteData) {
      try {
        return JSON.parse(clienteData);
      } catch (error) {
        console.error('❌ Erro ao parsear cliente_data do localStorage:', error);
        return null;
      }
    }
    return null;
  }

  static setBarbeariaId(barbeariaId) {
    // SOLUÇÃO TEMPORÁRIA: Usar localStorage em vez de cookies para desenvolvimento
    localStorage.setItem('fila_barbearia_id', barbeariaId);
    // Salvar timestamp de expiração (4 horas = 4 * 60 * 60 * 1000 ms)
    const expirationTime = Date.now() + (4 * 60 * 60 * 1000);
    localStorage.setItem('fila_barbearia_id_expires', expirationTime.toString());
    console.log('🍪 Barbearia ID salvo no localStorage:', barbeariaId);
    console.log('⏰ ID expira em:', new Date(expirationTime).toLocaleString());
  }

  static getBarbeariaId() {
    // SOLUÇÃO TEMPORÁRIA: Usar localStorage em vez de cookies para desenvolvimento
    const barbeariaId = localStorage.getItem('fila_barbearia_id');
    const expirationTime = localStorage.getItem('fila_barbearia_id_expires');
    
    // Verificar se o ID expirou
    if (barbeariaId && expirationTime) {
      const now = Date.now();
      const expiresAt = parseInt(expirationTime);
      
      if (now > expiresAt) {
        console.log('⏰ ID da barbearia expirado, limpando dados...');
        this.clearFilaCookies();
        return null;
      }
      
      const remainingTime = expiresAt - now;
      const remainingHours = Math.floor(remainingTime / (60 * 60 * 1000));
      const remainingMinutes = Math.floor((remainingTime % (60 * 60 * 1000)) / (60 * 1000));
      
      console.log(`🔍 ID da barbearia válido por mais ${remainingHours}h ${remainingMinutes}m`);
    }
    
    console.log('🔍 CookieManager.getBarbeariaId - ID do localStorage:', barbeariaId);
    return barbeariaId;
  }

  static setQRAccess(qrAccess) {
    // SOLUÇÃO TEMPORÁRIA: Usar localStorage em vez de cookies para desenvolvimento
    localStorage.setItem('qr_access', JSON.stringify(qrAccess));
    console.log('🍪 QR Access salvo no localStorage:', qrAccess);
  }

  static getQRAccess() {
    // SOLUÇÃO TEMPORÁRIA: Usar localStorage em vez de cookies para desenvolvimento
    const qrAccess = localStorage.getItem('qr_access');
    if (qrAccess) {
      try {
        return JSON.parse(qrAccess);
      } catch (error) {
        console.error('❌ Erro ao parsear qr_access do localStorage:', error);
        return null;
      }
    }
    return null;
  }

  // Limpar todos os dados da fila do localStorage
  static clearFilaCookies() {
    // SOLUÇÃO TEMPORÁRIA: Limpar localStorage em vez de cookies
    localStorage.removeItem('fila_token');
    localStorage.removeItem('fila_token_expires');
    localStorage.removeItem('cliente_data');
    localStorage.removeItem('cliente_data_expires');
    localStorage.removeItem('fila_barbearia_id');
    localStorage.removeItem('fila_barbearia_id_expires');
    localStorage.removeItem('qr_access');
    console.log('🧹 Todos os dados da fila foram limpos do localStorage');
  }

  // Verificar se o cliente está na fila
  static isClienteNaFila() {
    const token = this.getFilaToken();
    const clienteData = this.getClienteData();
    const barbeariaId = this.getBarbeariaId();
    
    return !!(token && clienteData && barbeariaId);
  }

  // Verificar se os dados da fila estão expirados
  static isFilaDataExpired() {
    const tokenExpires = localStorage.getItem('fila_token_expires');
    const clienteExpires = localStorage.getItem('cliente_data_expires');
    const barbeariaExpires = localStorage.getItem('fila_barbearia_id_expires');
    
    if (!tokenExpires || !clienteExpires || !barbeariaExpires) {
      return true; // Se não há timestamps, considerar expirado
    }
    
    const now = Date.now();
    const tokenExpiresAt = parseInt(tokenExpires);
    const clienteExpiresAt = parseInt(clienteExpires);
    const barbeariaExpiresAt = parseInt(barbeariaExpires);
    
    return now > tokenExpiresAt || now > clienteExpiresAt || now > barbeariaExpiresAt;
  }

  // Obter tempo restante dos dados da fila
  static getFilaDataRemainingTime() {
    const tokenExpires = localStorage.getItem('fila_token_expires');
    const clienteExpires = localStorage.getItem('cliente_data_expires');
    const barbeariaExpires = localStorage.getItem('fila_barbearia_id_expires');
    
    if (!tokenExpires || !clienteExpires || !barbeariaExpires) {
      return 0;
    }
    
    const now = Date.now();
    const tokenExpiresAt = parseInt(tokenExpires);
    const clienteExpiresAt = parseInt(clienteExpires);
    const barbeariaExpiresAt = parseInt(barbeariaExpires);
    
    // Pegar o menor tempo restante
    const minExpiresAt = Math.min(tokenExpiresAt, clienteExpiresAt, barbeariaExpiresAt);
    const remainingTime = minExpiresAt - now;
    
    return Math.max(0, remainingTime);
  }

  // Obter dados completos do cliente na fila
  static getClienteNaFila() {
    if (!this.isClienteNaFila()) {
      return null;
    }

    return {
      token: this.getFilaToken(),
      cliente: this.getClienteData(),
      barbeariaId: this.getBarbeariaId()
    };
  }

  // Métodos específicos para tokens de administração (usando nomes do backend)
  static setAdminToken(token) {
    // SOLUÇÃO TEMPORÁRIA: Usar localStorage em vez de cookies para desenvolvimento
    console.log('🔍 CookieManager.setAdminToken - Token recebido:', token ? `${token.substring(0, 50)}...` : 'null');
    console.log('🔍 CookieManager.setAdminToken - Token parts:', token ? token.split('.').length : 0);
    
    // Verificar se o token já tem 4 partes (problema)
    if (token && token.split('.').length === 4) {
      console.warn('⚠️ CookieManager.setAdminToken - Token já tem 4 partes! Extraindo apenas as 3 primeiras...');
      const parts = token.split('.');
      token = parts.slice(0, 3).join('.');
      console.log('🔍 CookieManager.setAdminToken - Token corrigido:', token);
    }
    
    // Usar localStorage temporariamente
    localStorage.setItem('auth_token', token);
    console.log(`🍪 Token salvo no localStorage:`, token ? `${token.substring(0, 20)}...` : 'null');
  }

  static getAdminToken() {
    // SOLUÇÃO TEMPORÁRIA: Usar localStorage em vez de cookies para desenvolvimento
    const token = localStorage.getItem('auth_token');
    console.log('🔍 CookieManager.getAdminToken - Token do localStorage:', token ? `${token.substring(0, 50)}...` : 'null');
    
    if (token) {
      console.log('🔍 CookieManager.getAdminToken - Token parts:', token.split('.').length);
      
      // Verificar se o token tem formato correto (3 partes)
      if (token.split('.').length !== 3) {
        console.warn('⚠️ Token com formato incorreto:', token.split('.').length, 'partes');
      }
    }
    
    return token;
  }

  static setUserInfo(userData) {
    // SOLUÇÃO TEMPORÁRIA: Usar localStorage em vez de cookies para desenvolvimento
    localStorage.setItem('user_info', JSON.stringify(userData));
    console.log('🍪 User info salvo no localStorage:', userData);
  }

  static getUserInfo() {
    // SOLUÇÃO TEMPORÁRIA: Usar localStorage em vez de cookies para desenvolvimento
    const userInfo = localStorage.getItem('user_info');
    if (userInfo) {
      try {
        return JSON.parse(userInfo);
      } catch (error) {
        console.error('❌ Erro ao parsear user_info do localStorage:', error);
        return null;
      }
    }
    return null;
  }

  // Métodos de conveniência para acessar dados do usuário
  static getUserRole() {
    const userInfo = this.getUserInfo();
    return userInfo?.role;
  }

  static getUserEmail() {
    const userInfo = this.getUserInfo();
    return userInfo?.email;
  }

  static getUserId() {
    const userInfo = this.getUserInfo();
    return userInfo?.id;
  }

  static getUserName() {
    const userInfo = this.getUserInfo();
    return userInfo?.nome;
  }

  // Limpar todos os cookies de administração
  static clearAdminCookies() {
    // SOLUÇÃO TEMPORÁRIA: Limpar localStorage em vez de cookies
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_info');
    console.log('🧹 Todos os dados de administração foram limpos do localStorage');
  }

  // Verificar se o usuário está autenticado como admin
  static isAdminAuthenticated() {
    const token = this.getAdminToken();
    const userInfo = this.getUserInfo();
    
    console.log('🔍 CookieManager.isAdminAuthenticated:', {
      hasToken: !!token,
      hasUserInfo: !!userInfo,
      token: token ? `${token.substring(0, 20)}...` : null,
      userInfo: userInfo
    });
    
    // Se temos token, consideramos autenticado (mesmo sem userInfo)
    // O backend pode estar configurando apenas o token
    return !!token;
  }

  // Debug: listar todos os cookies
  static debugCookies() {
    console.log('🍪 Cookies atuais:');
    console.log('fila_token:', this.getFilaToken());
    console.log('cliente_data:', this.getClienteData());
    console.log('fila_barbearia_id:', this.getBarbeariaId());
    console.log('qr_access:', this.getQRAccess());
    console.log('isClienteNaFila:', this.isClienteNaFila());
    console.log('--- Cookies de Admin ---');
    const adminToken = this.getAdminToken();
    console.log('auth_token:', adminToken ? `${adminToken.substring(0, 50)}...` : 'null');
    console.log('user_info:', this.getUserInfo());
    console.log('user_role:', this.getUserRole());
    console.log('user_email:', this.getUserEmail());
    console.log('user_id:', this.getUserId());
    console.log('user_name:', this.getUserName());
    console.log('isAdminAuthenticated:', this.isAdminAuthenticated());
  }
} 