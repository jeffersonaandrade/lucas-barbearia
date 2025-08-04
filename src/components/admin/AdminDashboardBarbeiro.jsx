import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card.jsx';
import { Button } from '@/components/ui/button.jsx';
import { Badge } from '@/components/ui/badge.jsx';
import { 
  Building2, 
  CheckCircle, 
  XCircle, 
  RefreshCw, 
  BarChart3, 
  Users,
  Plus,
  Play,
  Square,
  Trash2
} from 'lucide-react';
import FilaManager from '@/components/ui/fila-manager.jsx';
import StatsManager from '@/components/ui/stats-manager.jsx';
import DashboardCard from '@/components/ui/dashboard-card.jsx';
import { useSharedData } from '@/hooks/useSharedData.js';
import FinalizarAtendimentoModal from '@/components/ui/finalizar-atendimento-modal.jsx';
import IniciarAtendimentoModal from '@/components/ui/iniciar-atendimento-modal.jsx';

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
  const [showFinalizarModal, setShowFinalizarModal] = useState(false);
  const [showIniciarModal, setShowIniciarModal] = useState(false);

  // Sistema de dados compartilhados
  const { useSharedDashboardStats, useSharedFilaData } = useSharedData();
  const { stats, loading: statsLoading } = useSharedDashboardStats('barbeiro', barbeariaAtual?.id);
  const { filaData, loading: filaLoading, error: filaError } = useSharedFilaData(barbeariaAtual?.id);

  // Extrair dados da fila
  const fila = filaData?.fila || [];
  const estatisticas = filaData?.estatisticas || {};
  const barbeariaInfo = filaData?.barbeariaInfo || {};
  const apiStatus = filaData?.apiStatus || 'offline';
  const statusBarbeiro = filaData?.statusBarbeiro || {};
  const atendendoHook = filaData?.atendendoAtual || null;

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
      const isAtivo = statusBarbeiro[barbeariaId]?.ativo || false;
      const acao = isAtivo ? 'desativar' : 'ativar';
      
      // Aqui você implementaria a chamada para a API
      console.log(`Tentando ${acao} barbeiro na barbearia ${barbeariaId}`);
      
      console.log(`✅ Status ${acao === 'ativar' ? 'ativado' : 'desativado'} com sucesso`);
    } catch (error) {
      console.error('❌ Erro ao alterar status:', error);
    }
  };

  const isBarbeiroAtivoNaBarbearia = (barbeariaId) => {
    return statusBarbeiro[barbeariaId]?.ativo || false;
  };

  const getBarbeariasAtivas = () => {
    return barbearias.filter(barbearia => isBarbeiroAtivoNaBarbearia(barbearia.id));
  };

  const handleChamarProximo = async () => {
    try {
      // Aqui você implementaria a chamada para a API
      console.log('Chamando próximo cliente...');
      setHistoricoAtualizado(true);
      setTimeout(() => setHistoricoAtualizado(false), 3000);
    } catch (error) {
      console.error('Erro ao chamar próximo:', error);
    }
  };

  const handleFinalizarAtendimento = () => {
    if (atendendoAtual) {
      setShowFinalizarModal(true);
    }
  };

  const handleConfirmarFinalizacao = async (dados) => {
    try {
      // Aqui você implementaria a chamada para a API
      console.log('Finalizando atendimento com dados:', dados);
      setShowFinalizarModal(false);
      setHistoricoAtualizado(true);
      setTimeout(() => setHistoricoAtualizado(false), 3000);
    } catch (error) {
      console.error('Erro ao finalizar atendimento:', error);
    }
  };

  const handleAdicionarCliente = () => {
    navigate('/admin/adicionar-fila');
  };

  const handleIniciarAtendimento = () => {
    if (atendendoAtual) {
      setShowIniciarModal(true);
    }
  };

  const handleConfirmarInicio = async (dados) => {
    try {
      // Aqui você implementaria a chamada para a API
      console.log('Iniciando atendimento com dados:', dados);
      setShowIniciarModal(false);
      setHistoricoAtualizado(true);
      setTimeout(() => setHistoricoAtualizado(false), 3000);
    } catch (error) {
      console.error('Erro ao iniciar atendimento:', error);
    }
  };

  const handleRemoverClienteNaoApareceu = async () => {
    try {
      if (atendendoAtual) {
        // Aqui você implementaria a chamada para a API
        console.log('Removendo cliente que não apareceu:', atendendoAtual.id);
        setHistoricoAtualizado(true);
        setTimeout(() => setHistoricoAtualizado(false), 3000);
      }
    } catch (error) {
      console.error('Erro ao remover cliente:', error);
    }
  };

  const handleRemoverCliente = async (clienteId) => {
    try {
      // Aqui você implementaria a chamada para a API
      console.log('Removendo cliente:', clienteId);
      setHistoricoAtualizado(true);
      setTimeout(() => setHistoricoAtualizado(false), 3000);
    } catch (error) {
      console.error('Erro ao remover cliente:', error);
    }
  };

  const handleAtualizarFilaManual = async () => {
    try {
      // Aqui você implementaria a chamada para a API
      console.log('Atualizando fila manualmente...');
      setHistoricoAtualizado(true);
      setTimeout(() => setHistoricoAtualizado(false), 3000);
    } catch (error) {
      console.error('Erro ao atualizar fila:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-4 sm:py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Dashboard do Barbeiro
          </h1>
          <p className="text-gray-600">
            Gerencie sua fila e atendimentos em tempo real
          </p>
        </div>

        {/* Status em Todas as Barbearias */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5" />
              Status em Todas as Barbearias
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {barbearias.map((barbearia) => (
                <div
                  key={barbearia.id}
                  className={`p-4 rounded-lg border-2 transition-colors ${
                    isBarbeiroAtivoNaBarbearia(barbearia.id)
                      ? 'border-green-200 bg-green-50'
                      : 'border-gray-200 bg-gray-50'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-gray-900">
                      {barbearia.nome}
                    </h3>
                    <Badge
                      variant={isBarbeiroAtivoNaBarbearia(barbearia.id) ? 'default' : 'secondary'}
                      className={`${
                        isBarbeiroAtivoNaBarbearia(barbearia.id)
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-600'
                      }`}
                    >
                      {isBarbeiroAtivoNaBarbearia(barbearia.id) ? (
                        <>
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Ativo
                        </>
                      ) : (
                        <>
                          <XCircle className="h-3 w-3 mr-1" />
                          Inativo
                        </>
                      )}
                    </Badge>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => toggleAtivo(barbearia.id)}
                    className="w-full"
                  >
                    {isBarbeiroAtivoNaBarbearia(barbearia.id) ? 'Desativar' : 'Ativar'}
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Stats Cards */}
        <StatsManager
          barbeariaAtual={barbeariaAtual}
          barbeiroAtual={barbeiroAtual}
          userRole="barbeiro"
          stats={stats}
          estatisticas={estatisticas}
          historicoAtualizado={historicoAtualizado}
          loading={statsLoading}
        />

        {/* Action Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <DashboardCard
            title="Chamar Próximo"
            description="Chamar o próximo cliente da fila"
            icon={Users}
            buttonText="Chamar"
            onButtonClick={handleChamarProximo}
            disabled={!atendendoAtual || filaLoading}
          />

          <DashboardCard
            title="Iniciar Atendimento"
            description="Iniciar atendimento do cliente atual"
            icon={Play}
            buttonText="Iniciar"
            onButtonClick={handleIniciarAtendimento}
            disabled={!atendendoAtual}
          />

          <DashboardCard
            title="Finalizar Atendimento"
            description="Finalizar atendimento atual"
            icon={Square}
            buttonText="Finalizar"
            onButtonClick={handleFinalizarAtendimento}
            disabled={!atendendoAtual}
          />

          <DashboardCard
            title="Adicionar Cliente"
            description="Adicionar cliente manualmente à fila"
            icon={Plus}
            buttonText="Adicionar"
            onButtonClick={handleAdicionarCliente}
          />

          <DashboardCard
            title="Remover Cliente"
            description="Remover cliente que não apareceu"
            icon={Trash2}
            buttonText="Remover"
            onButtonClick={handleRemoverClienteNaoApareceu}
            disabled={!atendendoAtual}
          />

          <DashboardCard
            title="Atualizar Fila"
            description="Atualizar fila manualmente"
            icon={RefreshCw}
            buttonText="Atualizar"
            onButtonClick={handleAtualizarFilaManual}
            disabled={filaLoading}
          />
        </div>

        {/* Fila Manager */}
        <FilaManager
          barbeariaAtual={barbeariaAtual}
          barbeiroAtual={barbeiroAtual}
          fila={fila}
          filaLoading={filaLoading}
          atendendoAtual={atendendoAtual}
          setAtendendoAtual={setAtendendoAtual}
          isBarbeiroAtivo={isBarbeiroAtivoNaBarbearia}
          onChamarProximo={handleChamarProximo}
          onFinalizarAtendimento={handleFinalizarAtendimento}
          onAdicionarCliente={handleAdicionarCliente}
          onRemoverClienteNaoApareceu={handleRemoverClienteNaoApareceu}
          onRemoverCliente={handleRemoverCliente}
          onIniciarAtendimento={handleIniciarAtendimento}
          onAtualizarFilaManual={handleAtualizarFilaManual}
          onHistoricoAtualizado={() => setHistoricoAtualizado(true)}
        />

        {/* Modals */}
        <FinalizarAtendimentoModal
          isOpen={showFinalizarModal}
          onClose={() => setShowFinalizarModal(false)}
          onConfirm={handleConfirmarFinalizacao}
          atendendoAtual={atendendoAtual}
        />

        <IniciarAtendimentoModal
          isOpen={showIniciarModal}
          onClose={() => setShowIniciarModal(false)}
          onConfirm={handleConfirmarInicio}
          atendendoAtual={atendendoAtual}
          barbeariaAtual={barbeariaAtual}
        />
      </div>
    </div>
  );
};

export default AdminDashboardBarbeiro; 