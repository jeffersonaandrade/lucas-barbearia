import { useState, useEffect } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Alert, AlertDescription } from './ui/alert';
import { CheckCircle, Star, AlertCircle, Loader2, Building2, User, Clock, CheckSquare, ArrowLeft } from 'lucide-react';

const Avaliacao = () => {
  const { clienteId } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  const [ratingEstrutura, setRatingEstrutura] = useState(0);
  const [ratingBarbeiro, setRatingBarbeiro] = useState(0);
  const [comentario, setComentario] = useState('');
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState('idle'); // idle, success, error, expired, already_rated
  const [errorMessage, setErrorMessage] = useState('');
  const [linkInfo, setLinkInfo] = useState(null);
  const [verificando, setVerificando] = useState(true);
  
  const token = searchParams.get('token');

  useEffect(() => {
    // Verificar se temos o token necessário
    if (!token) {
      setStatus('error');
      setErrorMessage('Token de avaliação não encontrado. Verifique o link enviado.');
      setVerificando(false);
      return;
    }

    // Verificar validade do link
    verificarLink();
  }, [token]);

  const verificarLink = async () => {
    try {
      setVerificando(true);
      const response = await fetch(`/api/avaliacoes/verificar/${token}`);
      
      if (response.ok) {
        const data = await response.json();
        
        if (data.success) {
          const linkData = data.data;
          setLinkInfo(linkData);
          
          if (!linkData.valido) {
            if (linkData.ja_avaliou) {
              setStatus('already_rated');
            } else {
              setStatus('expired');
            }
            setErrorMessage(linkData.mensagem);
          }
        } else {
          setStatus('error');
          setErrorMessage('Erro ao verificar link de avaliação');
        }
      } else {
        setStatus('error');
        setErrorMessage('Erro ao verificar link de avaliação');
      }
    } catch (error) {
      console.error('Erro ao verificar link:', error);
      setStatus('error');
      setErrorMessage('Erro de conexão. Verifique sua internet e tente novamente.');
    } finally {
      setVerificando(false);
    }
  };

  const handleRatingChange = (newRating, type) => {
    if (type === 'estrutura') {
      setRatingEstrutura(newRating);
    } else if (type === 'barbeiro') {
      setRatingBarbeiro(newRating);
    }
  };

  const enviarAvaliacao = async () => {
    if (!ratingEstrutura || !ratingBarbeiro) {
      setErrorMessage('Por favor, avalie tanto a estrutura quanto o barbeiro (1-5 estrelas)');
      return;
    }

    setLoading(true);
    setErrorMessage('');

    try {
      const response = await fetch('/api/avaliacoes/token', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          token: token,
          rating_estrutura: ratingEstrutura,
          rating_barbeiro: ratingBarbeiro,
          comentario: comentario
        })
      });

      if (response.ok) {
        setStatus('success');
        // Limpar formulário
        setRatingEstrutura(0);
        setRatingBarbeiro(0);
        setComentario('');
      } else {
        const errorData = await response.json();
        setStatus('error');
        setErrorMessage(errorData.message || 'Erro ao enviar avaliação. Tente novamente.');
      }
    } catch (error) {
      console.error('Erro ao enviar avaliação:', error);
      setStatus('error');
      setErrorMessage('Erro de conexão. Verifique sua internet e tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const StarRating = ({ rating, onRatingChange, disabled = false, title, icon: Icon }) => {
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <Icon className="w-6 h-6 text-primary" />
          <h3 className="text-lg font-semibold text-foreground">{title}</h3>
        </div>
        <div className="flex gap-2 justify-center">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => !disabled && onRatingChange(star)}
              disabled={disabled}
              className={`
                text-4xl transition-all duration-200 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-full p-1
                ${star <= rating 
                  ? 'text-yellow-400' 
                  : 'text-gray-300 hover:text-yellow-200'
                }
                ${disabled ? 'cursor-not-allowed' : 'cursor-pointer'}
              `}
            >
              <Star className="w-10 h-10 fill-current" />
            </button>
          ))}
        </div>
        <p className="text-sm text-muted-foreground text-center">
          {rating > 0 ? `${rating} estrela${rating > 1 ? 's' : ''} selecionada${rating > 1 ? 's' : ''}` : 'Clique nas estrelas para avaliar'}
        </p>
      </div>
    );
  };

  // Tela de carregamento
  if (verificando) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center min-h-[60vh]">
            <Card className="w-full max-w-md">
              <CardContent className="pt-6">
                <div className="text-center space-y-4">
                  <Loader2 className="w-12 h-12 text-primary mx-auto animate-spin" />
                  <h2 className="text-xl font-semibold text-foreground">
                    Verificando link...
                  </h2>
                  <p className="text-muted-foreground">
                    Aguarde enquanto verificamos a validade do seu link de avaliação.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  // Tela de sucesso
  if (status === 'success') {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center min-h-[60vh]">
            <Card className="w-full max-w-md">
              <CardContent className="pt-6">
                <div className="text-center space-y-4">
                  <CheckCircle className="w-16 h-16 text-green-500 mx-auto" />
                  <h2 className="text-2xl font-bold text-foreground">
                    Avaliação Enviada!
                  </h2>
                  <p className="text-muted-foreground">
                    Obrigado por avaliar nosso serviço. Sua opinião é muito importante para nós!
                  </p>
                  <Button 
                    onClick={() => navigate('/')}
                    className="w-full"
                  >
                    Voltar ao Início
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  // Tela de já avaliou
  if (status === 'already_rated') {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center min-h-[60vh]">
            <Card className="w-full max-w-md">
              <CardContent className="pt-6">
                <div className="text-center space-y-4">
                  <CheckSquare className="w-16 h-16 text-primary mx-auto" />
                  <h2 className="text-2xl font-bold text-foreground">
                    Avaliação Já Enviada
                  </h2>
                  <p className="text-muted-foreground">
                    Você já enviou uma avaliação para este atendimento. Obrigado pelo feedback!
                  </p>
                  <Button 
                    onClick={() => navigate('/')}
                    className="w-full"
                  >
                    Voltar ao Início
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  // Tela de link expirado
  if (status === 'expired') {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center min-h-[60vh]">
            <Card className="w-full max-w-md">
              <CardContent className="pt-6">
                <div className="text-center space-y-4">
                  <Clock className="w-16 h-16 text-orange-500 mx-auto" />
                  <h2 className="text-2xl font-bold text-foreground">
                    Link Expirado
                  </h2>
                  <p className="text-muted-foreground">
                    Este link de avaliação expirou. O prazo de 24 horas foi ultrapassado.
                  </p>
                  <Button 
                    onClick={() => navigate('/')}
                    className="w-full"
                  >
                    Voltar ao Início
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  // Tela de erro
  if (status === 'error') {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center min-h-[60vh]">
            <Card className="w-full max-w-md">
              <CardContent className="pt-6">
                <div className="text-center space-y-4">
                  <AlertCircle className="w-16 h-16 text-destructive mx-auto" />
                  <h2 className="text-2xl font-bold text-foreground">
                    Erro no Link
                  </h2>
                  <p className="text-muted-foreground">
                    {errorMessage}
                  </p>
                  <Button 
                    onClick={() => navigate('/')}
                    className="w-full"
                  >
                    Voltar ao Início
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  // Formulário de avaliação (apenas se link for válido)
  if (!linkInfo?.valido) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header com botão voltar */}
        <div className="mb-8">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/')}
            className="text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar ao site
          </Button>
        </div>

        <div className="max-w-2xl mx-auto">
          {/* Header da página */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-foreground mb-4">
              Avalie nossa <span className="text-primary">Barbearia</span>
            </h1>
            <p className="text-xl text-muted-foreground">
              Sua opinião é muito importante para continuarmos melhorando!
            </p>
          </div>

          {/* Informações do cliente */}
          {linkInfo && (
            <Card className="mb-8">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <User className="w-5 h-5 text-primary" />
                    <span className="text-foreground font-medium">
                      Cliente: {linkInfo.cliente_nome}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-primary font-medium">
                    <Clock className="w-4 h-4" />
                    <span>{Math.floor(linkInfo.tempo_restante)}h restantes</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Formulário de avaliação */}
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl text-foreground">
                Como foi sua experiência?
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-8">
              {/* Avaliação da Estrutura */}
              <div className="space-y-4">
                <StarRating 
                  rating={ratingEstrutura} 
                  onRatingChange={(rating) => handleRatingChange(rating, 'estrutura')}
                  disabled={loading}
                  title="Avalie a estrutura do local"
                  icon={Building2}
                />
              </div>

              {/* Separador */}
              <div className="border-t border-border"></div>

              {/* Avaliação do Barbeiro */}
              <div className="space-y-4">
                <StarRating 
                  rating={ratingBarbeiro} 
                  onRatingChange={(rating) => handleRatingChange(rating, 'barbeiro')}
                  disabled={loading}
                  title="Avalie o atendimento do barbeiro"
                  icon={User}
                />
              </div>

              {/* Separador */}
              <div className="border-t border-border"></div>

              {/* Comentário */}
              <div className="space-y-3">
                <label htmlFor="comentario" className="text-sm font-medium text-foreground">
                  Comentário (opcional)
                </label>
                <Textarea
                  id="comentario"
                  placeholder="Conte-nos sobre sua experiência..."
                  value={comentario}
                  onChange={(e) => setComentario(e.target.value)}
                  disabled={loading}
                  rows={4}
                  className="resize-none"
                />
              </div>

                             {/* Botão de envio */}
               <div className="pt-4">
                 <Button 
                   onClick={enviarAvaliacao}
                   disabled={loading || !ratingEstrutura || !ratingBarbeiro}
                   className="w-full h-12 text-lg font-semibold bg-black hover:bg-gray-800 text-white disabled:bg-gray-400"
                   size="lg"
                 >
                   {loading ? (
                     <>
                       <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                       Enviando...
                     </>
                   ) : (
                     'Enviar Avaliação'
                   )}
                 </Button>
               </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Avaliacao; 