import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.jsx';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select.jsx';
import { Switch } from '@/components/ui/switch.jsx';
import { Badge } from '@/components/ui/badge.jsx';
import { Button } from '@/components/ui/button.jsx';
import { Building2, Power } from 'lucide-react';

const BarbeariaSelector = ({ 
  barbearias, 
  barbeariaAtual, 
  onBarbeariaChange, 
  onToggleAtivo, 
  isBarbeiroAtivo,
  loading = false
}) => {
  const handleToggleAtivo = async (barbeariaId) => {
    console.log('🔄 Switch clicado para barbearia:', barbeariaId);
    await onToggleAtivo(barbeariaId);
  };

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Building2 className="mr-2 h-5 w-5" />
          Barbearia Atual
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Seletor de Barbearia */}
        <div>
          <label className="text-sm font-medium mb-2 block">Selecione a Barbearia</label>
          <Select
            value={barbeariaAtual?.id?.toString() || ''}
            onValueChange={onBarbeariaChange}
            disabled={loading}
          >
            <SelectTrigger>
              <SelectValue placeholder="Escolha uma barbearia para trabalhar" />
            </SelectTrigger>
            <SelectContent>
              {barbearias.map((barbearia) => (
                <SelectItem key={barbearia.id} value={barbearia.id.toString()}>
                  <div className="flex items-center justify-between w-full">
                    <span>{barbearia.nome}</span>
                    {/* Removido o badge do dropdown para evitar confusão */}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {barbeariaAtual && (
          <div className="space-y-3">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border">
              <div className="flex items-center space-x-3">
                <Power className={`h-5 w-5 ${loading ? 'text-gray-400' : 'text-gray-600'}`} />
                <div>
                  <p className="font-medium text-sm">Meu Status de Trabalho</p>
                  <p className="text-xs text-gray-500">
                    {loading 
                      ? "Atualizando status..." 
                      : isBarbeiroAtivo(barbeariaAtual.id) 
                        ? "Você está ativo e disponível para atendimentos" 
                        : "Você está inativo e não receberá clientes"
                    }
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                {(() => {
                  const isAtivo = isBarbeiroAtivo(barbeariaAtual.id);
                  console.log('🔄 BarbeariaSelector - Status do switch:', {
                    barbeariaId: barbeariaAtual.id,
                    isAtivo,
                    loading
                  });
                  return (
                    <>
                      <Switch
                        checked={isAtivo}
                        onCheckedChange={() => handleToggleAtivo(barbeariaAtual.id)}
                        disabled={loading}
                        title={isAtivo 
                          ? "Clique para se desativar" 
                          : "Clique para se ativar (voltar ao trabalho)"
                        }
                      />
                      <Badge 
                        variant={isAtivo ? "default" : "secondary"}
                        title={isAtivo 
                          ? "Você está ativo e receberá clientes" 
                          : "Você está inativo"
                        }
                        className="min-w-[60px] text-center"
                      >
                        {loading ? "..." : isAtivo ? "ATIVO" : "INATIVO"}
                      </Badge>
                    </>
                  );
                })()}
              </div>
            </div>
          </div>
        )}

        {/* Mensagem quando nenhuma barbearia está selecionada */}
        {!barbeariaAtual && (
          <div className="text-center p-4 bg-blue-50 rounded-lg border border-blue-200">
            <p className="text-sm text-blue-700">
              Selecione uma barbearia acima para começar a trabalhar
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default BarbeariaSelector; 