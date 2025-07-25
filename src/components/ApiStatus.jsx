import { useState } from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert.jsx';
import { Button } from '@/components/ui/button.jsx';
import { AlertCircle, Wifi, WifiOff, RefreshCw } from 'lucide-react';

const ApiStatus = ({ status, onRetry, className = '' }) => {
  const [retrying, setRetrying] = useState(false);

  const handleRetry = async () => {
    if (onRetry) {
      setRetrying(true);
      try {
        await onRetry();
      } finally {
        setRetrying(false);
      }
    }
  };

  if (status === 'available') {
    return (
      <div className={`p-3 bg-green-50 border border-green-200 rounded-lg ${className}`}>
        <div className="flex items-center space-x-2">
          <Wifi className="h-4 w-4 text-green-600" />
          <span className="text-sm font-medium text-green-800">
            Conectado ao servidor
          </span>
        </div>
      </div>
    );
  }

  if (status === 'checking') {
    return (
      <div className={`p-3 bg-yellow-50 border border-yellow-200 rounded-lg ${className}`}>
        <div className="flex items-center space-x-2">
          <RefreshCw className="h-4 w-4 text-yellow-600 animate-spin" />
          <span className="text-sm font-medium text-yellow-800">
            Verificando conexão...
          </span>
        </div>
      </div>
    );
  }

  if (status === 'unavailable') {
    return (
      <Alert variant="destructive" className={className}>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription className="flex items-center justify-between">
          <div>
            <p className="font-medium">Servidor indisponível</p>
            <p className="text-sm opacity-90">
              Não foi possível conectar ao servidor. Verifique sua conexão com a internet.
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={handleRetry}
            disabled={retrying}
            className="ml-4"
          >
            {retrying ? (
              <RefreshCw className="h-4 w-4 animate-spin" />
            ) : (
              <RefreshCw className="h-4 w-4" />
            )}
            <span className="ml-2">Tentar novamente</span>
          </Button>
        </AlertDescription>
      </Alert>
    );
  }

  return null;
};

export default ApiStatus; 