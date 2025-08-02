import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';

import { DollarSign, Scissors, CreditCard, Smartphone, Coins } from 'lucide-react';

// Função para formatar valor em reais (versão final)
const formatarMoedaCorrigida = (valor) => {
  // Remove tudo que não é número
  const apenasNumeros = valor.replace(/\D/g, '');
  
  // Se não há números, retorna vazio
  if (!apenasNumeros) return '';
  
  // Limita a 10 dígitos (999.999.999,99)
  const numerosLimitados = apenasNumeros.slice(0, 10);
  
  // Se tem apenas 1 dígito, adiciona zero à esquerda para centavos
  if (numerosLimitados.length === 1) {
    return `0,0${numerosLimitados}`;
  }
  
  // Se tem 2 dígitos, adiciona zero à esquerda para centavos
  if (numerosLimitados.length === 2) {
    return `0,${numerosLimitados}`;
  }
  
  // Para 3 ou mais dígitos, separa reais e centavos
  const centavos = numerosLimitados.slice(-2);
  const reais = numerosLimitados.slice(0, -2);
  
  // Formata com vírgula
  return `${reais},${centavos}`;
};

// Função para formatar valor em reais
const formatarMoeda = (valor) => {
  // Remove tudo que não é número
  const apenasNumeros = valor.replace(/\D/g, '');
  
  // Se não há números, retorna vazio
  if (!apenasNumeros) return '';
  
  // Limita a 10 dígitos (999.999.999,99)
  const numerosLimitados = apenasNumeros.slice(0, 10);
  
  console.log('🔍 Debug formatarMoeda:', {
    valorOriginal: valor,
    apenasNumeros,
    numerosLimitados,
    length: numerosLimitados.length
  });
  
  // Se tem apenas 1 dígito, adiciona zero à esquerda para centavos
  if (numerosLimitados.length === 1) {
    return `0,0${numerosLimitados}`;
  }
  
  // Se tem 2 dígitos, adiciona zero à esquerda para centavos
  if (numerosLimitados.length === 2) {
    return `0,${numerosLimitados}`;
  }
  
  // Para 3 ou mais dígitos, separa reais e centavos
  const centavos = numerosLimitados.slice(-2);
  const reais = numerosLimitados.slice(0, -2);
  
  console.log('🔍 Debug separação:', {
    centavos,
    reais,
    resultado: `${reais},${centavos}`
  });
  
  // Formata com vírgula
  return `${reais},${centavos}`;
};

// Função para converter valor formatado para número
const converterParaNumero = (valorFormatado) => {
  const apenasNumeros = valorFormatado.replace(/\D/g, '');
  return parseFloat(apenasNumeros) / 100;
};

const FinalizarAtendimentoModal = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  cliente, 
  loading = false 
}) => {

  const [formData, setFormData] = useState({
    valor_servico: '',
    forma_pagamento: 'dinheiro',
    observacoes: ''
  });
  const [valorFormatado, setValorFormatado] = useState('');
  const [error, setError] = useState(null);



  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!valorFormatado || !formData.forma_pagamento) {
      setError('Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    const valorNumerico = converterParaNumero(valorFormatado);
    if (valorNumerico <= 0) {
      setError('O valor deve ser maior que zero.');
      return;
    }

    const dados = {
      ...formData,
      valor_servico: valorNumerico,
      cliente_id: cliente?.id
    };

    onConfirm(dados);
  };

  const handleClose = () => {
    setFormData({
      valor_servico: '',
      forma_pagamento: 'dinheiro',
      observacoes: ''
    });
    setValorFormatado('');
    setError(null);
    onClose();
  };

  const formasPagamento = [
    { id: 'dinheiro', nome: 'Dinheiro', icon: Coins },
    { id: 'pix', nome: 'PIX', icon: Smartphone },
    { id: 'cartao_credito', nome: 'Cartão de Crédito', icon: CreditCard },
    { id: 'cartao_debito', nome: 'Cartão de Débito', icon: CreditCard }
  ];

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Scissors className="h-5 w-5" />
            Finalizar Atendimento
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

          {/* Informação sobre serviço já selecionado */}
          <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center gap-2">
              <Scissors className="h-4 w-4 text-green-600" />
              <span className="text-sm font-medium text-green-800">Serviço Selecionado</span>
            </div>
            <p className="text-xs text-green-700 mt-1">
              O serviço foi definido no início do atendimento. Agora informe o valor cobrado.
            </p>
          </div>

          {/* Valor */}
          <div>
            <Label htmlFor="valor">Valor Cobrado (R$) *</Label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                type="text"
                value={valorFormatado}
                onChange={(e) => {
                  const input = e.target.value;
                  const apenasNumeros = input.replace(/\D/g, '');

                  if (!apenasNumeros) {
                    setValorFormatado('');
                    return;
                  }

                  const numerosLimitados = apenasNumeros.slice(0, 10); // Evita valores absurdos

                  const valorNumerico = parseFloat(numerosLimitados) / 100;
                  const formatado = valorNumerico.toLocaleString('pt-BR', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                  });

                  setValorFormatado(formatado);
                }}
                placeholder="0,00"
                className="pl-10"
                maxLength={20}
              />
            </div>
            {valorFormatado && (
              <p className="text-xs text-gray-500 mt-1">
                Valor: R$ {valorFormatado}
              </p>
            )}
          </div>

          {/* Forma de Pagamento */}
          <div>
            <Label htmlFor="pagamento">Forma de Pagamento *</Label>
            <Select 
              value={formData.forma_pagamento} 
              onValueChange={(value) => setFormData({...formData, forma_pagamento: value})}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione a forma de pagamento" />
              </SelectTrigger>
              <SelectContent>
                {formasPagamento.map((forma) => (
                  <SelectItem key={forma.id} value={forma.id}>
                    <div className="flex items-center gap-2">
                      <forma.icon className="h-4 w-4" />
                      {forma.nome}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Observações */}
          <div>
            <Label htmlFor="observacoes">Observações (opcional)</Label>
            <Textarea
              value={formData.observacoes}
              onChange={(e) => setFormData({...formData, observacoes: e.target.value})}
              placeholder="Observações sobre o atendimento..."
              rows={3}
            />
          </div>

          {/* Botões */}
          <div className="flex gap-2 pt-4">
            <Button 
              type="submit" 
              disabled={loading}
              className="flex-1 bg-black hover:bg-gray-800 text-white"
            >
              {loading ? 'Finalizando...' : 'Finalizar Atendimento'}
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

export default FinalizarAtendimentoModal; 