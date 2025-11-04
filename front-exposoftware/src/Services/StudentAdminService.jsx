import { API_ENDPOINTS } from "../utils/constants";
import * as AuthService from "./AuthService";

/**
 * Servicio para la gestión administrativa de estudiantes
 * Incluye funcionalidades para listar, crear, actualizar, activar y desactivar estudiantes
 */

/**
 * Procesar respuesta del servidor
 * @param {Response} response - Respuesta fetch
 * @returns {Promise<Object>} Datos procesados
 */
const procesarRespuesta = async (response) => {
  const contentType = response.headers.get("content-type");
  let responseData = {};

  console.log('📡 Status de respuesta:', response.status);
  console.log('📡 Content-Type:', contentType);

  if (contentType && contentType.includes("application/json")) {
    try {
      responseData = await response.json();
      console.log('📦 Datos de respuesta:', responseData);
    } catch (error) {
      console.error('❌ Error al parsear JSON:', error);
      if (!response.ok) {
        throw new Error(`Error del servidor (${response.status})`);
      }
    }
  } else {
    // Si no es JSON, intentar leer como texto
    const textData = await response.text();
    console.log('📄 Respuesta como texto:', textData);
  }

  if (response.ok) {
    return {
      success: true,
      data: responseData.data || responseData,
      message: responseData.message || 'Operación exitosa'
    };
  } else {
    // Manejo de errores
    const errorMessage = responseData.detail || 
                        responseData.message || 
                        `Error ${response.status}: ${response.statusText}`;
    console.error('❌ Error del servidor:', {
      status: response.status,
      statusText: response.statusText,
      responseData
    });
    throw new Error(errorMessage);
  }
};

/**
 * Obtener lista de todos los estudiantes
 * @param {Object} params - Parámetros de consulta opcionales (manejados en frontend)
 * @returns {Promise<Object>} Lista de estudiantes
 */
export const obtenerEstudiantes = async (params = {}) => {
  try {
    // El endpoint no acepta parámetros, devuelve todos los estudiantes
    const url = API_ENDPOINTS.ADMIN_ESTUDIANTES;
    const headers = AuthService.getAuthHeaders();
    
    console.log('👥 Obteniendo estudiantes desde:', url);
    console.log('🔑 Headers enviados:', headers);
    console.log('🔑 Token presente:', AuthService.getToken() ? 'Sí' : 'No');
    
    const response = await fetch(url, {
      method: 'GET',
      headers: headers
    });

    const result = await procesarRespuesta(response);
    console.log('✅ Estudiantes obtenidos:', result);
    
    // Normalizar respuesta para que siempre tenga estructura consistente
    if (result.data) {
      return result;
    } else {
      // Si la respuesta es un array directo
      return {
        data: Array.isArray(result) ? result : [],
        total: Array.isArray(result) ? result.length : 0
      };
    }
  } catch (error) {
    console.error('❌ Error al obtener estudiantes:', error);
    throw error;
  }
};

/**
 * Obtener estudiante por ID (información básica)
 * @param {string} studentId - ID del estudiante
 * @returns {Promise<Object>} Datos del estudiante
 */
export const obtenerEstudiantePorId = async (studentId) => {
  try {
    const url = API_ENDPOINTS.ADMIN_ESTUDIANTE_BY_ID(studentId);
    
    console.log('👤 Obteniendo estudiante:', studentId);
    
    const response = await fetch(url, {
      method: 'GET',
      headers: AuthService.getAuthHeaders()
    });

    const result = await procesarRespuesta(response);
    console.log('✅ Estudiante obtenido:', result.data);
    
    return result;
  } catch (error) {
    console.error('❌ Error al obtener estudiante:', error);
    throw error;
  }
};

/**
 * Obtener estudiante con información completa (incluye datos de usuario)
 * @param {string} studentId - ID del estudiante
 * @returns {Promise<Object>} Datos completos del estudiante
 */
