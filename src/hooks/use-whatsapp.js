import { useCallback } from 'react';
import { useExternalLinks } from './use-external-links.js';
import { siteConfig } from '@/config/site.js';

export const useWhatsApp = () => {
  const { sendWhatsAppMessage, sendCourseMessage, whatsappNumber } = useExternalLinks();

  // Mantém compatibilidade com código existente
  const sendMessage = useCallback((messageType, customMessage = null) => {
    sendWhatsAppMessage(messageType, customMessage);
  }, [sendWhatsAppMessage]);

  const openWhatsApp = useCallback((message) => {
    sendWhatsAppMessage('custom', message);
  }, [sendWhatsAppMessage]);

  // Função para lidar com ações de contato (compatibilidade)
  const handleContactAction = useCallback((action, context = 'general', serviceTitle = null) => {
    switch (action) {
      case 'whatsapp':
        let messageType = 'schedule';
        
        // Determinar o tipo de mensagem baseado no contexto
        if (context === 'hero') {
          messageType = 'hero';
        } else if (context === 'videos') {
          messageType = 'gallery';
        } else if (context === 'gallery') {
          messageType = 'gallery';
        } else if (context === 'serviceBooking' && serviceTitle) {
          // Usar função específica para agendamento de serviço
          sendCourseMessage(serviceTitle, 'serviceBooking');
          return;
        } else if (context === 'serviceInfo' && serviceTitle) {
          // Usar função específica para informações de serviço
          sendCourseMessage(serviceTitle, 'serviceInfo');
          return;
        }
        
        sendWhatsAppMessage(messageType);
        break;
        
      case 'instagram':
        // Abrir Instagram
        window.open(siteConfig.urls.instagram, '_blank');
        break;
        
      case 'email':
        // Abrir email
        window.open(`mailto:${siteConfig.urls.email}`, '_blank');
        break;
        
      default:
        sendWhatsAppMessage('schedule');
    }
  }, [sendWhatsAppMessage, sendCourseMessage]);

  return {
    sendMessage,
    sendCourseMessage,
    openWhatsApp,
    handleContactAction,
    whatsappNumber
  };
}; 