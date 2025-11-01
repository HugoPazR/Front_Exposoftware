import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../../assets/Logo-unicesar.png";
import AdminSidebar from "../../components/Layout/AdminSidebar";
<<<<<<< HEAD
import { API_ENDPOINTS } from "../../utils/constants";
import * as AuthService from "../../Services/AuthService";
=======
import * as AuthService from "../../Services/AuthService";
import EventosService from "../../Services/EventosService";
>>>>>>> 8f3ec67 (Administrador casi listo y proyecto al 70 %)

export default function RegisterAttendance() {
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
    if (!userData) return 'Admin';
    return userData.nombre || userData.nombres || userData.correo?.split('@')[0] || 'Admin';
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

  // Estados para crear evento (Administrador)
  const [nombreEvento, setNombreEvento] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [fechaInicio, setFechaInicio] = useState("");
  const [fechaFin, setFechaFin] = useState("");
  const [lugarEvento, setLugarEvento] = useState("");
<<<<<<< HEAD
=======
  const [cupoMaximo, setCupoMaximo] = useState("");
  const [cargandoEvento, setCargandoEvento] = useState(false);
>>>>>>> 8f3ec67 (Administrador casi listo y proyecto al 70 %)

  // Estados para listar eventos
  const [eventos, setEventos] = useState([]);
  const [loadingEventos, setLoadingEventos] = useState(false);

  // Función para generar código QR alfanumérico automático
  const generarCodigoAlfanumerico = () => {
    const caracteres = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let codigo = "";
    for (let i = 0; i < 12; i++) {
      codigo += caracteres.charAt(Math.floor(Math.random() * caracteres.length));
    }
    return codigo;
  };

  // Cargar eventos al montar el componente
  useEffect(() => {
    cargarEventos();
  }, []);

  // Función para cargar eventos desde el backend
  const cargarEventos = async () => {
    setLoadingEventos(true);
    try {
<<<<<<< HEAD
      const response = await fetch(API_ENDPOINTS.EVENTOS);
      if (response.ok) {
        const data = await response.json();
        setEventos(data);
        console.log("📅 Eventos cargados:", data.length);
      } else {
        console.error("❌ Error al cargar eventos:", response.statusText);
      }
    } catch (error) {
      console.error("❌ Error de conexión al cargar eventos:", error);
=======
      const data = await EventosService.obtenerEventos();
      setEventos(data);
      console.log("✅ Eventos cargados:", data.length);
    } catch (error) {
      console.error("❌ Error al cargar eventos:", error);
      setEventos([]);
>>>>>>> 8f3ec67 (Administrador casi listo y proyecto al 70 %)
    } finally {
      setLoadingEventos(false);
    }
  };

  // Crear evento (Administrador)
  const handleCrearEvento = async (e) => {
    e.preventDefault();

<<<<<<< HEAD
    if (!nombreEvento || !descripcion || !fechaInicio || !fechaFin || !lugarEvento) {
      alert("Por favor completa todos los campos del evento");
      return;
    }

=======
    // Validar campos requeridos: nombre_evento, fecha_inicio, fecha_fin
    if (!nombreEvento || !fechaInicio || !fechaFin) {
      alert("Por favor completa los campos requeridos: Nombre, Fecha Inicio y Fecha Fin");
      return;
    }

    // Validar que cupo_maximo sea un número válido (si se proporciona)
    let cupo = null;
    if (cupoMaximo) {
      cupo = parseInt(cupoMaximo);
      if (isNaN(cupo) || cupo < 1) {
        alert("El cupo máximo debe ser un número mayor a 0");
        return;
      }
    }

>>>>>>> 8f3ec67 (Administrador casi listo y proyecto al 70 %)
    // Validar que fecha_fin >= fecha_inicio
    if (new Date(fechaFin) < new Date(fechaInicio)) {
      alert("La fecha de fin no puede ser anterior a la fecha de inicio");
      return;
    }

<<<<<<< HEAD
    // Generar código QR automáticamente
    const nuevoCodigoQR = generarCodigoAlfanumerico();

    // Payload para crear evento (fechas en formato ISO 8601)
    const payload = {
      nombre_evento: nombreEvento,
      descripcion: descripcion,
      fecha_inicio: new Date(fechaInicio).toISOString(), // ISO 8601
      fecha_fin: new Date(fechaFin).toISOString(),       // ISO 8601
      lugar_evento: lugarEvento,
      codigo_qr: nuevoCodigoQR,
    };

    console.log("📤 Creando evento:", payload);

    try {
      const response = await fetch(API_ENDPOINTS.EVENTOS, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        const data = await response.json();
        alert("✅ Evento creado exitosamente");
        console.log("✅ Evento creado:", data);

        // Limpiar formulario
        limpiarFormularioEvento();

        // Recargar lista de eventos
        cargarEventos();
      } else {
        const errorData = await response.json();
        console.error("❌ Error del servidor:", errorData);
        alert(`❌ Error al crear evento: ${errorData.message || "Error desconocido"}`);
      }
    } catch (error) {
      console.error("❌ Error al crear evento:", error);
      alert("❌ Error de conexión al crear el evento");
=======
    // Convertir fechas datetime-local a YYYY-MM-DD (formato requerido por el API)
    const convertirFechaAPI = (dateString) => {
      // dateString viene en formato "YYYY-MM-DDTHH:mm" de input datetime-local
      // Lo convertimos a formato de fecha: "YYYY-MM-DD"
      const fecha = new Date(dateString);
      return fecha.toISOString().split('T')[0];
    };

    const payload = {
      nombre_evento: nombreEvento,
      fecha_inicio: convertirFechaAPI(fechaInicio),
      fecha_fin: convertirFechaAPI(fechaFin)
    };

    // Agregar campos opcionales solo si tienen valores válidos
    if (descripcion && descripcion.trim()) {
      payload.descripcion = descripcion.trim();
    }
    
    if (lugarEvento && lugarEvento.trim()) {
      payload.lugar = lugarEvento.trim();
    }
    
    // Agregar cupo_maximo si se validó correctamente
    if (cupo !== null && cupo > 0) {
      payload.cupo_maximo = cupo;
      console.log(`✅ Cupo máximo incluido en payload: ${cupo} (tipo: ${typeof cupo})`);
    }

    console.log("📤 Creando evento:", payload);

    setCargandoEvento(true);
    try {
      await EventosService.crearEvento(payload);
      alert("✅ Evento creado exitosamente");
      
      // Limpiar formulario
      limpiarFormularioEvento();

      // Recargar lista de eventos
      cargarEventos();
    } catch (error) {
      console.error("❌ Error al crear evento:", error);
      alert(`❌ Error al crear evento: ${error.message}`);
    } finally {
      setCargandoEvento(false);
>>>>>>> 8f3ec67 (Administrador casi listo y proyecto al 70 %)
    }
  };

  // Limpiar formulario de creación de evento
  const limpiarFormularioEvento = () => {
    setNombreEvento("");
    setDescripcion("");
    setFechaInicio("");
    setFechaFin("");
    setLugarEvento("");
<<<<<<< HEAD
=======
    setCupoMaximo("");
>>>>>>> 8f3ec67 (Administrador casi listo y proyecto al 70 %)
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
          <main className="lg:col-span-3 space-y-6">
            {/* Sección 1: Crear Evento con Código QR (Administrador) */}
            <div className="bg-white rounded-lg border border-gray-200 p-8">
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  🎫 Crear Evento
                </h2>
                <p className="text-sm text-gray-600">
                  Crea un nuevo evento. Se generará automáticamente un código QR único para el control de asistencia.
                </p>
              </div>

              <form onSubmit={handleCrearEvento} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Nombre del Evento */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nombre del Evento <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={nombreEvento}
                      onChange={(e) => setNombreEvento(e.target.value)}
                      placeholder="Ej: Expo-software 2025"
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                      required
                    />
                  </div>

                  {/* Lugar del Evento */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
<<<<<<< HEAD
                      Lugar del Evento <span className="text-red-500">*</span>
=======
                      Lugar del Evento <span className="text-gray-500">(Opcional)</span>
>>>>>>> 8f3ec67 (Administrador casi listo y proyecto al 70 %)
                    </label>
                    <input
                      type="text"
                      value={lugarEvento}
                      onChange={(e) => setLugarEvento(e.target.value)}
                      placeholder="Ej: Auditorio Principal"
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
<<<<<<< HEAD
                      required
=======
                    />
                  </div>

                  {/* Cupo Máximo */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Cupo Máximo <span className="text-gray-500">(Opcional)</span>
                    </label>
                    <input
                      type="number"
                      value={cupoMaximo}
                      onChange={(e) => setCupoMaximo(e.target.value)}
                      placeholder="Ej: 100"
                      min="1"
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
>>>>>>> 8f3ec67 (Administrador casi listo y proyecto al 70 %)
                    />
                  </div>

                  {/* Fecha de Inicio */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Fecha de Inicio <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="datetime-local"
                      value={fechaInicio}
                      onChange={(e) => setFechaInicio(e.target.value)}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                      required
                    />
                  </div>

                  {/* Fecha de Fin */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Fecha de Fin <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="datetime-local"
                      value={fechaFin}
                      onChange={(e) => setFechaFin(e.target.value)}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                      required
                    />
                  </div>

                  {/* Descripción del Evento */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
<<<<<<< HEAD
                      Descripción <span className="text-red-500">*</span>
=======
                      Descripción <span className="text-gray-500">(Opcional)</span>
>>>>>>> 8f3ec67 (Administrador casi listo y proyecto al 70 %)
                    </label>
                    <textarea
                      value={descripcion}
                      onChange={(e) => setDescripcion(e.target.value)}
                      placeholder="Describe el evento..."
                      rows={3}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
<<<<<<< HEAD
                      required
=======
>>>>>>> 8f3ec67 (Administrador casi listo y proyecto al 70 %)
                    />
                  </div>
                </div>

                {/* Botón de creación */}
                <div className="flex gap-3">
                  <button
                    type="submit"
<<<<<<< HEAD
                    className="px-6 py-3 bg-teal-600 text-white rounded-lg font-semibold hover:bg-teal-700 transition shadow-md"
                  >
                    🎫 Crear Evento
=======
                    disabled={cargandoEvento}
                    className={`px-6 py-3 text-white rounded-lg font-semibold transition shadow-md ${
                      cargandoEvento
                        ? 'bg-gray-400 cursor-not-allowed'
                        : 'bg-teal-600 hover:bg-teal-700'
                    }`}
                  >
                    {cargandoEvento ? (
                      <span className="flex items-center gap-2">
                        <span className="animate-spin inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full"></span>
                        Creando...
                      </span>
                    ) : (
                      '🎫 Crear Evento'
                    )}
>>>>>>> 8f3ec67 (Administrador casi listo y proyecto al 70 %)
                  </button>
                </div>
              </form>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
