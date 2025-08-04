import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useSharedData } from '@/hooks/useSharedData.js';
import { useDashboard } from '@/contexts/DashboardContext.jsx';
import DashboardHeader from './DashboardHeader.jsx';
import DashboardCard from '@/components/ui/dashboard-card.jsx';
import StatsManager from '@/components/ui/stats-manager.jsx';
import { 
  Users, 
  Building2, 
  Settings, 
  UserPlus,
  BarChart3,
  MessageCircle
} from 'lucide-react';

const AdminDashboard = ({ onLogout }) => {
  const navigate = useNavigate();
  const { barbearias, loading: dashboardLoading } = useDashboard();
  
  // Sistema de dados compartilhados
  const { useSharedDashboardStats } = useSharedData();
  const { stats, loading: statsLoading } = useSharedDashboardStats('admin');

  // Carregar estatísticas quando as barbearias estiverem disponíveis
  useEffect(() => {
    if (barbearias && barbearias.length > 0) {
      console.log('📊 AdminDashboard - Barbearias disponíveis no contexto:', barbearias.length);
    }
  }, [barbearias]);

  const handleNavigation = (path) => {
    console.log('Navegando para', path);
    navigate(path);
  };

  // Verificar se o dashboard está carregando
  if (dashboardLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <DashboardHeader
        title="Bem-vindo, Administrador!"
        subtitle="Gerencie suas barbearias e monitore as filas em tempo real."
        onLogout={onLogout}
        showLogout={false}
      />

      {/* Stats Cards */}
      <StatsManager 
        userRole="admin"
        stats={stats}
        loading={statsLoading}
      />

      {/* Action Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <DashboardCard
          title="Gerenciar Filas"
          description="Visualizar e gerenciar filas de todas as barbearias"
          icon={Users}
          buttonText="Acessar"
          onButtonClick={() => handleNavigation('/admin/filas')}
        />

        <DashboardCard
          title="Adicionar à Fila"
          description="Adicionar clientes manualmente à fila"
          icon={UserPlus}
          buttonText="Acessar"
          onButtonClick={() => handleNavigation('/admin/adicionar-fila')}
        />

        <DashboardCard
          title="Gerenciar Usuários"
          description="Criar e gerenciar usuários do sistema"
          icon={Users}
          buttonText="Acessar"
          onButtonClick={() => handleNavigation('/admin/usuarios')}
        />

        <DashboardCard
          title="Gerenciar Barbearias"
          description="Configurar barbearias e unidades"
          icon={Building2}
          buttonText="Acessar"
          onButtonClick={() => handleNavigation('/admin/barbearias')}
        />

        <DashboardCard
          title="Configurações"
          description="Configurar serviços, horários e comissões"
          icon={Settings}
          buttonText="Acessar"
          onButtonClick={() => handleNavigation('/admin/configuracoes')}
        />

        <DashboardCard
          title="Relatórios"
          description="Visualizar relatórios e estatísticas"
          icon={BarChart3}
          buttonText="Acessar"
          onButtonClick={() => handleNavigation('/admin/relatorios')}
        />

        <DashboardCard
          title="Avaliações"
          description="Visualizar e gerenciar avaliações dos clientes"
          icon={MessageCircle}
          buttonText="Acessar"
          onButtonClick={() => handleNavigation('/admin/avaliacoes')}
        />
      </div>
    </div>
  );
};

export default AdminDashboard; 