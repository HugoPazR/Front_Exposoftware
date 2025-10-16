import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import Navbar from "./components/Layout/Navbar";
import Footer from "./components/Layout/Footer";
import Home from "./pages/Home/Home";
import StudentDashboard from "./pages/Student/Dashboard";
import Profile from "./pages/Student/Profile";
import RegisterProject from "./pages/Student/RegisterProject";
import MyProjects from "./pages/Student/MyProjects";
import TeacherDashboard from "./pages/Teacher/Dashboard";
import StudentProjects from "./pages/Teacher/Studentprojects";
import TeacherProfile from "./pages/Teacher/Profile";
import AdminDashboard from "./pages/Admin/Dashboard";
import CreateGroup from "./pages/Admin/CreateGroup";
import CreateSubject from "./pages/Admin/CreateSubject";
import AdminProfile from "./pages/Admin/Profile";
import "primereact/resources/themes/lara-light-green/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";

function App() {
  const location = useLocation();
  const hideNavbarOn = ["/student/dashboard", "/student/profile", "/student/proyectos", "/teacher/dashboard", "/teacher/profile", "/teacher/proyectos", "/admin/dashboard", "/admin/profile", "/admin/crear-materia", "/admin/crear-grupo"];

  return (
    <div className="flex flex-col min-h-screen">
      {!hideNavbarOn.includes(location.pathname) && <Navbar />}
      <main className="flex-1">
        <Routes>
          {/* Ruta principal - Home */}
          <Route path="/" element={<Home />} />
          
          {/* Redirección de /home a / */}
          <Route path="/home" element={<Navigate to="/" replace />} />
          
          {/* Dashboard de Estudiante */}
          <Route path="/student/dashboard" element={<StudentDashboard />} />
          
          {/* Dashboard de Profesor */}
          <Route path="/teacher/dashboard" element={<TeacherDashboard />} />
          <Route path="/teacher/proyectos" element={<StudentProjects />} />
          <Route path="/teacher/profile" element={<TeacherProfile />} />
          
          {/* Dashboard de Admin */}
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/crear-grupo" element={<CreateGroup />} />
          <Route path="/admin/crear-materia" element={<CreateSubject />} />
          <Route path="/admin/profile" element={<AdminProfile />} />
          
          
          {/* Otras rutas */}
          <Route path="/student/profile" element={<Profile />} />
          <Route path="/student/register-project" element={<RegisterProject />} />
          <Route path="/student/proyectos" element={<MyProjects />} />
          <Route path="/projects" element={<div className="container mx-auto px-8 py-16">Página de Proyectos (Por crear)</div>} />
          <Route path="/about" element={<div className="container mx-auto px-8 py-16">Página Acerca de (Por crear)</div>} />
          <Route path="/login" element={<div className="container mx-auto px-8 py-16">Página Login (Por crear)</div>} />
          <Route path="/upload" element={<div className="container mx-auto px-8 py-16">Subir Proyecto (Por crear)</div>} />
          <Route path="/proyectos-anteriores" element={<div className="container mx-auto px-8 py-16">Proyectos Anteriores (Por crear)</div>} />
          
          {/* Ruta 404 - Página no encontrada */}
          <Route path="*" element={<div className="container mx-auto px-8 py-16 text-center"><h1 className="text-3xl font-bold text-gray-800">404 - Página no encontrada</h1></div>} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;