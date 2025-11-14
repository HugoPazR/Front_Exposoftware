import { Routes, Route, Navigate } from "react-router-dom";
import { EstudianteRoute, EstudianteOEgresadoRoute } from "../components/ProtectedRoute";
import StudentDashboard from "../pages/Student/Dashboard";
import Profile from "../pages/Student/Profile";
import MyProjects from "../pages/Student/MyProjects";
import RegisterProject from "../pages/Student/RegisterProject";

/**
 * StudentRoutes - Rutas protegidas para estudiantes
 * 
 * Todas las rutas requieren autenticación con rol "estudiante"
 * 
 * Rutas disponibles:
 * - /student/dashboard - Panel principal del estudiante
 * - /student/profile - Perfil del estudiante
 * - /student/proyectos - Mis proyectos
 * - /student/register-project - Registrar nuevo proyecto
 */
export default function StudentRoutes() {
  return (
    <Routes>
      {/* 🏠 Dashboard principal */}
      <Route 
        path="dashboard" 
        element={
          <EstudianteRoute>
            <StudentDashboard />
          </EstudianteRoute>
        } 
      />
      
      {/* 👤 Perfil del estudiante */}
      <Route 
        path="profile" 
        element={
          <EstudianteRoute>
            <Profile />
          </EstudianteRoute>
        } 
      />
      
      {/* 📂 Gestión de proyectos */}
      <Route 
        path="proyectos" 
        element={
          <EstudianteRoute>
            <MyProjects />
          </EstudianteRoute>
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
      <Route path="*" element={<Navigate to="/student/dashboard" replace />} />
    </Routes>
  );
}
