import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.jsx';
import { Button } from '@/components/ui/button.jsx';
import { Badge } from '@/components/ui/badge.jsx';
import { Alert, AlertDescription } from '@/components/ui/alert.jsx';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs.jsx';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select.jsx';
import { Switch } from '@/components/ui/switch.jsx';
import { useAuthBackend } from '@/hooks/useAuthBackend.js';
import AdminLayout from '@/components/ui/admin-layout.jsx';
import FilaManager from '@/components/ui/fila-manager.jsx';
import StatsManager from '@/components/ui/stats-manager.jsx';
import { filaService, barbeariasService } from '@/services/api.js';
import { 
  Scissors, 
  Users, 
  Clock, 
  CheckCircle, 
  UserCheck,
  UserX,
  Bell,
  BarChart3,
  Play,
  Square,
  Building2,
  MapPin,
  Power,
  PowerOff
} from 'lucide-react';

const BarbeiroDashboard = () => {
  const { user, logout } = useAuthBackend();
  const navigate = useNavigate();
  const [filaData, setFilaData] = useState({});
  const [barbearias, setBarbearias] = useState([]);
  const [barbeariaAtual, setBarbeariaAtual] = useState(null);
  const [barbeiroAtual, setBarbeiroAtual] = useState(null);
  const [loading, setLoading] = useState(true);
  const [atendendoAtual, setAtendendoAtual] = useState(null);
  const [barbeariaSelecionada, setBarbeariaSelecionada] = useState(null);
  const [historicoAtualizado, setHistoricoAtualizado] = useState(false);

  useEffect(() => {
    // Carregar dados da fila e informações do barbeiro do backend
    const loadData = async () => {
      try {
        setLoading(true);
        
        // Carregar barbearias do backend
        const barbeariasData = await barbeariasService.listarBarbearias();
        setBarbearias(barbeariasData || []);
        
        // Se não há barbearias, mostrar mensagem
        if (!barbeariasData || barbeariasData.length === 0) {
          console.log('Nenhuma barbearia encontrada no backend');
          setBarbearias([]);
        }
        
      } catch (error) {
        console.error('Erro ao carregar dados:', error);
        setBarbearias([]);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);
                  "status": "aguardando",
                  "posicao": 3,
                  "tempoEstimado": 15,
                  "token": "token_123456789_ghi789"
                }
              ]
            }
          };
          localStorage.setItem('filaData', JSON.stringify(filaTeste));
        }

        const filaLocal = JSON.parse(localStorage.getItem('filaData') || '{}');
        const barbeariasData = JSON.parse(localStorage.getItem('lucas_barbearia_barbearias_data') || '{}');
        
        setFilaData(filaLocal);
        setBarbearias(barbeariasData.barbearias || []);

        // Encontrar barbeiro atual (mock - em produção viria do login)
        const barbeiro = barbeariasData.barbearias?.find(b => b.id === 1)?.barbeiros?.find(b => b.id === 'joao') || 
                        barbeariasData.barbearias?.[0]?.barbeiros?.[0];
        
        setBarbeiroAtual(barbeiro);
        
        // Definir barbearia padrão (primeira)
        if (!barbeariaSelecionada && barbeariasData.barbearias?.length > 0) {
          setBarbeariaSelecionada(barbeariasData.barbearias[0]);
          setBarbeariaAtual(barbeariasData.barbearias[0]);
        }
        
        // Verificar se há algum cliente sendo atendido por este barbeiro
        const atendendo = Object.values(filaLocal).flatMap(barbearia => 
          barbearia.fila?.filter(cliente => 
            cliente.status === 'atendendo' && 
            cliente.barbeiro === barbeiroAtual?.nome
          ) || []
        );
        
        setAtendendoAtual(atendendo[0] || null);
        
      } catch (error) {
        console.error('Erro ao carregar dados:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
    const interval = setInterval(loadData, 5000); // Atualizar a cada 5 segundos

    return () => clearInterval(interval);
  }, [barbeariaSelecionada]);

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  const handleBarbeariaChange = async (barbeariaId) => {
    const barbearia = barbearias.find(b => b.id === parseInt(barbeariaId));
    setBarbeariaSelecionada(barbearia);
    setBarbeariaAtual(barbearia);
    
    // Carregar fila da barbearia selecionada
    if (barbearia) {
      try {
        const filaData = await filaService.obterFila(barbearia.id);
        setFilaData(filaData);
      } catch (error) {
        console.error('Erro ao carregar fila:', error);
        setFilaData({ fila: [] });
      }
    }
  };

  const toggleAtivo = (barbeariaId) => {
    try {
      const barbeariasData = JSON.parse(localStorage.getItem('barbeariasData') || '{}');
      const barbeariaIndex = barbeariasData.barbearias.findIndex(b => b.id === barbeariaId);
      
      if (barbeariaIndex !== -1) {
        const barbeiroIndex = barbeariasData.barbearias[barbeariaIndex].barbeiros.findIndex(b => b.id === barbeiroAtual?.id);
        
        if (barbeiroIndex !== -1) {
          barbeariasData.barbearias[barbeariaIndex].barbeiros[barbeiroIndex].ativo = 
            !barbeariasData.barbearias[barbeariaIndex].barbeiros[barbeiroIndex].ativo;
          
          localStorage.setItem('barbeariasData', JSON.stringify(barbeariasData));
          setBarbearias(barbeariasData.barbearias);
          
          const status = barbeariasData.barbearias[barbeariaIndex].barbeiros[barbeiroIndex].ativo ? 'ativado' : 'desativado';
          alert(`Status ${status} na ${barbeariasData.barbearias[barbeariaIndex].nome}`);
        }
      }
    } catch (error) {
      console.error('Erro ao alterar status:', error);
      alert('Erro ao alterar status');
    }
  };

  const chamarProximo = (tipoFila = 'geral') => {
    if (!barbeariaAtual) {
      alert('Selecione uma barbearia primeiro');
      return;
    }

    try {
      const fila = JSON.parse(localStorage.getItem('filaData') || '{}');
      const barbeariaId = barbeariaAtual?.id;
      
      if (!barbeariaId || !fila[barbeariaId]) {
        alert('Erro: Barbearia não encontrada');
        return;
      }

      const filaBarbearia = fila[barbeariaId].fila || [];
      
      // Filtrar clientes aguardando
      let clientesAguardando = filaBarbearia.filter(c => c.status === 'aguardando');
      
      if (tipoFila === 'especifica') {
        // Apenas clientes que escolheram este barbeiro
        clientesAguardando = clientesAguardando.filter(c => c.barbeiro === barbeiroAtual?.nome);
      }
      
      if (clientesAguardando.length === 0) {
        alert('Não há clientes aguardando na fila selecionada');
        return;
      }

      // Pegar o próximo cliente (primeiro da lista)
      const proximoCliente = clientesAguardando[0];
      
      // Atualizar status para 'atendendo'
      const filaAtualizada = filaBarbearia.map(cliente => 
        cliente.id === proximoCliente.id 
          ? { ...cliente, status: 'atendendo', barbeiro: barbeiroAtual?.nome }
          : cliente
      );

      // Salvar no localStorage
      const novaFila = {
        ...fila,
        [barbeariaId]: {
          ...fila[barbeariaId],
          fila: filaAtualizada
        }
      };

      localStorage.setItem('filaData', JSON.stringify(novaFila));
      setFilaData(novaFila);
      setAtendendoAtual(proximoCliente);
      
      // Notificar o cliente (em produção seria push notification)
      alert(`Cliente ${proximoCliente.nome} chamado!`);
      
    } catch (error) {
      console.error('Erro ao chamar próximo cliente:', error);
      alert('Erro ao chamar próximo cliente');
    }
  };

  const finalizarAtendimento = () => {
    if (!atendendoAtual) {
      alert('Não há cliente sendo atendido');
      return;
    }

    try {
      const fila = JSON.parse(localStorage.getItem('filaData') || '{}');
      const barbeariaId = barbeariaAtual?.id;
      
      // Remover cliente da fila
      const filaAtualizada = fila[barbeariaId].fila.filter(c => c.id !== atendendoAtual.id);
      
      const novaFila = {
        ...fila,
        [barbeariaId]: {
          ...fila[barbeariaId],
          fila: filaAtualizada
        }
      };

      localStorage.setItem('filaData', JSON.stringify(novaFila));
      setFilaData(novaFila);
      setAtendendoAtual(null);
      
      alert(`Atendimento de ${atendendoAtual.nome} finalizado!`);
      
    } catch (error) {
      console.error('Erro ao finalizar atendimento:', error);
      alert('Erro ao finalizar atendimento');
    }
  };

  const adicionarClienteTeste = () => {
    if (!barbeariaAtual) {
      alert('Selecione uma barbearia primeiro');
      return;
    }

    try {
      const nomes = ['Ana Silva', 'Bruno Costa', 'Carlos Lima', 'Diana Santos', 'Eduardo Ferreira'];
      const telefones = ['(11) 99999-4444', '(11) 99999-5555', '(11) 99999-6666', '(11) 99999-7777', '(11) 99999-8888'];
      const barbeiros = ['Geral', barbeiroAtual?.nome];
      
      const nomeAleatorio = nomes[Math.floor(Math.random() * nomes.length)];
      const telefoneAleatorio = telefones[Math.floor(Math.random() * telefones.length)];
      const barbeiroAleatorio = barbeiros[Math.floor(Math.random() * barbeiros.length)];
      
      // Gerar token único
      const token = 'token_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
      
      // Adicionar cliente usando o serviço padronizado
      const novoCliente = adicionarCliente({
        nome: nomeAleatorio,
        telefone: telefoneAleatorio,
        barbeiro: barbeiroAleatorio,
        token: token
      }, barbeariaAtual.id);
      
      alert(`Cliente ${nomeAleatorio} adicionado à fila!\nToken: ${token}`);
      
      // Recarregar dados
      setTimeout(() => {
        const loadData = () => {
          try {
            const fila = JSON.parse(localStorage.getItem('lucas_barbearia_fila_data') || '{}');
            setFilaData(fila);
          } catch (error) {
            console.error('Erro ao carregar dados da fila:', error);
          }
        };
        loadData();
      }, 500);
      
    } catch (error) {
      console.error('Erro ao adicionar cliente teste:', error);
      alert('Erro ao adicionar cliente teste: ' + error.message);
    }
  };

  const getFilaBarbearia = () => {
    return filaData.fila || [];
  };

  const getFilaEspecifica = () => {
    return getFilaBarbearia().filter(c => c.barbeiro === barbeiroAtual?.nome);
  };

  const getFilaGeral = () => {
    return getFilaBarbearia().filter(c => c.barbeiro === 'Fila Geral');
  };

  const getEstatisticas = () => {
    const fila = getFilaBarbearia();
    const hoje = new Date().toDateString();
    
    return {
      totalAtendidos: fila.filter(c => c.status === 'finalizado' && c.dataFinalizado === hoje).length,
      aguardando: fila.filter(c => c.status === 'aguardando').length,
      atendendo: fila.filter(c => c.status === 'atendendo').length,
      tempoMedio: barbeiroAtual?.especialidade === 'Cortes modernos' ? 15 : 20
    };
  };

  const isBarbeiroAtivo = (barbeariaId) => {
    const barbearia = barbearias.find(b => b.id === barbeariaId);
    return barbearia?.barbeiros?.find(b => b.id === barbeiroAtual?.id)?.ativo || false;
  };

  const getBarbeariasAtivas = () => {
    return barbearias.filter(barbearia => isBarbeiroAtivo(barbearia.id));
  };

  if (loading) {
    return (
      <AdminLayout onLogout={handleLogout}>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-4"></div>
            <p>Carregando...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  const stats = getEstatisticas();

  return (
    <AdminLayout onLogout={handleLogout}>
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Dashboard do Barbeiro
            </h2>
            <div className="flex items-center gap-4 text-gray-600">
              <p><strong>Barbeiro:</strong> {barbeiroAtual?.nome}</p>
              <p><strong>Especialidade:</strong> {barbeiroAtual?.especialidade}</p>
            </div>
          </div>
          
          {/* Status Global */}
          <div className="text-right">
            <div className="flex items-center gap-2 mb-2">
              <div className={`w-3 h-3 rounded-full ${barbeariaAtual && isBarbeiroAtivo(barbeariaAtual.id) ? 'bg-green-500' : 'bg-gray-400'}`}></div>
              <span className="text-sm font-medium">
                {barbeariaAtual && isBarbeiroAtivo(barbeariaAtual.id) ? 'Ativo' : 'Inativo'}
              </span>
            </div>
            {barbeariaAtual && (
              <p className="text-sm text-gray-600">{barbeariaAtual.nome}</p>
            )}
            <p className="text-xs text-gray-500">
              Ativo em {getBarbeariasAtivas().length} de {barbearias.length} barbearias
            </p>
          </div>
        </div>
      </div>

      {/* Seletor de Barbearia */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            Selecionar Barbearia
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-4 items-center">
            <Select value={barbeariaAtual?.id?.toString()} onValueChange={handleBarbeariaChange}>
              <SelectTrigger className="w-64">
                <SelectValue placeholder="Escolha uma barbearia" />
              </SelectTrigger>
              <SelectContent>
                {barbearias.map((barbearia) => (
                  <SelectItem key={barbearia.id} value={barbearia.id.toString()}>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      {barbearia.nome}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            {barbeariaAtual && (
              <div className="flex items-center gap-2">
                <Switch
                  checked={isBarbeiroAtivo(barbeariaAtual.id)}
                  onCheckedChange={() => toggleAtivo(barbeariaAtual.id)}
                />
                <span className="text-sm">
                  {isBarbeiroAtivo(barbeariaAtual.id) ? 'Ativo' : 'Inativo'}
                </span>
                <Badge variant={isBarbeiroAtivo(barbeariaAtual.id) ? 'default' : 'secondary'}>
                  {isBarbeiroAtivo(barbeariaAtual.id) ? 'Disponível' : 'Indisponível'}
                </Badge>
              </div>
            )}
          </div>
          
          {barbeariaAtual && (
            <div className="text-sm text-gray-600">
              <p><strong>Endereço:</strong> {barbeariaAtual.endereco}</p>
              <p><strong>Telefone:</strong> {barbeariaAtual.telefone}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Status de Ativação em Todas as Barbearias */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Power className="h-5 w-5" />
            Status em Todas as Barbearias
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {barbearias.map((barbearia) => (
              <div key={barbearia.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <p className="font-medium">{barbearia.nome}</p>
                  <p className="text-sm text-gray-600">{barbearia.endereco}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Switch
                    checked={isBarbeiroAtivo(barbearia.id)}
                    onCheckedChange={() => toggleAtivo(barbearia.id)}
                  />
                  <Badge variant={isBarbeiroAtivo(barbearia.id) ? 'default' : 'secondary'}>
                    {isBarbeiroAtivo(barbearia.id) ? 'Ativo' : 'Inativo'}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Cliente Atual */}
      {atendendoAtual && barbeariaAtual && (
        <Alert className="mb-6 border-green-200 bg-green-50">
          <UserCheck className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-800">
            <strong>Atendendo agora:</strong> {atendendoAtual.nome} - {atendendoAtual.telefone}
            <Button 
              onClick={finalizarAtendimento}
              className="ml-4 bg-green-600 hover:bg-green-700"
              size="sm"
            >
              <CheckCircle className="h-4 w-4 mr-2" />
              Finalizar Atendimento
            </Button>
          </AlertDescription>
        </Alert>
      )}

      {/* Stats Cards */}
      {barbeariaAtual && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Atendidos Hoje</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{stats.totalAtendidos}</div>
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
              <div className="text-2xl font-bold text-orange-600">{stats.aguardando}</div>
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
              <div className="text-2xl font-bold text-blue-600">{stats.atendendo}</div>
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
              <div className="text-2xl font-bold">{stats.tempoMedio}min</div>
              <p className="text-xs text-muted-foreground">
                Por cliente
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Ações Rápidas */}
      {barbeariaAtual && isBarbeiroAtivo(barbeariaAtual.id) && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Chamar Próximo Cliente
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Button 
                  onClick={() => chamarProximo('geral')}
                  className="flex-1"
                  disabled={atendendoAtual !== null}
                >
                  <Play className="h-4 w-4 mr-2" />
                  Fila Geral
                </Button>
                <Button 
                  onClick={() => chamarProximo('especifica')}
                  className="flex-1"
                  disabled={atendendoAtual !== null}
                  variant="outline"
                >
                  <UserCheck className="h-4 w-4 mr-2" />
                  Minha Fila
                </Button>
              </div>
              {atendendoAtual && (
                <p className="text-sm text-gray-600">
                  Finalize o atendimento atual antes de chamar o próximo
                </p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Status das Filas
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between items-center">
                <span>Fila Geral:</span>
                <Badge variant="secondary">{getFilaGeral().length} clientes</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span>Sua Fila:</span>
                <Badge variant="outline">{getFilaEspecifica().length} clientes</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span>Total:</span>
                <Badge>{getFilaBarbearia().length} clientes</Badge>
              </div>
              <div className="pt-2 border-t">
                <Button 
                  onClick={() => adicionarClienteTeste()}
                  variant="outline"
                  size="sm"
                  className="w-full"
                >
                  Adicionar Cliente Teste
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Tabs com Filas */}
      {barbeariaAtual && isBarbeiroAtivo(barbeariaAtual.id) && (
        <Tabs defaultValue="geral" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="geral">Fila Geral</TabsTrigger>
            <TabsTrigger value="especifica">Minha Fila</TabsTrigger>
          </TabsList>
          
          <TabsContent value="geral" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Fila Geral - Todos os Clientes</CardTitle>
              </CardHeader>
              <CardContent>
                {getFilaGeral().length === 0 ? (
                  <p className="text-gray-500 text-center py-8">Nenhum cliente na fila geral</p>
                ) : (
                  <div className="space-y-3">
                    {getFilaGeral().map((cliente, index) => (
                      <div 
                        key={cliente.id} 
                        className="flex items-center justify-between p-3 border rounded-lg"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-sm font-medium">
                            {index + 1}
                          </div>
                          <div>
                            <p className="font-medium">{cliente.nome}</p>
                            <p className="text-sm text-gray-600">{cliente.telefone}</p>
                          </div>
                        </div>
                        <Badge variant={cliente.status === 'aguardando' ? 'default' : 'secondary'}>
                          {cliente.status}
                        </Badge>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="especifica" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Minha Fila - Clientes que me Escolheram</CardTitle>
              </CardHeader>
              <CardContent>
                {getFilaEspecifica().length === 0 ? (
                  <p className="text-gray-500 text-center py-8">Nenhum cliente na sua fila específica</p>
                ) : (
                  <div className="space-y-3">
                    {getFilaEspecifica().map((cliente, index) => (
                      <div 
                        key={cliente.id} 
                        className="flex items-center justify-between p-3 border rounded-lg"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-sm font-medium text-blue-600">
                            {index + 1}
                          </div>
                          <div>
                            <p className="font-medium">{cliente.nome}</p>
                            <p className="text-sm text-gray-600">{cliente.telefone}</p>
                          </div>
                        </div>
                        <Badge variant={cliente.status === 'aguardando' ? 'default' : 'secondary'}>
                          {cliente.status}
                        </Badge>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      )}

      {/* Mensagem quando não está ativo */}
      {barbeariaAtual && !isBarbeiroAtivo(barbeariaAtual.id) && (
        <Alert className="border-yellow-200 bg-yellow-50">
          <PowerOff className="h-4 w-4 text-yellow-600" />
          <AlertDescription className="text-yellow-800">
            <strong>Você não está ativo nesta barbearia.</strong> Ative o switch acima para começar a receber clientes.
          </AlertDescription>
        </Alert>
      )}

      {/* Gerenciador de Fila com Histórico */}
      {barbeariaAtual && isBarbeiroAtivo(barbeariaAtual.id) && (
        <FilaManager
          barbeariaAtual={barbeariaAtual}
          barbeiroAtual={barbeiroAtual}
          userRole="barbeiro"
          onChamarProximo={() => chamarProximo('geral')}
          onFinalizarAtendimento={finalizarAtendimento}
          onAdicionarCliente={adicionarClienteTeste}
          onRemoverCliente={(clienteId) => {
            // Implementar remoção de cliente
            console.log('Remover cliente:', clienteId);
          }}
          onIniciarAtendimento={(clienteId) => {
            // Implementar início de atendimento
            console.log('Iniciar atendimento:', clienteId);
          }}
          atendendoAtual={atendendoAtual}
          setAtendendoAtual={setAtendendoAtual}
          onHistoricoAtualizado={() => setHistoricoAtualizado(true)}
        />
      )}

      {/* Gerenciador de Estatísticas */}
      {barbeariaAtual && (
        <StatsManager
          barbeariaAtual={barbeariaAtual}
          estatisticas={getEstatisticas()}
          historicoAtualizado={historicoAtualizado}
        />
      )}
    </AdminLayout>
  );
};

export default BarbeiroDashboard; 