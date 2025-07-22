import { useState, useEffect, useMemo } from 'react';
import { Button } from '@/components/ui/button.jsx';
import { Card, CardContent } from '@/components/ui/card.jsx';
import { 
  Cookie, 
  X, 
  Settings, 
  Shield, 
  CheckCircle,
  ExternalLink
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useCookieConsent } from '@/hooks/useCookieConsent.js';

const CookieConsent = () => {
  const [showConsent, setShowConsent] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const navigate = useNavigate();
  const { shouldShowConsent, updateConsent } = useCookieConsent();

  // Memoizar o resultado para evitar re-renderizações desnecessárias
  const shouldShow = useMemo(() => shouldShowConsent(), [shouldShowConsent]);

  useEffect(() => {
    // Mostrar o modal se deve mostrar consentimento
    if (shouldShow) {
      setTimeout(() => {
        setShowConsent(true);
      }, 1000);
    }
  }, [shouldShow]);

  const handleAcceptAll = () => {
    updateConsent('all');
    setShowConsent(false);
  };

  const handleAcceptEssential = () => {
    updateConsent('essential');
    setShowConsent(false);
  };

  const handleReject = () => {
    updateConsent('rejected');
    setShowConsent(false);
  };

  const handlePrivacyPolicy = () => {
    navigate('/privacidade');
    setShowConsent(false);
  };

  // Não renderizar se não deve mostrar consentimento ou se já foi fechado
  if (!shouldShow || !showConsent) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-end justify-center p-4 z-50">
      <Card className="w-full max-w-lg bg-card border border-border shadow-2xl">
        <CardContent className="p-4">
          {/* Header Compacto */}
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                <Cookie className="w-4 h-4 text-primary" />
              </div>
              <div>
                <h3 className="text-base font-semibold text-foreground">
                  Política de Cookies
                </h3>
                <p className="text-xs text-muted-foreground">
                  Utilizamos cookies para melhorar sua experiência
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowConsent(false)}
              className="text-muted-foreground hover:text-foreground h-6 w-6 p-0"
            >
              <X className="w-3 h-3" />
            </Button>
          </div>

          {/* Conteúdo Principal Compacto */}
          <div className="space-y-3">
            <p className="text-xs text-muted-foreground leading-relaxed">
              Utilizamos cookies para personalizar conteúdo, fornecer recursos de mídia social 
              e analisar nosso tráfego. Você pode escolher quais tipos de cookies aceitar.
            </p>

            {/* Tipos de Cookies Compactos */}
            <div className="grid grid-cols-1 gap-2">
              <div className="flex items-center space-x-2 p-2 bg-secondary/30 rounded text-xs">
                <CheckCircle className="w-3 h-3 text-green-600 flex-shrink-0" />
                <span className="text-foreground">Essenciais</span>
                <span className="text-muted-foreground">(Sempre ativos)</span>
              </div>

              <div className="flex items-center space-x-2 p-2 bg-secondary/30 rounded text-xs">
                <Settings className="w-3 h-3 text-blue-600 flex-shrink-0" />
                <span className="text-foreground">Preferências</span>
                <span className="text-muted-foreground">(Personalização)</span>
              </div>

              <div className="flex items-center space-x-2 p-2 bg-secondary/30 rounded text-xs">
                <Shield className="w-3 h-3 text-purple-600 flex-shrink-0" />
                <span className="text-foreground">Análise</span>
                <span className="text-muted-foreground">(Métricas de uso)</span>
              </div>
            </div>

            {/* Links Compactos */}
            <div className="flex items-center justify-between text-xs">
              <button
                onClick={handlePrivacyPolicy}
                className="flex items-center space-x-1 text-primary hover:underline"
              >
                <span>Política de Privacidade</span>
                <ExternalLink className="w-2 h-2" />
              </button>
              <button
                onClick={() => setShowDetails(!showDetails)}
                className="flex items-center space-x-1 text-muted-foreground hover:text-foreground"
              >
                <span>Detalhes</span>
                <Settings className="w-2 h-2" />
              </button>
            </div>

            {/* Detalhes Expandidos Compactos */}
            {showDetails && (
              <div className="p-3 bg-secondary/20 rounded text-xs space-y-2">
                <h4 className="font-medium text-foreground">Detalhes:</h4>
                <div className="space-y-1 text-muted-foreground">
                  <p><strong>Essenciais:</strong> Sessão, autenticação</p>
                  <p><strong>Preferências:</strong> Idioma, tema, configurações</p>
                  <p><strong>Análise:</strong> Google Analytics, métricas</p>
                </div>
              </div>
            )}

            {/* Botões de Ação Compactos */}
            <div className="flex gap-2 pt-2">
              <Button
                onClick={handleAcceptAll}
                size="sm"
                className="flex-1 bg-primary text-primary-foreground hover:bg-accent text-xs h-8"
              >
                <CheckCircle className="w-3 h-3 mr-1" />
                Aceitar Todos
              </Button>
              
              <Button
                onClick={handleAcceptEssential}
                size="sm"
                variant="outline"
                className="flex-1 text-xs h-8"
              >
                <Shield className="w-3 h-3 mr-1" />
                Essenciais
              </Button>
              
              <Button
                onClick={handleReject}
                size="sm"
                variant="ghost"
                className="text-muted-foreground hover:text-foreground text-xs h-8"
              >
                Rejeitar
              </Button>
            </div>

            {/* Nota Legal Compacta */}
            <p className="text-xs text-muted-foreground text-center">
              Ao continuar, você concorda com nossa política de cookies.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CookieConsent; 