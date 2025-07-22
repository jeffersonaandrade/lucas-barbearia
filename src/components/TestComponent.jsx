import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button.jsx';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.jsx';
import { 
  getFilaData, 
  getBarbeariaData, 
  getBarbeariaInfo, 
  inicializarDados,
  limparLocalStorage
} from '@/services/filaDataService.js';

const TestComponent = () => {
  const [testResults, setTestResults] = useState({});
  const [loading, setLoading] = useState(false);

  const runTests = async () => {
    setLoading(true);
    const results = {};

    try {
      // Teste 1: Verificar dados da fila
      console.log('=== Teste 1: getFilaData ===');
      const filaData = getFilaData();
      results.filaData = {
        success: !!filaData,
        hasBarbearias: !!(filaData && filaData.barbearias),
        barbeariasCount: filaData?.barbearias ? Object.keys(filaData.barbearias).length : 0,
        data: filaData
      };
      console.log('Fila data:', filaData);

      // Teste 2: Verificar barbearia 1
      console.log('=== Teste 2: getBarbeariaData(1) ===');
      const barbearia1 = getBarbeariaData(1);
      results.barbearia1 = {
        success: !!barbearia1,
        hasFila: !!(barbearia1 && barbearia1.fila),
        filaLength: barbearia1?.fila?.length || 0,
        data: barbearia1
      };
      console.log('Barbearia 1:', barbearia1);

      // Teste 3: Verificar info barbearia 1
      console.log('=== Teste 3: getBarbeariaInfo(1) ===');
      const info1 = getBarbeariaInfo(1);
      results.info1 = {
        success: !!info1,
        hasNome: !!(info1 && info1.nome),
        nome: info1?.nome,
        data: info1
      };
      console.log('Info 1:', info1);

      // Teste 4: Verificar localStorage
      console.log('=== Teste 4: localStorage ===');
      const storedFila = localStorage.getItem('lucas_barbearia_fila_data');
      const storedBarbearias = localStorage.getItem('lucas_barbearia_barbearias_data');
      results.localStorage = {
        hasFilaData: !!storedFila,
        hasBarbeariasData: !!storedBarbearias,
        filaDataLength: storedFila?.length || 0,
        barbeariasDataLength: storedBarbearias?.length || 0
      };
      console.log('localStorage fila:', storedFila);
      console.log('localStorage barbearias:', storedBarbearias);

    } catch (error) {
      console.error('Erro nos testes:', error);
      results.error = error.message;
    }

    setTestResults(results);
    setLoading(false);
  };

  const handleInicializar = async () => {
    setLoading(true);
    try {
      await inicializarDados();
      setTimeout(runTests, 1000);
    } catch (error) {
      console.error('Erro ao inicializar:', error);
      setLoading(false);
    }
  };

  const handleLimpar = async () => {
    setLoading(true);
    try {
      limparLocalStorage();
      setTimeout(runTests, 1000);
    } catch (error) {
      console.error('Erro ao limpar:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    runTests();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Teste de Dados
          </h1>
          <p className="text-gray-600">
            Verificar se os dados estão sendo carregados corretamente
          </p>
        </div>

        <div className="flex gap-4 mb-6">
          <Button onClick={runTests} disabled={loading}>
            Executar Testes
          </Button>
          <Button onClick={handleInicializar} disabled={loading} variant="outline">
            Inicializar Dados
          </Button>
          <Button onClick={handleLimpar} disabled={loading} variant="destructive">
            Limpar localStorage
          </Button>
        </div>

        {loading && (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p>Executando testes...</p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Teste 1 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Teste 1: getFilaData</span>
                <span className={`text-sm px-2 py-1 rounded ${
                  testResults.filaData?.success ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {testResults.filaData?.success ? '✅' : '❌'}
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <div>Sucesso: {testResults.filaData?.success ? 'Sim' : 'Não'}</div>
                <div>Tem barbearias: {testResults.filaData?.hasBarbearias ? 'Sim' : 'Não'}</div>
                <div>Quantidade: {testResults.filaData?.barbeariasCount}</div>
              </div>
            </CardContent>
          </Card>

          {/* Teste 2 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Teste 2: getBarbeariaData(1)</span>
                <span className={`text-sm px-2 py-1 rounded ${
                  testResults.barbearia1?.success ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {testResults.barbearia1?.success ? '✅' : '❌'}
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <div>Sucesso: {testResults.barbearia1?.success ? 'Sim' : 'Não'}</div>
                <div>Tem fila: {testResults.barbearia1?.hasFila ? 'Sim' : 'Não'}</div>
                <div>Clientes na fila: {testResults.barbearia1?.filaLength}</div>
              </div>
            </CardContent>
          </Card>

          {/* Teste 3 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Teste 3: getBarbeariaInfo(1)</span>
                <span className={`text-sm px-2 py-1 rounded ${
                  testResults.info1?.success ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {testResults.info1?.success ? '✅' : '❌'}
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <div>Sucesso: {testResults.info1?.success ? 'Sim' : 'Não'}</div>
                <div>Tem nome: {testResults.info1?.hasNome ? 'Sim' : 'Não'}</div>
                <div>Nome: {testResults.info1?.nome || 'N/A'}</div>
              </div>
            </CardContent>
          </Card>

          {/* Teste 4 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Teste 4: localStorage</span>
                <span className={`text-sm px-2 py-1 rounded ${
                  testResults.localStorage?.hasFilaData ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {testResults.localStorage?.hasFilaData ? '✅' : '❌'}
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <div>Tem dados da fila: {testResults.localStorage?.hasFilaData ? 'Sim' : 'Não'}</div>
                <div>Tem dados das barbearias: {testResults.localStorage?.hasBarbeariasData ? 'Sim' : 'Não'}</div>
                <div>Tamanho fila: {testResults.localStorage?.filaDataLength}</div>
                <div>Tamanho barbearias: {testResults.localStorage?.barbeariasDataLength}</div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Dados detalhados */}
        {testResults.error && (
          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="text-red-600">Erro</CardTitle>
            </CardHeader>
            <CardContent>
              <pre className="text-sm bg-red-50 p-4 rounded overflow-auto">
                {testResults.error}
              </pre>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default TestComponent; 