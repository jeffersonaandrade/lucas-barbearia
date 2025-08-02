import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { configuracoesService } from '@/services/api.js';
import { Scissors, Play, DollarSign } from 'lucide-react';

// Função para formatar valor em reais
const formatarMoeda = (valor) => {
  if (!valor) return '0,00';
  return valor.toLocaleString('pt-BR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).replace(/\./g, ''); // Remove pontos de milhares para manter apenas vírgula
};

const IniciarAtendimentoModal = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  cliente, 
  barbeariaId, // Adicionar barbeariaId como prop
  loading = false 
}) => {
  const [servicos, setServicos] = useState([]);
  const [formData, setFormData] = useState({
    servico_id: ''
  });
  const [servicoSelecionado, setServicoSelecionado] = useState(null);
  const [error, setError] = useState(null);

  // Carregar serviços disponíveis
  useEffect(() => {
    if (isOpen && barbeariaId) { // Verificar se tem barbeariaId
      carregarServicos();
    }
  }, [isOpen, barbeariaId]); // Adicionar barbeariaId como dependência

  const carregarServicos = async () => {
    try {
      // Verificar se tem barbeariaId antes de fazer a chamada
      if (!barbeariaId) {
        setError('ID da barbearia não encontrado.');
        return;
      }

      // Chamar API com barbearia_id como parâmetro
      const response = await configuracoesService.listarServicos(barbeariaId);
      
      // Mapear dados do backend para o formato esperado pelo frontend
      const servicosMapeados = (response.data || []).map(servico => ({
        ...servico,
        duracao_estimada: servico.duracao // Mapear duracao -> duracao_estimada
      }));
      
      setServicos(servicosMapeados);
    } catch (error) {
      console.error('Erro ao carregar serviços:', error);
      setError('Erro ao carregar serviços. Tente novamente.');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.servico_id) {
      setError('Por favor, selecione o serviço.');
      return;
    }

    const dados = {
      servico_id: parseInt(formData.servico_id)
    };

    onConfirm(dados);
  };

  const handleClose = () => {
    setFormData({
      servico_id: ''
    });
    setServicoSelecionado(null);
    setError(null);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Play className="h-5 w-5" />
            Iniciar Atendimento
          </DialogTitle>
        </DialogHeader>

        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Cliente */}
          {cliente && (
            <div className="p-3 bg-gray-50 rounded-lg">
              <Label className="text-sm font-medium text-gray-700">Cliente</Label>
              <div className="text-lg font-semibold">{cliente.nome}</div>
              <div className="text-sm text-gray-600">{cliente.telefone}</div>
            </div>
          )}

          {/* Serviço */}
          <div>
            <Label htmlFor="servico">Serviço a Realizar *</Label>
            <Select 
              value={formData.servico_id} 
              onValueChange={(value) => {
                setFormData({...formData, servico_id: value});
                const servico = servicos.find(s => s.id.toString() === value);
                setServicoSelecionado(servico);
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione o serviço" />
              </SelectTrigger>
              <SelectContent>
                {servicos.map((servico) => (
                  <SelectItem key={servico.id} value={servico.id.toString()}>
                    <div className="flex items-center justify-between w-full">
                      <span>{servico.nome}</span>
                      <span className="text-gray-500 ml-2">R$ {formatarMoeda(servico.preco)}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Informação do serviço selecionado */}
          {servicoSelecionado && (
            <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium text-blue-800">{servicoSelecionado.nome}</div>
                  <div className="text-sm text-blue-600">Serviço selecionado</div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold text-blue-800">
                    R$ {formatarMoeda(servicoSelecionado.preco)}
                  </div>
                  <div className="text-xs text-blue-600">Preço sugerido</div>
                </div>
              </div>
            </div>
          )}

          {/* Informação sobre tempo real */}
          <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-center gap-2">
              <Scissors className="h-4 w-4 text-blue-600" />
              <span className="text-sm font-medium text-blue-800">Controle de Tempo Real</span>
            </div>
            <p className="text-xs text-blue-700 mt-1">
              O tempo de atendimento será contado automaticamente a partir de agora.
            </p>
          </div>

          {/* Botões */}
          <div className="flex gap-2 pt-4">
            <Button 
              type="submit" 
              disabled={loading}
              className="flex-1 bg-black hover:bg-gray-800 text-white"
            >
              {loading ? 'Iniciando...' : 'Iniciar Atendimento'}
            </Button>
            <Button 
              type="button" 
              variant="outline" 
              onClick={handleClose}
              disabled={loading}
            >
              Cancelar
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default IniciarAtendimentoModal; 