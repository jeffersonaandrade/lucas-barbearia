import { Calendar } from 'lucide-react';
import { memo } from 'react';

const CalendlyFloat = memo(() => {
  const handleCalendlyClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Adiciona delay para evitar conflitos em dispositivos móveis
    setTimeout(() => {
      window.open('https://calendly.com/ronaldocinebox1/30min', '_blank');
    }, 100);
  };

  return (
    <button
      onClick={handleCalendlyClick}
      onTouchStart={(e) => e.preventDefault()} // Previne comportamento padrão do touch
      className="calendly-float focus:outline-none focus:ring-4 focus:ring-blue-500 focus:ring-opacity-50 w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16"
      aria-label="Agendar consulta pelo Calendly"
      title="Agendar consulta pelo Calendly"
      style={{ 
        WebkitTapHighlightColor: 'transparent',
        touchAction: 'manipulation'
      }}
    >
      <Calendar className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 text-white" />
    </button>
  );
});

CalendlyFloat.displayName = 'CalendlyFloat';

export default CalendlyFloat; 