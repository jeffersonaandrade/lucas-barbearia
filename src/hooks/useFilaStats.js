import { useMemo } from 'react';

export const useFilaStats = (fila = [], estatisticasAPI = null) => {
  const estatisticas = useMemo(() => {
    // Se temos dados da API, usar eles (prioridade)
    if (estatisticasAPI && estatisticasAPI.data) {
      const { fila: filaStats, barbeiros, tempos, ultimas24h } = estatisticasAPI.data;
      
      return {
        // Dados da fila
        total: filaStats?.total || 0,
        aguardando: filaStats?.aguardando || 0,
        proximo: filaStats?.proximo || 0,
        atendendo: filaStats?.atendendo || 0,
        finalizado: filaStats?.finalizado || 0,
        removido: filaStats?.removido || 0,
        
        // Dados dos barbeiros
        barbeirosTotal: barbeiros?.total || 0,
        barbeirosAtendendo: barbeiros?.atendendo || 0,
        barbeirosDisponiveis: barbeiros?.disponiveis || 0,
        barbeirosOcupados: barbeiros?.ocupados || 0,
        
        // Dados de tempo
        tempoMedioEspera: tempos?.medioEspera || 0,
        tempoMedioAtendimento: tempos?.medioAtendimento || 0,
        tempoEstimadoProximo: tempos?.estimadoProximo || 0,
        
        // Dados das últimas 24h
        ultimas24h: {
          totalAtendidos: ultimas24h?.totalAtendidos || 0,
          tempoMedioEspera: ultimas24h?.tempoMedioEspera || 0,
          tempoMedioAtendimento: ultimas24h?.tempoMedioAtendimento || 0,
          clientesPorHora: ultimas24h?.clientesPorHora || 0,
          barbeirosAtivos: ultimas24h?.barbeirosAtivos || 0
        }
      };
    }

    // Fallback: calcular baseado na fila local
    if (!fila || fila.length === 0) {
      return {
        total: 0,
        aguardando: 0,
        atendendo: 0,
        proximo: 0,
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
      atendendo,
      proximo,
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
  }, [fila, estatisticasAPI]);

  return estatisticas;
}; 