import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Select from 'react-select';
import logo from "../../assets/Logo-unicesar.png";
import AdminSidebar from "../../components/Layout/AdminSidebar";
import colombiaData from "../../data/colombia.json";
import countryList from 'react-select-country-list';

export default function AdminProfile() {
  const [isEditing, setIsEditing] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });

  // Datos del perfil - Campos editables
  const [profileData, setProfileData] = useState({
    // Información personal
    tipoDocumento: "CC",
    identificacion: "1065874321", // ❌ NO EDITABLE
    nombres: "Carlos Andrés",
    apellidos: "Mendoza Pérez",
    genero: "Masculino",
    identidadSexual: "Masculino",
    fechaNacimiento: "1985-06-15",
    telefono: "3001234567",
    
    // Ubicación y residencia
    pais: "CO",
    nacionalidad: "CO",
    departamentoResidencia: "Cesar",
    ciudadResidencia: "Valledupar",
    direccionResidencia: "Calle 15 # 10-45",
    departamento: "Cesar",
    municipio: "Valledupar",
    ciudad: "Valledupar",
    
    // Información institucional
    correo: "admin@exposoftware.edu", // ❌ NO EDITABLE
    programa: "N/A", // ❌ NO EDITABLE - Administrador no tiene programa
    semestre: "N/A", // ❌ NO EDITABLE - Administrador no tiene semestre
    fechaIngreso: "2020-01-15", // ❌ NO EDITABLE
    anioIngreso: "2020",
    periodo: "2020-1",
    
    // Estado
    activo: true,
    rol: "Administrador"
  });

  // Estados para selectores dinámicos
  const [opcionesPaises, setOpcionesPaises] = useState([]);
  const [ciudadesResidencia, setCiudadesResidencia] = useState([]);
  const [municipios, setMunicipios] = useState([]);

  // Inicializar opciones de países
  useEffect(() => {
    const paises = countryList().getData();
    setOpcionesPaises(paises);
  }, []);

  // Actualizar ciudades cuando cambia departamento de residencia
  useEffect(() => {
    if (profileData.departamentoResidencia) {
      const deptData = colombiaData.find(d => d.departamento === profileData.departamentoResidencia);
      setCiudadesResidencia(deptData ? deptData.ciudades : []);
    } else {
      setCiudadesResidencia([]);
    }
  }, [profileData.departamentoResidencia]);

  // Actualizar municipios cuando cambia departamento
  useEffect(() => {
    if (profileData.departamento) {
      const deptData = colombiaData.find(d => d.departamento === profileData.departamento);
      setMunicipios(deptData ? deptData.ciudades : []);
    } else {
      setMunicipios([]);
    }
  }, [profileData.departamento]);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  const handleSave = () => {
    // Validaciones básicas
    if (!profileData.nombres || !profileData.apellidos || !profileData.telefono) {
      alert("Por favor completa los campos obligatorios");
      return;
    }

    console.log("📤 Datos a guardar:", profileData);
    setIsEditing(false);
    alert("✅ Cambios guardados exitosamente");
  };

  const handleInputChange = (field, value) => {
    setProfileData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleOpenPasswordModal = () => {
    setShowPasswordModal(true);
    setPasswordForm({
      currentPassword: "",
      newPassword: "",
      confirmPassword: ""
    });
  };

  const handleClosePasswordModal = () => {
    setShowPasswordModal(false);
    setPasswordForm({
      currentPassword: "",
      newPassword: "",
      confirmPassword: ""
    });
  };

  const handlePasswordChange = (e) => {
    setPasswordForm({
      ...passwordForm,
      [e.target.name]: e.target.value
    });
  };

  const handleSavePassword = (e) => {
    e.preventDefault();
    
    if (!passwordForm.currentPassword || !passwordForm.newPassword || !passwordForm.confirmPassword) {
      alert("Por favor completa todos los campos");
      return;
    }

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      alert("Las contraseñas nuevas no coinciden");
      return;
    }

    if (passwordForm.newPassword.length < 6) {
      alert("La contraseña debe tener al menos 6 caracteres");
      return;
    }

    alert("Contraseña cambiada exitosamente");
    handleClosePasswordModal();
  };

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
                <span className="text-sm text-gray-700 hidden sm:block">Carlos </span>
                <div className="w-10 h-10 bg-teal-100 rounded-full flex items-center justify-center">
                  <span className="text-teal-600 font-bold text-lg">C</span>
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

          {/* Main content: Configuración de Perfil */}
          <main className="lg:col-span-3">
            <div className="bg-white rounded-lg border border-gray-200 p-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Configuración de Perfil</h2>
                {!isEditing && (
                  <button 
                    onClick={handleEdit}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-teal-600 text-white rounded-lg text-sm font-medium hover:bg-teal-700 transition-colors"
                  >
                    <i className="pi pi-pencil"></i>
                    Editar Perfil
                  </button>
                )}
              </div>

              {/* Información Personal */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-6 pb-3 border-b border-gray-200">
                  📋 Información Personal
                </h3>

                <div className="flex flex-col md:flex-row gap-8">

                  {/* Formulario de información */}
                  <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Tipo de Documento */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Tipo de Documento
                      </label>
                      <select
                        value={profileData.tipoDocumento}
                        onChange={(e) => handleInputChange('tipoDocumento', e.target.value)}
                        className={`w-full border border-gray-300 rounded-lg px-4 py-2 text-gray-900 ${isEditing ? 'focus:outline-none focus:ring-2 focus:ring-teal-500' : 'bg-gray-50'}`}
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
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Identificación <span className="text-red-500 text-xs">(No editable)</span>
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
                        className={`w-full border border-gray-300 rounded-lg px-4 py-2 text-gray-900 ${isEditing ? 'focus:outline-none focus:ring-2 focus:ring-teal-500' : 'bg-gray-50'}`}
                        disabled={!isEditing}
                        placeholder="Ej: Carlos Andrés"
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
                        className={`w-full border border-gray-300 rounded-lg px-4 py-2 text-gray-900 ${isEditing ? 'focus:outline-none focus:ring-2 focus:ring-teal-500' : 'bg-gray-50'}`}
                        disabled={!isEditing}
                        placeholder="Ej: Mendoza Pérez"
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
                        className={`w-full border border-gray-300 rounded-lg px-4 py-2 text-gray-900 ${isEditing ? 'focus:outline-none focus:ring-2 focus:ring-teal-500' : 'bg-gray-50'}`}
                        disabled={!isEditing}
                      >
                        <option value="">Seleccionar</option>
                        <option value="Masculino">Masculino</option>
                        <option value="Femenino">Femenino</option>
                        <option value="Otro">Otro</option>
                        <option value="Prefiero no decir">Prefiero no decir</option>
                      </select>
                    </div>

                    {/* Identidad Sexual */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Identidad Sexual
                      </label>
                      <select
                        value={profileData.identidadSexual}
                        onChange={(e) => handleInputChange('identidadSexual', e.target.value)}
                        className={`w-full border border-gray-300 rounded-lg px-4 py-2 text-gray-900 ${isEditing ? 'focus:outline-none focus:ring-2 focus:ring-teal-500' : 'bg-gray-50'}`}
                        disabled={!isEditing}
                      >
                        <option value="">Seleccionar</option>
                        <option value="Masculino">Masculino</option>
                        <option value="Femenino">Femenino</option>
                        <option value="No binario">No binario</option>
                        <option value="Otro">Otro</option>
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
                        value={profileData.fechaNacimiento}
                        onChange={(e) => handleInputChange('fechaNacimiento', e.target.value)}
                        className={`w-full border border-gray-300 rounded-lg px-4 py-2 text-gray-900 ${isEditing ? 'focus:outline-none focus:ring-2 focus:ring-teal-500' : 'bg-gray-50'}`}
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
                        className={`w-full border border-gray-300 rounded-lg px-4 py-2 text-gray-900 ${isEditing ? 'focus:outline-none focus:ring-2 focus:ring-teal-500' : 'bg-gray-50'}`}
                        disabled={!isEditing}
                        placeholder="3001234567"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Ubicación y Residencia */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-6 pb-3 border-b border-gray-200">
                  🌍 Ubicación y Residencia
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* País */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      País
                    </label>
                    {isEditing ? (
                      <Select
                        options={opcionesPaises}
                        value={opcionesPaises.find(opt => opt.value === profileData.pais)}
                        onChange={(option) => handleInputChange('pais', option ? option.value : '')}
                        placeholder="Selecciona un país"
                        className="text-sm"
                        isSearchable
                        styles={{
                          control: (base) => ({
                            ...base,
                            borderColor: '#d1d5db',
                            '&:hover': { borderColor: '#9ca3af' }
                          })
                        }}
                      />
                    ) : (
                      <input 
                        type="text" 
                        value={opcionesPaises.find(opt => opt.value === profileData.pais)?.label || profileData.pais}
                        className="w-full border border-gray-300 rounded-lg px-4 py-2 bg-gray-50 text-gray-900"
                        disabled
                      />
                    )}
                  </div>

                  {/* Nacionalidad */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Nacionalidad
                    </label>
                    {isEditing ? (
                      <Select
                        options={opcionesPaises}
                        value={opcionesPaises.find(opt => opt.value === profileData.nacionalidad)}
                        onChange={(option) => handleInputChange('nacionalidad', option ? option.value : '')}
                        placeholder="Selecciona nacionalidad"
                        className="text-sm"
                        isSearchable
                        styles={{
                          control: (base) => ({
                            ...base,
                            borderColor: '#d1d5db',
                            '&:hover': { borderColor: '#9ca3af' }
                          })
                        }}
                      />
                    ) : (
                      <input 
                        type="text" 
                        value={opcionesPaises.find(opt => opt.value === profileData.nacionalidad)?.label || profileData.nacionalidad}
                        className="w-full border border-gray-300 rounded-lg px-4 py-2 bg-gray-50 text-gray-900"
                        disabled
                      />
                    )}
                  </div>

                  {/* Departamento de Residencia */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Departamento de Residencia
                    </label>
                    <select
                      value={profileData.departamentoResidencia}
                      onChange={(e) => {
                        handleInputChange('departamentoResidencia', e.target.value);
                        handleInputChange('ciudadResidencia', ''); // Reset ciudad
                      }}
                      className={`w-full border border-gray-300 rounded-lg px-4 py-2 text-gray-900 ${isEditing ? 'focus:outline-none focus:ring-2 focus:ring-teal-500' : 'bg-gray-50'}`}
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

                  {/* Ciudad de Residencia */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Ciudad de Residencia
                    </label>
                    <select
                      value={profileData.ciudadResidencia}
                      onChange={(e) => handleInputChange('ciudadResidencia', e.target.value)}
                      className={`w-full border border-gray-300 rounded-lg px-4 py-2 text-gray-900 ${isEditing ? 'focus:outline-none focus:ring-2 focus:ring-teal-500' : 'bg-gray-50'}`}
                      disabled={!isEditing || !profileData.departamentoResidencia}
                    >
                      <option value="">Seleccionar ciudad</option>
                      {ciudadesResidencia.map((ciudad) => (
                        <option key={ciudad} value={ciudad}>
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
                      value={profileData.direccionResidencia}
                      onChange={(e) => handleInputChange('direccionResidencia', e.target.value)}
                      className={`w-full border border-gray-300 rounded-lg px-4 py-2 text-gray-900 ${isEditing ? 'focus:outline-none focus:ring-2 focus:ring-teal-500' : 'bg-gray-50'}`}
                      disabled={!isEditing}
                      placeholder="Ej: Calle 15 # 10-45"
                    />
                  </div>

                  {/* Departamento */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Departamento (Trabajo)
                    </label>
                    <select
                      value={profileData.departamento}
                      onChange={(e) => {
                        handleInputChange('departamento', e.target.value);
                        handleInputChange('municipio', ''); // Reset municipio
                      }}
                      className={`w-full border border-gray-300 rounded-lg px-4 py-2 text-gray-900 ${isEditing ? 'focus:outline-none focus:ring-2 focus:ring-teal-500' : 'bg-gray-50'}`}
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
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Municipio
                    </label>
                    <select
                      value={profileData.municipio}
                      onChange={(e) => handleInputChange('municipio', e.target.value)}
                      className={`w-full border border-gray-300 rounded-lg px-4 py-2 text-gray-900 ${isEditing ? 'focus:outline-none focus:ring-2 focus:ring-teal-500' : 'bg-gray-50'}`}
                      disabled={!isEditing || !profileData.departamento}
                    >
                      <option value="">Seleccionar municipio</option>
                      {municipios.map((mun) => (
                        <option key={mun} value={mun}>
                          {mun}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Ciudad */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Ciudad (Trabajo)
                    </label>
                    <input 
                      type="text" 
                      value={profileData.ciudad}
                      onChange={(e) => handleInputChange('ciudad', e.target.value)}
                      className={`w-full border border-gray-300 rounded-lg px-4 py-2 text-gray-900 ${isEditing ? 'focus:outline-none focus:ring-2 focus:ring-teal-500' : 'bg-gray-50'}`}
                      disabled={!isEditing}
                      placeholder="Ej: Valledupar"
                    />
                  </div>
                </div>
              </div>

              {/* Información Institucional */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-6 pb-3 border-b border-gray-200">
                  🏛️ Información Institucional
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Correo - NO EDITABLE */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Correo Institucional <span className="text-red-500 text-xs">(No editable)</span>
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
                      Rol en el Sistema
                    </label>
                    <input 
                      type="text" 
                      value={profileData.rol}
                      className="w-full border border-gray-300 rounded-lg px-4 py-2 bg-gray-50 text-gray-700"
                      disabled
                    />
                  </div>

                  {/* Programa - NO EDITABLE */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Programa <span className="text-red-500 text-xs">(No aplica)</span>
                    </label>
                    <input 
                      type="text" 
                      value={profileData.programa}
                      className="w-full border border-gray-300 rounded-lg px-4 py-2 bg-gray-100 text-gray-500 cursor-not-allowed"
                      disabled
                    />
                  </div>

                  {/* Semestre - NO EDITABLE */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Semestre <span className="text-red-500 text-xs">(No aplica)</span>
                    </label>
                    <input 
                      type="text" 
                      value={profileData.semestre}
                      className="w-full border border-gray-300 rounded-lg px-4 py-2 bg-gray-100 text-gray-500 cursor-not-allowed"
                      disabled
                    />
                  </div>

                  {/* Fecha de Ingreso - NO EDITABLE */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Fecha de Ingreso <span className="text-red-500 text-xs">(No editable)</span>
                    </label>
                    <input 
                      type="date" 
                      value={profileData.fechaIngreso}
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
                      value={profileData.anioIngreso}
                      onChange={(e) => handleInputChange('anioIngreso', e.target.value)}
                      className={`w-full border border-gray-300 rounded-lg px-4 py-2 text-gray-900 ${isEditing ? 'focus:outline-none focus:ring-2 focus:ring-teal-500' : 'bg-gray-50'}`}
                      disabled={!isEditing}
                      placeholder="2020"
                    />
                  </div>

                  {/* Periodo */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Periodo
                    </label>
                    <input 
                      type="text" 
                      value={profileData.periodo}
                      onChange={(e) => handleInputChange('periodo', e.target.value)}
                      className={`w-full border border-gray-300 rounded-lg px-4 py-2 text-gray-900 ${isEditing ? 'focus:outline-none focus:ring-2 focus:ring-teal-500' : 'bg-gray-50'}`}
                      disabled={!isEditing}
                      placeholder="2020-1"
                    />
                  </div>

                  {/* Estado */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Estado
                    </label>
                    <div className="flex items-center h-[42px]">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                        profileData.activo ? 'bg-teal-100 text-teal-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {profileData.activo ? '✓ Activo' : '✗ Inactivo'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Seguridad */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-6 pb-3 border-b border-gray-200">
                  🔒 Seguridad
                </h3>

                <div className="space-y-4 max-w-2xl">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Contraseña
                    </label>
                    <input 
                      type="password" 
                      defaultValue="********" 
                      disabled
                      className="w-full border border-gray-300 rounded-lg px-4 py-2 bg-gray-50 text-gray-500"
                    />
                  </div>

                  <div>
                    <button 
                      onClick={handleOpenPasswordModal}
                      className="inline-flex items-center px-4 py-2 border border-gray-300 text-gray-700 rounded-lg text-sm hover:bg-gray-50 transition-colors"
                    >
                      Cambiar Contraseña
                    </button>
                  </div>
                </div>
              </div>

              {/* Botones de acción */}
              {isEditing && (
                <div className="flex justify-end gap-3 pt-6 border-t border-gray-200">
                  <button 
                    onClick={handleCancel}
                    className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                  >
                    Cancelar
                  </button>
                  <button 
                    onClick={handleSave}
                    className="bg-teal-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-teal-700 transition-colors"
                  >
                    Guardar Cambios
                  </button>
                </div>
              )}
            </div>
          </main>
        </div>
      </div>

      {/* Modal para cambiar contraseña */}
      {showPasswordModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Cambiar Contraseña</h3>
              <button 
                onClick={handleClosePasswordModal}
                className="text-gray-500 hover:text-gray-700"
              >
                <i className="pi pi-times text-xl"></i>
              </button>
            </div>

            <form onSubmit={handleSavePassword} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Contraseña Actual <span className="text-red-500">*</span>
                </label>
                <input 
                  type="password"
                  name="currentPassword"
                  value={passwordForm.currentPassword}
                  onChange={handlePasswordChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nueva Contraseña <span className="text-red-500">*</span>
                </label>
                <input 
                  type="password"
                  name="newPassword"
                  value={passwordForm.newPassword}
                  onChange={handlePasswordChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
                  required
                  minLength={6}
                />
                <p className="text-xs text-gray-500 mt-1">Mínimo 6 caracteres</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Confirmar Nueva Contraseña <span className="text-red-500">*</span>
                </label>
                <input 
                  type="password"
                  name="confirmPassword"
                  value={passwordForm.confirmPassword}
                  onChange={handlePasswordChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
                  required
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button 
                  type="button"
                  onClick={handleClosePasswordModal}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                >
                  Cancelar
                </button>
                <button 
                  type="submit"
                  className="flex-1 px-4 py-2 bg-teal-600 text-white rounded-lg font-semibold hover:bg-teal-700 transition-colors"
                >
                  Guardar Contraseña
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
