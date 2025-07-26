import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.jsx';
import { Badge } from '@/components/ui/badge.jsx';
import { 
  Users, 
  Scissors, 
  Building2, 
  BarChart3,
  Clock,
  CheckCircle,
  TrendingUp,
  Activity
} from 'lucide-react';

const StatsManager = ({ 
  barbeariaAtual, 
  barbeiroAtual, 
  userRole, 
  stats,
  estatisticas,
  historicoAtualizado = false,
  loading = false
}) => {
  // Stats para Admin/Gerente
  if (userRole === 'admin' || userRole === 'gerente') {
    // Mostrar loading se ainda não carregou os dados
    if (loading) {
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Carregando...</CardTitle>
                <div className="h-4 w-4 bg-gray-200 rounded animate-pulse" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-300">--</div>
                <p className="text-xs text-muted-foreground">
                  Aguardando dados
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      );
    }

    // Usar stats passados como props ou fallback para valores padrão
    const displayStats = stats || {
      totalClientes: 0,
      clientesAtendendo: 0,
      clientesAguardando: 0,
      totalBarbearias: 0
    };

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Clientes</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{displayStats.totalClientes}</div>
            <p className="text-xs text-muted-foreground">
              Em todas as unidades
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Atendendo</CardTitle>
            <Scissors className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{displayStats.clientesAtendendo}</div>
            <p className="text-xs text-muted-foreground">
              Clientes sendo atendidos
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Aguardando</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{displayStats.clientesAguardando}</div>
            <p className="text-xs text-muted-foreground">
              Clientes na fila
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Barbearias</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">{displayStats.totalBarbearias}</div>
            <p className="text-xs text-muted-foreground">
              Unidades ativas
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Stats para Barbeiro
  if (userRole === 'barbeiro') {
    // Usar estatisticas passadas como props ou fallback para valores padrão
    const displayStats = estatisticas || {
      total: 0,
      aguardando: 0,
      atendendo: 0,
      tempoMedio: 15
    };
    
    if (loading) {
      return (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Carregando...</CardTitle>
                <div className="h-4 w-4 bg-gray-200 rounded animate-pulse" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-300">--</div>
                <p className="text-xs text-muted-foreground">
                  Aguardando dados
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total na Fila</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{displayStats.total || 0}</div>
            <p className="text-xs text-muted-foreground">
              Clientes na fila
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Aguardando</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{displayStats.aguardando || 0}</div>
            <p className="text-xs text-muted-foreground">
              Clientes na fila
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Atendendo</CardTitle>
            <Scissors className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{displayStats.atendendo || 0}</div>
            <p className="text-xs text-muted-foreground">
              Em atendimento
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tempo Médio</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">{displayStats.tempoMedio || 15}min</div>
            <p className="text-xs text-muted-foreground">
              Por cliente
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Fallback para outros roles
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Sem dados</CardTitle>
          <Activity className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-gray-400">--</div>
          <p className="text-xs text-muted-foreground">
            Nenhuma informação disponível
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default StatsManager; 