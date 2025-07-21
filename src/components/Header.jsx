import { useState, memo } from 'react';
import { Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button.jsx';
import { Logo } from '@/components/ui/logo.jsx';
import { siteConfig } from '@/config/site.js';
import { useScroll } from '@/hooks/use-scroll.js';
import { useWhatsApp } from '@/hooks/use-whatsapp.js';

const Header = memo(() => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { scrollToSection } = useScroll();
  const { sendMessage } = useWhatsApp();

  const handleNavigation = (href) => {
    scrollToSection(href, () => setIsMenuOpen(false));
  };

  const handleScheduleClick = () => {
    window.open('https://calendly.com/ronaldocinebox1/30min', '_blank');
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-border">
      <div className="container mx-auto px-3 sm:px-4 md:px-8 lg:px-16">
        <div className="flex items-center justify-between h-14 sm:h-16">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <Logo size="sm" variant="icon" />
            <span className="text-lg sm:text-xl font-bold text-foreground">
              RESPIRAR
            </span>
          </div>

          {/* Menu Desktop */}
          <nav className="hidden md:flex items-center space-x-6 lg:space-x-8">
            {siteConfig.navigation.map((item) => (
              <button
                key={item.label}
                onClick={() => handleNavigation(item.href)}
                className="text-sm lg:text-base text-muted-foreground hover:text-primary transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded"
                aria-label={`Navegar para ${item.label}`}
              >
                {item.label}
              </button>
            ))}
          </nav>

          {/* CTA Button Desktop */}
          <div className="hidden md:block">
            <Button 
              size="sm"
              className="gradient-primary text-white hover:opacity-90 transition-opacity text-sm"
              onClick={handleScheduleClick}
              aria-label="Agendar consulta pelo WhatsApp"
            >
              Agendar Consulta
            </Button>
          </div>

          {/* Menu Mobile Button */}
          <button
            className="md:hidden p-1.5 sm:p-2 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label={isMenuOpen ? "Fechar menu" : "Abrir menu"}
            aria-expanded={isMenuOpen}
          >
            {isMenuOpen ? (
              <X className="w-5 h-5 sm:w-6 sm:h-6 text-foreground" />
            ) : (
              <Menu className="w-5 h-5 sm:w-6 sm:h-6 text-foreground" />
            )}
          </button>
        </div>

        {/* Menu Mobile */}
        {isMenuOpen && (
          <div className="md:hidden absolute top-14 sm:top-16 left-0 right-0 bg-white border-b border-border shadow-lg">
            <nav className="flex flex-col py-2 sm:py-4" role="navigation" aria-label="Menu principal">
              {siteConfig.navigation.map((item) => (
                <button
                  key={item.label}
                  onClick={() => handleNavigation(item.href)}
                  className="px-3 sm:px-4 py-2.5 sm:py-3 text-left text-sm sm:text-base text-muted-foreground hover:text-primary hover:bg-secondary/50 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                  aria-label={`Navegar para ${item.label}`}
                >
                  {item.label}
                </button>
              ))}
              <div className="px-3 sm:px-4 py-2.5 sm:py-3">
                <Button 
                  size="sm"
                  className="w-full gradient-primary text-white hover:opacity-90 transition-opacity text-sm"
                  onClick={() => {
                    handleScheduleClick();
                    setIsMenuOpen(false);
                  }}
                  aria-label="Agendar consulta pelo WhatsApp"
                >
                  Agendar Consulta
                </Button>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
});

Header.displayName = 'Header';

export default Header;

