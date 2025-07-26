import { Button } from '@/components/ui/button.jsx';
import { Alert, AlertDescription } from '@/components/ui/alert.jsx';
import { AlertCircle } from 'lucide-react';

const DashboardHeader = ({ 
  title, 
  subtitle, 
  onLogout, 
  apiStatus = 'available',
  showLogout = false // Mudado para false por padrão para evitar duplicação
}) => {
  return (
    <div className="mb-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            {title}
          </h1>
          {subtitle && (
            <p className="text-gray-600">
              {subtitle}
            </p>
          )}
        </div>
        {showLogout && onLogout && (
          <Button onClick={onLogout} variant="outline">
            Sair
          </Button>
        )}
      </div>

      {/* Status da API */}
      {apiStatus === 'unavailable' && (
        <Alert className="mb-6 border-red-200 bg-red-50">
          <AlertCircle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-800">
            Erro de conexão com o servidor. Verifique sua internet.
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
};

export default DashboardHeader; 