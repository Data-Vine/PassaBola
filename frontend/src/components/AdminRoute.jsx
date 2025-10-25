import { Navigate } from "react-router-dom";

// Guard para rotas administrativas - só permite role admin
export default function AdminRoute({ children }) {
  const user = JSON.parse(localStorage.getItem("passabola:user") || "null");
  
  if (!user) {
    return <Navigate to="/copa/login" replace />;
  }
  
  if (user.role !== "admin") {
    return <Navigate to="/copa" replace />;
  }
  
  return children;
}
