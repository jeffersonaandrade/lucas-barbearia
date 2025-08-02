// Sistema de expiração automática para localStorage
// Baseado no tempo de expiração do token do cliente (4 horas)

import { CookieManager } from './cookieManager.js';

class LocalStorageExpiration {
  constructor() {
    this.checkInterval = 5 * 60 * 1000; // Verificar a cada 5 minutos
    this.intervalId = null;
    this.isRunning = false;
  }

  /**
   * Iniciar verificação automática de expiração
   */
  start() {
    if (this.isRunning) {
      console.log('⚠️ Verificação de expiração já está rodando');
      return;
    }

    console.log('🔄 Iniciando verificação automática de expiração do localStorage');
    this.isRunning = true;

    // Verificar imediatamente
    this.checkExpiredData();

    // Configurar verificação periódica
    this.intervalId = setInterval(() => {
      this.checkExpiredData();
    }, this.checkInterval);
  }

  /**
   * Parar verificação automática
   */
  stop() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
    this.isRunning = false;
    console.log('⏹️ Verificação automática de expiração parada');
  }

  /**
   * Verificar e limpar dados expirados
   */
  checkExpiredData() {
    console.log('🔍 Verificando dados expirados no localStorage...');

    // Verificar dados da fila
    if (CookieManager.isFilaDataExpired()) {
      console.log('⏰ Dados da fila expirados, limpando...');
      CookieManager.clearFilaCookies();
    }

    // Verificar outros dados que podem ter expiração
    this.checkOtherExpiredData();

    // Log do status
    this.logExpirationStatus();
  }

  /**
   * Verificar outros dados que podem ter expiração
   */
  checkOtherExpiredData() {
    // Verificar dados de avaliação (expira em 24 horas)
    const avaliacaoTimestamp = localStorage.getItem('avaliacao_timestamp');
    if (avaliacaoTimestamp) {
      const now = Date.now();
      const avaliacaoTime = parseInt(avaliacaoTimestamp);
      const avaliacaoExpiresIn = 24 * 60 * 60 * 1000; // 24 horas

      if (now - avaliacaoTime > avaliacaoExpiresIn) {
        console.log('⏰ Dados de avaliação expirados, limpando...');
        localStorage.removeItem('avaliacoes');
        localStorage.removeItem('cliente_avaliado');
        localStorage.removeItem('avaliacao_timestamp');
      }
    }

    // Verificar dados de bypass de desenvolvimento (expira em 1 hora)
    const bypassTimestamp = localStorage.getItem('qr_access_timestamp');
    if (bypassTimestamp) {
      const now = Date.now();
      const bypassTime = parseInt(bypassTimestamp);
      const bypassExpiresIn = 60 * 60 * 1000; // 1 hora

      if (now - bypassTime > bypassExpiresIn) {
        console.log('⏰ Dados de bypass expirados, limpando...');
        localStorage.removeItem('qr_access');
        localStorage.removeItem('qr_access_timestamp');
      }
    }

    // Verificar dados de migração (expira em 7 dias)
    const migrationTimestamp = localStorage.getItem('migration_timestamp');
    if (migrationTimestamp) {
      const now = Date.now();
      const migrationTime = parseInt(migrationTimestamp);
      const migrationExpiresIn = 7 * 24 * 60 * 60 * 1000; // 7 dias

      if (now - migrationTime > migrationExpiresIn) {
        console.log('⏰ Dados de migração expirados, limpando...');
        localStorage.removeItem('migration_completed');
        localStorage.removeItem('migration_timestamp');
      }
    }
  }

  /**
   * Log do status de expiração
   */
  logExpirationStatus() {
    const remainingTime = CookieManager.getFilaDataRemainingTime();
    
    if (remainingTime > 0) {
      const hours = Math.floor(remainingTime / (60 * 60 * 1000));
      const minutes = Math.floor((remainingTime % (60 * 60 * 1000)) / (60 * 1000));
      console.log(`⏰ Dados da fila válidos por mais ${hours}h ${minutes}m`);
    } else {
      console.log('⏰ Dados da fila expirados ou não existem');
    }
  }

  /**
   * Limpar todos os dados expirados manualmente
   */
  clearAllExpiredData() {
    console.log('🧹 Limpando todos os dados expirados...');
    
    // Limpar dados da fila se expirados
    if (CookieManager.isFilaDataExpired()) {
      CookieManager.clearFilaCookies();
    }

    // Limpar outros dados expirados
    this.checkOtherExpiredData();
    
    console.log('✅ Limpeza de dados expirados concluída');
  }

  /**
   * Obter estatísticas de dados no localStorage
   */
  getStorageStats() {
    const stats = {
      total: 0,
      expired: 0,
      valid: 0,
      filaData: {
        hasToken: !!localStorage.getItem('fila_token'),
        hasClienteData: !!localStorage.getItem('cliente_data'),
        hasBarbeariaId: !!localStorage.getItem('fila_barbearia_id'),
        isExpired: CookieManager.isFilaDataExpired(),
        remainingTime: CookieManager.getFilaDataRemainingTime()
      },
      otherData: {
        avaliacoes: !!localStorage.getItem('avaliacoes'),
        qrAccess: !!localStorage.getItem('qr_access'),
        migration: !!localStorage.getItem('migration_completed'),
        cookieConsent: !!localStorage.getItem('cookie_consent')
      }
    };

    // Contar todos os itens
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key) {
        stats.total++;
        
        // Verificar se é um item com expiração
        if (key.includes('_expires') || key.includes('_timestamp')) {
          const timestamp = localStorage.getItem(key);
          if (timestamp) {
            const expiresAt = parseInt(timestamp);
            if (Date.now() > expiresAt) {
              stats.expired++;
            } else {
              stats.valid++;
            }
          }
        } else {
          stats.valid++;
        }
      }
    }

    return stats;
  }
}

// Instância global
const localStorageExpiration = new LocalStorageExpiration();

// Iniciar automaticamente quando o módulo for carregado
if (typeof window !== 'undefined') {
  // Aguardar um pouco para não interferir no carregamento inicial
  setTimeout(() => {
    localStorageExpiration.start();
  }, 1000);
}

export default localStorageExpiration; 