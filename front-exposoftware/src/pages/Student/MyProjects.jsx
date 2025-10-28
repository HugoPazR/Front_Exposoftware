import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import logo from "../../assets/Logo-unicesar.png";

const MOCK_PROJECTS = [
  {
    id: 1,
    title: "Sistema de Gestión de Bibliotecas con IA",
    participants: ["Cristian Guzman", "Pedro Lopez", "Ana García"],
    group: "Grupo A / Programación Avanzada",
    status: "Aprobado",
    description: "Sistema inteligente para gestión automatizada de bibliotecas universitarias utilizando técnicas de IA para recomendaciones personalizadas y búsqueda avanzada.",
    subject: "Programación Avanzada",
    groupName: "Grupo A",
    professor: "Dr. Pérez",
    line: "Inteligencia Artificial",
    subline: "Aprendizaje Automático",
    area: "Ciencias de la computación",
    poster: "poster_biblioteca_ia.jpg",
    slides: "presentacion_biblioteca_ia.pptx",
  },
  {
    id: 2,
    title: "App Móvil para Gestión de Turnos",
    participants: ["Cristian Guzman", "Karen Martinez"],
    group: "Grupo B / Programación Móvil",
    status: "Aprobado",
    description: "Aplicación móvil multiplataforma para la gestión eficiente de turnos en diferentes tipos de establecimientos, con sistema de notificaciones en tiempo real.",
    subject: "Programación Móvil",
    groupName: "Grupo B",
    professor: "Ing. Ruiz",
    line: "Ingeniería de Software",
    subline: "Metodologías Ágiles",
    area: "Ingeniería de software",
    poster: "poster_turnos.jpg",
    slides: "presentacion_turnos.pptx",
  },
];

