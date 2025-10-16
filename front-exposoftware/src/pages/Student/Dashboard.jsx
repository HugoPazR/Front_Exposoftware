import { useState } from "react";
import { Link } from "react-router-dom";
import logo from "../../assets/Logo-unicesar.png";

export default function StudentDashboard() {
  const [activeTab, setActiveTab] = useState("dashboard");

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

                  <Link to="/student/register-project" className="w-full inline-block text-center bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors">
                    Postular Proyecto
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