
import { useState, useEffect } from "react";
import logo from "../../assets/Logo-unicesar.png";
import AdminSidebar from "../../components/Layout/AdminSidebar"
import QRCode from "qrcode"


export default function AttendanceAdmin(){
    const [qrCodeUrl, setQrCodeUrl] = useState(null)
  const [qrData, setQrData] = useState(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)

  // Estadísticas de ejemplo
  const [stats, setStats] = useState({
    totalRegistrados: 0,
    porcentajeAsistencia: 0,
  })

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
    setIsGenerating(true)

    try {
      // Crear datos únicos para el QR
      const today = new Date()
      const qrInfo = {
        evento: "Expo-Software 2025",
        fecha: today.toLocaleDateString("es-CO"),
        hora_generacion: today.toLocaleTimeString("es-CO"),
        id_sesion: `EXPO-${Date.now()}`,
        valido_hasta: new Date(today.setHours(23, 59, 59)).toISOString(),
      }

      // Convertir a JSON string para el QR
      const qrString = JSON.stringify(qrInfo)

      // Generar el código QR
      const qrUrl = await QRCode.toDataURL(qrString, {
        width: 400,
        margin: 2,
        color: {
          dark: "#16a34a",
          light: "#ffffff",
        },
      })

      setQrCodeUrl(qrUrl)
      setQrData(qrInfo)

      // Guardar en localStorage
      localStorage.setItem(
        "qr_asistencia",
        JSON.stringify({
          qrUrl: qrUrl,
          data: qrInfo,
          date: new Date().toDateString(),
        }),
      )

      setShowSuccess(true)
      setTimeout(() => setShowSuccess(false), 3000)
    } catch (error) {
      console.error("Error generando QR:", error)
      alert("Hubo un error al generar el código QR")
    } finally {
      setIsGenerating(false)
    }
  }

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

            {/* Estadísticas */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">

              <div className="bg-gradient-to-br from-blue-50 to-white rounded-lg border border-gray-200 p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Total Asistencia</p>
                    <h3 className="text-3xl font-bold text-gray-900">{stats.totalRegistrados}</h3>
                    <p className="text-xs text-gray-500 mt-2">Participantes totales</p>
                  </div>
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <i className="pi pi-chart-bar text-xl text-blue-600"></i>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-purple-50 to-white rounded-lg border border-gray-200 p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Porcentaje</p>
                    <h3 className="text-3xl font-bold text-gray-900">{stats.porcentajeAsistencia}%</h3>
                    <p className="text-xs text-gray-500 mt-2">Asistencia promedio</p>
                  </div>
                  <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                    <i className="pi pi-percentage text-xl text-purple-600"></i>
                  </div>
                </div>
              </div>
            </div>

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
                      <p className="text-sm font-medium text-gray-900">{qrData.hora_generacion}</p>
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