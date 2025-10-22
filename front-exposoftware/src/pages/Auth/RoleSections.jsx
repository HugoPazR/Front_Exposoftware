function RoleSections({ rol, formData, errors, handleChange }) {
  return (
    <>
      {/* ==== INFORMACIÓN ESTUDIANTE ==== */}
      {rol === "estudiante" && (
        <>
          <div className="col-span-2 border-l-4 border-green-600 pl-2 mt-4 mb-2">
            <h2 className="text-lg font-semibold text-gray-700">Información Estudiante</h2>
          </div>

          <div className="col-span-2">
            <label className="block font-medium text-gray-700">Correo Institucional</label>
            <input
              name="correo"
              type="email"
              value={formData.correo}
              onChange={handleChange}
              placeholder="usuario@unicesar.edu.co"
              className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-green-400 outline-none"
            />
            {errors.correo && <p className="text-red-500 text-sm mt-1">{errors.correo}</p>}
          </div>

          <div>
            <label className="block font-medium text-gray-700">Código del Programa</label>
            <input
              name="codigoPrograma"
              type="text"
              placeholder="Código del Programa"
              value={formData.codigoPrograma}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-green-400 outline-none"
            />
            {errors.codigoPrograma && <p className="text-red-500 text-sm mt-1">{errors.codigoPrograma}</p>}
          </div>

          <div>
            <label className="block font-medium text-gray-700">Semestre</label>
            <select
              name="semestre"
              value={formData.semestre}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-green-400 outline-none"
            >
              <option value="">Selecciona Semestre</option>
              {[...Array(10)].map((_, i) => (
                <option key={i + 1} value={i + 1}>
                  {i + 1}
                </option>
              ))}
              <option value="+10">+10</option>
            </select>
            {errors.semestre && <p className="text-red-500 text-sm mt-1">{errors.semestre}</p>}
          </div>

          <div>
            <label className="block font-medium text-gray-700">Año de Ingreso</label>
            <select
              name="fechaIngreso"
              value={formData.fechaIngreso}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-green-400 outline-none"
            >
              <option value="">Seleccione un año</option>
              {Array.from(
                { length: new Date().getFullYear() - 1976 + 1 },
                (_, i) => 1976 + i
              ).map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
            {errors.fechaIngreso && <p className="text-red-500 text-sm mt-1">{errors.fechaIngreso}</p>}
          </div>

          <div>
            <label className="block font-medium text-gray-700">Periodo</label>
            <select
              name="periodo" // agg variable Periodo
              value={formData.periodo}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-green-400 outline-none"
            >
              <option value="">Selecciona Periodo</option>
              <option value="1">1</option>
              <option value="2">2</option>
            </select>
            {errors.periodo && <p className="text-red-500 text-sm mt-1">{errors.periodo}</p>}
          </div>
        </>
      )}

      {/* ==== INFORMACIÓN INVITADO ==== */}
      {rol === "invitado" && (
        <>
          <div className="col-span-2 border-l-4 border-green-600 pl-2 mt-4 mb-2">
            <h2 className="text-lg font-semibold text-gray-700">Información Invitado</h2>
          </div>

          <div className="col-span-2">
            <label className="block font-medium text-gray-700">Correo Personal</label>
            <input
              name="correo"
              type="email"
              placeholder="usuario@dominio.com"
              value={formData.correo}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-green-400 outline-none"
            />
            {errors.correo && <p className="text-red-500 text-sm mt-1">{errors.correo}</p>}
          </div>

          <div>
            <label className="block font-medium text-gray-700">Sector</label>
            <select
              name="sector"
              value={formData.sector}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-green-400 outline-none"
            >
              <option value="">Selecciona Sector</option>
              <option value="agricola">Agrícola</option>
            </select>
            {errors.sector && <p className="text-red-500 text-sm mt-1">{errors.sector}</p>}
          </div>

          <div>
            <label className="block font-medium text-gray-700">Nombre de la Empresa</label>
            <input
              name="nombreEmpresa" type="text" placeholder="Nombre de la Empresa"value={formData.nombreEmpresa} onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-green-400 outline-none"
            />
            {errors.nombreEmpresa && <p className="text-red-500 text-sm mt-1">{errors.nombreEmpresa}</p>}
          </div>
        </>
      )}

      {/* ==== INFORMACIÓN EGRESADO ==== */}
      {rol === "egresado" && (
        <>
          <div className="col-span-2 border-l-4 border-green-600 pl-2 mt-4 mb-2">
            <h2 className="text-lg font-semibold text-gray-700">Información Egresado</h2>
          </div>

          <div className="col-span-2">
            <label className="block font-medium text-gray-700">Correo Institucional</label>
            <input
              name="correo"
              type="email"
              placeholder="usuario@unicesar.edu.co"
              value={formData.correo}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-green-400 outline-none"
            />
            {errors.correo && <p className="text-red-500 text-sm mt-1">{errors.correo}</p>}
          </div>

          <div>
            <label className="block font-medium text-gray-700">Titulado</label>
            <select
              name="titulado"
              value={formData.titulado}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-green-400 outline-none"
            >
              <option value="">Selecciona</option>
              <option value="si">Sí</option>
              <option value="no">No</option>
            </select>
            {errors.titulado && <p className="text-red-500 text-sm mt-1">{errors.titulado}</p>}
          </div>

          <div>
            <label className="block font-medium text-gray-700">Año de Finalizacion</label>
            <select
              name="fechaFinalizacion"
              value={formData.fechaFinalizacion}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-green-400 outline-none"
            >
              <option value="">Seleccione un año</option>
              {Array.from(
                { length: new Date().getFullYear() - 1976 + 1 },
                (_, i) => 1976 + i
              ).map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
            {errors.fechaFinalizacion && <p className="text-red-500 text-sm mt-1">{errors.fechaFinalizacion}</p>}
          </div>


          <div>
            <label className="block font-medium text-gray-700">Periodo</label>
            <select
              name="periodo" // agg variable Periodo
              value={formData.periodo}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-green-400 outline-none"
            >
              <option value="">Selecciona Periodo</option>
              <option value="1">1</option>
              <option value="2">2</option>
            </select>
            {errors.periodo && <p className="text-red-500 text-sm mt-1">{errors.periodo}</p>}
          </div>
        </>
      )}
    </>
  );
}

export default RoleSections;
