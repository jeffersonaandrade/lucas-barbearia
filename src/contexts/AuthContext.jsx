import { createContext, useContext, useReducer, useEffect, useRef } from 'react';
import { authService } from '@/services/api.js';
import { CookieManager } from '@/utils/cookieManager.js';

// Ações
const AUTH_ACTIONS = {
  SET_USER: 'SET_USER',
  CLEAR_USER: 'CLEAR_USER',
  SET_LOADING: 'SET_LOADING',
  SET_ERROR: 'SET_ERROR',
  SET_API_STATUS: 'SET_API_STATUS'
};

// Estado inicial
const initialState = {
  user: null,
  loading: true,
  error: null,
  apiStatus: 'checking' // 'checking', 'available', 'unavailable'
};

// Reducer
const authReducer = (state, action) => {
  switch (action.type) {
    case AUTH_ACTIONS.SET_USER:
      return {
        ...state,
        user: action.payload,
        loading: false,
        error: null
      };
    case AUTH_ACTIONS.CLEAR_USER:
      return {
        ...state,
        user: null,
        loading: false,
        error: null
      };
    case AUTH_ACTIONS.SET_LOADING:
      return {
        ...state,
        loading: action.payload
      };
    case AUTH_ACTIONS.SET_ERROR:
      return {
        ...state,
        error: action.payload,
        loading: false
      };
    case AUTH_ACTIONS.SET_API_STATUS:
      return {
        ...state,
        apiStatus: action.payload
      };
    default:
      return state;
  }
};

// Context
const AuthContext = createContext();

