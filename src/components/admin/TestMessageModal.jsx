import React, { useState } from 'react';
import WhatsAppAdmin from '../../services/WhatsAppAdmin.js';
import { useAuth } from '../../contexts/AuthContext.jsx';
import { Button } from '../ui/button.jsx';
import { Input } from '../ui/input.jsx';
import { Label } from '../ui/label.jsx';
import { Select } from '../ui/select.jsx';
import { Textarea } from '../ui/textarea.jsx';
import { Card } from '../ui/card.jsx';
import { Alert } from '../ui/alert.jsx';
import { LoadingSpinner } from '../ui/loading-spinner.jsx';
import { 
  MessageSquare, 
  Phone, 
  User, 
  Building, 
  Clock,
  X,
  Send
} from 'lucide-react';

const TestMessageModal = ({ isOpen, onClose }) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('info');
  
  const [formData, setFormData] = useState({
    telefone: '',
    tipo: 'vez_chegou',
    dados_teste: {
      cliente: { nome: 'Cliente Teste' },
      barbearia: { nome: 'Lucas Barbearia' },
      posicao: 1,
      tempoEstimado: 15
    }
  });

  const whatsappAdmin = new WhatsAppAdmin(user?.token || localStorage.getItem('authToken'));

  const messageTypes = [
    { 
      value: 'vez_chegou', 
      label: 'Vez Chegou', 
      description: 'Notificação quando é a vez do cliente na fila',
      template: {
        cliente: { nome: 'João Silva' },
        barbearia: { nome: 'Lucas Barbearia' },
        posicao: 1,
        tempoEstimado: 15
      }
    },
    { 
      value: 'atendimento_iniciado', 
      label: 'Atendimento Iniciado', 
      description: 'Notificação quando o atendimento começa',
      template: {
        cliente: { nome: 'João Silva' },
        barbearia: { nome: 'Lucas Barbearia' },
        barbeiro: { nome: 'Pedro Santos' },
        servico: 'Corte + Barba'
      }
    },
    { 
      value: 'atendimento_finalizado', 
      label: 'Atendimento Finalizado', 
      description: 'Notificação quando o atendimento termina',
      template: {
        cliente: { nome: 'João Silva' },
        barbearia: { nome: 'Lucas Barbearia' },
        servico: 'Corte + Barba',
        valor: 35.00,
        avaliacao: 5
      }
    },
    { 
      value: 'lembrete', 
      label: 'Lembrete', 
      description: 'Lembrete de agendamento ou promoção',
      template: {
        cliente: { nome: 'João Silva' },
        barbearia: { nome: 'Lucas Barbearia' },
        mensagem: 'Promoção especial esta semana!'
      }
    }
  ];

  const handleTipoChange = (tipo) => {
    const selectedType = messageTypes.find(t => t.value === tipo);
    setFormData({
      ...formData,
      tipo,
      dados_teste: selectedType.template
    });
  };

  const handleInputChange = (field, value) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      setFormData({
        ...formData,
        dados_teste: {
          ...formData.dados_teste,
          [parent]: {
            ...formData.dados_teste[parent],
            [child]: value
          }
        }
      });
    } else {
      setFormData({
        ...formData,
        [field]: value
      });
    }
  };

  const handleTest = async () => {
    if (!formData.telefone) {
      showMessage('Digite um número de telefone', 'error');
      return;
    }

    setLoading(true);
    try {
      const response = await whatsappAdmin.testMessage(
        formData.telefone,
        formData.tipo,
        formData.dados_teste
      );
      
      if (response.success) {
        showMessage('Mensagem de teste enviada com sucesso!', 'success');
        onClose();
      } else {
        showMessage('Erro ao enviar mensagem de teste', 'error');
      }
    } catch (error) {
      console.error('Erro ao enviar mensagem de teste:', error);
      showMessage('Erro ao enviar mensagem de teste', 'error');
    } finally {
      setLoading(false);
    }
  };

  const showMessage = (msg, type = 'info') => {
    setMessage(msg);
    setMessageType(type);
    setTimeout(() => setMessage(''), 5000);
  };

  const formatPhoneNumber = (value) => {
    // Remove tudo que não é número
    const numbers = value.replace(/\D/g, '');
    
    // Formata como (XX) XXXXX-XXXX
    if (numbers.length <= 11) {
      return numbers.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
    }
    
    return value;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <MessageSquare className="w-6 h-6 text-blue-500" />
              <h2 className="text-xl font-semibold">🧪 Testar Mensagem WhatsApp</h2>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              disabled={loading}
            >
              <X className="w-5 h-5" />
            </Button>
          </div>

          {/* Mensagens */}
          {message && (
            <Alert variant={messageType === 'error' ? 'destructive' : 'default'} className="mb-4">
              {message}
            </Alert>
          )}

          <div className="space-y-6">
            {/* Telefone */}
            <div>
              <Label htmlFor="telefone" className="flex items-center space-x-2">
                <Phone className="w-4 h-4" />
                <span>Número de Telefone</span>
              </Label>
              <Input
                id="telefone"
                type="tel"
                placeholder="(11) 99999-9999"
                value={formData.telefone}
                onChange={(e) => handleInputChange('telefone', formatPhoneNumber(e.target.value))}
                className="mt-1"
                disabled={loading}
              />
              <p className="text-xs text-gray-500 mt-1">
                Digite o número que receberá a mensagem de teste
              </p>
            </div>

            {/* Tipo de Mensagem */}
            <div>
              <Label htmlFor="tipo" className="flex items-center space-x-2">
                <MessageSquare className="w-4 h-4" />
                <span>Tipo de Mensagem</span>
              </Label>
              <Select
                value={formData.tipo}
                onValueChange={handleTipoChange}
                disabled={loading}
              >
                <option value="">Selecione o tipo</option>
                {messageTypes.map(type => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </Select>
              {formData.tipo && (
                <p className="text-xs text-gray-500 mt-1">
                  {messageTypes.find(t => t.value === formData.tipo)?.description}
                </p>
              )}
            </div>

            {/* Dados de Teste */}
            {formData.tipo && (
              <div className="space-y-4">
                <h3 className="font-medium text-gray-900">Dados de Teste</h3>
                
                {/* Cliente */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="cliente-nome" className="flex items-center space-x-2">
                      <User className="w-4 h-4" />
                      <span>Nome do Cliente</span>
                    </Label>
                    <Input
                      id="cliente-nome"
                      value={formData.dados_teste.cliente?.nome || ''}
                      onChange={(e) => handleInputChange('cliente.nome', e.target.value)}
                      className="mt-1"
                      disabled={loading}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="barbearia-nome" className="flex items-center space-x-2">
                      <Building className="w-4 h-4" />
                      <span>Nome da Barbearia</span>
                    </Label>
                    <Input
                      id="barbearia-nome"
                      value={formData.dados_teste.barbearia?.nome || ''}
                      onChange={(e) => handleInputChange('barbearia.nome', e.target.value)}
                      className="mt-1"
                      disabled={loading}
                    />
                  </div>
                </div>

                {/* Dados específicos por tipo */}
                {formData.tipo === 'vez_chegou' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="posicao">Posição na Fila</Label>
                      <Input
                        id="posicao"
                        type="number"
                        value={formData.dados_teste.posicao || ''}
                        onChange={(e) => handleInputChange('posicao', parseInt(e.target.value))}
                        className="mt-1"
                        disabled={loading}
                      />
                    </div>
                    <div>
                      <Label htmlFor="tempoEstimado" className="flex items-center space-x-2">
                        <Clock className="w-4 h-4" />
                        <span>Tempo Estimado (min)</span>
                      </Label>
                      <Input
                        id="tempoEstimado"
                        type="number"
                        value={formData.dados_teste.tempoEstimado || ''}
                        onChange={(e) => handleInputChange('tempoEstimado', parseInt(e.target.value))}
                        className="mt-1"
                        disabled={loading}
                      />
                    </div>
                  </div>
                )}

                {formData.tipo === 'atendimento_iniciado' && (
                  <div>
                    <Label htmlFor="barbeiro-nome">Nome do Barbeiro</Label>
                    <Input
                      id="barbeiro-nome"
                      value={formData.dados_teste.barbeiro?.nome || ''}
                      onChange={(e) => handleInputChange('barbeiro.nome', e.target.value)}
                      className="mt-1"
                      disabled={loading}
                    />
                  </div>
                )}

                {formData.tipo === 'atendimento_finalizado' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="servico">Serviço Realizado</Label>
                      <Input
                        id="servico"
                        value={formData.dados_teste.servico || ''}
                        onChange={(e) => handleInputChange('servico', e.target.value)}
                        className="mt-1"
                        disabled={loading}
                      />
                    </div>
                    <div>
                      <Label htmlFor="valor">Valor (R$)</Label>
                      <Input
                        id="valor"
                        type="number"
                        step="0.01"
                        value={formData.dados_teste.valor || ''}
                        onChange={(e) => handleInputChange('valor', parseFloat(e.target.value))}
                        className="mt-1"
                        disabled={loading}
                      />
                    </div>
                  </div>
                )}

                {formData.tipo === 'lembrete' && (
                  <div>
                    <Label htmlFor="mensagem">Mensagem Personalizada</Label>
                    <Textarea
                      id="mensagem"
                      value={formData.dados_teste.mensagem || ''}
                      onChange={(e) => handleInputChange('mensagem', e.target.value)}
                      className="mt-1"
                      rows={3}
                      disabled={loading}
                      placeholder="Digite a mensagem personalizada..."
                    />
                  </div>
                )}
              </div>
            )}

            {/* Preview da Mensagem */}
            {formData.tipo && (
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-2">Preview da Mensagem:</h4>
                <div className="bg-white p-3 rounded border text-sm">
                  <p><strong>Para:</strong> {formData.telefone || '(Número não informado)'}</p>
                  <p><strong>Tipo:</strong> {messageTypes.find(t => t.value === formData.tipo)?.label}</p>
                  <p><strong>Dados:</strong></p>
                  <pre className="text-xs bg-gray-100 p-2 rounded mt-1 overflow-x-auto">
                    {JSON.stringify(formData.dados_teste, null, 2)}
                  </pre>
                </div>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-3 mt-6 pt-4 border-t">
            <Button
              variant="outline"
              onClick={onClose}
              disabled={loading}
            >
              Cancelar
            </Button>
            <Button
              onClick={handleTest}
              disabled={loading || !formData.telefone || !formData.tipo}
              className="flex items-center space-x-2"
            >
              {loading ? (
                <LoadingSpinner className="w-4 h-4" />
              ) : (
                <Send className="w-4 h-4" />
              )}
              <span>Enviar Teste</span>
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default TestMessageModal; 