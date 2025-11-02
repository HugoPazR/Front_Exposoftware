
import { useState, useEffect, useRef } from "react"
import { Link } from "react-router-dom";
import logo from "../../assets/Logo-unicesar.png";
import { Html5Qrcode } from "html5-qrcode"

export default function AttendanceStudent() {
    const [scanning, setScanning] = useState(false)
    const [scanResult, setScanResult] = useState(null)
    const [showSuccess, setShowSuccess] = useState(false)
    const [showError, setShowError] = useState(false)
    const [errorMessage, setErrorMessage] = useState("")
    const [cameraPermission, setCameraPermission] = useState(null)
    const [misAsistencias, setMisAsistencias] = useState([])
    const scannerRef = useRef(null)
    const html5QrCodeRef = useRef(null)

    // Cargar asistencias previas del estudiante
    useEffect(() => {
        const storedAsistencias = localStorage.getItem("mis_asistencias")
        if (storedAsistencias) {
            setMisAsistencias(JSON.parse(storedAsistencias))
        }
    }, [])

    // Iniciar escáner
    const iniciarEscaneo = async () => {
        try {
            // Verificar permisos de cámara
            const stream = await navigator.mediaDevices.getUserMedia({ video: true })
            stream.getTracks().forEach((track) => track.stop())
            setCameraPermission(true)

            setScanning(true)
            setScanResult(null)
            setShowError(false)

            // Configurar el escáner
            const html5QrCode = new Html5Qrcode("qr-reader")
            html5QrCodeRef.current = html5QrCode

            const config = {
                fps: 10,
                qrbox: { width: 250, height: 250 },
                aspectRatio: 1.0,
            }

            await html5QrCode.start(
                { facingMode: "environment" },
                config,
                (decodedText) => {
                    // QR escaneado exitosamente
                    procesarQR(decodedText)
                    detenerEscaneo()
                },
                (errorMessage) => {
                    // Error de escaneo (normal mientras busca QR)
                    console.log("[v0] Escaneando...", errorMessage)
                },
            )
        } catch (err) {
            console.error("[v0] Error al acceder a la cámara:", err)
            setCameraPermission(false)
            setErrorMessage("No se pudo acceder a la cámara. Por favor, verifica los permisos.")
            setShowError(true)
            setScanning(false)
        }
    }

    // Detener escáner
    const detenerEscaneo = async () => {
        if (html5QrCodeRef.current) {
            try {
                await html5QrCodeRef.current.stop()
                html5QrCodeRef.current.clear()
            } catch (err) {
                console.error("[v0] Error al detener escáner:", err)
            }
        }
        setScanning(false)
    }

    // Procesar el QR escaneado
    const procesarQR = (qrData) => {
        try {
            const data = JSON.parse(qrData)

            // Validar que sea un QR de asistencia válido
            if (!data.evento || !data.id_sesion || !data.valido_hasta) {
                throw new Error("Código QR inválido")
            }

            // Verificar si el QR sigue siendo válido
            const validoHasta = new Date(data.valido_hasta)
            const ahora = new Date()

            if (ahora > validoHasta) {
                setErrorMessage("Este código QR ha expirado. Solicita uno nuevo al administrador.")
                setShowError(true)
                return
            }

            // Verificar si ya registró asistencia hoy
            const hoy = new Date().toDateString()
            const yaRegistrado = misAsistencias.some((asistencia) => new Date(asistencia.fecha).toDateString() === hoy)

            if (yaRegistrado) {
                setErrorMessage("Ya has registrado tu asistencia hoy.")
                setShowError(true)
                return
            }

            // Registrar asistencia
            const nuevaAsistencia = {
                evento: data.evento,
                fecha: new Date().toISOString(),
                hora: new Date().toLocaleTimeString("es-CO"),
                id_sesion: data.id_sesion,
            }

            const asistenciasActualizadas = [nuevaAsistencia, ...misAsistencias]
            setMisAsistencias(asistenciasActualizadas)
            localStorage.setItem("mis_asistencias", JSON.stringify(asistenciasActualizadas))

            // Actualizar estadísticas del admin
            const stats = JSON.parse(
                localStorage.getItem("stats_asistencia") ||
                '{"asistenciasHoy":0,"totalRegistrados":0,"porcentajeAsistencia":0}',
            )
            stats.asistenciasHoy += 1
            stats.totalRegistrados += 1
            stats.porcentajeAsistencia = Math.round((stats.asistenciasHoy / stats.totalRegistrados) * 100)
            localStorage.setItem("stats_asistencia", JSON.stringify(stats))

            setScanResult(data)
            setShowSuccess(true)
            setTimeout(() => setShowSuccess(false), 5000)
        } catch (error) {
            console.error("[v0] Error procesando QR:", error)
            setErrorMessage("Código QR inválido. Asegúrate de escanear el código correcto.")
            setShowError(true)
        }
    }

    // Limpiar al desmontar
    useEffect(() => {
        return () => {
            if (html5QrCodeRef.current) {
                html5QrCodeRef.current.stop().catch((err) => console.error("[v0] Error al limpiar:", err))
            }
        }
    }, [])

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
            
                        {/* Action button then user quick badge (avatar + name) */}
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                              <span className="text-green-600 font-bold text-lg">CG</span>
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
                    <aside className="lg:col-span-1">
                        <div className="bg-white rounded-lg border border-gray-200 p-4">
                            <nav className="space-y-1">
                                <Link to="/student/dashboard" className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50">
                                    <i className="pi pi-home text-base"></i>
                                    Dashboard
                                </Link>
                                <Link
                                    to="/student/proyectos"
                                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors text-gray-700 hover:bg-gray-50`}
                                >
                                    <i className="pi pi-book text-base"></i>
                                    Mis Proyectos
                                </Link>
                                <Link
                                    to="/student/asistencia"
                                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors text-gray-700 hover:bg-gray-50 text-green-700 bg-green-50`}
                                >
                                    <i className="pi pi-qrcode text-base"></i>
                                    Registrar Asistencia
                                </Link>
                                <Link
                                    to="/student/profile"
                                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors text-gray-700 hover:bg-gray-50`}
                                >
                                    <i className="pi pi-cog text-base"></i>
                                    Configuración
                                </Link>
                            </nav>
                        </div>

                        {/* User Info */}
                        <div className="bg-white rounded-lg border border-gray-200 p-4 mt-4">
                            <div className="text-center">
                                <h3 className="font-semibold text-gray-900">Cristian Guzman</h3>
                                <p className="text-sm text-gray-500">Estudiante</p>
                            </div>
                        </div>
                    </aside>

                    {/* Main Content */}
                    <main className="lg:col-span-3">
                        {/* Título */}
                        <div className="mb-6">
                            <h2 className="text-3xl font-bold text-gray-900 mb-2">Registrar Asistencia</h2>
                            <p className="text-gray-600">Escanea el código QR para registrar tu asistencia al evento</p>
                        </div>

                        {/* Mensaje de éxito */}
                        {showSuccess && scanResult && (
                            <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-6 animate-fade-in">
                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                                        <i className="pi pi-check-circle text-green-600 text-2xl"></i>
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="text-lg font-semibold text-green-900 mb-2">¡Asistencia Registrada!</h3>
                                        <p className="text-sm text-green-800 mb-3">Tu asistencia ha sido registrada exitosamente.</p>
                                        <div className="bg-white rounded-lg p-3 space-y-2">
                                            <div className="flex justify-between text-sm">
                                                <span className="text-gray-600">Evento:</span>
                                                <span className="font-medium text-gray-900">{scanResult.evento}</span>
                                            </div>
                                            <div className="flex justify-between text-sm">
                                                <span className="text-gray-600">Fecha:</span>
                                                <span className="font-medium text-gray-900">{new Date().toLocaleDateString("es-CO")}</span>
                                            </div>
                                            <div className="flex justify-between text-sm">
                                                <span className="text-gray-600">Hora:</span>
                                                <span className="font-medium text-gray-900">{new Date().toLocaleTimeString("es-CO")}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Mensaje de error */}
                        {showError && (
                            <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-3 animate-fade-in">
                                <i className="pi pi-times-circle text-red-600 text-xl"></i>
                                <div>
                                    <p className="text-red-800 font-medium">Error al registrar asistencia</p>
                                    <p className="text-sm text-red-700 mt-1">{errorMessage}</p>
                                </div>
                            </div>
                        )}

                        {/* Error de permisos de cámara */}
                        {cameraPermission === false && (
                            <div className="mb-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                                <div className="flex items-start gap-3">
                                    <i className="pi pi-exclamation-triangle text-yellow-600 text-xl mt-0.5"></i>
                                    <div>
                                        <p className="text-yellow-900 font-medium">Permisos de cámara requeridos</p>
                                        <p className="text-sm text-yellow-800 mt-1">
                                            Para escanear el código QR, necesitas permitir el acceso a la cámara en tu navegador.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Escáner de QR */}
                        <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                                    <i className="pi pi-camera text-blue-600 text-xl"></i>
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900">Escáner de Código QR</h3>
                                    <p className="text-sm text-gray-500">Usa tu cámara para escanear el código</p>
                                </div>
                            </div>

                            {!scanning ? (
                                <div className="text-center py-12">
                                    <div className="w-24 h-24 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-6">
                                        <i className="pi pi-qrcode text-blue-600 text-5xl"></i>
                                    </div>
                                    <h4 className="text-lg font-medium text-gray-900 mb-2">Listo para escanear</h4>
                                    <p className="text-sm text-gray-500 mb-6 max-w-md mx-auto">
                                        Presiona el botón para activar tu cámara y escanear el código QR del evento
                                    </p>
                                    <button
                                        onClick={iniciarEscaneo}
                                        className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
                                    >
                                        <i className="pi pi-camera"></i>
                                        Activar Cámara
                                    </button>
                                </div>
                            ) : (
                                <div>
                                    <div id="qr-reader" ref={scannerRef} className="rounded-lg overflow-hidden mb-4"></div>
                                    <div className="flex justify-center gap-3">
                                        <button
                                            onClick={detenerEscaneo}
                                            className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors"
                                        >
                                            <i className="pi pi-times"></i>
                                            Cancelar Escaneo
                                        </button>
                                    </div>
                                    <p className="text-center text-sm text-gray-500 mt-4">
                                        Apunta tu cámara hacia el código QR para escanearlo
                                    </p>
                                </div>
                            )}
                        </div>

                        {/* Historial de asistencias */}
                        <div className="bg-white rounded-lg border border-gray-200 p-6">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                                    <i className="pi pi-calendar text-green-600 text-xl"></i>
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900">Mis Asistencias</h3>
                                    <p className="text-sm text-gray-500">Historial de registros</p>
                                </div>
                            </div>

                            {misAsistencias.length > 0 ? (
                                <div className="space-y-3">
                                    {misAsistencias.slice(0, 5).map((asistencia, index) => (
                                        <div key={index} className="bg-gray-50 rounded-lg p-4 flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                                                    <i className="pi pi-check text-green-600"></i>
                                                </div>
                                                <div>
                                                    <p className="font-medium text-gray-900">{asistencia.evento}</p>
                                                    <p className="text-sm text-gray-500">
                                                        {new Date(asistencia.fecha).toLocaleDateString("es-CO")} - {asistencia.hora}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="text-green-600">
                                                <i className="pi pi-check-circle text-xl"></i>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-12">
                                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <i className="pi pi-calendar text-gray-400 text-3xl"></i>
                                    </div>
                                    <p className="text-sm text-gray-500">No tienes asistencias registradas</p>
                                    <p className="text-xs text-gray-400 mt-1">
                                        Escanea un código QR para registrar tu primera asistencia
                                    </p>
                                </div>
                            )}
                        </div>

                        {/* Instrucciones */}
                        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-6">
                            <div className="flex items-start gap-3">
                                <i className="pi pi-info-circle text-blue-600 text-xl mt-0.5"></i>
                                <div>
                                    <h4 className="font-semibold text-blue-900 mb-2">Instrucciones</h4>
                                    <ul className="space-y-2 text-sm text-blue-800">
                                        <li className="flex items-start gap-2">
                                            <span className="text-blue-600 mt-0.5">1.</span>
                                            <span>Presiona el botón "Activar Cámara" para iniciar el escáner</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <span className="text-blue-600 mt-0.5">2.</span>
                                            <span>Permite el acceso a la cámara cuando tu navegador lo solicite</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <span className="text-blue-600 mt-0.5">3.</span>
                                            <span>Apunta tu cámara hacia el código QR mostrado por el administrador</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <span className="text-blue-600 mt-0.5">4.</span>
                                            <span>El sistema registrará automáticamente tu asistencia al detectar el código</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <span className="text-blue-600 mt-0.5">5.</span>
                                            <span>Solo puedes registrar una asistencia por día</span>
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


