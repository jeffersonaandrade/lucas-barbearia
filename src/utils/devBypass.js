// Utilitário para bypass de QR Code em desenvolvimento
export const devBypass = {
  // Simular acesso QR Code
  simulateQRCodeAccess: (barbeariaId) => {
    const accessData = {
      barbeariaId: parseInt(barbeariaId),
      timestamp: Date.now(),
      hasAccess: true
    };
    
    localStorage.setItem('qr_access', JSON.stringify(accessData));
    console.log(`✅ Bypass QR Code ativado para barbearia ${barbeariaId}`);
    
    // Recarregar a página para aplicar as mudanças
    window.location.reload();
  },

  // Limpar bypass
  clearBypass: () => {
    localStorage.removeItem('qr_access');
    console.log('🧹 Bypass QR Code removido');
    window.location.reload();
  },

  // Verificar status do bypass
  checkBypassStatus: () => {
    const savedAccess = localStorage.getItem('qr_access');
    if (savedAccess) {
      const access = JSON.parse(savedAccess);
      const now = Date.now();
      const sessionTimeout = 2 * 60 * 60 * 1000; // 2 horas
      
      if (now - access.timestamp < sessionTimeout) {
        console.log(`✅ Bypass ativo para barbearia ${access.barbeariaId}`);
        return access;
      } else {
        console.log('⚠️ Bypass expirado');
        localStorage.removeItem('qr_access');
        return null;
      }
    } else {
      console.log('❌ Nenhum bypass ativo');
      return null;
    }
  },

  // Entrar na fila diretamente (para testes)
  enterQueueDirectly: async (barbeariaId, dadosCliente) => {
    try {
      const response = await fetch(`http://localhost:3000/api/fila/entrar`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nome: dadosCliente.nome,
          telefone: dadosCliente.telefone,
          barbearia_id: barbeariaId,
          barbeiro_id: dadosCliente.barbeiro === 'Fila Geral' ? null : dadosCliente.barbeiro
        })
      });

      if (response.ok) {
        const result = await response.json();
        console.log('✅ Cliente adicionado à fila:', result);
        return result;
      } else {
        throw new Error(`Erro ${response.status}: ${response.statusText}`);
      }
    } catch (error) {
      console.error('❌ Erro ao entrar na fila:', error);
      throw error;
    }
  }
};

// Funções para usar no console do navegador
window.devBypass = devBypass;

// Exemplo de uso no console:
// devBypass.simulateQRCodeAccess(2)  // Ativar bypass para barbearia 2
// devBypass.enterQueueDirectly(2, {nome: 'João', telefone: '(81) 99999-9999', barbeiro: 'Fila Geral'})
// devBypass.clearBypass()  // Limpar bypass
// devBypass.checkBypassStatus()  // Verificar status 