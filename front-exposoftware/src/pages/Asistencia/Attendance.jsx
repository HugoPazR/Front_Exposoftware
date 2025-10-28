import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import QRCode from "react-qr-code";
import { API_ENDPOINTS } from "../../utils/constants";

export default function Attendance() {
  const navigate = useNavigate();
  
  // Estados para eventos
  const [eventos, setEventos] = useState([]);
  const [loadingEventos, setLoadingEventos] = useState(false);
  
  // Estados del formulario
  const [idEvento, setIdEvento] = useState("");
  const [correoUsuario, setCorreoUsuario] = useState("");
  const [codigoQR, setCodigoQR] = useState("");
  
  // Estados de UI
  const [loading, setLoading] = useState(false);
  const [mensaje, setMensaje] = useState("");
  const [tipoMensaje, setTipoMensaje] = useState("");
  
  // Estado para el evento seleccionado
  const [eventoSeleccionado, setEventoSeleccionado] = useState(null);

  // Cargar eventos al montar el componente
  useEffect(() => {
    fetchEventos();
  }, []);

  const fetchEventos = async () => {
    setLoadingEventos(true);
    try {
      const response = await fetch(API_ENDPOINTS.EVENTOS);
      if (!response.ok) {
        throw new Error("Error al cargar los eventos");
      }
      const data = await response.json();
      setEventos(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error al cargar eventos:", error);
      setMensaje("❌ Error al cargar los eventos. Por favor, recarga la página.");
      setTipoMensaje("error");
    } finally {
      setLoadingEventos(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMensaje("");

    try {
      const payload = {
        correo_usuario: correoUsuario,
        id_evento: idEvento,
        codigo_qr: codigoQR.toUpperCase(),
      };

      const response = await fetch(API_ENDPOINTS.ASISTENCIAS, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (response.ok) {
        // Si el usuario está registrado
        if (data.estado_asistencia === "registrado") {
          setMensaje("🎉 ¡Bienvenido al evento de Exposoftware! Tu asistencia ha sido registrada exitosamente.");
          setTipoMensaje("success");
          
          // Limpiar formulario
          setIdEvento("");
          setCorreoUsuario("");
          setCodigoQR("");
        }
      } else if (response.status === 404 || data.estado_asistencia === "no registrado") {
        // Si el usuario no está registrado en el sistema
        setMensaje("⚠️ No estás registrado en el sistema. Serás redirigido al registro...");
        setTipoMensaje("warning");
        
        // Redirigir al registro después de 3 segundos
        setTimeout(() => {
          navigate("/register");
        }, 3000);
      } else {
        setMensaje(data.mensaje || "❌ Error al registrar la asistencia. Verifica los datos.");
        setTipoMensaje("error");
      }
    } catch (error) {
      console.error("Error al registrar asistencia:", error);
      setMensaje("❌ Error de conexión. Por favor, intenta de nuevo.");
      setTipoMensaje("error");
    } finally {
      setLoading(false);
    }
  };

  // Manejar cambio de evento seleccionado
  const handleEventoChange = (eventoId) => {
    setIdEvento(eventoId);
    const evento = eventos.find((e) => (e.id || e.id_evento) === eventoId);
    setEventoSeleccionado(evento || null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            📋 Registro de Asistencia
          </h1>
          <p className="text-lg text-gray-600">
            Exposoftware - Universidad Popular del Cesar
          </p>
        </div>

        {/* Formulario */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              ✅ Registra tu Asistencia
            </h2>
            <p className="text-sm text-gray-600">
              Selecciona el evento, ingresa tu correo institucional y el código QR para confirmar tu participación.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Seleccionar Evento */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Seleccionar Evento <span className="text-red-500">*</span>
                </label>
                <select
                  value={idEvento}
                  onChange={(e) => handleEventoChange(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white shadow-sm"
                  required
                >
                  <option value="">Selecciona un evento</option>
                  {loadingEventos ? (
                    <option disabled>Cargando eventos...</option>
                  ) : (
                    eventos.map((evento) => (
                      <option key={evento.id || evento.id_evento} value={evento.id || evento.id_evento}>
                        {evento.nombre_evento} - {evento.lugar_evento} ({new Date(evento.fecha_inicio).toLocaleDateString("es-ES")})
                      </option>
                    ))
                  )}
                </select>
              </div>

              {/* Correo del Usuario */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Correo Electrónico <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  value={correoUsuario}
                  onChange={(e) => setCorreoUsuario(e.target.value)}
                  placeholder="usuario@unicesar.edu.co"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm"
                  required
                />
                <p className="mt-1 text-xs text-gray-500">
                  Usa tu correo institucional registrado en el sistema
                </p>
              </div>

              {/* Código QR del Evento */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Código QR del Evento <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={codigoQR}
                  onChange={(e) => setCodigoQR(e.target.value.toUpperCase())}
                  placeholder="Ej: ABC123XYZ456"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono shadow-sm"
                  required
                  maxLength={12}
                />
                <p className="mt-1 text-xs text-gray-500">
                  Escanea el código QR o ingrésalo manualmente (12 caracteres)
                </p>
              </div>

              {/* Mostrar QR del evento seleccionado */}
              {eventoSeleccionado && eventoSeleccionado.codigo_qr && (
                <div className="md:col-span-2">
                  <div className="p-6 bg-gradient-to-br from-blue-50 to-green-50 rounded-lg border-2 border-blue-200">
                    <div className="text-center">
                      <h3 className="text-lg font-bold text-gray-900 mb-2">
                        📱 Código QR del Evento
                      </h3>
                      <p className="text-sm text-gray-600 mb-4">
                        {eventoSeleccionado.nombre_evento}
                      </p>
                      <div className="inline-block p-4 bg-white rounded-lg shadow-lg">
                        <QRCode value={eventoSeleccionado.codigo_qr} size={180} />
                      </div>
                      <p className="mt-4 text-sm text-gray-600">
                        Código alfanumérico:{" "}
                        <span className="font-mono font-bold text-blue-700">
                          {eventoSeleccionado.codigo_qr}
                        </span>
                      </p>
                      <button
                        type="button"
                        onClick={() => {
                          setCodigoQR(eventoSeleccionado.codigo_qr);
                          navigator.clipboard.writeText(eventoSeleccionado.codigo_qr);
                        }}
                        className="mt-3 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm font-semibold"
                      >
                        📋 Copiar Código
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Mensaje de respuesta */}
            {mensaje && (
              <div
                className={`p-4 rounded-lg ${
                  tipoMensaje === "success"
                    ? "bg-green-100 border border-green-400 text-green-800"
                    : tipoMensaje === "warning"
                    ? "bg-yellow-100 border border-yellow-400 text-yellow-800"
                    : "bg-red-100 border border-red-400 text-red-800"
                }`}
              >
                <p className="font-semibold">{mensaje}</p>
              </div>
            )}

            {/* Botón de registro */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-600 to-green-600 text-white px-6 py-4 rounded-lg font-bold text-lg hover:from-blue-700 hover:to-green-700 transition-all shadow-lg disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed transform hover:scale-[1.02]"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Registrando...
                </span>
              ) : (
                "✅ Registrar Mi Asistencia"
              )}
            </button>
          </form>

          {/* Información adicional */}
          <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h3 className="font-semibold text-blue-900 mb-2">📌 Información Importante:</h3>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Debes estar registrado en el sistema antes de registrar tu asistencia</li>
              <li>• El código QR debe coincidir con el del evento seleccionado</li>
              <li>• Solo puedes registrar tu asistencia una vez por evento</li>
              <li>• Si no estás registrado, serás redirigido automáticamente al formulario de registro</li>
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8 text-gray-600 text-sm">
          <p>¿No tienes una cuenta?{" "}
            <button
              onClick={() => navigate("/register")}
              className="text-blue-600 hover:text-blue-800 font-semibold underline"
            >
              Regístrate aquí
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
