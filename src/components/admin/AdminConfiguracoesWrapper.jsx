import { useAuth } from '@/contexts/AuthContext.jsx';
import { useNavigation } from '@/hooks/useNavigation';
import AdminLayout from '@/components/ui/admin-layout.jsx';
import AdminConfiguracoes from './AdminConfiguracoes.jsx';

const AdminConfiguracoesWrapper = () => {
  const { logout } = useAuth();
  const { goToAdminDashboard } = useNavigation();

  const handleLogout = () => {
    logout();
  };

  const handleBack = () => {
    goToAdminDashboard();
  };

  return (
    <AdminLayout onLogout={handleLogout} showBackButton={true} onBack={handleBack}>
      <AdminConfiguracoes />
    </AdminLayout>
  );
};

export default AdminConfiguracoesWrapper; 