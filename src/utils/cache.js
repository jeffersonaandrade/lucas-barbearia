// Sistema de cache para dados estáticos
// Melhora a performance reduzindo chamadas desnecessárias à API

class CacheManager {
  constructor() {
    this.cache = new Map();
    this.defaultTTL = 5 * 60 * 1000; // 5 minutos
    this.maxSize = 100; // Máximo de itens no cache
  }

  /**
   * Adiciona um item ao cache
   * @param {string} key - Chave do cache
   * @param {any} data - Dados a serem armazenados
   * @param {number} ttl - Tempo de vida em ms (opcional)
   */
  set(key, data, ttl = this.defaultTTL) {
    // Limpar cache se estiver cheio
    if (this.cache.size >= this.maxSize) {
      this.cleanup();
    }

    const item = {
      data,
      timestamp: Date.now(),
      ttl
    };

    this.cache.set(key, item);
    
    if (import.meta.env.DEV) {
      console.log(`💾 Cache set: ${key} (TTL: ${ttl}ms)`);
    }
  }

  /**
   * Obtém um item do cache
   * @param {string} key - Chave do cache
   * @returns {any|null} - Dados ou null se não encontrado/expirado
   */
  get(key) {
    const item = this.cache.get(key);
    
    if (!item) {
      return null;
    }

    // Verificar se o item expirou
    const now = Date.now();
    const isExpired = (now - item.timestamp) > item.ttl;
    
    if (isExpired) {
      this.cache.delete(key);
      
      if (import.meta.env.DEV) {
        console.log(`⏰ Cache expired: ${key}`);
      }
      
      return null;
    }

    if (import.meta.env.DEV) {
      console.log(`📖 Cache hit: ${key}`);
    }
    
    return item.data;
  }

  /**
   * Verifica se um item existe no cache e não expirou
   * @param {string} key - Chave do cache
   * @returns {boolean} - True se existe e não expirou
   */
  has(key) {
    const item = this.cache.get(key);
    
    if (!item) {
      return false;
    }

    const now = Date.now();
    const isExpired = (now - item.timestamp) > item.ttl;
    
    if (isExpired) {
      this.cache.delete(key);
      return false;
    }

    return true;
  }

  /**
   * Remove um item específico do cache
   * @param {string} key - Chave do cache
   */
  delete(key) {
    const deleted = this.cache.delete(key);
    
    if (deleted && import.meta.env.DEV) {
      console.log(`🗑️ Cache deleted: ${key}`);
    }
  }

  /**
   * Limpa todos os itens expirados do cache
   */
  cleanup() {
    const now = Date.now();
    let deletedCount = 0;

    for (const [key, item] of this.cache.entries()) {
      const isExpired = (now - item.timestamp) > item.ttl;
      
      if (isExpired) {
        this.cache.delete(key);
        deletedCount++;
      }
    }

    if (deletedCount > 0 && import.meta.env.DEV) {
      console.log(`🧹 Cache cleanup: ${deletedCount} items removed`);
    }
  }

  /**
   * Limpa todo o cache
   */
  clear() {
    const size = this.cache.size;
    this.cache.clear();
    
    if (import.meta.env.DEV) {
      console.log(`🧹 Cache cleared: ${size} items removed`);
    }
  }

  /**
   * Obtém estatísticas do cache
   * @returns {Object} - Estatísticas do cache
   */
  getStats() {
    const now = Date.now();
    let validItems = 0;
    let expiredItems = 0;

    for (const item of this.cache.values()) {
      const isExpired = (now - item.timestamp) > item.ttl;
      
      if (isExpired) {
        expiredItems++;
      } else {
        validItems++;
      }
    }

    return {
      total: this.cache.size,
      valid: validItems,
      expired: expiredItems,
      maxSize: this.maxSize,
      usage: (this.cache.size / this.maxSize) * 100
    };
  }

  /**
   * Gera uma chave de cache baseada em parâmetros
   * @param {string} base - Base da chave
   * @param {Object} params - Parâmetros para a chave
   * @returns {string} - Chave gerada
   */
  generateKey(base, params = {}) {
    const sortedParams = Object.keys(params)
      .sort()
      .map(key => `${key}:${params[key]}`)
      .join('|');
    
    return sortedParams ? `${base}:${sortedParams}` : base;
  }
}

// Instância global do cache
const cacheManager = new CacheManager();