export default function MyProjects() {
  const [selectedProject, setSelectedProject] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const { user, getFullName, getInitials, logout, loading } = useAuth();
  const navigate = useNavigate();

  // Handler para cerrar sesión
  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleViewDetails = (project) => {
    setSelectedProject(project);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedProject(null);
  };

  // Mostrar loading mientras se cargan los datos del usuario
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 rounded-full animate-spin mx-auto mb-4" style={{ borderColor: 'rgba(12, 183, 106, 1)', borderTopColor: 'transparent' }}></div>
          <p className="text-gray-600">Cargando...</p>
        </div>
      </div>
    );
  }

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

            {/* Action button then user quick badge (avatar + name) */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: 'rgba(12, 183, 106, 0.1)' }}>
                  <span className="font-bold text-lg" style={{ color: 'rgba(12, 183, 106, 1)' }}>{getInitials()}</span>
                </div>
                <div className="hidden md:block">
                  <p className="text-sm font-medium text-gray-900">{getFullName()}</p>
                  <p className="text-xs text-gray-500 capitalize">{user?.rol || 'Estudiante'}</p>
                  {user?.codigo_programa && (
                    <p className="text-xs text-gray-400">Código: {user.codigo_programa}</p>
                  )}
                </div>
              </div>

              <button 
                onClick={handleLogout}
                className="text-sm font-medium text-red-600 hover:text-red-700 transition-colors flex items-center gap-2"
              >
                <i className="pi pi-sign-out"></i>
                <span className="hidden sm:inline">Cerrar Sesión</span>
              </button>
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
                <Link to="/student/proyectos" className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium" style={{ backgroundColor: 'rgba(12, 183, 106, 0.1)', color: 'rgba(12, 183, 106, 1)' }}>
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
                <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3" style={{ backgroundColor: 'rgba(12, 183, 106, 0.1)' }}>
                  <span className="font-bold text-2xl" style={{ color: 'rgba(12, 183, 106, 1)' }}>{getInitials()}</span>
                </div>
                <h3 className="font-semibold text-gray-900">{getFullName()}</h3>
                <p className="text-sm text-gray-500 capitalize">{user?.rol || 'Estudiante'}</p>
                {user?.codigo_programa && (
                  <p className="text-xs text-gray-400 mt-1">Código: {user.codigo_programa}</p>
                )}
                {user?.semestre && (
                  <p className="text-xs text-gray-400">Semestre: {user.semestre}</p>
                )}
                {user?.correo && (
                  <p className="text-xs text-gray-400 mt-2 truncate" title={user.correo}>
                    {user.correo}
                  </p>
                )}
              </div>
            </div>
          </aside>

          {/* Main content */}
          <main className="lg:col-span-3">
            {/* Información del estudiante */}
            <div className="border rounded-lg p-4 mb-6" style={{ background: 'linear-gradient(to right, rgba(12, 183, 106, 0.05), rgba(12, 183, 106, 0.1))', borderColor: 'rgba(12, 183, 106, 0.3)' }}>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: 'rgba(12, 183, 106, 1)' }}>
                  <span className="text-white font-bold text-xl">{getInitials()}</span>
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900">{getFullName()}</h3>
                  <div className="flex items-center gap-4 text-sm text-gray-600 mt-1">
                    <span className="flex items-center gap-1">
                      <i className="pi pi-id-card"></i>
                      {user?.identificacion}
                    </span>
                    <span className="flex items-center gap-1">
                      <i className="pi pi-book"></i>
                      Semestre {user?.semestre}
                    </span>
                    <span className="flex items-center gap-1">
                      <i className="pi pi-tag"></i>
                      {user?.codigo_programa}
                    </span>
                  </div>
                </div>
                <div className="hidden sm:block">
                  <span className="inline-flex items-center gap-2 text-white px-4 py-2 rounded-full text-sm font-medium" style={{ backgroundColor: 'rgba(12, 183, 106, 1)' }}>
                    <i className="pi pi-check-circle"></i>
                    Estudiante Activo
                  </span>
                </div>
              </div>
            </div>

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
                    <span className="px-3 py-1 rounded-full text-sm font-semibold" style={{ backgroundColor: 'rgba(12, 183, 106, 0.1)', color: 'rgba(12, 183, 106, 1)' }}>{p.status}</span>
                    <button 
                      onClick={() => handleViewDetails(p)}
                      className="border border-gray-200 px-4 py-2 rounded-lg text-sm flex items-center gap-2 hover:bg-gray-50 transition-colors"
                    >
                      <i className="pi pi-eye"></i> Ver detalles
                    </button>
                  </div>
                </div>
              ))}

              {/* Postular nuevo proyecto card */}
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center justify-center">
                <div className="text-4xl text-gray-400 mb-4">+</div>
                <h4 className="font-semibold text-gray-900 mb-2">Postular Nuevo Proyecto</h4>
                <p className="text-gray-500 text-sm mb-4 text-center">Haga clic para iniciar una nueva postulación.</p>
                <Link to="/student/register-project" className="text-white px-4 py-2 rounded-lg" style={{ backgroundColor: 'rgba(12, 183, 106, 1)' }}>Postular</Link>
              </div>
            </div>
          </main>
        </div>
      </div>

      {/* Modal de Detalles del Proyecto */}
      {showModal && selectedProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4 overflow-auto">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-auto">
            {/* Header del modal */}
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between z-10">
              <h3 className="text-xl font-bold text-gray-900">Detalles del Proyecto</h3>
              <button 
                onClick={closeModal}
                className="text-gray-500 hover:text-gray-700 transition-colors"
              >
                <i className="pi pi-times text-xl"></i>
              </button>
            </div>

            {/* Contenido del modal */}
            <div className="p-6 space-y-6">
              {/* Título y Estado */}
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <h4 className="text-2xl font-bold text-gray-900 mb-2">{selectedProject.title}</h4>
                  <div className="flex items-center gap-3 text-sm text-gray-600">
                    <span className="flex items-center gap-1">
                      <i className="pi pi-user"></i>
                      {selectedProject.participants[0]}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <i className="pi pi-book"></i>
                      {selectedProject.group}
                    </span>
                  </div>
                </div>
                <span className={`px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap ${
                  selectedProject.status === "Aprobado" 
                    ? "bg-green-100 text-green-800"
                    : selectedProject.status === "Pendiente"
                    ? "bg-yellow-100 text-yellow-800"
                    : "bg-red-100 text-red-800"
                }`}>
                  {selectedProject.status}
                </span>
              </div>

              {/* Descripción */}
              <div>
                <h5 className="text-sm font-semibold text-gray-900 mb-2 flex items-center gap-2">
                  <i className="pi pi-align-left" style={{ color: 'rgba(12, 183, 106, 1)' }}></i>
                  Descripción del Proyecto
                </h5>
                <p className="text-sm text-gray-700 leading-relaxed bg-gray-50 p-4 rounded-lg">
                  {selectedProject.description}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Información del Proyecto */}
                <div className="space-y-4">
                  <h5 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <i className="pi pi-info-circle" style={{ color: 'rgba(12, 183, 106, 1)' }}></i>
                    Información del Proyecto
                  </h5>

                  <div className="bg-gray-50 p-4 rounded-lg space-y-3">
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Materia Asignada</p>
                      <p className="text-sm font-medium text-gray-900">{selectedProject.subject}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Grupo</p>
                      <p className="text-sm font-medium text-gray-900">{selectedProject.groupName}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Profesor</p>
                      <p className="text-sm font-medium text-gray-900">{selectedProject.professor}</p>
                    </div>
                  </div>
                </div>

                {/* Líneas de Investigación */}
                <div className="space-y-4">
                  <h5 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <i className="pi pi-sitemap" style={{ color: 'rgba(12, 183, 106, 1)' }}></i>
                    Líneas de Investigación
                  </h5>

                  <div className="bg-gray-50 p-4 rounded-lg space-y-3">
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Línea de Investigación</p>
                      <p className="text-sm font-medium text-gray-900">{selectedProject.line}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Sublínea</p>
                      <p className="text-sm font-medium text-gray-900">{selectedProject.subline}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Área Temática</p>
                      <p className="text-sm font-medium text-gray-900">{selectedProject.area}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Participantes */}
              <div>
                <h5 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <i className="pi pi-users" style={{ color: 'rgba(12, 183, 106, 1)' }}></i>
                  Participantes
                </h5>
                <div className="flex flex-wrap gap-2">
                  {selectedProject.participants.map((participant, idx) => (
                    <span 
                      key={idx}
                      className="inline-flex items-center gap-2 px-3 py-2 rounded-full text-sm font-medium"
                      style={{ backgroundColor: 'rgba(12, 183, 106, 0.1)', color: 'rgba(12, 183, 106, 1)' }}
                    >
                      <div className="w-6 h-6 rounded-full flex items-center justify-center" style={{ backgroundColor: 'rgba(12, 183, 106, 0.3)' }}>
                        <span className="font-bold text-xs" style={{ color: 'rgba(12, 183, 106, 1)' }}>
                          {participant.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                      {participant}
                    </span>
                  ))}
                </div>
              </div>

              {/* Archivos Adjuntos */}
              <div>
                <h5 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <i className="pi pi-paperclip" style={{ color: 'rgba(12, 183, 106, 1)' }}></i>
                  Archivos Adjuntos
                </h5>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="border border-gray-200 rounded-lg p-3 flex items-center gap-3 hover:bg-gray-50 transition-colors">
                    <div className="w-10 h-10 bg-blue-100 rounded flex items-center justify-center flex-shrink-0">
                      <i className="pi pi-image text-blue-600 text-lg"></i>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">{selectedProject.poster}</p>
                      <p className="text-xs text-gray-500">Poster del proyecto</p>
                    </div>
                    <button className="text-green-600 hover:text-green-700">
                      <i className="pi pi-download"></i>
                    </button>
                  </div>

                  <div className="border border-gray-200 rounded-lg p-3 flex items-center gap-3 hover:bg-gray-50 transition-colors">
                    <div className="w-10 h-10 bg-orange-100 rounded flex items-center justify-center flex-shrink-0">
                      <i className="pi pi-file text-orange-600 text-lg"></i>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">{selectedProject.slides}</p>
                      <p className="text-xs text-gray-500">Presentación</p>
                    </div>
                    <button style={{ color: 'rgba(12, 183, 106, 1)' }} className="hover:opacity-80">
                      <i className="pi pi-download"></i>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer del modal */}
            <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 px-6 py-4 flex items-center justify-end gap-3">
              <button 
                onClick={closeModal}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
              >
                Cerrar
              </button>
              <button className="px-4 py-2 text-white rounded-lg hover:opacity-90 transition-opacity" style={{ backgroundColor: 'rgba(12, 183, 106, 1)' }}>
                Editar Proyecto
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
