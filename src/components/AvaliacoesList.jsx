import { useState, useEffect } from 'react';
import { 
  Star, 
  Filter, 
  Search, 
  Calendar, 
  User, 
  Scissors,
  Heart,
  Clock,
  ThumbsUp,
  MessageCircle,
  TrendingUp,
  BarChart3
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.jsx';
import { Badge } from '@/components/ui/badge.jsx';
import { Button } from '@/components/ui/button.jsx';
import { Input } from '@/components/ui/input.jsx';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select.jsx';

const AvaliacoesList = () => {
  const [avaliacoes, setAvaliacoes] = useState([]);
  const [filteredAvaliacoes, setFilteredAvaliacoes] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRating, setFilterRating] = useState('all');
  const [filterCategoria, setFilterCategoria] = useState('all');
  const [stats, setStats] = useState({
    total: 0,
    media: 0,
    excelente: 0,
    bom: 0,
    regular: 0,
    ruim: 0,
    pessimo: 0
  });

  useEffect(() => {
    carregarAvaliacoes();
  }, []);

  useEffect(() => {
    filtrarAvaliacoes();
  }, [avaliacoes, searchTerm, filterRating, filterCategoria]);

  const carregarAvaliacoes = () => {
    try {
      const avaliacoesData = JSON.parse(localStorage.getItem('avaliacoes') || '[]');
      setAvaliacoes(avaliacoesData);
      calcularEstatisticas(avaliacoesData);
    } catch (error) {
      console.error('Erro ao carregar avaliações:', error);
    }
  };

  const calcularEstatisticas = (data) => {
    if (data.length === 0) return;

    const total = data.length;
    const media = data.reduce((acc, av) => acc + av.rating, 0) / total;
    
    const excelente = data.filter(av => av.rating === 5).length;
    const bom = data.filter(av => av.rating === 4).length;
    const regular = data.filter(av => av.rating === 3).length;
    const ruim = data.filter(av => av.rating === 2).length;
    const pessimo = data.filter(av => av.rating === 1).length;

    setStats({
      total,
      media: Math.round(media * 10) / 10,
      excelente,
      bom,
      regular,
      ruim,
      pessimo
    });
  };

  const filtrarAvaliacoes = () => {
    let filtered = [...avaliacoes];

    // Filtro por busca
    if (searchTerm) {
      filtered = filtered.filter(av => 
        av.clienteNome.toLowerCase().includes(searchTerm.toLowerCase()) ||
        av.barbeiro.toLowerCase().includes(searchTerm.toLowerCase()) ||
        av.comentario.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filtro por rating
    if (filterRating !== 'all') {
      filtered = filtered.filter(av => av.rating === parseInt(filterRating));
    }

    // Filtro por categoria
    if (filterCategoria !== 'all') {
      filtered = filtered.filter(av => av.categoria === filterCategoria);
    }

    setFilteredAvaliacoes(filtered);
  };

  const getRatingText = (rating) => {
    switch (rating) {
      case 1: return 'Péssimo';
      case 2: return 'Ruim';
      case 3: return 'Regular';
      case 4: return 'Bom';
      case 5: return 'Excelente';
      default: return 'N/A';
    }
  };

  const getRatingColor = (rating) => {
    switch (rating) {
      case 1: return 'bg-red-500';
      case 2: return 'bg-orange-500';
      case 3: return 'bg-yellow-500';
      case 4: return 'bg-blue-500';
      case 5: return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const getCategoriaIcon = (categoria) => {
    switch (categoria) {
      case 'atendimento': return User;
      case 'qualidade': return Scissors;
      case 'ambiente': return Heart;
      case 'tempo': return Clock;
      case 'preco': return ThumbsUp;
      default: return MessageCircle;
    }
  };

  const getCategoriaLabel = (categoria) => {
    switch (categoria) {
      case 'atendimento': return 'Atendimento';
      case 'qualidade': return 'Qualidade do Serviço';
      case 'ambiente': return 'Ambiente';
      case 'tempo': return 'Tempo de Espera';
      case 'preco': return 'Preço';
      default: return 'Geral';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">
            Avaliações dos Clientes
          </h1>
          <p className="text-muted-foreground">
            Gerencie e acompanhe o feedback dos seus clientes
          </p>
        </div>

        {/* Estatísticas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-card border border-border shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total de Avaliações</p>
                  <p className="text-2xl font-bold text-foreground">{stats.total}</p>
                </div>
                <BarChart3 className="w-8 h-8 text-primary" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border border-border shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Média Geral</p>
                  <div className="flex items-center space-x-2">
                    <p className="text-2xl font-bold text-foreground">{stats.media}</p>
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star 
                          key={i} 
                          className={`w-4 h-4 ${i < Math.floor(stats.media) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} 
                        />
                      ))}
                    </div>
                  </div>
                </div>
                <TrendingUp className="w-8 h-8 text-primary" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border border-border shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Excelente (5★)</p>
                  <p className="text-2xl font-bold text-foreground">{stats.excelente}</p>
                </div>
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                  <Star className="w-4 h-4 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border border-border shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Bom (4★)</p>
                  <p className="text-2xl font-bold text-foreground">{stats.bom}</p>
                </div>
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                  <Star className="w-4 h-4 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filtros */}
        <Card className="bg-card border border-border shadow-lg mb-8">
          <CardHeader>
            <CardTitle className="text-foreground">Filtros</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Buscar
                </label>
                <Input
                  placeholder="Nome, barbeiro ou comentário..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Avaliação
                </label>
                <Select value={filterRating} onValueChange={setFilterRating}>
                  <SelectTrigger>
                    <SelectValue placeholder="Todas as avaliações" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas as avaliações</SelectItem>
                    <SelectItem value="5">Excelente (5★)</SelectItem>
                    <SelectItem value="4">Bom (4★)</SelectItem>
                    <SelectItem value="3">Regular (3★)</SelectItem>
                    <SelectItem value="2">Ruim (2★)</SelectItem>
                    <SelectItem value="1">Péssimo (1★)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Categoria
                </label>
                <Select value={filterCategoria} onValueChange={setFilterCategoria}>
                  <SelectTrigger>
                    <SelectValue placeholder="Todas as categorias" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas as categorias</SelectItem>
                    <SelectItem value="atendimento">Atendimento</SelectItem>
                    <SelectItem value="qualidade">Qualidade do Serviço</SelectItem>
                    <SelectItem value="ambiente">Ambiente</SelectItem>
                    <SelectItem value="tempo">Tempo de Espera</SelectItem>
                    <SelectItem value="preco">Preço</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Lista de Avaliações */}
        <div className="space-y-4">
          {filteredAvaliacoes.length === 0 ? (
            <Card className="bg-card border border-border shadow-lg">
              <CardContent className="p-8 text-center">
                <MessageCircle className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-foreground mb-2">
                  {avaliacoes.length === 0 ? 'Nenhuma avaliação ainda' : 'Nenhuma avaliação encontrada'}
                </h3>
                <p className="text-muted-foreground">
                  {avaliacoes.length === 0 
                    ? 'As avaliações dos clientes aparecerão aqui.' 
                    : 'Tente ajustar os filtros de busca.'
                  }
                </p>
              </CardContent>
            </Card>
          ) : (
            filteredAvaliacoes.map((avaliacao) => {
              const CategoriaIcon = getCategoriaIcon(avaliacao.categoria);
              return (
                <Card key={avaliacao.id} className="bg-card border border-border shadow-lg">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                          <User className="w-6 h-6 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-foreground">{avaliacao.clienteNome}</h3>
                          <p className="text-sm text-muted-foreground">
                            Atendido por {avaliacao.barbeiro}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center space-x-1 mb-2">
                          {[...Array(5)].map((_, i) => (
                            <Star 
                              key={i} 
                              className={`w-4 h-4 ${i < avaliacao.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} 
                            />
                          ))}
                        </div>
                        <Badge className={getRatingColor(avaliacao.rating)}>
                          {getRatingText(avaliacao.rating)}
                        </Badge>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <div className="flex items-center space-x-2">
                        <CategoriaIcon className="w-4 h-4 text-primary" />
                        <span className="text-sm text-muted-foreground">
                          {getCategoriaLabel(avaliacao.categoria)}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Calendar className="w-4 h-4 text-primary" />
                        <span className="text-sm text-muted-foreground">
                          {formatDate(avaliacao.data)}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Scissors className="w-4 h-4 text-primary" />
                        <span className="text-sm text-muted-foreground">
                          Barbearia #{avaliacao.barbeariaId}
                        </span>
                      </div>
                    </div>

                    {avaliacao.comentario && (
                      <div className="bg-secondary/50 rounded-lg p-4">
                        <p className="text-foreground italic">"{avaliacao.comentario}"</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default AvaliacoesList; 