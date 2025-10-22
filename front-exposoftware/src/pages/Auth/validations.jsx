export const validateField = (name, value, formData = {}, rol = "") => {
  let error = "";

  // Si viene de react-select, tomamos el value real
  const val = typeof value === "object" && value !== null ? value.value : value;

  // 💡 Todos los campos (menos los opcionales) deben tener valor
  const requiredFields = [
    "nombres",
    "apellidos",
    "telefono",
    "sexo",
    "orientacionSexual",
    "fechaNacimiento",
    "fechaIngreso",
    "fechaFinalizacion",
    "departamentoNacimiento",
    "municipioNacimiento",
    "nacionalidad",
    "paisResidencia",
    "ciudadResidencia",
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
    "periodo"
  ];

  if (requiredFields.includes(name) && (!val || String(val).trim() === "")) {
    return "Este campo es obligatorio.";
  }

  // ⚙️ Validaciones específicas por campo
  switch (name) {
    case "nombres":
    case "apellidos":
      case "ciudadResidencia":
      if (!/^[a-zA-ZÁÉÍÓÚáéíóúñÑ\s]*$/.test(val)) {
        error = "Solo se permiten letras y espacios.";
      }else if (val.trim().length <= 3) {
        error = "Debe tener al menos 4 letras.";
      }
      break;

    case "telefono":
      // react-international-phone retorna "+573001234567"
      if (!/^\+?\d{10,15}$/.test(val)) {
        error = "Número de teléfono inválido. Debe tener entre 10 y 15 dígitos.";
      }
      break;

    case "numeroDocumento":
      if (!/^\d{0,10}$/.test(val)) {
        error = "Solo se permiten números (máximo 10 dígitos).";
      }else if (val.length !== 10) {
        error = "Debe tener exactamente 10 dígitos.";
      }
      break;


    case "correo":
      if (rol === "estudiante" || rol === "profesor" || rol === "egresado") {
        if (!/^[a-zA-Z0-9._%+-]+@unicesar\.edu\.co$/.test(val)) {
          error = "Debe ser correo institucional (@unicesar.edu.co)";
        }
      } else if (rol === "invitado") {
        if (
          !/^[a-zA-Z0-9._%+-]+@(gmail|hotmail|yahoo|outlook)\.com$/.test(val)
        ) {
          error =
            "Correo personal inválido. Usa Gmail, Hotmail, Yahoo u Outlook.";
        }
      }
      break;

    case "contraseña":
      if (
        !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d@$!%*?&]{8,}$/.test(val)
      ) {
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

export const validateAllFields = (formData, rol) => {
  const errors = {};

  // Campos básicos comunes
  const basicFields = [
    "nombres",
    "apellidos",
    "telefono",
    "sexo",
    "orientacionSexual",
    "fechaNacimiento",
    "departamentoNacimiento",
    "municipioNacimiento",
    "nacionalidad",
    "ciudadResidencia",
    "direccionResidencia",
    "rol",
    "tipoDocumento",
    "numeroDocumento",
    "contraseña",
    "confirmarcontraseña",
  ];

  basicFields.forEach((field) => {
    const error = validateField(field, formData[field], formData, rol);
    if (error) errors[field] = error;
  });

  // Dependiendo del rol, se agregan campos extra
  if (rol === "estudiante") {
    ["correo", "codigoPrograma", "semestre", "fechaIngreso", "periodo"].forEach((f) => {
      const err = validateField(f, formData[f], formData, rol);
      if (err) errors[f] = err;
    });
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

export const isNumericField = (fieldName) => {
  return ["numeroDocumento"].includes(fieldName);
};

export const hasErrors = (errors) => {
  return Object.values(errors).some((error) => error !== "");
};
