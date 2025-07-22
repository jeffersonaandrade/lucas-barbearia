import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  Star, 
  ThumbsUp, 
  MessageCircle, 
  Send, 
  ArrowLeft, 
  CheckCircle,
  Heart,
  Clock,
  User,
  Scissors
} from 'lucide-react';
import { Button } from '@/components/ui/button.jsx';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.jsx';
import { Textarea } from '@/components/ui/textarea.jsx';
import { Badge } from '@/components/ui/badge.jsx';
import { Alert, AlertDescription } from '@/components/ui/alert.jsx';
import { useFila } from '@/hooks/useFila.js';
import { useClienteToken } from '@/hooks/useClienteToken.js';

const Avaliacao = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { clienteAtual, barbeariaInfo } = useFila(parseInt(id));
  const { hasToken, getStatusFilaUrl } = useClienteToken();
  
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comentario, setComentario] = useState('');
  const [categoriaAvaliacao, setCategoriaAvaliacao] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // Verificar se o cliente foi realmente atendido
  useEffect(() => {
    if (!hasToken || !clienteAtual) {
      navigate('/');
      return;
    }

    // Verificar se o cliente foi atendido (posição 0 ou status 'atendido')
    if (clienteAtual.posicao > 0 && clienteAtual.status !== 'atendido') {
      // Redirecionar para status da fila se ainda não foi atendido
      const statusUrl = getStatusFilaUrl();
      if (statusUrl) {
        navigate(statusUrl);
      } else {
        navigate('/');
      }
    }
  }, [hasToken, clienteAtual, navigate, getStatusFilaUrl]);

  const categorias = [
    { id: 'atendimento', label: 'Atendimento', icon: User },
    { id: 'qualidade', label: 'Qualidade do Serviço', icon: Scissors },
    { id: 'ambiente', label: 'Ambiente', icon: Heart },
    { id: 'tempo', label: 'Tempo de Espera', icon: Clock },
    { id: 'preco', label: 'Preço', icon: ThumbsUp }
  ];

  const handleSubmit = async () => {
    if (rating === 0) {
      alert('Por favor, selecione uma avaliação');
      return;
    }

    setLoading(true);
    
    try {
      // Simular envio da avaliação
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Salvar avaliação no localStorage (simulando backend)
      const avaliacao = {
        id: Date.now(),
        clienteId: clienteAtual.token,
        barbeariaId: id,
        clienteNome: clienteAtual.nome,
        rating,
        categoria: categoriaAvaliacao,
        comentario,
        data: new Date().toISOString(),
        barbeiro: clienteAtual.barbeiro
      };

      const avaliacoes = JSON.parse(localStorage.getItem('avaliacoes') || '[]');
      avaliacoes.push(avaliacao);
      localStorage.setItem('avaliacoes', JSON.stringify(avaliacoes));

      // Marcar cliente como avaliado
      localStorage.setItem('cliente_avaliado', 'true');
      
      setSubmitted(true);
    } catch (error) {
      console.error('Erro ao enviar avaliação:', error);
      alert('Erro ao enviar avaliação. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleVoltar = () => {
    navigate('/');
  };

  if (!hasToken || !clienteAtual) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white flex items-center justify-center">
        <Card className="w-full max-w-md bg-card border border-border shadow-lg">
          <CardContent className="p-8 text-center">
            <CheckCircle className="w-16 h-16 text-destructive mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-foreground mb-2">Acesso Negado</h2>
            <p className="text-muted-foreground mb-4">
              Você precisa estar na fila para avaliar o atendimento.
            </p>
            <Button onClick={handleVoltar}>
              Voltar ao Início
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white flex items-center justify-center">
        <Card className="w-full max-w-md bg-card border border-border shadow-lg">
          <CardContent className="p-8 text-center">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-foreground mb-2">Avaliação Enviada!</h2>
            <p className="text-muted-foreground mb-4">
              Obrigado por avaliar nosso atendimento. Sua opinião é muito importante para nós!
            </p>
            <div className="flex items-center justify-center space-x-1 mb-6">
              {[...Array(5)].map((_, i) => (
                <Star 
                  key={i} 
                  className={`w-6 h-6 ${i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} 
                />
              ))}
            </div>
            <Button onClick={handleVoltar} className="w-full">
              Voltar ao Início
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      <div className="container mx-auto px-4 py-8">
        <Button
          variant="ghost"
          onClick={handleVoltar}
          className="text-primary hover:text-accent mb-8"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Voltar ao Início
        </Button>

        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              Avalie seu <span className="text-primary">Atendimento</span>
            </h1>
            <p className="text-xl text-muted-foreground">
              Sua opinião é muito importante para continuarmos melhorando
            </p>
          </div>

          {/* Informações do Atendimento */}
          <Card className="bg-card border border-border shadow-lg mb-8">
            <CardHeader>
              <CardTitle className="text-foreground">Detalhes do Atendimento</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Cliente</p>
                  <p className="font-semibold text-foreground">{clienteAtual.nome}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Barbeiro</p>
                  <p className="font-semibold text-foreground">{clienteAtual.barbeiro}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Barbearia</p>
                  <p className="font-semibold text-foreground">{barbeariaInfo?.nome || 'Lucas Barbearia'}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Data</p>
                  <p className="font-semibold text-foreground">
                    {new Date().toLocaleDateString('pt-BR')}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Avaliação por Estrelas */}
          <Card className="bg-card border border-border shadow-lg mb-8">
            <CardHeader>
              <CardTitle className="text-foreground">Como você avalia sua experiência?</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex justify-center space-x-2 mb-4">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    className="focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-full p-1"
                  >
                    <Star 
                      className={`w-12 h-12 transition-colors ${
                        star <= (hoverRating || rating) 
                          ? 'fill-yellow-400 text-yellow-400' 
                          : 'text-gray-300 hover:text-yellow-300'
                      }`} 
                    />
                  </button>
                ))}
              </div>
              
              <div className="text-center">
                <p className="text-lg font-semibold text-foreground">
                  {rating === 0 && 'Selecione uma avaliação'}
                  {rating === 1 && 'Péssimo'}
                  {rating === 2 && 'Ruim'}
                  {rating === 3 && 'Regular'}
                  {rating === 4 && 'Bom'}
                  {rating === 5 && 'Excelente'}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Categoria da Avaliação */}
          <Card className="bg-card border border-border shadow-lg mb-8">
            <CardHeader>
              <CardTitle className="text-foreground">O que você está avaliando?</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {categorias.map((categoria) => {
                  const Icon = categoria.icon;
                  return (
                    <button
                      key={categoria.id}
                      onClick={() => setCategoriaAvaliacao(categoria.id)}
                      className={`p-4 rounded-lg border-2 transition-all ${
                        categoriaAvaliacao === categoria.id
                          ? 'border-primary bg-primary/10'
                          : 'border-border hover:border-primary/50'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <Icon className="w-6 h-6 text-primary" />
                        <span className="font-medium text-foreground">{categoria.label}</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Comentário */}
          <Card className="bg-card border border-border shadow-lg mb-8">
            <CardHeader>
              <CardTitle className="text-foreground">Deixe um comentário (opcional)</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder="Conte-nos mais sobre sua experiência..."
                value={comentario}
                onChange={(e) => setComentario(e.target.value)}
                className="min-h-[120px] resize-none"
                maxLength={500}
              />
              <div className="text-right mt-2">
                <span className="text-sm text-muted-foreground">
                  {comentario.length}/500
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Botão de Envio */}
          <div className="text-center">
            <Button
              onClick={handleSubmit}
              disabled={loading || rating === 0}
              size="lg"
              className="bg-primary text-primary-foreground hover:bg-accent px-8 py-3 text-lg font-semibold"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Enviando...
                </>
              ) : (
                <>
                  <Send className="w-5 h-5 mr-2" />
                  Enviar Avaliação
                </>
              )}
            </Button>
          </div>

          {/* Informação adicional */}
          <div className="text-center mt-8">
            <Alert className="max-w-md mx-auto border-primary/20 bg-primary/5">
              <MessageCircle className="h-4 w-4 text-primary" />
              <AlertDescription className="text-foreground">
                Sua avaliação nos ajuda a melhorar continuamente nossos serviços.
              </AlertDescription>
            </Alert>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Avaliacao; 