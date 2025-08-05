import { Button } from '@/components/ui/button.jsx';
import { Play, CheckCircle, UserPlus, X, UserCheck } from 'lucide-react';

const ActionButtons = ({ 
  onChamarProximo, 
  onIniciarAtendimento,
  onFinalizarAtendimento, 
  onAdicionarCliente, 
  onRemoverClienteNaoApareceu,
  atendendoAtual,
  loading = false,
  disabled = false
}) => {
  const isDisabledByStatus = disabled && !loading;
  
  // Verificar se o botão "Iniciar Atendimento" está habilitado
  const isIniciarAtendimentoEnabled = atendendoAtual && 
    (atendendoAtual?.status === 'proximo' || atendendoAtual?.status === 'proximo') && 
    !loading && 
    !disabled;
  
  return (
    <div className="space-y-4">
      {/* Mensagem quando desabilitado por status */}
      {isDisabledByStatus && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-yellow-700">
                <strong>Atenção:</strong> Você está inativo. Ative seu status para usar as ações.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Mensagem quando desabilitado por estar atendendo */}
      {atendendoAtual && (atendendoAtual.status === 'atendendo' || atendendoAtual.status === 'em_atendimento') && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-blue-700">
                <strong>Em Atendimento:</strong> Você está atendendo {atendendoAtual.nome}. Finalize o atendimento atual para chamar o próximo cliente.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Mensagem quando há cliente aguardando para iniciar atendimento */}
      {isIniciarAtendimentoEnabled && (
        <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-orange-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-orange-700">
                <strong>Cliente Aguardando:</strong> {atendendoAtual.nome} está aguardando para iniciar o atendimento. Inicie o atendimento ou remova o cliente antes de chamar o próximo.
              </p>
            </div>
          </div>
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8 mt-4">
        <Button 
          onClick={onChamarProximo}
          disabled={loading || disabled || (atendendoAtual && (atendendoAtual.status === 'atendendo' || atendendoAtual.status === 'em_atendimento')) || isIniciarAtendimentoEnabled}
          className="w-full bg-black text-white hover:bg-gray-800 border-black"
        >
          <Play className="mr-2 h-4 w-4" />
          Chamar Próximo
        </Button>
        
        <Button 
          onClick={onIniciarAtendimento}
          disabled={!atendendoAtual || (atendendoAtual?.status !== 'próximo' && atendendoAtual?.status !== 'proximo') || loading || disabled}
          className="w-full bg-green-600 text-white hover:bg-green-700 border-green-600"
        >
          <UserCheck className="mr-2 h-4 w-4" />
          Iniciar Atendimento
        </Button>
        
        <Button 
          onClick={onFinalizarAtendimento}
          disabled={!atendendoAtual || 
            (atendendoAtual?.status !== 'atendendo' && 
             atendendoAtual?.status !== 'em_atendimento') || 
            loading || 
            disabled}
          className="w-full bg-black text-white hover:bg-gray-800 border-black"
        >
          <CheckCircle className="mr-2 h-4 w-4" />
          Finalizar Atendimento
        </Button>
        
        <Button 
          onClick={onAdicionarCliente}
          disabled={disabled}
          className="w-full bg-black text-white hover:bg-gray-800 border-black"
        >
          <UserPlus className="mr-2 h-4 w-4" />
          Adicionar Cliente
        </Button>
        
        <Button 
          onClick={onRemoverClienteNaoApareceu}
          disabled={!atendendoAtual || (atendendoAtual?.status !== 'próximo' && atendendoAtual?.status !== 'proximo') || loading || disabled}
          className="w-full bg-red-600 text-white hover:bg-red-700 border-red-600"
        >
          <X className="mr-2 h-4 w-4" />
          Não Apareceu
        </Button>
      </div>
    </div>
  );
};

export default ActionButtons; 