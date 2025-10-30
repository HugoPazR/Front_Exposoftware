import { API_ENDPOINTS } from "../utils/constants";
import * as AuthService from "./AuthService";

/**
 * Servicio para la gestión de grupos
 * Contiene todas las funciones de lógica de negocio y comunicación con el backend
 */

// ==================== FUNCIONES DE API ====================

/**
 * Obtener todos los grupos desde el backend
 * @returns {Promise<Array>} Lista de grupos
 */
export const obtenerGrupos = async () => {
  try {
    console.log('📥 Cargando grupos desde:', API_ENDPOINTS.GRUPOS);
    const headers = AuthService.getAuthHeaders();
    console.log('🔑 Headers de autenticación:', headers);
    
    const response = await fetch(API_ENDPOINTS.GRUPOS, {
      method: 'GET',
      headers: headers
    });
    
    console.log('📡 Respuesta del servidor - Status:', response.status, response.statusText);
    
    if (response.ok) {
      const result = await response.json();
      console.log('� Respuesta completa:', result);
      
      // El backend puede retornar { data: [...] } o directamente [...]
      const grupos = result.data || result;
      console.log('✅ Grupos cargados:', grupos.length);
      
      if (grupos.length > 0) {
        console.log('🔍 Estructura del primer grupo:', grupos[0]);
        console.log('🔍 Claves del primer grupo:', Object.keys(grupos[0]));
      }
      
      return Array.isArray(grupos) ? grupos : [];
    } else {
      const errorText = await response.text();
      console.error('❌ Error al cargar grupos:', response.status, response.statusText, errorText);
      throw new Error(`Error al cargar grupos: ${response.statusText}`);
    }
  } catch (error) {
    console.error('❌ Error de conexión al cargar grupos:', error);
    throw error;
  }
};

/**
 * Obtener todos los profesores desde el backend
 * @returns {Promise<Array>} Lista de profesores
 */
export const obtenerProfesores = async () => {
  try {
    console.log('📥 Cargando profesores desde:', API_ENDPOINTS.PROFESORES);
    const headers = AuthService.getAuthHeaders();
    console.log('🔑 Headers de autenticación:', headers);
    
    const response = await fetch(API_ENDPOINTS.PROFESORES, {
      method: 'GET',
      headers: headers
    });
    
    console.log('📡 Respuesta del servidor - Status:', response.status, response.statusText);
    
    if (response.ok) {
      const result = await response.json();
      console.log('� Respuesta completa profesores:', result);
      
      // El backend puede retornar { data: [...] } o directamente [...]
      const profesores = result.data || result;
      console.log('✅ Profesores cargados:', profesores.length);
      
      if (profesores.length > 0) {
        console.log('🔍 Estructura del primer profesor:', profesores[0]);
      }
      
      return Array.isArray(profesores) ? profesores : [];
    } else {
      const errorText = await response.text();
      console.error('❌ Error al cargar profesores:', response.status, response.statusText, errorText);
      throw new Error(`Error al cargar profesores: ${response.statusText}`);
    }
  } catch (error) {
    console.error('❌ Error de conexión al cargar profesores:', error);
    throw error;
  }
};

/**
 * Crear un nuevo grupo en el backend
 * @param {number} codigoGrupo - Código/número del grupo
 * @param {string} idDocente - ID del docente asignado
 * @returns {Promise<Object>} Datos del grupo creado
 */
