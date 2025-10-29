import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import Navbar from "./components/Layout/Navbar";
import Footer from "./components/Layout/Footer";

import Home from "./pages/Home/Home";

import Login from "./pages/Auth/Login";
import Register from "./pages/Auth/Register";
import StudentDashboard from "./pages/Student/Dashboard";
import TeacherDashboard from "./pages/Teacher/Dashboard";
import StudentProjects from "./pages/Teacher/StudentProjects";
import AttenceStudent from "./pages/Student/AttendanceStudent";
import TeacherProfile from "./pages/Teacher/Profile";
import Profile from "./pages/Student/Profile";
import RegisterProject from "./pages/Student/RegisterProject";
import MyProjects from "./pages/Student/MyProjects";
import About from "./pages/Home/About";
import AdminDashboard from "./pages/Admin/Dashboard";
import AttendanceAdmin from "./pages/Admin/AttendanceAdmin";
import AdminProfile from "./pages/Admin/Profile";
import CreateGroup from "./pages/Admin/CreateGroup";
import CreateSubject from "./pages/Admin/CreateSubject";
import CreateTeacher from "./pages/Admin/CreateTeacher";
import AdminCreatelines from "./pages/Admin/CreateLines";
import GraduateDashboard from "./pages/Graduate/Dashboard";
import GraduateProfile from "./pages/Graduate/Profile";
import GraduateProjects from "./pages/Graduate/Proyects";
import GuestDashboard from "./pages/Guest/Dashboard.jsx";
import GuestProjects from "./pages/Guest/Proyects";
import GuestProfile from "./pages/Guest/Profile";
import Projects from "./pages/Home/Projects";




/*import StudentProjects from './pages/Teacher/Studentprojects.jsx';
import StudentDashboard from './pages/Student/Dashboard.jsx';
import Profile from './pages/Student/Profile.jsx';
import MyProjects from './pages/Student/MyProjects.jsx';
import RegisterProject from './pages/Student/RegisterProject.jsx';

import TeacherDashboard from './pages/Teacher/Dashboard.jsx';
import TeacherProfile from './pages/Teacher/Profile.jsx';
*/
import "primereact/resources/themes/lara-light-green/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";



function App() {
  const location = useLocation();

  const hideNavbarOn = [
    "/student/dashboard",
    "/student/profile",
    "/student/proyectos",
    "/student/asistencia",
    "/teacher/dashboard",
    "/teacher/profile",
    "/teacher/proyectos",
    "/admin/dash",
    "/admin/asistencia",
    "/admin/profile",
    "/admin/crear-grupo",
    "/admin/crear-materia",
    "/admin/crear-profesor",
    "/admin/lineas-investigacion",
    "/graduate/dashboard",
    "/graduate/profile",
    "/graduate/proyectos",
    "/guest/dashboard",
    "/guest/profile",
    "/guest/proyectos"
  ];

  return (
    <div className="flex flex-col min-h-screen">
      {!hideNavbarOn.includes(location.pathname) && <Navbar />}
      <main className="flex-1">
        <Routes>
          {/* Página principal */}
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />

          {/* Autenticación */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/projects" element={<Projects />} />

          {/* Estudiantes */}
          <Route path="/student/dashboard" element={<StudentDashboard />} />
          <Route path="/student/proyectos" element={<MyProjects />} />
          <Route path="/student/profile" element={<Profile />} />
          <Route path="/student/register-project" element={<RegisterProject />} />
          <Route path="/student/asistencia" element={<AttenceStudent />} />

          {/* Profesores */}
          <Route path="/teacher/dashboard" element={<TeacherDashboard />} />
          <Route path="/teacher/proyectos" element={<StudentProjects />} />
          <Route path="/teacher/profile" element={<TeacherProfile />} />

          {/* ✅ Administrador */}
          <Route path="/admin/dash" element={<AdminDashboard />} />
          <Route path="/admin/profile" element={<AdminProfile />} />
          <Route path="/admin/crear-grupo" element={<CreateGroup />} />
          <Route path="/admin/crear-materia" element={<CreateSubject />} />
          <Route path="/admin/crear-profesor" element={<CreateTeacher />} />
          <Route path="/admin/asistencia" element={<AttendanceAdmin />} />
          <Route path="/admin/lineas-investigacion" element={<AdminCreatelines />} />

          {/* ✅ Egresados */}
          <Route path="/graduate/dashboard" element={<GraduateDashboard />} />
          <Route path="/graduate/profile" element={<GraduateProfile />} />
          <Route path="/graduate/proyectos" element={<GraduateProjects />} />
          {/* Dashboard de Invitado/Guest */}
          <Route path="/guest/dashboard" element={<GuestDashboard />} />
          <Route path="/guest/proyectos" element={<GuestProjects />} />
          <Route path="/guest/profile" element={<GuestProfile/>}/>




          {/* Página no encontrada */}
          <Route
            path="*"
            element={
              <div className="container mx-auto px-8 py-16 text-center">
                <h1 className="text-3xl font-bold text-gray-800">
                  404 - Página no encontrada
                </h1>
              </div>
            }
          />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;
