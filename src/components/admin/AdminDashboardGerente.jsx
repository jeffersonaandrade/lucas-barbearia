import { useNavigate } from 'react-router-dom';
import DashboardCard from '@/components/ui/dashboard-card.jsx';
import StatsManager from '@/components/ui/stats-manager.jsx';
import { 
  Users, 
  UserPlus
} from 'lucide-react';

const AdminDashboardGerente = ({ stats, onLogout }) => {
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Bem-vindo, Gerente!
        </h2>
        <p className="text-gray-600">
          Monitore as filas e gerencie clientes em suas barbearias.
        </p>
      </div>

      {/* Stats Cards */}
      <StatsManager 
        userRole="gerente"
        stats={stats}
      />

      {/* Action Cards - Funcionalidades limitadas */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <DashboardCard
          title="Gerenciar Filas"
          description="Visualizar e gerenciar filas de todas as barbearias"
          icon={Users}
          buttonText="Acessar"
          onButtonClick={() => {
            console.log('Navegando para /admin/filas');
            navigate('/admin/filas');
          }}
        />

        <DashboardCard
          title="Adicionar à Fila"
          description="Adicionar clientes manualmente à fila"
          icon={UserPlus}
          buttonText="Acessar"
          onButtonClick={() => {
            console.log('Navegando para /admin/adicionar-fila');
            navigate('/admin/adicionar-fila');
          }}
        />
      </div>
    </div>
  );
};

export default AdminDashboardGerente; 