import { Instagram, MessageCircle, Phone, Clock, MapPin } from 'lucide-react';
import { Logo } from '@/components/ui/logo.jsx';
import { siteConfig } from '@/config/site.js';
import { useWhatsApp } from '@/hooks/use-whatsapp.js';
import { useScroll } from '@/hooks/use-scroll.js';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const { handleContactAction } = useWhatsApp();
  const { scrollToSection } = useScroll();

  const handleNavigation = (href) => {
    scrollToSection(href);
  };

  return (
    <footer className="bg-foreground text-white">
      <div className="container mx-auto section-padding">
        <div className="grid md:grid-cols-3 gap-12">
          {/* Brand */}
          <div className="space-y-6">
            <Logo size="lg" variant="full" className="text-white" />
            
            <p className="text-white/70 text-sm leading-relaxed">
              Sistema de filas inteligente para barbearia. Entre na fila online, 
              acompanhe sua posição em tempo real e chegue na hora certa. 
              Tecnologia a serviço da tradição.
            </p>
          </div>

          {/* Links Rápidos */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold">Links Rápidos</h3>
            <nav className="space-y-3">
              {siteConfig.navigation.map((link) => (
                <button
                  key={link.label}
                  onClick={() => handleNavigation(link.href)}
                  className="block text-white/70 hover:text-white transition-colors text-sm"
                >
                  {link.label}
                </button>
              ))}
            </nav>
          </div>

          {/* Contato */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold">Contato</h3>
            
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <MessageCircle className="w-5 h-5 text-primary" />
                <div>
                  <p className="text-sm font-medium">WhatsApp</p>
                  <p className="text-white/70 text-sm">{siteConfig.contact.whatsappFormatted}</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <Instagram className="w-5 h-5 text-primary" />
                <div>
                  <p className="text-sm font-medium">Instagram</p>
                  <p className="text-white/70 text-sm">{siteConfig.contact.instagram}</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <Phone className="w-5 h-5 text-primary" />
                <div>
                  <p className="text-sm font-medium">Atendimento</p>
                  <p className="text-white/70 text-sm">Barbearia - {siteConfig.contact.address}</p>
                </div>
              </div>
            </div>

            {/* Redes Sociais */}
            <div className="space-y-3">
              <p className="text-sm font-medium">Siga nas redes sociais</p>
              <div className="flex space-x-3">
                <button
                  onClick={() => handleContactAction('instagram')}
                  className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center hover:bg-primary transition-colors"
                  aria-label="Seguir no Instagram"
                >
                  <Instagram className="w-5 h-5" />
                </button>

              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/20 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-white/70 text-sm">
              © {currentYear} Lucas Barbearia - Sistema de Filas Inteligente. Todos os direitos reservados.
            </div>
            
            <div className="flex items-center space-x-6 text-white/70 text-sm">
                <div className="space-y-2 text-sm">
                  <div className="flex items-center space-x-2">
                    <Clock className="w-4 h-4 text-primary" />
                    <span>15 min por atendimento</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <MapPin className="w-4 h-4 text-primary" />
                    <span>São Paulo, SP</span>
                  </div>
                </div>
            </div>
          </div>
          
          {/* Crédito do Criador */}
          <div className="border-t border-white/10 mt-6 pt-6">
            <div className="flex flex-col sm:flex-row justify-center items-center space-y-2 sm:space-y-0 sm:space-x-4 text-white/60 text-xs">
              <span>© {currentYear} Desenvolvimento do site - Todos os direitos reservados a</span>
              <a 
                href="https://www.instagram.com/jeffersonaandrade10/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center space-x-2 hover:text-primary transition-colors font-medium"
              >
                <span>Jefferson Andrade</span>
                <Instagram className="w-3 h-3" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

