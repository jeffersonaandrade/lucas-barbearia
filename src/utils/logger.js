import { utilsService } from '@/services/api.js';

// Sistema de logs para monitoramento
// Registra eventos importantes para debugging e auditoria

class Logger {
  constructor() {
    this.logs = [];
    this.maxLogs = 1000; // Máximo de logs em memória
    this.levels = {
      ERROR: 0,
      WARN: 1,
      INFO: 2,
      DEBUG: 3
    };
    this.currentLevel = this.levels.INFO; // Nível padrão
  }

  /**
   * Adiciona um log
   * @param {string} level - Nível do log (ERROR, WARN, INFO, DEBUG)
   * @param {string} message - Mensagem do log
   * @param {Object} data - Dados adicionais
   * @param {string} context - Contexto (componente, função, etc.)
   */
  log(level, message, data = {}, context = '') {
    const levelNum = this.levels[level] || this.levels.INFO;
    
    // Verificar se o nível é permitido
    if (levelNum > this.currentLevel) {
      return;
    }

    const logEntry = {
      timestamp: new Date().toISOString(),
      level,
      message,
      data,
      context,
      userAgent: typeof window !== 'undefined' ? window.navigator.userAgent : 'server',
      url: typeof window !== 'undefined' ? window.location.href : 'server'
    };

    // Adicionar ao array de logs
    this.logs.push(logEntry);

    // Limitar tamanho do array
    if (this.logs.length > this.maxLogs) {
      this.logs.shift();
    }

    // Log no console baseado no nível
    const consoleMethod = this.getConsoleMethod(level);
    const prefix = `[${level}]${context ? ` [${context}]` : ''}`;
    
    if (data && Object.keys(data).length > 0) {
      console[consoleMethod](prefix, message, data);
    } else {
      console[consoleMethod](prefix, message);
    }

    // Em produção, enviar logs críticos para o servidor
    if (level === 'ERROR' && typeof window !== 'undefined') {
      this.sendToServer(logEntry);
    }
  }

  /**
   * Log de erro
   * @param {string} message - Mensagem do erro
   * @param {Object} data - Dados do erro
   * @param {string} context - Contexto
   */
  error(message, data = {}, context = '') {
    this.log('ERROR', message, data, context);
  }

  /**
   * Log de aviso
   * @param {string} message - Mensagem do aviso
   * @param {Object} data - Dados do aviso
   * @param {string} context - Contexto
   */
  warn(message, data = {}, context = '') {
    this.log('WARN', message, data, context);
  }

  /**
   * Log de informação
   * @param {string} message - Mensagem da informação
   * @param {Object} data - Dados da informação
   * @param {string} context - Contexto
   */
  info(message, data = {}, context = '') {
    this.log('INFO', message, data, context);
  }

  /**
   * Log de debug
   * @param {string} message - Mensagem do debug
   * @param {Object} data - Dados do debug
   * @param {string} context - Contexto
   */
  debug(message, data = {}, context = '') {
    this.log('DEBUG', message, data, context);
  }

  /**
   * Log de API
   * @param {string} method - Método HTTP
   * @param {string} endpoint - Endpoint da API
   * @param {Object} requestData - Dados da requisição
   * @param {Object} responseData - Dados da resposta
   * @param {number} statusCode - Código de status
   * @param {number} duration - Duração da requisição
   */
  api(method, endpoint, requestData = {}, responseData = {}, statusCode = 200, duration = 0) {
    const data = {
      method,
      endpoint,
      requestData,
      responseData,
      statusCode,
      duration: `${duration}ms`
    };

    const level = statusCode >= 400 ? 'ERROR' : 'INFO';
    const message = `${method} ${endpoint} - ${statusCode} (${duration}ms)`;

    this.log(level, message, data, 'API');
  }

  /**
   * Log de autenticação
   * @param {string} action - Ação (login, logout, etc.)
   * @param {string} email - Email do usuário
   * @param {boolean} success - Se foi bem-sucedido
   * @param {Object} data - Dados adicionais
   */
  auth(action, email, success, data = {}) {
    const level = success ? 'INFO' : 'WARN';
    const message = `${action} ${success ? 'bem-sucedido' : 'falhou'} - ${email}`;

    this.log(level, message, { ...data, email, success }, 'AUTH');
  }

  /**
   * Log de fila
   * @param {string} action - Ação na fila
   * @param {string} barbeariaId - ID da barbearia
   * @param {Object} clienteData - Dados do cliente
   * @param {Object} data - Dados adicionais
   */
  fila(action, barbeariaId, clienteData = {}, data = {}) {
    const message = `${action} na fila - Barbearia ${barbeariaId}`;
    
    this.log('INFO', message, { ...data, barbeariaId, clienteData }, 'FILA');
  }

  /**
   * Log de performance
   * @param {string} operation - Operação medida
   * @param {number} duration - Duração em ms
   * @param {Object} data - Dados adicionais
   */
  performance(operation, duration, data = {}) {
    const level = duration > 1000 ? 'WARN' : 'INFO';
    const message = `${operation} - ${duration}ms`;

    this.log(level, message, { ...data, duration }, 'PERFORMANCE');
  }

