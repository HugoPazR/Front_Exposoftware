const API_URL = 'https://z6gasdnp5zp6v6egg4kg3jsitu0ffcqu.lambda-url.us-east-1.on.aws';

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

/**
 * Servicio para la gestión de líneas, sublíneas y áreas temáticas de investigación
 */
class ResearchLinesService {
  
  // ==================== LÍNEAS DE INVESTIGACIÓN ====================
  
  /**
   * Obtener todas las líneas de investigación
   * GET /api/v1/public-investigacion/lineas (público)
   */
  static async obtenerLineas() {
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
  }

  /**
   * Crear una nueva línea de investigación
   * POST /api/v1/admin/investigacion/lineas
   * 
   * @param {Object} lineaData - Datos de la línea
   * @param {string} lineaData.nombre_linea - Nombre de la línea
   */
  static async crearLinea(lineaData) {
    try {
      if (!lineaData.nombre_linea || !lineaData.nombre_linea.trim()) {
        throw new Error('El nombre de la línea es obligatorio');
      }

      // El backend solo acepta códigos entre 0 y 2 (validación: less_than_equal 2)
      let codigoLinea = lineaData.codigo_linea;
      
      if (!codigoLinea) {
        console.log('🔄 Obteniendo líneas existentes para asignar código...');
        try {
          const lineasExistentes = await ResearchLinesService.obtenerLineas();
          console.log('📊 Total líneas existentes:', lineasExistentes.length);
          
          const codigosUsados = lineasExistentes.map(l => l.codigo_linea).filter(c => c != null);
          console.log('📊 Códigos ya usados:', codigosUsados);
          
          // Buscar el primer código disponible entre 1 y 2
          let codigoEncontrado = false;
          for (let i = 1; i <= 2; i++) {
            if (!codigosUsados.includes(i)) {
              codigoLinea = i;
              codigoEncontrado = true;
              console.log('✅ Código disponible encontrado:', codigoLinea);
              break;
            }
          }
          
          if (!codigoEncontrado) {
            throw new Error('No hay códigos disponibles. Solo se permiten 2 líneas de investigación (códigos 1 y 2). Por favor, elimine una línea existente antes de crear una nueva.');
          }
        } catch (error) {
          if (error.message.includes('No hay códigos disponibles')) {
            throw error;
          }
          // Si falla al obtener líneas, mostramos error en lugar de asumir código 1
          console.error('⚠️ Error al obtener líneas existentes:', error);
          throw new Error('No se pudo verificar las líneas existentes. Por favor, recargue la página e intente nuevamente.');
        }
      }

      const payload = {
        codigo_linea: typeof codigoLinea === 'string' ? parseInt(codigoLinea) : codigoLinea,
        nombre_linea: lineaData.nombre_linea.trim()
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
  }

  /**
   * Actualizar una línea de investigación
   * PUT /api/v1/admin/investigacion/lineas/{line_code}
   */
  static async actualizarLinea(codigoLinea, lineaData) {
    try {
      if (!lineaData.nombre_linea || !lineaData.nombre_linea.trim()) {
        throw new Error('El nombre de la línea es obligatorio');
      }

      const payload = {
        nombre_linea: lineaData.nombre_linea.trim()
      };

      console.log(`📤 Actualizando línea ${codigoLinea}:`, payload);

      const response = await fetch(`${API_URL}/api/v1/admin/investigacion/lineas/${codigoLinea}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || `Error ${response.status}: ${response.statusText}`);
      }

      const resultado = await response.json();
      console.log('✅ Línea actualizada:', resultado);
      
      return resultado;
      
    } catch (error) {
      console.error('❌ Error actualizando línea:', error);
      throw error;
    }
  }

  /**
   * Eliminar una línea de investigación
   * DELETE /api/v1/admin/investigacion/lineas/{line_code}
   */
  static async eliminarLinea(codigoLinea) {
    try {
      console.log(`🗑️ Eliminando línea ${codigoLinea}`);

      const response = await fetch(`${API_URL}/api/v1/admin/investigacion/lineas/${codigoLinea}`, {
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
  }

  // ==================== SUBLÍNEAS ====================

  /**
   * Obtener sublíneas de una línea específica
   * GET /api/v1/admin/investigacion/lineas/{line_code}/sublineas
   */
  static async obtenerSublineas(codigoLinea) {
    try {
      const response = await fetch(`${API_URL}/api/v1/admin/investigacion/lineas/${codigoLinea}/sublineas`, {
        method: 'GET',
        headers: getAuthHeaders()
      });

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      const sublineas = await response.json();
      return sublineas;
      
    } catch (error) {
      console.error(`Error obteniendo sublíneas de línea ${codigoLinea}:`, error);
      throw new Error('No se pudieron cargar las sublíneas');
    }
  }

  /**
   * Obtener todas las sublíneas (de todas las líneas)
   */
  static async obtenerTodasSublineas() {
    try {
      // Usar el endpoint del árbol completo
      const response = await fetch(`${API_URL}/api/v1/public-investigacion/arbol-completo`, {
        method: 'GET',
        headers: getAuthHeaders()
      });

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      const arbol = Array.isArray(data) ? data : (data.lineas || []);
      
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
      
      return sublineas;
      
    } catch (error) {
      console.error('Error obteniendo todas las sublíneas:', error);
      throw new Error('No se pudieron cargar las sublíneas');
    }
  }

  /**
   * Crear una sublínea
   * POST /api/v1/admin/investigacion/lineas/{line_code}/sublineas
   */
  static async crearSublinea(codigoLinea, sublineaData) {
    try {
      if (!sublineaData.nombre_sublinea || !sublineaData.nombre_sublinea.trim()) {
        throw new Error('El nombre de la sublínea es obligatorio');
      }

      // El backend solo acepta códigos entre 0 y 2
      let codigoSublinea = sublineaData.codigo_sublinea;
      
      if (!codigoSublinea) {
        try {
          const sublineasExistentes = await ResearchLinesService.obtenerSublineas(codigoLinea);
          const codigosUsados = sublineasExistentes.map(s => s.codigo_sublinea);
          console.log(`📊 Códigos de sublínea ya usados en línea ${codigoLinea}:`, codigosUsados);
          
          // Buscar el primer código disponible entre 1 y 2
          for (let i = 1; i <= 2; i++) {
            if (!codigosUsados.includes(i)) {
              codigoSublinea = i;
              console.log('✅ Código de sublínea disponible:', codigoSublinea);
              break;
            }
          }
          
          if (!codigoSublinea) {
            throw new Error('No hay códigos disponibles. Solo se permiten 2 sublíneas por línea (códigos 1 y 2).');
          }
        } catch (error) {
          if (error.message.includes('No hay códigos disponibles')) {
            throw error;
          }
          console.warn('⚠️ No se pudieron obtener sublíneas, intentando con código 1');
          codigoSublinea = 1;
        }
      }

      const payload = {
        codigo_sublinea: typeof codigoSublinea === 'string' ? parseInt(codigoSublinea) : codigoSublinea,
        nombre_sublinea: sublineaData.nombre_sublinea.trim()
      };

      console.log(`📤 Creando sublínea en línea ${codigoLinea}:`, payload);

      const response = await fetch(`${API_URL}/api/v1/admin/investigacion/lineas/${codigoLinea}/sublineas`, {
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
  }

  /**
   * Actualizar una sublínea
   * PUT /api/v1/admin/investigacion/lineas/{line_code}/sublineas/{subline_code}
   */
  static async actualizarSublinea(codigoLinea, codigoSublinea, sublineaData) {
    try {
      if (!sublineaData.nombre_sublinea || !sublineaData.nombre_sublinea.trim()) {
        throw new Error('El nombre de la sublínea es obligatorio');
      }

      const payload = {
        nombre_sublinea: sublineaData.nombre_sublinea.trim()
      };

      console.log(`📤 Actualizando sublínea ${codigoSublinea}:`, payload);

      const response = await fetch(`${API_URL}/api/v1/admin/investigacion/lineas/${codigoLinea}/sublineas/${codigoSublinea}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || `Error ${response.status}: ${response.statusText}`);
      }

      const resultado = await response.json();
      console.log('✅ Sublínea actualizada:', resultado);
      
      return resultado;
      
    } catch (error) {
      console.error('❌ Error actualizando sublínea:', error);
      throw error;
    }
  }

  /**
   * Eliminar una sublínea
   * DELETE /api/v1/admin/investigacion/lineas/{line_code}/sublineas/{subline_code}
   */
  static async eliminarSublinea(codigoLinea, codigoSublinea) {
    try {
      console.log(`🗑️ Eliminando sublínea ${codigoSublinea}`);

      const response = await fetch(`${API_URL}/api/v1/admin/investigacion/lineas/${codigoLinea}/sublineas/${codigoSublinea}`, {
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
  }

  // ==================== ÁREAS TEMÁTICAS ====================

  /**
   * Obtener áreas temáticas de una sublínea específica
   * GET /api/v1/admin/investigacion/lineas/{line_code}/sublineas/{subline_code}/areas-tematicas
   */
  static async obtenerAreas(codigoLinea, codigoSublinea) {
    try {
      const response = await fetch(`${API_URL}/api/v1/admin/investigacion/lineas/${codigoLinea}/sublineas/${codigoSublinea}/areas-tematicas`, {
        method: 'GET',
        headers: getAuthHeaders()
      });

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      const areas = await response.json();
      return areas;
      
    } catch (error) {
      console.error(`Error obteniendo áreas de sublínea ${codigoSublinea}:`, error);
      throw new Error('No se pudieron cargar las áreas temáticas');
    }
  }

  /**
   * Obtener todas las áreas temáticas (de todas las sublíneas)
   */
  static async obtenerTodasAreas() {
    try {
      const response = await fetch(`${API_URL}/api/v1/public-investigacion/arbol-completo`, {
        method: 'GET',
        headers: getAuthHeaders()
      });

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      const arbol = Array.isArray(data) ? data : (data.lineas || []);
      
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
      
      return areas;
      
    } catch (error) {
      console.error('Error obteniendo todas las áreas:', error);
      throw new Error('No se pudieron cargar las áreas temáticas');
    }
  }

  // ==================== MAPAS DE CONSULTA RÁPIDA ====================

  /**
   * 🗺️ Obtener árbol completo de investigación
   * GET /api/v1/public-investigacion/arbol-completo
   * Retorna la estructura completa: líneas > sublíneas > áreas
   */
  static async obtenerArbolCompleto() {
    try {
      console.log('🌳 Obteniendo árbol completo de investigación...');
      
      const response = await fetch(`${API_URL}/api/v1/public-investigacion/arbol-completo`, {
        method: 'GET',
        headers: getAuthHeaders()
      });

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      const arbol = Array.isArray(data) ? data : (data.data || data.lineas || []);
      
      console.log('✅ Árbol de investigación obtenido:', arbol);
      return arbol;
      
    } catch (error) {
      console.error('❌ Error obteniendo árbol de investigación:', error);
      throw new Error('No se pudo cargar la estructura de investigación');
    }
  }

  /**
   * 🗺️ Crear mapas para búsqueda rápida de nombres
   * Retorna objetos con mapas de código -> nombre para líneas, sublíneas y áreas
   * @returns {Promise<Object>} Objeto con mapas: { lineasMap, sublineasMap, areasMap }
   */
  static async obtenerMapasInvestigacion() {
    try {
      console.log('📊 Creando mapas de investigación...');
      
      const arbol = await ResearchLinesService.obtenerArbolCompleto();
      
      const lineasMap = new Map();
      const sublineasMap = new Map();
      const areasMap = new Map();
      
      arbol.forEach(linea => {
        // Mapa de líneas: codigo_linea -> nombre_linea
        lineasMap.set(linea.codigo_linea, linea.nombre_linea || 'Sin nombre');
        
        if (linea.sublineas && Array.isArray(linea.sublineas)) {
          linea.sublineas.forEach(sublinea => {
            // Mapa de sublíneas: codigo_sublinea -> nombre_sublinea
            sublineasMap.set(sublinea.codigo_sublinea, sublinea.nombre_sublinea || 'Sin nombre');
            
            if (sublinea.areas_tematicas && Array.isArray(sublinea.areas_tematicas)) {
              sublinea.areas_tematicas.forEach(area => {
                // Mapa de áreas: codigo_area -> nombre_area
                areasMap.set(area.codigo_area, area.nombre_area || 'Sin nombre');
              });
            }
          });
        }
      });
      
      console.log(`✅ Mapas creados: ${lineasMap.size} líneas, ${sublineasMap.size} sublíneas, ${areasMap.size} áreas`);
      
      return {
        lineasMap,
        sublineasMap,
        areasMap
      };
      
    } catch (error) {
      console.error('❌ Error creando mapas de investigación:', error);
      // Retornar mapas vacíos en caso de error
      return {
        lineasMap: new Map(),
        sublineasMap: new Map(),
        areasMap: new Map()
      };
    }
  }

  /**
   * Crear un área temática
   * POST /api/v1/admin/investigacion/lineas/{line_code}/sublineas/{subline_code}/areas-tematicas
   */
  static async crearArea(codigoLinea, codigoSublinea, areaData) {
    try {
      if (!areaData.nombre_area || !areaData.nombre_area.trim()) {
        throw new Error('El nombre del área temática es obligatorio');
      }

      // El backend solo acepta códigos entre 0 y 2
      let codigoArea = areaData.codigo_area;
      
      if (!codigoArea) {
        try {
          const areasExistentes = await ResearchLinesService.obtenerAreas(codigoLinea, codigoSublinea);
          const codigosUsados = areasExistentes.map(a => a.codigo_area);
          console.log(`📊 Códigos de área ya usados en sublínea ${codigoSublinea}:`, codigosUsados);
          
          // Buscar el primer código disponible entre 1 y 2
          for (let i = 1; i <= 2; i++) {
            if (!codigosUsados.includes(i)) {
              codigoArea = i;
              console.log('✅ Código de área disponible:', codigoArea);
              break;
            }
          }
          
          if (!codigoArea) {
            throw new Error('No hay códigos disponibles. Solo se permiten 2 áreas por sublínea (códigos 1 y 2).');
          }
        } catch (error) {
          if (error.message.includes('No hay códigos disponibles')) {
            throw error;
          }
          console.warn('⚠️ No se pudieron obtener áreas, intentando con código 1');
          codigoArea = 1;
        }
      }

      const payload = {
        codigo_area: typeof codigoArea === 'string' ? parseInt(codigoArea) : codigoArea,
        nombre_area: areaData.nombre_area.trim()
      };

      console.log(`📤 Creando área en sublínea ${codigoSublinea}:`, payload);

      const response = await fetch(`${API_URL}/api/v1/admin/investigacion/lineas/${codigoLinea}/sublineas/${codigoSublinea}/areas-tematicas`, {
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
  }

  /**
   * Actualizar un área temática
   * PUT /api/v1/admin/investigacion/lineas/{line_code}/sublineas/{subline_code}/areas-tematicas/{area_code}
   */
  static async actualizarArea(codigoLinea, codigoSublinea, codigoArea, areaData) {
    try {
      if (!areaData.nombre_area || !areaData.nombre_area.trim()) {
        throw new Error('El nombre del área temática es obligatorio');
      }

      const payload = {
        nombre_area: areaData.nombre_area.trim()
      };

      console.log(`📤 Actualizando área ${codigoArea}:`, payload);

      const response = await fetch(`${API_URL}/api/v1/admin/investigacion/lineas/${codigoLinea}/sublineas/${codigoSublinea}/areas-tematicas/${codigoArea}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || `Error ${response.status}: ${response.statusText}`);
      }

      const resultado = await response.json();
      console.log('✅ Área temática actualizada:', resultado);
      
      return resultado;
      
    } catch (error) {
      console.error('❌ Error actualizando área temática:', error);
      throw error;
    }
  }

  /**
   * Eliminar un área temática
   * DELETE /api/v1/admin/investigacion/lineas/{line_code}/sublineas/{subline_code}/areas-tematicas/{area_code}
   */
  static async eliminarArea(codigoLinea, codigoSublinea, codigoArea) {
    try {
      console.log(`🗑️ Eliminando área ${codigoArea}`);

      const response = await fetch(`${API_URL}/api/v1/admin/investigacion/lineas/${codigoLinea}/sublineas/${codigoSublinea}/areas-tematicas/${codigoArea}`, {
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
  }
}

export default ResearchLinesService;
