import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import logo from "../../assets/Logo-unicesar.png";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

export default function StudentDashboard() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const { user, getFullName, getInitials, logout, loading } = useAuth();
  const navigate = useNavigate();

  // Handler para cerrar sesión
  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Datos para gráfica de barras - Proyectos por Materia
  const proyectosPorMateria = [
    { name: "Ing. Software", proyectos: 12 },
    { name: "Desarrollo Web", proyectos: 8 },
    { name: "Móvil", proyectos: 6 },
    { name: "IA", proyectos: 5 },
    { name: "Redes", proyectos: 4 },
  ];

  // Datos para gráfica de dona - Estado de Inscripciones
  const estadoInscripciones = [
    { name: "Confirmados", value: 28, color: "#16a34a" },
    { name: "Pendientes", value: 10, color: "#fbbf24" },
    { name: "En Revisión", value: 4, color: "#1f2937" },
  ];

  const totalProyectos = estadoInscripciones.reduce((sum, item) => sum + item.value, 0);
  const COLORS = ["#16a34a", "#fbbf24", "#1f2937"];

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
            <div className="flex items-center gap-3">
              <img src={logo} alt="Logo Unicesar" className="w-10 h-auto" />
              <div>
                <h1 className="text-lg font-bold text-gray-900">Expo-software 2025</h1>
                <p className="text-xs text-gray-500">Universidad Popular del Cesar</p>
              </div>
            </div>

            {/* Action button then user quick badge (avatar + name) */}
            <div className="flex items-center gap-4">
              <button className="text-white px-4 py-2 rounded-lg text-sm font-medium hover:opacity-90 transition-colors" style={{ backgroundColor: 'rgba(13, 97, 59, 1)' }}>
                Registrar Asistencia
              </button>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: 'rgba(12, 183, 106, 0.1)' }}>
                  <span className="font-bold text-lg" style={{ color: 'rgba(12, 183, 106, 1)' }}>{getInitials()}</span>
                </div>
                <div className="hidden md:block">
                  <p className="text-sm font-medium text-gray-900">{getFullName()}</p>
                  <p className="text-xs text-gray-500 capitalize">{user?.rol || 'Estudiante'}</p>
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
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                  {/* Card 1 - Proyectos Inscritos */}
                  <div className="rounded-lg border border-gray-200 p-6" style={{ background: 'linear-gradient(to bottom right, rgba(12, 183, 106, 0.05), white)' }}>
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-sm text-gray-600 mb-1">Proyectos Inscritos</p>
                        <h3 className="text-3xl font-bold text-gray-900">{totalProyectos}</h3>
                        <div className="flex items-center gap-1 mt-2">
                          <i className="pi pi-arrow-up text-xs" style={{ color: 'rgba(12, 183, 106, 1)' }}></i>
                          <span className="text-xs font-medium" style={{ color: 'rgba(12, 183, 106, 1)' }}>+12% este mes</span>
                        </div>
                      </div>
                      <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ backgroundColor: 'rgba(12, 183, 106, 0.1)' }}>
                        <i className="pi pi-chart-line text-xl" style={{ color: 'rgba(12, 183, 106, 1)' }}></i>
                      </div>
                    </div>
                  </div>

                  {/* Card 2 - Mis Proyectos */}
                  <div className="rounded-lg border border-gray-200 p-6" style={{ background: 'linear-gradient(to bottom right, rgba(12, 183, 106, 0.03), white)' }}>
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-sm text-gray-600 mb-1">Mis Proyectos</p>
                        <h3 className="text-3xl font-bold text-gray-900">3</h3>
                        <div className="flex items-center gap-1 mt-2">
                          <span className="text-xs text-gray-500">2 aprobados</span>
                        </div>
                      </div>
                      <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ backgroundColor: 'rgba(12, 183, 106, 0.1)' }}>
                        <i className="pi pi-book text-xl" style={{ color: 'rgba(12, 183, 106, 1)' }}></i>
                      </div>
                    </div>
                  </div>

                  {/* Card 3 - Días Restantes */}
                  <div className="bg-gradient-to-br from-sky-50 to-white rounded-lg border border-gray-200 p-6">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-sm text-gray-600 mb-1">Días Restantes</p>
                        <h3 className="text-3xl font-bold text-gray-900">45</h3>
                        <div className="flex items-center gap-1 mt-2">
                          <span className="text-xs text-gray-500">Hasta el cierre</span>
                        </div>
                      </div>
                      <div className="w-12 h-12 bg-sky-100 rounded-full flex items-center justify-center">
                        <i className="pi pi-calendar text-xl text-sky-600"></i>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Charts Row */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                  {/* Gráfica Circular - Proyectos por Materia */}
                  <div className="bg-white rounded-lg border border-gray-200 p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-6">
                      Proyectos por Materia
                    </h3>
                    <ResponsiveContainer width="100%" height={250}>
                      <PieChart>
                      <Pie
                        data={proyectosPorMateria}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={90}
                        paddingAngle={5}
                        dataKey="proyectos"
                        nameKey="name"
                      >
                        {proyectosPorMateria.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={universityColors[index % universityColors.length]} />
                        ))}
                      </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                    
                    {/* Leyenda personalizada */}
                    <div className="mt-4 space-y-2">
                      {proyectosPorMateria.map((item, index) => (
                        <div key={index} className="flex items-center justify-between text-sm">
                          <div className="flex items-center gap-2">
                            <div 
                              className="w-3 h-3 rounded-full" 
                              style={{ backgroundColor: universityColors[index % universityColors.length] }}
                            ></div>
                            <span className="text-gray-700">{item.name}</span>
                          </div>
                          <span className="font-semibold text-gray-900">{item.proyectos}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Gráfica de Dona - Estado de Inscripciones */}
                  <div className="bg-white rounded-lg border border-gray-200 p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-6">
                      Estado de Inscripciones
                    </h3>
                    <ResponsiveContainer width="100%" height={250}>
                      <PieChart>
                        <Pie
                          data={estadoInscripciones}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={90}
                          paddingAngle={5}
                          dataKey="value"
                        >
                          {estadoInscripciones.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: '#fff',
                            border: '1px solid #e5e7eb',
                            borderRadius: '8px',
                            fontSize: '12px'
                          }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                    
                    {/* Leyenda personalizada */}
                    <div className="mt-4 space-y-2">
                      {estadoInscripciones.map((item, index) => (
                        <div key={index} className="flex items-center justify-between text-sm">
                          <div className="flex items-center gap-2">
                            <div 
                              className="w-3 h-3 rounded-full" 
                              style={{ backgroundColor: item.color }}
                            ></div>
                            <span className="text-gray-700">{item.name}</span>
                          </div>
                          <span className="font-semibold text-gray-900">{item.value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* Convocatoria Activa */}
            {activeTab === "dashboard" && (
              <>
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
                    <span className="px-3 py-1 rounded-full text-xs font-semibold" style={{ backgroundColor: 'rgba(12, 183, 106, 0.1)', color: 'rgba(12, 183, 106, 1)' }}>
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
                      Proyectos Registrados: <span className="font-semibold">42</span>
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