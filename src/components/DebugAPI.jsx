import { useState } from 'react';
import { Button } from '@/components/ui/button.jsx';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.jsx';
import { Alert, AlertDescription } from '@/components/ui/alert.jsx';

const DebugAPI = () => {
  const [results, setResults] = useState({});
  const [loading, setLoading] = useState(false);

  const testEndpoint = async (endpoint, method = 'GET', body = null) => {
    setLoading(true);
    
    try {
      const options = {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
      };

      if (body) {
        options.body = JSON.stringify(body);
      }

      console.log(`🧪 Testando ${method} ${endpoint}...`);
      console.log('📤 Dados enviados:', body);

      const response = await fetch(endpoint, options);
      const data = await response.json();

      console.log('📥 Resposta:', data);
      console.log('📊 Status:', response.status);

      setResults(prev => ({
        ...prev,
        [endpoint]: {
          status: response.status,
          data,
          timestamp: new Date().toISOString()
        }
      }));

      return { status: response.status, data };
    } catch (error) {
      console.error('❌ Erro:', error);
      setResults(prev => ({
        ...prev,
        [endpoint]: {
          error: error.message,
          timestamp: new Date().toISOString()
        }
      }));
      return { error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const runAllTests = async () => {
    setResults({});
    
    // Teste 1: Health check
    await testEndpoint('/api/health');
    
    // Teste 2: Login
    await testEndpoint('/api/auth/login', 'POST', {
      email: 'admin@lucasbarbearia.com',
      password: 'admin123'
    });
    
    // Teste 3: Criar usuário
    await testEndpoint('/api/users', 'POST', {
      nome: 'Teste Usuário',
      email: 'teste@exemplo.com',
      password: 'senha123',
      role: 'barbeiro',
      telefone: '(11) 99999-9999'
    });
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle>Debug da API</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Button 
              onClick={runAllTests} 
              disabled={loading}
              className="w-full"
            >
              {loading ? 'Executando testes...' : 'Executar Todos os Testes'}
            </Button>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Button 
                onClick={() => testEndpoint('/api/health')}
                disabled={loading}
                variant="outline"
              >
                Testar Health Check
              </Button>

              <Button 
                onClick={() => testEndpoint('/api/auth/login', 'POST', {
                  email: 'admin@lucasbarbearia.com',
                  password: 'admin123'
                })}
                disabled={loading}
                variant="outline"
              >
                Testar Login
              </Button>

              <Button 
                onClick={() => testEndpoint('/api/users', 'POST', {
                  nome: 'Teste Usuário',
                  email: 'teste@exemplo.com',
                  password: 'senha123',
                  role: 'barbeiro',
                  telefone: '(11) 99999-9999'
                })}
                disabled={loading}
                variant="outline"
              >
                Testar Criar Usuário
              </Button>

              <Button 
                onClick={() => testEndpoint('/api/barbearias/1')}
                disabled={loading}
                variant="outline"
              >
                Testar Barbearia
              </Button>
            </div>

            {Object.keys(results).length > 0 && (
              <div className="space-y-4">
                <h3 className="font-semibold">Resultados:</h3>
                
                {Object.entries(results).map(([endpoint, result]) => (
                  <Alert key={endpoint} variant={result.error ? "destructive" : "default"}>
                    <AlertDescription>
                      <div className="font-semibold">{endpoint}</div>
                      <div className="text-sm mt-1">
                        <strong>Status:</strong> {result.status || 'Erro'}
                      </div>
                      <div className="text-sm mt-1">
                        <strong>Timestamp:</strong> {result.timestamp}
                      </div>
                      <pre className="text-xs mt-2 bg-gray-100 p-2 rounded overflow-auto">
                        {JSON.stringify(result.data || result.error, null, 2)}
                      </pre>
                    </AlertDescription>
                  </Alert>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DebugAPI; 