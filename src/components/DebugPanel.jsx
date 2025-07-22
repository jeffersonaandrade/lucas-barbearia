import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.jsx';
import { Button } from '@/components/ui/button.jsx';
import { 
  getFilaData, 
  getBarbeariaData, 
  getBarbeariaInfo, 
  inicializarDados, 
  resetarDados,
  limparLocalStorage
} from '@/services/filaDataService.js';

const DebugPanel = () => {
  const [debugData, setDebugData] = useState({});
  const [loading, setLoading] = useState(false);

  const carregarDadosDebug = () => {
    setLoading(true);
    try {
      const filaData = getFilaData();
      const barbearia1 = getBarbeariaData(1);
      const barbearia2 = getBarbeariaData(2);
      const barbearia3 = getBarbeariaData(3);
      const info1 = getBarbeariaInfo(1);
      const info2 = getBarbeariaInfo(2);
      const info3 = getBarbeariaInfo(3);

      setDebugData({
        filaData,
        barbearia1,
        barbearia2,
        barbearia3,
        info1,
        info2,
        info3,
        localStorage: {
          fila: localStorage.getItem('lucas_barbearia_fila_data'),
          barbearias: localStorage.getItem('lucas_barbearia_barbearias_data')
        }
      });
    } catch (error) {
      console.error('Erro no debug:', error);
      setDebugData({ error: error.message });
    } finally {
      setLoading(false);
    }
  };

  const handleInicializar = () => {
    setLoading(true);
    try {
      inicializarDados();
      setTimeout(carregarDadosDebug, 1000);
    } catch (error) {
      console.error('Erro ao inicializar:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleResetar = () => {
    setLoading(true);
    try {
      resetarDados();
      setTimeout(carregarDadosDebug, 1000);
    } catch (error) {
      console.error('Erro ao resetar:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    carregarDadosDebug();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Painel de Debug
          </h1>
          <p className="text-gray-600">
            Verificar dados do sistema
          </p>
        </div>

        <div className="flex gap-4 mb-6">
          <Button onClick={carregarDadosDebug} disabled={loading}>
            Recarregar Dados
          </Button>
          <Button onClick={handleInicializar} disabled={loading} variant="outline">
            Inicializar Dados
          </Button>
          <Button onClick={handleResetar} disabled={loading} variant="destructive">
            Resetar Dados
          </Button>
          <Button 
            onClick={() => {
              limparLocalStorage();
              setTimeout(carregarDadosDebug, 1000);
            }} 
            disabled={loading} 
            variant="destructive"
          >
            Limpar localStorage
          </Button>
        </div>

        {loading && (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p>Carregando...</p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Dados da Fila */}
          <Card>
            <CardHeader>
              <CardTitle>Dados da Fila</CardTitle>
            </CardHeader>
            <CardContent>
              <pre className="text-xs bg-gray-100 p-4 rounded overflow-auto max-h-96">
                {JSON.stringify(debugData.filaData, null, 2)}
              </pre>
            </CardContent>
          </Card>

          {/* Barbearia 1 */}
          <Card>
            <CardHeader>
              <CardTitle>Barbearia 1 - Dados</CardTitle>
            </CardHeader>
            <CardContent>
              <pre className="text-xs bg-gray-100 p-4 rounded overflow-auto max-h-96">
                {JSON.stringify(debugData.barbearia1, null, 2)}
              </pre>
            </CardContent>
          </Card>

          {/* Barbearia 1 - Info */}
          <Card>
            <CardHeader>
              <CardTitle>Barbearia 1 - Info</CardTitle>
            </CardHeader>
            <CardContent>
              <pre className="text-xs bg-gray-100 p-4 rounded overflow-auto max-h-96">
                {JSON.stringify(debugData.info1, null, 2)}
              </pre>
            </CardContent>
          </Card>

          {/* Barbearia 2 */}
          <Card>
            <CardHeader>
              <CardTitle>Barbearia 2 - Dados</CardTitle>
            </CardHeader>
            <CardContent>
              <pre className="text-xs bg-gray-100 p-4 rounded overflow-auto max-h-96">
                {JSON.stringify(debugData.barbearia2, null, 2)}
              </pre>
            </CardContent>
          </Card>

          {/* Barbearia 3 */}
          <Card>
            <CardHeader>
              <CardTitle>Barbearia 3 - Dados</CardTitle>
            </CardHeader>
            <CardContent>
              <pre className="text-xs bg-gray-100 p-4 rounded overflow-auto max-h-96">
                {JSON.stringify(debugData.barbearia3, null, 2)}
              </pre>
            </CardContent>
          </Card>

          {/* localStorage */}
          <Card>
            <CardHeader>
              <CardTitle>localStorage</CardTitle>
            </CardHeader>
            <CardContent>
              <pre className="text-xs bg-gray-100 p-4 rounded overflow-auto max-h-96">
                {JSON.stringify(debugData.localStorage, null, 2)}
              </pre>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default DebugPanel; 