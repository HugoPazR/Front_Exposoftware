import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { getTeacherProjects, updateProjectStatus } from "../../Services/ProjectsService.jsx";
import { getTeacherProfile, calificarProyecto, getTeacherSubjects, getTeacherSubjectGroups } from "../../Services/TeacherService.jsx";
import * as AuthService from "../../Services/AuthService";
import ResearchLinesService from "../../Services/ResearchLinesService.jsx";
import { getEventosMap } from "../../Services/EventosPublicService.jsx";
import logo from "../../assets/Logo-unicesar.png";

export default function StudentProjects() {
  const { user, getFullName, getInitials, logout } = useAuth();
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState("grid");
  const [selectedGroup, setSelectedGroup] = useState("Filtrar por grupo");
  const [selectedMateria, setSelectedMateria] = useState("Filtrar por materia");
  const [materiasList, setMateriasList] = useState([]); // { codigo, nombre }
  const [gruposList, setGruposList] = useState([]); // { id, nombre }
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProject, setSelectedProject] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showGradeModal, setShowGradeModal] = useState(false);
  const [projectToGrade, setProjectToGrade] = useState(null);
  const [gradeValue, setGradeValue] = useState("");
  const [gradingProject, setGradingProject] = useState(false);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // 🗺️ Mapas para nombres de líneas, sublíneas, áreas y eventos
  const [lineasMap, setLineasMap] = useState(new Map());
  const [sublineasMap, setSublineasMap] = useState(new Map());
  const [areasMap, setAreasMap] = useState(new Map());
  const [eventosMap, setEventosMap] = useState(new Map());

  // 🗺️ Cargar mapas de nombres al inicio (líneas, sublíneas, áreas, eventos)
  useEffect(() => {
    const loadMaps = async () => {
      try {
        console.log('🗺️ Cargando mapas de nombres...');
        
        // Cargar mapas de investigación (líneas, sublíneas, áreas)
        const { lineasMap, sublineasMap, areasMap } = await ResearchLinesService.obtenerMapasInvestigacion();
        setLineasMap(lineasMap);
        setSublineasMap(sublineasMap);
        setAreasMap(areasMap);
        
        // Cargar mapa de eventos
        const eventosMap = await getEventosMap();
        setEventosMap(eventosMap);
        
        console.log('✅ Mapas cargados exitosamente');
      } catch (err) {
        console.error('⚠️ Error cargando mapas:', err);
        // No bloqueamos la aplicación si falla, solo mostramos IDs
      }
    };
    
    loadMaps();
  }, []); // Solo se ejecuta una vez al montar el componente

  // Cargar proyectos del backend al montar el componente
  useEffect(() => {
    const loadProjects = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Esperar a que tengamos los datos del usuario
        if (!user) {
          console.log('⏳ Esperando datos del usuario...');
          return;
        }
        
        console.log('👨‍🏫 Datos completos del usuario docente:', user);
        console.log('📋 IDs disponibles:', {
          'user.id_usuario': user.id_usuario,
          'user.user?.id_usuario': user.user?.id_usuario,
          'user.id_docente': user.id_docente,
          'user.uid': user.uid,
          rol: user.rol
        });
        

        let docenteId = user.id_docente || user.user?.id_usuario || user.id_usuario || user.uid;
        
        // Si no tenemos id_docente, intentar obtenerlo del backend
        if (!user.id_docente && docenteId) {
          console.log('🔄 No se encontró id_docente, obteniendo perfil completo desde /api/v1/auth/me...');
          try {
            const perfilCompleto = await getTeacherProfile();
            console.log('✅ Perfil completo obtenido:', perfilCompleto);
            
            // Actualizar el docenteId con el id_docente del perfil
            if (perfilCompleto.id_docente) {
              docenteId = perfilCompleto.id_docente;
              console.log('✅ id_docente actualizado:', docenteId);
              
              // Opcional: Actualizar el contexto con el perfil completo
              // Si tienes una función en AuthContext para actualizar el usuario
              // updateUser({ ...user, ...perfilCompleto });
            } else if (perfilCompleto.docente?.id_docente) {
              docenteId = perfilCompleto.docente.id_docente;
              console.log('✅ id_docente actualizado desde docente:', docenteId);
            }
          } catch (err) {
            console.warn('⚠️ No se pudo obtener perfil completo, usando ID original:', err.message);
            // Continuar con el ID que tenemos
          }
        }
        
        if (!docenteId) {
          console.error('❌ No se encontró ID del docente');
          console.error('📦 Usuario completo:', JSON.stringify(user, null, 2));
          setError('No se pudo identificar al docente. Por favor, cierre sesión e inicie sesión nuevamente.');
          return;
        }
        
        console.log('🎯 Usando ID del docente:', docenteId);
        
        // Primero cargar proyectos
        const data = await getTeacherProjects(docenteId);
        setProjects(data);
        console.log('✅ Proyectos del docente cargados:', data.length);
        
        // Cargar materias que dicta el docente (pasar proyectos para fallback)
        try {
          const materias = await getTeacherSubjects(docenteId, data);
          const normalized = (Array.isArray(materias) ? materias : []).map(m => ({
            codigo: (m.codigo_materia || m.codigo || m.subject_code || m.id || m.code || '').toString(),
            nombre: m.nombre || m.nombre_materia || m.subject_name || m.title || m.name || String(m.codigo_materia || m.codigo || m.id || '')
          }));
          setMateriasList(normalized);
          console.log(`📚 Materias del docente cargadas: ${normalized.length}`);
        } catch (err) {
          console.warn('⚠️ No se pudieron cargar las materias del docente:', err.message || err);
          setMateriasList([]);
        }
      } catch (err) {
        console.error('❌ Error al cargar proyectos:', err);
        setError(err.message);
        setProjects([]);
      } finally {
        setLoading(false);
      }
    };

    loadProjects();
  }, [user]);

  // Cargar grupos cuando cambia la materia seleccionada
  useEffect(() => {
    const loadGrupos = async () => {
      try {
        // Si no hay materia seleccionada, limpiar lista
        if (!selectedMateria || selectedMateria === 'Filtrar por materia') {
          setGruposList([]);
          return;
        }

        // Intentar obtener docenteId similar al loadProjects (extraer de user)
        let docenteId = user?.id_docente || user?.user?.id_usuario || user?.id_usuario || user?.uid;
        if (!docenteId) {
          try {
            const perfil = await getTeacherProfile();
            docenteId = perfil.id_docente || perfil.docente?.id_docente || docenteId;
          } catch (err) {
            console.warn('⚠️ No se pudo obtener id_docente para cargar grupos:', err?.message || err);
          }
        }

        if (!docenteId) {
          setGruposList([]);
          return;
        }

        // Pasar proyectos actuales para fallback
        const grupos = await getTeacherSubjectGroups(docenteId, selectedMateria, projects);
        // Normalizar
        const normalized = (Array.isArray(grupos) ? grupos : []).map(g => ({
          id: g.id_grupo || g.id || g.codigo || g.group_code || '',
          nombre: g.nombre || g.nombre_grupo || g.name || String(g.id_grupo || g.id || g.codigo)
        }));
        setGruposList(normalized);
      } catch (err) {
        console.error('❌ Error cargando grupos para la materia:', err);
        setGruposList([]);
      }
    };

    loadGrupos();
  }, [selectedMateria, user, projects]);

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
  const filteredProjects = projects.filter(project => {
    const titulo = project.titulo_proyecto?.toLowerCase() || '';
    const materia = (project.codigo_materia || '').toString().toLowerCase();
    const grupo = (project.id_grupo || project.grupo || '').toString();
    const query = searchQuery.toLowerCase();

    // Búsqueda por texto (título o código de materia)
    const matchesQuery = titulo.includes(query) || materia.includes(query);

    // Filtrado por materia (si se seleccionó una materia válida)
    const materiaFilterActive = selectedMateria && selectedMateria !== 'Filtrar por materia';
    const matchesMateria = !materiaFilterActive || materia === selectedMateria.toString().toLowerCase();

    // Filtrado por grupo (si se seleccionó un grupo válido)
    const groupFilterActive = selectedGroup && selectedGroup !== 'Filtrar por grupo';
    const matchesGroup = !groupFilterActive || grupo === selectedGroup.toString();

    return matchesQuery && matchesMateria && matchesGroup;
  });

  const handleViewDetails = (project) => {
    setSelectedProject(project);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedProject(null);
  };

  // Abrir modal de calificación
  const handleOpenGradeModal = (project) => {
    setProjectToGrade(project);
    setGradeValue(project.calificacion || "");
    setShowGradeModal(true);
  };

  // Cerrar modal de calificación
  const closeGradeModal = () => {
    setShowGradeModal(false);
    setProjectToGrade(null);
    setGradeValue("");
  };

  // Calificar proyecto
  const handleGradeProject = async () => {
    try {
      setGradingProject(true);
      
      const nota = parseFloat(gradeValue);
      
      if (isNaN(nota)) {
        alert('Por favor ingrese una calificación válida');
        return;
      }

      if (nota < 0 || nota > 5) {
        alert('La calificación debe estar entre 0 y 5');
        return;
      }

      console.log(`📝 Calificando proyecto ${projectToGrade.id_proyecto} con nota ${nota}`);
      
      const proyectoActualizado = await calificarProyecto(projectToGrade.id_proyecto, nota);
      
      // Actualizar la lista de proyectos
      setProjects(projects.map(p => 
        p.id_proyecto === proyectoActualizado.id_proyecto ? proyectoActualizado : p
      ));
      
      alert(`✅ Proyecto calificado exitosamente con nota ${nota}`);
      closeGradeModal();
      
    } catch (err) {
      console.error('❌ Error al calificar proyecto:', err);
      alert(`Error al calificar proyecto: ${err.message}`);
    } finally {
      setGradingProject(false);
    }
  };

  // 📋 Funciones helper para obtener nombres a partir de códigos/IDs
  const getLineaName = (codigoLinea) => {
    if (!codigoLinea) return 'No asignada';
    return lineasMap.get(codigoLinea) || `Línea ${codigoLinea}`;
  };

  const getSublineaName = (codigoSublinea) => {
    if (!codigoSublinea) return 'No asignada';
    return sublineasMap.get(codigoSublinea) || `Sublínea ${codigoSublinea}`;
  };

  const getAreaName = (codigoArea) => {
    if (!codigoArea) return 'No asignada';
    return areasMap.get(codigoArea) || `Área ${codigoArea}`;
  };

  const getEventoName = (idEvento) => {
    if (!idEvento) return 'No asignado';
    return eventosMap.get(idEvento) || `Evento ${idEvento}`;
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
                <h1 className="text-lg font-bold text-gray-900">Expo-software</h1>
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
            <div className="bg-gradient-to-r from-white to-gray-50 rounded-xl border border-gray-200 p-6 mb-6 shadow-sm">
              <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
                {/* Búsqueda */}
                <div className="relative flex-1 w-full lg:w-auto max-w-md">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <i className="pi pi-search text-gray-400"></i>
                  </div>
                  <input
                    type="text"
                    placeholder="Buscar por título, materia o estudiante..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery("")}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      <i className="pi pi-times"></i>
                    </button>
                  )}
                </div>

                {/* Filtros */}
                <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center w-full lg:w-auto">
                  <div className="flex items-center gap-2">
                    <i className="pi pi-filter text-gray-500 text-sm"></i>
                    <span className="text-sm font-medium text-gray-700">Filtros:</span>
                  </div>

                  <select
                    value={selectedMateria}
                    onChange={(e) => {
                      setSelectedMateria(e.target.value);
                      setSelectedGroup('Filtrar por grupo');
                    }}
                    className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200 min-w-[180px]"
                    disabled={materiasList.length === 0}
                  >
                    <option value="Filtrar por materia">
                      {materiasList.length === 0 ? 'No hay materias' : 'Todas las materias'}
                    </option>
                    {materiasList.length > 0 && materiasList.map((m, idx) => (
                      <option key={idx} value={(m.codigo || m.code || m.id || '').toString()}>
                        {m.nombre || m.name || m.title || m.codigo || m.id}
                      </option>
                    ))}
                  </select>

                  <select
                    value={selectedGroup}
                    onChange={(e) => setSelectedGroup(e.target.value)}
                    className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200 min-w-[160px]"
                    disabled={!selectedMateria || selectedMateria === 'Filtrar por materia' || gruposList.length === 0}
                  >
                    <option value="Filtrar por grupo">
                      {!selectedMateria || selectedMateria === 'Filtrar por materia'
                        ? 'Seleccione materia'
                        : gruposList.length === 0 ? 'No hay grupos' : 'Todos los grupos'}
                    </option>
                    {gruposList.length > 0 && gruposList.map((g, idx) => (
                      <option key={idx} value={(g.id_grupo || g.id || g.codigo || g.group_code || g.nombre || '').toString()}>
                        {g.nombre || g.name || g.nombre_grupo || String(g.id_grupo || g.id || g.codigo)}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Mensajes informativos */}
              <div className="flex flex-col sm:flex-row gap-3 mt-4">
                {materiasList.length === 0 && projects.length > 0 && (
                  <div className="flex items-center gap-2 p-3 bg-blue-50 border border-blue-200 rounded-lg text-sm text-blue-800">
                    <i className="pi pi-info-circle text-blue-600"></i>
                    <span>
                      <strong>Nota:</strong> Los filtros se generan automáticamente de tus proyectos existentes.
                    </span>
                  </div>
                )}
                {materiasList.length === 0 && projects.length === 0 && (
                  <div className="flex items-center gap-2 p-3 bg-amber-50 border border-amber-200 rounded-lg text-sm text-amber-800">
                    <i className="pi pi-exclamation-triangle text-amber-600"></i>
                    <span>
                      <strong>Nota:</strong> No tienes proyectos asignados. Los filtros estarán disponibles cuando tengas proyectos.
                    </span>
                  </div>
                )}
                {searchQuery && (
                  <div className="flex items-center gap-2 p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-sm text-emerald-800">
                    <i className="pi pi-search text-emerald-600"></i>
                    <span>
                      <strong>Búsqueda:</strong> "{searchQuery}" - {filteredProjects.length} resultado(s)
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Controles de vista y estadísticas */}
            <div className="bg-gradient-to-r from-emerald-50 to-blue-50 rounded-xl border border-emerald-200 p-4 mb-6 shadow-sm">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                {/* Estadísticas */}
                <div className="flex flex-wrap items-center gap-4">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-emerald-500 rounded-full"></div>
                    <span className="text-sm font-medium text-gray-700">
                      {filteredProjects.length} de {projects.length} proyectos
                    </span>
                  </div>

                  {filteredProjects.length !== projects.length && (
                    <button
                      onClick={() => {
                        setSearchQuery("");
                        setSelectedMateria("Filtrar por materia");
                        setSelectedGroup("Filtrar por grupo");
                      }}
                      className="text-xs text-emerald-600 hover:text-emerald-700 font-medium underline transition-colors"
                    >
                      Limpiar filtros
                    </button>
                  )}

                  {/* Indicadores de estado */}
                  <div className="flex gap-2">
                    {projects.filter(p => p.calificacion >= 3.0).length > 0 && (
                      <div className="flex items-center gap-1 px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span>{projects.filter(p => p.calificacion >= 3.0).length} Aprobados</span>
                      </div>
                    )}
                    {projects.filter(p => p.calificacion < 3.0 && p.calificacion !== null).length > 0 && (
                      <div className="flex items-center gap-1 px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs">
                        <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                        <span>{projects.filter(p => p.calificacion < 3.0 && p.calificacion !== null).length} Reprobados</span>
                      </div>
                    )}
                    {projects.filter(p => p.calificacion === null && p.activo).length > 0 && (
                      <div className="flex items-center gap-1 px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs">
                        <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                        <span>{projects.filter(p => p.calificacion === null && p.activo).length} Pendientes</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Controles de vista */}
                <div className="flex items-center gap-2 bg-white rounded-lg p-1 border border-gray-200 shadow-sm">
                  <button
                    onClick={() => setViewMode("grid")}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 flex items-center gap-2 ${
                      viewMode === "grid"
                        ? "bg-emerald-500 text-white shadow-sm"
                        : "text-gray-600 hover:text-gray-800 hover:bg-gray-50"
                    }`}
                  >
                    <i className="pi pi-th-large"></i>
                    <span className="hidden sm:inline">Tarjetas</span>
                  </button>
                  <button
                    onClick={() => setViewMode("table")}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 flex items-center gap-2 ${
                      viewMode === "table"
                        ? "bg-emerald-500 text-white shadow-sm"
                        : "text-gray-600 hover:text-gray-800 hover:bg-gray-50"
                    }`}
                  >
                    <i className="pi pi-list"></i>
                    <span className="hidden sm:inline">Tabla</span>
                  </button>
                </div>
              </div>
            </div>
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
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 gap-6">
                    {filteredProjects.map(project => (
                      <div key={project.id_proyecto} className="group bg-white rounded-xl border border-gray-200 hover:border-emerald-300 hover:shadow-xl transition-all duration-300 overflow-hidden">
                        {/* Header con gradiente */}
                        <div className="bg-gradient-to-r from-emerald-500 to-teal-600 p-4 text-white">
                          <div className="flex items-start justify-between">
                            <div className="flex-1 min-w-0">
                              <h3 className="text-lg font-bold truncate mb-1" title={project.titulo_proyecto}>
                                {project.titulo_proyecto || 'Sin título'}
                              </h3>
                              <div className="flex items-center gap-2 text-emerald-100 text-sm">
                                <i className="pi pi-calendar text-xs"></i>
                                <span>{project.fecha_subida ? new Date(project.fecha_subida).toLocaleDateString('es-ES') : 'Fecha no disponible'}</span>
                              </div>
                            </div>
                            {/* Badge de estado */}
                            <div className={`px-2 py-1 rounded-full text-xs font-semibold ${
                              project.calificacion >= 3.0 ? "bg-green-500 text-white" :
                              project.calificacion < 3.0 && project.calificacion !== null ? "bg-red-500 text-white" :
                              project.activo ? "bg-yellow-500 text-white" : "bg-gray-500 text-white"
                            }`}>
                              {project.calificacion >= 3.0 ? "Aprobado" :
                               project.calificacion < 3.0 && project.calificacion !== null ? "Reprobado" :
                               project.activo ? "Pendiente" : "Inactivo"}
                            </div>
                          </div>
                        </div>

                        {/* Contenido principal */}
                        <div className="p-5">
                          {/* Información del proyecto */}
                          <div className="space-y-3 mb-4">
                            <div className="flex items-center gap-3 text-sm text-gray-600">
                              <div className="flex items-center gap-2">
                                <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center">
                                  <i className="pi pi-users text-emerald-600 text-sm"></i>
                                </div>
                                <span className="font-medium">{project.id_estudiantes?.length || 0} estudiante(s)</span>
                              </div>
                            </div>

                            <div className="flex items-center gap-3 text-sm text-gray-600">
                              <div className="flex items-center gap-2">
                                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                                  <i className="pi pi-book text-blue-600 text-sm"></i>
                                </div>
                                <span>{project.codigo_materia || 'Sin materia'} - Grupo {project.id_grupo || 'N/A'}</span>
                              </div>
                            </div>

                            {/* Tipo de actividad */}
                            <div className="flex items-center gap-2">
                              <span className="text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded-full font-medium">
                                {project.tipo_actividad === 1 ? '📚 Proyecto' :
                                 project.tipo_actividad === 2 ? '🛠️ Taller' :
                                 project.tipo_actividad === 3 ? '🎤 Ponencia' :
                                 project.tipo_actividad === 4 ? '🎭 Conferencia' : '❓ No especificado'}
                              </span>
                            </div>
                          </div>

                          {/* Líneas de investigación (si hay espacio) */}
                          {(project.codigo_linea || project.codigo_sublinea) && (
                            <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                              <p className="text-xs text-gray-500 mb-1">Línea de investigación</p>
                              <p className="text-sm font-medium text-gray-900 truncate">
                                {getLineaName(project.codigo_linea) || 'No asignada'}
                              </p>
                              {project.codigo_sublinea && (
                                <p className="text-xs text-gray-600 mt-1 truncate">
                                  {getSublineaName(project.codigo_sublinea)}
                                </p>
                              )}
                            </div>
                          )}

                          {/* Calificación si existe */}
                          {project.calificacion && (
                            <div className="mb-4 flex items-center justify-center">
                              <div className={`px-4 py-2 rounded-lg font-bold text-lg ${
                                project.calificacion >= 3.0 ? "bg-green-100 text-green-800" :
                                project.calificacion < 3.0 ? "bg-red-100 text-red-800" :
                                "bg-gray-100 text-gray-800"
                              }`}>
                                <i className="pi pi-pencil text-yellow-500"></i> {project.calificacion}/5.0
                              </div>
                            </div>
                          )}

                          {/* Acciones */}
                          <div className="flex gap-2 pt-3 border-t border-gray-100">
                            <button
                              onClick={() => handleViewDetails(project)}
                              className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-emerald-50 text-emerald-700 rounded-lg hover:bg-emerald-100 transition-colors text-sm font-medium"
                            >
                              <i className="pi pi-eye"></i>
                              <span className="hidden sm:inline">Ver detalles</span>
                            </button>
                            <button
                              onClick={() => handleOpenGradeModal(project)}
                              className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors text-sm font-medium"
                            >
                              <i className="pi pi-pencil"></i>
                              <span className="hidden sm:inline">{project.calificacion ? 'Editar' : 'Calificar'}</span>
                            </button>
                          </div>
                        </div>

                        {/* Efecto hover adicional */}
                        <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/5 to-teal-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none rounded-xl"></div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Vista de Tabla */}
            {viewMode === "table" && (
              <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">Proyecto</th>
                        <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">Estudiantes</th>
                        <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">Materia/Grupo</th>
                        <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">Tipo</th>
                        <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">Estado</th>
                        <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredProjects.map((project, index) => (
                        <tr key={project.id_proyecto} className={`border-b border-gray-100 hover:bg-gradient-to-r hover:from-emerald-50 hover:to-teal-50 transition-all duration-200 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50/30'}`}>
                          <td className="py-4 px-6">
                            <div className="flex items-start gap-3">
                              <div className="w-10 h-10 bg-gradient-to-br from-emerald-100 to-teal-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                <i className="pi pi-folder-open text-emerald-600 text-sm"></i>
                              </div>
                              <div className="min-w-0 flex-1">
                                <p className="text-sm font-semibold text-gray-900 truncate" title={project.titulo_proyecto}>
                                  {project.titulo_proyecto || 'Sin título'}
                                </p>
                                <p className="text-xs text-gray-500 mt-1">
                                  {project.fecha_subida ? new Date(project.fecha_subida).toLocaleDateString('es-ES') : 'Fecha no disponible'}
                                </p>
                              </div>
                            </div>
                          </td>
                          <td className="py-4 px-6">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center">
                                <i className="pi pi-users text-emerald-600 text-xs"></i>
                              </div>
                              <span className="text-sm font-medium text-gray-900">{project.id_estudiantes?.length || 0}</span>
                              <span className="text-xs text-gray-500">estudiante(s)</span>
                            </div>
                          </td>
                          <td className="py-4 px-6">
                            <div className="text-sm text-gray-900">
                              <p className="font-medium">{project.codigo_materia || 'N/A'}</p>
                              <p className="text-gray-500">Grupo {project.id_grupo || 'N/A'}</p>
                            </div>
                          </td>
                          <td className="py-4 px-6">
                            <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                              project.tipo_actividad === 1 ? "bg-blue-100 text-blue-800" :
                              project.tipo_actividad === 2 ? "bg-orange-100 text-orange-800" :
                              project.tipo_actividad === 3 ? "bg-purple-100 text-purple-800" :
                              project.tipo_actividad === 4 ? "bg-indigo-100 text-indigo-800" :
                              "bg-gray-100 text-gray-800"
                            }`}>
                              {project.tipo_actividad === 1 ? '📚 Proyecto' :
                               project.tipo_actividad === 2 ? '🛠️ Taller' :
                               project.tipo_actividad === 3 ? '🎤 Ponencia' :
                               project.tipo_actividad === 4 ? '🎭 Conferencia' : '❓ No especificado'}
                            </span>
                          </td>
                          <td className="py-4 px-6">
                            <div className="flex flex-col gap-1">
                              <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold w-fit ${
                                project.calificacion >= 3.0 ? "bg-green-100 text-green-800" :
                                project.calificacion < 3.0 && project.calificacion !== null ? "bg-red-100 text-red-800" :
                                project.activo ? "bg-yellow-100 text-yellow-800" : "bg-gray-100 text-gray-800"
                              }`}>
                                {project.calificacion >= 3.0 ? "✅ Aprobado" :
                                 project.calificacion < 3.0 && project.calificacion !== null ? "❌ Reprobado" :
                                 project.activo ? "⏳ Pendiente" : "🚫 Inactivo"}
                              </span>
                              {project.calificacion && (
                                <span className="text-xs text-gray-500 font-medium">
                                  <i className="pi pi-pencil text-yellow-500"></i> {project.calificacion}/5.0
                                </span>
                              )}
                            </div>
                          </td>
                          <td className="py-4 px-6">
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => handleViewDetails(project)}
                                className="flex items-center gap-2 px-3 py-2 bg-emerald-50 text-emerald-700 rounded-lg hover:bg-emerald-100 transition-colors text-sm font-medium"
                                title="Ver detalles del proyecto"
                              >
                                <i className="pi pi-eye"></i>
                                <span className="hidden md:inline">Ver</span>
                              </button>
                              <button
                                onClick={() => handleOpenGradeModal(project)}
                                className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors text-sm font-medium ${
                                  project.calificacion
                                    ? "bg-amber-50 text-amber-700 hover:bg-amber-100"
                                    : "bg-blue-50 text-blue-700 hover:bg-blue-100"
                                }`}
                                title={project.calificacion ? "Editar calificación" : "Calificar proyecto"}
                              >
                                <i className="pi pi-pencil"></i>
                                <span className="hidden md:inline">{project.calificacion ? 'Editar' : 'Calificar'}</span>
                              </button>
                            </div>
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
                  <h4 className="text-2xl font-bold text-gray-900 mb-2">{selectedProject.titulo_proyecto || 'Sin título'}</h4>
                  <div className="flex items-center gap-3 text-sm text-gray-600">
                    <span className="flex items-center gap-1">
                      <i className="pi pi-users"></i>
                      {selectedProject.id_estudiantes?.length || 0} estudiante(s)
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <i className="pi pi-book"></i>
                      {selectedProject.codigo_materia || 'N/A'} - Grupo {selectedProject.id_grupo || 'N/A'}
                    </span>
                  </div>
                </div>
                <span className={`px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap ${
                  selectedProject.calificacion 
                    ? "bg-emerald-100 text-emerald-800"
                    : selectedProject.activo
                    ? "bg-yellow-100 text-yellow-800"
                    : "bg-gray-100 text-gray-800"
                }`}>
                  {selectedProject.calificacion ? `Calificado: ${selectedProject.calificacion}` : selectedProject.activo ? 'Pendiente' : 'Inactivo'}
                </span>
              </div>

              {/* Descripción */}
              <div>
                <h5 className="text-sm font-semibold text-gray-900 mb-2 flex items-center gap-2">
                  <i className="pi pi-align-left text-emerald-600"></i>
                  Información del Proyecto
                </h5>
                <div className="text-sm text-gray-700 leading-relaxed bg-gray-50 p-4 rounded-lg space-y-2">
                  <p><span className="font-medium">Tipo de Actividad:</span> {
                    selectedProject.tipo_actividad === 1 ? 'Proyecto (Exposoftware)' :
                    selectedProject.tipo_actividad === 2 ? 'Taller' :
                    selectedProject.tipo_actividad === 3 ? 'Ponencia' :
                    selectedProject.tipo_actividad === 4 ? 'Conferencia' : 'No especificado'
                  }</p>
                  <p><span className="font-medium">Fecha de Subida:</span> {selectedProject.fecha_subida ? new Date(selectedProject.fecha_subida).toLocaleDateString('es-ES') : 'No disponible'}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Información del Proyecto */}
                <div className="space-y-4">
                  <h5 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <i className="pi pi-info-circle text-emerald-600"></i>
                    Información Adicional
                  </h5>

                  <div className="bg-gray-50 p-4 rounded-lg space-y-3">
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Materia</p>
                      <p className="text-sm font-medium text-gray-900">{selectedProject.codigo_materia || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Grupo</p>
                      <p className="text-sm font-medium text-gray-900">Grupo {selectedProject.id_grupo || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Evento</p>
                      <p className="text-sm font-medium text-gray-900">{getEventoName(selectedProject.id_evento)}</p>
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
                      <p className="text-sm font-medium text-gray-900">{getLineaName(selectedProject.codigo_linea)}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Sublínea</p>
                      <p className="text-sm font-medium text-gray-900">{getSublineaName(selectedProject.codigo_sublinea)}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Área</p>
                      <p className="text-sm font-medium text-gray-900">{getAreaName(selectedProject.codigo_area)}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Participantes */}
              <div>
                <h5 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <i className="pi pi-users text-emerald-600"></i>
                  Estudiantes Participantes
                </h5>
                <div className="flex flex-wrap gap-2">
                  {selectedProject.id_estudiantes && selectedProject.id_estudiantes.length > 0 ? (
                    selectedProject.id_estudiantes.map((estudiante, idx) => {
                      const nombreEstudiante = typeof estudiante === 'object' ? estudiante.nombre : `Estudiante ${idx + 1}`;
                      const idEstudiante = typeof estudiante === 'object' ? estudiante.id_estudiante : estudiante;
                      return (
                        <span 
                          key={idx}
                          className="inline-flex items-center gap-2 bg-emerald-50 text-emerald-800 px-3 py-2 rounded-full text-sm font-medium"
                        >
                          <div className="w-6 h-6 bg-emerald-200 rounded-full flex items-center justify-center">
                            <i className="pi pi-user text-emerald-800 text-xs"></i>
                          </div>
                          {nombreEstudiante}
                        </span>
                      );
                    })
                  ) : (
                    <span className="text-sm text-gray-500">No hay estudiantes asignados</span>
                  )}
                </div>
              </div>

              {/* Archivos Adjuntos */}
              <div>
                <h5 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <i className="pi pi-paperclip text-emerald-600"></i>
                  Archivos Adjuntos
                </h5>
                {selectedProject.archivo_pdf ? (
                  <div className="grid grid-cols-1 gap-3">
                    <div className="border border-gray-200 rounded-lg p-3 flex items-center gap-3 hover:bg-gray-50 transition-colors">
                      <div className="w-10 h-10 bg-red-100 rounded flex items-center justify-center flex-shrink-0">
                        <i className="pi pi-file-pdf text-red-600 text-lg"></i>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">Documento del Proyecto</p>
                        <p className="text-xs text-gray-500">PDF</p>
                      </div>
                      <a 
                        href={selectedProject.archivo_pdf} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-emerald-600 hover:text-emerald-700"
                      >
                        <i className="pi pi-external-link"></i>
                      </a>
                    </div>
                  </div>
                ) : (
                  <p className="text-sm text-gray-500 bg-gray-50 p-4 rounded-lg">No hay archivos adjuntos</p>
                )}
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
            </div>
          </div>
        </div>
      )}

      {/* Modal de Calificación */}
      {showGradeModal && projectToGrade && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full">
            {/* Header */}
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  <i className="pi pi-pencil text-yellow-500"></i>
                  Calificar Proyecto
                </h3>
                <button 
                  onClick={closeGradeModal}
                  disabled={gradingProject}
                  className="text-gray-400 hover:text-gray-600 transition-colors disabled:opacity-50"
                >
                  <i className="pi pi-times text-xl"></i>
                </button>
              </div>
            </div>

            {/* Body */}
            <div className="p-6 space-y-4">
              {/* Información del proyecto */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm font-medium text-blue-900 mb-1">Proyecto:</p>
                <p className="text-base font-semibold text-blue-800">{projectToGrade.titulo_proyecto}</p>
                {projectToGrade.calificacion && (
                  <p className="text-sm text-blue-700 mt-2">
                    Calificación actual: <span className="font-bold">{projectToGrade.calificacion}</span>
                  </p>
                )}
              </div>

              {/* Input de calificación */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Calificación (0.0 - 5.0)
                </label>
                <input
                  type="number"
                  min="0"
                  max="5"
                  step="0.1"
                  value={gradeValue}
                  onChange={(e) => setGradeValue(e.target.value)}
                  disabled={gradingProject}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed text-lg font-semibold text-center"
                  placeholder="Ej: 4.5"
                />
                <div className="flex justify-between mt-2 text-xs text-gray-500">
                  <span>Mínimo: 0.0</span>
                  <span>Máximo: 5.0</span>
                </div>
              </div>

              {/* Información adicional */}
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                <p className="text-xs text-gray-600">
                  <strong>Nota:</strong> Si la nota es mayor o igual a 3.0, el proyecto será marcado como 
                  <span className="text-green-600 font-semibold"> aprobado</span>. 
                  Si es menor a 3.0, será marcado como 
                  <span className="text-red-600 font-semibold"> reprobado</span>.
                </p>
              </div>
            </div>

            {/* Footer */}
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex items-center justify-end gap-3 rounded-b-xl">
              <button 
                onClick={closeGradeModal}
                disabled={gradingProject}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancelar
              </button>
              <button 
                onClick={handleGradeProject}
                disabled={gradingProject || !gradeValue}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {gradingProject ? (
                  <>
                    <i className="pi pi-spin pi-spinner"></i>
                    Guardando...
                  </>
                ) : (
                  <>
                    <i className="pi pi-check"></i>
                    Guardar Calificación
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
