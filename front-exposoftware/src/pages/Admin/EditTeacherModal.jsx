import { 
  TIPOS_DOCUMENTO,
  GENEROS,
  CATEGORIAS_DOCENTE
} from "./useTeacherManagement";

/**
 * Modal para editar información de un profesor
 * @param {Object} props - Propiedades del componente
 * @param {boolean} props.show - Controla la visibilidad del modal
 * @param {Function} props.onSave - Función que se ejecuta al guardar (recibe el evento del formulario)
 * @param {Function} props.onCancel - Función que se ejecuta al cancelar
 * @param {Object} props.formData - Datos del formulario
 * @param {Function} props.setFormData - Funciones para actualizar los campos del formulario
 */
export default function EditTeacherModal({
  show,
  onSave,
  onCancel,
  // Estados del formulario
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
  telefono,
  setTelefono,
  correo,
  setCorreo,
  contraseña,
  setContraseña,
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
      <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200 bg-green-600">
          <h3 className="text-xl font-bold text-white">Editar Profesor</h3>
        </div>

        <form onSubmit={onSave} className="p-6 space-y-6">
          {/* Información Personal */}
          <div>
            <h4 className="text-lg font-semibold text-gray-900 mb-4">Información Personal</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Tipo de Documento */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tipo de Documento
                </label>
                <select
                  value={tipoDocumento}
                  onChange={(e) => setTipoDocumento(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-green-500 bg-white"
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-green-500"
                  required
                />
              </div>

              {/* Nombres */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nombres
                </label>
                <input
                  type="text"
                  value={nombres}
                  onChange={(e) => setNombres(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-green-500"
                  required
                />
              </div>

              {/* Apellidos */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Apellidos
                </label>
                <input
                  type="text"
                  value={apellidos}
                  onChange={(e) => setApellidos(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-green-500"
                  required
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-green-500 bg-white"
                  required
                >
                  <option value="">Seleccionar</option>
                  {GENEROS.map((gen) => (
                    <option key={gen} value={gen}>{gen}</option>
                  ))}
                </select>
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-green-500"
                  required
                />
              </div>
            </div>
          </div>

          {/* Información del Docente */}
          <div className="border-t pt-4">
            <h4 className="text-lg font-semibold text-gray-900 mb-4">Información del Docente</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Correo */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Correo
                </label>
                <input
                  type="email"
                  value={correo}
                  onChange={(e) => setCorreo(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-green-500"
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-green-500"
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-green-500 bg-white"
                  required
                >
                  <option value="">Seleccionar</option>
                  {CATEGORIAS_DOCENTE.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              {/* Código Programa */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Código Programa
                </label>
                <input
                  type="text"
                  value={codigoPrograma}
                  onChange={(e) => setCodigoPrograma(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-green-500"
                  required
                />
              </div>

              {/* Estado Activo */}
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="activoModal"
                  checked={activo}
                  onChange={(e) => setActivo(e.target.checked)}
                  className="w-4 h-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
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
              className="px-6 py-2.5 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 transition"
            >
              💾 Guardar Cambios
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
