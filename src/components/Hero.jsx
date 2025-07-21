import { ArrowRight, Play, Shield, Heart, Users, Star } from 'lucide-react';
import { Button } from '@/components/ui/button.jsx';
import { siteConfig } from '@/config/site.js';
import { useWhatsApp } from '@/hooks/use-whatsapp.js';
import { useIntersectionObserver } from '@/hooks/use-intersection-observer.js';
import AppointmentScheduler from './AppointmentScheduler.jsx';
import joannaPhoto from '@/assets/DSC04353.jpg';

const Hero = () => {
  const { handleContactAction } = useWhatsApp();
  const { elementRef, hasIntersected } = useIntersectionObserver();

  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-accent/5 to-primary/10"></div>
      
      {/* Content */}
      <div className="container mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
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
                <Shield className="w-5 h-5" />
                <span className="text-sm font-medium uppercase tracking-wide">
                  Fisioterapia Respiratória Infantil
                </span>
              </div>
              
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-foreground leading-tight">
                Respire com{' '}
                <span className="text-primary">tranquilidade</span>
              </h1>
              
              <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto lg:mx-0 leading-relaxed">
                Cuidado humanizado e especializado em fisioterapia respiratória infantil. 
                A Tia Jow cuida da respiração do seu filho com amor e profissionalismo.
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
              <AppointmentScheduler />
              
              <Button 
                variant="outline"
                size="lg"
                className="border-primary text-primary hover:bg-primary hover:text-white px-8 py-3 text-lg font-semibold"
                onClick={() => handleContactAction('whatsapp', 'hero')}
              >
                <Heart className="w-5 h-5 mr-2" />
                Falar com a Tia Jow
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-8 max-w-md mx-auto lg:mx-0 pt-12">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">{siteConfig.stats.experience}</div>
                <div className="text-sm text-muted-foreground">Anos de Experiência</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">{siteConfig.stats.followers}</div>
                <div className="text-sm text-muted-foreground">Seguidores</div>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center space-x-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-accent text-accent" />
                  ))}
                </div>
                <div className="text-sm text-muted-foreground">Avaliação</div>
              </div>
            </div>
          </div>

          {/* Imagem da Tia Jow */}
          <div className="relative animate-fade-in hidden lg:block">
            <div className="relative">
              {/* Foto da Joanna */}
              <div className="aspect-square rounded-2xl overflow-hidden bg-gradient-to-br from-primary/20 to-accent/20">
                <img 
                  src={joannaPhoto} 
                  alt="Joanna Bomfim - Fisioterapeuta Respiratória Infantil"
                  className="w-full h-full object-cover"
                  loading="eager"
                />
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

