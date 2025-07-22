import { useEffect, useRef, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card.jsx';
import { Button } from '@/components/ui/button.jsx';
import { Play, ExternalLink, Instagram } from 'lucide-react';
import { cn } from '@/lib/utils.js';

const InstagramEmbed = ({ 
  postUrl, 
  title, 
  description, 
  className,
  showTitle = true,
  showDescription = true 
}) => {
  const embedRef = useRef(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    // Função para carregar o script do Instagram
    const loadInstagramScript = () => {
      if (window.instgrm) {
        window.instgrm.Embeds.process();
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://www.instagram.com/embed.js';
      script.async = true;
      script.onload = () => {
        if (window.instgrm) {
          window.instgrm.Embeds.process();
        }
      };
      script.onerror = () => {
        setHasError(true);
      };
      document.head.appendChild(script);
    };

    // Carregar o script se ainda não foi carregado
    if (!window.instgrm) {
      loadInstagramScript();
    } else {
      window.instgrm.Embeds.process();
    }

    // Processar embeds quando o componente montar
    const timer = setTimeout(() => {
      if (window.instgrm) {
        window.instgrm.Embeds.process();
        setIsLoaded(true);
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, [postUrl]);

  const handleInstagramClick = () => {
    window.open(postUrl, '_blank');
  };

  if (hasError) {
    return (
      <Card className={cn("group hover:shadow-lg transition-all duration-300", className)}>
        <CardContent className="p-6">
          <div className="text-center space-y-4">
            <div className="w-16 h-16 bg-gradient-to-br from-pink-400 to-purple-500 rounded-full flex items-center justify-center mx-auto">
              <Instagram className="w-8 h-8 text-white" />
            </div>
            <div className="space-y-2">
              <h3 className="font-semibold text-foreground">{title}</h3>
              {showDescription && (
                <p className="text-sm text-muted-foreground">{description}</p>
              )}
            </div>
            <Button 
              onClick={handleInstagramClick}
              className="gradient-primary text-white hover:opacity-90"
            >
              <Instagram className="w-4 h-4 mr-2" />
              Ver no Instagram
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={cn("group hover:shadow-lg transition-all duration-300", className)}>
      <CardContent className="p-0">
        {/* Loading State */}
        {!isLoaded && (
          <div className="aspect-square bg-gradient-to-br from-pink-100 to-purple-100 flex items-center justify-center">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-gradient-to-br from-pink-400 to-purple-500 rounded-full flex items-center justify-center mx-auto animate-pulse">
                <Play className="w-8 h-8 text-white" />
              </div>
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto animate-pulse"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2 mx-auto animate-pulse"></div>
              </div>
            </div>
          </div>
        )}

        {/* Instagram Embed */}
        <div 
          ref={embedRef}
          className={cn(
            "instagram-media",
            !isLoaded && "hidden"
          )}
          data-instgrm-permalink={postUrl}
          data-instgrm-version="14"
          style={{
            background: '#FFF',
            border: '0',
            borderRadius: '3px',
            boxShadow: '0 0 1px 0 rgba(0,0,0,0.5),0 1px 10px 0 rgba(0,0,0,0.15)',
            margin: '1px',
            maxWidth: '540px',
            minWidth: '326px',
            padding: '0',
            width: 'calc(100% - 2px)'
          }}
        >
          <div style={{ padding: '16px' }}>
            <a 
              href={postUrl} 
              style={{
                background: '#FFFFFF',
                lineHeight: '0',
                padding: '0 0',
                textAlign: 'center',
                textDecoration: 'none',
                width: '100%'
              }}
              target="_blank"
              rel="noopener noreferrer"
            >
              Ver esta publicação no Instagram
            </a>
          </div>
        </div>

        {/* Content Info */}
        {(showTitle || showDescription) && (
          <div className="p-6 space-y-3">
            {showTitle && (
              <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-2">
                {title}
              </h3>
            )}
            {showDescription && (
              <p className="text-sm text-muted-foreground line-clamp-3">
                {description}
              </p>
            )}
            
            <div className="flex items-center justify-between pt-2">
              <span className="text-xs text-muted-foreground">
                Publicado por Lucas Barbearia
              </span>
              <Button 
                size="sm" 
                variant="ghost" 
                className="text-primary hover:text-primary hover:bg-primary/10"
                onClick={handleInstagramClick}
              >
                <ExternalLink className="w-4 h-4 mr-1" />
                Ver no Instagram
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export { InstagramEmbed }; 