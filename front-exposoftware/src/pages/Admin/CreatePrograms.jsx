import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../../assets/Logo-unicesar.png';
import AdminSidebar from '../../components/Layout/AdminSidebar';
import * as AuthService from '../../Services/AuthService';
import * as FacultadService from '../../Services/CreateFaculty';
import * as ProgramasService from '../../Services/CreateProgram';

function CreatePrograms() {
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
  // Estados para formulario
  const [facultadSeleccionada, setFacultadSeleccionada] = useState('');
  const [codigoPrograma, setCodigoPrograma] = useState('');
  const [nombrePrograma, setNombrePrograma] = useState('');
  
  // Estados para datos
  const [facultades, setFacultades] = useState([]);
  const [programas, setProgramas] = useState([]);
  const [loadingFacultades, setLoadingFacultades] = useState(false);
  const [loadingProgramas, setLoadingProgramas] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Estados para edición
  const [programaEditandoId, setProgramaEditandoId] = useState(null);
  const [nombreEditado, setNombreEditado] = useState('');
  const [showEditModal, setShowEditModal] = useState(false);
  
  // Estados para UI
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Cargar facultades al montar el componente
  useEffect(() => {
    cargarFacultades();
  }, []);

  // Cargar programas cuando cambia la facultad seleccionada
  useEffect(() => {
    if (facultadSeleccionada) {
      cargarProgramas(facultadSeleccionada);
    } else {
      setProgramas([]);
      setSearchTerm('');
    }
  }, [facultadSeleccionada]);

  // Cargar facultades desde la API
  const cargarFacultades = async () => {
    setLoadingFacultades(true);
    setError('');
    try {
      const datos = await FacultadService.obtenerFacultades();
      setFacultades(datos);
      console.log('✅ Facultades cargadas:', datos);
    } catch (err) {
      setError('Error al cargar facultades: ' + err.message);
      console.error('❌ Error:', err);
    } finally {
      setLoadingFacultades(false);
    }
  };

  // Cargar programas de una facultad
  const cargarProgramas = async (facultadId) => {
    setLoadingProgramas(true);
    setError('');
    try {
      const datos = await ProgramasService.obtenerProgramasPorFacultad(facultadId);
      setProgramas(datos);
      console.log(`✅ Programas de ${facultadId} cargados:`, datos);
    } catch (err) {
      setError('Error al cargar programas: ' + err.message);
      console.error('❌ Error:', err);
    } finally {
      setLoadingProgramas(false);
    }
  };

  // Crear nuevo programa
  const handleCrearPrograma = async (e) => {
    e.preventDefault();
    
    if (!facultadSeleccionada) {
      setError('Por favor selecciona una facultad');
      return;
    }
    
    if (!codigoPrograma.trim()) {
      setError('El código del programa es requerido');
      return;
    }
    
    if (!nombrePrograma.trim()) {
      setError('El nombre del programa es requerido');
      return;
    }

    // Validar formato de codigo_programa (3-15 caracteres)
    if (!/^[A-Z0-9_]{3,15}$/.test(codigoPrograma.toUpperCase())) {
      setError('Código Programa: debe tener 3-15 caracteres y solo contener A-Z, 0-9, _');
      return;
    }

    // Validar formato de nombre_programa (máximo 40 caracteres)
    if (nombrePrograma.length > 40) {
      setError('Nombre Programa: debe tener máximo 40 caracteres');
      return;
    }

    setCargando(true);
    setError('');
    setSuccess('');

    try {
      const payload = {
        codigo_programa: codigoPrograma.toUpperCase().trim(),
        id_facultad: facultadSeleccionada,
        nombre_programa: nombrePrograma.trim()
      };

      console.log('📤 Enviando payload:', payload);
      
      await ProgramasService.crearPrograma(payload);
      
      setSuccess('✅ Programa creado exitosamente');
      setCodigoPrograma('');
      setNombrePrograma('');
      
      // Recargar programas
      await cargarProgramas(facultadSeleccionada);
      
      // Limpiar mensaje de éxito después de 3 segundos
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('Error al crear programa: ' + err.message);
      console.error('❌ Error:', err);
    } finally {
      setCargando(false);
    }
  };

  // Editar programa
  const handleEditarPrograma = (programa) => {
    setProgramaEditandoId(programa.codigo_programa);
    setNombreEditado(programa.nombre_programa);
    setShowEditModal(true);
  };

  // Guardar edición
  const handleGuardarEdicion = async (e) => {
    e.preventDefault();

    if (!nombreEditado.trim()) {
      setError('El nombre del programa no puede estar vacío');
      return;
    }

    if (!/^[A-Za-záéíóúÁÉÍÓÚñÑ\s]{1,40}$/.test(nombreEditado)) {
      setError('Nombre Programa: debe tener máximo 40 caracteres y solo contener letras y espacios');
      return;
    }

    setCargando(true);
    setError('');

    try {
      const payload = {
        nombre_programa: nombreEditado.trim()
      };

      await ProgramasService.actualizarPrograma(
        facultadSeleccionada,
        programaEditandoId,
        payload
      );

      setSuccess('✅ Programa actualizado exitosamente');
      setShowEditModal(false);
      setProgramaEditandoId(null);
      setNombreEditado('');

      // Recargar programas
      await cargarProgramas(facultadSeleccionada);

      // Limpiar mensaje de éxito después de 3 segundos
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('Error al actualizar programa: ' + err.message);
      console.error('❌ Error:', err);
    } finally {
      setCargando(false);
    }
  };

  // Cancelar edición
  const handleCancelarEdicion = () => {
    setShowEditModal(false);
    setProgramaEditandoId(null);
    setNombreEditado('');
    setError('');
  };

  // Eliminar programa
  const handleEliminarPrograma = async (programa) => {
    if (!window.confirm(`¿Está seguro de que desea eliminar el programa "${programa.nombre_programa}"?`)) {
      return;
    }

    setCargando(true);
    setError('');

    try {
      await ProgramasService.eliminarPrograma(facultadSeleccionada, programa.codigo_programa);
      setSuccess('✅ Programa eliminado exitosamente');

      // Recargar programas
      await cargarProgramas(facultadSeleccionada);

      // Limpiar mensaje de éxito después de 3 segundos
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('Error al eliminar programa: ' + err.message);
      console.error('❌ Error:', err);
    } finally {
      setCargando(false);
    }
  };

  // Filtrar programas por búsqueda
  const programasFiltrados = programas.filter(programa =>
    programa.nombre_programa.toLowerCase().includes(searchTerm.toLowerCase()) ||
    programa.codigo_programa.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
          {/* Sidebar */}
          <AdminSidebar userName={getUserName()} userRole="Administrador" />

          {/* Main Content */}
          <main className="lg:col-span-3">
            {/* Crear Programa */}
            <div className="bg-white rounded-lg border border-gray-200 p-8 mb-8">
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Crear Nuevo Programa
                </h2>
                <p className="text-sm text-gray-600">
                  Agrega nuevos programas académicos a las facultades.
                </p>
              </div>

              {/* Mensajes de estado */}
              {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                  {error}
                </div>
              )}
              {success && (
                <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm">
                  {success}
                </div>
              )}

              <form onSubmit={handleCrearPrograma} className="space-y-6 max-w-2xl">
                {/* Seleccionar Facultad - Ancho completo */}
                <div>
                  <label htmlFor="facultad" className="block text-sm font-medium text-gray-700 mb-2">
                    Facultad <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="facultad"
                    value={facultadSeleccionada}
                    onChange={(e) => setFacultadSeleccionada(e.target.value)}
                    disabled={loadingFacultades || cargando}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all disabled:bg-gray-100"
                  >
                    <option value="">
                      {loadingFacultades ? 'Cargando facultades...' : 'Selecciona una facultad'}
                    </option>
                    {facultades.map((facultad) => (
                      <option key={facultad.id_facultad} value={facultad.id_facultad}>
                        {facultad.nombre_facultad} ({facultad.id_facultad})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Código del Programa y Nombre en grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Código del Programa */}
                  <div>
                    <label htmlFor="codigo" className="block text-sm font-medium text-gray-700 mb-2">
                      Código del Programa <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="codigo"
                      value={codigoPrograma}
                      onChange={(e) => setCodigoPrograma(e.target.value.toUpperCase())}
                      placeholder="Ej: ING_SIS"
                      maxLength="10"
                      disabled={!facultadSeleccionada || cargando}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all uppercase disabled:bg-gray-100"
                      required
                    />
                    <p className="mt-1 text-xs text-gray-500">3-15 caracteres: A-Z, 0-9, _</p>
                  </div>

                  {/* Nombre del Programa */}
                  <div>
                    <label htmlFor="nombre" className="block text-sm font-medium text-gray-700 mb-2">
                      Nombre del Programa <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="nombre"
                      value={nombrePrograma}
                      onChange={(e) => setNombrePrograma(e.target.value)}
                      placeholder="Ej: Ingeniería de Sistemas"
                      maxLength="40"
                      disabled={!facultadSeleccionada || cargando}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all disabled:bg-gray-100"
                      required
                    />
                    <p className="mt-1 text-xs text-gray-500">Máximo 40 caracteres: letras y espacios</p>
                  </div>
                </div>

                <div className="pt-4">
                  <button
                    type="submit"
                    disabled={!facultadSeleccionada || cargando}
                    className={`w-full px-6 py-3 rounded-lg text-sm font-semibold transition-all shadow-md ${
                      cargando || !facultadSeleccionada
                        ? 'bg-gray-400 cursor-not-allowed text-white'
                        : 'bg-teal-600 text-white hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2'
                    }`}
                  >
                    {cargando ? (
                      <span className="flex items-center justify-center gap-2">
                        <span className="animate-spin inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full"></span>
                        Creando...
                      </span>
                    ) : (
                      <span className="flex items-center justify-center gap-2">
                        <i className="pi pi-plus"></i>
                        Crear Programa
                      </span>
                    )}
                  </button>
                </div>
              </form>
            </div>

            {/* Listar Programas */}
            <div className="bg-white rounded-lg border border-gray-200 p-8">
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Programas {facultadSeleccionada && `de ${facultadSeleccionada}`}
                </h2>
                <p className="text-sm text-gray-600">
                  Gestiona los programas académicos disponibles.
                </p>
              </div>

              {!facultadSeleccionada ? (
                <div className="text-center py-12 text-gray-500">
                  <i className="pi pi-inbox text-4xl mb-4 block opacity-50"></i>
                  <p>Selecciona una facultad para ver sus programas</p>
                </div>
              ) : loadingProgramas ? (
                <div className="text-center py-12">
                  <span className="animate-spin inline-block w-8 h-8 border-4 border-teal-500 border-t-transparent rounded-full"></span>
                  <p className="text-gray-600 mt-4">Cargando programas...</p>
                </div>
              ) : (
                <>
                  {/* Barra de búsqueda */}
                  <div className="mb-6">
                    <div className="relative">
                      <i className="pi pi-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
                      <input
                        type="text"
                        placeholder="Buscar por nombre o código..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                      />
                    </div>
                  </div>

                  {/* Tabla de programas */}
                  {programasFiltrados.length === 0 ? (
                    <div className="text-center py-12 text-gray-500">
                      <i className="pi pi-inbox text-4xl mb-4 block opacity-50"></i>
                      <p>
                        {programas.length === 0
                          ? 'No hay programas registrados aún'
                          : 'No se encontraron programas coincidentes'}
                      </p>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b-2 border-gray-200">
                            <th className="text-left py-3 px-4 font-semibold text-gray-700">Código</th>
                            <th className="text-left py-3 px-4 font-semibold text-gray-700">Nombre</th>
                            <th className="text-center py-3 px-4 font-semibold text-gray-700">Acciones</th>
                          </tr>
                        </thead>
                        <tbody>
                          {programasFiltrados.map((programa) => (
                            <tr
                              key={programa.codigo_programa}
                              className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                            >
                              <td className="py-4 px-4 font-mono text-sm text-gray-800">
                                {programa.codigo_programa}
                              </td>
                              <td className="py-4 px-4 text-sm text-gray-800">
                                {programa.nombre_programa}
                              </td>
                              <td className="py-4 px-4">
                                <div className="flex justify-center gap-2">
                                  <button
                                    onClick={() => handleEditarPrograma(programa)}
                                    disabled={cargando}
                                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                    title="Editar"
                                  >
                                    <i className="pi pi-pencil"></i>
                                  </button>
                                  <button
                                    onClick={() => handleEliminarPrograma(programa)}
                                    disabled={cargando}
                                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                    title="Eliminar"
                                  >
                                    <i className="pi pi-trash"></i>
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </>
              )}
            </div>
          </main>
        </div>
      </div>

      {/* Modal de edición */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg border border-gray-200 shadow-lg p-8 w-full max-w-md">
            <h3 className="text-xl font-bold text-gray-900 mb-6">Editar Programa</h3>

            <form onSubmit={handleGuardarEdicion} className="space-y-6">
              <div>
                <label htmlFor="nombreEdit" className="block text-sm font-medium text-gray-700 mb-2">
                  Nombre del Programa <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="nombreEdit"
                  value={nombreEditado}
                  onChange={(e) => setNombreEditado(e.target.value)}
                  maxLength="40"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  required
                />
                <p className="mt-1 text-xs text-gray-500">Máximo 40 caracteres: letras y espacios</p>
              </div>

              {error && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                  {error}
                </div>
              )}

              <div className="flex gap-3 justify-end pt-4">
                <button
                  type="button"
                  onClick={handleCancelarEdicion}
                  disabled={cargando}
                  className="px-6 py-2.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-all disabled:opacity-50"
                >
                  <span className="flex items-center justify-center gap-2">
                    <i className="pi pi-times"></i>
                    Cancelar
                  </span>
                </button>
                <button
                  type="submit"
                  disabled={cargando}
                  className={`px-6 py-2.5 rounded-lg text-sm font-medium transition-all ${
                    cargando
                      ? 'bg-gray-400 cursor-not-allowed text-white'
                      : 'bg-teal-600 text-white hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2'
                  }`}
                >
                  <span className="flex items-center justify-center gap-2">
                    {cargando ? (
                      <>
                        <span className="animate-spin inline-block w-3 h-3 border-2 border-white border-t-transparent rounded-full"></span>
                        Guardando...
                      </>
                    ) : (
                      <>
                        <i className="pi pi-save"></i>
                        Guardar
                      </>
                    )}
                  </span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default CreatePrograms;
