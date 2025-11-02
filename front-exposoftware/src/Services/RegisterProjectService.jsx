const API_URL = 'https://z6gasdnp5zp6v6egg4kg3jsitu0ffcqu.lambda-url.us-east-1.on.aws';

/**
 * Obtener el token de autenticación
 */
const getAuthToken = () => localStorage.getItem('auth_token');

/**
 * Headers comunes con autenticación
 */
const getAuthHeaders = () => {
  const token = getAuthToken();
  return {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
  };
};

/**
 * Headers para endpoints públicos (con autenticación)
 * Aunque se llamen "públicos", requieren token JWT válido
 */
const getPublicHeaders = () => {
  const token = getAuthToken();
  if (!token) {
    console.warn('⚠️ No hay token de autenticación disponible');
  }
  return {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
  };
};

/**
 * Servicio para la gestión de proyectos
 */
class RegisterProjectService {
  /**
   * Obtener lista de estudiantes
   * ⚠️ NO HAY ENDPOINT PÚBLICO - Los estudiantes NO se pueden listar sin permisos de admin
   * Solución: El estudiante autenticado se agrega automáticamente al proyecto
   */
  static async obtenerEstudiantes() {
    try {
      console.warn('⚠️ No hay endpoint público para listar estudiantes');
      console.warn('💡 Solución: Usar estudiante autenticado o permitir agregar por ID manual');
      
      // Retornar array vacío - el componente manejará esto
      return [];
    } catch (error) {
      console.error('❌ Error obteniendo estudiantes:', error);
      return [];
    }
  }

  /**
   * Obtener lista de docentes
   * ⚠️ NO HAY ENDPOINT PÚBLICO - Los profesores NO se pueden listar sin permisos de admin
   * Solución: Permitir seleccionar profesor por ID o crear endpoint público
   */
  static async obtenerDocentes() {
    try {
      console.warn('⚠️ No hay endpoint público para listar profesores');
      console.warn('� Solución: Crear /api/v1/public-profesores en backend o permitir búsqueda por ID');
      
      // Retornar array vacío - el componente manejará esto
      return [];
    } catch (error) {
      console.error('❌ Error obteniendo docentes:', error);
      return [];
    }
  }

  /**
   * Obtener líneas de investigación con sublíneas y áreas (árbol completo)
   * ✅ Endpoint: /api/v1/public-investigacion/arbol-completo
   */
  static async obtenerArbolInvestigacion() {
    try {
      const token = getAuthToken();
      console.log('🔑 Token disponible:', token ? `${token.substring(0, 30)}...` : 'NO HAY TOKEN');
      
      const response = await fetch(`${API_URL}/api/v1/public-investigacion/arbol-completo`, {
        method: 'GET',
        headers: getPublicHeaders(),
      });

      console.log('📡 Respuesta del servidor:', response.status, response.statusText);

      if (response.status === 401 || response.status === 403) {
        const errorText = await response.text();
        console.error('🚫 Error de autenticación:', errorText);
        
        try {
          const errorJson = JSON.parse(errorText);
          if (errorJson.code === 'INSUFFICIENT_PERMISSIONS') {
            throw new Error(`⚠️ Tu rol de estudiante no tiene permisos para acceder a las líneas de investigación.\n\nEl backend debe agregar el rol "Estudiante" a los permisos del endpoint:\n/api/v1/public-investigacion/arbol-completo\n\nContacta al administrador del sistema.`);
          }
        } catch (parseError) {
          // Si no se puede parsear, usar mensaje genérico
        }
        
        throw new Error(`No autenticado. El token puede ser inválido o estar expirado. Intenta cerrar sesión y volver a iniciar sesión.`);
      }

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      const arbol = await response.json();
      console.log('🌳 Árbol de investigación completo:', arbol);

      if (!Array.isArray(arbol)) {
        throw new Error('Formato inválido de respuesta.');
      }

      return arbol;
    } catch (error) {
      console.error('❌ Error obteniendo árbol de investigación:', error);
      throw new Error('No se pudo cargar el árbol de investigación.');
    }
  }

  /**
   * Obtener líneas de investigación
   * ✅ Extraído del árbol completo
   */
  static async obtenerLineasInvestigacion() {
    try {
      const arbol = await this.obtenerArbolInvestigacion();

      return arbol.map(linea => ({
        codigo: linea.codigo_linea,
        nombre: linea.nombre_linea,
        sublineas: linea.sublineas || [],
      }));
    } catch (error) {
      console.error('❌ Error obteniendo líneas de investigación:', error);
      throw error;
    }
  }

  /**
   * Obtener sublíneas de investigación
   * ✅ Extraído del árbol completo con referencia a línea padre
   */
  static async obtenerSublineasInvestigacion() {
    try {
      const arbol = await this.obtenerArbolInvestigacion();

      const sublineas = [];
      arbol.forEach(linea => {
        if (Array.isArray(linea.sublineas)) {
          linea.sublineas.forEach(sublinea => {
            sublineas.push({
              codigo: sublinea.codigo_sublinea,
              nombre: sublinea.nombre_sublinea,
              codigoLinea: linea.codigo_linea,
              nombreLinea: linea.nombre_linea, // Para mostrar jerarquía
              areas: sublinea.areas_tematicas || [],
            });
          });
        }
      });

      return sublineas;
    } catch (error) {
      console.error('❌ Error obteniendo sublíneas de investigación:', error);
      throw error;
    }
  }

