import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "./../hooks/AuthContext"; 

export function ProtectedRoute({ redirectTo = "/login" }) {
  const { token } = useAuth();

  if (token === null) {
    return <p>Carregando...</p>; // Pode ser um Spinner ou animação
  }

  return token ? <Outlet /> : <Navigate to={redirectTo} replace />;
}
