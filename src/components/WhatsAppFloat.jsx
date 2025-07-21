import { MessageCircle } from 'lucide-react';
import { memo } from 'react';
import ActionButton from '@/components/ui/action-button.jsx';

const WhatsAppFloat = memo(() => {
  return (
    <ActionButton
      action="whatsapp"
      messageType="hero"
      customMessage="Olá! Gostaria de falar com a Tia Jow."
      delay={100}
      icon={MessageCircle}
      className="whatsapp-float focus:outline-none focus:ring-4 focus:ring-green-500 focus:ring-opacity-50 w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16"
      aria-label="Falar com a Tia Jow pelo WhatsApp"
      title="Falar com a Tia Jow pelo WhatsApp"
    />
  );
});

WhatsAppFloat.displayName = 'WhatsAppFloat';

export default WhatsAppFloat;

