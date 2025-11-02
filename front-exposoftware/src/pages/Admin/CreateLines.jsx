import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../../assets/Logo-unicesar.png";
import AdminSidebar from "../../components/Layout/AdminSidebar";
import * as AuthService from "../../Services/AuthService";
import { useResearchLinesManagement } from "./useResearchLinesManagement";
import { EditLineaModal, EditSublineaModal, EditAreaModal } from "./EditResearchLinesModals";

export default function CreateLines() {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  
  // Cargar datos del usuario autenticado
  useEffect(() => {
    const user = AuthService.getUserData();
    if (user) {
      setUserData(user);
    }
  }, []);

  // Obtener nombre del usuario
  const getUserName = () => {
    if (!userData) return 'Administrador';
    return userData.nombre || userData.nombres || userData.correo?.split('@')[0] || 'Administrador';
  };

  const getUserInitials = () => {
    const name = getUserName();
    return name.charAt(0).toUpperCase();
  };

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

  // Estado para tabs
  const [activeTab, setActiveTab] = useState("lineas"); // lineas | sublineas | areas

  // Obtener todas las funcionalidades del custom hook
  const {
    // Estados de líneas
    codigoLinea,
    setCodigoLinea,
    nombreLinea,
    setNombreLinea,
    lineas,
    lineasFiltradas,
    searchTermLinea,
    setSearchTermLinea,
    showEditLineaModal,

    // Estados de sublíneas
    codigoSublinea,
    setCodigoSublinea,
    nombreSublinea,
    setNombreSublinea,
    idLineaParaSublinea,
    setIdLineaParaSublinea,
    sublineas,
    sublineasFiltradas,
    sublineasPorLinea,
    searchTermSublinea,
    setSearchTermSublinea,
    showEditSublineaModal,

    // Estados de áreas
    codigoArea,
    setCodigoArea,
    nombreArea,
    setNombreArea,
    idSublineaParaArea,
    setIdSublineaParaArea,
    areas,
    areasFiltradas,
    areasPorSublinea,
    searchTermArea,
    setSearchTermArea,
    showEditAreaModal,

    // Funciones auxiliares
    getLineaNombre,
    getSublineaNombre,
    getSublineasPorLinea,

    // CRUD Líneas
    handleSubmitLinea,
    handleEditLinea,
    handleSaveEditLinea,
    handleCancelEditLinea,
    handleDeleteLinea,

    // CRUD Sublíneas
    handleSubmitSublinea,
    handleEditSublinea,
    handleSaveEditSublinea,
    handleCancelEditSublinea,
    handleDeleteSublinea,

    // CRUD Áreas
    handleSubmitArea,
    handleEditArea,
    handleSaveEditArea,
    handleCancelEditArea,
    handleDeleteArea,
  } = useResearchLinesManagement();

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
          <AdminSidebar userName={getUserName()} userRole="Administrador" />

          {/* Main Content */}
          <main className="lg:col-span-3">
            {/* Tabs de navegación */}
            <div className="bg-white rounded-lg border border-gray-200 p-2 mb-6">
              <div className="flex gap-2">
                <button
                  onClick={() => setActiveTab("lineas")}
                  className={`flex-1 px-4 py-2.5 rounded-lg text-sm font-semibold transition ${
                    activeTab === "lineas"
                      ? "bg-teal-600 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  📚 Líneas de Investigación
                </button>
                <button
                  onClick={() => setActiveTab("sublineas")}
                  className={`flex-1 px-4 py-2.5 rounded-lg text-sm font-semibold transition ${
                    activeTab === "sublineas"
                      ? "bg-teal-600 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  🔗 Sublíneas
                </button>
                <button
                  onClick={() => setActiveTab("areas")}
                  className={`flex-1 px-4 py-2.5 rounded-lg text-sm font-semibold transition ${
                    activeTab === "areas"
                      ? "bg-teal-600 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  🏷️ Áreas Temáticas
                </button>
              </div>
            </div>

            {/* ========== TAB 1: LÍNEAS DE INVESTIGACIÓN ========== */}
            {activeTab === "lineas" && (
              <div className="bg-white rounded-lg border border-gray-200 p-8">
                <div className="mb-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    Crear Línea de Investigación
                  </h2>
                  <p className="text-sm text-gray-600">
                    Las líneas son áreas principales de investigación. Las sublíneas y áreas dependerán de estas.
                  </p>
                </div>

                {/* Formulario Línea */}
                <form onSubmit={handleSubmitLinea} className="space-y-6 max-w-2xl">
                  <div>
                    <label htmlFor="nombreLinea" className="block text-sm font-medium text-gray-700 mb-2">
                      Nombre de la Línea de Investigación <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="nombreLinea"
                      value={nombreLinea}
                      onChange={(e) => setNombreLinea(e.target.value)}
                      placeholder="Ej: Inteligencia Artificial"
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                      required
                    />
                    <p className="mt-1 text-xs text-gray-500">El código se generará automáticamente</p>
                  </div>

                  <div className="pt-4">
                    <button
                      type="submit"
                      className="w-full bg-teal-600 text-white px-6 py-3 rounded-lg text-sm font-semibold hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 transition-all shadow-md hover:shadow-lg"
                    >
                      Crear Línea de Investigación
                    </button>
                  </div>
                </form>

                {/* Tabla de Líneas */}
                <div className="mt-12 pt-8 border-t border-gray-200">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">Líneas Registradas</h3>
                      <p className="text-sm text-gray-500 mt-1">
                        {lineasFiltradas.length} {lineasFiltradas.length === 1 ? 'línea' : 'líneas'} encontradas
                      </p>
                    </div>
                    
                    <div className="relative w-64">
                      <input
                        type="text"
                        placeholder="Buscar líneas..."
                        value={searchTermLinea}
                        onChange={(e) => setSearchTermLinea(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                      />
                      <i className="pi pi-search absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"></i>
                    </div>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Código
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Nombre
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Fecha Creación
                          </th>
                          <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Acciones
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {lineasFiltradas.length === 0 ? (
                          <tr>
                            <td colSpan="4" className="px-6 py-12 text-center text-gray-500">
                              <i className="pi pi-inbox text-4xl mb-3 block"></i>
                              <p className="text-sm">No se encontraron líneas</p>
                            </td>
                          </tr>
                        ) : (
                          lineasFiltradas.map((linea, idx) => (
                            <tr key={`linea-${linea.codigo_linea || idx}`} className="hover:bg-gray-50 transition">
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium bg-teal-100 text-teal-800">
                                  {linea.codigo_linea}
                                </span>
                              </td>
                              <td className="px-6 py-4">
                                <div className="text-sm font-medium text-gray-900">{linea.nombre_linea}</div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-gray-500">{linea.fechaCreacion || 'N/A'}</div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-center">
                                <div className="flex items-center justify-center gap-2">
                                  <button
                                    onClick={() => handleEditLinea(linea)}
                                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                                    title="Editar"
                                  >
                                    <i className="pi pi-pencil"></i>
                                  </button>
                                  <button
                                    onClick={() => handleDeleteLinea(linea.id)}
                                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                                    title="Eliminar"
                                  >
                                    <i className="pi pi-trash"></i>
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* ========== TAB 2: SUBLÍNEAS ========== */}
            {activeTab === "sublineas" && (
              <div className="bg-white rounded-lg border border-gray-200 p-8">
                <div className="mb-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    Crear Sublínea
                  </h2>
                  <p className="text-sm text-gray-600">
                    Las sublíneas son divisiones específicas de una línea de investigación.
                  </p>
                </div>

                {/* Formulario Sublínea */}
                <form onSubmit={handleSubmitSublinea} className="space-y-6 max-w-2xl">
                  <div>
                    <label htmlFor="idLineaParaSublinea" className="block text-sm font-medium text-gray-700 mb-2">
                      Línea de Investigación (Principal) <span className="text-red-500">*</span>
                    </label>
                    <select
                      id="idLineaParaSublinea"
                      value={idLineaParaSublinea}
                      onChange={(e) => setIdLineaParaSublinea(e.target.value)}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all appearance-none bg-white cursor-pointer"
                      required
                    >
                      <option value="">Selecciona una línea</option>
                      {lineas.map((linea, idx) => (
                        <option key={`linea-${linea.codigo_linea || idx}`} value={String(linea.codigo_linea)}>
                          {linea.codigo_linea} - {linea.nombre_linea}
                        </option>
                      ))}
                    </select>
                    <p className="mt-1 text-xs text-gray-500">La línea principal a la que pertenece esta sublínea</p>
                  </div>

                  <div>
                    <label htmlFor="nombreSublinea" className="block text-sm font-medium text-gray-700 mb-2">
                      Nombre de la Sublínea <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="nombreSublinea"
                      value={nombreSublinea}
                      onChange={(e) => setNombreSublinea(e.target.value)}
                      placeholder="Ej: Deep Learning"
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                      required
                    />
                    <p className="mt-1 text-xs text-gray-500">El código se generará automáticamente</p>
                  </div>

                  <div className="pt-4">
                    <button
                      type="submit"
                      className="w-full bg-teal-600 text-white px-6 py-3 rounded-lg text-sm font-semibold hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 transition-all shadow-md hover:shadow-lg"
                    >
                      Crear Sublínea
                    </button>
                  </div>
                </form>

                {/* Tabla de Sublíneas */}
                <div className="mt-12 pt-8 border-t border-gray-200">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">Sublíneas Registradas</h3>
                      <p className="text-sm text-gray-500 mt-1">
                        {sublineasFiltradas.length} {sublineasFiltradas.length === 1 ? 'sublínea' : 'sublíneas'} encontradas
                      </p>
                    </div>
                    
                    <div className="relative w-64">
                      <input
                        type="text"
                        placeholder="Buscar sublíneas..."
                        value={searchTermSublinea}
                        onChange={(e) => setSearchTermSublinea(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                      />
                      <i className="pi pi-search absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"></i>
                    </div>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Código
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Sublínea
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Línea Principal
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Fecha Creación
                          </th>
                          <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Acciones
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {sublineasFiltradas.length === 0 ? (
                          <tr>
                            <td colSpan="5" className="px-6 py-12 text-center text-gray-500">
                              <i className="pi pi-inbox text-4xl mb-3 block"></i>
                              <p className="text-sm">No se encontraron sublíneas</p>
                            </td>
                          </tr>
                        ) : (
                          sublineasFiltradas.map((sublinea) => (
                            <tr key={`sublinea-${sublinea.codigo_linea}-${sublinea.codigo_sublinea}`} className="hover:bg-gray-50 transition">
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium bg-blue-100 text-blue-800">
                                  {sublinea.codigo_sublinea}
                                </span>
                              </td>
                              <td className="px-6 py-4">
                                <div className="text-sm font-medium text-gray-900">{sublinea.nombre_sublinea}</div>
                              </td>
                              <td className="px-6 py-4">
                                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800">
                                  {getLineaNombre(sublinea.codigo_linea)}
                                </span>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-gray-500">{sublinea.fechaCreacion || 'N/A'}</div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-center">
                                <div className="flex items-center justify-center gap-2">
                                  <button
                                    onClick={() => handleEditSublinea(sublinea)}
                                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                                    title="Editar"
                                  >
                                    <i className="pi pi-pencil"></i>
                                  </button>
                                  <button
                                    onClick={() => handleDeleteSublinea(sublinea.codigo_sublinea)}
                                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                                    title="Eliminar"
                                  >
                                    <i className="pi pi-trash"></i>
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* ========== TAB 3: ÁREAS TEMÁTICAS ========== */}
            {activeTab === "areas" && (
              <div className="bg-white rounded-lg border border-gray-200 p-8">
                <div className="mb-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    Crear Área Temática
                  </h2>
                  <p className="text-sm text-gray-600">
                    Las áreas temáticas son temas específicos dentro de una sublínea de investigación.
                  </p>
                </div>

                {/* Formulario Área */}
                <form onSubmit={handleSubmitArea} className="space-y-6 max-w-2xl">
                  <div>
                    <label htmlFor="lineaParaArea" className="block text-sm font-medium text-gray-700 mb-2">
                      Línea de Investigación (Paso 1) <span className="text-red-500">*</span>
                    </label>
                    <select
                      id="lineaParaArea"
                      value={idLineaParaSublinea}
                      onChange={(e) => setIdLineaParaSublinea(e.target.value)}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all appearance-none bg-white cursor-pointer"
                      required
                    >
                      <option value="">Selecciona una línea</option>
                      {lineas.map((linea, idx) => (
                        <option key={`linea-${linea.codigo_linea || idx}`} value={String(linea.codigo_linea)}>
                          {linea.codigo_linea} - {linea.nombre_linea}
                        </option>
                      ))}
                    </select>
                    <p className="mt-1 text-xs text-gray-500">Primero selecciona una línea para cargar sus sublíneas</p>
                  </div>

                  <div>
                    <label htmlFor="idSublineaParaArea" className="block text-sm font-medium text-gray-700 mb-2">
                      Sublínea de Investigación (Paso 2) <span className="text-red-500">*</span>
                    </label>
                    <select
                      id="idSublineaParaArea"
                      value={idSublineaParaArea}
                      onChange={(e) => setIdSublineaParaArea(e.target.value)}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all appearance-none bg-white cursor-pointer disabled:bg-gray-100 disabled:cursor-not-allowed"
                      required
                      disabled={!idLineaParaSublinea}
                    >
                      <option value="">
                        {idLineaParaSublinea 
                          ? (sublineasPorLinea.length > 0 
                            ? 'Selecciona una sublínea' 
                            : 'Cargando sublíneas...')
                          : 'Primero selecciona una línea'}
                      </option>
                      {sublineasPorLinea.map((sublinea, idx) => (
                        <option key={`sublinea-${sublinea.codigo_sublinea || idx}`} value={String(sublinea.codigo_sublinea)}>
                          {sublinea.codigo_sublinea} - {sublinea.nombre_sublinea}
                        </option>
                      ))}
                    </select>
                    <p className="mt-1 text-xs text-gray-500">Las sublíneas se cargarán automáticamente al seleccionar una línea</p>
                  </div>

                  <div>
                    <label htmlFor="nombreArea" className="block text-sm font-medium text-gray-700 mb-2">
                      Nombre del Área Temática <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="nombreArea"
                      value={nombreArea}
                      onChange={(e) => setNombreArea(e.target.value)}
                      placeholder="Ej: Redes Neuronales"
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                      required
                    />
                    <p className="mt-1 text-xs text-gray-500">El código se generará automáticamente</p>
                  </div>

                  <div className="pt-4">
                    <button
                      type="submit"
                      className="w-full bg-teal-600 text-white px-6 py-3 rounded-lg text-sm font-semibold hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 transition-all shadow-md hover:shadow-lg disabled:bg-gray-400 disabled:cursor-not-allowed"
                      disabled={!idSublineaParaArea}
                    >
                      Crear Área Temática
                    </button>
                  </div>

                  {/* Debug Info */}
                  <div className="mt-6 p-4 bg-gray-100 rounded-lg border border-gray-300">
                    <p className="text-xs text-gray-600 font-mono">
                      <strong>Debug:</strong><br/>
                      Línea seleccionada: {idLineaParaSublinea || 'Ninguna'}<br/>
                      Sublíneas cargadas: {sublineasPorLinea.length}<br/>
                      Sublínea seleccionada: {idSublineaParaArea || 'Ninguna'}<br/>
                      Estado botón: {!idSublineaParaArea ? 'Deshabilitado' : 'Habilitado'}
                    </p>
                  </div>
                </form>

                {/* Tabla de Áreas */}
                <div className="mt-12 pt-8 border-t border-gray-200">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">Áreas Temáticas Registradas</h3>
                      <p className="text-sm text-gray-500 mt-1">
                        {areasFiltradas.length} {areasFiltradas.length === 1 ? 'área' : 'áreas'} encontradas
                      </p>
                    </div>
                    
                    <div className="relative w-64">
                      <input
                        type="text"
                        placeholder="Buscar áreas..."
                        value={searchTermArea}
                        onChange={(e) => setSearchTermArea(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                      />
                      <i className="pi pi-search absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"></i>
                    </div>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Código
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Área Temática
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Sublínea
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Fecha Creación
                          </th>
                          <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Acciones
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {areasFiltradas.length === 0 ? (
                          <tr>
                            <td colSpan="5" className="px-6 py-12 text-center text-gray-500">
                              <i className="pi pi-inbox text-4xl mb-3 block"></i>
                              <p className="text-sm">No se encontraron áreas temáticas</p>
                            </td>
                          </tr>
                        ) : (
                          areasFiltradas.map((area) => (
                            <tr key={`area-${area.codigo_linea}-${area.codigo_sublinea}-${area.codigo_area}`} className="hover:bg-gray-50 transition">
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium bg-orange-100 text-orange-800">
                                  {area.codigo_area}
                                </span>
                              </td>
                              <td className="px-6 py-4">
                                <div className="text-sm font-medium text-gray-900">{area.nombre_area}</div>
                              </td>
                              <td className="px-6 py-4">
                                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                                  {getSublineaNombre(area.codigo_sublinea)}
                                </span>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-gray-500">{area.fechaCreacion || 'N/A'}</div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-center">
                                <div className="flex items-center justify-center gap-2">
                                  <button
                                    onClick={() => handleEditArea(area)}
                                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                                    title="Editar"
                                  >
                                    <i className="pi pi-pencil"></i>
                                  </button>
                                  <button
                                    onClick={() => handleDeleteArea(area.codigo_area)}
                                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                                    title="Eliminar"
                                  >
                                    <i className="pi pi-trash"></i>
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}
          </main>
        </div>
      </div>

      {/* ========== MODALES DE EDICIÓN ========== */}
      
      {/* Modal Editar Línea */}
      <EditLineaModal 
        show={showEditLineaModal}
        onSave={handleSaveEditLinea}
        onCancel={handleCancelEditLinea}
        codigoLinea={codigoLinea}
        setCodigoLinea={setCodigoLinea}
        nombreLinea={nombreLinea}
        setNombreLinea={setNombreLinea}
      />

      {/* Modal Editar Sublínea */}
      <EditSublineaModal 
        show={showEditSublineaModal}
        onSave={handleSaveEditSublinea}
        onCancel={handleCancelEditSublinea}
        codigoSublinea={codigoSublinea}
        setCodigoSublinea={setCodigoSublinea}
        nombreSublinea={nombreSublinea}
        setNombreSublinea={setNombreSublinea}
        idLineaParaSublinea={idLineaParaSublinea}
        setIdLineaParaSublinea={setIdLineaParaSublinea}
        lineas={lineas}
      />

      {/* Modal Editar Área */}
      <EditAreaModal 
        show={showEditAreaModal}
        onSave={handleSaveEditArea}
        onCancel={handleCancelEditArea}
        codigoArea={codigoArea}
        setCodigoArea={setCodigoArea}
        nombreArea={nombreArea}
        setNombreArea={setNombreArea}
        idSublineaParaArea={idSublineaParaArea}
        setIdSublineaParaArea={setIdSublineaParaArea}
        sublineas={sublineas}
        getLineaNombre={getLineaNombre}
      />
    </div>
  );
}
