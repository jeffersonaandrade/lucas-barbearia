import { Star, Quote, Heart } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card.jsx';

const Testimonials = () => {
  const testimonials = [
    {
      id: 1,
      name: 'Maria Silva',
      role: 'Mãe do Pedro, 4 anos',
      content: 'A Tia Jow é maravilhosa! Meu filho tinha muito medo de fisioterapia, mas ela conseguiu criar um vínculo incrível com ele. O Pedro agora até pede para fazer os exercícios. Os resultados foram surpreendentes!',
      rating: 5,
      image: 'bg-gradient-to-br from-pink-200 to-pink-300'
    },
    {
      id: 2,
      name: 'Ana Cardoso',
      role: 'Mãe da Sofia, 2 anos',
      content: 'O atendimento domiciliar fez toda a diferença. A Sofia se sente segura em casa e a Joanna sempre respeita o tempo dela. É um cuidado verdadeiramente humanizado. Recomendo de olhos fechados!',
      rating: 5,
      image: 'bg-gradient-to-br from-purple-200 to-purple-300'
    },
    {
      id: 3,
      name: 'Carlos Mendes',
      role: 'Pai do Lucas, 6 anos',
      content: 'Depois de várias tentativas com outros profissionais, encontramos na Tia Jow a solução. Ela entende que cada criança é única e adapta o tratamento. O Lucas melhorou muito!',
      rating: 5,
      image: 'bg-gradient-to-br from-blue-200 to-blue-300'
    },
    {
      id: 4,
      name: 'Fernanda Costa',
      role: 'Mãe da Isabela, 3 anos',
      content: 'A Joanna não trata apenas a criança, ela acolhe toda a família. Suas orientações são claras e ela sempre está disponível para tirar dúvidas. É mais que uma fisioterapeuta, é um anjo!',
      rating: 5,
      image: 'bg-gradient-to-br from-green-200 to-green-300'
    },
    {
      id: 5,
      name: 'Roberto Santos',
      role: 'Pai do Miguel, 5 anos',
      content: 'O Miguel nasceu prematuro e sempre teve problemas respiratórios. Com a Tia Jow, ele aprendeu a respirar melhor e ganhou qualidade de vida. Somos eternamente gratos!',
      rating: 5,
      image: 'bg-gradient-to-br from-orange-200 to-orange-300'
    },
    {
      id: 6,
      name: 'Juliana Oliveira',
      role: 'Mãe da Manuela, 4 anos',
      content: 'A abordagem da Joanna é única. Ela consegue fazer com que a fisioterapia seja um momento prazeroso para a criança. A Manuela adora as sessões e os resultados são visíveis!',
      rating: 5,
      image: 'bg-gradient-to-br from-teal-200 to-teal-300'
    }
  ];

  return (
    <section id="testimonials" className="section-padding bg-muted/30">
      <div className="container mx-auto">
        <div className="text-center space-y-4 mb-16">
          <div className="flex items-center justify-center space-x-2 text-primary">
            <Heart className="w-5 h-5" />
            <span className="text-sm font-medium uppercase tracking-wide">
              Depoimentos
            </span>
          </div>
          
          <h2 className="heading-secondary">
            O que os pais falam sobre a{' '}
            <span className="text-primary">Tia Jow</span>
          </h2>
          
          <p className="text-body max-w-2xl mx-auto">
            Histórias reais de famílias que confiaram no cuidado humanizado e 
            viram seus pequenos respirarem melhor e viverem com mais qualidade.
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
                    <Heart className="w-6 h-6 text-white" />
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
              <div className="text-3xl font-bold text-primary">2.375</div>
              <div className="text-sm text-muted-foreground">Seguidores no Instagram</div>
            </div>
            <div className="space-y-2">
              <div className="text-3xl font-bold text-primary">10+</div>
              <div className="text-sm text-muted-foreground">Anos de experiência</div>
            </div>
            <div className="space-y-2">
              <div className="text-3xl font-bold text-primary">500+</div>
              <div className="text-sm text-muted-foreground">Crianças atendidas</div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-center space-x-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-accent text-accent" />
                ))}
              </div>
              <div className="text-sm text-muted-foreground">Avaliação dos pais</div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center mt-12">
          <div className="bg-gradient-to-r from-primary/10 to-accent/10 rounded-2xl p-8">
            <h3 className="text-xl font-semibold text-foreground mb-4">
              Quer que seu filho também tenha essa experiência?
            </h3>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              Agende uma consulta e descubra como o cuidado humanizado pode 
              fazer a diferença na respiração do seu pequeno.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button 
                className="px-6 py-3 gradient-primary text-white rounded-lg hover:opacity-90 transition-opacity"
                onClick={() => window.open('https://calendly.com/ronaldocinebox1/30min', '_blank')}
              >
                Agendar Consulta
              </button>
              <button 
                className="px-6 py-3 border border-primary text-primary rounded-lg hover:bg-primary hover:text-white transition-colors"
                onClick={() => window.open('https://instagram.com/respirarporjoannabomfim', '_blank')}
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

