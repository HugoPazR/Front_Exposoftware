import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import logo from "../../assets/Logo-unicesar.png";

const MOCK_PROJECTS = [
  {
    id: 1,
    title: "Sistema de Gestión de Bibliotecas con IA",
    participants: ["Cristian Guzman", "Pedro Lopez", "Ana García"],
    subject: "Programación Avanzada",
    group: "Grupo A",
    status: "Disponible",
    description: "Sistema inteligente para gestión automatizada de bibliotecas universitarias utilizando técnicas de IA para recomendaciones personalizadas y búsqueda avanzada.",
    professor: "Dr. Carlos Pérez",
    line: "Inteligencia Artificial",
    subline: "Aprendizaje Automático",
    posterImage: "https://via.placeholder.com/800x1200/10b981/ffffff?text=Poster+Biblioteca+IA",
    presentationDate: "25 Nov 2025, 10:00 AM",
    location: "Auditorio 3",
  },
  {
    id: 2,
    title: "App Móvil para Gestión de Turnos",
    participants: ["Karen Martinez", "Luis Rodríguez"],
    subject: "Programación Móvil",
    group: "Grupo B",
    status: "Disponible",
    description: "Aplicación móvil multiplataforma para la gestión eficiente de turnos en diferentes tipos de establecimientos, con sistema de notificaciones en tiempo real.",
    professor: "Ing. María Ruiz",
    line: "Ingeniería de Software",
    subline: "Metodologías Ágiles",
    posterImage: "https://via.placeholder.com/800x1200/3b82f6/ffffff?text=Poster+App+Turnos",
    presentationDate: "25 Nov 2025, 2:00 PM",
    location: "Sala 201",
  },
  {
    id: 3,
    title: "Plataforma de E-Learning con Gamificación",
    participants: ["Andrea Silva", "Jorge Morales", "Diana Torres"],
    subject: "Ingeniería de Software",
    group: "Grupo C",
    status: "Disponible",
    description: "Plataforma educativa innovadora que integra elementos de gamificación para mejorar la experiencia de aprendizaje online, con seguimiento personalizado del progreso del estudiante.",
    professor: "Dr. Roberto Sánchez",
    line: "Tecnologías Educativas",
    subline: "Gamificación y Aprendizaje",
    posterImage: "https://via.placeholder.com/800x1200/8b5cf6/ffffff?text=Poster+E-Learning",
    presentationDate: "26 Nov 2025, 9:00 AM",
    location: "Auditorio 1",
  },
  {
    id: 4,
    title: "Sistema de Monitoreo Ambiental IoT",
    participants: ["Miguel Ángel Castro", "Sofía Ramírez"],
    subject: "Internet de las Cosas",
    group: "Grupo D",
    status: "Disponible",
    description: "Red de sensores IoT para monitoreo en tiempo real de variables ambientales (temperatura, humedad, calidad del aire) con visualización de datos y alertas automáticas.",
    professor: "Ing. Patricia Gómez",
    line: "Internet de las Cosas",
    subline: "Sistemas Embebidos",
    posterImage: "https://via.placeholder.com/800x1200/f59e0b/ffffff?text=Poster+IoT+Ambiental",
    presentationDate: "26 Nov 2025, 3:00 PM",
    location: "Sala 105",
  },
  {
    id: 5,
    title: "Chatbot Asistente Virtual con NLP",
    participants: ["Carolina Díaz", "Andrés Herrera"],
    subject: "Inteligencia Artificial",
    group: "Grupo E",
    status: "Disponible",
    description: "Asistente virtual inteligente basado en procesamiento de lenguaje natural para atención al cliente automatizada, capaz de comprender contexto y mantener conversaciones fluidas.",
    professor: "Dr. Fernando López",
    line: "Inteligencia Artificial",
    subline: "Procesamiento de Lenguaje Natural",
    posterImage: "https://via.placeholder.com/800x1200/ec4899/ffffff?text=Poster+Chatbot+NLP",
    presentationDate: "27 Nov 2025, 11:00 AM",
    location: "Auditorio 2",
  },
  {
    id: 6,
    title: "Sistema de Detección de Fraude Bancario",
    participants: ["Ricardo Vega", "Natalia Ortiz", "Pablo Mendoza"],
    subject: "Ciencia de Datos",
    group: "Grupo F",
    status: "Disponible",
    description: "Sistema de detección de transacciones fraudulentas en tiempo real utilizando algoritmos de machine learning y análisis de patrones de comportamiento.",
    professor: "Dra. Elena Vargas",
    line: "Ciencia de Datos",
    subline: "Análisis Predictivo",
    posterImage: "https://via.placeholder.com/800x1200/06b6d4/ffffff?text=Poster+Deteccion+Fraude",
    presentationDate: "27 Nov 2025, 4:00 PM",
    location: "Sala 302",
  },
];

