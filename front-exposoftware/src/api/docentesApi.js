import API from './axiosConfig';
import { storageService } from '../services/storageService';

// Función helper para procesar errores
const handleApiError = (error) => {
  if (error.response) {
    const { status, data } = error.response;
    
    switch (status) {
      case 400:
        throw new Error('Datos de entrada inválidos: ' + (data.message || 'Revise los datos enviados'));
      case 401:
        throw new Error('No autorizado: Debe iniciar sesión');
      case 403:
        throw new Error('Acceso denegado: No tiene permisos suficientes');
      case 404:
        throw new Error('Recurso no encontrado');
      case 409:
        throw new Error('El recurso ya existe');
      case 422:
        // Formatear errores de validación
        // Soportar distintos esquemas de validación (errors[] o detail[])
        const validationErrors = data.errors?.map(err => `${err.field}: ${err.message}`).join(', ');
        if (validationErrors) {
          throw new Error(`Error de validación: ${validationErrors}`);
        }
        // Algunos backends (FastAPI) devuelven un array 'detail'
        const detailErrors = data.detail?.map(d => {
          // detalle puede tener 'loc' y 'msg'
          const field = Array.isArray(d.loc) ? d.loc.join('.') : d.loc;
          return `${field}: ${d.msg || d.message || JSON.stringify(d)}`;
        }).join(', ');
        throw new Error(`Error de validación: ${detailErrors || data.message}`);
      case 429:
        throw new Error('Demasiadas solicitudes. Por favor, intente más tarde');
      case 500:
        throw new Error('Error interno del servidor');
      default:
        throw new Error(data.message || 'Error desconocido');
    }
  }
  throw error;
};

// Función helper para procesar respuesta exitosa
const handleSuccessResponse = (data) => {
  if (data.status === 'success' && data.data) {
    return data.data;
  }
  throw new Error(data.message || 'Respuesta inválida del servidor');
};

export const crearDocente = async (docenteData) => {
  try {
    const { data } = await API.post('/admin/docentes', docenteData);
    return handleSuccessResponse(data);
  } catch (error) {
    console.error('Error al crear el docente:', error);

    // Si es un error de red o de servidor (sin respuesta o 5xx), guardar en localStorage como fallback
    const status = error.response?.status;
    if (!error.response || (status >= 500 && status < 600)) {
      try {
        const key = 'exposoftware_docentes';
        const docentes = storageService.get(key, []);
        const nuevoDocente = {
          ...docenteData,
          id: `local_${Date.now()}`,
          createdAt: new Date().toISOString(),
          _local: true
        };
        docentes.push(nuevoDocente);
        storageService.set(key, docentes);
        // Devolver el objeto creado localmente
        return nuevoDocente;
      } catch (e) {
        console.error('Error al guardar docente en localStorage como fallback:', e);
        throw new Error('No se pudo crear el docente (backend y fallback fallaron)');
      }
    }

    // Si es un error del cliente (4xx) o validación, propagar el error formateado
    throw handleApiError(error);
  }
};

export const obtenerDocentes = async ({ page = 1, limit = 20, activos = true } = {}) => {
  try {
    const { data } = await API.get('/admin/docentes', {
      params: {
        page,
        limit,
        activos
      }
    });
    return handleSuccessResponse(data);
  } catch (error) {
    console.error('Error al obtener docentes:', error);
    throw handleApiError(error);
  }
};

// Alias para endpoint con nombre 'profesores'
export const obtenerProfesores = async ({ page = 1, limit = 20, activos = true } = {}) => {
  try {
    const { data } = await API.get('/admin/profesores', {
      params: {
        page,
        limit,
        activos
      }
    });
    return handleSuccessResponse(data);
  } catch (error) {
    console.error('Error al obtener profesores:', error);
    throw handleApiError(error);
  }
};

