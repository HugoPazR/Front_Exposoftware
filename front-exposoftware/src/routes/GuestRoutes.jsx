// src/routes/GuestRoutes.jsx
import { Routes, Route, Navigate } from "react-router-dom";
import GuestDashboard from "../pages/Guest/Dashboard.jsx";
import GuestProjects from "../pages/Guest/Proyects";
import GuestProfile from "../pages/Guest/Profile";

export default function GuestRoutes() {
  return (
    <Routes>
        <Route path="/guest/dashboard" element={<InvitadoRoute><GuestDashboard /></InvitadoRoute>} />
        <Route path="/guest/profile" element={<InvitadoRoute><GuestProfile /></InvitadoRoute>} />
        <Route path="/guest/proyectos" element={<InvitadoRoute><GuestProjects /></InvitadoRoute>} />
        <Route path="*" element={<Navigate to="dashboard" />} />
    </Routes>
  );
}
