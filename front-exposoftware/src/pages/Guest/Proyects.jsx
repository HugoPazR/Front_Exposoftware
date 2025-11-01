import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import * as AuthService from "../../Services/AuthService";
import logo from "../../assets/Logo-unicesar.png";

function GuestProjects() {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    const user = AuthService.getUserData();
    if (user) {
      setUserData(user);
    }
    // TODO: Cargar proyectos desde el backend
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
        <div className="max-w-6xl mx-auto">
          {/* Page Header */}
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Proyectos Expo-software 2025</h2>
            <p className="text-gray-600">Explora los proyectos presentados en el evento</p>
          </div>

          {/* Search and Filters */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <i className="pi pi-search absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"></i>
                <input
                  type="text"
                  placeholder="Buscar proyectos por nombre, autor o tema..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
              <button className="px-6 py-2.5 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium">
                <i className="pi pi-filter mr-2"></i>
                Filtros
              </button>
            </div>
          </div>

          {/* Projects Grid */}
          {projects.length === 0 ? (
            <div className="bg-white rounded-lg shadow-md p-12 text-center">
              <i className="pi pi-folder-open text-6xl text-gray-300 mb-4 block"></i>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No hay proyectos disponibles</h3>
              <p className="text-gray-600 mb-6">
                Los proyectos se mostrarán aquí una vez que estén disponibles para visualización.
              </p>
              <button
                onClick={() => navigate('/guest/dashboard')}
                className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium"
              >
                <i className="pi pi-arrow-left mr-2"></i>
                Volver al Dashboard
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Project cards would go here */}
              {projects.map((project, index) => (
                <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="h-48 bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center">
                    <i className="pi pi-file text-white text-6xl"></i>
                  </div>
                  <div className="p-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-2">{project.nombre}</h3>
                    <p className="text-sm text-gray-600 mb-4">{project.descripcion}</p>
                    <button className="w-full py-2 px-4 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
                      Ver Detalles
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Information Card */}
          <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
            <div className="flex items-start gap-3">
              <i className="pi pi-info-circle text-blue-600 text-xl mt-1"></i>
              <div>
                <h4 className="font-semibold text-blue-900 mb-2">Información sobre los Proyectos</h4>
                <p className="text-sm text-blue-800">
                  Como invitado, puedes ver los proyectos disponibles en Expo-software 2025. 
                  Para obtener más información sobre un proyecto específico, haz clic en "Ver Detalles".
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default GuestProjects;
