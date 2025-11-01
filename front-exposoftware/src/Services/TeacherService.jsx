import { API_BASE_URL } from "../utils/constants";
import * as AuthService from "./AuthService";

/**
 * Obtener perfil del docente autenticado
 * @returns {Promise<Object>} Datos del perfil del docente
 */
export const getTeacherProfile = async () => {
  try {
    console.log('📥 Cargando perfil del docente...');
    const headers = AuthService.getAuthHeaders();
    
    // Obtener el usuario actual del AuthService
    const userData = AuthService.getUserData();
    if (!userData || !userData.identificacion) {
      throw new Error("No hay sesión activa");
    }

    const response = await fetch(
      `${API_BASE_URL}/api/v1/docentes/${userData.identificacion}`,
      {
        method: 'GET',
        headers: headers
      }
    );

    console.log('📡 Respuesta del servidor - Status:', response.status);

    if (response.ok) {
      const result = await response.json();
      const docente = result.data || result;
      console.log('✅ Perfil del docente cargado:', docente);
      return docente;
    } else if (response.status === 404) {
      throw new Error("Perfil de docente no encontrado");
    } else if (response.status === 401) {
      throw new Error("No autorizado. Por favor, inicie sesión nuevamente");
    } else {
      throw new Error(`Error al cargar perfil: ${response.statusText}`);
    }
  } catch (error) {
    console.error('❌ Error al cargar perfil del docente:', error);
    throw error;
  }
};

/**
 * Procesar datos del docente desde el backend
 * Convierte los datos anidados del backend al formato que espera el frontend
 * @param {Object} datosCrudos - Datos directos del backend
 * @returns {Object} Datos procesados para el formulario
 */
export const procesarDatosDocente = (datosCrudos) => {
  if (!datosCrudos) {
    console.warn('⚠️ No hay datos crudos para procesar');
    return {};
  }

  console.log('🔄 Procesando datos del docente:', datosCrudos);

  // Los datos vienen con estructura anidada: docente.usuario
  const usuario = datosCrudos.usuario || {};
  
  // Concatenar nombres y apellidos
  const nombres = [usuario.primer_nombre, usuario.segundo_nombre]
    .filter(Boolean)
    .join(' ');
  
  const apellidos = [usuario.primer_apellido, usuario.segundo_apellido]
    .filter(Boolean)
    .join(' ');

  const datosProcesados = {
    // Campos propios de Docentes
    id_docente: datosCrudos.id_docente || "",
    id_usuario: datosCrudos.id_usuario || "",
    categoria_docente: datosCrudos.categoria_docente || "Interno",
    codigo_programa: datosCrudos.codigo_programa || "",
    
    // Campos heredados de Usuarios (desde usuario anidado)
    tipo_documento: usuario.tipo_documento || "CC",
    identificacion: usuario.identificacion || "",
    nombres: nombres || "",
    apellidos: apellidos || "",
    genero: usuario.sexo || usuario.genero || "",
    identidad_sexual: usuario.identidad_sexual || "",
    fecha_nacimiento: usuario.fecha_nacimiento || "",
    telefono: usuario.telefono || "",
    
    // Ubicación
    pais: usuario.pais_residencia || "CO",
    nacionalidad: usuario.nacionalidad || "CO",
    departamento_residencia: usuario.departamento_residencia || "",
    ciudad_residencia: usuario.ciudad_residencia || "",
    direccion_residencia: usuario.direccion_residencia || "",
    departamento: usuario.departamento_residencia || "",
    municipio: usuario.ciudad_residencia || "",
    ciudad: usuario.ciudad_residencia || "",
    
    // Institucional
    correo: usuario.correo || "",
    anio_ingreso: new Date().getFullYear(),
    periodo: 1,
    rol: usuario.rol || "Docente"
  };

  console.log('✅ Datos procesados:', datosProcesados);
  return datosProcesados;
};

/**
 * Actualizar perfil del docente
 * @param {string} identificacion - Identificación del docente
 * @param {Object} datosActualizados - Datos a actualizar
 * @returns {Promise<Object>} Datos actualizados
 */
export const updateTeacherProfile = async (identificacion, datosActualizados) => {
  try {
    console.log('📤 Actualizando perfil del docente:', identificacion);
    const headers = AuthService.getAuthHeaders();

    // Separar nombres y apellidos
    const nombres = datosActualizados.nombres?.split(' ') || [];
    const apellidos = datosActualizados.apellidos?.split(' ') || [];

    const payload = {
      tipo_documento: datosActualizados.tipo_documento,
      identificacion: identificacion,
      primer_nombre: nombres[0] || "",
      segundo_nombre: nombres.slice(1).join(' ') || "",
      primer_apellido: apellidos[0] || "",
      segundo_apellido: apellidos.slice(1).join(' ') || "",
      sexo: datosActualizados.genero,
      identidad_sexual: datosActualizados.identidad_sexual || "",
      fecha_nacimiento: datosActualizados.fecha_nacimiento || "",
      nacionalidad: datosActualizados.nacionalidad || "CO",
      pais_residencia: datosActualizados.pais || "CO",
      departamento_residencia: datosActualizados.departamento_residencia || "",
      ciudad_residencia: datosActualizados.ciudad_residencia || "",
      direccion_residencia: datosActualizados.direccion_residencia || "",
      telefono: datosActualizados.telefono,
      correo: datosActualizados.correo,
      rol: "Docente",
      activo: true,
      categoria_docente: datosActualizados.categoria_docente,
      codigo_programa: datosActualizados.codigo_programa || ""
    };

    console.log('📦 Payload:', payload);

    const response = await fetch(
      `${API_BASE_URL}/api/v1/docentes/${identificacion}`,
      {
        method: 'PUT',
        headers: headers,
        body: JSON.stringify(payload)
      }
    );

    if (response.ok) {
      const data = await response.json();
      console.log('✅ Perfil actualizado:', data);
      return { success: true, data };
    } else {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(`Error al actualizar perfil (${response.status}): ${errorData.message || errorData.detail || 'Error desconocido'}`);
    }
  } catch (error) {
    console.error('❌ Error al actualizar perfil:', error);
    throw error;
  }
};
