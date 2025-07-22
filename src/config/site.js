export const siteConfig = {
  // Informações básicas
  name: "Lucas Barbearia",
  title: "Lucas Barberia - Sistema de Filas | Barbearia Moderna | São Paulo",
  description: "Sistema de filas inteligente para barbearia. Entre na fila online, acompanhe sua posição e chegue na hora certa.",
  keywords: "barbearia, sistema de filas, fila online, Lucas Barbearia, barbearia São Paulo, agendamento fila, acompanhar fila",
  
  // SEO Avançado
  seo: {
    title: "Lucas Barbearia São Paulo | Cortes Masculinos e Barba - Agendamento Online",
    description: "Barbearia moderna em São Paulo. Cortes masculinos, barba e serviços premium. Agende seu horário online com o Lucas.",
    keywords: [
      "barbearia São Paulo",
      "corte masculino",
      "barba",
      "Lucas barbearia",
      "barbearia moderna",
      "agendamento barbearia",
      "corte tradicional",
      "barbearia premium",
      "serviços barbearia",
      "corte degradê",
      "barbearia masculina",
      "corte personalizado"
    ],
    localBusiness: {
      name: "Lucas Barbearia",
      address: "São Paulo, SP, Brasil",
      phone: "+5511999999999",
      email: "contato@lucasbarbearia.com",
      website: "https://lucasbarbearia.com",
      latitude: "-23.5505",
      longitude: "-46.6333",
      serviceArea: "São Paulo e Região",
      businessHours: "Segunda a Sábado, 9h às 19h"
    }
  },
  
  // Contato
  contact: {
    whatsapp: "5511999999999",
    whatsappFormatted: "(11) 99999-9999",
    instagram: "@lucasbarbearia",
    instagramUrl: "https://instagram.com/lucasbarbearia",
    email: "contato@lucasbarbearia.com",
    address: "São Paulo, SP",
    schedule: "Segunda a Sábado, 9h às 19h",
    consultationPrice: "R$ 35,00",
    consultationDuration: "30 a 45 minutos por sessão",
    serviceArea: "São Paulo e Região"
  },
  
  // URLs
  urls: {
    whatsapp: "https://wa.me/5511999999999",
    instagram: "https://instagram.com/lucasbarbearia",
    email: "contato@lucasbarbearia.com",
    calendly: "https://calendly.com/lucasbarbearia/30min"
  },
  
  // Mensagens de WhatsApp (importadas de messages.js)
  whatsappMessages: {
    schedule: "Olá! Gostaria de agendar um horário na barbearia.",
    scheduleHaircut: "Olá! Gostaria de agendar um corte de cabelo.",
    hero: "Olá! Vi o site da Lucas Barbearia e gostaria de agendar um horário.",
    questions: "Olá! Tenho algumas dúvidas sobre os serviços.",
    serviceQuestions: "Olá! Tenho algumas dúvidas sobre os serviços da barbearia.",
    testimonials: "Olá! Vi os depoimentos e gostaria de agendar um horário.",
    gallery: "Olá! Gostaria de ver mais fotos dos trabalhos.",
    services: "Olá! Gostaria de receber informações sobre os serviços.",
    serviceInfo: (serviceTitle) => `Olá! Gostaria de mais informações sobre o serviço "${serviceTitle}".`,
    serviceBooking: (serviceTitle) => `Olá! Gostaria de agendar o serviço "${serviceTitle}".`
  },
  
  // Estatísticas
  stats: {
    experience: "5+",
    followers: "1.250",
    rating: 5
  },
  
  // Navegação
  navigation: [
    { label: 'Início', href: '#home' },
    { label: 'Sobre', href: '#about' },
    { label: 'Serviços', href: '#services' },
    { label: 'Depoimentos', href: '#testimonials' },
    { label: 'FAQ', href: '#faq' },
    { label: 'Contato', href: '#contact' }
  ],
  
  // Indicadores de confiança
  trustIndicators: [
    "Qualidade garantida",
    "Atendimento personalizado"
  ],
  
  // Informações de consulta
  consultation: {
    duration: "30 a 45 minutos por sessão",
    area: "São Paulo e Região",
    scheduling: "Agendamento via WhatsApp",
    benefits: [
      "Atendimento personalizado",
      "Produtos premium",
      "Técnicas modernas",
      "Ambiente confortável",
      "Resultado garantido"
    ]
  },
  
  // Informações de contato estruturadas
  contactInfo: [
    {
      icon: "Phone",
      title: 'WhatsApp',
      content: '(11) 99999-9999',
      description: 'Atendimento de segunda a sábado',
      action: 'whatsapp',
      messageType: 'schedule'
    },
    {
      icon: "Instagram", 
      title: 'Instagram',
      content: '@lucasbarbearia',
      description: 'Fotos dos trabalhos e novidades',
      action: 'instagram'
    },
    {
      icon: "MapPin",
      title: 'Localização',
      content: 'São Paulo, SP',
      description: 'Zona Central',
      action: null
    },
    {
      icon: "Clock",
      title: 'Horários',
      content: 'Segunda a Sábado',
      description: '9h às 19h',
      action: null
    }
  ]
};

// Função utilitária para gerar URLs do WhatsApp
export const getWhatsAppUrl = (message) => {
  const encodedMessage = encodeURIComponent(message);
  return `${siteConfig.urls.whatsapp}?text=${encodedMessage}`;
};

// Função para detectar se é dispositivo móvel
const isMobile = () => {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
};

// Função para detectar se é iOS
const isIOS = () => {
  return /iPad|iPhone|iPod/.test(navigator.userAgent);
};

// Função para abrir WhatsApp com melhor compatibilidade
export const openWhatsApp = (message) => {
  const url = getWhatsAppUrl(message);
  
  if (isMobile()) {
    // Em dispositivos móveis, tenta abrir o app diretamente
    try {
      // Para iOS, usa uma abordagem diferente
      if (isIOS()) {
        // Cria um link temporário e simula clique
        const link = document.createElement('a');
        link.href = url;
        link.target = '_blank';
        link.rel = 'noopener noreferrer';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } else {
        // Para Android e outros, usa window.location
        window.location.href = url;
      }
    } catch (error) {
      // Fallback para window.open
      window.open(url, '_blank');
    }
  } else {
    // Em desktop, usa window.open normalmente
    window.open(url, '_blank');
  }
};

// Função para abrir Instagram com melhor compatibilidade
export const openInstagram = () => {
  const url = siteConfig.urls.instagram;
  
  if (isMobile()) {
    try {
      if (isIOS()) {
        const link = document.createElement('a');
        link.href = url;
        link.target = '_blank';
        link.rel = 'noopener noreferrer';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } else {
        window.location.href = url;
      }
    } catch (error) {
      window.open(url, '_blank');
    }
  } else {
    window.open(url, '_blank');
  }
};

// Função para abrir email com melhor compatibilidade
export const openEmail = () => {
  const url = `mailto:${siteConfig.urls.email}`;
  
  if (isMobile()) {
    try {
      if (isIOS()) {
        const link = document.createElement('a');
        link.href = url;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } else {
        window.location.href = url;
      }
    } catch (error) {
      window.open(url, '_blank');
    }
  } else {
    window.open(url, '_blank');
  }
}; 