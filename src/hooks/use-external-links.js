import { useCallback } from 'react';
import { siteConfig } from '@/config/site.js';

// Função para detectar se é dispositivo móvel
const isMobile = () => {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
};

// Função para detectar se é iOS
const isIOS = () => {
  return /iPad|iPhone|iPod/.test(navigator.userAgent);
};

// Função universal para abrir links externos com compatibilidade
const openExternalLink = (url, options = {}) => {
  const {
    target = '_blank',
    features = 'noopener,noreferrer',
    delay = 0
  } = options;

  const openLink = () => {
    if (isMobile()) {
      try {
        if (isIOS()) {
          // Para iOS, cria um link temporário e simula clique
          const link = document.createElement('a');
          link.href = url;
          link.target = target;
          link.rel = features;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        } else {
          // Para Android e outros, usa window.location
          window.location.href = url;
        }
      } catch (error) {
        // Fallback para window.open
        window.open(url, target, features);
      }
    } else {
      // Em desktop, usa window.open normalmente
      window.open(url, target, features);
    }
  };

  if (delay > 0) {
    setTimeout(openLink, delay);
  } else {
    openLink();
  }
};

export const useExternalLinks = () => {
  // WhatsApp
  const openWhatsApp = useCallback((message, options = {}) => {
    const encodedMessage = encodeURIComponent(message);
    const url = `${siteConfig.urls.whatsapp}?text=${encodedMessage}`;
    openExternalLink(url, options);
  }, []);

  // Instagram
  const openInstagram = useCallback((options = {}) => {
    openExternalLink(siteConfig.urls.instagram, options);
  }, []);

  // Calendly
  const openCalendly = useCallback((options = {}) => {
    openExternalLink(siteConfig.urls.calendly, options);
  }, []);

  // Email
  const openEmail = useCallback((options = {}) => {
    const url = `mailto:${siteConfig.urls.email}`;
    openExternalLink(url, options);
  }, []);

  // Link genérico
  const openLink = useCallback((url, options = {}) => {
    openExternalLink(url, options);
  }, []);

  // Mensagens pré-definidas do WhatsApp
  const sendWhatsAppMessage = useCallback((messageType, customMessage = null, options = {}) => {
    const message = customMessage || siteConfig.whatsappMessages[messageType];
    if (message) {
      openWhatsApp(message, options);
    }
  }, [openWhatsApp]);

  // Mensagens de curso
  const sendCourseMessage = useCallback((courseTitle, type = 'courseInfo', options = {}) => {
    const message = siteConfig.whatsappMessages[type](courseTitle);
    openWhatsApp(message, options);
  }, [openWhatsApp]);

  return {
    openWhatsApp,
    openInstagram,
    openCalendly,
    openEmail,
    openLink,
    sendWhatsAppMessage,
    sendCourseMessage,
    whatsappNumber: siteConfig.contact.whatsappFormatted,
    isMobile: isMobile(),
    isIOS: isIOS()
  };
}; 