// Provider
export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);
  
  // Refs para evitar verificações simultâneas e muito frequentes
  const verificationInProgressRef = useRef(false);
  const lastVerificationRef = useRef(0);
  const verificationTimeout = 30000; // 30 segundos entre verificações
  const hasInitializedRef = useRef(false);

  // Verificar usuário atual (otimizado)
  const verificarUsuarioAtual = async (force = false) => {
    console.log('🔄 AuthContext - verificarUsuarioAtual: Iniciando...', { force });
    
    // Evitar verificações simultâneas
    if (verificationInProgressRef.current && !force) {
      console.log('🔄 AuthContext - Verificação já em andamento, aguardando...');
      return;
    }

    const now = Date.now();
    
    // Evitar verificações muito frequentes (a menos que seja forçada)
    if (!force && lastVerificationRef.current > 0 && (now - lastVerificationRef.current) < verificationTimeout) {
      console.log('🔄 AuthContext - Verificação muito recente, aguardando...');
      return;
    }

    try {
      verificationInProgressRef.current = true;
      lastVerificationRef.current = now;
      
      dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: true });
      dispatch({ type: AUTH_ACTIONS.SET_API_STATUS, payload: 'checking' });
      
      // Verificar se há um token válido no localStorage
      const token = CookieManager.getAdminToken();
      const userInfo = CookieManager.getUserInfo();

      console.log('🔄 AuthContext - Verificando localStorage:', { 
        token: !!token, 
        userInfo: !!userInfo 
      });

      // Se temos dados do usuário no localStorage, usar eles diretamente
      if (userInfo && !force) {
        try {
          const user = userInfo;
          console.log('✅ AuthContext - Usuário encontrado no localStorage:', user);
          dispatch({ type: AUTH_ACTIONS.SET_USER, payload: user });
          dispatch({ type: AUTH_ACTIONS.SET_API_STATUS, payload: 'available' });
          dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: false });
          return;
        } catch (error) {
          console.log('❌ AuthContext - Erro ao parsear dados do usuário:', error);
        }
      }

      if (token && userInfo) {
        // Tentar validar o token com o servidor (apenas se forçado ou primeira vez)
        try {
          console.log('🔄 AuthContext - Validando token no servidor...');
          const response = await authService.getCurrentUser();
          console.log('✅ AuthContext - Usuário validado no servidor:', response);
          
          // Processar a resposta real do backend
          if (response.data && response.data.user) {
            console.log('✅ AuthContext - Definindo usuário no contexto:', response.data.user);
            dispatch({ type: AUTH_ACTIONS.SET_USER, payload: response.data.user });
            dispatch({ type: AUTH_ACTIONS.SET_API_STATUS, payload: 'available' });
          } else {
            console.log('❌ AuthContext - Dados do usuário inválidos');
            // Não fazer logout automático, apenas limpar o estado
            dispatch({ type: AUTH_ACTIONS.CLEAR_USER });
          }
        } catch (error) {
          console.log('❌ AuthContext - Token inválido, limpando sessão...');
          // Não fazer logout automático, apenas limpar o estado
          dispatch({ type: AUTH_ACTIONS.CLEAR_USER });
        }
      } else {
        console.log('ℹ️ AuthContext - Nenhum usuário encontrado na sessão');
        dispatch({ type: AUTH_ACTIONS.SET_API_STATUS, payload: 'available' });
        dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: false });
      }
    } catch (error) {
      console.error('❌ AuthContext - Erro ao verificar usuário:', error);
      dispatch({ type: AUTH_ACTIONS.SET_API_STATUS, payload: 'unavailable' });
      dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: false });
    } finally {
      verificationInProgressRef.current = false;
    }
  };

  // Login
  const login = async (email, password) => {
    try {
      dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: true });
      dispatch({ type: AUTH_ACTIONS.SET_API_STATUS, payload: 'checking' });
      
      const response = await authService.login(email, password);
      
      // Verificar diferentes estruturas possíveis da resposta
      // O backend retorna: { token, user, expiresIn }
      const hasSuccess = response && (response.success || response.authenticated || response.token);
      const user = response?.data?.user || response?.user || response?.data;
      const token = response?.data?.token || response?.token;
      
      if (hasSuccess && user) {
        // Armazenar o token se existir
        if (token) {
          CookieManager.setAdminToken(token);
          CookieManager.setUserInfo(user);
        }
        
        dispatch({ type: AUTH_ACTIONS.SET_USER, payload: user });
        dispatch({ type: AUTH_ACTIONS.SET_API_STATUS, payload: 'available' });
        dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: false });
        return { success: true, user };
      } else {
        throw new Error('Resposta de login inválida');
      }
    } catch (error) {
      console.error('❌ AuthContext - Erro no login:', error);
      dispatch({ type: AUTH_ACTIONS.SET_ERROR, payload: error.message });
      dispatch({ type: AUTH_ACTIONS.SET_API_STATUS, payload: 'available' });
      dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: false });
      throw error;
    }
  };

  // Logout
  const logout = async () => {
    try {
      console.log('🔄 AuthContext - Realizando logout...');
      
      // Tentar fazer logout no servidor
      try {
        await authService.logout();
      } catch (error) {
        console.log('⚠️ AuthContext - Erro no logout do servidor, continuando...');
      }
      
      // Limpar dados locais
      CookieManager.clearAdminCookies();
      
      // Limpar estado
      dispatch({ type: AUTH_ACTIONS.CLEAR_USER });
      dispatch({ type: AUTH_ACTIONS.SET_API_STATUS, payload: 'available' });
      
      // Resetar refs
      verificationInProgressRef.current = false;
      lastVerificationRef.current = 0;
      
      // Não redirecionar automaticamente, deixar que o componente decida
      console.log('✅ AuthContext - Logout concluído, cookies limpos');
    } catch (error) {
      console.error('❌ AuthContext - Erro no logout:', error);
    }
  };

  // Refresh user (otimizado - só quando necessário)
  const refreshUser = async () => {
    try {
      console.log('🔄 AuthContext - Atualizando dados do usuário...');
      const response = await authService.getCurrentUser();
      if (response.data && response.data.user) {
        dispatch({ type: AUTH_ACTIONS.SET_USER, payload: response.data.user });
        return response.data.user;
      } else {
        throw new Error('Dados do usuário inválidos');
      }
    } catch (error) {
      console.error('❌ AuthContext - Erro ao atualizar dados do usuário:', error);
      // Não fazer logout automático, apenas limpar o estado
      dispatch({ type: AUTH_ACTIONS.CLEAR_USER });
      throw error;
    }
  };

  // Verificar status da API (otimizado)
  const verificarStatusAPI = async () => {
    try {
      // Só verificar se não temos dados do usuário ou se forçado
      if (!state.user) {
        const response = await authService.getCurrentUser();
        dispatch({ type: AUTH_ACTIONS.SET_API_STATUS, payload: 'available' });
        return response;
      } else {
        dispatch({ type: AUTH_ACTIONS.SET_API_STATUS, payload: 'available' });
        return { success: true };
      }
    } catch (error) {
      dispatch({ type: AUTH_ACTIONS.SET_API_STATUS, payload: 'unavailable' });
      throw error;
    }
  };

  // Verificar autenticação
  const isAuthenticated = () => {
    return !!state.user;
  };

  // Verificar role
  const hasRole = (role) => {
    return state.user?.role === role;
  };

  // Verificar múltiplos roles
  const hasAnyRole = (roles) => {
    return roles.includes(state.user?.role);
  };

  // Carregar dados iniciais (otimizado)
  useEffect(() => {
    if (!hasInitializedRef.current) {
      verificarUsuarioAtual();
      hasInitializedRef.current = true;
    }
  }, []);

  const value = {
    // State
    user: state.user,
    loading: state.loading,
    apiStatus: state.apiStatus,
    error: state.error,
    
    // Actions
    login,
    logout,
    refreshUser,
    verificarUsuarioAtual,
    verificarStatusAPI,
    isAuthenticated,
    hasRole,
    hasAnyRole
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
}; 