import { useState } from "react";
import { Link } from "react-router-dom";
import logo from "../../assets/Logo-unicesar.png";

// Mock data para proyectos estudiantiles
const MOCK_PROJECTS = [
  {
    id: 1,
    title: "Sistema de Gestión de Bibliotecas con IA",
    student: "Sofía Martínez",
    group: "Grupo A / Programación Avanzada",
    status: "Aprobado",
    description: "Sistema inteligente para gestión automatizada de bibliotecas universitarias utilizando técnicas de IA para recomendaciones personalizadas y búsqueda avanzada.",
    participants: ["Sofía Martínez", "Pedro López", "Ana García"],
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
    title: "Plataforma de E-learning Adaptativo",
    student: "Juan Pérez",
    group: "Grupo B / Bases de Datos",
    status: "Pendiente",
    description: "Plataforma educativa que se adapta al ritmo de aprendizaje de cada estudiante mediante análisis de datos y personalización de contenidos.",
    participants: ["Juan Pérez", "María Rodríguez"],
    subject: "Bases de Datos",
    groupName: "Grupo B",
    professor: "Dra. Ramírez",
    line: "Ingeniería de Software",
    subline: "Metodologías Ágiles",
    area: "Tecnologías de la información",
    poster: "poster_elearning.jpg",
    slides: "presentacion_elearning.pptx",
  },
  {
    id: 3,
    title: "Análisis de Sentimientos en Redes Sociales",
    student: "María García",
    group: "Grupo A / Inteligencia Artificial",
    status: "Aprobado",
    description: "Herramienta de análisis de sentimientos en tiempo real para redes sociales usando procesamiento de lenguaje natural.",
    participants: ["María García", "Carlos Méndez", "Laura Torres"],
    subject: "Inteligencia Artificial",
    groupName: "Grupo A",
    professor: "Dr. Salas",
    line: "Inteligencia Artificial",
    subline: "Visión por Computador",
    area: "Inteligencia artificial",
    poster: "poster_sentimientos.jpg",
    slides: "presentacion_sentimientos.pptx",
  },
  {
    id: 4,
    title: "Desarrollo de App Móvil para Control de Gastos",
    student: "Carlos Ruiz",
    group: "Grupo C / Programación Avanzada",
    status: "Rechazado",
    description: "Aplicación móvil multiplataforma para gestión personal de finanzas con reportes y análisis de gastos.",
    participants: ["Carlos Ruiz", "Diana Vargas"],
    subject: "Programación Avanzada",
    groupName: "Grupo C",
    professor: "Ing. Morales",
    line: "Ingeniería de Software",
    subline: "Pruebas y Calidad",
    area: "Ingeniería de software",
    poster: "poster_gastos.jpg",
    slides: "presentacion_gastos.pptx",
  },
  {
    id: 5,
    title: "Optimización de Rutas con Algoritmos Genéticos",
    student: "Laura Fernández",
    group: "Grupo B / Inteligencia Artificial",
    status: "Aprobado",
    description: "Sistema de optimización de rutas logísticas mediante algoritmos genéticos para reducir costos de transporte.",
    participants: ["Laura Fernández", "Jorge Castro"],
    subject: "Inteligencia Artificial",
    groupName: "Grupo B",
    professor: "Dr. Torres",
    line: "Ciencias de la Computación",
    subline: "Algoritmos y Complejidad",
    area: "Ciencias de la computación",
    poster: "poster_rutas.jpg",
    slides: "presentacion_rutas.pptx",
  },
  {
    id: 6,
    title: "Visualización de Datos para la Bolsa de Valores",
    student: "Pedro Sánchez",
    group: "Grupo C / Bases de Datos",
    status: "Pendiente",
    description: "Dashboard interactivo para visualización en tiempo real de datos del mercado bursátil con análisis predictivo.",
    participants: ["Pedro Sánchez", "Elena Martínez", "Roberto Silva"],
    subject: "Bases de Datos",
    groupName: "Grupo C",
    professor: "Dra. Gómez",
    line: "Ciencias de la Computación",
    subline: "Sistemas Distribuidos",
    area: "Tecnologías de la información",
    poster: "poster_bolsa.jpg",
    slides: "presentacion_bolsa.pptx",
  },
];

