import { useState, useMemo, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { getTeacherProfile } from "../../Services/TeacherService";
import { getTeacherProjects } from "../../Services/ProjectsService.jsx";
import ResearchLinesService from "../../Services/ResearchLinesService.jsx";
import logo from "../../assets/Logo-unicesar.png";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import ReportGenerator from "../../components/ReportGenerator";

// Main Dashboard Component
export default function TeacherDashboard() {
  const { user, getFullName, getInitials, logout, loading } = useAuth();
  const navigate = useNavigate();
  const [selectedMateria, setSelectedMateria] = useState("Todas");
  const [selectedGrupo, setSelectedGrupo] = useState("Todos");
  const [searchQuery, setSearchQuery] = useState("");
  const [proyectos, setProyectos] = useState([]);
  const [metricasProyectos, setMetricasProyectos] = useState({
    total: 0,
    aprobados: 0,
    pendientes: 0,
    reprobados: 0
  });
  const [cargandoProyectos, setCargandoProyectos] = useState(false);
  const [error, setError] = useState(null);  
  const [lineasMap, setLineasMap] = useState(new Map());
  const [sublineasMap, setSublineasMap] = useState(new Map());
  const [areasMap, setAreasMap] = useState(new Map());
  const [eventosMap, setEventosMap] = useState(new Map());  
  const filteredEstudiantes = useMemo(() => {
    return [];
  }, [searchQuery, selectedMateria, selectedGrupo]);

  // Estado para controlar si los mapas están cargados
  const [mapasCargados, setMapasCargados] = useState(false);

  // Funciones helper para obtener nombres
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

  // Datos para la gráfica de pastel - Estado de Proyectos
  const pieChartData = useMemo(() => {
    return [
      {
        name: 'Aprobados',
        value: metricasProyectos.aprobados,
        color: '#10B981' // Verde
      },
      {
        name: 'Reprobados',
        value: metricasProyectos.reprobados,
        color: '#e40606ff' // Rojo
      },
      {
        name: 'Pendientes',
        value: metricasProyectos.pendientes,
        color: '#F97316' // Naranja
      }
    ].filter(item => item.value > 0); // Solo mostrar categorías con valores
  }, [metricasProyectos]);

  // Datos para la gráfica de líneas de investigación
  const lineasChartData = useMemo(() => {
    const lineasCount = {};
    
    proyectos.forEach(proyecto => {
      if (proyecto.codigo_linea) {
        const lineaNombre = getLineaName(proyecto.codigo_linea);
        lineasCount[lineaNombre] = (lineasCount[lineaNombre] || 0) + 1;
      }
    });

    // Colores para las líneas de investigación
    const colores = ['#08973fff', '#decb3fff', '#06B6D4', '#10B981', '#F59E0B', '#EF4444', '#48d3ecff', '#63f189ff'];
    
    return Object.entries(lineasCount).map(([lineaNombre, count], index) => ({
      name: lineaNombre,
      value: count,
      color: colores[index % colores.length]
    })).sort((a, b) => b.value - a.value); // Ordenar por cantidad descendente
  }, [proyectos, lineasMap, mapasCargados]);

  // Cargar proyectos cuando se monta el componente
  useEffect(() => {
    const loadProjects = async () => {
      try {
        setCargandoProyectos(true);
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
        setProyectos(data);
        console.log('✅ Proyectos del docente cargados:', data.length);
        
        // Calcular métricas
        const total = data.length;
        
        // Debug: Ver qué campos tienen los proyectos para determinar estado
        if (data.length > 0) {
          console.log('🔍 DEBUG - Campos del primer proyecto:', Object.keys(data[0]));
          console.log('🔍 DEBUG - Primer proyecto completo:', data[0]);
          console.log('🔍 DEBUG - calificacion:', data[0].calificacion);
          console.log('🔍 DEBUG - estado_calificacion:', data[0].estado_calificacion);
        }
        
        const aprobados = data.filter(p => {
          // Si tiene estado_calificacion, usarlo
          if (p.estado_calificacion) {
            return p.estado_calificacion === 'aprobado';
          }
          // Si no, usar calificacion numérica (>= 3.0 = aprobado)
          if (p.calificacion !== null && p.calificacion !== undefined) {
            return p.calificacion >= 3.0;
          }
          // Si no tiene ninguno, considerar como pendiente
          return false;
        }).length;
        
        const pendientes = data.filter(p => {
          // Si tiene estado_calificacion, usarlo
          if (p.estado_calificacion) {
            return p.estado_calificacion === 'pendiente';
          }
          // Si no tiene calificacion o estado_calificacion, es pendiente
          return !p.calificacion && !p.estado_calificacion;
        }).length;
        
        const reprobados = data.filter(p => {
          // Si tiene estado_calificacion, usarlo
          if (p.estado_calificacion) {
            return p.estado_calificacion === 'reprobado';
          }
          // Si no, usar calificacion numérica (< 3.0 = reprobado)
          if (p.calificacion !== null && p.calificacion !== undefined) {
            return p.calificacion < 3.0;
          }
          // Si no tiene ninguno, no es reprobado
          return false;
        }).length;
        
        setMetricasProyectos({
          total,
          aprobados,
          pendientes,
          reprobados
        });
        
        // Cargar mapas de líneas de investigación de manera asíncrona (no bloqueante)
        if (data.length > 0) {
          // Cargar mapas en background para mejor rendimiento
          ResearchLinesService.obtenerMapasInvestigacion()
            .then(mapas => {
              console.log('✅ Mapas de investigación cargados:', mapas);
              setLineasMap(mapas.lineasMap);
              setSublineasMap(mapas.sublineasMap);
              setAreasMap(mapas.areasMap);
              setMapasCargados(true);
            })
            .catch(error => {
              console.warn('⚠️ No se pudieron cargar los mapas de investigación:', error.message);
              // Mantener los mapas básicos creados anteriormente
              const lineasUnicas = new Map();
              const sublineasUnicas = new Map();
              const areasUnicas = new Map();
              const eventosUnicos = new Map();

              data.forEach(proyecto => {
                if (proyecto.codigo_linea && !lineasUnicas.has(proyecto.codigo_linea)) {
                  lineasUnicas.set(proyecto.codigo_linea, `Línea ${proyecto.codigo_linea}`);
                }
                if (proyecto.codigo_sublinea && !sublineasUnicas.has(proyecto.codigo_sublinea)) {
                  sublineasUnicas.set(proyecto.codigo_sublinea, `Sublínea ${proyecto.codigo_sublinea}`);
                }
                if (proyecto.codigo_area && !areasUnicas.has(proyecto.codigo_area)) {
                  areasUnicas.set(proyecto.codigo_area, `Área ${proyecto.codigo_area}`);
                }
                if (proyecto.id_evento && !eventosUnicos.has(proyecto.id_evento)) {
                  eventosUnicos.set(proyecto.id_evento, `Evento ${proyecto.id_evento}`);
                }
              });

              setLineasMap(lineasUnicas);
              setSublineasMap(sublineasUnicas);
              setAreasMap(areasUnicas);
              setEventosMap(eventosUnicos);
              setMapasCargados(true);
            });
        }
      } catch (err) {
        console.error('❌ Error al cargar proyectos:', err);
        setError(err.message);
        setMetricasProyectos({
          total: 0,
          aprobados: 0,
          pendientes: 0,
          reprobados: 0
        });
      } finally {
        setCargandoProyectos(false);
      }
    };

    loadProjects();
  }, [user]);

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

  // Funciones de exportación usando ReportGenerator
  const exportarGraficaComoImagen = (chartId, fileName) => {
    ReportGenerator.exportarGraficaComoImagen(chartId, fileName);
  };

  const exportarGraficaComoPDF = (chartId, title, data) => {
    ReportGenerator.exportarGraficaComoPDF(chartId, title, data, { 
      name: getFullName(),
      category: user?.categoria_docente || 'No especificada'
    });
  };

  const exportarReporteCompleto = () => {
    ReportGenerator.exportarReporteCompleto({
      userInfo: { 
        name: getFullName(),
        role: 'Profesor',
        category: user?.categoria_docente || 'No especificada',
        programCode: user?.codigo_programa || 'No especificado'
      },
      estadisticas: metricasProyectos,
      chartIds: ['estado-proyectos-chart', 'lineas-investigacion-chart'],
      chartTitles: ['Estado de Proyectos', 'Líneas de Investigación'],
      chartData: [pieChartData, lineasChartData],
      institutionName: 'Universidad Popular del Cesar',
      eventName: 'Expo-software 2025'
    });
  };

  // Mostrar loading mientras se cargan los datos del usuario
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-green-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
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
          
          <aside className="lg:col-span-1">
            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <nav className="space-y-1">
                <Link
                  to="/teacher/dashboard"
                  className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors bg-emerald-50 text-emerald-700"
                >
                  <i className="pi pi-home text-base"></i>
                  Dashboard
                </Link>
                <Link
                  to="/teacher/proyectos"
                  className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors text-gray-700 hover:bg-gray-50"
                >
                  <i className="pi pi-book text-base"></i>
                  Proyectos Estudiantiles
                </Link>
                <Link
                  to="/teacher/profile"
                  className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors text-gray-700 hover:bg-gray-50"
                >
                  <i className="pi pi-cog text-base"></i>
                  Configuración
                </Link>
              </nav>
            </div>

            {/* User Info */}
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

          <main className="lg:col-span-3">
            <div className="mb-8">
              <div className="flex items-center gap-4 mb-2">
                <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center shadow-lg">
                  <i className="pi pi-chart-line text-white text-xl"></i>
                </div>
                <div>
                  <h2 className="text-3xl font-bold text-gray-900">Bienvenido, {user?.nombres || 'Docente'}</h2>
                  <p className="text-gray-600">Resumen completo de la convocatoria y proyectos</p>
                </div>
              </div>
              <div className="h-1 w-24 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-full"></div>
            </div>

            {/* Tarjetas de métricas */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-6 mb-8">
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl border border-blue-200 p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-blue-700 mb-1">Total proyectos</p>
                    <h3 className="text-3xl font-bold text-blue-900">
                      {loading ? "..." : metricasProyectos.total}
                    </h3>
                  </div>
                  <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                    <i className="pi pi-folder-open text-white text-xl"></i>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-xl border border-emerald-200 p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-emerald-700 mb-1">Aprobados</p>
                    <h3 className="text-3xl font-bold text-emerald-900">
                      {cargandoProyectos ? "..." : metricasProyectos.aprobados}
                    </h3>
                  </div>
                  <div className="w-14 h-14 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg">
                    <i className="pi pi-check text-white text-xl"></i>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-amber-50 to-amber-100 rounded-xl border border-amber-200 p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-amber-700 mb-1">Pendientes</p>
                    <h3 className="text-3xl font-bold text-amber-900">
                      {cargandoProyectos ? "..." : metricasProyectos.pendientes}
                    </h3>
                  </div>
                  <div className="w-14 h-14 bg-gradient-to-br from-amber-500 to-amber-600 rounded-xl flex items-center justify-center shadow-lg">
                    <i className="pi pi-clock text-white text-xl"></i>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-xl border border-red-200 p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-red-700 mb-1">Reprobados</p>
                    <h3 className="text-3xl font-bold text-red-900">
                      {cargandoProyectos ? "..." : metricasProyectos.reprobados}
                    </h3>
                  </div>
                  <div className="w-14 h-14 bg-gradient-to-br from-red-500 to-red-600 rounded-xl flex items-center justify-center shadow-lg">
                    <i className="pi pi-times text-white text-xl"></i>
                  </div>
                </div>
              </div>
            </div>

            {/* Botón Exportar Reporte Completo */}
                <div className="flex justify-end mb-4">
                  <button
                    onClick={exportarReporteCompleto}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-lg font-medium hover:from-emerald-700 hover:to-teal-700 transition-all duration-300 shadow-lg hover:shadow-xl"
                  >
                    <i className="pi pi-file-pdf"></i>
                    Exportar Reporte Completo
                  </button>
                </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              {/* Gráfica de pastel - Estado de Proyectos */}
              <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-lg hover:shadow-xl transition-shadow duration-300">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg flex items-center justify-center">
                      <i className="pi pi-chart-pie text-white text-sm"></i>
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-gray-900">Estado de Proyectos</h3>
                      <p className="text-sm text-gray-600">Distribución por calificación</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => exportarGraficaComoImagen('estado-proyectos-chart', 'Estado_Proyectos')}
                      className="p-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-600 rounded-lg transition-colors duration-200"
                      title="Exportar como imagen"
                    >
                      <i className="pi pi-image text-lg"></i>
                    </button>
                    <button
                      onClick={() => exportarGraficaComoPDF('estado-proyectos-chart', 'Estado de Proyectos', pieChartData)}
                      className="p-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg transition-colors duration-200"
                      title="Exportar como PDF"
                    >
                      <i className="pi pi-file-pdf text-lg"></i>
                    </button>
                  </div>
                </div>
                {cargandoProyectos ? (
                  <div className="h-64 flex items-center justify-center">
                    <div className="w-8 h-8 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin"></div>
                  </div>
                ) : pieChartData.length > 0 ? (
                  <div id="estado-proyectos-chart" className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={pieChartData}
                          cx="50%"
                          cy="50%"
                          outerRadius={80}
                          paddingAngle={3}
                          dataKey="value"
                          label={({ name, percent }) => `${(percent * 100).toFixed(0)}%`}
                          labelLine={false}
                        >
                          {pieChartData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip
                          formatter={(value, name) => [`${value} proyecto${value !== 1 ? 's' : ''}`, name]}
                          contentStyle={{
                            backgroundColor: 'white',
                            border: '1px solid #e5e7eb',
                            borderRadius: '12px',
                            boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)',
                            fontSize: '14px'
                          }}
                        />
                        <Legend
                          verticalAlign="bottom"
                          height={40}
                          formatter={(value, entry) => (
                            <span style={{ color: entry.color, fontWeight: '500' }}>
                              {value}: {entry.payload.value}
                            </span>
                          )}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                ) : (
                  <div className="h-64 flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl">
                    <div className="text-center">
                      <i className="pi pi-chart-pie text-4xl text-gray-400 mb-2"></i>
                      <p className="text-gray-500 text-sm">No hay datos para mostrar</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Gráfica de líneas de investigación */}
              <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-lg hover:shadow-xl transition-shadow duration-300">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                      <i className="pi pi-sitemap text-white text-sm"></i>
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-gray-900">Líneas de Investigación</h3>
                      <p className="text-sm text-gray-600">Distribución por línea</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => exportarGraficaComoImagen('lineas-investigacion-chart', 'Lineas_Investigacion')}
                      className="p-2 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-lg transition-colors duration-200"
                      title="Exportar como imagen"
                    >
                      <i className="pi pi-image text-lg"></i>
                    </button>
                    <button
                      onClick={() => exportarGraficaComoPDF('lineas-investigacion-chart', 'Líneas de Investigación', lineasChartData)}
                      className="p-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg transition-colors duration-200"
                      title="Exportar como PDF"
                    >
                      <i className="pi pi-file-pdf text-lg"></i>
                    </button>
                  </div>
                </div>
                <p className="text-sm text-gray-600 mb-6 bg-blue-50 border border-blue-200 rounded-lg px-3 py-2">
                  <i className="pi pi-info-circle text-blue-600 mr-2"></i>
                  {mapasCargados ? (
                    <>
                      <strong>{lineasChartData.length}</strong> líneas • <strong>{proyectos.length}</strong> proyectos
                    </>
                  ) : (
                    <>
                      <i className="pi pi-spin pi-spinner text-blue-600 mr-1"></i>
                      Cargando nombres de líneas...
                    </>
                  )}
                </p>
                {cargandoProyectos || !mapasCargados ? (
                  <div className="h-64 flex items-center justify-center">
                    <div className="text-center">
                      <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
                      <p className="text-sm text-gray-600">
                        {cargandoProyectos ? 'Cargando proyectos...' : 'Cargando nombres de líneas...'}
                      </p>
                    </div>
                  </div>
                ) : lineasChartData.length > 0 ? (
                  <div id="lineas-investigacion-chart" className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={lineasChartData}
                          cx="50%"
                          cy="50%"
                          outerRadius={85}
                          paddingAngle={3}
                          dataKey="value"
                          label={({ name, percent }) => `${(percent * 100).toFixed(0)}%`}
                          labelLine={false}
                        >
                          {lineasChartData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip
                          formatter={(value, name) => [`${value} proyecto${value !== 1 ? 's' : ''}`, name]}
                          contentStyle={{
                            backgroundColor: 'white',
                            border: '1px solid #e5e7eb',
                            borderRadius: '12px',
                            boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)',
                            fontSize: '14px'
                          }}
                        />
                        <Legend
                          verticalAlign="bottom"
                          height={40}
                          formatter={(value, entry) => (
                            <span style={{ color: entry.color, fontWeight: '500', fontSize: '13px' }}>
                              {value}: {entry.payload.value}
                            </span>
                          )}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                ) : (
                  <div className="h-64 flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl">
                    <div className="text-center">
                      <i className="pi pi-sitemap text-4xl text-gray-400 mb-2"></i>
                      <p className="text-gray-500 text-sm">No hay líneas asignadas</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}