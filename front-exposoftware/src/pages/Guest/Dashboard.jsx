import { Link } from "react-router-dom";
import logo from "../../assets/Logo-unicesar.png";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

export default function GuestDashboard() {
  // Datos del invitado (simulados - vendrían del backend/Firebase)
  const invitadoData = {
    // Atributos propios de Invitado
    id_invitado: "INV-2025-001",
    id_usuario: "USR-2025-456", // FK a Usuarios
    id_sector: "empresarial", // educativo, empresarial, social, gobierno
    nombre_empresa: "Tech Solutions S.A.S",
    
    // Atributos heredados de Usuarios
    tipo_documento: "CC",
    identificacion: "1065987654",
    nombres: "Andrés Felipe",
    apellidos: "López Martínez",
    genero: "Masculino",
    identidad_sexual: "Heterosexual",
    fecha_nacimiento: "1990-05-15",
    direccion_residencia: "Calle 15 #23-45",
    ciudad_residencia: "Valledupar",
    departamento_residencia: "Cesar",
    pais: "Colombia",
    nacionalidad: "Colombiana",
    telefono: "+57 300 123 4567",
    correo: "andres.lopez@techsolutions.com",
    rol: "Invitado" // ⭐ ROL FUNDAMENTAL para identificar tipo de usuario
  };

  // Datos para gráficas - Proyectos Inscritos
  const proyectosPorMateria = [
    { name: "Ing. Software", proyectos: 18 },
    { name: "Desarrollo Web", proyectos: 12 },
    { name: "Móvil", proyectos: 9 },
    { name: "IA", proyectos: 7 },
    { name: "Redes", proyectos: 6 },
  ];

  // Datos para gráfica de dona - Estado de inscripciones
  const estadoInscripciones = [
    { name: "Confirmados", value: 32, color: "#10b981" },
    { name: "Pendientes", value: 15, color: "#fbbf24" },
    { name: "Visitados", value: 5, color: "#3b82f6" },
  ];

  const totalProyectos = estadoInscripciones.reduce((sum, item) => sum + item.value, 0);
  const COLORS = ["#10b981", "#fbbf24", "#3b82f6"];

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

            {/* User avatar and info */}
            <div className="flex items-center gap-4">
              <button className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-800 transition-colors">
                Registrar Asistencia
              </button>

              <div className="flex items-center gap-3">
                <span className="text-sm text-gray-700 hidden sm:block">
                  {invitadoData.nombres} {invitadoData.apellidos}
                </span>
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <span className="text-green-600 font-bold text-lg">
                    {invitadoData.nombres.charAt(0)}{invitadoData.apellidos.charAt(0)}
                  </span>
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
                <Link
                  to="/guest/dashboard"
                  className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors bg-green-50 text-green-700"
                >
                  <i className="pi pi-home text-base"></i>
                  Dashboard
                </Link>
                <Link
                  to="/guest/proyectos"
                  className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors text-gray-700 hover:bg-gray-50"
                >
                  <i className="pi pi-book text-base"></i>
                  Ver Proyectos
                </Link>
                <Link
                  to="/guest/profile"
                  className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors text-gray-700 hover:bg-gray-50"
                >
                  <i className="pi pi-cog text-base"></i>
                  Configuración
                </Link>
              </nav>
            </div>

            {/* User Info */}
            <div className="bg-white rounded-lg border border-gray-200 p-4 mt-4">
              <div className="text-center mb-4">
                <div className="w-16 h-16 bg-gradient-to-br from-green-100 to-green-200 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-green-700 font-bold text-2xl">
                    {invitadoData.nombres.charAt(0)}{invitadoData.apellidos.charAt(0)}
                  </span>
                </div>
                <h3 className="font-semibold text-gray-900">
                  {invitadoData.nombres} {invitadoData.apellidos}
                </h3>
                <p className="text-sm text-green-600 font-medium mt-1 flex items-center justify-center gap-1">
                  <i className="pi pi-user"></i>
                  {invitadoData.rol}
                </p>
              </div>
              
              <div className="border-t border-gray-100 pt-3 space-y-2">
                <div className="flex items-start gap-2">
                  <i className="pi pi-building text-green-600 text-sm mt-0.5"></i>
                  <div className="flex-1">
                    <p className="text-xs text-gray-500">Empresa/Institución</p>
                    <p className="text-sm text-gray-900 font-medium">{invitadoData.nombre_empresa}</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-2">
                  <i className="pi pi-tag text-green-600 text-sm mt-0.5"></i>
                  <div className="flex-1">
                    <p className="text-xs text-gray-500">Sector</p>
                    <p className="text-sm text-gray-900 font-medium capitalize">{invitadoData.id_sector}</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-2">
                  <i className="pi pi-envelope text-green-600 text-sm mt-0.5"></i>
                  <div className="flex-1">
                    <p className="text-xs text-gray-500">Correo</p>
                    <p className="text-sm text-gray-900 font-medium break-all">{invitadoData.correo}</p>
                  </div>
                </div>

                <div className="flex items-start gap-2">
                  <i className="pi pi-id-card text-green-600 text-sm mt-0.5"></i>
                  <div className="flex-1">
                    <p className="text-xs text-gray-500">ID Invitado</p>
                    <p className="text-sm text-gray-900 font-medium">{invitadoData.id_invitado}</p>
                  </div>
                </div>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <main className="lg:col-span-3">
            
            {/* Welcome Section */}
            <div className="bg-gradient-to-r from-green-600 to-green-700 rounded-lg p-6 mb-6 text-white">
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-2xl font-bold">
                  ¡Bienvenido, {invitadoData.nombres}!
                </h2>
                <span className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-semibold">
                  👤 {invitadoData.rol}
                </span>
              </div>
              <p className="text-green-50 mb-2">
                Explora los increíbles proyectos de nuestros estudiantes en Expo-software 2025
              </p>
              <div className="flex items-center gap-4 mt-4 text-sm">
                <div className="flex items-center gap-2">
                  <i className="pi pi-building"></i>
                  <span>{invitadoData.nombre_empresa}</span>
                </div>
                <div className="flex items-center gap-2">
                  <i className="pi pi-tag"></i>
                  <span className="capitalize">Sector {invitadoData.id_sector}</span>
                </div>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              {/* Card 1 */}
              <div className="bg-white rounded-lg border border-gray-200 p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Proyectos Disponibles</p>
                    <h3 className="text-2xl font-bold text-gray-900">52</h3>
                  </div>
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                    <i className="pi pi-briefcase text-green-600"></i>
                  </div>
                </div>
              </div>

              {/* Card 2 */}
              <div className="bg-white rounded-lg border border-gray-200 p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Mis Inscripciones</p>
                    <h3 className="text-2xl font-bold text-gray-900">{totalProyectos}</h3>
                  </div>
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                    <i className="pi pi-bookmark text-green-600"></i>
                  </div>
                </div>
              </div>

              {/* Card 3 */}
              <div className="bg-white rounded-lg border border-gray-200 p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Materias</p>
                    <h3 className="text-2xl font-bold text-gray-900">5</h3>
                  </div>
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                    <i className="pi pi-tags text-green-600"></i>
                  </div>
                </div>
              </div>
            </div>

            {/* Gráficas */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              {/* Gráfica de Proyectos por Materia */}
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-6">
                  Proyectos Inscritos por Materia
                </h3>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={proyectosPorMateria}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis 
                      dataKey="name" 
                      tick={{ fontSize: 11 }}
                      stroke="#6b7280"
                    />
                    <YAxis 
                      tick={{ fontSize: 12 }}
                      stroke="#6b7280"
                    />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#fff',
                        border: '1px solid #e5e7eb',
                        borderRadius: '8px',
                        fontSize: '12px'
                      }}
                    />
                    <Bar 
                      dataKey="proyectos" 
                      fill="#16a34a" 
                      radius={[8, 8, 0, 0]}
                      name="Proyectos"
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Gráfica de Estado de Inscripciones */}
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-6">
                  Estado de Inscripciones
                </h3>
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={estadoInscripciones}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={90}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {estadoInscripciones.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#fff',
                        border: '1px solid #e5e7eb',
                        borderRadius: '8px',
                        fontSize: '12px'
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
                <div className="grid grid-cols-1 gap-2 mt-4">
                  {estadoInscripciones.map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div 
                          className="w-3 h-3 rounded-full" 
                          style={{ backgroundColor: item.color }}
                        />
                        <span className="text-sm text-gray-700">{item.name}</span>
                      </div>
                      <span className="text-sm font-semibold text-gray-900">{item.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Información del Evento */}
            <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-1">
                    XXI Jornada de Investigación
                  </h3>
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <i className="pi pi-calendar"></i>
                    Evento: 25-27 de Noviembre de 2025
                  </div>
                </div>
                <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-semibold">
                  Activo
                </span>
              </div>

              <div className="border-t border-gray-100 pt-4 mb-4">
                <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                  <i className="pi pi-info-circle text-green-600"></i>
                  Acerca del Evento
                </h4>
                <p className="text-sm text-gray-600 leading-relaxed">
                  Exposoftware 2025 es el evento más importante de innovación y tecnología de la Universidad Popular del Cesar. 
                  Durante tres días, estudiantes presentarán sus proyectos innovadores de desarrollo de software, investigación y 
                  aplicaciones tecnológicas. Como invitado, podrás explorar todos los proyectos, inscribirte a presentaciones 
                  específicas y conectar con talento emergente en tecnología.
                </p>
              </div>

              <div className="border-t border-gray-100 pt-4 mb-4">
                <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <i className="pi pi-bookmark text-green-600"></i>
                  Información Útil
                </h4>
                <div className="space-y-2">
                  <a href="#" className="block text-sm text-green-600 hover:text-green-700 hover:underline">
                    → Programa del Evento
                  </a>
                  <a href="#" className="block text-sm text-green-600 hover:text-green-700 hover:underline">
                    → Mapa de Ubicación
                  </a>
                  <a href="#" className="block text-sm text-green-600 hover:text-green-700 hover:underline">
                    → Preguntas Frecuentes
                  </a>
                  <a href="#" className="block text-sm text-green-600 hover:text-green-700 hover:underline">
                    → Contacto y Soporte
                  </a>
                </div>
              </div>

              <div className="border-t border-gray-100 pt-4 mb-4">
                <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <i className="pi pi-calendar-plus text-green-600"></i>
                  Fechas Clave
                </h4>
                <div className="space-y-3">
                  <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                    <div className="w-12 h-12 bg-green-100 rounded-lg flex flex-col items-center justify-center flex-shrink-0">
                      <span className="text-xs text-green-600 font-semibold">NOV</span>
                      <span className="text-lg font-bold text-green-700">25</span>
                    </div>
                    <div className="flex-1">
                      <h5 className="font-semibold text-gray-900 text-sm">Inauguración</h5>
                      <p className="text-xs text-gray-600">9:00 AM - Auditorio Principal</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex flex-col items-center justify-center flex-shrink-0">
                      <span className="text-xs text-blue-600 font-semibold">NOV</span>
                      <span className="text-lg font-bold text-blue-700">26</span>
                    </div>
                    <div className="flex-1">
                      <h5 className="font-semibold text-gray-900 text-sm">Presentaciones Principales</h5>
                      <p className="text-xs text-gray-600">8:00 AM - 6:00 PM - Diversos auditorios</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                    <div className="w-12 h-12 bg-purple-100 rounded-lg flex flex-col items-center justify-center flex-shrink-0">
                      <span className="text-xs text-purple-600 font-semibold">NOV</span>
                      <span className="text-lg font-bold text-purple-700">27</span>
                    </div>
                    <div className="flex-1">
                      <h5 className="font-semibold text-gray-900 text-sm">Premiación y Clausura</h5>
                      <p className="text-xs text-gray-600">4:00 PM - Auditorio Principal</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </main>
        </div>
      </div>
    </div>
  );
}