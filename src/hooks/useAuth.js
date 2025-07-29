import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { authService } from '@/services/api.js';

export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const isLoginPage = location.pathname === '/admin/login';

  const checkAuth = async () => {
    try {
      const data = await authService.getCurrentUser();
      
      if (data.success && data.data) {
        setUser(data.data);
      } else {
        setUser(null);
      }
    } catch (error) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      const data = await authService.login(email, password);
      
      if (data.success) {
        setUser(data.user);
        return { success: true };
      } else {
        return { success: false, error: data.error };
      }
    } catch (error) {
      return { success: false, error: 'Erro no login' };
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
      setUser(null);
    } catch (error) {
      console.error('Erro no logout:', error);
    }
  };

  useEffect(() => {
    // Não verificar autenticação se estivermos na página de login
    if (isLoginPage) {
      setLoading(false);
      return;
    }
    
    checkAuth();
  }, [isLoginPage]);

  return { user, loading, login, logout, checkAuth };
}; 