export default function GuestProjects() {
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  const [selectedProject, setSelectedProject] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("all");
  const [selectedLine, setSelectedLine] = useState("all");
  const [selectedDate, setSelectedDate] = useState("all");

  const handleLogout = () => {
    if (window.confirm("¿Estás seguro de que deseas cerrar sesión?")) {
      logout();
      navigate("/login");
    }
  };

  // Datos del invitado (combinando datos simulados con datos reales del usuario)
  const invitadoData = {
    id_invitado: "INV-2025-001",
    nombres: user?.nombres || user?.primer_nombre || "Invitado",
    apellidos: user?.apellidos || user?.primer_apellido || "Usuario",
    nombre_empresa: "Tech Solutions S.A.S",
    id_sector: "empresarial",
    correo: user?.correo || user?.email || "invitado@example.com",
    rol: user?.rol || "Invitado"
  };

  const handleViewDetails = (project) => {
    setSelectedProject(project);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedProject(null);
  };

  // Obtener listas únicas para filtros
  const subjects = ["all", ...new Set(MOCK_PROJECTS.map(p => p.subject))];
  const lines = ["all", ...new Set(MOCK_PROJECTS.map(p => p.line))];
  const dates = ["all", ...new Set(MOCK_PROJECTS.map(p => p.presentationDate.split(",")[0]))];

  // Filtrar proyectos
  const filteredProjects = MOCK_PROJECTS.filter(project => {
    const matchesSearch = project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    project.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    project.participants.some(p => p.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesSubject = selectedSubject === "all" || project.subject === selectedSubject;
    const matchesLine = selectedLine === "all" || project.line === selectedLine;
    const matchesDate = selectedDate === "all" || project.presentationDate.startsWith(selectedDate);
    
    return matchesSearch && matchesSubject && matchesLine && matchesDate;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
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

            {/* User avatar and info */}
            <div className="flex items-center gap-4">

              <div className="flex items-center gap-3">
                <span className="text-sm text-gray-700 hidden sm:block">
                  {invitadoData.nombres} {invitadoData.apellidos}
                </span>
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <span className="text-green-600 font-bold text-lg">
                    {invitadoData.nombres.charAt(0)}{invitadoData.apellidos.charAt(0)}
                  </span>
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
                <Link
                  to="/guest/dashboard"
                  className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors text-gray-700 hover:bg-gray-50"
                >
                  <i className="pi pi-home text-base"></i>
                  Dashboard
                </Link>
                <Link
                  to="/guest/proyectos"
                  className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors bg-green-50 text-green-700"
                >
                  <i className="pi pi-book text-base"></i>
                  Ver Proyectos
                </Link>
                <Link
                  to="/guest/profile"
                  className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors text-gray-700 hover:bg-gray-50"
                >
                  <i className="pi pi-cog text-base"></i>
                  Configuración
                </Link>
              </nav>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 p-4 mt-4">
              <div className="text-center mb-4">
                <div className="w-16 h-16 bg-gradient-to-br from-green-100 to-green-200 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-green-700 font-bold text-2xl">
                    {invitadoData.nombres.charAt(0)}{invitadoData.apellidos.charAt(0)}
                  </span>
                </div>
                <h3 className="font-semibold text-gray-900">
                  {invitadoData.nombres} {invitadoData.apellidos}
                </h3>
                <p className="text-sm text-green-600 font-medium mt-1 flex items-center justify-center gap-1">
                  <i className="pi pi-user"></i>
                  {invitadoData.rol}
                </p>
              </div>
              
              <div className="border-t border-gray-100 pt-3 space-y-2">
                <div className="flex items-start gap-2">
                  <i className="pi pi-building text-green-600 text-sm mt-0.5"></i>
                  <div className="flex-1">
                    <p className="text-xs text-gray-500">Empresa/Institución</p>
                    <p className="text-sm text-gray-900 font-medium">{invitadoData.nombre_empresa}</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-2">
                  <i className="pi pi-tag text-green-600 text-sm mt-0.5"></i>
                  <div className="flex-1">
                    <p className="text-xs text-gray-500">Sector</p>
                    <p className="text-sm text-gray-900 font-medium capitalize">{invitadoData.id_sector}</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-2">
                  <i className="pi pi-envelope text-green-600 text-sm mt-0.5"></i>
                  <div className="flex-1">
                    <p className="text-xs text-gray-500">Correo</p>
                    <p className="text-sm text-gray-900 font-medium break-all">{invitadoData.correo}</p>
                  </div>
                </div>

                <div className="flex items-start gap-2">
                  <i className="pi pi-id-card text-green-600 text-sm mt-0.5"></i>
                  <div className="flex-1">
                    <p className="text-xs text-gray-500">ID Invitado</p>
                    <p className="text-sm text-gray-900 font-medium">{invitadoData.id_invitado}</p>
                  </div>
                </div>
              </div>
            </div>
          </aside>

          {/* Main content */}
          <main className="lg:col-span-3">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-2">Proyectos Disponibles</h2>
                <p className="text-gray-600">Explora los proyectos que se presentarán en el evento</p>
              </div>
            </div>

            {/* Panel de Filtros */}
            <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <i className="pi pi-filter text-green-600"></i>
                Filtros de Búsqueda
              </h3>

              {/* Barra de búsqueda */}
              <div className="mb-4">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Buscar por título, descripción o participantes..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                  <i className="pi pi-search absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"></i>
                  {searchTerm && (
                    <button
                      onClick={() => setSearchTerm("")}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      <i className="pi pi-times"></i>
                    </button>
                  )}
                </div>
              </div>

              {/* Filtros en grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Filtro por Materia */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <i className="pi pi-book text-green-600 mr-1"></i>
                    Materia
                  </label>
                  <select
                    value={selectedSubject}
                    onChange={(e) => setSelectedSubject(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  >
                    <option value="all">Todas las materias</option>
                    {subjects.filter(s => s !== "all").map(subject => (
                      <option key={subject} value={subject}>{subject}</option>
                    ))}
                  </select>
                </div>

                {/* Filtro por Línea de Investigación */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <i className="pi pi-sitemap text-green-600 mr-1"></i>
                    Línea de Investigación
                  </label>
                  <select
                    value={selectedLine}
                    onChange={(e) => setSelectedLine(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  >
                    <option value="all">Todas las líneas</option>
                    {lines.filter(l => l !== "all").map(line => (
                      <option key={line} value={line}>{line}</option>
                    ))}
                  </select>
                </div>

                {/* Filtro por Fecha */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <i className="pi pi-calendar text-green-600 mr-1"></i>
                    Fecha de Presentación
                  </label>
                  <select
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  >
                    <option value="all">Todas las fechas</option>
                    {dates.filter(d => d !== "all").map(date => (
                      <option key={date} value={date}>{date}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Botón para limpiar filtros */}
              {(searchTerm || selectedSubject !== "all" || selectedLine !== "all" || selectedDate !== "all") && (
                <div className="mt-4 flex items-center justify-between">
                  <p className="text-sm text-gray-600">
                    Mostrando {filteredProjects.length} de {MOCK_PROJECTS.length} proyectos
                  </p>
                  <button
                    onClick={() => {
                      setSearchTerm("");
                      setSelectedSubject("all");
                      setSelectedLine("all");
                      setSelectedDate("all");
                    }}
                    className="text-sm text-green-600 hover:text-green-700 font-medium flex items-center gap-1"
                  >
                    <i className="pi pi-times-circle"></i>
                    Limpiar filtros
                  </button>
                </div>
              )}
            </div>

            {/* Grid de Proyectos */}
            {filteredProjects.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredProjects.map(p => (
                  <div key={p.id} className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg transition-shadow">
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="text-lg font-semibold text-gray-900 flex-1">{p.title}</h3>
                    </div>
                    
                    <div className="text-sm text-gray-600 mb-3 space-y-2">
                      <div className="flex items-center gap-2">
                        <i className="pi pi-book text-green-600"></i>
                        <span>{p.subject} - {p.group}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <i className="pi pi-calendar text-green-600"></i>
                        <span>{p.presentationDate}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <i className="pi pi-map-marker text-green-600"></i>
                        <span>{p.location}</span>
                      </div>
                    </div>

                    <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                      {p.description}
                    </p>

                    <button 
                      onClick={() => handleViewDetails(p)}
                      className="w-full border border-gray-200 px-4 py-2 rounded-lg text-sm font-medium flex items-center justify-center gap-2 hover:bg-gray-50 transition-colors"
                    >
                      <i className="pi pi-eye"></i> Ver detalles
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <i className="pi pi-search text-4xl text-gray-400"></i>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  No se encontraron proyectos
                </h3>
                <p className="text-gray-500 mb-4">
                  No hay proyectos que coincidan con los filtros seleccionados.
                </p>
                <button
                  onClick={() => {
                    setSearchTerm("");
                    setSelectedSubject("all");
                    setSelectedLine("all");
                    setSelectedDate("all");
                  }}
                  className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                >
                  Limpiar filtros
                </button>
              </div>
            )}
          </main>
        </div>
      </div>

      {/* Modal de Detalles del Proyecto */}
      {showModal && selectedProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4 overflow-auto">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-5xl max-h-[90vh] overflow-auto">
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
            <div className="p-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Columna Izquierda - Poster */}
                <div className="order-2 lg:order-1">
                  <h5 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <i className="pi pi-image text-green-600"></i>
                    Poster del Proyecto
                  </h5>
                  <div className="border border-gray-200 rounded-lg overflow-hidden bg-gray-50">
                    <img 
                      src={selectedProject.posterImage} 
                      alt={`Poster de ${selectedProject.title}`}
                      className="w-full h-auto"
                    />
                  </div>
                </div>

                {/* Columna Derecha - Información */}
                <div className="order-1 lg:order-2 space-y-6">
                  {/* Título y Estado */}
                  <div>
                    <h4 className="text-2xl font-bold text-gray-900 mb-2">{selectedProject.title}</h4>
                    <div className="flex items-center gap-3 text-sm text-gray-600 mb-3">
                      <span className="flex items-center gap-1">
                        <i className="pi pi-calendar"></i>
                        {selectedProject.presentationDate}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <i className="pi pi-map-marker"></i>
                        {selectedProject.location}
                      </span>
                    </div>
                  </div>

                  {/* Descripción */}
                  <div>
                    <h5 className="text-sm font-semibold text-gray-900 mb-2 flex items-center gap-2">
                      <i className="pi pi-align-left text-green-600"></i>
                      Descripción
                    </h5>
                    <p className="text-sm text-gray-700 leading-relaxed bg-gray-50 p-4 rounded-lg">
                      {selectedProject.description}
                    </p>
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

                  {/* Información Académica */}
                  <div>
                    <h5 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                      <i className="pi pi-info-circle text-green-600"></i>
                      Información Académica
                    </h5>
                    <div className="bg-gray-50 p-4 rounded-lg space-y-3">
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Materia</p>
                        <p className="text-sm font-medium text-gray-900">{selectedProject.subject}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Grupo</p>
                        <p className="text-sm font-medium text-gray-900">{selectedProject.group}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Profesor</p>
                        <p className="text-sm font-medium text-gray-900">{selectedProject.professor}</p>
                      </div>
                    </div>
                  </div>

                  {/* Línea de Investigación */}
                  <div>
                    <h5 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                      <i className="pi pi-sitemap text-green-600"></i>
                      Línea de Investigación
                    </h5>
                    <div className="bg-gray-50 p-4 rounded-lg space-y-3">
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Línea Principal</p>
                        <p className="text-sm font-medium text-gray-900">{selectedProject.line}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Sublínea</p>
                        <p className="text-sm font-medium text-gray-900">{selectedProject.subline}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer del modal */}
            <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 px-6 py-4 flex items-center justify-end gap-3">
              <button 
                onClick={closeModal}
                className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}