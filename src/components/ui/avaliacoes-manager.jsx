import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './card.jsx';
import { Button } from './button.jsx';
import { Badge } from './badge.jsx';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './table.jsx';
import { Input } from './input.jsx';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './select.jsx';
import { 
  Star, 
  Calendar, 
  User, 
  MessageCircle, 
  Filter, 
  Search, 
  Building2, 
  Clock, 
  AlertTriangle,
  TrendingUp,
  BarChart3,
  Download,
  RefreshCw,
  Eye,
  Star as StarIcon,
  CheckCircle
} from 'lucide-react';
import { useSharedData } from '@/hooks/useSharedData.js';
import AvaliacaoDetailModal from './avaliacao-detail-modal.jsx';

const AvaliacoesManager = ({ barbeariaAtual, barbeiroAtual, userRole }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRatingEstrutura, setFilterRatingEstrutura] = useState('all');
  const [filterRatingBarbeiro, setFilterRatingBarbeiro] = useState('all');
  const [filterPeriodo, setFilterPeriodo] = useState('all');
  const [selectedAvaliacao, setSelectedAvaliacao] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  // Sistema de dados compartilhados
  const { useSharedAvaliacoes } = useSharedData();
  const {
    avaliacoes,
    loading,
    error,
    refetch
  } = useSharedAvaliacoes(barbeariaAtual?.id, userRole);

  // Estados locais para paginação e filtros
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filteredAvaliacoes, setFilteredAvaliacoes] = useState([]);

  // Filtrar avaliações localmente
  useEffect(() => {
    if (!avaliacoes) return;

    let filtered = [...avaliacoes];

    // Filtro por termo de busca
    if (searchTerm) {
      filtered = filtered.filter(avaliacao => 
        avaliacao.cliente_nome?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        avaliacao.comentario?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filtro por rating da estrutura
    if (filterRatingEstrutura !== 'all') {
      filtered = filtered.filter(avaliacao => 
        avaliacao.rating_estrutura === parseInt(filterRatingEstrutura)
      );
    }

    // Filtro por rating do barbeiro
    if (filterRatingBarbeiro !== 'all') {
      filtered = filtered.filter(avaliacao => 
        avaliacao.rating_barbeiro === parseInt(filterRatingBarbeiro)
      );
    }

    // Filtro por período
    if (filterPeriodo !== 'all') {
      const agora = new Date();
      const periodos = {
        'hoje': 1,
        'semana': 7,
        'mes': 30,
        'trimestre': 90
      };
      
      const diasLimite = periodos[filterPeriodo];
      if (diasLimite) {
        const dataLimite = new Date(agora.getTime() - (diasLimite * 24 * 60 * 60 * 1000));
        filtered = filtered.filter(avaliacao => 
          new Date(avaliacao.data_finalizacao) >= dataLimite
        );
      }
    }

    setFilteredAvaliacoes(filtered);
    setCurrentPage(1);
    setTotalPages(Math.ceil(filtered.length / 10)); // 10 itens por página
  }, [avaliacoes, searchTerm, filterRatingEstrutura, filterRatingBarbeiro, filterPeriodo]);

  const handleSearch = async () => {
    try {
      await refetch();
    } catch (error) {
      console.error('Erro na busca:', error);
    }
  };

  const handleClearFilters = async () => {
    setSearchTerm('');
    setFilterRatingEstrutura('all');
    setFilterRatingBarbeiro('all');
    setFilterPeriodo('all');
    setCurrentPage(1);
    await refetch();
  };

  const handleDownloadRelatorio = async () => {
    try {
      const response = await fetch('/api/avaliacoes/relatorio', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          barbearia_id: barbeariaAtual?.id,
          user_role: userRole,
          filtros: {
            periodo: filterPeriodo !== 'all' ? filterPeriodo : null
          }
        })
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `relatorio-avaliacoes-${new Date().toISOString().split('T')[0]}.xlsx`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      } else {
        throw new Error('Erro ao baixar relatório');
      }
    } catch (error) {
      console.error('Erro ao baixar relatório:', error);
    }
  };

  // Funções utilitárias
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

  const getStatusLink = (dataFinalizacao) => {
    const agora = new Date();
    const dataFinal = new Date(dataFinalizacao);
    const horasPassadas = (agora - dataFinal) / (1000 * 60 * 60);
    const horasRestantes = Math.max(0, 24 - horasPassadas);
    
    if (horasRestantes <= 0) {
      return {
        status: 'expirado',
        texto: 'Expirado',
        cor: 'bg-red-100 text-red-800',
        icon: AlertTriangle
      };
    } else if (horasRestantes <= 6) {
      return {
        status: 'expirado_em_breve',
        texto: `Expira em ${Math.floor(horasRestantes)}h`,
        cor: 'bg-orange-100 text-orange-800',
        icon: Clock
      };
    } else {
      return {
        status: 'valido',
        texto: 'Válido',
        cor: 'bg-green-100 text-green-800',
        icon: CheckCircle
      };
    }
  };

  // Paginação
  const itensPorPagina = 10;
  const inicio = (currentPage - 1) * itensPorPagina;
  const fim = inicio + itensPorPagina;
  const avaliacoesPaginadas = filteredAvaliacoes.slice(inicio, fim);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center text-red-600">
            <p>Erro ao carregar avaliações: {error}</p>
            <Button onClick={refetch} className="mt-2">
              Tentar Novamente
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header com métricas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Avaliações</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{avaliacoes?.length || 0}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Média Geral</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {avaliacoes?.length > 0 
                ? ((avaliacoes.reduce((acc, av) => acc + (av.rating_estrutura + av.rating_barbeiro) / 2, 0) / avaliacoes.length)).toFixed(1)
                : '0.0'
              }
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Positivas (4-5★)</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {avaliacoes?.filter(av => (av.rating_estrutura + av.rating_barbeiro) / 2 >= 4).length || 0}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Links Válidos</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {avaliacoes?.filter(av => {
                const horasPassadas = (new Date() - new Date(av.data_finalizacao)) / (1000 * 60 * 60);
                return horasPassadas <= 24;
              }).length || 0}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filtros e Busca */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filtros e Busca
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Buscar
              </label>
              <div className="flex gap-2">
                <Input
                  placeholder="Nome do cliente ou comentário..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <Button onClick={handleSearch} size="sm">
                  <Search className="h-4 w-4" />
                </Button>
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
                Período
              </label>
              <Select value={filterPeriodo} onValueChange={setFilterPeriodo}>
                <SelectTrigger>
                  <SelectValue placeholder="Todos" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="hoje">Hoje</SelectItem>
                  <SelectItem value="semana">Última semana</SelectItem>
                  <SelectItem value="mes">Último mês</SelectItem>
                  <SelectItem value="trimestre">Último trimestre</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex gap-2 mt-4">
            <Button onClick={handleClearFilters} variant="outline">
              Limpar Filtros
            </Button>
            <Button onClick={handleDownloadRelatorio} variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Baixar Relatório
            </Button>
            <Button onClick={refetch} variant="outline">
              <RefreshCw className="h-4 w-4 mr-2" />
              Atualizar
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Tabela de Avaliações */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Avaliações ({filteredAvaliacoes.length})</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {avaliacoesPaginadas.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              Nenhuma avaliação encontrada com os filtros aplicados.
            </div>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Cliente</TableHead>
                    <TableHead>Estrutura</TableHead>
                    <TableHead>Barbeiro</TableHead>
                    <TableHead>Data</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {avaliacoesPaginadas.map((avaliacao) => {
                    const statusLink = getStatusLink(avaliacao.data_finalizacao);
                    const StatusIcon = statusLink.icon;
                    
                    return (
                      <TableRow key={avaliacao.id}>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <User className="h-4 w-4 text-gray-500" />
                            <span className="font-medium">{avaliacao.cliente_nome}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <Star className="h-4 w-4 text-yellow-500" />
                            <span>{avaliacao.rating_estrutura}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <Star className="h-4 w-4 text-yellow-500" />
                            <span>{avaliacao.rating_barbeiro}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-gray-500" />
                            <span>{formatarData(avaliacao.data_finalizacao)}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className={statusLink.cor}>
                            <StatusIcon className="h-3 w-3 mr-1" />
                            {statusLink.texto}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setSelectedAvaliacao(avaliacao);
                              setShowDetailModal(true);
                            }}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>

              {/* Paginação */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between mt-4">
                  <div className="text-sm text-gray-700">
                    Mostrando {inicio + 1} a {Math.min(fim, filteredAvaliacoes.length)} de {filteredAvaliacoes.length} avaliações
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(currentPage - 1)}
                      disabled={currentPage === 1}
                    >
                      Anterior
                    </Button>
                    <span className="flex items-center px-3 text-sm">
                      Página {currentPage} de {totalPages}
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(currentPage + 1)}
                      disabled={currentPage === totalPages}
                    >
                      Próxima
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>

      {/* Modal de Detalhes */}
      <AvaliacaoDetailModal
        isOpen={showDetailModal}
        onClose={() => setShowDetailModal(false)}
        avaliacao={selectedAvaliacao}
      />
    </div>
  );
};

export default AvaliacoesManager; 