import { MessageCircle } from 'lucide-react';
import { memo } from 'react';
import { openWhatsApp } from '@/config/site.js';

const WhatsAppFloat = memo(() => {
  const handleWhatsAppClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Adiciona delay para evitar conflitos em dispositivos móveis
    setTimeout(() => {
      openWhatsApp('Olá! Gostaria de falar com a Tia Jow.');
    }, 100);
  };

  return (
    <button
      onClick={handleWhatsAppClick}
      onTouchStart={(e) => e.preventDefault()} // Previne comportamento padrão do touch
      className="whatsapp-float focus:outline-none focus:ring-4 focus:ring-green-500 focus:ring-opacity-50 w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16"
      aria-label="Falar com a Tia Jow pelo WhatsApp"
      title="Falar com a Tia Jow pelo WhatsApp"
      style={{ 
        WebkitTapHighlightColor: 'transparent',
        touchAction: 'manipulation'
      }}
    >
      <MessageCircle className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 text-white" />
    </button>
  );
});

WhatsAppFloat.displayName = 'WhatsAppFloat';

export default WhatsAppFloat;

