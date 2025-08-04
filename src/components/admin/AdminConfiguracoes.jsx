import { useState, useEffect } from 'react';
import { useConfiguracoes } from '../../hooks/useConfiguracoes';
import { barbeariasService } from '../../services/api.js';
import { CookieManager } from '../../utils/cookieManager.js';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Separator } from '../ui/separator';
import { 
  Settings, 
  Scissors, 
  Clock, 
  Plus, 
  Edit, 
  Trash2,
  Save,
  X,
  Building2,
  DollarSign
} from 'lucide-react';
import { Alert, AlertDescription } from '../ui/alert';
import LoadingSpinner from '../ui/loading-spinner';
import Notification from '../ui/notification';
import BarbeariaSelector from './BarbeariaSelector';
import AdminComissoes from './AdminComissoes';

// Componente para gerenciar serviços
const GerenciarServicos = ({ configuracoes, onCriarServico, onAtualizarServico, onExcluirServico, onShowNotification }) => {
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    nome: '',
    descricao: '',
    preco: '',
    duracao: '',
    categoria: 'corte'
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await onAtualizarServico(editingId, formData);
        onShowNotification('success', 'Serviço atualizado com sucesso!');
        setEditingId(null);
      } else {
        await onCriarServico(formData);
        onShowNotification('success', 'Serviço criado com sucesso!');
      }
      setFormData({ nome: '', descricao: '', preco: '', duracao: '', categoria: 'corte' });
      setShowForm(false);
    } catch (error) {
      console.error('Erro ao salvar serviço:', error);
      onShowNotification('error', 'Erro ao salvar serviço. Tente novamente.');
    }
  };

  const handleEdit = (servico) => {
    setEditingId(servico.id);
    setFormData({
      nome: servico.nome,
      descricao: servico.descricao || '',
      preco: servico.preco.toString(),
      duracao: servico.duracao.toString(),
      categoria: servico.categoria
    });
    setShowForm(true);
  };

  const handleDelete = async (servicoId) => {
    if (window.confirm('Tem certeza que deseja excluir este serviço?')) {
      try {
        await onExcluirServico(servicoId);
        onShowNotification('success', 'Serviço excluído com sucesso!');
      } catch (error) {
        console.error('Erro ao excluir serviço:', error);
        onShowNotification('error', 'Erro ao excluir serviço. Tente novamente.');
      }
    }
  };

  const categorias = [
    { value: 'corte', label: 'Corte' },
    { value: 'barba', label: 'Barba' },
    { value: 'combo', label: 'Combo' },
    { value: 'tratamento', label: 'Tratamento' }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Serviços Disponíveis</h3>
        <Button 
          onClick={() => {
            setShowForm(true);
            setEditingId(null);
            setFormData({ nome: '', descricao: '', preco: '', duracao: '', categoria: 'corte' });
          }}
          className="flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Novo Serviço
        </Button>
      </div>

      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>{editingId ? 'Editar Serviço' : 'Novo Serviço'}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Nome</label>
                  <input
                    type="text"
                    value={formData.nome}
                    onChange={(e) => setFormData({...formData, nome: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Categoria</label>
                  <select
                    value={formData.categoria}
                    onChange={(e) => setFormData({...formData, categoria: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {categorias.map(cat => (
                      <option key={cat.value} value={cat.value}>{cat.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Preço (R$)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.preco}
                    onChange={(e) => setFormData({...formData, preco: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Duração (minutos)</label>
                  <input
                    type="number"
                    value={formData.duracao}
                    onChange={(e) => setFormData({...formData, duracao: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Descrição</label>
                <textarea
                  value={formData.descricao}
                  onChange={(e) => setFormData({...formData, descricao: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows="3"
                />
              </div>
              <div className="flex gap-2">
                <Button type="submit" className="flex items-center gap-2">
                  <Save className="h-4 w-4" />
                  {editingId ? 'Atualizar' : 'Criar'}
                </Button>
                <Button 
                  type="button" 
                  variant="outline"
                  onClick={() => {
                    setShowForm(false);
                    setEditingId(null);
                    setFormData({ nome: '', descricao: '', preco: '', duracao: '', categoria: 'corte' });
                  }}
                  className="flex items-center gap-2"
                >
                  <X className="h-4 w-4" />
                  Cancelar
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {configuracoes?.servicos?.map(servico => (
          <Card key={servico.id}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg">{servico.nome}</CardTitle>
                  <Badge variant="secondary" className="mt-1">
                    {categorias.find(cat => cat.value === servico.categoria)?.label}
                  </Badge>
                </div>
                <div className="flex gap-1">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleEdit(servico)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleDelete(servico.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {servico.descricao && (
                <p className="text-gray-600 mb-3">{servico.descricao}</p>
              )}
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Preço:</span>
                  <span className="font-semibold">R$ {servico.preco.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Duração:</span>
                  <span>{servico.duracao} min</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

// Componente para gerenciar horários
const GerenciarHorarios = ({ barbeariaId, onShowNotification }) => {
  const [horarios, setHorarios] = useState({
    domingo: { aberto: false, hora_inicio: null, hora_fim: null },
    segunda: { aberto: false, hora_inicio: null, hora_fim: null },
    terca: { aberto: false, hora_inicio: null, hora_fim: null },
    quarta: { aberto: false, hora_inicio: null, hora_fim: null },
    quinta: { aberto: false, hora_inicio: null, hora_fim: null },
    sexta: { aberto: false, hora_inicio: null, hora_fim: null },
    sabado: { aberto: false, hora_inicio: null, hora_fim: null }
  });
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);

  const diasSemana = [
    { id: 'domingo', nome: 'Domingo' },
    { id: 'segunda', nome: 'Segunda-feira' },
    { id: 'terca', nome: 'Terça-feira' },
    { id: 'quarta', nome: 'Quarta-feira' },
    { id: 'quinta', nome: 'Quinta-feira' },
    { id: 'sexta', nome: 'Sexta-feira' },
    { id: 'sabado', nome: 'Sábado' }
  ];

  // Carregar horários do backend
  const carregarHorarios = async () => {
    if (!barbeariaId) return;
    
    try {
      setLoading(true);
      const response = await fetch(`/api/configuracoes/horarios/${barbeariaId}`, {
        headers: {
          'Authorization': `Bearer ${CookieManager.getAdminToken()}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setHorarios(data.data || horarios);
      } else {
        console.error('Erro ao carregar horários:', response.status);
      }
    } catch (error) {
      console.error('Erro ao carregar horários:', error);
    } finally {
      setLoading(false);
    }
  };

  // Carregar horários quando barbearia mudar
  useEffect(() => {
    carregarHorarios();
  }, [barbeariaId]);

  const handleSave = async () => {
    if (!barbeariaId) return;
    
    try {
      setLoading(true);
              const response = await fetch(`/api/configuracoes/horarios/${barbeariaId}`, {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${CookieManager.getAdminToken()}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(horarios)
        });
      
      if (response.ok) {
        onShowNotification('success', 'Horários atualizados com sucesso!');
        setIsEditing(false);
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Erro ao salvar horários');
      }
    } catch (error) {
      console.error('Erro ao salvar horários:', error);
      onShowNotification('error', `Erro ao salvar horários: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = async () => {
    if (!barbeariaId) return;
    
    if (!window.confirm('Tem certeza que deseja resetar todos os horários?')) {
      return;
    }
    
    try {
      setLoading(true);
              const response = await fetch(`/api/configuracoes/horarios/${barbeariaId}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${CookieManager.getAdminToken()}`
          }
        });
      
      if (response.ok) {
        await carregarHorarios();
        onShowNotification('success', 'Horários resetados com sucesso!');
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Erro ao resetar horários');
      }
    } catch (error) {
      console.error('Erro ao resetar horários:', error);
      onShowNotification('error', `Erro ao resetar horários: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const updateHorario = (diaId, field, value) => {
    setHorarios(prev => ({
      ...prev,
      [diaId]: {
        ...prev[diaId],
        [field]: value
      }
    }));
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Horários de Funcionamento</h3>
        {!isEditing ? (
          <div className="flex gap-2">
            <Button onClick={() => setIsEditing(true)} className="flex items-center gap-2">
              <Edit className="h-4 w-4" />
              Editar Horários
            </Button>
            <Button 
              variant="outline" 
              onClick={handleReset}
              disabled={loading}
              className="flex items-center gap-2"
            >
              <Trash2 className="h-4 w-4" />
              Resetar
            </Button>
          </div>
        ) : (
          <div className="flex gap-2">
            <Button 
              onClick={handleSave} 
              disabled={loading}
              className="flex items-center gap-2"
            >
              <Save className="h-4 w-4" />
              {loading ? 'Salvando...' : 'Salvar'}
            </Button>
            <Button 
              variant="outline" 
              onClick={() => {
                carregarHorarios();
                setIsEditing(false);
              }}
              disabled={loading}
              className="flex items-center gap-2"
            >
              <X className="h-4 w-4" />
              Cancelar
            </Button>
          </div>
        )}
      </div>

      {loading && !isEditing && (
        <div className="flex justify-center items-center h-32">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      )}

      <div className="space-y-3">
        {diasSemana.map(dia => {
          const horario = horarios[dia.id];
          return (
            <Card key={dia.id}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={horario?.aberto || false}
                      onChange={(e) => updateHorario(dia.id, 'aberto', e.target.checked)}
                      disabled={!isEditing || loading}
                      className="h-4 w-4"
                    />
                    <span className="font-medium">{dia.nome}</span>
                  </div>
                  
                  {horario?.aberto && isEditing ? (
                    <div className="flex items-center gap-2">
                      <input
                        type="time"
                        value={horario.hora_inicio || '08:00'}
                        onChange={(e) => updateHorario(dia.id, 'hora_inicio', e.target.value)}
                        className="px-2 py-1 border border-gray-300 rounded"
                        disabled={loading}
                      />
                      <span>até</span>
                      <input
                        type="time"
                        value={horario.hora_fim || '18:00'}
                        onChange={(e) => updateHorario(dia.id, 'hora_fim', e.target.value)}
                        className="px-2 py-1 border border-gray-300 rounded"
                        disabled={loading}
                      />
                    </div>
                  ) : horario?.aberto ? (
                    <span className="text-gray-600">
                      {horario.hora_inicio} - {horario.hora_fim}
                    </span>
                  ) : (
                    <span className="text-gray-400">Fechado</span>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

// Componente para configurações gerais
const ConfiguracoesGerais = ({ barbeariaId, onShowNotification }) => {
  const [configs, setConfigs] = useState({
    tempo_medio_atendimento: { valor: 30 },
    max_clientes_fila: { valor: 20 },
    permitir_agendamento: { valor: true }
  });
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);

  // Carregar configurações do backend
  const carregarConfiguracoes = async () => {
    if (!barbeariaId) return;
    
    try {
      setLoading(true);
      const response = await fetch(`/api/configuracoes/gerais/${barbeariaId}`, {
        headers: {
          'Authorization': `Bearer ${CookieManager.getAdminToken()}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setConfigs(data.data || configs);
      } else {
        console.error('Erro ao carregar configurações:', response.status);
      }
    } catch (error) {
      console.error('Erro ao carregar configurações:', error);
    } finally {
      setLoading(false);
    }
  };

  // Carregar configurações quando barbearia mudar
  useEffect(() => {
    carregarConfiguracoes();
  }, [barbeariaId]);

  const handleSave = async () => {
    if (!barbeariaId) return;
    
    try {
      setLoading(true);
              const response = await fetch(`/api/configuracoes/gerais/${barbeariaId}`, {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${CookieManager.getAdminToken()}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(configs)
        });
      
      if (response.ok) {
        onShowNotification('success', 'Configurações atualizadas com sucesso!');
        setIsEditing(false);
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Erro ao salvar configurações');
      }
    } catch (error) {
      console.error('Erro ao salvar configurações:', error);
      onShowNotification('error', `Erro ao salvar configurações: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const updateConfig = (key, value) => {
    setConfigs(prev => ({
      ...prev,
      [key]: { ...prev[key], valor: value }
    }));
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Configurações Gerais</h3>
        {!isEditing ? (
          <Button onClick={() => setIsEditing(true)} className="flex items-center gap-2">
            <Edit className="h-4 w-4" />
            Editar Configurações
          </Button>
        ) : (
          <div className="flex gap-2">
            <Button 
              onClick={handleSave} 
              disabled={loading}
              className="flex items-center gap-2"
            >
              <Save className="h-4 w-4" />
              {loading ? 'Salvando...' : 'Salvar'}
            </Button>
            <Button 
              variant="outline" 
              onClick={() => {
                carregarConfiguracoes();
                setIsEditing(false);
              }}
              disabled={loading}
              className="flex items-center gap-2"
            >
              <X className="h-4 w-4" />
              Cancelar
            </Button>
          </div>
        )}
      </div>

      {loading && !isEditing && (
        <div className="flex justify-center items-center h-32">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Tempo Médio de Atendimento</CardTitle>
            <CardDescription>
              Tempo médio em minutos para cada atendimento
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isEditing ? (
              <input
                type="number"
                value={configs.tempo_medio_atendimento?.valor || 30}
                onChange={(e) => updateConfig('tempo_medio_atendimento', parseInt(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                min="1"
                disabled={loading}
              />
            ) : (
              <p className="text-2xl font-bold">{configs.tempo_medio_atendimento?.valor || 30} min</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Máximo de Clientes na Fila</CardTitle>
            <CardDescription>
              Número máximo de clientes permitidos na fila
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isEditing ? (
              <input
                type="number"
                value={configs.max_clientes_fila?.valor || 20}
                onChange={(e) => updateConfig('max_clientes_fila', parseInt(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                min="1"
                disabled={loading}
              />
            ) : (
              <p className="text-2xl font-bold">{configs.max_clientes_fila?.valor || 20}</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Permitir Agendamento</CardTitle>
            <CardDescription>
              Permitir que clientes façam agendamentos
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isEditing ? (
              <select
                value={configs.permitir_agendamento?.valor ? 'true' : 'false'}
                onChange={(e) => updateConfig('permitir_agendamento', e.target.value === 'true')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                disabled={loading}
              >
                <option value="true">Sim</option>
                <option value="false">Não</option>
              </select>
            ) : (
              <Badge variant={configs.permitir_agendamento?.valor ? "default" : "secondary"}>
                {configs.permitir_agendamento?.valor ? 'Permitido' : 'Não Permitido'}
              </Badge>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

const AdminConfiguracoes = () => {
  const [selectedBarbeariaId, setSelectedBarbeariaId] = useState(1); // Inicializar com barbearia 1
  const [barbeariaData, setBarbeariaData] = useState(null);
  const [notification, setNotification] = useState(null);
  const { 
    configuracoes, 
    loading, 
    error, 
    criarServico, 
    atualizarServico, 
    excluirServico
  } = useConfiguracoes(selectedBarbeariaId);

  // Carregar dados da barbearia
  useEffect(() => {
    const carregarBarbearia = async () => {
      if (!selectedBarbeariaId) return;
      
      try {
        const response = await barbeariasService.obterBarbearia(selectedBarbeariaId);
        const data = response.data || response;
        setBarbeariaData(data);
      } catch (error) {
        console.error('Erro ao carregar dados da barbearia:', error);
        setBarbeariaData(null);
      }
    };

    carregarBarbearia();
  }, [selectedBarbeariaId]);

  const showNotification = (type, message) => {
    setNotification({ type, message });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertDescription>
          Erro ao carregar configurações: {error}
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      {notification && (
        <Notification
          type={notification.type}
          message={notification.message}
          onClose={() => setNotification(null)}
        />
      )}
      
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Configurações do Sistema
        </h1>
        <p className="text-gray-600">
          Gerencie serviços, horários e configurações gerais da barbearia.
        </p>
      </div>

      {!selectedBarbeariaId ? (
        <BarbeariaSelector 
          onBarbeariaSelect={setSelectedBarbeariaId}
          selectedBarbeariaId={selectedBarbeariaId}
        />
      ) : (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <Building2 className="h-6 w-6 text-blue-600" />
              <div>
                <h2 className="text-xl font-semibold text-gray-900">
                  {barbeariaData ? `Configurando ${barbeariaData.nome}` : `Configurando Barbearia #${selectedBarbeariaId}`}
                </h2>
                {barbeariaData?.endereco && (
                  <p className="text-sm text-gray-600 mt-1">
                    {barbeariaData.endereco}
                  </p>
                )}
              </div>
            </div>
            <Button 
              variant="outline" 
              onClick={() => setSelectedBarbeariaId(null)}
            >
              Trocar Barbearia
            </Button>
          </div>

          <Tabs defaultValue="servicos" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="servicos" className="flex items-center gap-2">
            <Scissors className="h-4 w-4" />
            Serviços
          </TabsTrigger>
          <TabsTrigger value="horarios" className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            Horários
          </TabsTrigger>
          <TabsTrigger value="comissoes" className="flex items-center gap-2">
            <DollarSign className="h-4 w-4" />
            Comissões
          </TabsTrigger>
          <TabsTrigger value="gerais" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Gerais
          </TabsTrigger>
        </TabsList>

                  <TabsContent value="servicos">
            <GerenciarServicos
              configuracoes={configuracoes}
              onCriarServico={criarServico}
              onAtualizarServico={atualizarServico}
              onExcluirServico={excluirServico}
              onShowNotification={showNotification}
            />
          </TabsContent>

          <TabsContent value="horarios">
            <GerenciarHorarios
              barbeariaId={selectedBarbeariaId}
              onShowNotification={showNotification}
            />
          </TabsContent>

          <TabsContent value="comissoes">
            <AdminComissoes />
          </TabsContent>

          <TabsContent value="gerais">
            <ConfiguracoesGerais
              barbeariaId={selectedBarbeariaId}
              onShowNotification={showNotification}
            />
          </TabsContent>
          </Tabs>
        </div>
      )}
    </div>
  );
};

export default AdminConfiguracoes; 