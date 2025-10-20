import { useState } from "react";
import { Link } from "react-router-dom";
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

export default function GraduateDashboard() {
  const [activeTab, setActiveTab] = useState("dashboard");

  // Datos para gráfica de barras - Proyectos por Área
  const proyectosPorArea = [
    { name: "Inteligencia Artificial", proyectos: 15 },
    { name: "Desarrollo Web", proyectos: 10 },
    { name: "Ciberseguridad", proyectos: 8 },
    { name: "IoT", proyectos: 7 },
    { name: "Blockchain", proyectos: 5 },
  ];

  // Datos para gráfica de dona - Estado de Postulaciones
  const estadoPostulaciones = [
    { name: "Aprobados", value: 32, color: "#16a34a" },
    { name: "En Revisión", value: 8, color: "#fbbf24" },
    { name: "Pendientes", value: 5, color: "#3b82f6" },
  ];

  const totalProyectos = estadoPostulaciones.reduce((sum, item) => sum + item.value, 0);
  const COLORS = ["#16a34a", "#fbbf24", "#3b82f6"];

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
              <button className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-800 transition-colors">
                Registrar Asistencia
              </button>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <span className="text-green-600 font-bold text-lg">EG</span>
                </div>
              </div>

              <button className="text-sm font-medium text-red-600 hover:text-red-700 transition-colors flex items-center gap-2">
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
                      ? "bg-green-50 text-green-700"
                      : "text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  <i className="pi pi-home text-base"></i>
                  Dashboard
                </button>
                <Link
                  to="/graduate/proyectos"
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors text-gray-700 hover:bg-gray-50`}
                >
                  <i className="pi pi-book text-base"></i>
                  Mis Proyectos
                </Link>
                <Link
                  to="/graduate/profile"
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors text-gray-700 hover:bg-gray-50`}
                >
                  <i className="pi pi-cog text-base"></i>
                  Configuración
                </Link>
              </nav>
            </div>

            {/* Botón de Postular Proyecto */}
            <Link 
              to="/student/register-project" 
              className="w-full inline-block text-center bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 hover:shadow-lg hover:scale-105 transition-all duration-300 transform animate-pulse hover:animate-none mt-4"
            >
              <span className="flex items-center justify-center gap-2">
                <i className="pi pi-plus-circle"></i>
                Postular Proyecto
              </span>
            </Link>

            {/* User Info */}
            <div className="bg-white rounded-lg border border-gray-200 p-4 mt-4">
              <div className="text-center">
                <h3 className="font-semibold text-gray-900">Egresado UPC</h3>
                <p className="text-sm text-gray-500">Ingeniero de Sistemas</p>
                <p className="text-xs text-gray-400 mt-1">Promoción 2023</p>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <main className="lg:col-span-3">
            
            {/* Welcome Section */}
            <div className="bg-gradient-to-r from-green-600 to-green-700 rounded-lg p-6 mb-6 text-white">
              <h2 className="text-2xl font-bold mb-2">XXI Jornada de Investigación</h2>
              <p className="text-green-50 mb-4">
                Bienvenido egresado. Comparte tu experiencia profesional y proyectos innovadores con la comunidad universitaria
              </p>
            </div>

            {/* Stats Cards */}
            {activeTab === "dashboard" && (
              <>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                  {/* Card 1 - Total de Postulaciones */}
                  <div className="bg-gradient-to-br from-green-50 to-white rounded-lg border border-gray-200 p-6">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-sm text-gray-600 mb-1">Total Postulaciones</p>
                        <h3 className="text-3xl font-bold text-gray-900">{totalProyectos}</h3>
                        <div className="flex items-center gap-1 mt-2">
                          <i className="pi pi-arrow-up text-xs text-green-600"></i>
                          <span className="text-xs text-green-600 font-medium">+18% este mes</span>
                        </div>
                      </div>
                      <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                        <i className="pi pi-chart-line text-xl text-green-600"></i>
                      </div>
                    </div>
                  </div>

                  {/* Card 2 - Mis Proyectos */}
                  <div className="bg-gradient-to-br from-blue-50 to-white rounded-lg border border-gray-200 p-6">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-sm text-gray-600 mb-1">Mis Proyectos</p>
                        <h3 className="text-3xl font-bold text-gray-900">2</h3>
                        <div className="flex items-center gap-1 mt-2">
                          <span className="text-xs text-gray-500">1 aprobado</span>
                        </div>
                      </div>
                      <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                        <i className="pi pi-briefcase text-xl text-blue-600"></i>
                      </div>
                    </div>
                  </div>

                  {/* Card 3 - Días Restantes */}
                  <div className="bg-gradient-to-br from-purple-50 to-white rounded-lg border border-gray-200 p-6">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-sm text-gray-600 mb-1">Días Restantes</p>
                        <h3 className="text-3xl font-bold text-gray-900">45</h3>
                        <div className="flex items-center gap-1 mt-2">
                          <span className="text-xs text-gray-500">Para cierre de convocatoria</span>
                        </div>
                      </div>
                      <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                        <i className="pi pi-calendar text-xl text-purple-600"></i>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Charts Row */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                  {/* Gráfica de Barras - Proyectos por Área */}
                  <div className="bg-white rounded-lg border border-gray-200 p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-6">
                      Proyectos por Área Temática
                    </h3>
                    <ResponsiveContainer width="100%" height={250}>
                      <BarChart data={proyectosPorArea}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                        <XAxis 
                          dataKey="name" 
                          tick={{ fontSize: 12 }}
                          stroke="#6b7280"
                        />
                        <YAxis 
                          tick={{ fontSize: 12 }}
                          stroke="#6b7280"
                        />
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: '#fff',
                            border: '1px solid #e5e7eb',
                            borderRadius: '8px',
                            fontSize: '12px'
                          }}
                        />
                        <Bar 
                          dataKey="proyectos" 
                          fill="#16a34a" 
                          radius={[8, 8, 0, 0]}
                          name="Proyectos"
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>

                  {/* Gráfica de Dona - Estado de Postulaciones */}
                  <div className="bg-white rounded-lg border border-gray-200 p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-6">
                      Estado de Postulaciones
                    </h3>
                    <ResponsiveContainer width="100%" height={250}>
                      <PieChart>
                        <Pie
                          data={estadoPostulaciones}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={90}
                          paddingAngle={5}
                          dataKey="value"
                        >
                          {estadoPostulaciones.map((entry, index) => (
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
                      {estadoPostulaciones.map((item, index) => (
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
                        Convocatoria para Egresados
                      </h3>
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <i className="pi pi-calendar"></i>
                        Cierre: 30 de Noviembre de 2025
                      </div>
                    </div>
                    <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-semibold">
                      Activa
                    </span>
                  </div>

                  <div className="border-t border-gray-100 pt-4 mb-4">
                    <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                      <i className="pi pi-briefcase text-green-600"></i>
                      Descripción
                    </h4>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      Invitamos a los egresados de Ingeniería de Sistemas a compartir sus proyectos profesionales, desarrollos innovadores y experiencias en el sector tecnológico. Esta es una oportunidad única para conectar con la comunidad académica, inspirar a estudiantes actuales y fortalecer la red de alumni. Se valorará especialmente el impacto industrial, la innovación aplicada y la transferencia de conocimiento.
                    </p>
                  </div>

                  <div className="border-t border-gray-100 pt-4 mb-4">
                    <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                      <i className="pi pi-check-circle text-green-600"></i>
                      Recursos para Egresados
                    </h4>
                    <div className="space-y-2">
                      <a href="#" className="block text-sm text-green-600 hover:text-green-700 hover:underline">
                        → Guía de Postulación para Egresados
                      </a>
                      <a href="#" className="block text-sm text-green-600 hover:text-green-700 hover:underline">
                        → Formato de Presentación Profesional
                      </a>
                      <a href="#" className="block text-sm text-green-600 hover:text-green-700 hover:underline">
                        → Red de Alumni UPC
                      </a>
                    </div>
                  </div>

                  <div className="border-t border-gray-100 pt-4 mb-4">
                    <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
                      <i className="pi pi-users text-green-600"></i>
                      Proyectos de Egresados Registrados: <span className="font-semibold">18</span>
                    </div>
                  </div>

                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <i className="pi pi-info-circle text-blue-600 text-lg mt-0.5"></i>
                      <div className="flex-1">
                        <h5 className="font-semibold text-blue-900 mb-1">Beneficios para Egresados</h5>
                        <ul className="text-sm text-blue-800 space-y-1">
                          <li>• Reconocimiento como ponente en evento académico</li>
                          <li>• Certificado de participación profesional</li>
                          <li>• Networking con empresas del sector</li>
                          <li>• Fortalecimiento de tu perfil profesional</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                </div>
              </>
            )}

            {/* Mis Proyectos Tab */}
            {activeTab === "proyectos" && (
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-bold text-gray-900">Mis Proyectos Profesionales</h3>
                  <Link 
                    to="/graduate/register-project"
                    className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-700 transition-colors"
                  >
                    Nuevo Proyecto
                  </Link>
                </div>
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-gray-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <i className="pi pi-briefcase text-4xl text-gray-400"></i>
                  </div>
                  <p className="text-gray-500 mb-4">No tienes proyectos registrados aún</p>
                  <Link 
                    to="/graduate/register-project"
                    className="text-green-600 hover:text-green-700 text-sm font-medium"
                  >
                    Postular mi primer proyecto profesional →
                  </Link>
                </div>
              </div>
            )}

            {/* Configuración Tab */}
            {activeTab === "configuracion" && (
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Configuración</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Nombre completo</label>
                    <input type="text" className="w-full border border-gray-200 rounded-lg px-3 py-2" placeholder="Tu nombre" />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Empresa actual</label>
                    <input type="text" className="w-full border border-gray-200 rounded-lg px-3 py-2" placeholder="Nombre de la empresa" />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Cargo</label>
                    <input type="text" className="w-full border border-gray-200 rounded-lg px-3 py-2" placeholder="Tu cargo actual" />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Notificaciones</label>
                    <div className="flex items-center gap-3">
                      <label className="flex items-center gap-2 text-sm">
                        <input type="checkbox" className="form-checkbox text-green-600" defaultChecked />
                        Recibir correos
                      </label>
                      <label className="flex items-center gap-2 text-sm">
                        <input type="checkbox" className="form-checkbox text-green-600" defaultChecked />
                        Notificaciones en la app
                      </label>
                    </div>
                  </div>

                  <div className="pt-2">
                    <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors">Guardar cambios</button>
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
