import { useNavigate } from 'react-router-dom';
import { ROUTES, generateUrl } from '@/routes/routeConfig.js';

export const useNavigation = () => {
  const navigate = useNavigate();

  // Navegação para rotas públicas
  const goToHome = () => navigate(ROUTES.HOME);
  const goToEntrarFila = () => navigate(ROUTES.ENTRAR_FILA);
  const goToBarbeariaEntrarFila = (id) => navigate(generateUrl(ROUTES.BARBEARIA_ENTRAR_FILA, { id }));
  const goToDevEntrarFila = (id) => navigate(generateUrl(ROUTES.DEV_ENTRAR_FILA, { id }));
  const goToBarbeariaStatusFila = (id) => navigate(generateUrl(ROUTES.BARBEARIA_STATUS_FILA, { id }));
  const goToBarbeariaVisualizarFila = (id) => navigate(generateUrl(ROUTES.BARBEARIA_VISUALIZAR_FILA, { id }));
  const goToQRCode = (barbeariaId) => navigate(generateUrl(ROUTES.QR_CODE, { barbeariaId }));
  const goToBarbearias = () => navigate(ROUTES.BARBEARIAS);
  const goToBarbeariaAgendar = (id) => navigate(generateUrl(ROUTES.BARBEARIA_AGENDAR, { id }));
  const goToPrivacidade = () => navigate(ROUTES.PRIVACIDADE);
  const goToTermos = () => navigate(ROUTES.TERMOS);
  const goToBarbeariaAvaliacao = (id) => navigate(generateUrl(ROUTES.BARBEARIA_AVALIACAO, { id }));
  const goToAvaliacoes = () => navigate(ROUTES.AVALIACOES);
  const goToTestUserCreation = () => navigate(ROUTES.TEST_USER_CREATION);
  const goToApiTest = () => navigate(ROUTES.API_TEST);

  // Navegação para rotas administrativas
  const goToAdminLogin = () => navigate(ROUTES.ADMIN_LOGIN);
  const goToAdminRecuperarSenha = () => navigate(ROUTES.ADMIN_RECUPERAR_SENHA);
  const goToAdminUsuarios = () => navigate(ROUTES.ADMIN_USUARIOS);
  const goToAdminBarbearias = () => navigate(ROUTES.ADMIN_BARBEARIAS);
  const goToAdminFuncionarios = () => navigate(ROUTES.ADMIN_FUNCIONARIOS);
  const goToAdminAdicionarFila = () => navigate(ROUTES.ADMIN_ADICIONAR_FILA);
  const goToAdminFilas = () => navigate(ROUTES.ADMIN_FILAS);
  const goToAdminRelatorios = () => navigate(ROUTES.ADMIN_RELATORIOS);
  const goToAdminConfiguracoes = () => navigate(ROUTES.ADMIN_CONFIGURACOES);
  const goToAdminDashboard = () => navigate(ROUTES.ADMIN_DASHBOARD);
  const goToAdminUnauthorized = () => navigate(ROUTES.ADMIN_UNAUTHORIZED);
  const goToAdmin = () => navigate(ROUTES.ADMIN);

  // Navegação com redirecionamento após login
  const goToAdminLoginWithRedirect = (from) => {
    navigate(ROUTES.ADMIN_LOGIN, { state: { from } });
  };

  // Navegação com parâmetros de query
  const goToWithQuery = (route, queryParams = {}) => {
    const queryString = new URLSearchParams(queryParams).toString();
    const url = queryString ? `${route}?${queryString}` : route;
    navigate(url);
  };

  // Navegação com estado
  const goToWithState = (route, state = {}) => {
    navigate(route, { state });
  };

  // Navegação com replace (não adiciona ao histórico)
  const goToWithReplace = (route) => {
    navigate(route, { replace: true });
  };

  // Voltar para página anterior
  const goBack = () => navigate(-1);

  // Ir para frente no histórico
  const goForward = () => navigate(1);

  return {
    // Rotas públicas
    goToHome,
    goToEntrarFila,
    goToBarbeariaEntrarFila,
    goToDevEntrarFila,
    goToBarbeariaStatusFila,
    goToBarbeariaVisualizarFila,
    goToQRCode,
    goToBarbearias,
    goToBarbeariaAgendar,
    goToPrivacidade,
    goToTermos,
    goToBarbeariaAvaliacao,
    goToAvaliacoes,
    goToTestUserCreation,
    goToApiTest,
    
    // Rotas administrativas
    goToAdminLogin,
    goToAdminRecuperarSenha,
    goToAdminUsuarios,
    goToAdminBarbearias,
    goToAdminFuncionarios,
    goToAdminAdicionarFila,
    goToAdminFilas,
    goToAdminRelatorios,
    goToAdminConfiguracoes,
    goToAdminDashboard,
    goToAdminUnauthorized,
    goToAdmin,
    
    // Navegação especializada
    goToAdminLoginWithRedirect,
    goToWithQuery,
    goToWithState,
    goToWithReplace,
    goBack,
    goForward,
    
    // Constantes de rotas para uso direto
    ROUTES
  };
}; 