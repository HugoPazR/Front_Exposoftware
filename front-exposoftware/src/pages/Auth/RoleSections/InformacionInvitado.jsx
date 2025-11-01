import { AlertCircle, CheckCircle } from "lucide-react";

function InformacionInvitado({
  formData,
  errors,
  handleChange,
  cargando,
  successFields,
  getInputClassName
}) {
  return (
    <>
      <div className="col-span-2 border-l-4 border-green-600 pl-2 mt-4 mb-2">
        <h2 className="text-lg font-semibold text-gray-700">Información Invitado</h2>
      </div>

      <div className="col-span-2">
        <label className="block font-medium text-gray-700 mb-1">Correo Personal *</label>
        <div className="relative">
          <input
            name="correo"
            type="email"
            placeholder="usuario@dominio.com"
            value={formData.correo}
            onChange={handleChange}
            disabled={cargando}
            className={getInputClassName("correo")}
          />
          {successFields.correo && !errors.correo && (
            <CheckCircle className="absolute right-3 top-3 text-green-500" size={20} />
          )}
        </div>
        {errors.correo && (
          <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
            <AlertCircle size={14} /> {errors.correo}
          </p>
        )}
      </div>

      <div>
        <label className="block font-medium text-gray-700 mb-1">
          Institución de Origen *
        </label>
        <div className="relative">
          <input
            name="intitucionOrigen"
            type="text"
            placeholder="Nombre de la institución"
            value={formData.intitucionOrigen}
            onChange={handleChange}
            disabled={cargando}
            className={getInputClassName("intitucionOrigen")}
          />
          {successFields.intitucionOrigen && !errors.intitucionOrigen && (
            <CheckCircle className="absolute right-3 top-3 text-green-500" size={20} />
          )}
        </div>
        {errors.intitucionOrigen && (
          <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
            <AlertCircle size={14} /> {errors.intitucionOrigen}
          </p>
        )}
      </div>

      <div>
        <label className="block font-medium text-gray-700 mb-1">Sector *</label>
        <select
          name="sector"
          value={formData.sector}
          onChange={handleChange}
          disabled={cargando}
          className={getInputClassName("sector")}
        >
          <option value="">Selecciona Sector</option>
          <option value="educativo">Educativo</option>
          <option value="empresarial">Empresarial</option>
          <option value="social">Social</option>
          <option value="gubernamental">Gubernamental</option>
          <option value="agricola">Agrícola</option>
        </select>
        {errors.sector && (
          <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
            <AlertCircle size={14} /> {errors.sector}
          </p>
        )}
      </div>

      <div>
        <label className="block font-medium text-gray-700 mb-1">Nombre de la Empresa *</label>
        <div className="relative">
          <input
            name="nombreEmpresa"
            type="text"
            placeholder="Nombre de la empresa"
            value={formData.nombreEmpresa}
            onChange={handleChange}
            disabled={cargando}
            className={getInputClassName("nombreEmpresa")}
          />
          {successFields.nombreEmpresa && !errors.nombreEmpresa && (
            <CheckCircle className="absolute right-3 top-3 text-green-500" size={20} />
          )}
        </div>
        {errors.nombreEmpresa && (
          <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
            <AlertCircle size={14} /> {errors.nombreEmpresa}
          </p>
        )}
      </div>
    </>
  );
}

export default InformacionInvitado;