export default function StudentProjects() {
  const [viewMode, setViewMode] = useState("grid"); // "grid" o "table"
  const [selectedGroup, setSelectedGroup] = useState("Filtrar por grupo");
  const [selectedMateria, setSelectedMateria] = useState("Filtrar por materia");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProject, setSelectedProject] = useState(null);
  const [showModal, setShowModal] = useState(false);

  // Filtrar proyectos según búsqueda
  const filteredProjects = MOCK_PROJECTS.filter(project => 
    project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    project.student.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
      {/* Header - mismo que dashboard */}
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
              <button className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-800 transition-colors">
                Registrar Asistencia
              </button>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <span className="text-green-600 font-bold text-lg">M</span>
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
                <Link
                  to="/teacher/dashboard"
                  className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  <i className="pi pi-home text-base"></i>
                  Dashboard
                </Link>
                <Link
                  to="/teacher/proyectos"
                  className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium bg-green-50 text-green-700"
                >
                  <i className="pi pi-book text-base"></i>
                  Proyectos Estudiantiles
                </Link>
                <Link
                  to="/teacher/profile"
                  className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  <i className="pi pi-cog text-base"></i>
                  Configuración
                </Link>
              </nav>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 p-4 mt-4">
              <div className="text-center">
                <h3 className="font-semibold text-gray-900">María</h3>
                <p className="text-sm text-gray-500">Profesora</p>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <main className="lg:col-span-3">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Proyectos de Estudiantes</h2>
              <p className="text-sm text-gray-600">Gestión y visualización de todos los proyectos de los estudiantes.</p>
            </div>

            {/* Barra de búsqueda y controles */}
            <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
              <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                {/* Búsqueda */}
                <div className="relative flex-1 w-full md:w-auto">
                  <i className="pi pi-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
                  <input
                    type="text"
                    placeholder="Buscar por nombre, estudiante, o ID..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery("")}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      <i className="pi pi-times"></i>
                    </button>
                  )}
                </div>

                {/* Filtros */}
                <div className="flex gap-3 items-center w-full md:w-auto">
                  <select 
                    value={selectedGroup}
                    onChange={(e) => setSelectedGroup(e.target.value)}
                    className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                  >
                    <option value="Filtrar por grupo">Filtrar por grupo</option>
                    <option value="Grupo A">Grupo A</option>
                    <option value="Grupo B">Grupo B</option>
                    <option value="Grupo C">Grupo C</option>
                  </select>

                  <select 
                    value={selectedMateria}
                    onChange={(e) => setSelectedMateria(e.target.value)}
                    className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                  >
                    <option value="Filtrar por materia">Filtrar por materia</option>
                    <option value="Programación Avanzada">Programación Avanzada</option>
                    <option value="Bases de Datos">Bases de Datos</option>
                    <option value="Inteligencia Artificial">Inteligencia Artificial</option>
                  </select>
                </div>
              </div>

              {/* Controles de vista */}
              <div className="flex items-center gap-2 mt-4 pt-4 border-t border-gray-200">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    viewMode === "grid"
                      ? "bg-green-600 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  <i className="pi pi-th-large mr-2"></i>
                  Tarjetas
                </button>
                <button
                  onClick={() => setViewMode("table")}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    viewMode === "table"
                      ? "bg-green-600 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  <i className="pi pi-list mr-2"></i>
                  Tabla
                </button>
              </div>
            </div>

            {/* Vista de Tarjetas (Grid) */}
            {viewMode === "grid" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredProjects.map(project => (
                  <div key={project.id} className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow">
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">{project.title}</h3>
                    
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <i className="pi pi-user"></i>
                        <span>{project.student}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <i className="pi pi-book"></i>
                        <span>{project.group}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        project.status === "Aprobado" 
                          ? "bg-green-100 text-green-800"
                          : project.status === "Pendiente"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-red-100 text-red-800"
                      }`}>
                        {project.status}
                      </span>
                      <button 
                        onClick={() => handleViewDetails(project)}
                        className="flex items-center gap-2 text-sm text-gray-700 hover:text-green-600 transition-colors"
                      >
                        <i className="pi pi-eye"></i>
                        Ver detalles
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Vista de Tabla */}
            {viewMode === "table" && (
              <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Título del Proyecto</th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Estudiante</th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Grupo/Materia</th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Estado</th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredProjects.map((project) => (
                        <tr key={project.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                          <td className="py-3 px-4">
                            <span className="text-sm font-medium text-gray-900">{project.title}</span>
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-2">
                              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                                <span className="text-green-600 font-bold text-xs">
                                  {project.student.split(' ').map(n => n[0]).join('')}
                                </span>
                              </div>
                              <span className="text-sm text-gray-900">{project.student}</span>
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <span className="text-sm text-gray-600">{project.group}</span>
                          </td>
                          <td className="py-3 px-4">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              project.status === "Aprobado" 
                                ? "bg-green-100 text-green-800"
                                : project.status === "Pendiente"
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-red-100 text-red-800"
                            }`}>
                              {project.status}
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            <button 
                              onClick={() => handleViewDetails(project)}
                              className="text-sm text-gray-700 hover:text-green-600 transition-colors"
                            >
                              <i className="pi pi-eye mr-1"></i>
                              Ver detalles
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Mensaje si no hay resultados */}
            {filteredProjects.length === 0 && (
              <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <i className="pi pi-search text-4xl text-gray-400"></i>
                </div>
                <p className="text-gray-600 mb-2">No se encontraron proyectos</p>
                <p className="text-sm text-gray-500">Intenta con otros términos de búsqueda</p>
              </div>
            )}
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
                      {selectedProject.student}
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
                  <i className="pi pi-align-left text-green-600"></i>
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
                    <i className="pi pi-info-circle text-green-600"></i>
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
                    <i className="pi pi-sitemap text-green-600"></i>
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
                  <i className="pi pi-users text-green-600"></i>
                  Participantes
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
                Editar Estado
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
