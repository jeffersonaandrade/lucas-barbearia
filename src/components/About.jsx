import { Heart, Award, Scissors, Users } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card.jsx';
import { OptimizedImage } from '@/components/ui/optimized-image.jsx';
import { useIntersectionObserver } from '@/hooks/use-intersection-observer.js';
import { memo } from 'react';

const About = memo(() => {
  const { elementRef, hasIntersected } = useIntersectionObserver();

  const features = [
    {
      icon: Heart,
      title: 'Fila Inteligente',
      description: 'Sistema automatizado que gerencia a fila de forma eficiente e justa.'
    },
    {
      icon: Scissors,
      title: 'Tempo Real',
      description: 'Acompanhe sua posição e tempo estimado em tempo real.'
    },
    {
      icon: Award,
      title: 'Notificações',
      description: 'Receba alertas automáticos quando for sua vez de ser atendido.'
    },
    {
      icon: Users,
      title: 'Fácil de Usar',
      description: 'Interface intuitiva que funciona em qualquer dispositivo.'
    }
  ];

  return (
    <section id="about" className="section-padding bg-white">
      <div className="container mx-auto">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Imagem */}
          <div 
            ref={elementRef}
            className={`relative transition-all duration-700 ${
              hasIntersected ? 'animate-fade-in opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
          >
            <div className="relative">
              {/* Imagem da Barbearia */}
              <div className="aspect-[4/5] rounded-2xl overflow-hidden shadow-2xl">
                    <div className="w-full h-full bg-gradient-to-br from-secondary to-accent/20 flex items-center justify-center">
                      <div className="text-center space-y-4">
                        <div className="w-40 h-40 rounded-full bg-white/90 flex items-center justify-center mx-auto">
                      <Scissors className="w-20 h-20 text-primary" />
                        </div>
                        <div className="text-muted-foreground">
                      <p className="font-semibold text-lg">Lucas Barbearia</p>
                      <p className="text-sm">Sistema de Filas</p>
                      <p className="text-xs">Tecnologia Moderna</p>
                        </div>
                      </div>
                    </div>
              </div>
              
              {/* Quote bubble */}
              <div className="absolute -right-4 top-8 bg-white rounded-lg shadow-lg p-4 max-w-xs">
                <p className="text-sm text-muted-foreground italic">
                  "Tecnologia a serviço da tradição"
                </p>
                <div className="text-xs text-primary font-medium mt-2">- Lucas Barbearia</div>
              </div>
            </div>
          </div>

          {/* Conteúdo */}
          <div className="space-y-8 animate-fade-in">
            <div className="space-y-4">
              <div className="flex items-center space-x-2 text-primary">
                <Scissors className="w-5 h-5" />
                <span className="text-sm font-medium uppercase tracking-wide">
                  Sistema de Filas
                </span>
              </div>
              
              <h2 className="heading-secondary">
                Lucas Barbearia - Fila{' '}
                <span className="text-primary">Inteligente</span>
              </h2>
              
              <div className="space-y-4 text-body">
                <p>
                  O sistema de filas inteligente da Lucas Barbearia revoluciona a forma como 
                  você agenda seu horário. Com tecnologia moderna e interface intuitiva, 
                  oferecemos uma experiência única e prática.
                </p>
                
                <p>
                  <strong className="text-primary">Sem esperas desnecessárias!</strong> 
                  Entre na fila online, acompanhe sua posição em tempo real e chegue na hora certa. 
                  Nossa missão é tornar sua visita à barbearia mais eficiente e agradável.
                </p>
                
                <p>
                  O sistema funciona 24/7, permitindo que você entre na fila a qualquer momento. 
                  Receba notificações automáticas e acompanhe o progresso da fila em tempo real.
                  ambiente acolhe e o profissional respeita... o cuidado flui. E os resultados aparecem.
                </p>
              </div>
            </div>

            {/* Features Grid */}
            <div className="grid sm:grid-cols-2 gap-4">
              {features.map((feature, index) => (
                <Card key={index} className="border-border hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <feature.icon className="w-5 h-5 text-primary" />
                      </div>
                      <div className="space-y-2">
                        <h3 className="font-semibold text-foreground">{feature.title}</h3>
                        <p className="text-sm text-muted-foreground">{feature.description}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Credentials */}
            <div className="bg-secondary/30 rounded-lg p-6">
              <h3 className="font-semibold text-foreground mb-3">Diferenciais da Barbearia</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Sistema de fila online inteligente e prático</li>
                <li>• Barbeiros profissionais com mais de 5 anos de experiência</li>
                <li>• Atendimento personalizado e ambiente acolhedor</li>
                <li>• Tecnologia moderna para melhor experiência do cliente</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
});

About.displayName = 'About';

export default About;

