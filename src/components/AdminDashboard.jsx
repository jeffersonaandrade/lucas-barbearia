import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.jsx';
import { useAuth } from '@/hooks/useAuth.js';
import AdminLayout from '@/components/ui/admin-layout.jsx';
import DashboardCard from '@/components/ui/dashboard-card.jsx';
import { 
  Users, 
  Scissors, 
  Building2, 
  Settings, 
  BarChart3,
  UserPlus,
  Calendar,
  Clock
} from 'lucide-react';

const AdminDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalClientes: 0,
    clientesAtendendo: 0,
    clientesAguardando: 0,
    totalBarbearias: 3
  });

  useEffect(() => {
    // Carregar estatísticas das filas
    const loadStats = () => {
      try {
        const filaData = JSON.parse(localStorage.getItem('filaData') || '{}');
        let totalClientes = 0;
        let clientesAtendendo = 0;
        let clientesAguardando = 0;

        Object.values(filaData).forEach(barbearia => {
          if (barbearia.fila) {
            totalClientes += barbearia.fila.length;
            clientesAtendendo += barbearia.fila.filter(c => c.status === 'atendendo').length;
            clientesAguardando += barbearia.fila.filter(c => c.status === 'aguardando').length;
          }
        });

        setStats({
          totalClientes,
          clientesAtendendo,
          clientesAguardando,
          totalBarbearias: 3
        });
      } catch (error) {
        console.error('Erro ao carregar estatísticas:', error);
      }
    };

    loadStats();
    const interval = setInterval(loadStats, 5000); // Atualizar a cada 5 segundos

    return () => clearInterval(interval);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  return (
    <AdminLayout onLogout={handleLogout} showBackButton={false}>
      {/* Welcome Section */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Bem-vindo, {user?.role === 'admin' ? 'Administrador' : user?.role === 'gerente' ? 'Gerente' : 'Barbeiro'}!
        </h2>
        <p className="text-gray-600">
          Gerencie suas barbearias e monitore as filas em tempo real.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Clientes</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalClientes}</div>
            <p className="text-xs text-muted-foreground">
              Em todas as unidades
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Atendendo</CardTitle>
            <Scissors className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.clientesAtendendo}</div>
            <p className="text-xs text-muted-foreground">
              Clientes sendo atendidos
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Aguardando</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{stats.clientesAguardando}</div>
            <p className="text-xs text-muted-foreground">
              Na fila de espera
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Unidades</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalBarbearias}</div>
            <p className="text-xs text-muted-foreground">
              Barbearias ativas
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <DashboardCard
          icon={UserPlus}
          title="Adicionar à Fila"
          description="Adicione clientes às filas das barbearias"
          buttonText="Adicionar Cliente"
          onButtonClick={() => navigate('/admin/adicionar-fila')}
        />

        <DashboardCard
          icon={BarChart3}
          title="Gerenciar Filas"
          description="Visualize e gerencie as filas de todas as unidades"
          buttonText="Acessar Filas"
          onButtonClick={() => navigate('/admin/filas')}
        />

        {user?.role === 'admin' && (
          <DashboardCard
            icon={Building2}
            title="Gerenciar Barbearias"
            description="Cadastre e gerencie as unidades da rede"
            buttonText="Gerenciar Barbearias"
            onButtonClick={() => navigate('/admin/barbearias')}
          />
        )}

        {user?.role === 'admin' && (
          <DashboardCard
            icon={Users}
            title="Gerenciar Funcionários"
            description="Cadastre e gerencie funcionários da rede"
            buttonText="Gerenciar Funcionários"
            onButtonClick={() => navigate('/admin/funcionarios')}
          />
        )}

        {user?.role === 'admin' && (
          <DashboardCard
            icon={UserPlus}
            title="Gerenciar Usuários"
            description="Cadastre e gerencie usuários do sistema"
            buttonText="Gerenciar Usuários"
            onButtonClick={() => navigate('/admin/usuarios')}
          />
        )}

        <DashboardCard
          icon={Settings}
          title="Configurações"
          description="Configure as opções do sistema"
          buttonText="Configurar"
          buttonVariant="outline"
          onButtonClick={() => navigate('/admin/configuracoes')}
        />

        <DashboardCard
          icon={Calendar}
          title="Relatórios"
          description="Visualize relatórios e estatísticas"
          buttonText="Ver Relatórios"
          buttonVariant="outline"
          onButtonClick={() => navigate('/admin/relatorios')}
        />
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard; 