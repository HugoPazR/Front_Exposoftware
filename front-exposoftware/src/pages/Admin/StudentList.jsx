import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../../assets/Logo-unicesar.png';
import AdminSidebar from '../../components/Layout/AdminSidebar';
import * as AuthService from '../../Services/AuthService';
import {
  obtenerEstudiantes,
  buscarEstudiantes,
  filtrarPorEstado,
  formatearEstudiante,
  activarEstudiante,
  desactivarEstudiante
} from '../../Services/StudentAdminService';
import { obtenerTodosProgramas } from '../../Services/AcademicService';

/**
 * Componente principal para la gestión de estudiantes
 * Muestra una tabla con todos los estudiantes registrados
 */
const StudentList = () => {
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
  
  // Estados
  const [estudiantes, setEstudiantes] = useState([]);
  const [estudiantesFiltrados, setEstudiantesFiltrados] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const [busqueda, setBusqueda] = useState('');
  const [filtroEstado, setFiltroEstado] = useState('todos'); // todos, activo, inactivo
  const [paginaActual, setPaginaActual] = useState(1);
  const [estudiantesPorPagina] = useState(10);
  const [mostrarConfirmacion, setMostrarConfirmacion] = useState(false);
  const [estudianteSeleccionado, setEstudianteSeleccionado] = useState(null);
  const [accionPendiente, setAccionPendiente] = useState(null); // 'activar' o 'desactivar'
  const [programas, setProgramas] = useState([]);

  // Cargar estudiantes al montar el componente
  useEffect(() => {
    cargarEstudiantes();
  }, []);

  // Aplicar filtros cuando cambian
  useEffect(() => {
    aplicarFiltros();
  }, [busqueda, filtroEstado, estudiantes, programas]);

  /**
   * Cargar lista de estudiantes desde el backend
   */
  const cargarEstudiantes = async () => {
    try {
      setCargando(true);
      setError(null);
      
      // Cargar estudiantes y programas en paralelo
      const [resultadoEstudiantes, resultadoProgramas] = await Promise.all([
        obtenerEstudiantes(),
        obtenerTodosProgramas()
      ]);
      
      // Verificar si el resultado es un array o viene dentro de 'data'
      const listaEstudiantes = Array.isArray(resultadoEstudiantes.data) 
        ? resultadoEstudiantes.data 
        : (resultadoEstudiantes.data?.estudiantes || []);
      
      console.log('📋 Lista de estudiantes procesada:', listaEstudiantes);
      console.log('📚 Lista de programas cargada:', resultadoProgramas);
      
      setEstudiantes(listaEstudiantes);
      setProgramas(resultadoProgramas);
      setEstudiantesFiltrados(listaEstudiantes);
    } catch (err) {
      console.error('❌ Error completo al cargar estudiantes:', err);
      
      // Mostrar mensaje de error más detallado
      let mensajeError = 'Error al cargar los estudiantes del servidor';
      
      if (err.message) {
        mensajeError = `${err.message}`;
      }
      
      // Si el error contiene información sobre el endpoint no implementado
      if (err.message && err.message.includes('interno del servidor')) {
        mensajeError += ' - Es posible que el endpoint /api/v1/admin/estudiantes no esté implementado en el backend todavía.';
      }
      
      setError(mensajeError);
    } finally {
      setCargando(false);
    }
  };

  /**
   * Aplicar filtros de búsqueda y estado
   */
  const aplicarFiltros = () => {
    let resultado = [...estudiantes];
    
    // Filtrar por búsqueda
    if (busqueda.trim()) {
      resultado = buscarEstudiantes(busqueda, resultado, programas);
    }
    
    // Filtrar por estado
    resultado = filtrarPorEstado(filtroEstado, resultado);
    
    setEstudiantesFiltrados(resultado);
    setPaginaActual(1); // Resetear a la primera página
  };

  /**
   * Manejar cambio de estado (activar/desactivar)
   */
  const handleCambiarEstado = (estudiante, accion) => {
    setEstudianteSeleccionado(estudiante);
    setAccionPendiente(accion);
    setMostrarConfirmacion(true);
  };

  /**
   * Confirmar cambio de estado
   */
  const confirmarCambioEstado = async () => {
    if (!estudianteSeleccionado || !accionPendiente) return;

    try {
      setCargando(true);
      
      if (accionPendiente === 'activar') {
        await activarEstudiante(estudianteSeleccionado.id_estudiante);
      } else {
        await desactivarEstudiante(estudianteSeleccionado.id_estudiante);
      }
      
      // Recargar la lista
      await cargarEstudiantes();
      
      // Cerrar modal
      setMostrarConfirmacion(false);
      setEstudianteSeleccionado(null);
      setAccionPendiente(null);
    } catch (err) {
      console.error('Error al cambiar estado:', err);
      alert(`Error: ${err.message}`);
    } finally {
      setCargando(false);
    }
  };

  /**
   * Ver detalles de un estudiante
   */
  const verDetalles = (estudianteId) => {
    navigate(`/admin/estudiantes/${estudianteId}`);
  };

  /**
   * Editar estudiante
   */
  const editarEstudiante = (estudianteId) => {
    navigate(`/admin/estudiantes/${estudianteId}/editar`);
  };

  // Paginación
  const indexUltimoEstudiante = paginaActual * estudiantesPorPagina;
  const indexPrimerEstudiante = indexUltimoEstudiante - estudiantesPorPagina;
  const estudiantesActuales = estudiantesFiltrados.slice(indexPrimerEstudiante, indexUltimoEstudiante);
  const totalPaginas = Math.ceil(estudiantesFiltrados.length / estudiantesPorPagina);

  const cambiarPagina = (numeroPagina) => {
    setPaginaActual(numeroPagina);
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
                <h1 className="text-lg font-bold text-gray-900">Expo-software </h1>
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
            {/* Título */}
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Gestión de Estudiantes</h2>
              <p className="text-sm text-gray-600">Administra los estudiantes registrados en el sistema</p>
            </div>

            {/* Error Alert */}
            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                <strong className="font-bold">Error: </strong>
                <span>{error}</span>
              </div>
            )}

            {/* Cargando */}
            {cargando && estudiantes.length === 0 ? (
              <div className="bg-white rounded-lg border border-gray-200 p-8">
                <div className="text-center py-12">
                  <span className="animate-spin inline-block w-8 h-8 border-4 border-teal-500 border-t-transparent rounded-full"></span>
                  <p className="text-gray-600 mt-4">Cargando estudiantes...</p>
                </div>
              </div>
            ) : (
              <>
                {/* Controles de búsqueda y filtros */}
                <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Búsqueda */}
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Buscar estudiante
                      </label>
                      <div className="relative">
                        <i className="pi pi-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
                        <input
                          type="text"
                          placeholder="Buscar por nombre, identificación, email o programa..."
                          value={busqueda}
                          onChange={(e) => setBusqueda(e.target.value)}
                          className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                        />
                      </div>
                    </div>

                    {/* Filtro de estado */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Filtrar por estado
                      </label>
                      <select
                        value={filtroEstado}
                        onChange={(e) => setFiltroEstado(e.target.value)}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                      >
                        <option value="todos">Todos</option>
                        <option value="activo">Activos</option>
                        <option value="inactivo">Inactivos</option>
                      </select>
                    </div>
                  </div>

                  {/* Estadísticas */}
                  <div className="mt-4 flex justify-between items-center text-sm text-gray-600">
                    <span>
                      Mostrando {estudiantesActuales.length} de {estudiantesFiltrados.length} estudiantes
                    </span>
                    <span>
                      Total: {estudiantes.length} estudiantes registrados
                    </span>
                  </div>
                </div>

                {/* Tabla de estudiantes */}
                <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b-2 border-gray-200">
                          <th className="text-left py-3 px-4 font-semibold text-gray-700">Identificación</th>
                          <th className="text-left py-3 px-4 font-semibold text-gray-700">Nombre Completo</th>
                          <th className="text-left py-3 px-4 font-semibold text-gray-700">Programa</th>
                          <th className="text-left py-3 px-4 font-semibold text-gray-700">Semestre</th>
                          <th className="text-left py-3 px-4 font-semibold text-gray-700">Estado</th>
                          <th className="text-center py-3 px-4 font-semibold text-gray-700">Acciones</th>
                        </tr>
                      </thead>
                      <tbody>
                        {estudiantesActuales.length === 0 ? (
                          <tr>
                            <td colSpan="6" className="py-12 text-center">
                              <div className="text-gray-500">
                                <i className="pi pi-inbox text-4xl mb-4 block opacity-50"></i>
                                <p>
                                  {busqueda || filtroEstado !== 'todos' 
                                    ? 'No se encontraron estudiantes con los criterios de búsqueda'
                                    : 'No hay estudiantes registrados'}
                                </p>
                              </div>
                            </td>
                          </tr>
                        ) : (
                          estudiantesActuales.map((item) => {
                            const formateado = formatearEstudiante(item, programas);
                            // Extraer el ID correcto según el formato de datos
                            const estudianteId = item.estudiante?.id_estudiante || item.id_estudiante || formateado.id;
                            
                            return (
                              <tr
                                key={estudianteId}
                                className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                              >
                                <td className="py-4 px-4 text-sm text-gray-800">
                                  {formateado.identificacion}
                                </td>
                                <td className="py-4 px-4">
                                  <div className="text-sm font-medium text-gray-900">
                                    {formateado.nombreCompleto}
                                  </div>
                                  <div className="text-xs text-gray-500">
                                    {formateado.email}
                                  </div>
                                </td>
                                <td className="py-4 px-4 text-sm text-gray-800">
                                  <div className="max-w-xs truncate" title={formateado.programa}>
                                    {formateado.programa}
                                  </div>
                                  <div className="text-xs text-gray-500">
                                    {formateado.codigoPrograma}
                                  </div>
                                </td>
                                <td className="py-4 px-4 text-sm text-gray-900">
                                  {formateado.semestre}°
                                </td>
                                <td className="py-4 px-4">
                                  <span className={`px-2 py-1 inline-flex text-xs font-semibold rounded-full ${
                                    formateado.estadoBool
                                      ? 'bg-green-100 text-green-800'
                                      : 'bg-red-100 text-red-800'
                                  }`}>
                                    {formateado.estado}
                                  </span>
                                </td>
                                <td className="py-4 px-4">
                                  <div className="flex justify-center gap-2">
                                    <button
                                      onClick={() => verDetalles(estudianteId)}
                                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                      title="Ver detalles"
                                    >
                                      <i className="pi pi-eye"></i>
                                    </button>
                                    <button
                                      onClick={() => editarEstudiante(estudianteId)}
                                      className="p-2 text-yellow-600 hover:bg-yellow-50 rounded-lg transition-colors"
                                      title="Editar"
                                    >
                                      <i className="pi pi-pencil"></i>
                                    </button>
                                    <button
                                      onClick={() => handleCambiarEstado(
                                        item,
                                        formateado.estadoBool ? 'desactivar' : 'activar'
                                      )}
                                      className={`p-2 rounded-lg transition-colors ${
                                        formateado.estadoBool 
                                          ? 'text-red-600 hover:bg-red-50' 
                                          : 'text-green-600 hover:bg-green-50'
                                      }`}
                                      title={formateado.estadoBool ? 'Desactivar' : 'Activar'}
                                    >
                                      <i className={`pi ${formateado.estadoBool ? 'pi-lock' : 'pi-check-circle'}`}></i>
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            );
                          })
                        )}
                      </tbody>
                    </table>
                  </div>

                  {/* Paginación */}
                  {totalPaginas > 1 && (
                    <div className="px-4 py-3 flex items-center justify-between border-t border-gray-200">
                      <div className="flex-1 flex justify-between sm:hidden">
                        <button
                          onClick={() => cambiarPagina(paginaActual - 1)}
                          disabled={paginaActual === 1}
                          className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Anterior
                        </button>
                        <button
                          onClick={() => cambiarPagina(paginaActual + 1)}
                          disabled={paginaActual === totalPaginas}
                          className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Siguiente
                        </button>
                      </div>
                      <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                        <div>
                          <p className="text-sm text-gray-700">
                            Mostrando <span className="font-medium">{indexPrimerEstudiante + 1}</span> a{' '}
                            <span className="font-medium">
                              {Math.min(indexUltimoEstudiante, estudiantesFiltrados.length)}
                            </span>{' '}
                            de <span className="font-medium">{estudiantesFiltrados.length}</span> resultados
                          </p>
                        </div>
                        <div>
                          <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                            <button
                              onClick={() => cambiarPagina(paginaActual - 1)}
                              disabled={paginaActual === 1}
                              className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              Anterior
                            </button>
                            {[...Array(totalPaginas)].map((_, index) => (
                              <button
                                key={index + 1}
                                onClick={() => cambiarPagina(index + 1)}
                                className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                                  paginaActual === index + 1
                                    ? 'z-10 bg-teal-50 border-teal-500 text-teal-600'
                                    : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                                }`}
                              >
                                {index + 1}
                              </button>
                            ))}
                            <button
                              onClick={() => cambiarPagina(paginaActual + 1)}
                              disabled={paginaActual === totalPaginas}
                              className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              Siguiente
                            </button>
                          </nav>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </>
            )}
          </main>
        </div>
      </div>

      {/* Modal de confirmación */}
      {mostrarConfirmacion && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg border border-gray-200 shadow-lg p-8 w-full max-w-md">
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-yellow-100 mb-4">
                <i className="pi pi-exclamation-triangle text-yellow-600 text-xl"></i>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Confirmar acción</h3>
              <div className="mb-6">
                <p className="text-sm text-gray-600">
                  ¿Está seguro que desea {accionPendiente} al estudiante{' '}
                  <strong className="text-gray-900">{formatearEstudiante(estudianteSeleccionado, programas).nombreCompleto}</strong>?
                </p>
              </div>
              <div className="flex gap-3 justify-center">
                <button
                  onClick={() => {
                    setMostrarConfirmacion(false);
                    setEstudianteSeleccionado(null);
                    setAccionPendiente(null);
                  }}
                  className="px-6 py-2.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-all"
                >
                  <span className="flex items-center justify-center gap-2">
                    <i className="pi pi-times"></i>
                    Cancelar
                  </span>
                </button>
                <button
                  onClick={confirmarCambioEstado}
                  disabled={cargando}
                  className={`px-6 py-2.5 rounded-lg text-sm font-medium transition-all ${
                    accionPendiente === 'activar'
                      ? 'bg-green-600 text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500'
                      : 'bg-red-600 text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500'
                  } disabled:opacity-50`}
                >
                  <span className="flex items-center justify-center gap-2">
                    {cargando ? (
                      <>
                        <span className="animate-spin inline-block w-3 h-3 border-2 border-white border-t-transparent rounded-full"></span>
                        Procesando...
                      </>
                    ) : (
                      <>
                        <i className="pi pi-check"></i>
                        Confirmar
                      </>
                    )}
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentList;
