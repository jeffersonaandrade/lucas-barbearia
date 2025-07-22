import { useState, useEffect } from 'react';
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
  Scissors,
  Settings,
  Play,
  RefreshCw
} from 'lucide-react';
import { Button } from '@/components/ui/button.jsx';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.jsx';
import { Textarea } from '@/components/ui/textarea.jsx';
import { Badge } from '@/components/ui/badge.jsx';
import { Alert, AlertDescription } from '@/components/ui/alert.jsx';
import { Input } from '@/components/ui/input.jsx';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select.jsx';
import { useNavigate } from 'react-router-dom';

const DevAvaliacao = () => {
  const navigate = useNavigate();
  
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comentario, setComentario] = useState('');
  const [categoriaAvaliacao, setCategoriaAvaliacao] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  
  // Dados simulados do cliente
  const [clienteSimulado, setClienteSimulado] = useState({
    nome: 'João Silva',
    telefone: '(81) 99999-9999',
    barbeiro: 'Pedro Santos',
    barbearia: 'Lucas Barbearia - Centro',
    token: 'token_123456789',
    barbeariaId: '1'
  });

  // Modo de teste
  const [modoTeste, setModoTeste] = useState('simular');

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
      // Simular delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Salvar avaliação no localStorage
      const avaliacao = {
        id: Date.now(),
        clienteId: clienteSimulado.token,
        barbeariaId: clienteSimulado.barbeariaId,
        clienteNome: clienteSimulado.nome,
        rating,
        categoria: categoriaAvaliacao,
        comentario,
        data: new Date().toISOString(),
        barbeiro: clienteSimulado.barbeiro
      };

      const avaliacoes = JSON.parse(localStorage.getItem('avaliacoes') || '[]');
      avaliacoes.push(avaliacao);
      localStorage.setItem('avaliacoes', JSON.stringify(avaliacoes));

      // Simular dados do cliente no localStorage
      localStorage.setItem('fila_token', clienteSimulado.token);
      localStorage.setItem('cliente_data', JSON.stringify({
        ...clienteSimulado,
        posicao: 0,
        status: 'atendido',
        tempoEstimado: 0
      }));
      localStorage.setItem('fila_barbearia_id', clienteSimulado.barbeariaId);
      
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

  const handleReset = () => {
    setRating(0);
    setHoverRating(0);
    setComentario('');
    setCategoriaAvaliacao('');
    setSubmitted(false);
  };

  const handleSimularCliente = () => {
    const clientes = [
      {
        nome: 'João Silva',
        telefone: '(81) 99999-9999',
        barbeiro: 'Pedro Santos',
        barbearia: 'Lucas Barbearia - Centro',
        token: 'token_123456789',
        barbeariaId: '1'
      },
      {
        nome: 'Maria Costa',
        telefone: '(81) 88888-8888',
        barbeiro: 'Geral',
        barbearia: 'Lucas Barbearia - Shopping',
        token: 'token_987654321',
        barbeariaId: '2'
      },
      {
        nome: 'Carlos Oliveira',
        telefone: '(81) 77777-7777',
        barbeiro: 'Lucas Ferreira',
        barbearia: 'Lucas Barbearia - Bairro',
        token: 'token_456789123',
        barbeariaId: '3'
      }
    ];

    const clienteAleatorio = clientes[Math.floor(Math.random() * clientes.length)];
    setClienteSimulado(clienteAleatorio);
    handleReset();
  };

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
            <div className="space-y-2">
              <Button onClick={handleReset} className="w-full">
                <RefreshCw className="w-4 h-4 mr-2" />
                Nova Avaliação
              </Button>
              <Button onClick={handleVoltar} variant="outline" className="w-full">
                Voltar ao Início
              </Button>
            </div>
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

        <div className="max-w-4xl mx-auto">
          {/* Indicador de modo de desenvolvimento */}
          <div className="mb-6 p-4 bg-yellow-100 border border-yellow-300 rounded-lg">
            <div className="flex items-center justify-center space-x-2">
              <Settings className="w-5 h-5 text-yellow-600" />
              <p className="text-sm font-medium text-yellow-800">
                🧪 Tela de Desenvolvimento - Simulação de Avaliação
              </p>
            </div>
          </div>

          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              Simular <span className="text-primary">Avaliação</span>
            </h1>
            <p className="text-xl text-muted-foreground">
              Teste o sistema de avaliação com dados simulados
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Painel de Controle */}
            <Card className="bg-card border border-border shadow-lg">
              <CardHeader>
                <CardTitle className="text-foreground">Painel de Controle</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Cliente Simulado
                  </label>
                  <div className="space-y-2 text-sm">
                    <p><strong>Nome:</strong> {clienteSimulado.nome}</p>
                    <p><strong>Telefone:</strong> {clienteSimulado.telefone}</p>
                    <p><strong>Barbeiro:</strong> {clienteSimulado.barbeiro}</p>
                    <p><strong>Barbearia:</strong> {clienteSimulado.barbearia}</p>
                    <p><strong>Token:</strong> {clienteSimulado.token}</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <Button 
                    onClick={handleSimularCliente}
                    variant="outline"
                    className="w-full"
                  >
                    <Play className="w-4 h-4 mr-2" />
                    Simular Cliente Aleatório
                  </Button>
                  
                  <Button 
                    onClick={handleReset}
                    variant="outline"
                    className="w-full"
                  >
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Limpar Formulário
                  </Button>
                </div>

                <Alert className="border-blue-200 bg-blue-50">
                  <MessageCircle className="h-4 w-4 text-blue-600" />
                  <AlertDescription className="text-blue-800">
                    Esta tela simula o processo de avaliação. Os dados serão salvos no localStorage.
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>

            {/* Formulário de Avaliação */}
            <div className="space-y-6">
              {/* Informações do Atendimento */}
              <Card className="bg-card border border-border shadow-lg">
                <CardHeader>
                  <CardTitle className="text-foreground">Detalhes do Atendimento</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Cliente</p>
                      <p className="font-semibold text-foreground">{clienteSimulado.nome}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Barbeiro</p>
                      <p className="font-semibold text-foreground">{clienteSimulado.barbeiro}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Barbearia</p>
                      <p className="font-semibold text-foreground">{clienteSimulado.barbearia}</p>
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
              <Card className="bg-card border border-border shadow-lg">
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
              <Card className="bg-card border border-border shadow-lg">
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
              <Card className="bg-card border border-border shadow-lg">
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
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DevAvaliacao; 