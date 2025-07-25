import { useState, useEffect } from 'react';
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
  Phone
} from 'lucide-react';
import { filaService, historicoService } from '@/services/api.js';

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
  const [filaData, setFilaData] = useState({});
  const [loading, setLoading] = useState(false);
  const [tipoFilaAtual, setTipoFilaAtual] = useState('geral');
  const [historicoData, setHistoricoData] = useState([]);
  const [loadingHistorico, setLoadingHistorico] = useState(false);
  const [abaAtiva, setAbaAtiva] = useState('geral');
  const [autoRefresh, setAutoRefresh] = useState(true);

  // Função para formatar hora a partir de data_fim
  const formatarHora = (dataFim) => {
    if (!dataFim) return null;
    try {
      const data = new Date(dataFim);
      return data.toLocaleTimeString('pt-BR', { 
        hour: '2-digit', 
        minute: '2-digit' 
      });
    } catch (error) {
      console.error('Erro ao formatar hora:', error);
      return null;
    }
  };

  // Função para formatar data a partir de data_fim
  const formatarData = (dataFim) => {
    if (!dataFim) return null;
    try {
      const data = new Date(dataFim);
      return data.toLocaleDateString('pt-BR', { 
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });
    } catch (error) {
      console.error('Erro ao formatar data:', error);
      return null;
    }
  };

  // Carregar dados da fila do backend
  const loadFilaData = async (tipoFila = 'geral') => {
    if (!barbeariaAtual?.id) return;
    
    try {
      setLoading(true);
      console.log('🔍 Carregando fila para barbearia:', barbeariaAtual.id, 'tipo:', tipoFila);
      
      let data;
      
      // Se for fila específica do barbeiro e temos o ID do barbeiro
      if (tipoFila === 'especifica' && barbeiroAtual?.id) {
        console.log('🔍 Carregando fila específica do barbeiro:', barbeiroAtual.id);
        data = await filaService.obterFilaBarbeiro(barbeariaAtual.id, barbeiroAtual.id);
      } else {
        console.log('🔍 Carregando fila geral da barbearia');
        data = await filaService.obterFila(barbeariaAtual.id);
      }
      
      console.log('📋 Resposta da API fila:', data);
      
      // Verificar se a resposta tem a estrutura esperada
      if (data && data.success) {
        console.log('✅ Resposta com sucesso, dados:', data.data);
        // Converter estrutura do backend para o formato esperado pelo frontend
        const filaFormatada = {
          fila: data.data.clientes || [],
          estatisticas: data.data.estatisticas || {}
        };
        console.log('🔄 Fila formatada:', filaFormatada);
        setFilaData(filaFormatada);
      } else if (data && data.fila) {
        console.log('✅ Resposta direta com fila:', data.fila);
        setFilaData(data);
      } else if (data && data.clientes) {
        console.log('✅ Resposta com clientes:', data.clientes);
        setFilaData({ fila: data.clientes, estatisticas: data.estatisticas || {} });
      } else {
        console.log('⚠️ Estrutura de resposta inesperada:', data);
        setFilaData({ fila: [] });
      }
    } catch (error) {
      console.error('❌ Erro ao carregar dados da fila:', error);
      // Se a fila não existe (404), criar uma fila vazia
      if (error.message && error.message.includes('404')) {
        console.log('Fila não encontrada, criando fila vazia para barbearia:', barbeariaAtual.id);
        setFilaData({ fila: [] });
      } else {
        setFilaData({ fila: [] });
      }
    } finally {
      setLoading(false);
    }
  };

  // Carregar histórico de atendimentos
  const loadHistoricoData = async () => {
    console.log('🚀 loadHistoricoData chamada');
    console.log('🔍 barbeiroAtual:', barbeiroAtual);
    
    if (!barbeiroAtual?.id) {
      console.log('❌ barbeiroAtual.id não encontrado');
      return;
    }
    
    try {
      setLoadingHistorico(true);
      console.log('🔍 Carregando histórico para barbeiro:', barbeiroAtual.id);
      
      // Buscar histórico do mês atual (do dia 1 até o último dia do mês)
      const hoje = new Date();
      const primeiroDia = new Date(hoje.getFullYear(), hoje.getMonth(), 1);
      const ultimoDia = new Date(hoje.getFullYear(), hoje.getMonth() + 1, 0);
      
      const dataInicio = primeiroDia.toISOString().split('T')[0];
      const dataFim = ultimoDia.toISOString().split('T')[0];
      
      console.log('📅 Período do histórico:', { dataInicio, dataFim });
      
      console.log('🌐 Chamando API:', `/historico?barbeiro_id=${barbeiroAtual.id}&data_inicio=${dataInicio}&data_fim=${dataFim}`);
      

      
      const response = await historicoService.obterHistoricoBarbeiro(barbeiroAtual.id, {
        data_inicio: dataInicio,
        data_fim: dataFim
      });
      
      console.log('📋 Resposta da API histórico:', response);
      
      if (response && response.data) {
        setHistoricoData(response.data);
      } else {
        setHistoricoData([]);
      }
    } catch (error) {
      console.error('❌ Erro ao carregar histórico:', error);
      setHistoricoData([]);
    } finally {
      setLoadingHistorico(false);
    }
  };

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

  // Carregar dados iniciais e atualizar periodicamente
  useEffect(() => {
    console.log('🔄 useEffect - Carregando fila:', { 
      barbeariaId: barbeariaAtual?.id, 
      tipoFila: tipoFilaAtual,
      barbeiroId: barbeiroAtual?.id,
      barbeiroNome: barbeiroAtual?.nome
    });
    loadFilaData(tipoFilaAtual);
    
    // Atualizar a cada 5 minutos apenas se autoRefresh estiver ativo
    const interval = autoRefresh ? setInterval(() => {
      console.log('🔄 Atualização automática da fila (5min)');
      loadFilaData(tipoFilaAtual);
    }, 300000) : null;
    
    return () => clearInterval(interval);
  }, [barbeariaAtual?.id, tipoFilaAtual]);

  // Detectar cliente próximo quando os dados da fila mudarem
  useEffect(() => {
    detectarClienteProximo();
  }, [filaData]);

  // Carregar histórico quando barbeiro mudar
  useEffect(() => {
    if (barbeiroAtual?.id) {
      loadHistoricoData();
    }
  }, [barbeiroAtual?.id]);

  // Recarregar histórico quando solicitado
  useEffect(() => {
    if (onHistoricoAtualizado) {
      loadHistoricoData();
    }
  }, [onHistoricoAtualizado]);

  // Carregar histórico quando a aba mudar para "historico"
  useEffect(() => {
    if (abaAtiva === 'historico' && barbeiroAtual?.id) {
      console.log('📋 Carregando histórico...');
      loadHistoricoData();
    }
  }, [abaAtiva, barbeiroAtual?.id]);

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
    
    return fila
      .filter(c => c.status === 'aguardando' || !c.status) // Incluir se não tem status ou é 'aguardando'
      .sort((a, b) => {
        const tempoA = a.dataEntrada ? new Date(a.dataEntrada).getTime() : a.created_at ? new Date(a.created_at).getTime() : a.id;
        const tempoB = b.dataEntrada ? new Date(b.dataEntrada).getTime() : b.created_at ? new Date(b.created_at).getTime() : b.id;
        return tempoA - tempoB;
      })
      .map((cliente, index) => {
        const tempoEntrada = cliente.dataEntrada ? new Date(cliente.dataEntrada).getTime() : 
                           cliente.created_at ? new Date(cliente.created_at).getTime() : 
                           Date.now();
        
        return {
          ...cliente,
          posicaoTempo: index + 1,
          tempoEspera: Math.floor((Date.now() - tempoEntrada) / 1000 / 60),
          status: cliente.status || 'aguardando',
          barbeiro: cliente.barbeiro || 'Fila Geral'
        };
      });
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
      {/* Controle de Auto-refresh */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button
            onClick={() => {
              console.log('🔄 Recarregamento manual da fila');
              loadFilaData(tipoFilaAtual);
            }}
            variant="outline"
            size="sm"
          >
            🔄 Recarregar
          </Button>
          <Button
            onClick={() => setAutoRefresh(!autoRefresh)}
            variant={autoRefresh ? "default" : "outline"}
            size="sm"
          >
            {autoRefresh ? "⏸️ Pausar Auto-refresh" : "▶️ Ativar Auto-refresh"}
          </Button>
        </div>
      </div>
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
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="tempo">Por Tempo</TabsTrigger>
          <TabsTrigger value="geral">Fila Geral</TabsTrigger>
          <TabsTrigger value="especifica">Minha Fila</TabsTrigger>
          <TabsTrigger value="historico">Histórico</TabsTrigger>
        </TabsList>
        
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
                    const podeAtender = cliente.barbeiro === 'Fila Geral' || cliente.barbeiro === 'Geral' || cliente.barbeiro === barbeiroAtual?.nome;
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
                            <p className="font-medium">{cliente.nome}</p>
                            <p className="text-sm text-gray-600">{cliente.telefone}</p>
                            <p className="text-xs text-gray-500">
                              {cliente.barbeiro === 'Fila Geral' || cliente.barbeiro === 'Geral' ? 'Fila Geral' : `Específico: ${cliente.barbeiro}`}
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