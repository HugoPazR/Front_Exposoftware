// src/routes/GraduateRoutes.jsx
import { Routes, Route, Navigate } from "react-router-dom";
import GraduateDashboard from "../pages/Graduate/Dashboard";
import GraduateProfile from "../pages/Graduate/Profile";
import GraduateProjects from "../pages/Graduate/Proyects";

export default function GraduateRoutes() {
  return (
    <Routes>
      <Route path="/graduate/dashboard" element={<EgresadoRoute><GraduateDashboard /></EgresadoRoute>} />
      <Route path="/graduate/profile" element={<EgresadoRoute><GraduateProfile /></EgresadoRoute>} />
      <Route path="/graduate/proyectos" element={<EgresadoRoute><GraduateProjects /></EgresadoRoute>} />
      <Route path="/graduate/register-project" element={<EstudianteOEgresadoRoute><RegisterProject /></EstudianteOEgresadoRoute>} />
      <Route path="*" element={<Navigate to="dashboard" />} />
    </Routes>
  );
}
