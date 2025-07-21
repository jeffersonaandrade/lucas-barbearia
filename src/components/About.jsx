import { Heart, Award, Home, Users } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card.jsx';
import { OptimizedImage } from '@/components/ui/optimized-image.jsx';
import { useIntersectionObserver } from '@/hooks/use-intersection-observer.js';
import { memo } from 'react';
import aboutImage from '@/assets/DSC04456.jpg';

const About = memo(() => {
  const { elementRef, hasIntersected } = useIntersectionObserver();

  const features = [
    {
      icon: Heart,
      title: 'Cuidado Humanizado',
      description: 'Cada consulta respeita o ritmo, o medo, o cansaço e até o jeitinho único do seu filho.'
    },
    {
      icon: Home,
      title: 'Atendimento Domiciliar',
      description: 'O ambiente acolhe e o profissional respeita... o cuidado flui. E os resultados aparecem.'
    },
    {
      icon: Award,
      title: '10+ Anos de Experiência',
      description: 'Mais de uma década dedicada à fisioterapia respiratória infantil com resultados comprovados.'
    },
    {
      icon: Users,
      title: 'Abordagem Personalizada',
      description: 'Ambiente, vínculo e respeito são peças-chave para o progresso do seu filho.'
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
              {/* Imagem da Joanna */}
              <div className="aspect-[4/5] rounded-2xl overflow-hidden shadow-2xl">
                <OptimizedImage 
                  src={aboutImage}
                  alt="Joanna Bomfim - Tia Jow - Fisioterapeuta Respiratória"
                  className="w-full h-full"
                  objectPosition="center top"
                  fallback={
                    <div className="w-full h-full bg-gradient-to-br from-secondary to-accent/20 flex items-center justify-center">
                      <div className="text-center space-y-4">
                        <div className="w-40 h-40 rounded-full bg-white/90 flex items-center justify-center mx-auto">
                          <Heart className="w-20 h-20 text-primary" />
                        </div>
                        <div className="text-muted-foreground">
                          <p className="font-semibold text-lg">Joanna Bomfim</p>
                          <p className="text-sm">Tia Jow</p>
                          <p className="text-xs">Fisioterapeuta Respiratória</p>
                        </div>
                      </div>
                    </div>
                  }
                />
              </div>
              
              {/* Quote bubble */}
              <div className="absolute -right-4 top-8 bg-white rounded-lg shadow-lg p-4 max-w-xs">
                <p className="text-sm text-muted-foreground italic">
                  "Acolher também é técnica"
                </p>
                <div className="text-xs text-primary font-medium mt-2">- Tia Jow</div>
              </div>
            </div>
          </div>

          {/* Conteúdo */}
          <div className="space-y-8 animate-fade-in">
            <div className="space-y-4">
              <div className="flex items-center space-x-2 text-primary">
                <Heart className="w-5 h-5" />
                <span className="text-sm font-medium uppercase tracking-wide">
                  Sobre a Tia Jow
                </span>
              </div>
              
              <h2 className="heading-secondary">
                Respirar - Cuidado Respiratório por{' '}
                <span className="text-primary">Joanna Bomfim</span>
              </h2>
              
              <div className="space-y-4 text-body">
                <p>
                  Com mais de 10 anos de experiência em fisioterapia respiratória pediátrica, 
                  encontrei no atendimento domiciliar uma forma de tratar cada criança com a 
                  atenção que ela merece.
                </p>
                
                <p>
                  Agora a Tia Jow é empresa, mas a minha missão com vocês continua a mesma: 
                  <strong className="text-primary"> ajudar seu pequeno a respirar melhor!</strong>
                </p>
                
                <p>
                  Nada de correria, pressa ou imposições. Cada consulta respeita o ritmo, 
                  o medo, o cansaço e até o jeitinho único do seu filho. Porque quando o 
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
              <h3 className="font-semibold text-foreground mb-3">Formação e Especialização</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Fisioterapeuta especializada em Fisioterapia Respiratória Infantil</li>
                <li>• Mais de 10 anos de experiência em atendimento pediátrico</li>
                <li>• Especialização em atendimento domiciliar personalizado</li>
                <li>• Abordagem humanizada e técnica baseada em evidências</li>
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

