import { Play, Clock, Eye, Instagram, Heart, Shield, AlertTriangle, Activity, Home } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card.jsx';
import { Button } from '@/components/ui/button.jsx';
import { useWhatsApp } from '@/hooks/use-whatsapp.js';
import videoThumbnail from '@/assets/DSC04485.jpg';
import fogueiraImage from '@/assets/fogueira.jpg';
import preventionImage from '@/assets/DSC04353.jpg';
import emergencyImage from '@/assets/foto-tratada.jpeg';

const Videos = () => {
  const { handleContactAction } = useWhatsApp();

  const videos = [
    {
      id: 1,
      title: 'Você confiaria a saúde do seu filho a alguém que você nunca viu?',
      description: 'Dicas importantes sobre como escolher um profissional de confiança para cuidar da respiração do seu filho. A Tia Jow explica os critérios essenciais.',
      duration: '2:30',
      views: '1.2k',
      thumbnail: 'gradient-primary',
      instagramUrl: 'https://www.instagram.com/p/DMIGXRwuplp/',
      isRealVideo: true,
      customThumbnail: true
    },
    {
      id: 2,
      title: 'Fumaça e cheiros fortes - Como proteger seu pequeno',
      description: 'Orientações práticas para proteger crianças de irritantes respiratórios no ambiente doméstico. Dicas da Tia Jow para um ambiente mais saudável.',
      duration: '3:15',
      views: '890',
      thumbnail: 'gradient-soft',
      instagramUrl: 'https://www.instagram.com/p/DLKU9thOALH/',
      isRealVideo: true,
      customThumbnail: true,
      thumbnailType: 'smoke'
    },
    {
      id: 3,
      title: 'Sua criança está sempre com virose? Prevenção é o verdadeiro cuidado',
      description: 'A fisioterapia respiratória preventiva atua antes da doença chegar com força. Ajuda a eliminar secreções, impede que a gripe desça para o pulmão e fortalece a imunidade.',
      duration: '4:20',
      views: '2.1k',
      thumbnail: 'gradient-primary',
      instagramUrl: 'https://www.instagram.com/p/DKxsxGFOSxr/',
      isRealVideo: true,
      customThumbnail: true,
      thumbnailType: 'prevention'
    },
    {
      id: 4,
      title: 'Crise respiratória de madrugada: você saberia o que fazer?',
      description: 'Muitos pais não sabem e entram em pânico. Mas a fisioterapia respiratória pode ser decisiva. Atendimentos domiciliares existem para agir rápido, evitar agravamentos e tratar a criança num ambiente acolhedor.',
      duration: '3:45',
      views: '1.5k',
      thumbnail: 'gradient-soft',
      instagramUrl: 'https://www.instagram.com/p/DMNiWA0tmri/',
      isRealVideo: true,
      customThumbnail: true,
      thumbnailType: 'emergency'
    }
  ];

  const handleVideoClick = (video) => {
    if (video.instagramUrl) {
      window.open(video.instagramUrl, '_blank');
    } else {
      // Para vídeos que ainda não têm URL do Instagram, abrir WhatsApp
      handleContactAction('whatsapp', 'videos');
    }
  };

  const renderCustomThumbnail = (video) => {
    if (video.thumbnailType === 'smoke') {
      return (
        <div className="aspect-video rounded-t-lg relative overflow-hidden">
          {/* Background Image - Fogueira */}
          <div 
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${fogueiraImage})` }}
          >
            {/* Overlay para melhorar legibilidade */}
            <div className="absolute inset-0 bg-black/50"></div>
          </div>
          
          {/* Main Content */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center space-y-4 p-6">
              {/* Icon Container */}
              <div className="relative">
                <div className="w-20 h-20 bg-white/95 rounded-full flex items-center justify-center mx-auto shadow-lg">
                  <AlertTriangle className="w-10 h-10 text-orange-500" />
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-br from-red-400 to-orange-500 rounded-full flex items-center justify-center">
                  <Shield className="w-4 h-4 text-white" />
                </div>
              </div>
              
              {/* Text Content */}
              <div className="space-y-2">
                <h4 className="text-white font-bold text-lg leading-tight drop-shadow-lg">
                  Proteção Respiratória
                </h4>
                <p className="text-white/95 text-sm font-medium drop-shadow-md">
                  Fumaça e cheiros fortes
                </p>
              </div>
            </div>
          </div>

          {/* Overlay on Hover */}
          <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
            <div className="w-16 h-16 bg-white/95 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
              <Instagram className="w-8 h-8 text-primary" />
            </div>
          </div>
          
          {/* Video Info Overlay */}
          <div className="absolute bottom-4 left-4 right-4">
            <div className="flex items-center justify-between text-white text-sm">
              <div className="flex items-center space-x-2 bg-black/50 px-2 py-1 rounded-full">
                <Clock className="w-4 h-4" />
                <span className="font-medium">3:15</span>
              </div>
              <div className="flex items-center space-x-2 bg-black/50 px-2 py-1 rounded-full">
                <Eye className="w-4 h-4" />
                <span className="font-medium">890</span>
              </div>
            </div>
          </div>

          {/* Badge para vídeo real */}
          <div className="absolute top-4 right-4">
            <div className="bg-white/95 text-primary text-xs font-bold px-3 py-1.5 rounded-full flex items-center space-x-1 shadow-lg">
              <Instagram className="w-3 h-3" />
              <span>Instagram</span>
            </div>
          </div>

          {/* Decorative Elements */}
          <div className="absolute top-4 left-4">
            <div className="w-3 h-3 bg-white/60 rounded-full shadow-sm"></div>
          </div>
          <div className="absolute bottom-8 left-6">
            <div className="w-2 h-2 bg-white/50 rounded-full shadow-sm"></div>
          </div>
          <div className="absolute top-6 right-6">
            <div className="w-1.5 h-1.5 bg-white/70 rounded-full shadow-sm"></div>
          </div>
        </div>
      );
    }

    if (video.thumbnailType === 'prevention') {
      return (
        <div className="aspect-video rounded-t-lg relative overflow-hidden">
          {/* Background Image - DSC04353.jpg */}
          <div 
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${preventionImage})` }}
          >
            {/* Overlay para melhorar legibilidade */}
            <div className="absolute inset-0 bg-black/40"></div>
          </div>
          
          {/* Main Content */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center space-y-4 p-6">
              {/* Icon Container */}
              <div className="relative">
                <div className="w-20 h-20 bg-white/95 rounded-full flex items-center justify-center mx-auto shadow-lg">
                  <Activity className="w-10 h-10 text-green-500" />
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-br from-green-400 to-blue-500 rounded-full flex items-center justify-center">
                  <Shield className="w-4 h-4 text-white" />
                </div>
              </div>
              
              {/* Text Content */}
              <div className="space-y-2">
                <h4 className="text-white font-bold text-lg leading-tight drop-shadow-lg">
                  Prevenção é Proteção
                </h4>
                <p className="text-white/95 text-sm font-medium drop-shadow-md">
                  Fisioterapia preventiva
                </p>
              </div>
            </div>
          </div>

          {/* Overlay on Hover */}
          <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
            <div className="w-16 h-16 bg-white/95 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
              <Instagram className="w-8 h-8 text-primary" />
            </div>
          </div>
          
          {/* Video Info Overlay */}
          <div className="absolute bottom-4 left-4 right-4">
            <div className="flex items-center justify-between text-white text-sm">
              <div className="flex items-center space-x-2 bg-black/50 px-2 py-1 rounded-full">
                <Clock className="w-4 h-4" />
                <span className="font-medium">4:20</span>
              </div>
              <div className="flex items-center space-x-2 bg-black/50 px-2 py-1 rounded-full">
                <Eye className="w-4 h-4" />
                <span className="font-medium">2.1k</span>
              </div>
            </div>
          </div>

          {/* Badge para vídeo real */}
          <div className="absolute top-4 right-4">
            <div className="bg-white/95 text-primary text-xs font-bold px-3 py-1.5 rounded-full flex items-center space-x-1 shadow-lg">
              <Instagram className="w-3 h-3" />
              <span>Instagram</span>
            </div>
          </div>

          {/* Decorative Elements */}
          <div className="absolute top-4 left-4">
            <div className="w-3 h-3 bg-white/60 rounded-full shadow-sm"></div>
          </div>
          <div className="absolute bottom-8 left-6">
            <div className="w-2 h-2 bg-white/50 rounded-full shadow-sm"></div>
          </div>
          <div className="absolute top-6 right-6">
            <div className="w-1.5 h-1.5 bg-white/70 rounded-full shadow-sm"></div>
          </div>
        </div>
      );
    }

    if (video.thumbnailType === 'emergency') {
      return (
        <div className="aspect-video rounded-t-lg relative overflow-hidden">
          {/* Background Image - foto-tratada.jpeg */}
          <div 
            className="absolute inset-0 bg-cover bg-top"
            style={{ backgroundImage: `url(${emergencyImage})` }}
          >
            {/* Overlay para melhorar legibilidade */}
            <div className="absolute inset-0 bg-black/50"></div>
          </div>
          
          {/* Main Content */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center space-y-4 p-6">
              {/* Icon Container */}
              <div className="relative">
                <div className="w-20 h-20 bg-white/95 rounded-full flex items-center justify-center mx-auto shadow-lg">
                  <Home className="w-10 h-10 text-red-500" />
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-br from-red-400 to-orange-500 rounded-full flex items-center justify-center">
                  <Shield className="w-4 h-4 text-white" />
                </div>
              </div>
              
              {/* Text Content */}
              <div className="space-y-2">
                <h4 className="text-white font-bold text-lg leading-tight drop-shadow-lg">
                  Emergência Respiratória
                </h4>
                <p className="text-white/95 text-sm font-medium drop-shadow-md">
                  Atendimento domiciliar
                </p>
              </div>
            </div>
          </div>

          {/* Overlay on Hover */}
          <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
            <div className="w-16 h-16 bg-white/95 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
              <Instagram className="w-8 h-8 text-primary" />
            </div>
          </div>
          
          {/* Video Info Overlay */}
          <div className="absolute bottom-4 left-4 right-4">
            <div className="flex items-center justify-between text-white text-sm">
              <div className="flex items-center space-x-2 bg-black/50 px-2 py-1 rounded-full">
                <Clock className="w-4 h-4" />
                <span className="font-medium">3:45</span>
              </div>
              <div className="flex items-center space-x-2 bg-black/50 px-2 py-1 rounded-full">
                <Eye className="w-4 h-4" />
                <span className="font-medium">1.5k</span>
              </div>
            </div>
          </div>

          {/* Badge para vídeo real */}
          <div className="absolute top-4 right-4">
            <div className="bg-white/95 text-primary text-xs font-bold px-3 py-1.5 rounded-full flex items-center space-x-1 shadow-lg">
              <Instagram className="w-3 h-3" />
              <span>Instagram</span>
            </div>
          </div>

          {/* Decorative Elements */}
          <div className="absolute top-4 left-4">
            <div className="w-3 h-3 bg-white/60 rounded-full shadow-sm"></div>
          </div>
          <div className="absolute bottom-8 left-6">
            <div className="w-2 h-2 bg-white/50 rounded-full shadow-sm"></div>
          </div>
          <div className="absolute top-6 right-6">
            <div className="w-1.5 h-1.5 bg-white/70 rounded-full shadow-sm"></div>
          </div>
        </div>
      );
    }

    // Thumbnail padrão (primeiro vídeo)
    return (
      <div className="aspect-video rounded-t-lg relative overflow-hidden">
        {/* Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${videoThumbnail})` }}
        >
          {/* Overlay para melhorar legibilidade */}
          <div className="absolute inset-0 bg-black/30"></div>
        </div>
        
        {/* Main Content */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center space-y-4 p-6">
            {/* Icon Container */}
            <div className="relative">
              <div className="w-20 h-20 bg-white/95 rounded-full flex items-center justify-center mx-auto shadow-lg">
                <Shield className="w-10 h-10 text-primary" />
              </div>
              <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-br from-green-400 to-blue-500 rounded-full flex items-center justify-center">
                <Heart className="w-4 h-4 text-white" />
              </div>
            </div>
            
            {/* Text Content */}
            <div className="space-y-2">
              <h4 className="text-white font-bold text-lg leading-tight drop-shadow-lg">
                Confiança na Saúde
              </h4>
              <p className="text-white/95 text-sm font-medium drop-shadow-md">
                Escolha o profissional certo
              </p>
            </div>
          </div>
        </div>

        {/* Overlay on Hover */}
        <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
          <div className="w-16 h-16 bg-white/95 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
            <Instagram className="w-8 h-8 text-primary" />
          </div>
        </div>
        
        {/* Video Info Overlay */}
        <div className="absolute bottom-4 left-4 right-4">
          <div className="flex items-center justify-between text-white text-sm">
            <div className="flex items-center space-x-2 bg-black/50 px-2 py-1 rounded-full">
              <Clock className="w-4 h-4" />
              <span className="font-medium">2:30</span>
            </div>
            <div className="flex items-center space-x-2 bg-black/50 px-2 py-1 rounded-full">
              <Eye className="w-4 h-4" />
              <span className="font-medium">1.2k</span>
            </div>
          </div>
        </div>

        {/* Badge para vídeo real */}
        <div className="absolute top-4 right-4">
          <div className="bg-white/95 text-primary text-xs font-bold px-3 py-1.5 rounded-full flex items-center space-x-1 shadow-lg">
            <Instagram className="w-3 h-3" />
            <span>Instagram</span>
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute top-4 left-4">
          <div className="w-3 h-3 bg-white/60 rounded-full shadow-sm"></div>
        </div>
        <div className="absolute bottom-8 left-6">
          <div className="w-2 h-2 bg-white/50 rounded-full shadow-sm"></div>
        </div>
        <div className="absolute top-6 right-6">
          <div className="w-1.5 h-1.5 bg-white/70 rounded-full shadow-sm"></div>
        </div>
      </div>
    );
  };

  return (
    <section id="videos" className="section-padding bg-muted/30">
      <div className="container mx-auto">
        <div className="text-center space-y-4 mb-16">
          <div className="flex items-center justify-center space-x-2 text-primary">
            <Play className="w-5 h-5" />
            <span className="text-sm font-medium uppercase tracking-wide">
              Dicas em Vídeo
            </span>
          </div>
          
          <h2 className="heading-secondary">
            Orientações semanais da{' '}
            <span className="text-primary">Tia Jow</span>
          </h2>
          
          <p className="text-body max-w-2xl mx-auto">
            Toda semana, a Joanna compartilha dicas valiosas sobre cuidados respiratórios, 
            orientações para pais e informações importantes sobre fisioterapia infantil.
          </p>
        </div>

        {/* Grid de Vídeos */}
        <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-8 mb-12">
          {videos.map((video) => (
            <Card key={video.id} className="group hover:shadow-lg transition-all duration-300 cursor-pointer" onClick={() => handleVideoClick(video)}>
              <CardContent className="p-0">
                {/* Thumbnail */}
                {video.customThumbnail ? (
                  renderCustomThumbnail(video)
                ) : (
                <div className={`aspect-video ${video.thumbnail} rounded-t-lg relative overflow-hidden`}>
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors flex items-center justify-center">
                    <div className="w-16 h-16 bg-white/90 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                        {video.isRealVideo ? (
                          <Instagram className="w-8 h-8 text-primary" />
                        ) : (
                      <Play className="w-8 h-8 text-primary ml-1" />
                        )}
                      </div>
                  </div>
                  
                  {/* Video Info Overlay */}
                  <div className="absolute bottom-4 left-4 right-4">
                    <div className="flex items-center justify-between text-white text-sm">
                      <div className="flex items-center space-x-2">
                        <Clock className="w-4 h-4" />
                        <span>{video.duration}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Eye className="w-4 h-4" />
                        <span>{video.views}</span>
                      </div>
                    </div>
                  </div>

                    {/* Badge para vídeo real */}
                    {video.isRealVideo && (
                      <div className="absolute top-4 right-4">
                        <div className="bg-white/90 text-primary text-xs font-medium px-2 py-1 rounded-full flex items-center space-x-1">
                          <Instagram className="w-3 h-3" />
                          <span>Instagram</span>
                        </div>
                      </div>
                    )}
                </div>
                )}

                {/* Content */}
                <div className="p-6 space-y-3">
                  <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-2">
                    {video.title}
                  </h3>
                  <p className="text-sm text-muted-foreground line-clamp-3">
                    {video.description}
                  </p>
                  
                  <div className="flex items-center justify-between pt-2">
                    <span className="text-xs text-muted-foreground">
                      Publicado por Tia Jow
                    </span>
                    <Button 
                      size="sm" 
                      variant="ghost" 
                      className="text-primary hover:text-primary hover:bg-primary/10"
                    >
                      {video.isRealVideo ? 'Ver no Instagram' : 'Assistir'}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* CTA Section */}
        <div className="text-center space-y-6">
          <div className="bg-white rounded-2xl p-8 shadow-sm">
            <h3 className="text-xl font-semibold text-foreground mb-4">
              Quer receber as dicas da Tia Jow toda semana?
            </h3>
            <p className="text-muted-foreground mb-6">
              Siga o Instagram @respirarporjoannabomfim e não perca nenhuma orientação importante 
              sobre cuidados respiratórios para seu pequeno.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                className="gradient-primary text-white hover:opacity-90"
                onClick={() => handleContactAction('instagram')}
              >
                <Instagram className="w-5 h-5 mr-2" />
                Seguir no Instagram
              </Button>
              <Button 
                variant="outline"
                className="border-primary text-primary hover:bg-primary hover:text-white"
                onClick={() => handleContactAction('whatsapp', 'videos')}
              >
                Receber por WhatsApp
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Videos;

