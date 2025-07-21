import { useCallback } from 'react';
import { openWhatsApp, siteConfig } from '@/config/site.js';

export const useWhatsApp = () => {
  const sendMessage = useCallback((messageType, customMessage = null) => {
    const message = customMessage || siteConfig.whatsappMessages[messageType];
    if (message) {
      openWhatsApp(message);
    }
  }, []);

  const sendCourseMessage = useCallback((courseTitle, type = 'courseInfo') => {
    const message = siteConfig.whatsappMessages[type](courseTitle);
    openWhatsApp(message);
  }, []);

  return {
    sendMessage,
    sendCourseMessage,
    openWhatsApp,
    whatsappNumber: siteConfig.contact.whatsappFormatted
  };
}; 