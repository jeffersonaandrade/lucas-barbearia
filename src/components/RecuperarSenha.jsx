import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.jsx';
import { Button } from '@/components/ui/button.jsx';
import { Input } from '@/components/ui/input.jsx';
import { Label } from '@/components/ui/label.jsx';
import { Alert, AlertDescription } from '@/components/ui/alert.jsx';
import { Mail, ArrowLeft, CheckCircle, AlertCircle } from 'lucide-react';

const RecuperarSenha = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      // Simulação de envio de email - em produção, isso seria uma chamada API
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Validação básica
      if (!email || !email.includes('@')) {
        setError('Por favor, insira um email válido');
        return;
      }

      // Simula sucesso para emails válidos
      setSuccess(true);
      setEmail('');
    } catch (error) {
      setError('Erro ao enviar email de recuperação. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleBackToLogin = () => {
    setSuccess(false);
    setError('');
    setEmail('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 to-secondary/10 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card className="shadow-xl border-0">
          <CardHeader className="text-center pb-6">
            <div className="mx-auto mb-4 w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
              <Mail className="w-8 h-8 text-primary" />
            </div>
            <CardTitle className="text-2xl font-bold text-foreground">
              {success ? 'Email Enviado!' : 'Recuperar Senha'}
            </CardTitle>
            <p className="text-muted-foreground text-sm">
              {success 
                ? 'Verifique sua caixa de entrada para redefinir sua senha'
                : 'Digite seu email para receber instruções de recuperação'
              }
            </p>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {success ? (
              <div className="space-y-6">
                <Alert className="border-green-200 bg-green-50">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <AlertDescription className="text-green-800">
                    Enviamos um link de recuperação para seu email. 
                    Verifique sua caixa de entrada e spam.
                  </AlertDescription>
                </Alert>

                <div className="bg-muted/50 p-4 rounded-lg">
                  <p className="text-sm text-muted-foreground mb-2">
                    <strong>Dica:</strong> Se não receber o email em alguns minutos:
                  </p>
                  <ul className="text-xs text-muted-foreground space-y-1">
                    <li>• Verifique se o email está correto</li>
                    <li>• Verifique sua pasta de spam</li>
                    <li>• Aguarde alguns minutos e tente novamente</li>
                  </ul>
                </div>

                <div className="space-y-3">
                  <Button
                    onClick={handleBackToLogin}
                    className="w-full"
                  >
                    Voltar ao Login
                  </Button>
                  
                  <Button
                    onClick={() => setSuccess(false)}
                    variant="outline"
                    className="w-full"
                  >
                    Enviar Novamente
                  </Button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium">
                    Email
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="seu@email.com"
                      className="pl-10"
                      required
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full"
                  disabled={loading}
                >
                  {loading ? 'Enviando...' : 'Enviar Email de Recuperação'}
                </Button>
              </form>
            )}

            <div className="text-center">
              <Link
                to="/admin/login"
                className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Voltar ao login
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

export default RecuperarSenha; 