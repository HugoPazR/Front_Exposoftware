import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../../assets/Logo-unicesar.png";
import AdminSidebar from "../../components/Layout/AdminSidebar";
import AssistanceService from "../../services/AssistanceService";
import EventosService from "../../Services/EventosService";
import * as AuthService from "../../Services/AuthService";
import ReportGenerator from "../../components/ReportGenerator2";
import { Chart } from 'primereact/chart';
import * as XLSX from 'xlsx';

export default function EventsAttendance() {
  const [eventos, setEventos] = useState([]);
  const [eventoSeleccionado, setEventoSeleccionado] = useState("");
  const [registeredPeople, setRegisteredPeople] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userData, setUserData] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(4);
  const navigate = useNavigate();

  useEffect(() => {
    cargarEventos();
  }, []);

  useEffect(() => {
    const user = AuthService.getUserData();
    if (user) {
      setUserData(user);
    } else {
      navigate('/login');
    }
  }, [navigate]);

  const cargarEventos = async () => {
    try {
      setLoading(true);
      const response = await EventosService.obtenerEventos();
      
      console.log('📅 Respuesta completa:', response);
      
      // Manejar diferentes estructuras de respuesta
      let todosLosEventos = [];
      if (response?.data && Array.isArray(response.data)) {
        todosLosEventos = response.data;
      } else if (Array.isArray(response)) {
        todosLosEventos = response;
      }
      
      console.log('📅 Eventos cargados:', todosLosEventos);
      setEventos(todosLosEventos);
    } catch (error) {
      console.error('❌ Error cargando eventos:', error);
      setError('No se pudieron cargar los eventos. Por favor, inténtelo de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  const handleEventoChange = async (e) => {
    const id = e.target.value;
    setEventoSeleccionado(id);
    setCurrentPage(1);

    if (!id) {
      setRegisteredPeople([]);
      return;
    }

    try {
      const response = await AssistanceService.obtenerAsistenciasEvento(id);
      setRegisteredPeople(response?.data?.asistencias || []);
    } catch (error) {
      console.error("❌ Error al obtener asistencias:", error);
      setRegisteredPeople([]);
    }
  };

  const formatearFechaHora = (fechaIso) => {
    if (!fechaIso) return { fecha: "-", hora: "-" };
    const fecha = new Date(fechaIso);
    return {
      fecha: fecha.toLocaleDateString("es-CO", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      }),
      hora: fecha.toLocaleTimeString("es-CO", {
        hour: "2-digit",
        minute: "2-digit",
      })
    };
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

  const getUserName = () => {
    if (!userData) return 'Administrador';
    return userData.nombre || userData.nombres || userData.correo?.split('@')[0] || 'Administrador';
  };

  const getUserInitials = () => {
    const name = getUserName();
    return name.charAt(0).toUpperCase();
  };

  const filteredPeople = registeredPeople.filter(
    (person) =>
      person.nombre_completo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      person.id_usuario?.includes(searchTerm) ||
      person.correo?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredPeople.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredPeople.length / itemsPerPage);

  const goToPage = (pageNumber) => setCurrentPage(pageNumber);
  const nextPage = () => currentPage < totalPages && setCurrentPage(currentPage + 1);
  const prevPage = () => currentPage > 1 && setCurrentPage(currentPage - 1);

  // Procesar datos para la gráfica de asistencias por hora
  const procesarDatosGrafica = () => {
    if (!registeredPeople || registeredPeople.length === 0) {
      return {
        labels: [],
        datasets: [{
          label: 'Asistencias',
          data: [],
          backgroundColor: '#10B981',
          borderColor: '#059669',
          borderWidth: 1
        }]
      };
    }

    // Agrupar asistencias por hora
    const asistenciasPorHora = {};

    registeredPeople.forEach(persona => {
      if (persona.fecha_registro) {
        const fecha = new Date(persona.fecha_registro);
        const hora = fecha.getHours();
        const horaFormateada = `${hora.toString().padStart(2, '0')}:00`;

        if (!asistenciasPorHora[horaFormateada]) {
          asistenciasPorHora[horaFormateada] = 0;
        }
        asistenciasPorHora[horaFormateada]++;
      }
    });

    // Ordenar las horas
    const horasOrdenadas = Object.keys(asistenciasPorHora).sort();

    return {
      labels: horasOrdenadas,
      datasets: [{
        label: 'Asistencias por Hora',
        data: horasOrdenadas.map(hora => asistenciasPorHora[hora]),
        backgroundColor: '#10B981',
        borderColor: '#059669',
        borderWidth: 1
      }]
    };
  };

  // Configuración de la gráfica
  const chartData = procesarDatosGrafica();
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          font: {
            size: 12,
            family: 'Inter, sans-serif'
          }
        }
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            return `Asistencias: ${context.parsed.y}`;
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1
        }
      }
    }
  };

  // Funciones de exportación
  const exportarGraficaComoImagen = (chartId, fileName) => {
    ReportGenerator.exportarGraficaComoImagen(chartId, fileName);
  };

  const exportarGraficaComoPDF = (chartId, title, data) => {
    ReportGenerator.exportarGraficaComoPDF(chartId, title, data, { name: getUserName() });
  };



  const exportarAsistenciasExcel  = () => {
    if (!registeredPeople || registeredPeople.length === 0) {
      alert('No hay datos para exportar');
      return;
    }

    const eventoInfo = eventos.find(e => e.id_evento === eventoSeleccionado);

    // Preparar datos
    const data = registeredPeople.map(persona => {
      const fechaRegistro = persona.fecha_registro ? new Date(persona.fecha_registro) : null;
      const fecha = fechaRegistro ? fechaRegistro.toLocaleDateString('es-CO') : '';
      const hora = fechaRegistro ? fechaRegistro.toLocaleTimeString('es-CO', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      }) : '';

      return {
        'ID Usuario': persona.id_usuario,
        'Nombre Completo': persona.nombre_completo,
        'Correo Electrónico': persona.correo,
        'Fecha Registro': fecha,
        'Hora Registro': hora,
        'Evento': eventoInfo?.nombre_evento || ''
      };
    });

    // Crear workbook
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Asistencias');

    // Ajustar ancho de columnas
    const columnWidths = [
      { wch: 25 }, // ID Usuario
      { wch: 30 }, // Nombre Completo
      { wch: 35 }, // Correo Electrónico
      { wch: 15 }, // Fecha Registro
      { wch: 15 }, // Hora Registro
      { wch: 25 }  // Evento
    ];
    worksheet['!cols'] = columnWidths;

    // Aplicar estilos básicos al header
    const range = XLSX.utils.decode_range(worksheet['!ref']);
    for (let C = range.s.c; C <= range.e.c; ++C) {
      const address = XLSX.utils.encode_col(C) + '1';
      if (!worksheet[address]) continue;
      worksheet[address].s = {
        font: { bold: true, color: { rgb: 'FFFFFF' } },
        fill: { fgColor: { rgb: '366092' } },
        alignment: { horizontal: 'center', vertical: 'center' }
      };
    }

    // Descargar archivo
    const nombreArchivo = `Asistencias_${eventoInfo?.nombre_evento || 'Evento'}_${new Date().toISOString().split('T')[0]}.xlsx`;
    XLSX.writeFile(workbook, nombreArchivo);
  };

  const exportarReporteAsistencias = () => {
    const eventoInfo = eventos.find(e => e.id_evento === eventoSeleccionado);
    const asistenciasData = chartData.labels.map((label, index) => ({
      hora: label,
      asistencias: chartData.datasets[0].data[index]
    }));

    // Calcular estadísticas adicionales
    const totalAsistencias = registeredPeople.length;
    const horaPico = chartData.labels.length > 0 ?
      chartData.labels[chartData.datasets[0].data.indexOf(Math.max(...chartData.datasets[0].data))] :
      '--:--';
    const promedioPorHora = chartData.labels.length > 0 ?
      (totalAsistencias / chartData.labels.length).toFixed(1) :
      '0';

    // Obtener fecha y hora del evento
    const fechaInicio = eventoInfo ? new Date(eventoInfo.fecha_inicio).toLocaleDateString('es-CO') : '';
    const horaInicio = eventoInfo ? new Date(eventoInfo.fecha_inicio).toLocaleTimeString('es-CO', {
      hour: '2-digit',
      minute: '2-digit'
    }) : '';
    const fechaFin = eventoInfo ? new Date(eventoInfo.fecha_fin).toLocaleDateString('es-CO') : '';
    const horaFin = eventoInfo ? new Date(eventoInfo.fecha_fin).toLocaleTimeString('es-CO', {
      hour: '2-digit',
      minute: '2-digit'
    }) : '';

    ReportGenerator.exportarReporteCompleto({
      userInfo: {
        name: getUserName(),
        role: 'Administrador'
      },
      estadisticas: {
        evento: eventoInfo?.nombre_evento || 'Evento no seleccionado',
        descripcion: eventoInfo?.descripcion || '',
        lugar: eventoInfo?.lugar || '',
        fechaInicio: fechaInicio,
        horaInicio: horaInicio,
        fechaFin: fechaFin,
        horaFin: horaFin,
        estado: eventoInfo?.estado === 'ACTIVO' ? 'Activo' : 'Inactivo',
        totalAsistencias: totalAsistencias,
        horaPico: horaPico,
        promedioPorHora: promedioPorHora,
        horasRegistradas: chartData.labels.length,
        asistenciasPorHora: asistenciasData,
        fechaGeneracion: new Date().toLocaleDateString('es-CO'),
        horaGeneracion: new Date().toLocaleTimeString('es-CO', {
          hour: '2-digit',
          minute: '2-digit'
        })
      },
      chartIds: ['asistencias-chart'],
      chartTitles: ['Distribución de Asistencias por Hora'],
      chartData: [asistenciasData],
      institutionName: 'Universidad Popular del Cesar',
      eventName: `Reporte de Asistencias - ${eventoInfo?.nombre_evento || 'Evento'}`
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-teal-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando eventos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <img src={logo} alt="Logo Unicesar" className="w-10 h-auto" />
              <div>
                <h1 className="text-lg font-bold text-gray-900">Expo-software</h1>
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
            {/* Error message */}
            {error && (
              <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-center gap-3">
                  <i className="pi pi-exclamation-triangle text-red-600 text-xl"></i>
                  <div>
                    <h3 className="text-sm font-semibold text-red-900">Error al cargar datos</h3>
                    <p className="text-sm text-red-700 mt-1">{error}</p>
                  </div>
                  <button
                    onClick={cargarEventos}
                    className="ml-auto px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700 transition-colors"
                  >
                    Reintentar
                  </button>
                </div>
              </div>
            )}

            {/* Título */}
            <div className="mb-6">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Asistencias por Evento</h2>
              <p className="text-gray-600">Selecciona un evento para ver los registros de asistencia</p>
            </div>

            {/* Selector de Evento */}
            <div className="mb-6">
              <label className="block font-semibold mb-2 text-gray-700">Selecciona un evento:</label>
              <select
                value={eventoSeleccionado}
                onChange={handleEventoChange}
                className="border border-gray-300 rounded-lg p-2 w-full focus:ring-2 focus:ring-teal-500 focus:outline-none"
              >
                <option value="">-- Selecciona un evento --</option>
                {eventos.map((evento) => (
                  <option key={evento.id_evento} value={evento.id_evento}>
                    {evento.nombre_evento} ({evento.fecha_inicio.split("T")[0]})
                  </option>
                ))}
              </select>
            </div>

            {/* Tabla de Asistencias */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                    <i className="pi pi-users text-purple-600 text-xl"></i>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Personas Registradas</h3>
                    <p className="text-sm text-gray-500">
                      {filteredPeople.length}{" "}
                      {filteredPeople.length === 1 ? "persona registrada" : "personas registradas"}
                    </p>
                  </div>
                </div>

                {/* Buscador */}
                <div className="relative">
                  <i className="pi pi-search absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"></i>
                  <input
                    type="text"
                    placeholder="Buscar por nombre, ID o correo..."
                    value={searchTerm}
                    onChange={(e) => {
                      setSearchTerm(e.target.value);
                      setCurrentPage(1);
                    }}
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent w-80"
                  />
                </div>
              </div>

              {/* Botones de exportación */}
              {registeredPeople.length > 0 && (
                <div className="mb-6 flex flex-wrap gap-3 justify-center">
                  <button
                    onClick={exportarAsistenciasExcel}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-all duration-300 shadow-lg hover:shadow-xl"
                  >
                    <i className="pi pi-file-excel"></i>
                    Exportar a Excel
                  </button>
                  <button
                    onClick={() => exportarGraficaComoImagen('asistencias-chart', `Asistencias_${eventos.find(e => e.id_evento === eventoSeleccionado)?.nombre_evento || 'Evento'}`)}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-all duration-300 shadow-lg hover:shadow-xl"
                  >
                    <i className="pi pi-image"></i>
                    Gráfica como Imagen
                  </button>
                </div>
              )}

              {/* Tabla */}
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200 bg-gray-50">
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        #
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        ID Usuario
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Nombre Completo
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Correo Electrónico
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Fecha y Hora
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {currentItems.length > 0 ? (
                      currentItems.map((person, index) => (
                        <tr key={person.id_asistencia || index} className="hover:bg-gray-50 transition-colors">
                          <td className="px-4 py-4 text-sm text-gray-900 font-medium">
                            {indexOfFirstItem + index + 1}
                          </td>
                          <td className="px-4 py-4 text-sm text-gray-900 font-mono">{person.id_usuario}</td>
                          <td className="px-4 py-4 text-sm text-gray-900">{person.nombre_completo}</td>
                          <td className="px-4 py-4 text-sm text-gray-600">{person.correo}</td>
                          <td className="px-4 py-4 text-sm text-gray-600">
                            <div className="flex flex-col">
                              {(() => {
                                const { fecha, hora } = formatearFechaHora(person.fecha_registro);
                                return (
                                  <>
                                    <span>{fecha}</span>
                                    <span className="text-xs text-gray-500">{hora}</span>
                                  </>
                                );
                              })()}
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="5" className="px-4 py-12 text-center">
                          <div className="flex flex-col items-center gap-3">
                            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                              <i className="pi pi-users text-gray-400 text-3xl"></i>
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-900">No se encontraron registros</p>
                              <p className="text-xs text-gray-500 mt-1">
                                {searchTerm
                                  ? "Intenta con otros términos de búsqueda"
                                  : eventoSeleccionado
                                  ? "Aún no hay personas registradas en este evento"
                                  : "Selecciona un evento para ver las asistencias"}
                              </p>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Paginación */}
              {totalPages > 1 && (
                <div className="mt-6 flex items-center justify-between border-t border-gray-200 pt-4">
                  <div className="text-sm text-gray-600">
                    Mostrando {indexOfFirstItem + 1} a {Math.min(indexOfLastItem, filteredPeople.length)} de{" "}
                    {filteredPeople.length} registros
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={prevPage}
                      disabled={currentPage === 1}
                      className="px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      <i className="pi pi-chevron-left"></i>
                    </button>

                    <div className="flex items-center gap-1">
                      {[...Array(totalPages)].map((_, index) => {
                        const pageNumber = index + 1;
                        if (
                          pageNumber === 1 ||
                          pageNumber === totalPages ||
                          (pageNumber >= currentPage - 1 && pageNumber <= currentPage + 1)
                        ) {
                          return (
                            <button
                              key={pageNumber}
                              onClick={() => goToPage(pageNumber)}
                              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                                currentPage === pageNumber
                                  ? "bg-teal-600 text-white"
                                  : "border border-gray-300 text-gray-700 hover:bg-gray-50"
                              }`}
                            >
                              {pageNumber}
                            </button>
                          );
                        } else if (pageNumber === currentPage - 2 || pageNumber === currentPage + 2) {
                          return (
                            <span key={pageNumber} className="px-2 text-gray-500">
                              ...
                            </span>
                          );
                        }
                        return null;
                      })}
                    </div>

                    <button
                      onClick={nextPage}
                      disabled={currentPage === totalPages}
                      className="px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      <i className="pi pi-chevron-right"></i>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Gráfica de Asistencias */}
            {eventoSeleccionado && registeredPeople.length > 0 && (
              <div className="bg-white rounded-lg border border-gray-200 p-6 mt-6">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-teal-500 to-cyan-600 rounded-lg flex items-center justify-center">
                      <i className="pi pi-chart-bar text-white text-sm"></i>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        Análisis de Asistencias
                      </h3>
                      <p className="text-sm text-gray-500">
                        Distribución de asistencias por hora del día
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => exportarGraficaComoImagen('asistencias-chart', `Asistencias_${eventos.find(e => e.id_evento === eventoSeleccionado)?.nombre_evento || 'Evento'}`)}
                      className="p-2 bg-teal-50 hover:bg-teal-100 text-teal-600 rounded-lg transition-colors duration-200"
                      title="Exportar como imagen"
                    >
                      <i className="pi pi-image text-lg"></i>
                    </button>
                    <button
                      onClick={() => {
                        const asistenciasData = chartData.labels.map((label, index) => ({
                          hora: label,
                          asistencias: chartData.datasets[0].data[index]
                        }));
                        exportarGraficaComoPDF('asistencias-chart', 'Asistencias por Hora', asistenciasData);
                      }}
                      className="p-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg transition-colors duration-200"
                      title="Exportar como PDF"
                    >
                      <i className="pi pi-file-pdf text-lg"></i>
                    </button>
                    <button
                      onClick={exportarReporteAsistencias}
                      className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-lg font-medium hover:from-emerald-700 hover:to-teal-700 transition-all duration-300 shadow-lg hover:shadow-xl"
                    >
                      <i className="pi pi-file-pdf"></i>
                      Reporte Completo
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Gráfica */}
                  <div className="flex items-center justify-center">
                    <div id="asistencias-chart" style={{ width: '100%', maxWidth: '400px', height: '300px' }}>
                      <Chart type="bar" data={chartData} options={chartOptions} />
                    </div>
                  </div>

                  {/* Estadísticas */}
                  <div className="space-y-4">
                    <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-blue-700">Total de Asistencias</p>
                          <h3 className="text-2xl font-bold text-blue-900">{registeredPeople.length}</h3>
                        </div>
                        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                          <i className="pi pi-users text-blue-600 text-xl"></i>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-green-700">Hora Pico</p>
                          <h3 className="text-2xl font-bold text-green-900">
                            {chartData.labels.length > 0 ?
                              chartData.labels[chartData.datasets[0].data.indexOf(Math.max(...chartData.datasets[0].data))] :
                              '--:--'
                            }
                          </h3>
                        </div>
                        <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                          <i className="pi pi-clock text-green-600 text-xl"></i>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-purple-700">Promedio por Hora</p>
                          <h3 className="text-2xl font-bold text-purple-900">
                            {chartData.labels.length > 0 ?
                              (registeredPeople.length / chartData.labels.length).toFixed(1) :
                              '0'
                            }
                          </h3>
                        </div>
                        <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                          <i className="pi pi-chart-line text-purple-600 text-xl"></i>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}