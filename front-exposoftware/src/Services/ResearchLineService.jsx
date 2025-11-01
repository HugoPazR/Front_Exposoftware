const API_URL = 'https://z6gasdnp5zp6v6egg4kg3jsitu0ffcqu.lambda-url.us-east-1.on.aws';

// ==================== SISTEMA DE CACHÉ Y DEDUPLICACIÓN ====================

// Caché de respuestas con timestamps
const cache = {
  arbolCompleto: null,
  arbolCompletoTime: 0,
  CACHE_DURATION: 30000 // 30 segundos
};

// Promesas pendientes para evitar solicitudes duplicadas
let arbolCompletoPromise = null;

/**
 * Limpiar caché si ha expirado
 */
const limpiarCacheSiExpiro = () => {
  if (cache.arbolCompleto && Date.now() - cache.arbolCompletoTime > cache.CACHE_DURATION) {
    console.log('♻️ Caché del árbol completo expirado');
    cache.arbolCompleto = null;
    cache.arbolCompletoTime = 0;
  }
};

/**
 * Obtener el árbol completo con deduplicación de solicitudes
 */
const obtenerArbolCompletoConDedup = async () => {
  limpiarCacheSiExpiro();
  
  // Si ya hay una solicitud en progreso, esperar a que termine
  if (arbolCompletoPromise) {
    console.log('⏳ Esperando solicitud previa de árbol completo...');
    return arbolCompletoPromise;
  }
  
  // Si el resultado está en caché, devolverlo
  if (cache.arbolCompleto) {
    console.log('📦 Devolviendo árbol completo desde caché');
    return cache.arbolCompleto;
  }
  
  // Crear nueva solicitud
  arbolCompletoPromise = (async () => {
    try {
      console.log('🔍 Obteniendo árbol completo desde API...');
      const response = await fetch(`${API_URL}/api/v1/public-investigacion/arbol-completo`, {
        method: 'GET',
        headers: getAuthHeaders()
      });

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      const arbol = Array.isArray(data) ? data : (data.lineas || []);
      
      // Almacenar en caché
      cache.arbolCompleto = arbol;
      cache.arbolCompletoTime = Date.now();
      
      console.log('✅ Árbol completo cacheado');
      return arbol;
    } catch (error) {
      console.error('❌ Error obteniendo árbol completo:', error);
      throw error;
    } finally {
      arbolCompletoPromise = null;
    }
  })();
  
  return arbolCompletoPromise;
};

/**
 * Obtener el token de autenticación
 */
const getAuthToken = () => {
  return localStorage.getItem('auth_token');
};

/**
 * Headers comunes con autenticación
 */