export const obtenerDocentePorId = async (id) => {
  if (!id) {
    throw new Error('El ID del profesor es requerido');
  }

  try {
    const { data } = await API.get(`/admin/docentes/${id}`);
    return handleSuccessResponse(data);
  } catch (error) {
    console.error('Error al obtener docente:', error);
    throw handleApiError(error);
  }
};

// Alias para endpoint /admin/profesores/{id}
export const obtenerProfesorPorId = async (id) => {
  if (!id) {
    throw new Error('El ID del profesor es requerido');
  }

  try {
    const { data } = await API.get(`/admin/profesores/${id}`);
    return handleSuccessResponse(data);
  } catch (error) {
    console.error('Error al obtener profesor por /admin/profesores:', error);

    // Si el id corresponde a un registro local (prefijo local_) o la API respondió 404,
    // intentamos recuperar desde el fallback en localStorage
    const isLocal = String(id).startsWith('local_');
    const status = error.response?.status;
    if (isLocal || status === 404) {
      try {
        const key = 'exposoftware_docentes';
        const docentes = storageService.get(key, []);
        const found = docentes.find(d => String(d.id) === String(id) || String(d.usuario?.identificacion) === String(id));
        if (found) return found;
      } catch (e) {
        console.error('Error al buscar profesor en localStorage como fallback:', e);
      }
    }

    throw handleApiError(error);
  }
};

export const actualizarDocente = async (id, docenteData) => {
  if (!id) {
    throw new Error('El ID del profesor es requerido');
  }

  // Validar los campos requeridos
  const { categoria_docente, codigo_programa, activo } = docenteData;
  
  if (!categoria_docente) {
    throw new Error('La categoría del docente es requerida');
  }
  
  if (!codigo_programa) {
    throw new Error('El código del programa es requerido');
  }

  // Asegurar que los datos siguen el formato esperado
  const datosActualizados = {
    categoria_docente,
    codigo_programa,
    activo: activo ?? true // Si no se proporciona, por defecto es true
  };

  try {
    const { data } = await API.put(`/admin/docentes/${id}`, datosActualizados);
    return handleSuccessResponse(data);
  } catch (error) {
    console.error('Error al actualizar docente:', error);
    throw handleApiError(error);
  }
};

export const desactivarDocente = async (id, razon) => {
  if (!id) {
    throw new Error('El ID del profesor es requerido');
  }

  if (!razon || typeof razon !== 'string' || razon.trim() === '') {
    throw new Error('La razón de desactivación es requerida');
  }

  try {
    const { data } = await API.post(`/admin/docentes/${id}/desactivar`, { razon });
    return handleSuccessResponse(data);
  } catch (error) {
    console.error('Error al desactivar docente:', error);
    throw handleApiError(error);
  }
};

export const reactivarDocente = async (id) => {
  if (!id) {
    throw new Error('El ID del profesor es requerido');
  }

  try {
    const { data } = await API.post(`/admin/docentes/${id}/reactivar`);
    return handleSuccessResponse(data);
  } catch (error) {
    console.error('Error al reactivar docente:', error);
    throw handleApiError(error);
  }
};

export const eliminarDocente = async (id) => {
  // Validar que se proporcione un ID
  if (!id) {
    throw new Error('El ID del profesor es requerido');
  }

  try {
    const { data } = await API.delete(`/admin/docentes/${id}`);
    
    // Si la respuesta es exitosa pero no tiene datos, creamos una respuesta estándar
    if (!data) {
      return {
        status: 'success',
        message: 'Profesor eliminado exitosamente',
        code: 'SUCCESS'
      };
    }
    
    return handleSuccessResponse(data);
  } catch (error) {
    console.error('Error al eliminar docente:', error);
    
    // Manejar específicamente el caso de profesor no encontrado
    if (error.response?.status === 404) {
      throw new Error('El profesor que intenta eliminar no existe');
    }
    
    // Manejar específicamente el caso de profesor con dependencias
    if (error.response?.status === 409) {
      throw new Error('No se puede eliminar el profesor porque tiene registros asociados');
    }
    
    throw handleApiError(error);
  }
};