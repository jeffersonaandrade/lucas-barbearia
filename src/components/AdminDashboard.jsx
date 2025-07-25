import { useState, useEffect } from 'react';
import { useAuthBackend } from '@/hooks/useAuthBackend.js';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Users, 
  Scissors, 
  Building2, 
  ClipboardList, 
  BarChart3, 
  Settings,
  LogOut,
  Plus,
  UserPlus,
  Store,
  FileText,
  Calendar,
  Clock,
  CheckCircle,
  AlertCircle,
  UserCheck,
  UserX,
  TrendingUp,
  Activity
} from 'lucide-react';
import AdminLayout from '@/components/ui/admin-layout.jsx';
import AdminDashboardBarbeiro from '@/components/admin/AdminDashboardBarbeiro.jsx';
import AdminDashboardAdmin from '@/components/admin/AdminDashboardAdmin.jsx';
import AdminDashboardGerente from '@/components/admin/AdminDashboardGerente.jsx';
import { filaService, barbeariasService } from '@/services/api.js';

const AdminDashboard = () => {
  const { user, logout } = useAuthBackend();
  
  // Estados gerais
  const [stats, setStats] = useState({
    totalClientes: 0,
    clientesAtendendo: 0,
    clientesAguardando: 0,
    totalBarbearias: 3
  });
  
  // Estados específicos do barbeiro
  const [barbearias, setBarbearias] = useState([]);
  const [barbeariaAtual, setBarbeariaAtual] = useState(null);
  const [barbeiroAtual, setBarbeiroAtual] = useState(null);
  const [atendendoAtual, setAtendendoAtual] = useState(null);
  const [loading, setLoading] = useState(true);

  // Definir barbeiroAtual baseado no user
  useEffect(() => {
    if (user && user.role === 'barbeiro') {
      setBarbeiroAtual({
        id: user.id,
        nome: user.nome,
        email: user.email,
        role: user.role
      });
      console.log('👤 Barbeiro definido:', user);
    }
  }, [user]);

  // Carregar dados iniciais do backend
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        
        // Carregar barbearias do backend
        const barbeariasData = await barbeariasService.listarBarbearias();
        const barbeariasArray = (barbeariasData && barbeariasData.data && Array.isArray(barbeariasData.data)) 
          ? barbeariasData.data 
          : [];
        setBarbearias(barbeariasArray);
        
        // Se não há barbearias, mostrar mensagem
        if (!barbeariasArray || barbeariasArray.length === 0) {
          console.log('Nenhuma barbearia encontrada no backend');
          setBarbearias([]);
        }
        
      } catch (error) {
        console.error('Erro ao carregar dados:', error);
        setBarbearias([]);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [user]);

  const handleLogout = () => {
    logout();
  };

  if (loading) {
    return (
      <AdminLayout onLogout={handleLogout} showBackButton={false}>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-4"></div>
            <p>Carregando...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  // Renderizar dashboard baseado no role
  const renderDashboard = () => {
    switch (user?.role) {
      case 'barbeiro':
        return (
          <AdminDashboardBarbeiro
            barbearias={barbearias}
            barbeariaAtual={barbeariaAtual}
            setBarbeariaAtual={setBarbeariaAtual}
            barbeiroAtual={barbeiroAtual}
            atendendoAtual={atendendoAtual}
            setAtendendoAtual={setAtendendoAtual}
            onLogout={handleLogout}
          />
        );
      
      case 'admin':
        return (
          <AdminDashboardAdmin
            stats={stats}
            onLogout={handleLogout}
          />
        );
      
      case 'gerente':
        return (
          <AdminDashboardGerente
            stats={stats}
            onLogout={handleLogout}
          />
        );
      
      default:
        return (
          <div className="text-center py-8">
            <p className="text-gray-500">Role não reconhecido: {user?.role}</p>
          </div>
        );
    }
  };

  return (
    <AdminLayout onLogout={handleLogout} showBackButton={false}>
      {renderDashboard()}
    </AdminLayout>
  );
};

export default AdminDashboard; 