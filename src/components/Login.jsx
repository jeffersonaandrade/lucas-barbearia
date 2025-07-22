import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.jsx';
import { Button } from '@/components/ui/button.jsx';
import { Input } from '@/components/ui/input.jsx';
import { Label } from '@/components/ui/label.jsx';
import { Alert, AlertDescription } from '@/components/ui/alert.jsx';
import { Eye, EyeOff, Lock, Mail, ArrowLeft } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth.js';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    senha: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Simulação de login - em produção, isso seria uma chamada API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Validação básica
      if (formData.email === 'admin@lucasbarbearia.com' && formData.senha === 'admin123') {
        // Login como Admin
        const userData = {
          token: 'admin_token_' + Date.now(),
          role: 'admin',
          email: formData.email
        };
        login(userData);
        navigate(location.state?.from?.pathname || '/admin/dashboard');
      } else if (formData.email === 'gerente@lucasbarbearia.com' && formData.senha === 'gerente123') {
        // Login como Gerente
        const userData = {
          token: 'gerente_token_' + Date.now(),
          role: 'gerente',
          email: formData.email
        };
        login(userData);
        navigate(location.state?.from?.pathname || '/admin/dashboard');
      } else if (formData.email === 'barbeiro@lucasbarbearia.com' && formData.senha === 'barbeiro123') {
        // Login como Barbeiro
        const userData = {
          token: 'barbeiro_token_' + Date.now(),
          role: 'barbeiro',
          email: formData.email
        };
        login(userData);
        navigate(location.state?.from?.pathname || '/admin/dashboard');
      } else {
        setError('Email ou senha incorretos');
      }
    } catch (error) {
      setError('Erro ao fazer login. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 to-secondary/10 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card className="shadow-xl border-0">
          <CardHeader className="text-center pb-6">
            <div className="mx-auto mb-4 w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
              <Lock className="w-8 h-8 text-primary" />
            </div>
            <CardTitle className="text-2xl font-bold text-foreground">
              Área Administrativa
            </CardTitle>
            <p className="text-muted-foreground text-sm">
              Faça login para acessar o painel administrativo
            </p>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium">
                  Email
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="seu@email.com"
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="senha" className="text-sm font-medium">
                  Senha
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="senha"
                    name="senha"
                    type={showPassword ? 'text' : 'password'}
                    value={formData.senha}
                    onChange={handleInputChange}
                    placeholder="Sua senha"
                    className="pl-10 pr-10"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full"
                disabled={loading}
              >
                {loading ? 'Entrando...' : 'Entrar'}
              </Button>
            </form>

            <div className="text-center space-y-4">
              <Link
                to="/admin/recuperar-senha"
                className="text-sm text-primary hover:text-primary/80 transition-colors"
              >
                Esqueceu sua senha?
              </Link>
              
              <div className="border-t pt-4">
                <Link
                  to="/"
                  className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Voltar ao site
                </Link>
              </div>
            </div>

            {/* Credenciais de teste */}
            <div className="mt-6 p-4 bg-muted/50 rounded-lg">
              <p className="text-xs text-muted-foreground mb-2 font-medium">
                Credenciais de teste:
              </p>
              <div className="space-y-1 text-xs">
                <p><strong>Admin:</strong> admin@lucasbarbearia.com / admin123</p>
                <p><strong>Gerente:</strong> gerente@lucasbarbearia.com / gerente123</p>
                <p><strong>Barbeiro:</strong> barbeiro@lucasbarbearia.com / barbeiro123</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Login; 