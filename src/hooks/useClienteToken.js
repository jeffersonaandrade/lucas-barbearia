import { useState, useEffect } from 'react';
import { CookieManager } from '@/utils/cookieManager.js';

export const useClienteToken = () => {
  const [hasToken, setHasToken] = useState(false);
  const [barbeariaId, setBarbeariaId] = useState(null);
  const [clienteData, setClienteData] = useState(null);

  useEffect(() => {
    const verificarToken = () => {
      const token = CookieManager.getFilaToken();
      const cliente = CookieManager.getClienteData();
      const barbeariaId = CookieManager.getBarbeariaId();
      
      if (token && cliente && barbeariaId) {
        setHasToken(true);
        setBarbeariaId(barbeariaId);
        setClienteData(cliente);
      } else {
        limparToken();
      }
    };

    verificarToken();
    
    // Verificar periodicamente (cookies não têm evento de mudança)
    const interval = setInterval(verificarToken, 5000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  const limparToken = () => {
    CookieManager.clearFilaCookies();
    setHasToken(false);
    setBarbeariaId(null);
    setClienteData(null);
  };

  const getStatusFilaUrl = () => {
    return barbeariaId ? `/barbearia/${barbeariaId}/status-fila` : null;
  };

  return {
    hasToken,
    barbeariaId,
    clienteData,
    limparToken,
    getStatusFilaUrl
  };
}; 