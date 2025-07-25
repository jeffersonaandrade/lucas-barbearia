import { useState, useEffect } from 'react';
import { authService } from '@/services/api.js';

export const useAuthBackend = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [apiStatus, setApiStatus] = useState('checking'); // 'checking', 'available', 'unavailable'

  useEffect(() => {
    verificarUsuarioAtual();
  }, []);

  const verificarUsuarioAtual = async () => {
    try {
      setLoading(true);
      setApiStatus('checking');
      
      // Verificar se há um token válido na sessão
      const token = sessionStorage.getItem('adminToken');
      const userRole = sessionStorage.getItem('userRole');
      const userEmail = sessionStorage.getItem('userEmail');

      console.log('useAuthBackend - Verificando sessão:', { token, userRole, userEmail });

      if (token && userRole && userEmail) {
        // Tentar validar o token com o servidor
        try {
          const response = await authService.getCurrentUser();
          console.log('useAuthBackend - Usuário validado no servidor:', response);
          
          // Extrair apenas os dados do usuário
          const userData = response.data || response;
          setUser(userData);
          setApiStatus('available');
        } catch (error) {
          console.log('useAuthBackend - Token inválido, limpando sessão...');
          // Token inválido, limpar dados
          logout();
          setApiStatus('available'); // API está funcionando, só o token que é inválido
        }
      } else {
        console.log('useAuthBackend - Nenhum usuário encontrado na sessão');
        setApiStatus('available');
      }
    } catch (error) {
      console.error('useAuthBackend - Erro ao verificar usuário:', error);
      setApiStatus('unavailable');
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      setLoading(true);
      setApiStatus('checking');
      
      const response = await authService.login(email, password);
      
      console.log('useAuthBackend - Login realizado:', response);
      setUser(response.user);
      setApiStatus('available');
      
      return response;
    } catch (error) {
      console.error('useAuthBackend - Erro no login:', error);
      setApiStatus('unavailable');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
    } catch (error) {
      console.warn('useAuthBackend - Erro no logout do servidor:', error);
    } finally {
      // Limpar sessão
      sessionStorage.removeItem('adminToken');
      sessionStorage.removeItem('userRole');
      sessionStorage.removeItem('userEmail');
      setUser(null);
      
      // Redirecionar para a página principal
      window.location.href = '/';
    }
  };

  const isAuthenticated = () => {
    console.log('useAuthBackend - isAuthenticated chamado, user:', user);
    const authenticated = !!user;
    console.log('useAuthBackend - isAuthenticated resultado:', authenticated);
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
      const response = await authService.getCurrentUser();
      const userData = response.data || response;
      setUser(userData);
      return userData;
    } catch (error) {
      console.error('useAuthBackend - Erro ao atualizar dados do usuário:', error);
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