import { useState, useEffect } from 'react';

export const useClienteToken = () => {
  const [hasToken, setHasToken] = useState(false);
  const [barbeariaId, setBarbeariaId] = useState(null);
  const [clienteData, setClienteData] = useState(null);

  useEffect(() => {
    const verificarToken = () => {
      const token = localStorage.getItem('fila_token');
      const clienteDataStr = localStorage.getItem('cliente_data');
      const barbeariaIdStr = localStorage.getItem('fila_barbearia_id');
      
      if (token && clienteDataStr && barbeariaIdStr) {
        try {
          const cliente = JSON.parse(clienteDataStr);
          setHasToken(true);
          setBarbeariaId(barbeariaIdStr);
          setClienteData(cliente);
        } catch (error) {
          console.error('Erro ao parsear dados do cliente:', error);
          limparToken();
        }
      } else {
        limparToken();
      }
    };

    verificarToken();

    // Escutar mudanças no localStorage
    const handleStorageChange = (e) => {
      if (e.key === 'fila_token' || e.key === 'cliente_data' || e.key === 'fila_barbearia_id') {
        verificarToken();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    
    // Verificar periodicamente (para mudanças na mesma aba)
    const interval = setInterval(verificarToken, 5000);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(interval);
    };
  }, []);

  const limparToken = () => {
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