const getAuthHeaders = () => {
  const token = getAuthToken();
  return {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` })
  };
};

// ==================== LÍNEAS DE INVESTIGACIÓN ====================

/**
 * Obtener todas las líneas de investigación
 * GET /api/v1/public-investigacion/lineas
 */
export const obtenerLineas = async () => {
  try {
    console.log('🔍 Obteniendo líneas desde:', `${API_URL}/api/v1/public-investigacion/lineas`);
    
    const response = await fetch(`${API_URL}/api/v1/public-investigacion/lineas`, {
      method: 'GET',
      headers: getAuthHeaders()
    });

    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    console.log('📦 Respuesta completa de líneas:', data);
    
    // El backend puede devolver: array directo, {data: array}, o {lineas: array}
    let lineas = [];
    if (Array.isArray(data)) {
      lineas = data;
    } else if (data.data && Array.isArray(data.data)) {
      lineas = data.data;
    } else if (data.lineas && Array.isArray(data.lineas)) {
      lineas = data.lineas;
    }
    
    console.log('✅ Líneas procesadas:', lineas);
    return lineas;
    
  } catch (error) {
    console.error('❌ Error obteniendo líneas:', error);
    throw new Error('No se pudieron cargar las líneas de investigación');
  }
};

/**
 * Obtener línea de investigación por ID
 * GET /api/v1/admin/investigacion/lineas/{lineaId}
 */
export const obtenerLineaPorId = async (lineaId) => {
  try {
    console.log(`🔍 Obteniendo línea ${lineaId} desde:`, `${API_URL}/api/v1/admin/investigacion/lineas/${lineaId}`);
    
    const response = await fetch(`${API_URL}/api/v1/admin/investigacion/lineas/${lineaId}`, {
      method: 'GET',
      headers: getAuthHeaders()
    });

    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    console.log(`✅ Línea ${lineaId} obtenida:`, data);
    
    return data.data || data;
    
  } catch (error) {
    console.error(`❌ Error obteniendo línea ${lineaId}:`, error);
    throw error;
  }
};

/**
 * Crear una nueva línea de investigación
 * POST /api/v1/admin/investigacion/lineas
 * 
 * @param {Object} lineaData - Datos de la línea
 * @param {string} lineaData.nombre_linea - Nombre de la línea
 * @param {number} lineaData.codigo_linea - Código de la línea
 */
export const crearLinea = async (lineaData) => {
  try {
    if (!lineaData.nombre_linea || !lineaData.nombre_linea.trim()) {
      throw new Error('El nombre de la línea es obligatorio');
    }

    const payload = {
      nombre_linea: lineaData.nombre_linea.trim(),
      ...(lineaData.codigo_linea && { codigo_linea: typeof lineaData.codigo_linea === 'string' ? parseInt(lineaData.codigo_linea) : lineaData.codigo_linea })
    };

    console.log('📤 Creando línea - Payload enviado:', JSON.stringify(payload, null, 2));
    console.log('📤 Headers:', getAuthHeaders());

    const response = await fetch(`${API_URL}/api/v1/admin/investigacion/lineas`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(payload)
    });

    console.log('📡 Response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('📄 Response RAW text:', errorText);
      
      let errorData = {};
      try {
        errorData = JSON.parse(errorText);
      } catch (e) {
        console.error('⚠️ No se pudo parsear el error como JSON');
        errorData = { message: errorText };
      }
      
      console.error('❌ Error del servidor:', {
        status: response.status,
        statusText: response.statusText,
        errorData: errorData,
        errorDataStringified: JSON.stringify(errorData, null, 2)
      });
      
      // Mostrar detalles específicos del error
      if (errorData.detail) {
        throw new Error(`Error: ${errorData.detail}`);
      } else if (errorData.message) {
        throw new Error(`Error: ${errorData.message}`);
      } else {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }
    }

    const resultado = await response.json();
    console.log('✅ Línea creada:', resultado);
    
    return resultado;
    
  } catch (error) {
    console.error('❌ Error creando línea:', error);
    throw error;
  }
};

/**
 * Actualizar una línea de investigación
 * PUT /api/v1/admin/investigacion/lineas/{lineaId}
 */
export const actualizarLinea = async (lineaId, lineaData) => {
  try {
    if (!lineaData.nombre_linea || !lineaData.nombre_linea.trim()) {
      throw new Error('El nombre de la línea es obligatorio');
    }

    const payload = {
      nombre_linea: lineaData.nombre_linea.trim()
    };

    console.log(`📤 Actualizando línea ${lineaId}:`, payload);

    const response = await fetch(`${API_URL}/api/v1/admin/investigacion/lineas/${lineaId}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.detail || `Error ${response.status}: ${response.statusText}`);
    }

    const resultado = await response.json();
    console.log(`✅ Línea ${lineaId} actualizada:`, resultado);
    
    return resultado;
    
  } catch (error) {
    console.error('❌ Error actualizando línea:', error);
    throw error;
  }
};

/**
 * Eliminar una línea de investigación
 * DELETE /api/v1/admin/investigacion/lineas/{lineaId}
 */
