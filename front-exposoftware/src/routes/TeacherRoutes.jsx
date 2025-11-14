import { Routes, Route, Navigate } from "react-router-dom";
import { DocenteRoute } from "../components/ProtectedRoute";
import TeacherDashboard from "../pages/Teacher/Dashboard";
import TeacherProfile from "../pages/Teacher/Profile";
import Studentprojects from "../pages/Teacher/Studentprojects";

/**
 * TeacherRoutes - Rutas protegidas para docentes
 * 
 * Todas las rutas requieren autenticación con rol "docente"
 * 
 * Rutas disponibles:
 * - /teacher/dashboard - Panel principal del docente
 * - /teacher/profile - Perfil del docente
 * - /teacher/proyectos - Proyectos de estudiantes
 */
export default function TeacherRoutes() {
  return (
    <Routes>
      {/* 🏠 Dashboard principal */}
      <Route 
        path="dashboard" 
        element={
          <DocenteRoute>
            <TeacherDashboard />
          </DocenteRoute>
        } 
      />
      
      {/* 👤 Perfil del docente */}
      <Route 
        path="profile" 
        element={
          <DocenteRoute>
            <TeacherProfile />
          </DocenteRoute>
        } 
      />
      
      {/* 📚 Proyectos de estudiantes */}
      <Route 
        path="proyectos" 
        element={
          <DocenteRoute>
            <Studentprojects />
          </DocenteRoute>
        } 
      />
      
      {/* Redirección por defecto al dashboard */}
      <Route path="*" element={<Navigate to="/teacher/dashboard" replace />} />
    </Routes>
  );
}
