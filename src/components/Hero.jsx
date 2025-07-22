import { ArrowRight, Play, Scissors, Heart, Users, Star, Clock, Users2, CheckCircle, MapPin, UserCheck } from 'lucide-react';
import { Button } from '@/components/ui/button.jsx';
import { siteConfig } from '@/config/site.js';
import { useWhatsApp } from '@/hooks/use-whatsapp.js';
import { useIntersectionObserver } from '@/hooks/use-intersection-observer.js';
import { useClienteToken } from '@/hooks/useClienteToken.js';
import { Link } from 'react-router-dom';

const Hero = () => {
  const { handleContactAction } = useWhatsApp();
  const { elementRef, hasIntersected } = useIntersectionObserver();
  const { hasToken, getStatusFilaUrl } = useClienteToken();

  return (
                    <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20 sm:pt-24 lg:pt-28">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-50 to-white"></div>
      
      {/* Content */}
                <div className="container mx-auto px-4 py-8 sm:py-12 lg:py-16 relative z-10">
                  <div className="grid lg:grid-cols-2 gap-12 items-center mt-8 sm:mt-12 lg:mt-16">
          {/* Conteúdo */}
          <div className="text-center lg:text-left space-y-8">
            {/* Main Heading */}
            <div 
              ref={elementRef}
              className={`space-y-6 transition-all duration-700 ${
                hasIntersected ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
            >
              <div className="flex items-center justify-center lg:justify-start space-x-2 text-primary mb-4">
                <Scissors className="w-5 h-5" />
                <span className="text-sm font-medium uppercase tracking-wide">
                  Sistema de Filas Inteligente
                </span>
              </div>
              
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-foreground leading-tight">
                Fila{' '}
                <span className="text-primary">inteligente</span>
              </h1>
              
              <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto lg:mx-0 leading-relaxed">
                Entre na fila online, acompanhe sua posição em tempo real e chegue na hora certa. 
                Sem esperas desnecessárias, apenas qualidade e praticidade.
              </p>
            </div>

            {/* Trust Indicators */}
            <div className="flex flex-wrap justify-center lg:justify-start items-center gap-4 text-sm text-muted-foreground">
              {siteConfig.trustIndicators.map((indicator, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  <span>{indicator}</span>
                </div>
              ))}
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start items-center pt-8">
              <Link to="/barbearias">
                <Button 
                  size="lg"
                  className="bg-primary text-primary-foreground hover:bg-accent px-8 py-3 text-lg font-semibold"
                >
                  <MapPin className="w-5 h-5 mr-2" />
                  NOSSAS UNIDADES
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
              
              {hasToken ? (
                <Link to={getStatusFilaUrl()}>
                  <Button 
                    size="lg"
                    className="bg-accent text-accent-foreground hover:bg-accent/90 px-8 py-3 text-lg font-semibold"
                  >
                    <UserCheck className="w-5 h-5 mr-2" />
                    MINHA FILA
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              ) : (
                <Link to="/barbearia/1/visualizar-fila">
                  <Button 
                    variant="outline"
                    size="lg"
                    className="border-primary text-primary hover:bg-primary hover:text-primary-foreground px-8 py-3 text-lg font-semibold"
                  >
                    <Clock className="w-5 h-5 mr-2" />
                    VISUALIZAR FILA
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              )}
            </div>

            {/* Como Funciona */}
            <div className="mt-20 sm:mt-24 lg:mt-28 grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center space-y-4">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto">
                  <Users2 className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-foreground">1. Entre na Fila</h3>
                <p className="text-muted-foreground">
                  Preencha seus dados e escolha seu barbeiro preferido
                </p>
              </div>
              
              <div className="text-center space-y-4">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto">
                  <Clock className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-foreground">2. Acompanhe</h3>
                <p className="text-muted-foreground">
                  Receba um token único e acompanhe sua posição em tempo real
                </p>
              </div>
              
              <div className="text-center space-y-4">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-foreground">3. Chegue na Hora</h3>
                <p className="text-muted-foreground">
                  Quando for sua vez, você será notificado automaticamente
                </p>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-8 max-w-md mx-auto lg:mx-0 pt-16 sm:pt-20 lg:pt-24">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">1000+</div>
                <div className="text-sm text-muted-foreground">Clientes na Fila</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">15</div>
                <div className="text-sm text-muted-foreground">Min. Tempo Médio</div>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center space-x-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-accent text-accent" />
                  ))}
                </div>
                <div className="text-sm text-muted-foreground">Avaliação Sistema</div>
              </div>
            </div>
          </div>

          {/* Imagem da Barbearia */}
          <div className="relative animate-fade-in hidden lg:block">
            <div className="relative">
              {/* Placeholder para foto da barbearia */}
              <div className="aspect-square rounded-2xl overflow-hidden bg-gradient-to-br from-primary/20 to-accent/20">
                <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                  <Scissors className="w-24 h-24 text-primary opacity-50" />
                </div>
              </div>
              
              {/* Elementos decorativos */}
              <div className="absolute -top-4 -right-4 w-8 h-8 bg-accent rounded-full opacity-60"></div>
              <div className="absolute -bottom-4 -left-4 w-12 h-12 bg-primary rounded-full opacity-40"></div>
              <div className="absolute top-1/2 -left-8 w-6 h-6 bg-accent rounded-full opacity-50"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;

