import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Building2, MapPin, Phone, Globe } from 'lucide-react';
import { barbeariasService } from '@/services/api.js';

const BarbeariaSelector = ({ onBarbeariaSelect, selectedBarbeariaId }) => {
  const [barbearias, setBarbearias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const carregarBarbearias = async () => {
      try {
        setLoading(true);
        const response = await barbeariasService.listarBarbearias();
        setBarbearias(response.data || []);
      } catch (error) {
        console.error('Erro ao carregar barbearias:', error);
        setError('Erro ao carregar barbearias');
      } finally {
        setLoading(false);
      }
    };

    carregarBarbearias();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-32">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600">{error}</p>
        <Button 
          onClick={() => window.location.reload()} 
          className="mt-4"
        >
          Tentar Novamente
        </Button>
      </div>
    );
  }

  if (barbearias.length === 0) {
    return (
      <div className="text-center py-8">
        <Building2 className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-sm font-medium text-gray-900">Nenhuma barbearia encontrada</h3>
        <p className="mt-1 text-sm text-gray-500">
          Não há barbearias cadastradas no sistema.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-2">
          Selecione uma Barbearia
        </h2>
        <p className="text-gray-600">
          Escolha a barbearia para gerenciar suas configurações.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {barbearias.map((barbearia) => (
          <Card 
            key={barbearia.id} 
            className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
              selectedBarbeariaId === barbearia.id 
                ? 'ring-2 ring-blue-500 bg-blue-50' 
                : 'hover:bg-gray-50'
            }`}
            onClick={() => onBarbeariaSelect(barbearia.id)}
          >
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg">{barbearia.nome}</CardTitle>
                  <Badge 
                    variant={barbearia.ativo ? "default" : "secondary"}
                    className="mt-1"
                  >
                    {barbearia.ativo ? 'Ativa' : 'Inativa'}
                  </Badge>
                </div>
                <Building2 className="h-6 w-6 text-gray-400" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {barbearia.endereco && (
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <MapPin className="h-4 w-4" />
                    <span>{barbearia.endereco}</span>
                  </div>
                )}
                
                {barbearia.telefone && (
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Phone className="h-4 w-4" />
                    <span>{barbearia.telefone}</span>
                  </div>
                )}
                
                {barbearia.website && (
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Globe className="h-4 w-4" />
                    <span className="truncate">{barbearia.website}</span>
                  </div>
                )}
              </div>
              
              <Button 
                className="w-full mt-4"
                variant={selectedBarbeariaId === barbearia.id ? "default" : "outline"}
              >
                {selectedBarbeariaId === barbearia.id ? 'Selecionada' : 'Selecionar'}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default BarbeariaSelector; 