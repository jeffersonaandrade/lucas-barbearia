import { Users, CheckCircle, AlertTriangle, Clock, UserCheck } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card.jsx';

const FilaStats = ({
  estatisticas = {},
  title = "Estatísticas Gerais",
  showTotal = true,
  showAtendendo = true,
  showProximo = true,
  showTempoMedio = true,
  showAguardando = true,
  showBarbeirosDisponiveis = false,
  className = "",
  variant = "default" // "default", "compact", "detailed"
}) => {
  
  // Função para formatar tempo médio
  const formatTempoMedio = (tempo) => {
    if (!tempo || tempo === 0) return 'N/A';
    return `${tempo} min`;
  };

  // Função para obter cor do ícone baseado no valor
  const getIconColor = (valor, tipo) => {
    if (valor === 0) return 'text-gray-400';
    switch (tipo) {
      case 'disponiveis': return 'text-green-500';
      case 'proximo': return 'text-yellow-500';
      case 'aguardando': return 'text-blue-500';
      case 'atendendo': return 'text-green-500';
      case 'finalizado': return 'text-gray-500';
      case 'removido': return 'text-red-500';
      default: return 'text-primary';
    }
  };

  const stats = [
    showTotal && {
      icon: Users,
      value: estatisticas.total || 0,
      label: 'Total',
      color: getIconColor(estatisticas.total, 'total')
    },
    showAguardando && {
      icon: Users,
      value: estatisticas.aguardando || 0,
      label: 'Aguardando',
      color: getIconColor(estatisticas.aguardando, 'aguardando')
    },
    showAtendendo && {
      icon: CheckCircle,
      value: estatisticas.atendendo || 0,
      label: 'Atendendo',
      color: getIconColor(estatisticas.atendendo, 'atendendo')
    },
    showProximo && {
      icon: AlertTriangle,
      value: estatisticas.proximo || 0,
      label: 'Próximo',
      color: getIconColor(estatisticas.proximo, 'proximo')
    },
    showBarbeirosDisponiveis && {
      icon: UserCheck,
      value: estatisticas.barbeirosDisponiveis || 0,
      label: 'Barbeiros Disponíveis',
      color: getIconColor(estatisticas.barbeirosDisponiveis, 'disponiveis')
    },
    showTempoMedio && {
      icon: Clock,
      value: formatTempoMedio(estatisticas.tempoMedioEspera || estatisticas.ultimas24h?.tempoMedioEspera || 0),
      label: 'Min. médio',
      color: 'text-primary'
    }
  ].filter(Boolean);

  if (stats.length === 0) {
    return null;
  }

  return (
    <Card className={`bg-card border border-border shadow-lg ${className}`}>
      <CardContent className="p-6">
        {title && (
          <h3 className="text-lg font-semibold text-foreground mb-4">{title}</h3>
        )}
        
        <div className={`grid gap-4 ${
          variant === 'compact' ? 'grid-cols-2 md:grid-cols-4' :
          variant === 'detailed' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' :
          'grid-cols-2 md:grid-cols-4 lg:grid-cols-5'
        }`}>
          {stats.map((stat, index) => (
            <div key={index} className="text-center p-4 bg-secondary rounded-lg">
              <stat.icon className={`w-6 h-6 mx-auto mb-2 ${stat.color}`} />
              <div className="text-lg font-bold text-foreground mb-1">
                {stat.value}
              </div>
              <div className="text-xs text-muted-foreground">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export { FilaStats }; 