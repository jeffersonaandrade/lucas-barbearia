import { Button } from '@/components/ui/button.jsx';
import { ArrowLeft } from 'lucide-react';
import { useNavigation } from '@/hooks/useNavigation';

const BackButton = ({ onClick, className = "mb-6", variant = "default" }) => {
  const { goToAdminDashboard } = useNavigation();

  const handleClick = () => {
    if (variant === "admin-dashboard") {
      goToAdminDashboard();
    } else if (onClick) {
      onClick();
    }
  };

  const getText = () => {
    switch (variant) {
      case "admin-dashboard":
        return "Voltar ao Dashboard";
      default:
        return "Voltar";
    }
  };

  return (
    <div className={className}>
      <Button
        onClick={handleClick}
        variant="ghost"
        size="sm"
        className="flex items-center space-x-2"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>{getText()}</span>
      </Button>
    </div>
  );
};

export default BackButton; 