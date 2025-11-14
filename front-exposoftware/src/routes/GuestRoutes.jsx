import { Routes, Route, Navigate } from "react-router-dom";
import { InvitadoRoute } from "../components/ProtectedRoute";
import GuestDashboard from "../pages/Guest/Dashboard";
import GuestProfile from "../pages/Guest/Profile";
import GuestProjects from "../pages/Guest/Proyects";

/**
 * GuestRoutes - Rutas protegidas para invitados
 * 
 * Todas las rutas requieren autenticación con rol "invitado"
 * 
 * Rutas disponibles:
 * - /guest/dashboard - Panel principal del invitado
 * - /guest/profile - Perfil del invitado
 * - /guest/proyectos - Proyectos accesibles para el invitado
 */
export default function GuestRoutes() {
  return (
    <Routes>
      {/* 🏠 Dashboard principal */}
      <Route 
        path="dashboard" 
        element={
          <InvitadoRoute>
            <GuestDashboard />
          </InvitadoRoute>
        } 
      />
      
      {/* 👤 Perfil del invitado */}
      <Route 
        path="profile" 
        element={
          <InvitadoRoute>
            <GuestProfile />
          </InvitadoRoute>
        } 
      />
      
      {/* 📂 Proyectos accesibles */}
      <Route 
        path="proyectos" 
        element={
          <InvitadoRoute>
            <GuestProjects />
          </InvitadoRoute>
        } 
      />
      
      {/* Redirección por defecto al dashboard */}
      <Route path="*" element={<Navigate to="/guest/dashboard" replace />} />
    </Routes>
  );
}
