import { Loader2 } from 'lucide-react';

const LoadingSpinner = ({ 
  size = "default", 
  text = "Carregando...", 
  className = "" 
}) => {
  const sizeClasses = {
    sm: "h-4 w-4",
    default: "h-8 w-8", 
    lg: "h-12 w-12"
  };

  const textSizes = {
    sm: "text-sm",
    default: "text-base",
    lg: "text-lg"
  };

  return (
    <div className={`flex flex-col items-center justify-center ${className}`}>
      <Loader2 className={`${sizeClasses[size]} animate-spin text-primary mb-2`} />
      {text && (
        <p className={`${textSizes[size]} text-muted-foreground`}>
          {text}
        </p>
      )}
    </div>
  );
};

export default LoadingSpinner; 