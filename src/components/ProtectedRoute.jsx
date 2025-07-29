import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext.jsx';
import { Loader2 } from 'lucide-react';
import { CookieManager } from '@/utils/cookieManager.js';

const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const { user, loading, isAuthenticated, hasAnyRole, apiStatus } = useAuth();
  const location = useLocation();

  console.log('🔒 ProtectedRoute - Debug:', {
    user: user ? { id: user.id, email: user.email, role: user.role } : null,
    loading,
    isAuthenticated: isAuthenticated(),
    hasAnyRole: hasAnyRole(allowedRoles),
    allowedRoles,
    pathname: location.pathname,
    apiStatus,
    cookies: {
      authToken: !!CookieManager.getAdminToken(),
      userInfo: !!CookieManager.getUserInfo()
    }
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex items-center space-x-2">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>Carregando...</span>
        </div>
      </div>
    );
  }

  // Verificar autenticação
  const isUserAuthenticated = isAuthenticated();
  
  console.log('🔒 ProtectedRoute - Verificação de autenticação:', {
    isUserAuthenticated,
    user: user ? { id: user.id, email: user.email, role: user.role } : null,
    cookies: {
      token: !!CookieManager.getAdminToken(),
      userData: !!CookieManager.getUserInfo()
    }
  });
  
  if (!isUserAuthenticated) {
    console.log('🔒 ProtectedRoute - Usuário não autenticado, redirecionando para login');
    // Redirecionar para login, salvando a rota atual
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  if (allowedRoles.length > 0 && !hasAnyRole(allowedRoles)) {
    // Usuário não tem permissão para acessar esta rota
    return <Navigate to="/admin/unauthorized" replace />;
  }

  return children;
};

export default ProtectedRoute; 