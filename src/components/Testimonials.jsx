import { Star } from 'lucide-react';

export default function Testimonials() {
  const testimonials = [
    {
      name: 'João Silva',
      rating: 5,
      text: 'Excelente atendimento! O Lucas é muito profissional e o corte ficou perfeito. Recomendo!',
      avatar: 'JS'
    },
    {
      name: 'Pedro Santos',
      rating: 5,
      text: 'Melhor barbearia que já frequentei. Ambiente agradável e serviço de qualidade.',
      avatar: 'PS'
    },
    {
      name: 'Carlos Oliveira',
      rating: 5,
      text: 'Sistema de fila muito prático. Não preciso mais esperar horas na barbearia.',
      avatar: 'CO'
    },
    {
      name: 'André Costa',
      rating: 5,
      text: 'Profissionalismo e qualidade em cada detalhe. Já sou cliente há 2 anos.',
      avatar: 'AC'
    },
    {
      name: 'Roberto Lima',
      rating: 5,
      text: 'Atendimento personalizado e resultados sempre excepcionais. Super recomendo!',
      avatar: 'RL'
    },
    {
      name: 'Fernando Alves',
      rating: 5,
      text: 'Barbearia moderna com técnicas tradicionais. O melhor dos dois mundos!',
      avatar: 'FA'
    }
  ];

  return (
    <section id="testimonials" className="py-20 bg-gray-100">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-black">
            O que nossos <span className="text-gray-600">clientes</span> dizem
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Depoimentos reais de quem já experimentou nossos serviços
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="bg-white rounded-lg p-6 shadow-lg">
              <div className="space-y-4">
                {/* Rating */}
                <div className="flex items-center space-x-1">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-black fill-current" />
                  ))}
                </div>

                {/* Text */}
                <p className="text-gray-600 italic">"{testimonial.text}"</p>

                {/* Author */}
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-black rounded-full flex items-center justify-center">
                    <span className="text-white font-semibold text-sm">{testimonial.avatar}</span>
                  </div>
                  <div>
                    <p className="font-semibold text-black">{testimonial.name}</p>
                    <p className="text-sm text-gray-500">Cliente</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Stats */}
        <div className="mt-16 bg-white rounded-lg p-8 shadow-lg">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-black">500+</div>
              <div className="text-gray-600">Clientes Atendidos</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-black">10+</div>
              <div className="text-gray-600">Anos de Experiência</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-black">4.9</div>
              <div className="text-gray-600">Avaliação Média</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-black">100%</div>
              <div className="text-gray-600">Satisfação</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

