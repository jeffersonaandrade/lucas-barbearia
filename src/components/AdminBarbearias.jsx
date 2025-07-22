import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.jsx';
import { Button } from '@/components/ui/button.jsx';
import { Input } from '@/components/ui/input.jsx';
import { Label } from '@/components/ui/label.jsx';
import { Badge } from '@/components/ui/badge.jsx';
import { Textarea } from '@/components/ui/textarea.jsx';
import { useAuth } from '@/hooks/useAuth.js';
import AdminLayout from '@/components/ui/admin-layout.jsx';
import AdminModal from '@/components/ui/admin-modal.jsx';
import { 
  Building2, 
  Plus, 
  Edit, 
  Trash2, 
  Search, 
  MapPin,
  Phone,
  Mail,
  Clock,
  Users,
  QrCode
} from 'lucide-react';

const AdminBarbearias = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [barbearias, setBarbearias] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [editingBarbearia, setEditingBarbearia] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [formData, setFormData] = useState({
    nome: '',
    endereco: '',
    telefone: '',
    email: '',
    horarioFuncionamento: '',
    descricao: '',
    ativa: true,
    capacidade: 10
  });

  // Dados simulados de barbearias
  const mockBarbearias = [
    {
      id: 1,
      nome: 'Lucas Barbearia - Centro',
      endereco: 'Rua das Flores, 123 - Centro, Recife/PE',
      telefone: '(81) 3333-4444',
      email: 'centro@lucasbarbearia.com',
      horarioFuncionamento: 'Segunda a Sábado: 8h às 20h',
      descricao: 'Barbearia localizada no centro da cidade, com fácil acesso e estacionamento.',
      ativa: true,
      capacidade: 15,
      funcionarios: 3,
      dataCriacao: '2024-01-15'
    },
    {
      id: 2,
      nome: 'Lucas Barbearia - Shopping',
      endereco: 'Shopping Recife, 2º andar - Boa Viagem, Recife/PE',
      telefone: '(81) 3333-5555',
      email: 'shopping@lucasbarbearia.com',
      horarioFuncionamento: 'Segunda a Domingo: 10h às 22h',
      descricao: 'Barbearia moderna localizada no shopping, com ambiente climatizado.',
      ativa: true,
      capacidade: 20,
      funcionarios: 4,
      dataCriacao: '2024-02-01'
    },
    {
      id: 3,
      nome: 'Lucas Barbearia - Bairro',
      endereco: 'Av. Principal, 456 - Bairro, Recife/PE',
      telefone: '(81) 3333-6666',
      email: 'bairro@lucasbarbearia.com',
      horarioFuncionamento: 'Terça a Sábado: 9h às 19h',
      descricao: 'Barbearia de bairro com atendimento personalizado e ambiente familiar.',
      ativa: false,
      capacidade: 12,
      funcionarios: 2,
      dataCriacao: '2024-02-15'
    }
  ];

  useEffect(() => {
    // Carregar barbearias (o ProtectedRoute já verifica as permissões)
    setBarbearias(mockBarbearias);
  }, [user]);

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  const handleBack = () => {
    navigate('/admin/dashboard');
  };

  const handleAddBarbearia = async () => {
    if (!formData.nome || !formData.endereco || !formData.telefone) {
      setError('Por favor, preencha todos os campos obrigatórios');
      return;
    }

    setLoading(true);
    try {
      // Simular criação de barbearia
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newBarbearia = {
        id: Date.now(),
        ...formData,
        funcionarios: 0,
        dataCriacao: new Date().toISOString().split('T')[0]
      };

      setBarbearias([...barbearias, newBarbearia]);
      setSuccess('Barbearia criada com sucesso!');
      setShowAddDialog(false);
      resetForm();
    } catch (error) {
      setError('Erro ao criar barbearia');
    } finally {
      setLoading(false);
    }
  };

  const handleEditBarbearia = (barbearia) => {
    setEditingBarbearia(barbearia);
    setFormData({
      nome: barbearia.nome,
      endereco: barbearia.endereco,
      telefone: barbearia.telefone,
      email: barbearia.email,
      horarioFuncionamento: barbearia.horarioFuncionamento,
      descricao: barbearia.descricao,
      ativa: barbearia.ativa,
      capacidade: barbearia.capacidade
    });
    setShowAddDialog(true);
  };

  const handleUpdateBarbearia = async () => {
    if (!formData.nome || !formData.endereco || !formData.telefone) {
      setError('Por favor, preencha todos os campos obrigatórios');
      return;
    }

    setLoading(true);
    try {
      // Simular atualização
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const updatedBarbearias = barbearias.map(b => 
        b.id === editingBarbearia.id 
          ? { ...b, ...formData }
          : b
      );

      setBarbearias(updatedBarbearias);
      setSuccess('Barbearia atualizada com sucesso!');
      setShowAddDialog(false);
      setEditingBarbearia(null);
      resetForm();
    } catch (error) {
      setError('Erro ao atualizar barbearia');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteBarbearia = async (barbeariaId) => {
    if (!confirm('Tem certeza que deseja excluir esta barbearia?')) return;

    setLoading(true);
    try {
      // Simular exclusão
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setBarbearias(barbearias.filter(b => b.id !== barbeariaId));
      setSuccess('Barbearia excluída com sucesso!');
    } catch (error) {
      setError('Erro ao excluir barbearia');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      nome: '',
      endereco: '',
      telefone: '',
      email: '',
      horarioFuncionamento: '',
      descricao: '',
      ativa: true,
      capacidade: 10
    });
    setEditingBarbearia(null);
    setError('');
  };

  const filteredBarbearias = barbearias.filter(barbearia => 
    barbearia.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    barbearia.endereco.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <AdminLayout 
      onLogout={handleLogout} 
      onBack={handleBack}
      error={error}
      success={success}
    >
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Barbearias da Rede
          </h2>
          <p className="text-gray-600">
            Gerencie todas as unidades da rede Lucas Barbearia
          </p>
        </div>
        
        <AdminModal
          trigger={
            <Button className="flex items-center space-x-2">
              <Plus className="w-4 h-4" />
              <span>Nova Barbearia</span>
            </Button>
          }
          title={editingBarbearia ? 'Editar Barbearia' : 'Adicionar Nova Barbearia'}
          open={showAddDialog}
          onOpenChange={setShowAddDialog}
          onCancel={() => {
            setShowAddDialog(false);
            resetForm();
          }}
          onConfirm={editingBarbearia ? handleUpdateBarbearia : handleAddBarbearia}
          confirmText={editingBarbearia ? 'Atualizar' : 'Criar'}
          loading={loading}
        >
            <DialogContent className="max-w-[95vw] w-[95vw] max-h-[85vh] sm:max-w-2xl sm:w-auto sm:max-h-[80vh] overflow-y-auto mx-auto">
              <DialogHeader>
                <DialogTitle className="text-lg">
                  {editingBarbearia ? 'Editar Barbearia' : 'Adicionar Nova Barbearia'}
                </DialogTitle>
              </DialogHeader>
              
              <div className="space-y-2 sm:space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 sm:gap-4">
                  <div>
                    <Label htmlFor="nome" className="text-sm font-medium">Nome da Barbearia *</Label>
                    <Input
                      id="nome"
                      value={formData.nome}
                      onChange={(e) => setFormData({...formData, nome: e.target.value})}
                      placeholder="Ex: Lucas Barbearia - Centro"
                      className="mt-1"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="telefone" className="text-sm font-medium">Telefone *</Label>
                    <Input
                      id="telefone"
                      value={formData.telefone}
                      onChange={(e) => setFormData({...formData, telefone: e.target.value})}
                      placeholder="(81) 3333-4444"
                      className="mt-1"
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="endereco" className="text-sm font-medium">Endereço Completo *</Label>
                  <Input
                    id="endereco"
                    value={formData.endereco}
                    onChange={(e) => setFormData({...formData, endereco: e.target.value})}
                    placeholder="Rua, número, bairro, cidade/estado"
                    className="mt-1"
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 sm:gap-4">
                  <div>
                    <Label htmlFor="email" className="text-sm font-medium">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      placeholder="barbearia@email.com"
                      className="mt-1"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="capacidade" className="text-sm font-medium">Capacidade de Atendimento</Label>
                    <Input
                      id="capacidade"
                      type="number"
                      value={formData.capacidade}
                      onChange={(e) => setFormData({...formData, capacidade: parseInt(e.target.value)})}
                      placeholder="10"
                      className="mt-1"
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="horario" className="text-sm font-medium">Horário de Funcionamento</Label>
                  <Input
                    id="horario"
                    value={formData.horarioFuncionamento}
                    onChange={(e) => setFormData({...formData, horarioFuncionamento: e.target.value})}
                    placeholder="Ex: Segunda a Sábado: 8h às 20h"
                    className="mt-1"
                  />
                </div>
                
                <div>
                  <Label htmlFor="descricao" className="text-sm font-medium">Descrição</Label>
                  <Textarea
                    id="descricao"
                    value={formData.descricao}
                    onChange={(e) => setFormData({...formData, descricao: e.target.value})}
                    placeholder="Descreva características da barbearia..."
                    rows={3}
                    className="mt-1"
                  />
                </div>
                
                <div className="flex items-center space-x-2 pt-2">
                  <input
                    type="checkbox"
                    id="ativa"
                    checked={formData.ativa}
                    onChange={(e) => setFormData({...formData, ativa: e.target.checked})}
                    className="rounded border-gray-300"
                  />
                  <Label htmlFor="ativa" className="text-sm">Barbearia ativa</Label>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-3 pt-2 sm:pt-4 border-t">
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowAddDialog(false);
                    resetForm();
                  }}
                  className="w-full sm:w-auto"
                >
                  Cancelar
                </Button>
                <Button
                  onClick={editingBarbearia ? handleUpdateBarbearia : handleAddBarbearia}
                  disabled={loading}
                  className="w-full sm:w-auto"
                >
                  {loading ? 'Salvando...' : (editingBarbearia ? 'Atualizar' : 'Criar')}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Search */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <Label htmlFor="search" className="text-sm font-medium">Buscar</Label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="search"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Buscar por nome ou endereço..."
                    className="pl-10"
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Barbearias List */}
        <div className="grid gap-6">
          {filteredBarbearias.map((barbearia) => (
            <Card key={barbearia.id} className="hover:shadow-md transition-shadow">
              <CardContent className="pt-6">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between space-y-4 lg:space-y-0">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                      <Building2 className="w-6 h-6 text-primary" />
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <h3 className="font-semibold text-lg">{barbearia.nome}</h3>
                        <Badge className={barbearia.ativa ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}>
                          {barbearia.ativa ? 'Ativa' : 'Inativa'}
                        </Badge>
                      </div>
                      
                      <div className="space-y-1 text-sm text-muted-foreground">
                        <div className="flex items-center space-x-2">
                          <MapPin className="w-4 h-4" />
                          <span>{barbearia.endereco}</span>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <Phone className="w-4 h-4" />
                          <span>{barbearia.telefone}</span>
                        </div>
                        
                        {barbearia.email && (
                          <div className="flex items-center space-x-2">
                            <Mail className="w-4 h-4" />
                            <span>{barbearia.email}</span>
                          </div>
                        )}
                        
                        <div className="flex items-center space-x-2">
                          <Clock className="w-4 h-4" />
                          <span>{barbearia.horarioFuncionamento}</span>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <Users className="w-4 h-4" />
                          <span>{barbearia.funcionarios} funcionários • Capacidade: {barbearia.capacidade}</span>
                        </div>
                        
                        <span>Criada em: {new Date(barbearia.dataCriacao).toLocaleDateString('pt-BR')}</span>
                      </div>
                      
                      {barbearia.descricao && (
                        <p className="text-sm text-muted-foreground mt-2">
                          {barbearia.descricao}
                        </p>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Button
                      onClick={() => navigate(`/qr-code/${barbearia.id}`)}
                      variant="outline"
                      size="sm"
                      className="flex items-center space-x-2"
                    >
                      <QrCode className="w-4 h-4" />
                      <span>QR Code</span>
                    </Button>
                    
                    <Button
                      onClick={() => handleEditBarbearia(barbearia)}
                      variant="outline"
                      size="sm"
                      className="flex items-center space-x-2"
                    >
                      <Edit className="w-4 h-4" />
                      <span>Editar</span>
                    </Button>
                    
                    <Button
                      onClick={() => handleDeleteBarbearia(barbearia.id)}
                      variant="outline"
                      size="sm"
                      className="flex items-center space-x-2 text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="w-4 h-4" />
                      <span>Excluir</span>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
          
          {filteredBarbearias.length === 0 && (
            <Card>
              <CardContent className="pt-6 text-center">
                <Building2 className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium text-muted-foreground mb-2">
                  Nenhuma barbearia encontrada
                </h3>
                <p className="text-muted-foreground">
                  {searchTerm 
                    ? 'Tente ajustar os termos de busca'
                    : 'Comece adicionando a primeira barbearia'
                  }
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  );
};

export default AdminBarbearias; 