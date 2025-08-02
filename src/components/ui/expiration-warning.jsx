import { useState, useEffect } from 'react';
import { AlertTriangle, Clock } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert.jsx';
import { CookieManager } from '@/utils/cookieManager.js';

const ExpirationWarning = () => {
  const [remainingTime, setRemainingTime] = useState(0);
  const [showWarning, setShowWarning] = useState(false);

  useEffect(() => {
    const updateRemainingTime = () => {
      const time = CookieManager.getFilaDataRemainingTime();
      setRemainingTime(time);
      
      // Mostrar aviso quando restar menos de 30 minutos
      setShowWarning(time > 0 && time < 30 * 60 * 1000);
    };

    // Atualizar imediatamente
    updateRemainingTime();

    // Atualizar a cada minuto
    const interval = setInterval(updateRemainingTime, 60 * 1000);

    return () => clearInterval(interval);
  }, []);

  if (!showWarning) {
    return null;
  }

  const hours = Math.floor(remainingTime / (60 * 60 * 1000));
  const minutes = Math.floor((remainingTime % (60 * 60 * 1000)) / (60 * 1000));

  const getWarningMessage = () => {
    if (hours > 0) {
      return `Seus dados da fila expiram em ${hours}h ${minutes}m. Escaneie o QR code novamente para renovar.`;
    } else {
      return `Seus dados da fila expiram em ${minutes} minutos. Escaneie o QR code novamente para renovar.`;
    }
  };

  const getAlertVariant = () => {
    if (remainingTime < 5 * 60 * 1000) { // Menos de 5 minutos
      return 'destructive';
    } else if (remainingTime < 15 * 60 * 1000) { // Menos de 15 minutos
      return 'default';
    } else {
      return 'secondary';
    }
  };

  return (
    <Alert variant={getAlertVariant()} className="mb-4">
      <AlertTriangle className="h-4 w-4" />
      <AlertDescription className="flex items-center justify-between">
        <span>{getWarningMessage()}</span>
        <div className="flex items-center text-sm">
          <Clock className="h-4 w-4 mr-1" />
          {hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`}
        </div>
      </AlertDescription>
    </Alert>
  );
};

export default ExpirationWarning; 