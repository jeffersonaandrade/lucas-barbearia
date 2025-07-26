import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.jsx';
import { Button } from '@/components/ui/button.jsx';
import { Badge } from '@/components/ui/badge.jsx';
import { Alert, AlertDescription } from '@/components/ui/alert.jsx';
import { barbeariasService } from '@/services/api.js';
import { 
  MapPin, 
  Phone, 
  Clock, 
  Users, 
  Scissors,
  QrCode,
  ArrowRight,
  Star,
  ArrowLeft,
  Instagram,
  AlertCircle,
  CheckCircle,
  Calendar as CalendarIcon
} from 'lucide-react';

const BarbeariasList = () => {
  const navigate = useNavigate();
  const [barbearias, setBarbearias] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const carregarBarbearias = async () => {
      try {
        const response = await barbeariasService.listarBarbearias();
        setBarbearias(response.data);
      } catch (error) {
        console.error('Erro ao carregar barbearias:', error);
      } finally {
        setLoading(false);
      }
    };

    carregarBarbearias();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando barbearias...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Botão Voltar */}
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={() => navigate('/')}
            className="text-primary hover:text-accent"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar ao Início
          </Button>
        </div>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Lucas Barbearia - Nossas Unidades
          </h1>
          <p className="text-gray-600">
            Escolha a unidade mais próxima e entre na fila online
          </p>
        </div>

        {/* Lista de Barbearias */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {barbearias.map((barbearia) => (
            <Card key={barbearia.id} className="hover:shadow-lg transition-shadow duration-300">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Scissors className="w-5 h-5 text-primary" />
                  <span>{barbearia.nome}</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Informações Básicas */}
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <MapPin className="w-4 h-4 text-gray-500" />
                    <span className="text-sm text-gray-700">{barbearia.endereco}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Phone className="w-4 h-4 text-gray-500" />
                    <span className="text-sm text-gray-700">{barbearia.telefone}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Clock className="w-4 h-4 text-gray-500" />
                    <span className="text-sm text-gray-700">
                      Segunda a Sexta: {barbearia.horario.segunda.aberto ? 
                        `${barbearia.horario.segunda.inicio} - ${barbearia.horario.segunda.fim}` : 
                        'Fechado'
                      }
                    </span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Users className="w-4 h-4 text-gray-500" />
                    <span className="text-sm text-gray-700">
                      {barbearia.barbeiros && barbearia.barbeiros.length > 0 ? `${barbearia.barbeiros.length} barbeiros` : 'Nenhum barbeiro disponível'}
                    </span>
                  </div>
                </div>

                {/* Serviços */}
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Serviços:</h4>
                  <div className="space-y-1">
                    {barbearia.servicos.map((servico, index) => (
                      <div key={index} className="flex justify-between text-sm">
                        <span className="text-gray-700">{servico.nome}</span>
                        <span className="font-semibold text-primary">{servico.preco}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Configurações */}
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Tempo médio:</span>
                  <Badge variant="outline">
                    {barbearia.configuracoes.tempoMedioPorCliente}min
                  </Badge>
                </div>

                {/* Ações */}
                <div className="space-y-2 pt-4">
                  <Link to={`/barbearia/${barbearia.id}/agendar`}>
                    <Button className="w-full bg-primary hover:bg-primary/90">
                      <CalendarIcon className="w-4 h-4 mr-2" />
                      Agendar Horário
                    </Button>
                  </Link>
                  
                  <Link to={`/barbearia/${barbearia.id}/visualizar-fila`}>
                    <Button variant="outline" className="w-full">
                      <Users className="w-4 h-4 mr-2" />
                      Ver Fila Atual
                    </Button>
                  </Link>
                  
                  <Link to={`/qr-code/${barbearia.id}`}>
                    <Button variant="ghost" className="w-full">
                      <QrCode className="w-4 h-4 mr-2" />
                      Informações da unidade
                    </Button>
                  </Link>
                </div>

                {/* Status */}
                <div className="flex items-center justify-between pt-2 border-t">
                  <span className="text-sm text-gray-600">Status:</span>
                  <Badge variant={barbearia.ativo ? "default" : "secondary"}>
                    {barbearia.ativo ? "Aberta" : "Fechada"}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Informações da Rede */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Star className="w-5 h-5 text-yellow-500" />
              <span>Sobre a Lucas Barbearia</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <h4 className="font-semibold text-gray-900 mb-2">Nossa Rede</h4>
                <p className="text-2xl font-bold text-primary">{barbearias.length}</p>
                <p className="text-sm text-gray-600">Unidades</p>
              </div>
              <div className="text-center">
                <h4 className="font-semibold text-gray-900 mb-2">Cobertura</h4>
                <p className="text-2xl font-bold text-primary">Recife</p>
                <p className="text-sm text-gray-600">Capital e Região</p>
              </div>
              <div className="text-center">
                <h4 className="font-semibold text-gray-900 mb-2">Tecnologia</h4>
                <p className="text-2xl font-bold text-primary">100%</p>
                <p className="text-sm text-gray-600">Fila Digital</p>
              </div>
            </div>
            
            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
              <h4 className="font-semibold text-blue-900 mb-2">Como Funciona</h4>
              <ol className="text-sm text-blue-800 space-y-1">
                <li>1. Escolha a unidade mais próxima</li>
                <li>2. Entre na fila online ou escaneie o QR Code</li>
                <li>3. Acompanhe sua posição em tempo real</li>
                <li>4. Receba notificação quando for sua vez</li>
                <li>5. Chegue na hora certa e seja atendido</li>
              </ol>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default BarbeariasList; 