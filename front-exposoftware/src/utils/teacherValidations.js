/**
 * Validaciones para formularios de Docentes
 * Valida tipos de datos, formatos y reglas de negocio
 */

export const validateField = (name, value, formData = {}) => {
  let error = "";

  // Si viene de react-select, tomamos el value real
  const val = typeof value === "object" && value !== null ? value.value : value;

  // 💡 Campos obligatorios para docentes
  const requiredFields = [
    "nombres",
    "apellidos",
    "tipoDocumento",
    "identificacion",
    "genero",
    "identidadSexual",
    "fechaNacimiento",
    "telefono",
    "correo",
    "pais",
    "nacionalidad",
    "departamentoResidencia",
    "ciudadResidencia",
    "direccionResidencia",
    "departamento",
    "municipio",
    "ciudad",
    "codigoPrograma",
    "tipoDocente",
    "nivelAcademico",
    "areaEspecializacion",
    "tipoContrato",
    "dedicacion",
    "antiguedad",
    "estado"
  ];

  if (requiredFields.includes(name) && (!val || String(val).trim() === "")) {
    return "Este campo es obligatorio.";
  }

  // ⚙️ Validaciones específicas por campo
  switch (name) {
    case "nombres":
    case "apellidos":
    case "ciudadResidencia":
    case "ciudad":
    case "municipio":
    case "areaEspecializacion":
      if (!/^[a-zA-ZÁÉÍÓÚáéíóúñÑ\s]*$/.test(val)) {
        error = "Solo se permiten letras y espacios.";
      } else if (val && val.trim().length > 0 && val.trim().length < 3) {
        error = "Debe tener al menos 3 letras.";
      }
      break;

    case "telefono":
      // Formato colombiano: 10 dígitos sin símbolos especiales
      if (!/^\d{10}$/.test(val)) {
        error = "Debe tener exactamente 10 dígitos.";
      } else if (!val.startsWith("3")) {
        error = "Los números de celular deben comenzar con 3.";
      }
      break;

    case "identificacion":
      if (!/^\d{6,12}$/.test(val)) {
        error = "Debe tener entre 6 y 12 dígitos.";
      }
      break;

    case "codigoPrograma":
      if (val && !/^[A-Z0-9-]{3,20}$/.test(val)) {
        error = "Formato inválido. Ej: ING-SIS, 12345";
      }
      break;

    case "correo":
      // Validar correo institucional de Unicesar
      if (!/^[a-zA-Z0-9._%+-]+@unicesar\.edu\.co$/.test(val)) {
        error = "Debe ser correo institucional (@unicesar.edu.co)";
      }
      break;

    case "fechaNacimiento":
      if (val) {
        const birthDate = new Date(val);
        const today = new Date();
        const age = today.getFullYear() - birthDate.getFullYear();
        
        if (birthDate > today) {
          error = "La fecha no puede ser futura.";
        } else if (age < 22) {
          error = "El docente debe tener al menos 22 años.";
        } else if (age > 100) {
          error = "Verifique la fecha ingresada.";
        }
      }
      break;

    case "antiguedad":
      if (val && !/^\d+$/.test(val)) {
        error = "Solo se permiten números enteros.";
      } else if (val && (parseInt(val) < 0 || parseInt(val) > 50)) {
        error = "Debe estar entre 0 y 50 años.";
      }
      break;

    case "direccionResidencia":
      if (val && val.trim().length < 10) {
        error = "Debe tener al menos 10 caracteres.";
      }
      break;

    default:
      break;
  }

  return error;
};

/**
 * Valida todos los campos del formulario de docente
 * @param {Object} formData - Datos del formulario
 * @returns {Object} - Objeto con errores por campo
 */
