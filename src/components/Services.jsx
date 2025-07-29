import { useState, useEffect } from 'react';
import { Scissors, Clock, Star } from 'lucide-react';
import { useConfiguracoesTodasBarbearias } from '../hooks/useConfiguracoesPublicas';
import LoadingSpinner from './ui/loading-spinner';

export default function Services() {
  const { barbearias, loading, error } = useConfiguracoesTodasBarbearias();
  const [servicosConsolidados, setServicosConsolidados] = useState([]);

  // Consolidar serviços de todas as barbearias
  useEffect(() => {
    if (barbearias && barbearias.length > 0) {
      const servicosUnicos = new Map();
      
      barbearias.forEach(barbearia => {
        if (barbearia.servicos) {
          barbearia.servicos.forEach(servico => {
            // Usar nome + categoria como chave única
            const chave = `${servico.nome}-${servico.categoria}`;
            
            if (!servicosUnicos.has(chave)) {
              servicosUnicos.set(chave, {
                id: servico.id,
                title: servico.nome,
                price: `R$ ${servico.preco.toFixed(2).replace('.', ',')}`,
                duration: `${servico.duracao} min`,
                description: servico.descricao || 'Serviço profissional com qualidade garantida.',
                categoria: servico.categoria,
                features: gerarFeaturesPorCategoria(servico.categoria),
                barbearias: [barbearia.nome]
              });
            } else {
              // Se já existe, adicionar a barbearia à lista
              const servicoExistente = servicosUnicos.get(chave);
              if (!servicoExistente.barbearias.includes(barbearia.nome)) {
                servicoExistente.barbearias.push(barbearia.nome);
              }
            }
          });
        }
      });
      
      setServicosConsolidados(Array.from(servicosUnicos.values()));
    }
  }, [barbearias]);

  // Gerar features baseadas na categoria do serviço
  const gerarFeaturesPorCategoria = (categoria) => {
    const features = {
      'corte': ['Lavagem profissional', 'Corte personalizado', 'Finalização com produtos premium'],
      'barba': ['Acabamento com navalha', 'Produtos premium', 'Hidratação da pele'],
      'combo': ['Corte completo', 'Acabamento de barba', 'Desconto especial'],
      'tratamento': ['Produtos profissionais', 'Massagem relaxante', 'Tratamento especializado']
    };
    
    return features[categoria] || ['Serviço profissional', 'Qualidade garantida', 'Atendimento personalizado'];
  };

  // Fallback para dados estáticos caso não carregue as configurações
  const servicosFallback = [
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
    }
  ];

  // Usar dados dinâmicos se disponíveis, senão usar fallback
  const services = servicosConsolidados.length > 0 ? servicosConsolidados : servicosFallback;

  if (loading) {
    return (
      <section id="servicos" className="py-20 bg-gray-100">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-black">
              Nossos <span className="text-gray-600">Serviços</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Carregando nossos serviços...
            </p>
          </div>
          <div className="flex justify-center">
            <LoadingSpinner size="lg" text="Carregando serviços..." />
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    console.warn('Erro ao carregar configurações, usando dados estáticos:', error);
  }

  return (
    <section id="servicos" className="py-20 bg-gray-100">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-black">
            Nossos <span className="text-gray-600">Serviços</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Oferecemos uma variedade completa de serviços para cuidar do seu visual
            {servicosConsolidados.length > 0 && (
              <span className="block text-sm text-gray-500 mt-2">
                Serviços disponíveis em {barbearias.length} unidades
              </span>
            )}
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <div 
              key={index} 
              className="bg-white rounded-lg p-8 hover:shadow-xl transition-all duration-300 group border border-gray-200"
            >
              <div className="space-y-6">
                {/* Header */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Scissors className="h-8 w-8 text-black" />
                    <div className="text-right">
                      <div className="text-2xl font-bold text-black">{service.price}</div>
                      <div className="flex items-center text-sm text-gray-500">
                        <Clock className="h-4 w-4 mr-1" />
                        {service.duration}
                      </div>
                    </div>
                  </div>
                  <h3 className="text-xl font-semibold text-black">{service.title}</h3>
                  <p className="text-gray-600">{service.description}</p>
                  
                  {/* Mostrar em quais barbearias está disponível */}
                  {service.barbearias && service.barbearias.length > 0 && (
                    <div className="text-xs text-gray-500">
                      Disponível em: {service.barbearias.join(', ')}
                    </div>
                  )}
                </div>

                {/* Features */}
                <div className="space-y-3">
                  <h4 className="font-semibold text-black">Inclui:</h4>
                  <ul className="space-y-2">
                    {service.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center text-sm text-gray-600">
                        <Star className="h-4 w-4 text-black mr-2 flex-shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>


              </div>
            </div>
          ))}
        </div>

        {/* Mensagem se não há serviços configurados */}
        {servicosConsolidados.length === 0 && !loading && (
          <div className="text-center py-8">
            <p className="text-gray-600">
              Nossos serviços estão sendo configurados. Entre em contato conosco para mais informações.
            </p>
          </div>
        )}
      </div>
    </section>
  );
} 