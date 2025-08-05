import React, { useState, useEffect } from 'react';
import WhatsAppAdmin from '../../services/WhatsAppAdmin.js';
import { useAuth } from '../../contexts/AuthContext.jsx';
import { CookieManager } from '../../utils/cookieManager.js';
import { Button } from '../ui/button.jsx';
import { Card } from '../ui/card.jsx';
import { Alert } from '../ui/alert.jsx';
import { Badge } from '../ui/badge.jsx';
import LoadingSpinner from '../ui/loading-spinner.jsx';
import BackButton from '../ui/back-button.jsx';
import { 
  RefreshCw, 
  Smartphone, 
  QrCode, 
  Power, 
  PowerOff, 
  RotateCcw, 
  Trash2,
  MessageSquare,
  Users,
  Clock,
  Wifi,
  WifiOff
} from 'lucide-react';

const WhatsAppAdminPanel = () => {
  const { user } = useAuth();
  const [status, setStatus] = useState(null);
  const [devices, setDevices] = useState([]);
  const [qrCode, setQrCode] = useState(null);
  const [qrCodeGeneratedAt, setQrCodeGeneratedAt] = useState(null);
  const [qrCodeExpiresIn, setQrCodeExpiresIn] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('info');
  const [autoRefresh, setAutoRefresh] = useState(true);

  const whatsappAdmin = new WhatsAppAdmin(CookieManager.getAdminToken());

  // Carregar dados iniciais
  useEffect(() => {
    loadWhatsAppData();
  }, []);

  // Auto-refresh a cada 30 segundos
  useEffect(() => {
    if (!autoRefresh) return;

    // Atualizar status a cada 2 minutos
    const interval = setInterval(() => {
      loadWhatsAppData();
    }, 120000);

    // Atualizar QR code a cada 2 minutos
    const qrInterval = setInterval(() => {
      generateQRCode();
    }, 120000);

    return () => {
      clearInterval(interval);
      clearInterval(qrInterval);
    };
  }, [autoRefresh, loading]);

  // Contador do QR Code
  useEffect(() => {
    if (!qrCodeGeneratedAt || !qrCodeExpiresIn) return;

    const interval = setInterval(() => {
      const now = Date.now();
      const elapsed = Math.floor((now - qrCodeGeneratedAt) / 1000);
      const remaining = qrCodeExpiresIn - elapsed;

      if (remaining <= 0) {
        // QR Code expirou
        setQrCode(null);
        setQrCodeGeneratedAt(null);
        setQrCodeExpiresIn(null);
        showMessage('QR Code expirou. Gere um novo QR Code.', 'warning');
      }
    }, 1000); // Atualizar a cada segundo

    return () => clearInterval(interval);
  }, [qrCodeGeneratedAt, qrCodeExpiresIn]);

  const loadWhatsAppData = async () => {
    setLoading(true);
    try {
      const token = CookieManager.getAdminToken();
      
      if (!token) {
        showMessage('Token não encontrado. Faça login novamente.', 'error');
        return;
      }
      
      const [statusRes, devicesRes] = await Promise.all([
        whatsappAdmin.getStatus(),
        whatsappAdmin.getDevices()
      ]);

      if (statusRes.success) {
        setStatus(statusRes.data);
      } else {
        // Se não conseguiu obter status, assumir desconectado
        setStatus({ isConnected: false, status: 'Erro ao obter status' });
      }
       
       if (devicesRes.success) setDevices(devicesRes.data);
      
      showMessage('Dados atualizados com sucesso', 'success');
    } catch (error) {
      console.error('❌ WhatsAppAdminPanel - Erro ao carregar dados:', error);
      showMessage(`Erro ao carregar dados do WhatsApp: ${error.message}`, 'error');
    } finally {
      setLoading(false);
    }
  };

  // Gerar QR Code
  const generateQRCode = async () => {
    setLoading(true);
    try {
      const response = await whatsappAdmin.getQRCode();
      if (response.success) {
        setQrCode(response.data);
        
        // Salvar momento da geração e tempo de expiração
        const now = Date.now();
        setQrCodeGeneratedAt(now);
        setQrCodeExpiresIn(response.data.expiresIn || 60); // Padrão 60 segundos
        
        showMessage('QR Code gerado com sucesso', 'success');
      } else {
        showMessage('Erro ao gerar QR Code', 'error');
      }
    } catch (error) {
      console.error('Erro ao gerar QR Code:', error);
      showMessage('Erro ao gerar QR Code', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Desconectar dispositivo
  const handleDisconnectDevice = async (deviceId) => {
    if (!confirm('Tem certeza que deseja desconectar este dispositivo?')) return;
    
    setLoading(true);
    try {
      const response = await whatsappAdmin.disconnectDevice(deviceId);
      if (response.success) {
        showMessage('Dispositivo desconectado com sucesso', 'success');
        loadWhatsAppData(); // Recarregar dados
      } else {
        showMessage('Erro ao desconectar dispositivo', 'error');
      }
    } catch (error) {
      console.error('Erro ao desconectar dispositivo:', error);
      showMessage('Erro ao desconectar dispositivo', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Desconectar todos
  const handleDisconnectAll = async () => {
    if (!confirm('Tem certeza que deseja desconectar TODOS os dispositivos?')) return;
    
    setLoading(true);
    try {
      const response = await whatsappAdmin.disconnectAllDevices();
      if (response.success) {
        showMessage('Todos os dispositivos desconectados', 'success');
        loadWhatsAppData();
      } else {
        showMessage('Erro ao desconectar dispositivos', 'error');
      }
    } catch (error) {
      console.error('Erro ao desconectar dispositivos:', error);
      showMessage('Erro ao desconectar dispositivos', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Forçar reconexão
  const handleForceReconnect = async () => {
    setLoading(true);
    try {
      const response = await whatsappAdmin.forceReconnect();
      if (response.success) {
        showMessage('Reconexão forçada realizada', 'success');
        setTimeout(loadWhatsAppData, 3000); // Aguardar reconexão
      } else {
        showMessage('Erro na reconexão', 'error');
      }
    } catch (error) {
      console.error('Erro na reconexão:', error);
      showMessage('Erro na reconexão', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Limpar sessão
  const handleClearSession = async () => {
    if (!confirm('Tem certeza? Isso irá limpar completamente a sessão do WhatsApp.')) return;
    
    setLoading(true);
    try {
      const response = await whatsappAdmin.clearSession();
             if (response.success) {
         showMessage('Sessão limpa com sucesso', 'success');
         setStatus(null);
         setDevices([]);
         setQrCode(null);
         setQrCodeGeneratedAt(null);
         setQrCodeExpiresIn(null);
       } else {
        showMessage('Erro ao limpar sessão', 'error');
      }
    } catch (error) {
      console.error('Erro ao limpar sessão:', error);
      showMessage('Erro ao limpar sessão', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Testar mensagem
  const handleTestMessage = async () => {
    const telefone = prompt('Digite o número de telefone para teste (ex: 11999999999):');
    if (!telefone) return;

    setLoading(true);
    try {
      const response = await whatsappAdmin.testMessage(telefone, 'vez_chegou', {
        cliente: { nome: 'Cliente Teste' },
        barbearia: { nome: 'Lucas Barbearia' },
        posicao: 1,
        tempoEstimado: 15
      });
      
      if (response.success) {
        showMessage('Mensagem de teste enviada com sucesso!', 'success');
      } else {
        showMessage('Erro ao enviar mensagem de teste', 'error');
      }
    } catch (error) {
      console.error('Erro ao enviar mensagem de teste:', error);
      showMessage('Erro ao enviar mensagem de teste', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Mostrar mensagem
  const showMessage = (msg, type = 'info') => {
    setMessage(msg);
    setMessageType(type);
    setTimeout(() => setMessage(''), 5000);
  };

  // Formatar data
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('pt-BR');
  };

  // Calcular tempo restante do QR Code
  const getQRCodeRemainingTime = () => {
    if (!qrCodeGeneratedAt || !qrCodeExpiresIn) return null;
    
    const now = Date.now();
    const elapsed = Math.floor((now - qrCodeGeneratedAt) / 1000);
    const remaining = qrCodeExpiresIn - elapsed;
    
    return Math.max(0, remaining);
  };

  return (
    <div className="whatsapp-admin-panel p-6 space-y-6">
      {/* Botão Voltar */}
      <BackButton variant="admin-dashboard" />
      
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">📱 Administração WhatsApp</h2>
          <p className="text-gray-600">Gerencie a conexão e dispositivos do WhatsApp</p>
        </div>
        
        <div className="flex items-center space-x-3">
          <Button
            onClick={loadWhatsAppData}
            disabled={loading}
            variant="outline"
            size="sm"
            className="flex items-center space-x-2"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            <span>Atualizar</span>
          </Button>
          
          <Button
            onClick={() => setAutoRefresh(!autoRefresh)}
            variant={autoRefresh ? "default" : "outline"}
            size="sm"
          >
            {autoRefresh ? 'Auto ON' : 'Auto OFF'}
          </Button>
        </div>
      </div>

      {/* Mensagens */}
      {message && (
        <Alert variant={messageType === 'error' ? 'destructive' : 'default'}>
          {message}
        </Alert>
      )}

      {/* Status do WhatsApp */}
      <Card className="p-6">
                 <div className="flex items-center justify-between mb-4">
           <h3 className="text-lg font-semibold">Status do WhatsApp</h3>
           <Badge variant={status?.status === 'Conectado' ? "default" : "destructive"}>
             {status?.status || 'Desconectado'}
           </Badge>
         </div>
        
                 {status ? (
           <div className="space-y-4">
             <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                 <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                   <div className={`w-3 h-3 rounded-full ${status.status === 'Conectado' ? 'bg-green-500' : 'bg-red-500'}`} />
                   <div>
                     <p className="font-medium">Status</p>
                     <p className="text-sm text-gray-600">{status.status || 'Não informado'}</p>
                   </div>
                 </div>
                 
                 <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                   <Wifi className={`w-5 h-5 ${status.status === 'Conectado' ? 'text-green-500' : 'text-red-500'}`} />
                   <div>
                     <p className="font-medium">Conexão</p>
                     <p className="text-sm text-gray-600">
                       {status.status === 'Conectado' ? 'Ativa' : 'Inativa'}
                     </p>
                   </div>
                 </div>
               
               <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                 <Users className="w-5 h-5 text-purple-500" />
                 <div>
                   <p className="font-medium">Dispositivos</p>
                   <p className="text-sm text-gray-600">{devices.length} conectados</p>
                 </div>
               </div>
             </div>
           </div>
         ) : (
           <div className="text-center py-8">
             <LoadingSpinner />
             <p className="mt-2 text-gray-600">Carregando status...</p>
           </div>
         )}
      </Card>

             {/* QR Code */}
       {(!status || status.status === 'Desconectado' || !status.isReady) && (
         <Card className="p-6">
           <div className="text-center">
             <h3 className="text-lg font-semibold mb-4">Conectar WhatsApp</h3>
             <p className="text-sm text-gray-600 mb-4">
               {!status ? 'Carregando status...' : 'WhatsApp não está conectado. Gere um QR Code para conectar.'}
             </p>
             <Button
               onClick={generateQRCode}
               disabled={loading}
               className="mb-4"
             >
               <QrCode className="w-4 h-4 mr-2" />
               Gerar QR Code
             </Button>
             
                           {qrCode?.qrCode && (
                <div className="mt-4">
                  <img 
                    src={qrCode.qrCode} 
                    alt="QR Code WhatsApp" 
                    className="mx-auto border-2 border-gray-300 rounded-lg"
                    style={{ maxWidth: '300px' }}
                  />
                  <p className="mt-2 text-sm text-gray-600">{qrCode.message}</p>
                  
                  {/* Contador dinâmico */}
                  {(() => {
                    const remainingTime = getQRCodeRemainingTime();
                    if (remainingTime !== null) {
                      const minutes = Math.floor(remainingTime / 60);
                      const seconds = remainingTime % 60;
                      const timeString = `${minutes}:${seconds.toString().padStart(2, '0')}`;
                      
                      return (
                        <div className="mt-2">
                          <p className={`text-sm font-medium ${
                            remainingTime <= 10 ? 'text-red-600' : 
                            remainingTime <= 30 ? 'text-orange-600' : 'text-blue-600'
                          }`}>
                            ⏰ Expira em {timeString}
                          </p>
                          <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                            <div 
                              className={`h-2 rounded-full transition-all duration-1000 ${
                                remainingTime <= 10 ? 'bg-red-500' : 
                                remainingTime <= 30 ? 'bg-orange-500' : 'bg-blue-500'
                              }`}
                              style={{ 
                                width: `${Math.max(0, (remainingTime / qrCodeExpiresIn) * 100)}%` 
                              }}
                            />
                          </div>
                        </div>
                      );
                    }
                    return null;
                  })()}
                </div>
              )}
           </div>
         </Card>
       )}

      {/* Dispositivos Conectados */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">
            Dispositivos Conectados ({devices.length})
          </h3>
          {devices.length > 0 && (
            <Button
              onClick={handleDisconnectAll}
              variant="destructive"
              size="sm"
              disabled={loading}
            >
              <PowerOff className="w-4 h-4 mr-2" />
              Desconectar Todos
            </Button>
          )}
        </div>
        
        {devices.length > 0 ? (
          <div className="space-y-3">
            {devices.map(device => (
              <div key={device.id} className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-4 bg-gray-50 rounded-lg gap-3">
                <div className="flex items-center space-x-3 flex-1 min-w-0">
                  <Smartphone className="w-5 h-5 text-blue-500 flex-shrink-0" />
                  <div className="min-w-0 flex-1">
                    <h4 className="font-medium truncate">{device.name}</h4>
                    <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 text-sm text-gray-600 gap-1 sm:gap-0">
                      <span className="truncate">Plataforma: {device.platform}</span>
                      <span className={`flex items-center space-x-1 ${
                        device.isActive ? 'text-green-600' : 'text-red-600'
                      }`}>
                        <div className={`w-2 h-2 rounded-full flex-shrink-0 ${
                          device.isActive ? 'bg-green-500' : 'bg-red-500'
                        }`} />
                        <span className="truncate">{device.isActive ? 'Ativo' : 'Inativo'}</span>
                      </span>
                      <span className="flex items-center space-x-1">
                        <Clock className="w-3 h-3 flex-shrink-0" />
                        <span className="truncate">{formatDate(device.lastSeen)}</span>
                      </span>
                    </div>
                  </div>
                </div>
                
                <Button
                  onClick={() => handleDisconnectDevice(device.id)}
                  variant="outline"
                  size="sm"
                  disabled={loading}
                  className="whitespace-nowrap flex-shrink-0 w-full sm:w-auto"
                >
                  <PowerOff className="w-4 h-4 mr-1" />
                  <span className="hidden sm:inline">Desconectar</span>
                  <span className="sm:hidden">Desconectar</span>
                </Button>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-600">
            <WifiOff className="w-12 h-12 mx-auto mb-3 text-gray-400" />
            <p>Nenhum dispositivo conectado</p>
          </div>
        )}
      </Card>

      {/* Ações Administrativas */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Ações Administrativas</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Button
            onClick={handleForceReconnect}
            variant="outline"
            disabled={loading}
            className="flex items-center space-x-2"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Forçar Reconexão</span>
          </Button>
          
                     <Button
             onClick={handleTestMessage}
             variant="outline"
             disabled={loading || status?.status !== 'Conectado'}
             className="flex items-center space-x-2"
           >
             <MessageSquare className="w-4 h-4" />
             <span>Testar Mensagem</span>
           </Button>
          
          <Button
            onClick={handleClearSession}
            variant="destructive"
            disabled={loading}
            className="flex items-center space-x-2"
          >
            <Trash2 className="w-4 h-4" />
            <span>Limpar Sessão</span>
          </Button>
          
                     <Button
             onClick={loadWhatsAppData}
             variant="outline"
             disabled={loading}
             className="flex items-center space-x-2"
           >
             <RefreshCw className="w-4 h-4" />
             <span>Atualizar Dados</span>
           </Button>
        </div>
      </Card>

      {/* Loading Overlay */}
      {loading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg flex items-center space-x-3">
            <LoadingSpinner />
            <span>Processando...</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default WhatsAppAdminPanel; 