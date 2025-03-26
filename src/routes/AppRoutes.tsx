import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { ProtectedRoute } from './ProtectedRoute';

// Importações das páginas
import Home from '../pages/dashboard/Home';
import Register from '../pages/auth/Register';
import CourtDetails from '../pages/dashboard/CourtDetails';
import Login from '../pages/auth/Login';
import ForgotPassword from '../pages/auth/ForgotPassword';
import Booking from '../pages/dashboard/Booking';
import UserBooking from '../layouts/UserBookingsSection';
import AdminPanel from '../pages/dashboard/AdminPanel';
import NotFound from '../pages/dashboard/NotFound';

export function AppRoutes(): React.ReactElement {
  return (
    <Routes>
      {/* Rotas públicas */}
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      
      {/* Rotas protegidas */}
      <Route element={<ProtectedRoute />}>
        <Route path="/admin" element={<AdminPanel />} />
        <Route path="/courtdetails" element={<CourtDetails />} />
        <Route path="/booking" element={<Booking />} />
        <Route path="/userbooking" element={<UserBooking />} />
      </Route>

      {/* Página 404 */}
      <Route path="/notfound" element={<NotFound />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}