import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.jsx';
import { Button } from '@/components/ui/button.jsx';
import { Alert, AlertDescription } from '@/components/ui/alert.jsx';
import { Badge } from '@/components/ui/badge.jsx';
import { 
  QrCode, 
  Eye, 
  AlertTriangle, 
  MapPin, 
  Clock,
  Users,
  Info
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const RestrictedAccess = ({ barbeariaId, barbeariaInfo }) => {
  const navigate = useNavigate();

  const handleVisualizarFila = () => {
    navigate(`/barbearia/${barbeariaId}/visualizar-fila`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card className="border-amber-200 bg-amber-50">
          <CardHeader className="text-center">
            <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <QrCode className="w-8 h-8 text-amber-600" />
            </div>
            <CardTitle className="text-amber-800">Acesso Restrito</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                Para entrar na fila, você precisa escanear o QR Code disponível na barbearia.
              </AlertDescription>
            </Alert>

            {barbeariaInfo && (
              <div className="bg-white p-4 rounded-lg border">
                <h3 className="font-semibold text-lg mb-2 flex items-center">
                  <MapPin className="w-4 h-4 mr-2 text-primary" />
                  {barbeariaInfo.nome}
                </h3>
                <p className="text-sm text-muted-foreground mb-3">
                  {barbeariaInfo.endereco}
                </p>
                
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center">
                    <Clock className="w-4 h-4 mr-1 text-muted-foreground" />
                    <span className="text-muted-foreground">Hoje:</span>
                  </div>
                  <Badge variant="outline">
                    {barbeariaInfo.horario ? 
                      (() => {
                        const diasSemana = ['domingo', 'segunda', 'terca', 'quarta', 'quinta', 'sexta', 'sabado'];
                        const diaAtual = diasSemana[new Date().getDay()];
                        const horarioDia = barbeariaInfo.horario[diaAtual];
                        
                        if (horarioDia && horarioDia.aberto) {
                          return `${horarioDia.inicio} - ${horarioDia.fim}`;
                        } else {
                          return 'Fechado hoje';
                        }
                      })() : 
                      'Horário não disponível'
                    }
                  </Badge>
                </div>
              </div>
            )}

            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <h4 className="font-medium text-blue-900 mb-2 flex items-center">
                <Info className="w-4 h-4 mr-2" />
                Como funciona?
              </h4>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Procure o QR Code na barbearia</li>
                <li>• Escaneie com seu celular</li>
                <li>• Preencha seus dados</li>
                <li>• Acompanhe sua posição</li>
              </ul>
            </div>

            <div className="space-y-2">
              <Button 
                onClick={handleVisualizarFila}
                variant="outline"
                className="w-full"
              >
                <Eye className="w-4 h-4 mr-2" />
                Apenas Visualizar Fila
              </Button>
              
              <Button 
                onClick={() => navigate('/')}
                variant="ghost"
                className="w-full"
              >
                Voltar ao Início
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default RestrictedAccess; 