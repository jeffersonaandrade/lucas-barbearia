import { useState, useEffect } from 'react';
import { configuracoesService } from '@/services/api.js';

export const useConfiguracoes = (barbeariaId) => {
  const [configuracoes, setConfiguracoes] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const carregarConfiguracoes = async () => {
    if (!barbeariaId) return;
    
    setLoading(true);
    setError(null);
    
    try {
      // Usar listarServicos em vez de carregarConfiguracoes
      const data = await configuracoesService.listarServicos(barbeariaId);
      
      // Mapear dados do backend para o formato esperado pelo frontend
      const servicosMapeados = (data.data || []).map(servico => ({
        ...servico,
        duracao_estimada: servico.duracao // Mapear duracao -> duracao_estimada
      }));
      
      setConfiguracoes({ servicos: servicosMapeados });
    } catch (error) {
      console.error('Erro ao carregar configurações:', error);
      setError(error.message || 'Erro ao carregar configurações');
    } finally {
      setLoading(false);
    }
  };

  // Serviços
  const atualizarServico = async (servicoId, dados) => {
    try {
      const data = await configuracoesService.atualizarServico(servicoId, dados);
      await carregarConfiguracoes(); // Recarregar
      return data;
    } catch (error) {
      throw error;
    }
  };

  const criarServico = async (dados) => {
    try {
      const data = await configuracoesService.criarServico(dados);
      await carregarConfiguracoes(); // Recarregar
      return data;
    } catch (error) {
      throw error;
    }
  };

  const excluirServico = async (servicoId) => {
    try {
      const data = await configuracoesService.excluirServico(servicoId);
      await carregarConfiguracoes(); // Recarregar
      return data;
    } catch (error) {
      throw error;
    }
  };



  useEffect(() => {
    if (barbeariaId) {
      carregarConfiguracoes();
    }
  }, [barbeariaId]);

  return {
    configuracoes,
    loading,
    error,
    carregarConfiguracoes,
    // Serviços
    atualizarServico,
    criarServico,
    excluirServico,
  };
}; 