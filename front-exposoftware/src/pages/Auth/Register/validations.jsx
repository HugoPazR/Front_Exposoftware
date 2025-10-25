/**
 * Valida un campo individual del formulario
 */
export const validateField = (name, value, formData = {}, rol = "") => {
  let error = "";

  // Si viene de react-select, tomamos el value real
  const val = typeof value === "object" && value !== null ? value.value : value;

  // 💡 Todos los campos (menos los opcionales) deben tener valor
  const requiredFields = [
    "nombres",
    "apellidos",
    "telefono",
    "genero",
    "orientacionSexual",
    "fechaNacimiento",
    "fechaIngreso",
    "fechaFinalizacion",
    "departamentoResidencia",
    "ciudadResidencia",
    "nacionalidad",
    "paisResidencia",
    "direccionResidencia",
    "rol",
    "tipoDocumento",
    "numeroDocumento",
    "correo",
    "contraseña",
    "confirmarcontraseña",
    "codigoPrograma",
    "semestre",
    "tipoDocente",
    "sector",
    "nombreEmpresa",
    "titulado",
    "periodo",
  ];

  if (requiredFields.includes(name) && (!val || String(val).trim() === "")) {
    return "Este campo es obligatorio.";
  }

  // ⚙️ Validaciones específicas por campo
  switch (name) {
    case "nombres":
    case "apellidos":
      // 🔹 Validar que NO contenga números
      if (/\d/.test(val)) {
        error = "No se permiten números en este campo.";
      } else if (!/^[a-zA-ZÁÉÍÓÚáéíóúñÑ\s]*$/.test(val)) {
        error = "Solo se permiten letras y espacios.";
      } else if (val.trim().length > 0 && val.trim().length < 3) {
        error = "Debe tener al menos 3 letras.";
      }
      break;

    case "ciudadResidencia":
      // Solo validar si nacionalidad es Colombia
      if (formData.nacionalidad === "CO") {
        if (!/^[a-zA-ZÁÉÍÓÚáéíóúñÑ\s]*$/.test(val)) {
          error = "Solo se permiten letras y espacios.";
        } else if (val.trim().length > 0 && val.trim().length < 3) {
          error = "Debe tener al menos 3 letras.";
        }
      }
      break;

      case "direccionResidencia":
        // 🏠 Validación de dirección colombiana con nombres completos (sin abreviaturas)
        const direccionRegex =
          /^(?:(?:calle|carrera|diagonal|transversal|avenida|autopista|bulevar)\s*\d+[a-zA-Z]?(?:\s*[#-]\s*\d+[a-zA-Z]?(?:\s*-\s*\d+)?)?(?:\s*[a-zA-Z0-9\s]*)?)$/i;

        if (!direccionRegex.test(val.trim())) {
          error =
            "Formato de dirección inválido. Ejemplo válido: 'Calle 10 #15-30' o 'Carrera 7A - 45'.";
        } else if (val.trim().length < 6) {
          error = "La dirección debe tener al menos 6 caracteres.";
        }
        break;

    case "codigoPrograma":
      if (!/^[a-zA-Z0-9\s-]*$/.test(val)) {
        error = "Solo se permiten letras, números, espacios y guiones.";
      } else if (val.trim().length > 0 && val.trim().length < 3) {
        error = "Debe tener al menos 3 caracteres.";
      }
      break;

    case "nombreEmpresa":
      if (val.trim().length > 0 && val.trim().length < 3) {
        error = "Debe tener al menos 3 caracteres.";
      }
      break;

    case "telefono":
      // Debe iniciar con "+" seguido de al menos un dígito (código de país)
      if (!/^\+\d+/.test(val)) {
        error = "Debe incluir el prefijo internacional (+XX).";
        break;
      }

      // Extraemos código y número
      const match = val.match(/^\+(\d{1,4})(\d*)$/);
      if (!match) {
        error = "Formato inválido de teléfono.";
        break;
      }

      const code = match[1]; // Ejemplo: "57"
      const number = match[2]; // Ejemplo: "3001234567"

      // 🇨🇴 Validación especial para Colombia
      if (code === "57") {
        if (!number) {
          error = "Ingresa el número después del código de país.";
        } else if (!number.startsWith("3")) {
          error = "El número colombiano debe comenzar con 3.";
        } else if (number.length !== 10) {
          error = "El número colombiano debe tener exactamente 10 dígitos.";
        }
      } else {
        // 🌍 Validación genérica para otros países
        if (number.length > 0 && (number.length < 6 || number.length > 15)) {
          error = "El número debe tener entre 6 y 15 dígitos (sin el prefijo).";
        }
      }
      break;

    case "numeroDocumento":
      // 🔹 Validar que SOLO contenga números
      if (/[^\d]/.test(val)) {
        error = "Solo se permiten números.";
      } else if (val.length > 0 && val.length < 6) {
        error = "Debe tener al menos 6 dígitos.";
      } else if (val.length > 10) {
        error = "Máximo 10 dígitos.";
      }
      break;

    case "correo":
      if (rol === "estudiante" || rol === "profesor" || rol === "egresado") {
        if (!/^[a-zA-Z0-9._%+-]+@unicesar\.edu\.co$/.test(val)) {
          error = "Debe ser correo institucional (@unicesar.edu.co)";
        }
      } else if (rol === "invitado") {
        if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(val)) {
          error = "Correo inválido. Asegúrate de ingresar un correo válido.";
        }
      }
      break;

    case "contraseña":
      if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d@$!%*?&]{8,}$/.test(val)) {
        error =
          "Debe tener 8+ caracteres, una mayúscula, una minúscula y un número.";
      }
      break;

    case "confirmarcontraseña":
      if (val !== formData.contraseña) {
        error = "Las contraseñas no coinciden.";
      }
      break;

    case "fechaNacimiento":
      if (val && new Date(val) > new Date()) {
        error = "La fecha no puede ser futura.";
      }
      break;

    default:
      break;
  }

  return error;
};

