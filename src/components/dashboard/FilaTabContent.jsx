import { Button } from '@/components/ui/button.jsx';
import { RefreshCw } from 'lucide-react';
import ActionButtons from './ActionButtons.jsx';
import FilaManager from '@/components/ui/fila-manager.jsx';

const FilaTabContent = ({
  barbeariaAtual,
  barbeiroAtual,
  fila,
  filaLoading,
  atendendoAtual,
  setAtendendoAtual,
  isBarbeiroAtivo,
  onChamarProximo,
  onFinalizarAtendimento,
  onAdicionarCliente,
  onRemoverClienteNaoApareceu,
  onRemoverCliente,
  onIniciarAtendimento,
  onAtualizarFilaManual,
  onHistoricoAtualizado
}) => {
  return (
    <>
      {/* Ações Rápidas */}
      <div className="mb-6 sm:mb-8">
        <ActionButtons
          onChamarProximo={onChamarProximo}
          onFinalizarAtendimento={onFinalizarAtendimento}
          onAdicionarCliente={onAdicionarCliente}
          onRemoverClienteNaoApareceu={onRemoverClienteNaoApareceu}
          atendendoAtual={atendendoAtual}
          loading={filaLoading}
          disabled={!barbeariaAtual || !isBarbeiroAtivo(barbeariaAtual?.id)}
        />
        
        {/* Botão de atualização manual */}
        <div className="mt-4 flex justify-center">
          <Button
            onClick={onAtualizarFilaManual}
            disabled={filaLoading}
            variant="outline"
            size="sm"
            className="flex items-center gap-2"
          >
            <RefreshCw className={`h-4 w-4 ${filaLoading ? 'animate-spin' : ''}`} />
            Atualizar Fila Manualmente
          </Button>
        </div>
      </div>

      {/* Gerenciador de Fila */}
      <FilaManager
        barbeariaAtual={barbeariaAtual}
        barbeiroAtual={barbeiroAtual}
        userRole="barbeiro"
        fila={fila}
        loading={filaLoading}
        onChamarProximo={onChamarProximo}
        onFinalizarAtendimento={onFinalizarAtendimento}
        onAdicionarCliente={onAdicionarCliente}
        onRemoverCliente={onRemoverCliente}
        onIniciarAtendimento={onIniciarAtendimento}
        atendendoAtual={atendendoAtual}
        setAtendendoAtual={setAtendendoAtual}
        onHistoricoAtualizado={onHistoricoAtualizado}
      />
    </>
  );
};

export default FilaTabContent; 