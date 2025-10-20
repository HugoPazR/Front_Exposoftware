import React, { useState } from "react";
import { Link } from "react-router-dom";
import logo from "../../assets/Logo-unicesar.png";

const MOCK_PROJECTS = [
  {
    id: 1,
    title: "Sistema de Gestión Empresarial con Blockchain",
    participants: ["Juan Carlos Pérez", "María González", "Roberto Silva"],
    company: "Tech Solutions S.A.S",
    status: "Aprobado",
    description: "Desarrollo de un sistema de gestión empresarial descentralizado utilizando tecnología blockchain para garantizar trazabilidad, seguridad y transparencia en procesos de auditoría y cadena de suministro. Implementado en producción en 3 empresas del sector manufacturero.",
    activityType: "Ponencia",
    line: "Ciencias de la Computación",
    subline: "Sistemas Distribuidos",
    area: "Tecnologías de la información",
    poster: "poster_blockchain_empresarial.pdf",
    slides: "presentacion_blockchain_empresarial.pptx",
    industry: "Manufactura",
    impact: "Reducción del 40% en tiempos de auditoría",
  },
  {
    id: 2,
    title: "Plataforma de Analítica Predictiva con Machine Learning",
    participants: ["Juan Carlos Pérez", "Andrea Martínez"],
    company: "Tech Solutions S.A.S",
    status: "En Revisión",
    description: "Plataforma SaaS para análisis predictivo de ventas y comportamiento de clientes utilizando algoritmos de machine learning. Incluye dashboards interactivos y API REST para integración con sistemas existentes. Actualmente utilizada por más de 50 clientes en sector retail.",
    activityType: "Conferencia",
    line: "Inteligencia Artificial",
    subline: "Aprendizaje Automático",
    area: "Inteligencia artificial",
    poster: "poster_ml_analytics.pdf",
    slides: "presentacion_ml_analytics.pptx",
    industry: "Retail y E-commerce",
    impact: "Incremento del 25% en precisión de pronósticos de venta",
  },
];