/**
 * Valida específicamente el teléfono con código de país
 */
export const validatePhone = (value, countryCode, setErrors) => {
  const numberWithoutPrefix = value.slice(countryCode.length);

  // 🇨🇴 Validación para Colombia
  if (countryCode === "57") {
    if (numberWithoutPrefix && numberWithoutPrefix[0] !== "3") {
      setErrors((prev) => ({
        ...prev,
        telefono: "El número colombiano debe comenzar con 3.",
      }));
      return false;
    } else if (
      numberWithoutPrefix.length > 0 &&
      numberWithoutPrefix.length < 10
    ) {
      setErrors((prev) => ({
        ...prev,
        telefono: "El número debe tener 10 dígitos.",
      }));
      return false;
    } else if (numberWithoutPrefix.length === 10) {
      setErrors((prev) => ({ ...prev, telefono: "" }));
      return true;
    }
  } else {
    // 🌍 Validación genérica para otros países
    if (numberWithoutPrefix.length > 0 && numberWithoutPrefix.length < 7) {
      setErrors((prev) => ({
        ...prev,
        telefono: "El número debe tener al menos 7 dígitos.",
      }));
      return false;
    } else if (numberWithoutPrefix.length >= 7) {
      setErrors((prev) => ({ ...prev, telefono: "" }));
      return true;
    }
  }

  return false;
};

/**
 * Formatea el teléfono colombiano (fuerza el 3 inicial)
 */
export const formatColombianPhone = (phone, countryCode) => {
  const numberWithoutPrefix = phone.slice(countryCode.length);

  // Si está vacío o no empieza con 3, forzar el 3
  if (!numberWithoutPrefix || !numberWithoutPrefix.startsWith("3")) {
    return countryCode + "3" + numberWithoutPrefix.replace(/^3*/, "");
  }

  return phone;
};

/**
 * Valida todos los campos del formulario según el rol
 */
export const validateAllFields = (formData, rol) => {
  const errors = {};

  // Campos básicos comunes
  const basicFields = [
    "nombres",
    "apellidos",
    "telefono",
    "genero",
    "orientacionSexual",
    "fechaNacimiento",
    "nacionalidad",
    "paisResidencia",
    "direccionResidencia",
    "rol",
    "tipoDocumento",
    "numeroDocumento",
    "contraseña",
    "confirmarcontraseña",
  ];

  // Validar campos básicos
  basicFields.forEach((field) => {
    const error = validateField(field, formData[field], formData, rol);
    if (error) errors[field] = error;
  });

  // Validar campos de residencia según nacionalidad
  if (formData.nacionalidad === "CO") {
    ["departamentoResidencia", "ciudadResidencia"].forEach((field) => {
      const error = validateField(field, formData[field], formData, rol);
      if (error) errors[field] = error;
    });
  }

  // Dependiendo del rol, se agregan campos extra
  if (rol === "estudiante") {
    ["correo", "codigoPrograma", "semestre", "fechaIngreso", "periodo"].forEach(
      (f) => {
        const err = validateField(f, formData[f], formData, rol);
        if (err) errors[f] = err;
      }
    );
  }

  if (rol === "invitado") {
    ["correo", "sector", "nombreEmpresa"].forEach((f) => {
      const err = validateField(f, formData[f], formData, rol);
      if (err) errors[f] = err;
    });
  }

  if (rol === "egresado") {
    ["correo", "titulado", "fechaFinalizacion", "periodo"].forEach((f) => {
      const err = validateField(f, formData[f], formData, rol);
      if (err) errors[f] = err;
    });
  }

  return errors;
};

/**
 * Verifica si un campo es numérico
 */
export const isNumericField = (fieldName) => {
  return ["numeroDocumento", "semestre"].includes(fieldName);
};

/**
 * Verifica si un campo es alfabético
 */
export const isAlphabeticField = (fieldName) => {
  return ["nombres", "apellidos"].includes(fieldName);
};

/**
 * Verifica si hay errores en el objeto de errores
 */
export const hasErrors = (errors) => {
  return Object.values(errors).some((error) => error !== "");
};