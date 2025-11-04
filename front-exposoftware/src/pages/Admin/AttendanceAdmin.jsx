
import { useState, useEffect } from "react";
import logo from "../../assets/Logo-unicesar.png";
import AdminSidebar from "../../components/Layout/AdminSidebar"
import QRCode from "qrcode"


export default function AttendanceAdmin() {
  const [qrCodeUrl, setQrCodeUrl] = useState(null)
  const [qrData, setQrData] = useState(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)

  const [registeredPeople, setRegisteredPeople] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(4)
  const [searchTerm, setSearchTerm] = useState("")

  // Estadísticas de ejemplo
  const [stats, setStats] = useState({
    totalRegistrados: 0,
    porcentajeAsistencia: 0,
  })

  useEffect(() => {
    const storedPeople = localStorage.getItem("registered_people")
    if (storedPeople) {
      setRegisteredPeople(JSON.parse(storedPeople))
    } else {
      // Datos de ejemplo - esto se reemplazará con datos del backend
      const exampleData = [
        {
          id: 1,
          cedula: "1065847392",
          nombre: "Juan Carlos Pérez García",
          correo: "juan.perez@unicesar.edu.co",
          fecha: "2025-01-15",
          hora: "08:30:15",
        },
        {
          id: 2,
          cedula: "1098765432",
          nombre: "María Fernanda López Martínez",
          correo: "maria.lopez@unicesar.edu.co",
          fecha: "2025-01-15",
          hora: "08:32:45",
        },
        {
          id: 3,
          cedula: "1023456789",
          nombre: "Carlos Andrés Rodríguez Silva",
          correo: "carlos.rodriguez@unicesar.edu.co",
          fecha: "2025-01-15",
          hora: "08:35:20",
        },
        {
          id: 4,
          cedula: "1087654321",
          nombre: "Ana Sofía Gómez Torres",
          correo: "ana.gomez@unicesar.edu.co",
          fecha: "2025-01-15",
          hora: "08:38:10",
        },
        {
          id: 5,
          cedula: "1034567890",
          nombre: "Luis Fernando Martínez Díaz",
          correo: "luis.martinez@unicesar.edu.co",
          fecha: "2025-01-15",
          hora: "08:40:55",
        },
        {
          id: 6,
          cedula: "1067593241",
          nombre: "Esteban David Rodriguez Rangel",
          correo: "estebandrodriguez@unicesar.edu.co",
          fecha: "2025-01-15",
          hora: "08:40:55",
        },
      ]
      setRegisteredPeople(exampleData)
      localStorage.setItem("registered_people", JSON.stringify(exampleData))
    }
  }, [])

  const filteredPeople = registeredPeople.filter(
    (person) =>
      person.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      person.cedula.includes(searchTerm) ||
      person.correo.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentItems = filteredPeople.slice(indexOfFirstItem, indexOfLastItem)
  const totalPages = Math.ceil(filteredPeople.length / itemsPerPage)

  const goToPage = (pageNumber) => {
    setCurrentPage(pageNumber)
  }

  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1)
    }
  }

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1)
    }
  }

  // Verificar si ya existe un QR para hoy
  useEffect(() => {
    const storedQR = localStorage.getItem("qr_asistencia")
    if (storedQR) {
      const qrInfo = JSON.parse(storedQR)
      const today = new Date().toDateString()

      // Si el QR es de hoy, lo mostramos
      if (qrInfo.date === today) {
        setQrCodeUrl(qrInfo.qrUrl)
        setQrData(qrInfo.data)
      } else {
        // Si es de otro día, lo eliminamos
        localStorage.removeItem("qr_asistencia")
      }
    }

    // Cargar estadísticas (aquí podrías hacer una llamada a tu API)
    const storedStats = localStorage.getItem("stats_asistencia")
    if (storedStats) {
      setStats(JSON.parse(storedStats))
    }
  }, [])

  // Generar código QR
  const generarQR = async () => {
    setIsGenerating(true);

    try {
      const today = new Date();
      const idSesion = `EXPO-${Date.now()}`;
      const validoHasta = new Date(today.setHours(23, 59, 59)).toISOString();

      // URL a la que apuntará el QR (puedes cambiarla luego)
      const qrUrlData = `http://localhost:5173/asistencia?id_sesion=${idSesion}`;

      const qrInfo = {
        evento: "Expo-Software 2025",
        fecha: today.toLocaleDateString("es-CO"),
        hora: today.toLocaleTimeString("es-CO", {
          hour: "2-digit",
          minute: "2-digit",
        }),
        id_sesion: idSesion,
        valido_hasta: validoHasta,
        link: qrUrlData,
      };

      // Generar la imagen del QR
      const qrUrl = await QRCode.toDataURL(qrUrlData, {
        width: 400,
        margin: 2,
        color: { dark: "#16a34a", light: "#ffffff" },
      });

      setQrCodeUrl(qrUrl);
      setQrData(qrInfo);

      localStorage.setItem("qr_asistencia", JSON.stringify({
        qrUrl,
        data: qrInfo,
        date: new Date().toDateString(),
      }));

      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (error) {
      console.error("Error generando QR:", error);
      alert("Hubo un error al generar el código QR");
    } finally {
      setIsGenerating(false);
    }
  };

  // Descargar QR
  const descargarQR = () => {
    if (!qrCodeUrl) return

    const link = document.createElement("a")
    link.download = `QR-Asistencia-${new Date().toLocaleDateString("es-CO")}.png`
    link.href = qrCodeUrl
    link.click()
  }

  // Regenerar QR (eliminar el actual y crear uno nuevo)
  const regenerarQR = () => {
    localStorage.removeItem("qr_asistencia")
    setQrCodeUrl(null)
    setQrData(null)
    generarQR()
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
                <h1 className="text-lg font-bold text-gray-900">Expo-software 2025</h1>
                <p className="text-xs text-gray-500">Universidad Popular del Cesar</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3">
                <span className="text-sm text-gray-700 hidden sm:block">Carlos</span>
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <span className="text-green-600 font-bold text-lg">C</span>
                </div>
              </div>

              <button className="text-sm font-medium text-red-600 hover:text-red-700 transition-colors flex items-center gap-2">
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
          <AdminSidebar userName="Carlos Mendoza" userRole="Administrador" />

          {/* Main Content */}
          <main className="lg:col-span-3">
            {/* Título de la página */}
            <div className="mb-6">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Control de Asistencia</h2>
              <p className="text-gray-600">Genera y gestiona el código QR para el registro de asistencia diaria</p>
            </div>

            {/* Mensaje de éxito */}
            {showSuccess && (
              <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4 flex items-center gap-3 animate-fade-in">
                <i className="pi pi-check-circle text-green-600 text-xl"></i>
                <p className="text-green-800 font-medium">¡Código QR generado exitosamente!</p>
              </div>
            )}

            {/* Sección principal del QR */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Panel de generación de QR */}
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                    <i className="pi pi-qrcode text-green-600 text-xl"></i>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Código QR de Asistencia</h3>
                    <p className="text-sm text-gray-500">Válido por 24 horas</p>
                  </div>
                </div>

                {!qrCodeUrl ? (
                  <div className="text-center py-12">
                    <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <i className="pi pi-qrcode text-gray-400 text-4xl"></i>
                    </div>
                    <h4 className="text-lg font-medium text-gray-900 mb-2">No hay código QR activo</h4>
                    <p className="text-sm text-gray-500 mb-6">
                      Genera un nuevo código QR para el registro de asistencia de hoy
                    </p>
                    <button
                      onClick={generarQR}
                      disabled={isGenerating}
                      className="inline-flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isGenerating ? (
                        <>
                          <i className="pi pi-spin pi-spinner"></i>
                          Generando...
                        </>
                      ) : (
                        <>
                          <i className="pi pi-plus-circle"></i>
                          Generar Código QR
                        </>
                      )}
                    </button>
                  </div>
                ) : (
                  <div className="text-center">
                    <div className="bg-white p-4 rounded-lg border-2 border-green-200 inline-block mb-4">
                      <img src={qrCodeUrl || "/placeholder.svg"} alt="Código QR de Asistencia" className="w-64 h-64" />
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3 justify-center">
                      <button
                        onClick={descargarQR}
                        className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
                      >
                        <i className="pi pi-download"></i>
                        Descargar QR
                      </button>
                      <button
                        onClick={regenerarQR}
                        className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg font-medium hover:bg-gray-700 transition-colors"
                      >
                        <i className="pi pi-refresh"></i>
                        Regenerar
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Panel de información del QR */}
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <i className="pi pi-info-circle text-blue-600 text-xl"></i>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Información del Código</h3>
                    <p className="text-sm text-gray-500">Detalles de la sesión actual</p>
                  </div>
                </div>

                {qrData ? (
                  <div className="space-y-4">
                    <div className="bg-gray-50 rounded-lg p-4">
                      <p className="text-xs text-gray-500 mb-1">Evento</p>
                      <p className="text-sm font-medium text-gray-900">{qrData.evento}</p>
                    </div>

                    <div className="bg-gray-50 rounded-lg p-4">
                      <p className="text-xs text-gray-500 mb-1">Fecha de Generación</p>
                      <p className="text-sm font-medium text-gray-900">{qrData.fecha}</p>
                    </div>

                    <div className="bg-gray-50 rounded-lg p-4">
                      <p className="text-xs text-gray-500 mb-1">Hora de Generación</p>
                      <p className="text-sm font-medium text-gray-900">{qrData.hora}</p>
                    </div>

                    <div className="bg-gray-50 rounded-lg p-4">
                      <p className="text-xs text-gray-500 mb-1">ID de Sesión</p>
                      <p className="text-sm font-mono text-gray-900 break-all">{qrData.id_sesion}</p>
                    </div>

                    <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-start gap-3">
                      <i className="pi pi-check-circle text-green-600 text-lg mt-0.5"></i>
                      <div>
                        <p className="text-sm font-medium text-green-900">Código Activo</p>
                        <p className="text-xs text-green-700 mt-1">Este código es válido hasta las 11:59 PM de hoy</p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <i className="pi pi-info-circle text-gray-400 text-3xl"></i>
                    </div>
                    <p className="text-sm text-gray-500">No hay información disponible</p>
                    <p className="text-xs text-gray-400 mt-1">Genera un código QR para ver los detalles</p>
                  </div>
                )}
              </div>
            </div>

            <div className="mt-6 mb-6 bg-white rounded-lg border border-gray-200 p-6">
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
                    placeholder="Buscar por nombre, cédula o correo..."
                    value={searchTerm}
                    onChange={(e) => {
                      setSearchTerm(e.target.value)
                      setCurrentPage(1)
                    }}
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent w-80"
                  />
                </div>
              </div>

              {/* Tabla */}
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200 bg-gray-50">
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        #
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Cédula
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
                        <tr key={person.id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-4 py-4 text-sm text-gray-900 font-medium">
                            {indexOfFirstItem + index + 1}
                          </td>
                          <td className="px-4 py-4 text-sm text-gray-900 font-mono">{person.cedula}</td>
                          <td className="px-4 py-4 text-sm text-gray-900">{person.nombre}</td>
                          <td className="px-4 py-4 text-sm text-gray-600">{person.correo}</td>
                          <td className="px-4 py-4 text-sm text-gray-600">
                            <div className="flex flex-col">
                              <span>{person.fecha}</span>
                              <span className="text-xs text-gray-500">{person.hora}</span>
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
                                  : "Aún no hay personas registradas"}
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
                        const pageNumber = index + 1
                        // Mostrar solo algunas páginas alrededor de la actual
                        if (
                          pageNumber === 1 ||
                          pageNumber === totalPages ||
                          (pageNumber >= currentPage - 1 && pageNumber <= currentPage + 1)
                        ) {
                          return (
                            <button
                              key={pageNumber}
                              onClick={() => goToPage(pageNumber)}
                              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${currentPage === pageNumber
                                ? "bg-green-600 text-white"
                                : "border border-gray-300 text-gray-700 hover:bg-gray-50"
                                }`}
                            >
                              {pageNumber}
                            </button>
                          )
                        } else if (pageNumber === currentPage - 2 || pageNumber === currentPage + 2) {
                          return (
                            <span key={pageNumber} className="px-2 text-gray-500">
                              ...
                            </span>
                          )
                        }
                        return null
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

            {/* Instrucciones */}
            <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-6">
              <div className="flex items-start gap-3">
                <i className="pi pi-lightbulb text-blue-600 text-xl mt-0.5"></i>
                <div>
                  <h4 className="font-semibold text-blue-900 mb-2">¿Cómo funciona?</h4>
                  <ul className="space-y-2 text-sm text-blue-800">
                    <li className="flex items-start gap-2">
                      <span className="text-blue-600 mt-0.5">•</span>
                      <span>Genera el código QR al inicio del día para habilitar el registro de asistencia</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-600 mt-0.5">•</span>
                      <span>El código QR es válido durante todo el día (hasta las 11:59 PM)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-600 mt-0.5">•</span>
                      <span>Los participantes pueden escanear el código para registrar su asistencia</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-600 mt-0.5">•</span>
                      <span>Puedes descargar el código QR para mostrarlo en pantallas o imprimirlo</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-600 mt-0.5">•</span>
                      <span>El código se regenera automáticamente cada día</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  )
}
