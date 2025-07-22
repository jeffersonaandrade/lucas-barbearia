// Mensagens do WhatsApp
export const WHATSAPP_MESSAGES = {
  schedule: "Olá! Gostaria de agendar um horário na barbearia.",
  scheduleHaircut: "Olá! Gostaria de agendar um corte de cabelo.",
  hero: "Olá! Vi o site da Lucas Barbearia e gostaria de agendar um horário.",
  questions: "Olá! Tenho algumas dúvidas sobre os serviços.",
  serviceQuestions: "Olá! Tenho algumas dúvidas sobre os serviços da barbearia.",
  testimonials: "Olá! Vi os depoimentos e gostaria de agendar um horário.",
  videos: "Olá! Gostaria de ver mais fotos dos trabalhos.",
  courses: "Olá! Gostaria de receber informações sobre novos cursos.",
  courseInfo: (courseTitle) => `Olá! Gostaria de mais informações sobre o curso "${courseTitle}".`,
  courseEnrollment: (courseTitle) => `Olá! Gostaria de me inscrever no curso "${courseTitle}".`,
  contact: "Olá! Gostaria de falar com a Lucas Barbearia.",
  consultation: "Olá! Gostaria de mais informações sobre os serviços.",
  float: "Olá! Gostaria de falar com a Lucas Barbearia."
};

// Mensagens de erro
export const ERROR_MESSAGES = {
  generic: "Ocorreu um erro. Tente novamente.",
  network: "Erro de conexão. Verifique sua internet.",
  loading: "Carregando...",
  notFound: "Conteúdo não encontrado."
};

// Mensagens de sucesso
export const SUCCESS_MESSAGES = {
  contactSent: "Mensagem enviada com sucesso!",
  appointmentScheduled: "Horário agendado com sucesso!",
  formSubmitted: "Formulário enviado com sucesso!"
};

// Textos de interface
export const UI_TEXTS = {
  buttons: {
    schedule: "Agendar Horário",
    contact: "Falar com a Barbearia",
    follow: "Seguir no Instagram",
    moreInfo: "Mais Informações",
    enroll: "Inscrever-se",
    preEnroll: "Pré-inscrição",
    watch: "Assistir",
    close: "Fechar",
    submit: "Enviar",
    cancel: "Cancelar"
  },
  labels: {
    loading: "Carregando...",
    error: "Erro",
    success: "Sucesso",
    required: "Obrigatório",
    optional: "Opcional"
  },
  aria: {
    menuOpen: "Abrir menu",
    menuClose: "Fechar menu",
    whatsapp: "Falar com a Lucas Barbearia pelo WhatsApp",
    calendly: "Agendar horário pelo Calendly",
    instagram: "Seguir no Instagram",
    email: "Enviar email"
  }
};

// Mensagens de validação
export const VALIDATION_MESSAGES = {
  required: "Este campo é obrigatório",
  email: "Digite um email válido",
  phone: "Digite um telefone válido",
  minLength: (min) => `Mínimo de ${min} caracteres`,
  maxLength: (max) => `Máximo de ${max} caracteres`
}; 