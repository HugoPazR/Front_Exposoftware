import { API_ENDPOINTS, API_BASE_URL } from "../utils/constants";

/**
 * Servicio para gestión académica (Facultades y Programas)
 * Usa endpoints públicos (sin autenticación requerida)
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
 * Obtener todas las facultades (sin autenticación requerida)
 * El endpoint acepta authorization opcional para usuarios autenticados
 * @returns {Promise<Array>} Lista de facultades
 */
export const obtenerFacultades = async () => {
  try {
    const endpoint = `${API_ENDPOINTS.FACULTADES_PUBLICO}`;
    
    console.log('🏛️ Obteniendo facultades desde:', endpoint);
    
    // Header opcional - si hay token lo incluye
    const headers = {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    };
    
    const token = getAuthToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    
    const response = await fetch(endpoint, {
      method: 'GET',
      headers
    });

    console.log('📡 Status:', response.status, response.statusText);

    if (response.ok) {
      const data = await response.json();
      console.log('✅ Facultades obtenidas del backend:', data);
      
      // El backend devuelve { status: "success", data: [...] }
      const facultades = data.data || [];
      
      return facultades.map(facultad => ({
        id: facultad.id_facultad || facultad.id,
        nombre: facultad.nombre_facultad || facultad.nombre,
        codigo: facultad.codigo_facultad || facultad.codigo,
        descripcion: facultad.descripcion || ''
      }));
    } else {
      const errorData = await response.json().catch(() => ({}));
      console.error('❌ Error al obtener facultades:', errorData);
      throw new Error(errorData.message || 'Error al cargar facultades');
    }
  } catch (error) {
    console.error('❌ Error de conexión al obtener facultades:', error);
    throw error;
  }
};

/**
 * Obtener programas de una facultad específica (sin autenticación requerida)
 * El endpoint acepta authorization opcional para usuarios autenticados
 * @param {string|number} facultadId - ID de la facultad
 * @returns {Promise<Array>} Lista de programas
 */
export const obtenerProgramasPorFacultad = async (facultadId) => {
  try {
    if (!facultadId) {
      console.warn('⚠️ No se proporcionó ID de facultad');
      return [];
    }

    const endpoint = `${API_ENDPOINTS.FACULTADES_PUBLICO}/${facultadId}`;
      
    console.log('📚 Obteniendo programas de facultad', facultadId, 'desde:', endpoint);
    
    // Header opcional - si hay token lo incluye
    const headers = {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    };
    
    const token = getAuthToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    
    const response = await fetch(endpoint, {
      method: 'GET',
      headers
    });

    console.log('📡 Status:', response.status, response.statusText);

    if (response.ok) {
      const data = await response.json();
      console.log('✅ Programas obtenidos del backend:', data);
      
      // El backend devuelve { status: "success", data: { facultad: {...}, programas: [...] } }
      const facultadData = data.data || {};
      const programas = facultadData.programas || [];
      
      console.log('✅ Programas cargados:', programas.length);
      
      return programas.map(programa => ({
        codigo: programa.codigo_programa || programa.codigo,
        nombre: programa.nombre_programa || programa.nombre,
        nivel: programa.nivel_formacion || programa.nivel || 'Pregrado',
        modalidad: programa.modalidad || 'Presencial',
        duracion: programa.duracion_semestres || programa.duracion,
        creditos: programa.creditos_totales || programa.creditos,
        facultadId: programa.id_facultad || facultadId
      }));
    } else {
      const errorData = await response.json().catch(() => ({}));
      console.error('❌ Error al obtener programas:', errorData);
      throw new Error(errorData.message || 'Error al cargar programas');
    }
  } catch (error) {
    console.error('❌ Error de conexión al obtener programas:', error);
    throw error;
  }
};

/**
 * Obtener todos los programas académicos (sin filtro de facultad)
 * Como el backend no tiene un endpoint directo, obtiene programas de todas las facultades
 * @returns {Promise<Array>} Lista de todos los programas
 */
export const obtenerTodosProgramas = async () => {
  try {
    console.log('📚 Obteniendo todos los programas...');
    
    // Primero obtenemos todas las facultades
    const facultades = await obtenerFacultades();
    console.log('✅ Facultades obtenidas:', facultades.length);
    
    // Luego obtenemos los programas de cada facultad
    const todasLasPromesas = facultades.map(facultad => 
      obtenerProgramasPorFacultad(facultad.id)
    );
    
    const resultadosPorFacultad = await Promise.all(todasLasPromesas);
    
    // Aplanar el array de arrays en un solo array de programas
    const todosProgramas = resultadosPorFacultad.flat();
    
    console.log('✅ Total de programas obtenidos:', todosProgramas.length);
    
    return todosProgramas;
  } catch (error) {
    console.error('❌ Error al obtener todos los programas:', error);
    throw error;
  }
};
