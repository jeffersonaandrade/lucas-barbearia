import { createContext, useContext, useReducer, useEffect, useRef } from 'react';
import { authService } from '@/services/api.js';
import { CookieManager } from '@/utils/cookieManager.js';

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
    console.log('🔄 AuthContext - verificarUsuarioAtual: Iniciando...');
    
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
      
      // Verificar se há um token válido no localStorage
      const token = CookieManager.getAdminToken();
      const userInfo = CookieManager.getUserInfo();

      console.log('🔄 AuthContext - Verificando localStorage:', { 
        token: !!token, 
        userInfo: !!userInfo 
      });

      // Se temos dados do usuário no localStorage, usar eles diretamente
      if (userInfo) {
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
        // Tentar validar o token com o servidor
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
      
      console.log('🔄 AuthContext - Realizando login...');
      const response = await authService.login(email, password);
      
      console.log('✅ AuthContext - Login realizado com sucesso');
      
      // Verificar diferentes estruturas possíveis da resposta
      // O backend retorna: { token, user, expiresIn }
      const hasSuccess = response && (response.success || response.authenticated || response.token);
      const user = response?.data?.user || response?.user || response?.data;
      
      if (hasSuccess && user) {
        console.log('✅ AuthContext - Login bem-sucedido, usuário:', user.nome);
        
        // Verificar se há token na resposta para salvar como cookie
        const token = response.token || response.data?.token;
        if (token) {
          console.log('🍪 AuthContext - Token salvo como cookie');
          CookieManager.setAdminToken(token);
        } else {
          console.log('❌ AuthContext - Nenhum token encontrado na resposta do backend');
          throw new Error('Token não fornecido pelo backend');
        }
        
        // Salvar informações do usuário no localStorage
        if (user) {
          console.log('🍪 AuthContext - Informações do usuário salvas no localStorage');
          CookieManager.setUserInfo(user);
        }
        
        // Definir o usuário no contexto
        dispatch({ type: AUTH_ACTIONS.SET_USER, payload: user });
        dispatch({ type: AUTH_ACTIONS.SET_API_STATUS, payload: 'available' });
        console.log('👤 AuthContext - Usuário autenticado:', user.nome);
      } else {
        console.log('❌ AuthContext - Login falhou - Estrutura inválida:', {
          hasResponse: !!response,
          hasSuccess,
          hasUser: !!user,
          responseKeys: response ? Object.keys(response) : 'null',
          response
        });
        throw new Error('Resposta inválida do servidor');
      }
      
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
      // Limpar cookies
      CookieManager.clearAdminCookies();
      
      dispatch({ type: AUTH_ACTIONS.CLEAR_USER });
      
      // Resetar refs
      verificationInProgressRef.current = false;
      lastVerificationRef.current = 0;
      
      // Não redirecionar automaticamente, deixar que o componente decida
      console.log('✅ AuthContext - Logout concluído, cookies limpos');
    }
  };

  // Refresh user
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
    console.log('🔍 AuthContext - isAuthenticated:', authenticated, 'user:', state.user);
    return authenticated;
  };

  // Verificar role
  const hasRole = (role) => {
    const hasRoleResult = state.user?.role === role;
    console.log('🔍 AuthContext - hasRole:', role, hasRoleResult, 'user role:', state.user?.role);
    return hasRoleResult;
  };

  // Verificar múltiplos roles
  const hasAnyRole = (roles) => {
    const hasAnyRoleResult = roles.includes(state.user?.role);
    console.log('🔍 AuthContext - hasAnyRole:', roles, hasAnyRoleResult, 'user role:', state.user?.role);
    return hasAnyRoleResult;
  };

  // Carregar dados iniciais
  useEffect(() => {
    console.log('🔄 AuthContext - useEffect: Iniciando verificação inicial...');
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