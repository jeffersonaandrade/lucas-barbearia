import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.jsx';
import { Button } from '@/components/ui/button.jsx';
import { Badge } from '@/components/ui/badge.jsx';
import { Alert, AlertDescription } from '@/components/ui/alert.jsx';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select.jsx';
import { Switch } from '@/components/ui/switch.jsx';
import { 
  Building2, 
  Power, 
  PowerOff, 
  MapPin, 
  UserCheck,
  CheckCircle,
  UserPlus,
  Trash2,
  Users,
  Phone,
  CheckSquare,
  Play,
  X,
  AlertCircle,
  Clock
} from 'lucide-react';
import FilaManager from '@/components/ui/fila-manager.jsx';
import StatsManager from '@/components/ui/stats-manager.jsx';
import DashboardCard from '@/components/ui/dashboard-card.jsx';
// Importar o hook especializado para barbeiros
import { useBarbeiroFila } from '@/hooks/useBarbeiroFila.js';

const AdminDashboardBarbeiro = ({ 
  barbearias, 
  barbeariaAtual, 
  setBarbeariaAtual, 
  barbeiroAtual, 
  atendendoAtual, 
  setAtendendoAtual,
  onLogout 
}) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [historicoAtualizado, setHistoricoAtualizado] = useState(false);

  // Usar o hook especializado para barbeiros
  const {
    fila,
    loading: filaLoading,
    error: filaError,
    barbeiros,
    estatisticas,
    barbeariaInfo,
    apiStatus,
    statusBarbeiro,
    atendendoAtual: atendendoHook,
    chamarProximo,
    finalizarAtendimento,
    adicionarClienteManual,
    removerCliente,
    toggleStatusBarbeiro,
    iniciarAtendimento,
    isBarbeiroAtivo,
    getFilaBarbeiro
  } = useBarbeiroFila(barbeariaAtual?.id);

  // Carregar barbearia inicial apenas uma vez
  useEffect(() => {
    if (barbearias.length > 0 && barbeariaAtual === null) {
      const barbeariaSalva = localStorage.getItem('barbeariaSelecionada');
      if (barbeariaSalva) {
        const barbearia = barbearias.find(b => b.id === parseInt(barbeariaSalva));
        if (barbearia) {
          setBarbeariaAtual(barbearia);
          console.log('Barbearia carregada do localStorage:', barbearia.nome);
        } else {
          setBarbeariaAtual(barbearias[0]);
          console.log('Barbearia padrão definida:', barbearias[0].nome);
        }
      } else {
        setBarbeariaAtual(barbearias[0]);
        console.log('Primeira barbearia definida como padrão:', barbearias[0].nome);
      }
    }
    setLoading(false);
  }, [barbearias, barbeariaAtual, setBarbeariaAtual]);

  // Atualizar barbearia atual quando os dados mudarem
  useEffect(() => {
    if (barbeariaAtual && barbearias.length > 0) {
      const barbeariaAtualizada = barbearias.find(b => b.id === barbeariaAtual.id);
      if (barbeariaAtualizada && JSON.stringify(barbeariaAtualizada) !== JSON.stringify(barbeariaAtual)) {
        setBarbeariaAtual(barbeariaAtualizada);
      }
    }
  }, [barbearias, barbeariaAtual, setBarbeariaAtual]);

  // Sincronizar atendendoAtual com o hook
  useEffect(() => {
    if (atendendoHook && atendendoHook !== atendendoAtual) {
      setAtendendoAtual(atendendoHook);
    }
  }, [atendendoHook, atendendoAtual, setAtendendoAtual]);

  const handleBarbeariaChange = (barbeariaId) => {
    const barbearia = barbearias.find(b => b.id === parseInt(barbeariaId));
    console.log('Barbearia selecionada:', barbearia?.nome, 'ID:', barbeariaId);
    setBarbeariaAtual(barbearia);
    
    // Salvar no localStorage
    localStorage.setItem('barbeariaSelecionada', barbeariaId);
  };

  const toggleAtivo = async (barbeariaId) => {
    try {
      const isAtivo = isBarbeiroAtivo(barbeariaId);
      const acao = isAtivo ? 'desativar' : 'ativar';
      
      await toggleStatusBarbeiro(acao);
      
      console.log(`✅ Status ${acao === 'ativar' ? 'ativado' : 'desativado'} com sucesso`);
    } catch (error) {
      console.error('❌ Erro ao alterar status:', error);
    }
  };

  const isBarbeiroAtivoNaBarbearia = (barbeariaId) => {
    return isBarbeiroAtivo(barbeariaId);
  };

  const getBarbeariasAtivas = () => {
    return barbearias.filter(barbearia => isBarbeiroAtivo(barbearia.id));
  };

  const handleChamarProximo = async () => {
    try {
      await chamarProximo();
      setHistoricoAtualizado(true);
      setTimeout(() => setHistoricoAtualizado(false), 3000);
    } catch (error) {
      console.error('Erro ao chamar próximo:', error);
    }
  };

  const handleFinalizarAtendimento = async () => {
    if (!atendendoAtual) {
      console.log('Nenhum cliente sendo atendido');
      return;
    }

    try {
      await finalizarAtendimento(atendendoAtual.id);
      setAtendendoAtual(null);
      setHistoricoAtualizado(true);
      setTimeout(() => setHistoricoAtualizado(false), 3000);
    } catch (error) {
      console.error('Erro ao finalizar atendimento:', error);
    }
  };

  const handleAdicionarCliente = () => {
    navigate('/admin/adicionar-fila');
  };

  const handleIniciarAtendimento = async (clienteId = null) => {
    try {
      await iniciarAtendimento(clienteId);
    } catch (error) {
      console.error('Erro ao iniciar atendimento:', error);
    }
  };

  const handleRemoverClienteNaoApareceu = async () => {
    if (!atendendoAtual) {
      console.log('Nenhum cliente sendo atendido');
      return;
    }

    try {
      await removerCliente(atendendoAtual.id);
      setAtendendoAtual(null);
      console.log('Cliente removido por não aparecer');
    } catch (error) {
      console.error('Erro ao remover cliente:', error);
    }
  };

  const handleRemoverCliente = async (clienteId) => {
    try {
      await removerCliente(clienteId);
      console.log('Cliente removido da fila');
    } catch (error) {
      console.error('Erro ao remover cliente:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Dashboard do Barbeiro
            </h1>
            <p className="text-gray-600">
              Bem-vindo, {barbeiroAtual?.nome || 'Barbeiro'}
            </p>
          </div>
          <Button onClick={onLogout} variant="outline">
            Sair
          </Button>
        </div>

        {/* Status da API */}
        {apiStatus === 'unavailable' && (
          <Alert className="mb-6 border-red-200 bg-red-50">
            <AlertCircle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-800">
              Erro de conexão com o servidor. Verifique sua internet.
            </AlertDescription>
          </Alert>
        )}

        {/* Seleção de Barbearia */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Building2 className="mr-2 h-5 w-5" />
              Barbearia Atual
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Select
              value={barbeariaAtual?.id?.toString() || ''}
              onValueChange={handleBarbeariaChange}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione uma barbearia" />
              </SelectTrigger>
              <SelectContent>
                {barbearias.map((barbearia) => (
                  <SelectItem key={barbearia.id} value={barbearia.id.toString()}>
                    <div className="flex items-center justify-between w-full">
                      <span>{barbearia.nome}</span>
                      <div className="flex items-center ml-2">
                        <Switch
                          checked={isBarbeiroAtivoNaBarbearia(barbearia.id)}
                          onCheckedChange={() => toggleAtivo(barbearia.id)}
                          className="ml-2"
                        />
                        <Badge 
                          variant={isBarbeiroAtivoNaBarbearia(barbearia.id) ? "default" : "secondary"}
                          className="ml-2"
                        >
                          {isBarbeiroAtivoNaBarbearia(barbearia.id) ? "Ativo" : "Inativo"}
                        </Badge>
                      </div>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CardContent>
        </Card>

        {/* Cards de Estatísticas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <DashboardCard
            title="Total na Fila"
            value={estatisticas.total || 0}
            icon={Users}
            color="blue"
          />
          <DashboardCard
            title="Aguardando"
            value={estatisticas.aguardando || 0}
            icon={Clock}
            color="yellow"
          />
          <DashboardCard
            title="Atendendo"
            value={estatisticas.atendendo || 0}
            icon={UserCheck}
            color="green"
          />
          <DashboardCard
            title="Tempo Médio"
            value={`${estatisticas.tempoMedio || 15} min`}
            icon={CheckSquare}
            color="purple"
          />
        </div>

        {/* Ações Rápidas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Button 
            onClick={handleChamarProximo}
            disabled={filaLoading || !barbeariaAtual}
            className="w-full"
          >
            <Play className="mr-2 h-4 w-4" />
            Chamar Próximo
          </Button>
          
          <Button 
            onClick={handleFinalizarAtendimento}
            disabled={!atendendoAtual || filaLoading}
            variant="outline"
            className="w-full"
          >
            <CheckCircle className="mr-2 h-4 w-4" />
            Finalizar Atendimento
          </Button>
          
          <Button 
            onClick={handleAdicionarCliente}
            variant="outline"
            className="w-full"
          >
            <UserPlus className="mr-2 h-4 w-4" />
            Adicionar Cliente
          </Button>
          
          <Button 
            onClick={handleRemoverClienteNaoApareceu}
            disabled={!atendendoAtual || filaLoading}
            variant="destructive"
            className="w-full"
          >
            <X className="mr-2 h-4 w-4" />
            Não Apareceu
          </Button>
        </div>

        {/* Gerenciador de Fila */}
        <FilaManager
          barbeariaAtual={barbeariaAtual}
          barbeiroAtual={barbeiroAtual}
          userRole="barbeiro"
          onChamarProximo={handleChamarProximo}
          onFinalizarAtendimento={handleFinalizarAtendimento}
          onAdicionarCliente={handleAdicionarCliente}
          onRemoverCliente={handleRemoverCliente}
          onIniciarAtendimento={handleIniciarAtendimento}
          atendendoAtual={atendendoAtual}
          setAtendendoAtual={setAtendendoAtual}
          onHistoricoAtualizado={() => setHistoricoAtualizado(true)}
        />

        {/* Gerenciador de Estatísticas */}
        <StatsManager
          barbeariaAtual={barbeariaAtual}
          estatisticas={estatisticas}
          historicoAtualizado={historicoAtualizado}
        />
      </div>
    </div>
  );
};

export default AdminDashboardBarbeiro; 