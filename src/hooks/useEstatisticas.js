import { useState, useEffect, useCallback } from 'react';
import { filaService } from '@/services/api.js';

/**
 * Hook centralizado para gerenciar estatísticas da fila
 * Elimina duplicação de código e garante consistência
 */
export const useEstatisticas = (barbeariaId = null) => {
  const [estatisticas, setEstatisticas] = useState({
    // Dados da fila
    total: 0,
    aguardando: 0,
    proximo: 0,
    atendendo: 0,
    finalizado: 0,
    removido: 0,
    
    // Dados dos barbeiros
    barbeirosTotal: 0,
    barbeirosAtendendo: 0,
    barbeirosDisponiveis: 0,
    barbeirosOcupados: 0,
    
    // Dados de tempo
    tempoMedioEspera: 0,
    tempoMedioAtendimento: 0,
    tempoEstimadoProximo: 0,
    
    // Dados das últimas 24h
    ultimas24h: {
      totalAtendidos: 0,
      tempoMedioEspera: 0,
      tempoMedioAtendimento: 0,
      clientesPorHora: 0,
      barbeirosAtivos: 0
    }
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Carregar estatísticas do endpoint público
   */
  const carregarEstatisticas = useCallback(async () => {
    if (!barbeariaId) return;

    setLoading(true);
    setError(null);

    try {
      const response = await filaService.obterEstatisticasPublicas(barbeariaId);
      const data = response.data || response;

      // Mapear dados da API para formato padronizado
      const estatisticasMapeadas = {
        // Dados da fila
        total: data.fila?.total || 0,
        aguardando: data.fila?.aguardando || 0,
        proximo: data.fila?.proximo || 0,
        atendendo: data.fila?.atendendo || 0,
        finalizado: data.fila?.finalizado || 0,
        removido: data.fila?.removido || 0,
        
        // Dados dos barbeiros
        barbeirosTotal: data.barbeiros?.total || 0,
        barbeirosAtendendo: data.barbeiros?.atendendo || 0,
        barbeirosDisponiveis: data.barbeiros?.disponiveis || 0,
        barbeirosOcupados: data.barbeiros?.ocupados || 0,
        
        // Dados de tempo
        tempoMedioEspera: data.tempos?.medioEspera || 0,
        tempoMedioAtendimento: data.tempos?.medioAtendimento || 0,
        tempoEstimadoProximo: data.tempos?.estimadoProximo || 0,
        
        // Dados das últimas 24h
        ultimas24h: {
          totalAtendidos: data.ultimas24h?.totalAtendidos || 0,
          tempoMedioEspera: data.ultimas24h?.tempoMedioEspera || 0,
          tempoMedioAtendimento: data.ultimas24h?.tempoMedioAtendimento || 0,
          clientesPorHora: data.ultimas24h?.clientesPorHora || 0,
          barbeirosAtivos: data.ultimas24h?.barbeirosAtivos || 0
        }
      };

      setEstatisticas(estatisticasMapeadas);
    } catch (err) {
      console.error('Erro ao carregar estatísticas:', err);
      setError('Erro ao carregar estatísticas');
    } finally {
      setLoading(false);
    }
  }, [barbeariaId]);

  /**
   * Calcular estatísticas baseadas na fila local (fallback)
   */
  const calcularEstatisticasLocais = useCallback((fila = []) => {
    if (!fila || fila.length === 0) {
      return {
        total: 0,
        aguardando: 0,
        proximo: 0,
        atendendo: 0,
        finalizado: 0,
        removido: 0,
        barbeirosTotal: 0,
        barbeirosAtendendo: 0,
        barbeirosDisponiveis: 0,
        barbeirosOcupados: 0,
        tempoMedioEspera: 0,
        tempoMedioAtendimento: 0,
        tempoEstimadoProximo: 0,
        ultimas24h: {
          totalAtendidos: 0,
          tempoMedioEspera: 0,
          tempoMedioAtendimento: 0,
          clientesPorHora: 0,
          barbeirosAtivos: 0
        }
      };
    }

    // Contar por status
    const aguardando = fila.filter(cliente => cliente.status === 'aguardando').length;
    const atendendo = fila.filter(cliente => cliente.status === 'atendendo').length;
    const proximo = fila.filter(cliente => cliente.status === 'próximo').length;
    const total = fila.length;

    // Calcular tempo médio baseado na posição
    const clientesAguardando = fila.filter(cliente => cliente.status === 'aguardando');
    const tempoMedioEspera = clientesAguardando.length > 0 
      ? Math.round(clientesAguardando.reduce((acc, cliente) => {
          const posicao = cliente.posicao || 1;
          return acc + (posicao * 15); // 15 min por posição
        }, 0) / clientesAguardando.length)
      : 0;

    return {
      total,
      aguardando,
      proximo,
      atendendo,
      finalizado: 0,
      removido: 0,
      barbeirosTotal: 0,
      barbeirosAtendendo: 0,
      barbeirosDisponiveis: 0,
      barbeirosOcupados: 0,
      tempoMedioEspera,
      tempoMedioAtendimento: 30,
      tempoEstimadoProximo: tempoMedioEspera,
      ultimas24h: {
        totalAtendidos: 0,
        tempoMedioEspera,
        tempoMedioAtendimento: 30,
        clientesPorHora: 0,
        barbeirosAtivos: 0
      }
    };
  }, []);

  /**
   * Atualizar estatísticas com dados locais (fallback)
   */
  const atualizarComFilaLocal = useCallback((fila) => {
    const estatisticasLocais = calcularEstatisticasLocais(fila);
    setEstatisticas(estatisticasLocais);
  }, [calcularEstatisticasLocais]);

  // Carregar estatísticas quando barbeariaId mudar
  useEffect(() => {
    if (barbeariaId) {
      carregarEstatisticas();
    }
  }, [barbeariaId, carregarEstatisticas]);

  return {
    estatisticas,
    loading,
    error,
    carregarEstatisticas,
    atualizarComFilaLocal,
    calcularEstatisticasLocais
  };
}; 