export const eliminarLinea = async (lineaId) => {
  try {
    console.log(`🗑️ Eliminando línea ${lineaId}`);

    const response = await fetch(`${API_URL}/api/v1/admin/investigacion/lineas/${lineaId}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.detail || `Error ${response.status}: ${response.statusText}`);
    }

    console.log('✅ Línea eliminada');
    return true;
    
  } catch (error) {
    console.error('❌ Error eliminando línea:', error);
    throw error;
  }
};

// ==================== SUBLÍNEAS ====================

/**
 * Obtener sublíneas de una línea específica
 * GET /api/v1/public-investigacion/lineas/{lineaId}/sublineas
 */
export const obtenerSublineas = async (lineaId) => {
  try {
    const response = await fetch(`${API_URL}/api/v1/public-investigacion/lineas/${lineaId}/sublineas`, {
      method: 'GET',
      headers: getAuthHeaders()
    });

    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    const sublineas = Array.isArray(data) ? data : (data.data || data.sublineas || []);
    return sublineas;
    
  } catch (error) {
    console.error(`Error obteniendo sublíneas de línea ${lineaId}:`, error);
    throw new Error('No se pudieron cargar las sublíneas');
  }
};

/**
 * Obtener sublínea por ID
 * GET /api/v1/public-investigacion/lineas/{lineaId}/sublineas/{sublineaId}
 */
export const obtenerSublineaPorId = async (lineaId, sublineaId) => {
  try {
    const response = await fetch(`${API_URL}/api/v1/public-investigacion/lineas/${lineaId}/sublineas/${sublineaId}`, {
      method: 'GET',
      headers: getAuthHeaders()
    });

    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    return data.data || data;
    
  } catch (error) {
    console.error(`Error obteniendo sublínea ${sublineaId}:`, error);
    throw error;
  }
};

/**
 * Obtener todas las sublíneas (de todas las líneas)
 */
export const obtenerTodasSublineas = async () => {
  try {
    console.log('🔍 Obteniendo todas las sublíneas...');
    
    // Usar el árbol completo cacheado con deduplicación
    const arbol = await obtenerArbolCompletoConDedup();
    
    // Extraer todas las sublíneas
    const sublineas = [];
    arbol.forEach(linea => {
      if (linea.sublineas && Array.isArray(linea.sublineas)) {
        linea.sublineas.forEach(sublinea => {
          sublineas.push({
            ...sublinea,
            codigo_linea: linea.codigo_linea,
            nombre_linea: linea.nombre_linea
          });
        });
      }
    });
    
    console.log(`✅ ${sublineas.length} sublíneas extraídas del árbol`);
    return sublineas;
    
  } catch (error) {
    console.error('❌ Error obteniendo todas las sublíneas:', error);
    throw new Error('No se pudieron cargar las sublíneas');
  }
};

/**
 * Crear una sublínea
 * POST /api/v1/admin/investigacion/lineas/{lineaId}/sublineas
 */
export const crearSublinea = async (lineaId, sublineaData) => {
  try {
    if (!sublineaData.nombre_sublinea || !sublineaData.nombre_sublinea.trim()) {
      throw new Error('El nombre de la sublínea es obligatorio');
    }

    const payload = {
      nombre_sublinea: sublineaData.nombre_sublinea.trim(),
      codigo_linea: typeof lineaId === 'string' ? parseInt(lineaId) : lineaId
    };

    console.log(`📤 Creando sublínea en línea ${lineaId}:`, payload);

    const response = await fetch(`${API_URL}/api/v1/admin/investigacion/lineas/${lineaId}/sublineas`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.detail || `Error ${response.status}: ${response.statusText}`);
    }

    const resultado = await response.json();
    console.log('✅ Sublínea creada:', resultado);
    
    return resultado;
    
  } catch (error) {
    console.error('❌ Error creando sublínea:', error);
    throw error;
  }
};

/**
 * Actualizar una sublínea
 * PUT /api/v1/admin/investigacion/lineas/{lineaId}/sublineas/{sublineaId}
 */
export const actualizarSublinea = async (lineaId, sublineaId, sublineaData) => {
  try {
    if (!sublineaData.nombre_sublinea || !sublineaData.nombre_sublinea.trim()) {
      throw new Error('El nombre de la sublínea es obligatorio');
    }

    const payload = {
      nombre_sublinea: sublineaData.nombre_sublinea.trim()
    };

    console.log(`📤 Actualizando sublínea ${sublineaId}:`, payload);

    const response = await fetch(`${API_URL}/api/v1/admin/investigacion/lineas/${lineaId}/sublineas/${sublineaId}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.detail || `Error ${response.status}: ${response.statusText}`);
    }

    const resultado = await response.json();
    console.log(`✅ Sublínea ${sublineaId} actualizada:`, resultado);
    
    return resultado;
    
  } catch (error) {
    console.error('❌ Error actualizando sublínea:', error);
    throw error;
  }
};

/**
 * Eliminar una sublínea
 * DELETE /api/v1/admin/investigacion/lineas/{lineaId}/sublineas/{sublineaId}
 */
