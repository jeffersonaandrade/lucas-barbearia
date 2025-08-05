import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useSharedData } from '@/hooks/useSharedData.js';
import { useDashboard } from '@/contexts/DashboardContext.jsx';
import DashboardHeader from './DashboardHeader.jsx';
import DashboardCard from '@/components/ui/dashboard-card.jsx';
import StatsManager from '@/components/ui/stats-manager.jsx';
import { 
  Users, 
  UserPlus
} from 'lucide-react';

const GerenteDashboard = ({ onLogout }) => {
  const navigate = useNavigate();
  const { barbearias } = useDashboard();
  
  // Sistema de dados compartilhados
  const { useSharedDashboardStats } = useSharedData();
  const { stats, loading: statsLoading } = useSharedDashboardStats('gerente');

  // Debug: Log dos dados recebidos
  useEffect(() => {
    console.log('📊 GerenteDashboard - Stats recebidos:', stats);
  }, [stats]);

  // Carregar estatísticas quando as barbearias estiverem disponíveis
  useEffect(() => {
    if (barbearias && barbearias.length > 0) {
      console.log('📊 GerenteDashboard - Barbearias disponíveis no contexto:', barbearias.length);
    }
  }, [barbearias]);

  const handleNavigation = (path) => {
    console.log('Navegando para', path);
    navigate(path);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <DashboardHeader
        title="Bem-vindo, Gerente!"
        subtitle="Monitore as filas e gerencie clientes em suas barbearias."
        onLogout={onLogout}
        showLogout={false}
      />

      {/* Stats Cards */}
      <StatsManager 
        userRole="gerente"
        stats={stats}
        loading={statsLoading}
      />

      {/* Action Cards - Funcionalidades limitadas */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
      </div>
    </div>
  );
};

export default GerenteDashboard; 