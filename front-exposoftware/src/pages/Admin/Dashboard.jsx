import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../../assets/Logo-unicesar.png";
import AdminSidebar from "../../components/Layout/AdminSidebar";
import * as AuthService from "../../Services/AuthService";
import DashboardService from "../../Services/DashboardService";
import { ProgressSpinner } from 'primereact/progressspinner';
import { Chart } from 'primereact/chart';

// Main Dashboard Component
export default function AdminDashboard() {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [estadisticas, setEstadisticas] = useState({
    totalProyectos: 0,
    totalEstudiantes: 0,
    totalProfesores: 0,
    proyectosPorTipo: {
      labels: [],
      valores: [],
      total: 0,
      proyectos: []
    }
  });
  const [loadingEstadisticas, setLoadingEstadisticas] = useState(true);

  // Cargar datos del usuario autenticado
  useEffect(() => {
    const user = AuthService.getUserData();
    if (user) {
      setUserData(user);
      console.log('👤 Usuario autenticado:', user);
    } else {
      console.warn('⚠️ No hay usuario autenticado');
      navigate('/login');
    }
  }, [navigate]);

  // Cargar estadísticas del dashboard
  useEffect(() => {
    cargarEstadisticas();
    
    // Actualizar estadísticas cada 5 minutos
    const intervalo = setInterval(() => {
      cargarEstadisticas();
    }, 300000); // 300000ms = 5 minutos

    return () => clearInterval(intervalo);
  }, []);

  // Función para cargar estadísticas
  const cargarEstadisticas = async () => {
    try {
      setLoadingEstadisticas(true);
      const stats = await DashboardService.getEstadisticasCompletas();
      setEstadisticas(stats);
      console.log('📊 Estadísticas cargadas:', stats);
    } catch (error) {
      console.error('❌ Error al cargar estadísticas:', error);
    } finally {
      setLoadingEstadisticas(false);
    }
  };

  // Función para cerrar sesión
  const handleLogout = async () => {
    if (window.confirm('¿Está seguro de que desea cerrar sesión?')) {
      try {
        await AuthService.logout();
        navigate('/login');
      } catch (error) {
        console.error('❌ Error al cerrar sesión:', error);
      }
    }
  };

  // Obtener nombre e iniciales del usuario
  const getUserName = () => {
    if (!userData) return 'Administrador';
    return userData.nombre || userData.nombres || userData.correo?.split('@')[0] || 'Administrador';
  };

  const getUserInitials = () => {
    const name = getUserName();
    return name.charAt(0).toUpperCase();
  };

  // Configuración de la gráfica de dona (donut chart)
  const chartData = {
    labels: estadisticas.proyectosPorTipo?.labels || [],
    datasets: [
      {
        data: estadisticas.proyectosPorTipo?.valores || [],
        backgroundColor: [
          '#10B981', // Verde - Exposoftware
          '#F59E0B', // Amarillo - Ponencia  
          '#EF4444', // Rojo - Taller
          '#3B82F6'  // Azul - Conferencia
        ],
        borderColor: '#ffffff',
        borderWidth: 2
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          padding: 15,
          font: {
            size: 12,
            family: 'Inter, sans-serif'
          },
          usePointStyle: true,
          pointStyle: 'circle'
        }
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            const label = context.label || '';
            const value = context.parsed || 0;
            const total = context.dataset.data.reduce((a, b) => a + b, 0);
            const percentage = ((value / total) * 100).toFixed(1);
            return `${label}: ${value} (${percentage}%)`;
          }
        }
      }
    },
    cutout: '60%' // Tamaño del agujero central (donut)
  };

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

            {/* User avatar and logout */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3">
                <span className="text-sm text-gray-700 hidden sm:block">{getUserName()}</span>
                <div className="w-10 h-10 bg-teal-100 rounded-full flex items-center justify-center">
                  <span className="text-teal-600 font-bold text-lg">{getUserInitials()}</span>
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
          
          {/* Sidebar Component */}
          <AdminSidebar 
            userName={getUserName()} 
            userRole="Administrador" 
          />

          {/* Main Content */}
          <main className="lg:col-span-3">
            {/* Header con botón de actualización */}
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Panel de Administración</h2>
                <p className="text-sm text-gray-500">Estadísticas en tiempo real del sistema</p>
              </div>
              <button
                onClick={cargarEstadisticas}
                disabled={loadingEstadisticas}
                className="flex items-center gap-2 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                title="Actualizar estadísticas"
              >
                <i className={`pi pi-refresh ${loadingEstadisticas ? 'pi-spin' : ''}`}></i>
                <span className="hidden sm:inline">Actualizar</span>
              </button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              {/* Card 1 - Total Proyectos Registrados */}
              <div className="bg-gradient-to-br from-teal-50 to-white rounded-lg border border-gray-200 p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="text-sm text-gray-600 mb-1">Total Proyectos Registrados</p>
                    {loadingEstadisticas ? (
                      <div className="flex items-center gap-2">
                        <ProgressSpinner style={{width: '30px', height: '30px'}} strokeWidth="4" />
                        <span className="text-sm text-gray-500">Cargando...</span>
                      </div>
                    ) : (
                      <>
                        <h3 className="text-3xl font-bold text-gray-900">{estadisticas.totalProyectos}</h3>
                        <div className="flex items-center gap-1 mt-2">
                          <i className="pi pi-chart-line text-xs text-teal-600"></i>
                          <span className="text-xs text-teal-600 font-medium">Datos en tiempo real</span>
                        </div>
                      </>
                    )}
                  </div>
                  <div className="w-12 h-12 bg-teal-100 rounded-full flex items-center justify-center">
                    <i className="pi pi-briefcase text-xl text-teal-600"></i>
                  </div>
                </div>
              </div>

              {/* Card 2 - Estudiantes Inscritos */}
              <div className="bg-gradient-to-br from-blue-50 to-white rounded-lg border border-gray-200 p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="text-sm text-gray-600 mb-1">Estudiantes Inscritos</p>
                    {loadingEstadisticas ? (
                      <div className="flex items-center gap-2">
                        <ProgressSpinner style={{width: '30px', height: '30px'}} strokeWidth="4" />
                        <span className="text-sm text-gray-500">Cargando...</span>
                      </div>
                    ) : (
                      <>
                        <h3 className="text-3xl font-bold text-gray-900">{estadisticas.totalEstudiantes}</h3>
                        <div className="flex items-center gap-1 mt-2">
                          <i className="pi pi-users text-xs text-blue-600"></i>
                          <span className="text-xs text-blue-600 font-medium">Usuarios activos</span>
                        </div>
                      </>
                    )}
                  </div>
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <i className="pi pi-users text-xl text-blue-600"></i>
                  </div>
                </div>
              </div>

              {/* Card 3 - Docentes Inscritos */}
              <div className="bg-gradient-to-br from-purple-50 to-white rounded-lg border border-gray-200 p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="text-sm text-gray-600 mb-1">Docentes Inscritos</p>
                    {loadingEstadisticas ? (
                      <div className="flex items-center gap-2">
                        <ProgressSpinner style={{width: '30px', height: '30px'}} strokeWidth="4" />
                        <span className="text-sm text-gray-500">Cargando...</span>
                      </div>
                    ) : (
                      <>
                        <h3 className="text-3xl font-bold text-gray-900">{estadisticas.totalProfesores}</h3>
                        <div className="flex items-center gap-1 mt-2">
                          <i className="pi pi-user text-xs text-purple-600"></i>
                          <span className="text-xs text-purple-600 font-medium">Profesores activos</span>
                        </div>
                      </>
                    )}
                  </div>
                  <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                    <i className="pi pi-id-card text-xl text-purple-600"></i>
                  </div>
                </div>
              </div>
            </div>

            {/* Charts Row - Gráficas de Power BI */}
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-gray-900">📊 Analytics en Tiempo Real</h2>
                <p className="text-sm text-gray-500">Gráficas interactivas desde Power BI</p>
              </div>
            </div>

            <div className="mb-6">
              {/* Gráfica: Calificaciones por Tipo de Actividad */}
              <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
                  <div className="flex items-center justify-between">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      <span className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></span>
                      En Vivo
                    </span>
                  </div>
                </div>
                <div style={{ height: '500px', position: 'relative' }}>
                  <iframe
                    src="https://app.powerbi.com/reportEmbed?reportId=7b4c14dc-cbf5-45dc-b61e-563a4c940115&autoAuth=true&ctid=e2bf1c48-1dae-47ba-9808-67da61e2588d&config=eyJjbHVzdGVyVXJsIjoiaHR0cHM6Ly9XQUJJLVNPVVRILUNFTlRSQUwtVVMtcmVkaXJlY3QuYW5hbHlzaXMud2luZG93cy5uZXQiLCJlbWJlZEZlYXR1cmVzIjp7Im1vZGVybkVtYmVkIjp0cnVlLCJjZXJ0aWZpZWRUZWxlbWV0cnlFbWJlZCI6dHJ1ZSwidXNhZ2VNZXRyaWNzVk5leHQiOnRydWUsInNraXBab25lUGlja2VyIjp0cnVlfX0%3d&pageName=465c14b0268e55932d6f&filterPaneEnabled=false&navContentPaneEnabled=false&$filter=_VisualsInFocusMode eq 'd8ce33b98a17ce9af097'"
                    width="100%"
                    height="100%"
                    frameBorder="0"
                    allowFullScreen={true}
                    style={{ border: 'none', display: 'block' }}
                  />
                </div>
              </div>
            </div>

            {/* Proyectos por Tipo de Actividad */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    Proyectos por Tipo de Actividad
                  </h3>
                  <p className="text-sm text-gray-500">
                    Distribución de {estadisticas.proyectosPorTipo?.total || 0} proyectos registrados
                  </p>
                </div>
                <div className="flex items-center gap-2 text-teal-600">
                  <i className="pi pi-chart-pie"></i>
                </div>
              </div>

              {loadingEstadisticas ? (
                <div className="flex items-center justify-center h-96">
                  <div className="text-center">
                    <ProgressSpinner style={{width: '50px', height: '50px'}} strokeWidth="4" />
                    <p className="text-sm text-gray-500 mt-4">Cargando datos de proyectos...</p>
                  </div>
                </div>
              ) : estadisticas.proyectosPorTipo?.total > 0 ? (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Gráfica Circular */}
                  <div className="flex items-center justify-center">
                    <div style={{ width: '100%', maxWidth: '350px', height: '350px' }}>
                      <Chart type="doughnut" data={chartData} options={chartOptions} />
                    </div>
                  </div>

                  {/* Lista de Proyectos Recientes */}
                  <div>
                    <h4 className="text-md font-semibold text-gray-800 mb-4">
                      Proyectos Recientes
                    </h4>
                    <div className="space-y-3">
                      {estadisticas.proyectosPorTipo?.proyectos.slice(0, 5).map((proyecto, index) => {
                        console.log('📋 Proyecto completo:', proyecto);
                        const nombreProyecto = proyecto.titulo_proyecto || 
                                              proyecto.titulo_proyecto || 
                                              proyecto.titulo_proyecto || 
                                              'Proyecto sin nombre';
                        return (
                          <div 
                            key={proyecto.id_proyecto || index}
                            className="flex items-start gap-3 p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
                          >
                            <div className="flex-shrink-0 mt-1">
                              <div className={`w-2 h-2 rounded-full ${
                                proyecto.tipo_actividad === 1 ? 'bg-green-500' :
                                proyecto.tipo_actividad === 2 ? 'bg-yellow-500' :
                                proyecto.tipo_actividad === 3 ? 'bg-red-500' :
                                'bg-blue-500'
                              }`}></div>
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-gray-900 truncate" title={nombreProyecto}>
                                {nombreProyecto}
                              </p>
                              <div className="flex items-center gap-2 mt-1">
                                <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                                  proyecto.tipo_actividad === 1 ? 'bg-green-100 text-green-800' :
                                  proyecto.tipo_actividad === 2 ? 'bg-yellow-100 text-yellow-800' :
                                  proyecto.tipo_actividad === 3 ? 'bg-red-100 text-red-800' :
                                  'bg-blue-100 text-blue-800'
                                }`}>
                                  {proyecto.tipo_actividad === 1 ? 'Exposoftware' :
                                   proyecto.tipo_actividad === 2 ? 'Ponencia' :
                                   proyecto.tipo_actividad === 3 ? 'Taller' :
                                   'Conferencia'}
                                </span>
                                {proyecto.calificacion && (
                                  <span className="text-xs text-gray-500">
                                    ⭐ {proyecto.calificacion.toFixed(1)}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                    
                    {estadisticas.proyectosPorTipo?.total > 5 && (
                      <div className="mt-4 text-center">
                        <Link 
                          to="/admin/proyectos" 
                          className="inline-flex items-center gap-2 text-sm font-medium text-teal-600 hover:text-teal-700"
                        >
                          Ver todos los proyectos
                          <i className="pi pi-arrow-right text-xs"></i>
                        </Link>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-center h-64 text-gray-500">
                  <div className="text-center">
                    <i className="pi pi-folder text-4xl mb-3 text-gray-400"></i>
                    <p className="font-medium">No hay proyectos registrados</p>
                    <p className="text-sm">Los proyectos aparecerán aquí una vez sean creados</p>
                  </div>
                </div>
              )}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
