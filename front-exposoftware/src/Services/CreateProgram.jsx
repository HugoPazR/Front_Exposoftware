import { API_BASE_URL } from "../utils/constants";
import * as AuthService from "./AuthService";

/**
 * Obtener todas las facultades (para seleccionar al crear programa)
 * @returns {Promise<Array>} Lista de facultades
 */
export const obtenerFacultades = async () => {
  try {
    console.log('📥 Cargando facultades desde:', `${API_BASE_URL}/api/v1/admin/academico/facultades`);
    const headers = AuthService.getAuthHeaders();
    
    const response = await fetch(`${API_BASE_URL}/api/v1/admin/academico/facultades`, {
      method: 'GET',
      headers: headers
    });
    
    console.log('📡 Respuesta del servidor - Status:', response.status, response.statusText);
    
    if (response.ok) {
      const result = await response.json();
      console.log('📦 Respuesta completa:', result);
      const facultades = result.data || result;
      console.log('✅ Facultades cargadas:', facultades.length);
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
 * Obtener una facultad específica por ID
 * @param {string} facultadId - ID de la facultad
 * @returns {Promise<Object>} Datos de la facultad
 */
export const obtenerFacultadPorId = async (facultadId) => {
  if (!facultadId || !facultadId.trim()) {
    throw new Error("El ID de la facultad es obligatorio");
  }

  try {
    console.log('📥 Cargando facultad (ID: ' + facultadId + ')');
    const headers = AuthService.getAuthHeaders();
    
    const response = await fetch(
      `${API_BASE_URL}/api/v1/admin/academico/facultades/${facultadId}`,
      {
        method: 'GET',
        headers: headers
      }
    );
    
    console.log('📡 Respuesta del servidor - Status:', response.status);
    
    if (response.ok) {
      const result = await response.json();
      const facultad = result.data || result;
      console.log('✅ Facultad cargada:', facultad.nombre_facultad);
      return facultad;
    } else if (response.status === 404) {
      throw new Error("La facultad no existe");
    } else {
      throw new Error(`Error al cargar facultad: ${response.statusText}`);
    }
  } catch (error) {
    console.error('❌ Error al cargar facultad:', error);
    throw error;
  }
};

/**
 * Obtener todos los programas de una facultad
 * @param {string} facultadId - ID de la facultad
 * @returns {Promise<Array>} Lista de programas
 */
export const obtenerProgramasPorFacultad = async (facultadId) => {
  if (!facultadId || !facultadId.trim()) {
    throw new Error("El ID de la facultad es obligatorio");
  }

  try {
    console.log('📥 Cargando programas para facultad:', facultadId);
    const headers = AuthService.getAuthHeaders();
    
    const response = await fetch(
      `${API_BASE_URL}/api/v1/admin/academico/facultades/${facultadId}/programas`,
      {
        method: 'GET',
        headers: headers
      }
    );
    
    console.log('📡 Respuesta del servidor - Status:', response.status);
    
    if (response.ok) {
      const result = await response.json();
      const programas = result.data || result;
      console.log('✅ Programas cargados:', programas.length);
      return Array.isArray(programas) ? programas : [];
    } else if (response.status === 404) {
      console.log('⚠️ La facultad no tiene programas');
      return [];
    } else {
      throw new Error(`Error al cargar programas: ${response.statusText}`);
    }
  } catch (error) {
    console.error('❌ Error al cargar programas:', error);
    throw error;
  }
};

/**
 * Crear un nuevo programa en una facultad
 * @param {Object} datosPrograma - Datos del programa
 * @param {string} datosPrograma.codigo_programa - Código único del programa (ej: "ING_SIS")
 * @param {string} datosPrograma.id_facultad - ID de la facultad (ej: "FAC_ING")
 * @param {string} datosPrograma.nombre_programa - Nombre del programa (ej: "Ingeniería de Sistemas")
 * @returns {Promise<Object>} Datos del programa creado
 */
export const crearPrograma = async (datosPrograma) => {
  // Validaciones básicas
  if (!datosPrograma.codigo_programa || !datosPrograma.codigo_programa.trim()) {
    throw new Error("El código del programa es obligatorio");
  }

  if (!datosPrograma.id_facultad || !datosPrograma.id_facultad.trim()) {
    throw new Error("El ID de la facultad es obligatorio");
  }

  if (!datosPrograma.nombre_programa || !datosPrograma.nombre_programa.trim()) {
    throw new Error("El nombre del programa es obligatorio");
  }

  // Estructura del payload según el endpoint
  const payload = {
    codigo_programa: datosPrograma.codigo_programa.trim(),
    id_facultad: datosPrograma.id_facultad.trim(),
    nombre_programa: datosPrograma.nombre_programa.trim()
  };

  console.log('📤 Enviando programa al backend:', JSON.stringify(payload, null, 2));

  try {
    // La URL incluye el id_facultad en la ruta
    const facultadId = payload.id_facultad;
    const response = await fetch(
      `${API_BASE_URL}/api/v1/admin/academico/facultades/${facultadId}/programas`,
      {
        method: 'POST',
        headers: AuthService.getAuthHeaders(),
        body: JSON.stringify(payload)
      }
    );

    if (response.status === 201) {
      const data = await response.json();
      console.log('✅ Programa creado:', data);
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
      throw new Error(`Sin permisos: ${errorData.message || errorData.detail || 'No tiene permisos para crear programas'}`);
    } else if (response.status === 404) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(`No encontrada: ${errorData.message || errorData.detail || 'La facultad no existe'}`);
    } else if (response.status === 409) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(`Conflicto: ${errorData.message || errorData.detail || 'El programa ya existe'}`);
    } else if (response.status === 422) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(`Error de validación: ${errorData.message || errorData.detail || 'Los datos no son válidos'}`);
    } else {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(`Error al crear programa (${response.status}): ${errorData.message || errorData.detail || 'Error desconocido'}`);
    }
  } catch (error) {
    if (error.message) {
      throw error;
    }
    console.error('❌ Error al crear programa:', error);
    throw new Error("Error de conexión al crear el programa. Verifique su conexión a internet.");
  }
};

