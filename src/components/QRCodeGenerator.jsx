import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.jsx';
import { Button } from '@/components/ui/button.jsx';
import { Badge } from '@/components/ui/badge.jsx';
import { Alert, AlertDescription } from '@/components/ui/alert.jsx';
import { barbeariasService } from '@/services/api.js';
import { 
  QrCode, 
  Download, 
  Copy, 
  CheckCircle, 
  AlertCircle,
  MapPin,
  Phone,
  Instagram,
  Clock,
  Users,
  Scissors,
  ArrowLeft
} from 'lucide-react';

const QRCodeGenerator = () => {
  const navigate = useNavigate();
  const { barbeariaId } = useParams();
  const [barbeariaInfo, setBarbeariaInfo] = useState(null);
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const carregarBarbearia = async () => {
      try {
        const response = await barbeariasService.obterBarbearia(barbeariaId);
        const info = response.data || response;
        if (info) {
          setBarbeariaInfo(info);
          // Gerar URL para o QR Code
          const baseUrl = window.location.origin;
          const qrUrl = `${baseUrl}/barbearia/${barbeariaId}/entrar-fila?qr=true&barbearia=${barbeariaId}`;
          setQrCodeUrl(qrUrl);
        }
      } catch (error) {
        console.error('Erro ao carregar informações da barbearia:', error);
      } finally {
        setLoading(false);
      }
    };

    carregarBarbearia();
  }, [barbeariaId]);

  const gerarQRCode = () => {
    // Usar uma API externa para gerar QR Code
    const qrApiUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(qrCodeUrl)}`;
    return qrApiUrl;
  };

  const copiarURL = () => {
    navigator.clipboard.writeText(qrCodeUrl);
    alert('URL copiada para a área de transferência!');
  };

  const baixarQRCode = () => {
    const link = document.createElement('a');
    link.href = gerarQRCode();
    link.download = `qr-code-barbearia-${barbeariaId}.png`;
    link.click();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando informações da barbearia...</p>
        </div>
      </div>
    );
  }

  if (!barbeariaInfo) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600">Barbearia não encontrada</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Botão Voltar */}
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={() => navigate(`/barbearia/${barbeariaId}/visualizar-fila`)}
            className="text-primary hover:text-accent"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar para Visualizar Fila
          </Button>
        </div>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Informações da Unidade - {barbeariaInfo.nome}
          </h1>
          <p className="text-gray-600">
            Detalhes completos desta unidade da barbearia
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8">
          {/* Informações da Barbearia */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Scissors className="w-5 h-5" />
                <span>Informações da Unidade</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold text-lg text-gray-900 mb-2">
                  {barbeariaInfo.nome}
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <MapPin className="w-4 h-4 text-gray-500" />
                    <span className="text-gray-700">{barbeariaInfo.endereco}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Phone className="w-4 h-4 text-gray-500" />
                    <span className="text-gray-700">{barbeariaInfo.telefone}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Clock className="w-4 h-4 text-gray-500" />
                    <span className="text-gray-700">
                      Segunda a Sexta: {barbeariaInfo.horario?.segunda?.aberto ? 
                        `${barbeariaInfo.horario.segunda.inicio} - ${barbeariaInfo.horario.segunda.fim}` : 
                        'Fechado'
                      }
                    </span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Users className="w-4 h-4 text-gray-500" />
                    <span className="text-gray-700">
                      {barbeariaInfo.barbeiros && barbeariaInfo.barbeiros.length > 0 ? 
                        `${barbeariaInfo.barbeiros.length} barbeiros disponíveis` : 
                        'Nenhum barbeiro disponível'
                      }
                    </span>
                  </div>
                </div>
              </div>

              {/* Barbeiros */}
              {barbeariaInfo.barbeiros && barbeariaInfo.barbeiros.length > 0 && (
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Barbeiros:</h4>
                  <div className="space-y-2">
                    {barbeariaInfo.barbeiros.map((barbeiro) => (
                      <div key={barbeiro.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                        <span className="font-medium">{barbeiro.nome}</span>
                        <Badge variant={barbeiro.disponivel ? "default" : "secondary"}>
                          {barbeiro.disponivel ? "Disponível" : "Indisponível"}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Serviços */}
              {barbeariaInfo.servicos && barbeariaInfo.servicos.length > 0 && (
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                    <Scissors className="w-4 h-4 mr-2 text-primary" />
                    Serviços:
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {barbeariaInfo.servicos.map((servico, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg border border-gray-200 hover:shadow-md transition-all duration-200">
                        <div className="flex-1">
                          <span className="font-semibold text-gray-900 text-sm block">{servico.nome}</span>
                          <div className="flex items-center mt-1">
                            <Clock className="w-3 h-3 text-gray-500 mr-1" />
                            <p className="text-xs text-gray-600">{servico.duracao} min</p>
                          </div>
                        </div>
                        <div className="text-right ml-3">
                          <span className="font-bold text-primary text-base">R$ {servico.preco.toFixed(2).replace('.', ',')}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>


        </div>

        {/* Informações Técnicas */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <QrCode className="w-5 h-5" />
              <span>Informações Técnicas</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg border border-blue-200">
                <h4 className="font-semibold text-blue-900 mb-2">ID da Barbearia</h4>
                <p className="text-3xl font-bold text-blue-600">{barbeariaId}</p>
              </div>
              <div className="text-center p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-lg border border-green-200">
                <h4 className="font-semibold text-green-900 mb-2">Status</h4>
                <Badge variant={barbeariaInfo.ativo ? "default" : "secondary"} className="text-sm px-3 py-1">
                  {barbeariaInfo.ativo ? "Ativa" : "Inativa"}
                </Badge>
              </div>
              <div className="text-center p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg border border-purple-200">
                <h4 className="font-semibold text-purple-900 mb-2">Tempo Médio</h4>
                <p className="text-3xl font-bold text-purple-600">
                  {barbeariaInfo.configuracoes?.tempo_medio_atendimento || 
                   barbeariaInfo.configuracoes?.tempoMedioPorCliente || 
                   30}min
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default QRCodeGenerator; 