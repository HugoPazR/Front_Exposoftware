import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import * as StudentProfileService from "../../Services/StudentProfileService";
import countryList from 'react-select-country-list';
import logo from "../../assets/Logo-unicesar.png";
import colombiaData from "../../data/colombia.json";
import StudentProfileForm from "./StudentProfileForm";

export default function Profile() {
  const { user, getFullName, getInitials, updateUser, logout } = useAuth();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });

  // Datos del perfil del estudiante - Inicializados desde el contexto
  const [profileData, setProfileData] = useState({
    // Información personal (heredada de Usuarios) - Campos separados
    tipoDocumento: "",
    identificacion: "",
    primer_nombre: "",
    segundo_nombre: "",
    primer_apellido: "",
    segundo_apellido: "",
    sexo: "",
    identidad_sexual: "",
    fechaNacimiento: "",
    telefono: "",
    
    // Ubicación y residencia
    pais: "",
    nacionalidad: "",
    departamentoResidencia: "",
    ciudadResidencia: "",
    direccionResidencia: "",
    departamento: "",
    municipio: "",
    ciudad: "",
    
    // Información académica
    correo: "",
    codigoPrograma: "",
    semestre: 0,
    fechaIngreso: "",
    anioIngreso: "",
    periodo: "",
    
    // Estado
    rol: "Estudiante"
  });

  // Estados para selectores dinámicos
  const [opcionesPaises, setOpcionesPaises] = useState([]);
  const [ciudadesResidencia, setCiudadesResidencia] = useState([]);
  const [municipios, setMunicipios] = useState([]);

  // 🔥 Cargar perfil desde el backend al montar el componente
  useEffect(() => {
    const cargarPerfilDesdeBackend = async () => {
      setLoading(true);
      try {
        console.log('🔄 Cargando perfil desde el backend...');
        const resultado = await StudentProfileService.obtenerMiPerfil();
        
        if (resultado.success && resultado.data) {
          console.log('✅ Perfil del backend obtenido:', resultado.data);
          
          // Procesar los datos del perfil
          const perfilProcesado = StudentProfileService.procesarDatosPerfil(resultado.data);
          console.log('📦 Perfil procesado:', perfilProcesado);
          
          // Actualizar el contexto con los datos del backend
          updateUser(perfilProcesado);
          
          // Actualizar el formulario con los datos procesados
          const normalizeDateForInput = (raw) => {
            if (!raw) return "";
            try {
              const d = new Date(raw);
              if (isNaN(d)) return "";
              return d.toISOString().slice(0, 10);
            } catch (e) {
              return "";
            }
          };

          setProfileData({
            tipoDocumento: perfilProcesado.tipo_documento || "",
            identificacion: perfilProcesado.identificacion || "",
            primer_nombre: perfilProcesado.primer_nombre || "",
            segundo_nombre: perfilProcesado.segundo_nombre || "",
            primer_apellido: perfilProcesado.primer_apellido || "",
            segundo_apellido: perfilProcesado.segundo_apellido || "",
            sexo: perfilProcesado.sexo || "",
            identidad_sexual: perfilProcesado.identidad_sexual || "",
            fechaNacimiento: normalizeDateForInput(perfilProcesado.fecha_nacimiento),
            telefono: perfilProcesado.telefono || "",
            pais: perfilProcesado.pais_residencia || "",
            nacionalidad: perfilProcesado.nacionalidad || "",
            departamentoResidencia: perfilProcesado.departamento || "",
            ciudadResidencia: perfilProcesado.ciudad_residencia || "",
            direccionResidencia: perfilProcesado.direccion_residencia || "",
            departamento: perfilProcesado.departamento || "",
            municipio: perfilProcesado.municipio || "",
            ciudad: perfilProcesado.ciudad_residencia || "",
            correo: perfilProcesado.correo || "",
            codigoPrograma: perfilProcesado.codigo_programa || "",
            semestre: perfilProcesado.semestre || "",
            fechaIngreso: normalizeDateForInput(perfilProcesado.fecha_ingreso),
            anio_ingreso: perfilProcesado.anio_ingreso || "",
            periodo: perfilProcesado.periodo || "",
            rol: perfilProcesado.rol || "Estudiante"
          });
        }
      } catch (error) {
        console.error('❌ Error al cargar perfil desde backend:', error);
        // Si falla, intentar cargar desde el contexto
        console.log('⚠️ Cargando desde contexto como fallback...');
      } finally {
        setLoading(false);
      }
    };

    cargarPerfilDesdeBackend();
  }, []); // Solo al montar

  // ⚠️ COMENTADO: Ahora cargamos directamente desde el backend
  // // Cargar datos del usuario desde el contexto al montar el componente
  // useEffect(() => {
  //   if (user) {
  //     console.log('📋 Cargando datos del usuario en el perfil:', user);
  //     ... código comentado ...
  //   }
  // }, [user]);

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

  const handleLogout = async () => {
    try {
      console.log("🚪 Cerrando sesión del estudiante...");
      await logout();
      navigate("/login");
    } catch (error) {
      console.error("❌ Error al cerrar sesión:", error);
      alert("❌ Error al cerrar sesión");
    }
  };

  const handleSave = async () => {
    // Validaciones básicas
    if (!profileData.primer_nombre || !profileData.primer_apellido || !profileData.telefono) {
      alert("Por favor completa los campos obligatorios (primer nombre, primer apellido y teléfono)");
      return;
    }

    setLoading(true);
    
    try {
      console.log("📤 Actualizando perfil del estudiante...");
      
      // Preparar datos para enviar al backend
      const datosActualizar = {
        // Datos del usuario
        tipo_documento: profileData.tipoDocumento,
        primer_nombre: profileData.primer_nombre,
        segundo_nombre: profileData.segundo_nombre || '',
        primer_apellido: profileData.primer_apellido,
        segundo_apellido: profileData.segundo_apellido || '',
        sexo: profileData.sexo, // El backend espera "sexo" pero el frontend usa "genero"
        identidad_sexual: profileData.identidad_sexual || '',
        fecha_nacimiento: profileData.fechaNacimiento,
        telefono: profileData.telefono,
        nacionalidad: profileData.nacionalidad,
        pais_residencia: profileData.pais,
        departamento: profileData.departamento,
        municipio: profileData.municipio,
        ciudad_residencia: profileData.ciudad,
        direccion_residencia: profileData.direccionResidencia,
        
        // Datos del estudiante
        codigo_programa: profileData.codigoPrograma,
        semestre: parseInt(profileData.semestre) || 0,
        anio_ingreso: parseInt(profileData.anioIngreso) || new Date().getFullYear()
      };

      console.log("📦 Datos a enviar:", datosActualizar);

      const resultado = await StudentProfileService.actualizarMiPerfil(datosActualizar);
      
      if (resultado.success) {
        console.log("✅ Perfil actualizado exitosamente");
        
        // Actualizar el contexto con los nuevos datos
        if (resultado.data) {
          const perfilProcesado = StudentProfileService.procesarDatosPerfil(resultado.data);
          updateUser(perfilProcesado);
        }
        
        setIsEditing(false);
        alert("✅ Cambios guardados exitosamente");
      }
    } catch (error) {
      console.error("❌ Error al guardar perfil:", error);
      alert("❌ Error al guardar: " + error.message);
    } finally {
      setLoading(false);
    }
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
    
    // Validaciones
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

    // Aquí iría la lógica para cambiar la contraseña en el backend
    alert("Contraseña cambiada exitosamente");
    handleClosePasswordModal();
  };

  // Mostrar indicador de carga mientras se obtiene el perfil
  if (loading && !profileData.identificacion) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando perfil...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header (same style as Dashboard) */}
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
                <div className="w-10 h-10 bg-teal-100 rounded-full flex items-center justify-center">
                  <span className="text-teal-600 font-bold text-lg">{getInitials()}</span>
                </div>
                <div className="hidden sm:block">
                  <p className="text-sm font-medium text-gray-900">{getFullName()}</p>
                  <p className="text-xs text-gray-500">Estudiante</p>
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
                <Link to="/student/dashboard" className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50">
                  <i className="pi pi-home text-base"></i>
                  Dashboard
                </Link>
                <Link to="/student/proyectos" className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50">
                  <i className="pi pi-book text-base"></i>
                  Mis Proyectos
                </Link>
                <Link to="/student/configuracion" className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 bg-teal-50 text-teal-700">
                  <i className="pi pi-cog text-base"></i>
                  Configuración
                </Link>
              </nav>
            </div>
          </aside>

          {/* Main content: Form de configuración de perfil */}
          <main className="lg:col-span-3">
            {/* Alerta si el perfil está incompleto */}
            {(!profileData.primer_nombre || !profileData.primer_apellido) && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                <div className="flex items-start gap-3">
                  <i className="pi pi-exclamation-triangle text-yellow-600 text-xl mt-0.5"></i>
                  <div>
                    <h4 className="font-semibold text-yellow-800 mb-1">Perfil Incompleto</h4>
                    <p className="text-sm text-yellow-700">
                      Tu perfil no tiene información completa. Por favor, haz clic en <strong>"Editar Perfil"</strong> y completa al menos tu <strong>nombre</strong> y <strong>apellido</strong>.
                    </p>
                  </div>
                </div>
              </div>
            )}

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

              {/* Formulario de Perfil */}
              <StudentProfileForm
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