/**
 * Actualizar un programa existente
 * @param {string} facultadId - ID de la facultad
 * @param {string} codigoPrograma - Código del programa a actualizar
 * @param {Object} datosPrograma - Datos actualizados del programa
 * @param {string} datosPrograma.nombre_programa - Nombre del programa (actualizable)
 * @returns {Promise<Object>} Datos del programa actualizado
 */
export const actualizarPrograma = async (facultadId, codigoPrograma, datosPrograma) => {
  // Validaciones
  if (!facultadId || !facultadId.trim()) {
    throw new Error("El ID de la facultad es obligatorio");
  }

  if (!codigoPrograma || !codigoPrograma.trim()) {
    throw new Error("El código del programa es obligatorio");
  }

  if (!datosPrograma.nombre_programa || !datosPrograma.nombre_programa.trim()) {
    throw new Error("El nombre del programa es obligatorio");
  }

  // Payload para actualización
  const payload = {
    nombre_programa: datosPrograma.nombre_programa.trim()
  };

  console.log('📤 Actualizando programa (Facultad: ' + facultadId + ', Código: ' + codigoPrograma + '):', JSON.stringify(payload, null, 2));

  try {
    const response = await fetch(
      `${API_BASE_URL}/api/v1/admin/academico/facultades/${facultadId}/programas/${codigoPrograma}`,
      {
        method: 'PUT',
        headers: AuthService.getAuthHeaders(),
        body: JSON.stringify(payload)
      }
    );

    if (response.ok) {
      const data = await response.json();
      console.log('✅ Programa actualizado:', data);
      return { success: true, data };
    } else if (response.status === 400) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(`Solicitud incorrecta: ${errorData.message || errorData.detail || 'Verifique los datos'}`);
    } else if (response.status === 404) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(`No encontrado: ${errorData.message || errorData.detail || 'El programa no existe'}`);
    } else if (response.status === 409) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(`Conflicto: ${errorData.message || errorData.detail || 'Ya existe un programa con ese código'}`);
    } else {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(`Error al actualizar programa (${response.status}): ${errorData.message || errorData.detail || 'Error desconocido'}`);
    }
  } catch (error) {
    if (error.message) {
      throw error;
    }
    console.error('❌ Error al actualizar programa:', error);
    throw new Error("Error de conexión al actualizar el programa.");
  }
};

/**
 * Eliminar un programa
 * @param {string} facultadId - ID de la facultad
 * @param {string} codigoPrograma - Código del programa a eliminar
 * @returns {Promise<Object>} Confirmación de eliminación
 */
