import { Card, CardContent } from '@/components/ui/card.jsx';
import { Button } from '@/components/ui/button.jsx';
import { CheckCircle, Phone } from 'lucide-react';

const ClienteAtual = ({ 
  atendendoAtual, 
  onFinalizarAtendimento 
}) => {
  if (!atendendoAtual) return null;

  // Cliente sendo atendido
  if (atendendoAtual.status === 'atendendo') {
    return (
      <Card className="border-green-200 bg-green-50 mb-6">
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
    );
  }

  // Cliente chamado (próximo)
  if (atendendoAtual.status === 'proximo') {
    return (
      <Card className="border-blue-200 bg-blue-50 mb-6">
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
    );
  }

  return null;
};

export default ClienteAtual; 