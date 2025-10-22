import { Link } from "react-router-dom";
import logo from "../../assets/Logo-unicesar.png";
import AdminSidebar from "../../components/Layout/AdminSidebar";
import { 
  useTeacherManagement,
  TIPOS_DOCUMENTO,
  GENEROS,
  IDENTIDADES_SEXUALES,
  CATEGORIAS_DOCENTE
} from "./useTeacherManagement";
import EditTeacherModal from "./EditTeacherModal";

export default function CreateTeacher() {

  const {
 
    tipoDocumento,
    setTipoDocumento,
    identificacion,
    setIdentificacion,
    nombres,
    setNombres,
    apellidos,
    setApellidos,
    genero,
    setGenero,
    identidadSexual,
    setIdentidadSexual,
    fechaNacimiento,
    setFechaNacimiento,
    direccion,
    setDireccion,
    pais,
    setPais,
    ciudad,
    setCiudad,
    telefono,
    setTelefono,
    correo,
    setCorreo,
    contraseña,
    setContraseña,
    // Estados del formulario - Docente
    categoriaDocente,
    setCategoriaDocente,
    codigoPrograma,
    setCodigoPrograma,
    activo,
    setActivo,
    // Estados de la lista y UI
    profesores,
    searchTerm,
    setSearchTerm,
    profesoresFiltrados,
    // Estados de edición
    isEditing,
    showEditModal,
    // Funciones
    handleSubmit,
    handleEdit,
    handleSaveEdit,
    handleCancelEdit,
    handleDelete,
    handleCancel,
  } = useTeacherManagement();

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

          {/* Sidebar Component */}
          <AdminSidebar userName="Carlos Mendoza" userRole="Administrador" />

          {/* Main Content */}
          <main className="lg:col-span-3">
            <div className="bg-white rounded-lg border border-gray-200 p-8">
              {/* Título y descripción */}
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Registrar Nuevo Profesor
                </h2>
                <p className="text-sm text-gray-600">
                  Complete los siguientes campos para registrar un nuevo docente en el sistema.
                </p>
              </div>

              {/* Formulario */}
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Información Personal */}
                <div className="border-b pb-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Información Personal</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Tipo de Documento */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Tipo de Documento <span className="text-red-500">*</span>
                      </label>
                      <select
                        value={tipoDocumento}
                        onChange={(e) => setTipoDocumento(e.target.value)}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500 bg-white"
                        required
                      >
                        <option value="">Seleccionar tipo</option>
                        {TIPOS_DOCUMENTO.map((tipo) => (
                          <option key={tipo} value={tipo}>{tipo}</option>
                        ))}
                      </select>
                    </div>

                    {/* Identificación */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Número de Identificación <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={identificacion}
                        onChange={(e) => setIdentificacion(e.target.value)}
                        placeholder="Ej: 1023456789"
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                        required
                      />
                    </div>

                    {/* Nombres */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Nombres <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={nombres}
                        onChange={(e) => setNombres(e.target.value)}
                        placeholder="Ej: María José"
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                        required
                      />
                    </div>

                    {/* Apellidos */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Apellidos <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={apellidos}
                        onChange={(e) => setApellidos(e.target.value)}
                        placeholder="Ej: Pérez García"
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                        required
                      />
                    </div>

                    {/* Género */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Género <span className="text-red-500">*</span>
                      </label>
                      <select
                        value={genero}
                        onChange={(e) => setGenero(e.target.value)}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500 bg-white"
                        required
                      >
                        <option value="">Seleccionar género</option>
                        {GENEROS.map((gen) => (
                          <option key={gen} value={gen}>{gen}</option>
                        ))}
                      </select>
                    </div>

                    {/* Identidad Sexual */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Identidad Sexual
                      </label>
                      <select
                        value={identidadSexual}
                        onChange={(e) => setIdentidadSexual(e.target.value)}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500 bg-white"
                      >
                        <option value="">Seleccionar</option>
                        {IDENTIDADES_SEXUALES.map((id) => (
                          <option key={id} value={id}>{id}</option>
                        ))}
                      </select>
                    </div>

                    {/* Fecha de Nacimiento */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Fecha de Nacimiento
                      </label>
                      <input
                        type="date"
                        value={fechaNacimiento}
                        onChange={(e) => setFechaNacimiento(e.target.value)}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                      />
                    </div>

                    {/* Teléfono */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Teléfono <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="tel"
                        value={telefono}
                        onChange={(e) => setTelefono(e.target.value)}
                        placeholder="Ej: +573001234567"
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Información de Ubicación */}
                <div className="border-b pb-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Información de Ubicación</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Dirección */}
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Dirección
                      </label>
                      <input
                        type="text"
                        value={direccion}
                        onChange={(e) => setDireccion(e.target.value)}
                        placeholder="Ej: Calle 50 #30-20"
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                      />
                    </div>

                    {/* País */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        País
                      </label>
                      <input
                        type="text"
                        value={pais}
                        onChange={(e) => setPais(e.target.value)}
                        placeholder="Ej: Colombia"
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                      />
                    </div>

                    {/* Ciudad */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Ciudad
                      </label>
                      <input
                        type="text"
                        value={ciudad}
                        onChange={(e) => setCiudad(e.target.value)}
                        placeholder="Ej: Valledupar"
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                      />
                    </div>
                  </div>
                </div>

                {/* Información del Docente */}
                <div className="border-b pb-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Información del Docente</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Correo Institucional */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Correo Institucional <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="email"
                        value={correo}
                        onChange={(e) => setCorreo(e.target.value)}
                        placeholder="usuario@unicesar.edu.co"
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                        required
                      />
                    </div>

                    {/* Contraseña */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Contraseña {!isEditing && <span className="text-red-500">*</span>}
                      </label>
                      <input
                        type="password"
                        value={contraseña}
                        onChange={(e) => setContraseña(e.target.value)}
                        placeholder={isEditing ? "Dejar vacío para no cambiar" : "Contraseña"}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                        required={!isEditing}
                      />
                    </div>

                    {/* Categoría Docente */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Categoría Docente <span className="text-red-500">*</span>
                      </label>
                      <select
                        value={categoriaDocente}
                        onChange={(e) => setCategoriaDocente(e.target.value)}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500 bg-white"
                        required
                      >
                        <option value="">Seleccionar categoría</option>
                        {CATEGORIAS_DOCENTE.map((cat) => (
                          <option key={cat} value={cat}>{cat}</option>
                        ))}
                      </select>
                    </div>

                    {/* Código del Programa */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Código del Programa <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={codigoPrograma}
                        onChange={(e) => setCodigoPrograma(e.target.value)}
                        placeholder="Ej: ING01"
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                        required
                      />
                    </div>

                    {/* Estado Activo */}
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="activo"
                        checked={activo}
                        onChange={(e) => setActivo(e.target.checked)}
                        className="w-4 h-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                      />
                      <label htmlFor="activo" className="ml-2 block text-sm text-gray-700">
                        Docente Activo
                      </label>
                    </div>
                  </div>
                </div>

                {/* Botones */}
                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg text-sm font-semibold hover:bg-gray-50 transition-all"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="flex-1 bg-green-600 text-white px-6 py-3 rounded-lg text-sm font-semibold hover:bg-green-700 transition-all shadow-md hover:shadow-lg"
                  >
                    Registrar Profesor
                  </button>
                </div>
              </form>
            </div>

            {/* Tabla de Profesores Registrados */}
            <div className="bg-white rounded-lg border border-gray-200 p-8 mt-6">
              <div className="mb-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-1">
                      Profesores Registrados
                    </h2>
                    <p className="text-sm text-gray-600">
                      Total: <span className="font-semibold text-green-600">{profesores.length}</span> profesores
                    </p>
                  </div>
                </div>

                {/* Barra de búsqueda */}
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Buscar por nombre, identificación, correo o programa..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                  <i className="pi pi-search absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"></i>
                </div>
              </div>

              {/* Tabla */}
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Identificación
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Nombre Completo
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Correo
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Categoría
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Programa
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Estado
                      </th>
                      <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Acciones
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {profesoresFiltrados.length === 0 ? (
                      <tr>
                        <td colSpan="7" className="px-6 py-12 text-center text-gray-500">
                          <i className="pi pi-inbox text-4xl mb-3 block"></i>
                          <p className="text-sm">No se encontraron profesores</p>
                        </td>
                      </tr>
                    ) : (
                      profesoresFiltrados.map((profesor) => (
                        <tr key={profesor.id} className="hover:bg-gray-50 transition">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="text-sm font-medium text-gray-900">
                              {profesor.usuario.identificacion}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">
                              {profesor.usuario.nombres} {profesor.usuario.apellidos}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-sm text-gray-600">{profesor.usuario.correo}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                              {profesor.categoria_docente}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                              {profesor.codigo_programa}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              profesor.activo 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-red-100 text-red-800'
                            }`}>
                              {profesor.activo ? 'Activo' : 'Inactivo'}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-center">
                            <div className="flex items-center justify-center gap-2">
                              <button
                                onClick={() => handleEdit(profesor)}
                                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                                title="Editar"
                              >
                                <i className="pi pi-pencil"></i>
                              </button>
                              <button
                                onClick={() => handleDelete(profesor.id)}
                                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                                title="Eliminar"
                              >
                                <i className="pi pi-trash"></i>
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

      {/* Modal de Edición - Componente Separado */}
      <EditTeacherModal
        show={showEditModal}
        onSave={handleSaveEdit}
        onCancel={handleCancelEdit}
        // Estados del formulario
        tipoDocumento={tipoDocumento}
        setTipoDocumento={setTipoDocumento}
        identificacion={identificacion}
        setIdentificacion={setIdentificacion}
        nombres={nombres}
        setNombres={setNombres}
        apellidos={apellidos}
        setApellidos={setApellidos}
        genero={genero}
        setGenero={setGenero}
        telefono={telefono}
        setTelefono={setTelefono}
        correo={correo}
        setCorreo={setCorreo}
        contraseña={contraseña}
        setContraseña={setContraseña}
        categoriaDocente={categoriaDocente}
        setCategoriaDocente={setCategoriaDocente}
        codigoPrograma={codigoPrograma}
        setCodigoPrograma={setCodigoPrograma}
        activo={activo}
        setActivo={setActivo}
      />
    </div>
  );
}
