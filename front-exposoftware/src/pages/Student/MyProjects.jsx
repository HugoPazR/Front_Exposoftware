import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import * as ProjectsService from "../../Services/ProjectsService";
import EventosService from "../../Services/EventosService";
import logo from "../../assets/Logo-unicesar.png";

export default function MyProjects() {
  const [selectedProject, setSelectedProject] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [projects, setProjects] = useState([]);
  const [loadingProjects, setLoadingProjects] = useState(true);
  const [error, setError] = useState(null);
  const [eventoInfo, setEventoInfo] = useState(null); 
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {projects.map(proyecto => {
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
                    ? { texto: 'Activo', color: 'bg-green-100 text-green-800' }
                    : { texto: 'Inactivo', color: 'bg-gray-100 text-gray-800' };

                  return (
                    <div key={proyecto.id_proyecto} className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg transition-shadow">
                      <div className="flex items-start justify-between mb-3">
                        <h3 className="text-lg font-semibold text-gray-900 flex-1">{proyecto.titulo_proyecto}</h3>
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${estadoConfig.color} whitespace-nowrap ml-2`}>
                          {estadoConfig.texto}
                        </span>
                      </div>

                      <div className="space-y-2 text-sm text-gray-600 mb-4">
                        <div className="flex items-center gap-2">
                          <i className="pi pi-briefcase text-teal-600"></i>
                          <span className="font-medium">{tipoActividad}</span>
                        </div>
                        
                        {proyecto.id_estudiantes && proyecto.id_estudiantes.length > 0 && (
                          <div className="flex items-center gap-2">
                            <i className="pi pi-users text-teal-600"></i>
                            <span>{proyecto.id_estudiantes.length} participante(s)</span>
                          </div>
                        )}

                        <div className="flex items-center gap-2">
                          <i className="pi pi-calendar text-teal-600"></i>
                          <span>{fechaSubida}</span>
                        </div>

                        {proyecto.calificacion && (
                          <div className="flex items-center gap-2">
                            <i className="pi pi-star-fill text-yellow-500"></i>
                            <span className="font-medium">Calificación: {proyecto.calificacion}/5</span>
                          </div>
                        )}
                      </div>

                      <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
                        <button 
                          onClick={() => handleViewDetails(proyecto)}
                          className="flex-1 border border-gray-200 px-4 py-2 rounded-lg text-sm font-medium flex items-center justify-center gap-2 hover:bg-gray-50 transition-colors"
                        >
                          <i className="pi pi-eye"></i> Ver detalles
                        </button>
                        {proyecto.archivo_pdf && (
                          <a 
                            href={proyecto.archivo_pdf}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors"
                            style={{ backgroundColor: 'rgba(12, 183, 106, 0.1)', color: 'rgba(12, 183, 106, 1)' }}
                          >
                            <i className="pi pi-download"></i>
                          </a>
                        )}
                      </div>
                    </div>
                  );
                })}

                {/* Postular nuevo proyecto card */}
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center justify-center hover:border-teal-400 transition-colors">
                  <div className="text-4xl text-gray-400 mb-4">+</div>
                  <h4 className="font-semibold text-gray-900 mb-2">Postular Nuevo Proyecto</h4>
                  <p className="text-gray-500 text-sm mb-4 text-center">Haga clic para iniciar una nueva postulación.</p>
                  <Link to="/student/register-project" className="text-white px-4 py-2 rounded-lg hover:opacity-90 transition-opacity" style={{ backgroundColor: 'rgba(12, 183, 106, 1)' }}>Postular</Link>
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
                  <h4 className="text-2xl font-bold text-gray-900 mb-2">{selectedProject.titulo_proyecto}</h4>
                  <div className="flex items-center gap-3 text-sm text-gray-600">
                    <span className="flex items-center gap-1">
                      <i className="pi pi-briefcase"></i>
                      {
                        {
                          1: 'Proyecto (Exposoftware)',
                          2: 'Taller',
                          3: 'Ponencia',
                          4: 'Conferencia'
                        }[selectedProject.tipo_actividad] || 'Tipo Desconocido'
                      }
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <i className="pi pi-calendar"></i>
                      {selectedProject.fecha_subida 
                        ? new Date(selectedProject.fecha_subida).toLocaleDateString('es-ES')
                        : 'Fecha no disponible'}
                    </span>
                  </div>
                </div>
                <span className={`px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap ${
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
                          <div className="flex">
                            {[1, 2, 3, 4, 5].map(star => (
                              <i 
                                key={star}
                                className={`pi pi-star${star <= selectedProject.calificacion ? '-fill' : ''} text-yellow-500`}
                              ></i>
                            ))}
                          </div>
                          <span className="text-sm font-semibold text-gray-900">
                            {selectedProject.calificacion}/5
                          </span>
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
            <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 px-6 py-4 flex items-center justify-end gap-3">
              <button 
                onClick={closeModal}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
              >
                Cerrar
              </button>
              {selectedProject.archivo_pdf && (
                <a
                  href={selectedProject.archivo_pdf}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 text-white rounded-lg hover:opacity-90 transition-opacity flex items-center gap-2"
                  style={{ backgroundColor: 'rgba(12, 183, 106, 1)' }}
                >
                  <i className="pi pi-download"></i>
                  Descargar PDF
                </a>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
