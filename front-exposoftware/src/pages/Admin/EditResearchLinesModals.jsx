/**
 * Modal para editar Línea de Investigación
 */
export function EditLineaModal({ 
  show, 
  onSave, 
  onCancel,
  codigoLinea,
  setCodigoLinea,
  nombreLinea,
  setNombreLinea
}) {
  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-xl font-bold text-gray-900">Editar Línea de Investigación</h3>
        </div>
        
        <form onSubmit={onSave} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Código de Línea <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={codigoLinea}
                onChange={(e) => setCodigoLinea(e.target.value)}
                placeholder="Ej: LI-001"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nombre de la Línea <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={nombreLinea}
                onChange={(e) => setNombreLinea(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition"
                required
              />
            </div>
          </div>

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

/**
 * Modal para editar Sublínea
 */
export function EditSublineaModal({ 
  show, 
  onSave, 
  onCancel,
  codigoSublinea,
  setCodigoSublinea,
  nombreSublinea,
  setNombreSublinea,
  idLineaParaSublinea,
  setIdLineaParaSublinea,
  lineas
}) {
  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-xl font-bold text-gray-900">Editar Sublínea</h3>
        </div>
        
        <form onSubmit={onSave} className="p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Línea de Investigación <span className="text-red-500">*</span>
            </label>
            <select
              value={idLineaParaSublinea}
              onChange={(e) => setIdLineaParaSublinea(e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition"
              required
            >
              <option value="">Selecciona una línea</option>
              {lineas.map((linea) => (
                <option key={linea.id} value={linea.id}>
                  {linea.codigo_linea} - {linea.nombre_linea}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Código de Sublínea <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={codigoSublinea}
                onChange={(e) => setCodigoSublinea(e.target.value)}
                placeholder="Ej: SL-001"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nombre de la Sublínea <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={nombreSublinea}
                onChange={(e) => setNombreSublinea(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition"
                required
              />
            </div>
          </div>

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

/**
 * Modal para editar Área Temática
 */
export function EditAreaModal({ 
  show, 
  onSave, 
  onCancel,
  codigoArea,
  setCodigoArea,
  nombreArea,
  setNombreArea,
  idSublineaParaArea,
  setIdSublineaParaArea,
  sublineas,
  getLineaNombre
}) {
  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-xl font-bold text-gray-900">Editar Área Temática</h3>
        </div>
        
        <form onSubmit={onSave} className="p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Sublínea <span className="text-red-500">*</span>
            </label>
            <select
              value={idSublineaParaArea}
              onChange={(e) => setIdSublineaParaArea(e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition"
              required
            >
              <option value="">Selecciona una sublínea</option>
              {sublineas.map((sublinea) => (
                <option key={sublinea.id} value={sublinea.id}>
                  {sublinea.codigo_sublinea} - {sublinea.nombre_sublinea} ({getLineaNombre(sublinea.id_linea)})
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Código de Área <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={codigoArea}
                onChange={(e) => setCodigoArea(e.target.value)}
                placeholder="Ej: AT-001"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nombre del Área Temática <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={nombreArea}
                onChange={(e) => setNombreArea(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition"
                required
              />
            </div>
          </div>

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
