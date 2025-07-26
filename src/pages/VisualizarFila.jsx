import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Users, Clock, RefreshCw, Users2, Eye, MapPin, UserCheck, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button.jsx';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.jsx';
import { Badge } from '@/components/ui/badge.jsx';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select.jsx';
import { Alert, AlertDescription } from '@/components/ui/alert.jsx';
import { useFilaBackend } from '@/hooks/useFilaBackend.js';
import { useClienteToken } from '@/hooks/useClienteToken.js';
import { barbeariasService } from '@/services/api.js';
import { FilaList } from '@/components/ui/fila-list.jsx';
import { FilaStats } from '@/components/ui/fila-stats.jsx';
import { useFilaStats } from '@/hooks/useFilaStats.js';

const VisualizarFila = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [selectedBarbeariaId, setSelectedBarbeariaId] = useState(id ? parseInt(id) : null);
  const [barbearias, setBarbearias] = useState([]);
  const [pageError, setPageError] = useState(null);
  
  const { fila, loading, error: filaError, estatisticas: estatisticasAPI, obterFilaAtual, barbeariaInfo, clienteAtual, barbeiros } = useFilaBackend(selectedBarbeariaId);
  
  // Usar hook customizado para estatísticas
  const estatisticas = useFilaStats(fila, estatisticasAPI);
  const { hasToken, getStatusFilaUrl } = useClienteToken();
  
  // Debug logs
  useEffect(() => {
    console.log('🔍 DEBUG VisualizarFila:');
    console.log('📍 selectedBarbeariaId:', selectedBarbeariaId);
    console.log('👥 fila:', fila);
    console.log('👨‍💼 barbeiros:', barbeiros);
    console.log('📊 estatisticas:', estatisticas);
    console.log('🏪 barbeariaInfo:', barbeariaInfo);
    console.log('⏳ loading:', loading);
    console.log('❌ error:', filaError);
  }, [selectedBarbeariaId, fila, barbeiros, estatisticas, barbeariaInfo, loading, filaError]);
  
  const [lastUpdate, setLastUpdate] = useState(new Date());
  const [showRedirectAlert, setShowRedirectAlert] = useState(false);

  // Verificar se o cliente tem token cadastrado e redirecionar
  useEffect(() => {
    if (hasToken) {
      console.log('🔍 Cliente com token encontrado, mostrando alerta de redirecionamento...');
      setShowRedirectAlert(true);
    }
  }, [hasToken]);

  // Carregar lista de barbearias do backend
  useEffect(() => {
    const carregarBarbearias = async () => {
      try {
        console.log('🔄 Carregando barbearias do backend...');
        const response = await barbeariasService.listarBarbearias();
        console.log('📦 Response das barbearias:', response);
        
        // Extrair dados da resposta
        const barbeariasData = response.data || response;
        const barbeariasArray = Array.isArray(barbeariasData) ? barbeariasData : [];
        
        console.log('🏪 Barbearias encontradas:', barbeariasArray);
        setBarbearias(barbeariasArray);
        
        // Se não há barbearia selecionada ou a barbearia não existe, usar a primeira disponível
        if (!selectedBarbeariaId || !barbeariasArray.find(b => b.id === selectedBarbeariaId)) {
          if (barbeariasArray.length > 0) {
            const primeiraBarbearia = barbeariasArray[0];
            console.log('✅ Usando primeira barbearia disponível:', primeiraBarbearia);
            setSelectedBarbeariaId(primeiraBarbearia.id);
            
            // Atualizar a URL para refletir a barbearia correta
            window.history.replaceState(null, '', `/barbearia/${primeiraBarbearia.id}/visualizar-fila`);
          } else {
            console.error('❌ Nenhuma barbearia encontrada no backend');
            setPageError('Nenhuma barbearia disponível no momento.');
          }
        }
      } catch (error) {
        console.error('❌ Erro ao carregar barbearias:', error);
        setBarbearias([]);
        setPageError('Erro ao carregar barbearias. Tente novamente.');
      }
    };
    
    carregarBarbearias();
  }, []); // Remover selectedBarbeariaId da dependência para evitar loop infinito

  // Atualização automática a cada 10 segundos
  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        await obterFilaAtual();
        setLastUpdate(new Date());
      } catch (err) {
        console.error('Erro ao atualizar fila:', err);
      }
    }, 10000);

    return () => clearInterval(interval);
  }, [obterFilaAtual, selectedBarbeariaId]);

  const handleManualRefresh = async () => {
    try {
      await obterFilaAtual();
      setLastUpdate(new Date());
    } catch (err) {
      console.error('Erro ao atualizar fila:', err);
    }
  };

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

  const formatTime = (date) => {
    return date.toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const handleBarbeariaChange = (barbeariaId) => {
    setSelectedBarbeariaId(parseInt(barbeariaId));
    // Atualizar URL sem recarregar a página
    navigate(`/barbearia/${barbeariaId}/visualizar-fila`, { replace: true });
  };

  const handleEntrarNaFila = () => {
    navigate(`/barbearia/${selectedBarbeariaId}/entrar-fila`);
  };

  const handleInformacoesUnidade = () => {
    navigate(`/barbearia/${selectedBarbeariaId}/entrar-fila`);
  };

  const handleIrParaMinhaFila = () => {
    const statusUrl = getStatusFilaUrl();
    if (statusUrl) {
      navigate(statusUrl);
    }
  };

  const handleContinuarVisualizando = () => {
    setShowRedirectAlert(false);
  };

  // Tratamento de erro
  if (pageError) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white flex items-center justify-center p-4">
        <Card className="w-full max-w-md bg-card border border-border shadow-lg">
          <CardContent className="p-8 text-center">
            <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-foreground mb-2">Erro ao Carregar</h2>
            <p className="text-muted-foreground mb-4">{pageError}</p>
            <Button
              onClick={() => window.location.reload()}
              className="bg-primary text-primary-foreground hover:bg-accent"
            >
              Tentar Novamente
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Estado de loading
  if (loading && !barbeariaInfo) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white flex items-center justify-center p-4">
        <Card className="w-full max-w-md bg-card border border-border shadow-lg">
          <CardContent className="p-8 text-center">
            <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <h2 className="text-2xl font-bold text-foreground mb-2">Carregando...</h2>
            <p className="text-muted-foreground">Aguarde enquanto carregamos as informações da fila.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      {/* Debug info */}
      <div className="fixed top-4 right-4 bg-black text-white p-2 rounded text-xs z-50">
        <div>ID: {selectedBarbeariaId}</div>
        <div>Loading: {loading ? 'true' : 'false'}</div>
        <div>Error: {filaError || 'none'}</div>
        <div>Fila: {fila?.length || 0}</div>
        <div>Barbeiros: {barbeiros?.length || 0}</div>
      </div>

      {/* Alerta de redirecionamento para clientes com token */}
      {showRedirectAlert && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-md bg-card border border-border shadow-lg">
            <CardHeader className="text-center">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <UserCheck className="w-6 h-6 text-primary" />
              </div>
              <CardTitle className="text-foreground">Você está na fila!</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Alert className="border-primary bg-primary/10">
                <UserCheck className="h-4 w-4 text-primary" />
                <AlertDescription className="text-foreground">
                  Detectamos que você já está cadastrado na fila. Deseja ver o status da sua fila pessoal?
                </AlertDescription>
              </Alert>
              
              <div className="flex space-x-3">
                <Button
                  onClick={handleIrParaMinhaFila}
                  className="flex-1 bg-primary text-primary-foreground hover:bg-accent"
                >
                  <UserCheck className="w-4 h-4 mr-2" />
                  Minha Fila
                </Button>
                <Button
                  onClick={handleContinuarVisualizando}
                  variant="outline"
                  className="flex-1 border-foreground text-foreground hover:bg-foreground hover:text-background"
                >
                  <Eye className="w-4 h-4 mr-2" />
                  Continuar
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

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
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              Visualizar <span className="text-primary">Fila</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-6">
              Acompanhe a fila em tempo real sem precisar estar nela
            </p>
            
            {/* Informações da Barbearia */}
            {barbeariaInfo && (
              <div className="max-w-md mx-auto mb-6 p-4 bg-primary/10 border border-primary/20 rounded-lg">
                <div className="flex items-center justify-center space-x-2">
                  <MapPin className="w-5 h-5 text-primary" />
                  <p className="text-lg font-semibold text-foreground">
                    {barbeariaInfo.nome}
                  </p>
                </div>
              </div>
            )}
            
            {/* Seleção de Unidade */}
            <div className="max-w-md mx-auto mb-6">
              <label className="block text-sm font-medium text-foreground mb-2">
                Selecione a Unidade:
              </label>
              <Select value={selectedBarbeariaId ? selectedBarbeariaId.toString() : ''} onValueChange={handleBarbeariaChange}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Escolha uma unidade" />
                </SelectTrigger>
                <SelectContent>
                  {barbearias.map((barbearia) => (
                    <SelectItem key={barbearia.id} value={barbearia.id.toString()}>
                      <div className="flex items-center">
                        <MapPin className="w-4 h-4 mr-2 text-muted-foreground" />
                        {barbearia.nome}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>



            {/* Botão para clientes com token */}
            {hasToken && (
              <div className="max-w-md mx-auto mb-6">
                <Button
                  onClick={handleIrParaMinhaFila}
                  className="w-full bg-primary text-primary-foreground hover:bg-accent"
                >
                  <UserCheck className="w-4 h-4 mr-2" />
                  Ver Minha Fila
                </Button>
              </div>
            )}

            <div className="flex items-center justify-center space-x-4 text-sm text-muted-foreground">
              <Eye className="w-4 h-4" />
              <span>Última atualização: {formatTime(lastUpdate)}</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleManualRefresh}
                disabled={loading}
                className="text-primary hover:text-accent"
              >
                <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                Atualizar
              </Button>
            </div>
          </div>

          {/* Estatísticas */}
          <FilaStats
            estatisticas={estatisticas}
            title=""
            showTotal={true}
            showAguardando={true}
            showAtendendo={false}
            showProximo={false}
            showTempoMedio={true}
            showBarbeirosDisponiveis={true}
            variant="default"
            className="mb-12"
          />

          {/* Barbeiros Disponíveis */}
          <Card className="bg-card border border-border shadow-lg mb-8">
            <CardHeader>
              <CardTitle className="text-foreground">Barbeiros Disponíveis</CardTitle>
            </CardHeader>
            <CardContent>
              {!barbeiros || barbeiros.length === 0 ? (
                <div className="text-center py-8">
                  <Users className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                  <p className="text-muted-foreground mb-2">Nenhum barbeiro disponível no momento.</p>
                  
                  {barbeariaInfo && barbeariaInfo.horario && (
                    <div className="mt-4 p-4 bg-amber-50 border border-amber-200 rounded-lg">
                      <h4 className="font-semibold text-amber-800 mb-2">Horário de Funcionamento:</h4>
                      <div className="text-sm text-amber-700 space-y-1">
                        {Object.entries(barbeariaInfo.horario)
                          .sort(([a], [b]) => {
                            const ordem = ['domingo', 'segunda', 'terca', 'quarta', 'quinta', 'sexta', 'sabado'];
                            return ordem.indexOf(a) - ordem.indexOf(b);
                          })
                          .map(([dia, horario]) => (
                            <div key={dia} className="flex justify-between">
                              <span className="capitalize">{dia}:</span>
                              <span>
                                {horario.aberto ? 
                                  `${horario.inicio} - ${horario.fim}` : 
                                  'Fechado'
                                }
                              </span>
                            </div>
                          ))}
                      </div>
                    </div>
                  )}
                  
                  <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-sm text-red-800 mb-3">
                      <strong>Barbearia Fechada:</strong> Não há barbeiros disponíveis no momento.
                    </p>
                    <p className="text-xs text-red-700">
                      Volte mais tarde quando houver barbeiros ativos.
                    </p>
                  </div>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {barbeiros.map((barbeiro) => (
                      <div key={barbeiro.id} className="flex items-center space-x-4 p-4 bg-secondary rounded-lg">
                        <div className="w-12 h-12 bg-primary text-white rounded-full flex items-center justify-center text-sm font-bold">
                          {barbeiro.nome.charAt(0)}
                        </div>
                        <div>
                          <p className="font-semibold text-foreground">{barbeiro.nome}</p>
                          <p className="text-sm text-muted-foreground">{barbeiro.especialidade}</p>
                          <p className="text-xs text-muted-foreground">
                            {barbeiro.horario_inicio} - {barbeiro.horario_fim}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                                  <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg text-center">
                  <p className="text-sm text-green-800 mb-3">
                    <strong>Seja bem vindo!</strong> Clique aqui para entrar na fila
                  </p>
                  <Button
                    onClick={handleEntrarNaFila}
                    className="bg-primary text-primary-foreground hover:bg-accent"
                  >
                    Entrar na Fila
                  </Button>
                </div>
                </>
              )}
            </CardContent>
          </Card>



          {/* Lista de Clientes Aguardando */}
          <FilaList
            fila={fila || []}
            title="Clientes Aguardando"
            filterStatus="aguardando"
            showBarbeiro={true}
            showPosition={true}
            showTime={true}
            showStatus={true}
            showActions={false}
            emptyMessage="Não há clientes aguardando no momento."
            loading={loading}
            className="mb-8"
          />

          {/* Informação de Atualização */}
          <div className="text-center">
            <p className="text-sm text-muted-foreground">
              A lista de clientes aguardando é atualizada automaticamente a cada 10 segundos
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VisualizarFila; 
 