export const eliminarSublinea = async (lineaId, sublineaId) => {
  try {
    console.log(`🗑️ Eliminando sublínea ${sublineaId}`);

    const response = await fetch(`${API_URL}/api/v1/admin/investigacion/lineas/${lineaId}/sublineas/${sublineaId}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.detail || `Error ${response.status}: ${response.statusText}`);
    }

    console.log('✅ Sublínea eliminada');
    return true;
    
  } catch (error) {
    console.error('❌ Error eliminando sublínea:', error);
    throw error;
  }
};

// ==================== ÁREAS TEMÁTICAS ====================

/**
 * Obtener áreas temáticas de una sublínea específica
 * GET /api/v1/public-investigacion/lineas/{lineaId}/sublineas/{sublineaId}/areas-tematicas
 */
export const obtenerAreas = async (lineaId, sublineaId) => {
  try {
    const response = await fetch(`${API_URL}/api/v1/public-investigacion/lineas/${lineaId}/sublineas/${sublineaId}/areas-tematicas`, {
      method: 'GET',
      headers: getAuthHeaders()
    });

    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    const areas = Array.isArray(data) ? data : (data.data || data.areas || []);
    return areas;
    
  } catch (error) {
    console.error(`Error obteniendo áreas de sublínea ${sublineaId}:`, error);
    throw new Error('No se pudieron cargar las áreas temáticas');
  }
};

/**
 * Obtener área temática por ID
 * GET /api/v1/public-investigacion/lineas/{lineaId}/sublineas/{sublineaId}/areas-tematicas/{areaId}
 */
export const obtenerAreaPorId = async (lineaId, sublineaId, areaId) => {
  try {
    const response = await fetch(`${API_URL}/api/v1/public-investigacion/lineas/${lineaId}/sublineas/${sublineaId}/areas-tematicas/${areaId}`, {
      method: 'GET',
      headers: getAuthHeaders()
    });

    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    return data.data || data;
    
  } catch (error) {
    console.error(`Error obteniendo área ${areaId}:`, error);
    throw error;
  }
};

/**
 * Obtener todas las áreas temáticas (de todas las sublíneas)
 */
export const obtenerTodasAreas = async () => {
  try {
    console.log('🔍 Obteniendo todas las áreas temáticas...');
    
    // Usar el árbol completo cacheado con deduplicación
    const arbol = await obtenerArbolCompletoConDedup();
    
    // Extraer todas las áreas
    const areas = [];
    arbol.forEach(linea => {
      if (linea.sublineas && Array.isArray(linea.sublineas)) {
        linea.sublineas.forEach(sublinea => {
          if (sublinea.areas_tematicas && Array.isArray(sublinea.areas_tematicas)) {
            sublinea.areas_tematicas.forEach(area => {
              areas.push({
                ...area,
                codigo_sublinea: sublinea.codigo_sublinea,
                nombre_sublinea: sublinea.nombre_sublinea,
                codigo_linea: linea.codigo_linea,
                nombre_linea: linea.nombre_linea
              });
            });
          }
        });
      }
    });
    
    console.log(`✅ ${areas.length} áreas extraídas del árbol`);
    return areas;
    
  } catch (error) {
    console.error('❌ Error obteniendo todas las áreas temáticas:', error);
    throw new Error('No se pudieron cargar las áreas temáticas');
  }
};

/**
 * Crear un área temática
 * POST /api/v1/admin/investigacion/lineas/{lineaId}/sublineas/{sublineaId}/areas-tematicas
 */
export const crearArea = async (lineaId, sublineaId, areaData) => {
  try {
    if (!areaData.nombre_area || !areaData.nombre_area.trim()) {
      throw new Error('El nombre del área temática es obligatorio');
    }

    const payload = {
      nombre_area: areaData.nombre_area.trim(),
      codigo_sublinea: typeof sublineaId === 'string' ? parseInt(sublineaId) : sublineaId
    };

    console.log(`📤 Creando área en sublínea ${sublineaId}:`, payload);

    const response = await fetch(`${API_URL}/api/v1/admin/investigacion/lineas/${lineaId}/sublineas/${sublineaId}/areas-tematicas`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.detail || `Error ${response.status}: ${response.statusText}`);
    }

    const resultado = await response.json();
    console.log('✅ Área temática creada:', resultado);
    
    return resultado;
    
  } catch (error) {
    console.error('❌ Error creando área temática:', error);
    throw error;
  }
};

/**
 * Actualizar un área temática
 * PUT /api/v1/admin/investigacion/lineas/{lineaId}/sublineas/{sublineaId}/areas-tematicas/{areaId}
 */
export const actualizarArea = async (lineaId, sublineaId, areaId, areaData) => {
  try {
    if (!areaData.nombre_area || !areaData.nombre_area.trim()) {
      throw new Error('El nombre del área temática es obligatorio');
    }

    const payload = {
      nombre_area: areaData.nombre_area.trim()
    };

    console.log(`📤 Actualizando área ${areaId}:`, payload);

    const response = await fetch(`${API_URL}/api/v1/admin/investigacion/lineas/${lineaId}/sublineas/${sublineaId}/areas-tematicas/${areaId}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.detail || `Error ${response.status}: ${response.statusText}`);
    }

    const resultado = await response.json();
    console.log(`✅ Área temática ${areaId} actualizada:`, resultado);
    
    return resultado;
    
  } catch (error) {
    console.error('❌ Error actualizando área temática:', error);
    throw error;
  }
};

/**
 * Eliminar un área temática
 * DELETE /api/v1/admin/investigacion/lineas/{lineaId}/sublineas/{sublineaId}/areas-tematicas/{areaId}
 */
export const eliminarArea = async (lineaId, sublineaId, areaId) => {
  try {
    console.log(`🗑️ Eliminando área ${areaId}`);

    const response = await fetch(`${API_URL}/api/v1/admin/investigacion/lineas/${lineaId}/sublineas/${sublineaId}/areas-tematicas/${areaId}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.detail || `Error ${response.status}: ${response.statusText}`);
    }

    console.log('✅ Área temática eliminada');
    return true;
    
  } catch (error) {
    console.error('❌ Error eliminando área temática:', error);
    throw error;
  }
};
