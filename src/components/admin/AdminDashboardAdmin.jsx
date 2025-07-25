import { useNavigate } from 'react-router-dom';
import DashboardCard from '@/components/ui/dashboard-card.jsx';
import StatsManager from '@/components/ui/stats-manager.jsx';
import { 
  Users, 
  Scissors, 
  Building2, 
  Settings, 
  UserPlus,
  BarChart3
} from 'lucide-react';

const AdminDashboardAdmin = ({ stats, onLogout }) => {
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Bem-vindo, Administrador!
        </h2>
        <p className="text-gray-600">
          Gerencie suas barbearias e monitore as filas em tempo real.
        </p>
      </div>

      {/* Stats Cards */}
      <StatsManager 
        userRole="admin"
        stats={stats}
      />

      {/* Action Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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

        <DashboardCard
          title="Gerenciar Usuários"
          description="Criar e gerenciar usuários do sistema"
          icon={Users}
          buttonText="Acessar"
          onButtonClick={() => {
            console.log('Navegando para /admin/usuarios');
            navigate('/admin/usuarios');
          }}
        />

        <DashboardCard
          title="Gerenciar Barbearias"
          description="Configurar barbearias e unidades"
          icon={Building2}
          buttonText="Acessar"
          onButtonClick={() => {
            console.log('Navegando para /admin/barbearias');
            navigate('/admin/barbearias');
          }}
        />

        <DashboardCard
          title="Gerenciar Funcionários"
          description="Cadastrar e gerenciar barbeiros"
          icon={Scissors}
          buttonText="Acessar"
          onButtonClick={() => {
            console.log('Navegando para /admin/funcionarios');
            navigate('/admin/funcionarios');
          }}
        />

        <DashboardCard
          title="Relatórios"
          description="Visualizar relatórios e estatísticas"
          icon={BarChart3}
          buttonText="Acessar"
          onButtonClick={() => {
            console.log('Navegando para /admin/relatorios');
            navigate('/admin/relatorios');
          }}
        />

        <DashboardCard
          title="Configurações"
          description="Configurações do sistema"
          icon={Settings}
          buttonText="Acessar"
          onButtonClick={() => {
            console.log('Navegando para /admin/configuracoes');
            navigate('/admin/configuracoes');
          }}
        />
      </div>
    </div>
  );
};

export default AdminDashboardAdmin; 