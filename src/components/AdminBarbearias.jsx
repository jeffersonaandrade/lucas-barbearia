import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.jsx';
import { Button } from '@/components/ui/button.jsx';
import { Input } from '@/components/ui/input.jsx';
import { Label } from '@/components/ui/label.jsx';
import { Badge } from '@/components/ui/badge.jsx';
import { Textarea } from '@/components/ui/textarea.jsx';
import { useAuthBackend } from '@/hooks/useAuthBackend.js';
import AdminLayout from '@/components/ui/admin-layout.jsx';
import AdminModal from '@/components/ui/admin-modal.jsx';
import { barbeariasService, authService } from '@/services/api.js';
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
  QrCode,
  MessageCircle
} from 'lucide-react';

// Funções de validação e formatação
const formatarTelefone = (telefone) => {
  if (!telefone) return '';
  // Remove parênteses, hífens, espaços e caracteres especiais
  return telefone.replace(/[\(\)\-\s\.]/g, '');
};

const validarTelefone = (telefone) => {
  if (!telefone) return true; // Opcional
  const telefoneLimpo = formatarTelefone(telefone);
  const regex = /^\+?[1-9]\d{1,14}$/;
  return regex.test(telefoneLimpo);
};

const validarInstagram = (instagram) => {
  if (!instagram) return true; // Opcional
  const regex = /^[a-zA-Z0-9._]+$/;
  return regex.test(instagram);
};

const validarNome = (nome) => {
  return nome && nome.length >= 2 && nome.length <= 255;
};

const validarEndereco = (endereco) => {
  return endereco && endereco.length >= 10;
};

const validarServicos = (servicos) => {
  if (!Array.isArray(servicos) || servicos.length === 0) return false;
  
  return servicos.every(servico => 
    servico.nome && 
    servico.nome.trim() && 
    servico.preco > 0 && 
    servico.duracao > 0
  );
};

const validarHorario = (horario) => {
  const dias = ['segunda', 'terca', 'quarta', 'quinta', 'sexta', 'sabado', 'domingo'];
  
  return dias.every(dia => {
    const config = horario[dia];
    if (!config || typeof config.aberto !== 'boolean') return false;
    
    if (config.aberto) {
      // Se está aberto, deve ter início e fim
      return config.inicio && config.fim && 
             /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/.test(config.inicio) &&
             /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/.test(config.fim);
    }
    
    return true; // Se está fechado, não precisa de horários
  });
};

