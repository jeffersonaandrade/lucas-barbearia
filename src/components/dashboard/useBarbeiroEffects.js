import { useEffect } from 'react';

export const useBarbeiroEffects = ({
  barbearias,
  barbeariaAtual,
  setBarbeariaAtual,
  atendendoAtual,
  setAtendendoAtual,
  atendendoHook
}) => {
  
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

  // Garantir que atendendoAtual seja limpo quando não houver cliente em atendimento
  useEffect(() => {
    if (atendendoAtual && 
        atendendoAtual.status !== 'atendendo' && 
        atendendoAtual.status !== 'em_atendimento' && 
        atendendoAtual.status !== 'proximo' && 
        atendendoAtual.status !== 'próximo' &&
        atendendoAtual.status !== 'aguardando') {
      setAtendendoAtual(null);
    }
  }, [atendendoAtual, setAtendendoAtual]);
}; 