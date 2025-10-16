export const validateField = (name, value, formData = {}, rol = "") => {
  let error = "";

  switch (name) {
    case "nombres":
    case "apellidos":
      if (!/^[a-zA-ZÁÉÍÓÚáéíóúñÑ\s]*$/.test(value)) {
        error = "Solo se permiten letras y espacios.";
      }
      break;

    case "telefono":
      if (!/^[0-9]*$/.test(value)) {
        error = "Solo se permiten números.";
      } else if (value && value.length < 10) {
        error = "Debe tener al menos 10 dígitos.";
      }
      break;

    case "numeroDocumento":
      if (!/^[0-9]*$/.test(value)) {
        error = "Solo se permiten números.";
      }
      break;

    case "correo":
      if (rol === "estudiante" || rol === "profesor" || rol === "egresado") {
        if (!/^[a-zA-Z0-9._%+-]+@unicesar\.edu\.co$/.test(value)) {
          error = "Debe ser correo institucional (@unicesar.edu.co)";
        }
      } else if (rol === "invitado") {
        if (
          !/^[a-zA-Z0-9._%+-]+@(gmail|hotmail|yahoo|outlook)\.com$/.test(value)
        ) {
          error = "Correo personal inválido. Usa Gmail, Hotmail, Yahoo u Outlook.";
        }
      }
      break;

    case "contraseña":
      if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d@$!%*?&]{8,}$/.test(value)) {
        error = "Debe tener 8+ caracteres, una mayúscula, una minúscula y un número.";
      }
      break;

    case "confirmarcontraseña":
      if (value !== formData.contraseña) {
        error = "Las contraseñas no coinciden.";
      }
      break;

    case "rol":
    case "sexo":
    case "orientacionSexual":
    case "departamentoNacimiento":
    case "municipioNacimineto":
    case "nacionalidad":
    case "ciudadResidencia":
    case "tipoDocumento":
    case "semestre":
    case "tipoDocente":
    case "sector":
    case "nombreEmpresa":
    case "titulado":
      if (value === "") {
        error = "Selecciona una opción.";
      }
      break;

    case "fechaNacimiento":
      if (value && new Date(value) > new Date()) {
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
  
  const basicFields = [
    "nombres",
    "apellidos",
    "telefono",
    "sexo",
    "orientacionSexual",
    "fechaNacimiento",
    "departamentoNacimiento",
    "municipioNacimineto",
    "nacionalidad",
    "ciudadResidencia",
    "direccionResidencia",
    "rol",
    "tipoDocumento",
    "numeroDocumento",
    "contraseña",
    "confirmarcontraseña"
  ];

  // Validar campos básicos
  basicFields.forEach(field => {
    const error = validateField(field, formData[field], formData, rol);
    if (error) {
      errors[field] = error;
    }
  });


  if (rol === "estudiante") {
    const studentFields = ["correo", "codigoPrograma", "semestre"];
    studentFields.forEach(field => {
      const error = validateField(field, formData[field], formData, rol);
      if (error) {
        errors[field] = error;
      }
    });
  }

  if (rol === "profesor") {
    const teacherFields = ["correo", "tipoDocente", "codigoPrograma"];
    teacherFields.forEach(field => {
      const error = validateField(field, formData[field], formData, rol);
      if (error) {
        errors[field] = error;
      }
    });
  }

  if (rol === "invitado") {
    const guestFields = ["correo", "sector", "nombreEmpresa"];
    guestFields.forEach(field => {
      const error = validateField(field, formData[field], formData, rol);
      if (error) {
        errors[field] = error;
      }
    });
  }

  if (rol === "egresado") {
    const graduateFields = ["correo", "titulado"];
    graduateFields.forEach(field => {
      const error = validateField(field, formData[field], formData, rol);
      if (error) {
        errors[field] = error;
      }
    });
  }

  return errors;
};


export const isNumericField = (fieldName) => {
  return ["telefono", "numeroDocumento"].includes(fieldName);
};

export const hasErrors = (errors) => {
  return Object.values(errors).some(error => error !== "");
};