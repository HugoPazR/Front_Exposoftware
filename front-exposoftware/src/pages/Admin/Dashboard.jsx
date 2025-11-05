import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../../assets/Logo-unicesar.png";
import AdminSidebar from "../../components/Layout/AdminSidebar";
import * as AuthService from "../../Services/AuthService";

// Main Dashboard Component
export default function AdminDashboard() {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);

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
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              {/* Card 1 - Total Proyectos Registrados */}
              <div className="bg-gradient-to-br from-teal-50 to-white rounded-lg border border-gray-200 p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Total Proyectos Registrados</p>
                    <h3 className="text-3xl font-bold text-gray-900">50</h3>
                    <div className="flex items-center gap-1 mt-2">
                      <i className="pi pi-arrow-up text-xs text-teal-600"></i>
                      <span className="text-xs text-teal-600 font-medium">1,890 Proyectos Activos</span>
                    </div>
                  </div>
                  <div className="w-12 h-12 bg-teal-100 rounded-full flex items-center justify-center">
                    <i className="pi pi-chart-line text-xl text-teal-600"></i>
                  </div>
                </div>
              </div>

              {/* Card 2 - Visitantes */}
              <div className="bg-gradient-to-br from-blue-50 to-white rounded-lg border border-gray-200 p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Visitantes</p>
                    <h3 className="text-3xl font-bold text-gray-900">12,345</h3>
                    <div className="flex items-center gap-1 mt-2">
                      <span className="text-xs text-gray-500">+5% esta semana</span>
                    </div>
                  </div>
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <i className="pi pi-users text-xl text-blue-600"></i>
                  </div>
                </div>
              </div>

              {/* Card 3 - Profesores */}
              <div className="bg-gradient-to-br from-purple-50 to-white rounded-lg border border-gray-200 p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Profesores</p>
                    <h3 className="text-3xl font-bold text-gray-900">120</h3>
                    <div className="flex items-center gap-1 mt-2">
                      <span className="text-xs text-gray-500">Nuevos profesores: 5</span>
                    </div>
                  </div>
                  <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                    <i className="pi pi-user text-xl text-purple-600"></i>
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

            {/* Tendencia de Visitantes */}
            <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Tendencia de Visitantes
              </h3>
              <div className="flex items-center justify-center h-64 text-gray-500">
                <div className="text-center">
                  <i className="pi pi-chart-line text-4xl mb-3 text-gray-400"></i>
                  <p>Datos en tiempo real próximamente</p>
                  <p className="text-sm">Se cargarán desde el backend</p>
                </div>
              </div>
            </div>

            {/* Proyectos Recientes */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">
                Proyectos Recientes
              </h3>
              <div className="flex items-center justify-center h-64 text-gray-500">
                <div className="text-center">
                  <i className="pi pi-folder text-4xl mb-3 text-gray-400"></i>
                  <p>No hay proyectos recientes para mostrar</p>
                  <p className="text-sm">Los proyectos se cargarán desde el backend</p>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
