import { lazy } from 'react';
import { SuspenseWrapper } from '@/components/ui/suspense-wrapper.jsx';
import ProtectedRoute from '@/components/ProtectedRoute.jsx';

// Lazy loading para componentes menos críticos
const About = lazy(() => import('@/components/About.jsx'));
const Services = lazy(() => import('@/components/Services.jsx'));
const Testimonials = lazy(() => import('@/components/Testimonials.jsx'));
const Contact = lazy(() => import('@/components/Contact.jsx'));
const Footer = lazy(() => import('@/components/Footer.jsx'));

// Páginas do sistema de filas
const EntrarFila = lazy(() => import('@/pages/EntrarFila.jsx'));
const StatusFila = lazy(() => import('@/pages/StatusFila.jsx'));
const VisualizarFila = lazy(() => import('@/pages/VisualizarFila.jsx'));

// Componentes administrativos
const Login = lazy(() => import('@/components/Login.jsx'));
const RecuperarSenha = lazy(() => import('@/components/RecuperarSenha.jsx'));
const AdminDashboard = lazy(() => import('@/components/AdminDashboard.jsx'));
const AdminUsuarios = lazy(() => import('@/components/AdminUsuarios.jsx'));
const AdminBarbearias = lazy(() => import('@/components/AdminBarbearias.jsx'));
const AdminFuncionarios = lazy(() => import('@/components/AdminFuncionarios.jsx'));
const AdminAdicionarFila = lazy(() => import('@/components/AdminAdicionarFila.jsx'));
const AdminFilas = lazy(() => import('@/components/AdminFilas.jsx'));
const AdminRelatorios = lazy(() => import('@/components/AdminRelatorios.jsx'));
const AdminConfiguracoes = lazy(() => import('@/components/admin/AdminConfiguracoesWrapper.jsx'));
const WhatsAppAdminPanel = lazy(() => import('@/components/admin/WhatsAppAdminPanel.jsx'));

// Outros componentes
const QRCodeGenerator = lazy(() => import('@/components/QRCodeGenerator.jsx'));
const BarbeariasList = lazy(() => import('@/components/BarbeariasList.jsx'));
const AppointmentScheduler = lazy(() => import('@/components/AppointmentScheduler.jsx'));
const NotFound = lazy(() => import('@/components/NotFound.jsx'));
const PrivacyPolicy = lazy(() => import('@/components/PrivacyPolicy.jsx'));
const TermsOfService = lazy(() => import('@/components/TermsOfService.jsx'));
const Avaliacao = lazy(() => import('@/components/Avaliacao.jsx'));
const AvaliacoesList = lazy(() => import('@/components/AvaliacoesList.jsx'));
const Unauthorized = lazy(() => import('@/components/Unauthorized.jsx'));
const TestUserCreation = lazy(() => import('@/components/TestUserCreation.jsx'));


// Configuração das rotas públicas
export const publicRoutes = [
  {
    path: '/',
    element: (
      <>
        <main>
          <About />
          <Services />
          <Testimonials />
          <Contact />
        </main>
        <Footer />
      </>
    ),
    withHeader: true,
    withWhatsApp: true
  },
  {
    path: '/entrar-fila',
    element: <EntrarFila />
  },
  {
    path: '/barbearia/:id/entrar-fila',
    element: <EntrarFila />
  },
  {
    path: '/dev/barbearia/:id/entrar-fila',
    element: <EntrarFila />
  },
  {
    path: '/barbearia/:id/status-fila',
    element: <StatusFila />
  },
  {
    path: '/barbearia/:id/visualizar-fila',
    element: <VisualizarFila />
  },
  {
    path: '/qr-code/:barbeariaId',
    element: <QRCodeGenerator />
  },
  {
    path: '/barbearias',
    element: <BarbeariasList />
  },
  {
    path: '/barbearia/:id/agendar',
    element: <AppointmentScheduler />
  },
  {
    path: '/privacidade',
    element: <PrivacyPolicy />
  },
  {
    path: '/termos',
    element: <TermsOfService />
  },

  {
    path: '/avaliacao/:clienteId',
    element: <Avaliacao />
  },
  {
    path: '/avaliacoes',
    element: <AvaliacoesList />
  },
  {
    path: '/test-user-creation',
    element: <TestUserCreation />
  },

];

// Configuração das rotas administrativas
export const adminRoutes = [
  {
    path: '/admin/login',
    element: <Login />
  },
  {
    path: '/admin/recuperar-senha',
    element: <RecuperarSenha />
  },
  {
    path: '/admin/usuarios',
    element: <AdminUsuarios />,
    allowedRoles: ['admin']
  },
  {
    path: '/admin/barbearias',
    element: <AdminBarbearias />,
    allowedRoles: ['admin']
  },
  {
    path: '/admin/funcionarios',
    element: <AdminFuncionarios />,
    allowedRoles: ['admin']
  },
  {
    path: '/admin/adicionar-fila',
    element: <AdminAdicionarFila />,
    allowedRoles: ['admin', 'gerente', 'barbeiro']
  },
  {
    path: '/admin/filas',
    element: <AdminFilas />,
    allowedRoles: ['admin', 'gerente', 'barbeiro']
  },
  {
    path: '/admin/relatorios',
    element: <AdminRelatorios />,
    allowedRoles: ['admin']
  },
  {
    path: '/admin/configuracoes',
    element: <AdminConfiguracoes />,
    allowedRoles: ['admin']
  },
  {
    path: '/admin/whatsapp',
    element: <WhatsAppAdminPanel />,
    allowedRoles: ['admin']
  },
  {
    path: '/admin/avaliacoes',
    element: <AvaliacoesList />,
    allowedRoles: ['admin']
  },
  {
    path: '/admin/dashboard',
    element: <AdminDashboard />,
    allowedRoles: ['admin', 'gerente', 'barbeiro']
  },
  {
    path: '/admin/unauthorized',
    element: <Unauthorized />,
    allowedRoles: ['admin', 'gerente', 'barbeiro']
  },
  {
    path: '/admin',
    element: <AdminDashboard />,
    allowedRoles: ['admin', 'gerente', 'barbeiro']
  }
];

// Rota catch-all
export const catchAllRoute = {
  path: '*',
  element: <NotFound />
};

// Função para renderizar rota com proteção
export const renderRoute = (route) => {
  const element = <SuspenseWrapper>{route.element}</SuspenseWrapper>;
  
  if (route.allowedRoles) {
    return (
      <ProtectedRoute allowedRoles={route.allowedRoles}>
        {element}
      </ProtectedRoute>
    );
  }
  
  return element;
}; 