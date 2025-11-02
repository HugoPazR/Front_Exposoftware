import { Link, useNavigate } from "react-router-dom";
import Select from 'react-select';
import { useState, useEffect, useMemo } from 'react';
import logo from "../../assets/Logo-unicesar.png";
import AdminSidebar from "../../components/Layout/AdminSidebar";
import * as AuthService from "../../Services/AuthService";
import countryList from "react-select-country-list";
import colombia from "../../assets/colombia-json-master/colombia.json";
import { 
  useTeacherManagement,
  TIPOS_DOCUMENTO,
  GENEROS,
  IDENTIDADES_SEXUALES,
  CATEGORIAS_DOCENTE,
} from "./useTeacherManagement";
import EditTeacherModal from "./EditTeacherModal";
import { 
  validateField, 
  filterInput, 
  hasErrors 
} from "../../utils/teacherValidations";
import { API_ENDPOINTS } from "../../utils/constants";

export default function CreateTeacher() {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  
  // Estado para mostrar mensaje de éxito
  const [successMessage, setSuccessMessage] = useState("");
  
  // Estado para programas académicos
  const [programas, setProgramas] = useState([]);
  const [loadingProgramas, setLoadingProgramas] = useState(false);
  
  // Opciones de países usando react-select-country-list (igual que Register)
  const options = useMemo(() => countryList().getData(), []);
  
  // Estado para municipios dinámicos según departamento seleccionado
  const [municipiosDisponibles, setMunicipiosDisponibles] = useState([]);
  
  // Cargar datos del usuario autenticado
  useEffect(() => {
    const user = AuthService.getUserData();
    if (user) {
      setUserData(user);
    }
  }, []);

  // Obtener nombre del usuario
  const getUserName = () => {
    if (!userData) return 'Usuario';
    return userData.nombre || userData.nombres || userData.correo?.split('@')[0] || 'Usuario';
  };

  const getUserInitials = () => {
    const name = getUserName();
    return name.charAt(0).toUpperCase();
  };

  // Función para cerrar sesión
  const handleLogout = async () => {
    if (window.confirm('¿Está seguro de que desea cerrar sesión?')) {
      try {
        await AuthService.logout();
        navigate('/login');
      } catch (error) {
        console.error('❌ Error al cerrar sesión:', error);
      }
    }
  };

  // Estado para tabs
  const [activeTab, setActiveTab] = useState("crear"); // crear | editar

  // Estado para errores de validación
  const [errors, setErrors] = useState({});

  const {
    // Estados del formulario - Usuario (heredados)
    tipoDocumento,
    setTipoDocumento,
    identificacion,
    setIdentificacion,
    // Nombres y apellidos separados
    primerNombre,
    setPrimerNombre,
    segundoNombre,
    setSegundoNombre,
    primerApellido,
    setPrimerApellido,
    segundoApellido,
    setSegundoApellido,
    genero,
    setGenero,
    identidadSexual,
    setIdentidadSexual,
    fechaNacimiento,
    setFechaNacimiento,
    nacionalidad,
    setNacionalidad,
    pais,
    setPais,
    departamento,
    setDepartamento,
    municipio,
    setMunicipio,
    ciudadResidencia,
    setCiudadResidencia,
    direccionResidencia,
    setDireccionResidencia,
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
    // Estados para municipios dinámicos
    municipios,
    // Opciones de países/nacionalidades
    opcionesPaises,
    // Estados de edición
    isEditing,
    showEditModal,
  loading,
  serverError,
    // Funciones
    handleSubmit,
    handleEdit,
    handleSaveEdit,
    handleCancelEdit,
    handleDelete,
    handleCancel,
  } = useTeacherManagement();
  
  // Efecto para actualizar municipios cuando cambia el departamento
  // DEBE estar DESPUÉS de useTeacherManagement para acceder a departamento y municipio
  useEffect(() => {
    if (departamento) {
      // Buscar el departamento en el array de Colombia
      const deptoEncontrado = colombia.find((d) => d.departamento === departamento);
      
      if (deptoEncontrado && Array.isArray(deptoEncontrado.ciudades)) {
        setMunicipiosDisponibles(deptoEncontrado.ciudades);
        
        // Si el municipio actual no está en la lista, limpiarlo
        if (municipio && !deptoEncontrado.ciudades.includes(municipio)) {
          setMunicipio("");
        }
      } else {
        setMunicipiosDisponibles([]);
        setMunicipio("");
      }
    } else {
      setMunicipiosDisponibles([]);
      setMunicipio("");
    }
  }, [departamento, municipio, setMunicipio]);

  // Cargar programas académicos al montar el componente
  useEffect(() => {
    const cargarProgramas = async () => {
      setLoadingProgramas(true);
      try {
        // Primero cargar las facultades
        const facultadesResponse = await fetch(API_ENDPOINTS.FACULTADES, {
          method: 'GET',
          headers: AuthService.getAuthHeaders(),
        });

        if (!facultadesResponse.ok) {
          throw new Error(`Error ${facultadesResponse.status}: ${facultadesResponse.statusText}`);
        }

        const facultadesData = await facultadesResponse.json();
        console.log('✅ Facultades cargadas:', facultadesData);
        console.log('📊 Tipo de datos:', typeof facultadesData);
        console.log('📊 Es array:', Array.isArray(facultadesData));
        
        // Manejar diferentes estructuras de respuesta
        let facultades = [];
        if (Array.isArray(facultadesData)) {
          facultades = facultadesData;
        } else if (facultadesData && typeof facultadesData === 'object') {
          // Si es un objeto, buscar la propiedad que contenga el array
          facultades = facultadesData.facultades || facultadesData.data || facultadesData.results || [];
        }

        console.log('📚 Total de facultades:', facultades.length);
        console.log('🔍 Primera facultad:', facultades[0]);

        // Cargar programas de cada facultad
        const todasLosProgramas = [];
        
        for (const facultad of facultades) {
          const facultadId = facultad.id_facultad || facultad.id;
          console.log(`🔄 Cargando programas de facultad: ${facultad.nombre_facultad} (${facultadId})`);
          
          try {
            const url = API_ENDPOINTS.PROGRAMAS_BY_FACULTAD(facultadId);
            console.log(`📡 URL: ${url}`);
            
            const programasResponse = await fetch(url, {
              method: 'GET',
              headers: AuthService.getAuthHeaders(),
            });

            console.log(`📊 Status programas facultad ${facultadId}:`, programasResponse.status);

            if (programasResponse.ok) {
              const programasData = await programasResponse.json();
              console.log(`📦 Datos programas facultad ${facultadId}:`, programasData);
              
              // Manejar diferentes estructuras de respuesta para programas
              let programasFacultad = [];
              if (Array.isArray(programasData)) {
                programasFacultad = programasData;
              } else if (programasData && typeof programasData === 'object') {
                programasFacultad = programasData.programas || programasData.data || programasData.results || [];
              }
              
              if (programasFacultad.length > 0) {
                console.log(`✅ Facultad ${facultad.nombre_facultad}: ${programasFacultad.length} programas`);
                todasLosProgramas.push(...programasFacultad);
              }
            }
          } catch (error) {
            console.warn(`⚠️ Error cargando programas de facultad ${facultadId}:`, error);
          }
        }

        console.log('✅ Total de programas cargados:', todasLosProgramas.length);
        console.log('🔍 Primer programa:', todasLosProgramas[0]);
        setProgramas(todasLosProgramas);
      } catch (error) {
        console.error("❌ Error al cargar programas:", error);
        setProgramas([]);
      } finally {
        setLoadingProgramas(false);
      }
    };

    cargarProgramas();
  }, []);
  

  // Función para manejar cambios con validación
  const handleInputChange = (fieldName, value, setter) => {
    // Filtrar entrada según el tipo de campo
    const filteredValue = filterInput(fieldName, value);
    setter(filteredValue);

    // Validar el campo - combinar nombres para validación
    const nombresCompletos = fieldName === 'primerNombre' || fieldName === 'segundoNombre' 
      ? `${fieldName === 'primerNombre' ? value : primerNombre} ${fieldName === 'segundoNombre' ? value : segundoNombre}`.trim()
      : `${primerNombre} ${segundoNombre}`.trim();
    
    const apellidosCompletos = fieldName === 'primerApellido' || fieldName === 'segundoApellido'
      ? `${fieldName === 'primerApellido' ? value : primerApellido} ${fieldName === 'segundoApellido' ? value : segundoApellido}`.trim()
      : `${primerApellido} ${segundoApellido}`.trim();

    const formData = {
      nombres: nombresCompletos,
      apellidos: apellidosCompletos,
      identificacion,
      telefono,
      correo,
      fechaNacimiento,
      ciudadResidencia,
      municipio,
      codigoPrograma,
      categoriaDocente,
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
    
    console.log('🚀 Formulario enviado');
    console.log('📋 Categoría Docente:', categoriaDocente);
    console.log('📋 Código Programa:', codigoPrograma);

    // Combinar nombres y apellidos para validación
    const nombresCompletos = `${primerNombre} ${segundoNombre}`.trim();
    const apellidosCompletos = `${primerApellido} ${segundoApellido}`.trim();

    // Crear objeto con todos los datos del formulario
    const formData = {
      nombres: nombresCompletos,
      apellidos: apellidosCompletos,
      identificacion,
      telefono,
      correo,
      fechaNacimiento,
      ciudadResidencia,
      municipio,
      codigoPrograma,
      tipoDocumento,
      genero,
      identidadSexual,
      nacionalidad,
      pais,
      departamento,
      direccionResidencia,
      categoriaDocente,
      activo,
    };

    console.log('📦 Datos del formulario:', formData);

    // Validar todos los campos requeridos
    const newErrors = {};
    Object.keys(formData).forEach(key => {
      const error = validateField(key, formData[key], formData);
      if (error) {
        newErrors[key] = error;
      }
    });

    console.log('❌ Errores encontrados:', newErrors);
    console.log('❌ Cantidad de errores:', Object.keys(newErrors).length);
    
    // Mostrar cada error específico
    Object.keys(newErrors).forEach(campo => {
      console.log(`   ⚠️ Campo "${campo}": ${newErrors[campo]}`);
    });
    
    setErrors(newErrors);

    // Si hay errores, no enviar el formulario
    if (hasErrors(newErrors)) {
      console.log('⛔ Formulario NO enviado - hay errores de validación');
      // Scroll al primer error
      const firstErrorField = Object.keys(newErrors)[0];
      const element = document.querySelector(`[name="${firstErrorField}"]`);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        element.focus();
      }
      return;
    }

    console.log('✅ Validación pasada - enviando al servidor');
    
    // Si no hay errores, proceder con el envío con callback de éxito
    handleSubmit(e, (message) => {
      setSuccessMessage(message);
      // Auto-ocultar el mensaje después de 4 segundos
      setTimeout(() => setSuccessMessage(""), 4000);
    });
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
                <span className="text-sm text-gray-700 hidden sm:block">{getUserName()}</span>
                <div className="w-10 h-10 bg-teal-100 rounded-full flex items-center justify-center">
                  <span className="text-teal-600 font-bold text-lg">{getUserInitials()}</span>
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

          {/* Sidebar Component */}
          <AdminSidebar userName={getUserName()} userRole="Administrador" />

          {/* Main Content */}
          <main className="lg:col-span-3">
            {/* Tabs de navegación */}
            <div className="bg-white rounded-lg border border-gray-200 p-2 mb-6">
              <div className="flex gap-2">
                <button
                  onClick={() => setActiveTab("crear")}
                  className={`flex-1 px-4 py-2.5 rounded-lg text-sm font-semibold transition ${
                    activeTab === "crear"
                      ? "bg-teal-600 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  ➕ Crear Profesor
                </button>
                <button
                  onClick={() => setActiveTab("editar")}
                  className={`flex-1 px-4 py-2.5 rounded-lg text-sm font-semibold transition ${
                    activeTab === "editar"
                      ? "bg-teal-600 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  ✏️ Editar Profesores
                </button>
              </div>
            </div>

            {/* ========== TAB 1: CREAR PROFESOR ========== */}
            {activeTab === "crear" && (
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
                {/* Mensaje de éxito del servidor */}
                {successMessage && (
                  <div className="p-4 mb-4 rounded-lg bg-green-50 border border-green-200 text-green-700 flex items-start gap-3">
                    <i className="pi pi-check-circle flex-shrink-0 mt-0.5 text-lg"></i>
                    <div>
                      <strong className="block font-medium">¡Éxito!</strong>
                      <p className="text-sm">{successMessage}</p>
                    </div>
                  </div>
                )}
                {/* Mensaje de error del servidor */}
                {serverError && (
                  <div className="p-3 mb-4 rounded bg-red-50 border border-red-200 text-red-700">
                    <strong className="block font-medium">Error:</strong>
                    <p className="text-sm">{serverError}</p>
                  </div>
                )}
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
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white"
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
                            : 'border-gray-300 focus:ring-teal-500'
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

                    {/* Primer Nombre */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Primer Nombre <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="primerNombre"
                        value={primerNombre}
                        onChange={(e) => handleInputChange('primerNombre', e.target.value, setPrimerNombre)}
                        placeholder="Ej: María"
                        maxLength={15}
                        className={`w-full px-4 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 ${
                          errors.primerNombre 
                            ? 'border-red-500 focus:ring-red-500' 
                            : 'border-gray-300 focus:ring-teal-500'
                        }`}
                        required
                      />
                      {errors.primerNombre && (
                        <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                          <i className="pi pi-exclamation-circle"></i>
                          {errors.primerNombre}
                        </p>
                      )}
                    </div>

                    {/* Segundo Nombre */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Segundo Nombre
                      </label>
                      <input
                        type="text"
                        name="segundoNombre"
                        value={segundoNombre}
                        onChange={(e) => handleInputChange('segundoNombre', e.target.value, setSegundoNombre)}
                        placeholder="Ej: José"
                        maxLength={15}
                        className={`w-full px-4 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 ${
                          errors.segundoNombre 
                            ? 'border-red-500 focus:ring-red-500' 
                            : 'border-gray-300 focus:ring-teal-500'
                        }`}
                      />
                      {errors.segundoNombre && (
                        <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                          <i className="pi pi-exclamation-circle"></i>
                          {errors.segundoNombre}
                        </p>
                      )}
                    </div>

                    {/* Primer Apellido */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Primer Apellido <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="primerApellido"
                        value={primerApellido}
                        onChange={(e) => handleInputChange('primerApellido', e.target.value, setPrimerApellido)}
                        placeholder="Ej: Pérez"
                        maxLength={15}
                        className={`w-full px-4 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 ${
                          errors.primerApellido 
                            ? 'border-red-500 focus:ring-red-500' 
                            : 'border-gray-300 focus:ring-teal-500'
                        }`}
                        required
                      />
                      {errors.primerApellido && (
                        <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                          <i className="pi pi-exclamation-circle"></i>
                          {errors.primerApellido}
                        </p>
                      )}
                    </div>

                    {/* Segundo Apellido */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Segundo Apellido
                      </label>
                      <input
                        type="text"
                        name="segundoApellido"
                        value={segundoApellido}
                        onChange={(e) => handleInputChange('segundoApellido', e.target.value, setSegundoApellido)}
                        placeholder="Ej: García"
                        maxLength={15}
                        className={`w-full px-4 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 ${
                          errors.segundoApellido 
                            ? 'border-red-500 focus:ring-red-500' 
                            : 'border-gray-300 focus:ring-teal-500'
                        }`}
                      />
                      {errors.segundoApellido && (
                        <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                          <i className="pi pi-exclamation-circle"></i>
                          {errors.segundoApellido}
                        </p>
                      )}
                    </div>

                    {/* Género (Sexo en backend) */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Sexo <span className="text-red-500">*</span>
                      </label>
                      <select
                        value={genero}
                        onChange={(e) => setGenero(e.target.value)}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white"
                        required
                      >
                        <option value="">Seleccionar sexo</option>
                        {GENEROS.map((gen) => (
                          <option key={gen} value={gen}>{gen}</option>
                        ))}
                      </select>
                    </div>

                    {/* Identidad Sexual */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Identidad Sexual <span className="text-red-500">*</span>
                      </label>
                      <select
                        value={identidadSexual}
                        onChange={(e) => setIdentidadSexual(e.target.value)}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white"
                        required
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
                        Fecha de Nacimiento <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="date"
                        value={fechaNacimiento}
                        onChange={(e) => setFechaNacimiento(e.target.value)}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                        required
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
                              : 'border-gray-300 focus:ring-teal-500'
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
                    {/* País de Residencia - Select dinámico */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        País de Residencia <span className="text-red-500">*</span>
                      </label>
                      <Select
                        name="pais"
                        options={options}
                        placeholder="Selecciona País de Residencia"
                        value={
                          pais
                            ? options.find(
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
                            "&:hover": { borderColor: "#14b8a6" },
                            boxShadow: "0 0 0 1px #d1d5db",
                          }),
                        }}
                      />
                    </div>

                    {/* Nacionalidad (País de Nacimiento) - Select dinámico */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Nacionalidad (País de Nacimiento) <span className="text-red-500">*</span>
                      </label>
                      <Select
                        name="nacionalidad"
                        options={options}
                        placeholder="Selecciona tu Nacionalidad"
                        value={
                          nacionalidad
                            ? options.find(
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
                            "&:hover": { borderColor: "#14b8a6" },
                            boxShadow: "0 0 0 1px #d1d5db",
                          }),
                        }}
                      />
                    </div>

                    {/* Departamento - Select dinámico desde JSON de Colombia */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Departamento <span className="text-red-500">*</span>
                      </label>
                      <select
                        value={departamento}
                        onChange={(e) => setDepartamento(e.target.value)}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white"
                        required
                      >
                        <option value="">Seleccionar departamento</option>
                        {colombia.map((d) => (
                          <option key={d.id} value={d.departamento}>
                            {d.departamento}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Municipio - Select dinámico basado en departamento */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Municipio <span className="text-red-500">*</span>
                      </label>
                      <select
                        value={municipio}
                        onChange={(e) => setMunicipio(e.target.value)}
                        disabled={!departamento}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white disabled:bg-gray-100 disabled:cursor-not-allowed"
                        required
                      >
                        <option value="">Seleccionar municipio</option>
                        {Array.isArray(municipiosDisponibles) && municipiosDisponibles.map((mun) => (
                          <option key={mun} value={mun}>{mun}</option>
                        ))}
                      </select>
                      {!departamento && (
                        <p className="text-xs text-gray-500 mt-1">Primero selecciona un departamento</p>
                      )}
                    </div>

                    {/* Ciudad de Residencia */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Ciudad de Residencia <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={ciudadResidencia}
                        onChange={(e) => setCiudadResidencia(e.target.value)}
                        placeholder="Nombre de la ciudad"
                        maxLength={50}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                        required
                      />
                    </div>

                    {/* Dirección de Residencia */}
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Dirección de Residencia <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={direccionResidencia}
                        onChange={(e) => setDireccionResidencia(e.target.value)}
                        placeholder="Ej: Calle 50 #30-20"
                        maxLength={100}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                        required
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
                            : 'border-gray-300 focus:ring-teal-500'
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
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
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
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white"
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
                        {loadingProgramas ? (
                          <div className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm bg-gray-50 text-gray-500">
                            Cargando programas...
                          </div>
                        ) : (
                          <select
                            value={codigoPrograma}
                            onChange={(e) => setCodigoPrograma(e.target.value)}
                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                            required
                          >
                            <option value="">Seleccionar programa</option>
                            {programas.map((programa) => (
                              <option key={programa.codigo_programa} value={programa.codigo_programa}>
                                {programa.codigo_programa}
                              </option>
                            ))}
                          </select>
                        )}
                        {programas.length === 0 && !loadingProgramas && (
                          <p className="text-xs text-gray-500 mt-1">No hay programas disponibles</p>
                        )}
                      </div>
                    )}

                    {/* Estado Activo */}
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="activo"
                        checked={activo}
                        onChange={(e) => setActivo(e.target.checked)}
                        className="w-4 h-4 text-teal-600 focus:ring-teal-500 border-gray-300 rounded"
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
                    disabled={loading}
                    className={`flex-1 bg-teal-600 text-white px-6 py-3 rounded-lg text-sm font-semibold transition-all shadow-md hover:shadow-lg ${loading ? 'opacity-60 cursor-not-allowed' : 'hover:bg-teal-700'}`}
                  >
                    {loading ? 'Registrando...' : 'Registrar Profesor'}
                  </button>
                </div>
              </form>
            </div>
            )}

            {/* ========== TAB 2: EDITAR PROFESORES ========== */}
            {activeTab === "editar" && (
            <div className="bg-white rounded-lg border border-gray-200 p-8">
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Editar Profesores
                </h2>
                <p className="text-sm text-gray-600">
                  Busca y edita la información de los profesores registrados en el sistema.
                </p>
              </div>

              {/* Tabla de Profesores Registrados */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">Profesores Registrados</h3>
                    <p className="text-sm text-gray-500 mt-1">
                      {profesoresFiltrados.length} {profesoresFiltrados.length === 1 ? 'profesor' : 'profesores'} encontrados
                    </p>
                  </div>
                  
                  {/* Barra de búsqueda */}
                  <div className="relative w-64">
                    <input
                      type="text"
                      placeholder="Buscar profesores..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    />
                    <i className="pi pi-search absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"></i>
                  </div>
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
                              {profesor?.usuario?.identificacion || profesor?.identificacion || 'N/A'}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">
                              {profesor?.usuario?.nombres || profesor?.nombres || 'N/A'}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-sm text-gray-600">{profesor?.usuario?.correo || profesor?.correo || 'N/A'}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                              {profesor?.categoria_docente || 'N/A'}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                              {profesor?.codigo_programa || 'N/A'}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              profesor?.activo 
                                ? 'bg-teal-100 text-teal-800' 
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
            )}
          </main>
        </div>
      </div>

      {/* Modal de Edición - Componente Separado */}
      <EditTeacherModal
        show={showEditModal}
        onSave={handleSaveEdit}
        onCancel={handleCancelEdit}
        // Listas dinámicas
        municipios={municipios}
        opcionesPaises={opcionesPaises}
        programas={programas}
        loadingProgramas={loadingProgramas}
        // Estados del formulario - Usuario
        tipoDocumento={tipoDocumento}
        setTipoDocumento={setTipoDocumento}
        identificacion={identificacion}
        setIdentificacion={setIdentificacion}
        // Nombres y apellidos separados
        primerNombre={primerNombre}
        setPrimerNombre={setPrimerNombre}
        segundoNombre={segundoNombre}
        setSegundoNombre={setSegundoNombre}
        primerApellido={primerApellido}
        setPrimerApellido={setPrimerApellido}
        segundoApellido={segundoApellido}
        setSegundoApellido={setSegundoApellido}
        genero={genero}
        setGenero={setGenero}
        identidadSexual={identidadSexual}
        setIdentidadSexual={setIdentidadSexual}
        fechaNacimiento={fechaNacimiento}
        setFechaNacimiento={setFechaNacimiento}
        nacionalidad={nacionalidad}
        setNacionalidad={setNacionalidad}
        pais={pais}
        setPais={setPais}
        departamento={departamento}
        setDepartamento={setDepartamento}
        municipio={municipio}
        setMunicipio={setMunicipio}
        ciudadResidencia={ciudadResidencia}
        setCiudadResidencia={setCiudadResidencia}
        direccionResidencia={direccionResidencia}
        setDireccionResidencia={setDireccionResidencia}
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
