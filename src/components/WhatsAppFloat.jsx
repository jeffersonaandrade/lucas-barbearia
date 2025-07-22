import { MessageCircle } from 'lucide-react';
import { memo } from 'react';
import { useWhatsApp } from '@/hooks/use-whatsapp.js';

const WhatsAppFloat = memo(() => {
  const { handleContactAction } = useWhatsApp();

  return (
    <button
      onClick={() => handleContactAction('whatsapp', 'hero')}
      className="fixed bottom-6 right-6 z-50 w-14 h-14 sm:w-16 sm:h-16 bg-green-500 hover:bg-green-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center focus:outline-none focus:ring-4 focus:ring-green-500 focus:ring-opacity-50"
      aria-label="Falar com a Lucas Barbearia pelo WhatsApp"
      title="Falar com a Lucas Barbearia pelo WhatsApp"
    >
      <MessageCircle className="w-7 h-7 sm:w-8 sm:h-8" />
    </button>
  );
});

WhatsAppFloat.displayName = 'WhatsAppFloat';

export default WhatsAppFloat;

