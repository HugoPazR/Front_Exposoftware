import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { getTeacherProjects, updateProjectStatus } from "../../Services/ProjectsService.jsx";
import * as AuthService from "../../Services/AuthService";
import logo from "../../assets/Logo-unicesar.png";

export default function StudentProjects() {
  const { user, getFullName, getInitials, logout } = useAuth();
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState("grid");
  const [selectedGroup, setSelectedGroup] = useState("Filtrar por grupo");
  const [selectedMateria, setSelectedMateria] = useState("Filtrar por materia");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProject, setSelectedProject] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Cargar proyectos del backend al montar el componente
  useEffect(() => {
    const loadProjects = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Obtener datos del usuario autenticado
        const userData = AuthService.getUserData();
        console.log('👤 Datos del usuario:', userData);
        
        if (!userData) {
          throw new Error('No hay sesión activa');
        }
        
        // El ID del docente puede estar en diferentes propiedades
        // Priorizar user.id_usuario que es donde está en Firebase Auth
        const docenteId = userData.user?.id_usuario || 
                         userData.user?.identificacion || 
                         userData.id_usuario || 
                         userData.id || 
                         userData.identificacion || 
                         userData.usuario?.identificacion;
        
        console.log('🔍 ID del docente:', docenteId);
        console.log('🔍 user object:', userData.user);
        
        if (!docenteId) {
          throw new Error('No se encontró el ID del docente');
        }
        
        const data = await getTeacherProjects(docenteId);
        // Si la respuesta es un array, usarla directamente; si es un objeto con una propiedad, extraerla
        const projectsList = Array.isArray(data) ? data : data?.data || data?.projects || [];
        setProjects(projectsList);
        console.log('📊 Proyectos cargados:', projectsList);
      } catch (err) {
        console.error('Error al cargar proyectos:', err);
        setError(err.message);
        // Fallback a array vacío si hay error
        setProjects([]);
      } finally {
        setLoading(false);
      }
    };

    loadProjects();
  }, []);

  // Handler para cerrar sesión
  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('❌ Error al cerrar sesión:', error);
      navigate('/login');
    }
  };

  // Filtrar proyectos según búsqueda
  const filteredProjects = projects.filter(project => 
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

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center">
                  <span className="text-emerald-600 font-bold text-lg">{getInitials()}</span>
                </div>
                <div className="hidden md:block">
                  <p className="text-sm font-medium text-gray-900">{getFullName()}</p>
                  <p className="text-xs text-gray-500 capitalize">{user?.rol || 'Docente'}</p>
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
                  to="/teacher/dashboard"
                  className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  <i className="pi pi-home text-base"></i>
                  Dashboard
                </Link>
                <Link
                  to="/teacher/proyectos"
                  className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium bg-emerald-50 text-emerald-700"
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
                <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-emerald-600 font-bold text-2xl">{getInitials()}</span>
                </div>
                <h3 className="font-semibold text-gray-900">{getFullName()}</h3>
                <p className="text-sm text-gray-500 capitalize">{user?.rol || 'Docente'}</p>
                {user?.categoria_docente && (
                  <p className="text-xs text-gray-400 mt-1">Categoría: {user.categoria_docente}</p>
                )}
                {user?.codigo_programa && (
                  <p className="text-xs text-gray-400">Código: {user.codigo_programa}</p>
                )}
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
                    className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
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
                    className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="Filtrar por grupo">Filtrar por grupo</option>
                    <option value="Grupo A">Grupo A</option>
                    <option value="Grupo B">Grupo B</option>
                    <option value="Grupo C">Grupo C</option>
                  </select>

                  <select 
                    value={selectedMateria}
                    onChange={(e) => setSelectedMateria(e.target.value)}
                    className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
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
                      ? "bg-emerald-600 text-white"
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
                      ? "bg-emerald-600 text-white"
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
              <div>
                {loading ? (
                  <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
                    <div className="w-16 h-16 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-600">Cargando proyectos...</p>
                  </div>
                ) : error ? (
                  <div className="bg-white rounded-lg border border-red-200 p-6 text-center bg-red-50">
                    <p className="text-red-600 font-medium">Error al cargar proyectos</p>
                    <p className="text-sm text-red-500 mt-1">{error}</p>
                  </div>
                ) : filteredProjects.length === 0 ? (
                  <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
                    <div className="w-16 h-16 bg-gray-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                      <i className="pi pi-search text-4xl text-gray-400"></i>
                    </div>
                    <p className="text-gray-600 mb-2">No se encontraron proyectos</p>
                    <p className="text-sm text-gray-500">Intenta con otros términos de búsqueda</p>
                  </div>
                ) : (
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
                              ? "bg-emerald-100 text-emerald-800"
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
                              <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center">
                                <span className="text-emerald-600 font-bold text-xs">
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
                                ? "bg-emerald-100 text-emerald-800"
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
                    ? "bg-emerald-100 text-emerald-800"
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
                  <i className="pi pi-align-left text-emerald-600"></i>
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
                    <i className="pi pi-info-circle text-emerald-600"></i>
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
                    <i className="pi pi-sitemap text-emerald-600"></i>
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
                  <i className="pi pi-users text-emerald-600"></i>
                  Participantes
                </h5>
                <div className="flex flex-wrap gap-2">
                  {selectedProject.participants.map((participant, idx) => (
                    <span 
                      key={idx}
                      className="inline-flex items-center gap-2 bg-emerald-50 text-emerald-800 px-3 py-2 rounded-full text-sm font-medium"
                    >
                        <div className="w-6 h-6 bg-emerald-200 rounded-full flex items-center justify-center">
                          <span className="text-emerald-800 font-bold text-xs">
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
                  <i className="pi pi-paperclip text-emerald-600"></i>
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
                    <button className="text-emerald-600 hover:text-emerald-700">
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
                    <button className="text-emerald-600 hover:text-emerald-700">
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
              <button className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors">
                Editar Estado
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
