import { useState, useEffect } from 'react';

export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Verificar se há um token válido no localStorage
    const token = localStorage.getItem('adminToken');
    const userRole = localStorage.getItem('userRole');
    const userEmail = localStorage.getItem('userEmail');

    console.log('useAuth - Verificando localStorage:', { token, userRole, userEmail });

    if (token && userRole && userEmail) {
      const userData = {
        token,
        role: userRole,
        email: userEmail
      };
      console.log('useAuth - Usuário encontrado:', userData);
      setUser(userData);
    } else {
      console.log('useAuth - Nenhum usuário encontrado no localStorage');
    }
    
    setLoading(false);
  }, []);

  const login = (userData) => {
    // Salvar no localStorage
    localStorage.setItem('adminToken', userData.token);
    localStorage.setItem('userRole', userData.role);
    localStorage.setItem('userEmail', userData.email);
    
    console.log('useAuth - Login realizado:', userData);
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userEmail');
    setUser(null);
  };

  const isAuthenticated = () => {
    console.log('useAuth - isAuthenticated chamado, user:', user);
    return !!user;
  };

  const hasRole = (role) => {
    return user?.role === role;
  };

  const hasAnyRole = (roles) => {
    return roles.includes(user?.role);
  };

  return {
    user,
    loading,
    login,
    logout,
    isAuthenticated,
    hasRole,
    hasAnyRole
  };
}; 