export const crearGrupo = async (codigoGrupo, idDocente) => {
  // Validaciones
  if (!codigoGrupo || !idDocente) {
    throw new Error("Por favor complete todos los campos obligatorios");
  }

  // Estructura exacta que espera el backend
  const payload = {
    codigo_grupo: parseInt(codigoGrupo),
    id_docente: idDocente
  };

  console.log('📤 Creando grupo en backend:', JSON.stringify(payload, null, 2));
  console.log('🔗 Endpoint:', API_ENDPOINTS.GRUPOS);
  
  const headers = AuthService.getAuthHeaders();
  console.log('🔑 Headers:', headers);

  try {
    const response = await fetch(API_ENDPOINTS.GRUPOS, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(payload)
    });

    console.log('📡 Respuesta del servidor - Status:', response.status, response.statusText);

    // Manejo de códigos de estado HTTP
    if (response.status === 201 || response.ok) {
      const data = await response.json();
      console.log('✅ Grupo creado exitosamente:', data);
      return { success: true, data };
    } else if (response.status === 400) {
      const errorData = await response.json().catch(() => ({}));
      console.error('❌ Solicitud incorrecta:', errorData);
      throw new Error(`Solicitud incorrecta: ${errorData.message || errorData.detail || 'Verifique los datos ingresados'}`);
    } else if (response.status === 401) {
      const errorData = await response.json().catch(() => ({}));
      console.error('❌ No autorizado:', errorData);
      throw new Error(`No autorizado: ${errorData.message || errorData.detail || 'Debe iniciar sesión'}`);
    } else if (response.status === 403) {
      const errorData = await response.json().catch(() => ({}));
      console.error('❌ Sin permisos:', errorData);
      throw new Error(`Sin permisos: ${errorData.message || errorData.detail || 'No tiene permisos para crear grupos'}`);
    } else if (response.status === 409) {
      const errorData = await response.json().catch(() => ({}));
      console.error('❌ Conflicto:', errorData);
      throw new Error(`Conflicto: ${errorData.message || errorData.detail || 'El grupo ya existe'}`);
    } else if (response.status === 422) {
      const errorData = await response.json().catch(() => ({}));
      console.error('❌ Error de validación:', errorData);
      
      // Manejar errores de validación de FastAPI
      if (errorData.detail && Array.isArray(errorData.detail)) {
        const errorMessages = errorData.detail.map(err => 
          `• ${err.loc ? err.loc.join('.') : 'Campo'}: ${err.msg || err.message || 'Error de validación'}`
        ).join('\n');
        throw new Error('Errores de validación:\n' + errorMessages);
      }
      
      throw new Error(`Error de validación: ${errorData.message || errorData.detail || 'Los datos no son válidos'}`);
    } else {
      const errorData = await response.json().catch(() => ({}));
      console.error('❌ Error del servidor:', errorData);
      throw new Error(`Error al crear el grupo (${response.status}): ${errorData.message || errorData.detail || 'Error desconocido'}`);
    }
  } catch (error) {
    if (error.message) {
      throw error;
    }
    console.error('❌ Error al crear grupo:', error);
    throw new Error("Error de conexión al crear el grupo. Verifique su conexión a internet.");
  }
};

/**
 * Actualizar un grupo existente
 * @param {string} codigoGrupo - Código/ID del grupo a actualizar
 * @param {string} nombreGrupo - Nuevo nombre del grupo
 * @param {string} idDocente - Nuevo ID del docente asignado
 * @returns {Promise<Object>} Datos del grupo actualizado
 */
export const actualizarGrupo = async (codigoGrupo, nombreGrupo, idDocente) => {
  // Validaciones
  if (!nombreGrupo || !idDocente) {
    throw new Error("Por favor complete todos los campos obligatorios");
  }

  if (nombreGrupo.length > 10) {
    throw new Error("El nombre del grupo no puede exceder 10 caracteres");
  }

  const payload = {
    nombre_grupo: nombreGrupo,
    id_docente: idDocente
  };

  console.log('📤 Actualizando en backend (codigo_grupo: ' + codigoGrupo + '):', JSON.stringify(payload, null, 2));

  try {
    const response = await fetch(API_ENDPOINTS.GRUPO_BY_ID(codigoGrupo), {
      method: 'PUT',
      headers: AuthService.getAuthHeaders(),
      body: JSON.stringify(payload)
    });

    if (response.ok) {
      const data = await response.json();
      console.log('✅ Respuesta del backend:', data);
      return { success: true, data };
    } else if (response.status === 400) {
      const errorData = await response.json().catch(() => ({}));
      console.error('❌ Solicitud incorrecta:', errorData);
      throw new Error(`Solicitud incorrecta: ${errorData.message || errorData.detail || 'Verifique los datos'}`);
    } else if (response.status === 401) {
      const errorData = await response.json().catch(() => ({}));
      console.error('❌ No autorizado:', errorData);
      throw new Error(`No autorizado: ${errorData.message || errorData.detail || 'Debe iniciar sesión'}`);
    } else if (response.status === 403) {
      const errorData = await response.json().catch(() => ({}));
      console.error('❌ Sin permisos:', errorData);
      throw new Error(`Sin permisos: ${errorData.message || errorData.detail || 'No tiene permisos para editar grupos'}`);
    } else if (response.status === 404) {
      const errorData = await response.json().catch(() => ({}));
      console.error('❌ No encontrado:', errorData);
      throw new Error(`No encontrado: ${errorData.message || errorData.detail || 'El grupo no existe'}`);
    } else if (response.status === 422) {
      const errorData = await response.json().catch(() => ({}));
      console.error('❌ Error de validación:', errorData);
      throw new Error(`Error de validación: ${errorData.message || errorData.detail || 'Los datos no son válidos'}`);
    } else {
      const errorData = await response.json().catch(() => ({}));
      console.error('❌ Error del servidor:', errorData);
      throw new Error(`Error al actualizar el grupo (${response.status}): ${errorData.message || errorData.detail || 'Error desconocido'}`);
    }
  } catch (error) {
    if (error.message) {
      throw error;
    }
    console.error('❌ Error al actualizar grupo:', error);
    throw new Error("Error de conexión al actualizar el grupo. Verifique su conexión a internet.");
  }
};

