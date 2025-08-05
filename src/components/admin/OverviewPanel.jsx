import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext.jsx';
import { Card } from '../ui/card.jsx';
import { Button } from '../ui/button.jsx';
import { Badge } from '../ui/badge.jsx';
import { LoadingSpinner } from '../ui/loading-spinner.jsx';
import WhatsAppStatusWidget from './WhatsAppStatusWidget.jsx';
import { 
  BarChart3, 
  Users, 
  Scissors, 
  Clock, 
  TrendingUp,
  Calendar,
  DollarSign,
  Activity,
  RefreshCw
} from 'lucide-react';

const OverviewPanel = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [whatsappStatus, setWhatsappStatus] = useState(null);
  const [lastUpdate, setLastUpdate] = useState(null);

  // Carregar estatísticas do dashboard
  useEffect(() => {
    loadDashboardStats();
    
    // Auto-refresh a cada 5 minutos
    const interval = setInterval(loadDashboardStats, 300000);
    return () => clearInterval(interval);
  }, []);

  const loadDashboardStats = async () => {
    setLoading(true);
    try {
      // Simular dados do dashboard (substituir por chamada real da API)
      const mockStats = {
        fila: {
          total: 12,
          emAtendimento: 3,
          aguardando: 9
        },
        atendimentos: {
          hoje: 45,
          semana: 280,
          mes: 1200
        },
        financeiro: {
          hoje: 1350.00,
          semana: 8400.00,
          mes: 36000.00
        },
        barbearias: {
          total: 3,
          ativas: 3
        }
      };

      setStats(mockStats);
      setLastUpdate(new Date());
    } catch (error) {
      console.error('Erro ao carregar estatísticas:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleWhatsAppStatusChange = (status) => {
    setWhatsappStatus(status);
    console.log('Status WhatsApp mudou:', status);
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const formatLastUpdate = () => {
    if (!lastUpdate) return '';
    const now = new Date();
    const diff = Math.floor((now - lastUpdate) / 1000);
    
    if (diff < 60) return 'Agora mesmo';
    if (diff < 3600) return `${Math.floor(diff / 60)}m atrás`;
    return `${Math.floor(diff / 3600)}h atrás`;
  };

  if (loading && !stats) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <LoadingSpinner />
          <p className="mt-2 text-gray-600">Carregando dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="overview-panel p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">📊 Visão Geral do Sistema</h2>
          <p className="text-gray-600">Monitoramento em tempo real do status dos serviços</p>
        </div>
        
        <div className="flex items-center space-x-3">
          <Button
            onClick={loadDashboardStats}
            disabled={loading}
            variant="outline"
            size="sm"
            className="flex items-center space-x-2"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            <span>Atualizar</span>
          </Button>
          
          {lastUpdate && (
            <span className="text-sm text-gray-500">
              Última atualização: {formatLastUpdate()}
            </span>
          )}
        </div>
      </div>

      {/* Widgets Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Widget WhatsApp */}
        <Card className="p-4 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-gray-900">📱 Status WhatsApp</h3>
            <Button variant="ghost" size="sm">
              Ver Detalhes
            </Button>
          </div>
          <WhatsAppStatusWidget 
            onStatusChange={handleWhatsAppStatusChange}
            showDetails={false}
          />
        </Card>

        {/* Widget Fila */}
        <Card className="p-4 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-gray-900">👥 Fila Atual</h3>
            <Button variant="ghost" size="sm">
              Ver Fila
            </Button>
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Users className="w-5 h-5 text-blue-500" />
                <span className="text-sm text-gray-600">Na Fila</span>
              </div>
              <span className="text-2xl font-bold text-blue-600">
                {stats?.fila?.total || 0}
              </span>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Scissors className="w-5 h-5 text-green-500" />
                <span className="text-sm text-gray-600">Em Atendimento</span>
              </div>
              <span className="text-lg font-semibold text-green-600">
                {stats?.fila?.emAtendimento || 0}
              </span>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Clock className="w-5 h-5 text-orange-500" />
                <span className="text-sm text-gray-600">Aguardando</span>
              </div>
              <span className="text-lg font-semibold text-orange-600">
                {stats?.fila?.aguardando || 0}
              </span>
            </div>
          </div>
        </Card>

        {/* Widget Atendimentos */}
        <Card className="p-4 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-gray-900">✂️ Atendimentos</h3>
            <Button variant="ghost" size="sm">
              Ver Relatório
            </Button>
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Calendar className="w-5 h-5 text-purple-500" />
                <span className="text-sm text-gray-600">Hoje</span>
              </div>
              <span className="text-2xl font-bold text-purple-600">
                {stats?.atendimentos?.hoje || 0}
              </span>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <TrendingUp className="w-5 h-5 text-indigo-500" />
                <span className="text-sm text-gray-600">Esta Semana</span>
              </div>
              <span className="text-lg font-semibold text-indigo-600">
                {stats?.atendimentos?.semana || 0}
              </span>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <BarChart3 className="w-5 h-5 text-teal-500" />
                <span className="text-sm text-gray-600">Este Mês</span>
              </div>
              <span className="text-lg font-semibold text-teal-600">
                {stats?.atendimentos?.mes || 0}
              </span>
            </div>
          </div>
        </Card>

        {/* Widget Financeiro */}
        <Card className="p-4 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-gray-900">💰 Financeiro</h3>
            <Button variant="ghost" size="sm">
              Ver Detalhes
            </Button>
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <DollarSign className="w-5 h-5 text-green-500" />
                <span className="text-sm text-gray-600">Hoje</span>
              </div>
              <span className="text-lg font-bold text-green-600">
                {formatCurrency(stats?.financeiro?.hoje || 0)}
              </span>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Activity className="w-5 h-5 text-blue-500" />
                <span className="text-sm text-gray-600">Esta Semana</span>
              </div>
              <span className="text-sm font-semibold text-blue-600">
                {formatCurrency(stats?.financeiro?.semana || 0)}
              </span>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <TrendingUp className="w-5 h-5 text-emerald-500" />
                <span className="text-sm text-gray-600">Este Mês</span>
              </div>
              <span className="text-sm font-semibold text-emerald-600">
                {formatCurrency(stats?.financeiro?.mes || 0)}
              </span>
            </div>
          </div>
        </Card>
      </div>

      {/* Status Geral do Sistema */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Status Geral do Sistema</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-3">
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
              <div>
                <p className="font-medium">Barbearias</p>
                <p className="text-sm text-gray-600">
                  {stats?.barbearias?.ativas || 0} de {stats?.barbearias?.total || 0} ativas
                </p>
              </div>
            </div>
            <Badge variant="default">
              {stats?.barbearias?.ativas === stats?.barbearias?.total ? 'Todas OK' : 'Atenção'}
            </Badge>
          </div>
          
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-3">
              <div className={`w-3 h-3 rounded-full ${
                whatsappStatus?.isConnected ? 'bg-green-500' : 'bg-red-500'
              }`}></div>
              <div>
                <p className="font-medium">WhatsApp</p>
                <p className="text-sm text-gray-600">
                  {whatsappStatus?.isConnected ? 'Conectado' : 'Desconectado'}
                </p>
              </div>
            </div>
            <Badge variant={whatsappStatus?.isConnected ? "default" : "destructive"}>
              {whatsappStatus?.isConnected ? 'ON' : 'OFF'}
            </Badge>
          </div>
          
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-3">
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
              <div>
                <p className="font-medium">Sistema</p>
                <p className="text-sm text-gray-600">Operacional</p>
              </div>
            </div>
            <Badge variant="default">OK</Badge>
          </div>
        </div>
      </Card>

      {/* Ações Rápidas */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Ações Rápidas</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Button variant="outline" className="flex items-center space-x-2">
            <Users className="w-4 h-4" />
            <span>Gerenciar Fila</span>
          </Button>
          
          <Button variant="outline" className="flex items-center space-x-2">
            <BarChart3 className="w-4 h-4" />
            <span>Ver Relatórios</span>
          </Button>
          
          <Button variant="outline" className="flex items-center space-x-2">
            <Scissors className="w-4 h-4" />
            <span>Gerenciar Barbearias</span>
          </Button>
          
          <Button variant="outline" className="flex items-center space-x-2">
            <DollarSign className="w-4 h-4" />
            <span>Financeiro</span>
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default OverviewPanel; 