import { Calendar } from 'lucide-react';
import { memo } from 'react';
import ActionButton from '@/components/ui/action-button.jsx';

const CalendlyFloat = memo(() => {
  return (
    <ActionButton
      action="calendly"
      delay={100}
      icon={Calendar}
      className="calendly-float focus:outline-none focus:ring-4 focus:ring-blue-500 focus:ring-opacity-50 w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16"
      aria-label="Agendar consulta pelo Calendly"
      title="Agendar consulta pelo Calendly"
    />
  );
});

CalendlyFloat.displayName = 'CalendlyFloat';

export default CalendlyFloat; 