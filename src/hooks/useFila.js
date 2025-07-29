import { useState, useEffect } from 'react';
import { filaService } from '@/services/api.js';

export const useFila = () => {
  const [cliente, setCliente] = useState(null);
  const [loading, setLoading] = useState(true);

  const checkStatus = async () => {
    try {
      const data = await filaService.obterStatusCliente();
      
      if (data.success) {
        setCliente(data.data);
      } else {
        setCliente(null);
      }
    } catch (error) {
      setCliente(null);
    } finally {
      setLoading(false);
    }
  };

  const entrarFila = async (dados) => {
    try {
      const data = await filaService.entrarNaFila(dados);
      
      if (data.success) {
        setCliente(data.data.cliente);
        return { success: true, data: data.data };
      } else {
        return { success: false, error: data.error };
      }
    } catch (error) {
      return { success: false, error: 'Erro ao entrar na fila' };
    }
  };

  const sairFila = async () => {
    try {
      await filaService.sairDaFila();
      setCliente(null);
    } catch (error) {
      console.error('Erro ao sair da fila:', error);
    }
  };

  useEffect(() => {
    checkStatus();
  }, []);

  return { cliente, loading, checkStatus, entrarFila, sairFila };
}; 