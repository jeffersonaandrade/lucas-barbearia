// Mensagens do WhatsApp
export const WHATSAPP_MESSAGES = {
  schedule: "Olá! Gostaria de agendar uma consulta com a Joanna.",
  scheduleChild: "Olá! Gostaria de agendar uma consulta com a Joanna para meu filho.",
  hero: "Olá! Vi o site da Tia Jow e gostaria de falar sobre fisioterapia respiratória para meu filho.",
  questions: "Olá! Tenho algumas dúvidas sobre o atendimento.",
  respiratoryQuestions: "Olá! Tenho algumas dúvidas sobre o atendimento de fisioterapia respiratória.",
  testimonials: "Olá! Vi os depoimentos e gostaria de agendar uma consulta para meu filho.",
  videos: "Olá! Gostaria de receber mais informações sobre os vídeos e dicas.",
  courses: "Olá! Gostaria de receber informações sobre novos cursos.",
  courseInfo: (courseTitle) => `Olá! Gostaria de mais informações sobre o curso "${courseTitle}".`,
  courseEnrollment: (courseTitle) => `Olá! Gostaria de me inscrever no curso "${courseTitle}".`,
  contact: "Olá! Gostaria de falar com a Tia Jow.",
  consultation: "Olá! Gostaria de mais informações sobre a consulta.",
  float: "Olá! Gostaria de falar com a Tia Jow."
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
  appointmentScheduled: "Consulta agendada com sucesso!",
  formSubmitted: "Formulário enviado com sucesso!"
};

// Textos de interface
export const UI_TEXTS = {
  buttons: {
    schedule: "Agendar Consulta",
    contact: "Falar com a Tia Jow",
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
    whatsapp: "Falar com a Tia Jow pelo WhatsApp",
    calendly: "Agendar consulta pelo Calendly",
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