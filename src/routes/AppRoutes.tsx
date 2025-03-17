import { BrowserRouter, Routes, Route } from "react-router-dom";
import LadingPage from "./../LadingPage";
import Account from "./../Account";
import Quadra from "./../QuadraDetalhes";
import LoginPage from "./../LoginPage";
import Booking from "./../Booking";
import Dashboard from "./../Dashboard";
import NotFound from "./../NotFoundPage";

export function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LadingPage />} />
        <Route path="/account" element={<Account />} />
        <Route path="/quadra" element={<Quadra />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/booking" element={<Booking />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}