const AdminBarbearias = () => {
  const { user, logout } = useAuthBackend();
  const navigate = useNavigate();
  const [barbearias, setBarbearias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [editingBarbearia, setEditingBarbearia] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [formData, setFormData] = useState({
    nome: '',
    endereco: '',
    telefone: '',
    whatsapp: '',
    instagram: '',
    horario: {
      segunda: { aberto: true, inicio: '09:00', fim: '19:00' },
      terca: { aberto: true, inicio: '09:00', fim: '19:00' },
      quarta: { aberto: true, inicio: '09:00', fim: '19:00' },
      quinta: { aberto: true, inicio: '09:00', fim: '19:00' },
      sexta: { aberto: true, inicio: '09:00', fim: '19:00' },
      sabado: { aberto: true, inicio: '08:00', fim: '19:00' },
      domingo: { aberto: false }
    },
    configuracoes: {
      tempo_medio_atendimento: 40,
      max_clientes_fila: 30,
      permitir_agendamento: true,
      mostrar_tempo_estimado: true
    },
    servicos: [
      {
        nome: 'Corte Masculino Premium',
        preco: 35.00,
        duracao: 40,
        descricao: 'Corte com técnicas avançadas'
      },
      {
        nome: 'Barba Completa',
        preco: 20.00,
        duracao: 25,
        descricao: 'Aparar e desenhar'
      }
    ]
  });

  useEffect(() => {
    // Log do estado do usuário
    console.log('Estado do usuário:', user);
    console.log('Token no sessionStorage:', sessionStorage.getItem('adminToken'));
    console.log('Role no sessionStorage:', sessionStorage.getItem('userRole'));
    
    // Carregar barbearias do backend
    const carregarBarbearias = async () => {
      try {
        setLoading(true);
        const barbeariasData = await barbeariasService.listarBarbearias();
        console.log('Dados recebidos do backend:', barbeariasData);
        console.log('Tipo dos dados:', typeof barbeariasData);
        console.log('É array?', Array.isArray(barbeariasData));
        
        // Extrair o array de barbearias da resposta
        const barbeariasArray = (barbeariasData && barbeariasData.data && Array.isArray(barbeariasData.data)) 
          ? barbeariasData.data 
          : [];
        
        console.log('Barbearias extraídas:', barbeariasArray);
        setBarbearias(barbeariasArray);
        console.log('Barbearias definidas no estado:', barbeariasArray);
      } catch (error) {
        console.error('Erro ao carregar barbearias:', error);
        setError('Erro ao carregar barbearias do servidor');
        setBarbearias([]); // Garantir que seja um array vazio em caso de erro
      } finally {
        setLoading(false);
      }
    };

    carregarBarbearias();
  }, [user]);

  const handleLogout = () => {
    logout();
  };

  const handleBack = () => {
    navigate('/admin/dashboard');
  };

  const handleAddBarbearia = async () => {
    console.log('handleAddBarbearia chamado - editingBarbearia:', editingBarbearia);
    
    // Verificar se o usuário está logado
    const token = sessionStorage.getItem('adminToken');
    if (!token) {
      setError('Você precisa estar logado para criar uma barbearia.');
      return;
    }
    
    // Verificar se o usuário tem role de admin
    const userRole = sessionStorage.getItem('userRole');
    if (userRole !== 'admin') {
      setError('Você precisa ter permissão de administrador para criar barbearias.');
      return;
    }
    
    console.log('Token encontrado:', token.substring(0, 20) + '...');
    console.log('Role do usuário:', userRole);
    console.log('Estado do usuário do hook:', user);
    
    // Verificar se o token não está expirado
    try {
      const tokenParts = token.split('.');
      if (tokenParts.length === 3) {
        const payload = JSON.parse(atob(tokenParts[1]));
        const now = Math.floor(Date.now() / 1000);
        if (payload.exp < now) {
          setError('Token expirado. Faça login novamente.');
          return;
        }
        console.log('Token válido até:', new Date(payload.exp * 1000).toLocaleString());
        console.log('Payload completo do token:', payload);
      }
    } catch (error) {
      console.log('Erro ao verificar expiração do token:', error);
    }
    
    // Testar autenticação antes de criar barbearia
    try {
      console.log('Testando autenticação...');
      const currentUser = await authService.getCurrentUser();
      console.log('Usuário atual validado:', currentUser);
    } catch (error) {
      console.error('Erro na validação do usuário:', error);
      setError('Erro na validação da autenticação. Faça login novamente.');
      return;
    }
    
    // Validações obrigatórias
    if (!validarNome(formData.nome)) {
      setError('Nome deve ter entre 2 e 255 caracteres.');
      return;
    }
    
    if (!validarEndereco(formData.endereco)) {
      setError('Endereço deve ter pelo menos 10 caracteres.');
      return;
    }
    
    // Validações de formato
    if (!validarTelefone(formData.telefone)) {
      setError('Telefone deve estar no formato: 11999999999 ou +5511999999999 (sem parênteses ou hífens).');
      return;
    }
    
    if (!validarTelefone(formData.whatsapp)) {
      setError('WhatsApp deve estar no formato: 11999999999 ou +5511999999999 (sem parênteses ou hífens).');
      return;
    }
    
    if (!validarInstagram(formData.instagram)) {
      setError('Instagram deve conter apenas letras, números, pontos e underscores (ex: lucasbarbearia).');
      return;
    }
    
    // Validar horário
    if (!validarHorario(formData.horario)) {
      setError('Horário de funcionamento inválido. Verifique se todos os dias abertos têm horários válidos.');
      return;
    }
    
    // Validar serviços
    if (!validarServicos(formData.servicos)) {
      setError('Por favor, adicione pelo menos um serviço válido com nome, preço e duração.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Formatar dados antes de enviar
      const dadosFormatados = {
        ...formData,
        telefone: formatarTelefone(formData.telefone),
        whatsapp: formatarTelefone(formData.whatsapp),
        instagram: formData.instagram ? formData.instagram.replace('@', '') : '',
        configuracoes: {
          tempo_medio_atendimento: formData.configuracoes.tempo_medio_atendimento || 30,
          max_clientes_fila: formData.configuracoes.max_clientes_fila || 50,
          permitir_agendamento: formData.configuracoes.permitir_agendamento || false,
          mostrar_tempo_estimado: formData.configuracoes.mostrar_tempo_estimado !== false
        }
      };
      
      console.log('Dados sendo enviados para o backend:', dadosFormatados);
      const response = await barbeariasService.criarBarbearia(dadosFormatados);
      console.log('Resposta do backend:', response);
      
      // Extrair a barbearia da resposta
      const novaBarbearia = response.data || response;
      console.log('Barbearia extraída:', novaBarbearia);
      
      setBarbearias(prev => {
        const prevArray = Array.isArray(prev) ? prev : [];
        return [...prevArray, novaBarbearia];
      });
      setSuccess('Barbearia criada com sucesso!');
      setShowAddDialog(false);
      resetForm();
      
      // Recarregar a lista de barbearias para garantir sincronização
      try {
        const barbeariasData = await barbeariasService.listarBarbearias();
        const barbeariasArray = (barbeariasData && barbeariasData.data && Array.isArray(barbeariasData.data)) 
          ? barbeariasData.data 
          : [];
        setBarbearias(barbeariasArray);
        console.log('Lista de barbearias atualizada:', barbeariasArray);
        console.log('Estado atual das barbearias:', barbeariasArray);
      } catch (error) {
        console.error('Erro ao recarregar barbearias:', error);
        // Em caso de erro, manter a barbearia criada no estado
        setBarbearias(prev => {
          const prevArray = Array.isArray(prev) ? prev : [];
          return [...prevArray, novaBarbearia];
        });
      }
    } catch (error) {
      console.error('Erro ao criar barbearia:', error);
      console.error('Detalhes do erro:', {
        message: error.message,
        status: error.status,
        response: error.response
      });
      setError(`Erro ao criar barbearia: ${error.message}`);
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
      whatsapp: barbearia.whatsapp || '',
      instagram: barbearia.instagram || '',
      horario: barbearia.horario || {
        segunda: { aberto: true, inicio: '09:00', fim: '19:00' },
        terca: { aberto: true, inicio: '09:00', fim: '19:00' },
        quarta: { aberto: true, inicio: '09:00', fim: '19:00' },
        quinta: { aberto: true, inicio: '09:00', fim: '19:00' },
        sexta: { aberto: true, inicio: '09:00', fim: '19:00' },
        sabado: { aberto: true, inicio: '08:00', fim: '19:00' },
        domingo: { aberto: false }
      },
      configuracoes: barbearia.configuracoes || {
        tempo_medio_atendimento: 40,
        max_clientes_fila: 30,
        permitir_agendamento: true,
        mostrar_tempo_estimado: true
      },
      servicos: barbearia.servicos || [
        {
          nome: 'Corte Masculino Premium',
          preco: 35.00,
          duracao: 40,
          descricao: 'Corte com técnicas avançadas'
        },
        {
          nome: 'Barba Completa',
          preco: 20.00,
          duracao: 25,
          descricao: 'Aparar e desenhar'
        }
      ]
    });
    setShowAddDialog(true);
  };

  const handleUpdateBarbearia = async () => {
    console.log('handleUpdateBarbearia chamado - editingBarbearia:', editingBarbearia);
    
    // Verificar se o usuário está logado
    const token = sessionStorage.getItem('adminToken');
    if (!token) {
      setError('Você precisa estar logado para atualizar uma barbearia.');
      return;
    }
    
    // Verificar se o usuário tem role de admin
    const userRole = sessionStorage.getItem('userRole');
    if (userRole !== 'admin') {
      setError('Você precisa ter permissão de administrador para atualizar barbearias.');
      return;
    }
    
    console.log('Token encontrado para atualização:', token.substring(0, 20) + '...');
    console.log('Role do usuário:', userRole);
    
    // Validações obrigatórias
    if (!validarNome(formData.nome)) {
      setError('Nome deve ter entre 2 e 255 caracteres.');
      return;
    }
    
    if (!validarEndereco(formData.endereco)) {
      setError('Endereço deve ter pelo menos 10 caracteres.');
      return;
    }
    
    // Validações de formato
    if (!validarTelefone(formData.telefone)) {
      setError('Telefone deve estar no formato: 11999999999 ou +5511999999999 (sem parênteses ou hífens).');
      return;
    }
    
    if (!validarTelefone(formData.whatsapp)) {
      setError('WhatsApp deve estar no formato: 11999999999 ou +5511999999999 (sem parênteses ou hífens).');
      return;
    }
    
    if (!validarInstagram(formData.instagram)) {
      setError('Instagram deve conter apenas letras, números, pontos e underscores (ex: lucasbarbearia).');
      return;
    }
    
    // Validar horário
    if (!validarHorario(formData.horario)) {
      setError('Horário de funcionamento inválido. Verifique se todos os dias abertos têm horários válidos.');
      return;
    }
    
    // Validar serviços
    if (!validarServicos(formData.servicos)) {
      setError('Por favor, adicione pelo menos um serviço válido com nome, preço e duração.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Formatar dados antes de enviar
      const dadosFormatados = {
        ...formData,
        telefone: formatarTelefone(formData.telefone),
        whatsapp: formatarTelefone(formData.whatsapp),
        instagram: formData.instagram ? formData.instagram.replace('@', '') : '',
        configuracoes: {
          tempo_medio_atendimento: formData.configuracoes.tempo_medio_atendimento || 30,
          max_clientes_fila: formData.configuracoes.max_clientes_fila || 50,
          permitir_agendamento: formData.configuracoes.permitir_agendamento || false,
          mostrar_tempo_estimado: formData.configuracoes.mostrar_tempo_estimado !== false
        }
      };
      
      const barbeariaAtualizada = await barbeariasService.atualizarBarbearia(editingBarbearia.id, dadosFormatados);
      setBarbearias(prev => prev.map(barbearia => 
        barbearia.id === editingBarbearia.id 
          ? barbeariaAtualizada
          : barbearia
      ));
      setSuccess('Barbearia atualizada com sucesso!');
      setShowAddDialog(false);
      resetForm();
    } catch (error) {
      console.error('Erro ao atualizar barbearia:', error);
      setError('Erro ao atualizar barbearia. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteBarbearia = async (barbeariaId) => {
    if (!confirm('Tem certeza que deseja excluir esta barbearia?')) {
      return;
    }

    try {
      await barbeariasService.removerBarbearia(barbeariaId);
      setBarbearias(prev => prev.filter(barbearia => barbearia.id !== barbeariaId));
      setSuccess('Barbearia excluída com sucesso!');
    } catch (error) {
      console.error('Erro ao excluir barbearia:', error);
      setError('Erro ao excluir barbearia. Tente novamente.');
    }
  };

  const resetForm = () => {
    setFormData({
      nome: '',
      endereco: '',
      telefone: '',
      whatsapp: '',
      instagram: '',
      horario: {
        segunda: { aberto: true, inicio: '09:00', fim: '19:00' },
        terca: { aberto: true, inicio: '09:00', fim: '19:00' },
        quarta: { aberto: true, inicio: '09:00', fim: '19:00' },
        quinta: { aberto: true, inicio: '09:00', fim: '19:00' },
        sexta: { aberto: true, inicio: '09:00', fim: '19:00' },
        sabado: { aberto: true, inicio: '08:00', fim: '19:00' },
        domingo: { aberto: false }
      },
      configuracoes: {
        tempo_medio_atendimento: 40,
        max_clientes_fila: 30,
        permitir_agendamento: true,
        mostrar_tempo_estimado: true
      },
      servicos: [
        {
          nome: 'Corte Masculino Premium',
          preco: 35.00,
          duracao: 40,
          descricao: 'Corte com técnicas avançadas'
        },
        {
          nome: 'Barba Completa',
          preco: 20.00,
          duracao: 25,
          descricao: 'Aparar e desenhar'
        }
      ]
    });
    setEditingBarbearia(null);
    setError('');
  };

  const filteredBarbearias = (Array.isArray(barbearias) ? barbearias : []).filter(barbearia => 
    barbearia.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    barbearia.endereco.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Verificação de segurança para evitar erros de renderização
  if (!Array.isArray(barbearias)) {
    console.error('Barbearias não é um array:', barbearias);
    setBarbearias([]);
  }

  // Mostrar loading enquanto carrega dados iniciais
  if (loading && (!Array.isArray(barbearias) || barbearias.length === 0)) {
    return (
      <AdminLayout onLogout={handleLogout} onBack={handleBack}>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-4"></div>
            <p>Carregando barbearias...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  // Fallback para erro de renderização
  if (error && error.includes('render')) {
    return (
      <AdminLayout onLogout={handleLogout} onBack={handleBack}>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <h3 className="text-lg font-semibold text-red-600 mb-2">Erro de Renderização</h3>
            <p className="text-gray-600 mb-4">Ocorreu um erro ao renderizar a página</p>
            <Button onClick={() => window.location.reload()}>
              Recarregar Página
            </Button>
          </div>
        </div>
      </AdminLayout>
    );
  }

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
            <Button 
              className="flex items-center space-x-2"
              onClick={() => {
                console.log('Abrindo modal para nova barbearia');
                setEditingBarbearia(null);
                resetForm();
                setShowAddDialog(true);
                console.log('Estado editingBarbearia limpo:', null);
              }}
            >
              <Plus className="w-4 h-4" />
              <span>Nova Barbearia</span>
            </Button>
          }
          title={editingBarbearia ? 'Editar Barbearia' : 'Adicionar Nova Barbearia'}
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
          onConfirm={editingBarbearia ? handleUpdateBarbearia : handleAddBarbearia}
          confirmText={editingBarbearia ? 'Atualizar' : 'Criar'}
          loading={loading}
        >
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
                  placeholder="11999999999 (sem parênteses ou hífens)"
                  className="mt-1"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 sm:gap-4">
              <div>
                <Label htmlFor="whatsapp" className="text-sm font-medium">WhatsApp</Label>
                <Input
                  id="whatsapp"
                  value={formData.whatsapp}
                  onChange={(e) => setFormData({...formData, whatsapp: e.target.value})}
                  placeholder="11999999999 (sem parênteses ou hífens)"
                  className="mt-1"
                />
              </div>
              
              <div>
                <Label htmlFor="instagram" className="text-sm font-medium">Instagram</Label>
                <Input
                  id="instagram"
                  value={formData.instagram}
                  onChange={(e) => setFormData({...formData, instagram: e.target.value})}
                  placeholder="lucasbarbearia (sem @ ou hífens)"
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
            

            
            <div>
              <Label className="text-sm font-medium">Configurações da Barbearia</Label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 sm:gap-4 mt-1">
              <div>
                  <Label htmlFor="tempo_medio" className="text-xs font-medium">Tempo Médio de Atendimento (min)</Label>
                <Input
                    id="tempo_medio"
                    type="number"
                    value={formData.configuracoes.tempo_medio_atendimento}
                    onChange={(e) => setFormData({
                      ...formData, 
                      configuracoes: {
                        ...formData.configuracoes,
                        tempo_medio_atendimento: parseInt(e.target.value)
                      }
                    })}
                    placeholder="40"
                  className="mt-1"
                />
              </div>
              
              <div>
                  <Label htmlFor="max_clientes" className="text-xs font-medium">Máximo de Clientes na Fila</Label>
                <Input
                    id="max_clientes"
                  type="number"
                    value={formData.configuracoes.max_clientes_fila}
                    onChange={(e) => setFormData({
                      ...formData, 
                      configuracoes: {
                        ...formData.configuracoes,
                        max_clientes_fila: parseInt(e.target.value)
                      }
                    })}
                    placeholder="30"
                  className="mt-1"
                />
                </div>
              </div>
              
              <div className="flex items-center space-x-4 mt-3">
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="permitir_agendamento"
                    checked={formData.configuracoes.permitir_agendamento}
                    onChange={(e) => setFormData({
                      ...formData, 
                      configuracoes: {
                        ...formData.configuracoes,
                        permitir_agendamento: e.target.checked
                      }
                    })}
                    className="rounded border-gray-300"
                  />
                  <Label htmlFor="permitir_agendamento" className="text-xs">Permitir Agendamento</Label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="mostrar_tempo_estimado"
                    checked={formData.configuracoes.mostrar_tempo_estimado}
                    onChange={(e) => setFormData({
                      ...formData, 
                      configuracoes: {
                        ...formData.configuracoes,
                        mostrar_tempo_estimado: e.target.checked
                      }
                    })}
                    className="rounded border-gray-300"
                  />
                  <Label htmlFor="mostrar_tempo_estimado" className="text-xs">Mostrar Tempo Estimado</Label>
                </div>
              </div>
            </div>
            
            <div>
              <Label className="text-sm font-medium">Horário de Funcionamento</Label>
              <div className="space-y-2 mt-1">
                {Object.entries(formData.horario).map(([dia, config]) => (
                  <div key={dia} className="flex items-center space-x-3 p-2 border rounded">
                    <input
                      type="checkbox"
                      id={`${dia}_aberto`}
                      checked={config.aberto}
                      onChange={(e) => setFormData({
                        ...formData,
                        horario: {
                          ...formData.horario,
                          [dia]: {
                            ...config,
                            aberto: e.target.checked
                          }
                        }
                      })}
                      className="rounded border-gray-300"
                    />
                    <Label htmlFor={`${dia}_aberto`} className="text-sm capitalize w-20">
                      {dia === 'segunda' ? 'Segunda' : 
                       dia === 'terca' ? 'Terça' : 
                       dia === 'quarta' ? 'Quarta' : 
                       dia === 'quinta' ? 'Quinta' : 
                       dia === 'sexta' ? 'Sexta' : 
                       dia === 'sabado' ? 'Sábado' : 'Domingo'}
                    </Label>
                    
                    {config.aberto && (
                      <div className="flex items-center space-x-2">
                        <Input
                          type="time"
                          value={config.inicio}
                          onChange={(e) => setFormData({
                            ...formData,
                            horario: {
                              ...formData.horario,
                              [dia]: {
                                ...config,
                                inicio: e.target.value
                              }
                            }
                          })}
                          className="w-24"
                        />
                        <span className="text-sm">às</span>
              <Input
                          type="time"
                          value={config.fim}
                          onChange={(e) => setFormData({
                            ...formData,
                            horario: {
                              ...formData.horario,
                              [dia]: {
                                ...config,
                                fim: e.target.value
                              }
                            }
                          })}
                          className="w-24"
                        />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
            
            <div>
              <Label className="text-sm font-medium">Serviços</Label>
              <div className="space-y-2 mt-1">
                {formData.servicos.map((servico, index) => (
                  <div key={index} className="grid grid-cols-1 md:grid-cols-4 gap-2 p-2 border rounded">
                    <Input
                      placeholder="Nome do serviço"
                      value={servico.nome}
                      onChange={(e) => {
                        const novosServicos = [...formData.servicos];
                        novosServicos[index].nome = e.target.value;
                        setFormData({...formData, servicos: novosServicos});
                      }}
                      className="text-xs"
                    />
                    <Input
                      type="number"
                      placeholder="Preço"
                      value={servico.preco}
                      onChange={(e) => {
                        const novosServicos = [...formData.servicos];
                        novosServicos[index].preco = parseFloat(e.target.value);
                        setFormData({...formData, servicos: novosServicos});
                      }}
                      className="text-xs"
                    />
                    <Input
                      type="number"
                      placeholder="Duração (min)"
                      value={servico.duracao}
                      onChange={(e) => {
                        const novosServicos = [...formData.servicos];
                        novosServicos[index].duracao = parseInt(e.target.value);
                        setFormData({...formData, servicos: novosServicos});
                      }}
                      className="text-xs"
                    />
                    <div className="flex items-center space-x-1">
                      <Input
                        placeholder="Descrição"
                        value={servico.descricao}
                        onChange={(e) => {
                          const novosServicos = [...formData.servicos];
                          novosServicos[index].descricao = e.target.value;
                          setFormData({...formData, servicos: novosServicos});
                        }}
                        className="text-xs"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          const novosServicos = formData.servicos.filter((_, i) => i !== index);
                          setFormData({...formData, servicos: novosServicos});
                        }}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                ))}
                
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    const novosServicos = [...formData.servicos, {
                      nome: '',
                      preco: 0,
                      duracao: 30,
                      descricao: ''
                    }];
                    setFormData({...formData, servicos: novosServicos});
                  }}
                  className="w-full"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Adicionar Serviço
                </Button>
              </div>
            </div>
            
          </div>
        </AdminModal>
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
                      <Badge className="bg-green-100 text-green-800">
                        Ativa
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
                      
                      {barbearia.whatsapp && (
                        <div className="flex items-center space-x-2">
                          <MessageCircle className="w-4 h-4" />
                          <span>WhatsApp: {barbearia.whatsapp}</span>
                        </div>
                      )}
                      
                      {barbearia.instagram && (
                        <div className="flex items-center space-x-2">
                          <Mail className="w-4 h-4" />
                          <span>Instagram: {barbearia.instagram}</span>
                        </div>
                      )}
                      
                      {barbearia.configuracoes && (
                      <div className="flex items-center space-x-2">
                        <Clock className="w-4 h-4" />
                          <span>Tempo médio: {barbearia.configuracoes.tempo_medio_atendimento}min • Máx. fila: {barbearia.configuracoes.max_clientes_fila}</span>
                      </div>
                      )}
                      
                      {barbearia.servicos && barbearia.servicos.length > 0 && (
                      <div className="flex items-center space-x-2">
                        <Users className="w-4 h-4" />
                          <span>{barbearia.servicos.length} serviços disponíveis</span>
                      </div>
                      )}
                      
                      <span>Criada em: {barbearia.createdAt ? new Date(barbearia.createdAt).toLocaleDateString('pt-BR') : 'Data não informada'}</span>
                    </div>
                    

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
    </AdminLayout>
  );
};

export default AdminBarbearias; 