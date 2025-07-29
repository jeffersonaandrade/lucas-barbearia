// Utilitário para limpar localStorage e migrar para cookies
export class CleanupService {
  constructor() {
    this.cleanupKey = 'lucas_barbearia_cleanup_completed';
  }

  // Verificar se a limpeza já foi feita
  isCleanupCompleted() {
    return localStorage.getItem(this.cleanupKey) === 'true';
  }

  // Marcar limpeza como concluída
  markCleanupCompleted() {
    localStorage.setItem(this.cleanupKey, 'true');
  }

  // Migrar dados do localStorage para cookies
  migrateToCookies() {
    try {
      console.log('🔄 Iniciando migração para cookies...');

      // Importar CookieManager
      const { CookieManager } = require('./cookieManager.js');

      // Dados de autenticação
      const adminToken = localStorage.getItem('adminToken');
      const userRole = localStorage.getItem('userRole');
      const userEmail = localStorage.getItem('userEmail');

      if (adminToken && userRole && userEmail) {
        // Criar objeto de usuário para salvar nos cookies
        const userData = {
          role: userRole,
          email: userEmail,
          // Outros campos podem ser adicionados conforme necessário
        };
        
        CookieManager.setAdminToken(adminToken);
        CookieManager.setUserInfo(userData);
        console.log('✅ Dados de autenticação migrados para cookies');
      }

      // Dados da fila
      const filaToken = localStorage.getItem('fila_token');
      const clienteData = localStorage.getItem('cliente_data');
      const barbeariaId = localStorage.getItem('fila_barbearia_id');

      if (filaToken) {
        CookieManager.setFilaToken(filaToken);
        console.log('✅ Token da fila migrado para cookies');
      }

      if (clienteData) {
        try {
          const cliente = JSON.parse(clienteData);
          CookieManager.setClienteData(cliente);
          console.log('✅ Dados do cliente migrados para cookies');
        } catch (e) {
          console.log('⚠️ Erro ao parsear dados do cliente');
        }
      }

      if (barbeariaId) {
        CookieManager.setBarbeariaId(barbeariaId);
        console.log('✅ ID da barbearia migrado para cookies');
      }

      console.log('✅ Migração para cookies concluída');
      return true;
    } catch (error) {
      console.error('❌ Erro na migração para cookies:', error);
      return false;
    }
  }

  // Limpar localStorage completamente
  clearLocalStorage() {
    try {
      console.log('🧹 Limpando localStorage...');

      // Lista de chaves específicas do Lucas Barbearia
      const keysToRemove = [
        'lucas_barbearia_fila_data',
        'lucas_barbearia_barbearias_data',
        'fila_token',
        'cliente_data',
        'fila_barbearia_id',
        'fila_timestamp',
        'adminToken',
        'userRole',
        'userEmail',
        'lucas_barbearia_migration_completed'
      ];

      // Remover chaves específicas
      keysToRemove.forEach(key => {
        localStorage.removeItem(key);
      });

      console.log('✅ localStorage limpo');
      return true;
    } catch (error) {
      console.error('❌ Erro ao limpar localStorage:', error);
      return false;
    }
  }

  // Limpar sessionStorage (apenas para debug, não usado mais)
  clearSessionStorage() {
    try {
      console.log('🧹 Limpando sessionStorage (deprecated)...');

      const keysToRemove = [
        'fila_token',
        'cliente_data',
        'fila_barbearia_id',
        'fila_timestamp',
        'adminToken',
        'userRole',
        'userEmail'
      ];

      keysToRemove.forEach(key => {
        sessionStorage.removeItem(key);
      });

      console.log('✅ sessionStorage limpo (deprecated)');
      return true;
    } catch (error) {
      console.error('❌ Erro ao limpar sessionStorage:', error);
      return false;
    }
  }

  // Executar limpeza completa
  async executeCleanup() {
    if (this.isCleanupCompleted()) {
      console.log('ℹ️ Limpeza já foi executada anteriormente');
      return true;
    }

    try {
      console.log('🚀 Iniciando limpeza completa...');

      // Migrar dados importantes para cookies
      const migrationSuccess = this.migrateToCookies();

      if (!migrationSuccess) {
        console.warn('⚠️ Falha na migração, mas continuando com a limpeza');
      }

      // Limpar localStorage
      const cleanupSuccess = this.clearLocalStorage();

      if (cleanupSuccess) {
        this.markCleanupCompleted();
        console.log('🎉 Limpeza concluída com sucesso!');
        return true;
      } else {
        throw new Error('Falha na limpeza do localStorage');
      }
    } catch (error) {
      console.error('❌ Erro na limpeza completa:', error);
      return false;
    }
  }

  // Verificar dados em ambos os storages
  checkStorageData() {
    const localStorageData = {};
    const sessionStorageData = {};

    // Verificar localStorage
    const localStorageKeys = [
      'lucas_barbearia_fila_data',
      'lucas_barbearia_barbearias_data',
      'fila_token',
      'cliente_data',
      'fila_barbearia_id',
      'fila_timestamp',
      'adminToken',
      'userRole',
      'userEmail'
    ];

    localStorageKeys.forEach(key => {
      const value = localStorage.getItem(key);
      if (value) {
        localStorageData[key] = value.substring(0, 50) + '...';
      }
    });

    // Verificar sessionStorage
    const sessionStorageKeys = [
      'fila_token',
      'cliente_data',
      'fila_barbearia_id',
      'fila_timestamp',
      'adminToken',
      'userRole',
      'userEmail'
    ];

    sessionStorageKeys.forEach(key => {
      const value = sessionStorage.getItem(key);
      if (value) {
        sessionStorageData[key] = value.substring(0, 50) + '...';
      }
    });

    return {
      localStorage: localStorageData,
      sessionStorage: sessionStorageData
    };
  }

  // Reset completo (limpar ambos os storages)
  resetComplete() {
    try {
      console.log('🔄 Reset completo iniciado...');

      this.clearLocalStorage();
      this.clearSessionStorage();

      // Remover flag de limpeza
      localStorage.removeItem(this.cleanupKey);

      console.log('✅ Reset completo concluído');
      return true;
    } catch (error) {
      console.error('❌ Erro no reset completo:', error);
      return false;
    }
  }
}

// Instância global do serviço de limpeza
export const cleanupService = new CleanupService();

// Função de conveniência para executar limpeza
export const executeCleanup = async () => {
  return await cleanupService.executeCleanup();
};

// Função para verificar dados dos storages
export const checkStorageData = () => {
  return cleanupService.checkStorageData();
};

// Função para reset completo
export const resetComplete = () => {
  return cleanupService.resetComplete();
};

export default cleanupService; 