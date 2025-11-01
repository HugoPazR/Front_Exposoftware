import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { getTeacherProfile, procesarDatosDocente } from "../../Services/TeacherService.jsx";
import countryList from 'react-select-country-list';
import colombiaData from "../../data/colombia.json";
import logo from "../../assets/Logo-unicesar.png";
import ProfileForm from "./ProfileForm";

export default function TeacherProfile() {
  const { user, getFullName, getInitials, logout } = useAuth();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });

  // Estado del perfil del docente - Valores por defecto
  const [profileData, setProfileData] = useState({
    // Campos propios de Docentes
    id_docente: "",
    id_usuario: "",
    categoria_docente: "Interno",
    codigo_programa: "",
    
    // Campos heredados de Usuarios
    tipo_documento: "CC",
    identificacion: "",
    nombres: "",
    apellidos: "",
    genero: "",
    identidad_sexual: "",
    fecha_nacimiento: "",
    telefono: "",
    
    // Ubicación
    pais: "CO",
    nacionalidad: "",
    departamento_residencia: "",
    ciudad_residencia: "",
    direccion_residencia: "",
    departamento: "",
    municipio: "",
    ciudad: "",
    
    // Institucional
    correo: "",
    anio_ingreso: new Date().getFullYear(),
    periodo: 1,
    rol: "Docente"
  });

  // Estados para los selectores dinámicos
  const [opcionesPaises, setOpcionesPaises] = useState([]);
  const [ciudadesResidencia, setCiudadesResidencia] = useState([]);
  const [municipios, setMunicipios] = useState([]);

  // Cargar información del docente desde el backend
  useEffect(() => {
    const loadTeacherProfile = async () => {
      try {
        setLoading(true);
        setError(null);
        
        console.log('📋 Cargando perfil del docente desde backend...');
        const datosCrudos = await getTeacherProfile();
        
        // Procesar los datos
        const datosProcesados = procesarDatosDocente(datosCrudos);
        console.log('✅ Perfil procesado:', datosProcesados);
        
        // Establecer los datos en el estado
        setProfileData(datosProcesados);
      } catch (err) {
        console.error('❌ Error al cargar perfil:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadTeacherProfile();
  }, []);

  // Inicializar opciones de países
  useEffect(() => {
    const paises = countryList().getData();
    setOpcionesPaises(paises);
  }, []);

  // Actualizar ciudades de residencia cuando cambia el departamento de residencia
  useEffect(() => {
    if (profileData.departamento_residencia) {
      const dept = colombiaData.find(d => d.departamento === profileData.departamento_residencia);
      if (dept) {
        setCiudadesResidencia(dept.ciudades || []);
      }
    } else {
      setCiudadesResidencia([]);
    }
  }, [profileData.departamento_residencia]);

  // Actualizar municipios cuando cambia el departamento
  useEffect(() => {
    if (profileData.departamento) {
      const dept = colombiaData.find(d => d.departamento === profileData.departamento);
      if (dept) {
        setMunicipios(dept.ciudades || []);
      }
    } else {
      setMunicipios([]);
    }
  }, [profileData.departamento]);

  const handleInputChange = (field, value) => {
    setProfileData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    // Aquí podrías recargar los datos originales si es necesario
  };

  const handleSave = () => {
    // Validaciones básicas
    if (!profileData.nombres || !profileData.apellidos) {
      alert("Los nombres y apellidos son obligatorios");
      return;
    }

    if (!profileData.telefono) {
      alert("El teléfono es obligatorio");
      return;
    }

    // Aquí enviarías los datos al backend
    console.log("Datos a guardar:", profileData);
    
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

  const handleLogout = async () => {
    try {
      console.log("🚪 Cerrando sesión del docente...");
      await logout();
      navigate("/login");
    } catch (error) {
      console.error("❌ Error al cerrar sesión:", error);
      alert("❌ Error al cerrar sesión");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header - mismo que dashboard */}
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

            {/* Action button then user quick badge (avatar + name) */}
            <div className="flex items-center gap-4">

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center">
                  <span className="text-emerald-600 font-bold text-lg">
                    {getInitials()}
                  </span>
                </div>
                <div className="hidden md:block">
                  <p className="text-sm font-medium text-gray-900">{getFullName()}</p>
                  <p className="text-xs text-gray-500">Docente</p>
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
                  to="/teacher/dashboard"
                  className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors text-gray-700 hover:bg-gray-50"
                >
                  <i className="pi pi-home text-base"></i>
                  Dashboard
                </Link>
                <Link
                  to="/teacher/proyectos"
                  className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors text-gray-700 hover:bg-gray-50"
                >
                  <i className="pi pi-book text-base"></i>
                  Proyectos Estudiantiles
                </Link>
                <Link
                  to="/teacher/profile"
                  className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors bg-emerald-50 text-emerald-700"
                >
                  <i className="pi pi-cog text-base"></i>
                  Configuración
                </Link>
              </nav>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 p-4 mt-4">
              <div className="text-center">
                <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-emerald-600 font-bold text-2xl">
                    {getInitials()}
                  </span>
                </div>
                <h3 className="font-semibold text-gray-900">{getFullName()}</h3>
                <p className="text-sm text-gray-500">Docente</p>
                <p className="text-xs text-gray-400 mt-1">Categoría: {profileData.categoria_docente}</p>
              </div>
            </div>
          </aside>

          {/* Main content: Configuración de Perfil */}
          <main className="lg:col-span-3">
            <div className="bg-white rounded-lg border border-gray-200 p-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Configuración de Perfil</h2>
                {!isEditing && !loading && (
                  <button 
                    onClick={handleEdit}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm font-medium hover:bg-emerald-700 transition-colors"
                  >
                    <i className="pi pi-pencil"></i>
                    Editar Perfil
                  </button>
                )}
              </div>

              {/* Estado de carga */}
              {loading && (
                <div className="flex items-center justify-center py-12">
                  <div className="text-center">
                    <div className="inline-block">
                      <div className="w-12 h-12 border-4 border-gray-200 border-t-emerald-600 rounded-full animate-spin"></div>
                    </div>
                    <p className="mt-4 text-gray-600">Cargando información del perfil...</p>
                  </div>
                </div>
              )}

              {/* Estado de error */}
              {error && !loading && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                  <div className="flex items-center gap-3">
                    <i className="pi pi-exclamation-circle text-red-600 text-lg"></i>
                    <div>
                      <h3 className="font-semibold text-red-900">Error al cargar el perfil</h3>
                      <p className="text-sm text-red-700 mt-1">{error}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Formulario de Perfil - Solo mostrar cuando no hay carga y no hay error */}
              {!loading && !error && (
                <>
              <ProfileForm
                profileData={profileData}
                isEditing={isEditing}
                opcionesPaises={opcionesPaises}
                ciudadesResidencia={ciudadesResidencia}
                municipios={municipios}
                colombiaData={colombiaData}
                handleInputChange={handleInputChange}
              />

              {/* Seguridad */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-6 pb-3 border-b border-gray-200 flex items-center gap-2">
                  <span>🔒</span> Seguridad
                </h3>

                <div className="space-y-4 max-w-2xl">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Contraseña
                    </label>
                    <input 
                      type="password" 
                      value="********" 
                      disabled
                      className="w-full border border-gray-300 rounded-lg px-4 py-2 bg-gray-50 text-gray-500"
                    />
                  </div>

                  <div>
                    <button 
                      onClick={handleOpenPasswordModal}
                      className="inline-flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg text-sm hover:bg-gray-50 transition-colors"
                    >
                      <i className="pi pi-lock"></i>
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
                    className="bg-emerald-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-emerald-700 transition-colors"
                  >
                    Guardar Cambios
                  </button>
                </div>
              )}
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
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
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
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
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
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
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
                  className="flex-1 px-4 py-2 bg-emerald-600 text-white rounded-lg font-semibold hover:bg-emerald-700 transition-colors"
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
