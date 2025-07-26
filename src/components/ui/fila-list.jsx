import { Users, Clock, UserCheck, AlertCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge.jsx';
import { Button } from '@/components/ui/button.jsx';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.jsx';

const FilaList = ({
  fila = [],
  title = "Clientes na Fila",
  filterStatus = null, // 'aguardando', 'atendendo', 'proximo', null para todos
  showBarbeiro = true,
  showPosition = true,
  showTime = true,
  showStatus = true,
  showActions = false,
  onRemoveCliente = null,
  onCallCliente = null,
  highlightCurrentUser = false,
  currentUserToken = null,
  emptyMessage = "Nenhum cliente encontrado",
  loading = false,
  className = "",
  variant = "default" // "default", "compact", "detailed"
}) => {
  
  // Filtrar clientes baseado no status
  const getFilteredFila = () => {
    if (!filterStatus) return fila;
    return fila.filter(cliente => cliente.status === filterStatus);
  };

  // Obter posição real na fila (considerando todos os clientes, não apenas os filtrados)
  const getRealPosition = (cliente) => {
    // Se não há filtro, usar a posição do cliente ou o índice + 1
    if (!filterStatus) {
      return cliente.posicao || fila.findIndex(c => c.id === cliente.id) + 1;
    }
    
    // Se há filtro, encontrar a posição real na fila completa
    const allClients = fila || [];
    const realIndex = allClients.findIndex(c => c.id === cliente.id);
    return realIndex >= 0 ? realIndex + 1 : cliente.posicao || 1;
  };

  // Formatar nome do barbeiro
  const formatBarbeiro = (cliente) => {
    if (typeof cliente.barbeiro === 'object' && cliente.barbeiro !== null) {
      return cliente.barbeiro.nome || 'Fila Geral';
    } else if (typeof cliente.barbeiro === 'string') {
      return cliente.barbeiro;
    } else if (cliente.barbeiro_nome) {
      return cliente.barbeiro_nome;
    } else {
      return 'Fila Geral';
    }
  };

  // Formatar tempo estimado
  const formatTempoEstimado = (cliente) => {
    const tempoEstimado = cliente.tempoEstimado || cliente.tempo_estimado;
    
    // Se não há tempo estimado, calcular baseado na posição
    if (!tempoEstimado || tempoEstimado === 0) {
      const posicao = getRealPosition(cliente);
      const tempoPorCliente = 15; // 15 minutos por cliente
      return posicao * tempoPorCliente;
    }
    
    return tempoEstimado;
  };

  // Obter cor do status
  const getStatusColor = (status) => {
    switch (status) {
      case 'atendendo': return 'bg-green-500';
      case 'próximo': return 'bg-yellow-500';
      case 'aguardando': return 'bg-gray-500';
      default: return 'bg-gray-500';
    }
  };

  // Obter texto do status
  const getStatusText = (status) => {
    switch (status) {
      case 'atendendo': return 'Atendendo';
      case 'próximo': return 'Próximo';
      case 'aguardando': return 'Aguardando';
      case 'waiting': return 'Aguardando';
      case 'attending': return 'Atendendo';
      case 'next': return 'Próximo';
      default: return 'Aguardando'; // Padrão mais seguro
    }
  };

  const filteredFila = getFilteredFila();



  if (loading) {
    return (
      <Card className={`bg-card border border-border shadow-lg ${className}`}>
        <CardHeader>
          <CardTitle className="text-foreground">{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin mr-3"></div>
            <span className="text-muted-foreground">Carregando...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (filteredFila.length === 0) {
    return (
      <Card className={`bg-card border border-border shadow-lg ${className}`}>
        <CardHeader>
          <CardTitle className="text-foreground">{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12">
            <Users className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-foreground mb-2">Nenhum Cliente</h3>
            <p className="text-muted-foreground">{emptyMessage}</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={`bg-card border border-border shadow-lg ${className}`}>
      <CardHeader>
        <CardTitle className="text-foreground flex items-center">
          <Users className="w-5 h-5 mr-2" />
          {title}
          {filterStatus && (
            <Badge variant="outline" className="ml-2">
              {filteredFila.length} {filterStatus}
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {filteredFila.map((cliente, index) => {
            const isCurrentUser = highlightCurrentUser && currentUserToken && cliente.token === currentUserToken;
            
            return (
              <div
                key={cliente.id}
                className={`flex items-center justify-between p-4 rounded-lg transition-colors ${
                  isCurrentUser 
                    ? 'bg-primary/10 border border-primary/20' 
                    : 'bg-secondary hover:bg-secondary/80'
                }`}
              >
                <div className="flex items-center space-x-4">
                  {showPosition && (
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-white ${
                      isCurrentUser ? 'bg-primary' : 'bg-gray-500'
                    }`}>
                      {getRealPosition(cliente)}
                    </div>
                  )}
                  
                  <div>
                    <div className="flex items-center space-x-2">
                      <p className={`font-semibold ${isCurrentUser ? 'text-primary' : 'text-foreground'}`}>
                        {cliente.nome}
                      </p>
                      {isCurrentUser && (
                        <Badge variant="outline" className="text-xs">
                          Você
                        </Badge>
                      )}
                    </div>
                    
                    {showBarbeiro && (
                      <p className="text-sm text-muted-foreground">
                        {formatBarbeiro(cliente)}
                      </p>
                    )}
                    
                    {showTime && (
                      <div className="flex items-center space-x-1 mt-1">
                        <Clock className="w-3 h-3 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground">
                          {formatTempoEstimado(cliente)} min estimado
                        </span>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  {showStatus && (
                    <Badge className={`${getStatusColor(cliente.status)} text-white`}>
                      {getStatusText(cliente.status)}
                    </Badge>
                  )}
                  
                  {showActions && (
                    <div className="flex items-center space-x-2">
                      {onCallCliente && cliente.status === 'aguardando' && (
                        <Button
                          onClick={() => onCallCliente(cliente)}
                          size="sm"
                          className="bg-green-600 hover:bg-green-700 text-white"
                        >
                          <UserCheck className="w-3 h-3 mr-1" />
                          Chamar
                        </Button>
                      )}
                      
                      {onRemoveCliente && (
                        <Button
                          onClick={() => onRemoveCliente(cliente.id)}
                          variant="outline"
                          size="sm"
                          className="text-red-600 border-red-200 hover:bg-red-50"
                        >
                          <AlertCircle className="w-3 h-3" />
                        </Button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export { FilaList }; 