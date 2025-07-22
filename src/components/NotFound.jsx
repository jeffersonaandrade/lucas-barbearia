import { Button } from '@/components/ui/button.jsx';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.jsx';
import { 
  Home, 
  Search, 
  MapPin, 
  Phone, 
  ArrowLeft,
  Scissors,
  Users,
  Clock
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { siteConfig } from '@/config/site.js';

const NotFound = () => {
  const navigate = useNavigate();

  const handleGoHome = () => {
    navigate('/');
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  const handleContact = () => {
    window.open(`https://wa.me/${siteConfig.contact.whatsapp}?text=Olá! Preciso de ajuda com o site da Lucas Barbearia.`, '_blank');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        <Card className="border-primary/20 bg-card shadow-lg">
          <CardHeader className="text-center">
            <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <Scissors className="w-10 h-10 text-primary" />
            </div>
            <CardTitle className="text-3xl font-bold text-foreground mb-2">
              Página não encontrada
            </CardTitle>
            <p className="text-muted-foreground text-lg">
              Ops! Parece que você se perdeu no caminho para a barbearia.
            </p>
          </CardHeader>
          
          <CardContent className="space-y-8">
            {/* Mensagem principal */}
            <div className="text-center">
              <p className="text-muted-foreground mb-4">
                A página que você está procurando não existe ou foi movida. 
                Mas não se preocupe, podemos te ajudar a encontrar o que precisa!
              </p>
            </div>

            {/* Ações principais */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Button
                onClick={handleGoHome}
                className="w-full bg-primary text-primary-foreground hover:bg-accent"
              >
                <Home className="w-4 h-4 mr-2" />
                Ir para o Início
              </Button>
              
              <Button
                onClick={handleGoBack}
                variant="outline"
                className="w-full"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Voltar
              </Button>
            </div>

            {/* Links úteis */}
            <div className="bg-secondary/50 rounded-lg p-6">
              <h3 className="font-semibold text-foreground mb-4 text-center">
                Encontre o que você procura:
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Button
                  onClick={() => navigate('/barbearias')}
                  variant="ghost"
                  className="justify-start h-auto p-3"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                      <MapPin className="w-5 h-5 text-primary" />
                    </div>
                    <div className="text-left">
                      <div className="font-medium text-foreground">Nossas Unidades</div>
                      <div className="text-sm text-muted-foreground">Encontre a barbearia mais próxima</div>
                    </div>
                  </div>
                </Button>

                <Button
                  onClick={() => navigate('/#services')}
                  variant="ghost"
                  className="justify-start h-auto p-3"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                      <Scissors className="w-5 h-5 text-primary" />
                    </div>
                    <div className="text-left">
                      <div className="font-medium text-foreground">Nossos Serviços</div>
                      <div className="text-sm text-muted-foreground">Veja o que oferecemos</div>
                    </div>
                  </div>
                </Button>

                <Button
                  onClick={() => navigate('/#testimonials')}
                  variant="ghost"
                  className="justify-start h-auto p-3"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                      <Users className="w-5 h-5 text-primary" />
                    </div>
                    <div className="text-left">
                      <div className="font-medium text-foreground">Depoimentos</div>
                      <div className="text-sm text-muted-foreground">O que nossos clientes dizem</div>
                    </div>
                  </div>
                </Button>

                <Button
                  onClick={() => navigate('/#contact')}
                  variant="ghost"
                  className="justify-start h-auto p-3"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                      <Phone className="w-5 h-5 text-primary" />
                    </div>
                    <div className="text-left">
                      <div className="font-medium text-foreground">Contato</div>
                      <div className="text-sm text-muted-foreground">Fale conosco</div>
                    </div>
                  </div>
                </Button>
              </div>
            </div>

            {/* Informações de contato */}
            <div className="bg-primary/5 rounded-lg p-4 border border-primary/20">
              <h4 className="font-semibold text-foreground mb-3 text-center">
                Precisa de ajuda?
              </h4>
              <div className="text-center space-y-2">
                <p className="text-sm text-muted-foreground">
                  Entre em contato conosco pelo WhatsApp
                </p>
                <Button
                  onClick={handleContact}
                  variant="outline"
                  className="border-primary text-primary hover:bg-primary hover:text-primary-foreground"
                >
                  <Phone className="w-4 h-4 mr-2" />
                  Falar com a Barbearia
                </Button>
              </div>
            </div>

            {/* Informações da barbearia */}
            <div className="text-center text-sm text-muted-foreground">
              <p className="mb-2">
                <strong>Lucas Barbearia</strong> - {siteConfig.contact.address}
              </p>
              <p className="flex items-center justify-center space-x-4">
                <span className="flex items-center">
                  <Clock className="w-3 h-3 mr-1" />
                  {siteConfig.contact.schedule}
                </span>
                <span className="flex items-center">
                  <Phone className="w-3 h-3 mr-1" />
                  {siteConfig.contact.whatsappFormatted}
                </span>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default NotFound; 