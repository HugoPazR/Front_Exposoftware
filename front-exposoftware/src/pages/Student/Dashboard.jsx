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
  LineChart,
  Line,
} from "recharts";

export default function StudentDashboard() {
  const [activeTab, setActiveTab] = useState("dashboard");

  // Datos para gráficas
  const proyectosPorCategoria = [
    { name: "Web", value: 15, color: "#10b981" },
    { name: "Móvil", value: 12, color: "#3b82f6" },
    { name: "IA", value: 8, color: "#8b5cf6" },
    { name: "Otro", value: 7, color: "#f59e0b" },
  ];

  const participacionSemanal = [
    { dia: "Lun", proyectos: 3 },
    { dia: "Mar", proyectos: 7 },
    { dia: "Mié", proyectos: 5 },
    { dia: "Jue", proyectos: 9 },
    { dia: "Vie", proyectos: 6 },
  ];

  const COLORS = ["#10b981", "#3b82f6", "#8b5cf6", "#f59e0b"];

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
                  <span className="text-green-600 font-bold text-lg">CG</span>
                </div>
              </div>
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

            {/* User Info */}
            <div className="bg-white rounded-lg border border-gray-200 p-4 mt-4">
              <div className="text-center">
                <h3 className="font-semibold text-gray-900">Cristian Guzman</h3>
                <p className="text-sm text-gray-500">Estudiante</p>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <main className="lg:col-span-3">
            
            {/* Welcome Section */}
            <div className="bg-gradient-to-r from-green-600 to-green-700 rounded-lg p-6 mb-6 text-white">
              <h2 className="text-2xl font-bold mb-2">XXI Jornada de Investigación</h2>
              <p className="text-green-50 mb-4">
                Bienvenido al evento más importante de innovación y tecnología de la UPC
              </p>
            </div>

            {/* Convocatoria Activa */}
            {activeTab === "dashboard" && (
              <>
                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  {/* Card 1 */}
                  <div className="bg-white rounded-lg border border-gray-200 p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Proyectos Totales</p>
                        <h3 className="text-2xl font-bold text-gray-900">42</h3>
                      </div>
                      <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                        <i className="pi pi-briefcase text-green-600"></i>
                      </div>
                    </div>
                  </div>

                  {/* Card 2 */}
                  <div className="bg-white rounded-lg border border-gray-200 p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Días Restantes</p>
                        <h3 className="text-2xl font-bold text-gray-900">46</h3>
                      </div>
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                        <i className="pi pi-calendar text-blue-600"></i>
                      </div>
                    </div>
                  </div>

                  {/* Card 3 */}
                  <div className="bg-white rounded-lg border border-gray-200 p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Participantes</p>
                        <h3 className="text-2xl font-bold text-gray-900">156</h3>
                      </div>
                      <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                        <i className="pi pi-users text-purple-600"></i>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Gráficas Pequeñas */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                  {/* Gráfica de Categorías */}
                  <div className="bg-white rounded-lg border border-gray-200 p-4">
                    <h4 className="text-sm font-semibold text-gray-900 mb-4">
                      Proyectos por Categoría
                    </h4>
                    <ResponsiveContainer width="100%" height={180}>
                      <PieChart>
                        <Pie
                          data={proyectosPorCategoria}
                          cx="50%"
                          cy="50%"
                          innerRadius={45}
                          outerRadius={70}
                          paddingAngle={3}
                          dataKey="value"
                        >
                          {proyectosPorCategoria.map((entry, index) => (
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
                    <div className="grid grid-cols-2 gap-2 mt-2">
                      {proyectosPorCategoria.map((item, idx) => (
                        <div key={idx} className="flex items-center gap-2">
                          <div 
                            className="w-2 h-2 rounded-full" 
                            style={{ backgroundColor: item.color }}
                          />
                          <span className="text-xs text-gray-600">{item.name}: {item.value}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Gráfica de Actividad Semanal */}
                  <div className="bg-white rounded-lg border border-gray-200 p-4">
                    <h4 className="text-sm font-semibold text-gray-900 mb-4">
                      Registros Esta Semana
                    </h4>
                    <ResponsiveContainer width="100%" height={180}>
                      <LineChart data={participacionSemanal}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                        <XAxis 
                          dataKey="dia" 
                          tick={{ fontSize: 11 }}
                          stroke="#9ca3af"
                        />
                        <YAxis 
                          tick={{ fontSize: 11 }}
                          stroke="#9ca3af"
                        />
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: '#fff',
                            border: '1px solid #e5e7eb',
                            borderRadius: '8px',
                            fontSize: '12px'
                          }}
                        />
                        <Line 
                          type="monotone" 
                          dataKey="proyectos" 
                          stroke="#10b981" 
                          strokeWidth={2}
                          dot={{ fill: '#10b981', r: 4 }}
                          name="Proyectos"
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>

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
                    <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-semibold">
                      Activa
                    </span>
                  </div>

                  <div className="border-t border-gray-100 pt-4 mb-4">
                    <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                      <i className="pi pi-book text-green-600"></i>
                      Descripción
                    </h4>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      La convocatoria Exposoftware 2025 invita a estudiantes a presentar sus proyectos innovadores de desarrollo de software, investigación y aplicaciones tecnológicas. Es una oportunidad para demostrar talento, recibir retroalimentación y conectar con la industria. Se valorará la originalidad, el impacto social y la viabilidad técnica. ¡No pierdas esta oportunidad!
                    </p>
                  </div>

                  <div className="border-t border-gray-100 pt-4 mb-4">
                    <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                      <i className="pi pi-check-circle text-green-600"></i>
                      Información Útil
                    </h4>
                    <div className="space-y-2">
                      <a href="#" className="block text-sm text-green-600 hover:text-green-700 hover:underline">
                        → Bases de la Convocatoria
                      </a>
                      <a href="#" className="block text-sm text-green-600 hover:text-green-700 hover:underline">
                        → Guía de Postulación
                      </a>
                      <a href="#" className="block text-sm text-green-600 hover:text-green-700 hover:underline">
                        → Preguntas Frecuentes
                      </a>
                    </div>
                  </div>

                  <div className="border-t border-gray-100 pt-4 mb-4">
                    <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
                      <i className="pi pi-users text-green-600"></i>
                      Proyectos Registrados: <span className="font-semibold">42</span>
                    </div>
                  </div>

                  <Link to="/student/register-project" className="relative w-full inline-block text-center bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition-all duration-300 hover:scale-105 hover:shadow-lg group overflow-hidden">
                    {/* Efecto de brillo animado */}
                    <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-20 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></span>
                    
                    {/* Pulso sutil */}
                    <span className="absolute inset-0 rounded-lg animate-pulse bg-green-400 opacity-25"></span>
                    
                    {/* Contenido del botón */}
                    <span className="relative flex items-center justify-center gap-2">
                      <i className="pi pi-send"></i>
                      Postular Proyecto
                      <i className="pi pi-arrow-right text-sm group-hover:translate-x-1 transition-transform"></i>
                    </span>
                  </Link>
                </div>
              </>
            )}

            {/* Mis Proyectos Tab */}
            {activeTab === "proyectos" && (
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-bold text-gray-900">Mis Proyectos</h3>
                  <button className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-700 transition-colors">
                    Nuevo Proyecto
                  </button>
                </div>
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-gray-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <i className="pi pi-book text-4xl text-gray-400"></i>
                  </div>
                  <p className="text-gray-500 mb-4">No tienes proyectos registrados aún</p>
                  <button className="text-green-600 hover:text-green-700 text-sm font-medium">
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
                        <input type="checkbox" className="form-checkbox text-green-600" />
                        Recibir correos
                      </label>
                      <label className="flex items-center gap-2 text-sm">
                        <input type="checkbox" className="form-checkbox text-green-600" />
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