export const validateAllFields = (formData) => {
  const errors = {};

  // Campos obligatorios básicos
  const basicFields = [
    "nombres",
    "apellidos",
    "tipoDocumento",
    "identificacion",
    "genero",
    "identidadSexual",
    "fechaNacimiento",
    "telefono",
    "correo",
    "pais",
    "nacionalidad",
    "departamentoResidencia",
    "ciudadResidencia",
    "direccionResidencia",
    "departamento",
    "municipio",
    "ciudad"
  ];

  basicFields.forEach((field) => {
    const error = validateField(field, formData[field], formData);
    if (error) errors[field] = error;
  });

  // Campos académicos/institucionales
  const academicFields = [
    "codigoPrograma",
    "tipoDocente",
    "nivelAcademico",
    "areaEspecializacion",
    "tipoContrato",
    "dedicacion",
    "antiguedad",
    "estado"
  ];

  academicFields.forEach((field) => {
    const error = validateField(field, formData[field], formData);
    if (error) errors[field] = error;
  });

  return errors;
};

/**
 * Determina si un campo debe aceptar solo números
 * @param {string} fieldName - Nombre del campo
 * @returns {boolean}
 */
export const isNumericField = (fieldName) => {
  return ["identificacion", "telefono", "antiguedad"].includes(fieldName);
};

/**
 * Determina si un campo debe aceptar solo letras
 * @param {string} fieldName - Nombre del campo
 * @returns {boolean}
 */
export const isTextOnlyField = (fieldName) => {
  return [
    "nombres",
    "apellidos",
    "ciudadResidencia",
    "ciudad",
    "municipio",
    "areaEspecializacion"
  ].includes(fieldName);
};

/**
 * Verifica si hay errores en el objeto de errores
 * @param {Object} errors - Objeto con errores
 * @returns {boolean}
 */
export const hasErrors = (errors) => {
  return Object.values(errors).some((error) => error !== "");
};

/**
 * Filtra la entrada del usuario según el tipo de campo
 * @param {string} fieldName - Nombre del campo
 * @param {string} value - Valor ingresado
 * @returns {string} - Valor filtrado
 */
export const filterInput = (fieldName, value) => {
  if (isNumericField(fieldName)) {
    // Solo números
    return value.replace(/\D/g, "");
  }
  
  if (isTextOnlyField(fieldName)) {
    // Solo letras, espacios y caracteres especiales del español
    return value.replace(/[^a-zA-ZÁÉÍÓÚáéíóúñÑ\s]/g, "");
  }

  return value;
};

/**
 * Valida formato de correo institucional
 * @param {string} email - Correo a validar
 * @returns {boolean}
 */
export const isValidInstitutionalEmail = (email) => {
  return /^[a-zA-Z0-9._%+-]+@unicesar\.edu\.co$/.test(email);
};

/**
 * Valida formato de identificación colombiana
 * @param {string} id - Identificación a validar
 * @returns {boolean}
 */
export const isValidColombianID = (id) => {
  return /^\d{6,12}$/.test(id);
};

/**
 * Valida formato de teléfono celular colombiano
 * @param {string} phone - Teléfono a validar
 * @returns {boolean}
 */
export const isValidColombianPhone = (phone) => {
  return /^3\d{9}$/.test(phone);
};

/**
 * Formatea número de teléfono para visualización
 * @param {string} phone - Teléfono sin formato
 * @returns {string} - Teléfono formateado (XXX XXX XXXX)
 */
export const formatPhone = (phone) => {
  if (!phone || phone.length !== 10) return phone;
  return `${phone.slice(0, 3)} ${phone.slice(3, 6)} ${phone.slice(6)}`;
};

/**
 * Obtiene mensaje de error amigable para el usuario
 * @param {string} fieldName - Nombre del campo
 * @param {string} errorType - Tipo de error
 * @returns {string} - Mensaje de error
 */
export const getErrorMessage = (fieldName, errorType) => {
  const messages = {
    required: "Este campo es obligatorio",
    invalid: "El formato ingresado no es válido",
    minLength: "El valor ingresado es demasiado corto",
    maxLength: "El valor ingresado es demasiado largo",
    numeric: "Solo se permiten números",
    text: "Solo se permiten letras",
    email: "Debe ser un correo institucional (@unicesar.edu.co)",
    phone: "Debe ser un número celular válido (10 dígitos, inicia con 3)",
    age: "La edad debe estar entre 22 y 100 años"
  };

  return messages[errorType] || "Valor inválido";
};
