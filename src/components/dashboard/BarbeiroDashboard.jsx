import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDashboard } from '@/contexts/DashboardContext.jsx';
import { useSharedData } from '@/hooks/useSharedData.js';
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
    setAtendendoAtual,
    atendendoHook
  });

  // Hook para handlers
  const handlers = useBarbeiroHandlers({
    barbearias,
    barbeariaAtual,
    setBarbeariaAtual,
    atendendoAtual,
    setAtendendoAtual,
    isBarbeiroAtivo: (barbeariaId) => statusBarbeiro[barbeariaId]?.ativo || false,
    toggleStatusBarbeiro: async (acao) => {
      // Implementar chamada para API
      console.log(`Tentando ${acao} barbeiro`);
    },
    chamarProximo: async () => {
      // Implementar chamada para API
      console.log('Chamando próximo cliente...');
    },
    finalizarAtendimento: async (clienteId, dados) => {
      // Implementar chamada para API
      console.log('Finalizando atendimento:', clienteId, dados);
    },
    removerCliente: async (clienteId) => {
      // Implementar chamada para API
      console.log('Removendo cliente:', clienteId);
    },
    iniciarAtendimento: async (clienteId, dados) => {
      // Implementar chamada para API
      console.log('Iniciando atendimento:', clienteId, dados);
    },
    getFilaBarbeiro: async () => {
      // Implementar chamada para API
      console.log('Obtendo fila do barbeiro...');
    },
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
          isBarbeiroAtivo={(barbeariaId) => statusBarbeiro[barbeariaId]?.ativo || false}
          loading={filaLoading}
        />

        {/* Status Card */}
        <BarbeiroStatusCard
          barbearias={barbearias}
          barbeariaAtual={barbeariaAtual}
          isBarbeiroAtivo={(barbeariaId) => statusBarbeiro[barbeariaId]?.ativo || false}
          onToggleAtivo={handlers.handleToggleAtivo}
          loading={filaLoading}
        />

        {/* Stats Manager */}
        <StatsManager
          barbeariaAtual={barbeariaAtual}
          barbeiroAtual={barbeiroAtual}
          userRole="barbeiro"
          stats={stats}
          estatisticas={estatisticas}
          historicoAtualizado={historicoAtualizado}
          loading={statsLoading}
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
            filaLoading={filaLoading}
            atendendoAtual={atendendoAtual}
            setAtendendoAtual={setAtendendoAtual}
            isBarbeiroAtivo={(barbeariaId) => statusBarbeiro[barbeariaId]?.ativo || false}
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