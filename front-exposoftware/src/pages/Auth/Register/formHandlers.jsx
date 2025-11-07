import { validateField, isNumericField } from "./validations";

/**
 * Maneja cambios en inputs de texto
 */
// Capitaliza la primera letra de cada palabra
const capitalizeWords = (str) => {
  return str.replace(/\b\w/g, (c) => c.toUpperCase());
};

export const handleChange = (
  e,
  formData,
  setFormData,
  setErrors,
  setSuccessFields,
  rol,
  setrol
) => {
  const { name, value } = e.target;
  let cleanValue = value;

  // ✅ Definir límites máximos por campo
  const maxLengths = {
    primerNombre: 15,
    segundoNombre: 15,
    primerApellido: 15,
    segundoApellido: 15,
    direccionResidencia: 50,
    numeroDocumento: 20,
    correo: 30,
    contraseña: 12,
    nombreEmpresa: 40,
    intitucionOrigen: 40,
    // Agrega más campos según necesites
  };

  // ✅ Campos que solo aceptan letras
  const alphabeticFields = [
    "primerNombre",
    "segundoNombre",
    "primerApellido",
    "segundoApellido",
    "intitucionOrigen",
  ];

  // Bloquear caracteres inválidos + capitalizar
  if (alphabeticFields.includes(name)) {
    cleanValue = value.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ\s]/g, "").toLowerCase();
    cleanValue = capitalizeWords(cleanValue);
  }

  // Limpiar caracteres no numéricos
  if (isNumericField(name)) {
    cleanValue = value.replace(/[^\d]/g, "");
  }

  // 🔥 NUEVA LÓGICA: Bloquear si excede el límite máximo
  if (maxLengths[name] && cleanValue.length > maxLengths[name]) {
    return; // 🚫 No permitir más caracteres
  }

  if (name === "rol") {
    setrol(cleanValue);
  }

  setFormData((prev) => {
    // 🔥 Si cambia la facultad, resetear el programa
    const updatedForm = name === "facultad" 
      ? { ...prev, [name]: cleanValue, programa: "" }
      : { ...prev, [name]: cleanValue };
    
    const error = validateField(
      name,
      cleanValue,
      updatedForm,
      name === "rol" ? cleanValue : rol
    );

    // Actualizar errores
    setErrors((prevErrors) => {
      const newErrors = { ...prevErrors, [name]: error };
      // 🔥 Si cambió la facultad, limpiar también el error del programa
      if (name === "facultad") {
        newErrors.programa = "";
      }
      return newErrors;
    });

    // Marcar campo como exitoso si no hay error y tiene valor
    if (!error && cleanValue.trim() !== "") {
      setSuccessFields((prev) => {
        const newSuccess = { ...prev, [name]: true };
        // 🔥 Si cambió la facultad, resetear el success del programa
        if (name === "facultad") {
          newSuccess.programa = false;
        }
        return newSuccess;
      });
    } else {
      setSuccessFields((prev) => ({ ...prev, [name]: false }));
    }

    return updatedForm;
  });
};

/**
 * Maneja cambios en react-select
 */
export const handleSelectChange = (
  name,
  option,
  formData,
  setFormData,
  setErrors,
  setSuccessFields,
  rol
) => {
  const value = option ? option.value : "";

  setFormData((prev) => ({ ...prev, [name]: value }));

  const error = validateField(name, value, formData, rol);
  setErrors((prev) => ({ ...prev, [name]: error }));

  if (!error && value !== "") {
    setSuccessFields((prev) => ({ ...prev, [name]: true }));
  } else {
    setSuccessFields((prev) => ({ ...prev, [name]: false }));
  }
};

/**
 * Maneja cambios en el departamento de residencia
 */
export const handleDepartamentoChange = (
  e,
  formData,
  setFormData,
  setciudades,
  setErrors,
  setSuccessFields,
  rol,
  colombia
) => {
  const selectedDepartamento = e.target.value;

  setFormData((prev) => ({
    ...prev,
    departamentoResidencia: selectedDepartamento,
    ciudadResidencia: "",
  }));

  const depto = colombia.find((d) => d.departamento === selectedDepartamento);
  setciudades(depto && Array.isArray(depto.ciudades) ? depto.ciudades : []);

  const error = validateField(
    "departamentoResidencia",
    selectedDepartamento,
    formData,
    rol
  );
  setErrors((prev) => ({ ...prev, departamentoResidencia: error }));

  if (!error && selectedDepartamento) {
    setSuccessFields((prev) => ({ ...prev, departamentoResidencia: true }));
  }
};

/**
 * Maneja cambios en el input de teléfono (PhoneInput)
 */
export const handlePhoneChange = (
  value,
  formData,
  setFormData,
  setErrors,
  setSuccessFields,
  rol
) => {
  // PhoneInput ya incluye el "+" en algunos casos
  const phoneValue = value.startsWith("+") ? value : `+${value}`;

  // Crear el formData actualizado para validar
  const updatedForm = { ...formData, telefono: phoneValue };

  // Validar con el formData actualizado
  const error = validateField("telefono", phoneValue, updatedForm, rol);

  // Actualizar todo el estado en un solo bloque
  setFormData(updatedForm);
  setErrors((prevErrors) => ({ ...prevErrors, telefono: error }));

  // Marcar campo como exitoso si no hay error y tiene valor
  if (!error && phoneValue.trim() !== "" && phoneValue !== "+") {
    setSuccessFields((prev) => ({ ...prev, telefono: true }));
  } else {
    setSuccessFields((prev) => ({ ...prev, telefono: false }));
  }
};

/**
 * Maneja el envío del formulario
 */
/**
 * Maneja el envío del formulario sin backend
 */
export const handleSubmit = (
  e,
  formData,
  rol,
  setCargando,
  setMensajeExito,
  setMensajeError,
  setErrors,
  validateAllFields,
  hasErrors
) => {
  e.preventDefault();

  setCargando(true);
  setMensajeExito("");
  setMensajeError("");

  // Validar todos los campos
  const allErrors = validateAllFields(formData, rol);
  setErrors(allErrors);

  // Si no hay errores, mostrar alerta de éxito inmediatamente
  if (!hasErrors(allErrors)) {
    setMensajeExito("✅ ¡Registro exitoso!");
    alert("✅ Registro exitoso. Tus datos han sido validados correctamente.");

    console.log("Formulario válido, datos registrados localmente:", formData);
  } else {
    // Mostrar mensaje de error si hay errores
    setMensajeError("❌ Por favor corrige los errores en el formulario.");
    alert("❌ Corrige los errores en el formulario antes de continuar.");

    console.warn("Errores en el formulario:", allErrors);

    // Hacer scroll al primer error
    const firstErrorField = Object.keys(allErrors)[0];
    const element = document.querySelector(`[name='${firstErrorField}']`);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "center" });
      element.focus();
    }
  }

  setCargando(false);
};

/**
 * Obtiene las clases CSS para un input según su estado
 */
export const getInputClassName = (
  fieldName,
  errors,
  successFields,
  cargando
) => {
  const baseClass =
    "w-full border rounded-lg p-2 focus:ring-2 outline-none transition-all";

  if (cargando) {
    return `${baseClass} bg-gray-100 cursor-not-allowed border-gray-300`;
  }

  if (errors[fieldName]) {
    return `${baseClass} border-red-500 focus:ring-red-400`;
  }

  if (successFields[fieldName]) {
    return `${baseClass} border-green-500 focus:ring-green-400`;
  }

  return `${baseClass} border-gray-300 focus:ring-green-400`;
};
