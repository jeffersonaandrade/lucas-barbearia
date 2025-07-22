import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.jsx';
import { Button } from '@/components/ui/button.jsx';
import { AlertTriangle, ArrowLeft, Shield } from 'lucide-react';

const Unauthorized = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card className="shadow-xl border-0">
          <CardHeader className="text-center pb-6">
            <div className="mx-auto mb-4 w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
              <Shield className="w-8 h-8 text-red-600" />
            </div>
            <CardTitle className="text-2xl font-bold text-gray-900">
              Acesso Negado
            </CardTitle>
            <p className="text-muted-foreground text-sm">
              Você não tem permissão para acessar esta área
            </p>
          </CardHeader>
          
          <CardContent className="space-y-6">
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5" />
                <div>
                  <h3 className="font-medium text-red-800">Permissão Insuficiente</h3>
                  <p className="text-sm text-red-700 mt-1">
                    Esta área requer privilégios administrativos específicos. 
                    Entre em contato com o administrador do sistema se você 
                    acredita que deveria ter acesso.
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <Button
                onClick={() => window.history.back()}
                className="w-full"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Voltar
              </Button>
              
              <Link to="/admin/dashboard">
                <Button
                  variant="outline"
                  className="w-full"
                >
                  Ir para Dashboard
                </Button>
              </Link>
            </div>

            <div className="border-t pt-4">
              <Link
                to="/"
                className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Voltar ao site
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Unauthorized; 