import React, { useState, useEffect } from 'react';
import WhatsAppAdmin from '../../services/WhatsAppAdmin.js';
import { useAuth } from '../../contexts/AuthContext.jsx';
import { Card } from '../ui/card.jsx';
import { Badge } from '../ui/badge.jsx';
import { Button } from '../ui/button.jsx';
import { LoadingSpinner } from '../ui/loading-spinner.jsx';
import { 
  Wifi, 
  WifiOff, 
  Smartphone, 
  AlertCircle,
  CheckCircle,
  RefreshCw
} from 'lucide-react';

const WhatsAppStatusWidget = ({ onStatusChange, showDetails = false }) => {
  const { user } = useAuth();
  const [status, setStatus] = useState(null);
  const [devices, setDevices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdate, setLastUpdate] = useState(null);

  const whatsappAdmin = new WhatsAppAdmin(user?.token || localStorage.getItem('authToken'));

  useEffect(() => {
    loadStatus();
    
    // Atualizar status a cada 2 minutos
    const interval = setInterval(loadStatus, 120000);
    return () => clearInterval(interval);
  }, []);

  const loadStatus = async () => {
    try {
      setError(null);
      const [statusRes, devicesRes] = await Promise.all([
        whatsappAdmin.getStatus(),
        whatsappAdmin.getDevices()
      ]);

      if (statusRes.success) {
        setStatus(statusRes.data);
        onStatusChange?.(statusRes.data);
      }
      
      if (devicesRes.success) {
        setDevices(devicesRes.data);
      }
      
      setLastUpdate(new Date());
    } catch (error) {
      console.error('Erro ao carregar status do WhatsApp:', error);
      setError('Erro ao carregar status');
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = () => {
    if (loading) return <LoadingSpinner className="w-5 h-5" />;
    if (error) return <AlertCircle className="w-5 h-5 text-red-500" />;
    if (status?.isConnected) return <CheckCircle className="w-5 h-5 text-green-500" />;
    return <WifiOff className="w-5 h-5 text-red-500" />;
  };

  const getStatusText = () => {
    if (loading) return 'Carregando...';
    if (error) return 'Erro';
    if (status?.isConnected) return 'Conectado';
    return 'Desconectado';
  };

  const getStatusColor = () => {
    if (loading) return 'bg-gray-100';
    if (error) return 'bg-red-50 border-red-200';
    if (status?.isConnected) return 'bg-green-50 border-green-200';
    return 'bg-red-50 border-red-200';
  };

  const getDeviceStatus = () => {
    const activeDevices = devices.filter(d => d.isActive).length;
    const totalDevices = devices.length;
    
    if (totalDevices === 0) return 'Nenhum dispositivo';
    if (activeDevices === totalDevices) return `${totalDevices} ativo(s)`;
    return `${activeDevices}/${totalDevices} ativo(s)`;
  };

  const formatLastUpdate = () => {
    if (!lastUpdate) return '';
    const now = new Date();
    const diff = Math.floor((now - lastUpdate) / 1000);
    
    if (diff < 60) return 'Agora mesmo';
    if (diff < 3600) return `${Math.floor(diff / 60)}m atrás`;
    return `${Math.floor(diff / 3600)}h atrás`;
  };

  if (showDetails) {
    return (
      <Card className={`p-4 ${getStatusColor()} border transition-all duration-300`}>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <Wifi className="w-5 h-5 text-blue-500" />
            <h3 className="font-semibold text-gray-900">WhatsApp</h3>
          </div>
          <Badge variant={status?.isConnected ? "default" : "destructive"}>
            {getStatusText()}
          </Badge>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-4">
            <LoadingSpinner />
            <span className="ml-2 text-sm text-gray-600">Carregando...</span>
          </div>
        ) : error ? (
          <div className="text-center py-4">
            <AlertCircle className="w-8 h-8 text-red-500 mx-auto mb-2" />
            <p className="text-sm text-red-600">{error}</p>
            <Button 
              onClick={loadStatus} 
              variant="outline" 
              size="sm" 
              className="mt-2"
            >
              <RefreshCw className="w-3 h-3 mr-1" />
              Tentar Novamente
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            {/* Status Principal */}
            <div className="flex items-center justify-between p-3 bg-white rounded-lg">
              <div className="flex items-center space-x-3">
                {getStatusIcon()}
                <div>
                  <p className="font-medium text-gray-900">
                    {status?.isConnected ? 'Conectado' : 'Desconectado'}
                  </p>
                  <p className="text-sm text-gray-600">
                    {status?.status || 'Status desconhecido'}
                  </p>
                </div>
              </div>
            </div>

            {/* Dispositivos */}
            <div className="flex items-center justify-between p-3 bg-white rounded-lg">
              <div className="flex items-center space-x-3">
                <Smartphone className="w-5 h-5 text-purple-500" />
                <div>
                  <p className="font-medium text-gray-900">Dispositivos</p>
                  <p className="text-sm text-gray-600">{getDeviceStatus()}</p>
                </div>
              </div>
              {devices.length > 0 && (
                <Badge variant="outline">
                  {devices.length}
                </Badge>
              )}
            </div>

            {/* Última Atualização */}
            {lastUpdate && (
              <div className="text-xs text-gray-500 text-center">
                Última atualização: {formatLastUpdate()}
              </div>
            )}
          </div>
        )}
      </Card>
    );
  }

  // Widget compacto
  return (
    <Card className={`p-3 ${getStatusColor()} border transition-all duration-300 hover:shadow-md`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          {getStatusIcon()}
          <div>
            <p className="font-medium text-gray-900">WhatsApp</p>
            <p className="text-sm text-gray-600">{getStatusText()}</p>
          </div>
        </div>
        
        <div className="text-right">
          <Badge variant={status?.isConnected ? "default" : "destructive"} className="mb-1">
            {status?.isConnected ? 'ON' : 'OFF'}
          </Badge>
          {devices.length > 0 && (
            <p className="text-xs text-gray-500">
              {devices.length} dispositivo(s)
            </p>
          )}
        </div>
      </div>
    </Card>
  );
};

export default WhatsAppStatusWidget; 