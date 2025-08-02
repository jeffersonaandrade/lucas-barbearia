import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import LoadingSpinner from '@/components/ui/loading-spinner';
import Notification from '@/components/ui/notification';
import { configuracoesService, barbeariasService } from '@/services/api.js';
import { 
  Plus, 
  Edit, 
  Trash2,
  Save,
  X,
  DollarSign,
  Percent,
  Users,
  Scissors
} from 'lucide-react';

const AdminComissoes = () => {
  const [loading, setLoading] = useState(false);
  const [comissoes, setComissoes] = useState([]);
  const [servicos, setServicos] = useState([]);
  const [barbeiros, setBarbeiros] = useState([]);
  const [barbearias, setBarbearias] = useState([]);
  const [selectedBarbearia, setSelectedBarbearia] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [notification, setNotification] = useState(null);
  const [error, setError] = useState(null);

  const [formData, setFormData] = useState({
    barbearia_id: '',
    barbeiro_id: '',
    servico_id: '',
    tipo: 'percentual',
    percentual: '',
    valor_fixo: ''
  });

  // Carregar dados iniciais
  useEffect(() => {
    carregarDados();
  }, []);

  const carregarDados = async () => {
    setLoading(true);
    setError(null);

    try {
      // Carregar barbearias
      const barbeariasResponse = await barbeariasService.listarBarbearias();
      setBarbearias(barbeariasResponse.data || []);

      if (barbeariasResponse.data?.length > 0) {
        setSelectedBarbearia(barbeariasResponse.data[0].id);
        setFormData(prev => ({ ...prev, barbearia_id: barbeariasResponse.data[0].id }));
      }
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
      setError('Erro ao carregar dados. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  // Carregar dados quando mudar barbearia
  useEffect(() => {
    if (selectedBarbearia) {
      carregarDadosBarbearia();
    }
  }, [selectedBarbearia]);

  const carregarDadosBarbearia = async () => {
    if (!selectedBarbearia) return;

    setLoading(true);
    setError(null);

    try {
      // Carregar comissões da barbearia
      const comissoesResponse = await configuracoesService.listarComissoes(selectedBarbearia);
      setComissoes(comissoesResponse.data || []);

      // Carregar serviços da barbearia
      const servicosResponse = await configuracoesService.listarServicos();
      setServicos(servicosResponse.data || []);

      // Carregar barbeiros da barbearia
      const barbeirosResponse = await barbeariasService.listarBarbeirosAtivos(selectedBarbearia);
      setBarbeiros(barbeirosResponse.data?.barbeiros || barbeirosResponse.data || []);

    } catch (error) {
      console.error('Erro ao carregar dados da barbearia:', error);
      setError('Erro ao carregar dados da barbearia. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.barbeiro_id || !formData.servico_id || 
        (formData.tipo === 'percentual' && !formData.percentual) ||
        (formData.tipo === 'fixo' && !formData.valor_fixo)) {
      setError('Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const dados = {
        barbearia_id: parseInt(formData.barbearia_id),
        barbeiro_id: formData.barbeiro_id,
        servico_id: parseInt(formData.servico_id),
        tipo: formData.tipo,
        ...(formData.tipo === 'percentual' && { percentual: parseFloat(formData.percentual) }),
        ...(formData.tipo === 'fixo' && { valor_fixo: parseFloat(formData.valor_fixo) })
      };

      if (editingId) {
        await configuracoesService.atualizarComissao(editingId, dados);
        showNotification('success', 'Comissão atualizada com sucesso!');
      } else {
        await configuracoesService.criarComissao(dados);
        showNotification('success', 'Comissão criada com sucesso!');
      }

      // Recarregar dados
      await carregarDadosBarbearia();
      
      // Limpar formulário
      resetForm();
      setShowForm(false);
    } catch (error) {
      console.error('Erro ao salvar comissão:', error);
      setError('Erro ao salvar comissão. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (comissao) => {
    setEditingId(comissao.id);
    setFormData({
      barbearia_id: comissao.barbearia_id.toString(),
      barbeiro_id: comissao.barbeiro_id,
      servico_id: comissao.servico_id.toString(),
      tipo: comissao.tipo,
      percentual: comissao.percentual?.toString() || '',
      valor_fixo: comissao.valor_fixo?.toString() || ''
    });
    setShowForm(true);
  };

  const handleDelete = async (comissaoId) => {
    if (!window.confirm('Tem certeza que deseja excluir esta configuração de comissão?')) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await configuracoesService.excluirComissao(comissaoId);
      showNotification('success', 'Comissão excluída com sucesso!');
      await carregarDadosBarbearia();
    } catch (error) {
      console.error('Erro ao excluir comissão:', error);
      setError('Erro ao excluir comissão. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      barbearia_id: selectedBarbearia?.toString() || '',
      barbeiro_id: '',
      servico_id: '',
      tipo: 'percentual',
      percentual: '',
      valor_fixo: ''
    });
    setEditingId(null);
  };

  const showNotification = (type, message) => {
    setNotification({ type, message });
  };

  const getBarbeiroNome = (barbeiroId) => {
    const barbeiro = barbeiros.find(b => b.id === barbeiroId);
    return barbeiro?.nome || 'Barbeiro não encontrado';
  };

  const getServicoNome = (servicoId) => {
    const servico = servicos.find(s => s.id === servicoId);
    return servico?.nome || 'Serviço não encontrado';
  };

  if (loading && !comissoes.length) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner />
      </div>
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

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Configurações de Comissões</h2>
          <p className="text-gray-600">Gerencie as comissões dos barbeiros por serviço</p>
        </div>
        <Button 
          onClick={() => {
            setShowForm(true);
            resetForm();
          }}
          className="flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Nova Comissão
        </Button>
      </div>

      {/* Seletor de Barbearia */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Selecionar Barbearia</CardTitle>
        </CardHeader>
        <CardContent>
          <Select value={selectedBarbearia?.toString()} onValueChange={(value) => setSelectedBarbearia(parseInt(value))}>
            <SelectTrigger className="w-full max-w-xs">
              <SelectValue placeholder="Selecione uma barbearia" />
            </SelectTrigger>
            <SelectContent>
              {barbearias.map((barbearia) => (
                <SelectItem key={barbearia.id} value={barbearia.id.toString()}>
                  {barbearia.nome}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {/* Formulário */}
      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>{editingId ? 'Editar Comissão' : 'Nova Comissão'}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="barbeiro">Barbeiro</Label>
                  <Select 
                    value={formData.barbeiro_id} 
                    onValueChange={(value) => setFormData({...formData, barbeiro_id: value})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o barbeiro" />
                    </SelectTrigger>
                    <SelectContent>
                      {barbeiros.map((barbeiro) => (
                        <SelectItem key={barbeiro.id} value={barbeiro.id}>
                          {barbeiro.nome}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="servico">Serviço</Label>
                  <Select 
                    value={formData.servico_id} 
                    onValueChange={(value) => setFormData({...formData, servico_id: value})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o serviço" />
                    </SelectTrigger>
                    <SelectContent>
                      {servicos.map((servico) => (
                        <SelectItem key={servico.id} value={servico.id.toString()}>
                          {servico.nome} - R$ {servico.preco}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="tipo">Tipo de Comissão</Label>
                  <Select 
                    value={formData.tipo} 
                    onValueChange={(value) => setFormData({...formData, tipo: value})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="percentual">Percentual (%)</SelectItem>
                      <SelectItem value="fixo">Valor Fixo (R$)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="valor">
                    {formData.tipo === 'percentual' ? 'Percentual (%)' : 'Valor Fixo (R$)'}
                  </Label>
                  <Input
                    type="number"
                    step={formData.tipo === 'percentual' ? '0.1' : '0.01'}
                    value={formData.tipo === 'percentual' ? formData.percentual : formData.valor_fixo}
                    onChange={(e) => setFormData({
                      ...formData, 
                      [formData.tipo === 'percentual' ? 'percentual' : 'valor_fixo']: e.target.value
                    })}
                    placeholder={formData.tipo === 'percentual' ? 'Ex: 30' : 'Ex: 15.00'}
                  />
                </div>
              </div>

              <div className="flex gap-2">
                <Button type="submit" disabled={loading} className="flex items-center gap-2">
                  <Save className="h-4 w-4" />
                  {editingId ? 'Atualizar' : 'Criar'}
                </Button>
                <Button 
                  type="button" 
                  variant="outline"
                  onClick={() => {
                    setShowForm(false);
                    resetForm();
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

      {/* Lista de Comissões */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Comissões Configuradas</h3>
        
        {comissoes.length === 0 ? (
          <Card>
            <CardContent className="p-6 text-center">
              <p className="text-gray-500">Nenhuma comissão configurada para esta barbearia.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {comissoes.map((comissao) => (
              <Card key={comissao.id}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-base">{getBarbeiroNome(comissao.barbeiro_id)}</CardTitle>
                      <CardDescription>{getServicoNome(comissao.servico_id)}</CardDescription>
                    </div>
                    <div className="flex gap-1">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEdit(comissao)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDelete(comissao.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      {comissao.tipo === 'percentual' ? (
                        <Percent className="h-4 w-4 text-blue-500" />
                      ) : (
                        <DollarSign className="h-4 w-4 text-green-500" />
                      )}
                      <Badge variant="secondary">
                        {comissao.tipo === 'percentual' 
                          ? `${comissao.percentual}%` 
                          : `R$ ${comissao.valor_fixo}`
                        }
                      </Badge>
                    </div>
                    <div className="text-sm text-gray-500">
                      {comissao.ativo ? 'Ativo' : 'Inativo'}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminComissoes; 