export default function GraduateProjects() {
  const [selectedProject, setSelectedProject] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const handleViewDetails = (project) => {
    setSelectedProject(project);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedProject(null);
  };

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
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <span className="text-green-600 font-bold text-lg">EG</span>
                </div>
              </div>

              <button className="text-sm font-medium text-red-600 hover:text-red-700 transition-colors flex items-center gap-2">
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
                <Link to="/graduate/dashboard" className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50">
                  <i className="pi pi-home text-base"></i>
                  Dashboard
                </Link>
                <Link to="/graduate/proyectos" className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium bg-green-50 text-green-700">
                  <i className="pi pi-briefcase text-base"></i>
                  Mis Proyectos
                </Link>
                <Link to="/graduate/profile" className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50">
                  <i className="pi pi-cog text-base"></i>
                  Configuración
                </Link>
              </nav>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 p-4 mt-4">
              <div className="text-center">
                <h3 className="font-semibold text-gray-900">Juan Carlos Pérez</h3>
                <p className="text-sm text-gray-500">Egresado UPC</p>
                <p className="text-xs text-gray-400 mt-1">Promoción 2023</p>
              </div>
            </div>
          </aside>

          {/* Main content */}
          <main className="lg:col-span-3">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Mis Proyectos Profesionales</h2>
            <p className="text-gray-600 mb-6">Gestiona tus proyectos profesionales postulados al evento Exposoftware. Comparte tu experiencia en la industria y contribuye al desarrollo académico de nuevas generaciones.</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {MOCK_PROJECTS.map(p => (
                <div key={p.id} className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg transition-shadow">
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="text-lg font-semibold text-gray-900 flex-1">{p.title}</h3>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap ml-2 ${
                      p.status === "Aprobado" 
                        ? "bg-green-100 text-green-700"
                        : p.status === "En Revisión"
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-red-100 text-red-700"
                    }`}>
                      {p.status}
                    </span>
                  </div>
                  
                  <div className="text-sm text-gray-600 mb-4 space-y-2">
                    <div className="flex items-center gap-2">
                      <i className="pi pi-briefcase text-green-600"></i>
                      <span className="font-medium">{p.company}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <i className="pi pi-tag text-green-600"></i>
                      <span>{p.activityType}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <i className="pi pi-users text-green-600"></i>
                      <span>{p.participants.length} participante{p.participants.length > 1 ? 's' : ''}</span>
                    </div>
                  </div>

                  <p className="text-sm text-gray-600 mb-4 line-clamp-3">{p.description}</p>

                  {p.impact && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
                      <p className="text-xs font-semibold text-blue-900 mb-1">Impacto Industrial</p>
                      <p className="text-xs text-blue-700">{p.impact}</p>
                    </div>
                  )}

                  <div className="mt-4 flex items-center justify-end">
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
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center justify-center hover:border-green-500 transition-colors">
                <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mb-4">
                  <i className="pi pi-plus text-3xl text-green-600"></i>
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">Postular Nuevo Proyecto</h4>
                <p className="text-gray-500 text-sm mb-4 text-center">Comparte tu experiencia profesional con la comunidad académica.</p>
                <Link to="/student/register-project" className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors">
                  Postular Proyecto
                </Link>
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
              <h3 className="text-xl font-bold text-gray-900">Detalles del Proyecto Profesional</h3>
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
                  <div className="flex flex-wrap items-center gap-3 text-sm text-gray-600">
                    <span className="flex items-center gap-1">
                      <i className="pi pi-briefcase"></i>
                      {selectedProject.company}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <i className="pi pi-tag"></i>
                      {selectedProject.activityType}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <i className="pi pi-building"></i>
                      {selectedProject.industry}
                    </span>
                  </div>
                </div>
                <span className={`px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap ${
                  selectedProject.status === "Aprobado" 
                    ? "bg-green-100 text-green-800"
                    : selectedProject.status === "En Revisión"
                    ? "bg-yellow-100 text-yellow-800"
                    : "bg-red-100 text-red-800"
                }`}>
                  {selectedProject.status}
                </span>
              </div>

              {/* Descripción */}
              <div>
                <h5 className="text-sm font-semibold text-gray-900 mb-2 flex items-center gap-2">
                  <i className="pi pi-align-left text-green-600"></i>
                  Descripción del Proyecto
                </h5>
                <p className="text-sm text-gray-700 leading-relaxed bg-gray-50 p-4 rounded-lg">
                  {selectedProject.description}
                </p>
              </div>

              {/* Impacto Industrial */}
              {selectedProject.impact && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h5 className="text-sm font-semibold text-blue-900 mb-2 flex items-center gap-2">
                    <i className="pi pi-chart-line"></i>
                    Impacto en la Industria
                  </h5>
                  <p className="text-sm text-blue-800">{selectedProject.impact}</p>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Información del Proyecto */}
                <div className="space-y-4">
                  <h5 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <i className="pi pi-info-circle text-green-600"></i>
                    Información del Proyecto
                  </h5>

                  <div className="bg-gray-50 p-4 rounded-lg space-y-3">
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Empresa</p>
                      <p className="text-sm font-medium text-gray-900">{selectedProject.company}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Tipo de Actividad</p>
                      <p className="text-sm font-medium text-gray-900">{selectedProject.activityType}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Sector Industrial</p>
                      <p className="text-sm font-medium text-gray-900">{selectedProject.industry}</p>
                    </div>
                  </div>
                </div>

                {/* Líneas de Investigación */}
                <div className="space-y-4">
                  <h5 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <i className="pi pi-sitemap text-green-600"></i>
                    Clasificación Técnica
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

              {/* Equipo de Trabajo */}
              <div>
                <h5 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <i className="pi pi-users text-green-600"></i>
                  Equipo de Trabajo
                </h5>
                <div className="flex flex-wrap gap-2">
                  {selectedProject.participants.map((participant, idx) => (
                    <span 
                      key={idx}
                      className="inline-flex items-center gap-2 bg-green-50 text-green-800 px-3 py-2 rounded-full text-sm font-medium"
                    >
                      <div className="w-6 h-6 bg-green-200 rounded-full flex items-center justify-center">
                        <span className="text-green-800 font-bold text-xs">
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
                  <i className="pi pi-paperclip text-green-600"></i>
                  Material de Presentación
                </h5>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="border border-gray-200 rounded-lg p-3 flex items-center gap-3 hover:bg-gray-50 transition-colors cursor-pointer">
                    <div className="w-10 h-10 bg-red-100 rounded flex items-center justify-center flex-shrink-0">
                      <i className="pi pi-file-pdf text-red-600 text-lg"></i>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">{selectedProject.poster}</p>
                      <p className="text-xs text-gray-500">Poster técnico</p>
                    </div>
                    <button className="text-green-600 hover:text-green-700">
                      <i className="pi pi-download"></i>
                    </button>
                  </div>

                  <div className="border border-gray-200 rounded-lg p-3 flex items-center gap-3 hover:bg-gray-50 transition-colors cursor-pointer">
                    <div className="w-10 h-10 bg-orange-100 rounded flex items-center justify-center flex-shrink-0">
                      <i className="pi pi-file text-orange-600 text-lg"></i>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">{selectedProject.slides}</p>
                      <p className="text-xs text-gray-500">Presentación ejecutiva</p>
                    </div>
                    <button className="text-green-600 hover:text-green-700">
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
              <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                Editar Proyecto
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
