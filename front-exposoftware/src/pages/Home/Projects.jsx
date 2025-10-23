import { useState } from "react";
import { Link } from "react-router-dom";
import logo from "../../assets/Logo-unicesar.png";

const MOCK_PROJECTS = [
  {
    id: 1,
    title: "Sistema de Gestión de Bibliotecas con IA",
    participants: ["Cristian Guzman", "Pedro Lopez", "Ana García"],
    subject: "Programación Avanzada",
    group: "Grupo A",
    status: "Aprobado",
    description: "Sistema inteligente para gestión automatizada de bibliotecas universitarias utilizando técnicas de IA para recomendaciones personalizadas y búsqueda avanzada.",
    professor: "Dr. Carlos Pérez",
    line: "Inteligencia Artificial",
    subline: "Aprendizaje Automático",
    area: "Ciencias de la Computación",
    posterImage: "https://via.placeholder.com/800x1200/10b981/ffffff?text=Poster+Biblioteca+IA",
    presentationDate: "25 Nov 2025, 10:00 AM",
    location: "Auditorio 3",
    programa: "Ingeniería de Sistemas",
  },
  {
    id: 2,
    title: "App Móvil para Gestión de Turnos",
    participants: ["Karen Martinez", "Luis Rodríguez"],
    subject: "Programación Móvil",
    group: "Grupo B",
    status: "Aprobado",
    description: "Aplicación móvil multiplataforma para la gestión eficiente de turnos en diferentes tipos de establecimientos, con sistema de notificaciones en tiempo real.",
    professor: "Ing. María Ruiz",
    line: "Ingeniería de Software",
    subline: "Desarrollo Móvil",
    area: "Desarrollo de Aplicaciones",
    posterImage: "https://via.placeholder.com/800x1200/3b82f6/ffffff?text=Poster+App+Turnos",
    presentationDate: "25 Nov 2025, 2:00 PM",
    location: "Sala 201",
    programa: "Ingeniería de Sistemas",
  },
  {
    id: 3,
    title: "Plataforma de E-Learning con Gamificación",
    participants: ["Andrea Silva", "Jorge Morales", "Diana Torres"],
    subject: "Ingeniería de Software",
    group: "Grupo C",
    status: "Aprobado",
    description: "Plataforma educativa innovadora que integra elementos de gamificación para mejorar la experiencia de aprendizaje online, con seguimiento personalizado del progreso del estudiante.",
    professor: "Dr. Roberto Sánchez",
    line: "Tecnologías Educativas",
    subline: "Gamificación y Aprendizaje",
    area: "Educación Digital",
    posterImage: "https://via.placeholder.com/800x1200/8b5cf6/ffffff?text=Poster+E-Learning",
    presentationDate: "26 Nov 2025, 9:00 AM",
    location: "Auditorio 1",
    programa: "Ingeniería de Sistemas",
  },
  {
    id: 4,
    title: "Sistema de Monitoreo Ambiental IoT",
    participants: ["Miguel Ángel Castro", "Sofía Ramírez"],
    subject: "Internet de las Cosas",
    group: "Grupo D",
    status: "Aprobado",
    description: "Red de sensores IoT para monitoreo en tiempo real de variables ambientales (temperatura, humedad, calidad del aire) con visualización de datos y alertas automáticas.",
    professor: "Ing. Patricia Gómez",
    line: "Internet de las Cosas",
    subline: "Sistemas Embebidos",
    area: "Tecnologías Emergentes",
    posterImage: "https://via.placeholder.com/800x1200/f59e0b/ffffff?text=Poster+IoT+Ambiental",
    presentationDate: "26 Nov 2025, 3:00 PM",
    location: "Sala 105",
    programa: "Ingeniería Electrónica",
  },
  {
    id: 5,
    title: "Chatbot Asistente Virtual con NLP",
    participants: ["Carolina Díaz", "Andrés Herrera"],
    subject: "Inteligencia Artificial",
    group: "Grupo E",
    status: "Aprobado",
    description: "Asistente virtual inteligente basado en procesamiento de lenguaje natural para atención al cliente automatizada, capaz de comprender contexto y mantener conversaciones fluidas.",
    professor: "Dr. Fernando López",
    line: "Inteligencia Artificial",
    subline: "Procesamiento de Lenguaje Natural",
    area: "Machine Learning",
    posterImage: "https://via.placeholder.com/800x1200/ec4899/ffffff?text=Poster+Chatbot+NLP",
    presentationDate: "27 Nov 2025, 11:00 AM",
    location: "Auditorio 2",
    programa: "Ingeniería de Sistemas",
  },
  {
    id: 6,
    title: "Sistema de Detección de Fraude Bancario",
    participants: ["Ricardo Vega", "Natalia Ortiz", "Pablo Mendoza"],
    subject: "Ciencia de Datos",
    group: "Grupo F",
    status: "Aprobado",
    description: "Sistema de detección de transacciones fraudulentas en tiempo real utilizando algoritmos de machine learning y análisis de patrones de comportamiento.",
    professor: "Dra. Elena Vargas",
    line: "Ciencia de Datos",
    subline: "Análisis Predictivo",
    area: "Data Science",
    posterImage: "https://via.placeholder.com/800x1200/06b6d4/ffffff?text=Poster+Deteccion+Fraude",
    presentationDate: "27 Nov 2025, 4:00 PM",
    location: "Sala 302",
    programa: "Ingeniería de Sistemas",
  },
  {
    id: 7,
    title: "Realidad Aumentada para Educación Médica",
    participants: ["Daniela Rojas", "Sebastián Pérez"],
    subject: "Realidad Virtual y Aumentada",
    group: "Grupo G",
    status: "Aprobado",
    description: "Aplicación de realidad aumentada para el aprendizaje de anatomía y procedimientos médicos, permitiendo visualización 3D interactiva de órganos y sistemas del cuerpo humano.",
    professor: "Ing. Carlos Mendoza",
    line: "Tecnologías Inmersivas",
    subline: "Realidad Aumentada",
    area: "Aplicaciones Médicas",
    posterImage: "https://via.placeholder.com/800x1200/ef4444/ffffff?text=Poster+AR+Medicina",
    presentationDate: "28 Nov 2025, 10:00 AM",
    location: "Auditorio 3",
    programa: "Ingeniería de Sistemas",
  },
  {
    id: 8,
    title: "Blockchain para Trazabilidad Agrícola",
    participants: ["Juliana Gómez", "David Torres", "María Fernández"],
    subject: "Tecnologías Emergentes",
    group: "Grupo H",
    status: "Aprobado",
    description: "Sistema basado en blockchain para garantizar la trazabilidad y autenticidad de productos agrícolas desde la producción hasta el consumidor final.",
    professor: "Dr. Andrés Martínez",
    line: "Blockchain",
    subline: "Trazabilidad",
    area: "Agrotecnología",
    posterImage: "https://via.placeholder.com/800x1200/14b8a6/ffffff?text=Poster+Blockchain+Agro",
    presentationDate: "28 Nov 2025, 2:00 PM",
    location: "Sala 105",
    programa: "Ingeniería de Sistemas",
  },
];

