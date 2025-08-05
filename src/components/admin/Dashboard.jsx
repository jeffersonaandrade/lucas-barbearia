import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext.jsx';
import { Card } from '../ui/card.jsx';
import { Button } from '../ui/button.jsx';
import { Badge } from '../ui/badge.jsx';
import OverviewPanel from './OverviewPanel.jsx';
import WhatsAppAdminPanel from './WhatsAppAdminPanel.jsx';
import { 
  BarChart3, 
  MessageSquare, 
  Users, 
  Settings, 
  FileText,
  DollarSign,
  Scissors,
  LogOut,
  Menu,
  X
} from 'lucide-react';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const menuItems = [
    { 
      id: 'overview', 
      label: '📊 Visão Geral', 
      icon: BarChart3,
      description: 'Dashboard principal com estatísticas'
    },
    { 
      id: 'whatsapp', 
      label: '📱 WhatsApp', 
      icon: MessageSquare,
      description: 'Administração do WhatsApp'
    },
    { 
      id: 'users', 
      label: '👥 Usuários', 
      icon: Users,
      description: 'Gerenciamento de usuários'
    },
    { 
      id: 'barbearias', 
      label: '✂️ Barbearias', 
      icon: Scissors,
      description: 'Gerenciamento de barbearias'
    },
    { 
      id: 'reports', 
      label: '📈 Relatórios', 
      icon: FileText,
      description: 'Relatórios e análises'
    },
    { 
      id: 'finance', 
      label: '💰 Financeiro', 
      icon: DollarSign,
      description: 'Controle financeiro'
    },
    { 
      id: 'config', 
      label: '⚙️ Configurações', 
      icon: Settings,
      description: 'Configurações do sistema'
    }
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'whatsapp':
        return <WhatsAppAdminPanel />;
      case 'users':
        return <div className="p-6"><h2>👥 Gerenciamento de Usuários</h2><p>Em desenvolvimento...</p></div>;
      case 'barbearias':
        return <div className="p-6"><h2>✂️ Gerenciamento de Barbearias</h2><p>Em desenvolvimento...</p></div>;
      case 'reports':
        return <div className="p-6"><h2>📈 Relatórios</h2><p>Em desenvolvimento...</p></div>;
      case 'finance':
        return <div className="p-6"><h2>💰 Financeiro</h2><p>Em desenvolvimento...</p></div>;
      case 'config':
        return <div className="p-6"><h2>⚙️ Configurações</h2><p>Em desenvolvimento...</p></div>;
      default:
        return <OverviewPanel />;
    }
  };

  const handleLogout = async () => {
    if (confirm('Tem certeza que deseja sair?')) {
      await logout();
      // Redirecionamento será tratado pelo AuthContext
    }
  };

  const getCurrentMenuItem = () => {
    return menuItems.find(item => item.id === activeTab) || menuItems[0];
  };

  return (
    <div className="dashboard-container min-h-screen bg-gray-50">
      {/* Sidebar Mobile Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">LB</span>
              </div>
              <div>
                <h1 className="font-bold text-gray-900">Lucas Barbearia</h1>
                <p className="text-xs text-gray-500">Admin Panel</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>

          {/* User Info */}
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-blue-600 font-semibold">
                  {user?.nome?.charAt(0) || 'A'}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {user?.nome || 'Administrador'}
                </p>
                <p className="text-xs text-gray-500 capitalize">
                  {user?.role || 'admin'}
                </p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
            {menuItems.map(item => (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setSidebarOpen(false);
                }}
                className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors duration-200 ${
                  activeTab === item.id
                    ? 'bg-blue-50 text-blue-700 border border-blue-200'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <item.icon className="w-5 h-5" />
                <div className="flex-1">
                  <p className="font-medium">{item.label}</p>
                  <p className="text-xs text-gray-500 truncate">
                    {item.description}
                  </p>
                </div>
              </button>
            ))}
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-gray-200">
            <Button
              onClick={handleLogout}
              variant="outline"
              className="w-full flex items-center space-x-2"
            >
              <LogOut className="w-4 h-4" />
              <span>Sair</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="lg:ml-64">
        {/* Top Bar */}
        <div className="bg-white shadow-sm border-b border-gray-200">
          <div className="flex items-center justify-between px-4 py-3">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden"
              >
                <Menu className="w-5 h-5" />
              </Button>
              
              <div>
                <h2 className="text-xl font-semibold text-gray-900">
                  {getCurrentMenuItem().label}
                </h2>
                <p className="text-sm text-gray-500">
                  {getCurrentMenuItem().description}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <Badge variant="outline">
                {user?.role || 'admin'}
              </Badge>
              
              <div className="hidden md:flex items-center space-x-2 text-sm text-gray-500">
                <span>Último acesso:</span>
                <span>{new Date().toLocaleDateString('pt-BR')}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="bg-gray-50 min-h-screen">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 