import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext.jsx';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import AdminLayout from '@/components/ui/admin-layout.jsx';
import { relatoriosFinanceirosService, financeiroService } from '@/services/api.js';
import LoadingSpinner from '@/components/ui/loading-spinner';
import { Alert, AlertDescription } from '@/components/ui/alert';
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
  const [periodo, setPeriodo] = useState('mes');
  const [barbearia, setBarbearia] = useState('todas');
  const [relatorios, setRelatorios] = useState([]);
  const [error, setError] = useState(null);

  const handleLogout = () => {
    logout();
  };

  const handleBack = () => {
    navigate('/admin/dashboard');
  };

  // Carregar dados reais dos relatórios
  const carregarRelatorios = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const filtros = {
        periodo: periodo,
        ...(barbearia !== 'todas' && { barbearia_id: barbearia })
      };

      // Carregar relatórios financeiros
      const [financeiro, comissoes, performance, satisfacao] = await Promise.all([
        relatoriosFinanceirosService.relatorioFinanceiro(filtros),
        relatoriosFinanceirosService.relatorioComissoes(filtros),
        relatoriosFinanceirosService.relatorioPerformance(filtros),
        relatoriosFinanceirosService.relatorioSatisfacao(filtros)
      ]);

      const relatoriosData = [
        {
          id: 1,
          titulo: 'Faturamento',
          descricao: 'Receita total por período',
          icon: DollarSign,
          metricas: {
            total: `R$ ${financeiro.data?.total_receita?.toFixed(2) || '0,00'}`,
            media: `R$ ${financeiro.data?.media_ticket?.toFixed(2) || '0,00'}`,
            crescimento: financeiro.data?.crescimento || '+0%'
          },
          cor: 'bg-yellow-500',
          dados: financeiro.data
        },
        {
          id: 2,
          titulo: 'Comissões',
          descricao: 'Total de comissões pagas',
          icon: TrendingUp,
          metricas: {
            total: `R$ ${comissoes.data?.total_comissoes?.toFixed(2) || '0,00'}`,
            media: `${comissoes.data?.media_comissao?.toFixed(1) || '0'}%`,
            crescimento: comissoes.data?.crescimento || '+0%'
          },
          cor: 'bg-green-500',
          dados: comissoes.data
        },
        {
          id: 3,
          titulo: 'Atendimentos',
          descricao: 'Total de clientes atendidos',
          icon: Users,
          metricas: {
            total: performance.data?.total_atendimentos || 0,
            media: performance.data?.media_diaria || 0,
            crescimento: performance.data?.crescimento || '+0%'
          },
          cor: 'bg-blue-500',
          dados: performance.data
        },
        {
          id: 4,
          titulo: 'Satisfação',
          descricao: 'Avaliações dos clientes',
          icon: TrendingUp,
          metricas: {
            total: `${satisfacao.data?.media_avaliacao?.toFixed(1) || '0'}/5`,
            media: `${satisfacao.data?.total_avaliacoes || 0} avaliações`,
            crescimento: satisfacao.data?.crescimento || '+0%'
          },
          cor: 'bg-purple-500',
          dados: satisfacao.data
        }
      ];

      setRelatorios(relatoriosData);
    } catch (error) {
      console.error('Erro ao carregar relatórios:', error);
      setError('Erro ao carregar relatórios. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  // Carregar relatórios quando mudar período ou barbearia
  useEffect(() => {
    carregarRelatorios();
  }, [periodo, barbearia]);



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

  const handleDownloadRelatorio = async (tipo) => {
    setLoading(true);
    
    try {
      const filtros = {
        periodo: periodo,
        tipo: tipo,
        ...(barbearia !== 'todas' && { barbearia_id: barbearia })
      };

      // Chamar endpoint de download do backend
      const response = await relatoriosFinanceirosService.relatorioFinanceiro(filtros);
      
      // Simular download (o backend deve retornar um arquivo)
      const blob = new Blob([JSON.stringify(response.data, null, 2)], { 
        type: 'application/json' 
      });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `relatorio-${tipo}-${periodo}.json`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      alert(`Relatório de ${tipo} baixado com sucesso!`);
    } catch (error) {
      console.error('Erro ao baixar relatório:', error);
      alert('Erro ao baixar relatório. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout onLogout={handleLogout} onBack={handleBack}>
      <div className="space-y-6">
        {/* Error Alert */}
        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Loading */}
        {loading && (
          <div className="flex justify-center items-center h-64">
            <LoadingSpinner />
          </div>
        )}

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
          {/* Resumo dos Relatórios */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Resumo do Período
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {relatorios.length > 0 ? (
                  relatorios.map((relatorio) => (
                    <div key={relatorio.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className={`w-3 h-3 ${relatorio.cor.replace('bg-', 'bg-')} rounded-full`}></div>
                        <span className="font-medium">{relatorio.titulo}</span>
                      </div>
                      <div className="text-right">
                        <div className="font-bold">{relatorio.metricas.total}</div>
                        <div className="text-sm text-gray-600">Média: {relatorio.metricas.media}</div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    Nenhum dado disponível para o período selecionado
                  </div>
                )}
              </div>
              
              <Button 
                onClick={() => handleDownloadRelatorio('Resumo Geral')}
                disabled={loading}
                className="w-full mt-4"
                variant="outline"
              >
                <Download className="h-4 w-4 mr-2" />
                {loading ? 'Baixando...' : 'Baixar Relatório Completo'}
              </Button>
            </CardContent>
          </Card>

          {/* Ações Rápidas */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Ações Rápidas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <Button 
                  onClick={() => handleDownloadRelatorio('Completo')}
                  disabled={loading}
                  className="w-full justify-start"
                  variant="outline"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Relatório Completo
                  <span className="ml-auto text-xs text-gray-500">Todos os dados</span>
                </Button>
                
                <Button 
                  onClick={() => handleDownloadRelatorio('Financeiro')}
                  disabled={loading}
                  className="w-full justify-start"
                  variant="outline"
                >
                  <DollarSign className="h-4 w-4 mr-2" />
                  Financeiro
                  <span className="ml-auto text-xs text-gray-500">Faturamento e custos</span>
                </Button>
                
                <Button 
                  onClick={() => handleDownloadRelatorio('Satisfacao')}
                  disabled={loading}
                  className="w-full justify-start"
                  variant="outline"
                >
                  <TrendingUp className="h-4 w-4 mr-2" />
                  Satisfação
                  <span className="ml-auto text-xs text-gray-500">Avaliações dos clientes</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminRelatorios; 