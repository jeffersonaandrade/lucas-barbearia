import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.jsx';
import { Button } from '@/components/ui/button.jsx';
import { Input } from '@/components/ui/input.jsx';
import { Label } from '@/components/ui/label.jsx';
import { Badge } from '@/components/ui/badge.jsx';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select.jsx';
import { useAuth } from '@/hooks/useAuth.js';
import AdminLayout from '@/components/ui/admin-layout.jsx';
import AdminModal from '@/components/ui/admin-modal.jsx';
import { 
  Users, 
  UserPlus, 
  Edit, 
  Trash2, 
  Search, 
  Filter,
  Eye,
  EyeOff,
  Mail,
  Phone,
  Building2
} from 'lucide-react';

const AdminUsuarios = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('todos');
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    senha: '',
    telefone: '',
    role: 'barbeiro',
    barbeariaId: '1',
    ativo: true
  });

  // Dados simulados de usuários
  const mockUsuarios = [
    {
      id: 1,
      nome: 'Lucas Silva',
      email: 'admin@lucasbarbearia.com',
      telefone: '(81) 99999-9999',
      role: 'admin',
      barbeariaId: 1,
      barbeariaNome: 'Lucas Barbearia - Centro',
      ativo: true,
      dataCriacao: '2024-01-15'
    },
    {
      id: 2,
      nome: 'Maria Costa',
      email: 'gerente@lucasbarbearia.com',
      telefone: '(81) 88888-8888',
      role: 'gerente',
      barbeariaId: 2,
      barbeariaNome: 'Lucas Barbearia - Shopping',
      ativo: true,
      dataCriacao: '2024-01-20'
    },
    {
      id: 3,
      nome: 'Pedro Santos',
      email: 'pedro@lucasbarbearia.com',
      telefone: '(81) 77777-7777',
      role: 'barbeiro',
      barbeariaId: 1,
      barbeariaNome: 'Lucas Barbearia - Centro',
      ativo: true,
      dataCriacao: '2024-02-01'
    },
    {
      id: 4,
      nome: 'João Ferreira',
      email: 'joao@lucasbarbearia.com',
      telefone: '(81) 66666-6666',
      role: 'barbeiro',
      barbeariaId: 2,
      barbeariaNome: 'Lucas Barbearia - Shopping',
      ativo: false,
      dataCriacao: '2024-02-10'
    }
  ];

  useEffect(() => {
    // Carregar usuários (o ProtectedRoute já verifica as permissões)
    setUsuarios(mockUsuarios);
  }, [user]);

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  const handleBack = () => {
    navigate('/admin/dashboard');
  };

  const getRoleDisplay = (role) => {
    const roles = {
      admin: { label: 'Administrador', color: 'bg-red-100 text-red-800' },
      gerente: { label: 'Gerente', color: 'bg-blue-100 text-blue-800' },
      barbeiro: { label: 'Barbeiro', color: 'bg-green-100 text-green-800' }
    };
    return roles[role] || { label: role, color: 'bg-gray-100 text-gray-800' };
  };

  const getBarbeariaNome = (barbeariaId) => {
    const barbearias = {
      1: 'Lucas Barbearia - Centro',
      2: 'Lucas Barbearia - Shopping',
      3: 'Lucas Barbearia - Bairro'
    };
    return barbearias[barbeariaId] || 'Barbearia não encontrada';
  };

  const handleAddUser = async () => {
    if (!formData.nome || !formData.email || !formData.senha) {
      setError('Por favor, preencha todos os campos obrigatórios');
      return;
    }

    setLoading(true);
    try {
      // Simular criação de usuário
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newUser = {
        id: Date.now(),
        ...formData,
        barbeariaNome: getBarbeariaNome(formData.barbeariaId),
        dataCriacao: new Date().toISOString().split('T')[0]
      };

      setUsuarios([...usuarios, newUser]);
      setSuccess('Usuário criado com sucesso!');
      setShowAddDialog(false);
      resetForm();
    } catch (error) {
      setError('Erro ao criar usuário');
    } finally {
      setLoading(false);
    }
  };

  const handleEditUser = (user) => {
    setEditingUser(user);
    setFormData({
      nome: user.nome,
      email: user.email,
      senha: '',
      telefone: user.telefone,
      role: user.role,
      barbeariaId: user.barbeariaId.toString(),
      ativo: user.ativo
    });
    setShowAddDialog(true);
  };

  const handleUpdateUser = async () => {
    if (!formData.nome || !formData.email) {
      setError('Por favor, preencha todos os campos obrigatórios');
      return;
    }

    setLoading(true);
    try {
      // Simular atualização
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const updatedUsuarios = usuarios.map(u => 
        u.id === editingUser.id 
          ? { 
              ...u, 
              ...formData, 
              barbeariaNome: getBarbeariaNome(formData.barbeariaId),
              senha: formData.senha || u.senha
            }
          : u
      );

      setUsuarios(updatedUsuarios);
      setSuccess('Usuário atualizado com sucesso!');
      setShowAddDialog(false);
      setEditingUser(null);
      resetForm();
    } catch (error) {
      setError('Erro ao atualizar usuário');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!confirm('Tem certeza que deseja excluir este usuário?')) return;

    setLoading(true);
    try {
      // Simular exclusão
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setUsuarios(usuarios.filter(u => u.id !== userId));
      setSuccess('Usuário excluído com sucesso!');
    } catch (error) {
      setError('Erro ao excluir usuário');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      nome: '',
      email: '',
      senha: '',
      telefone: '',
      role: 'barbeiro',
      barbeariaId: '1',
      ativo: true
    });
    setEditingUser(null);
    setError('');
  };

  const filteredUsuarios = usuarios.filter(usuario => {
    const matchesSearch = usuario.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         usuario.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = filterRole === 'todos' || usuario.role === filterRole;
    return matchesSearch && matchesRole;
  });

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
            Usuários do Sistema
          </h2>
          <p className="text-gray-600">
            Gerencie todos os usuários do sistema administrativo
          </p>
        </div>
        
        <AdminModal
          trigger={
            <Button className="flex items-center space-x-2">
              <UserPlus className="w-4 h-4" />
              <span>Adicionar Usuário</span>
            </Button>
          }
          title={editingUser ? 'Editar Usuário' : 'Adicionar Novo Usuário'}
          open={showAddDialog}
          onOpenChange={setShowAddDialog}
          onCancel={() => {
            setShowAddDialog(false);
            resetForm();
          }}
          onConfirm={editingUser ? handleUpdateUser : handleAddUser}
          confirmText={editingUser ? 'Atualizar' : 'Criar'}
          loading={loading}
        >
          {/* Informações Básicas */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 sm:gap-4">
            <div>
              <Label htmlFor="nome" className="text-sm font-medium">Nome Completo *</Label>
              <Input
                id="nome"
                value={formData.nome}
                onChange={(e) => setFormData({...formData, nome: e.target.value})}
                placeholder="Nome do usuário"
                className="mt-1"
              />
            </div>
            
            <div>
              <Label htmlFor="email" className="text-sm font-medium">Email *</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                placeholder="usuario@email.com"
                className="mt-1"
              />
            </div>
          </div>
          
          {/* Senha */}
          <div>
            <Label htmlFor="senha" className="text-sm font-medium">
              {editingUser ? 'Nova Senha (deixe vazio para manter)' : 'Senha *'}
            </Label>
            <div className="relative mt-1">
              <Input
                id="senha"
                type={showPassword ? 'text' : 'password'}
                value={formData.senha}
                onChange={(e) => setFormData({...formData, senha: e.target.value})}
                placeholder="Senha do usuário"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>
          
          {/* Telefone */}
          <div>
            <Label htmlFor="telefone" className="text-sm font-medium">Telefone</Label>
            <Input
              id="telefone"
              value={formData.telefone}
              onChange={(e) => setFormData({...formData, telefone: e.target.value})}
              placeholder="(81) 99999-9999"
              className="mt-1"
            />
          </div>
          
          {/* Perfil e Barbearia */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 sm:gap-4">
            <div>
              <Label htmlFor="role" className="text-sm font-medium">Perfil *</Label>
              <Select 
                value={formData.role} 
                onValueChange={(value) => setFormData({...formData, role: value})}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">Administrador</SelectItem>
                  <SelectItem value="gerente">Gerente</SelectItem>
                  <SelectItem value="barbeiro">Barbeiro</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="barbearia" className="text-sm font-medium">Barbearia</Label>
              <Select 
                value={formData.barbeariaId} 
                onValueChange={(value) => setFormData({...formData, barbeariaId: value})}
              >
                <SelectTrigger className="mt-1">
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
          
          {/* Status */}
          <div className="flex items-center space-x-2 pt-2">
            <input
              type="checkbox"
              id="ativo"
              checked={formData.ativo}
              onChange={(e) => setFormData({...formData, ativo: e.target.checked})}
              className="rounded border-gray-300"
            />
            <Label htmlFor="ativo" className="text-sm">Usuário ativo</Label>
          </div>
        </AdminModal>
      </div>

        {/* Filters */}
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
                    placeholder="Buscar por nome ou email..."
                    className="pl-10"
                  />
                </div>
              </div>
              
              <div className="sm:w-48">
                <Label htmlFor="filter" className="text-sm font-medium">Filtrar por Perfil</Label>
                <Select value={filterRole} onValueChange={setFilterRole}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todos">Todos</SelectItem>
                    <SelectItem value="admin">Administrador</SelectItem>
                    <SelectItem value="gerente">Gerente</SelectItem>
                    <SelectItem value="barbeiro">Barbeiro</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Users List */}
        <div className="grid gap-6">
          {filteredUsuarios.map((usuario) => {
            const roleInfo = getRoleDisplay(usuario.role);
            return (
              <Card key={usuario.id} className="hover:shadow-md transition-shadow">
                <CardContent className="pt-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between space-y-4 sm:space-y-0">
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                        <Users className="w-6 h-6 text-primary" />
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <h3 className="font-semibold text-lg">{usuario.nome}</h3>
                          <Badge className={roleInfo.color}>
                            {roleInfo.label}
                          </Badge>
                          {!usuario.ativo && (
                            <Badge variant="secondary">Inativo</Badge>
                          )}
                        </div>
                        
                        <div className="space-y-1 text-sm text-muted-foreground">
                          <div className="flex items-center space-x-2">
                            <Mail className="w-4 h-4" />
                            <span>{usuario.email}</span>
                          </div>
                          
                          {usuario.telefone && (
                            <div className="flex items-center space-x-2">
                              <Phone className="w-4 h-4" />
                              <span>{usuario.telefone}</span>
                            </div>
                          )}
                          
                          <div className="flex items-center space-x-2">
                            <Building2 className="w-4 h-4" />
                            <span>{usuario.barbeariaNome}</span>
                          </div>
                          
                          <span>Criado em: {new Date(usuario.dataCriacao).toLocaleDateString('pt-BR')}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Button
                        onClick={() => handleEditUser(usuario)}
                        variant="outline"
                        size="sm"
                        className="flex items-center space-x-2"
                      >
                        <Edit className="w-4 h-4" />
                        <span>Editar</span>
                      </Button>
                      
                      <Button
                        onClick={() => handleDeleteUser(usuario.id)}
                        variant="outline"
                        size="sm"
                        className="flex items-center space-x-2 text-red-600 hover:text-red-700 hover:bg-red-50"
                        disabled={usuario.id === 1} // Não permitir excluir o admin principal
                      >
                        <Trash2 className="w-4 h-4" />
                        <span>Excluir</span>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
          
          {filteredUsuarios.length === 0 && (
            <Card>
              <CardContent className="pt-6 text-center">
                <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium text-muted-foreground mb-2">
                  Nenhum usuário encontrado
                </h3>
                <p className="text-muted-foreground">
                  {searchTerm || filterRole !== 'todos' 
                    ? 'Tente ajustar os filtros de busca'
                    : 'Comece adicionando o primeiro usuário'
                  }
                </p>
              </CardContent>
            </Card>
          )}
        </div>
    </AdminLayout>
  );
};

export default AdminUsuarios; 