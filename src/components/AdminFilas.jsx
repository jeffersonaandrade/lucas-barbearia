import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.jsx';
import { Button } from '@/components/ui/button.jsx';
import { Input } from '@/components/ui/input.jsx';
import { Badge } from '@/components/ui/badge.jsx';
import { Alert, AlertDescription } from '@/components/ui/alert.jsx';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog.jsx';
import { useAuthBackend } from '@/hooks/useAuthBackend.js';
import { 
  ArrowLeft, 
  Shield, 
  Users, 
  Building2, 
  Trash2,
  Search,
  Clock,
  UserCheck,
  UserX,
  Filter
} from 'lucide-react';
import { barbeariasService, filaService } from '@/services/api.js';

const AdminFilas = () => {
  const { user, logout } = useAuthBackend();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBarbearia, setSelectedBarbearia] = useState('todas');
  const [filas, setFilas] = useState([]);
  const [barbearias, setBarbearias] = useState([]);

  useEffect(() => {
    console.log('AdminFilas - Componente carregado');
    console.log('AdminFilas - User:', user);
    
    // Carregar dados das filas do backend
    carregarDados();
  }, [user]);

  const carregarDados = async () => {
    try {
      setLoading(true);
      setError('');

      // Carregar barbearias
      console.log('Carregando barbearias...');
      const barbeariasData = await barbeariasService.listarBarbearias();
      const barbeariasArray = (barbeariasData && barbeariasData.data && Array.isArray(barbeariasData.data)) 
        ? barbeariasData.data 
        : [];
      setBarbearias(barbeariasArray);
      console.log('Barbearias carregadas:', barbeariasArray);

      // Carregar filas de todas as barbearias
      console.log('Carregando filas...');
      const filasPromises = barbeariasArray.map(async (barbearia) => {
        try {
          const filaData = await filaService.obterFila(barbearia.id);
          console.log(`Fila carregada para barbearia ${barbearia.id}:`, filaData);
          return {
            barbeariaId: barbearia.id,
            barbeariaNome: barbearia.nome,
            clientes: filaData.fila || []
          };
        } catch (error) {
          console.log(`Fila não encontrada para barbearia ${barbearia.id}:`, error.message);
          return {
            barbeariaId: barbearia.id,
            barbeariaNome: barbearia.nome,
            clientes: []
          };
        }
      });

      const filasData = await Promise.all(filasPromises);
      setFilas(filasData);
      console.log('Filas carregadas:', filasData);

    } catch (error) {
      console.error('Erro ao carregar dados:', error);
      setError('Erro ao carregar dados das filas');
    } finally {
      setLoading(false);
    }
  };

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

  // Verificar se o usuário pode remover clientes de uma barbearia específica
  const canRemoveFromBarbearia = (barbeariaId) => {
    if (user?.role === 'admin') return true;
    if (user?.role === 'gerente' && barbeariaId === 1) return true; // Gerente da barbearia 1
    if (user?.role === 'barbeiro' && barbeariaId === 2) return true; // Barbeiro da barbearia 2
    return false;
  };

  // Filtrar filas baseado nas permissões do usuário
  const getFilteredFilas = () => {
    let filasFiltradas = filas;

    // Filtrar por barbearia se não for admin
    if (user?.role !== 'admin') {
      if (user?.role === 'gerente') {
        filasFiltradas = filas.filter(fila => fila.barbeariaId === 1);
      } else if (user?.role === 'barbeiro') {
        filasFiltradas = filas.filter(fila => fila.barbeariaId === 2);
      }
    }

    // Filtrar por barbearia selecionada
    if (selectedBarbearia !== 'todas') {
      filasFiltradas = filasFiltradas.filter(fila => fila.barbeariaId === parseInt(selectedBarbearia));
    }

    // Filtrar por termo de busca
    if (searchTerm) {
      filasFiltradas = filasFiltradas.map(fila => ({
        ...fila,
        clientes: fila.clientes.filter(cliente =>
          cliente.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
          cliente.telefone.includes(searchTerm) ||
          cliente.token.toLowerCase().includes(searchTerm.toLowerCase())
        )
      })).filter(fila => fila.clientes.length > 0);
    }

    return filasFiltradas;
  };

  const handleRemoveCliente = async (cliente, barbeariaId) => {
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      console.log(`Removendo cliente ${cliente.id} da barbearia ${barbeariaId}`);
      
      // Remover cliente do backend
      await filaService.removerCliente(barbeariaId, cliente.id);
      
      // Recarregar dados para garantir sincronização
      await carregarDados();

      setSuccess(`✅ Cliente ${cliente.nome} removido da fila com sucesso!`);
      
      // Limpar sucesso após 3 segundos
      setTimeout(() => {
        setSuccess('');
      }, 3000);
    } catch (error) {
      console.error('Erro ao remover cliente:', error);
      setError('Erro ao remover cliente da fila: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const getStatusDisplay = (status) => {
    const statusConfig = {
      aguardando: { label: 'Aguardando', color: 'bg-yellow-100 text-yellow-800' },
      em_atendimento: { label: 'Em Atendimento', color: 'bg-blue-100 text-blue-800' },
      finalizado: { label: 'Finalizado', color: 'bg-green-100 text-green-800' }
    };
    return statusConfig[status] || { label: status, color: 'bg-gray-100 text-gray-800' };
  };

  const getTotalClientes = () => {
    return getFilteredFilas().reduce((total, fila) => total + fila.clientes.length, 0);
  };

  const getClientesAguardando = () => {
    return getFilteredFilas().reduce((total, fila) => 
      total + fila.clientes.filter(cliente => cliente.status === 'aguardando').length, 0
    );
  };

  const getClientesEmAtendimento = () => {
    return getFilteredFilas().reduce((total, fila) => 
      total + fila.clientes.filter(cliente => cliente.status === 'em_atendimento').length, 0
    );
  };

  const roleInfo = getRoleDisplay(user?.role);
  const filasFiltradas = getFilteredFilas();

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
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        
        {success && (
          <Alert className="mb-6 border-green-200 bg-green-50">
            <AlertDescription className="text-green-800">{success}</AlertDescription>
          </Alert>
        )}

        {/* Header Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Gerenciamento de Filas
          </h2>
          <p className="text-gray-600">
            Visualize e gerencie as filas das barbearias
          </p>
        </div>

        {/* Estatísticas */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Users className="w-5 h-5 text-blue-600" />
                <div>
                  <p className="text-sm text-gray-600">Total de Clientes</p>
                  <p className="text-2xl font-bold text-gray-900">{getTotalClientes()}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Clock className="w-5 h-5 text-yellow-600" />
                <div>
                  <p className="text-sm text-gray-600">Aguardando</p>
                  <p className="text-2xl font-bold text-gray-900">{getClientesAguardando()}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <UserCheck className="w-5 h-5 text-blue-600" />
                <div>
                  <p className="text-sm text-gray-600">Em Atendimento</p>
                  <p className="text-2xl font-bold text-gray-900">{getClientesEmAtendimento()}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Building2 className="w-5 h-5 text-green-600" />
                <div>
                  <p className="text-sm text-gray-600">Barbearias Ativas</p>
                  <p className="text-2xl font-bold text-gray-900">{filasFiltradas.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filtros */}
        <div className="bg-white p-4 rounded-lg shadow-sm border mb-6">
          <div className="flex flex-col sm:flex-row gap-4 items-center">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Buscar por nome, telefone ou token..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <Button
              onClick={carregarDados}
              disabled={loading}
              variant="outline"
              size="sm"
              className="flex items-center space-x-2"
            >
              <Filter className="w-4 h-4" />
              <span>Atualizar</span>
            </Button>
            
            {user?.role === 'admin' && (
              <div className="sm:w-48">
                <select
                  value={selectedBarbearia}
                  onChange={(e) => setSelectedBarbearia(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="todas">Todas as Barbearias</option>
                  {barbearias.map(barbearia => (
                    <option key={barbearia.id} value={barbearia.id}>
                      {barbearia.nome}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>
        </div>

        {/* Lista de Filas */}
        {loading ? (
          <Card>
            <CardContent className="p-8 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-4"></div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Carregando filas...
              </h3>
              <p className="text-gray-600">
                Aguarde enquanto carregamos os dados das filas.
              </p>
            </CardContent>
          </Card>
        ) : filasFiltradas.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Nenhuma fila encontrada
              </h3>
              <p className="text-gray-600">
                {searchTerm ? 'Nenhum cliente encontrado com os filtros aplicados.' : 'Não há clientes nas filas no momento.'}
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {filasFiltradas.map(fila => (
              <Card key={fila.barbeariaId}>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Building2 className="w-5 h-5 text-blue-600" />
                      <span>{fila.barbeariaNome}</span>
                      <Badge variant="secondary">
                        {fila.clientes.length} cliente{fila.clientes.length !== 1 ? 's' : ''}
                      </Badge>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {fila.clientes.length === 0 ? (
                    <p className="text-gray-500 text-center py-4">
                      Nenhum cliente nesta fila
                    </p>
                  ) : (
                    <div className="space-y-3">
                      {fila.clientes.map(cliente => {
                        const statusInfo = getStatusDisplay(cliente.status);
                        const canRemove = canRemoveFromBarbearia(fila.barbeariaId);
                        
                        return (
                          <div
                            key={cliente.id}
                            className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border"
                          >
                            <div className="flex-1">
                              <div className="flex items-center space-x-3">
                                <div>
                                  <p className="font-medium text-gray-900">{cliente.nome}</p>
                                  <p className="text-sm text-gray-600">{cliente.telefone}</p>
                                </div>
                                <div className="flex flex-col space-y-1">
                                  <Badge className={statusInfo.color}>
                                    {statusInfo.label}
                                  </Badge>
                                  <p className="text-xs text-gray-500">
                                    Barbeiro: {cliente.barbeiro}
                                  </p>
                                </div>
                              </div>
                              <div className="mt-2 flex items-center space-x-4 text-xs text-gray-500">
                                <span>Token: {cliente.token}</span>
                                <span>Entrada: {cliente.horarioEntrada}</span>
                              </div>
                            </div>
                            
                            <div className="flex items-center space-x-2">
                              {canRemove ? (
                                <AlertDialog>
                                  <AlertDialogTrigger asChild>
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      className="text-red-600 border-red-300 hover:bg-red-50"
                                    >
                                      <Trash2 className="w-4 h-4" />
                                    </Button>
                                  </AlertDialogTrigger>
                                  <AlertDialogContent>
                                    <AlertDialogHeader>
                                      <AlertDialogTitle>Remover Cliente</AlertDialogTitle>
                                      <AlertDialogDescription>
                                        Tem certeza que deseja remover <strong>{cliente.nome}</strong> da fila?
                                        <br />
                                        <br />
                                        <strong>Telefone:</strong> {cliente.telefone}
                                        <br />
                                        <strong>Token:</strong> {cliente.token}
                                        <br />
                                        <strong>Barbearia:</strong> {fila.barbeariaNome}
                                      </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                      <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                      <AlertDialogAction
                                        onClick={() => handleRemoveCliente(cliente, fila.barbeariaId)}
                                        className="bg-red-600 hover:bg-red-700"
                                      >
                                        Remover Cliente
                                      </AlertDialogAction>
                                    </AlertDialogFooter>
                                  </AlertDialogContent>
                                </AlertDialog>
                              ) : (
                                <Badge variant="outline" className="text-gray-500">
                                  Sem permissão
                                </Badge>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminFilas; 