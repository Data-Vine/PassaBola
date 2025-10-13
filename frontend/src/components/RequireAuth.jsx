import { Navigate, useLocation } from 'react-router-dom';

const RequireAuth = ({ children }) => {
  const token = localStorage.getItem('token');
  const location = useLocation();
  
  if (!token) {
    // Se estamos no contexto da Copa, redireciona para o login da Copa
    if (location.pathname.startsWith('/copa')) {
      return <Navigate to="login" replace />;
    }
    // Senão, redireciona para o login geral
    return <Navigate to="/login" replace />;
  }
  
  return children;
};

export default RequireAuth;
