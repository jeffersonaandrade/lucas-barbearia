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

  return {
    sendMessage,
    sendCourseMessage,
    openWhatsApp,
    whatsappNumber
  };
}; 