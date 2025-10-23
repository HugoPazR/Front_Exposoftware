import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import logo from "../../assets/Logo-unicesar.png";

export default function GuestProfile() {
  const location = useLocation();
  const [isEditing, setIsEditing] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });

  // Datos del invitado (simulados - vendrían del backend)
  const invitadoData = {
    // Atributos propios
    id_invitado: "INV-2025-001",
    id_sector: "empresarial",
    nombre_empresa: "Tech Solutions S.A.S",
    
    // Atributos heredados de Usuarios
    tipo_documento: "CC",
    identificacion: "1065987654", // ❌ NO SE PUEDE EDITAR
    nombres: "Andrés Felipe",
    apellidos: "López Martínez",
    genero: "Masculino",
    identidad_sexual: "Heterosexual",
    fecha_nacimiento: "1990-05-15",
    direccion_residencia: "Calle 15 #23-45",
    ciudad_residencia: "Valledupar",
    departamento_residencia: "Cesar",
    departamento: "Cesar",
    municipio: "Valledupar",
    pais: "Colombia",
    nacionalidad: "Colombiana",
    ciudad: "Valledupar",
    telefono: "+57 300 123 4567",
    correo: "andres.lopez@techsolutions.com", // ❌ NO SE PUEDE EDITAR
    rol: "Invitado"
  };

  // Catálogos
  const sectores = [
    { id: "educativo", nombre: "Educativo" },
    { id: "empresarial", nombre: "Empresarial" },
    { id: "social", nombre: "Social" },
    { id: "gobierno", nombre: "Gobierno" }
  ];

  const tiposDocumento = [
    { id: "CC", nombre: "Cédula de Ciudadanía" },
    { id: "TI", nombre: "Tarjeta de Identidad" },
    { id: "CE", nombre: "Cédula de Extranjería" },
    { id: "PAS", nombre: "Pasaporte" }
  ];

  const generos = ["Masculino", "Femenino", "Otro", "Prefiero no decir"];
  
  const identidadesSexuales = [
    "Heterosexual",
    "Homosexual",
    "Bisexual",
    "Otro",
    "Prefiero no decir"
  ];

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  const handleSave = () => {
    setIsEditing(false);
    alert("Cambios guardados exitosamente");
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

            {/* User avatar and info */}
            <div className="flex items-center gap-4">

              <div className="flex items-center gap-3">
                <span className="text-sm text-gray-700 hidden sm:block">
                  {invitadoData.nombres} {invitadoData.apellidos}
                </span>
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <span className="text-green-600 font-bold text-lg">
                    {invitadoData.nombres.charAt(0)}{invitadoData.apellidos.charAt(0)}
                  </span>
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
          {/* Sidebar */}
          <aside className="lg:col-span-1">
            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <nav className="space-y-1">
                <Link 
                  to="/guest/dashboard" 
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    location.pathname === "/guest/dashboard"
                      ? "bg-green-50 text-green-700"
                      : "text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  <i className="pi pi-home text-base"></i>
                  Dashboard
                </Link>
                <Link 
                  to="/guest/proyectos" 
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    location.pathname === "/guest/proyectos"
                      ? "bg-green-50 text-green-700"
                      : "text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  <i className="pi pi-book text-base"></i>
                  Ver Proyectos
                </Link>
                <Link 
                  to="/guest/profile" 
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    location.pathname === "/guest/profile"
                      ? "bg-green-50 text-green-700"
                      : "text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  <i className="pi pi-cog text-base"></i>
                  Configuración
                </Link>
              </nav>
            </div>
          </aside>

          {/* Main content: Form de configuración de perfil */}
          <main className="lg:col-span-3">
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Perfil de Invitado</h2>
                  <p className="text-sm text-gray-500">Actualiza tu información personal y de empresa.</p>
                </div>
                {!isEditing && (
                  <button 
                    onClick={handleEdit}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 transition-colors"
                  >
                    <i className="pi pi-pencil"></i>
                    Editar Perfil
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
                {/* Avatar Section */}
                <div className="md:col-span-1 flex flex-col items-center">
                  <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center">
                    {/* Placeholder image */}
                    <img 
                      src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=400&auto=format&fit=crop&ixlib=rb-4.0.3" 
                      alt="Avatar" 
                      className="w-full h-full object-cover" 
                    />
                  </div>
                  {isEditing && (
                    <button className="mt-4 inline-flex items-center px-4 py-2 border border-green-600 text-green-600 rounded-lg text-sm hover:bg-green-50 transition-colors">
                      Cambiar Foto
                    </button>
                  )}
                  <div className="mt-6 text-center">
                    <p className="text-sm font-medium text-gray-700">Invitado</p>
                    <p className="text-xs text-gray-500 mt-1">Expo-software 2025</p>
                  </div>
                </div>

                {/* Form Section */}
                <div className="md:col-span-2">
                  <div className="space-y-4">
                    {/* Información Personal Básica */}
                    <div className="border-b pb-4">
                      <h3 className="text-md font-semibold text-gray-900 mb-3 flex items-center gap-2">
                        <i className="pi pi-user text-green-600"></i>
                        Información Personal Básica
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Nombres
                          </label>
                          <input 
                            type="text" 
                            defaultValue={invitadoData.nombres}
                            maxLength={30}
                            className={`w-full border border-gray-200 rounded-lg px-3 py-2 ${isEditing ? 'bg-white focus:outline-none focus:ring-2 focus:ring-green-500' : 'bg-gray-100'}`}
                            disabled={!isEditing}
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Apellidos
                          </label>
                          <input 
                            type="text" 
                            defaultValue={invitadoData.apellidos}
                            maxLength={30}
                            className={`w-full border border-gray-200 rounded-lg px-3 py-2 ${isEditing ? 'bg-white focus:outline-none focus:ring-2 focus:ring-green-500' : 'bg-gray-100'}`}
                            disabled={!isEditing}
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Tipo de Documento
                          </label>
                          <select 
                            defaultValue={invitadoData.tipo_documento}
                            className={`w-full border border-gray-200 rounded-lg px-3 py-2 ${isEditing ? 'bg-white focus:outline-none focus:ring-2 focus:ring-green-500' : 'bg-gray-100'}`}
                            disabled={!isEditing}
                          >
                            {tiposDocumento.map(tipo => (
                              <option key={tipo.id} value={tipo.id}>
                                {tipo.nombre}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Número de Identificación ❌
                          </label>
                          <input 
                            type="text" 
                            defaultValue={invitadoData.identificacion}
                            className="w-full border border-gray-200 rounded-lg px-3 py-2 bg-gray-100"
                            disabled
                            readOnly
                          />
                          <p className="text-xs text-gray-500 mt-1">No se puede editar</p>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Género
                          </label>
                          <select 
                            defaultValue={invitadoData.genero}
                            className={`w-full border border-gray-200 rounded-lg px-3 py-2 ${isEditing ? 'bg-white focus:outline-none focus:ring-2 focus:ring-green-500' : 'bg-gray-100'}`}
                            disabled={!isEditing}
                          >
                            {generos.map(gen => (
                              <option key={gen} value={gen}>{gen}</option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Identidad Sexual
                          </label>
                          <select 
                            defaultValue={invitadoData.identidad_sexual}
                            className={`w-full border border-gray-200 rounded-lg px-3 py-2 ${isEditing ? 'bg-white focus:outline-none focus:ring-2 focus:ring-green-500' : 'bg-gray-100'}`}
                            disabled={!isEditing}
                          >
                            {identidadesSexuales.map(id => (
                              <option key={id} value={id}>{id}</option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Fecha de Nacimiento
                          </label>
                          <input 
                            type="date" 
                            defaultValue={invitadoData.fecha_nacimiento}
                            className={`w-full border border-gray-200 rounded-lg px-3 py-2 ${isEditing ? 'bg-white focus:outline-none focus:ring-2 focus:ring-green-500' : 'bg-gray-100'}`}
                            disabled={!isEditing}
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Nacionalidad
                          </label>
                          <input 
                            type="text" 
                            defaultValue={invitadoData.nacionalidad}
                            maxLength={25}
                            className={`w-full border border-gray-200 rounded-lg px-3 py-2 ${isEditing ? 'bg-white focus:outline-none focus:ring-2 focus:ring-green-500' : 'bg-gray-100'}`}
                            disabled={!isEditing}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Información de Contacto */}
                    <div className="border-b pb-4">
                      <h3 className="text-md font-semibold text-gray-900 mb-3 flex items-center gap-2">
                        <i className="pi pi-phone text-green-600"></i>
                        Información de Contacto
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Correo Electrónico ❌
                          </label>
                          <input 
                            type="email" 
                            defaultValue={invitadoData.correo}
                            className="w-full border border-gray-200 rounded-lg px-3 py-2 bg-gray-100"
                            disabled
                            readOnly
                          />
                          <p className="text-xs text-gray-500 mt-1">No se puede editar</p>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Teléfono
                          </label>
                          <input 
                            type="tel" 
                            defaultValue={invitadoData.telefono}
                            maxLength={15}
                            className={`w-full border border-gray-200 rounded-lg px-3 py-2 ${isEditing ? 'bg-white focus:outline-none focus:ring-2 focus:ring-green-500' : 'bg-gray-100'}`}
                            disabled={!isEditing}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Información de Residencia */}
                    <div className="border-b pb-4">
                      <h3 className="text-md font-semibold text-gray-900 mb-3 flex items-center gap-2">
                        <i className="pi pi-map-marker text-green-600"></i>
                        Información de Residencia
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div className="md:col-span-2">
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Dirección de Residencia
                          </label>
                          <input 
                            type="text" 
                            defaultValue={invitadoData.direccion_residencia}
                            maxLength={50}
                            className={`w-full border border-gray-200 rounded-lg px-3 py-2 ${isEditing ? 'bg-white focus:outline-none focus:ring-2 focus:ring-green-500' : 'bg-gray-100'}`}
                            disabled={!isEditing}
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            País
                          </label>
                          <input 
                            type="text" 
                            defaultValue={invitadoData.pais}
                            maxLength={50}
                            className={`w-full border border-gray-200 rounded-lg px-3 py-2 ${isEditing ? 'bg-white focus:outline-none focus:ring-2 focus:ring-green-500' : 'bg-gray-100'}`}
                            disabled={!isEditing}
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Departamento
                          </label>
                          <input 
                            type="text" 
                            defaultValue={invitadoData.departamento}
                            maxLength={50}
                            className={`w-full border border-gray-200 rounded-lg px-3 py-2 ${isEditing ? 'bg-white focus:outline-none focus:ring-2 focus:ring-green-500' : 'bg-gray-100'}`}
                            disabled={!isEditing}
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Municipio
                          </label>
                          <input 
                            type="text" 
                            defaultValue={invitadoData.municipio}
                            maxLength={25}
                            className={`w-full border border-gray-200 rounded-lg px-3 py-2 ${isEditing ? 'bg-white focus:outline-none focus:ring-2 focus:ring-green-500' : 'bg-gray-100'}`}
                            disabled={!isEditing}
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Ciudad
                          </label>
                          <input 
                            type="text" 
                            defaultValue={invitadoData.ciudad}
                            maxLength={30}
                            className={`w-full border border-gray-200 rounded-lg px-3 py-2 ${isEditing ? 'bg-white focus:outline-none focus:ring-2 focus:ring-green-500' : 'bg-gray-100'}`}
                            disabled={!isEditing}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Información de Empresa/Organización */}
                    <div className="border-b pb-4">
                      <h3 className="text-md font-semibold text-gray-900 mb-3 flex items-center gap-2">
                        <i className="pi pi-building text-green-600"></i>
                        Información de Empresa/Organización
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Nombre de Empresa/Institución
                          </label>
                          <input 
                            type="text" 
                            defaultValue={invitadoData.nombre_empresa}
                            maxLength={40}
                            className={`w-full border border-gray-200 rounded-lg px-3 py-2 ${isEditing ? 'bg-white focus:outline-none focus:ring-2 focus:ring-green-500' : 'bg-gray-100'}`}
                            disabled={!isEditing}
                          />
                          <p className="text-xs text-gray-500 mt-1">Máximo 40 caracteres</p>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Sector
                          </label>
                          <select 
                            defaultValue={invitadoData.id_sector}
                            className={`w-full border border-gray-200 rounded-lg px-3 py-2 ${isEditing ? 'bg-white focus:outline-none focus:ring-2 focus:ring-green-500' : 'bg-gray-100'}`}
                            disabled={!isEditing}
                          >
                            <option value="">Seleccionar sector</option>
                            {sectores.map(sector => (
                              <option key={sector.id} value={sector.id}>
                                {sector.nombre}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            ID de Invitado
                          </label>
                          <input 
                            type="text" 
                            defaultValue={invitadoData.id_invitado}
                            className="w-full border border-gray-200 rounded-lg px-3 py-2 bg-gray-100"
                            disabled
                            readOnly
                          />
                          <p className="text-xs text-gray-500 mt-1">Generado automáticamente</p>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Rol en el Sistema
                          </label>
                          <input 
                            type="text" 
                            defaultValue={invitadoData.rol}
                            className="w-full border border-gray-200 rounded-lg px-3 py-2 bg-gray-100"
                            disabled
                            readOnly
                          />
                        </div>
                      </div>
                    </div>

                    {/* Seguridad */}
                    <div className="pb-4">
                      <h3 className="text-md font-semibold text-gray-900 mb-3 flex items-center gap-2">
                        <i className="pi pi-lock text-green-600"></i>
                        Seguridad
                      </h3>
                      <div className="flex items-center gap-4">
                        <div className="flex-1">
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Contraseña
                          </label>
                          <input 
                            type="password" 
                            defaultValue="********" 
                            className="w-full border border-gray-200 rounded-lg px-3 py-2 bg-gray-100"
                            disabled
                          />
                        </div>
                        <div className="shrink-0">
                          <button 
                            onClick={handleOpenPasswordModal}
                            className="mt-6 inline-flex items-center px-4 py-2 border border-green-600 text-green-600 rounded-lg text-sm hover:bg-green-50 transition-colors"
                          >
                            Cambiar Contraseña
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Botones de acción */}
                    {isEditing && (
                      <div className="pt-4 flex gap-3">
                        <button 
                          onClick={handleSave}
                          className="flex-1 bg-green-700 text-white py-3 rounded-lg font-semibold hover:bg-green-800 transition-colors"
                        >
                          Guardar Cambios
                        </button>
                        <button 
                          onClick={handleCancel}
                          className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                        >
                          Cancelar
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
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
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
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
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
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
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
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
                  className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors"
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