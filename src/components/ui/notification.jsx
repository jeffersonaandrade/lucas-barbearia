import { useState, useEffect } from 'react';
import { Alert, AlertDescription } from './alert';
import { CheckCircle, XCircle, X } from 'lucide-react';

const Notification = ({ 
  type = 'success', 
  message, 
  duration = 5000, 
  onClose 
}) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        setIsVisible(false);
        onClose?.();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);

  if (!isVisible) return null;

  const icons = {
    success: CheckCircle,
    error: XCircle,
    warning: XCircle,
    info: CheckCircle
  };

  const variants = {
    success: 'border-green-200 bg-green-50 text-green-800',
    error: 'border-red-200 bg-red-50 text-red-800',
    warning: 'border-yellow-200 bg-yellow-50 text-yellow-800',
    info: 'border-blue-200 bg-blue-50 text-blue-800'
  };

  const Icon = icons[type];

  return (
    <div className={`fixed top-4 right-4 z-50 max-w-sm w-full`}>
      <Alert className={`${variants[type]} border shadow-lg`}>
        <div className="flex items-start gap-3">
          <Icon className="h-5 w-5 mt-0.5 flex-shrink-0" />
          <AlertDescription className="flex-1">
            {message}
          </AlertDescription>
          <button
            onClick={() => {
              setIsVisible(false);
              onClose?.();
            }}
            className="flex-shrink-0 p-1 hover:bg-black/10 rounded"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </Alert>
    </div>
  );
};

export default Notification; 