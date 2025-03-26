import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

// Criando o contexto de autenticação
const AuthContext = createContext();

// Hook personalizado para usar o contexto
export const useAuth = () => useContext(AuthContext);

// Componente Provider para gerenciar a autenticação
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
  const storedToken = localStorage.getItem("token");
  const storedUser = localStorage.getItem("user");
  
  if (storedToken) {
    try {
      const decodedToken = jwtDecode(storedToken);
      
      // Verify token expiration
      const currentTime = Date.now() / 1000;
      if (decodedToken.exp < currentTime) {
        logout();
        return;
      }
      
      setToken(storedToken);
      
      // Parse user from localStorage if exists
      const parsedUser = storedUser ? JSON.parse(storedUser) : decodedToken.user;
      setUser(parsedUser);
    } catch (error) {
      console.error("Erro ao decodificar o token:", error);
      logout();
    }
  }
}, []);

  // Função de login
  const login = (data) => {
  const accessToken = data?.data?.data?.accessToken;
  const userData = data?.data?.data?.user;
  
  if (accessToken && userData) {
    try {
      const decodedToken = jwtDecode(accessToken);
      
      // Opcional: Adicione verificação de expiração
      const currentTime = Date.now() / 1000;
      if (decodedToken.exp < currentTime) {
        logout();
        return;
      }
      
      setToken(accessToken);
      setUser(decodedToken.user);
      localStorage.setItem("token", accessToken);
      localStorage.setItem("user", JSON.stringify(decodedToken.user));
      
      // Redireciona com base no tipo de usuário
      if (decodedToken.user.type === "administrator" || decodedToken.user.type === "operator") {
        navigate("/admin");
      } else {
        navigate("/");
      }
    } catch (error) {
      console.error("Erro ao decodificar token:", error);
      logout();
    }
  }
};
  // Função de logout
  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
