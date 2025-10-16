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
  PieChart,
  Pie,
  Cell,
} from "recharts";

// Main Dashboard Component
export default function TeacherDashboard() {
  const [selectedMateria, setSelectedMateria] = useState("Todas");
  const [selectedGrupo, setSelectedGrupo] = useState("Todos");

  // Datos para gráfica de barras
  const barChartData = [
    { name: "G1 (Software)", estudiantes: 45 },
    { name: "G2 (Redes)", estudiantes: 28 },
    { name: "G3 (IA)", estudiantes: 52 },
    { name: "G4 (SO)", estudiantes: 38 },
    { name: "G5 (BD)", estudiantes: 35 },
  ];

  // Datos para gráfica de dona/pie
  const donutChartData = [
    { name: "Aprobado", value: 15, color: "#10b981" },
    { name: "Pendiente", value: 90, color: "#fbbf24" },
    { name: "Rechazado", value: 5, color: "#ef4444" },
  ];

  const totalProyectos = donutChartData.reduce((sum, item) => sum + item.value, 0);

  const COLORS = ["#10b981", "#fbbf24", "#ef4444"];

  const estudiantesData = [
    { nombre: "Ana López", materia: "Ingeniería de Software", grupo: "G1", estado: "Activo" },
    { nombre: "Carlos Ruiz", materia: "Redes de Computadoras", grupo: "G2", estado: "Activo" },
    { nombre: "Elena Mendoza", materia: "Inteligencia Artificial", grupo: "G3", estado: "Inactivo" },
    { nombre: "Fernando Vargas", materia: "Sistemas Operativos", grupo: "G4", estado: "Activo" },
    { nombre: "Gabriela Díaz", materia: "Ingeniería de Software", grupo: "G1", estado: "Activo" },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
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
              <button className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-800 transition-colors">
                Registrar Asistencia
              </button>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <span className="text-green-600 font-bold text-lg">M</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          
          <aside className="lg:col-span-1">
            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <nav className="space-y-1">
                <Link
                  to="/teacher/dashboard"
                  className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors bg-green-50 text-green-700"
                >
                  <i className="pi pi-home text-base"></i>
                  Dashboard
                </Link>
                <Link
                  to="/teacher/proyectos"
                  className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors text-gray-700 hover:bg-gray-50"
                >
                  <i className="pi pi-book text-base"></i>
                  Proyectos Estudiantiles
                </Link>
                <Link
                  to="/teacher/profile"
                  className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors text-gray-700 hover:bg-gray-50"
                >
                  <i className="pi pi-cog text-base"></i>
                  Configuración
                </Link>
              </nav>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 p-4 mt-4">
              <div className="text-center">
                <h3 className="font-semibold text-gray-900">María</h3>
                <p className="text-sm text-gray-500">Profesora</p>
              </div>
            </div>
          </aside>

          <main className="lg:col-span-3">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Bienvenido, María</h2>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              {/* Gráfica de Barras - Estudiantes por Grupo */}
              <div className="bg-white rounded-lg border border-gray-200 p-6 flex flex-col">
                <h3 className="text-lg font-semibold text-gray-900 mb-6">
                  Estudiantes por Grupo y Materia
                </h3>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={barChartData}>
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

              {/* Gráfica de Dona - Resumen de Proyectos */}
              <div className="bg-white rounded-lg border border-gray-200 p-6 flex flex-col">
                <h3 className="text-lg font-semibold text-gray-900 mb-6">
                  Resumen de Proyectos Registrados
                </h3>
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={donutChartData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={90}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {donutChartData.map((entry, index) => (
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
                    <Legend 
                      verticalAlign="bottom" 
                      height={36}
                      iconType="circle"
                      wrapperStyle={{ fontSize: '12px' }}
                    />
                  </PieChart>
                </ResponsiveContainer>
                <div className="text-center mt-2">
                  <p className="text-2xl font-bold text-gray-900">{totalProyectos}</p>
                  <p className="text-xs text-gray-500">Total Proyectos</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Lista de Estudiantes</h3>
                
                <div className="flex items-center gap-3">
                  <select 
                    value={selectedMateria}
                    onChange={(e) => setSelectedMateria(e.target.value)}
                    className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                  >
                    <option value="Todas">Todas las materias</option>
                    <option value="Ingeniería de Software">Ingeniería de Software</option>
                    <option value="Redes de Computadoras">Redes de Computadoras</option>
                    <option value="Inteligencia Artificial">Inteligencia Artificial</option>
                  </select>
                  
                  <select 
                    value={selectedGrupo}
                    onChange={(e) => setSelectedGrupo(e.target.value)}
                    className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                  >
                    <option value="Todos">Todos los grupos</option>
                    <option value="G1">G1</option>
                    <option value="G2">G2</option>
                    <option value="G3">G3</option>
                    <option value="G4">G4</option>
                  </select>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Nombre</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Materia</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Grupo</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Estado</th>
                    </tr>
                  </thead>
                  <tbody>
                    {estudiantesData.map((estudiante, idx) => (
                      <tr key={idx} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                        <td className="py-3 px-4 text-sm text-gray-900">{estudiante.nombre}</td>
                        <td className="py-3 px-4 text-sm text-gray-600">{estudiante.materia}</td>
                        <td className="py-3 px-4 text-sm text-gray-600">{estudiante.grupo}</td>
                        <td className="py-3 px-4">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            estudiante.estado === "Activo" 
                              ? "bg-green-100 text-green-800" 
                              : "bg-gray-100 text-gray-800"
                          }`}>
                            {estudiante.estado}
                          </span>
                        </td>
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