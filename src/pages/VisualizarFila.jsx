import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Users, Clock, RefreshCw, Users2, Eye, MapPin, QrCode } from 'lucide-react';
import { Button } from '@/components/ui/button.jsx';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.jsx';
import { Badge } from '@/components/ui/badge.jsx';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select.jsx';
import { useFila } from '@/hooks/useFila.js';
import { getBarbeariaInfo } from '@/services/filaDataService.js';

const VisualizarFila = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [selectedBarbeariaId, setSelectedBarbeariaId] = useState(id ? parseInt(id) : 1);
  const [barbearias, setBarbearias] = useState([]);
  
  const { fila, loading, error, estatisticas, obterFilaAtual, barbeariaInfo } = useFila(selectedBarbeariaId);
  
  const [lastUpdate, setLastUpdate] = useState(new Date());

  // Carregar lista de barbearias
  useEffect(() => {
    const carregarBarbearias = () => {
      try {
        const barbeariasData = JSON.parse(localStorage.getItem('lucas_barbearia_barbearias_data'));
        if (barbeariasData && barbeariasData.barbearias) {
          setBarbearias(barbeariasData.barbearias);
        }
      } catch (error) {
        console.error('Erro ao carregar barbearias:', error);
      }
    };
    
    carregarBarbearias();
  }, []);

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
    navigate(`/qr-code/${selectedBarbeariaId}`);
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
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              Visualizar <span className="text-primary">Fila</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-6">
              Acompanhe a fila em tempo real sem precisar estar nela
            </p>
            
            {/* Seleção de Unidade */}
            <div className="max-w-md mx-auto mb-6">
              <label className="block text-sm font-medium text-foreground mb-2">
                Selecione a Unidade:
              </label>
              <Select value={selectedBarbeariaId.toString()} onValueChange={handleBarbeariaChange}>
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

            {/* Informação sobre QR Code */}
            <div className="max-w-md mx-auto mb-6 p-4 bg-amber-50 border border-amber-200 rounded-lg">
              <div className="flex items-center justify-center space-x-2">
                <QrCode className="w-5 h-5 text-amber-600" />
                <p className="text-sm text-amber-800 font-medium">
                  Para entrar na fila, escaneie o QR Code na barbearia
                </p>
              </div>
            </div>

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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            <Card className="bg-card border border-border shadow-lg">
              <CardContent className="p-6 text-center">
                <Users className="w-8 h-8 text-primary mx-auto mb-3" />
                <div className="text-3xl font-bold text-foreground mb-1">{estatisticas.total}</div>
                <div className="text-sm text-muted-foreground">Total na Fila</div>
              </CardContent>
            </Card>

            <Card className="bg-card border border-border shadow-lg">
              <CardContent className="p-6 text-center">
                <div className="w-8 h-8 bg-green-500 rounded-full mx-auto mb-3 flex items-center justify-center">
                  <Users2 className="w-5 h-5 text-white" />
                </div>
                <div className="text-3xl font-bold text-foreground mb-1">{estatisticas.atendendo}</div>
                <div className="text-sm text-muted-foreground">Atendendo</div>
              </CardContent>
            </Card>

            <Card className="bg-card border border-border shadow-lg">
              <CardContent className="p-6 text-center">
                <div className="w-8 h-8 bg-yellow-500 rounded-full mx-auto mb-3 flex items-center justify-center">
                  <Users2 className="w-5 h-5 text-white" />
                </div>
                <div className="text-3xl font-bold text-foreground mb-1">{estatisticas.proximo}</div>
                <div className="text-sm text-muted-foreground">Próximo</div>
              </CardContent>
            </Card>

            <Card className="bg-card border border-border shadow-lg">
              <CardContent className="p-6 text-center">
                <Clock className="w-8 h-8 text-primary mx-auto mb-3" />
                <div className="text-3xl font-bold text-foreground mb-1">{estatisticas.tempoMedio}</div>
                <div className="text-sm text-muted-foreground">Min. Médio</div>
              </CardContent>
            </Card>
          </div>

          {/* Próximo na Fila */}
          {fila.filter(p => p.status === 'próximo').length > 0 && (
            <Card className="bg-card border border-border shadow-lg mb-8">
              <CardHeader>
                <CardTitle className="text-foreground">Próximo na Fila</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {fila
                    .filter(pessoa => pessoa.status === 'próximo')
                    .map((pessoa) => (
                      <div key={pessoa.id} className="flex items-center space-x-4 p-4 bg-secondary rounded-lg">
                        <div className="w-10 h-10 bg-yellow-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                          {pessoa.posicao}
                        </div>
                        <div>
                          <p className="font-semibold text-foreground">{pessoa.nome}</p>
                          <p className="text-sm text-muted-foreground">{pessoa.barbeiro}</p>
                          <p className="text-xs text-muted-foreground">{pessoa.tempoEstimado} min</p>
                        </div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Lista Completa da Fila */}
          <Card className="bg-card border border-border shadow-lg mb-8">
            <CardHeader>
              <CardTitle className="text-foreground">Fila Completa</CardTitle>
            </CardHeader>
            <CardContent>
              {fila.length === 0 ? (
                <div className="text-center py-12">
                  <Users className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-foreground mb-2">Fila Vazia</h3>
                  <p className="text-muted-foreground">Não há ninguém na fila no momento.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {fila.map((pessoa) => (
                    <div
                      key={pessoa.id}
                      className="flex items-center justify-between p-4 rounded-lg bg-secondary hover:bg-secondary/80 transition-colors"
                    >
                      <div className="flex items-center space-x-4">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-white ${
                          pessoa.status === 'atendendo' ? 'bg-green-500' :
                          pessoa.status === 'próximo' ? 'bg-yellow-500' :
                          'bg-gray-500'
                        }`}>
                          {pessoa.posicao}
                        </div>
                        <div>
                          <p className="font-semibold text-foreground">{pessoa.nome}</p>
                          <p className="text-sm text-muted-foreground">{pessoa.barbeiro}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Badge className={`${getStatusColor(pessoa.status)} text-white`}>
                          {getStatusText(pessoa.status)}
                        </Badge>
                        <div className="text-right">
                          <p className="text-sm font-semibold text-foreground">{pessoa.tempoEstimado} min</p>
                          <p className="text-xs text-muted-foreground">estimado</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Informação de Atualização */}
          <div className="text-center">
            <p className="text-sm text-muted-foreground">
              A fila é atualizada automaticamente a cada 10 segundos
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VisualizarFila; 
 