import { useState } from 'react';

// Hook personalizado para gerenciar notificações
export const useNotification = () => {
  const [notificacao, setNotificacao] = useState(null);

  const mostrarNotificacao = (mensagem, tipo = 'info') => {
    setNotificacao({ mensagem, tipo });
    setTimeout(() => setNotificacao(null), 5000);
  };

  const limparNotificacao = () => setNotificacao(null);

  return { notificacao, mostrarNotificacao, limparNotificacao };
};

// Handlers para o dashboard do barbeiro
export const useBarbeiroHandlers = ({
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
}) => {
  
  const handleBarbeariaChange = async (barbeariaId) => {
    const barbearia = barbearias.find(b => b.id === parseInt(barbeariaId));
    
    // Definir nova barbearia
    setBarbeariaAtual(barbearia);
    
    // Mostrar mensagem informativa se mudou de barbearia
    if (barbeariaAtual && barbeariaAtual.id !== barbearia.id) {
      mostrarNotificacao(`Barbearia alterada para ${barbearia.nome}. Verifique seu status de trabalho!`, 'info');
    }
  };

  const handleToggleAtivo = async (barbeariaId) => {
    try {
      const isAtivo = isBarbeiroAtivo(barbeariaId);
      const acao = isAtivo ? 'desativar' : 'ativar';
      
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
      return true; // Para indicar sucesso
    } catch (error) {
      console.error('Erro ao chamar próximo:', error);
      mostrarNotificacao(`❌ Erro ao chamar próximo cliente: ${error.message}`, 'error');
      return false;
    }
  };

  const handleFinalizarAtendimento = () => {
    if (!atendendoAtual) return false;
    return true; // Para indicar que pode abrir o modal
  };

  const handleConfirmarFinalizacao = async (dados) => {
    try {
      // ✅ USAR DIRETAMENTE O ID DO CLIENTE (SIMPLES!)
      const clienteId = atendendoAtual?.id;
      
      if (!clienteId) {
        throw new Error('ID do cliente não encontrado.');
      }
      
      // ✅ LIMPAR ATENDENDO ATUAL IMEDIATAMENTE
      setAtendendoAtual(null);
      
      const response = await finalizarAtendimento(clienteId, dados);
      
      mostrarNotificacao('✅ Atendimento finalizado com sucesso!', 'success');
      
      // Forçar atualização adicional após um delay
      setTimeout(async () => {
        try {
          await getFilaBarbeiro();
        } catch (error) {
          console.error('❌ Erro na atualização forçada:', error);
        }
      }, 2000);
      
      return true;
      
    } catch (error) {
      console.error('❌ Erro ao finalizar atendimento:', error);
      mostrarNotificacao(`❌ Erro ao finalizar atendimento: ${error.message}`, 'error');
      return false;
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
    if (!atendendoAtual) return false;
    return true; // Para indicar que pode abrir o modal
  };

  const handleConfirmarInicio = async (dados) => {
    try {
      // ✅ VERIFICAR SE O BARBEIRO ESTÁ ATIVO
      if (!isBarbeiroAtivo(barbeariaAtual?.id)) {
        mostrarNotificacao('❌ Você precisa estar ativo na barbearia para iniciar atendimentos', 'error');
        return false;
      }

      // ✅ USAR DIRETAMENTE O ID DO CLIENTE (SIMPLES!)
      const clienteId = atendendoAtual?.id;
      
      if (!clienteId) {
        throw new Error('ID do cliente não encontrado. Tente chamar o próximo cliente novamente.');
      }
      
      const response = await iniciarAtendimento(clienteId, dados);
      
      mostrarNotificacao('✅ Atendimento iniciado com sucesso!', 'success');
      
      // Forçar atualização adicional após um delay
      setTimeout(async () => {
        try {
          await getFilaBarbeiro();
        } catch (error) {
          console.error('❌ Erro na atualização forçada:', error);
        }
      }, 2000);
      
      return true;
      
    } catch (error) {
      console.error('❌ Erro ao iniciar atendimento:', error);
      mostrarNotificacao(`❌ Erro ao iniciar atendimento: ${error.message}`, 'error');
      return false;
    }
  };

  const handleAtualizarFilaManual = async () => {
    try {
      await getFilaBarbeiro();
      mostrarNotificacao('✅ Fila atualizada manualmente!', 'success');
      return true;
    } catch (error) {
      console.error('❌ Erro na atualização manual:', error);
      mostrarNotificacao('❌ Erro ao atualizar fila', 'error');
      return false;
    }
  };

  return {
    handleBarbeariaChange,
    handleToggleAtivo,
    handleChamarProximo,
    handleFinalizarAtendimento,
    handleConfirmarFinalizacao,
    handleAdicionarCliente,
    handleRemoverClienteNaoApareceu,
    handleRemoverCliente,
    handleIniciarAtendimento,
    handleConfirmarInicio,
    handleAtualizarFilaManual
  };
}; 