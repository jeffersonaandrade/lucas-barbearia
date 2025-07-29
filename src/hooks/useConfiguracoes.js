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
      const data = await configuracoesService.carregarConfiguracoes(barbeariaId);
      setConfiguracoes(data.data);
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

  // Horários
  const atualizarHorarios = async (dados) => {
    try {
      const data = await configuracoesService.atualizarHorarios(barbeariaId, dados);
      await carregarConfiguracoes(); // Recarregar
      return data;
    } catch (error) {
      throw error;
    }
  };

  // Configurações Gerais
  const atualizarConfiguracoesGerais = async (dados) => {
    try {
      const data = await configuracoesService.atualizarConfiguracoesGerais(barbeariaId, dados);
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
    // Horários
    atualizarHorarios,
    // Configurações Gerais
    atualizarConfiguracoesGerais
  };
}; 