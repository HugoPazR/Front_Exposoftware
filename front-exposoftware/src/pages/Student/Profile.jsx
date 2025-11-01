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
    // Información personal (heredada de Usuarios)
    tipoDocumento: "",
    identificacion: "",
    nombres: "",
    apellidos: "",
    genero: "",
    identidadSexual: "",
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

  // Cargar datos del usuario desde el contexto al montar el componente
  useEffect(() => {
    if (user) {
      console.log('📋 Cargando datos del usuario en el perfil:', user);
      
      // Extraer datos del usuario (puede venir directo o dentro de user.usuario)
      const datosUsuario = user.usuario || user;
      
      // Si no tiene nombres/apellidos separados pero sí tiene nombre_completo, dividirlo
      let nombres = datosUsuario.nombres || user.nombres || "";
      let apellidos = datosUsuario.apellidos || user.apellidos || "";
      
      if (!nombres && !apellidos && (datosUsuario.nombre_completo || user.nombre_completo || user.name)) {
        const nombreCompleto = datosUsuario.nombre_completo || user.nombre_completo || user.name || "";
        const partes = nombreCompleto.trim().split(" ");
        
        // Asumir que las primeras 2 palabras son nombres y el resto apellidos
        if (partes.length >= 2) {
          nombres = partes.slice(0, 2).join(" ");
          apellidos = partes.slice(2).join(" ");
        } else if (partes.length === 1) {
          nombres = partes[0];
        }
        
        console.log('📝 Nombre dividido:', { nombres, apellidos });
      }
      
      const normalizeDateForInput = (raw) => {
        if (!raw) return "";
        try {
          const d = new Date(raw);
          if (isNaN(d)) return "";
          return d.toISOString().slice(0, 10); // yyyy-mm-dd
        } catch (e) {
          return "";
        }
      };

      setProfileData({
        tipoDocumento: datosUsuario.tipo_documento || user.tipo_documento || "",
        identificacion: datosUsuario.identificacion || user.identificacion || user.id_usuario || "",
        nombres: nombres,
        apellidos: apellidos,
        genero: datosUsuario.genero || datosUsuario.sexo || user.sexo || user.genero || "",
        identidadSexual: datosUsuario.identidad_sexual || user.identidad_sexual || "",
        fechaNacimiento: normalizeDateForInput(datosUsuario.fecha_nacimiento || user.fecha_nacimiento || ""),
        telefono: datosUsuario.telefono || user.telefono || "",
  pais: datosUsuario.pais_residencia || user.pais_residencia || "",
  nacionalidad: datosUsuario.nacionalidad || user.nacionalidad || "",
        departamentoResidencia: datosUsuario.departamento || user.departamento || "",
        ciudadResidencia: datosUsuario.ciudad_residencia || user.ciudad_residencia || "",
        direccionResidencia: datosUsuario.direccion_residencia || user.direccion_residencia || "",
        departamento: datosUsuario.departamento || user.departamento || "",
        municipio: datosUsuario.municipio || user.municipio || "",
        ciudad: datosUsuario.ciudad_residencia || user.ciudad_residencia || "",
        correo: datosUsuario.correo || user.correo || "",
  codigoPrograma: user.codigo_programa || "",
  semestre: (user.semestre !== undefined && user.semestre !== null) ? user.semestre : "",
        fechaIngreso: normalizeDateForInput(datosUsuario.fecha_ingreso || user.fecha_ingreso || ""),
        anioIngreso: user.anio_ingreso || "",
        periodo: user.periodo || "",
        rol: datosUsuario.rol || user.rol || "Estudiante"
      });
    }
  }, [user]);

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
    if (!profileData.nombres || !profileData.apellidos || !profileData.telefono) {
      alert("Por favor completa los campos obligatorios");
      return;
    }

    setLoading(true);
    
    try {
      console.log("📤 Actualizando perfil del estudiante...");
      
      // Preparar datos para enviar al backend (solo campos editables)
      const datosActualizar = {
        codigo_programa: profileData.codigoPrograma
      };

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
