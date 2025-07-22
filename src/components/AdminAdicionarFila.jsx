import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.jsx';
import { Button } from '@/components/ui/button.jsx';
import { Input } from '@/components/ui/input.jsx';
import { Label } from '@/components/ui/label.jsx';
import { Badge } from '@/components/ui/badge.jsx';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select.jsx';
import { Alert, AlertDescription } from '@/components/ui/alert.jsx';
import { useAuth } from '@/hooks/useAuth.js';
import { 
  UserPlus, 
  ArrowLeft, 
  Shield, 
  Users, 
  Building2, 
  Clock,
  CheckCircle,
  AlertCircle,
  Copy
} from 'lucide-react';
import { adicionarCliente } from '@/services/filaDataService.js';

const AdminAdicionarFila = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [clienteAdicionado, setClienteAdicionado] = useState(null);

  const [formData, setFormData] = useState({
    nome: '',
    telefone: '',
    barbeiro: 'geral',
    barbeariaId: '1'
  });

  // Dados simulados
  const mockBarbearias = [
    { id: 1, nome: 'Lucas Barbearia - Centro' },
    { id: 2, nome: 'Lucas Barbearia - Shopping' },
    { id: 3, nome: 'Lucas Barbearia - Bairro' }
  ];

  const mockBarbeiros = [
    { id: 1, nome: 'Pedro Santos', barbeariaId: 1 },
    { id: 2, nome: 'João Ferreira', barbeariaId: 2 },
    { id: 3, nome: 'Lucas Ferreira', barbeariaId: 3 },
    { id: 4, nome: 'Miguel Costa', barbeariaId: 1 },
    { id: 5, nome: 'Carlos Silva', barbeariaId: 2 }
  ];

  useEffect(() => {
    console.log('AdminAdicionarFila - Componente carregado');
    console.log('AdminAdicionarFila - User:', user);
  }, [user]);



  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  const getRoleDisplay = (role) => {
    const roles = {
      admin: { label: 'Administrador', color: 'bg-red-100 text-red-800' },
      gerente: { label: 'Gerente', color: 'bg-blue-100 text-blue-800' },
      barbeiro: { label: 'Barbeiro', color: 'bg-green-100 text-green-800' }
    };
    return roles[role] || { label: role, color: 'bg-gray-100 text-gray-800' };
  };

  const handleAddToQueue = async () => {
    if (!formData.nome || !formData.telefone) {
      setError('Por favor, preencha nome e telefone do cliente');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');
    setClienteAdicionado(null);

    try {
      // Gerar token único
      const token = 'token_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
      
      // Adicionar cliente à fila
      const clienteAdicionado = adicionarCliente({
        nome: formData.nome,
        telefone: formData.telefone,
        barbeiro: formData.barbeiro === 'geral' ? 'Geral' : formData.barbeiro,
        token
      }, parseInt(formData.barbeariaId));

      console.log('Cliente adicionado:', clienteAdicionado);
      
      // Salvar dados do cliente adicionado para exibição
      setClienteAdicionado(clienteAdicionado);
      
      // Limpar formulário
      setFormData({
        nome: '',
        telefone: '',
        barbeiro: 'geral',
        barbeariaId: '1'
      });
      
      setSuccess(`✅ Cliente ${formData.nome} adicionado com sucesso à fila da ${mockBarbearias.find(b => b.id === parseInt(formData.barbeariaId))?.nome}!`);
      
      // Limpar sucesso após 5 segundos
      setTimeout(() => {
        setSuccess('');
        setClienteAdicionado(null);
      }, 5000);
    } catch (error) {
      console.error('Erro ao adicionar cliente:', error);
      setError('Erro ao adicionar cliente à fila: ' + error.message);
    } finally {
      setLoading(false);
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
        barbeiro: 'geral',
        barbeariaId: '2'
      },
      {
        nome: 'Carlos Oliveira',
        telefone: '(81) 77777-7777',
        barbeiro: 'Lucas Ferreira',
        barbeariaId: '3'
      }
    ];

    const clienteAleatorio = clientes[Math.floor(Math.random() * clientes.length)];
    setFormData(clienteAleatorio);
  };

  const handleCopiarToken = async (token) => {
    try {
      await navigator.clipboard.writeText(token);
      setSuccess('Token copiado para a área de transferência!');
      setTimeout(() => setSuccess(''), 2000);
    } catch (error) {
      console.error('Erro ao copiar token:', error);
      setError('Erro ao copiar token');
    }
  };

  const getBarbeirosByBarbearia = (barbeariaId) => {
    return mockBarbeiros.filter(barbeiro => barbeiro.barbeariaId === parseInt(barbeariaId));
  };

  const roleInfo = getRoleDisplay(user?.role);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold text-gray-900">
                Painel Administrativo
              </h1>
            </div>
            
            <div className="flex items-center">
              <Button
                onClick={handleLogout}
                variant="outline"
                size="sm"
                className="flex items-center space-x-2"
              >
                <Shield className="w-4 h-4" />
                <span>Sair</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Botão Voltar */}
        <div className="mb-6">
          <Button
            onClick={() => navigate('/admin/dashboard')}
            variant="ghost"
            size="sm"
            className="flex items-center space-x-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Voltar</span>
          </Button>
        </div>

        {/* Alerts */}
        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        
        {success && (
          <Alert className="mb-6 border-green-200 bg-green-50">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800">{success}</AlertDescription>
          </Alert>
        )}

        {/* Confirmação de Cliente Adicionado */}
        {clienteAdicionado && (
          <Alert className="mb-6 border-green-200 bg-green-50">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800">
              <div className="space-y-1">
                <p className="font-medium">✅ Cliente adicionado com sucesso!</p>
                <p className="text-sm"><strong>Nome:</strong> {clienteAdicionado.nome}</p>
                <p className="text-sm"><strong>Telefone:</strong> {clienteAdicionado.telefone}</p>
                <p className="text-sm"><strong>Barbeiro:</strong> {clienteAdicionado.barbeiro}</p>
                <p className="text-sm"><strong>Token:</strong> {clienteAdicionado.token}</p>
              </div>
            </AlertDescription>
          </Alert>
        )}

        {/* Header Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Adicionar Cliente à Fila
          </h2>
          <p className="text-gray-600">
            Adicione clientes às filas das barbearias de forma rápida e eficiente
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Formulário */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <UserPlus className="w-5 h-5" />
                  <span>Dados do Cliente</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="nome" className="text-sm font-medium">
                      Nome do Cliente *
                    </Label>
                    <Input
                      id="nome"
                      value={formData.nome}
                      onChange={(e) => setFormData({...formData, nome: e.target.value})}
                      placeholder="Nome completo do cliente"
                      className="mt-1"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="telefone" className="text-sm font-medium">
                      Telefone *
                    </Label>
                    <Input
                      id="telefone"
                      value={formData.telefone}
                      onChange={(e) => setFormData({...formData, telefone: e.target.value})}
                      placeholder="(81) 99999-9999"
                      className="mt-1"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="barbearia" className="text-sm font-medium">
                      Barbearia *
                    </Label>
                    <Select 
                      value={formData.barbeariaId} 
                      onValueChange={(value) => {
                        setFormData({...formData, barbeariaId: value, barbeiro: 'geral'});
                      }}
                    >
                      <SelectTrigger className="mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {mockBarbearias.map(barbearia => (
                          <SelectItem key={barbearia.id} value={barbearia.id.toString()}>
                            {barbearia.nome}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="barbeiro" className="text-sm font-medium">
                      Barbeiro
                    </Label>
                    <Select 
                      value={formData.barbeiro} 
                      onValueChange={(value) => setFormData({...formData, barbeiro: value})}
                    >
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Selecione um barbeiro" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="geral">Geral (qualquer barbeiro)</SelectItem>
                        {getBarbeirosByBarbearia(formData.barbeariaId).map(barbeiro => (
                          <SelectItem key={barbeiro.id} value={barbeiro.nome}>
                            {barbeiro.nome}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-4 pt-4">
                  <Button
                    onClick={handleAddToQueue}
                    disabled={loading}
                    className="flex-1"
                    size="lg"
                  >
                    {loading ? (
                      <>
                        <Clock className="w-4 h-4 mr-2 animate-spin" />
                        Adicionando...
                      </>
                    ) : (
                      <>
                        <UserPlus className="w-4 h-4 mr-2" />
                        Adicionar à Fila
                      </>
                    )}
                  </Button>
                  
                  <Button
                    onClick={handleSimularClienteAleatorio}
                    variant="outline"
                    className="flex items-center space-x-2"
                  >
                    <Users className="w-4 h-4" />
                    <span>Cliente Aleatório</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar com informações */}
          <div className="space-y-6">
            {/* Informações do usuário */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Informações do Usuário</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Shield className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm">{roleInfo.label}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Users className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm">{user?.email}</span>
                </div>
              </CardContent>
            </Card>

            {/* Estatísticas rápidas */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Estatísticas Rápidas</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Barbearias ativas:</span>
                  <Badge variant="secondary">{mockBarbearias.length}</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Barbeiros cadastrados:</span>
                  <Badge variant="secondary">{mockBarbeiros.length}</Badge>
                </div>
              </CardContent>
            </Card>

            {/* Dicas */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Dicas</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="text-xs text-muted-foreground space-y-1">
                  <p>• Preencha nome e telefone obrigatoriamente</p>
                  <p>• Selecione uma barbearia específica</p>
                  <p>• Deixe "Geral" se não houver preferência de barbeiro</p>
                  <p>• Use "Cliente Aleatório" para testes rápidos</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminAdicionarFila; 