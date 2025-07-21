import { useState } from 'react';
import { Calendar, Clock, MapPin, CheckCircle, ArrowRight, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button.jsx';
import { Card, CardContent } from '@/components/ui/card.jsx';
import { siteConfig } from '@/config/site.js';
import CalendlyWidget from './CalendlyWidget.jsx';

const AppointmentScheduler = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isWidgetOpen, setIsWidgetOpen] = useState(false);

  const handleCalendlyOpen = (e) => {
    // Previne qualquer comportamento padrão
    e.preventDefault();
    e.stopPropagation();
    
    // Abre Calendly em nova aba
    window.open(siteConfig.urls.calendly, '_blank', 'noopener,noreferrer');
  };

  const handleWidgetOpen = () => {
    setIsWidgetOpen(true);
  };

  const handleModalOpen = () => {
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  const handleWidgetClose = () => {
    setIsWidgetOpen(false);
  };

  const benefits = [
    {
      icon: Calendar,
      title: 'Agendamento 24/7',
      description: 'Marque sua consulta a qualquer momento'
    },
    {
      icon: Clock,
      title: 'Horários Flexíveis',
      description: 'Escolha o melhor horário para você'
    },
    {
      icon: MapPin,
      title: 'Atendimento Domiciliar',
      description: 'No conforto da sua casa'
    },
    {
      icon: CheckCircle,
      title: 'Confirmação Automática',
      description: 'Receba confirmação por email'
    }
  ];

  return (
    <>
      {/* Botão Principal */}
      <Button 
        onClick={handleCalendlyOpen}
        className="bg-primary hover:bg-primary/90 text-white px-8 py-3 text-lg font-semibold rounded-lg"
        size="lg"
        type="button"
      >
        <Calendar className="w-5 h-5 mr-2" />
        Agendar Consulta
        <ArrowRight className="w-4 h-4 ml-2" />
      </Button>

      {/* Modal de Agendamento */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-primary to-accent p-6 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold">Agendar Consulta</h2>
                  <p className="text-white/90 mt-1">
                    Escolha o melhor horário para sua consulta
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleModalClose}
                  className="text-white hover:bg-white/20"
                >
                  ✕
                </Button>
              </div>
            </div>

            {/* Content */}
            <div className="p-6">
              <div className="grid lg:grid-cols-2 gap-8">
                {/* Opções de Agendamento */}
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold text-foreground">
                    Como prefere agendar?
                  </h3>
                  
                  <div className="space-y-4">
                    {/* Opção 1: Widget Integrado */}
                    <Card className="border-primary/20 hover:shadow-md transition-shadow cursor-pointer" onClick={handleWidgetOpen}>
                      <CardContent className="p-6">
                        <div className="flex items-center space-x-4">
                          <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                            <Calendar className="w-6 h-6 text-primary" />
                          </div>
                          <div className="flex-1">
                            <h4 className="font-semibold text-foreground">Agendar Aqui</h4>
                            <p className="text-sm text-muted-foreground">
                              Use o calendário integrado no site
                            </p>
                          </div>
                          <ArrowRight className="w-4 h-4 text-primary" />
                        </div>
                      </CardContent>
                    </Card>

                    {/* Opção 2: Nova Aba */}
                    <Card className="border-primary/20 hover:shadow-md transition-shadow cursor-pointer" onClick={handleCalendlyOpen}>
                      <CardContent className="p-6">
                        <div className="flex items-center space-x-4">
                          <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                            <ExternalLink className="w-6 h-6 text-primary" />
                          </div>
                          <div className="flex-1">
                            <h4 className="font-semibold text-foreground">Nova Aba</h4>
                            <p className="text-sm text-muted-foreground">
                              Abrir calendário em nova aba
                            </p>
                          </div>
                          <ArrowRight className="w-4 h-4 text-primary" />
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>

                {/* Informações */}
                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl font-semibold text-foreground mb-4">
                      Informações da Consulta
                    </h3>
                    
                    <div className="space-y-4">
                      <div className="flex items-start space-x-3">
                        <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                        <div>
                          <p className="font-medium text-foreground">Duração</p>
                          <p className="text-muted-foreground">{siteConfig.consultation.duration}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start space-x-3">
                        <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                        <div>
                          <p className="font-medium text-foreground">Local</p>
                          <p className="text-muted-foreground">Atendimento domiciliar</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start space-x-3">
                        <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                        <div>
                          <p className="font-medium text-foreground">Área de Atendimento</p>
                          <p className="text-muted-foreground">{siteConfig.consultation.area}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start space-x-3">
                        <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                        <div>
                          <p className="font-medium text-foreground">Horários</p>
                          <p className="text-muted-foreground">Segunda a Sexta, 8h às 18h</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Benefícios */}
                  <div>
                    <h4 className="font-semibold text-foreground mb-3">
                      Por que agendar online?
                    </h4>
                    <div className="space-y-3">
                      {benefits.map((benefit, index) => (
                        <div key={index} className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                            <benefit.icon className="w-4 h-4 text-primary" />
                          </div>
                          <div>
                            <p className="font-medium text-sm text-foreground">
                              {benefit.title}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {benefit.description}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* CTA */}
                  <div className="bg-gradient-to-r from-primary/10 to-accent/10 rounded-lg p-4">
                    <p className="text-sm text-muted-foreground mb-3">
                      Prefere falar com a Tia Jow primeiro?
                    </p>
                    <Button 
                      variant="outline" 
                      className="w-full border-primary text-primary hover:bg-primary hover:text-white"
                      onClick={() => window.open('https://wa.me/5511999999999?text=Olá! Gostaria de falar com a Tia Jow.', '_blank')}
                    >
                      Falar com a Tia Jow
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Widget do Calendly */}
      <CalendlyWidget isOpen={isWidgetOpen} onClose={handleWidgetClose} />
    </>
  );
};

export default AppointmentScheduler; 