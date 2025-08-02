import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDashboard } from '@/contexts/DashboardContext.jsx';
import { useBarbeiroFila } from '@/hooks/useBarbeiroFila.js';
import { useDashboardStats } from '@/hooks/useDashboardStats.js';
import DashboardHeader from './DashboardHeader.jsx';
import BarbeariaSelector from './BarbeariaSelector.jsx';
import ActionButtons from './ActionButtons.jsx';

import FilaManager from '@/components/ui/fila-manager.jsx';
import StatsManager from '@/components/ui/stats-manager.jsx';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.jsx';
import { Badge } from '@/components/ui/badge.jsx';
import { Button } from '@/components/ui/button.jsx';
import { Building2, CheckCircle, XCircle } from 'lucide-react';
import FinalizarAtendimentoModal from '@/components/ui/finalizar-atendimento-modal.jsx';
import IniciarAtendimentoModal from '@/components/ui/iniciar-atendimento-modal.jsx';

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

  // Debug logs
  console.log('🔍 BarbeiroDashboard - Status:', {
    barbeariaId: barbeariaAtual?.id,
    filaLength: fila.length,
    statusBarbeiro: Object.keys(statusBarbeiro).length > 0 ? 'carregado' : 'vazio',
    fila: fila
  });

  // Hook para estatísticas
  const { stats, loading: statsLoading } = useDashboardStats('barbeiro', barbeariaAtual);

  const [historicoAtualizado, setHistoricoAtualizado] = useState(false);
  const [notificacao, setNotificacao] = useState(null);
  const [showFinalizarModal, setShowFinalizarModal] = useState(false);
  const [showIniciarModal, setShowIniciarModal] = useState(false);

  // Função para mostrar notificação
  const mostrarNotificacao = (mensagem, tipo = 'info') => {
    setNotificacao({ mensagem, tipo });
    setTimeout(() => setNotificacao(null), 5000);
  };

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

  const handleBarbeariaChange = async (barbeariaId) => {
    const barbearia = barbearias.find(b => b.id === parseInt(barbeariaId));
    
    // Definir nova barbearia
    setBarbeariaAtual(barbearia);
    console.log('🔄 Barbearia alterada para:', barbearia.nome);
    
    // Mostrar mensagem informativa se mudou de barbearia
    if (barbeariaAtual && barbeariaAtual.id !== barbearia.id) {
      mostrarNotificacao(`Barbearia alterada para ${barbearia.nome}. Verifique seu status de trabalho!`, 'info');
    }
  };

  const handleToggleAtivo = async (barbeariaId) => {
    console.log('🔄 handleToggleAtivo chamado:', {
      barbeariaId,
      barbeariaAtual,
      barbeiroAtual,
      statusBarbeiro: statusBarbeiro
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
      if (acao === 'ativar') {
        mostrarNotificacao('🔄 Ativando status e desativando em outras barbearias...', 'info');
      } else {
        mostrarNotificacao('🔄 Desativando status...', 'info');
      }
      
      await toggleStatusBarbeiro(acao);
      
      // Feedback de sucesso
      if (acao === 'ativar') {
        mostrarNotificacao('✅ Status ativado com sucesso! Você foi desativado nas outras barbearias e está disponível para atendimentos nesta barbearia.', 'success');
      } else {
        mostrarNotificacao('✅ Status desativado com sucesso! Você está indisponível.', 'success');
      }
      
    } catch (error) {
      console.error('❌ Erro ao alterar status:', error);
      
      // Determinar a ação para a mensagem de erro
      const isAtivo = isBarbeiroAtivo(barbeariaId);
      const acao = isAtivo ? 'desativar' : 'ativar';
      
      // Adicionar feedback visual para o usuário
      mostrarNotificacao(`❌ Erro ao ${acao} status: ${error.message}`, 'error');
    }
  };

  const handleChamarProximo = async () => {
    try {
      await chamarProximo();
      mostrarNotificacao('✅ Próximo cliente chamado com sucesso!', 'success');
      setHistoricoAtualizado(true);
      setTimeout(() => setHistoricoAtualizado(false), 3000);
    } catch (error) {
      console.error('Erro ao chamar próximo:', error);
      mostrarNotificacao(`❌ Erro ao chamar próximo cliente: ${error.message}`, 'error');
    }
  };

  const handleFinalizarAtendimento = () => {
    if (!atendendoAtual) return;
    setShowFinalizarModal(true);
  };

  const handleConfirmarFinalizacao = async (dados) => {
    try {
      console.log('🚀 Finalizando atendimento com dados:', dados);
      
      // Buscar o ID do atendimento atual
      const atendimentoId = atendendoAtual?.atendimento_id || atendendoAtual?.id;
      
      await finalizarAtendimento(atendimentoId, dados);
      setAtendendoAtual(null);
      setShowFinalizarModal(false);
      mostrarNotificacao('✅ Atendimento finalizado com sucesso!', 'success');
      setHistoricoAtualizado(true);
      setTimeout(() => setHistoricoAtualizado(false), 3000);
    } catch (error) {
      console.error('❌ Erro ao finalizar atendimento:', error);
      mostrarNotificacao(`❌ Erro ao finalizar atendimento: ${error.message}`, 'error');
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

  const handleIniciarAtendimento = () => {
    if (!atendendoAtual) return;
    setShowIniciarModal(true);
  };

  const handleConfirmarInicio = async (dados) => {
    try {
      // ✅ VERIFICAR SE O BARBEIRO ESTÁ ATIVO
      if (!isBarbeiroAtivo(barbeariaAtual?.id)) {
        mostrarNotificacao('❌ Você precisa estar ativo na barbearia para iniciar atendimentos', 'error');
        return;
      }

      console.log('🚀 Iniciando atendimento com dados:', dados);
      
      // Buscar o ID do atendimento atual
      const atendimentoId = atendendoAtual?.atendimento_id || atendendoAtual?.id;
      
      const response = await iniciarAtendimento(atendimentoId, dados);
      console.log('✅ Resposta do iniciar atendimento:', response);
      
      setShowIniciarModal(false);
      mostrarNotificacao('✅ Atendimento iniciado com sucesso!', 'success');
      setHistoricoAtualizado(true);
      setTimeout(() => setHistoricoAtualizado(false), 3000);
    } catch (error) {
      console.error('❌ Erro ao iniciar atendimento:', error);
      mostrarNotificacao(`❌ Erro ao iniciar atendimento: ${error.message}`, 'error');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-4 sm:py-8">
        {/* Notificação */}
        {notificacao && (
          <div className={`fixed top-4 left-4 right-4 sm:left-auto sm:right-4 z-50 p-4 rounded-lg shadow-lg max-w-md mx-auto sm:mx-0 ${
            notificacao.tipo === 'success' ? 'bg-green-100 border border-green-400 text-green-800' :
            notificacao.tipo === 'error' ? 'bg-red-100 border border-red-400 text-red-800' :
            'bg-blue-100 border border-blue-400 text-blue-800'
          }`}>
            <div className="flex items-center justify-between">
              <span className="text-sm pr-2">{notificacao.mensagem}</span>
              <button 
                onClick={() => setNotificacao(null)}
                className="text-gray-500 hover:text-gray-700 flex-shrink-0"
              >
                ×
              </button>
            </div>
          </div>
        )}

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

        {/* Status em Todas as Barbearias */}
        <Card className="mb-4 sm:mb-6">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center text-lg sm:text-xl">
              <Building2 className="mr-2 h-5 w-5" />
              Meu Status em Todas as Barbearias
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mb-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-xs text-blue-800">
                <strong>Regra:</strong> Você só pode estar ativo em uma barbearia por vez. 
                Ao ativar uma barbearia, você será automaticamente desativado nas outras.
              </p>
            </div>
            <div className="grid grid-cols-1 gap-3">
              {barbearias.map((barbearia) => {
                const isAtivo = isBarbeiroAtivo(barbearia.id);
                const isAtual = barbeariaAtual?.id === barbearia.id;
                
                return (
                  <div 
                    key={barbearia.id}
                    className={`p-3 rounded-lg border ${
                      isAtual 
                        ? 'bg-blue-50 border-blue-200' 
                        : 'bg-gray-50 border-gray-200'
                    }`}
                  >
                    <div className="flex flex-col space-y-2 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
                      <div className="flex items-center space-x-2">
                        {/* Sinal Luminoso */}
                        <div className="relative">
                          <div 
                            className={`w-4 h-4 rounded-full ${
                              isAtivo 
                                ? 'bg-green-500 shadow-lg shadow-green-500/50 animate-pulse' 
                                : 'bg-red-500 shadow-lg shadow-red-500/50'
                            }`}
                            title={isAtivo ? "Status: ATIVO" : "Status: INATIVO"}
                          />
                          {/* Efeito de brilho interno */}
                          <div 
                            className={`absolute top-1 left-1 w-2 h-2 rounded-full ${
                              isAtivo 
                                ? 'bg-green-300' 
                                : 'bg-red-300'
                            }`}
                          />
                        </div>
                        
                        {isAtivo ? (
                          <CheckCircle className="h-4 w-4 text-green-600" />
                        ) : (
                          <XCircle className="h-4 w-4 text-gray-400" />
                        )}
                        <div className="flex flex-col">
                          <span className={`text-sm font-medium ${
                            isAtual ? 'text-blue-800' : 'text-gray-700'
                          }`}>
                            {barbearia.nome}
                          </span>
                          {isAtual && (
                            <p className="text-xs text-blue-600">
                              Barbearia atual
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="flex flex-col space-y-2 sm:flex-row sm:items-center sm:space-y-0 sm:space-x-2">
                        <Badge 
                          variant={isAtivo ? "default" : "secondary"}
                          className="text-xs self-start sm:self-auto"
                        >
                          {isAtivo ? "ATIVO" : "INATIVO"}
                        </Badge>
                        {isAtual && (
                          <Button
                            variant={isAtivo ? "outline" : "default"}
                            size="sm"
                            onClick={() => handleToggleAtivo(barbearia.id)}
                            disabled={filaLoading}
                            className={`w-full sm:w-auto ${
                              !isAtivo 
                                ? 'bg-black text-white hover:bg-gray-800 border-black' 
                                : ''
                            }`}
                          >
                            {isAtivo ? "Desativar" : "Ativar"}
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>



        {/* Gerenciador de Estatísticas */}
        <div className="mb-4 sm:mb-6">
          <StatsManager
            barbeariaAtual={barbeariaAtual}
            barbeiroAtual={barbeiroAtual}
            userRole="barbeiro"
            estatisticas={estatisticas}
            historicoAtualizado={historicoAtualizado}
          />
        </div>

        {/* Ações Rápidas */}
        <div className="mb-6 sm:mb-8">
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
          fila={fila}
          loading={filaLoading}
          onChamarProximo={handleChamarProximo}
          onFinalizarAtendimento={handleFinalizarAtendimento}
          onAdicionarCliente={handleAdicionarCliente}
          onRemoverCliente={handleRemoverCliente}
          onIniciarAtendimento={handleIniciarAtendimento}
          atendendoAtual={atendendoAtual}
          setAtendendoAtual={setAtendendoAtual}
          onHistoricoAtualizado={() => setHistoricoAtualizado(true)}
        />

        {/* Modal de Finalizar Atendimento */}
        <FinalizarAtendimentoModal
          isOpen={showFinalizarModal}
          onClose={() => setShowFinalizarModal(false)}
          onConfirm={handleConfirmarFinalizacao}
          cliente={atendendoAtual}
          loading={filaLoading}
        />

        {/* Modal de Iniciar Atendimento */}
        <IniciarAtendimentoModal
          isOpen={showIniciarModal}
          onClose={() => setShowIniciarModal(false)}
          onConfirm={handleConfirmarInicio}
          cliente={atendendoAtual}
          loading={filaLoading}
        />
      </div>
    </div>
  );
};

export default BarbeiroDashboard; 