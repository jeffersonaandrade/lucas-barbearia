import { useAuth } from '@/contexts/AuthContext.jsx';
import AdminLayout from '@/components/ui/admin-layout.jsx';
import { DashboardProvider } from '@/contexts/DashboardContext.jsx';
import BarbeiroDashboard from '@/components/dashboard/BarbeiroDashboard.jsx';
import AdminDashboardContent from '@/components/dashboard/AdminDashboard.jsx';
import GerenteDashboard from '@/components/dashboard/GerenteDashboard.jsx';


const AdminDashboardContainer = () => {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  // Renderizar dashboard baseado no role
  const renderDashboard = () => {
    switch (user?.role) {
      case 'barbeiro':
        return <BarbeiroDashboard onLogout={handleLogout} />;
      
      case 'admin':
        return <AdminDashboardContent onLogout={handleLogout} />;
      
      case 'gerente':
        return <GerenteDashboard onLogout={handleLogout} />;
      
      default:
        return (
          <div className="text-center py-8">
            <p className="text-gray-500">Role não reconhecido: {user?.role}</p>
          </div>
        );
    }
  };

  return (
    <DashboardProvider>
      <AdminLayout onLogout={handleLogout} showBackButton={false}>
        {renderDashboard()}
      </AdminLayout>
    </DashboardProvider>
  );
};

export default AdminDashboardContainer; 