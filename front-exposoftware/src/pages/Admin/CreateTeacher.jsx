import { Link } from "react-router-dom";
import Select from 'react-select';
import { useState } from 'react';
import logo from "../../assets/Logo-unicesar.png";
import AdminSidebar from "../../components/Layout/AdminSidebar";
import { 
  useTeacherManagement,
  TIPOS_DOCUMENTO,
  GENEROS,
  IDENTIDADES_SEXUALES,
  CATEGORIAS_DOCENTE,
  DEPARTAMENTOS_COLOMBIA,
  PAISES
} from "./useTeacherManagement";
import EditTeacherModal from "./EditTeacherModal";
import { 
  validateField, 
  filterInput, 
  hasErrors 
} from "../../utils/teacherValidations";

export default function CreateTeacher() {

  // Estado para errores de validación
  const [errors, setErrors] = useState({});

  const {
    // Estados del formulario - Usuario (heredados)
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
    direccionResidencia,
    setDireccionResidencia,
    anioIngreso,
    setAnioIngreso,
    periodo,
    setPeriodo,
    ciudadResidencia,
    setCiudadResidencia,
    departamentoResidencia,
    setDepartamentoResidencia,
    departamento,
    setDepartamento,
    municipio,
    setMunicipio,
    pais,
    setPais,
    nacionalidad,
    setNacionalidad,
    ciudad,
    setCiudad,
    telefono,
    setTelefono,
    correo,
    setCorreo,
    contraseña,
    setContraseña,
    // Estados del formulario - Docente (propios)
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
    // Estados para ciudades dinámicas
    ciudadesResidencia,
    municipios,
    // Opciones de países/nacionalidades
    opcionesPaises,
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

  // Función para manejar cambios con validación
  const handleInputChange = (fieldName, value, setter) => {
    // Filtrar entrada según el tipo de campo
    const filteredValue = filterInput(fieldName, value);
    setter(filteredValue);

    // Validar el campo
    const formData = {
      nombres,
      apellidos,
      identificacion,
      telefono,
      correo,
      fechaNacimiento,
      ciudadResidencia,
      ciudad,
      municipio,
      codigoPrograma,
    };
    
    const error = validateField(fieldName, filteredValue, formData);
    setErrors(prev => ({
      ...prev,
      [fieldName]: error
    }));
  };

  // Validar antes de enviar el formulario
  const handleFormSubmit = (e) => {
    e.preventDefault();

    // Crear objeto con todos los datos del formulario
    const formData = {
      nombres,
      apellidos,
      identificacion,
      telefono,
      correo,
      fechaNacimiento,
      ciudadResidencia,
      ciudad,
      municipio,
      codigoPrograma,
      tipoDocumento,
      genero,
      identidadSexual,
      pais,
      nacionalidad,
      departamentoResidencia,
      direccionResidencia,
      departamento,
      categoriaDocente,
      activo,
    };

    // Validar todos los campos requeridos
    const newErrors = {};
    Object.keys(formData).forEach(key => {
      const error = validateField(key, formData[key], formData);
      if (error) {
        newErrors[key] = error;
      }
    });

    setErrors(newErrors);

    // Si hay errores, no enviar el formulario
    if (hasErrors(newErrors)) {
      // Scroll al primer error
      const firstErrorField = Object.keys(newErrors)[0];
      const element = document.querySelector(`[name="${firstErrorField}"]`);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        element.focus();
      }
      return;
    }

    // Si no hay errores, proceder con el envío
    handleSubmit(e);
    setErrors({});
  };

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
              <form onSubmit={handleFormSubmit} className="space-y-6">
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
                        name="identificacion"
                        value={identificacion}
                        onChange={(e) => handleInputChange('identificacion', e.target.value, setIdentificacion)}
                        placeholder="Ej: 1023456789"
                        className={`w-full px-4 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 ${
                          errors.identificacion 
                            ? 'border-red-500 focus:ring-red-500' 
                            : 'border-gray-300 focus:ring-green-500'
                        }`}
                        required
                        maxLength={12}
                      />
                      {errors.identificacion && (
                        <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                          <i className="pi pi-exclamation-circle"></i>
                          {errors.identificacion}
                        </p>
                      )}
                    </div>

                    {/* Nombres */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Nombres <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="nombres"
                        value={nombres}
                        onChange={(e) => handleInputChange('nombres', e.target.value, setNombres)}
                        placeholder="Ej: María José"
                        className={`w-full px-4 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 ${
                          errors.nombres 
                            ? 'border-red-500 focus:ring-red-500' 
                            : 'border-gray-300 focus:ring-green-500'
                        }`}
                        required
                      />
                      {errors.nombres && (
                        <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                          <i className="pi pi-exclamation-circle"></i>
                          {errors.nombres}
                        </p>
                      )}
                    </div>

                    {/* Apellidos */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Apellidos <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="apellidos"
                        value={apellidos}
                        onChange={(e) => handleInputChange('apellidos', e.target.value, setApellidos)}
                        placeholder="Ej: Pérez García"
                        className={`w-full px-4 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 ${
                          errors.apellidos 
                            ? 'border-red-500 focus:ring-red-500' 
                            : 'border-gray-300 focus:ring-green-500'
                        }`}
                        required
                      />
                      {errors.apellidos && (
                        <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                          <i className="pi pi-exclamation-circle"></i>
                          {errors.apellidos}
                        </p>
                      )}
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
                      <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600 font-medium">
                          +57
                        </span>
                        <input
                          type="tel"
                          name="telefono"
                          value={telefono}
                          onChange={(e) => {
                            let value = e.target.value.replace(/\D/g, ''); // Solo números
                            
                            // Si está vacío o borra todo, forzar que empiece con 3
                            if (value === '' || value.length === 0) {
                              value = '3';
                            }
                            
                            // Asegurar que siempre empiece con 3
                            if (!value.startsWith('3')) {
                              value = '3' + value.replace(/^3*/, '');
                            }
                            
                            // Limitar a 10 dígitos
                            if (value.length > 10) {
                              value = value.slice(0, 10);
                            }
                            
                            handleInputChange('telefono', value, setTelefono);
                          }}
                          onFocus={(e) => {
                            // Si está vacío al hacer foco, iniciar con 3
                            if (e.target.value === '') {
                              handleInputChange('telefono', '3', setTelefono);
                            }
                          }}
                          placeholder="3001234567"
                          className={`w-full pl-14 pr-4 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 ${
                            errors.telefono 
                              ? 'border-red-500 focus:ring-red-500' 
                              : 'border-gray-300 focus:ring-green-500'
                          }`}
                          required
                          maxLength={10}
                        />
                      </div>
                      {errors.telefono && (
                        <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                          <i className="pi pi-exclamation-circle"></i>
                          {errors.telefono}
                        </p>
                      )}
                      <p className="mt-1 text-xs text-gray-500">
                        Formato: +57 3XX XXX XXXX (10 dígitos, inicia con 3)
                      </p>
                    </div>
                  </div>
                </div>

                {/* Información de Ubicación y Residencia */}
                <div className="border-b pb-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Información de Ubicación y Residencia</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* País - Select dinámico */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        País
                      </label>
                      <Select
                        name="pais"
                        options={opcionesPaises}
                        placeholder="Selecciona País"
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

                    {/* Nacionalidad - Select dinámico */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Nacionalidad
                      </label>
                      <Select
                        name="nacionalidad"
                        options={opcionesPaises}
                        placeholder="Selecciona Nacionalidad"
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


                    {/* Ciudad de Residencia - Select dinámico */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Ciudad de Residencia
                      </label>
                      <select
                        value={ciudadResidencia}
                        onChange={(e) => setCiudadResidencia(e.target.value)}
                        disabled={!departamentoResidencia}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500 bg-white disabled:bg-gray-100 disabled:cursor-not-allowed"
                      >
                        <option value="">Seleccionar ciudad</option>
                        {ciudadesResidencia.map((ciudad) => (
                          <option key={ciudad} value={ciudad}>{ciudad}</option>
                        ))}
                      </select>
                      {!departamentoResidencia && (
                        <p className="text-xs text-gray-500 mt-1">Primero selecciona un departamento</p>
                      )}
                    </div>

                    {/* Dirección de Residencia */}
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Dirección de Residencia
                      </label>
                      <input
                        type="text"
                        value={direccionResidencia}
                        onChange={(e) => setDireccionResidencia(e.target.value)}
                        placeholder="Ej: Calle 50 #30-20"
                        maxLength={50}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
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
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500 bg-white"
                      >
                        <option value="">Seleccionar departamento</option>
                        {DEPARTAMENTOS_COLOMBIA.map((dept) => (
                          <option key={dept} value={dept}>{dept}</option>
                        ))}
                      </select>
                    </div>

                    {/* Municipio - Select dinámico */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Ciudad
                      </label>
                      <select
                        value={municipio}
                        onChange={(e) => setMunicipio(e.target.value)}
                        disabled={!departamento}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500 bg-white disabled:bg-gray-100 disabled:cursor-not-allowed"
                      >
                        <option value="">Seleccionar municipio</option>
                        {municipios.map((mun) => (
                          <option key={mun} value={mun}>{mun}</option>
                        ))}
                      </select>
                      {!departamento && (
                        <p className="text-xs text-gray-500 mt-1">Primero selecciona un departamento</p>
                      )}
                    </div>

                  </div>
                </div>

                {/* Información Académica */}
                <div className="border-b pb-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Información Académica</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Año de Ingreso */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Año de Ingreso
                      </label>
                      <input
                        type="text"
                        value={anioIngreso}
                        onChange={(e) => setAnioIngreso(e.target.value)}
                        placeholder="Ej: 2024"
                        maxLength={4}
                        pattern="[0-9]{4}"
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                      />
                    </div>

                    {/* Periodo */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Periodo
                      </label>
                      <input
                        type="number"
                        value={periodo}
                        onChange={(e) => setPeriodo(e.target.value)}
                        placeholder="Ej: 1"
                        min="1"
                        max="10"
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
                        name="correo"
                        value={correo}
                        onChange={(e) => handleInputChange('correo', e.target.value, setCorreo)}
                        placeholder="usuario@unicesar.edu.co"
                        className={`w-full px-4 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 ${
                          errors.correo 
                            ? 'border-red-500 focus:ring-red-500' 
                            : 'border-gray-300 focus:ring-green-500'
                        }`}
                        required
                      />
                      {errors.correo && (
                        <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                          <i className="pi pi-exclamation-circle"></i>
                          {errors.correo}
                        </p>
                      )}
                      <p className="mt-1 text-xs text-gray-500">Debe ser correo institucional (@unicesar.edu.co)</p>
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

                    {/* Código del Programa - Solo para docentes Internos */}
                    {categoriaDocente === "Interno" && (
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
                    )}

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
        // Listas dinámicas
        ciudadesResidencia={ciudadesResidencia}
        municipios={municipios}
        opcionesPaises={opcionesPaises}
        // Estados del formulario - Usuario
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
        identidadSexual={identidadSexual}
        setIdentidadSexual={setIdentidadSexual}
        fechaNacimiento={fechaNacimiento}
        setFechaNacimiento={setFechaNacimiento}
        direccionResidencia={direccionResidencia}
        setDireccionResidencia={setDireccionResidencia}
        anioIngreso={anioIngreso}
        setAnioIngreso={setAnioIngreso}
        periodo={periodo}
        setPeriodo={setPeriodo}
        ciudadResidencia={ciudadResidencia}
        setCiudadResidencia={setCiudadResidencia}
        departamentoResidencia={departamentoResidencia}
        setDepartamentoResidencia={setDepartamentoResidencia}
        departamento={departamento}
        setDepartamento={setDepartamento}
        municipio={municipio}
        setMunicipio={setMunicipio}
        pais={pais}
        setPais={setPais}
        nacionalidad={nacionalidad}
        setNacionalidad={setNacionalidad}
        ciudad={ciudad}
        setCiudad={setCiudad}
        telefono={telefono}
        setTelefono={setTelefono}
        correo={correo}
        setCorreo={setCorreo}
        contraseña={contraseña}
        setContraseña={setContraseña}
        // Estados del formulario - Docente
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
