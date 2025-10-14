import React from "react";
import { Link } from "react-router-dom";
import logo from "../../assets/Logo-unicesar.png";

const MOCK_PROJECTS = [
  {
    id: 1,
    title: "Sistema de Gestión de Bibliotecas con IA",
    participants: ["Cristian Guzman", "Pedro Lopez"],
    group: "Grupo A / Programación Avanzada",
    status: "Aprobado",
  },
  {
    id: 2,
    title: "App Móvil para Gestión de Turnos",
    participants: ["Cristian Guzman", "Karen Martinez"],
    group: "Grupo B / Programación Móvil",
    status: "Aprobado",
  },
];

export default function MyProjects() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header (same as dashboard) */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <img src={logo} alt="Logo Unicesar" className="w-10 h-auto" />
              <div>
                <h1 className="text-lg font-bold text-gray-900">Expo-software 2025</h1>
                <p className="text-xs text-gray-500">Universidad Popular del Cesar</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <Link to="/student/dashboard" className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-800 transition-colors">
                Registrar Asistencia
              </Link>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <span className="text-green-600 font-bold text-lg">CG</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <aside className="lg:col-span-1">
            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <nav className="space-y-1">
                <Link to="/student/dashboard" className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50">
                  <i className="pi pi-home text-base"></i>
                  Dashboard
                </Link>
                <Link to="/student/proyectos" className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium bg-green-50 text-green-700">
                  <i className="pi pi-book text-base"></i>
                  Mis Proyectos
                </Link>
                <Link to="/student/profile" className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50">
                  <i className="pi pi-cog text-base"></i>
                  Configuración
                </Link>
              </nav>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 p-4 mt-4">
              <div className="text-center">
                <h3 className="font-semibold text-gray-900">Cristian Guzman</h3>
                <p className="text-sm text-gray-500">Estudiante</p>
              </div>
            </div>
          </aside>

          {/* Main content */}
          <main className="lg:col-span-3">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Mis Proyectos</h2>
            <p className="text-gray-600 mb-6">Aquí puedes gestionar todos los proyectos académicos que has postulado o en los que participas. Revisa su estado, edita los detalles o visualiza la información completa de cada uno.</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {MOCK_PROJECTS.map(p => (
                <div key={p.id} className="bg-white rounded-lg border border-gray-200 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">{p.title}</h3>
                  <div className="text-sm text-gray-600 mb-3">
                    <div className="flex items-center gap-2 mb-1"><i className="pi pi-user"></i><span>{p.participants.join(', ')}</span></div>
                    <div className="flex items-center gap-2"><i className="pi pi-book"></i><span>{p.group}</span></div>
                  </div>
                  <div className="mt-4 flex items-center justify-between">
                    <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-semibold">{p.status}</span>
                    <button className="border border-gray-200 px-4 py-2 rounded-lg text-sm flex items-center gap-2"><i className="pi pi-eye"></i> Ver detalles</button>
                  </div>
                </div>
              ))}

              {/* Postular nuevo proyecto card */}
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center justify-center">
                <div className="text-4xl text-gray-400 mb-4">+</div>
                <h4 className="font-semibold text-gray-900 mb-2">Postular Nuevo Proyecto</h4>
                <p className="text-gray-500 text-sm mb-4 text-center">Haga clic para iniciar una nueva postulación.</p>
                <Link to="/student/register-project" className="bg-green-600 text-white px-4 py-2 rounded-lg">Postular</Link>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
