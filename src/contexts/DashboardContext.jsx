import { createContext, useContext, useReducer, useEffect, useRef } from 'react';
import { useAuth } from '@/contexts/AuthContext.jsx';
import { barbeariasService } from '@/services/api.js';

// Estados iniciais
const initialState = {
  // Dados gerais
  barbearias: [],
  barbeariaAtual: null,
  loading: true,
  error: null,
  
  // Dados específicos do barbeiro
  barbeiroAtual: null,
  atendendoAtual: null,
  
  // Estatísticas
  stats: {
    totalClientes: 0,
    clientesAtendendo: 0,
    clientesAguardando: 0,
    totalBarbearias: 0
  }
};

// Tipos de ações
const DASHBOARD_ACTIONS = {
  SET_LOADING: 'SET_LOADING',
  SET_ERROR: 'SET_ERROR',
  SET_BARBEARIAS: 'SET_BARBEARIAS',
  SET_BARBEARIA_ATUAL: 'SET_BARBEARIA_ATUAL',
  SET_BARBEIRO_ATUAL: 'SET_BARBEIRO_ATUAL',
  SET_ATENDENDO_ATUAL: 'SET_ATENDENDO_ATUAL',
  SET_STATS: 'SET_STATS',
  UPDATE_BARBEARIA: 'UPDATE_BARBEARIA'
};

// Reducer
const dashboardReducer = (state, action) => {
  switch (action.type) {
    case DASHBOARD_ACTIONS.SET_LOADING:
      return { ...state, loading: action.payload };
    
    case DASHBOARD_ACTIONS.SET_ERROR:
      return { ...state, error: action.payload, loading: false };
    
    case DASHBOARD_ACTIONS.SET_BARBEARIAS:
      return { ...state, barbearias: action.payload };
    
    case DASHBOARD_ACTIONS.SET_BARBEARIA_ATUAL:
      return { ...state, barbeariaAtual: action.payload };
    
    case DASHBOARD_ACTIONS.SET_BARBEIRO_ATUAL:
      return { ...state, barbeiroAtual: action.payload };
    
    case DASHBOARD_ACTIONS.SET_ATENDENDO_ATUAL:
      return { ...state, atendendoAtual: action.payload };
    
    case DASHBOARD_ACTIONS.SET_STATS:
      return { ...state, stats: action.payload };
    
    case DASHBOARD_ACTIONS.UPDATE_BARBEARIA:
      return {
        ...state,
        barbearias: state.barbearias.map(barbearia =>
          barbearia.id === action.payload.id ? action.payload : barbearia
        ),
        barbeariaAtual: state.barbeariaAtual?.id === action.payload.id 
          ? action.payload 
          : state.barbeariaAtual
      };
    
    default:
      return state;
  }
};

// Context
const DashboardContext = createContext();

