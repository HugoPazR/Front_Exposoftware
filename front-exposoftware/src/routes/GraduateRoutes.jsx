import { Routes, Route, Navigate } from "react-router-dom";
import { EgresadoRoute, EstudianteOEgresadoRoute } from "../components/ProtectedRoute";
import GraduateDashboard from "../pages/Graduate/Dashboard";
import GraduateProfile from "../pages/Graduate/Profile";
import GraduateProjects from "../pages/Graduate/Proyects";
import RegisterProject from "../pages/Student/RegisterProject";

/**
 * GraduateRoutes - Rutas protegidas para egresados
 * 
 * Todas las rutas requieren autenticación con rol "egresado"
 * 
 * Rutas disponibles:
 * - /graduate/dashboard - Panel principal del egresado
 * - /graduate/profile - Perfil del egresado
 * - /graduate/proyectos - Proyectos del egresado
 * - /graduate/register-project - Registrar nuevo proyecto
 */
export default function GraduateRoutes() {
  return (
    <Routes>
      {/* 🏠 Dashboard principal */}
      <Route 
        path="dashboard" 
        element={
          <EgresadoRoute>
            <GraduateDashboard />
          </EgresadoRoute>
        } 
      />
      
      {/* 👤 Perfil del egresado */}
      <Route 
        path="profile" 
        element={
          <EgresadoRoute>
            <GraduateProfile />
          </EgresadoRoute>
        } 
      />
      
      {/* 📂 Proyectos del egresado */}
      <Route 
        path="proyectos" 
        element={
          <EgresadoRoute>
            <GraduateProjects />
          </EgresadoRoute>
        } 
      />
      
      {/* ➕ Registro de proyecto (estudiantes y egresados) */}
      <Route 
        path="register-project" 
        element={
          <EstudianteOEgresadoRoute>
            <RegisterProject />
          </EstudianteOEgresadoRoute>
        } 
      />
      
      {/* Redirección por defecto al dashboard */}
      <Route path="*" element={<Navigate to="/graduate/dashboard" replace />} />
    </Routes>
  );
}
