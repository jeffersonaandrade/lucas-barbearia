import { Button } from '@/components/ui/button.jsx';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.jsx';
import { ArrowLeft, Shield } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const PrivacyPolicy = () => {
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        <Card className="border-primary/20 bg-card shadow-lg">
          <CardHeader className="text-center">
            <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <Shield className="w-10 h-10 text-primary" />
            </div>
            <CardTitle className="text-3xl font-bold text-foreground mb-2">
              Política de Privacidade
            </CardTitle>
            <p className="text-muted-foreground text-lg">
              Como protegemos suas informações
            </p>
          </CardHeader>
          
          <CardContent className="space-y-8">
            <div className="text-center">
              <p className="text-muted-foreground mb-4">
                A Lucas Barbearia está comprometida em proteger sua privacidade. 
                Esta política descreve como coletamos, usamos e protegemos suas informações pessoais.
              </p>
            </div>

            <div className="text-center">
              <Button
                onClick={handleGoBack}
                variant="outline"
                className="px-8"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Voltar
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PrivacyPolicy; 