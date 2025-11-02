import { API_ENDPOINTS } from "../utils/constants";
import { FACULTADES_ESTATICAS, PROGRAMAS_ESTATICOS, obtenerTodosProgramasEstaticos } from "../data/facultadesYProgramas";

/**
 * Servicio para gestión académica (Facultades y Programas)
 * Soporta endpoints públicos (sin auth), protegidos (con auth) y datos estáticos como fallback
 */

/**
 * Obtiene el token de autenticación si existe
 * @returns {string|null} Token de autenticación o null
 */
const getAuthToken = () => {
  try {
    return localStorage.getItem('auth_token');
  } catch (error) {
    return null;
  }
};

/**
 * Crea headers para peticiones, incluyendo token si está disponible
 * @param {boolean} requireAuth - Si requiere autenticación obligatoria
 * @returns {Object} Headers de la petición
 */
const createHeaders = (requireAuth = false) => {
  const headers = {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  };

  const token = getAuthToken();
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  } else if (requireAuth) {
    throw new Error('Se requiere autenticación para esta operación');
  }

  return headers;
};

/**
 * Obtener todas las facultades (sin autenticación)
 * Intenta primero con el backend, si falla usa datos estáticos
 * @param {boolean} usePublicEndpoint - Usar endpoint público (default: true)
 * @returns {Promise<Array>} Lista de facultades
 */
export const obtenerFacultades = async (usePublicEndpoint = true) => {
  try {
    // Usar endpoint público por defecto para permitir registro sin login
    const endpoint = usePublicEndpoint ? API_ENDPOINTS.FACULTADES_PUBLICO : API_ENDPOINTS.FACULTADES;
    
    console.log('🏛️ Obteniendo facultades desde:', endpoint);
    
    const response = await fetch(endpoint, {
      method: 'GET',
      headers: createHeaders(!usePublicEndpoint) // Solo requiere auth si no es público
    });

    console.log('📡 Status:', response.status, response.statusText);

    if (response.ok) {
      const data = await response.json();
      console.log('✅ Facultades obtenidas del backend:', data);
      
      // Normalizar la respuesta (puede venir como { facultades: [...] } o directamente [...])
      const facultades = Array.isArray(data) ? data : (data.facultades || data.data || []);
      
      return facultades.map(facultad => ({
        id: facultad.id_facultad || facultad.id,
        nombre: facultad.nombre_facultad || facultad.nombre,
        codigo: facultad.codigo_facultad || facultad.codigo,
        descripcion: facultad.descripcion || ''
      }));
    } else if (response.status === 403) {
      // Si el endpoint público no está disponible o requiere auth, usar datos estáticos
      console.warn('⚠️ Endpoint requiere autenticación, usando datos estáticos como fallback');
      console.log('✅ Facultades cargadas desde datos estáticos');
      return FACULTADES_ESTATICAS;
    } else {
      const errorData = await response.json().catch(() => ({}));
      console.error('❌ Error al obtener facultades:', errorData);
      // Usar datos estáticos en caso de error
      console.warn('⚠️ Usando datos estáticos como fallback');
      return FACULTADES_ESTATICAS;
    }
  } catch (error) {
    console.error('❌ Error de conexión al obtener facultades:', error);
    // Usar datos estáticos en caso de error de conexión
    console.warn('⚠️ Usando datos estáticos como fallback');
    return FACULTADES_ESTATICAS;
  }
};

/**
 * Obtener programas de una facultad específica
 * Intenta primero con el backend, si falla usa datos estáticos
 * @param {string|number} facultadId - ID de la facultad
 * @param {boolean} usePublicEndpoint - Usar endpoint público (default: true)
 * @returns {Promise<Array>} Lista de programas
 */
