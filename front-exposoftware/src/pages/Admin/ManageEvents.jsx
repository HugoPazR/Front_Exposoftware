import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../../assets/Logo-unicesar.png";
import AdminSidebar from "../../components/Layout/AdminSidebar";
import * as AuthService from "../../Services/AuthService";
import EventosService from "../../Services/EventosService";

export default function ManageEvents() {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  
  // Estados de eventos
  const [eventos, setEventos] = useState([]);
  const [eventosFiltrados, setEventosFiltrados] = useState([]);
  const [loadingEventos, setLoadingEventos] = useState(false);
  const [estadisticas, setEstadisticas] = useState(null);
  const [filtroEstado, setFiltroEstado] = useState("TODOS");
  
  // Estados del modal de edición
  const [showEditModal, setShowEditModal] = useState(false);
  const [eventoEditando, setEventoEditando] = useState(null);
  const [nombreEvento, setNombreEvento] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [fechaInicio, setFechaInicio] = useState("");
  const [fechaFin, setFechaFin] = useState("");
  const [lugarEvento, setLugarEvento] = useState("");
  const [cupoMaximo, setCupoMaximo] = useState("");
  const [estado, setEstado] = useState("ACTIVO");
  const [guardandoEvento, setGuardandoEvento] = useState(false);

  // Estados del modal de capacidad
  const [showCapacidadModal, setShowCapacidadModal] = useState(false);
  const [capacidadInfo, setCapacidadInfo] = useState(null);

  // Cargar datos del usuario autenticado
  useEffect(() => {
    const user = AuthService.getUserData();
    if (user) {
      setUserData(user);
    }
  }, []);

  // Cargar eventos y estadísticas al montar
  useEffect(() => {
    cargarEventos();
  }, []);

  const getUserName = () => {
    if (!userData) return 'Administrador';
    return userData.nombre || userData.nombres || userData.correo?.split('@')[0] || 'Administrador';
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

  // Cargar eventos
  const cargarEventos = async () => {
    setLoadingEventos(true);
    try {
      const data = await EventosService.obtenerEventosAdmin();
      
      // Ordenar eventos por fecha de creación o fecha de inicio (más recientes primero)
      const eventosOrdenados = data.sort((a, b) => {
        // Priorizar por fecha de inicio (próximos primero)
        const fechaA = new Date(a.fecha_inicio);
        const fechaB = new Date(b.fecha_inicio);
        return fechaB - fechaA; // Más recientes primero
      });
      
      setEventos(eventosOrdenados);
      setEventosFiltrados(eventosOrdenados);
      console.log("✅ Eventos cargados y ordenados:", eventosOrdenados.length);
    } catch (error) {
      console.error("❌ Error al cargar eventos:", error);
      setEventos([]);
      setEventosFiltrados([]);
    } finally {
      setLoadingEventos(false);
    }
  };

  // Filtrar eventos por estado
  useEffect(() => {
    if (filtroEstado === "TODOS") {
      setEventosFiltrados(eventos);
    } else {
      const filtrados = eventos.filter(evento => evento.estado === filtroEstado);
      setEventosFiltrados(filtrados);
    }
  }, [filtroEstado, eventos]);

  // Calcular estadísticas desde los eventos cargados
  const calcularEstadisticas = () => {
    const ahora = new Date();
    const stats = {
      total_eventos: eventos.length,
      eventos_activos: eventos.filter(e => e.estado === 'ACTIVO').length,
      eventos_proximos: eventos.filter(e => {
        const fechaInicio = new Date(e.fecha_inicio);
        return fechaInicio > ahora && e.estado === 'ACTIVO';
      }).length,
      eventos_finalizados: eventos.filter(e => {
        const fechaFin = new Date(e.fecha_fin);
        return fechaFin < ahora;
      }).length
    };
    return stats;
  };

  // Actualizar estadísticas cuando cambien los eventos
  useEffect(() => {
    if (eventos.length > 0) {
      setEstadisticas(calcularEstadisticas());
    }
  }, [eventos]);

  // Abrir modal de edición
  const handleEditarEvento = async (evento) => {
    try {
      // Obtener datos completos del evento
      const eventoCompleto = await EventosService.obtenerEventoPorIdAdmin(evento.id_evento);
      
      setEventoEditando(eventoCompleto);
      setNombreEvento(eventoCompleto.nombre_evento || "");
      setDescripcion(eventoCompleto.descripcion || "");
      
      // Convertir fechas a formato datetime-local
      const formatearFecha = (fecha) => {
        if (!fecha) return "";
        const date = new Date(fecha);
        return date.toISOString().slice(0, 16);
      };
      
      setFechaInicio(formatearFecha(eventoCompleto.fecha_inicio));
      setFechaFin(formatearFecha(eventoCompleto.fecha_fin));
      setLugarEvento(eventoCompleto.lugar || "");
      setCupoMaximo(eventoCompleto.cupo_maximo?.toString() || "");
      setEstado(eventoCompleto.estado || "ACTIVO");
      setShowEditModal(true);
    } catch (error) {
      console.error("❌ Error al cargar evento:", error);
      alert("Error al cargar los datos del evento");
    }
  };

  // Guardar cambios del evento
  const handleGuardarEvento = async (e) => {
    e.preventDefault();

    if (!nombreEvento || !descripcion || !fechaInicio || !fechaFin || !lugarEvento || !cupoMaximo) {
      alert("Por favor completa todos los campos");
      return;
    }

    const cupo = parseInt(cupoMaximo);
    if (isNaN(cupo) || cupo < 1) {
      alert("El cupo máximo debe ser un número mayor a 0");
      return;
    }

    if (new Date(fechaFin) < new Date(fechaInicio)) {
      alert("La fecha de fin no puede ser anterior a la fecha de inicio");
      return;
    }

    const convertirFecha = (dateString) => {
      const fecha = new Date(dateString);
      return fecha.toISOString();
    };

    const payload = {
      nombre_evento: nombreEvento,
      descripcion: descripcion,
      fecha_inicio: convertirFecha(fechaInicio),
      fecha_fin: convertirFecha(fechaFin),
      lugar: lugarEvento,
      cupo_maximo: cupo,
      estado: estado
    };

    setGuardandoEvento(true);
    try {
      await EventosService.actualizarEvento(eventoEditando.id_evento, payload);
      alert("✅ Evento actualizado exitosamente");
      setShowEditModal(false);
      cargarEventos();
    } catch (error) {
      console.error("❌ Error al actualizar evento:", error);
      alert(`❌ Error al actualizar evento: ${error.message}`);
    } finally {
      setGuardandoEvento(false);
    }
  };

  // Cambiar estado del evento
  const handleCambiarEstado = async (eventoId, nuevoEstado) => {
    if (!window.confirm(`¿Desea cambiar el estado del evento a ${nuevoEstado}?`)) {
      return;
    }

    try {
      await EventosService.cambiarEstadoEvento(eventoId, nuevoEstado);
      alert(`✅ Estado cambiado a ${nuevoEstado}`);
      cargarEventos();
    } catch (error) {
      console.error("❌ Error al cambiar estado:", error);
      alert(`❌ Error al cambiar estado: ${error.message}`);
    }
  };

  // Ver capacidad del evento
  const handleVerCapacidad = async (eventoId) => {
    try {
      const data = await EventosService.verificarCapacidad(eventoId);
      setCapacidadInfo(data);
      setShowCapacidadModal(true);
    } catch (error) {
      console.error("❌ Error al verificar capacidad:", error);
      alert("Error al obtener información de capacidad");
    }
  };

  // Formatear fecha para mostrar
  const formatearFechaDisplay = (fecha) => {
    if (!fecha) return "N/A";
    const date = new Date(fecha);
    return date.toLocaleString('es-CO', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Obtener color del badge según el estado
  const getEstadoBadgeColor = (estadoEvento) => {
    switch (estadoEvento) {
      case 'ACTIVO':
        return 'bg-green-100 text-green-800';
      case 'INACTIVO':
        return 'bg-gray-100 text-gray-800';
      case 'CANCELADO':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-blue-100 text-blue-800';
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
          <main className="lg:col-span-3 space-y-6">
            {/* Título */}
            <div className="bg-gradient-to-r from-teal-600 to-emerald-600 rounded-lg shadow-lg p-8">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
                  <i className="pi pi-calendar-plus text-3xl text-white"></i>
                </div>
                <div>
                  <h2 className="text-3xl font-bold text-white">Gestión de Eventos</h2>
                  <p className="text-teal-50 mt-1">
                    Administra y controla todos los eventos del sistema
                  </p>
                </div>
              </div>
            </div>

            {/* Estadísticas - Filtros Clicables */}
            {estadisticas && (
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <button 
                  onClick={() => setFiltroEstado("TODOS")}
                  className={`bg-white rounded-xl shadow-sm border p-6 hover:shadow-lg transition-all text-left ${
                    filtroEstado === "TODOS" ? 'border-blue-500 ring-2 ring-blue-200' : 'border-gray-100'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Total Eventos</p>
                      <p className="text-3xl font-bold text-gray-900 mt-2">{estadisticas.total_eventos || 0}</p>
                    </div>
                    <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                      <i className="pi pi-calendar text-2xl text-white"></i>
                    </div>
                  </div>
                </button>

                <button 
                  onClick={() => setFiltroEstado("ACTIVO")}
                  className={`bg-white rounded-xl shadow-sm border p-6 hover:shadow-lg transition-all text-left ${
                    filtroEstado === "ACTIVO" ? 'border-green-500 ring-2 ring-green-200' : 'border-gray-100'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Activos</p>
                      <p className="text-3xl font-bold text-green-600 mt-2">{estadisticas.eventos_activos || 0}</p>
                    </div>
                    <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center shadow-lg">
                      <i className="pi pi-check-circle text-2xl text-white"></i>
                    </div>
                  </div>
                </button>

                <button 
                  onClick={() => setFiltroEstado("INACTIVO")}
                  className={`bg-white rounded-xl shadow-sm border p-6 hover:shadow-lg transition-all text-left ${
                    filtroEstado === "INACTIVO" ? 'border-gray-500 ring-2 ring-gray-200' : 'border-gray-100'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Inactivos</p>
                      <p className="text-3xl font-bold text-gray-600 mt-2">
                        {eventos.filter(e => e.estado === 'INACTIVO').length}
                      </p>
                    </div>
                    <div className="w-14 h-14 bg-gradient-to-br from-gray-500 to-gray-600 rounded-xl flex items-center justify-center shadow-lg">
                      <i className="pi pi-pause-circle text-2xl text-white"></i>
                    </div>
                  </div>
                </button>

                <button 
                  onClick={() => setFiltroEstado("CANCELADO")}
                  className={`bg-white rounded-xl shadow-sm border p-6 hover:shadow-lg transition-all text-left ${
                    filtroEstado === "CANCELADO" ? 'border-red-500 ring-2 ring-red-200' : 'border-gray-100'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Cancelados</p>
                      <p className="text-3xl font-bold text-red-600 mt-2">
                        {eventos.filter(e => e.estado === 'CANCELADO').length}
                      </p>
                    </div>
                    <div className="w-14 h-14 bg-gradient-to-br from-red-500 to-red-600 rounded-xl flex items-center justify-center shadow-lg">
                      <i className="pi pi-times-circle text-2xl text-white"></i>
                    </div>
                  </div>
                </button>
              </div>
            )}

            {/* Lista de Eventos */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between flex-wrap gap-4">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">
                      {filtroEstado === "TODOS" ? "Todos los Eventos" : `Eventos ${filtroEstado.toLowerCase()}`}
                    </h3>
                    <p className="text-sm text-gray-500 mt-1">
                      Mostrando {eventosFiltrados.length} de {eventos.length} eventos
                    </p>
                  </div>
                  <div className="flex gap-2">
                    {filtroEstado !== "TODOS" && (
                      <button
                        onClick={() => setFiltroEstado("TODOS")}
                        className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition font-medium text-sm flex items-center gap-2"
                      >
                        <i className="pi pi-times"></i>
                        Limpiar filtro
                      </button>
                    )}
                    <button
                      onClick={cargarEventos}
                      className="px-5 py-2.5 bg-gradient-to-r from-teal-600 to-emerald-600 text-white rounded-lg hover:from-teal-700 hover:to-emerald-700 transition shadow-md font-medium text-sm flex items-center gap-2"
                    >
                      <i className="pi pi-refresh"></i>
                      Actualizar
                    </button>
                  </div>
                </div>
              </div>

              <div className="overflow-x-auto">
                {loadingEventos ? (
                  <div className="p-8 text-center text-gray-500">
                    <div className="animate-spin inline-block w-8 h-8 border-4 border-teal-600 border-t-transparent rounded-full"></div>
                    <p className="mt-2">Cargando eventos...</p>
                  </div>
                ) : eventosFiltrados.length === 0 ? (
                  <div className="p-8 text-center text-gray-500">
                    <i className="pi pi-inbox text-4xl text-gray-300 mb-3"></i>
                    <p className="font-medium">No hay eventos {filtroEstado !== "TODOS" ? `con estado ${filtroEstado}` : 'registrados'}</p>
                    {filtroEstado !== "TODOS" && (
                      <button 
                        onClick={() => setFiltroEstado("TODOS")}
                        className="mt-3 text-teal-600 hover:text-teal-700 text-sm font-medium"
                      >
                        Ver todos los eventos
                      </button>
                    )}
                  </div>
                ) : (
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Evento
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Fechas
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Lugar
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Estado
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Acciones
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {eventosFiltrados.map((evento) => (
                        <tr key={evento.id_evento} className="hover:bg-gray-50">
                          <td className="px-6 py-4">
                            <div>
                              <p className="text-sm font-medium text-gray-900">{evento.nombre_evento}</p>
                              <p className="text-xs text-gray-500">{evento.descripcion}</p>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-500">
                            <div>
                              <p className="text-xs">Inicio: {formatearFechaDisplay(evento.fecha_inicio)}</p>
                              <p className="text-xs">Fin: {formatearFechaDisplay(evento.fecha_fin)}</p>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-500">
                            {evento.lugar}
                          </td>
                          <td className="px-6 py-4">
                            <span className={`px-3 py-1.5 inline-flex text-xs leading-5 font-semibold rounded-full ${getEstadoBadgeColor(evento.estado)}`}>
                              {evento.estado}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-sm font-medium">
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => handleEditarEvento(evento)}
                                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                title="Editar"
                              >
                                <i className="pi pi-pencil"></i>
                              </button>
                              <button
                                onClick={() => handleVerCapacidad(evento.id_evento)}
                                className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                                title="Ver Capacidad"
                              >
                                <i className="pi pi-chart-bar"></i>
                              </button>
                              {evento.estado === 'ACTIVO' && (
                                <button
                                  onClick={() => handleCambiarEstado(evento.id_evento, 'INACTIVO')}
                                  className="p-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
                                  title="Desactivar"
                                >
                                  <i className="pi pi-pause"></i>
                                </button>
                              )}
                              {evento.estado === 'INACTIVO' && (
                                <button
                                  onClick={() => handleCambiarEstado(evento.id_evento, 'ACTIVO')}
                                  className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                                  title="Activar"
                                >
                                  <i className="pi pi-play"></i>
                                </button>
                              )}
                              {evento.estado !== 'CANCELADO' && (
                                <button
                                  onClick={() => handleCambiarEstado(evento.id_evento, 'CANCELADO')}
                                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                  title="Cancelar"
                                >
                                  <i className="pi pi-times-circle"></i>
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          </main>
        </div>
      </div>

      {/* Modal de Edición */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-teal-600 to-emerald-600">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
                  <i className="pi pi-pencil text-xl text-white"></i>
                </div>
                <h3 className="text-2xl font-bold text-white">Editar Evento</h3>
              </div>
            </div>

            <form onSubmit={handleGuardarEvento} className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nombre del Evento <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={nombreEvento}
                    onChange={(e) => setNombreEvento(e.target.value)}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Lugar <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={lugarEvento}
                    onChange={(e) => setLugarEvento(e.target.value)}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Fecha Inicio <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="datetime-local"
                    value={fechaInicio}
                    onChange={(e) => setFechaInicio(e.target.value)}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Fecha Fin <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="datetime-local"
                    value={fechaFin}
                    onChange={(e) => setFechaFin(e.target.value)}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Cupo Máximo <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    value={cupoMaximo}
                    onChange={(e) => setCupoMaximo(e.target.value)}
                    min="1"
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Estado <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={estado}
                    onChange={(e) => setEstado(e.target.value)}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                    required
                  >
                    <option value="ACTIVO">ACTIVO</option>
                    <option value="INACTIVO">INACTIVO</option>
                    <option value="CANCELADO">CANCELADO</option>
                  </select>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Descripción <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    value={descripcion}
                    onChange={(e) => setDescripcion(e.target.value)}
                    rows={3}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                    required
                  />
                </div>
              </div>

              <div className="flex gap-3 justify-end pt-4">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg font-semibold hover:bg-gray-200 transition flex items-center gap-2"
                >
                  <i className="pi pi-times"></i>
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={guardandoEvento}
                  className={`px-6 py-3 text-white rounded-lg font-semibold transition flex items-center gap-2 ${
                    guardandoEvento
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 shadow-md'
                  }`}
                >
                  {guardandoEvento ? (
                    <>
                      <span className="animate-spin inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full"></span>
                      Guardando...
                    </>
                  ) : (
                    <>
                      <i className="pi pi-save"></i>
                      Guardar Cambios
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal de Capacidad */}
      {showCapacidadModal && capacidadInfo && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full">
            <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-blue-600 to-cyan-600">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
                  <i className="pi pi-chart-bar text-xl text-white"></i>
                </div>
                <h3 className="text-2xl font-bold text-white">Información de Capacidad</h3>
              </div>
            </div>

            <div className="p-6 space-y-4">
              <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                <span className="text-gray-600 font-medium flex items-center gap-2">
                  <i className="pi pi-users text-gray-500"></i>
                  Cupo Máximo
                </span>
                <span className="text-xl font-bold text-gray-900">{capacidadInfo.cupo_maximo}</span>
              </div>
              <div className="flex justify-between items-center p-4 bg-blue-50 rounded-lg">
                <span className="text-gray-600 font-medium flex items-center gap-2">
                  <i className="pi pi-user-plus text-blue-500"></i>
                  Inscritos
                </span>
                <span className="text-xl font-bold text-blue-600">{capacidadInfo.inscritos}</span>
              </div>
              <div className="flex justify-between items-center p-4 bg-green-50 rounded-lg">
                <span className="text-gray-600 font-medium flex items-center gap-2">
                  <i className="pi pi-check-square text-green-500"></i>
                  Disponibles
                </span>
                <span className="text-xl font-bold text-green-600">{capacidadInfo.disponibles}</span>
              </div>
              <div className="flex justify-between items-center p-4 bg-orange-50 rounded-lg">
                <span className="text-gray-600 font-medium flex items-center gap-2">
                  <i className="pi pi-percentage text-orange-500"></i>
                  Porcentaje Ocupado
                </span>
                <span className="text-xl font-bold text-orange-600">{capacidadInfo.porcentaje_ocupado}%</span>
              </div>

              {/* Barra de progreso */}
              <div className="pt-2">
                <div className="flex justify-between text-sm text-gray-600 mb-2">
                  <span>Progreso de ocupación</span>
                  <span className="font-semibold">{capacidadInfo.porcentaje_ocupado}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3 shadow-inner">
                  <div
                    className="bg-gradient-to-r from-teal-500 to-emerald-500 h-3 rounded-full transition-all shadow-sm"
                    style={{ width: `${capacidadInfo.porcentaje_ocupado}%` }}
                  ></div>
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-gray-200 flex justify-end bg-gray-50">
              <button
                onClick={() => setShowCapacidadModal(false)}
                className="px-6 py-3 bg-gradient-to-r from-gray-600 to-gray-700 text-white rounded-lg font-semibold hover:from-gray-700 hover:to-gray-800 transition shadow-md flex items-center gap-2"
              >
                <i className="pi pi-times"></i>
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
