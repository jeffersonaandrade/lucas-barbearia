import { useState } from 'react';
import { Button } from '@/components/ui/button.jsx';
import { useWhatsApp } from '@/hooks/use-whatsapp.js';
import { useIntersectionObserver } from '@/hooks/use-intersection-observer.js';

const Gallery = () => {
  const [selectedCategory, setSelectedCategory] = useState('todos');
  const { handleContactAction } = useWhatsApp();
  const { elementRef, hasIntersected } = useIntersectionObserver();

  const categories = [
    { id: 'todos', label: 'Todos' },
    { id: 'cortes', label: 'Cortes' },
    { id: 'barbas', label: 'Barbas' },
    { id: 'ambiente', label: 'Ambiente' }
  ];

  // Placeholder images - usando CSS em vez de URLs externas
  const images = [
    { id: 1, category: 'cortes', alt: 'Corte masculino moderno', placeholder: 'Corte 1' },
    { id: 2, category: 'cortes', alt: 'Corte clássico', placeholder: 'Corte 2' },
    { id: 3, category: 'barbas', alt: 'Barba bem feita', placeholder: 'Barba 1' },
    { id: 4, category: 'barbas', alt: 'Acabamento de barba', placeholder: 'Barba 2' },
    { id: 5, category: 'ambiente', alt: 'Nosso ambiente', placeholder: 'Ambiente 1' },
    { id: 6, category: 'ambiente', alt: 'Sala de espera', placeholder: 'Ambiente 2' },
    { id: 7, category: 'cortes', alt: 'Corte degradê', placeholder: 'Corte 3' },
    { id: 8, category: 'barbas', alt: 'Barba longa', placeholder: 'Barba 3' },
    { id: 9, category: 'ambiente', alt: 'Cadeiras', placeholder: 'Ambiente 3' }
  ];

  const filteredImages = selectedCategory === 'todos' 
    ? images 
    : images.filter(img => img.category === selectedCategory);

  return (
    <section id="gallery" className="py-20 bg-card">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div 
          ref={elementRef}
          className={`text-center space-y-4 mb-16 transition-all duration-700 ${
            hasIntersected ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <h2 className="text-4xl md:text-5xl font-bold text-foreground">
            Nossa <span className="text-primary">Galeria</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Confira alguns dos nossos trabalhos e conheça nosso ambiente
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`px-6 py-3 rounded-lg font-medium uppercase tracking-wider transition-all duration-300 ${
                selectedCategory === category.id
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-secondary text-secondary-foreground hover:bg-primary hover:text-primary-foreground'
              }`}
            >
              {category.label}
            </button>
          ))}
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredImages.map((image) => (
            <div key={image.id} className="group relative overflow-hidden rounded-lg bg-secondary">
              <img
                src={image.src}
                alt={image.alt}
                className="w-full h-80 object-cover transition-transform duration-300 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-all duration-300 flex items-center justify-center">
                <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-center">
                  <h3 className="text-white font-semibold text-lg mb-2">
                    {image.alt}
                  </h3>
                  <p className="text-white/80 text-sm">
                    Clique para ampliar
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredImages.length === 0 && (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">📷</div>
            <h3 className="text-2xl font-semibold text-foreground mb-2">
              Nenhuma imagem encontrada
            </h3>
            <p className="text-muted-foreground">
              Não temos imagens nesta categoria ainda.
            </p>
          </div>
        )}

        {/* CTA Section */}
        <div className="mt-16 text-center">
          <div className="bg-secondary rounded-lg p-8 max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold text-foreground mb-4">
              Gostou do nosso trabalho?
            </h3>
            <p className="text-muted-foreground mb-6">
              Agende seu horário e venha experimentar nossos serviços
            </p>
            <Button 
              onClick={() => handleContactAction('whatsapp', 'gallery')}
            >
              Agendar Horário
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Gallery; 