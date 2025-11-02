import { API_ENDPOINTS, API_BASE_URL } from "../utils/constants";
import * as AuthService from "./AuthService";


/**
 * Función auxiliar para procesar respuestas del backend
 * @param {Response} response - Respuesta fetch
 * @returns {Promise<Object>} Datos procesados
 */
const procesarRespuesta = async (response) => {
  const contentType = response.headers.get("content-type");
  let responseData = {};

  // Intentar parsear JSON
  if (contentType && contentType.includes("application/json")) {
    try {
      responseData = await response.json();
      console.log('📦 Datos de respuesta completos:', JSON.stringify(responseData, null, 2));
    } catch (error) {
      console.error('❌ Error al parsear JSON:', error);
    }
  } else {
    // Si no es JSON, intentar leer como texto
    try {
      const text = await response.text();
      console.log('📄 Respuesta como texto:', text);
      responseData = { message: text };
    } catch (error) {
      console.error('❌ Error al leer respuesta:', error);
    }
  }

  // Si la respuesta es exitosa (2xx)
  if (response.ok) {
    return {
      success: true,
      data: responseData.data || responseData,
      message: responseData.message || 'Operación exitosa',
      code: responseData.code || 'SUCCESS'
    };
  }

  // Si hay errores, extraer el mensaje apropiado
  let errorMessage = responseData.message || responseData.detail || 'Error desconocido';
  
  console.log('🔍 Analizando error - Status:', response.status);
  console.log('🔍 responseData completo:', responseData);
  
  // Si hay un array de errores detallados, procesarlos
  if (responseData.errors && Array.isArray(responseData.errors)) {
    const errorMessages = responseData.errors.map(err => 
      `• ${err.field || 'Campo'}: ${err.message || err.msg || 'Error de validación'}`
    ).join('\n');
    errorMessage = errorMessages || errorMessage;
  }
  
  // Manejar errores de validación de FastAPI/Pydantic
  if (responseData.detail) {
    if (Array.isArray(responseData.detail)) {
      const errorMessages = responseData.detail.map(err => 
        `• ${err.loc ? err.loc.join('.') : 'Campo'}: ${err.msg || err.message || 'Error de validación'}`
      ).join('\n');
      errorMessage = 'Errores de validación:\n' + errorMessages;
    } else if (typeof responseData.detail === 'string') {
      errorMessage = responseData.detail;
    }
  }

  console.error('❌ Error del servidor:', errorMessage);
  throw new Error(errorMessage);
};


/**
 * Obtener todas las materias desde el backend
 * @returns {Promise<Array>} Lista de materias
 */
export const obtenerMaterias = async () => {
  try {
    console.log('📥 Cargando materias desde:', API_ENDPOINTS.MATERIAS);
    const headers = AuthService.getAuthHeaders();
    console.log('🔑 Headers de autenticación:', headers);
    
    const response = await fetch(API_ENDPOINTS.MATERIAS, {
      method: 'GET',
      headers: headers
    });
    
    console.log('📡 Respuesta del servidor - Status:', response.status, response.statusText);
    
    const resultado = await procesarRespuesta(response);
    console.log('� Respuesta completa:', resultado);
    console.log('✅ Materias cargadas:', resultado.data?.length || 0);
    
    if (resultado.data && resultado.data.length > 0) {
      console.log('🔍 Estructura de la primera materia:', resultado.data[0]);
      console.log('🔍 Claves de la primera materia:', Object.keys(resultado.data[0]));
    }
    
    return resultado.data || [];
  } catch (error) {
    console.error('❌ Error al cargar materias:', error.message);
    throw error;
  }
};


/**
 * Obtener todos los grupos desde el backend
 * @returns {Promise<Array>} Lista de grupos
 */
export const obtenerGrupos = async () => {
  try {
    const response = await fetch(API_ENDPOINTS.GRUPOS, {
      method: 'GET',
      headers: AuthService.getAuthHeaders()
    });
    const resultado = await procesarRespuesta(response);
    console.log('📥 Grupos cargados desde backend:', resultado.data?.length || 0);
    return resultado.data || [];
  } catch (error) {
    console.error('❌ Error al cargar grupos:', error.message);
    throw error;
  }
};


/**
 * Obtener todos los profesores desde el backend
 * @returns {Promise<Array>} Lista de profesores con estructura anidada {docente, usuario}
 */
