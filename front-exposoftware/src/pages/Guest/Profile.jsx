import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { obtenerMiPerfilInvitado, actualizarPerfilInvitado } from "../../Services/GuestService";
import { SECTORES } from "../../data/sectores";
import logo from "../../assets/Logo-unicesar.png";

export default function GuestProfile() {
  const location = useLocation();
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [cargando, setCargando] = useState(true);
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState(null);
  const [perfil, setPerfil] = useState(null);
  
  const [formData, setFormData] = useState({
    tipo_documento: '',
    identificacion: '',
    primer_nombre: '',
    segundo_nombre: '',
    primer_apellido: '',
    segundo_apellido: '',
    sexo: '',
    identidad_sexual: '',
    fecha_nacimiento: '',
    nacionalidad: '',
    pais_residencia: '',
    departamento: '',
    municipio: '',
    ciudad_residencia: '',
    direccion_residencia: '',
    telefono: '',
    correo: '',
    id_sector: '',
    nombre_empresa: ''
  });

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });

  useEffect(() => {
    cargarPerfil();
  }, []);

  const cargarPerfil = async () => {
    try {
      setCargando(true);
      setError(null);
      const datos = await obtenerMiPerfilInvitado();
      setPerfil(datos);
      
      // Cargar datos en el formulario
      setFormData({
        tipo_documento: datos.tipo_documento || '',
        identificacion: datos.identificacion || '',
        primer_nombre: datos.primer_nombre || '',
        segundo_nombre: datos.segundo_nombre || '',
        primer_apellido: datos.primer_apellido || '',
        segundo_apellido: datos.segundo_apellido || '',
        sexo: datos.sexo || '',
        identidad_sexual: datos.identidad_sexual || '',
        fecha_nacimiento: datos.fecha_nacimiento || '',
        nacionalidad: datos.nacionalidad || '',
        pais_residencia: datos.pais_residencia || '',
        departamento: datos.departamento || '',
        municipio: datos.municipio || '',
        ciudad_residencia: datos.ciudad_residencia || '',
        direccion_residencia: datos.direccion_residencia || '',
        telefono: datos.telefono || '',
        correo: datos.correo || '',
        id_sector: datos.id_sector || '',
        nombre_empresa: datos.nombre_empresa || ''
      });
      
      console.log('✅ Perfil cargado en Profile:', datos);
    } catch (err) {
      console.error('❌ Error cargando perfil:', err);
      setError(err.message);
    } finally {
      setCargando(false);
    }
  };

  const handleLogout = () => {
    if (window.confirm("¿Estás seguro de que deseas cerrar sesión?")) {
      logout();
      navigate("/login");
    }
  };

  // Catálogos
  const sectores = SECTORES;

  const tiposDocumento = [
    { id: "CC", nombre: "Cédula de Ciudadanía" },
    { id: "TI", nombre: "Tarjeta de Identidad" },
    { id: "CE", nombre: "Cédula de Extranjería" },
    { id: "PAS", nombre: "Pasaporte" }
  ];

  const generos = ["Hombre", "Mujer", "Hermafrodita"];
  
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
    // Restaurar datos originales
    if (perfil) {
      setFormData({
        tipo_documento: perfil.tipo_documento || '',
        identificacion: perfil.identificacion || '',
        primer_nombre: perfil.primer_nombre || '',
        segundo_nombre: perfil.segundo_nombre || '',
        primer_apellido: perfil.primer_apellido || '',
        segundo_apellido: perfil.segundo_apellido || '',
        sexo: perfil.sexo || '',
        identidad_sexual: perfil.identidad_sexual || '',
        fecha_nacimiento: perfil.fecha_nacimiento || '',
        nacionalidad: perfil.nacionalidad || '',
        pais_residencia: perfil.pais_residencia || '',
        departamento: perfil.departamento || '',
        municipio: perfil.municipio || '',
        ciudad_residencia: perfil.ciudad_residencia || '',
        direccion_residencia: perfil.direccion_residencia || '',
        telefono: perfil.telefono || '',
        correo: perfil.correo || '',
        id_sector: perfil.id_sector || '',
        nombre_empresa: perfil.nombre_empresa || ''
      });
    }
  };

  const handleSave = async () => {
    try {
      setGuardando(true);
      setError(null);
      
      if (!perfil?.id_invitado) {
        throw new Error('No se pudo obtener el ID del invitado');
      }
      
      await actualizarPerfilInvitado(perfil.id_invitado, formData);
      setIsEditing(false);
      alert("Cambios guardados exitosamente");
      
      // Recargar perfil
      await cargarPerfil();
    } catch (err) {
      console.error('❌ Error guardando perfil:', err);
      alert(`Error al guardar: ${err.message}`);
    } finally {
      setGuardando(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
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

  // Datos del invitado para mostrar en el sidebar
  const invitadoData = perfil || {
    id_invitado: "Cargando...",
    nombres: formData.primer_nombre || "Invitado",
    apellidos: formData.primer_apellido || "Usuario",
    nombre_empresa: formData.nombre_empresa || "Cargando...",
    id_sector: formData.id_sector || "...",
    sector_nombre: sectores.find(s => s.id.toString() === formData.id_sector)?.nombre || "No especificado",
    correo: formData.correo || "",
    rol: user?.rol || "Invitado"
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
              
              <button 
                onClick={handleLogout}
                className="text-sm font-medium text-red-600 hover:text-red-700 transition-colors flex items-center gap-2"
              >
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
              {/* Estado de carga */}
              {cargando && (
                <div className="text-center py-12">
                  <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mb-4"></div>
                  <p className="text-gray-600">Cargando perfil...</p>
                </div>
              )}

              {/* Error */}
              {error && !cargando && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                  <div className="flex items-center gap-3">
                    <i className="pi pi-exclamation-triangle text-red-600 text-xl"></i>
                    <div>
                      <h3 className="text-sm font-semibold text-red-900">Error al cargar perfil</h3>
                      <p className="text-sm text-red-700 mt-1">{error}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Formulario - Solo si hay datos */}
              {!cargando && perfil && (
                <>
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
                            Primer Nombre
                          </label>
                          <input 
                            type="text"
                            name="primer_nombre"
                            value={formData.primer_nombre}
                            onChange={handleInputChange}
                            maxLength={30}
                            className={`w-full border border-gray-200 rounded-lg px-3 py-2 ${isEditing ? 'bg-white focus:outline-none focus:ring-2 focus:ring-green-500' : 'bg-gray-100'}`}
                            disabled={!isEditing}
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Segundo Nombre
                          </label>
                          <input 
                            type="text"
                            name="segundo_nombre"
                            value={formData.segundo_nombre}
                            onChange={handleInputChange}
                            maxLength={30}
                            className={`w-full border border-gray-200 rounded-lg px-3 py-2 ${isEditing ? 'bg-white focus:outline-none focus:ring-2 focus:ring-green-500' : 'bg-gray-100'}`}
                            disabled={!isEditing}
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Primer Apellido
                          </label>
                          <input 
                            type="text"
                            name="primer_apellido"
                            value={formData.primer_apellido}
                            onChange={handleInputChange}
                            maxLength={30}
                            className={`w-full border border-gray-200 rounded-lg px-3 py-2 ${isEditing ? 'bg-white focus:outline-none focus:ring-2 focus:ring-green-500' : 'bg-gray-100'}`}
                            disabled={!isEditing}
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Segundo Apellido
                          </label>
                          <input 
                            type="text"
                            name="segundo_apellido"
                            value={formData.segundo_apellido}
                            onChange={handleInputChange}
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
                            name="tipo_documento"
                            value={formData.tipo_documento}
                            onChange={handleInputChange}
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
                            value={formData.identificacion}
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
                            name="sexo"
                            value={formData.sexo}
                            onChange={handleInputChange}
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
                            name="identidad_sexual"
                            value={formData.identidad_sexual}
                            onChange={handleInputChange}
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
                            name="fecha_nacimiento"
                            value={formData.fecha_nacimiento}
                            onChange={handleInputChange}
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
                            name="nacionalidad"
                            value={formData.nacionalidad}
                            onChange={handleInputChange}
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
                            value={formData.correo}
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
                            name="telefono"
                            value={formData.telefono}
                            onChange={handleInputChange}
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
                            name="direccion_residencia"
                            value={formData.direccion_residencia}
                            onChange={handleInputChange}
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
                            name="pais_residencia"
                            value={formData.pais_residencia}
                            onChange={handleInputChange}
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
                            name="departamento"
                            value={formData.departamento}
                            onChange={handleInputChange}
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
                            name="municipio"
                            value={formData.municipio}
                            onChange={handleInputChange}
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
                            name="ciudad_residencia"
                            value={formData.ciudad_residencia}
                            onChange={handleInputChange}
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
                            name="nombre_empresa"
                            value={formData.nombre_empresa}
                            onChange={handleInputChange}
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
                            name="id_sector"
                            value={formData.id_sector}
                            onChange={handleInputChange}
                            className={`w-full border border-gray-200 rounded-lg px-3 py-2 ${isEditing ? 'bg-white focus:outline-none focus:ring-2 focus:ring-green-500' : 'bg-gray-100'}`}
                            disabled={!isEditing}
                          >
                            <option value="">Seleccionar sector</option>
                            {sectores.map(sector => (
                              <option key={sector.id} value={sector.id.toString()}>
                                {sector.nombre}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Rol en el Sistema
                          </label>
                          <input 
                            type="text"
                            value={invitadoData.rol}
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
                          disabled={guardando}
                          className="flex-1 bg-green-700 text-white py-3 rounded-lg font-semibold hover:bg-green-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {guardando ? 'Guardando...' : 'Guardar Cambios'}
                        </button>
                        <button 
                          onClick={handleCancel}
                          disabled={guardando}
                          className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Cancelar
                        </button>
                      </div>
                    )}
                  </div>
                </>
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