  /**
   * Log de erro de usuário
   * @param {string} action - Ação que causou o erro
   * @param {Error} error - Objeto de erro
   * @param {Object} context - Contexto adicional
   */
  userError(action, error, context = {}) {
    const data = {
      action,
      error: {
        message: error.message,
        stack: error.stack,
        name: error.name
      },
      ...context
    };

    this.log('ERROR', `Erro do usuário: ${action}`, data, 'USER_ERROR');
  }

  /**
   * Obtém método do console baseado no nível
   * @param {string} level - Nível do log
   * @returns {string} - Método do console
   */
  getConsoleMethod(level) {
    switch (level) {
      case 'ERROR':
        return 'error';
      case 'WARN':
        return 'warn';
      case 'INFO':
        return 'info';
      case 'DEBUG':
        return 'debug';
      default:
        return 'log';
    }
  }

  /**
   * Envia log para o servidor
   * @param {Object} logEntry - Entrada do log
   */
  async sendToServer(logEntry) {
    try {
      // Endpoint de logs não implementado no backend
      console.warn('Endpoint POST /logs não implementado no backend');
    } catch (error) {
      // Não logar erro de envio de log para evitar loop infinito
      console.warn('Falha ao enviar log para servidor:', error);
    }
  }

  /**
   * Obtém logs filtrados
   * @param {Object} filters - Filtros
   * @returns {Array} - Logs filtrados
   */
  getLogs(filters = {}) {
    let filteredLogs = [...this.logs];

    // Filtrar por nível
    if (filters.level) {
      const levelNum = this.levels[filters.level];
      if (levelNum !== undefined) {
        filteredLogs = filteredLogs.filter(log => this.levels[log.level] <= levelNum);
      }
    }

    // Filtrar por contexto
    if (filters.context) {
      filteredLogs = filteredLogs.filter(log => log.context === filters.context);
    }

    // Filtrar por período
    if (filters.since) {
      const sinceDate = new Date(filters.since);
      filteredLogs = filteredLogs.filter(log => new Date(log.timestamp) >= sinceDate);
    }

    if (filters.until) {
      const untilDate = new Date(filters.until);
      filteredLogs = filteredLogs.filter(log => new Date(log.timestamp) <= untilDate);
    }

    // Limitar quantidade
    if (filters.limit) {
      filteredLogs = filteredLogs.slice(-filters.limit);
    }

    return filteredLogs;
  }

  /**
   * Exporta logs
   * @param {Object} filters - Filtros
   * @returns {string} - Logs em formato JSON
   */
  exportLogs(filters = {}) {
    const logs = this.getLogs(filters);
    return JSON.stringify(logs, null, 2);
  }

  /**
   * Limpa logs antigos
   * @param {number} days - Dias para manter
   */
  cleanup(days = 7) {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);

    this.logs = this.logs.filter(log => new Date(log.timestamp) >= cutoffDate);
  }

  /**
   * Define nível de log
   * @param {string} level - Nível (ERROR, WARN, INFO, DEBUG)
   */
  setLevel(level) {
    if (this.levels[level] !== undefined) {
      this.currentLevel = this.levels[level];
    }
  }

  /**
   * Obtém estatísticas dos logs
   * @returns {Object} - Estatísticas
   */
  getStats() {
    const stats = {
      total: this.logs.length,
      byLevel: {},
      byContext: {},
      recentErrors: 0
    };

    const oneHourAgo = new Date();
    oneHourAgo.setHours(oneHourAgo.getHours() - 1);

    this.logs.forEach(log => {
      // Contar por nível
      stats.byLevel[log.level] = (stats.byLevel[log.level] || 0) + 1;

      // Contar por contexto
      stats.byContext[log.context] = (stats.byContext[log.context] || 0) + 1;

      // Contar erros recentes
      if (log.level === 'ERROR' && new Date(log.timestamp) >= oneHourAgo) {
        stats.recentErrors++;
      }
    });

    return stats;
  }
}

// Instância global do logger
const logger = new Logger();

// Configurar nível baseado no ambiente
if (import.meta.env.DEV) {
  logger.setLevel('DEBUG');
} else {
  logger.setLevel('INFO');
}

// Hook para React
export const useLogger = (context = '') => {
  return {
    error: (message, data) => logger.error(message, data, context),
    warn: (message, data) => logger.warn(message, data, context),
    info: (message, data) => logger.info(message, data, context),
    debug: (message, data) => logger.debug(message, data, context),
    api: (method, endpoint, requestData, responseData, statusCode, duration) => 
      logger.api(method, endpoint, requestData, responseData, statusCode, duration),
    auth: (action, email, success, data) => logger.auth(action, email, success, data),
    fila: (action, barbeariaId, clienteData, data) => logger.fila(action, barbeariaId, clienteData, data),
    performance: (operation, duration, data) => logger.performance(operation, duration, data),
    userError: (action, error, contextData) => logger.userError(action, error, contextData)
  };
};

// Função para limpeza automática
export const startLoggerCleanup = (interval = 24 * 60 * 60 * 1000) => {
  setInterval(() => {
    logger.cleanup();
  }, interval);
};

// Iniciar limpeza automática
if (typeof window !== 'undefined') {
  startLoggerCleanup();
}

export default logger; 