// src/routes/StudentRoutes.jsx
import { Routes, Route, Navigate } from "react-router-dom";
import StudentDashboard from "../pages/Student/Dashboard";
import Profile from "../pages/Student/Profile";
import RegisterProject from "../pages/Student/RegisterProject";
import MyProjects from "../pages/Student/MyProjects";

export default function StudentRoutes() {
  return (
    <Routes>
        <Route path="/student/dashboard" element={<EstudianteRoute><StudentDashboard /></EstudianteRoute>} />
        <Route path="/student/proyectos" element={<EstudianteRoute><MyProjects /></EstudianteRoute>} />
        <Route path="/student/profile" element={<EstudianteRoute><Profile /></EstudianteRoute>} />
        <Route path="/student/register-project" element={<EstudianteOEgresadoRoute><RegisterProject /></EstudianteOEgresadoRoute>} />
        <Route path="*" element={<Navigate to="dashboard" />} />
    </Routes>
  );
}
