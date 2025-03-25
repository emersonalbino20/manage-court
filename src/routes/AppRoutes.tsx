import { Routes, Route } from "react-router-dom";
import { ProtectedRoute } from "./ProtectedRoute";
import { useAuth } from "./../hooks/AuthContext";
import Home from "./../pages/dashboard/Home";
import Register from "./../pages/auth/Register";
import CourtDetails from "./../pages/dashboard/CourtDetails";
import Login from "./../pages/auth/Login";
import ForgotPassword from "./../pages/auth/ForgotPassword";
import Booking from "./../pages/dashboard/Booking";
import AdminPanel from ".././pages/dashboard/AdminPanel";
import NotFound from "./../pages/dashboard/NotFound";

export function AppRoutes() {
  const { token } = useAuth();

  return (
    <Routes>
      {/* Rotas públicas */}
      <Route path="/" element={<Home />} />
      <Route path="/courtdetails" element={<CourtDetails />} />
      <Route path="/booking" element={<Booking />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />

      {/* Impede usuários logados de acessar Login/Register */}
      {!token && <Route path="/register" element={<Register />} />}
      {!token && <Route path="/login" element={<Login />} />}

      {/* Rotas protegidas */}
      <Route element={<ProtectedRoute />}>
        <Route path="/admin" element={<AdminPanel />} />
      </Route>

      {/* Página 404 */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
