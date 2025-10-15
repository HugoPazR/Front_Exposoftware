import { useState } from "react";
import { Link } from "react-router-dom";
import logo from "../../assets/Logo-unicesar.png";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
  Area,
  AreaChart,
} from "recharts";

// Main Dashboard Component
export default function AdminDashboard() {
  // Datos para "Estudiantes Participantes por Materia"
  const estudiantesPorMateriaData = [
    { name: "Prog. Software", estudiantes: 45 },
    { name: "Móvil", estudiantes: 32 },
    { name: "Web", estudiantes: 28 },
    { name: "Prog. Básica", estudiantes: 52 },
  ];

  // Datos para "Tendencia de Visitantes" - ÁreaChart
  const visitantesData = [
    { mes: "Ene", visitantes: 850 },
    { mes: "Feb", visitantes: 1200 },
    { mes: "Mar", visitantes: 1050 },
    { mes: "Abr", visitantes: 1400 },
    { mes: "May", visitantes: 1800 },
    { mes: "Jun", visitantes: 1650 },
  ];

  // Datos para "Profesores por Departamento" - Stacked Bar
  const profesoresPorDepartamentoData = [
    { departamento: "Matemáticas", profesores: 25, profesoras: 18 },
    { departamento: "Ciencias", profesores: 30, profesoras: 25 },
    { departamento: "Humanidades", profesores: 20, profesoras: 22 },
    { departamento: "Artes", profesores: 15, profesoras: 20 },
  ];

  // Datos para "Proyectos Recientes"
  const proyectosRecientes = [
    { id: "PRJ001", nombre: "Sistema de Gestión de Aula Virtual", estado: "Activo", fecha: "2025-01-15", profesor: "Dr. Alejandro José Meriño" },
    { id: "PRJ002", nombre: "Investigación de IA", estado: "Completado", fecha: "2025-03-01", profesor: "Ing. Sofía Benítez" },
    { id: "PRJ003", nombre: "Diseño Curricular", estado: "Completado", fecha: "2022-11-20", profesor: "Lic. Carla Ruíz" },
  ];

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

            {/* User avatar and logout */}
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
          <aside className="lg:col-span-1">
            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <nav className="space-y-1">
                <Link
                  to="/admin/dashboard"
                  className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors bg-green-50 text-green-700"
                >
                  <i className="pi pi-home text-base"></i>
                  Dashboard
                </Link>
                <Link
                  to="/admin/crear-materia"
                  className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors text-gray-700 hover:bg-gray-50"
                >
                  <i className="pi pi-book text-base"></i>
                  Crear Materia
                </Link>
                <Link
                  to="/admin/crear-grupo"
                  className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors text-gray-700 hover:bg-gray-50"
                >
                  <i className="pi pi-users text-base"></i>
                  Crear Grupo
                </Link>
                <Link
                  to="/admin/profile"
                  className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors text-gray-700 hover:bg-gray-50"
                >
                  <i className="pi pi-cog text-base"></i>
                  Configuración de Perfil
                </Link>
              </nav>

            </div>

            <div className="bg-white rounded-lg border border-gray-200 p-4 mt-4">
              <div className="text-center">
                <h3 className="font-semibold text-gray-900">Administrador</h3>
                <p className="text-sm text-gray-500">Carlos Mendoza</p>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <main className="lg:col-span-3">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              {/* Card 1 - Total Proyectos Registrados */}
              <div className="bg-gradient-to-br from-green-50 to-white rounded-lg border border-gray-200 p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Total Proyectos Registrados</p>
                    <h3 className="text-3xl font-bold text-gray-900">50</h3>
                    <div className="flex items-center gap-1 mt-2">
                      <i className="pi pi-arrow-up text-xs text-green-600"></i>
                      <span className="text-xs text-green-600 font-medium">1,890 Proyectos Activos</span>
                    </div>
                  </div>
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                    <i className="pi pi-chart-line text-xl text-green-600"></i>
                  </div>
                </div>
              </div>

              {/* Card 2 - Visitantes */}
              <div className="bg-gradient-to-br from-blue-50 to-white rounded-lg border border-gray-200 p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Visitantes</p>
                    <h3 className="text-3xl font-bold text-gray-900">12,345</h3>
                    <div className="flex items-center gap-1 mt-2">
                      <span className="text-xs text-gray-500">+5% esta semana</span>
                    </div>
                  </div>
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <i className="pi pi-users text-xl text-blue-600"></i>
                  </div>
                </div>
              </div>

              {/* Card 3 - Profesores */}
              <div className="bg-gradient-to-br from-purple-50 to-white rounded-lg border border-gray-200 p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Profesores</p>
                    <h3 className="text-3xl font-bold text-gray-900">120</h3>
                    <div className="flex items-center gap-1 mt-2">
                      <span className="text-xs text-gray-500">Nuevos profesores: 5</span>
                    </div>
                  </div>
                  <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                    <i className="pi pi-user text-xl text-purple-600"></i>
                  </div>
                </div>
              </div>
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              {/* Estudiantes Participantes por Materia */}
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-6">
                  Estudiantes Participantes por Materia
                </h3>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={estudiantesPorMateriaData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis 
                      dataKey="name" 
                      tick={{ fontSize: 12 }}
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
                      dataKey="estudiantes" 
                      fill="#16a34a" 
                      radius={[8, 8, 0, 0]}
                      name="Estudiantes"
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Profesores por Departamento - Stacked */}
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-6">
                  Profesores por Departamento
                </h3>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={profesoresPorDepartamentoData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis 
                      dataKey="departamento" 
                      tick={{ fontSize: 12 }}
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
                    <Legend 
                      wrapperStyle={{ fontSize: '12px' }}
                      iconType="circle"
                    />
                    <Bar 
                      dataKey="profesores" 
                      stackId="a" 
                      fill="#16a34a" 
                      radius={[0, 0, 0, 0]}
                      name="Profesores"
                    />
                    <Bar 
                      dataKey="profesoras" 
                      stackId="a" 
                      fill="#4ade80" 
                      radius={[8, 8, 0, 0]}
                      name="Profesoras"
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Tendencia de Visitantes - Area Chart */}
            <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">
                Tendencia de Visitantes
              </h3>
              <ResponsiveContainer width="100%" height={200}>
                <AreaChart data={visitantesData}>
                  <defs>
                    <linearGradient id="colorVisitantes" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#16a34a" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#16a34a" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis 
                    dataKey="mes" 
                    tick={{ fontSize: 12 }}
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
                  <Area 
                    type="monotone" 
                    dataKey="visitantes" 
                    stroke="#16a34a" 
                    strokeWidth={2}
                    fillOpacity={1} 
                    fill="url(#colorVisitantes)"
                    name="Visitantes"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* Proyectos Recientes */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">
                Proyectos Recientes
              </h3>
              
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">ID Proyecto</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Nombre</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Estado</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Fecha de Inicio</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Profesor Asignado</th>
                    </tr>
                  </thead>
                  <tbody>
                    {proyectosRecientes.map((proyecto) => (
                      <tr key={proyecto.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                        <td className="py-3 px-4 text-sm text-gray-900 font-medium">{proyecto.id}</td>
                        <td className="py-3 px-4 text-sm text-gray-900">{proyecto.nombre}</td>
                        <td className="py-3 px-4">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            proyecto.estado === "Activo" 
                              ? "bg-green-100 text-green-800" 
                              : "bg-blue-100 text-blue-800"
                          }`}>
                            {proyecto.estado}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-sm text-gray-600">{proyecto.fecha}</td>
                        <td className="py-3 px-4 text-sm text-gray-600">{proyecto.profesor}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
