import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.jsx';
import { Button } from '@/components/ui/button.jsx';
import { Input } from '@/components/ui/input.jsx';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select.jsx';
import { Label } from '@/components/ui/label.jsx';
import { Link } from 'react-router-dom';
import { 
  getFilaData, 
  getBarbeariaData, 
  getBarbeariaInfo, 
  inicializarDados, 
  resetarDados,
  limparLocalStorage,
  adicionarCliente
} from '@/services/filaDataService.js';

const DebugPanel = () => {
  const [debugData, setDebugData] = useState({});
  const [loading, setLoading] = useState(false);
  const [showAddClient, setShowAddClient] = useState(false);
  const [newClient, setNewClient] = useState({
    nome: '',
    telefone: '',
    barbeiro: '',
    barbeariaId: '1'
  });
  const [addClientLoading, setAddClientLoading] = useState(false);

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

  const handleAddClient = async () => {
    if (!newClient.nome || !newClient.telefone) {
      alert('Por favor, preencha nome e telefone');
      return;
    }

    setAddClientLoading(true);
    try {
      // Gerar token único
      const token = 'token_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
      
      // Adicionar cliente à fila
      const clienteAdicionado = adicionarCliente({
        nome: newClient.nome,
        telefone: newClient.telefone,
        barbeiro: newClient.barbeiro || 'Geral',
        token
      }, parseInt(newClient.barbeariaId));

      console.log('Cliente adicionado:', clienteAdicionado);
      
      // Limpar formulário
      setNewClient({
        nome: '',
        telefone: '',
        barbeiro: '',
        barbeariaId: '1'
      });
      
      // Recarregar dados
      setTimeout(carregarDadosDebug, 500);
      
      alert(`Cliente ${newClient.nome} adicionado com sucesso! Token: ${token}`);
    } catch (error) {
      console.error('Erro ao adicionar cliente:', error);
      alert('Erro ao adicionar cliente: ' + error.message);
    } finally {
      setAddClientLoading(false);
    }
  };

  const handleSimularClienteAleatorio = () => {
    const clientes = [
      {
        nome: 'João Silva',
        telefone: '(81) 99999-9999',
        barbeiro: 'Pedro Santos',
        barbeariaId: '1'
      },
      {
        nome: 'Maria Costa',
        telefone: '(81) 88888-8888',
        barbeiro: 'Geral',
        barbeariaId: '2'
      },
      {
        nome: 'Carlos Oliveira',
        telefone: '(81) 77777-7777',
        barbeiro: 'Lucas Ferreira',
        barbeariaId: '3'
      },
      {
        nome: 'Ana Santos',
        telefone: '(81) 66666-6666',
        barbeiro: 'Miguel Costa',
        barbeariaId: '1'
      },
      {
        nome: 'Roberto Lima',
        telefone: '(81) 55555-5555',
        barbeiro: 'Geral',
        barbeariaId: '2'
      }
    ];

    const clienteAleatorio = clientes[Math.floor(Math.random() * clientes.length)];
    setNewClient(clienteAleatorio);
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
          <Link to="/dev/avaliacao">
            <Button variant="outline" className="bg-yellow-100 border-yellow-300 text-yellow-800 hover:bg-yellow-200">
              🧪 Simular Avaliação
            </Button>
          </Link>
          <Button 
            onClick={() => setShowAddClient(!showAddClient)}
            variant="outline" 
            className="bg-green-100 border-green-300 text-green-800 hover:bg-green-200"
          >
            👥 Adicionar Cliente
          </Button>
        </div>

        {/* Formulário para adicionar cliente */}
        {showAddClient && (
          <Card className="mb-6 border-green-200 bg-green-50">
            <CardHeader>
              <CardTitle className="text-green-800">Adicionar Cliente à Fila</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <Label htmlFor="nome" className="text-green-800">Nome *</Label>
                  <Input
                    id="nome"
                    value={newClient.nome}
                    onChange={(e) => setNewClient({...newClient, nome: e.target.value})}
                    placeholder="Nome do cliente"
                    className="border-green-300"
                  />
                </div>
                
                <div>
                  <Label htmlFor="telefone" className="text-green-800">Telefone *</Label>
                  <Input
                    id="telefone"
                    value={newClient.telefone}
                    onChange={(e) => setNewClient({...newClient, telefone: e.target.value})}
                    placeholder="(81) 99999-9999"
                    className="border-green-300"
                  />
                </div>
                
                <div>
                  <Label htmlFor="barbeiro" className="text-green-800">Barbeiro</Label>
                  <Input
                    id="barbeiro"
                    value={newClient.barbeiro}
                    onChange={(e) => setNewClient({...newClient, barbeiro: e.target.value})}
                    placeholder="Deixe vazio para 'Geral'"
                    className="border-green-300"
                  />
                </div>
                
                <div>
                  <Label htmlFor="barbearia" className="text-green-800">Barbearia</Label>
                  <Select 
                    value={newClient.barbeariaId} 
                    onValueChange={(value) => setNewClient({...newClient, barbeariaId: value})}
                  >
                    <SelectTrigger className="border-green-300">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">Lucas Barbearia - Centro</SelectItem>
                      <SelectItem value="2">Lucas Barbearia - Shopping</SelectItem>
                      <SelectItem value="3">Lucas Barbearia - Bairro</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="flex gap-4 mt-4">
                <Button 
                  onClick={handleAddClient}
                  disabled={addClientLoading}
                  className="bg-green-600 hover:bg-green-700"
                >
                  {addClientLoading ? 'Adicionando...' : 'Adicionar Cliente'}
                </Button>
                
                <Button 
                  onClick={handleSimularClienteAleatorio}
                  variant="outline"
                  className="border-green-300 text-green-700 hover:bg-green-100"
                >
                  🎲 Cliente Aleatório
                </Button>
                
                <Button 
                  onClick={() => setNewClient({nome: '', telefone: '', barbeiro: '', barbeariaId: '1'})}
                  variant="outline"
                  className="border-gray-300"
                >
                  Limpar
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {loading && (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p>Carregando...</p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Filas Atuais */}
          <Card>
            <CardHeader>
              <CardTitle>Filas Atuais</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[1, 2, 3].map((barbeariaId) => {
                  const barbearia = debugData[`barbearia${barbeariaId}`];
                  const info = debugData[`info${barbeariaId}`];
                  return (
                    <div key={barbeariaId} className="border rounded-lg p-3">
                      <h4 className="font-semibold text-sm mb-2">
                        {info?.nome || `Barbearia ${barbeariaId}`}
                      </h4>
                      <div className="text-xs space-y-1">
                        <p><strong>Total na fila:</strong> {barbearia?.fila?.length || 0}</p>
                        <p><strong>Atendendo:</strong> {barbearia?.fila?.filter(c => c.status === 'atendendo').length || 0}</p>
                        <p><strong>Próximo:</strong> {barbearia?.fila?.filter(c => c.status === 'próximo').length || 0}</p>
                        <p><strong>Aguardando:</strong> {barbearia?.fila?.filter(c => c.status === 'aguardando').length || 0}</p>
                      </div>
                      {barbearia?.fila?.length > 0 && (
                        <div className="mt-2 text-xs">
                          <p className="font-medium mb-1">Clientes na fila:</p>
                          <div className="space-y-1">
                            {barbearia.fila.slice(0, 3).map((cliente, index) => (
                              <div key={index} className="flex justify-between">
                                <span>{cliente.nome}</span>
                                <span className="text-gray-500">#{cliente.posicao} - {cliente.status}</span>
                              </div>
                            ))}
                            {barbearia.fila.length > 3 && (
                              <p className="text-gray-500">... e mais {barbearia.fila.length - 3} clientes</p>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Dados da Fila (JSON) */}
          <Card>
            <CardHeader>
              <CardTitle>Dados da Fila (JSON)</CardTitle>
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