import { Link } from "react-router-dom";
import logo from "../../assets/Logo-unicesar.png";
import AdminSidebar from "../../components/Layout/AdminSidebar";
import { useSubjectManagement, CICLOS_SEMESTRALES } from "./useSubjectManagement";

export default function CreateSubject() {
  // Obtener todas las funcionalidades del custom hook
  const {
    // Estados del formulario
    codigoMateria,
    setCodigoMateria,
    nombreMateria,
    setNombreMateria,
    cicloSemestral,
    setCicloSemestral,
    
    // Estados de grupos
    gruposDisponibles,
    gruposSeleccionados,
    
    // Estados de materias
    materiasFiltradas,
    materias,
    
    // Estados de edición
    showEditModal,
    
    // Estado de búsqueda
    searchTerm,
    setSearchTerm,
    
    // Funciones auxiliares
    getDocenteNombre,
    agregarGrupoSeleccionado,
    eliminarGrupoSeleccionado,
    
    // Funciones CRUD
    handleSubmit,
    handleEdit,
    handleSaveEdit,
    handleCancelEdit,
    handleDelete,
    handleCancel,
  } = useSubjectManagement();

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
          
          {/* Sidebar Component */}
          <AdminSidebar userName="Carlos Mendoza" userRole="Administrador" />

          {/* Main Content */}
          <main className="lg:col-span-3 space-y-6">
            {/* Formulario de Crear Materia */}
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
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Código de la Materia */}
                  <div>
                    <label 
                      htmlFor="codigoMateria" 
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Código de la Materia <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="codigoMateria"
                      value={codigoMateria}
                      onChange={(e) => setCodigoMateria(e.target.value)}
                      placeholder="Ej: PROG3, BD2, IA1"
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all uppercase"
                      required
                    />
                  </div>

                  {/* Ciclo Semestral */}
                  <div>
                    <label 
                      htmlFor="cicloSemestral" 
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Ciclo Semestral <span className="text-red-500">*</span>
                    </label>
                    <select
                      id="cicloSemestral"
                      value={cicloSemestral}
                      onChange={(e) => setCicloSemestral(e.target.value)}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all appearance-none bg-white cursor-pointer"
                      required
                    >
                      <option value="">Seleccione un ciclo</option>
                      {CICLOS_SEMESTRALES.map((ciclo) => (
                        <option key={ciclo} value={ciclo}>
                          {ciclo}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Nombre de la Materia */}
                <div>
                  <label 
                    htmlFor="nombreMateria" 
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Nombre de la Materia <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="nombreMateria"
                    value={nombreMateria}
                    onChange={(e) => setNombreMateria(e.target.value)}
                    placeholder="Ingrese el nombre completo de la materia"
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                    required
                  />
                </div>

                {/* Asignar Grupos */}
                <div className="border-t pt-6">
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Asignar Grupos a la Materia <span className="text-red-500">*</span>
                  </label>
                  <p className="text-xs text-gray-500 mb-4">
                    Selecciona un grupo de la lista. El docente asignado se mostrará automáticamente.
                  </p>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {/* Selector de Grupos */}
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-2">
                        Grupos Disponibles
                      </label>
                      <select
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500 bg-white mb-2"
                        onChange={(e) => {
                          if (e.target.value) {
                            agregarGrupoSeleccionado(e.target.value);
                            e.target.value = "";
                          }
                        }}
                      >
                        <option value="">Seleccionar grupo...</option>
                        {gruposDisponibles
                          .filter(g => !gruposSeleccionados.find(gs => gs.codigo_grupo === g.codigo_grupo))
                          .map((grupo) => (
                            <option key={grupo.id} value={grupo.codigo_grupo}>
                              Grupo {grupo.codigo_grupo} - {getDocenteNombre(grupo.id_docente)}
                            </option>
                          ))
                        }
                      </select>
                    </div>

                    {/* Grupos Seleccionados */}
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-2">
                        Grupos Asignados ({gruposSeleccionados.length})
                      </label>
                      <div className="border border-gray-300 rounded-lg p-3 bg-gray-50 min-h-[120px] max-h-[200px] overflow-y-auto">
                        {gruposSeleccionados.length === 0 ? (
                          <p className="text-xs text-gray-400 text-center py-4">
                            No hay grupos asignados
                          </p>
                        ) : (
                          <div className="space-y-2">
                            {gruposSeleccionados.map((grupo) => (
                              <div 
                                key={grupo.codigo_grupo} 
                                className="flex items-center justify-between bg-white p-2 rounded-lg border border-gray-200 hover:border-green-300 transition-colors"
                              >
                                <div className="flex-1">
                                  <div className="flex items-center gap-2">
                                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-bold bg-green-100 text-green-800">
                                      {grupo.codigo_grupo}
                                    </span>
                                    <span className="text-xs text-gray-600">
                                      {getDocenteNombre(grupo.id_docente)}
                                    </span>
                                  </div>
                                </div>
                                <button
                                  type="button"
                                  onClick={() => eliminarGrupoSeleccionado(grupo.codigo_grupo)}
                                  className="p-1 text-red-600 hover:bg-red-50 rounded transition-colors"
                                  title="Quitar grupo"
                                >
                                  <i className="pi pi-times text-xs"></i>
                                </button>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
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

            {/* Lista de Materias */}
            <div className="bg-white rounded-lg border border-gray-200 p-8">
              {/* Header de la lista */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-1">
                      Lista de Materias
                    </h2>
                    <p className="text-sm text-gray-600">
                      Total de materias registradas: <span className="font-semibold text-green-600">{materias.length}</span>
                    </p>
                  </div>
                </div>

                {/* Buscador */}
                <div className="relative">
                  <i className="pi pi-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
                  <input
                    type="text"
                    placeholder="Buscar materia por nombre o grupo..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Tabla de materias */}
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Código
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Nombre de la Materia
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Ciclo Semestral
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Grupos
                      </th>
                      <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Acciones
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {materiasFiltradas.length === 0 ? (
                      <tr>
                        <td colSpan="5" className="px-6 py-8 text-center">
                          <div className="flex flex-col items-center justify-center">
                            <i className="pi pi-inbox text-4xl text-gray-300 mb-3"></i>
                            <p className="text-gray-500 text-sm">
                              {searchTerm ? "No se encontraron materias con ese criterio de búsqueda" : "No hay materias registradas"}
                            </p>
                          </div>
                        </td>
                      </tr>
                    ) : (
                      materiasFiltradas.map((materia) => (
                        <tr key={materia.id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-bold bg-green-100 text-green-800">
                              {materia.codigo_materia}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-sm font-medium text-gray-900">{materia.nombre_materia}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                              {materia.ciclo_semestral}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex flex-wrap gap-1">
                              {materia.grupos_con_docentes.map((grupo, idx) => (
                                <div key={idx} className="group relative">
                                  <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-blue-100 text-blue-800 cursor-help">
                                    Grupo {grupo.codigo_grupo}
                                  </span>
                                  {/* Tooltip con nombre del docente */}
                                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
                                    {getDocenteNombre(grupo.id_docente)}
                                    <div className="absolute top-full left-1/2 transform -translate-x-1/2 -mt-1">
                                      <div className="border-4 border-transparent border-t-gray-900"></div>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                            <div className="flex items-center justify-center gap-2">
                              <button
                                onClick={() => handleEdit(materia)}
                                className="inline-flex items-center px-3 py-1.5 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors text-xs font-medium"
                                title="Editar materia"
                              >
                                <i className="pi pi-pencil mr-1.5"></i>
                                Editar
                              </button>
                              <button
                                onClick={() => handleDelete(materia.id)}
                                className="inline-flex items-center px-3 py-1.5 border border-red-600 text-red-600 rounded-lg hover:bg-red-50 transition-colors text-xs font-medium"
                                title="Eliminar materia"
                              >
                                <i className="pi pi-trash mr-1.5"></i>
                                Eliminar
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </main>
        </div>
      </div>

      {/* Modal de Edición */}
      {showEditModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl">
            {/* Header del modal */}
            <div className="bg-green-600 px-6 py-4 rounded-t-lg flex items-center justify-between">
              <h3 className="text-xl font-bold text-white">Editar Materia</h3>
              <button 
                onClick={handleCancelEdit}
                className="text-white hover:text-gray-200 transition-colors"
              >
                <i className="pi pi-times text-xl"></i>
              </button>
            </div>

            {/* Contenido del modal */}
            <form onSubmit={handleSaveEdit} className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
              <p className="text-sm text-gray-600">
                Modifique los campos necesarios y guarde los cambios.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Código de la Materia */}
                <div>
                  <label 
                    htmlFor="editCodigoMateria" 
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Código de la Materia <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="editCodigoMateria"
                    value={codigoMateria}
                    onChange={(e) => setCodigoMateria(e.target.value)}
                    placeholder="Ej: PROG3, BD2, IA1"
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all uppercase"
                    required
                  />
                </div>

                {/* Ciclo Semestral */}
                <div>
                  <label 
                    htmlFor="editCicloSemestral" 
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Ciclo Semestral <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="editCicloSemestral"
                    value={cicloSemestral}
                    onChange={(e) => setCicloSemestral(e.target.value)}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all appearance-none bg-white cursor-pointer"
                    required
                  >
                    <option value="">Seleccione un ciclo</option>
                    {CICLOS_SEMESTRALES.map((ciclo) => (
                      <option key={ciclo} value={ciclo}>
                        {ciclo}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Nombre de la Materia */}
              <div>
                <label 
                  htmlFor="editNombreMateria" 
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Nombre de la Materia <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="editNombreMateria"
                  value={nombreMateria}
                  onChange={(e) => setNombreMateria(e.target.value)}
                  placeholder="Ingrese el nombre completo de la materia"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                  required
                />
              </div>

              {/* Asignar Grupos */}
              <div className="border-t pt-6">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Asignar Grupos a la Materia <span className="text-red-500">*</span>
                </label>
                <p className="text-xs text-gray-500 mb-4">
                  Selecciona un grupo de la lista. El docente asignado se mostrará automáticamente.
                </p>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {/* Selector de Grupos */}
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-2">
                      Grupos Disponibles
                    </label>
                    <select
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500 bg-white mb-2"
                      onChange={(e) => {
                        if (e.target.value) {
                          agregarGrupoSeleccionado(e.target.value);
                          e.target.value = "";
                        }
                      }}
                    >
                      <option value="">Seleccionar grupo...</option>
                      {gruposDisponibles
                        .filter(g => !gruposSeleccionados.find(gs => gs.codigo_grupo === g.codigo_grupo))
                        .map((grupo) => (
                          <option key={grupo.id} value={grupo.codigo_grupo}>
                            Grupo {grupo.codigo_grupo} - {getDocenteNombre(grupo.id_docente)}
                          </option>
                        ))
                      }
                    </select>
                  </div>

                  {/* Grupos Seleccionados */}
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-2">
                      Grupos Asignados ({gruposSeleccionados.length})
                    </label>
                    <div className="border border-gray-300 rounded-lg p-3 bg-gray-50 min-h-[120px] max-h-[200px] overflow-y-auto">
                      {gruposSeleccionados.length === 0 ? (
                        <p className="text-xs text-gray-400 text-center py-4">
                          No hay grupos asignados
                        </p>
                      ) : (
                        <div className="space-y-2">
                          {gruposSeleccionados.map((grupo) => (
                            <div 
                              key={grupo.codigo_grupo} 
                              className="flex items-center justify-between bg-white p-2 rounded-lg border border-gray-200 hover:border-green-300 transition-colors"
                            >
                              <div className="flex-1">
                                <div className="flex items-center gap-2">
                                  <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-bold bg-green-100 text-green-800">
                                    {grupo.codigo_grupo}
                                  </span>
                                  <span className="text-xs text-gray-600">
                                    {getDocenteNombre(grupo.id_docente)}
                                  </span>
                                </div>
                              </div>
                              <button
                                type="button"
                                onClick={() => eliminarGrupoSeleccionado(grupo.codigo_grupo)}
                                className="p-1 text-red-600 hover:bg-red-50 rounded transition-colors"
                                title="Quitar grupo"
                              >
                                <i className="pi pi-times text-xs"></i>
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Botones de acción del modal */}
              <div className="flex gap-3 pt-4 sticky bottom-0 bg-white">
                <button
                  type="button"
                  onClick={handleCancelEdit}
                  className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg text-sm font-semibold hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-all"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-green-600 text-white px-6 py-3 rounded-lg text-sm font-semibold hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-all shadow-md hover:shadow-lg"
                >
                  Guardar Cambios
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
