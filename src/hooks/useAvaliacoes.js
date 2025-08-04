import { useState, useEffect, useCallback } from 'react';
import { avaliacoesService } from '@/services/api.js';

const useAvaliacoes = (barbeariaId, userRole) => {
  const [avaliacoes, setAvaliacoes] = useState([]);
  const [metricas, setMetricas] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [itemsPerPage] = useState(10);

  // Carregar métricas de satisfação
  const carregarMetricas = useCallback(async (filtros = {}) => {
    try {
      const params = {
        barbearia_id: barbeariaId || '',
        ...filtros
      };

      const data = await avaliacoesService.listarAvaliacoes(params);
      setMetricas(data);
      return data;
    } catch (error) {
      console.error('Erro ao carregar métricas:', error);
      // Em caso de erro, usar dados mockados básicos
      const mockMetricas = {
        metricas: {
          nota_media_estrutura: 0,
          nota_media_barbeiros: 0,
          total_avaliacoes: 0,
          satisfacao_geral: 0
        }
      };
      setMetricas(mockMetricas);
      return mockMetricas;
    }
  }, [barbeariaId]);

  // Carregar lista de avaliações
  const carregarAvaliacoes = useCallback(async (filtros = {}) => {
    try {
      const params = {
        page: currentPage,
        limit: itemsPerPage,
        barbearia_id: barbeariaId || '',
        ...filtros
      };

      const data = await avaliacoesService.listarAvaliacoes(params);
      const avaliacoesData = data.avaliacoes || data;
      setAvaliacoes(avaliacoesData);
      setTotalPages(Math.ceil((data.total || avaliacoesData.length) / itemsPerPage));
      return data;
    } catch (error) {
      console.error('Erro ao carregar avaliações:', error);
      throw error;
    }
  }, [barbeariaId, currentPage, itemsPerPage]);

  // Carregar dados iniciais
  const carregarDados = useCallback(async (filtros = {}) => {
    try {
      setLoading(true);
      setError('');

      // Carregar métricas e avaliações em paralelo
      const [metricasData, avaliacoesData] = await Promise.all([
        carregarMetricas(filtros),
        carregarAvaliacoes(filtros)
      ]);

      return { metricas: metricasData, avaliacoes: avaliacoesData };
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
      setError('Erro ao carregar dados das avaliações');
      throw error;
    } finally {
      setLoading(false);
    }
  }, [carregarMetricas, carregarAvaliacoes]);

  // Buscar avaliações com filtros
  const buscarAvaliacoes = useCallback(async (filtros = {}) => {
    try {
      setLoading(true);
      setCurrentPage(1); // Reset para primeira página
      
      const params = {
        page: 1,
        limit: itemsPerPage,
        barbearia_id: barbeariaId || '',
        ...filtros
      };

      const data = await avaliacoesService.listarAvaliacoes(params);
      const avaliacoesData = data.avaliacoes || data;
      setAvaliacoes(avaliacoesData);
      setTotalPages(Math.ceil((data.total || avaliacoesData.length) / itemsPerPage));
      return data;
    } catch (error) {
      console.error('Erro ao buscar avaliações:', error);
      setError('Erro ao buscar avaliações');
      throw error;
    } finally {
      setLoading(false);
    }
  }, [barbeariaId, itemsPerPage]);

  // Download de relatório
  const downloadRelatorio = useCallback(async (filtros = {}) => {
    try {
      // Como o endpoint de download não existe no backend, vamos criar um relatório básico
      console.log('⚠️ Endpoint de download não disponível no backend. Criando relatório básico...');
      
      // Criar um relatório básico em formato CSV
      const avaliacoesData = avaliacoes.map(av => ({
        id: av.id,
        cliente: av.cliente_nome,
        estrutura: av.rating_estrutura,
        barbeiro: av.rating_barbeiro,
        comentario: av.comentario || '',
        data: av.created_at
      }));
      
      const csvContent = [
        'ID,Cliente,Estrutura,Barbeiro,Comentário,Data',
        ...avaliacoesData.map(av => 
          `${av.id},"${av.cliente}",${av.estrutura},${av.barbeiro},"${av.comentario}",${av.data}`
        )
      ].join('\n');
      
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `avaliacoes-${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      console.log('✅ Relatório CSV criado e baixado com sucesso');
      return true;
    } catch (error) {
      console.error('Erro ao baixar relatório:', error);
      throw error;
    }
  }, [barbeariaId, avaliacoes]);

  // Funções utilitárias
  const getRatingColor = (rating) => {
    if (rating >= 4) return 'bg-green-100 text-green-800';
    if (rating >= 3) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  const getRatingText = (rating) => {
    if (rating === 5) return 'Excelente';
    if (rating === 4) return 'Muito Bom';
    if (rating === 3) return 'Bom';
    if (rating === 2) return 'Regular';
    if (rating === 1) return 'Ruim';
    return 'Não avaliado';
  };

  const formatarData = (dataString) => {
    return new Date(dataString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const calcularTempoRestante = (dataFinalizacao) => {
    const agora = new Date();
    const dataFinal = new Date(dataFinalizacao);
    const horasPassadas = (agora - dataFinal) / (1000 * 60 * 60);
    const horasRestantes = Math.max(0, 24 - horasPassadas);
    
    if (horasRestantes <= 0) return 0;
    return Math.floor(horasRestantes);
  };

  const getStatusLink = (dataFinalizacao) => {
    const horasRestantes = calcularTempoRestante(dataFinalizacao);
    
    if (horasRestantes <= 0) {
      return {
        status: 'expirado',
        texto: 'Expirado',
        cor: 'bg-red-100 text-red-800',
        icon: 'AlertTriangle'
      };
    } else if (horasRestantes <= 6) {
      return {
        status: 'expirando',
        texto: `${horasRestantes}h restantes`,
        cor: 'bg-orange-100 text-orange-800',
        icon: 'AlertTriangle'
      };
    } else {
      return {
        status: 'valido',
        texto: `${horasRestantes}h restantes`,
        cor: 'bg-green-100 text-green-800',
        icon: 'Clock'
      };
    }
  };

  // Carregar dados quando barbeariaId mudar
  useEffect(() => {
    if (barbeariaId) {
      carregarDados();
    }
  }, [barbeariaId, carregarDados]);

  // Carregar avaliações quando página mudar
  useEffect(() => {
    if (barbeariaId && currentPage > 1) {
      carregarAvaliacoes();
    }
  }, [currentPage, carregarAvaliacoes]);

  return {
    // Estado
    avaliacoes,
    metricas,
    loading,
    error,
    currentPage,
    totalPages,
    itemsPerPage,

    // Ações
    carregarDados,
    carregarMetricas,
    carregarAvaliacoes,
    buscarAvaliacoes,
    downloadRelatorio,
    setCurrentPage,
    setError,

    // Utilitários
    getRatingColor,
    getRatingText,
    formatarData,
    calcularTempoRestante,
    getStatusLink
  };
};

export default useAvaliacoes; 