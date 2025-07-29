import { useAuth } from '@/contexts/AuthContext.jsx';
import AdminLayout from '@/components/ui/admin-layout.jsx';
import AdminConfiguracoes from './AdminConfiguracoes.jsx';

const AdminConfiguracoesWrapper = () => {
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  return (
    <AdminLayout onLogout={handleLogout} showBackButton={true}>
      <AdminConfiguracoes />
    </AdminLayout>
  );
};

export default AdminConfiguracoesWrapper; 