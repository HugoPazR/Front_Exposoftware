import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import Navbar from "./components/Layout/Navbar";
import Footer from "./components/Layout/Footer";
import Home from "./pages/Home/Home";
import Login from "./pages/Auth/Login";
import Register from "./pages/Auth/Register";
import StudentDashboard from "./pages/Student/Dashboard";
import Studentprojects from "./pages/Teacher/Studentprojects";
import TeacherDashboard from "./pages/Teacher/Dashboard";
import TeacherProfile from "./pages/Teacher/Profile";
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
import ManageEvents from "./pages/Admin/ManageEvents";
import CrearFacultades from "./pages/Admin/CrearFacultades";
import CreatePrograms from "./pages/Admin/CreatePrograms";
import GraduateDashboard from "./pages/Graduate/Dashboard";
import GraduateProfile from "./pages/Graduate/Profile";
import GraduateProjects from "./pages/Graduate/Proyects";
import Proyects from "./pages/Home/Projects";
import GuestDashboard from "./pages/Guest/Dashboard";
import GuestProfile from "./pages/Guest/Profile";
import GuestProjects from "./pages/Guest/Proyects";
import { AdminRoute, DocenteRoute, EstudianteRoute, EgresadoRoute, InvitadoRoute} from "./components/ProtectedRoute";





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
    "/admin/dashboard",
    "/admin/dash",
    "/admin/profile",
    "/admin/crear-grupo",
    "/admin/crear-materia",
    "/admin/crear-profesor",
    "/admin/lineas-investigacion",
    "/admin/registrar-eventos",
    "/admin/gestionar-eventos",
    "/admin/facultades",
    "/admin/crear-facultad",
    "/admin/crear-programa",
    "/admin/programas",
    "/graduate/dashboard",
    "/graduate/profile",
    "/graduate/proyectos",
    "/guest/dashboard",
    "/guest/profile",
    "/guest/proyectos",
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

          {/* ✅ Estudiantes - RUTAS PROTEGIDAS */}
          <Route path="/student/dashboard" element={<EstudianteRoute><StudentDashboard /></EstudianteRoute>} />
          <Route path="/student/proyectos" element={<EstudianteRoute><MyProjects /></EstudianteRoute>} />
          <Route path="/student/profile" element={<EstudianteRoute><Profile /></EstudianteRoute>} />
          <Route path="/student/register-project" element={<EstudianteRoute><RegisterProject /></EstudianteRoute>} />

          {/* ✅ Profesores - RUTAS PROTEGIDAS */}
          <Route path="/teacher/dashboard" element={<DocenteRoute><TeacherDashboard /></DocenteRoute>} />
          <Route path="/teacher/proyectos" element={<DocenteRoute><Studentprojects /></DocenteRoute>} />
          <Route path="/teacher/profile" element={<DocenteRoute><TeacherProfile /></DocenteRoute>} />

          {/* ✅ Administrador - RUTAS PROTEGIDAS */}
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


          {/* ✅ Egresados - RUTAS PROTEGIDAS */}
          <Route path="/graduate/dashboard" element={<EgresadoRoute><GraduateDashboard /></EgresadoRoute>} />
          <Route path="/graduate/profile" element={<EgresadoRoute><GraduateProfile /></EgresadoRoute>} />
          <Route path="/graduate/proyectos" element={<EgresadoRoute><GraduateProjects /></EgresadoRoute>} />

          {/* ✅ Invitados - RUTAS PROTEGIDAS */}
          <Route path="/guest/dashboard" element={<InvitadoRoute><GuestDashboard /></InvitadoRoute>} />
          <Route path="/guest/profile" element={<InvitadoRoute><GuestProfile /></InvitadoRoute>} />
          <Route path="/guest/proyectos" element={<InvitadoRoute><GuestProjects /></InvitadoRoute>} />

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
