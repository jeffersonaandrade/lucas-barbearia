import { Button } from '@/components/ui/button.jsx';
import { ArrowLeft } from 'lucide-react';

const BackButton = ({ onClick, className = "mb-6" }) => {
  return (
    <div className={className}>
      <Button
        onClick={onClick}
        variant="ghost"
        size="sm"
        className="flex items-center space-x-2"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Voltar</span>
      </Button>
    </div>
  );
};

export default BackButton; 