// Provider
export const DashboardProvider = ({ children }) => {
  const [state, dispatch] = useReducer(dashboardReducer, initialState);
  const { user, loading: authLoading } = useAuth();
  
  // Refs para controlar carregamento
  const barbeariasLoadedRef = useRef(false);
  const barbeiroSetRef = useRef(false);

  // Carregar dados iniciais apenas uma vez quando o usuário estiver autenticado
  useEffect(() => {
    const loadInitialData = async () => {
      // Só carregar se o usuário estiver autenticado e não estiver carregando
      if (!user || authLoading || barbeariasLoadedRef.current) {
        return;
      }

      try {
        console.log('🔄 DashboardContext - Carregando dados iniciais...');
        dispatch({ type: DASHBOARD_ACTIONS.SET_LOADING, payload: true });
        
        // Carregar barbearias apenas se ainda não foram carregadas
        if (state.barbearias.length === 0) {
          console.log('🔄 DashboardContext - Carregando barbearias...');
          const barbeariasData = await barbeariasService.listarBarbearias();
          const barbeariasArray = (barbeariasData?.data && Array.isArray(barbeariasData.data)) 
            ? barbeariasData.data 
            : [];
          
          dispatch({ type: DASHBOARD_ACTIONS.SET_BARBEARIAS, payload: barbeariasArray });
          barbeariasLoadedRef.current = true;
          console.log('✅ DashboardContext - Barbearias carregadas:', barbeariasArray.length);
          
          // Notificar que as barbearias foram carregadas (para outros hooks)
          // Removido temporariamente para evitar referência circular
        }
        
        // Definir barbeiro atual apenas uma vez se for barbeiro
        if (user?.role === 'barbeiro' && !barbeiroSetRef.current) {
          const barbeiroData = {
            id: user.id,
            nome: user.nome,
            email: user.email,
            role: user.role
          };
          dispatch({ type: DASHBOARD_ACTIONS.SET_BARBEIRO_ATUAL, payload: barbeiroData });
          barbeiroSetRef.current = true;
          console.log('✅ DashboardContext - Barbeiro definido:', barbeiroData.nome);
        }
        
      } catch (error) {
        console.error('❌ DashboardContext - Erro ao carregar dados iniciais:', error);
        dispatch({ type: DASHBOARD_ACTIONS.SET_ERROR, payload: error.message });
      } finally {
        dispatch({ type: DASHBOARD_ACTIONS.SET_LOADING, payload: false });
      }
    };

    loadInitialData();
  }, [user, authLoading]); // Removido state.barbearias.length da dependência

  // Actions
  const actions = {
    setBarbeariaAtual: (barbearia) => {
      dispatch({ type: DASHBOARD_ACTIONS.SET_BARBEARIA_ATUAL, payload: barbearia });
      // Salvar no localStorage
      if (barbearia?.id) {
        localStorage.setItem('barbeariaSelecionada', barbearia.id.toString());
      }
    },
    
    setAtendendoAtual: (cliente) => {
      dispatch({ type: DASHBOARD_ACTIONS.SET_ATENDENDO_ATUAL, payload: cliente });
    },
    
    setStats: (stats) => {
      dispatch({ type: DASHBOARD_ACTIONS.SET_STATS, payload: stats });
    },
    
    updateBarbearia: (barbearia) => {
      dispatch({ type: DASHBOARD_ACTIONS.UPDATE_BARBEARIA, payload: barbearia });
    },
    
    setError: (error) => {
      dispatch({ type: DASHBOARD_ACTIONS.SET_ERROR, payload: error });
    },
    
    clearError: () => {
      dispatch({ type: DASHBOARD_ACTIONS.SET_ERROR, payload: null });
    },

        // Função para forçar recarregamento (útil para atualizações manuais)
    refreshData: async () => {
      barbeariasLoadedRef.current = false;
      barbeiroSetRef.current = false;
      dispatch({ type: DASHBOARD_ACTIONS.SET_LOADING, payload: true });
      
      try {
        const barbeariasData = await barbeariasService.listarBarbearias();
        const barbeariasArray = (barbeariasData?.data && Array.isArray(barbeariasData.data)) 
          ? barbeariasData.data 
          : [];
      
        dispatch({ type: DASHBOARD_ACTIONS.SET_BARBEARIAS, payload: barbeariasArray });
        barbeariasLoadedRef.current = true;
        
        if (user?.role === 'barbeiro') {
          const barbeiroData = {
            id: user.id,
            nome: user.nome,
            email: user.email,
            role: user.role
          };
          dispatch({ type: DASHBOARD_ACTIONS.SET_BARBEIRO_ATUAL, payload: barbeiroData });
          barbeiroSetRef.current = true;
        }
      } catch (error) {
        console.error('Erro ao recarregar dados:', error);
        dispatch({ type: DASHBOARD_ACTIONS.SET_ERROR, payload: error.message });
      } finally {
        dispatch({ type: DASHBOARD_ACTIONS.SET_LOADING, payload: false });
      }
    },

    // Callback para quando barbearias são carregadas
    onBarbeariasLoaded: null
  };

  const value = {
    ...state,
    ...actions
  };

  return (
    <DashboardContext.Provider value={value}>
      {children}
    </DashboardContext.Provider>
  );
};

// Hook customizado
export const useDashboard = () => {
  const context = useContext(DashboardContext);
  if (!context) {
    throw new Error('useDashboard deve ser usado dentro de um DashboardProvider');
  }
  return context;
}; 