import { Dialog, DialogContent, DialogHeader, DialogTitle } from './dialog.jsx';
import { Button } from './button.jsx';
import { Badge } from './badge.jsx';
import { Star, Calendar, User, Building2, MessageCircle, X } from 'lucide-react';

const AvaliacaoDetailModal = ({ isOpen, onClose, avaliacao }) => {
  if (!avaliacao) return null;

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

  const StarRating = ({ rating, title }) => (
    <div className="space-y-2">
      <h4 className="font-medium text-gray-900">{title}</h4>
      <div className="flex items-center gap-3">
        <div className="flex">
          {[1, 2, 3, 4, 5].map((star) => (
            <Star 
              key={star} 
              className={`w-5 h-5 ${
                star <= (rating || 0)
                  ? 'text-yellow-500 fill-current' 
                  : 'text-gray-300'
              }`} 
            />
          ))}
        </div>
        <Badge className={getRatingColor(rating || 0)}>
          {getRatingText(rating || 0)}
        </Badge>
      </div>
    </div>
  );

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MessageCircle className="w-5 h-5" />
            Detalhes da Avaliação
          </DialogTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="absolute right-4 top-4"
          >
            <X className="w-4 h-4" />
          </Button>
        </DialogHeader>

        <div className="space-y-6">
          {/* Informações do Cliente */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <User className="w-4 h-4 text-gray-600" />
              <h3 className="font-medium text-gray-900">Informações do Cliente</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">Nome</p>
                <p className="font-medium">{avaliacao.cliente_nome}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Data da Avaliação</p>
                <p className="font-medium">{formatarData(avaliacao.created_at)}</p>
              </div>
            </div>
          </div>

          {/* Avaliações */}
          <div className="space-y-4">
            <h3 className="font-medium text-gray-900">Avaliações</h3>
            
            {/* Avaliação da Estrutura */}
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-3">
                <Building2 className="w-4 h-4 text-blue-600" />
                <h4 className="font-medium text-blue-900">Avaliação da Estrutura</h4>
              </div>
              <StarRating 
                rating={avaliacao.rating_estrutura} 
                title="Estrutura do Local"
              />
            </div>

            {/* Avaliação do Barbeiro */}
            <div className="bg-green-50 p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-3">
                <User className="w-4 h-4 text-green-600" />
                <h4 className="font-medium text-green-900">Avaliação do Barbeiro</h4>
              </div>
              <StarRating 
                rating={avaliacao.rating_barbeiro} 
                title="Atendimento do Barbeiro"
              />
            </div>
          </div>

          {/* Comentário */}
          {avaliacao.comentario && (
            <div className="bg-yellow-50 p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-3">
                <MessageCircle className="w-4 h-4 text-yellow-600" />
                <h4 className="font-medium text-yellow-900">Comentário</h4>
              </div>
              <p className="text-gray-800 whitespace-pre-wrap">
                {avaliacao.comentario}
              </p>
            </div>
          )}

          {/* Informações Adicionais */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-medium text-gray-900 mb-3">Informações Adicionais</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-600">ID da Avaliação</p>
                <p className="font-mono">{avaliacao.id}</p>
              </div>
              <div>
                <p className="text-gray-600">Barbearia</p>
                <p>{avaliacao.barbearia_nome || 'N/A'}</p>
              </div>
              <div>
                <p className="text-gray-600">Barbeiro</p>
                <p>{avaliacao.barbeiro_nome || 'N/A'}</p>
              </div>
              <div>
                <p className="text-gray-600">Data do Atendimento</p>
                <p>{avaliacao.data_finalizacao ? formatarData(avaliacao.data_finalizacao) : 'N/A'}</p>
              </div>
            </div>
          </div>

          {/* Ações */}
          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button variant="outline" onClick={onClose}>
              Fechar
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AvaliacaoDetailModal; 