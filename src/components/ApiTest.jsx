import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.jsx';
import { Button } from '@/components/ui/button.jsx';
import { Alert, AlertDescription } from '@/components/ui/alert.jsx';
import { Badge } from '@/components/ui/badge.jsx';
import { authService } from '@/services/api.js';
import { 
  Wifi, 
  WifiOff, 
  CheckCircle, 
  XCircle, 
  Loader2,
  RefreshCw,
  TestTube,
  UserCheck
} from 'lucide-react';

const ApiTest = () => {
  const [status, setStatus] = useState('checking');
  const [loading, setLoading] = useState(false);
  const [testResults, setTestResults] = useState({});
  const [error, setError] = useState('');

  const testLogin = async () => {
    setLoading(true);
    setError('');
    
    try {
      console.log('🔐 Testando login...');
      
      const loginResult = await authService.login('admin@lucasbarbearia.com', 'admin123');
      
      console.log('✅ Login bem-sucedido:', loginResult);
      
      setStatus('available');
      setTestResults(prev => ({
        ...prev,
        login: {
          status: 'success',
          data: loginResult,
          timestamp: new Date().toISOString()
        }
      }));

    } catch (error) {
      console.error('❌ Erro no login:', error);
      setStatus('unavailable');
      setError(`Erro no login: ${error.message}`);
      
      setTestResults(prev => ({
        ...prev,
        login: {
          status: 'error',
          error: error.message,
          timestamp: new Date().toISOString()
        }
      }));
    } finally {
      setLoading(false);
    }
  };

  const testCurrentUser = async () => {
    setLoading(true);
    setError('');
    
    try {
      console.log('👤 Testando verificação de usuário atual...');
      
      const userResult = await authService.getCurrentUser();
      
      console.log('✅ Usuário atual:', userResult);
      
      setTestResults(prev => ({
        ...prev,
        currentUser: {
          status: 'success',
          data: userResult,
          timestamp: new Date().toISOString()
        }
      }));

    } catch (error) {
      console.error('❌ Erro ao verificar usuário:', error);
      setError(`Erro ao verificar usuário: ${error.message}`);
      
      setTestResults(prev => ({
        ...prev,
        currentUser: {
          status: 'error',
          error: error.message,
          timestamp: new Date().toISOString()
        }
      }));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    testLogin();
  }, []);

  const getStatusIcon = () => {
    switch (status) {
      case 'available':
        return <Wifi className="h-5 w-5 text-green-600" />;
      case 'unavailable':
        return <WifiOff className="h-5 w-5 text-red-600" />;
      default:
        return <Loader2 className="h-5 w-5 text-yellow-600 animate-spin" />;
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case 'available':
        return 'bg-green-100 text-green-800';
      case 'unavailable':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-yellow-100 text-yellow-800';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 to-secondary/10 p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TestTube className="h-6 w-6" />
              Teste de Conectividade da API
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Status da API */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {getStatusIcon()}
                <div>
                  <h3 className="font-semibold">Status da API</h3>
                  <p className="text-sm text-muted-foreground">
                    {status === 'available' ? 'Conectado' : 
                     status === 'unavailable' ? 'Desconectado' : 'Verificando...'}
                  </p>
                </div>
              </div>
              <Badge className={getStatusColor()}>
                {status.toUpperCase()}
              </Badge>
            </div>

            {/* Botões de teste */}
            <div className="flex gap-4">
              <Button 
                onClick={testLogin} 
                disabled={loading}
                variant="outline"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Testar Login
              </Button>
              
              <Button 
                onClick={testCurrentUser} 
                disabled={loading || status !== 'available'}
              >
                <UserCheck className="h-4 w-4 mr-2" />
                Testar Usuário Atual
              </Button>
            </div>

            {/* Erro */}
            {error && (
              <Alert variant="destructive">
                <XCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {/* Resultados dos testes */}
            {Object.keys(testResults).length > 0 && (
              <div className="space-y-4">
                <h4 className="font-semibold">Resultados dos Testes</h4>
                
                {testResults.login && (
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm">Login Test</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center gap-2 mb-2">
                        {testResults.login.status === 'success' ? (
                          <CheckCircle className="h-4 w-4 text-green-600" />
                        ) : (
                          <XCircle className="h-4 w-4 text-red-600" />
                        )}
                        <span className="text-sm">
                          {testResults.login.status === 'success' ? 'Sucesso' : 'Erro'}
                        </span>
                      </div>
                      <pre className="text-xs bg-muted p-2 rounded overflow-auto">
                        {JSON.stringify(testResults.login.data || testResults.login.error, null, 2)}
                      </pre>
                    </CardContent>
                  </Card>
                )}

                {testResults.currentUser && (
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm">Current User Test</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center gap-2 mb-2">
                        {testResults.currentUser.status === 'success' ? (
                          <CheckCircle className="h-4 w-4 text-green-600" />
                        ) : (
                          <XCircle className="h-4 w-4 text-red-600" />
                        )}
                        <span className="text-sm">
                          {testResults.currentUser.status === 'success' ? 'Sucesso' : 'Erro'}
                        </span>
                      </div>
                      <pre className="text-xs bg-muted p-2 rounded overflow-auto">
                        {JSON.stringify(testResults.currentUser.data || testResults.currentUser.error, null, 2)}
                      </pre>
                    </CardContent>
                  </Card>
                )}
              </div>
            )}

            {/* Informações da configuração */}
            <div className="bg-muted/50 p-4 rounded-lg">
              <h4 className="font-semibold mb-2">Configuração Atual</h4>
              <div className="space-y-1 text-sm">
                <p><strong>URL da API:</strong> {import.meta.env.VITE_API_URL || 'http://localhost:3000/api'}</p>
                <p><strong>Modo:</strong> {import.meta.env.VITE_DEV_MODE ? 'Desenvolvimento' : 'Produção'}</p>
                <p><strong>Debug:</strong> {import.meta.env.VITE_DEBUG_LOGS ? 'Ativado' : 'Desativado'}</p>
              </div>
            </div>

            {/* Instruções */}
            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-semibold mb-2">Como usar:</h4>
              <div className="space-y-1 text-sm">
                <p>1. Clique em "Testar Login" para verificar se a autenticação está funcionando</p>
                <p>2. Se o login funcionar, clique em "Testar Usuário Atual" para verificar o token</p>
                <p>3. Se ambos funcionarem, o sistema de autenticação está OK</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ApiTest; 