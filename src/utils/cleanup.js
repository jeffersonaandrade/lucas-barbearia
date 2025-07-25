// Utilitário para limpar localStorage e migrar para sessionStorage
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

  // Migrar dados do localStorage para sessionStorage
  migrateToSessionStorage() {
    try {
      console.log('🔄 Iniciando migração para sessionStorage...');

      // Dados de autenticação
      const adminToken = localStorage.getItem('adminToken');
      const userRole = localStorage.getItem('userRole');
      const userEmail = localStorage.getItem('userEmail');

      if (adminToken) {
        sessionStorage.setItem('adminToken', adminToken);
        console.log('✅ Token de admin migrado');
      }

      if (userRole) {
        sessionStorage.setItem('userRole', userRole);
        console.log('✅ Role do usuário migrado');
      }

      if (userEmail) {
        sessionStorage.setItem('userEmail', userEmail);
        console.log('✅ Email do usuário migrado');
      }

      // Dados da fila
      const filaToken = localStorage.getItem('fila_token');
      const clienteData = localStorage.getItem('cliente_data');
      const barbeariaId = localStorage.getItem('fila_barbearia_id');
      const timestamp = localStorage.getItem('fila_timestamp');

      if (filaToken) {
        sessionStorage.setItem('fila_token', filaToken);
        console.log('✅ Token da fila migrado');
      }

      if (clienteData) {
        sessionStorage.setItem('cliente_data', clienteData);
        console.log('✅ Dados do cliente migrados');
      }

      if (barbeariaId) {
        sessionStorage.setItem('fila_barbearia_id', barbeariaId);
        console.log('✅ ID da barbearia migrado');
      }

      if (timestamp) {
        sessionStorage.setItem('fila_timestamp', timestamp);
        console.log('✅ Timestamp migrado');
      }

      console.log('✅ Migração para sessionStorage concluída');
      return true;
    } catch (error) {
      console.error('❌ Erro na migração para sessionStorage:', error);
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

  // Limpar sessionStorage
  clearSessionStorage() {
    try {
      console.log('🧹 Limpando sessionStorage...');

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

      console.log('✅ sessionStorage limpo');
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

      // Migrar dados importantes para sessionStorage
      const migrationSuccess = this.migrateToSessionStorage();

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