import React from "react";
import Select from 'react-select';

export default function GraduateProfileForm({ 
  formData, 
  isEditing, 
  opcionesPaises, 
  ciudadesResidencia, 
  municipios, 
  colombiaData,
  handleChange 
}) {
  return (
    <>
      {/* Información Personal */}
      <div className="border-b pb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <i className="pi pi-user text-green-600"></i>
          Información Personal
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Tipo de Documento */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tipo de Documento</label>
            <select 
              name="tipo_documento"
              value={formData.tipo_documento}
              onChange={handleChange}
              className={`w-full border border-gray-200 rounded-lg px-3 py-2 ${isEditing ? 'focus:outline-none focus:ring-2 focus:ring-green-500' : 'bg-gray-100'}`}
              disabled={!isEditing}
            >
              <option value="CC">Cédula de Ciudadanía</option>
              <option value="CE">Cédula de Extranjería</option>
              <option value="TI">Tarjeta de Identidad</option>
              <option value="PA">Pasaporte</option>
            </select>
          </div>

          {/* Identificación - NO EDITABLE */}
          <div>
            <label className="block text-sm font-medium mb-1">
              <span className="text-red-600">Identificación (No editable)</span>
            </label>
            <input 
              type="text"
              value={formData.identificacion}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 bg-gray-100 text-gray-500 cursor-not-allowed"
              disabled
            />
          </div>

          {/* Primer Nombre */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Primer Nombre <span className="text-red-500">*</span>
            </label>
            <input 
              type="text"
              name="primer_nombre"
              value={formData.primer_nombre}
              onChange={handleChange}
              className={`w-full border border-gray-200 rounded-lg px-3 py-2 ${isEditing ? 'focus:outline-none focus:ring-2 focus:ring-green-500' : 'bg-gray-100'}`}
              disabled={!isEditing}
            />
          </div>

          {/* Segundo Nombre */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Segundo Nombre</label>
            <input 
              type="text"
              name="segundo_nombre"
              value={formData.segundo_nombre}
              onChange={handleChange}
              className={`w-full border border-gray-200 rounded-lg px-3 py-2 ${isEditing ? 'focus:outline-none focus:ring-2 focus:ring-green-500' : 'bg-gray-100'}`}
              disabled={!isEditing}
              placeholder="Opcional"
            />
          </div>

          {/* Primer Apellido */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Primer Apellido <span className="text-red-500">*</span>
            </label>
            <input 
              type="text"
              name="primer_apellido"
              value={formData.primer_apellido}
              onChange={handleChange}
              className={`w-full border border-gray-200 rounded-lg px-3 py-2 ${isEditing ? 'focus:outline-none focus:ring-2 focus:ring-green-500' : 'bg-gray-100'}`}
              disabled={!isEditing}
            />
          </div>

          {/* Segundo Apellido */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Segundo Apellido</label>
            <input 
              type="text"
              name="segundo_apellido"
              value={formData.segundo_apellido}
              onChange={handleChange}
              className={`w-full border border-gray-200 rounded-lg px-3 py-2 ${isEditing ? 'focus:outline-none focus:ring-2 focus:ring-green-500' : 'bg-gray-100'}`}
              disabled={!isEditing}
              placeholder="Opcional"
            />
          </div>

            {/* Sexo */}
            <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Sexo</label>
            <select 
                name="sexo"
                value={formData.sexo}
                onChange={handleChange}
                className={`w-full border border-gray-200 rounded-lg px-3 py-2 ${isEditing ? 'focus:outline-none focus:ring-2 focus:ring-green-500' : 'bg-gray-100'}`}
                disabled={!isEditing}
            >
                <option value="">Seleccionar</option>
                <option value="Hombre">Hombre</option>
                <option value="Mujer">Mujer</option>
                <option value="Hermafrodita">Hermafrodita</option>
            </select>
            </div>

            {/* Identidad Sexual */}
            <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Identidad Sexual</label>
            <select
                name="identidad_sexual"
                value={formData.identidad_sexual}
                onChange={handleChange}
                className={`w-full border border-gray-200 rounded-lg px-3 py-2 ${isEditing ? 'focus:outline-none focus:ring-2 focus:ring-green-500' : 'bg-gray-100'}`}
                disabled={!isEditing}
            >
                <option value="">Seleccionar</option>
                <option value="heterosexual">Heterosexual</option>
                <option value="homosexual">Homosexual</option>
                <option value="bisexual">Bisexual</option>
                <option value="masculino">Masculino</option>
                <option value="femenino">Femenino</option>
                <option value="no binario">No binario</option>
                <option value="prefiero no decir">Prefiero no decir</option>
            </select>
            </div>

          {/* Fecha de Nacimiento */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Fecha de Nacimiento</label>
            <input 
              type="date"
              name="fecha_nacimiento"
              value={formData.fecha_nacimiento}
              onChange={handleChange}
              className={`w-full border border-gray-200 rounded-lg px-3 py-2 ${isEditing ? 'focus:outline-none focus:ring-2 focus:ring-green-500' : 'bg-gray-100'}`}
              disabled={!isEditing}
            />
          </div>

          {/* Teléfono */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Teléfono <span className="text-red-500">*</span>
            </label>
            <input 
              type="tel"
              name="telefono"
              value={formData.telefono}
              onChange={handleChange}
              className={`w-full border border-gray-200 rounded-lg px-3 py-2 ${isEditing ? 'focus:outline-none focus:ring-2 focus:ring-green-500' : 'bg-gray-100'}`}
              disabled={!isEditing}
            />
          </div>

          {/* Nacionalidad */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nacionalidad</label>
            {isEditing ? (
              <Select
                options={opcionesPaises}
                value={opcionesPaises.find(op => op.value === formData.nacionalidad) || null}
                onChange={(selectedOption) => handleChange({ 
                  target: { name: 'nacionalidad', value: selectedOption ? selectedOption.value : '' }
                })}
                isDisabled={!isEditing}
                placeholder="Seleccionar nacionalidad"
                className="text-sm"
              />
            ) : (
              <input 
                type="text"
                value={formData.nacionalidad}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 bg-gray-100"
                disabled
              />
            )}
          </div>
        </div>
      </div>

      {/* Información de Contacto */}
      <div className="border-b pb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <i className="pi pi-phone text-green-600"></i>
          Información de Contacto
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Correo Electrónico - NO EDITABLE */}
          <div>
            <label className="block text-sm font-medium mb-1">
              <span className="text-red-600">Correo Electrónico (No editable)</span>
            </label>
            <input 
              type="email"
              value={formData.correo}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 bg-gray-100 text-gray-500 cursor-not-allowed"
              disabled
            />
          </div>
        </div>
      </div>

      {/* Información de Ubicación */}
      <div className="border-b pb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <i className="pi pi-map-marker text-green-600"></i>
          Información de Ubicación
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* País de Residencia */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">País de Residencia</label>
            {isEditing ? (
              <Select
                options={opcionesPaises}
                value={opcionesPaises.find(op => op.value === formData.pais_residencia) || null}
                onChange={(selectedOption) => handleChange({ 
                  target: { name: 'pais_residencia', value: selectedOption ? selectedOption.value : '' }
                })}
                isDisabled={!isEditing}
                placeholder="Seleccionar país"
                className="text-sm"
              />
            ) : (
              <input 
                type="text"
                value={formData.pais_residencia}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 bg-gray-100"
                disabled
              />
            )}
          </div>

          {/* Departamento */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Departamento</label>
            <select
              name="departamento"
              value={formData.departamento}
              onChange={(e) => {
                handleChange(e);
                handleChange({ target: { name: 'municipio', value: '' } });
              }}
              className={`w-full border border-gray-200 rounded-lg px-3 py-2 ${isEditing ? 'focus:outline-none focus:ring-2 focus:ring-green-500' : 'bg-gray-100'}`}
              disabled={!isEditing}
            >
              <option value="">Seleccionar departamento</option>
              {colombiaData.map((dept) => (
                <option key={dept.departamento} value={dept.departamento}>
                  {dept.departamento}
                </option>
              ))}
            </select>
          </div>

          {/* Municipio */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Municipio/Ciudad</label>
            <select
              name="municipio"
              value={formData.municipio}
              onChange={handleChange}
              className={`w-full border border-gray-200 rounded-lg px-3 py-2 ${isEditing ? 'focus:outline-none focus:ring-2 focus:ring-green-500' : 'bg-gray-100'}`}
              disabled={!isEditing || !formData.departamento}
            >
              <option value="">
                {!formData.departamento 
                  ? 'Selecciona departamento primero' 
                  : 'Seleccionar municipio'}
              </option>
              {municipios.map((ciudad) => (
                <option key={ciudad} value={ciudad}>
                  {ciudad}
                </option>
              ))}
            </select>
          </div>

          {/* Dirección de Residencia */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Dirección de Residencia</label>
            <input 
              type="text"
              name="direccion_residencia"
              value={formData.direccion_residencia}
              onChange={handleChange}
              className={`w-full border border-gray-200 rounded-lg px-3 py-2 ${isEditing ? 'focus:outline-none focus:ring-2 focus:ring-green-500' : 'bg-gray-100'}`}
              disabled={!isEditing}
              placeholder="Ej: Calle 15 # 20-30"
            />
          </div>
        </div>
      </div>

      {/* Información Académica */}
      <div className="border-b pb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <i className="pi pi-graduation-cap text-green-600"></i>
          Información Académica
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Código de Programa */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Código de Programa</label>
            <input 
              type="text"
              name="codigo_programa"
              value={formData.codigo_programa}
              onChange={handleChange}
              className={`w-full border border-gray-200 rounded-lg px-3 py-2 ${isEditing ? 'focus:outline-none focus:ring-2 focus:ring-green-500' : 'bg-gray-100'}`}
              disabled={!isEditing}
              placeholder="Ej: ING-SIS-001"
            />
          </div>

          {/* Programa Académico */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Programa Académico</label>
            <input 
              type="text"
              name="programa_academico"
              value={formData.programa_academico}
              onChange={handleChange}
              className={`w-full border border-gray-200 rounded-lg px-3 py-2 ${isEditing ? 'focus:outline-none focus:ring-2 focus:ring-green-500' : 'bg-gray-100'}`}
              disabled={!isEditing}
              placeholder="Ej: Ingeniería de Sistemas"
            />
          </div>

          {/* Año de Graduación */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Año de Graduación</label>
            <input 
              type="number"
              name="anio_graduacion"
              value={formData.anio_graduacion}
              onChange={handleChange}
              className={`w-full border border-gray-200 rounded-lg px-3 py-2 ${isEditing ? 'focus:outline-none focus:ring-2 focus:ring-green-500' : 'bg-gray-100'}`}
              disabled={!isEditing}
              min="1900"
              max={new Date().getFullYear() + 5}
            />
          </div>

          {/* Título Obtenido */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Título Obtenido</label>
            <input 
              type="text"
              name="titulo_obtenido"
              value={formData.titulo_obtenido}
              onChange={handleChange}
              className={`w-full border border-gray-200 rounded-lg px-3 py-2 ${isEditing ? 'focus:outline-none focus:ring-2 focus:ring-green-500' : 'bg-gray-100'}`}
              disabled={!isEditing}
              placeholder="Ej: Ingeniero de Sistemas"
            />
          </div>

          {/* Titulado */}
          <div className="md:col-span-2">
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
              <input 
                type="checkbox"
                name="titulado"
                checked={formData.titulado}
                onChange={(e) => handleChange({ target: { name: 'titulado', value: e.target.checked } })}
                className="w-4 h-4 text-green-600 rounded focus:ring-green-500"
                disabled={!isEditing}
              />
              <span>Titulado (Grado completado)</span>
            </label>
          </div>
        </div>
      </div>
    </>
  );
}
