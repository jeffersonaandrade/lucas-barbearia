import { useCallback } from 'react';
import { openWhatsApp, openInstagram, openEmail, siteConfig } from '@/config/site.js';

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

  const handleContactAction = useCallback((action, messageType = null) => {
    switch (action) {
      case 'whatsapp':
        if (messageType) {
          sendMessage(messageType);
        } else {
          openWhatsApp(siteConfig.whatsappMessages.schedule);
        }
        break;
      case 'instagram':
        openInstagram();
        break;
      case 'email':
        openEmail();
        break;
      default:
        break;
    }
  }, [sendMessage]);

  return {
    sendMessage,
    sendCourseMessage,
    handleContactAction,
    openWhatsApp,
    openInstagram,
    openEmail,
    whatsappNumber: siteConfig.contact.whatsappFormatted,
    contactInfo: siteConfig.contactInfo
  };
}; 