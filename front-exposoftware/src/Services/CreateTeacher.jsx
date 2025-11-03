import { API_ENDPOINTS } from "../utils/constants";
import * as AuthService from "./AuthService";

export const TIPOS_DOCUMENTO = ["CC", "TI", "CE", "PEP", "Pasaporte"];

export const GENEROS = ["Hombre", "Mujer", "Hermafrodita"];

export const IDENTIDADES_SEXUALES = [
  "Heterosexual",
  "Homosexual",
  "Bisexual",
  "Pansexual",
  "Asexual",
  "Demisexual",
  "Sapiosexual",
  "Queer",
  "Graysexual",
  "Omnisexual",
  "Androsexual",
  "Gynesexual",
  "Polysexual"
];

export const CATEGORIAS_DOCENTE = ["Interno", "Invitado", "Externo"];

export const DEPARTAMENTOS_COLOMBIA = [
  "Amazonas", "Antioquia", "Arauca", "Atlántico", "Bolívar", "Boyacá",
  "Caldas", "Caquetá", "Casanare", "Cauca", "Cesar", "Chocó", "Córdoba",
  "Cundinamarca", "Guainía", "Guaviare", "Huila", "La Guajira", "Magdalena",
  "Meta", "Nariño", "Norte de Santander", "Putumayo", "Quindío", "Risaralda",
  "San Andrés y Providencia", "Santander", "Sucre", "Tolima", "Valle del Cauca",
  "Vaupés", "Vichada"
];

// ==================== FUNCIONES DE API ====================

/**
 * Separar nombres completos en primer y segundo nombre
 * @param {string} nombresCompletos - Nombres completos ingresados
 * @returns {Object} {primer_nombre, segundo_nombre}
 */
const separarNombres = (nombresCompletos) => {
  if (!nombresCompletos) return { primer_nombre: "", segundo_nombre: "" };
  
  const nombres = nombresCompletos.trim().split(/\s+/);
  return {
    primer_nombre: nombres[0] || "",
    segundo_nombre: nombres.slice(1).join(" ") || ""
  };
};

/**
 * Separar apellidos completos en primer y segundo apellido
 * @param {string} apellidosCompletos - Apellidos completos ingresados
 * @returns {Object} {primer_apellido, segundo_apellido}
 */
const separarApellidos = (apellidosCompletos) => {
  if (!apellidosCompletos) return { primer_apellido: "", segundo_apellido: "" };
  
  const apellidos = apellidosCompletos.trim().split(/\s+/);
  return {
    primer_apellido: apellidos[0] || "",
    segundo_apellido: apellidos.slice(1).join(" ") || ""
  };
};

/**
 * Obtener todos los docentes desde el backend
 * @returns {Promise<Array>} Lista de docentes
 */