export const obtenerEstudianteCompleto = async (studentId) => {
  try {
    const url = API_ENDPOINTS.ADMIN_ESTUDIANTE_COMPLETO(studentId);
    
    console.log('👤📋 Obteniendo estudiante completo:', studentId);
    
    const response = await fetch(url, {
      method: 'GET',
      headers: AuthService.getAuthHeaders()
    });

    const result = await procesarRespuesta(response);
    console.log('✅ Estudiante completo obtenido:', result.data);
    
    return result;
  } catch (error) {
    console.error('❌ Error al obtener estudiante completo:', error);
    throw error;
  }
};

/**
 * Obtener estudiantes por programa académico
 * @param {string} codigoPrograma - Código del programa académico
 * @param {Object} params - Parámetros adicionales (manejados en frontend)
 * @returns {Promise<Object>} Lista de estudiantes del programa
 */
export const obtenerEstudiantesPorPrograma = async (codigoPrograma, params = {}) => {
  try {
    // El endpoint no acepta parámetros de paginación
    const url = API_ENDPOINTS.ADMIN_ESTUDIANTES_POR_PROGRAMA(codigoPrograma);
    
    console.log('🎓 Obteniendo estudiantes del programa:', codigoPrograma);
    
    const response = await fetch(url, {
      method: 'GET',
      headers: AuthService.getAuthHeaders()
    });

    const result = await procesarRespuesta(response);
    console.log('✅ Estudiantes del programa obtenidos:', result);
    
    // Normalizar respuesta
    if (result.data) {
      return result;
    } else {
      return {
        data: Array.isArray(result) ? result : [],
        total: Array.isArray(result) ? result.length : 0
      };
    }
  } catch (error) {
    console.error('❌ Error al obtener estudiantes por programa:', error);
    throw error;
  }
};

/**
 * Actualizar información de un estudiante
 * @param {string} studentId - ID del estudiante
 * @param {Object} studentData - Datos a actualizar
 * @param {string} studentData.codigo_programa - Código del programa académico
 * @param {number} studentData.semestre - Semestre actual (1-10)
 * @param {string} studentData.periodo - Período académico (2024-1, 2024-2, etc.)
 * @param {number} studentData.anio_ingreso - Año de ingreso
 * @returns {Promise<Object>} Estudiante actualizado
 */
export const actualizarEstudiante = async (studentId, studentData) => {
  try {
    const url = API_ENDPOINTS.ADMIN_ESTUDIANTE_BY_ID(studentId);
    
    console.log('✏️ Actualizando estudiante:', studentId, studentData);
    
    const response = await fetch(url, {
      method: 'PUT',
      headers: AuthService.getAuthHeaders(),
      body: JSON.stringify(studentData)
    });

    const result = await procesarRespuesta(response);
    console.log('✅ Estudiante actualizado:', result.data);
    
    return result;
  } catch (error) {
    console.error('❌ Error al actualizar estudiante:', error);
    throw error;
  }
};

/**
 * Activar un estudiante (cambiar estado a activo)
 * @param {string} studentId - ID del estudiante
 * @returns {Promise<Object>} Resultado de la operación
 */
export const activarEstudiante = async (studentId) => {
  try {
    const url = API_ENDPOINTS.ADMIN_ESTUDIANTE_ACTIVAR(studentId);
    
    console.log('✅ Activando estudiante:', studentId);
    
    const response = await fetch(url, {
      method: 'PATCH',
      headers: AuthService.getAuthHeaders()
    });

    const result = await procesarRespuesta(response);
    console.log('✅ Estudiante activado exitosamente');
    
    return result;
  } catch (error) {
    console.error('❌ Error al activar estudiante:', error);
    throw error;
  }
};

/**
 * Desactivar un estudiante (cambiar estado a inactivo)
 * @param {string} studentId - ID del estudiante
 * @returns {Promise<Object>} Resultado de la operación
 */
export const desactivarEstudiante = async (studentId) => {
  try {
    const url = API_ENDPOINTS.ADMIN_ESTUDIANTE_DESACTIVAR(studentId);
    
    console.log('❌ Desactivando estudiante:', studentId);
    
    const response = await fetch(url, {
      method: 'PATCH',
      headers: AuthService.getAuthHeaders()
    });

    const result = await procesarRespuesta(response);
    console.log('✅ Estudiante desactivado exitosamente');
    
    return result;
  } catch (error) {
    console.error('❌ Error al desactivar estudiante:', error);
    throw error;
  }
};

