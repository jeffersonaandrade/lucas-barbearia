// Middleware para verificar acesso à barbearia
// Garante que gerentes e barbeiros só acessem suas próprias barbearias

import { barbeariasService, usuariosService } from '@/services/api.js';

/**
 * Middleware para verificar se o usuário tem acesso à barbearia específica
 * @param {Object} request - Objeto da requisição
 * @param {Object} reply - Objeto da resposta
 * @param {Function} next - Função para continuar
 */
export const checkBarbeariaAccess = async (request, reply) => {
  try {
    const { barbeariaId } = request.params;
    const user = request.user;

    // Admin tem acesso a todas as barbearias
    if (user.role === 'admin') {
      return next();
    }

    // Verificar se o usuário tem acesso à barbearia
    const hasAccess = await checkUserBarbeariaAccess(user.id, barbeariaId);
    
    if (!hasAccess) {
      return reply.status(403).send({
        success: false,
        message: 'Acesso negado a esta barbearia',
        error: 'FORBIDDEN_BARBEARIA_ACCESS'
      });
    }

    next();
  } catch (error) {
    console.error('Erro no middleware de acesso à barbearia:', error);
    return reply.status(500).send({
      success: false,
      message: 'Erro interno do servidor',
      error: 'INTERNAL_SERVER_ERROR'
    });
  }
};

/**
 * Verifica se um usuário tem acesso a uma barbearia específica
 * @param {string} userId - ID do usuário
 * @param {string} barbeariaId - ID da barbearia
 * @returns {boolean} - True se tem acesso, false caso contrário
 */
export const checkUserBarbeariaAccess = async (userId, barbeariaId) => {
  try {
    // Buscar dados do usuário para verificar suas barbearias
    const userResponse = await usuariosService.listarUsuarios({ 
      id: userId,
      role: ['gerente', 'barbeiro']
    });

    if (!userResponse.success || !userResponse.data || userResponse.data.length === 0) {
      return false;
    }

    const user = userResponse.data[0];

    // Verificar se o usuário tem acesso à barbearia específica
    if (user.barbearias && Array.isArray(user.barbearias)) {
      return user.barbearias.some(barbearia => 
        barbearia.barbearia_id === parseInt(barbeariaId) && barbearia.ativo === true
      );
    }

    return false;
  } catch (error) {
    console.error('Erro ao verificar acesso do usuário à barbearia:', error);
    return false;
  }
};

/**
 * Middleware para verificar se o usuário é dono da barbearia (gerente)
 * @param {Object} request - Objeto da requisição
 * @param {Object} reply - Objeto da resposta
 * @param {Function} next - Função para continuar
 */
export const checkBarbeariaOwnership = async (request, reply) => {
  try {
    const { barbeariaId } = request.params;
    const user = request.user;

    // Admin pode acessar qualquer barbearia
    if (user.role === 'admin') {
      return next();
    }

    // Apenas gerentes podem ser donos de barbearias
    if (user.role !== 'gerente') {
      return reply.status(403).send({
        success: false,
        message: 'Apenas gerentes podem gerenciar barbearias',
        error: 'FORBIDDEN_BARBEARIA_OWNERSHIP'
      });
    }

    // Verificar se o gerente é dono da barbearia
    const isOwner = await checkUserBarbeariaOwnership(user.id, barbeariaId);
    
    if (!isOwner) {
      return reply.status(403).send({
        success: false,
        message: 'Você não é o gerente desta barbearia',
        error: 'FORBIDDEN_BARBEARIA_OWNERSHIP'
      });
    }

    next();
  } catch (error) {
    console.error('Erro no middleware de propriedade da barbearia:', error);
    return reply.status(500).send({
      success: false,
      message: 'Erro interno do servidor',
      error: 'INTERNAL_SERVER_ERROR'
    });
  }
};

/**
 * Verifica se um usuário é dono de uma barbearia específica
 * @param {string} userId - ID do usuário
 * @param {string} barbeariaId - ID da barbearia
 * @returns {boolean} - True se é dono, false caso contrário
 */