// Cache específico para barbearias
export const barbeariasCache = {
  /**
   * Obtém barbearias do cache ou da API
   * @param {Function} fetchFunction - Função para buscar dados da API
   * @param {Object} params - Parâmetros para a busca
   * @returns {Promise<any>} - Dados das barbearias
   */
  async getBarbearias(fetchFunction, params = {}) {
    const cacheKey = cacheManager.generateKey('barbearias', params);
    
    // Tentar obter do cache primeiro
    const cached = cacheManager.get(cacheKey);
    if (cached) {
      return cached;
    }

    // Se não está no cache, buscar da API
    try {
      const data = await fetchFunction(params);
      
      // Armazenar no cache por 5 minutos
      cacheManager.set(cacheKey, data, 5 * 60 * 1000);
      
      return data;
    } catch (error) {
      console.error('Erro ao buscar barbearias:', error);
      throw error;
    }
  },

  /**
   * Obtém uma barbearia específica do cache ou da API
   * @param {Function} fetchFunction - Função para buscar dados da API
   * @param {string} id - ID da barbearia
   * @returns {Promise<any>} - Dados da barbearia
   */
  async getBarbearia(fetchFunction, id) {
    const cacheKey = cacheManager.generateKey('barbearia', { id });
    
    // Tentar obter do cache primeiro
    const cached = cacheManager.get(cacheKey);
    if (cached) {
      return cached;
    }

    // Se não está no cache, buscar da API
    try {
      const data = await fetchFunction(id);
      
      // Armazenar no cache por 10 minutos (dados mais estáticos)
      cacheManager.set(cacheKey, data, 10 * 60 * 1000);
      
      return data;
    } catch (error) {
      console.error('Erro ao buscar barbearia:', error);
      throw error;
    }
  },

  /**
   * Invalida cache de barbearias
   * @param {string} id - ID da barbearia (opcional)
   */
  invalidate(id = null) {
    if (id) {
      // Invalidar barbearia específica
      const cacheKey = cacheManager.generateKey('barbearia', { id });
      cacheManager.delete(cacheKey);
    } else {
      // Invalidar todas as barbearias
      for (const key of cacheManager.cache.keys()) {
        if (key.startsWith('barbearias') || key.startsWith('barbearia:')) {
          cacheManager.delete(key);
        }
      }
    }
  }
};

// Cache específico para barbeiros
export const barbeirosCache = {
  /**
   * Obtém barbeiros do cache ou da API
   * @param {Function} fetchFunction - Função para buscar dados da API
   * @param {Object} params - Parâmetros para a busca
   * @returns {Promise<any>} - Dados dos barbeiros
   */
  async getBarbeiros(fetchFunction, params = {}) {
    const cacheKey = cacheManager.generateKey('barbeiros', params);
    
    // Tentar obter do cache primeiro
    const cached = cacheManager.get(cacheKey);
    if (cached) {
      return cached;
    }

    // Se não está no cache, buscar da API
    try {
      const data = await fetchFunction(params);
      
      // Armazenar no cache por 3 minutos (dados podem mudar mais frequentemente)
      cacheManager.set(cacheKey, data, 3 * 60 * 1000);
      
      return data;
    } catch (error) {
      console.error('Erro ao buscar barbeiros:', error);
      throw error;
    }
  },

  /**
   * Invalida cache de barbeiros
   * @param {string} barbeariaId - ID da barbearia (opcional)
   */
  invalidate(barbeariaId = null) {
    if (barbeariaId) {
      // Invalidar barbeiros de uma barbearia específica
      for (const key of cacheManager.cache.keys()) {
        if (key.startsWith('barbeiros') && key.includes(`barbearia_id:${barbeariaId}`)) {
          cacheManager.delete(key);
        }
      }
    } else {
      // Invalidar todos os barbeiros
      for (const key of cacheManager.cache.keys()) {
        if (key.startsWith('barbeiros')) {
          cacheManager.delete(key);
        }
      }
    }
  }
};

// Cache específico para fila
export const filaCache = {
  /**
   * Obtém dados da fila do cache ou da API
   * @param {Function} fetchFunction - Função para buscar dados da API
   * @param {string} barbeariaId - ID da barbearia
   * @returns {Promise<any>} - Dados da fila
   */
  async getFila(fetchFunction, barbeariaId) {
    const cacheKey = cacheManager.generateKey('fila', { barbeariaId });
    
    // Para fila, usar TTL menor (30 segundos) pois muda frequentemente
    const cached = cacheManager.get(cacheKey);
    if (cached) {
      return cached;
    }

    try {
      const data = await fetchFunction(barbeariaId);
      
      // Armazenar no cache por 30 segundos
      cacheManager.set(cacheKey, data, 30 * 1000);
      
      return data;
    } catch (error) {
      console.error('Erro ao buscar fila:', error);
      throw error;
    }
  },

  /**
   * Invalida cache da fila
   * @param {string} barbeariaId - ID da barbearia
   */
  invalidate(barbeariaId) {
    const cacheKey = cacheManager.generateKey('fila', { barbeariaId });
    cacheManager.delete(cacheKey);
  }
};

// Middleware de cache para componentes React
export const useCache = () => {
  return {
    // Métodos gerais
    get: (key) => cacheManager.get(key),
    set: (key, data, ttl) => cacheManager.set(key, data, ttl),
    has: (key) => cacheManager.has(key),
    delete: (key) => cacheManager.delete(key),
    clear: () => cacheManager.clear(),
    getStats: () => cacheManager.getStats(),
    
    // Caches específicos
    barbearias: barbeariasCache,
    barbeiros: barbeirosCache,
    fila: filaCache
  };
};

// Função para limpar cache periodicamente
export const startCacheCleanup = (interval = 60000) => {
  setInterval(() => {
    cacheManager.cleanup();
  }, interval);
};

// Iniciar limpeza automática do cache
if (typeof window !== 'undefined') {
  startCacheCleanup();
}

export default cacheManager; 