export const siteConfig = {
  // Informações básicas
  name: "Respirar",
  title: "Respirar - Fisioterapia Respiratória Infantil | Joanna Bomfim | Recife",
  description: "Fisioterapia respiratória infantil com atendimento domiciliar em Recife. Especialista em problemas respiratórios em crianças. Agende sua consulta com a Tia Jow.",
  keywords: "fisioterapia respiratória, fisioterapia infantil, atendimento domiciliar, Joanna Bomfim, cuidado respiratório, Recife, problemas respiratórios crianças, bronquite infantil, asma infantil, fisioterapeuta respiratória, Tia Jow, fisioterapia domiciliar Recife",
  
  // SEO Avançado
  seo: {
    title: "Fisioterapia Respiratória Infantil Recife | Joanna Bomfim - Atendimento Domiciliar",
    description: "Especialista em fisioterapia respiratória infantil em Recife. Atendimento domiciliar para crianças com problemas respiratórios. Agende com a Tia Jow.",
    keywords: [
      "fisioterapia respiratória infantil",
      "fisioterapeuta respiratória Recife", 
      "atendimento domiciliar fisioterapia",
      "problemas respiratórios crianças",
      "bronquite infantil tratamento",
      "asma infantil fisioterapia",
      "Joanna Bomfim fisioterapeuta",
      "Tia Jow fisioterapia",
      "fisioterapia domiciliar Recife",
      "respiração infantil",
      "fisioterapia pediátrica",
      "tratamento respiratório crianças"
    ],
    localBusiness: {
      name: "Respirar - Fisioterapia Respiratória Infantil",
      address: "Recife, Pernambuco, Brasil",
      phone: "+5511999999999",
      email: "contato@respirarjoanna.com",
      website: "https://respirarjoanna.com",
      latitude: "-8.0476",
      longitude: "-34.8770",
      serviceArea: "Recife e Região Metropolitana",
      businessHours: "Segunda a Sexta, 8h às 18h"
    }
  },
  
  // Contato
  contact: {
    whatsapp: "5511999999999",
    whatsappFormatted: "(11) 99999-9999",
    instagram: "@respirarporjoannabomfim",
    instagramUrl: "https://instagram.com/respirarporjoannabomfim",
    email: "contato@respirarjoanna.com",
    address: "Recife e Região Metropolitana",
    schedule: "Segunda a Sexta, 8h às 18h",
    consultationPrice: "R$ 280,00",
    consultationDuration: "45 a 60 minutos por sessão",
    serviceArea: "Recife e Região Metropolitana"
  },
  
  // URLs
  urls: {
    whatsapp: "https://wa.me/5511999999999",
    instagram: "https://instagram.com/respirarporjoannabomfim",
    email: "contato@respirarjoanna.com",
    calendly: "https://calendly.com/ronaldocinebox1/30min"
  },
  
  // Mensagens de WhatsApp
  whatsappMessages: {
    schedule: "Olá! Gostaria de agendar uma consulta com a Joanna.",
    scheduleChild: "Olá! Gostaria de agendar uma consulta com a Joanna para meu filho.",
    hero: "Olá! Vi o site da Tia Jow e gostaria de falar sobre fisioterapia respiratória para meu filho.",
    questions: "Olá! Tenho algumas dúvidas sobre o atendimento.",
    respiratoryQuestions: "Olá! Tenho algumas dúvidas sobre o atendimento de fisioterapia respiratória.",
    testimonials: "Olá! Vi os depoimentos e gostaria de agendar uma consulta para meu filho.",
    videos: "Olá! Gostaria de receber mais informações sobre os vídeos e dicas.",
    courses: "Olá! Gostaria de receber informações sobre novos cursos.",
    courseInfo: (courseTitle) => `Olá! Gostaria de mais informações sobre o curso "${courseTitle}".`,
    courseEnrollment: (courseTitle) => `Olá! Gostaria de me inscrever no curso "${courseTitle}".`
  },
  
  // Estatísticas
  stats: {
    experience: "10+",
    followers: "2.375",
    rating: 5
  },
  
  // Navegação
  navigation: [
    { label: 'Início', href: '#home' },
    { label: 'Sobre', href: '#about' },
    { label: 'Dicas em Vídeo', href: '#videos' },
    { label: 'Cursos', href: '#courses' },
    { label: 'Depoimentos', href: '#testimonials' },
    { label: 'FAQ', href: '#faq' },
    { label: 'Contato', href: '#contact' }
  ],
  
  // Indicadores de confiança
  trustIndicators: [
    "Atendimento domiciliar",
    "Cuidado humanizado"
  ],
  
  // Informações de consulta
  consultation: {
    duration: "45 a 60 minutos por sessão",
    area: "Recife e Região Metropolitana",
    scheduling: "Agendamento via WhatsApp",
    benefits: [
      "Atendimento domiciliar",
      "Avaliação completa",
      "Técnicas personalizadas",
      "Orientação para pais",
      "Acompanhamento"
    ]
  },
  
  // Informações de contato estruturadas
  contactInfo: [
    {
      icon: "Phone",
      title: 'WhatsApp',
      content: '(11) 99999-9999',
      description: 'Atendimento de segunda a sexta',
      action: 'whatsapp',
      messageType: 'schedule'
    },
    {
      icon: "Instagram", 
      title: 'Instagram',
      content: '@respirarporjoannabomfim',
      description: 'Dicas semanais e conteúdo educativo',
      action: 'instagram'
    },
    {
      icon: "MapPin",
      title: 'Atendimento',
      content: 'Domiciliar',
      description: 'Recife e Região Metropolitana',
      action: null
    },
    {
      icon: "Clock",
      title: 'Horários',
      content: 'Segunda a Sexta',
      description: '8h às 18h',
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