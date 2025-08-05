import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button.jsx';
import { Logo } from '@/components/ui/logo.jsx';
import { siteConfig } from '@/config/site.js';
import { useAuth } from '@/contexts/AuthContext.jsx';
import { useClienteToken } from '@/hooks/useClienteToken.js';
import { authUtils } from '@/utils/authUtils.js';
import { 
  Menu, 
  X, 
  User, 
  Settings, 
  LogOut,
  ChevronDown,
  Users,
  Scissors,
  BarChart3,
  FileText,
  MessageSquare,
  DollarSign
} from 'lucide-react';

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAuthenticated, hasRole, logout } = useAuth();
  const { hasToken, getStatusFilaUrl } = useClienteToken();
  
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAdminDropdownOpen, setIsAdminDropdownOpen] = useState(false);
  const [isLoginPage, setIsLoginPage] = useState(false);
  
  // Remover estados desnecessários que causavam polling
  // const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  // const [adminUser, setAdminUser] = useState(null);

  const isLoginPageRef = useRef(false);

  // Verificar se estamos na página de login
  useEffect(() => {
    const isLogin = location.pathname === '/admin/login';
    setIsLoginPage(isLogin);
    isLoginPageRef.current = isLogin;
  }, [location.pathname]);

  // Remover o useEffect que fazia polling a cada 5 segundos
  // useEffect(() => {
  //   const checkAdminAuth = async () => {
  //     try {
  //       const authenticated = await authUtils.isAuthenticated();
  //       console.log('🔍 Header - checkAdminAuth: Resultado da autenticação:', authenticated);
  //       
  //       setIsAdminAuthenticated(authenticated);
  //       
  //       if (authenticated) {
  //         console.log('🔍 Header - checkAdminAuth: Obtendo dados do usuário...');
  //         const user = await authUtils.getCurrentUser();
  //         console.log('🔍 Header - checkAdminAuth: Dados do usuário:', user);
  //         setAdminUser(user);
  //       } else {
  //         console.log('🔍 Header - checkAdminAuth: Usuário não autenticado');
  //         setAdminUser(null);
  //       }
  //     } catch (error) {
  //       console.error('❌ Header - checkAdminAuth: Erro:', error);
  //       setIsAdminAuthenticated(false);
  //       setAdminUser(null);
  //     }
  //   };

  //   checkAdminAuth();
    
  //   // Verificar periodicamente (a cada 5 segundos) apenas se não estivermos na página de login
  //   const interval = setInterval(() => {
  //     if (!isLoginPage) {
  //       checkAdminAuth();
  //     }
  //   }, 5000);
    
  //   return () => clearInterval(interval);
  // }, [isLoginPage]);

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
    if (isAuthenticated()) {
      // Se está autenticado, vai direto para o dashboard
      navigate('/admin/dashboard');
    } else {
      // Se não está autenticado, vai para o login
      navigate('/admin/login');
    }
    setIsMenuOpen(false);
  };

  // Função auxiliar para scroll suave
  const scrollToSection = (sectionId, callback) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      if (callback) callback();
    }
  };

  // Função para renderizar menu admin baseado no role
  const renderAdminMenu = () => {
    if (!isAuthenticated()) return null;

    const menuItems = [];

    // Menu para Admin
    if (hasRole('admin')) {
      menuItems.push(
        { label: 'Dashboard', href: '/admin/dashboard', icon: BarChart3 },
        { label: 'Barbearias', href: '/admin/barbearias', icon: Scissors },
        { label: 'Usuários', href: '/admin/usuarios', icon: Users },
        { label: 'Filas', href: '/admin/filas', icon: Users },
        { label: 'Relatórios', href: '/admin/relatorios', icon: FileText },
        { label: 'Comissões', href: '/admin/comissoes', icon: DollarSign },
        { label: 'WhatsApp', href: '/admin/whatsapp', icon: MessageSquare },
        { label: 'Configurações', href: '/admin/configuracoes', icon: Settings }
      );
    }
    
    // Menu para Barbeiro
    else if (hasRole('barbeiro')) {
      menuItems.push(
        { label: 'Dashboard', href: '/dashboard/barbeiro', icon: BarChart3 },
        { label: 'Minha Fila', href: '/dashboard/barbeiro', icon: Users }
      );
    }
    
    // Menu para Gerente
    else if (hasRole('gerente')) {
      menuItems.push(
        { label: 'Dashboard', href: '/dashboard/gerente', icon: BarChart3 },
        { label: 'Relatórios', href: '/admin/relatorios', icon: FileText }
      );
    }

    return menuItems;
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
                className="text-sm xl:text-base"
              >
                Minha Fila
              </Button>
            ) : null}

            {/* Área Admin - Usar dados do AuthContext em vez de polling */}
            {isAuthenticated() ? (
              <div className="relative">
                <Button
                  onClick={() => setIsAdminDropdownOpen(!isAdminDropdownOpen)}
                  variant="ghost"
                  size="sm"
                  className="flex items-center space-x-1 text-sm xl:text-base"
                >
                  <User className="w-4 h-4" />
                  <span>{user?.nome || 'Admin'}</span>
                  <ChevronDown className="w-4 h-4" />
                </Button>

                {isAdminDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-border z-50">
                    <div className="py-1">
                      {renderAdminMenu().map((item) => (
                        <Link
                          key={item.label}
                          to={item.href}
                          onClick={() => setIsAdminDropdownOpen(false)}
                          className="flex items-center space-x-2 px-4 py-2 text-sm text-muted-foreground hover:text-primary hover:bg-muted transition-colors"
                        >
                          <item.icon className="w-4 h-4" />
                          <span>{item.label}</span>
                        </Link>
                      ))}
                      <hr className="my-1" />
                      <button
                        onClick={async () => {
                          setIsAdminDropdownOpen(false);
                          try {
                            // Chamar função de logout do contexto de autenticação
                            await logout();
                            // Redirecionar para a página inicial
                            navigate('/');
                          } catch (error) {
                            console.error('Erro no logout:', error);
                            // Fallback: limpar dados manualmente
                            localStorage.removeItem('userInfo');
                            localStorage.removeItem('adminToken');
                            window.location.href = '/';
                          }
                        }}
                        className="flex items-center space-x-2 w-full px-4 py-2 text-sm text-red-600 hover:text-red-700 hover:bg-red-50 transition-colors"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Sair</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Button
                onClick={handleAdminArea}
                variant="outline"
                size="sm"
                className="text-sm xl:text-base"
              >
                Área Admin
              </Button>
            )}
          </nav>

          {/* Menu Mobile */}
          <div className="lg:hidden">
            <Button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              variant="ghost"
              size="sm"
              className="p-2"
            >
              {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </div>

        {/* Menu Mobile Expandido */}
        {isMenuOpen && (
          <div className="lg:hidden py-4 border-t border-border">
            <nav className="space-y-2">
              {siteConfig.navigation.map((item) => (
                <button
                  key={item.label}
                  onClick={() => handleNavigation(item.href)}
                  className="block w-full text-left px-4 py-2 text-muted-foreground hover:text-primary hover:bg-muted transition-colors rounded"
                >
                  {item.label}
                </button>
              ))}
              <Link 
                to="/barbearias"
                className="block px-4 py-2 text-muted-foreground hover:text-primary hover:bg-muted transition-colors rounded"
                onClick={() => setIsMenuOpen(false)}
              >
                Nossas Unidades
              </Link>

              {hasToken && (
                <button
                  onClick={handleMinhaFila}
                  className="block w-full text-left px-4 py-2 text-muted-foreground hover:text-primary hover:bg-muted transition-colors rounded"
                >
                  Minha Fila
                </button>
              )}

              <button
                onClick={handleAdminArea}
                className="block w-full text-left px-4 py-2 bg-black text-white hover:bg-gray-800 transition-colors rounded font-medium"
              >
                Área Admin
              </button>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;

