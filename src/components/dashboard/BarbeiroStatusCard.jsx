import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.jsx';
import { Badge } from '@/components/ui/badge.jsx';
import { Button } from '@/components/ui/button.jsx';
import { Building2, CheckCircle, XCircle } from 'lucide-react';

const BarbeiroStatusCard = ({ 
  barbearias, 
  barbeariaAtual, 
  isBarbeiroAtivo, 
  onToggleAtivo, 
  loading 
}) => {
  return (
    <Card className="mb-4 sm:mb-6">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center text-lg sm:text-xl">
          <Building2 className="mr-2 h-5 w-5" />
          Meu Status em Todas as Barbearias
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-xs text-blue-800">
            <strong>Regra:</strong> Você só pode estar ativo em uma barbearia por vez. 
            Ao ativar uma barbearia, você será automaticamente desativado nas outras.
          </p>
        </div>
        <div className="grid grid-cols-1 gap-3">
          {barbearias.map((barbearia) => {
            const isAtivo = isBarbeiroAtivo(barbearia.id);
            const isAtual = barbeariaAtual?.id === barbearia.id;
            
            return (
              <div 
                key={barbearia.id}
                className={`p-3 rounded-lg border ${
                  isAtual 
                    ? 'bg-blue-50 border-blue-200' 
                    : 'bg-gray-50 border-gray-200'
                }`}
              >
                <div className="flex flex-col space-y-2 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
                  <div className="flex items-center space-x-2">
                    {/* Sinal Luminoso */}
                    <div className="relative">
                      <div 
                        className={`w-4 h-4 rounded-full ${
                          isAtivo 
                            ? 'bg-green-500 shadow-lg shadow-green-500/50 animate-pulse' 
                            : 'bg-red-500 shadow-lg shadow-red-500/50'
                        }`}
                        title={isAtivo ? "Status: ATIVO" : "Status: INATIVO"}
                      />
                      {/* Efeito de brilho interno */}
                      <div 
                        className={`absolute top-1 left-1 w-2 h-2 rounded-full ${
                          isAtivo 
                            ? 'bg-green-300' 
                            : 'bg-red-300'
                        }`}
                      />
                    </div>
                    
                    {isAtivo ? (
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    ) : (
                      <XCircle className="h-4 w-4 text-gray-400" />
                    )}
                    <div className="flex flex-col">
                      <span className={`text-sm font-medium ${
                        isAtual ? 'text-blue-800' : 'text-gray-700'
                      }`}>
                        {barbearia.nome}
                      </span>
                      {isAtual && (
                        <p className="text-xs text-blue-600">
                          Barbearia atual
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-col space-y-2 sm:flex-row sm:items-center sm:space-y-0 sm:space-x-2">
                    <Badge 
                      variant={isAtivo ? "default" : "secondary"}
                      className="text-xs self-start sm:self-auto"
                    >
                      {isAtivo ? "ATIVO" : "INATIVO"}
                    </Badge>
                    {isAtual && (
                      <Button
                        variant={isAtivo ? "outline" : "default"}
                        size="sm"
                        onClick={() => onToggleAtivo(barbearia.id)}
                        disabled={loading}
                        className={`w-full sm:w-auto ${
                          !isAtivo 
                            ? 'bg-black text-white hover:bg-gray-800 border-black' 
                            : ''
                        }`}
                      >
                        {isAtivo ? "Desativar" : "Ativar"}
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default BarbeiroStatusCard; 