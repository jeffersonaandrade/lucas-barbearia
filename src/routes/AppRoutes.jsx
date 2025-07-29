import { Routes, Route } from 'react-router-dom';
import { publicRoutes, adminRoutes, catchAllRoute, renderRoute } from './index.jsx';

const AppRoutes = () => {
  return (
    <Routes>
      {/* Rotas públicas */}
      {publicRoutes.map((route) => (
        <Route
          key={route.path}
          path={route.path}
          element={renderRoute(route)}
        />
      ))}
      
      {/* Rotas administrativas */}
      {adminRoutes.map((route) => (
        <Route
          key={route.path}
          path={route.path}
          element={renderRoute(route)}
        />
      ))}
      
      {/* Rota catch-all */}
      <Route
        path={catchAllRoute.path}
        element={renderRoute(catchAllRoute)}
      />
    </Routes>
  );
};

export default AppRoutes; 