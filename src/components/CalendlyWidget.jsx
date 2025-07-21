import { useEffect } from 'react';
import { Calendar, X } from 'lucide-react';
import { Button } from '@/components/ui/button.jsx';
import { siteConfig } from '@/config/site.js';

const CalendlyWidget = ({ isOpen, onClose }) => {
  useEffect(() => {
    if (isOpen) {
      // Carrega o script do Calendly
      const script = document.createElement('script');
      script.src = 'https://assets.calendly.com/assets/external/widget.js';
      script.async = true;
      document.body.appendChild(script);

      return () => {
        // Remove o script quando o componente for desmontado
        const existingScript = document.querySelector('script[src*="calendly"]');
        if (existingScript) {
          document.body.removeChild(existingScript);
        }
      };
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-primary to-accent p-6 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Calendar className="w-6 h-6" />
              <div>
                <h2 className="text-2xl font-bold">Agendar Consulta</h2>
                <p className="text-white/90 mt-1">
                  Escolha o melhor horário para sua consulta
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="text-white hover:bg-white/20"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* Calendly Widget */}
        <div className="p-6">
          <div 
            className="calendly-inline-widget" 
            data-url={siteConfig.urls.calendly}
            style={{ minWidth: '320px', height: '600px' }}
          />
        </div>
      </div>
    </div>
  );
};

export default CalendlyWidget; 