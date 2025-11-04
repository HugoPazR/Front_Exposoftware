// src/routes/TeacherRoutes.jsx
import { Routes, Route, Navigate } from "react-router-dom";
import TeacherDashboard from "../pages/Teacher/Dashboard";
import TeacherProfile from "../pages/Teacher/Profile";
import Studentprojects from "../pages/Teacher/Studentprojects";

export default function TeacherRoutes() {
  return (
    <Routes>
      <Route path="/teacher/dashboard" element={<DocenteRoute><TeacherDashboard /></DocenteRoute>} />
        <Route path="/teacher/proyectos" element={<DocenteRoute><Studentprojects /></DocenteRoute>} />
        <Route path="/teacher/profile" element={<DocenteRoute><TeacherProfile /></DocenteRoute>} />
        <Route path="*" element={<Navigate to="dashboard" />} />
    </Routes>
  );
}
