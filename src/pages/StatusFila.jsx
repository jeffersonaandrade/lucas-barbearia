import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Users, Clock, RefreshCw, Bell, LogOut, AlertTriangle, CheckCircle, Star } from 'lucide-react';
import { Button } from '@/components/ui/button.jsx';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.jsx';
import { Alert, AlertDescription } from '@/components/ui/alert.jsx';
import { Badge } from '@/components/ui/badge.jsx';
import { useFilaBackend } from '@/hooks/useFilaBackend.js';

const StatusFila = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { 
    clienteAtual, 
    fila, 
    loading, 
    error, 
    estatisticas, 
    sairDaFila, 
    atualizarPosicao,
    barbeariaInfo
  } = useFilaBackend(parseInt(id));
  
  const [showConfirmSair, setShowConfirmSair] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);

  // Verificar se o cliente está na fila
  useEffect(() => {
    console.log('🔍 StatusFila - Verificando cliente atual:', clienteAtual);
    console.log('🔍 StatusFila - Token no localStorage:', localStorage.getItem('fila_token'));
    console.log('🔍 StatusFila - Cliente data no localStorage:', localStorage.getItem('cliente_data'));
    console.log('🔍 StatusFila - Barbearia ID no localStorage:', localStorage.getItem('fila_barbearia_id'));
    
    if (!clienteAtual) {
      console.log('⚠️ Cliente não encontrado, aguardando carregamento...');
      // Dar mais tempo para carregar os dados e verificar novamente
      const timeout = setTimeout(() => {
        const token = localStorage.getItem('fila_token');
        const clienteData = localStorage.getItem('cliente_data');
        const barbeariaId = localStorage.getItem('fila_barbearia_id');
        
        console.log('⏰ Timeout - Verificando novamente:');
        console.log('🎫 Token:', token);
        console.log('📋 Cliente data:', clienteData);
        console.log('🏪 Barbearia ID:', barbeariaId);
        
        if (!token || !clienteData || !barbeariaId) {
          console.log('❌ Dados insuficientes, redirecionando para home...');
          navigate('/');
        }
      }, 5000); // 5 segundos para dar tempo de carregar
      
      return () => clearTimeout(timeout);
    }
  }, [clienteAtual, navigate]);

  // Atualização automática a cada 30 segundos
  useEffect(() => {
    const interval = setInterval(() => {
      if (clienteAtual?.token) {
        atualizarPosicao(clienteAtual.token);
      }
    }, 30000);

    return () => clearInterval(interval);
  }, [clienteAtual, atualizarPosicao]);

  const handleSairFila = async () => {
    try {
      await sairDaFila(clienteAtual.token);
      navigate('/');
    } catch (err) {
      console.error('Erro ao sair da fila:', err);
    }
  };

  const handleAtualizarPosicao = async () => {
    if (clienteAtual?.token) {
      await atualizarPosicao(clienteAtual.token);
    }
  };

  const handleEnableNotifications = () => {
    if ('Notification' in window) {
      Notification.requestPermission().then(permission => {
        if (permission === 'granted') {
          setNotificationsEnabled(true);
          new Notification('Notificações ativadas!', {
            body: 'Você será notificado quando for sua vez.',
            icon: '/favicon.ico'
          });
        }
      });
    }
  };

  // Tratamento de erro
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white flex items-center justify-center">
        <Card className="w-full max-w-md bg-card border border-border shadow-lg">
          <CardContent className="p-8 text-center">
            <AlertTriangle className="w-16 h-16 text-destructive mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-foreground mb-2">Erro ao Carregar</h2>
            <p className="text-muted-foreground mb-4">{error}</p>
            <Button onClick={() => window.location.reload()}>
              Tentar Novamente
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Estado de loading
  if (loading && !clienteAtual) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white flex items-center justify-center">
        <Card className="w-full max-w-md bg-card border border-border shadow-lg">
          <CardContent className="p-8 text-center">
            <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <h2 className="text-2xl font-bold text-foreground mb-2">Carregando...</h2>
            <p className="text-muted-foreground">Aguarde enquanto carregamos suas informações.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!clienteAtual) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white flex items-center justify-center">
        <Card className="w-full max-w-md bg-card border border-border shadow-lg">
          <CardContent className="p-8 text-center">
            <AlertTriangle className="w-16 h-16 text-destructive mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-foreground mb-2">Cliente não encontrado</h2>
            <p className="text-muted-foreground mb-4">
              Você não está na fila ou sua sessão expirou.
            </p>
            <Button onClick={() => navigate('/')}>
              Voltar ao Início
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'atendendo': return 'bg-green-500';
      case 'próximo': return 'bg-yellow-500';
      case 'aguardando': return 'bg-gray-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'atendendo': return 'Atendendo';
      case 'próximo': return 'Próximo';
      case 'aguardando': return 'Aguardando';
      default: return 'Desconhecido';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      {/* Header */}
      <div className="container mx-auto px-4 py-8">
        <Button
          variant="ghost"
          onClick={() => navigate('/')}
          className="text-primary hover:text-accent mb-8"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Voltar ao Início
        </Button>

        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              Status da <span className="text-primary">Fila</span>
            </h1>
            <p className="text-xl text-muted-foreground">
              Acompanhe sua posição em tempo real
            </p>
          </div>

          {/* Status Centralizado */}
          <div className="flex justify-center mb-8 px-4">
            <Card className="bg-card border border-border shadow-lg max-w-2xl w-full">
              <CardHeader className="text-center">
                <CardTitle className="text-foreground text-2xl">Seu Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center p-6 bg-secondary rounded-lg">
                    <div className="text-5xl font-bold text-primary mb-2">
                      {clienteAtual.posicao}º
                    </div>
                    <div className="text-sm text-muted-foreground">Posição</div>
                  </div>
                  <div className="text-center p-6 bg-secondary rounded-lg">
                    <div className="text-5xl font-bold text-primary mb-2">
                      {clienteAtual.tempoEstimado}
                    </div>
                    <div className="text-sm text-muted-foreground">Minutos</div>
                  </div>
                  <div className="text-center p-6 bg-secondary rounded-lg flex flex-col items-center justify-center">
                    <Badge className={`${getStatusColor(clienteAtual.status)} text-white text-lg px-4 py-2 mb-2`}>
                      {getStatusText(clienteAtual.status)}
                    </Badge>
                    <div className="text-sm text-muted-foreground">Status</div>
                  </div>
                </div>

                {/* Alerta especial para posição 1 */}
                {clienteAtual.posicao === 1 && (
                  <Alert className="mt-6 border-primary bg-primary/10">
                    <CheckCircle className="h-4 w-4 text-primary" />
                    <AlertDescription className="text-foreground">
                      <strong>É sua vez!</strong> {
                        clienteAtual.barbeiro && clienteAtual.barbeiro !== 'Geral' 
                          ? `Dirija-se ao balcão do barbeiro ${clienteAtual.barbeiro}!`
                          : 'Dirija-se ao balcão do próximo barbeiro disponível!'
                      }
                    </AlertDescription>
                  </Alert>
                )}

                {/* Botão de avaliação após atendimento */}
                {clienteAtual.posicao === 0 && (
                  <Alert className="mt-6 border-green-500 bg-green-50">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <AlertDescription className="text-foreground">
                      <div className="flex items-center justify-between">
                        <span>
                          <strong>Atendimento concluído!</strong> {
                            clienteAtual.barbeiro && clienteAtual.barbeiro !== 'Geral'
                              ? `Como foi sua experiência com o ${clienteAtual.barbeiro}?`
                              : 'Como foi sua experiência?'
                          }
                        </span>
                        <Button
                          onClick={() => navigate(`/barbearia/${id}/avaliacao`)}
                          size="sm"
                          className="bg-green-600 text-white hover:bg-green-700 ml-4"
                        >
                          <Star className="w-4 h-4 mr-1" />
                          Avaliar
                        </Button>
                      </div>
                    </AlertDescription>
                  </Alert>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Informações do Cliente */}
            <div className="lg:col-span-1">
              <Card className="bg-card border border-border shadow-lg mb-6">
                <CardHeader>
                  <CardTitle className="text-foreground">Seus Dados</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Nome</p>
                    <p className="font-semibold text-foreground">{clienteAtual.nome}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Telefone</p>
                    <p className="font-semibold text-foreground">{clienteAtual.telefone}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Barbeiro</p>
                    <p className="font-semibold text-foreground">{clienteAtual.barbeiro}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Token</p>
                    <p className="font-mono text-xs text-primary bg-secondary p-2 rounded">
                      {clienteAtual.token}
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Ações */}
              <Card className="bg-card border border-border shadow-lg">
                <CardHeader>
                  <CardTitle className="text-foreground">Ações</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button
                    onClick={handleAtualizarPosicao}
                    disabled={loading}
                    className="w-full bg-primary text-primary-foreground hover:bg-accent"
                  >
                    <RefreshCw className="w-4 h-4 mr-2" />
                    {loading ? 'Atualizando...' : 'Atualizar Posição'}
                  </Button>

                  <Button
                    onClick={handleEnableNotifications}
                    variant="outline"
                    className="w-full border-primary text-primary hover:bg-primary hover:text-primary-foreground"
                    disabled={notificationsEnabled}
                  >
                    <Bell className="w-4 h-4 mr-2" />
                    {notificationsEnabled ? 'Notificações Ativas' : 'Ativar Notificações'}
                  </Button>

                  <Button
                    onClick={() => setShowConfirmSair(true)}
                    variant="outline"
                    className="w-full border-foreground text-foreground hover:bg-foreground hover:text-background font-semibold"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Sair da Fila
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Status e Fila */}
            <div className="lg:col-span-2 space-y-6">
              {/* Lista da Fila */}
              <Card className="bg-card border border-border shadow-lg">
                <CardHeader>
                  <CardTitle className="text-foreground">Fila Atual</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {fila.map((pessoa, index) => (
                      <div
                        key={pessoa.id}
                        className={`flex items-center justify-between p-4 rounded-lg ${
                          pessoa.token === clienteAtual.token
                            ? 'bg-primary/20 border border-primary/40'
                            : 'bg-secondary'
                        }`}
                      >
                        <div className="flex items-center space-x-4">
                          <div className="w-8 h-8 bg-gray-200 text-gray-800 rounded-full flex items-center justify-center text-sm font-bold">
                            {pessoa.posicao}
                          </div>
                          <div>
                            <p className="font-semibold text-foreground">
                              {pessoa.nome}
                              {pessoa.token === clienteAtual.token && (
                                <span className="ml-2 text-xs text-primary">(Você)</span>
                              )}
                            </p>
                            <p className="text-sm text-muted-foreground">{pessoa.barbeiro}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge className={`${getStatusColor(pessoa.status)} text-white`}>
                            {getStatusText(pessoa.status)}
                          </Badge>
                          <span className="text-sm text-muted-foreground">
                            {pessoa.tempoEstimado} min
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Estatísticas */}
              <Card className="bg-card border border-border shadow-lg">
                <CardHeader>
                  <CardTitle className="text-foreground">Estatísticas Gerais</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center p-4 bg-secondary rounded-lg">
                      <Users className="w-6 h-6 text-primary mx-auto mb-2" />
                      <div className="text-lg font-bold text-foreground">{estatisticas.total}</div>
                      <div className="text-xs text-muted-foreground">Total</div>
                    </div>
                    <div className="text-center p-4 bg-secondary rounded-lg">
                      <CheckCircle className="w-6 h-6 text-green-500 mx-auto mb-2" />
                      <div className="text-lg font-bold text-foreground">{estatisticas.atendendo}</div>
                      <div className="text-xs text-muted-foreground">Atendendo</div>
                    </div>
                    <div className="text-center p-4 bg-secondary rounded-lg">
                      <AlertTriangle className="w-6 h-6 text-yellow-500 mx-auto mb-2" />
                      <div className="text-lg font-bold text-foreground">{estatisticas.proximo}</div>
                      <div className="text-xs text-muted-foreground">Próximo</div>
                    </div>
                    <div className="text-center p-4 bg-secondary rounded-lg">
                      <Clock className="w-6 h-6 text-primary mx-auto mb-2" />
                      <div className="text-lg font-bold text-foreground">{estatisticas.tempoMedio}</div>
                      <div className="text-xs text-muted-foreground">Min. médio</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* Modal de confirmação para sair da fila */}
      {showConfirmSair && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-md bg-card border border-border shadow-lg">
            <CardHeader className="text-center">
              <CardTitle className="text-foreground">Confirmar Saída da Fila</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-center">
                <LogOut className="w-12 h-12 text-foreground mx-auto mb-4" />
                <p className="text-foreground font-medium mb-2">
                  Tem certeza que deseja sair da fila?
                </p>
                <p className="text-muted-foreground text-sm">
                  Esta ação não pode ser desfeita.
                </p>
              </div>
              <div className="flex space-x-4">
                <Button
                  onClick={handleSairFila}
                  className="flex-1 bg-foreground text-background hover:bg-foreground/90 font-semibold"
                >
                  Sim, Sair da Fila
                </Button>
                <Button
                  onClick={() => setShowConfirmSair(false)}
                  variant="outline"
                  className="flex-1 border-foreground text-foreground hover:bg-foreground hover:text-background"
                >
                  Cancelar
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default StatusFila; 