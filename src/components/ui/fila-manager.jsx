import { useState, useEffect, useRef, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.jsx';
import { Button } from '@/components/ui/button.jsx';
import { Badge } from '@/components/ui/badge.jsx';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs.jsx';
import { 
  Users, 
  Clock, 
  CheckCircle, 
  Play, 
  X,
  UserPlus,
  AlertCircle,
  Phone,
  RefreshCw,
  UserCheck
} from 'lucide-react';
import { filaService, historicoService } from '@/services/api.js';
import { formatarHora, formatarData, ordenarFilaPorTempo, podeAtenderCliente, formatarNomeCliente, formatarTelefoneCliente, formatarServicoCliente } from '@/utils/formatters.js';

const FilaManager = ({ 
  barbeariaAtual, 
  barbeiroAtual, 
  userRole, 
  fila: filaFromProps,
  loading: loadingFromProps,
  onChamarProximo, 
  onFinalizarAtendimento, 
  onAdicionarCliente, 
  onRemoverCliente,
  onIniciarAtendimento,
  atendendoAtual,
  setAtendendoAtual,
  onHistoricoAtualizado
}) => {
  const [filaData, setFilaData] = useState({ fila: [], estatisticas: {} });
  const [loading, setLoading] = useState(false);
  
  // Usar dados da fila passados como props quando disponíveis
  const fila = filaFromProps || filaData.fila || [];
  const isLoading = loadingFromProps !== undefined ? loadingFromProps : loading;
  

  
  const [tipoFilaAtual, setTipoFilaAtual] = useState('geral');
  const [abaAtiva, setAbaAtiva] = useState('geral');
  const [historicoData, setHistoricoData] = useState([]);
  const [loadingHistorico, setLoadingHistorico] = useState(false);
  const [autoRefresh, setAutoRefresh] = useState(true);
  
  // Cache local para dados
  const [filaCache, setFilaCache] = useState(null);
  const [historicoCache, setHistoricoCache] = useState(null);
  const [lastFilaUpdate, setLastFilaUpdate] = useState(0);
  const [lastHistoricoUpdate, setLastHistoricoUpdate] = useState(0);
  
  // Configurações de cache
  const filaCacheTimeout = 60000; // 60 segundos (1 minuto) para fila
  const historicoCacheTimeout = 1800000; // 30 minutos para histórico
  
  // Controle de chamadas duplicadas
  const filaCallInProgress = useRef(false);
  const historicoCallInProgress = useRef(false);

  // Controle de carregamento inicial
  const initialLoadDone = useRef(false);
  const historicoInitialLoadDone = useRef(false);

  // Dados da fila vêm do hook useBarbeiroFila via props

  // Carregar dados do histórico
  const loadHistoricoData = useCallback(async (forceRefresh = false) => {
    const now = Date.now();
    
    // Se não há barbearia selecionada, não carregar histórico
    if (!barbeariaAtual?.id) {
      return;
    }

    // Se não há dados de histórico em cache, usar array vazio
    if (!historicoCache) {
      setHistoricoData([]);
      // NÃO retornar aqui, continuar para carregar dados da API
    }

    // ✅ Usar barbeiroAtual ou fallback para o ID do usuário logado
    let barbeiroId = null;
    
    if (barbeiroAtual?.id) {
      barbeiroId = barbeiroAtual.id;
    } else {
      // Fallback: tentar obter ID do usuário logado
      try {
        const { CookieManager } = await import('@/utils/cookieManager.js');
        const userData = CookieManager.getUserData();
        if (userData?.id) {
          barbeiroId = userData.id;
        }
      } catch (error) {
        // Silenciar erro
      }
    }

    if (!barbeiroId) {
      return;
    }

    // Evitar chamadas simultâneas
    if (historicoCallInProgress.current) {
      return;
    }

    // Evitar chamadas muito frequentes
    if (!forceRefresh && lastHistoricoUpdate > 0 && (now - lastHistoricoUpdate) < historicoCacheTimeout) {
      setHistoricoData(historicoCache);
      return;
    }

    // Verificar cache para evitar chamadas duplicadas
    if (!forceRefresh && 
        historicoCache && 
        historicoCache.length > 0 &&
        (now - lastHistoricoUpdate) < historicoCacheTimeout) {
      setHistoricoData(historicoCache);
      return;
    }

    // Verificar se o usuário está autenticado
    const { CookieManager } = await import('@/utils/cookieManager.js');
    const token = CookieManager.getAdminToken();
    if (!token) {
      return;
    }

    try {
      historicoCallInProgress.current = true;
      setLastHistoricoUpdate(now);
      setLoadingHistorico(true);
      
      // Buscar histórico do mês atual (do dia 1 até o último dia do mês)
      const hoje = new Date();
      const primeiroDia = new Date(hoje.getFullYear(), hoje.getMonth(), 1);
      const ultimoDia = new Date(hoje.getFullYear(), hoje.getMonth() + 1, 0);
      
      const dataInicio = primeiroDia.toISOString().split('T')[0];
      const dataFim = ultimoDia.toISOString().split('T')[0];
      
      const response = await historicoService.obterHistorico({
        data_inicio: dataInicio,
        data_fim: dataFim,
        barbeiro_id: barbeiroId
      });
      
      if (response && response.data) {
        const historicoArray = Array.isArray(response.data) ? response.data : [];
        setHistoricoData(historicoArray);
        setHistoricoCache(historicoArray);
      } else {
        setHistoricoData([]);
        setHistoricoCache([]);
      }
    } catch (error) {
      console.error('❌ Erro ao carregar histórico:', error);
      setHistoricoData([]);
      setHistoricoCache([]);
    } finally {
      setLoadingHistorico(false);
      historicoCallInProgress.current = false;
    }
  }, [barbeariaAtual?.id, barbeiroAtual?.id, userRole, historicoCache, lastHistoricoUpdate]);

  // Função para detectar clientes com status "próximo" ou "atendendo"
  const detectarClienteProximo = () => {
    const fila = getFilaBarbearia();
    const clienteProximo = fila.find(c => c.status === 'proximo');
    const clienteAtendendo = fila.find(c => c.status === 'atendendo');
    
    // Prioridade: cliente atendendo > cliente próximo
    if (clienteAtendendo && (!atendendoAtual || atendendoAtual.id !== clienteAtendendo.id)) {
      setAtendendoAtual(clienteAtendendo);
    } else if (clienteProximo && !clienteAtendendo && (!atendendoAtual || atendendoAtual.id !== clienteProximo.id)) {
      setAtendendoAtual(clienteProximo);
    } else if (!clienteProximo && !clienteAtendendo && atendendoAtual) {
      setAtendendoAtual(null);
    }
  };

  // Funções para atualização manual
  const handleRefreshFila = () => {
    loadHistoricoData(true);
  };

  const handleRefreshHistorico = () => {
    loadHistoricoData(true);
  };

  // Dados da fila vêm do hook useBarbeiroFila via props

  // Carregar histórico apenas quando barbeiro mudar (e usar cache se disponível)
  useEffect(() => {
    // EVITAR LOOP INFINITO - só carregar se realmente mudou
    if (barbeariaAtual?.id && !historicoCallInProgress.current) {
      loadHistoricoData();
    }
  }, [barbeariaAtual?.id]); // REMOVIDO loadHistoricoData da dependência

  // Carregar histórico quando barbeiro for definido
  useEffect(() => {
    // EVITAR LOOP INFINITO - só carregar se realmente mudou
    if (barbeiroAtual?.id && barbeariaAtual?.id && !historicoCallInProgress.current) {
      loadHistoricoData();
    }
  }, [barbeiroAtual?.id, barbeariaAtual?.id]); // REMOVIDO loadHistoricoData da dependência

  // Detectar cliente próximo quando os dados da fila mudarem
  useEffect(() => {
    if (fila && fila.length > 0) {
      detectarClienteProximo();
    }
  }, [fila]);

  // Recarregar histórico quando solicitado explicitamente
  useEffect(() => {
    if (onHistoricoAtualizado) {
      loadHistoricoData(true);
    }
  }, [onHistoricoAtualizado]);

  const getFilaBarbearia = () => {
    return fila;
  };

  const getFilaEspecifica = () => {
    // Para barbeiros, mostrar apenas clientes da sua fila
    if (userRole === 'barbeiro' && barbeiroAtual?.id) {
      return fila.filter(cliente => 
        cliente.barbeiro_id === barbeiroAtual.id || 
        cliente.barbeiro === 'Fila Geral' ||
        !cliente.barbeiro_id // Clientes sem barbeiro específico
      );
    }
    
    // Para outros roles, mostrar toda a fila
    return fila;
  };

  const getFilaGeral = () => {
    return fila;
  };

  const getFilaOrdenadaPorTempo = () => {
    return ordenarFilaPorTempo(fila);
  };

  const getHistoricoAtendimentos = () => {
    return historicoData;
  };

  if (!barbeariaAtual) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center h-32">
          <div className="text-center text-gray-500">
            <AlertCircle className="h-8 w-8 mx-auto mb-2" />
            <p>Selecione uma barbearia para gerenciar a fila</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Logs para debug
  return (
    <div className="space-y-6">
      {/* Cliente Atual */}
      {atendendoAtual && 
       (atendendoAtual.status === 'atendendo' || atendendoAtual.status === 'em_atendimento') && 
       atendendoAtual.status !== 'finalizado' && 
       atendendoAtual.status !== 'concluido' && (
        <Card className="border-green-200 bg-green-50">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <div>
                  <p className="font-medium text-green-800">
                    Atendendo agora: {atendendoAtual.nome}
                  </p>
                  <p className="text-sm text-green-600">{atendendoAtual.telefone}</p>
                </div>
              </div>
              <Button 
                onClick={onFinalizarAtendimento}
                className="bg-black text-white hover:bg-gray-800 border-black"
                size="sm"
              >
                <CheckCircle className="h-4 w-4 mr-2" />
                Finalizar
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Cliente Chamado (Próximo) */}
      {atendendoAtual && 
       (atendendoAtual.status === 'proximo' || atendendoAtual.status === 'próximo') && 
       atendendoAtual.status !== 'finalizado' && 
       atendendoAtual.status !== 'concluido' && (
        <Card className="border-blue-200 bg-blue-50">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-blue-600" />
                <div>
                  <p className="font-medium text-blue-800">
                    Próximo cliente: {atendendoAtual.nome}
                  </p>
                  <p className="text-sm text-blue-600">{atendendoAtual.telefone}</p>
                  <p className="text-xs text-blue-500">Aguardando cliente aparecer no balcão</p>
                </div>
              </div>
              <div className="flex flex-col items-end gap-2">
                <Button 
                  onClick={() => onIniciarAtendimento(atendendoAtual.id)}
                  className="bg-green-600 text-white hover:bg-green-700 border-green-600"
                  size="sm"
                >
                  <UserCheck className="h-4 w-4 mr-2" />
                  Iniciar Atendimento
                </Button>
                <p className="text-xs text-blue-600 text-right">
                  Clique para iniciar o atendimento
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}



      {/* Tabs com Filas */}
      <Tabs defaultValue="geral" className="w-full" onValueChange={(value) => {
        setAbaAtiva(value);
        
        if (value === 'especifica') {
          setTipoFilaAtual('especifica');
        } else {
          setTipoFilaAtual('geral');
        }
      }}>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 gap-4">
          <TabsList className="grid w-full sm:w-auto grid-cols-4">
            <TabsTrigger value="tempo">Por Tempo</TabsTrigger>
            <TabsTrigger value="geral">Fila Geral</TabsTrigger>
            <TabsTrigger value="especifica">Minha Fila</TabsTrigger>
            <TabsTrigger value="historico">Histórico</TabsTrigger>
          </TabsList>
          
          <div className="flex gap-2 w-full sm:w-auto">
            <Button
              onClick={handleRefreshFila}
              size="sm"
              disabled={isLoading}
              className="flex items-center gap-1 flex-1 sm:flex-none bg-black text-white hover:bg-gray-800 border-black"
            >
                              <RefreshCw className={`h-3 w-3 ${isLoading ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">Atualizar Fila</span>
              <span className="sm:hidden">Fila</span>
            </Button>
            
            <Button
              onClick={handleRefreshHistorico}
              size="sm"
              disabled={loadingHistorico}
              className="flex items-center gap-1 flex-1 sm:flex-none bg-black text-white hover:bg-gray-800 border-black"
            >
              <RefreshCw className={`h-3 w-3 ${loadingHistorico ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">Atualizar Histórico</span>
              <span className="sm:hidden">Histórico</span>
            </Button>
          </div>
        </div>
        
        <TabsContent value="tempo" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Fila Ordenada por Tempo de Chegada
              </CardTitle>
              <p className="text-sm text-gray-600">
                <strong>Fila Universal Baseada em Tempo:</strong> Clientes ordenados por quem chegou primeiro. 
                Você só pode atender clientes específicos seus ou da fila geral, mas sempre respeitando a ordem de chegada.
              </p>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-2"></div>
                  <p className="text-gray-500">Carregando dados da fila...</p>
                </div>
              ) : getFilaOrdenadaPorTempo().length === 0 ? (
                <p className="text-gray-500 text-center py-8">Nenhum cliente aguardando</p>
              ) : (
                <div className="space-y-3">
                  {getFilaOrdenadaPorTempo().map((cliente) => {
                    const podeAtender = podeAtenderCliente(cliente, barbeiroAtual?.nome);
                    return (
                      <div 
                        key={cliente.id} 
                        className={`flex items-center justify-between p-3 border rounded-lg ${
                          podeAtender ? 'bg-white' : 'bg-gray-50'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                            podeAtender ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'
                          }`}>
                            {cliente.posicaoTempo}
                          </div>
                          <div>
                            <p className="font-medium">{formatarNomeCliente(cliente)}</p>
                            <p className="text-sm text-gray-600">{formatarTelefoneCliente(cliente)}</p>
                            <p className="text-xs text-gray-500">
                              {(() => {
                                if (typeof cliente.barbeiro === 'object' && cliente.barbeiro !== null) {
                                  return cliente.barbeiro.nome || 'Fila Geral';
                                } else if (typeof cliente.barbeiro === 'string') {
                                  return cliente.barbeiro === 'Fila Geral' || cliente.barbeiro === 'Geral' ? 'Fila Geral' : `Específico: ${cliente.barbeiro}`;
                                } else {
                                  return 'Fila Geral';
                                }
                              })()}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium text-orange-600">
                            {cliente.tempoEspera} min
                          </p>
                          <Badge variant={podeAtender ? 'default' : 'secondary'} className="mt-1">
                            {podeAtender ? 'Disponível' : 'Não disponível'}
                          </Badge>
                          <div className="flex flex-col gap-1 mt-2">
                            {cliente.status === 'próximo' && podeAtender && (
                              <Button
                                onClick={() => onIniciarAtendimento(cliente.id)}
                                size="sm"
                                className="bg-green-600 text-white hover:bg-green-700 border-green-600"
                              >
                                <Play className="h-3 w-3 mr-1" />
                                Atender
                              </Button>
                            )}
                            <Button
                              onClick={() => onRemoverCliente(cliente.id)}
                              size="sm"
                              className="bg-red-600 text-white hover:bg-red-700 border-red-600"
                            >
                              <X className="h-3 w-3 mr-1" />
                              Remover
                            </Button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
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
                      <div className="flex items-center gap-2">
                        <Badge variant={cliente.status === 'aguardando' ? 'default' : 'secondary'}>
                          {cliente.status}
                        </Badge>
                        <Button
                          onClick={() => onRemoverCliente(cliente.id)}
                          size="sm"
                          className="bg-red-600 text-white hover:bg-red-700 border-red-600"
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
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
                      <div className="flex items-center gap-2">
                        <Badge variant={cliente.status === 'aguardando' ? 'default' : 'secondary'}>
                          {cliente.status}
                        </Badge>
                        {cliente.status === 'próximo' && (
                          <Button
                            onClick={() => onIniciarAtendimento(cliente.id)}
                            size="sm"
                            className="bg-green-600 text-white hover:bg-green-700 border-green-600"
                          >
                            <Play className="h-3 w-3 mr-1" />
                            Atender
                          </Button>
                        )}
                        <Button
                          onClick={() => onRemoverCliente(cliente.id)}
                          size="sm"
                          className="bg-red-600 text-white hover:bg-red-700 border-red-600"
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="historico" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5" />
                Histórico de Atendimentos - Este Mês
              </CardTitle>
              <p className="text-sm text-gray-600">
                Clientes que você finalizou o atendimento neste mês.
              </p>
            </CardHeader>
            <CardContent>
              {loadingHistorico ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-2"></div>
                  <p className="text-gray-500">Carregando histórico...</p>
                </div>
              ) : getHistoricoAtendimentos().length === 0 ? (
                <p className="text-gray-500 text-center py-8">Nenhum atendimento finalizado neste mês</p>
              ) : (
                <div className="space-y-3">
                  {getHistoricoAtendimentos().map((cliente, index) => (
                    <div 
                      key={cliente.id} 
                      className="p-4 border rounded-lg bg-green-50 border-green-200 hover:bg-green-100 transition-colors"
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center text-sm font-medium text-green-600 flex-shrink-0">
                          {index + 1}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <p className="font-medium text-gray-900">
                              {cliente.nome || cliente.nome_cliente || 'Cliente'}
                            </p>
                            <Badge variant="outline" className="text-xs">
                              {cliente.servico || 'Serviço'}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-4 text-sm text-gray-600">
                            <span>📞 {cliente.telefone || cliente.telefone_cliente || 'Não informado'}</span>
                            <span>⏱️ {cliente.duracao || 0} min</span>
                            <span>🕐 {formatarHora(cliente.data_fim) || 'Não informado'}</span>
                          </div>
                          <p className="text-xs text-gray-500 mt-1">
                            {formatarData(cliente.data_fim)}
                          </p>
                        </div>
                        <Badge variant="default" className="bg-green-600 flex-shrink-0">
                          Finalizado
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default FilaManager; 