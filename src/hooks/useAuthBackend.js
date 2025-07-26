import { useState, useEffect, useRef } from 'react';
import { authService } from '@/services/api.js';

export const useAuthBackend = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [apiStatus, setApiStatus] = useState('checking'); // 'checking', 'available', 'unavailable'
  
  // Refs para controlar verificações
  const verificationInProgressRef = useRef(false);
  const lastVerificationRef = useRef(0);
  const verificationTimeout = 5000; // 5 segundos entre verificações

  useEffect(() => {
    verificarUsuarioAtual();
  }, []);

  const verificarUsuarioAtual = async () => {
    // Evitar verificações simultâneas
    if (verificationInProgressRef.current) {
      console.log('🔄 useAuthBackend - Verificação já em andamento, aguardando...');
      return;
    }

    const now = Date.now();
    
    // Evitar verificações muito frequentes
    if (lastVerificationRef.current > 0 && (now - lastVerificationRef.current) < verificationTimeout) {
      console.log('🔄 useAuthBackend - Verificação muito recente, aguardando...');
      return;
    }

    try {
      verificationInProgressRef.current = true;
      lastVerificationRef.current = now;
      
      setLoading(true);
      setApiStatus('checking');
      
      // Verificar se há um token válido na sessão
      const token = sessionStorage.getItem('adminToken');
      const userRole = sessionStorage.getItem('userRole');
      const userEmail = sessionStorage.getItem('userEmail');

      console.log('🔄 useAuthBackend - Verificando sessão:', { token: !!token, userRole, userEmail });

      if (token && userRole && userEmail) {
        // Tentar validar o token com o servidor
        try {
          console.log('🔄 useAuthBackend - Validando token no servidor...');
          const response = await authService.getCurrentUser();
          console.log('✅ useAuthBackend - Usuário validado no servidor:', response);
          
          // Extrair apenas os dados do usuário
          const userData = response.data || response;
          setUser(userData);
          setApiStatus('available');
        } catch (error) {
          console.log('❌ useAuthBackend - Token inválido, limpando sessão...');
          // Token inválido, limpar dados
          logout();
          setApiStatus('available'); // API está funcionando, só o token que é inválido
        }
      } else {
        console.log('ℹ️ useAuthBackend - Nenhum usuário encontrado na sessão');
        setApiStatus('available');
      }
    } catch (error) {
      console.error('❌ useAuthBackend - Erro ao verificar usuário:', error);
      setApiStatus('unavailable');
    } finally {
      setLoading(false);
      verificationInProgressRef.current = false;
    }
  };

  const login = async (email, password) => {
    try {
      setLoading(true);
      setApiStatus('checking');
      
      console.log('🔄 useAuthBackend - Realizando login...');
      const response = await authService.login(email, password);
      
      console.log('✅ useAuthBackend - Login realizado:', response);
      setUser(response.user);
      setApiStatus('available');
      
      return response;
    } catch (error) {
      console.error('❌ useAuthBackend - Erro no login:', error);
      setApiStatus('unavailable');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      console.log('🔄 useAuthBackend - Realizando logout...');
      await authService.logout();
    } catch (error) {
      console.warn('⚠️ useAuthBackend - Erro no logout do servidor:', error);
    } finally {
      // Limpar sessão
      sessionStorage.removeItem('adminToken');
      sessionStorage.removeItem('userRole');
      sessionStorage.removeItem('userEmail');
      setUser(null);
      
      // Resetar refs
      verificationInProgressRef.current = false;
      lastVerificationRef.current = 0;
      
      // Redirecionar para a página principal
      window.location.href = '/';
    }
  };

  const isAuthenticated = () => {
    const authenticated = !!user;
    console.log('🔍 useAuthBackend - isAuthenticated:', authenticated);
    return authenticated;
  };

  const hasRole = (role) => {
    return user?.role === role;
  };

  const hasAnyRole = (roles) => {
    return roles.includes(user?.role);
  };

  const refreshUser = async () => {
    try {
      console.log('🔄 useAuthBackend - Atualizando dados do usuário...');
      const response = await authService.getCurrentUser();
      const userData = response.data || response;
      setUser(userData);
      return userData;
    } catch (error) {
      console.error('❌ useAuthBackend - Erro ao atualizar dados do usuário:', error);
      logout();
      throw error;
    }
  };

  const verificarStatusAPI = async () => {
    try {
      await authService.getCurrentUser();
      setApiStatus('available');
      return true;
    } catch (error) {
      setApiStatus('unavailable');
      return false;
    }
  };

  return {
    user,
    loading,
    apiStatus,
    login,
    logout,
    isAuthenticated,
    hasRole,
    hasAnyRole,
    refreshUser,
    verificarUsuarioAtual,
    verificarStatusAPI
  };
}; 