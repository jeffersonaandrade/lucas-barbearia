import { createContext, useContext, useReducer, useEffect, useRef } from 'react';
import { authService } from '@/services/api.js';

// Actions
const AUTH_ACTIONS = {
  SET_USER: 'SET_USER',
  SET_LOADING: 'SET_LOADING',
  SET_API_STATUS: 'SET_API_STATUS',
  CLEAR_USER: 'CLEAR_USER',
  SET_ERROR: 'SET_ERROR'
};

// Initial state
const initialState = {
  user: null,
  loading: true,
  apiStatus: 'checking', // 'checking', 'available', 'unavailable'
  error: null
};

// Reducer
const authReducer = (state, action) => {
  switch (action.type) {
    case AUTH_ACTIONS.SET_USER:
      return { ...state, user: action.payload, loading: false, error: null };
    
    case AUTH_ACTIONS.SET_LOADING:
      return { ...state, loading: action.payload };
    
    case AUTH_ACTIONS.SET_API_STATUS:
      return { ...state, apiStatus: action.payload };
    
    case AUTH_ACTIONS.CLEAR_USER:
      return { ...state, user: null, loading: false, error: null };
    
    case AUTH_ACTIONS.SET_ERROR:
      return { ...state, error: action.payload, loading: false };
    
    default:
      return state;
  }
};

// Context
const AuthContext = createContext();

// Provider
export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);
  
  // Refs para controlar verificações
  const verificationInProgressRef = useRef(false);
  const lastVerificationRef = useRef(0);
  const verificationTimeout = 5000; // 5 segundos entre verificações

  // Verificar usuário atual
  const verificarUsuarioAtual = async () => {
    // Evitar verificações simultâneas
    if (verificationInProgressRef.current) {
      console.log('🔄 AuthContext - Verificação já em andamento, aguardando...');
      return;
    }

    const now = Date.now();
    
    // Evitar verificações muito frequentes
    if (lastVerificationRef.current > 0 && (now - lastVerificationRef.current) < verificationTimeout) {
      console.log('🔄 AuthContext - Verificação muito recente, aguardando...');
      return;
    }

    try {
      verificationInProgressRef.current = true;
      lastVerificationRef.current = now;
      
      dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: true });
      dispatch({ type: AUTH_ACTIONS.SET_API_STATUS, payload: 'checking' });
      
      // Verificar se há um token válido na sessão
      const token = sessionStorage.getItem('adminToken');
      const userRole = sessionStorage.getItem('userRole');
      const userEmail = sessionStorage.getItem('userEmail');

      console.log('🔄 AuthContext - Verificando sessão:', { token: !!token, userRole, userEmail });

      if (token && userRole && userEmail) {
        // Tentar validar o token com o servidor
        try {
          console.log('🔄 AuthContext - Validando token no servidor...');
          const response = await authService.getCurrentUser();
          console.log('✅ AuthContext - Usuário validado no servidor:', response);
          
          // Extrair apenas os dados do usuário
          const userData = response.data || response;
          dispatch({ type: AUTH_ACTIONS.SET_USER, payload: userData });
          dispatch({ type: AUTH_ACTIONS.SET_API_STATUS, payload: 'available' });
        } catch (error) {
          console.log('❌ AuthContext - Token inválido, limpando sessão...');
          // Token inválido, limpar dados
          logout();
          dispatch({ type: AUTH_ACTIONS.SET_API_STATUS, payload: 'available' });
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
      
      console.log('🔄 AuthContext - Realizando login...');
      const response = await authService.login(email, password);
      
      console.log('✅ AuthContext - Login realizado:', response);
      dispatch({ type: AUTH_ACTIONS.SET_USER, payload: response.user });
      dispatch({ type: AUTH_ACTIONS.SET_API_STATUS, payload: 'available' });
      
      return response;
    } catch (error) {
      console.error('❌ AuthContext - Erro no login:', error);
      dispatch({ type: AUTH_ACTIONS.SET_API_STATUS, payload: 'unavailable' });
      throw error;
    } finally {
      dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: false });
    }
  };

  // Logout
  const logout = async () => {
    try {
      console.log('🔄 AuthContext - Realizando logout...');
      await authService.logout();
    } catch (error) {
      console.warn('⚠️ AuthContext - Erro no logout do servidor:', error);
    } finally {
      // Limpar sessão
      sessionStorage.removeItem('adminToken');
      sessionStorage.removeItem('userRole');
      sessionStorage.removeItem('userEmail');
      dispatch({ type: AUTH_ACTIONS.CLEAR_USER });
      
      // Resetar refs
      verificationInProgressRef.current = false;
      lastVerificationRef.current = 0;
      
      // Redirecionar para a página principal
      window.location.href = '/';
    }
  };

  // Refresh user
  const refreshUser = async () => {
    try {
      console.log('🔄 AuthContext - Atualizando dados do usuário...');
      const response = await authService.getCurrentUser();
      const userData = response.data || response;
      dispatch({ type: AUTH_ACTIONS.SET_USER, payload: userData });
      return userData;
    } catch (error) {
      console.error('❌ AuthContext - Erro ao atualizar dados do usuário:', error);
      logout();
      throw error;
    }
  };

  // Verificar status da API
  const verificarStatusAPI = async () => {
    try {
      const response = await authService.getCurrentUser();
      dispatch({ type: AUTH_ACTIONS.SET_API_STATUS, payload: 'available' });
      return response;
    } catch (error) {
      dispatch({ type: AUTH_ACTIONS.SET_API_STATUS, payload: 'unavailable' });
      throw error;
    }
  };

  // Verificar autenticação
  const isAuthenticated = () => {
    const authenticated = !!state.user;
    console.log('🔍 AuthContext - isAuthenticated:', authenticated);
    return authenticated;
  };

  // Verificar role
  const hasRole = (role) => {
    return state.user?.role === role;
  };

  // Verificar múltiplos roles
  const hasAnyRole = (roles) => {
    return roles.includes(state.user?.role);
  };

  // Carregar dados iniciais
  useEffect(() => {
    verificarUsuarioAtual();
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