export const obtenerDocentes = async () => {
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
      console.log('📦 Respuesta completa:', result);
      // El backend retorna { status, message, data, code }
      const docentes = result.data || result;
      console.log('✅ Profesores cargados:', docentes.length);
      if (docentes.length > 0) {
        console.log('🔍 Estructura del primer profesor:', docentes[0]);
        console.log('🔍 Claves del primer profesor:', Object.keys(docentes[0]));
        if (docentes[0].usuario) {
          console.log('🔍 Usuario del primer profesor:', docentes[0].usuario);
        }
      }
      return Array.isArray(docentes) ? docentes : [];
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
 * Crear un nuevo docente en el backend
 * @param {Object} datosDocente - Datos completos del docente
 * @returns {Promise<Object>} Datos del docente creado
 */
export const crearDocente = async (datosDocente) => {
  // Validaciones básicas
  if (!datosDocente.tipo_documento || !datosDocente.identificacion) {
    throw new Error("El tipo de documento e identificación son obligatorios");
  }

  if (!datosDocente.nombres || !datosDocente.apellidos) {
    throw new Error("Los nombres y apellidos son obligatorios");
  }

  if (!datosDocente.correo) {
    throw new Error("El correo institucional es obligatorio");
  }

  if (!datosDocente.correo.endsWith("@unicesar.edu.co")) {
    throw new Error("El correo debe ser institucional (@unicesar.edu.co)");
  }

  if (!datosDocente.contraseña && !datosDocente.esEdicion) {
    throw new Error("La contraseña es obligatoria");
  }

  if (!datosDocente.categoria_docente) {
    throw new Error("La categoría del docente es obligatoria");
  }

  // Separar nombres y apellidos según el nuevo formato del backend
  const { primer_nombre, segundo_nombre } = separarNombres(datosDocente.nombres);
  const { primer_apellido, segundo_apellido } = separarApellidos(datosDocente.apellidos);

  // Estructura del payload según el OpenAPI actualizado: TeacherCreateWithUser
  const payload = {
    categoria_docente: datosDocente.categoria_docente,
    codigo_programa: datosDocente.codigo_programa || null,
    usuario: {
      tipo_documento: datosDocente.tipo_documento,
      identificacion: datosDocente.identificacion,
      primer_nombre: primer_nombre,
      segundo_nombre: segundo_nombre || null,
      primer_apellido: primer_apellido,
      segundo_apellido: segundo_apellido || null,
      sexo: datosDocente.genero || "Hombre",
      identidad_sexual: datosDocente.identidad_sexual || "Heterosexual",
      fecha_nacimiento: datosDocente.fecha_nacimiento || "",
      nacionalidad: datosDocente.nacionalidad || "Colombiana",
      pais_residencia: datosDocente.pais_residencia || "Colombia",
      departamento: datosDocente.departamento || "",
      municipio: datosDocente.municipio || "",
      ciudad_residencia: datosDocente.ciudad_residencia || "",
      direccion_residencia: datosDocente.direccion_residencia || "",
      telefono: datosDocente.telefono,
      correo: datosDocente.correo,
      contraseña: datosDocente.contraseña,
      rol: "Docente"
    }
  };

  console.log('📤 Enviando docente al backend:', JSON.stringify(payload, null, 2));

  try {
    const response = await fetch(API_ENDPOINTS.PROFESORES, {
      method: 'POST',
      headers: AuthService.getAuthHeaders(),
      body: JSON.stringify(payload)
    });

    if (response.status === 201) {
      const data = await response.json();
      console.log('✅ Docente creado:', data);
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
      throw new Error(`Sin permisos: ${errorData.message || errorData.detail || 'No tiene permisos para crear docentes'}`);
    } else if (response.status === 409) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(`Conflicto: ${errorData.message || errorData.detail || 'El docente ya existe'}`);
    } else if (response.status === 422) {
      const errorData = await response.json().catch(() => ({}));
      console.error('❌ Error de validación (422):', errorData);
      throw new Error(`Error de validación: ${errorData.message || errorData.detail || 'Los datos no son válidos'}`);
    } else {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(`Error al crear docente (${response.status}): ${errorData.message || errorData.detail || 'Error desconocido'}`);
    }
  } catch (error) {
    if (error.message) {
      throw error;
    }
    console.error('❌ Error al crear docente:', error);
    throw new Error("Error de conexión al crear el docente. Verifique su conexión a internet.");
  }
};

/**
 * Actualizar un docente existente
 * @param {string} idDocente - ID del docente a actualizar
 * @param {Object} datosDocente - Datos actualizados del docente
 * @returns {Promise<Object>} Datos del docente actualizado
 */
export const actualizarDocente = async (idDocente, datosDocente) => {
  // Validaciones
  if (!datosDocente.nombres || !datosDocente.apellidos) {
    throw new Error("Los nombres y apellidos son obligatorios");
  }

  if (!datosDocente.correo) {
    throw new Error("El correo institucional es obligatorio");
  }

  if (!datosDocente.correo.endsWith("@unicesar.edu.co")) {
    throw new Error("El correo debe ser institucional (@unicesar.edu.co)");
  }

  // Separar nombres y apellidos según la tabla
  const { primer_nombre, segundo_nombre } = separarNombres(datosDocente.nombres);
  const { primer_apellido, segundo_apellido } = separarApellidos(datosDocente.apellidos);

  // Payload para actualización - SEPARADO según tabla
  const payload = {
    tipo_documento: datosDocente.tipo_documento,
    identificacion: datosDocente.identificacion,
    primer_nombre: primer_nombre,
    segundo_nombre: segundo_nombre,
    primer_apellido: primer_apellido,
    segundo_apellido: segundo_apellido,
    sexo: datosDocente.genero || "Hombre", // La tabla usa 'sexo'
    identidad_sexual: datosDocente.identidad_sexual || "",
    fecha_nacimiento: datosDocente.fecha_nacimiento || "",
    nacionalidad: datosDocente.nacionalidad,
    pais_residencia: datosDocente.pais_residencia,
    departamento_residencia: datosDocente.departamento || "", // La tabla usa 'departamento_residencia'
    ciudad_residencia: datosDocente.ciudad_residencia || "",
    direccion_residencia: datosDocente.direccion_residencia || "",
    telefono: datosDocente.telefono,
    correo: datosDocente.correo,
    rol: "Docente",
    activo: true,
    categoria_docente: datosDocente.categoria_docente,
    codigo_programa: datosDocente.codigo_programa || ""
  };

  // Solo incluir contraseña si se proporcionó (para cambiarla)
  if (datosDocente.contraseña && datosDocente.contraseña.trim() !== "") {
    payload.contraseña = datosDocente.contraseña;
  }

  console.log('📤 Actualizando docente (ID: ' + idDocente + '):', JSON.stringify(payload, null, 2));

  try {
    const response = await fetch(`${API_ENDPOINTS.PROFESORES}/${idDocente}`, {
      method: 'PUT',
      headers: AuthService.getAuthHeaders(),
      body: JSON.stringify(payload)
    });

    if (response.ok) {
      const data = await response.json();
      console.log('✅ Docente actualizado:', data);
      return { success: true, data };
    } else if (response.status === 400) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(`Solicitud incorrecta: ${errorData.message || errorData.detail || 'Verifique los datos'}`);
    } else if (response.status === 404) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(`No encontrado: ${errorData.message || errorData.detail || 'El docente no existe'}`);
    } else {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(`Error al actualizar docente (${response.status}): ${errorData.message || errorData.detail || 'Error desconocido'}`);
    }
  } catch (error) {
    if (error.message) {
      throw error;
    }
    console.error('❌ Error al actualizar docente:', error);
    throw new Error("Error de conexión al actualizar el docente.");
  }
};

