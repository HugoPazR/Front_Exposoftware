import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import logo from "../../assets/Logo-unicesar.png";
import * as AuthService from "../../Services/AuthService";
import * as GraduateService from "../../Services/GraduateService";

export default function GraduateDashboard() {
  const navigate = useNavigate();
  const { user, getFullName, getInitials, logout, loading } = useAuth();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [perfil, setPerfil] = useState(null);
  const [loadingPerfil, setLoadingPerfil] = useState(true);

  // Cargar perfil del egresado al montar
  useEffect(() => {
    const cargarPerfil = async () => {
      if (!user) {
        console.log('⏳ Esperando datos del usuario...');
        return;
      }
      try {
        setLoadingPerfil(true);
        console.log('📋 Cargando perfil completo del egresado...');
        // Usar SIEMPRE la función correcta que valida token y procesa datos
        const datos = await GraduateService.obtenerMiPerfilEgresado();
        setPerfil(datos);
        console.log('✅ Perfil completo del egresado cargado:', datos);
      } catch (error) {
        console.error('❌ Error cargando perfil:', error);
        // Si falla, usar datos mínimos del contexto
        if (user) {
          setPerfil({
            nombre_completo: getFullName(),
            correo: user.correo || user.email || '',
            id_egresado: user.id_egresado || user.id_usuario || ''
          });
        }
      } finally {
        setLoadingPerfil(false);
      }
    };
    if (!loading) {
      cargarPerfil();
    }
  }, [user, loading, getFullName]);

  // Función para cerrar sesión
  const handleLogout = async () => {
    if (window.confirm('¿Está seguro de que desea cerrar sesión?')) {
      try {
        await AuthService.logout();
        console.log('✅ Sesión cerrada exitosamente');
        navigate('/login');
      } catch (error) {
        console.error('❌ Error al cerrar sesión:', error);
        // Aunque falle, redirigir al login
        navigate('/login');
      }
    }
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

            {/* Action button then user quick badge (avatar + name) */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <span className="text-green-600 font-bold text-lg">
                    {loadingPerfil || loading ? '...' : getInitials()}
                  </span>
                </div>
                <div className="hidden md:block">
                  <p className="text-sm font-medium text-gray-900">
                    {loadingPerfil || loading ? 'Cargando...' : (perfil?.nombre_completo || getFullName())}
                  </p>
                  <p className="text-xs text-gray-500">Egresado</p>
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
              to="/graduate/register-project" 
              className="w-full inline-block text-center bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 hover:shadow-lg hover:scale-105 transition-all duration-300 transform animate-pulse hover:animate-none mt-4"
            >
              <span className="flex items-center justify-center gap-2">
                <i className="pi pi-plus-circle"></i>
                Postular Proyecto
              </span>
            </Link>

            {/* User Info Card */}
            <div className="bg-white rounded-lg border border-gray-200 p-4 mt-4">
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-green-600 font-bold text-2xl">{getInitials()}</span>
                </div>
                <h3 className="font-semibold text-gray-900">{perfil?.nombre_completo || getFullName()}</h3>
                <p className="text-sm text-gray-500">Egresado UPC</p>
                {perfil?.anio_graduacion && (
                  <p className="text-xs text-gray-400 mt-1">Promoción {perfil.anio_graduacion}</p>
                )}
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <main className="lg:col-span-3">
            
            {/* Welcome Section */}
            <div className="bg-gradient-to-r from-green-600 to-green-700 rounded-lg p-6 mb-6 text-white">
              <h2 className="text-2xl font-bold mb-2">Bienvenido, {perfil?.primer_nombre || getFullName().split(' ')[0]}</h2>
              <p className="text-green-50 mb-4">
                Comparte tu experiencia profesional y proyectos innovadores con la comunidad universitaria
              </p>
              <div className="flex items-center gap-4 text-sm">
                <span className="flex items-center gap-2">
                  <i className="pi pi-calendar"></i>
                  Miembro desde {perfil?.anio_graduacion || '2024'}
                </span>
                <span className="flex items-center gap-2">
                  <i className="pi pi-envelope"></i>
                  {perfil?.correo || user?.email || 'Sin correo'}
                </span>
              </div>
            </div>

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
                        Expo-software 2025
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
                      Invitamos a los egresados de Ingeniería de Sistemas a compartir sus proyectos profesionales, 
                      desarrollos innovadores y experiencias en el sector tecnológico. Esta es una oportunidad única 
                      para conectar con la comunidad académica, inspirar a estudiantes actuales y fortalecer la red de alumni.
                    </p>
                  </div>

                  <div className="border-t border-gray-100 pt-4 mb-4">
                    <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                      <i className="pi pi-check-circle text-green-600"></i>
                      ¿Cómo participar?
                    </h4>
                    <div className="space-y-2 text-sm text-gray-600">
                      <p className="flex items-start gap-2">
                        <span className="text-green-600 font-bold">1.</span>
                        <span>Completa tu perfil profesional en la sección de configuración</span>
                      </p>
                      <p className="flex items-start gap-2">
                        <span className="text-green-600 font-bold">2.</span>
                        <span>Registra tu proyecto haciendo clic en "Postular Proyecto"</span>
                      </p>
                      <p className="flex items-start gap-2">
                        <span className="text-green-600 font-bold">3.</span>
                        <span>Prepara tu presentación y materiales de apoyo</span>
                      </p>
                      <p className="flex items-start gap-2">
                        <span className="text-green-600 font-bold">4.</span>
                        <span>Espera la confirmación y detalles del evento</span>
                      </p>
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

          </main>
        </div>
      </div>
    </div>
  );
}
