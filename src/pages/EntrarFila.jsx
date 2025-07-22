import { useState } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { ArrowLeft, Users, Clock, AlertCircle, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button.jsx';
import { Input } from '@/components/ui/input.jsx';
import { Label } from '@/components/ui/label.jsx';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select.jsx';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.jsx';
import { Alert, AlertDescription } from '@/components/ui/alert.jsx';
import { useFila } from '@/hooks/useFila.js';
import { useQRCodeAccess } from '@/hooks/useQRCodeAccess.js';
import RestrictedAccess from '@/components/RestrictedAccess.jsx';

const EntrarFila = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();
  const { entrarNaFila, loading, error, estatisticas, barbeiros, barbeariaInfo } = useFila(parseInt(id));
  
  // Verificar se é uma rota de desenvolvimento
  const isDevRoute = location.pathname.startsWith('/dev/');
  
  const [formData, setFormData] = useState({
    nome: '',
    telefone: '',
    barbeiro: ''
  });
  const [success, setSuccess] = useState(false);
  const [resultado, setResultado] = useState(null);
  
  // Verificar acesso QR Code
  const { hasQRCodeAccess, barbeariaId: qrBarbeariaId } = useQRCodeAccess();

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const formatarTelefone = (value) => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length <= 11) {
      return numbers.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
    }
    return value;
  };



  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.nome || !formData.telefone || !formData.barbeiro) {
      return;
    }

    try {
      const resultado = await entrarNaFila(formData);
      setResultado(resultado);
      setSuccess(true);
      
      // Redirecionar para status da fila após 3 segundos (dar tempo para salvar no localStorage)
      setTimeout(() => {
        console.log('🔄 Redirecionando para status da fila...');
        console.log('📍 URL:', `/barbearia/${id}/status-fila`);
        console.log('🎫 Token:', resultado.token);
        navigate(`/barbearia/${id}/status-fila`);
      }, 3000);
    } catch (err) {
      console.error('Erro ao entrar na fila:', err);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white flex items-center justify-center p-4">
        <Card className="w-full max-w-md bg-card border border-border shadow-lg">
          <CardContent className="p-8 text-center">
            <CheckCircle className="w-16 h-16 text-primary mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-foreground mb-2">Sucesso!</h2>
            <p className="text-muted-foreground mb-4">
              Você foi adicionado à fila com sucesso!
            </p>
            {resultado && (
              <div className="space-y-2 text-sm">
                <p><strong>Posição:</strong> {resultado.posicao}º</p>
                <p><strong>Tempo estimado:</strong> {resultado.tempoEstimado} min</p>
              </div>
            )}
            <p className="text-xs text-muted-foreground mt-4">
              Redirecionando para acompanhar sua posição...
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }



  // Se não há ID na URL, mostrar tela de acesso restrito
  if (!id) {
    return <RestrictedAccess barbeariaId={null} barbeariaInfo={null} />;
  }
  
  // Se não é rota de desenvolvimento e não tem acesso QR Code, mostrar tela de acesso restrito
  if (!isDevRoute && !hasQRCodeAccess) {
    return <RestrictedAccess barbeariaId={parseInt(id)} barbeariaInfo={barbeariaInfo} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      {/* Header */}
      <div className="container mx-auto px-4 py-8">
        <Button
          variant="ghost"
          onClick={() => navigate('/')}
          className="text-primary hover:text-accent mb-8"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Voltar ao Início
        </Button>

        <div className="max-w-4xl mx-auto">
          {/* Indicador de modo de desenvolvimento */}
          {isDevRoute && (
            <div className="mb-6 p-4 bg-yellow-100 border border-yellow-300 rounded-lg">
              <div className="flex items-center justify-center space-x-2">
                <AlertCircle className="w-5 h-5 text-yellow-600" />
                <p className="text-sm font-medium text-yellow-800">
                  🧪 Modo de Desenvolvimento - Acesso direto para testes
                </p>
              </div>
            </div>
          )}
          
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              Entrar na <span className="text-primary">Fila</span>
            </h1>
            <p className="text-xl text-muted-foreground">
              Preencha seus dados e escolha seu barbeiro preferido
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
                         {/* Formulário */}
             <Card className="bg-card border border-border shadow-lg">
               <CardHeader>
                 <CardTitle className="text-foreground">Seus Dados</CardTitle>
               </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="nome" className="text-foreground">Nome Completo *</Label>
                    <Input
                      id="nome"
                      value={formData.nome}
                      onChange={(e) => handleInputChange('nome', e.target.value)}
                      placeholder="Digite seu nome completo"
                      className="bg-secondary border-border text-foreground"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="telefone" className="text-foreground">Telefone *</Label>
                    <Input
                      id="telefone"
                      value={formData.telefone}
                      onChange={(e) => handleInputChange('telefone', formatarTelefone(e.target.value))}
                      placeholder="(11) 99999-9999"
                      className="bg-secondary border-border text-foreground"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="barbeiro" className="text-foreground">Escolher Barbeiro *</Label>
                    <Select value={formData.barbeiro} onValueChange={(value) => handleInputChange('barbeiro', value)}>
                      <SelectTrigger className="bg-secondary border-border text-foreground">
                        <SelectValue placeholder="Selecione um barbeiro" />
                      </SelectTrigger>
                      <SelectContent className="bg-secondary border-border">
                        {barbeiros.map((barbeiro) => (
                          <SelectItem key={barbeiro.id} value={barbeiro.nome}>
                            {barbeiro.nome}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {error && (
                    <Alert className="border-destructive">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}

                  <Button
                    type="submit"
                    className="w-full bg-primary text-primary-foreground hover:bg-accent"
                    disabled={loading}
                  >
                    {loading ? 'Entrando na fila...' : 'Entrar na Fila'}
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Informações da Fila */}
            <div className="space-y-6">
                             {/* Estatísticas */}
               <Card className="bg-card border border-border shadow-lg">
                 <CardHeader>
                   <CardTitle className="text-foreground">Estatísticas da Fila</CardTitle>
                 </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-4 bg-secondary rounded-lg">
                      <Users className="w-8 h-8 text-primary mx-auto mb-2" />
                      <div className="text-2xl font-bold text-foreground">{estatisticas.total}</div>
                      <div className="text-sm text-muted-foreground">Pessoas na fila</div>
                    </div>
                    <div className="text-center p-4 bg-secondary rounded-lg">
                      <Clock className="w-8 h-8 text-primary mx-auto mb-2" />
                      <div className="text-2xl font-bold text-foreground">{estatisticas.tempoMedio}</div>
                      <div className="text-sm text-muted-foreground">Min. médio</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

                             {/* Dicas */}
               <Card className="bg-card border border-border shadow-lg">
                 <CardHeader>
                   <CardTitle className="text-foreground">Como Funciona</CardTitle>
                 </CardHeader>
                <CardContent className="space-y-4">
                                     <div className="flex items-start space-x-3">
                     <div className="w-6 h-6 bg-gray-200 text-gray-800 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5">
                       1
                     </div>
                    <div>
                      <h4 className="font-semibold text-foreground">Entre na Fila</h4>
                      <p className="text-sm text-muted-foreground">Preencha seus dados e escolha seu barbeiro</p>
                    </div>
                  </div>
                                     <div className="flex items-start space-x-3">
                     <div className="w-6 h-6 bg-gray-200 text-gray-800 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5">
                       2
                     </div>
                    <div>
                      <h4 className="font-semibold text-foreground">Acompanhe sua Posição</h4>
                      <p className="text-sm text-muted-foreground">Receba um token único para acompanhar em tempo real</p>
                    </div>
                  </div>
                                     <div className="flex items-start space-x-3">
                     <div className="w-6 h-6 bg-gray-200 text-gray-800 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5">
                       3
                     </div>
                    <div>
                      <h4 className="font-semibold text-foreground">Chegue na Hora</h4>
                      <p className="text-sm text-muted-foreground">Quando for sua vez, você será notificado</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

                             {/* Token Info */}
               <Alert className="border-primary/20 bg-primary/10">
                <AlertCircle className="h-4 w-4 text-primary" />
                <AlertDescription className="text-foreground">
                  <strong>Token Único:</strong> Após entrar na fila, você receberá um token único para acompanhar sua posição. 
                  Guarde-o com segurança!
                </AlertDescription>
              </Alert>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EntrarFila; 