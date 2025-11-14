import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import * as ProjectsService from "../../Services/ProjectsService";
import EventosService from "../../Services/EventosService";
import * as CertificadoService from "../../Services/CertificadoService";
import logo from "../../assets/Logo-unicesar.png";

export default function MyProjects() {
  const [selectedProject, setSelectedProject] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [projects, setProjects] = useState([]);
  const [loadingProjects, setLoadingProjects] = useState(true);
  const [error, setError] = useState(null);
  const [eventoInfo, setEventoInfo] = useState(null);
  const [descargandoCertificado, setDescargandoCertificado] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterMateria, setFilterMateria] = useState('');
  const [filteredProjects, setFilteredProjects] = useState([]);
  const { user, getFullName, getInitials, logout, loading } = useAuth();
  const navigate = useNavigate();

  // Cargar proyectos del usuario al montar el componente
  useEffect(() => {
    const cargarMisProyectos = async () => {
      // Verificar que tengamos el id_estudiante (ID del backend, no Firebase)
      const idEstudiante = user?.id_estudiante || user?.id_usuario;
      
      if (!user || !idEstudiante) {
        console.log('⏳ Esperando datos del usuario...');
        return;
      }

      try {
        setLoadingProjects(true);
        setError(null);
        console.log('🔍 Cargando proyectos del estudiante:', idEstudiante);
        console.log('📋 Datos del usuario:', { 
          id_estudiante: user.id_estudiante, 
          id_usuario: user.id_usuario,
          rol: user.rol 
        });
        
        let misProyectos = await ProjectsService.obtenerMisProyectos(idEstudiante);
        
        // � DEBUG: Ver qué datos están llegando del backend
        console.log('🔍 DEBUG - Proyectos recibidos del backend:', misProyectos);
        if (misProyectos.length > 0) {
          console.log('🔍 DEBUG - Primer proyecto completo:', JSON.stringify(misProyectos[0], null, 2));
          console.log('� DEBUG - Estudiantes del primer proyecto:', misProyectos[0].id_estudiantes);
        }
        
        setProjects(misProyectos);
        
        console.log('✅ Proyectos cargados:', misProyectos.length);
      } catch (err) {
        console.error('❌ Error cargando proyectos:', err);
        setError(err.message || 'Error al cargar los proyectos');
      } finally {
        setLoadingProjects(false);
      }
    };

    if (!loading && user) {
      cargarMisProyectos();
    }
  }, [user?.id_estudiante, user?.id_usuario, loading]); // Depende de ambos IDs

  // Filtrar proyectos basado en criterios de búsqueda
  useEffect(() => {
    let filtered = projects;

    // Filtrar por término de búsqueda (nombre del proyecto)
    if (searchTerm) {
      filtered = filtered.filter(project =>
        project.titulo_proyecto?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filtrar por materia
    if (filterMateria) {
      filtered = filtered.filter(project =>
        project.codigo_materia?.toLowerCase().includes(filterMateria.toLowerCase())
      );
    }

    setFilteredProjects(filtered);
  }, [projects, searchTerm, filterMateria]);

  // Limpiar filtros
  const clearFilters = () => {
    setSearchTerm('');
    setFilterMateria('');
  };

  // Handler para cerrar sesión
  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login', { replace: true }); // replace: true previene volver atrás
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
      // Forzar navegación incluso si hay error
      navigate('/login', { replace: true });
    }
  };

  const handleViewDetails = async (project) => {
    setSelectedProject(project);
    setShowModal(true);
    setEventoInfo(null); // Reset evento info
    
    // Cargar información del evento si existe id_evento
    if (project.id_evento) {
      try {
        console.log('🔍 Cargando info del evento:', project.id_evento);
        
        const todosEventos = await EventosService.obtenerEventos();
        console.log('📋 Total eventos disponibles:', todosEventos.length);
        
        const evento = todosEventos.find(e => e.id_evento === project.id_evento);
        
        if (evento) {
          console.log('✅ Evento encontrado:', evento);
          setEventoInfo(evento);
        } else {
          console.warn('⚠️ Evento no encontrado en la lista:', project.id_evento);
        }
      } catch (error) {
        console.warn('⚠️ No se pudo cargar el evento:', error);
        // No bloqueamos la visualización del proyecto
      }
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedProject(null);
    setEventoInfo(null); // Limpiar info del evento
  };

  // Handler para descargar certificado INDIVIDUAL (solo el del estudiante logueado)
  const handleDescargarCertificado = async (proyecto) => {
    console.log('🔍 Iniciando descarga de certificado INDIVIDUAL...');
    console.log('👤 Usuario completo:', user);
    console.log('📁 Proyecto completo:', proyecto);
    
    if (!user?.id_estudiante) {
      console.error('❌ No se encontró id_estudiante en el usuario');
      alert('❌ No se encontró tu ID de estudiante. Por favor, recarga la página.');
      return;
    }

    if (!proyecto?.id_proyecto) {
      console.error('❌ No se encontró id_proyecto en el proyecto');
      alert('❌ No se encontró el ID del proyecto.');
      return;
    }

    console.log('✅ IDs verificados:');
    console.log('   - id_estudiante:', user.id_estudiante, '(tipo:', typeof user.id_estudiante, ')');
    console.log('   - id_proyecto:', proyecto.id_proyecto, '(tipo:', typeof proyecto.id_proyecto, ')');

    setDescargandoCertificado(true);
    
    try {
      // El campo en el backend es 'titulo_proyecto', no 'nombre_proyecto'
      const nombreProyecto = proyecto.titulo_proyecto || proyecto.nombre_proyecto || 'Proyecto';
      console.log('📄 Generando certificado INDIVIDUAL para proyecto:', nombreProyecto);
      
      await CertificadoService.generarYDescargarCertificado(
        user.id_estudiante,
        proyecto.id_proyecto,
        nombreProyecto
      );
      
      console.log('✅ Certificado individual descargado exitosamente');
      alert('✅ Tu certificado se ha descargado exitosamente');
      
    } catch (error) {
      console.error('❌ Error al descargar certificado:', error);
      
      // Mensajes de error más específicos
      if (error.message.includes('No tienes permisos')) {
        alert('❌ No tienes permisos para descargar el certificado de este proyecto.');
      } else if (error.message.includes('Proyecto no encontrado')) {
        alert('❌ No se encontró el proyecto. Puede que haya sido eliminado.');
      } else if (error.message.includes('sin certificado')) {
        alert('❌ Este proyecto aún no tiene un certificado disponible.');
      } else {
        alert('❌ Error al descargar el certificado: ' + error.message);
      }
    } finally {
      setDescargandoCertificado(false);
    }
  };

  // Handler para descargar TODOS los certificados del proyecto (ZIP con todos los estudiantes)
  const handleDescargarTodosCertificados = async (proyecto) => {
    console.log('🔍 Iniciando descarga de TODOS los certificados del proyecto...');
    console.log('📁 Proyecto completo:', proyecto);
    
    if (!proyecto?.id_proyecto) {
      console.error('❌ No se encontró id_proyecto en el proyecto');
      alert('❌ No se encontró el ID del proyecto.');
      return;
    }

    const numEstudiantes = proyecto.id_estudiantes?.length || 0;
    console.log('👥 Número de estudiantes en el proyecto:', numEstudiantes);

    setDescargandoCertificado(true);
    
    try {
      const nombreProyecto = proyecto.titulo_proyecto || proyecto.nombre_proyecto || 'Proyecto';
      console.log('📦 Generando certificados para TODOS los estudiantes del proyecto:', nombreProyecto);
      
      await CertificadoService.generarYDescargarCertificadosPorProyecto(
        proyecto.id_proyecto,
        nombreProyecto,
        {
          id_evento: proyecto.id_evento || null,
          incluir_calificacion: false,
          coordinador_general: "Juan Yaneth",
          formato_salida: "zip"
        }
      );
      
      console.log('✅ Todos los certificados descargados exitosamente');
      alert(`✅ Se han descargado los certificados de todos los estudiantes (${numEstudiantes} certificados)`);
      
    } catch (error) {
      console.error('❌ Error al descargar certificados:', error);
      alert('❌ Error al descargar los certificados: ' + error.message);
    } finally {
      setDescargandoCertificado(false);
    }
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
            {/* Logo y título - Siempre visible */}
            <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
              <img src={logo} alt="Logo Unicesar" className="w-8 sm:w-10 h-auto" />
              <div className="hidden sm:block">
                <h1 className="text-base sm:text-lg font-bold text-gray-900">Expo-software</h1>
                <p className="text-xs text-gray-500">Universidad Popular del Cesar</p>
              </div>
              <div className="sm:hidden">
                <h1 className="text-sm font-bold text-gray-900">Expo-software</h1>
              </div>
            </div>

            {/* Elementos del lado derecho - Responsive */}
            <div className="flex items-center gap-2 sm:gap-4">
              {/* Información del usuario */}
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="w-8 sm:w-10 h-8 sm:h-10 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: 'rgba(12, 183, 106, 0.1)' }}>
                  <span className="font-bold text-sm sm:text-lg" style={{ color: 'rgba(12, 183, 106, 1)' }}>{getInitials()}</span>
                </div>
                <div className="hidden lg:block">
                  <p className="text-sm font-medium text-gray-900">{getFullName()}</p>
                  <p className="text-xs text-gray-500 capitalize">{user?.rol || 'Estudiante'}</p>
                </div>
              </div>

              {/* Botón de logout */}
              <button
                onClick={handleLogout}
                className="text-red-600 hover:text-red-700 transition-colors flex items-center gap-1 sm:gap-2 flex-shrink-0"
              >
                <i className="pi pi-sign-out text-sm sm:text-base"></i>
                <span className="hidden sm:inline text-sm font-medium">Cerrar Sesión</span>
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
                <Link to="/student/asistencia" className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors text-gray-700 hover:bg-gray-50`}>
                  <i className="pi pi-qrcode text-base"></i>
                  Registrar Asistencia
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
              </div>
            </div>
          </aside>

          {/* Main content */}
          <main className="lg:col-span-3">
            {/* Información del estudiante */}
            <div className="border rounded-lg p-4 sm:p-6 mb-6" style={{ background: 'linear-gradient(to right, rgba(12, 183, 106, 0.05), rgba(12, 183, 106, 0.1))', borderColor: 'rgba(12, 183, 106, 0.3)' }}>
              <div className="flex items-start gap-3 sm:gap-4">
                <div className="w-10 sm:w-12 h-10 sm:h-12 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: 'rgba(12, 183, 106, 1)' }}>
                  <span className="text-white font-bold text-lg sm:text-xl">{getInitials()}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-900 truncate">{getFullName()}</h3>
                  <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-xs sm:text-sm text-gray-600 mt-1">
                    <span className="flex items-center gap-1">
                      <i className="pi pi-id-card"></i>
                      <span className="truncate">{user?.identificacion}</span>
                    </span>
                    <span className="hidden sm:inline text-gray-300">•</span>
                    <span className="flex items-center gap-1">
                      <i className="pi pi-book"></i>
                      <span>Semestre {user?.semestre}</span>
                    </span>
                    <span className="hidden sm:inline text-gray-300">•</span>
                    <span className="flex items-center gap-1">
                      <i className="pi pi-tag"></i>
                      <span className="truncate">{user?.codigo_programa}</span>
                    </span>
                  </div>
                </div>
                <div className="hidden sm:block flex-shrink-0">
                  <span className="inline-flex items-center gap-2 text-white px-3 sm:px-4 py-2 rounded-full text-xs sm:text-sm font-medium" style={{ backgroundColor: 'rgba(12, 183, 106, 1)' }}>
                    <i className="pi pi-check-circle"></i>
                    Estudiante Activo
                  </span>
                </div>
              </div>
            </div>

            <h2 className="text-3xl font-bold text-gray-900 mb-2">Mis Proyectos</h2>
            <p className="text-gray-600 mb-6">Aquí puedes gestionar todos los proyectos académicos que has postulado o en los que participas. Revisa su estado, edita los detalles o visualiza la información completa de cada uno.</p>

            {/* Sección de Búsqueda y Filtros */}
            <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-6 mb-6 shadow-sm">
              <div className="flex items-center gap-3 mb-4 sm:mb-6">
                <div className="w-8 sm:w-10 h-8 sm:h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center flex-shrink-0">
                  <i className="pi pi-search text-white text-xs sm:text-sm"></i>
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="text-base sm:text-lg font-bold text-gray-900 truncate">Buscar y Filtrar Proyectos</h3>
                  <p className="text-xs sm:text-sm text-gray-600 hidden sm:block">Encuentra rápidamente tus proyectos por nombre o materia</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Búsqueda por nombre */}
                <div className="relative">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <i className="pi pi-tag mr-1"></i>
                    Nombre del Proyecto
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      placeholder="Buscar por nombre..."
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-sm sm:text-base"
                    />
                    <i className="pi pi-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
                  </div>
                </div>

                {/* Filtro por materia */}
                <div className="relative">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <i className="pi pi-book mr-1"></i>
                    Materia
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={filterMateria}
                      onChange={(e) => setFilterMateria(e.target.value)}
                      placeholder="Filtrar por materia..."
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors text-sm sm:text-base"
                    />
                    <i className="pi pi-book absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
                  </div>
                </div>
              </div>

              {/* Botón limpiar filtros y contador de resultados */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4 mt-4 pt-4 border-t border-gray-100">
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4">
                  {(searchTerm || filterMateria) && (
                    <button
                      onClick={clearFilters}
                      className="flex items-center gap-2 px-3 sm:px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <i className="pi pi-times"></i>
                      Limpiar filtros
                    </button>
                  )}
                  <div className="text-sm text-gray-600">
                    <span className="font-medium">{filteredProjects.length}</span> de <span className="font-medium">{projects.length}</span> proyectos
                    {(searchTerm || filterMateria) && (
                      <span className="ml-1 text-blue-600">(filtrados)</span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Loading state */}
            {loadingProjects ? (
              <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
                <div className="w-16 h-16 border-4 rounded-full animate-spin mx-auto mb-4" style={{ borderColor: 'rgba(12, 183, 106, 1)', borderTopColor: 'transparent' }}></div>
                <p className="text-gray-600">Cargando proyectos...</p>
              </div>
            ) : error ? (
              /* Error state */
              <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
                <i className="pi pi-exclamation-triangle text-3xl text-red-500 mb-3"></i>
                <h3 className="text-lg font-semibold text-red-900 mb-2">Error al cargar proyectos</h3>
                <p className="text-red-700 mb-4">{error}</p>
                <button 
                  onClick={() => window.location.reload()}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  Reintentar
                </button>
              </div>
            ) : projects.length === 0 ? (
              /* Mensaje cuando no hay proyectos */
              <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
                <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: 'rgba(12, 183, 106, 0.1)' }}>
                  <i className="pi pi-folder-open text-4xl" style={{ color: 'rgba(12, 183, 106, 1)' }}></i>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No tienes proyectos registrados</h3>
                <p className="text-gray-600 mb-6 max-w-md mx-auto">
                  Comienza postulando tu primer proyecto para la convocatoria Exposoftware 2025. 
                  Podrás ver todos tus proyectos aquí y gestionar su información.
                </p>
                <Link 
                  to="/student/register-project" 
                  className="inline-flex items-center gap-2 text-white px-6 py-3 rounded-lg font-medium hover:opacity-90 transition-opacity"
                  style={{ backgroundColor: 'rgba(12, 183, 106, 1)' }}
                >
                  <i className="pi pi-plus-circle"></i>
                  Postular Nuevo Proyecto
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                {filteredProjects.map(proyecto => {
                  // Mapear tipo_actividad a nombre legible
                  const tipoActividad = {
                    1: 'Proyecto (Exposoftware)',
                    2: 'Taller',
                    3: 'Ponencia',
                    4: 'Conferencia'
                  }[proyecto.tipo_actividad] || 'Tipo Desconocido';

                  // Formatear fecha
                  const fechaSubida = proyecto.fecha_subida 
                    ? new Date(proyecto.fecha_subida).toLocaleDateString('es-ES', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric'
                      })
                    : 'Fecha no disponible';

                  // Estado del proyecto
                  const estadoConfig = proyecto.activo 
                    ? { texto: 'Activo', color: 'bg-green-100 text-green-800 border-green-200', icon: 'pi-check-circle', bgColor: 'from-green-50 to-emerald-50' }
                    : { texto: 'Inactivo', color: 'bg-gray-100 text-gray-800 border-gray-200', icon: 'pi-pause-circle', bgColor: 'from-gray-50 to-slate-50' };

                  // Color del tipo de actividad
                  const tipoColor = {
                    1: 'from-blue-500 to-indigo-600', // Proyecto
                    2: 'from-purple-500 to-violet-600', // Taller
                    3: 'from-orange-500 to-red-600', // Ponencia
                    4: 'from-teal-500 to-cyan-600' // Conferencia
                  }[proyecto.tipo_actividad] || 'from-gray-500 to-gray-600';

                  return (
                    <div key={proyecto.id_proyecto} className={`bg-gradient-to-br ${estadoConfig.bgColor} rounded-xl border border-gray-200 p-4 sm:p-6 hover:shadow-xl transition-all duration-300 group`}>
                      {/* Header con título y estado */}
                      <div className="flex items-start justify-between mb-3 sm:mb-4">
                        <div className="flex-1 min-w-0">
                          <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-gray-800 transition-colors">
                            {proyecto.titulo_proyecto}
                          </h3>
                          <div className="flex items-center gap-2">
                            <div className={`w-6 sm:w-8 h-6 sm:h-8 bg-gradient-to-br ${tipoColor} rounded-lg flex items-center justify-center flex-shrink-0`}>
                              <i className="pi pi-briefcase text-white text-xs"></i>
                            </div>
                            <span className="text-xs sm:text-sm font-medium text-gray-700 truncate">{tipoActividad}</span>
                          </div>
                        </div>
                        <span className={`px-2 sm:px-3 py-1 rounded-full text-xs font-semibold border ${estadoConfig.color} whitespace-nowrap flex items-center gap-1 flex-shrink-0`}>
                          <i className={`pi ${estadoConfig.icon} text-xs`}></i>
                          {estadoConfig.texto}
                        </span>
                      </div>

                      {/* Información del proyecto */}
                      <div className="space-y-2 sm:space-y-3 mb-4 sm:mb-6">
                        <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs sm:text-sm text-gray-600">
                          <div className="flex items-center gap-1">
                            <i className="pi pi-users text-blue-500"></i>
                            <span className="font-medium">{proyecto.id_estudiantes?.length || 0}</span>
                            <span className="hidden sm:inline">participante{proyecto.id_estudiantes?.length !== 1 ? 's' : ''}</span>
                          </div>
                          <span className="hidden sm:inline text-gray-300">•</span>
                          <div className="flex items-center gap-1">
                            <i className="pi pi-calendar text-green-500"></i>
                            <span className="truncate">{fechaSubida}</span>
                          </div>
                        </div>

                        {proyecto.codigo_materia && (
                          <div className="flex items-center gap-2 text-xs sm:text-sm">
                            <i className="pi pi-book text-purple-500"></i>
                            <span className="font-medium text-gray-900">Materia:</span>
                            <span className="text-purple-700 bg-purple-50 px-2 py-1 rounded-md truncate">{proyecto.codigo_materia}</span>
                          </div>
                        )}

                        {proyecto.calificacion && (
                          <div className="flex items-center gap-2">
                            <div className="flex items-center gap-1">
                              <i className="pi pi-pencil text-blue-500 text-xs sm:text-sm"></i>
                              <span className="text-xs sm:text-sm font-semibold text-gray-900">
                                {proyecto.calificacion}/5
                              </span>
                            </div>
                          </div>
                        )}

                      </div>

                      {/* Acciones */}
                      <div className="flex items-center gap-2 pt-3 sm:pt-4 border-t border-gray-200">
                        <button 
                          onClick={() => handleViewDetails(proyecto)}
                          className="flex-1 bg-gradient-to-r from-teal-500 to-cyan-600 text-white px-3 sm:px-4 py-2 sm:py-3 rounded-lg text-xs sm:text-sm font-medium hover:from-teal-600 hover:to-cyan-700 transition-all duration-200 flex items-center justify-center gap-2 shadow-sm hover:shadow-md"
                        >
                          <i className="pi pi-eye"></i>
                          <span className="hidden sm:inline">Ver detalles</span>
                          <span className="sm:hidden">Ver</span>
                        </button>
                      </div>
                    </div>
                  );
                })}

                {/* Postular nuevo proyecto card */}
                <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 flex flex-col items-center justify-center hover:border-teal-400 hover:bg-teal-50 transition-all duration-300 group cursor-pointer">
                  <div className="w-16 h-16 bg-gradient-to-br from-teal-100 to-teal-200 rounded-full flex items-center justify-center mb-4 group-hover:from-teal-200 group-hover:to-teal-300 transition-all duration-300">
                    <i className="pi pi-plus text-2xl text-teal-600"></i>
                  </div>
                  <h4 className="font-bold text-gray-900 mb-2 text-center">Postular Nuevo Proyecto</h4>
                  <p className="text-gray-500 text-sm mb-4 text-center max-w-xs">Haga clic para iniciar una nueva postulación para Exposoftware 2025.</p>
                  <Link 
                    to="/student/register-project" 
                    className="bg-gradient-to-r from-teal-500 to-teal-600 text-white px-6 py-3 rounded-lg font-medium hover:from-teal-600 hover:to-teal-700 transition-all duration-200 flex items-center gap-2 shadow-sm hover:shadow-md"
                  >
                    <i className="pi pi-plus-circle"></i>
                    Postular
                  </Link>
                </div>
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
            <div className="sticky top-0 bg-white border-b border-gray-200 px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between z-10">
              <h3 className="text-lg sm:text-xl font-bold text-gray-900 truncate pr-2">Detalles del Proyecto</h3>
              <button 
                onClick={closeModal}
                className="text-gray-500 hover:text-gray-700 transition-colors flex-shrink-0"
              >
                <i className="pi pi-times text-lg sm:text-xl"></i>
              </button>
            </div>

            {/* Contenido del modal */}
            <div className="p-6 space-y-6">
              {/* Título y Estado */}
              <div className="flex flex-col sm:flex-row items-start sm:items-start justify-between gap-3 sm:gap-4">
                <div className="flex-1 min-w-0">
                  <h4 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2 line-clamp-2">{selectedProject.titulo_proyecto}</h4>
                  <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs sm:text-sm text-gray-600">
                    <span className="flex items-center gap-1">
                      <i className="pi pi-briefcase"></i>
                      <span className="truncate">
                        {
                          {
                            1: 'Proyecto (Exposoftware)',
                            2: 'Taller',
                            3: 'Ponencia',
                            4: 'Conferencia'
                          }[selectedProject.tipo_actividad] || 'Tipo Desconocido'
                        }
                      </span>
                    </span>
                    <span className="hidden sm:inline">•</span>
                    <span className="flex items-center gap-1">
                      <i className="pi pi-calendar"></i>
                      <span className="truncate">
                        {selectedProject.fecha_subida 
                          ? new Date(selectedProject.fecha_subida).toLocaleDateString('es-ES')
                          : 'Fecha no disponible'}
                      </span>
                    </span>
                  </div>
                </div>
                <span className={`px-3 sm:px-4 py-2 rounded-full text-xs sm:text-sm font-semibold whitespace-nowrap flex-shrink-0 ${
                  selectedProject.activo 
                    ? "bg-green-100 text-green-800"
                    : "bg-gray-100 text-gray-800"
                }`}>
                  {selectedProject.activo ? 'Activo' : 'Inactivo'}
                </span>
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
                      <p className="text-xs text-gray-500 mb-1">ID del Proyecto</p>
                      <p className="text-sm font-medium text-gray-900 font-mono">{selectedProject.id_proyecto}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Materia</p>
                      <p className="text-sm font-medium text-gray-900">{selectedProject.codigo_materia || 'No especificada'}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Grupo</p>
                      <p className="text-sm font-medium text-gray-900">Grupo #{selectedProject.id_grupo || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Docente</p>
                      <p className="text-sm font-medium text-gray-900">
                        {selectedProject.id_docente?.nombre || selectedProject.id_docente?.uid_docente || 'No asignado'}
                      </p>
                    </div>
                    {selectedProject.calificacion && (
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Calificación</p>
                        <div className="flex items-center gap-2">
                          <div className="flex items-center gap-1">
                            <i className="pi pi-pencil text-blue-500"></i>
                            <span className="text-sm font-semibold text-gray-900">
                              {selectedProject.calificacion}/5
                            </span>
                          </div>
                        </div>
                      </div>
                    )}
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
                      <p className="text-sm font-medium text-gray-900">
                        {selectedProject.nombre_linea || `Código: ${selectedProject.codigo_linea}`}
                      </p>
                      {selectedProject.nombre_linea && (
                        <p className="text-xs text-gray-400 mt-1">Código: {selectedProject.codigo_linea}</p>
                      )}
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Sublínea</p>
                      <p className="text-sm font-medium text-gray-900">
                        {selectedProject.nombre_sublinea || `Código: ${selectedProject.codigo_sublinea}`}
                      </p>
                      {selectedProject.nombre_sublinea && (
                        <p className="text-xs text-gray-400 mt-1">Código: {selectedProject.codigo_sublinea}</p>
                      )}
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Área Temática</p>
                      <p className="text-sm font-medium text-gray-900">
                        {selectedProject.nombre_area || `Código: ${selectedProject.codigo_area}`}
                      </p>
                      {selectedProject.nombre_area && (
                        <p className="text-xs text-gray-400 mt-1">Código: {selectedProject.codigo_area}</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Participantes */}
              {selectedProject.id_estudiantes && selectedProject.id_estudiantes.length > 0 && (
                <div>
                  <h5 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <i className="pi pi-users" style={{ color: 'rgba(12, 183, 106, 1)' }}></i>
                    Participantes ({selectedProject.id_estudiantes.length})
                  </h5>
                  <div className="flex flex-wrap gap-2">
                    {selectedProject.id_estudiantes.map((estudiante, idx) => {
                      // Manejar tanto objetos {id_estudiante, nombre} como strings
                      console.log(`🔍 Renderizando estudiante [${idx}]:`, estudiante);
                      console.log(`   - Tipo: ${typeof estudiante}`);
                      console.log(`   - nombre: ${estudiante?.nombre}`);
                      
                      const nombreEstudiante = typeof estudiante === 'object' 
                        ? (estudiante.nombre || estudiante.email || estudiante.id_estudiante)
                        : estudiante;
                      
                      console.log(`   - Mostrando: ${nombreEstudiante}`);
                      
                      return (
                        <span 
                          key={idx}
                          className="inline-flex items-center gap-2 px-3 py-2 rounded-full text-sm font-medium"
                          style={{ backgroundColor: 'rgba(12, 183, 106, 0.1)', color: 'rgba(12, 183, 106, 1)' }}
                        >
                          <div className="w-6 h-6 rounded-full flex items-center justify-center" style={{ backgroundColor: 'rgba(12, 183, 106, 0.3)' }}>
                            <i className="pi pi-user text-xs"></i>
                          </div>
                          {nombreEstudiante || 'Estudiante sin nombre'}
                        </span>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Archivos Adjuntos */}
              {selectedProject.archivo_pdf && (
                <div>
                  <h5 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <i className="pi pi-paperclip" style={{ color: 'rgba(12, 183, 106, 1)' }}></i>
                    Archivos Adjuntos
                  </h5>
                  <div className="grid grid-cols-1 gap-3">
                    <a
                      href={selectedProject.archivo_pdf}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="border border-gray-200 rounded-lg p-3 flex items-center gap-3 hover:bg-gray-50 transition-colors"
                    >
                      <div className="w-10 h-10 bg-red-100 rounded flex items-center justify-center flex-shrink-0">
                        <i className="pi pi-file-pdf text-red-600 text-lg"></i>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">Artículo del proyecto</p>
                        <p className="text-xs text-gray-500">Documento PDF</p>
                      </div>
                      <button className="text-teal-600 hover:text-teal-700">
                        <i className="pi pi-download"></i>
                      </button>
                    </a>
                  </div>
                </div>
              )}

              {/* Evento Asociado */}
              {selectedProject.id_evento && (
                <div>
                  <h5 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <i className="pi pi-calendar-plus" style={{ color: 'rgba(12, 183, 106, 1)' }}></i>
                    Evento Asociado
                  </h5>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: 'rgba(12, 183, 106, 0.2)' }}>
                        <i className="pi pi-calendar" style={{ color: 'rgba(12, 183, 106, 1)' }}></i>
                      </div>
                      <div className="flex-1">
                        {eventoInfo ? (
                          <>
                            <p className="text-sm font-medium text-gray-900">
                              {eventoInfo.nombre_evento || 'Evento sin nombre'}
                            </p>
                            {eventoInfo.descripcion && (
                              <p className="text-xs text-gray-600 mt-1">{eventoInfo.descripcion}</p>
                            )}
                            {eventoInfo.fecha_inicio && eventoInfo.fecha_fin && (
                              <p className="text-xs text-gray-500 mt-2">
                                {new Date(eventoInfo.fecha_inicio).toLocaleDateString('es-ES')} - {new Date(eventoInfo.fecha_fin).toLocaleDateString('es-ES')}
                              </p>
                            )}
                            {eventoInfo.lugar && (
                              <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                                <i className="pi pi-map-marker"></i>
                                {eventoInfo.lugar}
                              </p>
                            )}
                          </>
                        ) : (
                          <p className="text-sm font-medium text-gray-900 animate-pulse">
                            Cargando información del evento...
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Footer del modal */}
            <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 px-4 sm:px-6 py-3 sm:py-4 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 sm:gap-4">
              <button 
                onClick={closeModal}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors order-2 sm:order-1"
              >
                Cerrar
              </button>
              
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3 order-1 sm:order-2">
                {/* Botón descargar MI certificado (individual) */}
                <button
                  onClick={() => handleDescargarCertificado(selectedProject)}
                  disabled={descargandoCertificado}
                  className="px-3 sm:px-4 py-2 text-white rounded-lg transition-opacity flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90 text-sm"
                  style={{ backgroundColor: 'rgba(59, 130, 246, 1)' }}
                  title="Descargar solo mi certificado"
                >
                  <i className={`pi ${descargandoCertificado ? 'pi-spin pi-spinner' : 'pi-certificate'} text-sm`}></i>
                  <span className="hidden sm:inline">{descargandoCertificado ? 'Generando...' : 'Mi Certificado'}</span>
                  <span className="sm:hidden">{descargandoCertificado ? '...' : 'Mi Cert.'}</span>
                </button>

                {/* Botón descargar TODOS los certificados (ZIP) */}
                <button
                  onClick={() => handleDescargarTodosCertificados(selectedProject)}
                  disabled={descargandoCertificado}
                  className="px-3 sm:px-4 py-2 text-white rounded-lg transition-opacity flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90 text-sm"
                  style={{ backgroundColor: 'rgba(147, 51, 234, 1)' }}
                  title={`Descargar todos los certificados (${selectedProject.id_estudiantes?.length || 0} estudiantes)`}
                >
                  <i className={`pi ${descargandoCertificado ? 'pi-spin pi-spinner' : 'pi-users'} text-sm`}></i>
                  <span className="hidden sm:inline">{descargandoCertificado ? 'Generando ZIP...' : `Todos (${selectedProject.id_estudiantes?.length || 0})`}</span>
                  <span className="sm:hidden">{descargandoCertificado ? '...' : `Todos (${selectedProject.id_estudiantes?.length || 0})`}</span>
                </button>

                {selectedProject.archivo_pdf && (
                  <a
                    href={selectedProject.archivo_pdf}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 sm:px-4 py-2 text-white rounded-lg hover:opacity-90 transition-opacity flex items-center justify-center gap-2 text-sm"
                    style={{ backgroundColor: 'rgba(12, 183, 106, 1)' }}
                    title="Descargar PDF del proyecto"
                  >
                    <i className="pi pi-file-pdf text-sm"></i>
                    <span className="hidden sm:inline">PDF Proyecto</span>
                    <span className="sm:hidden">PDF</span>
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
