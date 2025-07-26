import { Button } from '@/components/ui/button.jsx';
import { Play, CheckCircle, UserPlus, X } from 'lucide-react';

const ActionButtons = ({ 
  onChamarProximo, 
  onFinalizarAtendimento, 
  onAdicionarCliente, 
  onRemoverClienteNaoApareceu,
  atendendoAtual,
  loading = false,
  disabled = false
}) => {
  const isDisabledByStatus = disabled && !loading;
  
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
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8 mt-4">
        <Button 
          onClick={onChamarProximo}
          disabled={loading || disabled}
          className="w-full"
        >
          <Play className="mr-2 h-4 w-4" />
          Chamar Próximo
        </Button>
        
        <Button 
          onClick={onFinalizarAtendimento}
          disabled={!atendendoAtual || loading || disabled}
          variant="outline"
          className="w-full"
        >
          <CheckCircle className="mr-2 h-4 w-4" />
          Finalizar Atendimento
        </Button>
        
        <Button 
          onClick={onAdicionarCliente}
          variant="outline"
          disabled={disabled}
          className="w-full"
        >
          <UserPlus className="mr-2 h-4 w-4" />
          Adicionar Cliente
        </Button>
        
        <Button 
          onClick={onRemoverClienteNaoApareceu}
          disabled={!atendendoAtual || loading || disabled}
          variant="destructive"
          className="w-full"
        >
          <X className="mr-2 h-4 w-4" />
          Não Apareceu
        </Button>
      </div>
    </div>
  );
};

export default ActionButtons; 