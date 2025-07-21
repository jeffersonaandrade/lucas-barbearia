// Tipos para configuração do site
export interface SiteConfig {
  name: string;
  title: string;
  description: string;
  keywords: string;
  contact: ContactInfo;
  whatsappMessages: WhatsAppMessages;
  stats: Stats;
  navigation: NavigationItem[];
  trustIndicators: string[];
}

export interface ContactInfo {
  whatsapp: string;
  whatsappFormatted: string;
  instagram: string;
  instagramUrl: string;
  email: string;
  address: string;
  schedule: string;
  consultationPrice: string;
}

export interface WhatsAppMessages {
  schedule: string;
  scheduleChild: string;
  questions: string;
  respiratoryQuestions: string;
  testimonials: string;
  videos: string;
  courses: string;
  courseInfo: (courseTitle: string) => string;
  courseEnrollment: (courseTitle: string) => string;
}

export interface Stats {
  experience: string;
  followers: string;
  rating: number;
}

export interface NavigationItem {
  label: string;
  href: string;
}

// Tipos para FAQ
export interface FAQItem {
  question: string;
  answer: string;
}

// Tipos para depoimentos
export interface Testimonial {
  id: number;
  name: string;
  childName: string;
  content: string;
  rating: number;
  condition: string;
  image: string;
}

// Tipos para cursos
export interface Course {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  duration: string;
  format: string;
  price: string;
  status: string;
  features: string[];
  target: string;
  level: string;
}

// Tipos para vídeos
export interface Video {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  duration: string;
  category: string;
}

// Tipos para hooks
export interface IntersectionObserverOptions {
  threshold?: number;
  rootMargin?: string;
  root?: Element | null;
}

// Tipos para componentes
export interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'default' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
}

export interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
} 