export const obtenerDocentes = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/v1/admin/profesores`, {
      method: 'GET',
      headers: AuthService.getAuthHeaders()
    });
    const resultado = await procesarRespuesta(response);
    console.log('📥 Profesores cargados desde backend:', resultado.data?.length || 0);
    return resultado.data;
  } catch (error) {
    console.error('❌ Error al cargar profesores:', error.message);
    throw error;
  }
};


/**
 * Crear una nueva materia (sin grupos inicialmente)
 * @param {Object} materiaData - Datos de la materia
 * @param {string} materiaData.codigo_materia - Código de la materia
 * @param {string} materiaData.nombre_materia - Nombre de la materia
 * @param {string} materiaData.ciclo_semestral - Ciclo semestral
 * @returns {Promise<Object>} Materia creada
 */
export const crearMateria = async (materiaData) => {
  // Validaciones previas
  console.log('🔍 VALIDACIONES PREVIAS:');
  console.log('   - codigo_materia:', materiaData.codigo_materia, '(length:', materiaData.codigo_materia?.length, ')');
  console.log('   - nombre_materia:', materiaData.nombre_materia, '(length:', materiaData.nombre_materia?.length, ')');
  console.log('   - ciclo_semestral:', materiaData.ciclo_semestral);
  
  // Validar longitud del código
  if (materiaData.codigo_materia.length > 8) {
    throw new Error('El código de materia no puede exceder 8 caracteres');
  }
  
  // Validar patrón del código (solo mayúsculas, números y guiones bajos)
  const codigoPattern = /^[A-Z0-9_]+$/;
  const codigoUpper = materiaData.codigo_materia.toUpperCase();
  if (!codigoPattern.test(codigoUpper)) {
    throw new Error('El código solo puede contener letras mayúsculas, números y guiones bajos');
  }
  
  // Validar nombre
  if (materiaData.nombre_materia.length < 3 || materiaData.nombre_materia.length > 100) {
    throw new Error('El nombre debe tener entre 3 y 100 caracteres');
  }
  
  // Validar ciclo
  const ciclosValidos = ["Ciclo Básico", "Ciclo Profesional", "Ciclo de Profundización"];
  if (!ciclosValidos.includes(materiaData.ciclo_semestral)) {
    throw new Error(`Ciclo inválido. Debe ser uno de: ${ciclosValidos.join(', ')}`);
  }
  
  // El orden DEBE ser exactamente como aparece en el ejemplo de la documentación
  const payload = {
    ciclo_semestral: materiaData.ciclo_semestral,
    codigo_materia: codigoUpper,
    nombre_materia: materiaData.nombre_materia.trim()
  };

  console.log('📤 Creando materia en backend:', JSON.stringify(payload, null, 2));
  console.log('🔗 Endpoint:', API_ENDPOINTS.MATERIAS);
  
  const headers = AuthService.getAuthHeaders();
  console.log('🔑 Headers:', headers);
  
  // Verificar token
  const token = localStorage.getItem('auth_token');
  const expiresAt = localStorage.getItem('token_expires_at');
  console.log('🔐 Token exists:', !!token);
  console.log('🕐 Token expires at:', expiresAt);
  if (expiresAt) {
    const isExpired = new Date(expiresAt) < new Date();
    console.log('⏰ Token expired:', isExpired);
    if (isExpired) {
      throw new Error('Su sesión ha expirado. Por favor, inicie sesión nuevamente.');
    }
  }

  try {
    const response = await fetch(API_ENDPOINTS.MATERIAS, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(payload)
    });

    console.log('📡 Respuesta del servidor - Status:', response.status, response.statusText);
    
    // Si es error 500, dar más información al usuario
    if (response.status === 500) {
      const errorData = await response.json().catch(() => ({}));
      console.error('❌ ERROR 500 - DETALLE:', errorData);
      console.error('❌ Payload enviado:', payload);
      console.error('❌ Headers enviados:', headers);
      
      throw new Error(
        '⚠️ ERROR INTERNO DEL SERVIDOR (500)\n\n' +
        'El backend tiene un problema al crear la materia.\n\n' +
        '📋 DATOS ENVIADOS (CORRECTOS):\n' +
        `• Código: ${payload.codigo_materia}\n` +
        `• Nombre: ${payload.nombre_materia}\n` +
        `• Ciclo: ${payload.ciclo_semestral}\n\n` +
        '🔧 POSIBLES CAUSAS DEL ERROR:\n' +
        '1. Código de materia duplicado en la base de datos\n' +
        '2. Error de conexión con la base de datos\n' +
        '3. Permisos insuficientes del usuario\n' +
        '4. Bug en el código del backend\n\n' +
        '💡 RECOMENDACIÓN:\n' +
        'Contacte al equipo de backend con este timestamp:\n' +
        `${errorData.timestamp || new Date().toISOString()}\n\n` +
        'Los datos del frontend están correctos.'
      );
    }
    
    const resultado = await procesarRespuesta(response);
    console.log('✅ Materia creada exitosamente:', resultado);
    return resultado;
  } catch (error) {
    console.error('❌ Error al crear materia:', error.message);
    throw error;
  }
};


/**
 * Crear asignación docente-materia (asociar grupo con materia)
 * Usa el endpoint: POST /api/v1/admin/asignaciones-docentes
 * @param {Object} asignacionData
 * @param {number} asignacionData.codigo_grupo - Código del grupo
 * @param {string} asignacionData.codigo_materia - Código de la materia
 * @param {string} asignacionData.id_docente - ID del docente
 * @returns {Promise<Object>} Asignación creada
 */
export const crearAsignacionDocente = async (asignacionData) => {
  const payload = {
    codigo_grupo: asignacionData.codigo_grupo,
    codigo_materia: asignacionData.codigo_materia.toUpperCase(),
    id_docente: asignacionData.id_docente
  };

  console.log('📤 Creando asignación docente-materia:', JSON.stringify(payload, null, 2));

  try {
    const response = await fetch(API_ENDPOINTS.ASIGNACIONES_DOCENTE, {
      method: 'POST',
      headers: AuthService.getAuthHeaders(),
      body: JSON.stringify(payload)
    });

    const resultado = await procesarRespuesta(response);
    console.log('✅ Asignación creada exitosamente:', resultado);
    return resultado;
  } catch (error) {
    console.error('❌ Error al crear asignación:', error.message);
    throw error;
  }
};


/**
 * Actualizar una materia existente (incluyendo grupos)
 * @param {string} id - ID de la materia
 * @param {Object} materiaData - Datos de la materia
 * @param {string} materiaData.codigo_materia - Código de la materia
 * @param {string} materiaData.nombre_materia - Nombre de la materia
 * @param {string} materiaData.ciclo_semestral - Ciclo semestral
 * @param {Array} materiaData.grupos_con_docentes - Array de grupos asignados
 * @returns {Promise<Object>} Materia actualizada
 */
export const actualizarMateria = async (id, materiaData) => {
  const payload = {
    codigo_materia: materiaData.codigo_materia.toUpperCase(),
    nombre_materia: materiaData.nombre_materia,
    ciclo_semestral: materiaData.ciclo_semestral,
    grupos_con_docentes: materiaData.grupos_con_docentes || []
  };

  console.log('📤 Actualizando materia en backend (ID: ' + id + '):', JSON.stringify(payload, null, 2));

  try {
    const response = await fetch(API_ENDPOINTS.MATERIA_BY_ID(id), {
      method: 'PUT',
      headers: AuthService.getAuthHeaders(),
      body: JSON.stringify(payload)
    });

    const resultado = await procesarRespuesta(response);
    console.log('✅ Materia actualizada exitosamente:', resultado);
    return resultado;
  } catch (error) {
    console.error('❌ Error al actualizar materia:', error.message);
    throw error;
  }
};


/**
 * Eliminar una materia
 * @param {string} id - ID de la materia
 * @returns {Promise<Object>} Confirmación de eliminación
 */
export const eliminarMateria = async (id) => {
  console.log('🗑️ Eliminando materia del backend - ID:', id);

  try {
    const response = await fetch(API_ENDPOINTS.MATERIA_BY_ID(id), { 
      method: 'DELETE',
      headers: AuthService.getAuthHeaders()
    });

    const resultado = await procesarRespuesta(response);
    console.log('✅ Materia eliminada del backend');
    return resultado;
  } catch (error) {
    console.error('❌ Error al eliminar materia:', error.message);
    throw error;
  }
};


/**
 * Agregar un grupo a una materia
 * Usa el endpoint: POST /api/v1/admin/materias/{subject_code}/grupos/{group_code}
 * @param {string} codigoMateria - Código de la materia
 * @param {string} codigoGrupo - Código del grupo
 * @returns {Promise<Object>} Resultado de la operación
 */
export const agregarGrupoAMateria = async (codigoMateria, codigoGrupo) => {
  // Obtener la URL base de las constantes
  const API_BASE_URL = 'https://z6gasdnp5zp6v6egg4kg3jsitu0ffcqu.lambda-url.us-east-1.on.aws';
  const url = `${API_BASE_URL}/api/v1/admin/materias/${codigoMateria}/grupos/${codigoGrupo}`;
  
  console.log(`📤 Agregando grupo ${codigoGrupo} a materia ${codigoMateria}`);
  console.log(`🔗 URL: ${url}`);

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: AuthService.getAuthHeaders()
    });

    const resultado = await procesarRespuesta(response);
    console.log(`✅ Grupo ${codigoGrupo} agregado exitosamente a materia ${codigoMateria}`);
    return resultado;
  } catch (error) {
    console.error(`❌ Error al agregar grupo ${codigoGrupo} a materia ${codigoMateria}:`, error.message);
    throw error;
  }
};


/**
 * Eliminar un grupo de una materia
 * Usa el endpoint: DELETE /api/v1/admin/materias/{subject_code}/grupos/{group_code}
 * @param {string} codigoMateria - Código de la materia
 * @param {string} codigoGrupo - Código del grupo
 * @returns {Promise<Object>} Resultado de la operación
 */
export const eliminarGrupoDeMateria = async (codigoMateria, codigoGrupo) => {
  // Obtener la URL base de las constantes
  const API_BASE_URL = 'https://z6gasdnp5zp6v6egg4kg3jsitu0ffcqu.lambda-url.us-east-1.on.aws';
  const url = `${API_BASE_URL}/api/v1/admin/materias/${codigoMateria}/grupos/${codigoGrupo}`;
  
  console.log(`🗑️ Eliminando grupo ${codigoGrupo} de materia ${codigoMateria}`);
  console.log(`🔗 URL: ${url}`);

  try {
    const response = await fetch(url, {
      method: 'DELETE',
      headers: AuthService.getAuthHeaders()
    });

    const resultado = await procesarRespuesta(response);
    console.log(`✅ Grupo ${codigoGrupo} eliminado exitosamente de materia ${codigoMateria}`);
    return resultado;
  } catch (error) {
    console.error(`❌ Error al eliminar grupo ${codigoGrupo} de materia ${codigoMateria}:`, error.message);
    throw error;
  }
};


/**
 * Filtrar materias por término de búsqueda
 * @param {Array} materias - Lista de materias
 * @param {string} searchTerm - Término de búsqueda
 * @returns {Array} Materias filtradas
 */
export const filtrarMaterias = (materias, searchTerm) => {
  if (!searchTerm || searchTerm.trim() === '') {
    return materias;
  }

  const termino = searchTerm.toLowerCase();
  return materias.filter(materia =>
    materia.codigo_materia.toLowerCase().includes(termino) ||
    materia.nombre_materia.toLowerCase().includes(termino) ||
    materia.ciclo_semestral.toLowerCase().includes(termino)
  );
};


/**
 * Validar que los grupos seleccionados no estén duplicados
 * @param {Array} grupos - Array de grupos seleccionados
 * @returns {boolean} true si no hay duplicados
 */
export const validarGruposUnicos = (grupos) => {
  const codigosUnicos = new Set(grupos.map(g => g.codigo_grupo));
  return codigosUnicos.size === grupos.length;
};


/**
 * Validar datos de materia antes de enviar al backend
 * @param {Object} materiaData - Datos de la materia
 * @returns {Object} { valido: boolean, errores: Array }
 */
export const validarDatosMateria = (materiaData) => {
  const errores = [];

  if (!materiaData.codigo_materia || materiaData.codigo_materia.trim() === '') {
    errores.push('El código de la materia es obligatorio');
  }

  if (!materiaData.nombre_materia || materiaData.nombre_materia.trim() === '') {
    errores.push('El nombre de la materia es obligatorio');
  }

  if (!materiaData.ciclo_semestral || materiaData.ciclo_semestral.trim() === '') {
    errores.push('El ciclo semestral es obligatorio');
  }

  return {
    valido: errores.length === 0,
    errores
  };
};
