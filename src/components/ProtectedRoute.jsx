import { Navigate, useLocation } from 'react-router-dom';
import { useAuthBackend } from '@/hooks/useAuthBackend.js';
import { Loader2 } from 'lucide-react';

const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const { user, loading, isAuthenticated, hasAnyRole, apiStatus } = useAuthBackend();
  const location = useLocation();

  console.log('ProtectedRoute - Debug:', {
    user,
    loading,
    isAuthenticated: isAuthenticated(),
    hasAnyRole: hasAnyRole(allowedRoles),
    allowedRoles,
    pathname: location.pathname
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

  if (!isAuthenticated()) {
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