  /**
   * Obtener áreas temáticas
   * ✅ Extraído del árbol completo con referencia a sublínea padre
   */
  static async obtenerAreasTematicas() {
    try {
      const arbol = await this.obtenerArbolInvestigacion();

      const areas = [];
      arbol.forEach(linea => {
        linea.sublineas?.forEach(sublinea => {
          sublinea.areas_tematicas?.forEach(area => {
            areas.push({
              codigo: area.codigo_area,
              nombre: area.nombre_area,
              codigoSublinea: sublinea.codigo_sublinea,
              nombreSublinea: sublinea.nombre_sublinea, // Para mostrar jerarquía
              nombreLinea: linea.nombre_linea,
            });
          });
        });
      });

      return areas;
    } catch (error) {
      console.error('❌ Error obteniendo áreas temáticas:', error);
      throw error;
    }
  }

  /**
   * Crear un nuevo proyecto
   * ✅ Endpoint: /api/v1/api/v1/proyectos/
   * Nota: Sin calificación (la asigna el profesor después)
   */
  static async crearProyecto(proyectoData, archivoPDF, archivoExtra = null) {
    try {
      // Validaciones previas
      const required = [
        'titulo_proyecto',
        'id_docente',
        'id_grupo',
        'codigo_area',
        'codigo_linea',
        'codigo_sublinea',
        'tipo_actividad',
      ];

      for (const field of required) {
        if (!proyectoData[field]) {
          throw new Error(`El campo ${field.replace('_', ' ')} es obligatorio`);
        }
      }

      // Validar archivos según tipo de actividad
      if (!archivoPDF) {
        throw new Error('Debe adjuntar el archivo PDF del proyecto');
      }

      // Preparar FormData para envío multipart
      const formData = new FormData();

      // Preparar payload del proyecto (sin calificación)
      const payload = {
        id_docente: proyectoData.id_docente,
        id_estudiantes: proyectoData.id_estudiantes.map(id => ({ 
          id_estudiante: id 
        })),
        id_grupo: parseInt(proyectoData.id_grupo),
        codigo_area: parseInt(proyectoData.codigo_area),
        id_evento: proyectoData.id_evento || '1jAZE5TKXakRd9ymq1Xu',
        codigo_materia: proyectoData.codigo_materia,
        codigo_linea: parseInt(proyectoData.codigo_linea),
        codigo_sublinea: parseInt(proyectoData.codigo_sublinea),
        titulo_proyecto: proyectoData.titulo_proyecto.trim(),
        tipo_actividad: parseInt(proyectoData.tipo_actividad),
        // No incluir calificacion - la asigna el profesor
        // No incluir id_usuario_creador - no lo devuelve el backend
      };

      // Agregar proyecto_data como JSON string
      formData.append('proyecto_data', JSON.stringify(payload));

      // Agregar archivos
      formData.append('archivo', archivoPDF);
      if (archivoExtra) {
        formData.append('archivo_extra', archivoExtra);
      }

      console.log('📤 Enviando proyecto (FormData):', payload);

      const response = await fetch(`${API_URL}/api/v1/proyectos/`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${getAuthToken()}`,
          // NO incluir Content-Type, lo maneja FormData automáticamente
        },
        body: formData,
      });

      if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error(err.detail || err.message || `Error ${response.status}: ${response.statusText}`);
      }

      const result = await response.json();
      console.log('✅ Proyecto creado exitosamente:', result);
      return result;
    } catch (error) {
      console.error('❌ Error creando proyecto:', error);
      throw error;
    }
  }

  /**
   * Obtener materias (solo si el endpoint público existe)
   */
  static async obtenerMaterias() {
    try {
      const response = await fetch(`${API_URL}/api/v1/materias`, {
        method: 'GET',
        headers: getAuthHeaders(),
      });

      if (!response.ok) {
        console.warn('⚠️ Endpoint de materias no disponible para estudiantes.');
        return [];
      }

      const materias = await response.json();
      if (!Array.isArray(materias)) throw new Error('Formato inválido de respuesta.');

      return materias.map(m => ({
        codigo: m.codigo_materia,
        nombre: m.nombre_materia,
      }));
    } catch (error) {
      console.error('❌ Error obteniendo materias:', error);
      return [];
    }
  }

  /**
   * Obtener grupos (solo si el endpoint público existe)
   */
  static async obtenerGrupos() {
    try {
      const response = await fetch(`${API_URL}/api/v1/grupos`, {
        method: 'GET',
        headers: getAuthHeaders(),
      });

      if (!response.ok) {
        console.warn('⚠️ Endpoint de grupos no disponible para estudiantes.');
        return [];
      }

      const grupos = await response.json();
      if (!Array.isArray(grupos)) throw new Error('Formato inválido de respuesta.');

      return grupos.map(g => ({
        id: g.id_grupo,
        nombre: g.nombre_grupo || `Grupo ${g.id_grupo}`,
        codigoMateria: g.codigo_materia,
        idDocente: g.id_docente,
      }));
    } catch (error) {
      console.error('❌ Error obteniendo grupos:', error);
      return [];
    }
  }
}

export default RegisterProjectService;
