import { Button } from '@/components/ui/button.jsx';
import { Shield } from 'lucide-react';

const AdminHeader = ({ onLogout }) => {
  return (
    <header className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <h1 className="text-xl font-semibold text-gray-900">
              Painel Administrativo
            </h1>
          </div>
          
          <div className="flex items-center">
            <Button
              onClick={onLogout}
              variant="outline"
              size="sm"
              className="flex items-center space-x-2"
            >
              <Shield className="w-4 h-4" />
              <span>Sair</span>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader; 