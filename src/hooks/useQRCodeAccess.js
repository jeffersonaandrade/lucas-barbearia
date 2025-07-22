import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';

export const useQRCodeAccess = () => {
  const [searchParams] = useSearchParams();
  const [hasQRCodeAccess, setHasQRCodeAccess] = useState(false);
  const [barbeariaId, setBarbeariaId] = useState(null);

  useEffect(() => {
    // Verificar se veio de QR Code através de parâmetros na URL
    const qrAccess = searchParams.get('qr');
    const barbearia = searchParams.get('barbearia');
    
    if (qrAccess === 'true' && barbearia) {
      setHasQRCodeAccess(true);
      setBarbeariaId(parseInt(barbearia));
      
      // Salvar no localStorage para manter o acesso durante a sessão
      localStorage.setItem('qr_access', JSON.stringify({
        barbeariaId: parseInt(barbearia),
        timestamp: Date.now(),
        hasAccess: true
      }));
    } else {
      // Verificar se já tem acesso salvo no localStorage
      const savedAccess = localStorage.getItem('qr_access');
      if (savedAccess) {
        const access = JSON.parse(savedAccess);
        const now = Date.now();
        const sessionTimeout = 2 * 60 * 60 * 1000; // 2 horas
        
        // Se ainda está dentro do tempo da sessão
        if (now - access.timestamp < sessionTimeout) {
          setHasQRCodeAccess(true);
          setBarbeariaId(access.barbeariaId);
        } else {
          // Sessão expirada, limpar
          localStorage.removeItem('qr_access');
        }
      }
    }
  }, [searchParams]);

  const clearQRCodeAccess = () => {
    localStorage.removeItem('qr_access');
    setHasQRCodeAccess(false);
    setBarbeariaId(null);
  };

  const getQRCodeUrl = (barbeariaId) => {
    const baseUrl = window.location.origin;
    return `${baseUrl}/barbearia/${barbeariaId}/entrar-fila?qr=true&barbearia=${barbeariaId}`;
  };

  return {
    hasQRCodeAccess,
    barbeariaId,
    clearQRCodeAccess,
    getQRCodeUrl
  };
}; 