/**
 * Valida un campo individual del formulario
 */
export const validateField = (name, value, formData = {}, rol = "") => {
  let error = "";

  // Si viene de react-select, tomamos el value real
  const val = typeof value === "object" && value !== null ? value.value : value;

  // 💡 Todos los campos (menos los opcionales) deben tener valor
  const requiredFields = [
    "primerNombre",

    "primerApellido",
    "segundoApellido",
    "telefono",
    "genero",
    "orientacionSexual",
    "fechaNacimiento",
    "fechaIngreso",
    "fechaFinalizacion",
    "departamentoResidencia",
    "ciudadResidencia",
    "nacionalidad",
    "paisNacimiento",
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
    case "primerNombre":
    case "segundoNombre":
    case "primerApellido":
    case "segundoApellido":
    case "intitucionOrigen":
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
      const digits = val.replace(/\D/g, "");

      // Si empieza con +57 o 57 → Colombia
      const isColombia = digits.startsWith("57");

      if (isColombia) {
        let number = digits.startsWith("57") ? digits.slice(2) : digits;

        if (!/^\d+$/.test(number)) {
          error = "El número solo debe contener dígitos.";
        } else if (!number.startsWith("3")) {
          error = "El número colombiano debe comenzar con 3.";
        } else if (number.length !== 10) {
          error = "El número colombiano debe tener 10 dígitos.";
        }
      } else {
        if (digits.length < 6) {
          error = "Debe tener mínimo 6 dígitos.";
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
 * Valida todos los campos del formulario según el rol
 */
export const validateAllFields = (formData, rol) => {
  const errors = {};

  // Campos básicos comunes
  const basicFields = [
    "primerNombre",

    "intitucionOrigen",
    "primerApellido",
    "segundoApellido",
    "telefono",
    "genero",
    "orientacionSexual",
    "fechaNacimiento",
    "nacionalidad",
    "paisNacimiento",
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
    ["correo", "sector", "nombreEmpresa", "intitucionOrigen"].forEach((f) => {
      const err = validateField(f, formData[f], formData, rol);
      if (err) errors[f] = err;
    });
  }

  if (rol === "egresado") {
    ["correo", "titulado", "fechaFinalizacion", "periodo", "codigoPrograma"].forEach((f) => {
      const err = validateField(f, formData[f], formData, rol);
      if (err) errors[f] = err;
    });
  }

  // OPCIONALES que SI SE VALIDAN si el usuario los llena
["segundoNombre"].forEach((field) => {
  if (formData[field] && formData[field].trim() !== "") {
    const error = validateField(field, formData[field], formData, rol);
    if (error) errors[field] = error;
  }
});


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
  return ["primerNombre", "segundoNombre", "primerApellido", "segundoApellido"].includes(fieldName);
};

/**
 * Verifica si hay errores en el objeto de errores
 */
export const hasErrors = (errors) => {
  return Object.values(errors).some((error) => error !== "");
};