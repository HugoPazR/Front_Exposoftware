import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import Navbar from "./components/Layout/Navbar";
import Footer from "./components/Layout/Footer";
import Home from "./pages/Home/Home";
import Login from "./pages/Auth/Login";
import Register from "./pages/Auth/Register";
import StudentDashboard from "./pages/Student/Dashboard";
import StudentProjects from "./pages/Teacher/StudentProjects";
import TeacherProfile from "./pages/Teacher/Dashboard";
import TeacherDashboard from "./pages/Teacher/Profile";
import Profile from "./pages/Student/Profile";
import RegisterProject from "./pages/Student/RegisterProject";
import MyProjects from "./pages/Student/MyProjects";
import About from "./pages/Home/About";
import AdminDashboard from "./pages/Admin/Dashboard";
import AdminProfile from "./pages/Admin/Profile";
import CreateGroup from "./pages/Admin/CreateGroup";
import CreateSubject from "./pages/Admin/CreateSubject";
import CreateTeacher from "./pages/Admin/CreateTeacher";
import AdminCreatelines from "./pages/Admin/CreateLines";
import RegisterEvent from "./pages/Admin/RegisterEvent";
import GraduateDashboard from "./pages/Graduate/Dashboard";
import GraduateProfile from "./pages/Graduate/Profile";
import GraduateProjects from "./pages/Graduate/Proyects";
import Proyects from "./pages/Home/Projects";
import Attendance from "./pages/Asistencia/Attendance";



import "primereact/resources/themes/lara-light-green/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";

function App() {
  const location = useLocation();

  const hideNavbarOn = [
    "/student/dashboard",
    "/student/profile",
    "/student/proyectos",
    "/teacher/dashboard",
    "/teacher/profile",
    "/teacher/proyectos",
    "/admin/dash",
    "/admin/profile",
    "/admin/crear-grupo",
    "/admin/crear-materia",
    "/admin/crear-profesor",
    "/admin/lineas-investigacion",
    "/admin/registrar-eventos",
    "/graduate/dashboard",
    "/graduate/profile",
    "/graduate/proyectos",
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
          <Route path="/projects" element={<Proyects />} />
          
          {/* Registro de Asistencia Pública */}
          <Route path="/asistencia" element={<Attendance />} />

          {/* Estudiantes */}
          <Route path="/student/dashboard" element={<StudentDashboard />} />
          <Route path="/student/proyectos" element={<MyProjects />} />
          <Route path="/student/profile" element={<Profile />} />
          <Route path="/student/register-project" element={<RegisterProject />} />

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
          <Route path="/admin/lineas-investigacion" element={<AdminCreatelines />} />
          <Route path="/admin/registrar-eventos" element={<RegisterEvent />} />

          {/* ✅ Egresados */}
          <Route path="/graduate/dashboard" element={<GraduateDashboard />} />
          <Route path="/graduate/profile" element={<GraduateProfile />} />
          <Route path="/graduate/proyectos" element={<GraduateProjects />} />




          <Route
            path="*"
            element={
              <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-emerald-400 via-green-500 to-teal-500">
                <div className="text-center px-8 bg-white rounded-2xl shadow-2xl p-12 max-w-md">
                  <div className="text-8xl mb-4 animate-bounce">🔍</div>
                  <h1 className="text-6xl font-bold text-gray-800 mb-4">404</h1>
                  <p className="text-xl text-gray-600 mb-6">
                    ¡Ups! Parece que te perdiste
                  </p>
                  <a 
                    href="/" 
                    className="inline-block px-8 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-full font-semibold hover:scale-105 transition-transform"
                  >
                    Ir al inicio
                  </a>
                </div>
              </div>
            }
          ></Route>
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;
