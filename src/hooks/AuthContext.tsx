import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

// Criando o contexto de autenticação
const AuthContext = createContext();

// Hook personalizado para usar o contexto
export const useAuth = () => {
  return useContext(AuthContext);
};

// Componente Provider para gerenciar a autenticação
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

    if (storedToken) {
      setToken(storedToken);
    }

    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error("Erro ao fazer parse do usuário:", error);
        localStorage.removeItem("user"); // Remove dados corrompidos
      }
    }
  }, []);

  // Função de login
  const login = (data) => {
    const accessToken = data?.data?.data?.accessToken;
    const userData = data?.data?.data?.user;

    if (accessToken && userData) {
      setToken(accessToken);
      setUser(userData);
      localStorage.setItem("token", accessToken);
      localStorage.setItem("user", JSON.stringify(userData));

      navigate("/"); // Redireciona para a página principal após login
    }
  };

  // Função de logout
  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/"); // Redireciona para Home após sair
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
