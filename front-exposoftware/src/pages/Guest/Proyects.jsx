import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { obtenerMiPerfilInvitado, obtenerTodosLosProyectos } from "../../Services/GuestService";
import logo from "../../assets/Logo-unicesar.png";

export default function GuestProjects() {
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  const [selectedProject, setSelectedProject] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const [perfil, setPerfil] = useState(null);
  const [proyectos, setProyectos] = useState([]);

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    try {
      setCargando(true);
      setError(null);
      
      // Cargar perfil y proyectos en paralelo
      const [datosPerfil, datosProyectos] = await Promise.all([
        obtenerMiPerfilInvitado(),
        obtenerTodosLosProyectos()
      ]);
      
      setPerfil(datosPerfil);
      setProyectos(datosProyectos);
      
      console.log('✅ Datos cargados - Perfil:', datosPerfil, 'Proyectos:', datosProyectos.length);
    } catch (err) {
      console.error('❌ Error cargando datos:', err);
      setError(err.message);
    } finally {
      setCargando(false);
    }
  };

  const handleLogout = () => {
    if (window.confirm("¿Estás seguro de que deseas cerrar sesión?")) {
      logout();
      navigate("/login");
    }
  };

  // Datos del invitado - desde el perfil real
  const invitadoData = perfil || {
    id_invitado: "Cargando...",
    nombres: user?.primer_nombre || "Invitado",
    apellidos: user?.primer_apellido || "Usuario",
    nombre_empresa: "Cargando...",
    id_sector: "...",
    correo: user?.correo || user?.email || "",
    rol: user?.rol || "Invitado"
  };

  const handleViewDetails = (project) => {
    setSelectedProject(project);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedProject(null);
  };

  // Filtrar proyectos por búsqueda
  const filteredProjects = proyectos.filter(project => {
    if (!searchTerm) return true;
    
    const searchLower = searchTerm.toLowerCase();
    const matchesTitle = (project.nombre_proyecto || project.titulo || '').toLowerCase().includes(searchLower);
    const matchesDescription = (project.descripcion || '').toLowerCase().includes(searchLower);
    
    return matchesTitle || matchesDescription;
  });

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

            {/* User avatar and info */}
            <div className="flex items-center gap-4">

              <div className="flex items-center gap-3">
                <span className="text-sm text-gray-700 hidden sm:block">
                  {invitadoData.nombres} {invitadoData.apellidos}
                </span>
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <span className="text-green-600 font-bold text-lg">
                    {invitadoData.nombres.charAt(0)}{invitadoData.apellidos.charAt(0)}
                  </span>
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
                <Link
                  to="/guest/dashboard"
                  className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors text-gray-700 hover:bg-gray-50"
                >
                  <i className="pi pi-home text-base"></i>
                  Dashboard
                </Link>
                <Link
                  to="/guest/proyectos"
                  className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors bg-green-50 text-green-700"
                >
                  <i className="pi pi-book text-base"></i>
                  Ver Proyectos
                </Link>
                <Link
                  to="/guest/profile"
                  className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors text-gray-700 hover:bg-gray-50"
                >
                  <i className="pi pi-cog text-base"></i>
                  Configuración
                </Link>
              </nav>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 p-4 mt-4">
              <div className="text-center mb-4">
                <div className="w-16 h-16 bg-gradient-to-br from-green-100 to-green-200 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-green-700 font-bold text-2xl">
                    {invitadoData.nombres.charAt(0)}{invitadoData.apellidos.charAt(0)}
                  </span>
                </div>
                <h3 className="font-semibold text-gray-900">
                  {invitadoData.nombres} {invitadoData.apellidos}
                </h3>
                <p className="text-sm text-green-600 font-medium mt-1 flex items-center justify-center gap-1">
                  <i className="pi pi-user"></i>
                  {invitadoData.rol}
                </p>
              </div>
              
              <div className="border-t border-gray-100 pt-3 space-y-2">
                <div className="flex items-start gap-2">
                  <i className="pi pi-building text-green-600 text-sm mt-0.5"></i>
                  <div className="flex-1">
                    <p className="text-xs text-gray-500">Empresa/Institución</p>
                    <p className="text-sm text-gray-900 font-medium">{invitadoData.nombre_empresa}</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-2">
                  <i className="pi pi-tag text-green-600 text-sm mt-0.5"></i>
                  <div className="flex-1">
                    <p className="text-xs text-gray-500">Sector</p>
                    <p className="text-sm text-gray-900 font-medium capitalize">{invitadoData.id_sector}</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-2">
                  <i className="pi pi-envelope text-green-600 text-sm mt-0.5"></i>
                  <div className="flex-1">
                    <p className="text-xs text-gray-500">Correo</p>
                    <p className="text-sm text-gray-900 font-medium break-all">{invitadoData.correo}</p>
                  </div>
                </div>

                <div className="flex items-start gap-2">
                  <i className="pi pi-id-card text-green-600 text-sm mt-0.5"></i>
                  <div className="flex-1">
                    <p className="text-xs text-gray-500">ID Invitado</p>
                    <p className="text-sm text-gray-900 font-medium">{invitadoData.id_invitado}</p>
                  </div>
                </div>
              </div>
            </div>
          </aside>

          {/* Main content */}
          <main className="lg:col-span-3">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-2">Proyectos Disponibles</h2>
                <p className="text-gray-600">Explora los proyectos que se presentarán en el evento</p>
              </div>
            </div>

            {/* Estado de carga */}
            {cargando && (
              <div className="bg-white rounded-lg border border-gray-200 p-12 text-center mb-6">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mb-4"></div>
                <p className="text-gray-600">Cargando proyectos...</p>
              </div>
            )}

            {/* Error */}
            {error && !cargando && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                <div className="flex items-center gap-3">
                  <i className="pi pi-exclamation-triangle text-red-600 text-xl"></i>
                  <div>
                    <h3 className="text-sm font-semibold text-red-900">Error al cargar proyectos</h3>
                    <p className="text-sm text-red-700 mt-1">{error}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Contenido - Solo si no hay error ni está cargando */}
            {!cargando && !error && (
              <>
                {/* Panel de Filtros */}
                <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <i className="pi pi-filter text-green-600"></i>
                    Búsqueda
                  </h3>

                  {/* Barra de búsqueda */}
                  <div className="mb-4">
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="Buscar por título o descripción..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      />
                      <i className="pi pi-search absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"></i>
                      {searchTerm && (
                        <button
                          onClick={() => setSearchTerm("")}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                          <i className="pi pi-times"></i>
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Contador de resultados */}
                  {searchTerm && (
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-gray-600">
                        Mostrando {filteredProjects.length} de {proyectos.length} proyectos
                      </p>
                      <button
                        onClick={() => setSearchTerm("")}
                        className="text-sm text-green-600 hover:text-green-700 font-medium flex items-center gap-1"
                      >
                        <i className="pi pi-times-circle"></i>
                        Limpiar búsqueda
                      </button>
                    </div>
                  )}
                </div>

                {/* Grid de Proyectos */}
                {filteredProjects.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {filteredProjects.map(p => (
                      <div key={p.id_proyecto} className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg transition-shadow">
                        <div className="flex items-start justify-between mb-3">
                          <h3 className="text-lg font-semibold text-gray-900 flex-1">
                            {p.nombre_proyecto || p.titulo || 'Proyecto sin título'}
                          </h3>
                        </div>
                        
                        <p className="text-sm text-gray-600 mb-4 line-clamp-3">
                          {p.descripcion || 'Sin descripción disponible'}
                        </p>

                        <button 
                          onClick={() => handleViewDetails(p)}
                          className="w-full border border-gray-200 px-4 py-2 rounded-lg text-sm font-medium flex items-center justify-center gap-2 hover:bg-gray-50 transition-colors"
                        >
                          <i className="pi pi-eye"></i> Ver detalles
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
                    <div className="w-16 h-16 bg-gray-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                      <i className="pi pi-search text-4xl text-gray-400"></i>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {proyectos.length === 0 ? 'No hay proyectos disponibles' : 'No se encontraron proyectos'}
                    </h3>
                    <p className="text-gray-500 mb-4">
                      {proyectos.length === 0 
                        ? 'Aún no se han registrado proyectos para el evento.'
                        : 'No hay proyectos que coincidan con tu búsqueda.'}
                    </p>
                    {searchTerm && (
                      <button
                        onClick={() => setSearchTerm("")}
                        className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                      >
                        Limpiar búsqueda
                      </button>
                    )}
                  </div>
                )}
              </>
            )}
          </main>
        </div>
      </div>

      {/* Modal de Detalles del Proyecto */}
      {showModal && selectedProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4 overflow-auto">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] overflow-auto">
            {/* Header del modal */}
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between z-10">
              <h3 className="text-xl font-bold text-gray-900">Detalles del Proyecto</h3>
              <button 
                onClick={closeModal}
                className="text-gray-500 hover:text-gray-700 transition-colors"
              >
                <i className="pi pi-times text-xl"></i>
              </button>
            </div>

            {/* Contenido del modal */}
            <div className="p-6">
              <div className="space-y-6">
                {/* Título */}
                <div>
                  <h4 className="text-2xl font-bold text-gray-900 mb-2">
                    {selectedProject.nombre_proyecto || selectedProject.titulo || 'Proyecto sin título'}
                  </h4>
                </div>

                {/* Descripción */}
                {selectedProject.descripcion && (
                  <div>
                    <h5 className="text-sm font-semibold text-gray-900 mb-2 flex items-center gap-2">
                      <i className="pi pi-align-left text-green-600"></i>
                      Descripción
                    </h5>
                    <p className="text-sm text-gray-700 leading-relaxed bg-gray-50 p-4 rounded-lg">
                      {selectedProject.descripcion}
                    </p>
                  </div>
                )}

                {/* Información adicional disponible */}
                {(selectedProject.objetivo || selectedProject.justificacion || selectedProject.alcance) && (
                  <div>
                    <h5 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                      <i className="pi pi-info-circle text-green-600"></i>
                      Información del Proyecto
                    </h5>
                    <div className="bg-gray-50 p-4 rounded-lg space-y-3">
                      {selectedProject.objetivo && (
                        <div>
                          <p className="text-xs text-gray-500 mb-1">Objetivo</p>
                          <p className="text-sm font-medium text-gray-900">{selectedProject.objetivo}</p>
                        </div>
                      )}
                      {selectedProject.justificacion && (
                        <div>
                          <p className="text-xs text-gray-500 mb-1">Justificación</p>
                          <p className="text-sm font-medium text-gray-900">{selectedProject.justificacion}</p>
                        </div>
                      )}
                      {selectedProject.alcance && (
                        <div>
                          <p className="text-xs text-gray-500 mb-1">Alcance</p>
                          <p className="text-sm font-medium text-gray-900">{selectedProject.alcance}</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* IDs del proyecto */}
                <div>
                  <h5 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <i className="pi pi-id-card text-green-600"></i>
                    Información Técnica
                  </h5>
                  <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">ID Proyecto:</span>
                      <span className="font-medium text-gray-900">{selectedProject.id_proyecto}</span>
                    </div>
                    {selectedProject.id_linea && (
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">ID Línea de Investigación:</span>
                        <span className="font-medium text-gray-900">{selectedProject.id_linea}</span>
                      </div>
                    )}
                    {selectedProject.id_materia && (
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">ID Materia:</span>
                        <span className="font-medium text-gray-900">{selectedProject.id_materia}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Footer del modal */}
            <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 px-6 py-4 flex items-center justify-end gap-3">
              <button 
                onClick={closeModal}
                className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}