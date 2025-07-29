import { useLocation } from 'react-router-dom';

export const useIsLoginPage = () => {
  const location = useLocation();
  return location.pathname === '/admin/login';
}; 