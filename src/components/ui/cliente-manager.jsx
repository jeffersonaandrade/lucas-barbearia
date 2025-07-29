import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.jsx';
import { Button } from '@/components/ui/button.jsx';
import { Badge } from '@/components/ui/badge.jsx';
import { 
  UserPlus, 
  Users, 
  Clock, 
  CheckCircle, 
  X,
  AlertCircle,
  Plus
} from 'lucide-react';
import { filaService } from '@/services/api.js';

const ClienteManager = ({ 
  barbeariaAtual, 
  barbeiroAtual, 
  userRole, 
  onAdicionarCliente, 
  onRemoverCliente,
  onAdicionarClienteTeste,
  onCreateCenarioTeste
}) => {
  const [filaData, setFilaData] = useState({});
  const [loading, setLoading] = useState(false);

  // Carregar dados da fila do backend
  const loadFilaData = async () => {
    if (!barbeariaAtual?.id) return;
    
    try {
      setLoading(true);
      const filaData = await filaService.obterFilaPublica(barbeariaAtual.id);
      setFilaData(filaData);
    } catch (error) {
      console.error('Erro ao carregar dados da fila:', error);
      setFilaData({ fila: [] });
    } finally {
      setLoading(false);
    }
  };

  // Carregar dados iniciais
  useEffect(() => {
    loadFilaData();
  }, [barbeariaAtual?.id]);

  const getFilaBarbearia = () => {
    return filaData.fila || [];
  };

  const getClientesPorStatus = () => {
    const fila = getFilaBarbearia();
    return {
      aguardando: fila.filter(c => c.status === 'aguardando'),
      atendendo: fila.filter(c => c.status === 'atendendo'),
      finalizado: fila.filter(c => c.status === 'finalizado')
    };
  };

  if (!barbeariaAtual) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center h-32">
          <div className="text-center text-gray-500">
            <AlertCircle className="h-8 w-8 mx-auto mb-2" />
            <p>Selecione uma barbearia para gerenciar clientes</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const { aguardando, atendendo, finalizado } = getClientesPorStatus();

  return (
    <div className="space-y-6">
      {/* Ações de Cliente */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserPlus className="h-5 w-5" />
            Gerenciar Clientes
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Button 
              onClick={onAdicionarCliente}
              className="w-full bg-green-50 border-green-200 text-green-700 hover:bg-green-100"
            >
              <Plus className="h-4 w-4 mr-2" />
              Adicionar Cliente
            </Button>
            
            <Button 
              onClick={onAdicionarClienteTeste}
              variant="outline"
              className="w-full"
            >
              <UserPlus className="h-4 w-4 mr-2" />
              Adicionar Cliente Teste
            </Button>
          </div>
          
          {userRole === 'barbeiro' && (
            <Button 
              onClick={onCreateCenarioTeste}
              variant="outline"
              className="w-full bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100"
            >
              🧪 Criar Cenário de Teste
            </Button>
          )}
        </CardContent>
      </Card>

      {/* Resumo de Status */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Aguardando</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{aguardando.length}</div>
            <p className="text-xs text-muted-foreground">
              Clientes na fila
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Atendendo</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{atendendo.length}</div>
            <p className="text-xs text-muted-foreground">
              Em atendimento
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Finalizados</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{finalizado.length}</div>
            <p className="text-xs text-muted-foreground">
              Atendimentos concluídos
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Lista de Clientes */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Todos os Clientes - {barbeariaAtual.nome}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {getFilaBarbearia().length === 0 ? (
            <p className="text-gray-500 text-center py-8">Nenhum cliente na fila</p>
          ) : (
            <div className="space-y-3">
              {getFilaBarbearia().map((cliente, index) => (
                <div 
                  key={cliente.id} 
                  className={`flex items-center justify-between p-3 border rounded-lg ${
                    cliente.status === 'atendendo' ? 'bg-blue-50 border-blue-200' :
                    cliente.status === 'finalizado' ? 'bg-green-50 border-green-200' :
                    'bg-white'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                      cliente.status === 'atendendo' ? 'bg-blue-100 text-blue-600' :
                      cliente.status === 'finalizado' ? 'bg-green-100 text-green-600' :
                      'bg-gray-100 text-gray-600'
                    }`}>
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-medium">{cliente.nome}</p>
                      <p className="text-sm text-gray-600">{cliente.telefone}</p>
                      <p className="text-xs text-gray-500">
                        {cliente.barbeiro === 'Fila Geral' ? 'Fila Geral' : `Específico: ${cliente.barbeiro}`}
                      </p>
                      {cliente.status === 'finalizado' && cliente.horaFinalizado && (
                        <p className="text-xs text-green-600">
                          Finalizado às {cliente.horaFinalizado}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={
                      cliente.status === 'aguardando' ? 'default' :
                      cliente.status === 'atendendo' ? 'secondary' :
                      'outline'
                    }>
                      {cliente.status}
                    </Badge>
                    {cliente.status !== 'finalizado' && (
                      <Button
                        onClick={() => onRemoverCliente(cliente.id)}
                        variant="outline"
                        size="sm"
                        className="text-red-600 border-red-200 hover:bg-red-50"
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ClienteManager; 