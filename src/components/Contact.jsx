import { Phone, MapPin, Clock, Instagram, MessageCircle, Scissors } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card.jsx';
import { Button } from '@/components/ui/button.jsx';
import { siteConfig } from '@/config/site.js';
import { Link } from 'react-router-dom';

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
            Entre em contato para entrar na fila ou tirar suas dúvidas sobre nossos serviços.
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

            {/* Informações da Barbearia */}
            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <Clock className="w-5 h-5 text-primary mt-1" />
                <div>
                  <p className="font-medium text-foreground">Horário de Funcionamento</p>
                  <div className="text-muted-foreground space-y-1">
                    <p>Segunda a Sexta: 9h às 19h</p>
                    <p>Sábado: 9h às 18h</p>
                    <p>Domingo: Fechado</p>
                  </div>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <MapPin className="w-5 h-5 text-primary mt-1" />
                <div>
                  <p className="font-medium text-foreground">Localização</p>
                  <p className="text-muted-foreground">São Paulo, SP</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <Scissors className="w-5 h-5 text-primary mt-1" />
                <div>
                  <p className="font-medium text-foreground">Informações Importantes</p>
                  <div className="text-muted-foreground space-y-1">
                    <p>• Agendamento recomendado</p>
                    <p>• Aceitamos cartões e PIX</p>
                    <p>• Produtos disponíveis para venda</p>
                    <p>• Estacionamento gratuito</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Ações Rápidas */}
          <div className="space-y-8">
            <div>
              <h3 className="text-2xl font-semibold text-foreground mb-6">
                Ações Rápidas
              </h3>
              
              <div className="space-y-6">
                {/* Entrar na Fila */}
                <Card className="border-primary/20">
                  <CardContent className="p-6">
                    <div className="text-center space-y-4">
                      <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                        <Scissors className="w-8 h-8 text-primary" />
                      </div>
                      <div>
                        <h4 className="text-lg font-semibold text-foreground mb-2">
                          Nossas Unidades
                        </h4>
                        <p className="text-muted-foreground mb-4">
                          Conheça nossas unidades e escolha a mais próxima de você. 
                          Todas com a mesma qualidade e atendimento.
                        </p>
                        <Link to="/barbearias">
                          <Button className="w-full bg-primary text-primary-foreground hover:bg-accent hover:text-accent-foreground">
                            <Scissors className="w-4 h-4 mr-2" />
                            Nossas Unidades
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* WhatsApp */}
                <Card className="border-primary/20">
                  <CardContent className="p-6">
                    <div className="text-center space-y-4">
                      <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                        <MessageCircle className="w-8 h-8 text-primary" />
                      </div>
                      <div>
                        <h4 className="text-lg font-semibold text-foreground mb-2">
                          WhatsApp
                        </h4>
                        <p className="text-muted-foreground mb-4">
                          Prefere conversar diretamente? Entre em contato pelo WhatsApp.
                        </p>
                        <Button 
                          className="w-full bg-primary text-primary-foreground hover:bg-accent hover:text-accent-foreground"
                          onClick={() => window.open('https://wa.me/5511999999999?text=Olá! Gostaria de falar com a Lucas Barbearia.', '_blank')}
                        >
                          <MessageCircle className="w-4 h-4 mr-2" />
                          Falar com a Barbearia
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Instagram */}
                <Card className="border-primary/20">
                  <CardContent className="p-6">
                    <div className="text-center space-y-4">
                      <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                        <Instagram className="w-8 h-8 text-primary" />
                      </div>
                      <div>
                        <h4 className="text-lg font-semibold text-foreground mb-2">
                          Instagram
                        </h4>
                        <p className="text-muted-foreground mb-4">
                          Siga a Lucas Barbearia no Instagram para novidades e inspirações.
                        </p>
                        <Button 
                          variant="outline"
                          className="w-full border-primary text-primary hover:bg-primary hover:text-primary-foreground"
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
              Pronto para um visual incrível?
            </h3>
            <p className="text-muted-foreground mb-6">
              Conheça nossas unidades e descubra como a Lucas Barbearia pode transformar seu visual 
              com qualidade e praticidade.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/barbearias">
                <Button className="bg-primary text-primary-foreground hover:bg-accent hover:text-accent-foreground">
                  <Scissors className="w-4 h-4 mr-2" />
                  Nossas Unidades
                </Button>
              </Link>
              <Button 
                variant="outline"
                className="border-primary text-primary hover:bg-primary hover:text-primary-foreground"
                onClick={() => window.open('https://wa.me/5511999999999?text=Olá! Gostaria de mais informações sobre a barbearia.', '_blank')}
              >
                <MessageCircle className="w-4 h-4 mr-2" />
                Falar com a Barbearia
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;

