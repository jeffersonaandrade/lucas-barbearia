import { useEffect } from 'react';
import { useFila } from '../hooks/useFila';

export const FilaStatus = () => {
  const { cliente, loading, checkStatus, sairFila } = useFila();

  useEffect(() => {
    // Verificar status a cada 30 segundos
    const interval = setInterval(checkStatus, 30000);
    return () => clearInterval(interval);
  }, [checkStatus]);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando...</p>
        </div>
      </div>
    );
  }

  if (!cliente) {
    return (
      <div className="text-center p-8">
        <div className="bg-gray-100 rounded-lg p-6 max-w-md mx-auto">
          <h3 className="text-xl font-semibold text-black mb-4">Você não está na fila</h3>
          <p className="text-gray-600 mb-6">
            Entre na fila para agendar seu horário de forma rápida e prática.
          </p>
          <button 
            onClick={() => window.location.href = '/fila/entrar'}
            className="bg-black text-white px-6 py-3 rounded-lg font-medium hover:bg-gray-800 transition-colors"
          >
            Entrar na Fila
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 max-w-md mx-auto">
      <div className="text-center space-y-4">
        <div className="w-16 h-16 bg-black rounded-full flex items-center justify-center mx-auto">
          <span className="text-white font-bold text-xl">
            {cliente.nome?.charAt(0) || 'C'}
          </span>
        </div>
        
        <div>
          <h3 className="text-xl font-semibold text-black">
            Olá, {cliente.nome || 'Cliente'}!
          </h3>
          <p className="text-gray-600">Seu status na fila</p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="bg-gray-100 rounded-lg p-4">
            <div className="text-2xl font-bold text-black">
              {cliente.posicao || 'N/A'}
            </div>
            <div className="text-sm text-gray-600">Posição na fila</div>
          </div>
          
          <div className="bg-gray-100 rounded-lg p-4">
            <div className="text-lg font-semibold text-black">
              {cliente.status || 'Aguardando'}
            </div>
            <div className="text-sm text-gray-600">Status</div>
          </div>
        </div>

        {cliente.tempoEstimado && (
          <div className="bg-gray-100 rounded-lg p-4">
            <div className="text-lg font-semibold text-black">
              {cliente.tempoEstimado}
            </div>
            <div className="text-sm text-gray-600">Tempo estimado</div>
          </div>
        )}

        <div className="flex space-x-4">
          <button 
            onClick={checkStatus}
            className="flex-1 bg-gray-100 text-black px-4 py-2 rounded-lg font-medium hover:bg-gray-200 transition-colors"
          >
            Atualizar
          </button>
          
          <button 
            onClick={sairFila}
            className="flex-1 bg-red-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-red-700 transition-colors"
          >
            Sair da Fila
          </button>
        </div>
      </div>
    </div>
  );
}; 