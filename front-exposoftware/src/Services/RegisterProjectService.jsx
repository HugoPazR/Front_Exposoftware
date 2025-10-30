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
 * Servicio para la gestión de proyectos
 */
class RegisterProjectService {
  /**
   * Obtener lista de estudiantes
   * ✅ Endpoint permitido: /api/v1/estudiantes
   */
  static async obtenerEstudiantes() {
    try {
      const response = await fetch(`${API_URL}/api/v1/estudiantes`, {
        method: 'GET',
        headers: getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();

      // Asegurar que sea un array
      if (!Array.isArray(data)) throw new Error('Formato inválido de respuesta.');

      // Transformar estructura
      return data.map(est => ({
        id: est.id,
        nombre: `${est.usuario?.nombres || ''} ${est.usuario?.apellidos || ''}`.trim(),
        correo: est.usuario?.correo || '',
        codigo_programa: est.codigo_programa,
        semestre: est.semestre,
      }));
    } catch (error) {
      console.error('❌ Error obteniendo estudiantes:', error);
      throw new Error('No se pudieron cargar los estudiantes.');
    }
  }

  /**
   * Obtener lista de docentes
   * 🚫 No existe versión pública de /admin/profesores
   * 🔧 Usar endpoint general si está disponible, o devolver array vacío para estudiantes
   */
  static async obtenerDocentes() {
    try {
      const response = await fetch(`${API_URL}/api/v1/profesores`, {
        method: 'GET',
        headers: getAuthHeaders(),
      });

      if (!response.ok) {
        // Si no existe, devolver vacío en lugar de error fatal
        console.warn('⚠️ No se pudo acceder al endpoint de docentes. Rol estudiante sin permisos.');
        return [];
      }

      const docentes = await response.json();
      if (!Array.isArray(docentes)) throw new Error('Formato inválido de respuesta.');

      return docentes.map(doc => ({
        id: doc.id,
        nombre: `${doc.usuario?.nombres || ''} ${doc.usuario?.apellidos || ''}`.trim(),
        correo: doc.usuario?.correo || '',
      }));
    } catch (error) {
      console.error('❌ Error obteniendo docentes:', error);
      return [];
    }
  }

  /**
   * Obtener líneas de investigación
   * ✅ /api/v1/public-investigacion/lineas
   */
  static async obtenerLineasInvestigacion() {
    try {
      const response = await fetch(`${API_URL}/api/v1/public-investigacion/lineas`, {
        method: 'GET',
        headers: getAuthHeaders(),
      });

      if (!response.ok) throw new Error(`Error ${response.status}: ${response.statusText}`);

      const lineas = await response.json();
      if (!Array.isArray(lineas)) throw new Error('Formato inválido de respuesta.');

      return lineas.map(linea => ({
        codigo: linea.codigo_linea,
        nombre: linea.nombre_linea,
      }));
    } catch (error) {
      console.error('❌ Error obteniendo líneas de investigación:', error);
      throw new Error('No se pudieron cargar las líneas de investigación.');
    }
  }

  /**
   * Obtener sublíneas de investigación
   * ✅ /api/v1/public-investigacion/arbol-completo
   */
  static async obtenerSublineasInvestigacion() {
    try {
      const response = await fetch(`${API_URL}/api/v1/public-investigacion/arbol-completo`, {
        method: 'GET',
        headers: getAuthHeaders(),
      });

      if (!response.ok) throw new Error(`Error ${response.status}: ${response.statusText}`);

      const arbol = await response.json();
      if (!Array.isArray(arbol)) throw new Error('Formato inválido de respuesta.');

      const sublineas = [];
      arbol.forEach(linea => {
        if (Array.isArray(linea.sublineas)) {
          linea.sublineas.forEach(sublinea => {
            sublineas.push({
              codigo: sublinea.codigo_sublinea,
              nombre: sublinea.nombre_sublinea,
              codigoLinea: linea.codigo_linea,
            });
          });
        }
      });

      return sublineas;
    } catch (error) {
      console.error('❌ Error obteniendo sublíneas de investigación:', error);
      throw new Error('No se pudieron cargar las sublíneas de investigación.');
    }
  }

  /**
   * Obtener áreas temáticas
   * ✅ /api/v1/public-investigacion/arbol-completo
   */
  static async obtenerAreasTematicas() {
    try {
      const response = await fetch(`${API_URL}/api/v1/public-investigacion/arbol-completo`, {
        method: 'GET',
        headers: getAuthHeaders(),
      });

      if (!response.ok) throw new Error(`Error ${response.status}: ${response.statusText}`);

      const arbol = await response.json();
      if (!Array.isArray(arbol)) throw new Error('Formato inválido de respuesta.');

      const areas = [];
      arbol.forEach(linea => {
        linea.sublineas?.forEach(sublinea => {
          sublinea.areas_tematicas?.forEach(area => {
            areas.push({
              codigo: area.codigo_area,
              nombre: area.nombre_area,
              codigoSublinea: sublinea.codigo_sublinea,
            });
          });
        });
      });

      return areas;
    } catch (error) {
      console.error('❌ Error obteniendo áreas temáticas:', error);
      throw new Error('No se pudieron cargar las áreas temáticas.');
    }
  }

  /**
   * Crear un nuevo proyecto
   * ✅ /api/v1/proyectos/
   */
  static async crearProyecto(proyectoData) {
    try {
      // Validaciones previas
      const required = [
        'titulo_proyecto',
        'id_docente',
        'id_estudiantes',
        'id_grupo',
        'codigo_area',
        'codigo_linea',
        'codigo_sublinea',
        'tipo_actividad',
      ];

      for (const field of required) {
        if (!proyectoData[field] || (Array.isArray(proyectoData[field]) && proyectoData[field].length === 0)) {
          throw new Error(`El campo ${field.replace('_', ' ')} es obligatorio`);
        }
      }

      const payload = {
        id_docente: proyectoData.id_docente,
        id_estudiantes: proyectoData.id_estudiantes.map(id => ({ id_estudiante: id })),
        id_grupo: parseInt(proyectoData.id_grupo),
        codigo_area: parseInt(proyectoData.codigo_area),
        id_evento: proyectoData.id_evento || '1jAZE5TKXakRd9ymq1Xu',
        codigo_materia: proyectoData.codigo_materia,
        codigo_linea: parseInt(proyectoData.codigo_linea),
        codigo_sublinea: parseInt(proyectoData.codigo_sublinea),
        titulo_proyecto: proyectoData.titulo_proyecto.trim(),
        tipo_actividad: parseInt(proyectoData.tipo_actividad),
      };

      const response = await fetch(`${API_URL}/api/v1/proyectos/`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error(err.detail || `Error ${response.status}: ${response.statusText}`);
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
