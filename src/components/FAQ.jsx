import { useState, memo } from 'react';
import { ChevronDown, ChevronUp, HelpCircle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card.jsx';
import faqData from '@/data/faq.js';
import { useWhatsApp } from '@/hooks/use-whatsapp.js';
import { useIntersectionObserver } from '@/hooks/use-intersection-observer.js';

const FAQ = memo(() => {
  const [openItems, setOpenItems] = useState(new Set([0])); // Primeiro item aberto por padrão
  const { sendMessage } = useWhatsApp();
  const { elementRef, hasIntersected } = useIntersectionObserver();

  const handleWhatsAppClick = (messageType) => {
    sendMessage(messageType);
  };

  const toggleItem = (index) => {
    const newOpenItems = new Set(openItems);
    if (newOpenItems.has(index)) {
      newOpenItems.delete(index);
    } else {
      newOpenItems.add(index);
    }
    setOpenItems(newOpenItems);
  };

  return (
    <section id="faq" className="section-padding bg-white">
      <div className="container mx-auto">
        <div 
          ref={elementRef}
          className={`text-center space-y-3 sm:space-y-4 mb-12 sm:mb-16 transition-all duration-700 ${
            hasIntersected ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <div className="flex items-center justify-center space-x-2 text-primary">
            <HelpCircle className="w-4 h-4 sm:w-5 sm:h-5" />
            <span className="text-xs sm:text-sm font-medium uppercase tracking-wide">
              Perguntas Frequentes
            </span>
          </div>
          
          <h2 className="heading-secondary text-2xl sm:text-3xl md:text-4xl">
            Tire suas{' '}
            <span className="text-primary">dúvidas</span>
          </h2>
          
          <p className="text-body text-sm sm:text-base md:text-lg max-w-2xl mx-auto">
            Encontre respostas para as perguntas mais comuns sobre o atendimento, 
            valores, metodologia e como a fisioterapia respiratória pode ajudar seu filho.
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="space-y-3 sm:space-y-4">
            {faqData.map((faq, index) => (
              <Card key={index} className="border-border">
                <CardContent className="p-0">
                  <button
                    className="w-full p-4 sm:p-6 text-left flex items-center justify-between hover:bg-muted/30 transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                    onClick={() => toggleItem(index)}
                    aria-expanded={openItems.has(index)}
                    aria-controls={`faq-content-${index}`}
                  >
                    <h3 id={`faq-question-${index}`} className="font-semibold text-foreground pr-4 text-sm sm:text-base">
                      {faq.question}
                    </h3>
                    {openItems.has(index) ? (
                      <ChevronUp className="w-4 h-4 sm:w-5 sm:h-5 text-primary flex-shrink-0" />
                    ) : (
                      <ChevronDown className="w-4 h-4 sm:w-5 sm:h-5 text-primary flex-shrink-0" />
                    )}
                  </button>
                  
                  {openItems.has(index) && (
                    <div 
                      id={`faq-content-${index}`}
                      className="px-4 sm:px-6 pb-4 sm:pb-6"
                      role="region"
                      aria-labelledby={`faq-question-${index}`}
                    >
                      <div className="border-t border-border pt-3 sm:pt-4">
                        <p className="text-muted-foreground leading-relaxed text-sm sm:text-base">
                          {faq.answer}
                        </p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-12 sm:mt-16 text-center">
          <div className="bg-gradient-to-r from-primary/10 to-accent/10 rounded-xl sm:rounded-2xl p-6 sm:p-8">
            <h3 className="text-lg sm:text-xl font-semibold text-foreground mb-3 sm:mb-4">
              Ainda tem dúvidas?
            </h3>
            <p className="text-muted-foreground mb-4 sm:mb-6 max-w-md mx-auto text-sm sm:text-base">
              Entre em contato diretamente com a Lucas Barbearia pelo WhatsApp. 
              Ela terá prazer em esclarecer todas as suas questões.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
              <button 
                className="px-4 sm:px-6 py-2.5 sm:py-3 gradient-primary text-white rounded-lg hover:opacity-90 transition-opacity focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 text-sm sm:text-base"
                onClick={() => handleWhatsAppClick('respiratoryQuestions')}
                aria-label="Falar com a Lucas Barbearia pelo WhatsApp"
              >
                                  Falar com a Barbearia
              </button>
              <button 
                className="px-4 sm:px-6 py-2.5 sm:py-3 border border-primary text-primary rounded-lg hover:bg-primary hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 text-sm sm:text-base"
                onClick={() => window.open('https://calendly.com/ronaldocinebox1/30min', '_blank')}
                aria-label="Agendar consulta pelo Calendly"
              >
                Agendar Consulta
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
});

FAQ.displayName = 'FAQ';

export default FAQ;

