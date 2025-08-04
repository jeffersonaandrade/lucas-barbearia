import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Star, Calendar, User, MessageCircle, Filter, Search, Building2, Clock, AlertTriangle } from 'lucide-react';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';

const AvaliacoesList = () => {
  const [avaliacoes, setAvaliacoes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRatingEstrutura, setFilterRatingEstrutura] = useState('all');
  const [filterRatingBarbeiro, setFilterRatingBarbeiro] = useState('all');
  const [filterBarbearia, setFilterBarbearia] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [barbearias, setBarbearias] = useState([]);

  useEffect(() => {
    carregarAvaliacoes();
    carregarBarbearias();
  }, []);

  const carregarAvaliacoes = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/avaliacoes');
      
      if (response.ok) {
        const data = await response.json();
        setAvaliacoes(data);
      } else {
        setError('Erro ao carregar avaliações');
      }
    } catch (error) {
      console.error('Erro ao carregar avaliações:', error);
      setError('Erro de conexão');
    } finally {
      setLoading(false);
    }
  };

  const carregarBarbearias = async () => {
    try {
      const response = await fetch('/api/barbearias');
      if (response.ok) {
        const data = await response.json();
        setBarbearias(data);
      }
    } catch (error) {
      console.error('Erro ao carregar barbearias:', error);
    }
  };

  const filtrarAvaliacoes = () => {
    return avaliacoes.filter(avaliacao => {
      const matchSearch = avaliacao.cliente_nome?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         avaliacao.comentario?.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchRatingEstrutura = filterRatingEstrutura === 'all' || avaliacao.rating_estrutura === parseInt(filterRatingEstrutura);
      const matchRatingBarbeiro = filterRatingBarbeiro === 'all' || avaliacao.rating_barbeiro === parseInt(filterRatingBarbeiro);
      
      const matchBarbearia = filterBarbearia === 'all' || avaliacao.barbearia_id === parseInt(filterBarbearia);
      
      // Filtro por status (link válido/expirado)
      const agora = new Date();
      const dataFinalizacao = new Date(avaliacao.data_finalizacao);
      const horasPassadas = (agora - dataFinalizacao) / (1000 * 60 * 60);
      const linkValido = horasPassadas <= 24;
      
      let matchStatus = true;
      if (filterStatus === 'valido') matchStatus = linkValido;
      if (filterStatus === 'expirado') matchStatus = !linkValido;
      
      return matchSearch && matchRatingEstrutura && matchRatingBarbeiro && matchBarbearia && matchStatus;
    });
  };

  const getRatingColor = (rating) => {
    if (rating >= 4) return 'bg-green-100 text-green-800';
    if (rating >= 3) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  const getRatingText = (rating) => {
    if (rating === 5) return 'Excelente';
    if (rating === 4) return 'Muito Bom';
    if (rating === 3) return 'Bom';
    if (rating === 2) return 'Regular';
    if (rating === 1) return 'Ruim';
    return 'Não avaliado';
  };

  const formatarData = (dataString) => {
    return new Date(dataString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const calcularTempoRestante = (dataFinalizacao) => {
    const agora = new Date();
    const dataFinal = new Date(dataFinalizacao);
    const horasPassadas = (agora - dataFinal) / (1000 * 60 * 60);
    const horasRestantes = Math.max(0, 24 - horasPassadas);
    
    if (horasRestantes <= 0) return 0;
    return Math.floor(horasRestantes);
  };

  const getStatusLink = (dataFinalizacao) => {
    const horasRestantes = calcularTempoRestante(dataFinalizacao);
    
    if (horasRestantes <= 0) {
      return {
        status: 'expirado',
        texto: 'Expirado',
        cor: 'bg-red-100 text-red-800',
        icon: AlertTriangle
      };
    } else if (horasRestantes <= 6) {
      return {
        status: 'expirando',
        texto: `${horasRestantes}h restantes`,
        cor: 'bg-orange-100 text-orange-800',
        icon: AlertTriangle
      };
    } else {
      return {
        status: 'valido',
        texto: `${horasRestantes}h restantes`,
        cor: 'bg-green-100 text-green-800',
        icon: Clock
      };
    }
  };

  const calcularMediaEstrutura = () => {
    if (avaliacoes.length === 0) return 0;
    const total = avaliacoes.reduce((acc, av) => acc + (av.rating_estrutura || 0), 0);
    return (total / avaliacoes.length).toFixed(1);
  };

  const calcularMediaBarbeiro = () => {
    if (avaliacoes.length === 0) return 0;
    const total = avaliacoes.reduce((acc, av) => acc + (av.rating_barbeiro || 0), 0);
    return (total / avaliacoes.length).toFixed(1);
  };

  const contarLinksExpirados = () => {
    return avaliacoes.filter(av => calcularTempoRestante(av.data_finalizacao) <= 0).length;
  };

  const contarLinksValidos = () => {
    return avaliacoes.filter(av => calcularTempoRestante(av.data_finalizacao) > 0).length;
  };

  const avaliacoesFiltradas = filtrarAvaliacoes();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="text-center text-red-600">
              <p>{error}</p>
              <Button onClick={carregarAvaliacoes} className="mt-4">
                Tentar Novamente
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Avaliações dos Clientes
        </h1>
        <p className="text-gray-600">
          Gerencie e visualize todas as avaliações recebidas
        </p>
      </div>

      {/* Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-6 gap-4 mb-8">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total de Avaliações</p>
                <p className="text-2xl font-bold text-gray-900">{avaliacoes.length}</p>
              </div>
              <MessageCircle className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Média Estrutura</p>
                <p className="text-2xl font-bold text-gray-900">
                  {calcularMediaEstrutura()}
                </p>
              </div>
              <Building2 className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Média Barbeiro</p>
                <p className="text-2xl font-bold text-gray-900">
                  {calcularMediaBarbeiro()}
                </p>
              </div>
              <User className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Links Válidos</p>
                <p className="text-2xl font-bold text-gray-900">
                  {contarLinksValidos()}
                </p>
              </div>
              <Clock className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Links Expirados</p>
                <p className="text-2xl font-bold text-gray-900">
                  {contarLinksExpirados()}
                </p>
              </div>
              <AlertTriangle className="w-8 h-8 text-red-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Com Comentários</p>
                <p className="text-2xl font-bold text-gray-900">
                  {avaliacoes.filter(av => av.comentario && av.comentario.trim()).length}
                </p>
              </div>
              <MessageCircle className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filtros */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-7 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Buscar
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Nome do cliente ou comentário..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Estrutura
              </label>
              <Select value={filterRatingEstrutura} onValueChange={setFilterRatingEstrutura}>
                <SelectTrigger>
                  <SelectValue placeholder="Todas" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas</SelectItem>
                  <SelectItem value="5">5 estrelas</SelectItem>
                  <SelectItem value="4">4 estrelas</SelectItem>
                  <SelectItem value="3">3 estrelas</SelectItem>
                  <SelectItem value="2">2 estrelas</SelectItem>
                  <SelectItem value="1">1 estrela</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Barbeiro
              </label>
              <Select value={filterRatingBarbeiro} onValueChange={setFilterRatingBarbeiro}>
                <SelectTrigger>
                  <SelectValue placeholder="Todas" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas</SelectItem>
                  <SelectItem value="5">5 estrelas</SelectItem>
                  <SelectItem value="4">4 estrelas</SelectItem>
                  <SelectItem value="3">3 estrelas</SelectItem>
                  <SelectItem value="2">2 estrelas</SelectItem>
                  <SelectItem value="1">1 estrela</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Barbearia
              </label>
              <Select value={filterBarbearia} onValueChange={setFilterBarbearia}>
                <SelectTrigger>
                  <SelectValue placeholder="Todas" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas</SelectItem>
                  {barbearias.map(barbearia => (
                    <SelectItem key={barbearia.id} value={barbearia.id.toString()}>
                      {barbearia.nome}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Status do Link
              </label>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger>
                  <SelectValue placeholder="Todos" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="valido">Válidos</SelectItem>
                  <SelectItem value="expirado">Expirados</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-end">
              <Button 
                onClick={() => {
                  setSearchTerm('');
                  setFilterRatingEstrutura('all');
                  setFilterRatingBarbeiro('all');
                  setFilterBarbearia('all');
                  setFilterStatus('all');
                }}
                variant="outline"
                className="w-full"
              >
                Limpar
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabela de Avaliações */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="w-5 h-5" />
            Avaliações ({avaliacoesFiltradas.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {avaliacoesFiltradas.length === 0 ? (
            <div className="text-center py-8">
              <MessageCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">Nenhuma avaliação encontrada</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Cliente</TableHead>
                  <TableHead>Barbearia</TableHead>
                  <TableHead>Estrutura</TableHead>
                  <TableHead>Barbeiro</TableHead>
                  <TableHead>Status Link</TableHead>
                  <TableHead>Comentário</TableHead>
                  <TableHead>Data</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {avaliacoesFiltradas.map((avaliacao) => {
                  const statusLink = getStatusLink(avaliacao.data_finalizacao);
                  const StatusIcon = statusLink.icon;
                  
                  return (
                    <TableRow key={avaliacao.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <User className="w-4 h-4 text-gray-400" />
                          <span className="font-medium">{avaliacao.cliente_nome}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        {barbearias.find(b => b.id === avaliacao.barbearia_id)?.nome || 'N/A'}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className="flex">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star 
                                key={star} 
                                className={`w-4 h-4 ${
                                  star <= (avaliacao.rating_estrutura || 0)
                                    ? 'text-yellow-500 fill-current' 
                                    : 'text-gray-300'
                                }`} 
                              />
                            ))}
                          </div>
                          <Badge className={getRatingColor(avaliacao.rating_estrutura || 0)}>
                            {getRatingText(avaliacao.rating_estrutura || 0)}
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className="flex">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star 
                                key={star} 
                                className={`w-4 h-4 ${
                                  star <= (avaliacao.rating_barbeiro || 0)
                                    ? 'text-yellow-500 fill-current' 
                                    : 'text-gray-300'
                                }`} 
                              />
                            ))}
                          </div>
                          <Badge className={getRatingColor(avaliacao.rating_barbeiro || 0)}>
                            {getRatingText(avaliacao.rating_barbeiro || 0)}
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={statusLink.cor}>
                          <StatusIcon className="w-3 h-3 mr-1" />
                          {statusLink.texto}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {avaliacao.comentario ? (
                          <div className="max-w-xs">
                            <p className="text-sm text-gray-900 line-clamp-2">
                              {avaliacao.comentario}
                            </p>
                          </div>
                        ) : (
                          <span className="text-gray-400 text-sm">Sem comentário</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-gray-400" />
                          <span className="text-sm text-gray-600">
                            {formatarData(avaliacao.created_at)}
                          </span>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AvaliacoesList; 