import { API_BASE_URL } from "../utils/constants";
import * as AuthService from "./AuthService";

/**
 * Obtener todas las facultades desde el backend
 * @returns {Promise<Array>} Lista de facultades
 */
export const obtenerFacultades = async () => {
  try {
    console.log('📥 Cargando facultades desde:', `${API_BASE_URL}/api/v1/admin/academico/facultades`);
    const headers = AuthService.getAuthHeaders();
    console.log('🔑 Headers de autenticación:', headers);
    
    const response = await fetch(`${API_BASE_URL}/api/v1/admin/academico/facultades`, {
      method: 'GET',
      headers: headers
    });
    
    console.log('📡 Respuesta del servidor - Status:', response.status, response.statusText);
    
    if (response.ok) {
      const result = await response.json();
      console.log('📦 Respuesta completa:', result);
      // El backend retorna { status, message, data, code }
      const facultades = result.data || result;
      console.log('✅ Facultades cargadas:', facultades.length);
      if (facultades.length > 0) {
        console.log('🔍 Estructura de la primera facultad:', facultades[0]);
        console.log('🔍 Claves de la primera facultad:', Object.keys(facultades[0]));
      }
      return Array.isArray(facultades) ? facultades : [];
    } else {
      const errorText = await response.text();
      console.error('❌ Error al cargar facultades:', response.status, response.statusText, errorText);
      throw new Error(`Error al cargar facultades: ${response.statusText}`);
    }
  } catch (error) {
    console.error('❌ Error de conexión al cargar facultades:', error);
    throw error;
  }
};

/**
 * Crear una nueva facultad en el backend
 * @param {Object} datosFacultad - Datos de la facultad
 * @param {string} datosFacultad.id_facultad - ID único de la facultad (ej: "FAC_ING")
 * @param {string} datosFacultad.nombre_facultad - Nombre de la facultad (ej: "Ingenierías y Tecnologías")
 * @returns {Promise<Object>} Datos de la facultad creada
 */
export const crearFacultad = async (datosFacultad) => {
  // Validaciones básicas
  if (!datosFacultad.id_facultad || !datosFacultad.id_facultad.trim()) {
    throw new Error("El ID de la facultad es obligatorio");
  }

  if (!datosFacultad.nombre_facultad || !datosFacultad.nombre_facultad.trim()) {
    throw new Error("El nombre de la facultad es obligatorio");
  }

  // Estructura del payload según el endpoint
  const payload = {
    id_facultad: datosFacultad.id_facultad.trim(),
    nombre_facultad: datosFacultad.nombre_facultad.trim()
  };

  console.log('📤 Enviando facultad al backend:', JSON.stringify(payload, null, 2));

  try {
    const response = await fetch(`${API_BASE_URL}/api/v1/admin/academico/facultades`, {
      method: 'POST',
      headers: AuthService.getAuthHeaders(),
      body: JSON.stringify(payload)
    });

    if (response.status === 201) {
      const data = await response.json();
      console.log('✅ Facultad creada:', data);
      return { success: true, data };
    } else if (response.status === 400) {
      const errorData = await response.json().catch(() => ({}));
      console.error('❌ Solicitud incorrecta:', errorData);
      throw new Error(`Solicitud incorrecta: ${errorData.message || errorData.detail || 'Verifique los datos ingresados'}`);
    } else if (response.status === 401) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(`No autorizado: ${errorData.message || errorData.detail || 'Debe iniciar sesión'}`);
    } else if (response.status === 403) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(`Sin permisos: ${errorData.message || errorData.detail || 'No tiene permisos para crear facultades'}`);
    } else if (response.status === 409) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(`Conflicto: ${errorData.message || errorData.detail || 'La facultad ya existe'}`);
    } else if (response.status === 422) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(`Error de validación: ${errorData.message || errorData.detail || 'Los datos no son válidos'}`);
    } else {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(`Error al crear facultad (${response.status}): ${errorData.message || errorData.detail || 'Error desconocido'}`);
    }
  } catch (error) {
    if (error.message) {
      throw error;
    }
    console.error('❌ Error al crear facultad:', error);
    throw new Error("Error de conexión al crear la facultad. Verifique su conexión a internet.");
  }
};

/**
 * Actualizar una facultad existente
 * @param {string} idFacultad - ID de la facultad a actualizar
 * @param {Object} datosFacultad - Datos actualizados de la facultad
 * @param {string} datosFacultad.nombre_facultad - Nombre de la facultad
 * @returns {Promise<Object>} Datos de la facultad actualizada
 */
