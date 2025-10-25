import { Navigate } from 'react-router-dom';

/**
 * Guard para rotas que exigem autenticação
 * Redireciona para /copa/login se não houver token
 */
export default function ProtectedRoute({ children }) {
  const token = localStorage.getItem('passabola:token');
  
  if (!token) {
    return <Navigate to="/copa/login" replace />;
  }
  
  return children;
}
