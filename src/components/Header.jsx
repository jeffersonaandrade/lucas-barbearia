import { useState, memo, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, UserCheck, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button.jsx';
import { Logo } from '@/components/ui/logo.jsx';
import { siteConfig } from '@/config/site.js';
import { useScroll } from '@/hooks/use-scroll.js';
import { useWhatsApp } from '@/hooks/use-whatsapp.js';
import { useClienteToken } from '@/hooks/useClienteToken.js';
import { authUtils } from '@/utils/authUtils.js';
import { useIsLoginPage } from '@/hooks/useIsLoginPage.js';

const Header = memo(() => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  const [adminUser, setAdminUser] = useState(null);
  const { scrollToSection } = useScroll();
  const { sendMessage } = useWhatsApp();
  const navigate = useNavigate();
  const { hasToken, getStatusFilaUrl } = useClienteToken();
  const isLoginPage = useIsLoginPage();

  // Verificar se o usuário está autenticado como funcionário
  useEffect(() => {
    // Não verificar autenticação se estivermos na página de login
    if (isLoginPage) {
      setIsAdminAuthenticated(false);
      setAdminUser(null);
      return;
    }

    const checkAdminAuth = async () => {
      console.log('🔍 Header - checkAdminAuth: Iniciando verificação...');
      
      try {
        const authenticated = await authUtils.isAuthenticated();
        console.log('🔍 Header - checkAdminAuth: Resultado da autenticação:', authenticated);
        
        setIsAdminAuthenticated(authenticated);
        
        if (authenticated) {
          console.log('🔍 Header - checkAdminAuth: Obtendo dados do usuário...');
          const user = await authUtils.getCurrentUser();
          console.log('🔍 Header - checkAdminAuth: Dados do usuário:', user);
          setAdminUser(user);
        } else {
          console.log('🔍 Header - checkAdminAuth: Usuário não autenticado');
          setAdminUser(null);
        }
      } catch (error) {
        console.error('❌ Header - checkAdminAuth: Erro:', error);
        setIsAdminAuthenticated(false);
        setAdminUser(null);
      }
    };

    checkAdminAuth();
    
    // Verificar periodicamente (a cada 5 segundos) apenas se não estivermos na página de login
    const interval = setInterval(() => {
      if (!isLoginPage) {
        checkAdminAuth();
      }
    }, 5000);
    
    return () => clearInterval(interval);
  }, [isLoginPage]);

  const handleNavigation = (href) => {
    scrollToSection(href, () => setIsMenuOpen(false));
  };

  const handleMinhaFila = () => {
    const statusUrl = getStatusFilaUrl();
    if (statusUrl) {
      navigate(statusUrl);
      setIsMenuOpen(false);
    }
  };

  const handleAdminArea = () => {
    console.log('🔍 Header - handleAdminArea: Iniciando...');
    console.log('🔍 Header - handleAdminArea: isAdminAuthenticated:', isAdminAuthenticated);
    console.log('🔍 Header - handleAdminArea: adminUser:', adminUser);
    
    if (isAdminAuthenticated) {
      console.log('🔍 Header - handleAdminArea: Usuário autenticado, indo para dashboard');
      // Se está autenticado, vai direto para o dashboard
      navigate('/admin/dashboard');
    } else {
      console.log('🔍 Header - handleAdminArea: Usuário não autenticado, indo para login');
      // Se não está autenticado, vai para o login
      navigate('/admin/login');
    }
    setIsMenuOpen(false);
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

            {hasToken ? (
              <Button
                onClick={handleMinhaFila}
                variant="ghost"
                size="sm"
                className="text-sm xl:text-base text-primary hover:text-accent transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded px-2"
              >
                <UserCheck className="w-4 h-4 mr-1" />
                Minha Fila
              </Button>
            ) : (
              <Link 
                to="/barbearia/1/visualizar-fila"
                className="text-sm xl:text-base text-muted-foreground hover:text-primary transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded px-2"
              >
                Ver Fila
              </Link>
            )}
          </nav>

          {/* CTA Button Desktop */}
          <div className="hidden lg:block flex items-center space-x-3">
            {isAdminAuthenticated && adminUser && (
              <div className="text-sm text-muted-foreground">
                <span className="font-medium text-primary">{adminUser.nome || adminUser.email}</span>
                <span className="ml-1">({adminUser.role})</span>
              </div>
            )}
            <Button 
              size="sm"
              variant="outline"
              onClick={handleAdminArea}
              className="border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-colors text-sm px-4 py-2 flex items-center space-x-2"
              aria-label="Acesso administrativo"
            >
              <Shield className="w-4 h-4" />
              <span>
                {isAdminAuthenticated ? 'Dashboard' : 'Área Admin'}
              </span>
            </Button>
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

              {hasToken ? (
                <button
                  onClick={handleMinhaFila}
                  className="px-4 py-3 text-left text-base text-primary hover:text-accent hover:bg-secondary/50 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 flex items-center"
                >
                  <UserCheck className="w-4 h-4 mr-2" />
                  Minha Fila
                </button>
              ) : (
                <Link 
                  to="/barbearia/1/visualizar-fila"
                  onClick={() => setIsMenuOpen(false)}
                  className="px-4 py-3 text-left text-base text-muted-foreground hover:text-primary hover:bg-secondary/50 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                >
                  Ver Fila
                </Link>
              )}
              {isAdminAuthenticated && adminUser && (
                <div className="px-4 py-2 border-t border-gray-200">
                  <div className="text-sm text-muted-foreground px-4">
                    <span className="font-medium text-primary">{adminUser.nome || adminUser.email}</span>
                    <span className="ml-1">({adminUser.role})</span>
                  </div>
                </div>
              )}
              <div className="px-4 py-3">
                <Button 
                  size="sm"
                  variant="outline"
                  onClick={handleAdminArea}
                  className="w-full border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-colors text-sm flex items-center justify-center space-x-2"
                  aria-label="Acesso administrativo"
                >
                  <Shield className="w-4 h-4" />
                  <span>
                    {isAdminAuthenticated ? 'Dashboard' : 'Área Admin'}
                  </span>
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

