import { API_ENDPOINTS } from "../utils/constants";

/**
 * Servicio para el registro de usuarios
 * Endpoints públicos - NO requieren autenticación
 */

// Sanitizar dirección: remover caracteres no permitidos
const sanitizarDireccion = (direccion) => {
  return direccion
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/ñ/gi, "n")
    .replace(/[^A-Za-z0-9#\-\s,]/g, "");
};

// Manejar respuestas de error consistentemente
const handleErrorResponse = async (response) => {
  if (response.status === 400) {
    const errorData = await response.json().catch(() => ({}));
    console.error('❌ Solicitud incorrecta:', errorData);
    throw new Error(errorData.message || errorData.detail || 'Datos incorrectos');
  } else if (response.status === 409) {
    const errorData = await response.json().catch(() => ({}));
    console.error('❌ Conflicto:', errorData);
    throw new Error(errorData.message || errorData.detail || 'El usuario ya existe');
  } else if (response.status === 422) {
    const errorData = await response.json().catch(() => ({}));
    console.error('❌ Error de validación (422):', errorData);
    console.error('📋 Detalle completo:', JSON.stringify(errorData, null, 2));
    
    const errorList = errorData.errors || errorData.detail || [];
    
    if (Array.isArray(errorList) && errorList.length > 0) {
      console.error('📝 Errores encontrados:');
      errorList.forEach((err, idx) => {
        const campo = err.field || (err.loc ? err.loc.join(' > ') : 'N/A');
        const mensaje = err.message || err.msg || 'Error de validación';
        const tipo = err.type || 'N/A';
        
        console.error(`  ${idx + 1}. Campo: ${campo}`);
        console.error(`     Mensaje: ${mensaje}`);
        console.error(`     Tipo: ${tipo}`);
        if (err.input !== undefined) {
          console.error(`     Valor recibido: ${JSON.stringify(err.input)}`);
        }
      });
      
      const errorMessages = errorList.map(err => {
        const campo = err.field || (err.loc ? err.loc.join(' > ') : 'Desconocido');
        const mensaje = err.message || err.msg || 'Error de validación';
        return `• Campo: ${campo}\n  ${mensaje}`;
      }).join('\n\n');
      
      throw new Error('Errores de validación:\n\n' + errorMessages);
    }
    
    throw new Error(errorData.message || 'Datos no válidos');
  } else {
    const errorData = await response.json().catch(() => ({}));
    console.error('❌ Error del servidor:', errorData);
    throw new Error(errorData.message || errorData.detail || 'Error al registrar');
  }
};

/**
 * Registrar un nuevo ESTUDIANTE
 * @param {Object} studentData - Datos del estudiante desde el formulario
 * @returns {Promise<Object>} Resultado del registro
 */
export const registrarEstudiante = async (studentData) => {
  // Normalizar género para que coincida con el backend (primera letra mayúscula)
  const normalizarGenero = (genero) => {
    if (!genero) return '';
    const generoLower = genero.toLowerCase();
    if (generoLower === 'hombre') return 'Hombre';
    if (generoLower === 'mujer') return 'Mujer';
    if (generoLower === 'hermafrodita') return 'Hermafrodita';
    return genero; // Si ya está correcto, devolverlo tal cual
  };
  
  const payload = {
    usuario: {
      tipo_documento: studentData.tipoDocumento,
      identificacion: studentData.numeroDocumento,
      primer_nombre: studentData.primerNombre,
      segundo_nombre: studentData.segundoNombre || null,
      primer_apellido: studentData.primerApellido,
      segundo_apellido: studentData.segundoApellido || null,
      sexo: normalizarGenero(studentData.genero),
      identidad_sexual: studentData.orientacionSexual,
      fecha_nacimiento: studentData.fechaNacimiento,
      nacionalidad: studentData.paisNacimiento,
      pais_residencia: studentData.nacionalidad,
      departamento: studentData.departamentoResidencia,
      municipio: studentData.ciudadResidencia,
      ciudad_residencia: studentData.ciudadResidencia,
      direccion_residencia: sanitizarDireccion(studentData.direccionResidencia),
      telefono: studentData.telefono,
      correo: studentData.correo,
      rol: "Estudiante",
      contraseña: studentData.contraseña
    },
    codigo_programa: studentData.programa,
    semestre: parseInt(studentData.semestre),
    periodo: parseInt(studentData.periodo),
    anio_ingreso: parseInt(studentData.fechaIngreso)
  };

  console.log('🎓 Registrando ESTUDIANTE:', {
    ...payload,
    usuario: { ...payload.usuario, contraseña: '***' }
  });
  console.log('🔗 Endpoint:', API_ENDPOINTS.REGISTRO_ESTUDIANTE);

  try {
    const response = await fetch(API_ENDPOINTS.REGISTRO_ESTUDIANTE, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    console.log('📡 Status:', response.status, response.statusText);

    if (response.status === 201 || response.ok) {
      const data = await response.json();
      console.log('✅ Registro de estudiante exitoso:', data);
      return { success: true, data, message: data.message || 'Registro exitoso' };
    } else {
      await handleErrorResponse(response);
    }
  } catch (error) {
    if (error.message) {
      throw error;
    }
    console.error('❌ Error de conexión:', error);
    throw new Error("Error de conexión. Verifique su conexión a internet.");
  }
};

/**
 * Registrar un nuevo EGRESADO
 * @param {Object} graduateData - Datos del egresado desde el formulario
 * @returns {Promise<Object>} Resultado del registro
 */
export const registrarEgresado = async (graduateData) => {
  const payload = {
    tipo_documento: graduateData.tipoDocumento,
    identificacion: graduateData.numeroDocumento,
    primer_nombre: graduateData.primerNombre,
    segundo_nombre: graduateData.segundoNombre || null,
    primer_apellido: graduateData.primerApellido,
    segundo_apellido: graduateData.segundoApellido || null,
    sexo: graduateData.genero,
    identidad_sexual: graduateData.orientacionSexual,
    fecha_nacimiento: graduateData.fechaNacimiento,
    nacionalidad: graduateData.paisNacimiento,
    pais_residencia: graduateData.nacionalidad,
    departamento: graduateData.departamentoResidencia,
    municipio: graduateData.ciudadResidencia,
    ciudad_residencia: graduateData.ciudadResidencia,
    direccion_residencia: sanitizarDireccion(graduateData.direccionResidencia),
    telefono: graduateData.telefono,
    correo: graduateData.correo,
    rol: "Egresado",
    contraseña: graduateData.contraseña,
    // Campos específicos del egresado
    codigo_programa: graduateData.programa,
    año_graduacion: parseInt(graduateData.fechaFinalizacion),
    titulado: graduateData.titulado === 'si',
    ...(graduateData.tituloObtenido && { titulo_obtenido: graduateData.tituloObtenido })
  };

  console.log('🎓 Registrando EGRESADO:', {
    ...payload,
    contraseña: '***'
  });
  console.log('🔗 Endpoint:', API_ENDPOINTS.REGISTRO_EGRESADO);

  try {
    const response = await fetch(API_ENDPOINTS.REGISTRO_EGRESADO, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    console.log('📡 Status:', response.status, response.statusText);

    if (response.status === 201 || response.ok) {
      const data = await response.json();
      console.log('✅ Registro de egresado exitoso:', data);
      return { success: true, data, message: data.message || 'Registro exitoso' };
    } else {
      await handleErrorResponse(response);
    }
  } catch (error) {
    if (error.message) {
      throw error;
    }
    console.error('❌ Error de conexión:', error);
    throw new Error("Error de conexión. Verifique su conexión a internet.");
  }
};

/**
 * Registrar un nuevo INVITADO
 * @param {Object} guestData - Datos del invitado desde el formulario
 * @returns {Promise<Object>} Resultado del registro
 */
export const registrarInvitado = async (guestData) => {
  const payload = {
    tipo_documento: guestData.tipoDocumento,
    identificacion: guestData.numeroDocumento,
    primer_nombre: guestData.primerNombre,
    segundo_nombre: guestData.segundoNombre || null,
    primer_apellido: guestData.primerApellido,
    segundo_apellido: guestData.segundoApellido || null,
    sexo: guestData.genero,
    identidad_sexual: guestData.orientacionSexual,
    fecha_nacimiento: guestData.fechaNacimiento,
    nacionalidad: guestData.paisNacimiento,
    pais_residencia: guestData.nacionalidad,
    departamento: guestData.departamentoResidencia,
    municipio: guestData.ciudadResidencia,
    ciudad_residencia: guestData.ciudadResidencia,
    direccion_residencia: sanitizarDireccion(guestData.direccionResidencia),
    telefono: guestData.telefono,
    correo: guestData.correo,
    rol: "Invitado",
    contraseña: guestData.contraseña,
    // Campos específicos del invitado
    ...(guestData.intitucionOrigen && { institucion_origen: guestData.intitucionOrigen }),
    ...(guestData.nombreEmpresa && { nombre_empresa: guestData.nombreEmpresa }),
    ...(guestData.sector && { id_sector: parseInt(guestData.sector) })
  };

  console.log('👤 Registrando INVITADO con credenciales:');
  console.log('📧 Correo:', payload.correo);
  console.log('🔐 Contraseña:', payload.contraseña ? '***' + payload.contraseña.slice(-3) : 'NO PROPORCIONADA');
  console.log('📦 Payload completo:', {
    ...payload,
    contraseña: '***'
  });
  console.log('🔗 Endpoint:', API_ENDPOINTS.REGISTRO_INVITADO);

  try {
    const response = await fetch(API_ENDPOINTS.REGISTRO_INVITADO, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    console.log('📡 Status:', response.status, response.statusText);

    if (response.status === 201 || response.ok) {
      const data = await response.json();
      console.log('✅ Registro de invitado exitoso:', data);
      return { success: true, data, message: data.message || 'Registro exitoso' };
    } else {
      await handleErrorResponse(response);
    }
  } catch (error) {
    if (error.message) {
      throw error;
    }
    console.error('❌ Error de conexión:', error);
    throw new Error("Error de conexión. Verifique su conexión a internet.");
  }
};

/**
 * Validar datos del formulario - ESTUDIANTE
 * @param {Object} formData - Datos del formulario
 * @returns {Object} {valido: boolean, errores: string[]}
 */
export const validarDatosEstudiante = (formData) => {
  const errores = [];

  // Validar usuario base
  if (!formData.tipo_documento) errores.push('Tipo de documento es requerido');
  if (!formData.identificacion) errores.push('Identificación es requerida');
  if (!formData.primerNombre || formData.primerNombre.trim().length < 2) errores.push('Nombre es requerido (mínimo 2 caracteres)');
  if (!formData.primerApellido || formData.primerApellido.trim().length < 2) errores.push('Apellido es requerido (mínimo 2 caracteres)');
  if (!formData.genero) errores.push('Género es requerido');
  if (!formData.orientacionSexual) errores.push('Orientación sexual es requerida');
  if (!formData.fechaNacimiento) errores.push('Fecha de nacimiento es requerida');
  if (!formData.nacionalidad) errores.push('Nacionalidad es requerida');
  if (!formData.paisNacimiento) errores.push('País de residencia es requerido');
  if (!formData.departamentoResidencia) errores.push('Departamento es requerido');
  if (!formData.ciudadResidencia) errores.push('Ciudad de residencia es requerida');
  if (!formData.direccionResidencia) errores.push('Dirección de residencia es requerida');
  if (!formData.telefono) errores.push('Teléfono es requerido');
  
  // Validar correo
  if (!formData.correo) {
    errores.push('Correo es requerido');
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.correo)) {
    errores.push('Correo inválido');
  }
  
  // Validar contraseña
  if (!formData.contraseña) {
    errores.push('Contraseña es requerida');
  } else if (formData.contraseña.length < 8) {
    errores.push('La contraseña debe tener al menos 8 caracteres');
  }
  
  if (formData.contraseña !== formData.confirmarcontraseña) {
    errores.push('Las contraseñas no coinciden');
  }

  // Validar datos específicos de estudiante
  if (!formData.programa) errores.push('Programa es requerido');
  if (!formData.semestre) errores.push('Semestre es requerido');
  if (!formData.periodo) errores.push('Periodo académico es requerido');
  if (!formData.fechaIngreso) errores.push('Año de ingreso es requerido');

  return {
    valido: errores.length === 0,
    errores
  };
};

/**
 * Validar datos del formulario - EGRESADO
 * @param {Object} formData - Datos del formulario
 * @returns {Object} {valido: boolean, errores: string[]}
 */
export const validarDatosEgresado = (formData) => {
  const errores = [];

  // Validar usuario base
  if (!formData.tipo_documento) errores.push('Tipo de documento es requerido');
  if (!formData.identificacion) errores.push('Identificación es requerida');
  if (!formData.primerNombre || formData.primerNombre.trim().length < 2) errores.push('Nombre es requerido (mínimo 2 caracteres)');
  if (!formData.primerApellido || formData.primerApellido.trim().length < 2) errores.push('Apellido es requerido (mínimo 2 caracteres)');
  if (!formData.genero) errores.push('Género es requerido');
  if (!formData.orientacionSexual) errores.push('Orientación sexual es requerida');
  if (!formData.fechaNacimiento) errores.push('Fecha de nacimiento es requerida');
  if (!formData.nacionalidad) errores.push('Nacionalidad es requerida');
  if (!formData.paisNacimiento) errores.push('País de residencia es requerido');
  if (!formData.departamentoResidencia) errores.push('Departamento es requerido');
  if (!formData.ciudadResidencia) errores.push('Ciudad de residencia es requerida');
  if (!formData.direccionResidencia) errores.push('Dirección de residencia es requerida');
  if (!formData.telefono) errores.push('Teléfono es requerido');
  
  // Validar correo
  if (!formData.correo) {
    errores.push('Correo es requerido');
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.correo)) {
    errores.push('Correo inválido');
  }
  
  // Validar contraseña
  if (!formData.contraseña) {
    errores.push('Contraseña es requerida');
  } else if (formData.contraseña.length < 8) {
    errores.push('La contraseña debe tener al menos 8 caracteres');
  }
  
  if (formData.contraseña !== formData.confirmarcontraseña) {
    errores.push('Las contraseñas no coinciden');
  }

  // Validar datos específicos de egresado
  if (!formData.programa) errores.push('Programa académico es requerido');
  if (!formData.fechaFinalizacion) errores.push('Año de graduación es requerido');
  if (!formData.titulado) errores.push('Especifique si está titulado');
  if (formData.titulado === 'si' && !formData.tituloObtenido) {
    errores.push('Título obtenido es requerido si está titulado');
  }

  return {
    valido: errores.length === 0,
    errores
  };
};

/**
 * Validar datos del formulario - INVITADO
 * @param {Object} formData - Datos del formulario
 * @returns {Object} {valido: boolean, errores: string[]}
 */
export const validarDatosInvitado = (formData) => {
  const errores = [];

  // Validar usuario base
  if (!formData.tipo_documento) errores.push('Tipo de documento es requerido');
  if (!formData.identificacion) errores.push('Identificación es requerida');
  if (!formData.primerNombre || formData.primerNombre.trim().length < 2) errores.push('Nombre es requerido (mínimo 2 caracteres)');
  if (!formData.primerApellido || formData.primerApellido.trim().length < 2) errores.push('Apellido es requerido (mínimo 2 caracteres)');
  if (!formData.genero) errores.push('Género es requerido');
  if (!formData.orientacionSexual) errores.push('Orientación sexual es requerida');
  if (!formData.fechaNacimiento) errores.push('Fecha de nacimiento es requerida');
  if (!formData.nacionalidad) errores.push('Nacionalidad es requerida');
  if (!formData.paisNacimiento) errores.push('País de residencia es requerido');
  if (!formData.departamentoResidencia) errores.push('Departamento es requerido');
  if (!formData.ciudadResidencia) errores.push('Ciudad de residencia es requerida');
  if (!formData.direccionResidencia) errores.push('Dirección de residencia es requerida');
  if (!formData.telefono) errores.push('Teléfono es requerido');
  
  // Validar correo
  if (!formData.correo) {
    errores.push('Correo es requerido');
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.correo)) {
    errores.push('Correo inválido');
  }
  
  // Validar contraseña
  if (!formData.contraseña) {
    errores.push('Contraseña es requerida');
  } else if (formData.contraseña.length < 8) {
    errores.push('La contraseña debe tener al menos 8 caracteres');
  }
  
  if (formData.contraseña !== formData.confirmarcontraseña) {
    errores.push('Las contraseñas no coinciden');
  }

  // Validar datos específicos de invitado
  if (!formData.sector && !formData.nombreEmpresa && !formData.institucionOrigen) {
    errores.push('Se requiere al menos una de: Sector, Empresa o Institución');
  }

  return {
    valido: errores.length === 0,
    errores
  };
};

/**
 * Validar datos del registro (genérica)
 * @param {Object} formData - Datos del formulario
 * @returns {Object} {valido: boolean, errores: string[]}
 */
export const validarDatosRegistro = (formData) => {
  const errores = [];

  // Validar usuario base
  if (!formData.tipo_documento) errores.push('Tipo de documento es requerido');
  if (!formData.identificacion) errores.push('Identificación es requerida');
  if (!formData.nombres || formData.nombres.trim().length < 2) errores.push('Nombres es requerido (mínimo 2 caracteres)');
  if (!formData.apellidos || formData.apellidos.trim().length < 2) errores.push('Apellidos es requerido (mínimo 2 caracteres)');
  if (!formData.sexo) errores.push('Sexo es requerido');
  if (!formData.identidad_sexual) errores.push('Identidad sexual es requerida');
  if (!formData.fecha_nacimiento) errores.push('Fecha de nacimiento es requerida');
  if (!formData.nacionalidad) errores.push('Nacionalidad es requerida');
  if (!formData.pais_residencia) errores.push('País de residencia es requerido');
  if (!formData.departamento) errores.push('Departamento es requerido');
  if (!formData.municipio) errores.push('Municipio es requerido');
  if (!formData.ciudad_residencia) errores.push('Ciudad de residencia es requerida');
  if (!formData.direccion_residencia) errores.push('Dirección de residencia es requerida');
  if (!formData.telefono) errores.push('Teléfono es requerido');
  
  // Validar correo
  if (!formData.correo) {
    errores.push('Correo es requerido');
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.correo)) {
    errores.push('Correo inválido');
  }
  
  // Validar contraseña
  if (!formData.contraseña) {
    errores.push('Contraseña es requerida');
  } else if (formData.contraseña.length < 8) {
    errores.push('La contraseña debe tener al menos 8 caracteres');
  }
  
  if (formData.contraseña !== formData.confirmar_contraseña) {
    errores.push('Las contraseñas no coinciden');
  }

  return {
    valido: errores.length === 0,
    errores
  };
};