/**
 * Asignar rol de estudiante a un usuario existente
 * @param {Object} data - Datos de asignación
 * @param {string} data.id_usuario - ID del usuario existente
 * @param {string} data.codigo_programa - Código del programa académico
 * @param {number} data.semestre - Semestre actual
 * @param {string} data.periodo - Período académico
 * @param {number} data.anio_ingreso - Año de ingreso
 * @returns {Promise<Object>} Estudiante creado
 */
export const asignarEstudianteExistente = async (data) => {
  try {
    const url = API_ENDPOINTS.ADMIN_ESTUDIANTE_ASIGNAR_EXISTENTE;
    
    console.log('🔗 Asignando rol de estudiante a usuario existente:', data);
    
    const response = await fetch(url, {
      method: 'POST',
      headers: AuthService.getAuthHeaders(),
      body: JSON.stringify(data)
    });

    const result = await procesarRespuesta(response);
    console.log('✅ Estudiante asignado exitosamente:', result.data);
    
    return result;
  } catch (error) {
    console.error('❌ Error al asignar estudiante existente:', error);
    throw error;
  }
};

/**
 * Buscar estudiantes por nombre, identificación o código
 * @param {string} query - Término de búsqueda
 * @param {Array} estudiantes - Lista de estudiantes donde buscar
 * @returns {Array} Estudiantes que coinciden con la búsqueda
 */
export const buscarEstudiantes = (query, estudiantes) => {
  if (!query || !query.trim()) return estudiantes;
  
  const searchTerm = query.toLowerCase().trim();
  
  return estudiantes.filter(estudiante => {
    const nombre = `${estudiante.usuario?.nombres || ''} ${estudiante.usuario?.apellidos || ''}`.toLowerCase();
    const identificacion = estudiante.usuario?.identificacion?.toLowerCase() || '';
    const email = estudiante.usuario?.email?.toLowerCase() || '';
    const programa = estudiante.programa?.nombre?.toLowerCase() || '';
    
    return nombre.includes(searchTerm) ||
           identificacion.includes(searchTerm) ||
           email.includes(searchTerm) ||
           programa.includes(searchTerm);
  });
};

/**
 * Filtrar estudiantes por estado
 * @param {string} estado - Estado a filtrar (activo/inactivo/todos)
 * @param {Array} estudiantes - Lista de estudiantes
 * @returns {Array} Estudiantes filtrados
 */
export const filtrarPorEstado = (estado, estudiantes) => {
  if (estado === 'todos') return estudiantes;
  
  const estadoBool = estado === 'activo';
  return estudiantes.filter(estudiante => estudiante.estado === estadoBool);
};

/**
 * Formatear datos del estudiante para visualización
 * @param {Object} data - Datos del estudiante (puede venir en formato anidado o plano)
 * @returns {Object} Datos formateados
 */
export const formatearEstudiante = (data) => {
  // Detectar si los datos vienen en formato anidado (nuevo formato del backend)
  const estudiante = data.estudiante || data;
  const usuario = data.usuario || estudiante.usuario || {};
  
  return {
    id: estudiante.id_estudiante,
    nombreCompleto: usuario.nombre_completo || 
                   `${usuario.nombres || ''} ${usuario.apellidos || ''}`.trim() ||
                   'Sin nombre',
    identificacion: usuario.identificacion || 'N/A',
    email: usuario.correo || usuario.email || 'N/A',
    telefono: usuario.telefono || 'N/A',
    programa: estudiante.programa?.nombre || 'Sin programa',
    codigoPrograma: estudiante.codigo_programa || 'N/A',
    semestre: estudiante.semestre || 0,
    periodo: estudiante.periodo,
    anioIngreso: estudiante.anio_ingreso,
    estado: estudiante.activo !== undefined ? (estudiante.activo ? 'Activo' : 'Inactivo') : 
            (estudiante.estado ? 'Activo' : 'Inactivo'),
    estadoBool: estudiante.activo !== undefined ? estudiante.activo : estudiante.estado,
    fechaCreacion: estudiante.fecha_creacion,
    fechaActualizacion: estudiante.fecha_actualizacion
  };
};

