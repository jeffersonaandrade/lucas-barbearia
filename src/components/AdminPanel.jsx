import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.jsx';
import { Button } from '@/components/ui/button.jsx';
import { Badge } from '@/components/ui/badge.jsx';
import { 
  Download, 
  Upload, 
  RefreshCw, 
  Trash2, 
  Users, 
  Clock, 
  Star,
  Scissors,
  AlertCircle
} from 'lucide-react';
import { 
  getFilaData, 
  resetarDados, 
  exportarDados, 
  importarDados,
  obterEstatisticas 
} from '@/services/filaDataService.js';

const AdminPanel = () => {
  const [filaData, setFilaData] = useState(null);
  const [estatisticas, setEstatisticas] = useState({});
  const [loading, setLoading] = useState(false);

  const carregarDados = () => {
    const data = getFilaData();
    setFilaData(data);
    setEstatisticas(obterEstatisticas());
  };

  useEffect(() => {
    carregarDados();
  }, []);

  const handleReset = () => {
    if (window.confirm('Tem certeza que deseja resetar todos os dados da fila? Esta ação não pode ser desfeita.')) {
      setLoading(true);
      try {
        resetarDados();
        carregarDados();
        alert('Dados resetados com sucesso!');
      } catch (error) {
        alert('Erro ao resetar dados: ' + error.message);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleExport = () => {
    setLoading(true);
    try {
      exportarDados();
      alert('Dados exportados com sucesso!');
    } catch (error) {
      alert('Erro ao exportar dados: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleImport = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const success = importarDados(e.target.result);
          if (success) {
            carregarDados();
            alert('Dados importados com sucesso!');
          } else {
            alert('Erro ao importar dados. Verifique se o arquivo é válido.');
          }
        } catch (error) {
          alert('Erro ao importar dados: ' + error.message);
        }
      };
      reader.readAsText(file);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'atendendo': return 'bg-green-100 text-green-800';
      case 'próximo': return 'bg-yellow-100 text-yellow-800';
      case 'aguardando': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (!filaData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4 text-gray-400" />
          <p className="text-gray-600">Carregando dados...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Painel de Administração
          </h1>
          <p className="text-gray-600">
            Gerencie os dados da fila da Lucas Barbearia
          </p>
        </div>

        {/* Estatísticas */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <Users className="w-8 h-8 text-blue-600" />
                <div>
                  <p className="text-sm text-gray-600">Total na Fila</p>
                  <p className="text-2xl font-bold text-gray-900">{estatisticas.total}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <Scissors className="w-8 h-8 text-green-600" />
                <div>
                  <p className="text-sm text-gray-600">Atendendo</p>
                  <p className="text-2xl font-bold text-gray-900">{estatisticas.atendendo}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <Clock className="w-8 h-8 text-yellow-600" />
                <div>
                  <p className="text-sm text-gray-600">Tempo Médio</p>
                  <p className="text-2xl font-bold text-gray-900">{estatisticas.tempoMedio}min</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <Star className="w-8 h-8 text-purple-600" />
                <div>
                  <p className="text-sm text-gray-600">Avaliação</p>
                  <p className="text-2xl font-bold text-gray-900">{estatisticas.avaliacaoMedia}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Ações */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Button 
            onClick={carregarDados}
            disabled={loading}
            className="w-full"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Atualizar
          </Button>

          <Button 
            onClick={handleExport}
            disabled={loading}
            variant="outline"
            className="w-full"
          >
            <Download className="w-4 h-4 mr-2" />
            Exportar
          </Button>

          <label className="w-full">
            <input
              type="file"
              accept=".json"
              onChange={handleImport}
              className="hidden"
            />
            <Button 
              variant="outline"
              className="w-full"
              disabled={loading}
            >
              <Upload className="w-4 h-4 mr-2" />
              Importar
            </Button>
          </label>

          <Button 
            onClick={handleReset}
            disabled={loading}
            variant="destructive"
            className="w-full"
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Resetar
          </Button>
        </div>

        {/* Lista da Fila */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Users className="w-5 h-5" />
              <span>Fila Atual ({filaData.fila.length} clientes)</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {filaData.fila.length === 0 ? (
              <div className="text-center py-8">
                <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">Nenhum cliente na fila</p>
              </div>
            ) : (
              <div className="space-y-4">
                {filaData.fila.map((cliente) => (
                  <div 
                    key={cliente.id}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold">
                        {cliente.posicao}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">{cliente.nome}</p>
                        <p className="text-sm text-gray-600">{cliente.telefone}</p>
                        <p className="text-sm text-gray-500">{cliente.barbeiro}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Badge className={getStatusColor(cliente.status)}>
                        {cliente.status}
                      </Badge>
                      <div className="text-right">
                        <p className="text-sm text-gray-600">Tempo estimado</p>
                        <p className="font-semibold text-gray-900">{cliente.tempoEstimado}min</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Configurações */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Configurações</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-3">Barbeiros</h4>
                <div className="space-y-2">
                  {filaData.barbeiros.map((barbeiro) => (
                    <div key={barbeiro.id} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                      <span className="font-medium">{barbeiro.nome}</span>
                      <Badge variant={barbeiro.disponivel ? "default" : "secondary"}>
                        {barbeiro.disponivel ? "Disponível" : "Indisponível"}
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <h4 className="font-semibold mb-3">Configurações Gerais</h4>
                <div className="space-y-2">
                  <div className="flex justify-between p-3 bg-gray-50 rounded">
                    <span>Tempo médio por cliente</span>
                    <span className="font-medium">{filaData.configuracoes.tempoMedioPorCliente}min</span>
                  </div>
                  <div className="flex justify-between p-3 bg-gray-50 rounded">
                    <span>Máximo na fila</span>
                    <span className="font-medium">{filaData.configuracoes.maximoNaFila}</span>
                  </div>
                  <div className="flex justify-between p-3 bg-gray-50 rounded">
                    <span>Atualização automática</span>
                    <Badge variant={filaData.configuracoes.atualizacaoAutomatica ? "default" : "secondary"}>
                      {filaData.configuracoes.atualizacaoAutomatica ? "Ativada" : "Desativada"}
                    </Badge>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminPanel; 