import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/AuthContext';
import { jwtDecode } from 'jwt-decode';

interface TokenPayload {
  user: {
    type: 'administrator' | 'operator' | 'client';
  };
}

export function ProtectedRoute(): React.ReactElement {
  const { token } = useAuth();
  const location = useLocation();

  // Rotas públicas para usuários não autenticados
  const publicRoutes = ["/", "/login", "/register", "/forgot-password"];

  // Se não houver token, permitir apenas rotas públicas
  if (!token) {
    return publicRoutes.includes(location.pathname) 
      ? <Outlet /> 
      : <Navigate to="/login" replace />;
  }

  try {
    // Decodifica o token para obter o tipo de usuário
    const { user } = jwtDecode<TokenPayload>(token);
    const userType = user?.type;

    // Rotas específicas por tipo de usuário
    const adminRoutes = ["/admin"];
    const clientRoutes = ["/", "/edit-profile", "/courtdetails", "/booking", "/userbooking"];

    // Lógica de redirecionamento para administradores e operadores
    if (userType === "administrator" || userType === "operator") {
      return adminRoutes.includes(location.pathname) 
        ? <Outlet /> 
        : <Navigate to="/admin" replace />;
    } 
    
    // Lógica de redirecionamento para clientes
    if (userType === "client") {
      return clientRoutes.includes(location.pathname) 
        ? <Outlet /> 
        : <Navigate to="/" replace />;
    }

    // Caso não corresponda a nenhum tipo de usuário
    return <Navigate to="/notfound" replace />;

  } catch (error) {
    console.error("Erro ao decodificar o token:", error);
    return <Navigate to="/login" replace />
  }
}