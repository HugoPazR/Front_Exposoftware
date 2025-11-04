import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

// Importa tus agrupadores de rutas
import PublicRoutes from "./PublicRoutes";
import AdminRoutes from "./AdminRoutes";
import StudentRoutes from "./StudentRoutes";
import TeacherRoutes from "./TeacherRoutes";
import GuestRoutes from "./GuestRoutes";
import GraduateRoutes from "./GraduateRoutes";


export default function AppRouter() {
  const { isAuthenticated, getUserRole } = useAuth();
  const role = getUserRole();

  return (
    <Routes>
      {/* Rutas públicas: Home, About, Contact, Login, etc. */}
      <Route path="/*" element={<PublicRoutes />} />

      {/* Rutas privadas según el rol */}
      {isAuthenticated() && role === "admin" && (
        <Route path="/admin/*" element={<AdminRoutes />} />
      )}

      {isAuthenticated() && role === "estudiante" && (
        <Route path="/student/*" element={<StudentRoutes />} />
      )}

      {isAuthenticated() && role === "docente" && (
        <Route path="/teacher/*" element={<TeacherRoutes />} />
      )}

      {isAuthenticated() && role === "invitado" && (
        <Route path="/guest/*" element={<GuestRoutes />} />
      )}

      {isAuthenticated() && role === "egresado" && (
        <Route path="/graduate/*" element={<GraduateRoutes />} />
      )}

      {/* Si no hay coincidencias */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
