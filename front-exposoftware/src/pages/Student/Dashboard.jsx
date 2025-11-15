import { useState, useEffect, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { obtenerMisProyectos } from "../../Services/ProjectsService.jsx";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import logo from "../../assets/Logo-unicesar.png";

export default function StudentDashboard() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const { user, getFullName, getInitials, logout, loading } = useAuth();
  const navigate = useNavigate();
  
  // Estado para métricas del estudiante
  const [metricasEstudiante, setMetricasEstudiante] = useState({
    totalProyectos: 0,
    proyectosAprobados: 0,
    proyectosReprobados: 0
  });
  const [cargandoMetricas, setCargandoMetricas] = useState(false);
  const [proyectos, setProyectos] = useState([]);

  // Log para debug
  console.log('🎯 StudentDashboard - Estado actual:');
  console.log('   - Loading:', loading);
  console.log('   - User:', user);
  console.log('   - FullName:', getFullName());
  console.log('   - Initials:', getInitials());

  // Cargar métricas del estudiante
  useEffect(() => {
    const loadStudentMetrics = async () => {
      try {
        setCargandoMetricas(true);
        
        // Esperar a que tengamos los datos del usuario
        if (!user) {
          console.log('⏳ Esperando datos del usuario...');
          return;
        }
        
        console.log('🎓 Cargando métricas del estudiante:', user);
        
        // Obtener ID del estudiante
        let estudianteId = user.id_estudiante || user.id_usuario || user.uid;
        
        if (!estudianteId) {
          console.error('❌ No se encontró ID del estudiante');
          console.error('📦 Usuario completo:', JSON.stringify(user, null, 2));
          return;
        }
        
        console.log('🎯 Usando ID del estudiante:', estudianteId);
        
        // Obtener proyectos del estudiante
        const proyectos = await obtenerMisProyectos(estudianteId);
        setProyectos(proyectos);
        console.log('✅ Proyectos del estudiante obtenidos:', proyectos.length);
        
        // Calcular métricas
        const totalProyectos = proyectos.length;
        
        // Debug: Ver qué campos tienen los proyectos para determinar estado
        if (proyectos.length > 0) {
          console.log('🔍 DEBUG - Campos del primer proyecto:', Object.keys(proyectos[0]));
          console.log('🔍 DEBUG - Primer proyecto completo:', proyectos[0]);
          console.log('🔍 DEBUG - calificacion:', proyectos[0].calificacion);
          console.log('🔍 DEBUG - estado_calificacion:', proyectos[0].estado_calificacion);
          
          // Debug específico para materia
          console.log('🔍 DEBUG - Campos relacionados con materia:');
          console.log('   - nombre_materia:', proyectos[0].nombre_materia);
          console.log('   - materia:', proyectos[0].materia);
          console.log('   - asignatura:', proyectos[0].asignatura);
          console.log('   - id_materia:', proyectos[0].id_materia);
          console.log('   - codigo_materia:', proyectos[0].codigo_materia);
          
          // Debug para sublíneas de investigación
          console.log('🔍 DEBUG - Campos relacionados con investigación:');
          console.log('   - codigo_linea:', proyectos[0].codigo_linea);
          console.log('   - nombre_linea:', proyectos[0].nombre_linea);
          console.log('   - codigo_sublinea:', proyectos[0].codigo_sublinea);
          console.log('   - nombre_sublinea:', proyectos[0].nombre_sublinea);
          console.log('   - codigo_area:', proyectos[0].codigo_area);
          console.log('   - nombre_area:', proyectos[0].nombre_area);
        }
        
        const proyectosAprobados = proyectos.filter(p => {
          // Si tiene estado_calificacion, usarlo
          if (p.estado_calificacion) {
            return p.estado_calificacion === 'aprobado';
          }
          // Si no, usar calificacion numérica (>= 3.0 = aprobado)
          if (p.calificacion !== null && p.calificacion !== undefined) {
            return p.calificacion >= 3.0;
          }
          // Si no tiene ninguno, no es aprobado
          return false;
        }).length;
        
        const proyectosReprobados = proyectos.filter(p => {
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
        
        setMetricasEstudiante({
          totalProyectos,
          proyectosAprobados,
          proyectosReprobados
        });
        
        console.log('📊 Métricas calculadas:', {
          totalProyectos,
          proyectosAprobados,
          proyectosReprobados
        });
        
      } catch (err) {
        console.error('❌ Error al cargar métricas del estudiante:', err);
        setMetricasEstudiante({
          totalProyectos: 0,
          proyectosAprobados: 0,
          proyectosReprobados: 0
        });
        setProyectos([]);
      } finally {
        setCargandoMetricas(false);
      }
    };

    loadStudentMetrics();
  }, [user]);

  // Datos para la gráfica de proyectos por materia
  const proyectosPorMateriaData = useMemo(() => {
    const materiaCount = {};
    
    proyectos.forEach(proyecto => {
      // Usar específicamente el campo de materia de la información del proyecto
      // Priorizar campos que contengan información real de materia
      let materia = 'Sin asignar';
      
      // Intentar diferentes campos que podrían contener la materia real
      if (proyecto.nombre_materia) {
        materia = proyecto.nombre_materia;
      } else if (proyecto.materia) {
        materia = proyecto.materia;
      } else if (proyecto.asignatura) {
        materia = proyecto.asignatura;
      } else if (proyecto.id_materia) {
        materia = `Materia ${proyecto.id_materia}`;
      } else if (proyecto.codigo_materia) {
        materia = `Código ${proyecto.codigo_materia}`;
      }
      
      console.log(`📚 Proyecto "${proyecto.titulo_proyecto}": Materia = "${materia}"`);
      materiaCount[materia] = (materiaCount[materia] || 0) + 1;
    });

    console.log('📊 Conteo por materia:', materiaCount);

    // Colores con variaciones de verde, azul y amarillo como solicitó el usuario
    const coloresMaterias = [
      '#10B981', // Verde emerald
      '#059669', // Verde emerald oscuro
      '#047857', // Verde emerald más oscuro
      '#065F46', // Verde emerald muy oscuro
      '#3B82F6', // Azul
      '#2563EB', // Azul más oscuro
      '#1D4ED8', // Azul aún más oscuro
      '#F59E0B', // Amarillo/ámbar
      '#D97706', // Amarillo/ámbar oscuro
      '#B45309', // Amarillo/ámbar más oscuro
      '#92400E', // Amarillo/ámbar muy oscuro
      '#16A34A', // Verde adicional
      '#15803D', // Verde adicional oscuro
      '#166534', // Verde adicional muy oscuro
      '#14532D', // Verde adicional muy muy oscuro
    ];
    
    return Object.entries(materiaCount).map(([materia, count], index) => ({
      name: materia,
      value: count,
      color: coloresMaterias[index % coloresMaterias.length]
    })).sort((a, b) => b.value - a.value); // Ordenar por cantidad descendente
  }, [proyectos]);

  // Debug logging para campos de investigación
  proyectos.forEach(proyecto => {
    console.log('🔍 Campos de investigación del proyecto:', {
      titulo: proyecto.titulo_proyecto,
      codigo_linea: proyecto.codigo_linea,
      nombre_linea: proyecto.nombre_linea,
      codigo_sublinea: proyecto.codigo_sublinea,
      nombre_sublinea: proyecto.nombre_sublinea,
      codigo_area: proyecto.codigo_area,
      nombre_area: proyecto.nombre_area,
      linea_investigacion: proyecto.linea_investigacion,
      sublinea_investigacion: proyecto.sublinea_investigacion
    });
  });

  // Datos para la gráfica de dona de sublíneas de investigación
  const proyectosPorSublineaData = useMemo(() => {
    const sublineaCount = {};
    
    proyectos.forEach(proyecto => {
      // Usar específicamente campos de sublínea de investigación
      let sublinea = 'Sin asignar';
      
      // Priorizar campos que contengan información real de sublínea
      if (proyecto.nombre_sublinea) {
        sublinea = proyecto.nombre_sublinea;
      } else if (proyecto.sublinea_investigacion) {
        sublinea = proyecto.sublinea_investigacion;
      } else if (proyecto.codigo_sublinea) {
        sublinea = `Sublinea ${proyecto.codigo_sublinea}`;
      } else if (proyecto.nombre_linea) {
        sublinea = proyecto.nombre_linea;
      } else if (proyecto.linea_investigacion) {
        sublinea = proyecto.linea_investigacion;
      } else if (proyecto.codigo_linea) {
        sublinea = `Linea ${proyecto.codigo_linea}`;
      }
      
      console.log(`🔬 Proyecto "${proyecto.titulo_proyecto}": Sublínea = "${sublinea}"`);
      sublineaCount[sublinea] = (sublineaCount[sublinea] || 0) + 1;
    });

    console.log('📊 Conteo por sublínea:', sublineaCount);

    // Colores con variaciones de verde, azul y más amarillo como solicitó el usuario
    const coloresSublineas = [
      '#244f0fff', 
      '#a2e689ff', 
      '#0cedb1ff', 
      '#10972eff', 
      '#979748ff', 
      '#b28207ff', 
      '#F59E0B', 
      '#96932eff', 
      '#10B981', 
      '#059669', 
      '#047857', 
      '#3B82F6', 
      '#2563EB', 
      '#1D4ED8', 
      '#5b8b6dff', 
      '#15803D', 
    ];
    
    return Object.entries(sublineaCount).map(([sublinea, count], index) => ({
      name: sublinea,
      value: count,
      color: coloresSublineas[index % coloresSublineas.length]
    })).sort((a, b) => b.value - a.value); // Ordenar por cantidad descendente
  }, [proyectos]);

  // Handler para cerrar sesión
  const handleLogout = async () => {
    try {
      console.log('🚪 Iniciando cierre de sesión...');
      await logout();
      console.log('✅ Sesión cerrada, redirigiendo...');
      navigate('/login');
    } catch (error) {
      console.error('❌ Error al cerrar sesión:', error);
      // Redirigir de todas formas
      navigate('/login');
    }
  };



  // Colores representativos de la universidad
  const universityColors = [
    "#16a34a", 
    "rgba(12, 183, 106, 1)", // Verde agua (más verdoso)
    "#22c55e", // Verde medio
    "#86efac", // Verde pastel
    "#3b82f6", // Azul
    "#fbbf24", 
    "#1f2937", // Negro/gris oscuro
  ];

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
      {/* Header */}
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
                <button
                  onClick={() => setActiveTab("dashboard")}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    activeTab === "dashboard"
                      ? ""
                      : "text-gray-700 hover:bg-gray-50"
                  }`}
                  style={activeTab === "dashboard" ? { backgroundColor: 'rgba(12, 183, 106, 0.1)', color: 'rgba(12, 183, 106, 1)' } : {}}
                >
                  <i className="pi pi-home text-base"></i>
                  Dashboard
                </button>
                <Link
                  to="/student/proyectos"
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors text-gray-700 hover:bg-gray-50`}
                >
                  <i className="pi pi-book text-base"></i>
                  Mis Proyectos
                </Link>
                <Link
                  to="/student/profile"
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors text-gray-700 hover:bg-gray-50`}
                >
                  <i className="pi pi-cog text-base"></i>
                  Configuración
                </Link>
              </nav>
            </div>

            {/* --- BOTÓN MOVIDO AQUÍ --- */}
            <Link 
              to="/student/register-project" 
              className="w-full inline-block text-center text-white py-3 rounded-lg font-semibold hover:opacity-90 hover:shadow-lg hover:scale-105 transition-all duration-300 transform animate-pulse hover:animate-none mt-4"
              style={{ backgroundColor: 'rgba(12, 183, 106, 1)' }}
            >
              <span className="flex items-center justify-center gap-2">
                <i className="pi pi-plus-circle"></i>
                Postular Proyecto
              </span>
            </Link>
            {/* --- FIN DEL BOTÓN --- */}

            {/* User Info */}
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

          {/* Main Content */}
          <main className="lg:col-span-3">

            {/* Welcome Section */}
            <div className="rounded-lg p-6 mb-6 text-white" style={{ background: 'linear-gradient(to right, rgba(12, 183, 106, 1), rgba(12, 183, 106, 0.8))' }}>
              <h2 className="text-2xl font-bold mb-2">¡Bienvenido, {user?.nombres || 'Estudiante'}!</h2>
              <p className="mb-1" style={{ color: 'rgba(255, 255, 255, 0.95)' }}>
                XXI Jornada de Investigación
              </p>
              <p className="text-sm" style={{ color: 'rgba(255, 255, 255, 0.85)' }}>
                Evento de innovación y tecnología de la UPC
              </p>
            </div>

            {/* Stats Cards */}
            {activeTab === "dashboard" && (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6">
                  {/* Card 1 - Total Proyectos Inscritos */}
                  <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl border border-blue-200 p-4 sm:p-6 shadow-lg hover:shadow-xl transition-all duration-300">
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-blue-700 mb-1 truncate">Total Proyectos</p>
                        <h3 className="text-2xl sm:text-3xl font-bold text-blue-900">
                          {cargandoMetricas ? "..." : metricasEstudiante.totalProyectos}
                        </h3>
                        <div className="flex items-center gap-1 mt-2">
                          <span className="text-xs text-blue-600">Inscritos</span>
                        </div>
                      </div>
                      <div className="w-12 sm:w-14 h-12 sm:h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg flex-shrink-0">
                        <i className="pi pi-folder-open text-white text-lg sm:text-xl"></i>
                      </div>
                    </div>
                  </div>

                  {/* Card 2 - Proyectos Aprobados */}
                  <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-xl border border-emerald-200 p-4 sm:p-6 shadow-lg hover:shadow-xl transition-all duration-300">
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-emerald-700 mb-1 truncate">Proyectos Aprobados</p>
                        <h3 className="text-2xl sm:text-3xl font-bold text-emerald-900">
                          {cargandoMetricas ? "..." : metricasEstudiante.proyectosAprobados}
                        </h3>
                        <div className="flex items-center gap-1 mt-2">
                          <span className="text-xs text-emerald-600">Calificación ≥ 3.0</span>
                        </div>
                      </div>
                      <div className="w-12 sm:w-14 h-12 sm:h-14 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg flex-shrink-0">
                        <i className="pi pi-check text-white text-lg sm:text-xl"></i>
                      </div>
                    </div>
                  </div>

                  {/* Card 3 - Proyectos Reprobados */}
                  <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-xl border border-red-200 p-4 sm:p-6 shadow-lg hover:shadow-xl transition-all duration-300 sm:col-span-2 lg:col-span-1">
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-red-700 mb-1 truncate">Proyectos Reprobados</p>
                        <h3 className="text-2xl sm:text-3xl font-bold text-red-900">
                          {cargandoMetricas ? "..." : metricasEstudiante.proyectosReprobados}
                        </h3>
                        <div className="flex items-center gap-1 mt-2">
                          <span className="text-xs text-red-600">Calificación &lt; 3.0</span>
                        </div>
                      </div>
                      <div className="w-12 sm:w-14 h-12 sm:h-14 bg-gradient-to-br from-red-500 to-red-600 rounded-xl flex items-center justify-center shadow-lg flex-shrink-0">
                        <i className="pi pi-times text-white text-lg sm:text-xl"></i>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Gráficas de Proyectos por Materia y Sublíneas */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-6">
                  {/* Gráfica de Proyectos por Materia */}
                  <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-6 shadow-lg hover:shadow-xl transition-shadow duration-300">
                    <div className="flex items-center gap-3 mb-4 sm:mb-6">
                      <div className="w-8 sm:w-10 h-8 sm:h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg flex items-center justify-center flex-shrink-0">
                        <i className="pi pi-chart-pie text-white text-xs sm:text-sm"></i>
                      </div>
                      <div className="min-w-0 flex-1">
                        <h3 className="text-base sm:text-lg font-bold text-gray-900 truncate">Proyectos por Materia</h3>
                        <p className="text-xs sm:text-sm text-gray-600 hidden sm:block">Distribución de tus proyectos por asignatura</p>
                      </div>
                    </div>
                    {cargandoMetricas ? (
                      <div className="h-64 sm:h-80 flex items-center justify-center">
                        <div className="w-6 sm:w-8 h-6 sm:h-8 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin"></div>
                      </div>
                    ) : proyectosPorMateriaData.length > 0 ? (
                      <div className="h-72 sm:h-96">
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={proyectosPorMateriaData}
                              cx="50%"
                              cy="42%"
                              outerRadius={window.innerWidth < 640 ? 65 : 85}
                              paddingAngle={3}
                              dataKey="value"
                              label={({ name, percent }) => window.innerWidth >= 640 ? `${(percent * 100).toFixed(0)}%` : ''}
                              labelLine={false}
                            >
                              {proyectosPorMateriaData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                              ))}
                            </Pie>
                            <Tooltip
                              formatter={(value, name) => [`${value} proyecto${value !== 1 ? 's' : ''}`, name]}
                              contentStyle={{
                                backgroundColor: 'white',
                                border: '1px solid #e5e7eb',
                                borderRadius: '10px',
                                boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)',
                                fontSize: '12px'
                              }}
                            />
                            <Legend
                              verticalAlign="bottom"
                              height={window.innerWidth < 640 ? 80 : 60}
                              formatter={(value, entry) => (
                                <span style={{ color: entry.color, fontWeight: '500', fontSize: window.innerWidth < 640 ? '10px' : '12px' }}>
                                  {value}: {entry.payload.value}
                                </span>
                              )}
                              wrapperStyle={{ paddingTop: '10px' }}
                            />
                          </PieChart>
                        </ResponsiveContainer>
                      </div>
                    ) : (
                      <div className="h-72 sm:h-96 flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl">
                        <div className="text-center">
                          <i className="pi pi-chart-pie text-3xl sm:text-4xl text-gray-400 mb-2"></i>
                          <p className="text-gray-500 text-xs sm:text-sm">No hay datos para mostrar</p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Gráfica de Dona de Sublíneas de Investigación */}
                  <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-6 shadow-lg hover:shadow-xl transition-shadow duration-300">
                    <div className="flex items-center gap-3 mb-4 sm:mb-6">
                      <div className="w-8 sm:w-10 h-8 sm:h-10 bg-gradient-to-br from-yellow-500 to-amber-600 rounded-lg flex items-center justify-center flex-shrink-0">
                        <i className="pi pi-chart-pie text-white text-xs sm:text-sm"></i>
                      </div>
                      <div className="min-w-0 flex-1">
                        <h3 className="text-base sm:text-lg font-bold text-gray-900 truncate">Sublíneas de Investigación</h3>
                        <p className="text-xs sm:text-sm text-gray-600 hidden sm:block">Distribución por líneas de investigación</p>
                      </div>
                    </div>
                    {cargandoMetricas ? (
                      <div className="h-64 sm:h-80 flex items-center justify-center">
                        <div className="w-6 sm:w-8 h-6 sm:h-8 border-4 border-yellow-600 border-t-transparent rounded-full animate-spin"></div>
                      </div>
                    ) : proyectosPorSublineaData.length > 0 ? (
                      <div className="h-72 sm:h-80">
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={proyectosPorSublineaData}
                              cx="50%"
                              cy="45%"
                              outerRadius={window.innerWidth < 640 ? 65 : 85}
                              innerRadius={window.innerWidth < 640 ? 35 : 40}
                              paddingAngle={3}
                              dataKey="value"
                              label={({ name, percent }) => window.innerWidth >= 640 ? `${(percent * 100).toFixed(0)}%` : ''}
                              labelLine={false}
                            >
                              {proyectosPorSublineaData.map((entry, index) => (
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
                                fontSize: '12px'
                              }}
                            />
                            <Legend
                              verticalAlign="bottom"
                              height={window.innerWidth < 640 ? 80 : 60}
                              formatter={(value, entry) => (
                                <span style={{ color: entry.color, fontWeight: '500', fontSize: window.innerWidth < 640 ? '10px' : '12px' }}>
                                  {value}: {entry.payload.value}
                                </span>
                              )}
                              wrapperStyle={{ paddingTop: '10px' }}
                            />
                          </PieChart>
                        </ResponsiveContainer>
                      </div>
                    ) : (
                      <div className="h-72 sm:h-80 flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl">
                        <div className="text-center">
                          <i className="pi pi-chart-pie text-3xl sm:text-4xl text-gray-400 mb-2"></i>
                          <p className="text-gray-500 text-xs sm:text-sm">No hay datos para mostrar</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

            {/* Convocatoria Activa */}
                <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 mb-1">
                        Dashboard
                      </h3>
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <i className="pi pi-calendar"></i>
                        Cierre: 30 de Noviembre de 2025
                      </div>
                    </div>
                    <span className="px-3 py-1 rounded-full text-xs font-semibold" style={{ backgroundColor: 'rgba(12, 183, 106, 0.1)', color: 'rgba(39, 154, 102, 1)' }}>
                      Activa
                    </span>
                  </div>

                  <div className="border-t border-gray-100 pt-4 mb-4">
                    <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                      <i className="pi pi-book" style={{ color: 'rgba(12, 183, 106, 1)' }}></i>
                      Descripción
                    </h4>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      La convocatoria Exposoftware 2025 invita a estudiantes a presentar sus proyectos innovadores de desarrollo de software, investigación y aplicaciones tecnológicas. Es una oportunidad para demostrar talento, recibir retroalimentación y conectar con la industria. Se valorará la originalidad, el impacto social y la viabilidad técnica. ¡No pierdas esta oportunidad!
                    </p>
                  </div>

                  <div className="border-t border-gray-100 pt-4 mb-4">
                    <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                      <i className="pi pi-check-circle" style={{ color: 'rgba(12, 183, 106, 1)' }}></i>
                      Información Útil
                    </h4>
                    <div className="space-y-2">
                      <a href="#" className="block text-sm hover:underline" style={{ color: 'rgba(12, 183, 106, 1)' }}>
                        → Bases de la Convocatoria
                      </a>
                      <a href="#" className="block text-sm hover:underline" style={{ color: 'rgba(12, 183, 106, 1)' }}>
                        → Guía de Postulación
                      </a>
                      <a href="#" className="block text-sm hover:underline" style={{ color: 'rgba(12, 183, 106, 1)' }}>
                        → Preguntas Frecuentes
                      </a>
                    </div>
                  </div>

                  <div className="border-t border-gray-100 pt-4 mb-4">
                    <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
                      <i className="pi pi-users" style={{ color: 'rgba(12, 183, 106, 1)' }}></i>
                      Proyectos Registrados: <span className="font-semibold">-</span>
                    </div>
                  </div>

                  {/* --- BOTÓN ELIMINADO DE AQUÍ --- */}

                </div>
              </>
            )}

            {/* Mis Proyectos Tab */}
            {activeTab === "proyectos" && (
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-bold text-gray-900">Mis Proyectos</h3>
                  <button className="text-white px-4 py-2 rounded-lg text-sm font-medium hover:opacity-90 transition-colors" style={{ backgroundColor: 'rgba(12, 183, 106, 1)' }}>
                    Nuevo Proyecto
                  </button>
                </div>
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-gray-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <i className="pi pi-book text-4xl text-gray-400"></i>
                  </div>
                  <p className="text-gray-500 mb-4">No tienes proyectos registrados aún</p>
                  <button className="text-sm font-medium hover:opacity-80" style={{ color: 'rgba(12, 183, 106, 1)' }}>
                    Registrar mi primer proyecto →
                  </button>
                </div>
              </div>
            )}

            {/* Cronograma Tab */}
            {activeTab === "configuracion" && (
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Configuración</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Nombre a mostrar</label>
                    <input type="text" className="w-full border border-gray-200 rounded-lg px-3 py-2" placeholder="Tu nombre" />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Notificaciones</label>
                    <div className="flex items-center gap-3">
                      <label className="flex items-center gap-2 text-sm">
                        <input type="checkbox" className="form-checkbox" style={{ accentColor: 'rgba(12, 183, 106, 1)' }} />
                        Recibir correos
                      </label>
                      <label className="flex items-center gap-2 text-sm">
                        <input type="checkbox" className="form-checkbox" style={{ accentColor: 'rgba(12, 183, 106, 1)' }} />
                        Notificaciones en la app
                      </label>
                    </div>
                  </div>

                  <div className="pt-2">
                    <button className="text-white px-4 py-2 rounded-lg hover:opacity-90 transition-colors" style={{ backgroundColor: 'rgba(12, 183, 106, 1)' }}>Guardar cambios</button>
                  </div>
                </div>
              </div>
            )}

          </main>
        </div>
      </div>
    </div>
  );
}