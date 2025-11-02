import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import * as AuthService from "../../Services/AuthService";
import logo from "../../assets/Logo-unicesar.png";

function GuestDashboard() {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const user = AuthService.getUserData();
    if (user) {
      setUserData(user);
    }
  }, []);

  const getUserName = () => {
    if (!userData) return 'Invitado';
    return userData.nombre || userData.nombres || userData.correo?.split('@')[0] || 'Invitado';
  };

  const getUserInitials = () => {
    const name = getUserName();
    return name.charAt(0).toUpperCase();
  };

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

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3">
                <span className="text-sm text-gray-700 hidden sm:block">{getUserName()}</span>
                <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                  <span className="text-purple-600 font-bold text-lg">{getUserInitials()}</span>
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

      {/* Main Content */}
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Welcome Banner */}
          <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg shadow-lg p-8 mb-8 text-white">
            <h2 className="text-3xl font-bold mb-2">
              ¡Bienvenido, {getUserName()}! 👋
            </h2>
            <p className="text-purple-100">
              Panel de control para invitados - Expo-software 2025
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-purple-500">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Proyectos Disponibles</p>
                  <p className="text-3xl font-bold text-gray-900">0</p>
                </div>
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                  <i className="pi pi-folder text-purple-600 text-xl"></i>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-pink-500">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Eventos</p>
                  <p className="text-3xl font-bold text-gray-900">0</p>
                </div>
                <div className="w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center">
                  <i className="pi pi-calendar text-pink-600 text-xl"></i>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-indigo-500">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Mi Perfil</p>
                  <p className="text-3xl font-bold text-gray-900">
                    <i className="pi pi-user text-2xl"></i>
                  </p>
                </div>
                <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center">
                  <i className="pi pi-id-card text-indigo-600 text-xl"></i>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <i className="pi pi-bolt text-purple-600"></i>
              Acciones Rápidas
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <button
                onClick={() => navigate('/guest/profile')}
                className="p-4 border-2 border-gray-200 rounded-lg hover:border-purple-500 hover:bg-purple-50 transition-all text-left"
              >
                <i className="pi pi-user text-2xl text-purple-600 mb-2 block"></i>
                <h4 className="font-semibold text-gray-900 mb-1">Mi Perfil</h4>
                <p className="text-sm text-gray-600">Ver y editar información personal</p>
              </button>

              <button
                onClick={() => navigate('/guest/projects')}
                className="p-4 border-2 border-gray-200 rounded-lg hover:border-pink-500 hover:bg-pink-50 transition-all text-left"
              >
                <i className="pi pi-folder text-2xl text-pink-600 mb-2 block"></i>
                <h4 className="font-semibold text-gray-900 mb-1">Ver Proyectos</h4>
                <p className="text-sm text-gray-600">Explorar proyectos disponibles</p>
              </button>

              <button
                onClick={() => navigate('/projects')}
                className="p-4 border-2 border-gray-200 rounded-lg hover:border-indigo-500 hover:bg-indigo-50 transition-all text-left"
              >
                <i className="pi pi-calendar text-2xl text-indigo-600 mb-2 block"></i>
                <h4 className="font-semibold text-gray-900 mb-1">Eventos</h4>
                <p className="text-sm text-gray-600">Ver eventos disponibles</p>
              </button>
            </div>
          </div>

          {/* Information Card */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <div className="flex items-start gap-3">
              <i className="pi pi-info-circle text-blue-600 text-xl mt-1"></i>
              <div>
                <h4 className="font-semibold text-blue-900 mb-2">Información para Invitados</h4>
                <p className="text-sm text-blue-800">
                  Como usuario invitado, puedes explorar los proyectos y eventos de Expo-software 2025. 
                  Para participar activamente, contacta con los administradores del evento.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default GuestDashboard;