export const obtenerProgramasPorFacultad = async (facultadId, usePublicEndpoint = true) => {
  try {
    if (!facultadId) {
      console.warn('⚠️ No se proporcionó ID de facultad');
      return [];
    }

    const endpoint = usePublicEndpoint 
      ? API_ENDPOINTS.PROGRAMAS_BY_FACULTAD_PUBLICO(facultadId)
      : API_ENDPOINTS.PROGRAMAS_BY_FACULTAD(facultadId);
      
    console.log('📚 Obteniendo programas de facultad', facultadId, 'desde:', endpoint);
    
    const response = await fetch(endpoint, {
      method: 'GET',
      headers: createHeaders(!usePublicEndpoint)
    });

    console.log('📡 Status:', response.status, response.statusText);

    if (response.ok) {
      const data = await response.json();
      console.log('✅ Programas obtenidos del backend:', data);
      
      // Normalizar la respuesta
      const programas = Array.isArray(data) ? data : (data.programas || data.data || []);
      
      return programas.map(programa => ({
        codigo: programa.codigo_programa || programa.codigo,
        nombre: programa.nombre_programa || programa.nombre,
        nivel: programa.nivel_formacion || programa.nivel || 'Pregrado',
        modalidad: programa.modalidad || 'Presencial',
        duracion: programa.duracion_semestres || programa.duracion,
        creditos: programa.creditos_totales || programa.creditos,
        facultadId: programa.id_facultad || facultadId
      }));
    } else if (response.status === 403 || response.status === 404) {
      // Usar datos estáticos como fallback
      console.warn('⚠️ Endpoint no disponible, usando datos estáticos como fallback');
      const programasEstaticos = PROGRAMAS_ESTATICOS[facultadId] || [];
      console.log('✅ Programas cargados desde datos estáticos:', programasEstaticos.length);
      return programasEstaticos;
    } else {
      const errorData = await response.json().catch(() => ({}));
      console.error('❌ Error al obtener programas:', errorData);
      // Usar datos estáticos en caso de error
      const programasEstaticos = PROGRAMAS_ESTATICOS[facultadId] || [];
      console.warn('⚠️ Usando datos estáticos como fallback');
      return programasEstaticos;
    }
  } catch (error) {
    console.error('❌ Error de conexión al obtener programas:', error);
    // Usar datos estáticos en caso de error de conexión
    const programasEstaticos = PROGRAMAS_ESTATICOS[facultadId] || [];
    console.warn('⚠️ Usando datos estáticos como fallback');
    return programasEstaticos;
  }
};

/**
 * Obtener todos los programas académicos (sin filtro de facultad)
 * Intenta primero con el backend, si falla usa datos estáticos
 * @param {boolean} usePublicEndpoint - Usar endpoint público (default: true)
 * @returns {Promise<Array>} Lista de todos los programas
 */
export const obtenerTodosProgramas = async (usePublicEndpoint = true) => {
  try {
    const endpoint = usePublicEndpoint ? API_ENDPOINTS.PROGRAMAS_PUBLICO : API_ENDPOINTS.PROGRAMAS;
    
    console.log('📚 Obteniendo todos los programas desde:', endpoint);
    
    const response = await fetch(endpoint, {
      method: 'GET',
      headers: createHeaders(!usePublicEndpoint)
    });

    console.log('📡 Status:', response.status, response.statusText);

    if (response.ok) {
      const data = await response.json();
      console.log('✅ Todos los programas obtenidos del backend:', data);
      
      // Normalizar la respuesta
      const programas = Array.isArray(data) ? data : (data.programas || data.data || []);
      
      return programas.map(programa => ({
        codigo: programa.codigo_programa || programa.codigo,
        nombre: programa.nombre_programa || programa.nombre,
        nivel: programa.nivel_formacion || programa.nivel || 'Pregrado',
        modalidad: programa.modalidad || 'Presencial',
        duracion: programa.duracion_semestres || programa.duracion,
        creditos: programa.creditos_totales || programa.creditos,
        facultadId: programa.id_facultad,
        nombreFacultad: programa.nombre_facultad
      }));
    } else if (response.status === 403) {
      // Usar datos estáticos como fallback
      console.warn('⚠️ Endpoint requiere autenticación, usando datos estáticos como fallback');
      const todosLosProgramas = obtenerTodosProgramasEstaticos();
      console.log('✅ Todos los programas cargados desde datos estáticos:', todosLosProgramas.length);
      return todosLosProgramas;
    } else {
      const errorData = await response.json().catch(() => ({}));
      console.error('❌ Error al obtener programas:', errorData);
      // Usar datos estáticos en caso de error
      const todosLosProgramas = obtenerTodosProgramasEstaticos();
      console.warn('⚠️ Usando datos estáticos como fallback');
      return todosLosProgramas;
    }
  } catch (error) {
    console.error('❌ Error de conexión al obtener programas:', error);
    // Usar datos estáticos en caso de error de conexión
    const todosLosProgramas = obtenerTodosProgramasEstaticos();
    console.warn('⚠️ Usando datos estáticos como fallback');
    return todosLosProgramas;
  }
};