export const eliminarPrograma = async (facultadId, codigoPrograma) => {
  if (!facultadId || !facultadId.trim()) {
    throw new Error("El ID de la facultad es obligatorio");
  }

  if (!codigoPrograma || !codigoPrograma.trim()) {
    throw new Error("El código del programa es obligatorio");
  }

  console.log('🗑️ Eliminando programa - Facultad:', facultadId, 'Código:', codigoPrograma);

  try {
    const response = await fetch(
      `${API_BASE_URL}/api/v1/admin/academico/facultades/${facultadId}/programas/${codigoPrograma}`,
      {
        method: 'DELETE',
        headers: AuthService.getAuthHeaders()
      }
    );

    if (response.ok) {
      console.log('✅ Programa eliminado del backend');
      return { success: true };
    } else if (response.status === 404) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(`No encontrado: ${errorData.message || errorData.detail || 'El programa no existe'}`);
    } else if (response.status === 409) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(`Conflicto: ${errorData.message || errorData.detail || 'No se puede eliminar: el programa tiene asociaciones'}`);
    } else {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(`Error al eliminar programa (${response.status}): ${errorData.message || errorData.detail || 'Error desconocido'}`);
    }
  } catch (error) {
    if (error.message) {
      throw error;
    }
    console.error('❌ Error al eliminar programa:', error);
    throw new Error("Error de conexión al eliminar el programa.");
  }
};

// ==================== FUNCIONES AUXILIARES ====================

/**
 * Filtrar programas por término de búsqueda
 * @param {Array} programas - Lista de programas
 * @param {string} searchTerm - Término de búsqueda
 * @returns {Array} Programas filtrados
 */
export const filtrarProgramas = (programas, searchTerm) => {
  // Validar que programas sea un array
  if (!Array.isArray(programas)) {
    console.warn('⚠️ filtrarProgramas: programas no es un array:', programas);
    return [];
  }
  
  if (!searchTerm) return programas;

  const termino = searchTerm.toLowerCase();
  return programas.filter(programa => {
    try {
      const nombre = programa?.nombre_programa?.toLowerCase() || "";
      const codigo = programa?.codigo_programa?.toLowerCase() || "";

      return nombre.includes(termino) || codigo.includes(termino);
    } catch (error) {
      console.error('Error filtrando programa:', error, programa);
      return false;
    }
  });
};

/**
 * Validar formato del código de programa
 * Ejemplo de formato válido: "ING_SIS", "ING_IND", etc.
 * @param {string} codigoPrograma - Código a validar
 * @returns {boolean} True si es válido
 */
export const validarCodigoPrograma = (codigoPrograma) => {
  // Permite letras, números, guiones y guiones bajos
  // Mínimo 3 caracteres, máximo 50
  return /^[A-Z0-9_-]{3,50}$/.test(codigoPrograma);
};

/**
 * Validar que el nombre del programa no esté vacío
 * @param {string} nombrePrograma - Nombre a validar
 * @returns {boolean} True si es válido
 */
export const validarNombrePrograma = (nombrePrograma) => {
  return nombrePrograma && nombrePrograma.trim().length > 0 && nombrePrograma.trim().length <= 255;
};

/**
 * Formatear datos del formulario para envío al backend
 * @param {Object} formData - Datos del formulario
 * @returns {Object} Datos formateados
 */
export const formatearDatosPrograma = (formData) => {
  return {
    codigo_programa: formData.codigoPrograma?.toUpperCase() || "",
    id_facultad: formData.idFacultad || "",
    nombre_programa: formData.nombrePrograma || ""
  };
};

/**
 * Validar todos los datos del programa antes de crear
 * @param {Object} datosPrograma - Datos a validar
 * @returns {Object} { valido: boolean, errores: Array<string> }
 */
export const validarDatosPrograma = (datosPrograma) => {
  const errores = [];

  if (!datosPrograma.codigo_programa?.trim()) {
    errores.push("El código del programa es obligatorio");
  } else if (!validarCodigoPrograma(datosPrograma.codigo_programa.toUpperCase())) {
    errores.push("Código inválido (3-50 caracteres, A-Z, 0-9, _, -)");
  }

  if (!datosPrograma.id_facultad?.trim()) {
    errores.push("La facultad es obligatoria");
  }

  if (!datosPrograma.nombre_programa?.trim()) {
    errores.push("El nombre del programa es obligatorio");
  } else if (!validarNombrePrograma(datosPrograma.nombre_programa)) {
    errores.push("Nombre inválido (1-255 caracteres)");
  }

  return {
    valido: errores.length === 0,
    errores
  };
};

/**
 * Obtener nombre de facultad por ID
 * Útil para mostrar en UI
 * @param {Array} facultades - Lista de facultades
 * @param {string} facultadId - ID a buscar
 * @returns {string} Nombre de la facultad o ID si no encuentra
 */
export const obtenerNombreFacultad = (facultades, facultadId) => {
  if (!Array.isArray(facultades) || !facultadId) return facultadId;
  
  const facultad = facultades.find(f => f.id_facultad === facultadId);
  return facultad?.nombre_facultad || facultadId;
};