/**
 * Eliminar un grupo
 * @param {string} codigoGrupo - Código/ID del grupo a eliminar
 * @returns {Promise<Object>} Confirmación de eliminación
 */
export const eliminarGrupo = async (codigoGrupo) => {
  console.log('🗑️ Eliminando del backend - codigo_grupo:', codigoGrupo);

  try {
    const response = await fetch(API_ENDPOINTS.GRUPO_BY_ID(codigoGrupo), { 
      method: 'DELETE',
      headers: AuthService.getAuthHeaders()
    });
    
    if (response.ok) {
      console.log('✅ Grupo eliminado del backend');
      return { success: true };
    } else if (response.status === 401) {
      const errorData = await response.json().catch(() => ({}));
      console.error('❌ No autorizado:', errorData);
      throw new Error(`No autorizado: ${errorData.message || errorData.detail || 'Debe iniciar sesión'}`);
    } else if (response.status === 403) {
      const errorData = await response.json().catch(() => ({}));
      console.error('❌ Sin permisos:', errorData);
      throw new Error(`Sin permisos: ${errorData.message || errorData.detail || 'No tiene permisos para eliminar grupos'}`);
    } else if (response.status === 404) {
      const errorData = await response.json().catch(() => ({}));
      console.error('❌ No encontrado:', errorData);
      throw new Error(`No encontrado: ${errorData.message || errorData.detail || 'El grupo no existe'}`);
    } else {
      const errorData = await response.json().catch(() => ({}));
      console.error('❌ Error del servidor:', errorData);
      throw new Error(`Error al eliminar el grupo (${response.status}): ${errorData.message || errorData.detail || 'Error desconocido'}`);
    }
  } catch (error) {
    if (error.message) {
      throw error;
    }
    console.error('❌ Error al eliminar grupo:', error);
    throw new Error("Error de conexión al eliminar el grupo. Verifique su conexión a internet.");
  }
};

// ==================== FUNCIONES AUXILIARES ====================

/**
 * Obtener nombre de profesor por ID
 * @param {string} idDocente - ID del docente
 * @param {Array} profesores - Lista de profesores
 * @returns {string} Nombre del profesor o 'Sin asignar'
 */
export const obtenerNombreProfesor = (idDocente, profesores) => {
  const profesor = profesores.find(p => p.id === idDocente);
  return profesor ? profesor.nombre : 'Sin asignar';
};

/**
 * Filtrar grupos por término de búsqueda
 * @param {Array} grupos - Lista de grupos
 * @param {string} searchTerm - Término de búsqueda
 * @param {Array} profesores - Lista de profesores
 * @returns {Array} Grupos filtrados
 */
export const filtrarGrupos = (grupos, searchTerm, profesores) => {
  // Validar que grupos sea un array
  if (!Array.isArray(grupos)) {
    console.warn('⚠️ filtrarGrupos: grupos no es un array:', grupos);
    return [];
  }
  
  if (!searchTerm || searchTerm.trim() === '') {
    return grupos;
  }
  
  const termino = searchTerm.toLowerCase();
  
  return grupos.filter(grupo => {
    try {
      const nombreGrupo = grupo?.nombre_grupo?.toLowerCase() || '';
      const nombreProfesor = obtenerNombreProfesor(grupo?.id_docente, profesores).toLowerCase();
      
      return nombreGrupo.includes(termino) || nombreProfesor.includes(termino);
    } catch (error) {
      console.error('Error filtrando grupo:', error, grupo);
      return false;
    }
  });
};
