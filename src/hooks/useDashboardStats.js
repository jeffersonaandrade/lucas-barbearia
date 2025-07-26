import { useState, useEffect, useRef } from 'react';
import { filaService, barbeariasService } from '@/services/api.js';

export const useDashboardStats = (userRole, barbeariaAtual = null) => {
  const [stats, setStats] = useState({
    totalClientes: 0,
    clientesAtendendo: 0,
    clientesAguardando: 0,
    totalBarbearias: 0,
    tempoMedio: 15
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Refs para controlar cache e evitar chamadas duplicadas
  const lastLoadTimeRef = useRef(0);
  const lastBarbeariaIdRef = useRef(null);
  const lastUserRoleRef = useRef(null);
  const cacheTimeout = 30000; // 30 segundos de cache

  // Carregar estatísticas para admin/gerente
  const loadAdminStats = async (forceRefresh = false, barbeariasFromContext = null) => {
    const now = Date.now();
    
    // Verificar se já carregou recentemente e não é um refresh forçado
    if (!forceRefresh && 
        lastLoadTimeRef.current > 0 && 
        (now - lastLoadTimeRef.current) < cacheTimeout &&
        lastUserRoleRef.current === userRole) {
      console.log('📊 useDashboardStats - Usando cache para admin stats');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      console.log('🔄 useDashboardStats - Carregando estatísticas admin...');
      
      // Usar barbearias do contexto se disponível, senão carregar
      let barbearias = barbeariasFromContext;
      
      if (!barbearias) {
        console.log('🔄 useDashboardStats - Carregando barbearias da API...');
        const barbeariasData = await barbeariasService.listarBarbearias();
        barbearias = (barbeariasData?.data && Array.isArray(barbeariasData.data)) 
          ? barbeariasData.data 
          : [];
      } else {
        console.log('📊 useDashboardStats - Usando barbearias do contexto:', barbearias.length);
      }
      
      if (!barbearias || barbearias.length === 0) {
        setStats({
          totalClientes: 0,
          clientesAtendendo: 0,
          clientesAguardando: 0,
          totalBarbearias: 0,
          tempoMedio: 15
        });
        lastLoadTimeRef.current = now;
        lastUserRoleRef.current = userRole;
        return;
      }
      
      // Carregar filas de todas as barbearias
      const filasPromises = barbearias.map(barbearia => 
        filaService.obterFilaCompleta(barbearia.id)
          .then(response => response)
          .catch(error => {
            console.log(`Fila não encontrada para barbearia ${barbearia.id}:`, error.message);
            return { fila: [] };
          })
      );
      
      const filasData = await Promise.all(filasPromises);
      
      // Calcular estatísticas totais
      let totalClientes = 0;
      let clientesAtendendo = 0;
      let clientesAguardando = 0;
      
      filasData.forEach(filaData => {
        const fila = filaData.fila || [];
        totalClientes += fila.length;
        clientesAtendendo += fila.filter(c => c.status === 'atendendo').length;
        clientesAguardando += fila.filter(c => c.status === 'aguardando').length;
      });
      
      const newStats = {
        totalClientes,
        clientesAtendendo,
        clientesAguardando,
        totalBarbearias: barbearias.length,
        tempoMedio: 15
      };
      
      setStats(newStats);
      lastLoadTimeRef.current = now;
      lastUserRoleRef.current = userRole;
      
      console.log('✅ useDashboardStats - Estatísticas admin carregadas:', newStats);
      
    } catch (error) {
      console.error('❌ useDashboardStats - Erro ao carregar estatísticas admin:', error);
      setError('Erro ao carregar estatísticas');
    } finally {
      setLoading(false);
    }
  };

  // Carregar estatísticas para barbeiro
  const loadBarbeiroStats = async (forceRefresh = false) => {
    if (!barbeariaAtual?.id) return;
    
    const now = Date.now();
    
    // Verificar se já carregou recentemente para a mesma barbearia
    if (!forceRefresh && 
        lastLoadTimeRef.current > 0 && 
        (now - lastLoadTimeRef.current) < cacheTimeout &&
        lastBarbeariaIdRef.current === barbeariaAtual.id &&
        lastUserRoleRef.current === userRole) {
      console.log('📊 useDashboardStats - Usando cache para barbeiro stats');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      console.log('🔄 useDashboardStats - Carregando estatísticas barbeiro...');
      
      const filaData = await filaService.obterFilaCompleta(barbeariaAtual.id)
        .then(response => response)
        .catch(error => {
          console.log(`Fila não encontrada para barbearia ${barbeariaAtual.id}:`, error.message);
          return { fila: [] };
        });
      
      const filaBarbearia = filaData.fila || [];
      const hoje = new Date().toDateString();
      
      // Contar apenas clientes finalizados hoje
      const clientesFinalizados = filaBarbearia.filter(c => 
        c.status === 'finalizado' && 
        c.data_finalizacao && 
        new Date(c.data_finalizacao).toDateString() === hoje
      );
      
      const newStats = {
        totalAtendidos: clientesFinalizados.length,
        aguardando: filaBarbearia.filter(c => c.status === 'aguardando').length,
        atendendo: filaBarbearia.filter(c => c.status === 'atendendo').length,
        tempoMedio: 15,
        totalClientes: filaBarbearia.length
      };
      
      setStats(newStats);
      lastLoadTimeRef.current = now;
      lastBarbeariaIdRef.current = barbeariaAtual.id;
      lastUserRoleRef.current = userRole;
      
      console.log('✅ useDashboardStats - Estatísticas barbeiro carregadas:', newStats);
      
    } catch (error) {
      console.error('❌ useDashboardStats - Erro ao carregar estatísticas do barbeiro:', error);
      setError('Erro ao carregar estatísticas');
    } finally {
      setLoading(false);
    }
  };

  // Carregar estatísticas baseado no role
  useEffect(() => {
    if (userRole === 'admin' || userRole === 'gerente') {
      loadAdminStats();
    } else if (userRole === 'barbeiro' && barbeariaAtual) {
      loadBarbeiroStats();
    }
  }, [userRole, barbeariaAtual?.id]);

  // Função para carregar stats com barbearias do contexto
  const loadAdminStatsWithContext = (barbeariasFromContext) => {
    if (userRole === 'admin' || userRole === 'gerente') {
      loadAdminStats(false, barbeariasFromContext);
    }
  };

  // Atualizar estatísticas (força refresh)
  const refreshStats = () => {
    if (userRole === 'admin' || userRole === 'gerente') {
      loadAdminStats(true);
    } else if (userRole === 'barbeiro' && barbeariaAtual) {
      loadBarbeiroStats(true);
    }
  };

  return {
    stats,
    loading,
    error,
    refreshStats,
    loadAdminStatsWithContext
  };
}; 