import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { obtenerMiPerfilInvitado, obtenerTodosLosProyectos } from "../../Services/GuestService";
import { getEventoById } from "../../Services/EventosPublicService";
import { SECTORES } from "../../data/sectores";
import logo from "../../assets/Logo-unicesar.png";

export default function GuestProjects() {
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  const [selectedProject, setSelectedProject] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const [perfil, setPerfil] = useState(null);
  const [proyectos, setProyectos] = useState([]);
  const [eventoNombre, setEventoNombre] = useState({});
  const [tipoActividadNombre, setTipoActividadNombre] = useState({});

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    try {
      setCargando(true);
      setError(null);
      
      // Cargar perfil y proyectos en paralelo
      const [datosPerfil, datosProyectos] = await Promise.all([
        obtenerMiPerfilInvitado(),
        obtenerTodosLosProyectos()
      ]);
      
      setPerfil(datosPerfil);
      setProyectos(datosProyectos);
      
      console.log('✅ Datos cargados - Perfil:', datosPerfil, 'Proyectos:', datosProyectos.length);
    } catch (err) {
      console.error('❌ Error cargando datos:', err);
      setError(err.message);
    } finally {
      setCargando(false);
    }
  };

  // Función para obtener nombre del evento
  const obtenerNombreEvento = async (eventoId) => {
    if (!eventoId || eventoNombre[eventoId]) return;
    
    try {
      const evento = await getEventoById(eventoId);
      setEventoNombre(prev => ({
        ...prev,
        [eventoId]: evento.nombre_evento || evento.nombre || 'Evento desconocido'
      }));
    } catch (error) {
      console.error('Error obteniendo nombre del evento:', error);
      setEventoNombre(prev => ({
        ...prev,
        [eventoId]: 'Evento desconocido'
      }));
    }
  };

  // Función para obtener nombre del tipo de actividad
  const obtenerNombreTipoActividad = (tipoId) => {
    const tipos = {
      1: 'Proyecto (Exposoftware)',
      2: 'Taller',
      3: 'Ponencia',
      4: 'Conferencia'
    };
    return tipos[tipoId] || 'Tipo desconocido';
  };

  const handleLogout = () => {
    if (window.confirm("¿Estás seguro de que deseas cerrar sesión?")) {
      logout();
      navigate("/login");
    }
  };

  // Catálogos
  const sectores = SECTORES;

  // Datos del invitado - desde el perfil real
  const invitadoData = perfil || {
    id_invitado: "Cargando...",
    nombres: user?.primer_nombre || "Invitado",
    apellidos: user?.primer_apellido || "Usuario",
    nombre_empresa: "Cargando...",
    id_sector: "...",
    sector_nombre: sectores.find(s => s.id.toString() === perfil?.id_sector)?.nombre || "No especificado",
    correo: user?.correo || user?.email || "",
    rol: user?.rol || "Invitado"
  };

  const handleViewDetails = (project) => {
    setSelectedProject(project);
    setShowModal(true);
    
    // Obtener nombre del evento si hay ID de evento
    if (project.id_evento) {
      obtenerNombreEvento(project.id_evento);
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedProject(null);
  };

  // Filtrar proyectos por búsqueda
  const filteredProjects = proyectos.filter(project => {
    if (!searchTerm) return true;

    const searchLower = searchTerm.toLowerCase();
    const matchesTitle = (project.nombre_proyecto || project.titulo_proyecto || project.titulo || '').toLowerCase().includes(searchLower);
    const matchesDocente = (project.id_docente?.nombre || '').toLowerCase().includes(searchLower);
    const matchesLinea = (project.nombre_linea || '').toLowerCase().includes(searchLower);
    const matchesTipoActividad = obtenerNombreTipoActividad(project.tipo_actividad).toLowerCase().includes(searchLower);

    return matchesTitle || matchesDocente || matchesLinea || matchesTipoActividad;
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
                          <p className="text-xs text-black-500">Sector</p>
                          <p className="text-sm text-black font-semibold capitalize">
                            {invitadoData.sector_nombre}
                          </p>
                        </div>
                      </div>
                
                <div className="flex items-start gap-2">
                  <i className="pi pi-envelope text-green-600 text-sm mt-0.5"></i>
                  <div className="flex-1">
                    <p className="text-xs text-gray-500">Correo</p>
                    <p className="text-sm text-gray-900 font-medium break-all">{invitadoData.correo}</p>
                  </div>
                </div>
              </div>
            </div>
          </aside>

          {/* Main content */}
          <main className="lg:col-span-3">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-4xl font-bold text-gray-900 mb-2 bg-gradient-to-r from-green-600 to-teal-600 bg-clip-text text-transparent">
                  Proyectos Disponibles
                </h2>
                <p className="text-gray-600 text-lg">
                  Explora los proyectos que se presentarán en el evento
                </p>
              </div>
              {!cargando && !error && (
                <div className="bg-gradient-to-r from-green-500 to-teal-600 text-white px-4 py-2 rounded-lg">
                  <div className="flex items-center gap-2">
                    <i className="pi pi-folder-open"></i>
                    <span className="font-semibold">{proyectos.length} proyecto{proyectos.length !== 1 ? 's' : ''}</span>
                  </div>
                </div>
              )}
            </div>

            {/* Estado de carga */}
            {cargando && (
              <div className="bg-white rounded-xl border border-gray-200 p-16 text-center shadow-sm">
                <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-green-200 border-t-green-600 mb-6"></div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Cargando proyectos...</h3>
                <p className="text-gray-600">Estamos obteniendo la información más reciente</p>
              </div>
            )}

            {/* Error */}
            {error && !cargando && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                <div className="flex items-center gap-3">
                  <i className="pi pi-exclamation-triangle text-red-600 text-xl"></i>
                  <div>
                    <h3 className="text-sm font-semibold text-red-900">Error al cargar proyectos</h3>
                    <p className="text-sm text-red-700 mt-1">{error}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Contenido - Solo si no hay error ni está cargando */}
            {!cargando && !error && (
              <>
                {/* Panel de Filtros */}
                <div className="bg-white rounded-xl border border-gray-200 p-6 mb-8 shadow-sm">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-teal-600 rounded-lg flex items-center justify-center">
                      <i className="pi pi-filter text-white"></i>
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-gray-900">Buscar Proyectos</h3>
                      <p className="text-sm text-gray-600">Encuentra proyectos por título, docente o línea de investigación</p>
                    </div>
                  </div>

                  {/* Barra de búsqueda */}
                  <div className="mb-4">
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="Buscar por título, docente, línea o tipo de actividad..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-12 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-900 placeholder-gray-500"
                      />
                      <i className="pi pi-search absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg"></i>
                      {searchTerm && (
                        <button
                          onClick={() => setSearchTerm("")}
                          className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                        >
                          <i className="pi pi-times text-lg"></i>
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Contador de resultados */}
                  {searchTerm && (
                    <div className="flex items-center justify-between bg-gray-50 rounded-lg p-3">
                      <p className="text-sm text-gray-700">
                        <span className="font-semibold text-green-600">{filteredProjects.length}</span> de <span className="font-semibold">{proyectos.length}</span> proyectos encontrados
                      </p>
                      <button
                        onClick={() => setSearchTerm("")}
                        className="text-sm text-green-600 hover:text-green-700 font-medium flex items-center gap-2 bg-white px-3 py-1 rounded-md border border-green-200 hover:border-green-300 transition-colors"
                      >
                        <i className="pi pi-times-circle"></i>
                        Limpiar
                      </button>
                    </div>
                  )}
                </div>

                {/* Grid de Proyectos */}
                {filteredProjects.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 gap-6">
                    {filteredProjects.map(p => (
                      <div key={p.id_proyecto} className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group min-h-[320px] flex flex-col">
                        <div className="bg-gradient-to-r from-green-500 to-teal-600 p-4">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <h3 className="text-lg font-bold text-white mb-1 leading-tight">
                                {p.nombre_proyecto || p.titulo_proyecto || p.titulo || 'Proyecto sin título'}
                              </h3>
                              {p.tipo_actividad && (
                                <span className="inline-flex items-center gap-1 bg-white/20 text-white text-xs px-2 py-1 rounded-full font-medium">
                                  <i className="pi pi-tag"></i>
                                  {obtenerNombreTipoActividad(p.tipo_actividad)}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Contenido */}
                        <div className="p-4 flex-1 flex flex-col">
                          {/* Información adicional - siempre visible */}
                          <div className="space-y-3 mb-4 flex-1">
                            {p.id_docente?.nombre && (
                              <div className="flex items-center gap-2 text-sm text-gray-600">
                                <i className="pi pi-user text-green-600"></i>
                                <span className="truncate">{p.id_docente.nombre}</span>
                              </div>
                            )}

                            {p.id_estudiantes && p.id_estudiantes.length > 0 && (
                              <div className="flex items-center gap-2 text-sm text-gray-600">
                                <i className="pi pi-users text-blue-600"></i>
                                <span>{p.id_estudiantes.length} estudiante{p.id_estudiantes.length !== 1 ? 's' : ''}</span>
                              </div>
                            )}

                            {p.nombre_linea && (
                              <div className="flex items-center gap-2 text-sm text-gray-600">
                                <i className="pi pi-graduation-cap text-purple-600"></i>
                                <span className="truncate">{p.nombre_linea}</span>
                              </div>
                            )}
                          </div>

                          {/* Estado y calificación - en fila si ambos existen */}
                          {(p.estado_calificacion || p.calificacion !== undefined) && (
                            <div className="flex items-center justify-between mb-4 p-2 bg-gray-50 rounded-lg">
                              {p.estado_calificacion && (
                                <div className="flex items-center gap-1 text-xs">
                                  <i className={`pi pi-circle-fill ${p.estado_calificacion.toLowerCase().includes('aprobado') ? 'text-green-500' : p.estado_calificacion.toLowerCase().includes('pendiente') ? 'text-yellow-500' : 'text-gray-500'}`}></i>
                                  <span className={`font-medium ${p.estado_calificacion.toLowerCase().includes('aprobado') ? 'text-green-700' : p.estado_calificacion.toLowerCase().includes('pendiente') ? 'text-yellow-700' : 'text-gray-700'}`}>
                                    {p.estado_calificacion}
                                  </span>
                                </div>
                              )}

                              {p.calificacion !== undefined && (
                                <div className="flex items-center gap-1 text-xs text-gray-600">
                                  <i className="pi pi-star-fill text-yellow-500"></i>
                                  <span className="font-medium">{p.calificacion}/5</span>
                                </div>
                              )}
                            </div>
                          )}

                          {/* Botón - siempre al final */}
                          <button
                            onClick={() => handleViewDetails(p)}
                            className="w-full bg-gradient-to-r from-green-500 to-teal-600 text-white py-3 px-4 rounded-lg font-medium hover:from-green-600 hover:to-teal-700 transition-all duration-300 flex items-center justify-center gap-2 group-hover:shadow-lg mt-auto"
                          >
                            <i className="pi pi-eye"></i>
                            Ver Detalles Completos
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl border-2 border-dashed border-gray-300 p-12 text-center">
                    <div className="w-20 h-20 bg-gradient-to-br from-gray-200 to-gray-300 rounded-full mx-auto mb-6 flex items-center justify-center">
                      <i className="pi pi-search text-4xl text-gray-500"></i>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3">
                      {proyectos.length === 0 ? 'No hay proyectos disponibles' : 'No se encontraron proyectos'}
                    </h3>
                    <p className="text-gray-600 mb-6 max-w-md mx-auto">
                      {proyectos.length === 0
                        ? 'Aún no se han registrado proyectos para el evento. ¡Vuelve pronto para ver las innovadoras propuestas!'
                        : 'No hay proyectos que coincidan con tu búsqueda. Intenta con otros términos.'}
                    </p>
                    {searchTerm && (
                      <button
                        onClick={() => setSearchTerm("")}
                        className="bg-gradient-to-r from-green-500 to-teal-600 text-white px-6 py-3 rounded-lg hover:from-green-600 hover:to-teal-700 transition-all duration-300 font-medium inline-flex items-center gap-2"
                      >
                        <i className="pi pi-refresh"></i>
                        Limpiar búsqueda
                      </button>
                    )}
                  </div>
                )}
              </>
            )}
          </main>
        </div>
      </div>

      {/* Modal de Detalles del Proyecto */}
      {showModal && selectedProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4 overflow-auto">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] overflow-auto">
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
              <div className="space-y-6">
                {/* Título */}
                <div>
                  <h4 className="text-2xl font-bold text-gray-900 mb-2">
                    {selectedProject.titulo_proyecto || selectedProject.nombre_proyecto || selectedProject.titulo || 'Proyecto sin título'}
                  </h4>
                </div>

                {/* Docente */}
                {selectedProject.id_docente && selectedProject.id_docente.nombre && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <i className="pi pi-user text-green-600"></i>
                      <p className="text-sm font-semibold text-green-900">Docente Responsable</p>
                    </div>
                    <p className="text-base font-medium text-green-800">{selectedProject.id_docente.nombre}</p>
                  </div>
                )}

                {/* Estudiantes */}
                {selectedProject.id_estudiantes && selectedProject.id_estudiantes.length > 0 && (
                  <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <i className="pi pi-users text-indigo-600"></i>
                      <p className="text-sm font-semibold text-indigo-900">Estudiantes Participantes</p>
                    </div>
                    <ul className="space-y-1">
                      {selectedProject.id_estudiantes.map(e => (
                        <li key={e.id_estudiante} className="text-sm text-indigo-800 flex items-center gap-2">
                          <i className="pi pi-circle-fill text-xs text-indigo-400"></i>
                          {e.nombre}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Grupo */}
                {selectedProject.id_grupo && (
                  <div className="bg-teal-50 border border-teal-200 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <i className="pi pi-users text-teal-600"></i>
                      <p className="text-sm font-semibold text-teal-900">Grupo Académico</p>
                    </div>
                    <p className="text-base font-medium text-teal-800">{selectedProject.id_grupo}</p>
                  </div>
                )}

                {/* Información Académica */}
                {(selectedProject.nombre_area || selectedProject.nombre_linea || selectedProject.nombre_sublinea || selectedProject.codigo_materia) && (
                  <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <i className="pi pi-graduation-cap text-slate-600"></i>
                      <p className="text-sm font-semibold text-slate-900">Información Académica</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {selectedProject.nombre_linea && (
                        <div>
                          <p className="text-xs text-slate-600 mb-1">Línea de Investigación</p>
                          <p className="text-sm font-medium text-slate-800">{selectedProject.nombre_linea}</p>
                        </div>
                      )}
                      {selectedProject.nombre_sublinea && (
                        <div>
                          <p className="text-xs text-slate-600 mb-1">Sublínea</p>
                          <p className="text-sm font-medium text-slate-800">{selectedProject.nombre_sublinea}</p>
                        </div>
                      )}
                      {selectedProject.nombre_area && (
                        <div>
                          <p className="text-xs text-slate-600 mb-1">Área Temática</p>
                          <p className="text-sm font-medium text-slate-800">{selectedProject.nombre_area}</p>
                        </div>
                      )}
                      {selectedProject.codigo_materia && (
                        <div>
                          <p className="text-xs text-slate-600 mb-1">Materia</p>
                          <p className="text-sm font-medium text-slate-800">{selectedProject.codigo_materia}</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Evento */}
                {selectedProject.id_evento && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <i className="pi pi-calendar text-blue-600"></i>
                      <p className="text-sm font-semibold text-blue-900">Evento</p>
                    </div>
                    <p className="text-base font-medium text-blue-800">
                      {eventoNombre[selectedProject.id_evento] || 'Cargando nombre del evento...'}
                    </p>
                  </div>
                )}

                {/* Tipo de actividad */}
                {selectedProject.tipo_actividad && (
                  <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <i className="pi pi-tag text-purple-600"></i>
                      <p className="text-sm font-semibold text-purple-900">Tipo de Actividad</p>
                    </div>
                    <p className="text-base font-medium text-purple-800">
                      {obtenerNombreTipoActividad(selectedProject.tipo_actividad)}
                    </p>
                  </div>
                )}

                {/* Estado y calificación */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {selectedProject.estado_calificacion && (
                    <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <i className="pi pi-check-circle text-orange-600"></i>
                        <p className="text-sm font-semibold text-orange-900">Estado de Calificación</p>
                      </div>
                      <p className="text-base font-medium text-orange-800">{selectedProject.estado_calificacion}</p>
                    </div>
                  )}
                  {selectedProject.calificacion !== undefined && (
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <i className="pi pi-star text-yellow-600"></i>
                        <p className="text-sm font-semibold text-yellow-900">Calificación</p>
                      </div>
                      <p className="text-base font-medium text-yellow-800">{selectedProject.calificacion}/5</p>
                    </div>
                  )}
                </div>

                {/* PDF */}
                {selectedProject.archivo_pdf && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <i className="pi pi-file-pdf text-red-600"></i>
                      <p className="text-sm font-semibold text-red-900">Documento PDF</p>
                    </div>
                    <a 
                      href={selectedProject.archivo_pdf} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="inline-flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors font-medium"
                    >
                      <i className="pi pi-external-link"></i>
                      Ver PDF del Proyecto
                    </a>
                  </div>
                )}

                {/* Fecha de subida y Estado activo */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {selectedProject.fecha_subida && (
                    <div className="bg-cyan-50 border border-cyan-200 rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <i className="pi pi-calendar-plus text-cyan-600"></i>
                        <p className="text-sm font-semibold text-cyan-900">Fecha de Subida</p>
                      </div>
                      <p className="text-base font-medium text-cyan-800">
                        {new Date(selectedProject.fecha_subida).toLocaleString('es-CO', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>
                  )}

                  {selectedProject.activo !== undefined && (
                    <div className={`border rounded-lg p-4 ${selectedProject.activo ? 'bg-emerald-50 border-emerald-200' : 'bg-gray-50 border-gray-200'}`}>
                      <div className="flex items-center gap-2 mb-2">
                        <i className={`pi pi-circle-fill text-sm ${selectedProject.activo ? 'text-emerald-600' : 'text-gray-400'}`}></i>
                        <p className={`text-sm font-semibold ${selectedProject.activo ? 'text-emerald-900' : 'text-gray-900'}`}>Estado del Proyecto</p>
                      </div>
                      <p className={`text-base font-medium ${selectedProject.activo ? 'text-emerald-800' : 'text-gray-800'}`}>
                        {selectedProject.activo ? 'Activo' : 'Inactivo'}
                      </p>
                    </div>
                  )}
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