export const checkUserBarbeariaOwnership = async (userId, barbeariaId) => {
  try {
    // Buscar dados do usuário para verificar se é gerente da barbearia
    const userResponse = await usuariosService.listarUsuarios({ 
      id: userId,
      role: 'gerente'
    });

    if (!userResponse.success || !userResponse.data || userResponse.data.length === 0) {
      return false;
    }

    const user = userResponse.data[0];

    // Verificar se o gerente é dono da barbearia específica
    if (user.barbearias && Array.isArray(user.barbearias)) {
      return user.barbearias.some(barbearia => 
        barbearia.barbearia_id === parseInt(barbeariaId) && 
        barbearia.ativo === true &&
        barbearia.role === 'gerente'
      );
    }

    return false;
  } catch (error) {
    console.error('Erro ao verificar propriedade da barbearia:', error);
    return false;
  }
};

/**
 * Middleware para verificar se o barbeiro trabalha na barbearia
 * @param {Object} request - Objeto da requisição
 * @param {Object} reply - Objeto da resposta
 * @param {Function} next - Função para continuar
 */
export const checkBarbeiroBarbeariaAccess = async (request, reply) => {
  try {
    const { barbeariaId } = request.params;
    const user = request.user;

    // Admin pode acessar qualquer barbearia
    if (user.role === 'admin') {
      return next();
    }

    // Apenas barbeiros e gerentes podem acessar
    if (!['barbeiro', 'gerente'].includes(user.role)) {
      return reply.status(403).send({
        success: false,
        message: 'Acesso negado. Apenas barbeiros e gerentes podem acessar.',
        error: 'FORBIDDEN_BARBEIRO_ACCESS'
      });
    }

    // Verificar se o barbeiro trabalha na barbearia
    const hasAccess = await checkUserBarbeariaAccess(user.id, barbeariaId);
    
    if (!hasAccess) {
      return reply.status(403).send({
        success: false,
        message: 'Você não trabalha nesta barbearia',
        error: 'FORBIDDEN_BARBEIRO_ACCESS'
      });
    }

    next();
  } catch (error) {
    console.error('Erro no middleware de acesso do barbeiro:', error);
    return reply.status(500).send({
      success: false,
      message: 'Erro interno do servidor',
      error: 'INTERNAL_SERVER_ERROR'
    });
  }
};

/**
 * Middleware para verificar permissões específicas por endpoint
 * @param {Object} endpointPermissions - Objeto com permissões por endpoint
 * @returns {Function} - Middleware function
 */
export const createPermissionMiddleware = (endpointPermissions) => {
  return async (request, reply, next) => {
    try {
      const user = request.user;
      const endpoint = request.routeOptions.url;
      
      // Verificar se o endpoint tem permissões definidas
      if (!endpointPermissions[endpoint]) {
        return next(); // Se não há restrições, permitir acesso
      }

      const allowedRoles = endpointPermissions[endpoint];
      
      // Verificar se o usuário tem uma das roles permitidas
      if (!allowedRoles.includes(user.role)) {
        return reply.status(403).send({
          success: false,
          message: 'Acesso negado. Permissões insuficientes.',
          error: 'FORBIDDEN_PERMISSION'
        });
      }

      next();
    } catch (error) {
      console.error('Erro no middleware de permissões:', error);
      return reply.status(500).send({
        success: false,
        message: 'Erro interno do servidor',
        error: 'INTERNAL_SERVER_ERROR'
      });
    }
  };
};

// Permissões por endpoint (exemplo)
export const ENDPOINT_PERMISSIONS = {
  '/api/users': ['admin'],
  '/api/barbearias': ['admin'],
  '/api/fila': ['admin', 'gerente', 'barbeiro'],
  '/api/avaliacoes': ['admin', 'gerente', 'barbeiro'],
  '/api/historico': ['admin', 'gerente', 'barbeiro']
};

export default {
  checkBarbeariaAccess,
  checkBarbeariaOwnership,
  checkBarbeiroBarbeariaAccess,
  checkUserBarbeariaAccess,
  checkUserBarbeariaOwnership,
  createPermissionMiddleware,
  ENDPOINT_PERMISSIONS
}; 