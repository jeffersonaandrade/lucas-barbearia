import { useState, memo } from 'react';
import { Link } from 'react-router-dom';
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



  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-border">
      <div className="container mx-auto px-4 sm:px-6 md:px-8 lg:px-16">
        <div className="flex items-center justify-between h-16 sm:h-18 lg:h-20">
          {/* Logo */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            <Logo size="sm" variant="icon" />
            <span className="text-base sm:text-lg md:text-xl font-bold text-foreground">
              LUCAS BARBEARIA
            </span>
          </div>

          {/* Menu Desktop - Ajustado para tablet */}
          <nav className="hidden lg:flex items-center space-x-4 xl:space-x-6">
            {siteConfig.navigation.slice(0, 4).map((item) => (
              <button
                key={item.label}
                onClick={() => handleNavigation(item.href)}
                className="text-sm xl:text-base text-muted-foreground hover:text-primary transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded px-2"
                aria-label={`Navegar para ${item.label}`}
              >
                {item.label}
              </button>
            ))}
            <Link 
              to="/barbearias"
              className="text-sm xl:text-base text-muted-foreground hover:text-primary transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded px-2"
            >
              Nossas Unidades
            </Link>

            <Link 
              to="/barbearia/1/visualizar-fila"
              className="text-sm xl:text-base text-muted-foreground hover:text-primary transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded px-2"
            >
              Ver Fila
            </Link>
          </nav>

          {/* CTA Button Desktop */}
          <div className="hidden lg:block">
            <Link to="/barbearias">
            <Button 
              size="sm"
                className="bg-primary text-primary-foreground hover:bg-accent hover:text-accent-foreground transition-colors text-sm px-4 py-2"
                aria-label="Ver nossas unidades"
            >
                Nossas Unidades
            </Button>
            </Link>
          </div>

          {/* Menu Mobile/Tablet Button */}
          <button
            className="lg:hidden p-2 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label={isMenuOpen ? "Fechar menu" : "Abrir menu"}
            aria-expanded={isMenuOpen}
          >
            {isMenuOpen ? (
              <X className="w-6 h-6 text-foreground" />
            ) : (
              <Menu className="w-6 h-6 text-foreground" />
            )}
          </button>
        </div>

        {/* Menu Mobile/Tablet */}
        {isMenuOpen && (
          <div className="lg:hidden absolute top-16 sm:top-18 lg:top-20 left-0 right-0 bg-white border-b border-border shadow-lg">
            <nav className="flex flex-col py-4" role="navigation" aria-label="Menu principal">
              {siteConfig.navigation.map((item) => (
                <button
                  key={item.label}
                  onClick={() => handleNavigation(item.href)}
                  className="px-4 py-3 text-left text-base text-muted-foreground hover:text-primary hover:bg-secondary/50 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                  aria-label={`Navegar para ${item.label}`}
                >
                  {item.label}
                </button>
              ))}
              <Link 
                to="/barbearias"
                onClick={() => setIsMenuOpen(false)}
                className="px-4 py-3 text-left text-base text-muted-foreground hover:text-primary hover:bg-secondary/50 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
              >
                Nossas Unidades
              </Link>

              <Link 
                to="/barbearia/1/visualizar-fila"
                onClick={() => setIsMenuOpen(false)}
                className="px-4 py-3 text-left text-base text-muted-foreground hover:text-primary hover:bg-secondary/50 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
              >
                Ver Fila
              </Link>
              <div className="px-4 py-3">
                <Link to="/barbearias" onClick={() => setIsMenuOpen(false)}>
                <Button 
                  size="sm"
                    className="w-full bg-primary text-primary-foreground hover:bg-accent hover:text-accent-foreground transition-colors text-sm"
                    aria-label="Ver nossas unidades"
                >
                    Nossas Unidades
                </Button>
                </Link>
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

