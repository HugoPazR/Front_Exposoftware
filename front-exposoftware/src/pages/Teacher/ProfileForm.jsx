import React from "react";
import Select from 'react-select';

export default function ProfileForm({ 
  profileData, 
  isEditing, 
  opcionesPaises, 
  ciudadesResidencia, 
  municipios, 
  colombiaData,
  handleInputChange 
}) {
  
  return (
    <>
      {/* Información Personal */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-6 pb-3 border-b border-gray-200 flex items-center gap-2">
          <span>📋</span> Información Personal
        </h3>

        <div className="flex flex-col md:flex-row gap-8 mb-6">
          {/* Avatar y botón de cambiar foto */}
          <div className="flex flex-col items-center md:items-start">
            <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center mb-4">
              <img 
                src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=400&auto=format&fit=crop" 
                alt="Avatar" 
                className="w-full h-full object-cover" 
              />
            </div>
            {isEditing && (
              <button className="inline-flex items-center px-4 py-2 border border-gray-300 text-gray-700 rounded-lg text-sm hover:bg-gray-50 transition-colors">
                Cambiar Foto
              </button>
            )}
          </div>
        </div>

        {/* Formulario de información - Grid 2 columnas */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Tipo de Documento */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tipo de Documento
            </label>
            <select
              value={profileData.tipo_documento}
              onChange={(e) => handleInputChange('tipo_documento', e.target.value)}
              className={`w-full border border-gray-300 rounded-lg px-4 py-2 ${
                isEditing ? 'focus:outline-none focus:ring-2 focus:ring-green-500' : 'bg-gray-50'
              }`}
              disabled={!isEditing}
            >
              <option value="CC">Cédula de Ciudadanía</option>
              <option value="CE">Cédula de Extranjería</option>
              <option value="PAS">Pasaporte</option>
              <option value="TI">Tarjeta de Identidad</option>
            </select>
          </div>

          {/* Identificación (Cédula) - NO EDITABLE */}
          <div>
            <label className="block text-sm font-medium mb-1">
              <span className="text-red-600">Identificación (No editable)</span>
            </label>
            <input
              type="text"
              value={profileData.identificacion}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 bg-gray-100 text-gray-500 cursor-not-allowed"
              disabled
            />
          </div>

          {/* Nombres */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nombres <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={profileData.nombres}
              onChange={(e) => handleInputChange('nombres', e.target.value)}
              className={`w-full border border-gray-300 rounded-lg px-4 py-2 ${
                isEditing ? 'focus:outline-none focus:ring-2 focus:ring-green-500' : 'bg-gray-50'
              }`}
              disabled={!isEditing}
            />
          </div>

          {/* Apellidos */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Apellidos <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={profileData.apellidos}
              onChange={(e) => handleInputChange('apellidos', e.target.value)}
              className={`w-full border border-gray-300 rounded-lg px-4 py-2 ${
                isEditing ? 'focus:outline-none focus:ring-2 focus:ring-green-500' : 'bg-gray-50'
              }`}
              disabled={!isEditing}
            />
          </div>

          {/* Género */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Género
            </label>
            <select
              value={profileData.genero}
              onChange={(e) => handleInputChange('genero', e.target.value)}
              className={`w-full border border-gray-300 rounded-lg px-4 py-2 ${
                isEditing ? 'focus:outline-none focus:ring-2 focus:ring-green-500' : 'bg-gray-50'
              }`}
              disabled={!isEditing}
            >
              <option value="">Seleccionar</option>
              <option value="Masculino">Masculino</option>
              <option value="Femenino">Femenino</option>
              <option value="Otro">Otro</option>
            </select>
          </div>

          {/* Identidad Sexual */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Identidad Sexual
            </label>
            <select
              value={profileData.identidad_sexual}
              onChange={(e) => handleInputChange('identidad_sexual', e.target.value)}
              className={`w-full border border-gray-300 rounded-lg px-4 py-2 ${
                isEditing ? 'focus:outline-none focus:ring-2 focus:ring-green-500' : 'bg-gray-50'
              }`}
              disabled={!isEditing}
            >
              <option value="">Seleccionar</option>
              <option value="Masculino">Masculino</option>
              <option value="Femenino">Femenino</option>
              <option value="No binario">No binario</option>
              <option value="Prefiero no decir">Prefiero no decir</option>
            </select>
          </div>

          {/* Fecha de Nacimiento */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Fecha de Nacimiento
            </label>
            <input
              type="date"
              value={profileData.fecha_nacimiento}
              onChange={(e) => handleInputChange('fecha_nacimiento', e.target.value)}
              className={`w-full border border-gray-300 rounded-lg px-4 py-2 ${
                isEditing ? 'focus:outline-none focus:ring-2 focus:ring-green-500' : 'bg-gray-50'
              }`}
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
              value={profileData.telefono}
              onChange={(e) => handleInputChange('telefono', e.target.value)}
              className={`w-full border border-gray-300 rounded-lg px-4 py-2 ${
                isEditing ? 'focus:outline-none focus:ring-2 focus:ring-green-500' : 'bg-gray-50'
              }`}
              disabled={!isEditing}
            />
          </div>
        </div>
      </div>

      {/* Ubicación y Residencia */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-6 pb-3 border-b border-gray-200 flex items-center gap-2">
          <span>🌍</span> Ubicación y Residencia
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* País */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              País
            </label>
            <Select
              options={opcionesPaises}
              value={opcionesPaises.find(op => op.value === profileData.pais)}
              onChange={(selectedOption) => handleInputChange('pais', selectedOption?.value || '')}
              isDisabled={!isEditing}
              placeholder="Seleccionar país"
              className="text-sm"
              styles={{
                control: (base) => ({
                  ...base,
                  borderColor: '#d1d5db',
                  '&:hover': { borderColor: '#9ca3af' }
                })
              }}
            />
          </div>

          {/* Nacionalidad */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nacionalidad
            </label>
            <Select
              options={opcionesPaises}
              value={opcionesPaises.find(op => op.value === profileData.nacionalidad)}
              onChange={(selectedOption) => handleInputChange('nacionalidad', selectedOption?.value || '')}
              isDisabled={!isEditing}
              placeholder="Seleccionar nacionalidad"
              className="text-sm"
              styles={{
                control: (base) => ({
                  ...base,
                  borderColor: '#d1d5db',
                  '&:hover': { borderColor: '#9ca3af' }
                })
              }}
            />
          </div>

          {/* Departamento de Residencia */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Departamento de Residencia
            </label>
            <select
              value={profileData.departamento_residencia}
              onChange={(e) => {
                handleInputChange('departamento_residencia', e.target.value);
                handleInputChange('ciudad_residencia', ''); // Reset ciudad
              }}
              className={`w-full border border-gray-300 rounded-lg px-4 py-2 ${
                isEditing ? 'focus:outline-none focus:ring-2 focus:ring-green-500' : 'bg-gray-50'
              }`}
              disabled={!isEditing}
            >
              <option value="">Seleccionar departamento</option>
              {colombiaData.map((dept) => (
                <option key={dept.id} value={dept.departamento}>
                  {dept.departamento}
                </option>
              ))}
            </select>
          </div>

          {/* Ciudad de Residencia */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Ciudad de Residencia
            </label>
            <select
              value={profileData.ciudad_residencia}
              onChange={(e) => handleInputChange('ciudad_residencia', e.target.value)}
              className={`w-full border border-gray-300 rounded-lg px-4 py-2 ${
                isEditing ? 'focus:outline-none focus:ring-2 focus:ring-green-500' : 'bg-gray-50'
              }`}
              disabled={!isEditing || !profileData.departamento_residencia}
            >
              <option value="">
                {!profileData.departamento_residencia 
                  ? 'Selecciona departamento primero' 
                  : 'Seleccionar ciudad'}
              </option>
              {ciudadesResidencia.map((ciudad, idx) => (
                <option key={idx} value={ciudad}>
                  {ciudad}
                </option>
              ))}
            </select>
          </div>

          {/* Dirección de Residencia */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Dirección de Residencia
            </label>
            <input
              type="text"
              value={profileData.direccion_residencia}
              onChange={(e) => handleInputChange('direccion_residencia', e.target.value)}
              className={`w-full border border-gray-300 rounded-lg px-4 py-2 ${
                isEditing ? 'focus:outline-none focus:ring-2 focus:ring-green-500' : 'bg-gray-50'
              }`}
              disabled={!isEditing}
              placeholder="Ej: Calle 15 # 20-30"
            />
          </div>

          {/* Departamento */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Departamento
            </label>
            <select
              value={profileData.departamento}
              onChange={(e) => {
                handleInputChange('departamento', e.target.value);
                handleInputChange('municipio', ''); // Reset municipio
                handleInputChange('ciudad', ''); // Reset ciudad
              }}
              className={`w-full border border-gray-300 rounded-lg px-4 py-2 ${
                isEditing ? 'focus:outline-none focus:ring-2 focus:ring-green-500' : 'bg-gray-50'
              }`}
              disabled={!isEditing}
            >
              <option value="">Seleccionar departamento</option>
              {colombiaData.map((dept) => (
                <option key={dept.id} value={dept.departamento}>
                  {dept.departamento}
                </option>
              ))}
            </select>
          </div>

          {/* Municipio */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Municipio
            </label>
            <select
              value={profileData.municipio}
              onChange={(e) => handleInputChange('municipio', e.target.value)}
              className={`w-full border border-gray-300 rounded-lg px-4 py-2 ${
                isEditing ? 'focus:outline-none focus:ring-2 focus:ring-green-500' : 'bg-gray-50'
              }`}
              disabled={!isEditing || !profileData.departamento}
            >
              <option value="">
                {!profileData.departamento 
                  ? 'Selecciona departamento primero' 
                  : 'Seleccionar municipio'}
              </option>
              {municipios.map((municipio, idx) => (
                <option key={idx} value={municipio}>
                  {municipio}
                </option>
              ))}
            </select>
          </div>

          {/* Ciudad */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Ciudad
            </label>
            <input
              type="text"
              value={profileData.ciudad}
              onChange={(e) => handleInputChange('ciudad', e.target.value)}
              className={`w-full border border-gray-300 rounded-lg px-4 py-2 ${
                isEditing ? 'focus:outline-none focus:ring-2 focus:ring-green-500' : 'bg-gray-50'
              }`}
              disabled={!isEditing}
            />
          </div>
        </div>
      </div>

      {/* Información Institucional */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-6 pb-3 border-b border-gray-200 flex items-center gap-2">
          <span>🏛️</span> Información Institucional
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Correo - NO EDITABLE */}
          <div>
            <label className="block text-sm font-medium mb-1">
              <span className="text-red-600">Correo Electrónico (No editable)</span>
            </label>
            <input
              type="email"
              value={profileData.correo}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 bg-gray-100 text-gray-500 cursor-not-allowed"
              disabled
            />
          </div>

          {/* Rol */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Rol
            </label>
            <input
              type="text"
              value={profileData.rol}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 bg-gray-50"
              disabled
            />
          </div>

          {/* Categoría Docente */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Categoría Docente <span className="text-red-500">*</span>
            </label>
            <select
              value={profileData.categoria_docente}
              onChange={(e) => handleInputChange('categoria_docente', e.target.value)}
              className={`w-full border border-gray-300 rounded-lg px-4 py-2 ${
                isEditing ? 'focus:outline-none focus:ring-2 focus:ring-green-500' : 'bg-gray-50'
              }`}
              disabled={!isEditing}
            >
              <option value="Interno">Interno</option>
              <option value="Invitado">Invitado</option>
              <option value="Externo">Externo</option>
            </select>
          </div>

          {/* Código Programa - NO EDITABLE */}
          <div>
            <label className="block text-sm font-medium mb-1">
              <span className="text-red-600">Código Programa (No editable)</span>
            </label>
            <input
              type="text"
              value={profileData.codigo_programa}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 bg-gray-100 text-gray-500 cursor-not-allowed"
              disabled
            />
          </div>

          {/* Año de Ingreso */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Año de Ingreso
            </label>
            <input
              type="text"
              value={profileData.anio_ingreso}
              onChange={(e) => handleInputChange('anio_ingreso', e.target.value)}
              className={`w-full border border-gray-300 rounded-lg px-4 py-2 ${
                isEditing ? 'focus:outline-none focus:ring-2 focus:ring-green-500' : 'bg-gray-50'
              }`}
              disabled={!isEditing}
              placeholder="YYYY"
              maxLength={4}
            />
          </div>

          {/* Periodo */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Periodo
            </label>
            <input
              type="number"
              value={profileData.periodo}
              onChange={(e) => handleInputChange('periodo', parseInt(e.target.value))}
              className={`w-full border border-gray-300 rounded-lg px-4 py-2 ${
                isEditing ? 'focus:outline-none focus:ring-2 focus:ring-green-500' : 'bg-gray-50'
              }`}
              disabled={!isEditing}
              min={1}
              max={2}
            />
          </div>
        </div>
      </div>
    </>
  );
}
