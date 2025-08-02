import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button.jsx';
import { Input } from '@/components/ui/input.jsx';
import { Label } from '@/components/ui/label.jsx';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select.jsx';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx';
import { Alert, AlertDescription } from '@/components/ui/alert.jsx';
import { Loader2, CheckCircle, AlertCircle } from 'lucide-react';
// Importar o hook especializado para clientes
import { useClienteFila } from '@/hooks/useClienteFila.js';
import ApiStatus from '@/components/ApiStatus.jsx';

const EntrarFila = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nome: '',
    telefone: '',
    barbeiro: 'Fila Geral'
  });
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  // Usar o hook especializado para clientes
  const {
    barbeiros,
    barbeariaInfo,
    loading,
    error: filaError,
    entrarNaFila,
    apiStatus,
    verificarStatusAPI
  } = useClienteFila(); // Sem valor fixo

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    // Validação básica
    if (!formData.nome.trim()) {
      setError('Por favor, informe seu nome');
      return;
    }

    if (!formData.telefone.trim()) {
      setError('Por favor, informe seu telefone');
      return;
    }

    try {
      console.log('🚀 Tentando entrar na fila...');
      console.log('📋 Dados do formulário:', formData);
      console.log('🔧 Status da API:', apiStatus);

      const result = await entrarNaFila(formData);
      
      console.log('✅ Sucesso ao entrar na fila:', result);
      setSuccess(true);
      
      // Redirecionar após 2 segundos
      setTimeout(() => {
        navigate('/status-fila');
      }, 2000);
      
    } catch (err) {
      console.error('❌ Erro ao entrar na fila:', err);
      setError(err.message || 'Erro ao entrar na fila. Tente novamente.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-gray-600">Carregando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-md mx-auto">
        {/* Status da API */}
        <ApiStatus 
          status={apiStatus} 
          onRetry={verificarStatusAPI}
          className="mb-6"
        />

        <Card>
          <CardHeader>
            <CardTitle className="text-center text-2xl font-bold">
              Entrar na Fila
            </CardTitle>
            <CardDescription className="text-center">
              Preencha seus dados para entrar na fila
            </CardDescription>
          </CardHeader>
          <CardContent>
            {success && (
              <Alert className="mb-4 border-green-200 bg-green-50">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <AlertDescription className="text-green-800">
                  Sucesso! Você foi adicionado à fila. Redirecionando...
                </AlertDescription>
              </Alert>
            )}

            {(error || filaError) && (
              <Alert className="mb-4 border-red-200 bg-red-50">
                <AlertCircle className="h-4 w-4 text-red-600" />
                <AlertDescription className="text-red-800">
                  {error || filaError}
                </AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="nome">Nome</Label>
                <Input
                  id="nome"
                  type="text"
                  value={formData.nome}
                  onChange={(e) => handleInputChange('nome', e.target.value)}
                  placeholder="Seu nome completo"
                  required
                />
              </div>

              <div>
                <Label htmlFor="telefone">Telefone</Label>
                <Input
                  id="telefone"
                  type="tel"
                  value={formData.telefone}
                  onChange={(e) => handleInputChange('telefone', e.target.value)}
                  placeholder="(81) 99999-9999"
                  required
                />
              </div>

              <div>
                <Label htmlFor="barbeiro">Barbeiro</Label>
                <Select
                  value={formData.barbeiro}
                  onValueChange={(value) => handleInputChange('barbeiro', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Escolha um barbeiro" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Fila Geral">Fila Geral</SelectItem>
                    {barbeiros.map((barbeiro) => (
                      <SelectItem key={barbeiro.id} value={barbeiro.id}>
                        {barbeiro.nome}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <Button 
                type="submit" 
                className="w-full"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Entrando na fila...
                  </>
                ) : (
                  'Entrar na Fila'
                )}
              </Button>
            </form>

            {barbeariaInfo && (
              <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                <h3 className="font-semibold text-gray-900 mb-2">
                  {barbeariaInfo.nome}
                </h3>
                <p className="text-sm text-gray-600">
                  {barbeariaInfo.endereco}
                </p>
                {barbeariaInfo.telefone && (
                  <p className="text-sm text-gray-600">
                    Tel: {barbeariaInfo.telefone}
                  </p>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default EntrarFila; 