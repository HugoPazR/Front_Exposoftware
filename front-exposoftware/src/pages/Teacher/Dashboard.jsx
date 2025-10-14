import { useState } from "react";
import { Link } from "react-router-dom";
import logo from "../../assets/Logo-unicesar.png";

// BarChart Component
function BarChart({ data, height = 200 }) {
  if (!data || data.length === 0) return null;

  const maxValue = Math.max(...data.map(d => d.value));

  return (
    <div className="w-full">
      <div className="flex items-end justify-between gap-3 px-4" style={{ height: `${height}px` }}>
        {data.map((item, idx) => {
          const barHeight = (item.value / maxValue) * (height - 40);
          return (
            <div key={idx} className="flex flex-col items-center justify-end flex-1 h-full">
              <div className="relative group flex flex-col items-center justify-end h-full w-full">
                <span className="text-xs font-semibold text-gray-700 mb-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  {item.value}
                </span>
                
                <div
                  className="bg-green-600 rounded-t w-full transition-all hover:bg-green-700 relative"
                  style={{ height: `${barHeight}px`, minHeight: '20px' }}
                >
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-xs font-bold text-white">{item.value}</span>
                  </div>
                </div>
              </div>
              
              <span className="text-xs text-gray-600 mt-2 text-center leading-tight">
                {item.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// DonutChart Component
function DonutChart({ data, total }) {
  if (!data || data.length === 0) return null;

  let cumulativePercent = 0;

  const getCoordinatesForPercent = (percent) => {
    const x = Math.cos(2 * Math.PI * percent);
    const y = Math.sin(2 * Math.PI * percent);
    return [x, y];
  };

  const slices = data.map((item) => {
    const [startX, startY] = getCoordinatesForPercent(cumulativePercent);
    cumulativePercent += item.value / total;
    const [endX, endY] = getCoordinatesForPercent(cumulativePercent);
    const largeArcFlag = item.value / total > 0.5 ? 1 : 0;

    const pathData = [
      `M ${startX} ${startY}`,
      `A 1 1 0 ${largeArcFlag} 1 ${endX} ${endY}`,
      `L 0 0`,
    ].join(' ');

    return { ...item, pathData, percentage: ((item.value / total) * 100).toFixed(1) };
  });

  return (
    <div className="flex flex-col items-center w-full">
      <div className="relative flex items-center justify-center" style={{ width: '220px', height: '220px' }}>
        <svg viewBox="-1 -1 2 2" style={{ transform: 'rotate(-90deg)' }} className="w-full h-full">
          {slices.map((slice, idx) => (
            <path 
              key={idx} 
              d={slice.pathData} 
              fill={slice.color}
              className="transition-opacity hover:opacity-80 cursor-pointer"
            />
          ))}
          <circle cx="0" cy="0" r="0.6" fill="white" />
        </svg>
        
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <p className="text-2xl font-bold text-gray-900">{total}</p>
            <p className="text-xs text-gray-500">Proyectos</p>
          </div>
        </div>
      </div>
      
      <div className="flex flex-col gap-2 mt-6 w-full">
        {data.map((item, idx) => (
          <div key={idx} className="flex items-center justify-between px-4">
            <div className="flex items-center gap-2">
              <div 
                className="w-3 h-3 rounded-full flex-shrink-0" 
                style={{ backgroundColor: item.color }} 
              />
              <span className="text-sm text-gray-700">{item.label}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-gray-900">{item.value}</span>
              <span className="text-xs text-gray-500">({slices[idx].percentage}%)</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Main Dashboard Component
export default function TeacherDashboard() {
  const [selectedMateria, setSelectedMateria] = useState("Todas");
  const [selectedGrupo, setSelectedGrupo] = useState("Todos");

  const barChartData = [
    { label: "G1 (Software)", value: 45 },
    { label: "G2 (Redes)", value: 28 },
    { label: "G3 (IA)", value: 52 },
    { label: "G4 (SO)", value: 38 },
    { label: "G5 (BD)", value: 35 },
  ];

  const donutChartData = [
    { label: "Aprobado", value: 15, color: "#10b981" },
    { label: "Pendiente", value: 90, color: "#fbbf24" },
    { label: "Rechazado", value: 5, color: "#ef4444" },
  ];

  const totalProyectos = donutChartData.reduce((sum, item) => sum + item.value, 0);

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
              <div className="bg-white rounded-lg border border-gray-200 p-6 flex flex-col">
                <h3 className="text-lg font-semibold text-gray-900 mb-6">
                  Estudiantes por Grupo y Materia
                </h3>
                <div className="flex-1 flex items-center">
                  <BarChart data={barChartData} height={240} />
                </div>
              </div>

              <div className="bg-white rounded-lg border border-gray-200 p-6 flex flex-col">
                <h3 className="text-lg font-semibold text-gray-900 mb-6">
                  Resumen de Proyectos Registrados
                </h3>
                <div className="flex-1 flex items-center justify-center">
                  <DonutChart data={donutChartData} total={totalProyectos} />
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