import { Users, BarChart3 } from 'lucide-react';

const TabNavigation = ({ activeTab, onTabChange }) => {
  return (
    <div className="mb-6">
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => onTabChange('fila')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'fila'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              Gestão de Fila
            </div>
          </button>
          <button
            onClick={() => onTabChange('avaliacoes')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'avaliacoes'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <div className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              Avaliações
            </div>
          </button>
        </nav>
      </div>
    </div>
  );
};

export default TabNavigation; 