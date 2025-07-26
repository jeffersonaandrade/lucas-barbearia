import { utilsService } from '@/services/api.js';

// Sistema de Rate Limiting para endpoints públicos
// Protege contra abuso e ataques de força bruta

class RateLimiter {
  constructor() {
    this.requests = new Map();
    this.limits = {
      // Limites por tipo de endpoint
      public: {
        windowMs: 15 * 60 * 1000, // 15 minutos
        maxRequests: 100 // 100 requests por 15 minutos
      },
      auth: {
        windowMs: 15 * 60 * 1000, // 15 minutos
        maxRequests: 5 // 5 tentativas de login por 15 minutos
      },
      fila: {
        windowMs: 60 * 1000, // 1 minuto
        maxRequests: 10 // 10 requests por minuto
      },
      default: {
        windowMs: 60 * 1000, // 1 minuto
        maxRequests: 30 // 30 requests por minuto
      }
    };
  }

  /**
   * Verifica se uma requisição pode ser processada
   * @param {string} key - Chave única (IP, token, etc.)
   * @param {string} type - Tipo de limite (public, auth, fila, default)
   * @returns {Object} - { allowed: boolean, remaining: number, resetTime: number }
   */
  checkLimit(key, type = 'default') {
    const now = Date.now();
    const limit = this.limits[type] || this.limits.default;
    
    // Obter ou criar registro para esta chave
    if (!this.requests.has(key)) {
      this.requests.set(key, {});
    }
    
    const keyData = this.requests.get(key);
    
    // Obter ou criar registro para este tipo
    if (!keyData[type]) {
      keyData[type] = {
        count: 0,
        resetTime: now + limit.windowMs
      };
    }
    
    const typeData = keyData[type];
    
    // Verificar se a janela de tempo expirou
    if (now > typeData.resetTime) {
      typeData.count = 0;
      typeData.resetTime = now + limit.windowMs;
    }
    
    // Verificar se ainda há requisições disponíveis
    const remaining = Math.max(0, limit.maxRequests - typeData.count);
    const allowed = remaining > 0;
    
    // Incrementar contador se permitido
    if (allowed) {
      typeData.count++;
    }
    
    return {
      allowed,
      remaining,
      resetTime: typeData.resetTime,
      limit: limit.maxRequests
    };
  }

  /**
   * Verifica limite baseado no IP do cliente
   * @param {string} ip - IP do cliente
   * @param {string} type - Tipo de limite
   * @returns {Object} - Resultado da verificação
   */
  checkIPLimit(ip, type = 'default') {
    return this.checkLimit(`ip:${ip}`, type);
  }

  /**
   * Verifica limite baseado no token do usuário
   * @param {string} token - Token do usuário
   * @param {string} type - Tipo de limite
   * @returns {Object} - Resultado da verificação
   */
  checkTokenLimit(token, type = 'default') {
    return this.checkLimit(`token:${token}`, type);
  }

  /**
   * Verifica limite baseado no endpoint
   * @param {string} endpoint - Endpoint da requisição
   * @param {string} identifier - Identificador (IP, token, etc.)
   * @returns {Object} - Resultado da verificação
   */
  checkEndpointLimit(endpoint, identifier) {
    let type = 'default';
    
    // Determinar tipo baseado no endpoint
    if (endpoint.includes('/auth/')) {
      type = 'auth';
    } else if (endpoint.includes('/fila/')) {
      type = 'fila';
    } else if (endpoint.includes('/barbearias') || endpoint.includes('/barbeiros')) {
      type = 'public';
    }
    
    return this.checkLimit(`${type}:${identifier}`, type);
  }

  /**
   * Limpa registros expirados
   */
  cleanup() {
    const now = Date.now();
    
    for (const [key, keyData] of this.requests.entries()) {
      let hasValidData = false;
      
      for (const [type, typeData] of Object.entries(keyData)) {
        if (now <= typeData.resetTime) {
          hasValidData = true;
        } else {
          delete keyData[type];
        }
      }
      
      if (!hasValidData) {
        this.requests.delete(key);
      }
    }
  }

  /**
   * Obtém estatísticas do rate limiter
   * @returns {Object} - Estatísticas
   */
  getStats() {
    const stats = {
      totalKeys: this.requests.size,
      totalRequests: 0,
      byType: {}
    };
    
    for (const [key, keyData] of this.requests.entries()) {
      for (const [type, typeData] of Object.entries(keyData)) {
        if (!stats.byType[type]) {
          stats.byType[type] = {
            keys: 0,
            requests: 0
          };
        }
        
        stats.byType[type].keys++;
        stats.byType[type].requests += typeData.count;
        stats.totalRequests += typeData.count;
      }
    }
    
    return stats;
  }

  /**
   * Reseta todos os limites para uma chave específica
   * @param {string} key - Chave a ser resetada
   */
  resetKey(key) {
    this.requests.delete(key);
  }

  /**
   * Reseta todos os limites
   */
  resetAll() {
    this.requests.clear();
  }
}

// Instância global do rate limiter
const rateLimiter = new RateLimiter();

// Middleware para Express/Fastify
export const createRateLimitMiddleware = (type = 'default') => {
  return (request, reply, next) => {
    try {
      // Obter IP do cliente
      const ip = request.ip || request.connection.remoteAddress || 'unknown';
      const endpoint = request.url;
      
      // Verificar limite
      const result = rateLimiter.checkEndpointLimit(endpoint, ip);
      
      if (!result.allowed) {
        return reply.status(429).send({
          success: false,
          message: 'Muitas requisições. Tente novamente mais tarde.',
          error: 'RATE_LIMIT_EXCEEDED',
          retryAfter: Math.ceil((result.resetTime - Date.now()) / 1000)
        });
      }
      
      // Adicionar headers de rate limit
      reply.header('X-RateLimit-Limit', result.limit);
      reply.header('X-RateLimit-Remaining', result.remaining);
      reply.header('X-RateLimit-Reset', result.resetTime);
      
      next();
    } catch (error) {
      console.error('Erro no rate limiting:', error);
      // Em caso de erro, permitir a requisição
      next();
    }
  };
};

// Middleware específico para autenticação
export const createAuthRateLimitMiddleware = () => {
  return createRateLimitMiddleware('auth');
};

// Middleware específico para fila
export const createFilaRateLimitMiddleware = () => {
  return createRateLimitMiddleware('fila');
};

// Middleware específico para endpoints públicos
export const createPublicRateLimitMiddleware = () => {
  return createRateLimitMiddleware('public');
};

// Função para verificar limite no frontend
export const checkRateLimit = async (endpoint, identifier) => {
  try {
    // Endpoint de rate limit não implementado no backend
    console.warn('Endpoint GET /rate-limit/check não implementado no backend');
    return { allowed: true, remaining: 999 }; // Permitir em caso de erro
  } catch (error) {
    console.error('Erro ao verificar rate limit:', error);
    return { allowed: true, remaining: 999 }; // Permitir em caso de erro
  }
};

// Hook para React
export const useRateLimit = () => {
  return {
    checkLimit: (endpoint, identifier) => checkRateLimit(endpoint, identifier),
    getStats: () => rateLimiter.getStats()
  };
};

// Função para limpeza automática
export const startRateLimitCleanup = (interval = 5 * 60 * 1000) => {
  setInterval(() => {
    rateLimiter.cleanup();
  }, interval);
};

// Iniciar limpeza automática
if (typeof window !== 'undefined') {
  startRateLimitCleanup();
}

export default rateLimiter; 