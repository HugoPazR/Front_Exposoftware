// src/routes/AdminRoutes.jsx
import { Routes, Route, Navigate } from "react-router-dom";
import AdminDashboard from "../pages/Admin/Dashboard";
import AttendanceAdmin from "../pages/Admin/AttendanceAdmin";
import AdminProfile from "../pages/Admin/Profile";
import CreateGroup from "../pages/Admin/CreateGroup";
import CreateSubject from "../pages/Admin/CreateSubject";
import CreateTeacher from "../pages/Admin/CreateTeacher";
import AdminCreatelines from "../pages/Admin/CreateLines";
import RegisterEvent from "../pages/Admin/RegisterEvent";
import ManageEvents from "../pages/Admin/ManageEvents";
import CrearFacultades from "../pages/Admin/CrearFacultades";
import CreatePrograms from "../pages/Admin/CreatePrograms";
import AdminEvento from "../pages/Admin/AdminEvento";
import ManageStudents from "../pages/Admin/ManageStudents";
import StudentDetails from "../pages/Admin/StudentDetails";
import EditStudent from "../pages/Admin/EditStudent";

export default function AdminRoutes() {
  return (
    <Routes>
        <Route path="/admin/dashboard" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
        <Route path="/admin/dash" element={<Navigate to="/admin/dashboard" replace />} />
        <Route path="/admin/profile" element={<AdminRoute><AdminProfile /></AdminRoute>} />
        <Route path="/admin/crear-grupo" element={<AdminRoute><CreateGroup /></AdminRoute>} />
        <Route path="/admin/crear-materia" element={<AdminRoute><CreateSubject /></AdminRoute>} />
        <Route path="/admin/crear-profesor" element={<AdminRoute><CreateTeacher /></AdminRoute>} />
        <Route path="/admin/lineas-investigacion" element={<AdminRoute><AdminCreatelines /></AdminRoute>} />
        <Route path="/admin/registrar-eventos" element={<AdminRoute><RegisterEvent /></AdminRoute>} />
        <Route path="/admin/gestionar-eventos" element={<AdminRoute><ManageEvents /></AdminRoute>} />
        <Route path="/admin/crear-facultad" element={<AdminRoute><CrearFacultades /></AdminRoute>} />
        <Route path="/admin/crear-programa" element={<AdminRoute><CreatePrograms /></AdminRoute>} />
        <Route path="/admin/estudiantes" element={<AdminRoute><ManageStudents /></AdminRoute>} />
        <Route path="/admin/estudiantes/:studentId" element={<AdminRoute><StudentDetails /></AdminRoute>} />
        <Route path="/admin/estudiantes/:studentId/editar" element={<AdminRoute><EditStudent /></AdminRoute>} />
        <Route path="/admin/asistencia" element={<AdminRoute><AttendanceAdmin /></AdminRoute>} />
        <Route path="*" element={<Navigate to="dashboard" />} />
    </Routes>
  );
}
