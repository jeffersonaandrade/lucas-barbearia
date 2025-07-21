import { Phone, Mail, MapPin, Clock, Instagram, MessageCircle, Calendar } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card.jsx';
import { Button } from '@/components/ui/button.jsx';
import { siteConfig } from '@/config/site.js';
import AppointmentScheduler from './AppointmentScheduler.jsx';

const Contact = () => {
  return (
    <section id="contact" className="section-padding bg-muted/30">
      <div className="container mx-auto">
        <div className="text-center space-y-4 mb-16">
          <div className="flex items-center justify-center space-x-2 text-primary">
            <MessageCircle className="w-5 h-5" />
            <span className="text-sm font-medium uppercase tracking-wide">
              Contato
            </span>
          </div>
          
          <h2 className="heading-secondary">
            Entre em{' '}
            <span className="text-primary">contato</span>
          </h2>
          
          <p className="text-body max-w-2xl mx-auto">
            Entre em contato para agendar uma consulta ou tirar suas dúvidas.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Informações de Contato */}
          <div className="space-y-8">
            <div>
              <h3 className="text-2xl font-semibold text-foreground mb-6">
                Informações de Contato
              </h3>
              
              <div className="space-y-6">
                {siteConfig.contactInfo.map((contact, index) => (
                  <div key={index} className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                      {contact.icon === 'Phone' && <Phone className="w-6 h-6 text-primary" />}
                      {contact.icon === 'Instagram' && <Instagram className="w-6 h-6 text-primary" />}
                      {contact.icon === 'MapPin' && <MapPin className="w-6 h-6 text-primary" />}
                      {contact.icon === 'Clock' && <Clock className="w-6 h-6 text-primary" />}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-foreground">{contact.title}</h4>
                      <p className="text-primary font-medium">{contact.content}</p>
                      <p className="text-sm text-muted-foreground">{contact.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Informações de Consulta */}
            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <Clock className="w-5 h-5 text-primary mt-1" />
                <div>
                  <p className="font-medium text-foreground">Duração</p>
                  <p className="text-muted-foreground">{siteConfig.consultation.duration}</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <MapPin className="w-5 h-5 text-primary mt-1" />
                <div>
                  <p className="font-medium text-foreground">Área de Atendimento</p>
                  <p className="text-muted-foreground">{siteConfig.consultation.area}</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <Calendar className="w-5 h-5 text-primary mt-1" />
                <div>
                  <p className="font-medium text-foreground">Agendamento</p>
                  <p className="text-muted-foreground">{siteConfig.consultation.scheduling}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Formulário de Contato */}
          <div className="space-y-8">
            <div>
              <h3 className="text-2xl font-semibold text-foreground mb-6">
                Agende sua Consulta
              </h3>
              
              <div className="space-y-6">
                {/* Agendamento Online */}
                <Card className="border-primary/20">
                  <CardContent className="p-6">
                    <div className="text-center space-y-4">
                      <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                        <Calendar className="w-8 h-8 text-primary" />
                      </div>
                      <div>
                        <h4 className="text-lg font-semibold text-foreground mb-2">
                          Agendamento Online
                        </h4>
                        <p className="text-muted-foreground mb-4">
                          Marque sua consulta diretamente pelo calendário online. 
                          Rápido, seguro e confortável.
                        </p>
                        <AppointmentScheduler />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* WhatsApp */}
                <Card className="border-green-200">
                  <CardContent className="p-6">
                    <div className="text-center space-y-4">
                      <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                        <MessageCircle className="w-8 h-8 text-green-600" />
                      </div>
                      <div>
                        <h4 className="text-lg font-semibold text-foreground mb-2">
                          WhatsApp
                        </h4>
                        <p className="text-muted-foreground mb-4">
                          Prefere conversar diretamente? Entre em contato pelo WhatsApp.
                        </p>
                        <Button 
                          className="w-full bg-green-600 hover:bg-green-700 text-white"
                          onClick={() => window.open('https://wa.me/5511999999999?text=Olá! Gostaria de falar com a Tia Jow.', '_blank')}
                        >
                          <MessageCircle className="w-4 h-4 mr-2" />
                          Falar com a Tia Jow
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Instagram */}
                <Card className="border-pink-200">
                  <CardContent className="p-6">
                    <div className="text-center space-y-4">
                      <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mx-auto">
                        <Instagram className="w-8 h-8 text-pink-600" />
                      </div>
                      <div>
                        <h4 className="text-lg font-semibold text-foreground mb-2">
                          Instagram
                        </h4>
                        <p className="text-muted-foreground mb-4">
                          Siga a Tia Jow no Instagram para dicas e novidades.
                        </p>
                        <Button 
                          variant="outline"
                          className="w-full border-pink-300 text-pink-600 hover:bg-pink-50"
                          onClick={() => window.open(siteConfig.urls.instagram, '_blank')}
                        >
                          <Instagram className="w-4 h-4 mr-2" />
                          Seguir no Instagram
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-16 text-center">
          <div className="bg-white rounded-2xl p-8 shadow-sm">
            <h3 className="text-xl font-semibold text-foreground mb-4">
              Pronto para cuidar da respiração do seu filho?
            </h3>
            <p className="text-muted-foreground mb-6">
              Agende agora mesmo uma consulta com a Tia Jow e veja como o cuidado humanizado pode 
              fazer toda a diferença na saúde respiratória do seu pequeno.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <AppointmentScheduler />
              <Button 
                variant="outline"
                className="border-primary text-primary hover:bg-primary hover:text-white"
                onClick={() => window.open('https://wa.me/5511999999999?text=Olá! Gostaria de mais informações sobre a consulta.', '_blank')}
              >
                Falar com a Tia Jow
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;

