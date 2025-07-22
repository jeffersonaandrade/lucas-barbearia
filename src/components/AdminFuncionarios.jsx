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
import AdminFilters from '@/components/ui/admin-filters.jsx';
import AdminTable, { AdminTableCard } from '@/components/ui/admin-table.jsx';
import { 
  Users, 
  UserPlus, 
  Edit, 
  Trash2, 
  Eye,
  EyeOff,
  Mail,
  Phone,
  Building2,
  Calendar
} from 'lucide-react';

const AdminFuncionarios = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [funcionarios, setFuncionarios] = useState([]);
  const [barbearias, setBarbearias] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('todos');
  const [filterBarbearia, setFilterBarbearia] = useState('todas');
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [editingFuncionario, setEditingFuncionario] = useState(null);
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
    cpf: '',
    dataNascimento: '',
    endereco: '',
    salario: '',
    dataAdmissao: '',
    ativo: true
  });

  // Dados simulados de barbearias
  const mockBarbearias = [
    { id: 1, nome: 'Lucas Barbearia - Centro' },
    { id: 2, nome: 'Lucas Barbearia - Shopping' },
    { id: 3, nome: 'Lucas Barbearia - Bairro' }
  ];

  // Dados simulados de funcionários
  const mockFuncionarios = [
    {
      id: 1,
      nome: 'Lucas Silva',
      email: 'admin@lucasbarbearia.com',
      telefone: '(81) 99999-9999',
      role: 'admin',
      barbeariaId: 1,
      barbeariaNome: 'Lucas Barbearia - Centro',
      cpf: '123.456.789-00',
      dataNascimento: '1990-05-15',
      endereco: 'Rua das Flores, 123 - Centro, Recife/PE',
      salario: 'R$ 5.000,00',
      dataAdmissao: '2024-01-15',
      ativo: true
    },
    {
      id: 2,
      nome: 'Maria Costa',
      email: 'gerente@lucasbarbearia.com',
      telefone: '(81) 88888-8888',
      role: 'gerente',
      barbeariaId: 2,
      barbeariaNome: 'Lucas Barbearia - Shopping',
      cpf: '987.654.321-00',
      dataNascimento: '1985-08-20',
      endereco: 'Av. Boa Viagem, 456 - Boa Viagem, Recife/PE',
      salario: 'R$ 3.500,00',
      dataAdmissao: '2024-01-20',
      ativo: true
    },
    {
      id: 3,
      nome: 'Pedro Santos',
      email: 'pedro@lucasbarbearia.com',
      telefone: '(81) 77777-7777',
      role: 'barbeiro',
      barbeariaId: 1,
      barbeariaNome: 'Lucas Barbearia - Centro',
      cpf: '111.222.333-44',
      dataNascimento: '1992-03-10',
      endereco: 'Rua do Comércio, 789 - Centro, Recife/PE',
      salario: 'R$ 2.800,00',
      dataAdmissao: '2024-02-01',
      ativo: true
    },
    {
      id: 4,
      nome: 'João Ferreira',
      email: 'joao@lucasbarbearia.com',
      telefone: '(81) 66666-6666',
      role: 'barbeiro',
      barbeariaId: 2,
      barbeariaNome: 'Lucas Barbearia - Shopping',
      cpf: '555.666.777-88',
      dataNascimento: '1988-12-05',
      endereco: 'Rua das Palmeiras, 321 - Boa Viagem, Recife/PE',
      salario: 'R$ 2.600,00',
      dataAdmissao: '2024-02-10',
      ativo: false
    }
  ];

  useEffect(() => {
    // Carregar dados (o ProtectedRoute já verifica as permissões)
    setBarbearias(mockBarbearias);
    setFuncionarios(mockFuncionarios);
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
    const barbearia = barbearias.find(b => b.id === barbeariaId);
    return barbearia ? barbearia.nome : 'Barbearia não encontrada';
  };

  const handleAddFuncionario = async () => {
    if (!formData.nome || !formData.email || !formData.senha || !formData.cpf) {
      setError('Por favor, preencha todos os campos obrigatórios');
      return;
    }

    setLoading(true);
    try {
      // Simular criação de funcionário
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newFuncionario = {
        id: Date.now(),
        ...formData,
        barbeariaNome: getBarbeariaNome(parseInt(formData.barbeariaId)),
        dataAdmissao: formData.dataAdmissao || new Date().toISOString().split('T')[0]
      };

      setFuncionarios([...funcionarios, newFuncionario]);
      setSuccess('Funcionário cadastrado com sucesso!');
      setShowAddDialog(false);
      resetForm();
    } catch (error) {
      setError('Erro ao cadastrar funcionário');
    } finally {
      setLoading(false);
    }
  };

  const handleEditFuncionario = (funcionario) => {
    setEditingFuncionario(funcionario);
    setFormData({
      nome: funcionario.nome,
      email: funcionario.email,
      senha: '',
      telefone: funcionario.telefone,
      role: funcionario.role,
      barbeariaId: funcionario.barbeariaId.toString(),
      cpf: funcionario.cpf,
      dataNascimento: funcionario.dataNascimento,
      endereco: funcionario.endereco,
      salario: funcionario.salario,
      dataAdmissao: funcionario.dataAdmissao,
      ativo: funcionario.ativo
    });
    setShowAddDialog(true);
  };

  const handleUpdateFuncionario = async () => {
    if (!formData.nome || !formData.email || !formData.cpf) {
      setError('Por favor, preencha todos os campos obrigatórios');
      return;
    }

    setLoading(true);
    try {
      // Simular atualização
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const updatedFuncionarios = funcionarios.map(f => 
        f.id === editingFuncionario.id 
          ? { 
              ...f, 
              ...formData, 
              barbeariaNome: getBarbeariaNome(parseInt(formData.barbeariaId)),
              senha: formData.senha || f.senha
            }
          : f
      );

      setFuncionarios(updatedFuncionarios);
      setSuccess('Funcionário atualizado com sucesso!');
      setShowAddDialog(false);
      setEditingFuncionario(null);
      resetForm();
    } catch (error) {
      setError('Erro ao atualizar funcionário');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteFuncionario = async (funcionarioId) => {
    if (!confirm('Tem certeza que deseja excluir este funcionário?')) return;

    setLoading(true);
    try {
      // Simular exclusão
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setFuncionarios(funcionarios.filter(f => f.id !== funcionarioId));
      setSuccess('Funcionário excluído com sucesso!');
    } catch (error) {
      setError('Erro ao excluir funcionário');
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
      cpf: '',
      dataNascimento: '',
      endereco: '',
      salario: '',
      dataAdmissao: '',
      ativo: true
    });
    setEditingFuncionario(null);
    setError('');
  };

  const filteredFuncionarios = funcionarios.filter(funcionario => {
    const matchesSearch = funcionario.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         funcionario.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         funcionario.cpf.includes(searchTerm);
    const matchesRole = filterRole === 'todos' || funcionario.role === filterRole;
    const matchesBarbearia = filterBarbearia === 'todas' || funcionario.barbeariaId.toString() === filterBarbearia;
    return matchesSearch && matchesRole && matchesBarbearia;
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
            Funcionários da Rede
          </h2>
          <p className="text-gray-600">
            Cadastre e gerencie todos os funcionários da rede Lucas Barbearia
          </p>
        </div>
        
        <AdminModal
          trigger={
            <Button className="flex items-center space-x-2">
              <UserPlus className="w-4 h-4" />
              <span>Novo Funcionário</span>
            </Button>
          }
          title={editingFuncionario ? 'Editar Funcionário' : 'Cadastrar Novo Funcionário'}
          open={showAddDialog}
          onOpenChange={setShowAddDialog}
          onCancel={() => {
            setShowAddDialog(false);
            resetForm();
          }}
          onConfirm={editingFuncionario ? handleUpdateFuncionario : handleAddFuncionario}
          confirmText={editingFuncionario ? 'Atualizar' : 'Cadastrar'}
          loading={loading}
        >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 sm:gap-4">
                  <div>
                    <Label htmlFor="nome">Nome Completo *</Label>
                    <Input
                      id="nome"
                      value={formData.nome}
                      onChange={(e) => setFormData({...formData, nome: e.target.value})}
                      placeholder="Nome do funcionário"
                      className="mt-1"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="cpf">CPF *</Label>
                    <Input
                      id="cpf"
                      value={formData.cpf}
                      onChange={(e) => setFormData({...formData, cpf: e.target.value})}
                      placeholder="123.456.789-00"
                      className="mt-1"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 sm:gap-4">
                  <div>
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      placeholder="funcionario@email.com"
                      className="mt-1"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="telefone">Telefone</Label>
                    <Input
                      id="telefone"
                      value={formData.telefone}
                      onChange={(e) => setFormData({...formData, telefone: e.target.value})}
                      placeholder="(81) 99999-9999"
                      className="mt-1"
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="senha">
                    {editingFuncionario ? 'Nova Senha (deixe vazio para manter)' : 'Senha *'}
                  </Label>
                  <div className="relative">
                    <Input
                      id="senha"
                      type={showPassword ? 'text' : 'password'}
                      value={formData.senha}
                      onChange={(e) => setFormData({...formData, senha: e.target.value})}
                      placeholder="Senha do funcionário"
                      className="mt-1"
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
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 sm:gap-4">
                  <div>
                    <Label htmlFor="dataNascimento">Data de Nascimento</Label>
                    <Input
                      id="dataNascimento"
                      type="date"
                      value={formData.dataNascimento}
                      onChange={(e) => setFormData({...formData, dataNascimento: e.target.value})}
                      className="mt-1"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="dataAdmissao">Data de Admissão</Label>
                    <Input
                      id="dataAdmissao"
                      type="date"
                      value={formData.dataAdmissao}
                      onChange={(e) => setFormData({...formData, dataAdmissao: e.target.value})}
                      className="mt-1"
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="endereco">Endereço</Label>
                  <Input
                    id="endereco"
                    value={formData.endereco}
                    onChange={(e) => setFormData({...formData, endereco: e.target.value})}
                    placeholder="Endereço completo"
                    className="mt-1"
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="role">Cargo *</Label>
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
                    <Label htmlFor="barbearia">Barbearia</Label>
                    <Select 
                      value={formData.barbeariaId} 
                      onValueChange={(value) => setFormData({...formData, barbeariaId: value})}
                    >
                      <SelectTrigger className="mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {barbearias.map(barbearia => (
                          <SelectItem key={barbearia.id} value={barbearia.id.toString()}>
                            {barbearia.nome}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="salario">Salário</Label>
                    <Input
                      id="salario"
                      value={formData.salario}
                      onChange={(e) => setFormData({...formData, salario: e.target.value})}
                      placeholder="R$ 2.500,00"
                      className="mt-1"
                    />
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="ativo"
                    checked={formData.ativo}
                    onChange={(e) => setFormData({...formData, ativo: e.target.checked})}
                    className="rounded"
                  />
                  <Label htmlFor="ativo">Funcionário ativo</Label>
                </div>
        </AdminModal>
      </div>

        {/* Filters */}
        <AdminFilters
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          searchPlaceholder="Buscar por nome, email ou CPF..."
          filters={[
            {
              id: "filterRole",
              label: "Filtrar por Cargo",
              value: filterRole,
              onChange: setFilterRole,
              options: [
                { value: "todos", label: "Todos" },
                { value: "admin", label: "Administrador" },
                { value: "gerente", label: "Gerente" },
                { value: "barbeiro", label: "Barbeiro" }
              ]
            },
            {
              id: "filterBarbearia",
              label: "Filtrar por Barbearia",
              value: filterBarbearia,
              onChange: setFilterBarbearia,
              options: [
                { value: "todas", label: "Todas" },
                ...barbearias.map(barbearia => ({
                  value: barbearia.id.toString(),
                  label: barbearia.nome
                }))
              ]
            }
          ]}
        />

        {/* Funcionários List */}
        <AdminTable
          items={filteredFuncionarios}
          renderItem={(funcionario) => {
            const roleInfo = getRoleDisplay(funcionario.role);
            return (
              <AdminTableCard
                key={funcionario.id}
                item={funcionario}
                icon={Users}
                title={funcionario.nome}
                subtitle={
                  <>
                    <div className="flex items-center space-x-2">
                      <Mail className="w-4 h-4" />
                      <span>{funcionario.email}</span>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Phone className="w-4 h-4" />
                      <span>{funcionario.telefone}</span>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Building2 className="w-4 h-4" />
                      <span>{funcionario.barbeariaNome}</span>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-4 h-4" />
                      <span>CPF: {funcionario.cpf} • Admissão: {new Date(funcionario.dataAdmissao).toLocaleDateString('pt-BR')}</span>
                    </div>
                    
                    {funcionario.salario && (
                      <div className="flex items-center space-x-2">
                        <span>💰 {funcionario.salario}</span>
                      </div>
                    )}
                  </>
                }
                badges={[
                  { label: roleInfo.label, color: roleInfo.color },
                  ...(!funcionario.ativo ? [{ label: "Inativo", variant: "secondary" }] : [])
                ]}
                actions={[
                  {
                    label: "Editar",
                    icon: <Edit className="w-4 h-4" />,
                    onClick: () => handleEditFuncionario(funcionario)
                  },
                  {
                    label: "Excluir",
                    icon: <Trash2 className="w-4 h-4" />,
                    onClick: () => handleDeleteFuncionario(funcionario.id),
                    className: "text-red-600 hover:text-red-700 hover:bg-red-50",
                    disabled: funcionario.id === 1
                  }
                ]}
              />
            );
          }}
          emptyIcon={Users}
          emptyTitle="Nenhum funcionário encontrado"
          emptyMessage={
            searchTerm || filterRole !== 'todos' || filterBarbearia !== 'todas'
              ? 'Tente ajustar os filtros de busca'
              : 'Comece cadastrando o primeiro funcionário'
          }
        />
    </AdminLayout>
  );
};

export default AdminFuncionarios; 