export const actualizarFacultad = async (idFacultad, datosFacultad) => {
  // Validaciones
  if (!idFacultad || !idFacultad.trim()) {
    throw new Error("El ID de la facultad es obligatorio");
  }

  if (!datosFacultad.nombre_facultad || !datosFacultad.nombre_facultad.trim()) {
    throw new Error("El nombre de la facultad es obligatorio");
  }

  // Payload para actualización
  const payload = {
    nombre_facultad: datosFacultad.nombre_facultad.trim()
  };

  console.log('📤 Actualizando facultad (ID: ' + idFacultad + '):', JSON.stringify(payload, null, 2));

  try {
    const response = await fetch(`${API_BASE_URL}/api/v1/admin/academico/facultades/${idFacultad}`, {
      method: 'PUT',
      headers: AuthService.getAuthHeaders(),
      body: JSON.stringify(payload)
    });

    if (response.ok) {
      const data = await response.json();
      console.log('✅ Facultad actualizada:', data);
      return { success: true, data };
    } else if (response.status === 400) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(`Solicitud incorrecta: ${errorData.message || errorData.detail || 'Verifique los datos'}`);
    } else if (response.status === 404) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(`No encontrada: ${errorData.message || errorData.detail || 'La facultad no existe'}`);
    } else if (response.status === 409) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(`Conflicto: ${errorData.message || errorData.detail || 'Ya existe una facultad con ese nombre'}`);
    } else {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(`Error al actualizar facultad (${response.status}): ${errorData.message || errorData.detail || 'Error desconocido'}`);
    }
  } catch (error) {
    if (error.message) {
      throw error;
    }
    console.error('❌ Error al actualizar facultad:', error);
    throw new Error("Error de conexión al actualizar la facultad.");
  }
};

/**
 * Eliminar una facultad
 * @param {string} idFacultad - ID de la facultad a eliminar
 * @returns {Promise<Object>} Confirmación de eliminación
 */
export const eliminarFacultad = async (idFacultad) => {
  if (!idFacultad || !idFacultad.trim()) {
    throw new Error("El ID de la facultad es obligatorio");
  }

  console.log('🗑️ Eliminando facultad - ID:', idFacultad);

  try {
    const response = await fetch(`${API_BASE_URL}/api/v1/admin/academico/facultades/${idFacultad}`, {
      method: 'DELETE',
      headers: AuthService.getAuthHeaders()
    });

    if (response.ok) {
      console.log('✅ Facultad eliminada del backend');
      return { success: true };
    } else if (response.status === 404) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(`No encontrada: ${errorData.message || errorData.detail || 'La facultad no existe'}`);
    } else if (response.status === 409) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(`Conflicto: ${errorData.message || errorData.detail || 'No se puede eliminar: la facultad tiene programas asociados'}`);
    } else {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(`Error al eliminar facultad (${response.status}): ${errorData.message || errorData.detail || 'Error desconocido'}`);
    }
  } catch (error) {
    if (error.message) {
      throw error;
    }
    console.error('❌ Error al eliminar facultad:', error);
    throw new Error("Error de conexión al eliminar la facultad.");
  }
};

// ==================== FUNCIONES AUXILIARES ====================

/**
 * Filtrar facultades por término de búsqueda
 * @param {Array} facultades - Lista de facultades
 * @param {string} searchTerm - Término de búsqueda
 * @returns {Array} Facultades filtradas
 */
export const filtrarFacultades = (facultades, searchTerm) => {
  // Validar que facultades sea un array
  if (!Array.isArray(facultades)) {
    console.warn('⚠️ filtrarFacultades: facultades no es un array:', facultades);
    return [];
  }
  
  if (!searchTerm) return facultades;

  const termino = searchTerm.toLowerCase();
  return facultades.filter(facultad => {
    try {
      const nombre = facultad?.nombre_facultad?.toLowerCase() || "";
      const id = facultad?.id_facultad?.toLowerCase() || "";

      return nombre.includes(termino) || id.includes(termino);
    } catch (error) {
      console.error('Error filtrando facultad:', error, facultad);
      return false;
    }
  });
};

/**
 * Validar formato del ID de facultad
 * Ejemplo de formato válido: "FAC_ING", "FAC_ADM", etc.
 * @param {string} idFacultad - ID a validar
 * @returns {boolean} True si es válido
 */
export const validarIdFacultad = (idFacultad) => {
  // Permite letras, números, guiones y guiones bajos
  // Mínimo 3 caracteres, máximo 50
  return /^[A-Z0-9_-]{3,50}$/.test(idFacultad);
};

/**
 * Validar que el nombre de la facultad no esté vacío
 * @param {string} nombreFacultad - Nombre a validar
 * @returns {boolean} True si es válido
 */
export const validarNombreFacultad = (nombreFacultad) => {
  return nombreFacultad && nombreFacultad.trim().length > 0 && nombreFacultad.trim().length <= 255;
};

/**
 * Formatear datos del formulario para envío al backend
 * @param {Object} formData - Datos del formulario
 * @returns {Object} Datos formateados
 */
export const formatearDatosFacultad = (formData) => {
  return {
    id_facultad: formData.idFacultad?.toUpperCase() || "",
    nombre_facultad: formData.nombreFacultad || ""
  };
};
