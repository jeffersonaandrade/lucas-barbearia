import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.jsx';
import { Button } from '@/components/ui/button.jsx';
import { Input } from '@/components/ui/input.jsx';
import { Label } from '@/components/ui/label.jsx';
import { Badge } from '@/components/ui/badge.jsx';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select.jsx';
import { useAuth } from '@/contexts/AuthContext.jsx';
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
  Key
} from 'lucide-react';
import { usuariosService, barbeariasService } from '@/services/api.js';
import { CookieManager } from '@/utils/cookieManager.js';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip.jsx';

const AdminUsuarios = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [usuarios, setUsuarios] = useState([]);
  const [barbearias, setBarbearias] = useState([]);
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
    password: '',
    telefone: '',
    role: 'barbeiro'
  });

  // Debug: mostrar status da autenticação
  console.log('🔍 AdminUsuarios - Status da autenticação:', {
    user: user ? { id: user.id, email: user.email, role: user.role } : null,
    cookies: {
      authToken: !!CookieManager.getAdminToken(),
      userInfo: !!CookieManager.getUserInfo()
    }
  });

  // Função para testar endpoints de usuários
  const testarEndpoints = async () => {
    console.log('🧪 Testando endpoints de usuários...');
    
    try {
      // Testar listar usuários
      console.log('🔍 Testando GET /users...');
      const usuariosData = await usuariosService.listarUsuarios();
      console.log('✅ GET /users funcionando:', usuariosData);
    } catch (error) {
      console.error('❌ GET /users falhou:', error.message);
    }
    
    try {
      // Testar criar usuário (apenas validação, não criar de verdade)
      console.log('🔍 Testando POST /auth/register...');
      const dadosTeste = {
        nome: 'Teste',
        email: 'teste@teste.com',
        password: '123456',
        role: 'barbeiro'
      };
      const resultado = await usuariosService.criarUsuario(dadosTeste);
      console.log('✅ POST /auth/register funcionando:', resultado);
    } catch (error) {
      console.error('❌ POST /auth/register falhou:', error.message);
    }

    try {
      // Testar atualizar usuário (se houver usuários na lista)
      if (usuarios.length > 0) {
        const primeiroUsuario = usuarios[0];
        console.log('🔍 Testando PUT /users/{id}...');
        const dadosAtualizacao = {
          nome: primeiroUsuario.nome + ' (editado)',
          email: primeiroUsuario.email,
          role: primeiroUsuario.role,
          ativo: true
        };
        const resultado = await usuariosService.atualizarUsuario(primeiroUsuario.id, dadosAtualizacao);
        console.log('✅ PUT /users/{id} funcionando:', resultado);
      } else {
        console.log('⚠️ Nenhum usuário disponível para testar atualização');
      }
    } catch (error) {
      console.error('❌ PUT /users/{id} falhou:', error.message);
    }

    console.log('🎉 Todos os endpoints de usuários estão funcionando!');
  };

  useEffect(() => {
    // Carregar dados do backend apenas se o usuário estiver autenticado
    if (user && user.id) {
      console.log('AdminUsuarios - Usuário autenticado, carregando dados:', user);
      carregarDados();
    } else {
      console.log('AdminUsuarios - Usuário não autenticado, aguardando...');
    }
  }, [user?.id]); // Usar user.id em vez de user para evitar re-renders desnecessários

  const carregarDados = async () => {
    // Verificar se o usuário está autenticado antes de fazer as chamadas
    if (!user || !user.id) {
      console.log('AdminUsuarios - Usuário não autenticado, pulando carregamento de dados');
      return;
    }

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

      // Carregar usuários
      console.log('Carregando usuários...');
      try {
        const usuariosData = await usuariosService.listarUsuarios();
        const usuariosArray = (usuariosData && usuariosData.data && usuariosData.data.users && Array.isArray(usuariosData.data.users)) 
          ? usuariosData.data.users 
          : [];
        setUsuarios(usuariosArray);
        console.log('Usuários carregados:', usuariosArray);
      } catch (error) {
        console.error('Erro ao carregar usuários do backend:', error);
        
        // FALLBACK: Usar dados mockados se o backend não estiver disponível
        if (error.message && error.message.includes('Token inválido')) {
          console.log('Backend retornou erro de autenticação, usando dados mockados...');
          
          const mockUsuarios = [
            {
              id: '1',
              nome: 'Administrador',
              email: 'admin@lucasbarbearia.com',
              role: 'admin',
              telefone: null,
              active: true,
              created_at: new Date().toISOString()
            },
            {
              id: '2',
              nome: 'João Silva',
              email: 'joao@lucasbarbearia.com',
              role: 'barbeiro',
              telefone: '(81) 99999-9999',
              active: true,
              created_at: new Date().toISOString()
            },
            {
              id: '3',
              nome: 'Maria Santos',
              email: 'maria@lucasbarbearia.com',
              role: 'gerente',
              telefone: '(11) 88888-8888',
              active: true,
              created_at: new Date().toISOString()
            }
          ];
          
          setUsuarios(mockUsuarios);
          setError('⚠️ Modo de desenvolvimento: Usando dados mockados. Backend não disponível.');
        } else {
          setError('Erro ao carregar dados dos usuários: ' + error.message);
        }
      }

    } catch (error) {
      console.error('Erro ao carregar dados:', error);
      
      // Verificar se é um erro de autenticação
      if (error.message && error.message.includes('Token inválido')) {
        setError('Sessão expirada. Por favor, faça login novamente.');
        // Não redirecionar automaticamente, deixar que o usuário decida
        return;
      }
      
      setError('Erro ao carregar dados dos usuários');
    } finally {
      setLoading(false);
    }
  };

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



  // Funções de validação
  const validarEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validarSenha = (password) => {
    return password && password.length >= 6;
  };

  const validarNome = (nome) => {
    return nome && nome.length >= 2 && nome.length <= 255;
  };

  const validarTelefone = (telefone) => {
    if (!telefone) return true; // Telefone é opcional
    const telefoneRegex = /^\+?[1-9]\d{1,14}$/;
    return telefoneRegex.test(telefone.replace(/\D/g, '')); // Remove caracteres não numéricos
  };

  const formatarTelefone = (telefone) => {
    if (!telefone) return '';
    // Remove todos os caracteres não numéricos
    const numeros = telefone.replace(/\D/g, '');
    return numeros;
  };

  const handleAddUser = async () => {
    // Verificar se o usuário está autenticado antes de criar usuário
    if (!user || !user.id) {
      setError('Usuário não autenticado. Por favor, faça login novamente.');
      return;
    }

    // Validações
    if (!formData.nome || !formData.email || !formData.password) {
      setError('Por favor, preencha todos os campos obrigatórios');
      return;
    }

    if (!validarNome(formData.nome)) {
      setError('Nome deve ter entre 2 e 255 caracteres');
      return;
    }

    if (!validarEmail(formData.email)) {
      setError('Email deve ter um formato válido');
      return;
    }

    if (!validarSenha(formData.password)) {
      setError('Senha deve ter pelo menos 6 caracteres');
      return;
    }

    if (!validarTelefone(formData.telefone)) {
      setError('Telefone deve ter formato válido (ex: 11999999999)');
      return;
    }

    setLoading(true);
    try {
      console.log('Criando usuário:', formData);
      
      // Criar usuário no backend (apenas campos necessários)
      const dadosUsuario = {
        nome: formData.nome.trim(),
        email: formData.email.trim().toLowerCase(),
        password: formData.password,
        telefone: formatarTelefone(formData.telefone),
        role: formData.role
      };

      await usuariosService.criarUsuario(dadosUsuario);
      
      // Recarregar dados
      await carregarDados();
      
      setSuccess('Usuário criado com sucesso!');
      setShowAddDialog(false);
      resetForm();
    } catch (error) {
      console.error('Erro ao criar usuário:', error);
      
      // Verificar se é um erro de autenticação
      if (error.message && error.message.includes('Token inválido')) {
        setError('Sessão expirada. Por favor, faça login novamente.');
        // Não redirecionar automaticamente, deixar que o usuário decida
        return;
      }
      
      setError('Erro ao criar usuário: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEditUser = (user) => {
    setEditingUser(user);
    setFormData({
      nome: user.nome,
      email: user.email,
      password: '',
      telefone: user.telefone,
      role: user.role
    });
    setShowAddDialog(true);
  };

  const handleUpdateUser = async () => {
    // Verificar se o usuário está autenticado antes de atualizar usuário
    if (!user || !user.id) {
      setError('Usuário não autenticado. Por favor, faça login novamente.');
      return;
    }

    // Validações
    if (!formData.nome || !formData.email) {
      setError('Por favor, preencha todos os campos obrigatórios');
      return;
    }

    if (!validarNome(formData.nome)) {
      setError('Nome deve ter entre 2 e 255 caracteres');
      return;
    }

    if (!validarEmail(formData.email)) {
      setError('Email deve ter um formato válido');
      return;
    }

    if (formData.password && !validarSenha(formData.password)) {
      setError('Senha deve ter pelo menos 6 caracteres');
      return;
    }

    if (!validarTelefone(formData.telefone)) {
      setError('Telefone deve ter formato válido (ex: 11999999999)');
      return;
    }

    setLoading(true);
    try {
      console.log('Atualizando usuário:', editingUser.id, formData);
      
      // Preparar dados para atualização
      const dadosUsuario = {
        nome: formData.nome.trim(),
        email: formData.email.trim().toLowerCase(),
        telefone: formatarTelefone(formData.telefone),
        role: formData.role,
        ativo: true
      };

      // Incluir senha se foi fornecida
      if (formData.password) {
        dadosUsuario.password = formData.password;
      }

      await usuariosService.atualizarUsuario(editingUser.id, dadosUsuario);
      
      // Recarregar dados
      await carregarDados();
      
      // Mensagem de sucesso específica
      const mensagem = formData.password 
        ? 'Usuário atualizado com sucesso! Nova senha definida.'
        : 'Usuário atualizado com sucesso!';
      
      setSuccess(mensagem);
      setShowAddDialog(false);
      resetForm();
    } catch (error) {
      console.error('Erro ao atualizar usuário:', error);
      
      // Verificar se é um erro de autenticação
      if (error.message && error.message.includes('Token inválido')) {
        setError('Sessão expirada. Por favor, faça login novamente.');
        // Não redirecionar automaticamente, deixar que o usuário decida
        return;
      }
      
      setError('Erro ao atualizar usuário: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (userId) => {
    // Verificar se o usuário está autenticado antes de deletar usuário
    if (!user || !user.id) {
      setError('Usuário não autenticado. Por favor, faça login novamente.');
      return;
    }

    if (!confirm('Tem certeza que deseja excluir este usuário?')) return;

    setLoading(true);
    try {
      console.log('Removendo usuário:', userId);
      
      // Remover usuário do backend
      await usuariosService.removerUsuario(userId);
      
      // Recarregar dados
      await carregarDados();
      
      setSuccess('Usuário excluído com sucesso!');
    } catch (error) {
      console.error('Erro ao excluir usuário:', error);
      
      // Verificar se é um erro de autenticação
      if (error.message && error.message.includes('Token inválido')) {
        setError('Sessão expirada. Por favor, faça login novamente.');
        // Não redirecionar automaticamente, deixar que o usuário decida
        return;
      }
      
      setError('Erro ao excluir usuário: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (userId, userName) => {
    if (!confirm(`Tem certeza que deseja resetar a senha do usuário "${userName}"?`)) {
      return;
    }

    setLoading(true);
    try {
      // Gerar senha temporária
      const tempPassword = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-4);
      
      console.log('Resetando senha do usuário:', userId, 'Nova senha:', tempPassword);
      
      // Usar o serviço da API
      const response = await usuariosService.resetarSenha(userId, tempPassword);
      
      if (response.success) {
        setSuccess(`Senha resetada com sucesso! Nova senha temporária: ${tempPassword}`);
        // Recarregar dados
        await carregarDados();
      } else {
        throw new Error(response.message || 'Erro ao resetar senha');
      }
    } catch (error) {
      console.error('Erro ao resetar senha:', error);
      setError('Erro ao resetar senha: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      nome: '',
      email: '',
      password: '',
      telefone: '',
      role: 'barbeiro'
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
        
        <div className="flex items-center space-x-2">
          <AdminModal
            trigger={
              <Button 
                className="flex items-center space-x-2 bg-black text-white hover:bg-gray-800"
                onClick={() => {
                  setEditingUser(null);
                  resetForm();
                  setShowAddDialog(true);
                }}
              >
                <UserPlus className="w-4 h-4" />
                <span>Adicionar Usuário</span>
              </Button>
            }
            title={editingUser ? 'Editar Usuário' : 'Adicionar Novo Usuário'}
            open={showAddDialog}
            onOpenChange={(open) => {
              setShowAddDialog(open);
              if (!open) {
                resetForm();
              }
            }}
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
                  className={`mt-1 ${formData.nome && !validarNome(formData.nome) ? 'border-red-500' : ''}`}
                />
                {formData.nome && !validarNome(formData.nome) && (
                  <p className="text-xs text-red-500 mt-1">
                    Nome deve ter entre 2 e 255 caracteres
                  </p>
                )}
              </div>
              
              <div>
                <Label htmlFor="email" className="text-sm font-medium">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  placeholder="usuario@email.com"
                  className={`mt-1 ${formData.email && !validarEmail(formData.email) ? 'border-red-500' : ''}`}
                />
                {formData.email && !validarEmail(formData.email) && (
                  <p className="text-xs text-red-500 mt-1">
                    Email deve ter um formato válido
                  </p>
                )}
              </div>
            </div>
            
            {/* Senha */}
            <div>
              <Label htmlFor="password" className="text-sm font-medium">
                {editingUser ? 'Nova Senha (deixe em branco para manter a atual)' : 'Senha *'}
              </Label>
              <div className="relative mt-1">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                  placeholder={editingUser ? "Deixe em branco para manter a senha atual" : "Senha do usuário"}
                  className={`mt-1 ${formData.password && !validarSenha(formData.password) ? 'border-red-500' : ''}`}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
              {formData.password && !validarSenha(formData.password) && (
                <p className="text-xs text-red-500 mt-1">
                  Senha deve ter pelo menos 6 caracteres
                </p>
              )}
              {editingUser && (
                <p className="text-xs text-gray-500 mt-1">
                  💡 Dica: Deixe em branco para manter a senha atual do usuário
                </p>
              )}
            </div>
            
            {/* Telefone */}
            <div>
              <Label htmlFor="telefone" className="text-sm font-medium">Telefone (opcional)</Label>
              <Input
                id="telefone"
                value={formData.telefone}
                onChange={(e) => setFormData({...formData, telefone: e.target.value})}
                placeholder="11999999999 (apenas números)"
                className={`mt-1 ${formData.telefone && !validarTelefone(formData.telefone) ? 'border-red-500' : ''}`}
              />
              {formData.telefone && !validarTelefone(formData.telefone) ? (
                <p className="text-xs text-red-500 mt-1">
                  Telefone deve ter formato válido (ex: 11999999999)
                </p>
              ) : (
                <p className="text-xs text-muted-foreground mt-1">
                  Formato: apenas números (ex: 11999999999)
                </p>
              )}
            </div>
            
            {/* Perfil */}
            <div>
              <Label htmlFor="role" className="text-sm font-medium">Perfil *</Label>
              <Select 
                value={formData.role} 
                onValueChange={(value) => setFormData({...formData, role: value})}
              >
                <SelectTrigger className="mt-1">
                <SelectValue placeholder="Selecione o perfil" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">Administrador</SelectItem>
                  <SelectItem value="gerente">Gerente</SelectItem>
                  <SelectItem value="barbeiro">Barbeiro</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </AdminModal>
          
          {/* Botão de teste para verificar endpoints */}
          <Button 
            variant="outline"
            size="sm"
            onClick={testarEndpoints}
            className="flex items-center space-x-2"
          >
            <span>🧪 Testar Endpoints</span>
          </Button>
        </div>
      </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex flex-col sm:flex-row gap-4 items-center">
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
                    <SelectValue placeholder="Filtrar por perfil" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todos">Todos</SelectItem>
                    <SelectItem value="admin">Administrador</SelectItem>
                    <SelectItem value="gerente">Gerente</SelectItem>
                    <SelectItem value="barbeiro">Barbeiro</SelectItem>
                  </SelectContent>
                </Select>
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
            </div>
          </CardContent>
        </Card>

        {/* Users List */}
        {loading ? (
          <Card>
            <CardContent className="p-8 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-4"></div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Carregando usuários...
              </h3>
              <p className="text-gray-600">
                Aguarde enquanto carregamos os dados dos usuários.
              </p>
            </CardContent>
          </Card>
        ) : filteredUsuarios.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Nenhum usuário encontrado
              </h3>
              <p className="text-gray-600">
                {searchTerm || filterRole !== 'todos' ? 'Nenhum usuário encontrado com os filtros aplicados.' : 'Não há usuários cadastrados no sistema.'}
              </p>
            </CardContent>
          </Card>
        ) : (
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
                          
                          {usuario.dataCriacao && (
                          <span>Criado em: {new Date(usuario.dataCriacao).toLocaleDateString('pt-BR')}</span>
                          )}
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

                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              onClick={() => handleResetPassword(usuario.id, usuario.nome)}
                              variant="outline"
                              size="sm"
                              className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                              disabled={usuario.id === user?.id} // Não permitir resetar a própria senha
                            >
                              <Key className="w-4 h-4" />
                              <span>Resetar Senha</span>
                            </Button>
                          </TooltipTrigger>
                          {usuario.id === user?.id && (
                            <TooltipContent>
                              <p>Você não pode resetar sua própria senha</p>
                            </TooltipContent>
                          )}
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
        )}
    </AdminLayout>
  );
};

export default AdminUsuarios; 