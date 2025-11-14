import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import * as AuthService from "../Services/AuthService";


// Importa los agrupadores de rutas
import PublicRoutes from "./PublicRoutes";
import AdminRoutes from "./AdminRoutes";
import StudentRoutes from "./StudentRoutes";
import TeacherRoutes from "./TeacherRoutes";
import GuestRoutes from "./GuestRoutes";
import GraduateRoutes from "./GraduateRoutes";

/**
 * AppRouter - Router principal de la aplicación
 * 
 * Organiza las rutas en grupos según el rol del usuario:
 * - PublicRoutes: Rutas accesibles sin autenticación
 * - AdminRoutes: Rutas para administradores
 * - StudentRoutes: Rutas para estudiantes
 * - TeacherRoutes: Rutas para docentes
 * - GraduateRoutes: Rutas para egresados
 * - GuestRoutes: Rutas para invitados
 * 
 * El sistema verifica la autenticación y el rol del usuario
 * antes de permitir el acceso a rutas protegidas.
 */
export default function AppRouter() {
  const { isAuthenticated } = useAuth();
  
  const role = AuthService.getUserRole();
  //const role = getUserRole();

  return (
    <Routes>
      {/* 🌐 Rutas públicas: Home, About, Contact, Login, etc. */}
      <Route path="/*" element={<PublicRoutes />} />

      {/* 🔒 Rutas privadas según el rol */}
      
      {/* 👨‍💼 Admin Routes */}
      {isAuthenticated() && role === "admin" && (
        <Route path="/admin/*" element={<AdminRoutes />} />
      )}

      {/* 🎓 Student Routes */}
      {isAuthenticated() && role === "estudiante" && (
        <Route path="/student/*" element={<StudentRoutes />} />
      )}

      {/* 👨‍🏫 Teacher Routes */}
      {isAuthenticated() && role === "docente" && (
        <Route path="/teacher/*" element={<TeacherRoutes />} />
      )}

      {/* 🎉 Graduate Routes */}
      {isAuthenticated() && role === "egresado" && (
        <Route path="/graduate/*" element={<GraduateRoutes />} />
      )}

      {/* 👤 Guest Routes */}
      {isAuthenticated() && role === "invitado" && (
        <Route path="/guest/*" element={<GuestRoutes />} />
      )}

      {/* 🚫 Si no hay coincidencias, redirigir al home */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
