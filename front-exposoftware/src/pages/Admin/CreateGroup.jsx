import { useState } from "react";
import { Link } from "react-router-dom";
import logo from "../../assets/Logo-unicesar.png";

// Mock data de profesores
const PROFESORES_MOCK = [
  { id: 1, nombre: "Dr. Alejandro José Meriño", departamento: "Ingeniería de Software" },
  { id: 2, nombre: "Ing. Sofía Benítez", departamento: "Redes de Computadoras" },
  { id: 3, nombre: "Lic. Carla Ruíz", departamento: "Inteligencia Artificial" },
  { id: 4, nombre: "Dr. Fernando Vargas", departamento: "Sistemas Operativos" },
  { id: 5, nombre: "Ing. María González", departamento: "Bases de Datos" },
  { id: 6, nombre: "Dr. Juan Pérez", departamento: "Desarrollo Web" },
];

export default function CreateGroup() {
  const [nombreGrupo, setNombreGrupo] = useState("");
  const [profesorSeleccionado, setProfesorSeleccionado] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!nombreGrupo || !profesorSeleccionado) {
      alert("Por favor complete todos los campos");
      return;
    }

    // Aquí iría la lógica para enviar al backend
    console.log({
      nombreGrupo,
      profesorId: profesorSeleccionado
    });

    alert("Grupo creado exitosamente");
    
    // Limpiar formulario
    setNombreGrupo("");
    setProfesorSeleccionado("");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header - Igual al dashboard */}
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
                  to="/admin/dash"
                  className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors text-gray-700 hover:bg-gray-50"
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
                  className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors bg-green-50 text-green-700"
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
            <div className="bg-white rounded-lg border border-gray-200 p-8">
              {/* Título y descripción */}
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Crear Nuevo Grupo
                </h2>
                <p className="text-sm text-gray-600">
                  Ingresa los detalles para crear un nuevo grupo y asignarle un profesor.
                </p>
              </div>

              {/* Formulario */}
              <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
                {/* Nombre del Grupo */}
                <div>
                  <label 
                    htmlFor="nombreGrupo" 
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Nombre del Grupo
                  </label>
                  <input
                    type="text"
                    id="nombreGrupo"
                    value={nombreGrupo}
                    onChange={(e) => setNombreGrupo(e.target.value)}
                    placeholder="Escribe el nombre del grupo"
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                    required
                  />
                </div>

                {/* Asignar Profesor */}
                <div>
                  <label 
                    htmlFor="profesor" 
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Asignar Profesor
                  </label>
                  <select
                    id="profesor"
                    value={profesorSeleccionado}
                    onChange={(e) => setProfesorSeleccionado(e.target.value)}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all appearance-none bg-white cursor-pointer"
                    required
                  >
                    <option value="">Selecciona un profesor</option>
                    {PROFESORES_MOCK.map((profesor) => (
                      <option key={profesor.id} value={profesor.id}>
                        {profesor.nombre} - {profesor.departamento}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Botón de envío */}
                <div className="pt-4">
                  <button
                    type="submit"
                    className="w-full bg-green-600 text-white px-6 py-3 rounded-lg text-sm font-semibold hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-all shadow-md hover:shadow-lg"
                  >
                    Crear Grupo
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
