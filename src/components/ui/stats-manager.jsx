import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.jsx';
import { Badge } from '@/components/ui/badge.jsx';
import { 
  Users, 
  Scissors, 
  Building2, 
  BarChart3,
  Clock,
  CheckCircle,
  TrendingUp,
  Activity
} from 'lucide-react';
import { filaService, barbeariasService } from '@/services/api.js';

const StatsManager = ({ 
  barbeariaAtual, 
  barbeiroAtual, 
  userRole, 
  stats 
}) => {
  const [statsBarbeiro, setStatsBarbeiro] = useState(null);
  const [statsAdmin, setStatsAdmin] = useState(null);
  const [loading, setLoading] = useState(false);

  // Carregar estatísticas do barbeiro do backend
  useEffect(() => {
    const carregarStatsBarbeiro = async () => {
      if (!barbeariaAtual || !barbeiroAtual) {
        console.log('Barbearia ou barbeiro não definidos, pulando carregamento de stats');
        return;
      }
      
      try {
        setLoading(true);
        const filaData = await filaService.obterFila(barbeariaAtual.id)
          .then(response => {
            console.log(`Fila carregada para barbeiro (barbearia ${barbeariaAtual.id}):`, response);
            return response;
          })
          .catch(error => {
            console.log(`Fila não encontrada para barbeiro (barbearia ${barbeariaAtual.id}):`, error.message);
            return { fila: [] };
          });
        const filaBarbearia = filaData.fila || [];
        const hoje = new Date().toDateString();
        
        // Contar apenas clientes finalizados por este barbeiro hoje
        const clientesFinalizados = filaBarbearia.filter(c => 
          c.status === 'finalizado' && 
          c.data_finalizacao && 
          new Date(c.data_finalizacao).toDateString() === hoje && 
          c.barbeiro === barbeiroAtual?.nome
        );
        
        setStatsBarbeiro({
          totalAtendidos: clientesFinalizados.length,
          aguardando: filaBarbearia.filter(c => c.status === 'aguardando').length,
          atendendo: filaBarbearia.filter(c => c.status === 'atendendo').length,
          tempoMedio: barbeiroAtual?.especialidade === 'Cortes modernos' ? 15 : 20
        });
      } catch (error) {
        console.error('Erro ao carregar estatísticas do barbeiro:', error);
        setStatsBarbeiro({
          totalAtendidos: 0,
          aguardando: 0,
          atendendo: 0,
          tempoMedio: 15
        });
      } finally {
        setLoading(false);
      }
    };

    carregarStatsBarbeiro();
  }, [barbeariaAtual, barbeiroAtual]);

  // Carregar estatísticas gerais para admin/gerente
  useEffect(() => {
    const carregarStatsAdmin = async () => {
      if (userRole !== 'admin' && userRole !== 'gerente') return;
      
      try {
        setLoading(true);
        
        // Carregar todas as barbearias
        const barbeariasData = await barbeariasService.listarBarbearias();
        console.log('Dados brutos do listarBarbearias:', barbeariasData);
        
        // Extrair o array de barbearias da resposta
        const barbearias = (barbeariasData && barbeariasData.data && Array.isArray(barbeariasData.data)) 
          ? barbeariasData.data 
          : [];
        
        console.log('Barbearias extraídas:', barbearias);
        
        // Se não há barbearias, definir estatísticas vazias
        if (!barbearias || barbearias.length === 0) {
          setStatsAdmin({
            totalClientes: 0,
            clientesAtendendo: 0,
            clientesAguardando: 0,
            totalBarbearias: 0
          });
          return;
        }
        
        // Carregar filas de todas as barbearias
        const filasPromises = barbearias.map(barbearia => 
          filaService.obterFila(barbearia.id)
            .then(response => {
              console.log(`Fila carregada para barbearia ${barbearia.id}:`, response);
              return response;
            })
            .catch(error => {
              console.log(`Fila não encontrada para barbearia ${barbearia.id} (normal para barbearias novas):`, error.message);
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
        
        setStatsAdmin({
          totalClientes,
          clientesAtendendo,
          clientesAguardando,
          totalBarbearias: barbearias.length
        });
        
      } catch (error) {
        console.error('Erro ao carregar estatísticas admin:', error);
        // Em caso de erro, mostrar estatísticas básicas baseadas apenas nas barbearias
        setStatsAdmin({
          totalClientes: 0,
          clientesAtendendo: 0,
          clientesAguardando: 0,
          totalBarbearias: barbearias.length
        });
      } finally {
        setLoading(false);
      }
    };

    carregarStatsAdmin();
  }, [userRole]);

  const getStatsBarbeiro = () => statsBarbeiro;

  // Stats para Admin/Gerente
  if (userRole === 'admin' || userRole === 'gerente') {
    // Se ainda não carregou os dados, mostrar loading
    if (!statsAdmin) {
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Carregando...</CardTitle>
                <div className="h-4 w-4 bg-gray-200 rounded animate-pulse" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">--</div>
                <p className="text-xs text-muted-foreground">
                  Aguardando dados
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Clientes</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{statsAdmin.totalClientes}</div>
            <p className="text-xs text-muted-foreground">
              Em todas as unidades
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Atendendo</CardTitle>
            <Scissors className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{statsAdmin.clientesAtendendo}</div>
            <p className="text-xs text-muted-foreground">
              Clientes sendo atendidos
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Aguardando</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{statsAdmin.clientesAguardando}</div>
            <p className="text-xs text-muted-foreground">
              Clientes na fila
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Barbearias</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{statsAdmin.totalBarbearias}</div>
            <p className="text-xs text-muted-foreground">
              Unidades ativas
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Stats para Barbeiro
  if (userRole === 'barbeiro') {
    const statsBarbeiro = getStatsBarbeiro();
    
    if (!statsBarbeiro) {
      return (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Carregando...</CardTitle>
                <div className="h-4 w-4 bg-gray-200 rounded animate-pulse" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">--</div>
                <p className="text-xs text-muted-foreground">
                  Aguardando dados
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Atendidos Hoje</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{statsBarbeiro.totalAtendidos}</div>
            <p className="text-xs text-muted-foreground">
              Clientes atendidos hoje
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Aguardando</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{statsBarbeiro.aguardando}</div>
            <p className="text-xs text-muted-foreground">
              Clientes na fila
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Atendendo</CardTitle>
            <Scissors className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{statsBarbeiro.atendendo}</div>
            <p className="text-xs text-muted-foreground">
              Em atendimento
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tempo Médio</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{statsBarbeiro.tempoMedio}min</div>
            <p className="text-xs text-muted-foreground">
              Por cliente
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Fallback para outros roles
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Estatísticas</CardTitle>
          <Activity className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">--</div>
          <p className="text-xs text-muted-foreground">
            Role não configurado
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default StatsManager; 