/**
 * Eliminar un docente
 * @param {string} idDocente - ID del docente a eliminar
 * @returns {Promise<Object>} Confirmación de eliminación
 */
export const eliminarDocente = async (idDocente) => {
  console.log('🗑️ Eliminando docente - ID:', idDocente);

  try {
    const response = await fetch(`${API_ENDPOINTS.PROFESORES}/${idDocente}`, {
      method: 'DELETE',
      headers: AuthService.getAuthHeaders()
    });

    if (response.ok) {
      console.log('✅ Docente eliminado del backend');
      return { success: true };
    } else if (response.status === 404) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(`No encontrado: ${errorData.message || errorData.detail || 'El docente no existe'}`);
    } else {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(`Error al eliminar docente (${response.status}): ${errorData.message || errorData.detail || 'Error desconocido'}`);
    }
  } catch (error) {
    if (error.message) {
      throw error;
    }
    console.error('❌ Error al eliminar docente:', error);
    throw new Error("Error de conexión al eliminar el docente.");
  }
};

// ==================== FUNCIONES AUXILIARES ====================

/**
 * Filtrar docentes por término de búsqueda
 * @param {Array} docentes - Lista de docentes
 * @param {string} searchTerm - Término de búsqueda
 * @returns {Array} Docentes filtrados
 */
export const filtrarDocentes = (docentes, searchTerm) => {
  // Validar que docentes sea un array
  if (!Array.isArray(docentes)) {
    console.warn('⚠️ filtrarDocentes: docentes no es un array:', docentes);
    return [];
  }
  
  if (!searchTerm) return docentes;

  const termino = searchTerm.toLowerCase();
  return docentes.filter(docente => {
    try {
      // El backend devuelve campos separados: primer_nombre, segundo_nombre, primer_apellido, segundo_apellido
      const primerNombre = docente?.usuario?.primer_nombre || "";
      const segundoNombre = docente?.usuario?.segundo_nombre || "";
      const primerApellido = docente?.usuario?.primer_apellido || "";
      const segundoApellido = docente?.usuario?.segundo_apellido || "";
      
      const nombreCompleto = `${primerNombre} ${segundoNombre} ${primerApellido} ${segundoApellido}`.toLowerCase();
      const identificacion = docente?.usuario?.identificacion?.toLowerCase() || "";
      const correo = docente?.usuario?.correo?.toLowerCase() || "";
      const programa = docente?.codigo_programa?.toLowerCase() || '';

      return (
        nombreCompleto.includes(termino) ||
        identificacion.includes(termino) ||
        correo.includes(termino) ||
        programa.includes(termino)
      );
    } catch (error) {
      console.error('Error filtrando docente:', error, docente);
      return false;
    }
  });
};

/**
 * Validar formato de correo institucional
 * @param {string} correo - Correo a validar
 * @returns {boolean} True si es válido
 */
export const validarCorreoInstitucional = (correo) => {
  return correo.endsWith("@unicesar.edu.co");
};

/**
 * Validar formato de teléfono colombiano
 * @param {string} telefono - Teléfono a validar
 * @returns {boolean} True si es válido
 */
export const validarTelefono = (telefono) => {
  // Debe tener 10 dígitos y comenzar con 3
  return /^3\d{9}$/.test(telefono);
};

/**
 * Formatear datos del formulario para envío al backend
 * @param {Object} formData - Datos del formulario
 * @returns {Object} Datos formateados
 */
export const formatearDatosDocente = (formData) => {
  return {
    tipo_documento: formData.tipoDocumento,
    identificacion: formData.identificacion,
    nombres: formData.nombres,
    apellidos: formData.apellidos,
    genero: formData.genero,
    identidad_sexual: formData.identidadSexual || "",
    fecha_nacimiento: formData.fechaNacimiento || "",
    nacionalidad: formData.nacionalidad || "CO",
    pais_residencia: formData.pais || "CO",
    departamento: formData.departamento || "",
    municipio: formData.municipio || "",
    ciudad_residencia: formData.ciudadResidencia || "",
    direccion_residencia: formData.direccionResidencia || "",
    telefono: formData.telefono,
    correo: formData.correo,
    contraseña: formData.contraseña,
    categoria_docente: formData.categoriaDocente,
    codigo_programa: formData.codigoPrograma || ""
  };
};
