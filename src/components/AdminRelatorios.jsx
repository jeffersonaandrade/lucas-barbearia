import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext.jsx';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import AdminLayout from '@/components/ui/admin-layout.jsx';
import { 
  Users, 
  Scissors, 
  Building2, 
  ClipboardList, 
  BarChart3, 
  Settings,
  LogOut,
  Plus,
  UserPlus,
  Store,
  FileText,
  Calendar,
  Clock,
  CheckCircle,
  AlertCircle,
  UserCheck,
  UserX,
  TrendingUp,
  Activity,
  DollarSign,
  Download
} from 'lucide-react';

const AdminRelatorios = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [periodo, setPeriodo] = useState('hoje');
  const [barbearia, setBarbearia] = useState('todas');

  const handleLogout = () => {
    logout();
  };

  const handleBack = () => {
    navigate('/admin/dashboard');
  };

  // Dados simulados de relatórios
  const relatorios = [
    {
      id: 1,
      titulo: 'Relatório de Atendimentos',
      descricao: 'Estatísticas de clientes atendidos por período',
      icon: Users,
      metricas: {
        total: 156,
        media: 12,
        crescimento: '+15%'
      },
      cor: 'bg-blue-500'
    },
    {
      id: 2,
      titulo: 'Tempo Médio de Atendimento',
      descricao: 'Tempo médio gasto por cliente',
      icon: Clock,
      metricas: {
        total: '18 min',
        media: '15 min',
        crescimento: '-8%'
      },
      cor: 'bg-green-500'
    },
    {
      id: 3,
      titulo: 'Faturamento',
      descricao: 'Receita total por período',
      icon: DollarSign,
      metricas: {
        total: 'R$ 12.450,00',
        media: 'R$ 1.035,00',
        crescimento: '+22%'
      },
      cor: 'bg-yellow-500'
    },
    {
      id: 4,
      titulo: 'Satisfação dos Clientes',
      descricao: 'Avaliações e feedback dos clientes',
      icon: TrendingUp,
      metricas: {
        total: '4.8/5',
        media: '4.6/5',
        crescimento: '+5%'
      },
      cor: 'bg-purple-500'
    }
  ];

  const barbearias = [
    { id: 'todas', nome: 'Todas as Barbearias' },
    { id: '1', nome: 'Lucas Barbearia - Centro' },
    { id: '2', nome: 'Lucas Barbearia - Shopping' },
    { id: '3', nome: 'Lucas Barbearia - Bairro' }
  ];

  const periodos = [
    { id: 'hoje', nome: 'Hoje' },
    { id: 'semana', nome: 'Última Semana' },
    { id: 'mes', nome: 'Último Mês' },
    { id: 'trimestre', nome: 'Último Trimestre' },
    { id: 'ano', nome: 'Último Ano' }
  ];

  const handleDownloadRelatorio = (tipo) => {
    setLoading(true);
    
    // Simular download
    setTimeout(() => {
      alert(`Relatório de ${tipo} baixado com sucesso!`);
      setLoading(false);
    }, 2000);
  };

  return (
    <AdminLayout onLogout={handleLogout} onBack={handleBack}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Relatórios</h1>
            <p className="text-gray-600">Visualize estatísticas e relatórios do sistema</p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-2">
            <Select value={periodo} onValueChange={setPeriodo}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Selecionar período" />
              </SelectTrigger>
              <SelectContent>
                {periodos.map((p) => (
                  <SelectItem key={p.id} value={p.id}>
                    {p.nome}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Select value={barbearia} onValueChange={setBarbearia}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Selecionar barbearia" />
              </SelectTrigger>
              <SelectContent>
                {barbearias.map((b) => (
                  <SelectItem key={b.id} value={b.id}>
                    {b.nome}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Cards de Métricas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {relatorios.map((relatorio) => (
            <Card key={relatorio.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {relatorio.titulo}
                </CardTitle>
                <div className={`p-2 rounded-full ${relatorio.cor}`}>
                  <relatorio.icon className="h-4 w-4 text-white" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{relatorio.metricas.total}</div>
                <p className="text-xs text-muted-foreground mb-2">
                  {relatorio.descricao}
                </p>
                <div className="flex items-center justify-between">
                  <Badge variant="secondary" className="text-xs">
                    Média: {relatorio.metricas.media}
                  </Badge>
                  <span className={`text-xs font-medium ${
                    relatorio.metricas.crescimento.startsWith('+') 
                      ? 'text-green-600' 
                      : 'text-red-600'
                  }`}>
                    {relatorio.metricas.crescimento}
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Relatórios Detalhados */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Relatório de Atendimentos por Barbearia */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="h-5 w-5" />
                Atendimentos por Barbearia
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                    <span className="font-medium">Centro</span>
                  </div>
                  <div className="text-right">
                    <div className="font-bold">45 atendimentos</div>
                    <div className="text-sm text-gray-600">R$ 3.240,00</div>
                  </div>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span className="font-medium">Shopping</span>
                  </div>
                  <div className="text-right">
                    <div className="font-bold">67 atendimentos</div>
                    <div className="text-sm text-gray-600">R$ 4.820,00</div>
                  </div>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                    <span className="font-medium">Bairro</span>
                  </div>
                  <div className="text-right">
                    <div className="font-bold">34 atendimentos</div>
                    <div className="text-sm text-gray-600">R$ 2.390,00</div>
                  </div>
                </div>
              </div>
              
              <Button 
                onClick={() => handleDownloadRelatorio('Atendimentos por Barbearia')}
                disabled={loading}
                className="w-full mt-4"
                variant="outline"
              >
                <Download className="h-4 w-4 mr-2" />
                {loading ? 'Baixando...' : 'Baixar Relatório'}
              </Button>
            </CardContent>
          </Card>

          {/* Relatório de Performance dos Barbeiros */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Scissors className="h-5 w-5" />
                Performance dos Barbeiros
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-sm font-bold text-blue-600">LS</span>
                    </div>
                    <div>
                      <div className="font-medium">Lucas Silva</div>
                      <div className="text-sm text-gray-600">Centro</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold">23 atendimentos</div>
                    <div className="text-sm text-green-600">4.9/5 ⭐</div>
                  </div>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                      <span className="text-sm font-bold text-green-600">MC</span>
                    </div>
                    <div>
                      <div className="font-medium">Maria Costa</div>
                      <div className="text-sm text-gray-600">Shopping</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold">31 atendimentos</div>
                    <div className="text-sm text-green-600">4.7/5 ⭐</div>
                  </div>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                      <span className="text-sm font-bold text-yellow-600">PS</span>
                    </div>
                    <div>
                      <div className="font-medium">Pedro Santos</div>
                      <div className="text-sm text-gray-600">Bairro</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold">18 atendimentos</div>
                    <div className="text-sm text-green-600">4.8/5 ⭐</div>
                  </div>
                </div>
              </div>
              
              <Button 
                onClick={() => handleDownloadRelatorio('Performance dos Barbeiros')}
                disabled={loading}
                className="w-full mt-4"
                variant="outline"
              >
                <Download className="h-4 w-4 mr-2" />
                {loading ? 'Baixando...' : 'Baixar Relatório'}
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Ações Rápidas */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Ações Rápidas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button 
                onClick={() => handleDownloadRelatorio('Relatório Completo')}
                disabled={loading}
                variant="outline"
                className="h-auto p-4 flex flex-col items-center gap-2"
              >
                <Download className="h-6 w-6" />
                <div className="text-center">
                  <div className="font-medium">Relatório Completo</div>
                  <div className="text-sm text-gray-600">Todos os dados</div>
                </div>
              </Button>
              
              <Button 
                onClick={() => handleDownloadRelatorio('Relatório Financeiro')}
                disabled={loading}
                variant="outline"
                className="h-auto p-4 flex flex-col items-center gap-2"
              >
                <DollarSign className="h-6 w-6" />
                <div className="text-center">
                  <div className="font-medium">Financeiro</div>
                  <div className="text-sm text-gray-600">Faturamento e custos</div>
                </div>
              </Button>
              
              <Button 
                onClick={() => handleDownloadRelatorio('Relatório de Satisfação')}
                disabled={loading}
                variant="outline"
                className="h-auto p-4 flex flex-col items-center gap-2"
              >
                <TrendingUp className="h-6 w-6" />
                <div className="text-center">
                  <div className="font-medium">Satisfação</div>
                  <div className="text-sm text-gray-600">Avaliações dos clientes</div>
                </div>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default AdminRelatorios; 