export default function PublicProjects() {
  const [selectedProject, setSelectedProject] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("all");
  const [selectedLine, setSelectedLine] = useState("all");
  const [selectedDate, setSelectedDate] = useState("all");
  const [selectedProgram, setSelectedProgram] = useState("all");

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
  const programs = ["all", ...new Set(MOCK_PROJECTS.map(p => p.programa))];

  // Filtrar proyectos
  const filteredProjects = MOCK_PROJECTS.filter(project => {
    const matchesSearch = project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.participants.some(p => p.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesSubject = selectedSubject === "all" || project.subject === selectedSubject;
    const matchesLine = selectedLine === "all" || project.line === selectedLine;
    const matchesDate = selectedDate === "all" || project.presentationDate.startsWith(selectedDate);
    const matchesProgram = selectedProgram === "all" || project.programa === selectedProgram;
    
    return matchesSearch && matchesSubject && matchesLine && matchesDate && matchesProgram;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Público */}


      {/* Banner Hero */}
      <div className="bg-gradient-to-r from-green-600 to-green-800 text-white py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Proyectos Expo-software 2025
          </h1>
          <p className="text-lg md:text-xl text-green-100 max-w-3xl mx-auto">
            Descubre los proyectos innovadores desarrollados por estudiantes de la Universidad Popular del Cesar
          </p>
          <div className="mt-6 flex items-center justify-center gap-4">
            <div className="bg-white/10 backdrop-blur-sm px-6 py-3 rounded-lg">
              <p className="text-3xl font-bold">{MOCK_PROJECTS.length}</p>
              <p className="text-sm text-green-100">Proyectos Inscritos</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm px-6 py-3 rounded-lg">
              <p className="text-3xl font-bold">{new Set(MOCK_PROJECTS.flatMap(p => p.participants)).size}</p>
              <p className="text-sm text-green-100">Participantes</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm px-6 py-3 rounded-lg">
              <p className="text-3xl font-bold">{subjects.length - 1}</p>
              <p className="text-sm text-green-100">Áreas Temáticas</p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Panel de Filtros */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6 shadow-sm">
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
                className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Filtro por Programa */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <i className="pi pi-building text-green-600 mr-1"></i>
                Programa
              </label>
              <select
                value={selectedProgram}
                onChange={(e) => setSelectedProgram(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
              >
                <option value="all">Todos los programas</option>
                {programs.filter(p => p !== "all").map(program => (
                  <option key={program} value={program}>{program}</option>
                ))}
              </select>
            </div>

            {/* Filtro por Materia */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <i className="pi pi-book text-green-600 mr-1"></i>
                Materia
              </label>
              <select
                value={selectedSubject}
                onChange={(e) => setSelectedSubject(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
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
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
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
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
              >
                <option value="all">Todas las fechas</option>
                {dates.filter(d => d !== "all").map(date => (
                  <option key={date} value={date}>{date}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Botón para limpiar filtros */}
          {(searchTerm || selectedSubject !== "all" || selectedLine !== "all" || selectedDate !== "all" || selectedProgram !== "all") && (
            <div className="mt-4 flex items-center justify-between bg-green-50 p-3 rounded-lg">
              <p className="text-sm text-gray-700 font-medium">
                <i className="pi pi-info-circle text-green-600 mr-2"></i>
                Mostrando <span className="font-bold text-green-700">{filteredProjects.length}</span> de <span className="font-bold">{MOCK_PROJECTS.length}</span> proyectos
              </p>
              <button
                onClick={() => {
                  setSearchTerm("");
                  setSelectedSubject("all");
                  setSelectedLine("all");
                  setSelectedDate("all");
                  setSelectedProgram("all");
                }}
                className="text-sm text-green-600 hover:text-green-700 font-medium flex items-center gap-1 hover:bg-white px-3 py-1 rounded transition-colors"
              >
                <i className="pi pi-times-circle"></i>
                Limpiar filtros
              </button>
            </div>
          )}
        </div>

        {/* Grid de Proyectos */}
        {filteredProjects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map(p => (
              <div key={p.id} className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-xl transition-all duration-300 group">
                {/* Imagen del poster */}
                <div className="h-48 bg-gradient-to-br from-green-400 to-green-600 overflow-hidden relative">
                  <img 
                    src={p.posterImage} 
                    alt={p.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute top-3 right-3">
                    <span className="bg-green-600 text-white px-3 py-1 rounded-full text-xs font-semibold shadow-lg">
                      {p.status}
                    </span>
                  </div>
                </div>

                {/* Contenido */}
                <div className="p-5">
                  <h3 className="text-lg font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-green-600 transition-colors">
                    {p.title}
                  </h3>
                  
                  <div className="text-sm text-gray-600 mb-3 space-y-2">
                    <div className="flex items-center gap-2">
                      <i className="pi pi-building text-green-600 text-xs"></i>
                      <span className="truncate">{p.programa}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <i className="pi pi-book text-green-600 text-xs"></i>
                      <span className="truncate">{p.subject}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <i className="pi pi-calendar text-green-600 text-xs"></i>
                      <span className="truncate">{p.presentationDate}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <i className="pi pi-map-marker text-green-600 text-xs"></i>
                      <span className="truncate">{p.location}</span>
                    </div>
                  </div>

                  <p className="text-sm text-gray-600 mb-4 line-clamp-3">
                    {p.description}
                  </p>

                  <button 
                    onClick={() => handleViewDetails(p)}
                    className="w-full bg-green-600 text-white px-4 py-2.5 rounded-lg text-sm font-medium flex items-center justify-center gap-2 hover:bg-green-700 transition-colors group-hover:shadow-lg"
                  >
                    <i className="pi pi-eye"></i> Ver detalles completos
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-lg border border-gray-200 p-12 text-center shadow-sm">
            <div className="w-20 h-20 bg-gray-100 rounded-full mx-auto mb-4 flex items-center justify-center">
              <i className="pi pi-search text-5xl text-gray-400"></i>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              No se encontraron proyectos
            </h3>
            <p className="text-gray-500 mb-6 max-w-md mx-auto">
              No hay proyectos que coincidan con los filtros seleccionados. Intenta ajustar los criterios de búsqueda.
            </p>
            <button
              onClick={() => {
                setSearchTerm("");
                setSelectedSubject("all");
                setSelectedLine("all");
                setSelectedDate("all");
                setSelectedProgram("all");
              }}
              className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors inline-flex items-center gap-2"
            >
              <i className="pi pi-refresh"></i>
              Limpiar todos los filtros
            </button>
          </div>
        )}
      </div>

      {/* Modal de Detalles del Proyecto */}
      {showModal && selectedProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 p-4 overflow-auto">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-auto">
            {/* Header del modal */}
            <div className="sticky top-0 bg-gradient-to-r from-green-600 to-green-700 text-white px-6 py-5 flex items-center justify-between z-10 rounded-t-xl">
              <h3 className="text-2xl font-bold flex items-center gap-2">
                <i className="pi pi-eye"></i>
                Detalles del Proyecto
              </h3>
              <button 
                onClick={closeModal}
                className="text-white hover:bg-white/20 rounded-full p-2 transition-colors"
              >
                <i className="pi pi-times text-2xl"></i>
              </button>
            </div>

            {/* Contenido del modal */}
            <div className="p-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Columna Izquierda - Poster */}
                <div className="order-2 lg:order-1">
                  <h5 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <i className="pi pi-image text-green-600"></i>
                    Poster del Proyecto
                  </h5>
                  <div className="border-2 border-gray-200 rounded-xl overflow-hidden bg-gray-50 shadow-lg">
                    <img 
                      src={selectedProject.posterImage} 
                      alt={`Poster de ${selectedProject.title}`}
                      className="w-full h-auto"
                    />
                  </div>
                </div>

                {/* Columna Derecha - Información */}
                <div className="order-1 lg:order-2 space-y-6">
                  {/* Título y Badge */}
                  <div>
                    <div className="flex items-start justify-between mb-3">
                      <h4 className="text-3xl font-bold text-gray-900 flex-1">{selectedProject.title}</h4>
                      <span className="bg-green-100 text-green-800 px-4 py-2 rounded-full text-sm font-bold ml-3">
                        {selectedProject.status}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-3 text-sm text-gray-600">
                      <span className="flex items-center gap-1.5 bg-gray-100 px-3 py-1.5 rounded-lg">
                        <i className="pi pi-calendar text-green-600"></i>
                        {selectedProject.presentationDate}
                      </span>
                      <span className="flex items-center gap-1.5 bg-gray-100 px-3 py-1.5 rounded-lg">
                        <i className="pi pi-map-marker text-green-600"></i>
                        {selectedProject.location}
                      </span>
                    </div>
                  </div>

                  {/* Descripción */}
                  <div className="bg-green-50 p-5 rounded-xl border border-green-200">
                    <h5 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2">
                      <i className="pi pi-align-left text-green-600"></i>
                      Descripción del Proyecto
                    </h5>
                    <p className="text-sm text-gray-700 leading-relaxed">
                      {selectedProject.description}
                    </p>
                  </div>

                  {/* Participantes */}
                  <div>
                    <h5 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2">
                      <i className="pi pi-users text-green-600"></i>
                      Equipo de Desarrollo
                    </h5>
                    <div className="flex flex-wrap gap-2">
                      {selectedProject.participants.map((participant, idx) => (
                        <span 
                          key={idx}
                          className="inline-flex items-center gap-2 bg-gradient-to-r from-green-50 to-green-100 text-green-800 px-4 py-2 rounded-full text-sm font-medium border border-green-200"
                        >
                          <div className="w-7 h-7 bg-green-600 rounded-full flex items-center justify-center">
                            <span className="text-white font-bold text-xs">
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
                    <h5 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2">
                      <i className="pi pi-info-circle text-green-600"></i>
                      Información Académica
                    </h5>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                        <p className="text-xs text-gray-500 mb-1 font-medium">Programa</p>
                        <p className="text-sm font-bold text-gray-900">{selectedProject.programa}</p>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                        <p className="text-xs text-gray-500 mb-1 font-medium">Materia</p>
                        <p className="text-sm font-bold text-gray-900">{selectedProject.subject}</p>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                        <p className="text-xs text-gray-500 mb-1 font-medium">Grupo</p>
                        <p className="text-sm font-bold text-gray-900">{selectedProject.group}</p>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                        <p className="text-xs text-gray-500 mb-1 font-medium">Profesor</p>
                        <p className="text-sm font-bold text-gray-900">{selectedProject.professor}</p>
                      </div>
                    </div>
                  </div>

                  {/* Línea de Investigación */}
                  <div>
                    <h5 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2">
                      <i className="pi pi-sitemap text-green-600"></i>
                      Línea de Investigación
                    </h5>
                    <div className="space-y-3">
                      <div className="bg-gradient-to-r from-purple-50 to-purple-100 p-4 rounded-lg border border-purple-200">
                        <p className="text-xs text-purple-600 mb-1 font-bold uppercase">Línea Principal</p>
                        <p className="text-sm font-bold text-gray-900">{selectedProject.line}</p>
                      </div>
                      <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-4 rounded-lg border border-blue-200">
                        <p className="text-xs text-blue-600 mb-1 font-bold uppercase">Sublínea</p>
                        <p className="text-sm font-bold text-gray-900">{selectedProject.subline}</p>
                      </div>
                      <div className="bg-gradient-to-r from-orange-50 to-orange-100 p-4 rounded-lg border border-orange-200">
                        <p className="text-xs text-orange-600 mb-1 font-bold uppercase">Área Temática</p>
                        <p className="text-sm font-bold text-gray-900">{selectedProject.area}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
