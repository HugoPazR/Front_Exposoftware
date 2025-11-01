import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import * as AuthService from "../../Services/AuthService";
import logo from "../../assets/Logo-unicesar.png";

function GuestProfile() {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

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
              <button
                onClick={() => navigate('/guest/dashboard')}
                className="text-sm font-medium text-purple-600 hover:text-purple-700 transition-colors"
              >
                <i className="pi pi-arrow-left mr-2"></i>
                Volver al Dashboard
              </button>

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
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            {/* Profile Header */}
            <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-8 text-white">
              <div className="flex items-center gap-6">
                <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center">
                  <span className="text-purple-600 font-bold text-4xl">{getUserInitials()}</span>
                </div>
                <div>
                  <h2 className="text-3xl font-bold mb-1">{getUserName()}</h2>
                  <p className="text-purple-100 flex items-center gap-2">
                    <i className="pi pi-user"></i>
                    Invitado - Expo-software 2025
                  </p>
                </div>
              </div>
            </div>

            {/* Profile Content */}
            <div className="p-8">
              <div className="mb-6 flex items-center justify-between">
                <h3 className="text-xl font-bold text-gray-900">Información Personal</h3>
                <button
                  onClick={() => setIsEditing(!isEditing)}
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                >
                  <i className={`pi ${isEditing ? 'pi-times' : 'pi-pencil'} mr-2`}></i>
                  {isEditing ? 'Cancelar' : 'Editar'}
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nombre Completo
                  </label>
                  <input
                    type="text"
                    value={userData?.nombres || getUserName()}
                    disabled={!isEditing}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent disabled:bg-gray-100"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Correo Electrónico
                  </label>
                  <input
                    type="email"
                    value={userData?.correo || ''}
                    disabled={!isEditing}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent disabled:bg-gray-100"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Identificación
                  </label>
                  <input
                    type="text"
                    value={userData?.identificacion || 'No especificado'}
                    disabled
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg bg-gray-100"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Rol
                  </label>
                  <input
                    type="text"
                    value="Invitado"
                    disabled
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg bg-gray-100"
                  />
                </div>
              </div>

              {isEditing && (
                <div className="mt-6 flex gap-4">
                  <button
                    onClick={() => {
                      alert('Funcionalidad de guardar próximamente');
                      setIsEditing(false);
                    }}
                    className="flex-1 py-3 px-6 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium"
                  >
                    <i className="pi pi-check mr-2"></i>
                    Guardar Cambios
                  </button>
                  <button
                    onClick={() => setIsEditing(false)}
                    className="flex-1 py-3 px-6 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors font-medium"
                  >
                    <i className="pi pi-times mr-2"></i>
                    Cancelar
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Information Card */}
          <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-6">
            <div className="flex items-start gap-3">
              <i className="pi pi-info-circle text-blue-600 text-xl mt-1"></i>
              <div>
                <h4 className="font-semibold text-blue-900 mb-2">Nota para Invitados</h4>
                <p className="text-sm text-blue-800">
                  Como usuario invitado, tus opciones de edición pueden estar limitadas. 
                  Para obtener acceso completo, contacta con los administradores del sistema.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default GuestProfile;
