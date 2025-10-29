import Select from 'react-select';
import { 
  TIPOS_DOCUMENTO,
  GENEROS,
  IDENTIDADES_SEXUALES,
  CATEGORIAS_DOCENTE,
  DEPARTAMENTOS_COLOMBIA,
  PAISES
} from "./useTeacherManagement";

/**
 * Modal para editar información de un profesor
 * @param {Object} props - Propiedades del componente
 * @param {boolean} props.show - Controla la visibilidad del modal
 * @param {Function} props.onSave - Función que se ejecuta al guardar (recibe el evento del formulario)
 * @param {Function} props.onCancel - Función que se ejecuta al cancelar
 * @param {Array} props.ciudadesResidencia - Lista de ciudades dinámicas según departamento
 * @param {Array} props.municipios - Lista de municipios dinámicos según departamento
 * @param {Object} props.formData - Datos del formulario
 * @param {Function} props.setFormData - Funciones para actualizar los campos del formulario
 */
export default function EditTeacherModal({
  show,
  onSave,
  onCancel,
  // Listas dinámicas
  municipios,
  opcionesPaises,
  // Estados del formulario - Usuario
  tipoDocumento,
  setTipoDocumento,
  identificacion,
  setIdentificacion,
  // Nombres y apellidos separados
  primerNombre,
  setPrimerNombre,
  segundoNombre,
  setSegundoNombre,
  primerApellido,
  setPrimerApellido,
  segundoApellido,
  setSegundoApellido,
  genero,
  setGenero,
  identidadSexual,
  setIdentidadSexual,
  fechaNacimiento,
  setFechaNacimiento,
  nacionalidad,
  setNacionalidad,
  pais,
  setPais,
  departamento,
  setDepartamento,
  municipio,
  setMunicipio,
  ciudadResidencia,
  setCiudadResidencia,
  direccionResidencia,
  setDireccionResidencia,
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
}) {
  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-xl max-w-7xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200 bg-teal-600">
          <h3 className="text-xl font-bold text-white">Editar Profesor</h3>
        </div>

        <form onSubmit={onSave} className="p-6 space-y-6">
          {/* Información Personal */}
          <div>
            <h4 className="text-lg font-semibold text-gray-900 mb-4">Información Personal</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {/* Tipo de Documento */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tipo de Documento
                </label>
                <select
                  value={tipoDocumento}
                  onChange={(e) => setTipoDocumento(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-teal-500 bg-white"
                  required
                >
                  <option value="">Seleccionar</option>
                  {TIPOS_DOCUMENTO.map((tipo) => (
                    <option key={tipo} value={tipo}>{tipo}</option>
                  ))}
                </select>
              </div>

              {/* Identificación */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Identificación
                </label>
                <input
                  type="text"
                  value={identificacion}
                  onChange={(e) => setIdentificacion(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-teal-500"
                  required
                />
              </div>

              {/* Primer Nombre */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Primer Nombre <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={primerNombre}
                  onChange={(e) => setPrimerNombre(e.target.value)}
                  maxLength={15}
                  placeholder="Ej: María"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-teal-500"
                  required
                />
              </div>

              {/* Segundo Nombre */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Segundo Nombre
                </label>
                <input
                  type="text"
                  value={segundoNombre}
                  onChange={(e) => setSegundoNombre(e.target.value)}
                  maxLength={15}
                  placeholder="Ej: José"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-teal-500"
                />
              </div>

              {/* Primer Apellido */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Primer Apellido <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={primerApellido}
                  onChange={(e) => setPrimerApellido(e.target.value)}
                  maxLength={15}
                  placeholder="Ej: Pérez"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-teal-500"
                  required
                />
              </div>

              {/* Segundo Apellido */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Segundo Apellido
                </label>
                <input
                  type="text"
                  value={segundoApellido}
                  onChange={(e) => setSegundoApellido(e.target.value)}
                  maxLength={15}
                  placeholder="Ej: García"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-teal-500"
                />
              </div>

              {/* Género */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Género
                </label>
                <select
                  value={genero}
                  onChange={(e) => setGenero(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-teal-500 bg-white"
                  required
                >
                  <option value="">Seleccionar</option>
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-teal-500 bg-white"
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-teal-500"
                />
              </div>

              {/* Teléfono */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Teléfono
                </label>
                <input
                  type="tel"
                  value={telefono}
                  onChange={(e) => setTelefono(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-teal-500"
                  required
                />
              </div>
            </div>
          </div>

          {/* Información de Ubicación y Residencia */}
          <div className="border-t pt-4">
            <h4 className="text-lg font-semibold text-gray-900 mb-4">Información de Ubicación y Residencia</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {/* País - Select dinámico */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  País de Residencia
                </label>
                <Select
                  name="pais"
                  options={opcionesPaises}
                  placeholder="Selecciona País de Residencia"
                  value={
                    pais
                      ? opcionesPaises.find(
                          (option) => option.value === pais
                        )
                      : null
                  }
                  onChange={(option) => setPais(option ? option.value : "")}
                  classNamePrefix="react-select"
                  styles={{
                    control: (base) => ({
                      ...base,
                      borderColor: "#d1d5db",
                      borderRadius: "0.5rem",
                      padding: "2px",
                      "&:hover": { borderColor: "#16a34a" },
                      boxShadow: "0 0 0 1px #d1d5db",
                    }),
                  }}
                />
              </div>

              {/* País de Nacimiento - Select dinámico */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  País de Nacimiento
                </label>
                <Select
                  name="nacionalidad"
                  options={opcionesPaises}
                  placeholder="Selecciona País de Nacimiento"
                  value={
                    nacionalidad
                      ? opcionesPaises.find(
                          (option) => option.value === nacionalidad
                        )
                      : null
                  }
                  onChange={(option) => setNacionalidad(option ? option.value : "")}
                  classNamePrefix="react-select"
                  styles={{
                    control: (base) => ({
                      ...base,
                      borderColor: "#d1d5db",
                      borderRadius: "0.5rem",
                      padding: "2px",
                      "&:hover": { borderColor: "#16a34a" },
                      boxShadow: "0 0 0 1px #d1d5db",
                    }),
                  }}
                />
              </div>

              {/* Departamento */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Departamento
                </label>
                <select
                  value={departamento}
                  onChange={(e) => setDepartamento(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-teal-500 bg-white"
                >
                  <option value="">Seleccionar</option>
                  {DEPARTAMENTOS_COLOMBIA.map((dept) => (
                    <option key={dept} value={dept}>{dept}</option>
                  ))}
                </select>
              </div>

              {/* Municipio - Select dinámico */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Municipio
                </label>
                <select
                  value={municipio}
                  onChange={(e) => setMunicipio(e.target.value)}
                  disabled={!departamento}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-teal-500 bg-white disabled:bg-gray-100"
                >
                  <option value="">Seleccionar municipio</option>
                  {municipios.map((mun) => (
                    <option key={mun} value={mun}>{mun}</option>
                  ))}
                </select>
              </div>

              {/* Ciudad de Residencia - Select dinámico */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Ciudad de Residencia
                </label>
                <input
                  type="text"
                  value={ciudadResidencia}
                  onChange={(e) => setCiudadResidencia(e.target.value)}
                  maxLength={50}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-teal-500"
                  placeholder="Nombre de la ciudad"
                />
              </div>

              {/* Dirección de Residencia */}
              <div className="md:col-span-2 lg:col-span-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Dirección de Residencia
                </label>
                <input
                  type="text"
                  value={direccionResidencia}
                  onChange={(e) => setDireccionResidencia(e.target.value)}
                  maxLength={50}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-teal-500"
                />
              </div>

            </div>
          </div>

          {/* Información del Docente */}
          <div className="border-t pt-4">
            <h4 className="text-lg font-semibold text-gray-900 mb-4">Información del Docente</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {/* Correo */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Correo
                </label>
                <input
                  type="email"
                  value={correo}
                  onChange={(e) => setCorreo(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-teal-500"
                  required
                />
              </div>

              {/* Nueva Contraseña */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nueva Contraseña (opcional)
                </label>
                <input
                  type="password"
                  value={contraseña}
                  onChange={(e) => setContraseña(e.target.value)}
                  placeholder="Dejar vacío para no cambiar"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-teal-500"
                />
              </div>

              {/* Categoría */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Categoría
                </label>
                <select
                  value={categoriaDocente}
                  onChange={(e) => setCategoriaDocente(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-teal-500 bg-white"
                  required
                >
                  <option value="">Seleccionar</option>
                  {CATEGORIAS_DOCENTE.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              {/* Código Programa - Solo para docentes Internos */}
              {categoriaDocente === "Interno" && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Código Programa
                  </label>
                  <input
                    type="text"
                    value={codigoPrograma}
                    onChange={(e) => setCodigoPrograma(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-teal-500"
                    required
                  />
                </div>
              )}

              {/* Estado Activo */}
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="activoModal"
                  checked={activo}
                  onChange={(e) => setActivo(e.target.checked)}
                  className="w-4 h-4 text-teal-600 focus:ring-teal-500 border-gray-300 rounded"
                />
                <label htmlFor="activoModal" className="ml-2 block text-sm text-gray-700">
                  Docente Activo
                </label>
              </div>
            </div>
          </div>

          {/* Botones del Modal */}
          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onCancel}
              className="px-6 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 text-sm font-medium text-white bg-teal-600 rounded-lg hover:bg-teal-700 transition"
            >
              💾 Guardar Cambios
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
