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
import { barbeariasService } from '@/services/api.js';
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

const AdminBarbearias = () => {
  const { user, logout } = useAuthBackend();
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
    whatsapp: '',
    instagram: '',
    ativa: true,
    configuracoes: {
      tempo_medio_atendimento: 40,
      max_clientes_fila: 30,
      permitir_agendamento: false,
      mostrar_tempo_estimado: false
    },
    horario: {
      segunda: { aberto: true, inicio: '08:00', fim: '18:00' },
      terca: { aberto: true, inicio: '08:00', fim: '18:00' },
      quarta: { aberto: true, inicio: '08:00', fim: '18:00' },
      quinta: { aberto: true, inicio: '08:00', fim: '18:00' },
      sexta: { aberto: true, inicio: '08:00', fim: '18:00' },
      sabado: { aberto: true, inicio: '08:00', fim: '18:00' },
      domingo: { aberto: false, inicio: '', fim: '' }
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
    // Carregar barbearias da API
    const carregarBarbearias = async () => {
      setLoading(true);
      try {
        const response = await barbeariasService.listarBarbearias();
        console.log('Resposta da API:', response); // Debug
        setBarbearias(response.data || []);
      } catch (error) {
        console.error('Erro ao carregar barbearias:', error);
        setError('Erro ao carregar barbearias. Tente novamente.');
        setBarbearias([]);
      } finally {
        setLoading(false);
      }
    };

    carregarBarbearias();
  }, []);

  const handleLogout = () => {
    logout();
  };

  const handleBack = () => {
    navigate('/admin/dashboard');
  };

  const handleAddBarbearia = async () => {
    if (!formData.nome || !formData.endereco || !formData.telefone) {
      setError('Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Preparar dados para a API
      const dadosBarbearia = {
        nome: formData.nome,
        endereco: formData.endereco,
        telefone: formData.telefone,
        whatsapp: formData.whatsapp || '',
        instagram: formData.instagram || '',
        ativo: formData.ativa,
        configuracoes: {
          tempo_medio_atendimento: formData.configuracoes?.tempo_medio_atendimento || 40,
          max_clientes_fila: formData.configuracoes?.max_clientes_fila || 30,
          permitir_agendamento: formData.configuracoes?.permitir_agendamento || false,
          mostrar_tempo_estimado: formData.configuracoes?.mostrar_tempo_estimado || false
        },
        horario: formData.horario || {
          segunda: { aberto: true, inicio: '08:00', fim: '18:00' },
          terca: { aberto: true, inicio: '08:00', fim: '18:00' },
          quarta: { aberto: true, inicio: '08:00', fim: '18:00' },
          quinta: { aberto: true, inicio: '08:00', fim: '18:00' },
          sexta: { aberto: true, inicio: '08:00', fim: '18:00' },
          sabado: { aberto: true, inicio: '08:00', fim: '18:00' },
          domingo: { aberto: false, inicio: '', fim: '' }
        },
        servicos: formData.servicos || []
      };

      const response = await barbeariasService.criarBarbearia(dadosBarbearia);
      console.log('Barbearia criada:', response); // Debug
      
      // Recarregar lista de barbearias
      const barbeariasResponse = await barbeariasService.listarBarbearias();
      setBarbearias(barbeariasResponse.data || []);
      
      setSuccess('Barbearia criada com sucesso!');
      setShowAddDialog(false);
      resetForm();
    } catch (error) {
      console.error('Erro ao criar barbearia:', error);
      setError('Erro ao criar barbearia. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleEditBarbearia = (barbearia) => {
    setEditingBarbearia(barbearia);
    setFormData({
      nome: barbearia.nome || '',
      endereco: barbearia.endereco || '',
      telefone: barbearia.telefone || '',
      whatsapp: barbearia.whatsapp || '',
      instagram: barbearia.instagram || '',
      ativa: barbearia.ativo !== false, // true se ativo for true ou undefined
      configuracoes: {
        tempo_medio_atendimento: barbearia.configuracoes?.tempo_medio_atendimento || 40,
        max_clientes_fila: barbearia.configuracoes?.max_clientes_fila || 30,
        permitir_agendamento: barbearia.configuracoes?.permitir_agendamento || false,
        mostrar_tempo_estimado: barbearia.configuracoes?.mostrar_tempo_estimado || false
      },
      horario: barbearia.horario || {
        segunda: { aberto: true, inicio: '08:00', fim: '18:00' },
        terca: { aberto: true, inicio: '08:00', fim: '18:00' },
        quarta: { aberto: true, inicio: '08:00', fim: '18:00' },
        quinta: { aberto: true, inicio: '08:00', fim: '18:00' },
        sexta: { aberto: true, inicio: '08:00', fim: '18:00' },
        sabado: { aberto: true, inicio: '08:00', fim: '18:00' },
        domingo: { aberto: false, inicio: '', fim: '' }
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
    if (!formData.nome || !formData.endereco || !formData.telefone) {
      setError('Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Preparar dados para a API
      const dadosBarbearia = {
        nome: formData.nome,
        endereco: formData.endereco,
        telefone: formData.telefone,
        whatsapp: formData.whatsapp || '',
        instagram: formData.instagram || '',
        ativo: formData.ativa,
        configuracoes: {
          tempo_medio_atendimento: formData.configuracoes?.tempo_medio_atendimento || 40,
          max_clientes_fila: formData.configuracoes?.max_clientes_fila || 30,
          permitir_agendamento: formData.configuracoes?.permitir_agendamento || false,
          mostrar_tempo_estimado: formData.configuracoes?.mostrar_tempo_estimado || false
        },
        horario: formData.horario || {
          segunda: { aberto: true, inicio: '08:00', fim: '18:00' },
          terca: { aberto: true, inicio: '08:00', fim: '18:00' },
          quarta: { aberto: true, inicio: '08:00', fim: '18:00' },
          quinta: { aberto: true, inicio: '08:00', fim: '18:00' },
          sexta: { aberto: true, inicio: '08:00', fim: '18:00' },
          sabado: { aberto: true, inicio: '08:00', fim: '18:00' },
          domingo: { aberto: false, inicio: '', fim: '' }
        },
        servicos: formData.servicos || []
      };

              await barbeariasService.atualizarBarbearia(editingBarbearia.id, dadosBarbearia);
      
      // Recarregar lista de barbearias
      const barbeariasResponse = await barbeariasService.listarBarbearias();
      setBarbearias(barbeariasResponse.data || []);
      
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
      
      // Recarregar lista de barbearias
      const barbeariasResponse = await barbeariasService.listarBarbearias();
      setBarbearias(barbeariasResponse.data || []);
      
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
      ativa: true,
      configuracoes: {
        tempo_medio_atendimento: 40,
        max_clientes_fila: 30,
        permitir_agendamento: false,
        mostrar_tempo_estimado: false
      },
      horario: {
        segunda: { aberto: true, inicio: '08:00', fim: '18:00' },
        terca: { aberto: true, inicio: '08:00', fim: '18:00' },
        quarta: { aberto: true, inicio: '08:00', fim: '18:00' },
        quinta: { aberto: true, inicio: '08:00', fim: '18:00' },
        sexta: { aberto: true, inicio: '08:00', fim: '18:00' },
        sabado: { aberto: true, inicio: '08:00', fim: '18:00' },
        domingo: { aberto: false, inicio: '', fim: '' }
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
          <div className="space-y-3 sm:space-y-4 max-h-[70vh] overflow-y-auto pr-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
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
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
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
              <Label className="text-sm font-medium">Configurações da Barbearia</Label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mt-1">
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
            
            {/* Seção de Serviços */}
            <div className="border-t pt-4">
              <Label className="text-sm font-medium">Serviços da Barbearia</Label>
              <div className="space-y-3 mt-2">
                {formData.servicos.map((servico, index) => (
                  <div key={index} className="border rounded-lg p-3 sm:p-4 bg-gray-50">
                    {/* Nome do Serviço */}
                    <div className="mb-3">
                      <Label className="text-xs font-medium text-gray-700 mb-1 block">
                        Nome do Serviço *
                      </Label>
                      <Input
                        placeholder="Ex: Corte Masculino Premium"
                        value={servico.nome}
                        onChange={(e) => {
                          const novosServicos = [...formData.servicos];
                          novosServicos[index].nome = e.target.value;
                          setFormData({...formData, servicos: novosServicos});
                        }}
                        className="text-sm h-9"
                      />
                    </div>
                    
                    {/* Preço e Duração em linha */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
                      <div>
                        <Label className="text-xs font-medium text-gray-700 mb-1 block">
                          Preço (R$) *
                        </Label>
                        <Input
                          type="number"
                          step="0.01"
                          min="0"
                          placeholder="35.00"
                          value={servico.preco}
                          onChange={(e) => {
                            const novosServicos = [...formData.servicos];
                            novosServicos[index].preco = parseFloat(e.target.value) || 0;
                            setFormData({...formData, servicos: novosServicos});
                          }}
                          className="text-sm h-9"
                        />
                      </div>
                      <div>
                        <Label className="text-xs font-medium text-gray-700 mb-1 block">
                          Duração (min) *
                        </Label>
                        <Input
                          type="number"
                          min="1"
                          placeholder="40"
                          value={servico.duracao}
                          onChange={(e) => {
                            const novosServicos = [...formData.servicos];
                            novosServicos[index].duracao = parseInt(e.target.value) || 30;
                            setFormData({...formData, servicos: novosServicos});
                          }}
                          className="text-sm h-9"
                        />
                      </div>
                    </div>
                    
                    {/* Descrição */}
                    <div className="mb-3">
                      <Label className="text-xs font-medium text-gray-700 mb-1 block">
                        Descrição (opcional)
                      </Label>
                      <Input
                        placeholder="Ex: Corte com técnicas avançadas"
                        value={servico.descricao}
                        onChange={(e) => {
                          const novosServicos = [...formData.servicos];
                          novosServicos[index].descricao = e.target.value;
                          setFormData({...formData, servicos: novosServicos});
                        }}
                        className="text-sm h-9"
                      />
                    </div>
                    
                    {/* Botão Excluir */}
                    <div className="flex justify-end">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          const novosServicos = formData.servicos.filter((_, i) => i !== index);
                          setFormData({...formData, servicos: novosServicos});
                        }}
                        className="text-red-600 hover:text-red-700 border-red-200 hover:bg-red-50"
                      >
                        <Trash2 className="w-3 h-3 mr-1" />
                        Remover
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
                      <Badge className={barbearia.ativo !== false ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}>
                        {barbearia.ativo !== false ? 'Ativa' : 'Inativa'}
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