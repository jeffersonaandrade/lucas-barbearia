import { Star, Quote, Scissors } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card.jsx';
import { Link } from 'react-router-dom';

const Testimonials = () => {
  const testimonials = [
    {
      id: 1,
      name: 'João Silva',
      role: 'Cliente há 3 anos',
      content: 'A Lucas Barbearia é incrível! O sistema de fila online é muito prático, não preciso mais ficar esperando horas. Os barbeiros são profissionais e sempre fazem um trabalho perfeito.',
      rating: 5,
      image: 'bg-gradient-to-br from-gray-200 to-gray-300'
    },
    {
      id: 2,
      name: 'Pedro Santos',
      role: 'Cliente há 1 ano',
      content: 'Melhor barbearia que já frequentei! O sistema de fila é genial, posso acompanhar minha posição em tempo real e chegar na hora certa. Sempre saio satisfeito com o resultado.',
      rating: 5,
      image: 'bg-gradient-to-br from-gray-200 to-gray-300'
    },
    {
      id: 3,
      name: 'Carlos Oliveira',
      role: 'Cliente há 2 anos',
      content: 'A praticidade do sistema de fila online mudou minha vida! Não preciso mais perder tempo esperando. Os barbeiros são muito atenciosos e o ambiente é super agradável.',
      rating: 5,
      image: 'bg-gradient-to-br from-gray-200 to-gray-300'
    },
    {
      id: 4,
      name: 'Miguel Costa',
      role: 'Cliente há 6 meses',
      content: 'Sistema de fila inteligente e barbeiros profissionais! A Lucas Barbearia entende o que o cliente precisa: qualidade, praticidade e respeito pelo tempo. Recomendo demais!',
      rating: 5,
      image: 'bg-gradient-to-br from-gray-200 to-gray-300'
    },
    {
      id: 5,
      name: 'Lucas Ferreira',
      role: 'Cliente há 1 ano',
      content: 'A tecnologia da fila online é fantástica! Posso entrar na fila de casa e chegar na hora certa. Os barbeiros são muito bons e o atendimento é sempre cordial.',
      rating: 5,
      image: 'bg-gradient-to-br from-gray-200 to-gray-300'
    },
    {
      id: 6,
      name: 'Rafael Almeida',
      role: 'Cliente há 8 meses',
      content: 'Lucas Barbearia é sinônimo de qualidade! O sistema de fila é muito eficiente e os barbeiros são verdadeiros artistas. Sempre saio com um visual incrível e satisfeito.',
      rating: 5,
      image: 'bg-gradient-to-br from-gray-200 to-gray-300'
    }
  ];

  return (
    <section id="testimonials" className="section-padding bg-muted/30">
      <div className="container mx-auto">
        <div className="text-center space-y-4 mb-16">
          <div className="flex items-center justify-center space-x-2 text-primary">
            <Scissors className="w-5 h-5" />
            <span className="text-sm font-medium uppercase tracking-wide">
              Depoimentos
            </span>
          </div>
          
          <h2 className="heading-secondary">
            O que os clientes falam sobre a{' '}
            <span className="text-primary">Lucas Barbearia</span>
          </h2>
          
          <p className="text-body max-w-2xl mx-auto">
            Histórias reais de clientes que descobriram a praticidade do sistema de fila online 
            e a qualidade dos nossos barbeiros profissionais.
          </p>
        </div>

        {/* Grid de Depoimentos */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {testimonials.map((testimonial) => (
            <Card key={testimonial.id} className="border-border hover:shadow-lg transition-shadow bg-white">
              <CardContent className="p-6 space-y-4">
                {/* Quote Icon */}
                <div className="flex justify-between items-start">
                  <Quote className="w-8 h-8 text-primary/30" />
                  <div className="flex space-x-1">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-accent text-accent" />
                    ))}
                  </div>
                </div>

                {/* Conteúdo */}
                <p className="text-muted-foreground italic leading-relaxed">
                  "{testimonial.content}"
                </p>

                {/* Autor */}
                <div className="flex items-center space-x-3 pt-4 border-t border-border">
                  <div className={`w-12 h-12 rounded-full ${testimonial.image} flex items-center justify-center`}>
                    <Scissors className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <div className="font-semibold text-foreground">{testimonial.name}</div>
                    <div className="text-sm text-muted-foreground">{testimonial.role}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Stats Section */}
        <div className="bg-white rounded-2xl p-8 shadow-sm">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div className="space-y-2">
              <div className="text-3xl font-bold text-primary">1.250</div>
              <div className="text-sm text-muted-foreground">Seguidores no Instagram</div>
            </div>
            <div className="space-y-2">
              <div className="text-3xl font-bold text-primary">5+</div>
              <div className="text-sm text-muted-foreground">Anos de experiência</div>
            </div>
            <div className="space-y-2">
              <div className="text-3xl font-bold text-primary">2.500+</div>
              <div className="text-sm text-muted-foreground">Clientes atendidos</div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-center space-x-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-accent text-accent" />
                ))}
              </div>
              <div className="text-sm text-muted-foreground">Avaliação dos clientes</div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center mt-12">
          <div className="bg-gradient-to-r from-primary/10 to-accent/10 rounded-2xl p-8">
            <h3 className="text-xl font-semibold text-foreground mb-4">
              Quer experimentar essa experiência?
            </h3>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              Entre na fila online e descubra como a Lucas Barbearia pode 
              transformar seu visual com qualidade e praticidade.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/barbearias">
              <button 
                  className="px-6 py-3 bg-primary text-primary-foreground hover:bg-accent hover:text-accent-foreground rounded-lg transition-colors"
              >
                  Nossas Unidades
              </button>
              </Link>
              <button 
                className="px-6 py-3 border border-primary text-primary rounded-lg hover:bg-primary hover:text-primary-foreground transition-colors"
                onClick={() => window.open(siteConfig.urls.instagram, '_blank')}
              >
                Ver mais no Instagram
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;

