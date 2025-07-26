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
  RefreshCw
} from 'lucide-react';
import { filaService, historicoService } from '@/services/api.js';
import { formatarHora, formatarData, ordenarFilaPorTempo, podeAtenderCliente, formatarNomeCliente, formatarTelefoneCliente, formatarServicoCliente } from '@/utils/formatters.js';

const FilaManager = ({ 
  barbeariaAtual, 
  barbeiroAtual, 
  userRole, 
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
  const filaCacheTimeout = 30000; // 30 segundos para fila
  const historicoCacheTimeout = 300000; // 5 minutos para histórico
  
  // Controle de chamadas duplicadas
  const filaCallInProgress = useRef(false);
  const historicoCallInProgress = useRef(false);

  // Controle de carregamento inicial
  const initialLoadDone = useRef(false);
  const historicoInitialLoadDone = useRef(false);

  // Carregar dados da fila do backend
  const loadFilaData = useCallback(async (tipoFila = 'geral') => {
    // Evitar chamadas simultâneas
    if (filaCallInProgress.current) {
      console.log('🔄 Chamada de fila já em andamento, aguardando...');
      return;
    }

    const now = Date.now();
    
    // Evitar chamadas muito frequentes
    if (lastFilaUpdate > 0 && (now - lastFilaUpdate) < filaCacheTimeout) {
      console.log('📊 Usando cache da fila (última atualização há', Math.round((now - lastFilaUpdate) / 1000), 'segundos)');
      setFilaData(filaCache);
      return;
    }

    if (!barbeariaAtual?.id) {
      console.log('❌ Nenhuma barbearia selecionada');
      return;
    }

    try {
      filaCallInProgress.current = true;
      setLastFilaUpdate(now);
      
      setLoading(true);
      console.log('🔄 Carregando dados da fila:', { 
        barbeariaId: barbeariaAtual.id, 
        tipoFila,
        barbeiroId: barbeiroAtual?.id 
      });

      const response = await filaService.obterFila(barbeariaAtual.id);
      
      if (response && response.data) {
        setFilaData(response.data);
        setFilaCache(response.data); // Salvar no cache
        console.log('✅ Dados da fila carregados:', response.data);
      } else {
        setFilaData({ fila: [], estatisticas: {} });
        setFilaCache({ fila: [], estatisticas: {} });
        console.log('⚠️ Resposta vazia da API');
      }
    } catch (error) {
      console.error('❌ Erro ao carregar dados da fila:', error);
      setFilaData({ fila: [], estatisticas: {} });
      setFilaCache({ fila: [], estatisticas: {} });
    } finally {
      setLoading(false);
      filaCallInProgress.current = false;
    }
  }, []); // Sem dependências para evitar recriações

  // Carregar dados do histórico
  const loadHistoricoData = useCallback(async (forceRefresh = false) => {
    // Evitar chamadas simultâneas
    if (historicoCallInProgress.current) {
      console.log('🔄 Chamada de histórico já em andamento, aguardando...');
      return;
    }

    const now = Date.now();
    
    // Evitar chamadas muito frequentes
    if (!forceRefresh && lastHistoricoUpdate > 0 && (now - lastHistoricoUpdate) < historicoCacheTimeout) {
      console.log('📊 Usando cache do histórico (última atualização há', Math.round((now - lastHistoricoUpdate) / 1000), 'segundos)');
      setHistoricoData(historicoCache);
      return;
    }

    if (!barbeiroAtual?.id) {
      console.log('❌ Nenhum barbeiro selecionado para histórico');
      return;
    }

    // Verificar cache para evitar chamadas duplicadas
    if (!forceRefresh && 
        historicoCache && 
        (now - lastHistoricoUpdate) < historicoCacheTimeout) {
      console.log('📊 Usando cache do histórico (última chamada há', Math.round((now - lastHistoricoUpdate) / 1000), 'segundos)');
      setHistoricoData(historicoCache);
      return;
    }

    // Verificar se o usuário está autenticado
    const token = sessionStorage.getItem('adminToken') || localStorage.getItem('adminToken');
    if (!token) {
      console.log('❌ Usuário não autenticado');
      return;
    }

    try {
      historicoCallInProgress.current = true;
      setLastHistoricoUpdate(now);
      setLoadingHistorico(true);
      console.log('🔍 Carregando histórico para barbeiro:', barbeiroAtual.id);
      
      // Buscar histórico do mês atual (do dia 1 até o último dia do mês)
      const hoje = new Date();
      const primeiroDia = new Date(hoje.getFullYear(), hoje.getMonth(), 1);
      const ultimoDia = new Date(hoje.getFullYear(), hoje.getMonth() + 1, 0);
      
      const dataInicio = primeiroDia.toISOString().split('T')[0];
      const dataFim = ultimoDia.toISOString().split('T')[0];
      
      console.log('📅 Período do histórico:', { dataInicio, dataFim });
      
      const response = await historicoService.obterHistorico({
        data_inicio: dataInicio,
        data_fim: dataFim,
        barbeiro_id: barbeiroAtual.id
      });
      
      console.log('📊 Resposta do histórico:', response);
      
      if (response && response.data) {
        setHistoricoData(response.data);
        setHistoricoCache(response.data); // Salvar no cache
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
  }, []); // Sem dependências para evitar recriações

  // Função para detectar clientes com status "próximo" ou "atendendo"
  const detectarClienteProximo = () => {
    const fila = getFilaBarbearia();
    const clienteProximo = fila.find(c => c.status === 'proximo');
    const clienteAtendendo = fila.find(c => c.status === 'atendendo');
    
    // Prioridade: cliente atendendo > cliente próximo
    if (clienteAtendendo && (!atendendoAtual || atendendoAtual.id !== clienteAtendendo.id)) {
      console.log('🔍 Cliente atendendo detectado:', clienteAtendendo);
      setAtendendoAtual(clienteAtendendo);
    } else if (clienteProximo && !clienteAtendendo && (!atendendoAtual || atendendoAtual.id !== clienteProximo.id)) {
      console.log('🔍 Cliente próximo detectado:', clienteProximo);
      setAtendendoAtual(clienteProximo);
    } else if (!clienteProximo && !clienteAtendendo && atendendoAtual) {
      console.log('🔍 Nenhum cliente próximo/atendendo encontrado');
      setAtendendoAtual(null);
    }
  };

  // Funções para atualização manual
  const handleRefreshFila = () => {
    console.log('🔄 Atualização manual da fila solicitada');
    loadFilaData(tipoFilaAtual);
  };

  const handleRefreshHistorico = () => {
    console.log('🔄 Atualização manual do histórico solicitada');
    loadHistoricoData(true);
  };

  // Carregar dados iniciais apenas uma vez
  useEffect(() => {
    if (!barbeariaAtual?.id) return;
    
    console.log('🔄 Carregamento inicial da fila para barbearia:', barbeariaAtual.id);
    loadFilaData(tipoFilaAtual);
  }, [barbeariaAtual?.id]); // Apenas quando barbearia mudar

  // Carregar histórico apenas quando barbeiro mudar (e usar cache se disponível)
  useEffect(() => {
    if (!barbeiroAtual?.id) return;
    
    // Verificar se já temos cache válido
    const now = Date.now();
    if (historicoCache && (now - lastHistoricoUpdate) < historicoCacheTimeout) {
      console.log('📊 Usando cache do histórico para barbeiro:', barbeiroAtual.id);
      setHistoricoData(historicoCache);
      return;
    }
    
    console.log('🔄 Carregamento inicial do histórico para barbeiro:', barbeiroAtual.id);
    loadHistoricoData(true);
  }, [barbeiroAtual?.id]); // Apenas quando barbeiro mudar

  // Detectar cliente próximo quando os dados da fila mudarem
  useEffect(() => {
    if (filaData.fila && filaData.fila.length > 0) {
      detectarClienteProximo();
    }
  }, [filaData.fila]);

  // Recarregar histórico quando solicitado explicitamente
  useEffect(() => {
    if (onHistoricoAtualizado) {
      console.log('🔄 Recarregando histórico por solicitação explícita');
      loadHistoricoData(true);
    }
  }, [onHistoricoAtualizado]);

  const getFilaBarbearia = () => {
    return filaData.fila || [];
  };

  const getFilaEspecifica = () => {
    // Se estamos na aba "Minha Fila", usar os dados já carregados da API
    if (tipoFilaAtual === 'especifica') {
      return getFilaBarbearia();
    }
    
    // Caso contrário, filtrar localmente (fallback)
    return getFilaBarbearia().filter(c => {
      const barbeiroCliente = c.barbeiro || 'Fila Geral';
      return barbeiroCliente === barbeiroAtual?.nome;
    });
  };

  const getFilaGeral = () => {
    return getFilaBarbearia().filter(c => {
      const barbeiroCliente = c.barbeiro || 'Fila Geral';
      return barbeiroCliente === 'Fila Geral' || barbeiroCliente === 'Geral';
    });
  };

  const getFilaOrdenadaPorTempo = () => {
    const fila = getFilaBarbearia();
    return ordenarFilaPorTempo(fila);
  };

  const getHistoricoAtendimentos = () => {
    // Usar dados da API se disponíveis, senão usar dados locais como fallback
    if (historicoData && historicoData.length > 0) {
      return historicoData.sort((a, b) => {
        const dataA = a.data_fim || '';
        const dataB = b.data_fim || '';
        return dataB.localeCompare(dataA);
      });
    }
    
    // Fallback: buscar na fila local (para compatibilidade)
    const fila = getFilaBarbearia();
    const hoje = new Date().toISOString().split('T')[0];
    
    return fila
      .filter(c => 
        c.status === 'finalizado' && 
        c.dataFinalizado === hoje && 
        c.barbeiro === barbeiroAtual?.nome
      )
      .sort((a, b) => {
        const horaA = a.horaFinalizado || '';
        const horaB = b.horaFinalizado || '';
        return horaB.localeCompare(horaA);
      });
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
  console.log('🔍 Estado do FilaManager:');
  console.log('- Loading:', loading);
  console.log('- Barbearia atual:', barbeariaAtual);
  console.log('- Fila data:', filaData);
  console.log('- Fila ordenada por tempo:', getFilaOrdenadaPorTempo());

  return (
    <div className="space-y-6">
      {/* Cliente Atual */}
      {atendendoAtual && atendendoAtual.status === 'atendendo' && (
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
                className="bg-green-600 hover:bg-green-700"
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
      {atendendoAtual && atendendoAtual.status === 'proximo' && (
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
            </div>
          </CardContent>
        </Card>
      )}



      {/* Tabs com Filas */}
      <Tabs defaultValue="geral" className="w-full" onValueChange={(value) => {
        setAbaAtiva(value);
        console.log('🔄 Aba alterada para:', value);
        
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
              variant="outline"
              size="sm"
              disabled={loading}
              className="flex items-center gap-1 flex-1 sm:flex-none"
            >
              <RefreshCw className={`h-3 w-3 ${loading ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">Atualizar Fila</span>
              <span className="sm:hidden">Fila</span>
            </Button>
            
            <Button
              onClick={handleRefreshHistorico}
              variant="outline"
              size="sm"
              disabled={loadingHistorico}
              className="flex items-center gap-1 flex-1 sm:flex-none"
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
              {loading ? (
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
                          <Button
                            onClick={() => onRemoverCliente(cliente.id)}
                            variant="outline"
                            size="sm"
                            className="mt-2 text-red-600 border-red-200 hover:bg-red-50"
                          >
                            <X className="h-3 w-3 mr-1" />
                            Remover
                          </Button>
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
                          variant="outline"
                          size="sm"
                          className="text-red-600 border-red-200 hover:bg-red-50"
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
                        <Button
                          onClick={() => onRemoverCliente(cliente.id)}
                          variant="outline"
                          size="sm"
                          className="text-red-600 border-red-200 hover:bg-red-50"
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
                            <span>📞 {cliente.telefone || cliente.telefone_cliente || 'N/A'}</span>
                            <span>⏱️ {cliente.duracao || 0} min</span>
                            <span>🕐 {formatarHora(cliente.data_fim) || 'N/A'}</span>
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