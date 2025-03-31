import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ProtectedRoute } from './ProtectedRoute';
import { lazy, Suspense } from 'react';

// Importações das páginas
const Home = lazy(() => import('../pages/dashboard/Home'));
const EditProfile = lazy(() => import('../pages/dashboard/EditProfile'));
const Register = lazy(() => import('../pages/auth/Register'));
const CourtDetails = lazy(() => import('../pages/dashboard/CourtDetails'));
const Login = lazy(() => import('../pages/auth/Login'));
const ForgotPassword = lazy(() => import('../pages/auth/ForgotPassword'));
const ResetPassword = lazy(() => import('../pages/auth/ResetPassword'));
const Booking = lazy(() => import('../pages/dashboard/Booking'));
const UserBooking = lazy(() => import('../layouts/UserBookingsSection'));
const AdminPanel = lazy(() => import('../pages/dashboard/AdminPanel'));
const NotFound = lazy(() => import('../pages/dashboard/NotFound'));

export function AppRoutes(): React.ReactElement {
  return (
        <Suspense
          fallback={
            <div className="flex justify-center items-center h-screen">
                <div className="w-10 h-10 border-4 border-blue-500 rounded-full animate-spin border-t-transparent"></div>
            </div>
          }
        >
        <Routes>
          {/* Rotas públicas */}
          <Route path="/courtdetails" element={<CourtDetails />} />

          {/* Rotas protegidas */}
          <Route element={<ProtectedRoute />}>
            <Route path="/" element={<Home />} />
            <Route path="/edit-profile" element={<EditProfile />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/admin" element={<AdminPanel />} />
            <Route path="/booking" element={<Booking />} />
            <Route path="/userbooking" element={<UserBooking />} />
          </Route>
          {/* Página 404 */}
          <Route path="/notfound" element={<NotFound />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
  );
}