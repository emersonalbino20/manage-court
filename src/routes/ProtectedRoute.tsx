import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "./../hooks/AuthContext";
import { jwtDecode } from "jwt-decode";

export function ProtectedRoute() {
  const { token } = useAuth();
  const location = useLocation();

  // Se não houver token, permitir apenas rotas públicas
  if (!token) {
    const publicRoutes = ["/", "/login", "/register", "/forgot-password"];
    return publicRoutes.includes(location.pathname) ? <Outlet /> : <Navigate to="/login" replace />;
  }

  try {
    // Decodifica o token para obter o tipo de usuário
    const { user } = jwtDecode(token);
    const userType = user?.type;

    const adminRoutes = ["/admin"];
    const clientRoutes = ["/", "/courtdetails", "/booking", "/forgot-password"];

    if (userType === "administrator" || userType === "operator") {
      return adminRoutes.includes(location.pathname) ? <Outlet /> : <Navigate to="/admin" replace />;
    } else if (userType === "client") {
      return clientRoutes.includes(location.pathname) ? <Outlet /> : <Navigate to="/" replace />;
    } else {
      return <Navigate to="*" replace />;
    }
  } catch (error) {
    console.error("Erro ao decodificar o token:", error);
    return <Navigate to="/login" replace />;
  }
}
