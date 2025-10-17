import { useState } from "react";
import { Link } from "react-router-dom";
import logo from "../../assets/Logo-unicesar.png";

// Mock data de grupos
const GRUPOS_MOCK = [
  { id: 1, nombre: "Grupo A - Ingeniería de Software", profesor: "Dr. Alejandro José Meriño" },
  { id: 2, nombre: "Grupo B - Desarrollo Web", profesor: "Dr. Juan Pérez" },
  { id: 3, nombre: "Grupo C - Bases de Datos", profesor: "Ing. María González" },
  { id: 4, nombre: "Grupo D - Inteligencia Artificial", profesor: "Lic. Carla Ruíz" },
  { id: 5, nombre: "Grupo E - Redes de Computadoras", profesor: "Ing. Sofía Benítez" },
];

export default function CreateSubject() {
  const [nombreMateria, setNombreMateria] = useState("");
  const [grupoSeleccionado, setGrupoSeleccionado] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!nombreMateria || !grupoSeleccionado) {
      alert("Por favor complete todos los campos");
      return;
    }

    // Aquí iría la lógica para enviar al backend
    console.log({
      nombreMateria,
      grupoId: grupoSeleccionado
    });

    alert("Materia creada exitosamente");
    
    // Limpiar formulario
    setNombreMateria("");
    setGrupoSeleccionado("");
  };

  const handleCancel = () => {
    setNombreMateria("");
    setGrupoSeleccionado("");
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
                  className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors bg-green-50 text-green-700"
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
            <div className="bg-white rounded-lg border border-gray-200 p-8">
              {/* Título y descripción */}
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Crear Nueva Materia
                </h2>
                <p className="text-sm text-gray-600">
                  Complete los siguientes campos para añadir una nueva materia al sistema.
                </p>
              </div>

              {/* Formulario */}
              <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
                {/* Nombre de la Materia */}
                <div>
                  <label 
                    htmlFor="nombreMateria" 
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Nombre de la Materia
                  </label>
                  <input
                    type="text"
                    id="nombreMateria"
                    value={nombreMateria}
                    onChange={(e) => setNombreMateria(e.target.value)}
                    placeholder="Ingrese el nombre de la materia"
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                    required
                  />
                </div>

                {/* Asignar Grupo */}
                <div>
                  <label 
                    htmlFor="grupo" 
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Asignar Grupo
                  </label>
                  <select
                    id="grupo"
                    value={grupoSeleccionado}
                    onChange={(e) => setGrupoSeleccionado(e.target.value)}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all appearance-none bg-white cursor-pointer"
                    required
                  >
                    <option value="">Seleccione un grupo</option>
                    {GRUPOS_MOCK.map((grupo) => (
                      <option key={grupo.id} value={grupo.id}>
                        {grupo.nombre}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Botones de acción */}
                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg text-sm font-semibold hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-all"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="flex-1 bg-green-600 text-white px-6 py-3 rounded-lg text-sm font-semibold hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-all shadow-md hover:shadow-lg"
                  >
                    Crear Materia
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
