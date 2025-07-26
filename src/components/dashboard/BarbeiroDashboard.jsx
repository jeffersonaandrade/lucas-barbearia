import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDashboard } from '@/contexts/DashboardContext.jsx';
import { useBarbeiroFila } from '@/hooks/useBarbeiroFila.js';
import { useDashboardStats } from '@/hooks/useDashboardStats.js';
import DashboardHeader from './DashboardHeader.jsx';
import BarbeariaSelector from './BarbeariaSelector.jsx';
import ActionButtons from './ActionButtons.jsx';
import ClienteAtual from './ClienteAtual.jsx';
import FilaManager from '@/components/ui/fila-manager.jsx';
import StatsManager from '@/components/ui/stats-manager.jsx';

const BarbeiroDashboard = ({ onLogout }) => {
  const navigate = useNavigate();
  const { 
    barbearias, 
    barbeariaAtual, 
    setBarbeariaAtual, 
    barbeiroAtual, 
    atendendoAtual, 
    setAtendendoAtual 
  } = useDashboard();

  // Hook especializado para barbeiros
  const {
    fila,
    loading: filaLoading,
    error: filaError,
    estatisticas,
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

  // Hook para estatísticas
  const { stats, loading: statsLoading } = useDashboardStats('barbeiro', barbeariaAtual);

  const [historicoAtualizado, setHistoricoAtualizado] = useState(false);

  // Carregar barbearia inicial apenas uma vez
  useEffect(() => {
    if (barbearias.length > 0 && barbeariaAtual === null) {
      const barbeariaSalva = localStorage.getItem('barbeariaSelecionada');
      if (barbeariaSalva) {
        const barbearia = barbearias.find(b => b.id === parseInt(barbeariaSalva));
        if (barbearia) {
          setBarbeariaAtual(barbearia);
        } else {
          setBarbeariaAtual(barbearias[0]);
        }
      } else {
        setBarbeariaAtual(barbearias[0]);
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
    setBarbeariaAtual(barbearia);
  };

  const handleToggleAtivo = async (barbeariaId) => {
    console.log('🔄 handleToggleAtivo chamado:', {
      barbeariaId,
      barbeariaAtual,
      barbeiroAtual,
      statusBarbeiro: statusBarbeiro // Log completo do statusBarbeiro
    });
    
    try {
      const isAtivo = isBarbeiroAtivo(barbeariaId);
      const acao = isAtivo ? 'desativar' : 'ativar';
      
      console.log('🔄 Status atual:', {
        isAtivo,
        acao,
        barbeariaId
      });
      
      // Feedback visual imediato
      let mensagem = '';
      if (acao === 'ativar') {
        mensagem = '🔄 Ativando status...';
      } else {
        mensagem = '🔄 Desativando status...';
      }
      console.log(mensagem);
      
      await toggleStatusBarbeiro(acao);
      
      // Feedback de sucesso
      let sucessoMsg = '';
      if (acao === 'ativar') {
        sucessoMsg = '✅ Status ativado com sucesso! Você está disponível para atendimentos nesta barbearia.';
      } else {
        sucessoMsg = 'Status desativado com sucesso! Você está indisponível.';
      }
      console.log(sucessoMsg);
      
      // Mostrar alerta de sucesso
      alert(sucessoMsg);
      
    } catch (error) {
      console.error('❌ Erro ao alterar status:', error);
      
      // Determinar a ação para a mensagem de erro
      const isAtivo = isBarbeiroAtivo(barbeariaId);
      const acao = isAtivo ? 'desativar' : 'ativar';
      
      // Adicionar feedback visual para o usuário
      alert(`❌ Erro ao ${acao} status: ${error.message}`);
    }
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
    if (!atendendoAtual) return;

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

  const handleRemoverClienteNaoApareceu = async () => {
    if (!atendendoAtual) return;

    try {
      await removerCliente(atendendoAtual.id);
      setAtendendoAtual(null);
    } catch (error) {
      console.error('Erro ao remover cliente:', error);
    }
  };

  const handleRemoverCliente = async (clienteId) => {
    try {
      await removerCliente(clienteId);
    } catch (error) {
      console.error('Erro ao remover cliente:', error);
    }
  };

  const handleIniciarAtendimento = async (clienteId = null) => {
    try {
      await iniciarAtendimento(clienteId);
    } catch (error) {
      console.error('Erro ao iniciar atendimento:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <DashboardHeader
          title="Dashboard do Barbeiro"
          subtitle={`Bem-vindo, ${barbeiroAtual?.nome || 'Barbeiro'}`}
          onLogout={onLogout}
          apiStatus={apiStatus}
        />

        {/* Seleção de Barbearia */}
        <BarbeariaSelector
          barbearias={barbearias}
          barbeariaAtual={barbeariaAtual}
          onBarbeariaChange={handleBarbeariaChange}
          onToggleAtivo={handleToggleAtivo}
          isBarbeiroAtivo={isBarbeiroAtivo}
          loading={filaLoading}
        />

        {/* Cliente Atual */}
        <ClienteAtual
          atendendoAtual={atendendoAtual}
          onFinalizarAtendimento={handleFinalizarAtendimento}
        />

        {/* Gerenciador de Estatísticas */}
        <div className="mb-6">
          <StatsManager
            barbeariaAtual={barbeariaAtual}
            barbeiroAtual={barbeiroAtual}
            userRole="barbeiro"
            estatisticas={estatisticas}
            historicoAtualizado={historicoAtualizado}
          />
        </div>

        {/* Ações Rápidas */}
        <div className="mb-8">
          <ActionButtons
            onChamarProximo={handleChamarProximo}
            onFinalizarAtendimento={handleFinalizarAtendimento}
            onAdicionarCliente={handleAdicionarCliente}
            onRemoverClienteNaoApareceu={handleRemoverClienteNaoApareceu}
            atendendoAtual={atendendoAtual}
            loading={filaLoading}
            disabled={!barbeariaAtual || !isBarbeiroAtivo(barbeariaAtual?.id)}
          />
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
      </div>
    </div>
  );
};

export default BarbeiroDashboard; 