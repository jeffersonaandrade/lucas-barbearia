import { Scissors, Clock, Star } from 'lucide-react';
import { Button } from '@/components/ui/button.jsx';
import { siteConfig } from '@/config/site.js';
import { useWhatsApp } from '@/hooks/use-whatsapp.js';
import { useIntersectionObserver } from '@/hooks/use-intersection-observer.js';

const Services = () => {
  const { handleContactAction } = useWhatsApp();
  const { elementRef, hasIntersected } = useIntersectionObserver();

  const services = [
    {
      title: 'Corte Masculino',
      price: 'R$ 35',
      duration: '30 min',
      description: 'Corte tradicional ou moderno com acabamento perfeito. Inclui lavagem, corte e finalização.',
      features: ['Lavagem profissional', 'Corte personalizado', 'Finalização com produtos premium']
    },
    {
      title: 'Barba',
      price: 'R$ 25',
      duration: '20 min',
      description: 'Acabamento de barba com navalha e produtos premium para um visual impecável.',
      features: ['Acabamento com navalha', 'Produtos premium', 'Hidratação da pele']
    },
    {
      title: 'Corte + Barba',
      price: 'R$ 50',
      duration: '45 min',
      description: 'Combo completo com desconto especial. Corte e barba em uma única sessão.',
      features: ['Corte completo', 'Acabamento de barba', 'Desconto especial']
    },
    {
      title: 'Hidratação',
      price: 'R$ 20',
      duration: '15 min',
      description: 'Tratamento hidratante para cabelo e couro cabeludo.',
      features: ['Produtos profissionais', 'Massagem relaxante', 'Hidratação profunda']
    },
    {
      title: 'Pigmentação',
      price: 'R$ 40',
      duration: '60 min',
      description: 'Coloração natural para cabelo e barba.',
      features: ['Cor natural', 'Produtos de qualidade', 'Durabilidade']
    },
    {
      title: 'Pacote Completo',
      price: 'R$ 80',
      duration: '90 min',
      description: 'Experiência completa com todos os serviços incluídos.',
      features: ['Corte + Barba', 'Hidratação', 'Pigmentação (opcional)']
    }
  ];

  return (
    <section id="services" className="py-20 bg-secondary/30">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div 
          ref={elementRef}
          className={`text-center space-y-4 mb-16 transition-all duration-700 ${
            hasIntersected ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <h2 className="text-4xl md:text-5xl font-bold text-foreground">
            Nossos <span className="text-primary">Serviços</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Oferecemos uma variedade completa de serviços para cuidar do seu visual
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <div 
              key={index} 
              className="bg-card rounded-lg p-8 hover:shadow-xl transition-all duration-300 group border border-border"
            >
              <div className="space-y-6">
                {/* Header */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Scissors className="h-8 w-8 text-primary" />
                    <div className="text-right">
                      <div className="text-2xl font-bold text-foreground">{service.price}</div>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Clock className="h-4 w-4 mr-1" />
                        {service.duration}
                      </div>
                    </div>
                  </div>
                  <h3 className="text-xl font-semibold text-foreground">{service.title}</h3>
                  <p className="text-muted-foreground">{service.description}</p>
                </div>

                {/* Features */}
                <div className="space-y-3">
                  <h4 className="font-semibold text-foreground">Inclui:</h4>
                  <ul className="space-y-2">
                    {service.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center text-sm text-muted-foreground">
                        <Star className="h-4 w-4 text-primary mr-2 flex-shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* CTA */}
                <Button 
                  className="w-full"
                  onClick={() => handleContactAction('whatsapp', 'serviceBooking', service.title)}
                >
                  Agendar
                </Button>
              </div>
            </div>
          ))}
        </div>

        {/* Additional Info */}
        <div className="mt-16 bg-primary text-primary-foreground rounded-lg p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <h3 className="text-2xl font-bold">Horário de Funcionamento</h3>
              <div className="space-y-2">
                <p className="flex justify-between">
                  <span>Segunda a Sexta:</span>
                  <span>9h às 19h</span>
                </p>
                <p className="flex justify-between">
                  <span>Sábado:</span>
                  <span>9h às 18h</span>
                </p>
                <p className="flex justify-between">
                  <span>Domingo:</span>
                  <span>Fechado</span>
                </p>
              </div>
            </div>
            <div className="space-y-4">
              <h3 className="text-2xl font-bold">Informações Importantes</h3>
              <ul className="space-y-2 text-primary-foreground/80">
                <li>• Agendamento recomendado</li>
                <li>• Aceitamos cartões e PIX</li>
                <li>• Produtos disponíveis para venda</li>
                <li>• Estacionamento gratuito</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Services; 