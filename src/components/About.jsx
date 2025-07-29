import { Heart, Home, Award, Users } from 'lucide-react';

export default function About() {
  const features = [
    {
      icon: Heart,
      title: 'Cuidado Humanizado',
      description: 'Atendimento personalizado com foco no seu bem-estar'
    },
    {
      icon: Home,
      title: 'Atendimento Domiciliar',
      description: 'Levamos nossos serviços até você quando necessário'
    },
    {
      icon: Award,
      title: '10+ Anos de Experiência',
      description: 'Profissionais qualificados e experientes'
    },
    {
      icon: Users,
      title: 'Abordagem Personalizada',
      description: 'Cada cliente recebe atenção individualizada'
    }
  ];

  return (
    <section id="about" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Conteúdo Esquerda - Imagem */}
          <div className="relative">
            <div className="aspect-[4/5] rounded-2xl overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200">
              <div className="w-full h-full flex items-center justify-center">
                <div className="text-center space-y-4">
                  <div className="w-32 h-32 bg-black rounded-full flex items-center justify-center mx-auto">
                    <span className="text-4xl font-bold text-white">L</span>
                  </div>
                  <h3 className="text-xl font-semibold text-black">Lucas Barbearia</h3>
                  <p className="text-gray-600">Profissionalismo e qualidade</p>
                </div>
              </div>
            </div>
            
            {/* Quote bubble */}
            <div className="absolute -top-4 -right-4 bg-black text-white p-4 rounded-lg max-w-xs">
              <p className="text-sm italic">"Acolher também é técnica"</p>
            </div>
          </div>

          {/* Conteúdo Direita */}
          <div className="space-y-8">
            {/* Badge */}
            <div className="inline-flex items-center px-4 py-2 bg-gray-100 text-black rounded-full text-sm font-medium">
              <Award className="w-4 h-4 mr-2" />
              Sobre a Lucas Barbearia
            </div>

            {/* Título */}
            <div className="space-y-4">
              <h2 className="text-4xl md:text-5xl font-bold text-black">
                Profissionalismo e{' '}
                <span className="text-gray-600">Qualidade</span>
              </h2>
              <p className="text-lg text-gray-600 leading-relaxed">
                Na Lucas Barbearia, acreditamos que cada corte conta uma história. 
                Nossa missão é transformar não apenas o visual, mas também a confiança 
                de cada cliente que passa por nossas mãos.
              </p>
            </div>

            {/* Texto narrativo */}
            <div className="space-y-4 text-gray-600">
              <p>
                Com mais de 10 anos de experiência no mercado, desenvolvemos técnicas 
                únicas que combinam tradição e inovação. Nossa equipe é constantemente 
                treinada para oferecer os melhores serviços e produtos do mercado.
              </p>
              <p>
                Utilizamos produtos premium e equipamentos de última geração para 
                garantir resultados excepcionais. Cada detalhe é cuidadosamente 
                planejado para proporcionar uma experiência única e memorável.
              </p>
              <p>
                Nossa barbearia é mais que um local de trabalho - é um espaço onde 
                amizades são formadas, histórias são compartilhadas e confiança é 
                construída através do tempo.
              </p>
            </div>

            {/* Grid de features */}
            <div className="grid grid-cols-2 gap-6">
              {features.map((feature, index) => (
                <div key={index} className="space-y-3">
                  <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                    <feature.icon className="w-6 h-6 text-black" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-black">{feature.title}</h3>
                    <p className="text-sm text-gray-600">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Seção de horários */}
            <div className="bg-gray-100 rounded-lg p-6">
              <h3 className="text-xl font-semibold text-black mb-4">Horários de Atendimento</h3>
              <div className="space-y-2 text-gray-600">
                <p><strong>Segunda a Sexta:</strong> 8h às 20h</p>
                <p><strong>Sábados e Domingos:</strong> 9h às 18h (mediante marcação WhatsApp)</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

