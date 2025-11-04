import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import logo from "../../assets/Logo-unicesar.png";
import * as AuthService from "../../Services/AuthService";
import * as GraduateService from "../../Services/GraduateService";
import colombia from "../../data/colombia.json";

export default function GraduateProfile() {
  const navigate = useNavigate();
  const { user, getFullName, getInitials, logout, loading } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [loadingPerfil, setLoadingPerfil] = useState(true);
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });

  const [formData, setFormData] = useState({
    // Información personal
    tipo_documento: 'CC',
    identificacion: '',
    primer_nombre: '',
    segundo_nombre: '',
    primer_apellido: '',
    segundo_apellido: '',
    sexo: '',
    identidad_sexual: '',
    fecha_nacimiento: '',
    
    // Contacto
    correo: '',
    telefono: '',
    
    // Ubicación
    nacionalidad: 'Colombiana',
    pais_residencia: 'Colombia',
    departamento: '',
    municipio: '',
    ciudad_residencia: '',
    direccion_residencia: '',
    
    // Datos académicos
    codigo_programa: '',
    programa_academico: '',
    anio_graduacion: new Date().getFullYear(),
    titulo_obtenido: '',
    titulado: true
  });

  // Cargar perfil al montar
  useEffect(() => {
    const cargarPerfil = async () => {
      if (!user) {
        console.log('⏳ Esperando datos del usuario...');
        return;
      }

      try {
        setLoadingPerfil(true);
        setError(null);
        console.log('📋 Cargando perfil del egresado desde backend...');
        
        const datos = await GraduateService.obtenerMiPerfilEgresado();
        console.log('✅ Perfil cargado:', datos);
        
        setFormData(datos);
      } catch (err) {
        console.error('❌ Error al cargar perfil:', err);
        setError('No se pudo cargar el perfil. Por favor intente nuevamente.');
        
        // Si falla, usar datos básicos del contexto
        if (user) {
          setFormData(prev => ({
            ...prev,
            correo: user.correo || user.email || '',
            id_egresado: user.id_egresado || user.id_usuario || ''
          }));
        }
      } finally {
        setLoadingPerfil(false);
      }
    };

    if (!loading) {
      cargarPerfil();
    }
  }, [user, loading]);

  // Función para cerrar sesión
  const handleLogout = async () => {
    if (window.confirm('¿Está seguro de que desea cerrar sesión?')) {
      try {
        await AuthService.logout();
        console.log('✅ Sesión cerrada exitosamente');
        navigate('/login');
      } catch (error) {
        console.error('❌ Error al cerrar sesión:', error);
        // Aunque falle, redirigir al login
        navigate('/login');
      }
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
    setError(null);
    setSuccess(null);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setError(null);
    setSuccess(null);
    // Recargar datos originales
    window.location.reload();
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = async () => {
    try {
      setGuardando(true);
      setError(null);
      setSuccess(null);

      console.log('💾 Guardando cambios del perfil...');
      
      // Preparar datos para el backend
      const payload = GraduateService.prepararDatosParaBackend(formData);
      
      // Actualizar perfil
      const idEgresado = formData.id_egresado || user.id_egresado || user.id_usuario;
      const perfilActualizado = await GraduateService.actualizarPerfilEgresado(idEgresado, payload);
      
      console.log('✅ Perfil actualizado:', perfilActualizado);
      
      setFormData(perfilActualizado);
      setIsEditing(false);
      setSuccess('✅ Perfil actualizado exitosamente');
      
      // Limpiar mensaje después de 3 segundos
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      console.error('❌ Error al guardar:', err);
      setError(`Error al actualizar el perfil: ${err.message}`);
    } finally {
      setGuardando(false);
    }
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

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <span className="text-green-600 font-bold text-lg">{getInitials()}</span>
                </div>
                <div className="hidden md:block">
                  <p className="text-sm font-medium text-gray-900">{getFullName()}</p>
                  <p className="text-xs text-gray-500">Egresado</p>
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
          {/* Sidebar (reuse simplified from Dashboard) */}
          <aside className="lg:col-span-1">
            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <nav className="space-y-1">
                <Link to="/graduate/dashboard" className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50">
                  <i className="pi pi-home text-base"></i>
                  Dashboard
                </Link>
                <Link to="/graduate/proyectos" className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50">
                  <i className="pi pi-briefcase text-base"></i>
                  Mis Proyectos
                </Link>
                <Link to="/graduate/profile" className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 bg-green-50 text-green-700">
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
                  <h2 className="text-xl font-bold text-gray-900">Perfil Profesional</h2>
                  <p className="text-sm text-gray-500">Actualiza tu información profesional y de contacto.</p>
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

              {/* Mensajes de éxito/error */}
              {success && (
                <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm">
                  {success}
                </div>
              )}
              {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                  {error}
                </div>
              )}

              {loadingPerfil ? (
                <div className="text-center py-12">
                  <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
                  <p className="mt-4 text-gray-600">Cargando perfil...</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Información Personal */}
                  <div className="border-b pb-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <i className="pi pi-user text-green-600"></i>
                      Información Personal
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                          <option value="TI">Tarjeta de Identidad</option>
                          <option value="CE">Cédula de Extranjería</option>
                          <option value="PA">Pasaporte</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Identificación</label>
                        <input 
                          type="text"
                          name="identificacion"
                          value={formData.identificacion}
                          onChange={handleChange}
                          className={`w-full border border-gray-200 rounded-lg px-3 py-2 ${isEditing ? 'focus:outline-none focus:ring-2 focus:ring-green-500' : 'bg-gray-100'}`}
                          disabled={!isEditing}
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Primer Nombre</label>
                        <input 
                          type="text"
                          name="primer_nombre"
                          value={formData.primer_nombre}
                          onChange={handleChange}
                          className={`w-full border border-gray-200 rounded-lg px-3 py-2 ${isEditing ? 'focus:outline-none focus:ring-2 focus:ring-green-500' : 'bg-gray-100'}`}
                          disabled={!isEditing}
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Segundo Nombre</label>
                        <input 
                          type="text"
                          name="segundo_nombre"
                          value={formData.segundo_nombre}
                          onChange={handleChange}
                          className={`w-full border border-gray-200 rounded-lg px-3 py-2 ${isEditing ? 'focus:outline-none focus:ring-2 focus:ring-green-500' : 'bg-gray-100'}`}
                          disabled={!isEditing}
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Primer Apellido</label>
                        <input 
                          type="text"
                          name="primer_apellido"
                          value={formData.primer_apellido}
                          onChange={handleChange}
                          className={`w-full border border-gray-200 rounded-lg px-3 py-2 ${isEditing ? 'focus:outline-none focus:ring-2 focus:ring-green-500' : 'bg-gray-100'}`}
                          disabled={!isEditing}
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Segundo Apellido</label>
                        <input 
                          type="text"
                          name="segundo_apellido"
                          value={formData.segundo_apellido}
                          onChange={handleChange}
                          className={`w-full border border-gray-200 rounded-lg px-3 py-2 ${isEditing ? 'focus:outline-none focus:ring-2 focus:ring-green-500' : 'bg-gray-100'}`}
                          disabled={!isEditing}
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Sexo</label>
                        <select 
                          name="sexo"
                          value={formData.sexo}
                          onChange={handleChange}
                          className={`w-full border border-gray-200 rounded-lg px-3 py-2 ${isEditing ? 'focus:outline-none focus:ring-2 focus:ring-green-500' : 'bg-gray-100'}`}
                          disabled={!isEditing}
                        >
                          <option value="">Seleccionar...</option>
                          <option value="M">Masculino</option>
                          <option value="F">Femenino</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Identidad Sexual</label>
                        <input 
                          type="text"
                          name="identidad_sexual"
                          value={formData.identidad_sexual}
                          onChange={handleChange}
                          className={`w-full border border-gray-200 rounded-lg px-3 py-2 ${isEditing ? 'focus:outline-none focus:ring-2 focus:ring-green-500' : 'bg-gray-100'}`}
                          disabled={!isEditing}
                        />
                      </div>

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

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Nacionalidad</label>
                        <input 
                          type="text"
                          name="nacionalidad"
                          value={formData.nacionalidad}
                          onChange={handleChange}
                          className={`w-full border border-gray-200 rounded-lg px-3 py-2 ${isEditing ? 'focus:outline-none focus:ring-2 focus:ring-green-500' : 'bg-gray-100'}`}
                          disabled={!isEditing}
                        />
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
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Correo Electrónico</label>
                        <input 
                          type="email"
                          name="correo"
                          value={formData.correo}
                          onChange={handleChange}
                          className={`w-full border border-gray-200 rounded-lg px-3 py-2 ${isEditing ? 'focus:outline-none focus:ring-2 focus:ring-green-500' : 'bg-gray-100'}`}
                          disabled={!isEditing}
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Teléfono</label>
                        <input 
                          type="tel"
                          name="telefono"
                          value={formData.telefono}
                          onChange={handleChange}
                          className={`w-full border border-gray-200 rounded-lg px-3 py-2 ${isEditing ? 'focus:outline-none focus:ring-2 focus:ring-green-500' : 'bg-gray-100'}`}
                          disabled={!isEditing}
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
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">País de Residencia</label>
                        <input 
                          type="text"
                          name="pais_residencia"
                          value={formData.pais_residencia}
                          onChange={handleChange}
                          className={`w-full border border-gray-200 rounded-lg px-3 py-2 ${isEditing ? 'focus:outline-none focus:ring-2 focus:ring-green-500' : 'bg-gray-100'}`}
                          disabled={!isEditing}
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Departamento</label>
                        <input 
                          type="text"
                          name="departamento"
                          value={formData.departamento}
                          onChange={handleChange}
                          className={`w-full border border-gray-200 rounded-lg px-3 py-2 ${isEditing ? 'focus:outline-none focus:ring-2 focus:ring-green-500' : 'bg-gray-100'}`}
                          disabled={!isEditing}
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Municipio/Ciudad</label>
                        <input 
                          type="text"
                          name="municipio"
                          value={formData.municipio}
                          onChange={handleChange}
                          className={`w-full border border-gray-200 rounded-lg px-3 py-2 ${isEditing ? 'focus:outline-none focus:ring-2 focus:ring-green-500' : 'bg-gray-100'}`}
                          disabled={!isEditing}
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Dirección de Residencia</label>
                        <input 
                          type="text"
                          name="direccion_residencia"
                          value={formData.direccion_residencia}
                          onChange={handleChange}
                          className={`w-full border border-gray-200 rounded-lg px-3 py-2 ${isEditing ? 'focus:outline-none focus:ring-2 focus:ring-green-500' : 'bg-gray-100'}`}
                          disabled={!isEditing}
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

                      <div className="md:col-span-2">
                        <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                          <input 
                            type="checkbox"
                            name="titulado"
                            checked={formData.titulado}
                            onChange={(e) => setFormData(prev => ({ ...prev, titulado: e.target.checked }))}
                            className="w-4 h-4 text-green-600 rounded focus:ring-green-500"
                            disabled={!isEditing}
                          />
                          <span>Titulado (Grado completado)</span>
                        </label>
                      </div>
                    </div>
                  </div>

                  {/* Seguridad */}
                  <div className="pb-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <i className="pi pi-lock text-green-600"></i>
                      Seguridad
                    </h3>
                    <div className="flex items-center gap-4">
                      <div className="flex-1">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Contraseña</label>
                        <input 
                          type="password" 
                          defaultValue="********" 
                          className="w-full border border-gray-200 rounded-lg px-3 py-2 bg-gray-100" 
                          readOnly 
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
                        className="flex-1 bg-green-700 text-white py-3 rounded-lg font-semibold hover:bg-green-800 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
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
