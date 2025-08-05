import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDashboard } from '@/contexts/DashboardContext.jsx';
import DashboardHeader from './DashboardHeader.jsx';
import BarbeariaSelector from './BarbeariaSelector.jsx';
import BarbeiroStatusCard from './BarbeiroStatusCard.jsx';
import NotificationSystem from './NotificationSystem.jsx';
import TabNavigation from './TabNavigation.jsx';
import FilaTabContent from './FilaTabContent.jsx';
import StatsManager from '@/components/ui/stats-manager.jsx';
import AvaliacoesManager from '@/components/ui/avaliacoes-manager.jsx';
import FinalizarAtendimentoModal from '@/components/ui/finalizar-atendimento-modal.jsx';
import IniciarAtendimentoModal from '@/components/ui/iniciar-atendimento-modal.jsx';
import { useNotification, useBarbeiroHandlers } from './BarbeiroDashboardHandlers.js';
import { useBarbeiroEffects } from './useBarbeiroEffects.js';
import { useBarbeiroFila } from '@/hooks/useBarbeiroFila.js';

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
    statusBarbeiro, 
    isBarbeiroAtivo,
    toggleStatusBarbeiro,
    loading: barbeiroLoading,
    estatisticas,
    barbeariaInfo,
    apiStatus,
    chamarProximo,
    finalizarAtendimento,
    removerCliente,
    iniciarAtendimento,
    getFilaBarbeiro
  } = useBarbeiroFila(barbeariaAtual?.id);

  // Debug: Log dos dados recebidos
  useEffect(() => {
    console.log('📊 BarbeiroDashboard - StatusBarbeiro:', statusBarbeiro);
    console.log('📊 BarbeiroDashboard - Loading:', barbeiroLoading);
  }, [statusBarbeiro, barbeiroLoading]);

  // Hook para notificações
  const { notificacao, mostrarNotificacao, limparNotificacao } = useNotification();

  // Estados locais
  const [historicoAtualizado, setHistoricoAtualizado] = useState(false);
  const [showFinalizarModal, setShowFinalizarModal] = useState(false);
  const [showIniciarModal, setShowIniciarModal] = useState(false);
  const [activeTab, setActiveTab] = useState('fila'); // 'fila' ou 'avaliacoes'

  // Hook para gerenciar useEffects
  useBarbeiroEffects({
    barbearias,
    barbeariaAtual,
    setBarbeariaAtual,
    atendendoAtual,
    setAtendendoAtual
  });

  // Hook para handlers
  const handlers = useBarbeiroHandlers({
    barbearias,
    barbeariaAtual,
    setBarbeariaAtual,
    atendendoAtual,
    setAtendendoAtual,
    isBarbeiroAtivo,
    toggleStatusBarbeiro,
    chamarProximo,
    finalizarAtendimento,
    removerCliente,
    iniciarAtendimento,
    getFilaBarbeiro,
    mostrarNotificacao,
    navigate
  });

  // Handlers modificados para incluir lógica de modais
  const handleChamarProximo = async () => {
    const success = await handlers.handleChamarProximo();
    if (success) {
      setHistoricoAtualizado(true);
      setTimeout(() => setHistoricoAtualizado(false), 3000);
    }
  };

  const handleFinalizarAtendimento = () => {
    if (handlers.handleFinalizarAtendimento()) {
      setShowFinalizarModal(true);
    }
  };

  const handleConfirmarFinalizacao = async (dados) => {
    const success = await handlers.handleConfirmarFinalizacao(dados);
    if (success) {
      setShowFinalizarModal(false);
      setHistoricoAtualizado(true);
      setTimeout(() => setHistoricoAtualizado(false), 3000);
    }
  };

  const handleIniciarAtendimento = () => {
    if (handlers.handleIniciarAtendimento()) {
      setShowIniciarModal(true);
    }
  };

  const handleConfirmarInicio = async (dados) => {
    const success = await handlers.handleConfirmarInicio(dados);
    if (success) {
      setShowIniciarModal(false);
      setHistoricoAtualizado(true);
      setTimeout(() => setHistoricoAtualizado(false), 3000);
    }
  };

  const handleAtualizarFilaManual = async () => {
    await handlers.handleAtualizarFilaManual();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-4 sm:py-8">
        {/* Sistema de Notificações */}
        <NotificationSystem 
          notificacao={notificacao} 
          onClose={limparNotificacao} 
        />

        {/* Header */}
        <DashboardHeader
          title="Dashboard do Barbeiro"
          subtitle="Gerencie sua fila e atendimentos em tempo real"
          onLogout={onLogout}
        />

        {/* Seletor de Barbearia */}
        <BarbeariaSelector
          barbearias={barbearias}
          barbeariaAtual={barbeariaAtual}
          onBarbeariaChange={handlers.handleBarbeariaChange}
          onToggleAtivo={handlers.handleToggleAtivo}
          isBarbeiroAtivo={isBarbeiroAtivo}
          loading={barbeiroLoading}
        />

        {/* Status Card */}
        <BarbeiroStatusCard
          barbearias={barbearias}
          barbeariaAtual={barbeariaAtual}
          isBarbeiroAtivo={isBarbeiroAtivo}
          onToggleAtivo={handlers.handleToggleAtivo}
          loading={barbeiroLoading}
        />

        {/* Stats Manager */}
        <StatsManager
          barbeariaAtual={barbeariaAtual}
          barbeiroAtual={barbeiroAtual}
          userRole="barbeiro"
          stats={estatisticas}
          estatisticas={estatisticas}
          historicoAtualizado={historicoAtualizado}
          loading={barbeiroLoading}
        />

        {/* Navegação por Abas */}
        <TabNavigation
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />

        {/* Conteúdo das Abas */}
        {activeTab === 'fila' ? (
          <FilaTabContent
            barbeariaAtual={barbeariaAtual}
            barbeiroAtual={barbeiroAtual}
            fila={fila}
            filaLoading={barbeiroLoading}
            atendendoAtual={atendendoAtual}
            setAtendendoAtual={setAtendendoAtual}
            isBarbeiroAtivo={isBarbeiroAtivo}
            onChamarProximo={handleChamarProximo}
            onFinalizarAtendimento={handleFinalizarAtendimento}
            onAdicionarCliente={handlers.handleAdicionarCliente}
            onRemoverClienteNaoApareceu={handlers.handleRemoverClienteNaoApareceu}
            onRemoverCliente={handlers.handleRemoverCliente}
            onIniciarAtendimento={handleIniciarAtendimento}
            onAtualizarFilaManual={handleAtualizarFilaManual}
            onHistoricoAtualizado={() => setHistoricoAtualizado(true)}
          />
        ) : (
          <AvaliacoesManager
            barbeariaAtual={barbeariaAtual}
            barbeiroAtual={barbeiroAtual}
            userRole="barbeiro"
          />
        )}

        {/* Modais */}
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

export default BarbeiroDashboard; 