import React, { 
  createContext, 
  useContext, 
  useEffect, 
  useState, 
  ReactNode 
} from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

interface User {
  id: string;
  name: string;
  type: 'administrator' | 'operator' | 'client';
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (data: any) => void;
  logout: () => void;
}

interface TokenPayload {
  user: User;
  exp: number;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps): React.ReactElement {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");
    
    if (storedToken) {
      try {
        const decodedToken = jwtDecode<TokenPayload>(storedToken);
        
        const currentTime = Date.now() / 1000;
        if (decodedToken.exp < currentTime) {
          logout();
          return;
        }
        
        setToken(storedToken);
        
        const parsedUser = storedUser 
          ? JSON.parse(storedUser) 
          : decodedToken.user;
        
        setUser(parsedUser);
      } catch (error) {
        console.error("Erro ao decodificar o token:", error);
        logout();
      }
    }
  }, []);

  const login = (data: any) => {
    const accessToken = data?.data?.data?.accessToken;
    const userData = data?.data?.data?.user;
    
    if (accessToken && userData) {
      try {
        const decodedToken = jwtDecode<TokenPayload>(accessToken);
        
        const currentTime = Date.now() / 1000;
        if (decodedToken.exp < currentTime) {
          logout();
          return;
        }
        
        setToken(accessToken);
        setUser(decodedToken.user);
        
        localStorage.setItem("token", accessToken);
        localStorage.setItem("user", JSON.stringify(decodedToken.user));
        
        // Redireciona baseado no tipo de usuário
        if (
          decodedToken.user.type === "administrator" || 
          decodedToken.user.type === "operator"
        ) {
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