import { API_ENDPOINTS } from "../utils/constants";

/**
<<<<<<< HEAD
 * Servicio para el registro de estudiantes
 * Endpoint público - NO requiere autenticación
 */

/**
 * Registrar un nuevo estudiante con su usuario
 * @param {Object} studentData - Datos del estudiante y usuario
 * @returns {Promise<Object>} Resultado del registro
 */
export const registrarEstudiante = async (studentData) => {
  // Sanitizar dirección: remover caracteres no permitidos (como ñ, tildes, etc.)
  const sanitizarDireccion = (direccion) => {
    return direccion
      .normalize("NFD") // Descomponer caracteres acentuados
      .replace(/[\u0300-\u036f]/g, "") // Remover marcas de acento
      .replace(/ñ/gi, "n") // Reemplazar ñ por n
      .replace(/[^A-Za-z0-9#\-\s,]/g, ""); // Solo permitir caracteres válidos
  };

  // Estructura exacta que espera el backend
=======
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
 * @param {Object} studentData - Datos del estudiante
 * @returns {Promise<Object>} Resultado del registro
 */
export const registrarEstudiante = async (studentData) => {
>>>>>>> 8f3ec67 (Administrador casi listo y proyecto al 70 %)
  const payload = {
    usuario: {
      tipo_documento: studentData.tipo_documento,
      identificacion: studentData.identificacion,
      nombres: studentData.nombres,
      apellidos: studentData.apellidos,
      sexo: studentData.sexo,
      identidad_sexual: studentData.identidad_sexual,
      fecha_nacimiento: studentData.fecha_nacimiento,
      nacionalidad: studentData.nacionalidad,
      pais_residencia: studentData.pais_residencia,
      departamento: studentData.departamento,
      municipio: studentData.municipio,
      ciudad_residencia: studentData.ciudad_residencia,
      direccion_residencia: sanitizarDireccion(studentData.direccion_residencia),
      telefono: studentData.telefono,
      correo: studentData.correo,
<<<<<<< HEAD
      rol: "Estudiante", // Debe ser con mayúscula inicial
=======
      rol: "Estudiante",
>>>>>>> 8f3ec67 (Administrador casi listo y proyecto al 70 %)
      contraseña: studentData.contraseña
    },
    codigo_programa: studentData.codigo_programa,
    semestre: parseInt(studentData.semestre),
    periodo: parseInt(studentData.periodo),
    anio_ingreso: parseInt(studentData.anio_ingreso)
  };

<<<<<<< HEAD
  console.log('📤 Registrando estudiante:', {
    ...payload,
    usuario: { ...payload.usuario, contraseña: '***' } // Ocultar contraseña en logs
  });
  console.log('🔗 Endpoint:', API_ENDPOINTS.REGISTRO_ESTUDIANTE);
  console.log('📦 Payload completo (JSON):', JSON.stringify(payload, null, 2));
=======
  console.log('� Registrando ESTUDIANTE:', {
    ...payload,
    usuario: { ...payload.usuario, contraseña: '***' }
  });
  console.log('🔗 Endpoint:', API_ENDPOINTS.REGISTRO_ESTUDIANTE);
>>>>>>> 8f3ec67 (Administrador casi listo y proyecto al 70 %)

  try {
    const response = await fetch(API_ENDPOINTS.REGISTRO_ESTUDIANTE, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(payload)
    });

<<<<<<< HEAD
    console.log('📡 Respuesta del servidor - Status:', response.status, response.statusText);

    if (response.status === 201 || response.ok) {
      const data = await response.json();
      console.log('✅ Registro exitoso:', data);
      return { success: true, data, message: data.message || 'Registro exitoso' };
    } else if (response.status === 400) {
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
      
      // El backend puede devolver "errors" o "detail"
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
=======
    console.log('📡 Status:', response.status, response.statusText);

    if (response.status === 201 || response.ok) {
      const data = await response.json();
      console.log('✅ Registro de estudiante exitoso:', data);
      return { success: true, data, message: data.message || 'Registro exitoso' };
    } else {
      await handleErrorResponse(response);
>>>>>>> 8f3ec67 (Administrador casi listo y proyecto al 70 %)
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
<<<<<<< HEAD
 * Validar datos del formulario
=======
 * Registrar un nuevo EGRESADO
 * @param {Object} graduateData - Datos del egresado
 * @returns {Promise<Object>} Resultado del registro
 */
export const registrarEgresado = async (graduateData) => {
  const payload = {
    tipo_documento: graduateData.tipo_documento,
    identificacion: graduateData.identificacion,
    nombres: graduateData.nombres,
    apellidos: graduateData.apellidos,
    sexo: graduateData.sexo,
    identidad_sexual: graduateData.identidad_sexual,
    fecha_nacimiento: graduateData.fecha_nacimiento,
    nacionalidad: graduateData.nacionalidad,
    pais_residencia: graduateData.pais_residencia,
    departamento: graduateData.departamento,
    municipio: graduateData.municipio,
    ciudad_residencia: graduateData.ciudad_residencia,
    direccion_residencia: sanitizarDireccion(graduateData.direccion_residencia),
    telefono: graduateData.telefono,
    correo: graduateData.correo,
    rol: "Egresado",
    contraseña: graduateData.contraseña,
    // Campos específicos del egresado
    ...(graduateData.codigo_programa && { codigo_programa: graduateData.codigo_programa }),
    ...(graduateData.programa_academico && { programa_academico: graduateData.programa_academico }),
    ...(graduateData.año_graduacion && { año_graduacion: parseInt(graduateData.año_graduacion) }),
    ...(graduateData.titulo_obtenido && { titulo_obtenido: graduateData.titulo_obtenido }),
    ...(graduateData.titulado !== undefined && { titulado: graduateData.titulado })
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
 * @param {Object} guestData - Datos del invitado
 * @returns {Promise<Object>} Resultado del registro
 */
export const registrarInvitado = async (guestData) => {
  const payload = {
    tipo_documento: guestData.tipo_documento,
    identificacion: guestData.identificacion,
    nombres: guestData.nombres,
    apellidos: guestData.apellidos,
    sexo: guestData.sexo,
    identidad_sexual: guestData.identidad_sexual,
    fecha_nacimiento: guestData.fecha_nacimiento,
    nacionalidad: guestData.nacionalidad,
    pais_residencia: guestData.pais_residencia,
    departamento: guestData.departamento,
    municipio: guestData.municipio,
    ciudad_residencia: guestData.ciudad_residencia,
    direccion_residencia: sanitizarDireccion(guestData.direccion_residencia),
    telefono: guestData.telefono,
    correo: guestData.correo,
    rol: "Invitado",
    contraseña: guestData.contraseña,
    // Campos específicos del invitado
    ...(guestData.institucion_origen && { institucion_origen: guestData.institucion_origen }),
    ...(guestData.nombre_empresa && { nombre_empresa: guestData.nombre_empresa }),
    ...(guestData.id_sector && { id_sector: guestData.id_sector })
  };

  console.log('👤 Registrando INVITADO:', {
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
>>>>>>> 8f3ec67 (Administrador casi listo y proyecto al 70 %)
 * @param {Object} formData - Datos del formulario
 * @returns {Object} {valido: boolean, errores: string[]}
 */
export const validarDatosRegistro = (formData) => {
  const errores = [];

<<<<<<< HEAD
  // Validar usuario
=======
  // Validar usuario base
>>>>>>> 8f3ec67 (Administrador casi listo y proyecto al 70 %)
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

<<<<<<< HEAD
  // Validar datos de estudiante
  if (!formData.codigo_programa) errores.push('Código de programa es requerido');
  if (!formData.semestre) errores.push('Semestre es requerido');
  if (!formData.periodo) errores.push('Periodo académico es requerido');
  if (!formData.anio_ingreso) errores.push('Año de ingreso es requerido');

=======
>>>>>>> 8f3ec67 (Administrador casi listo y proyecto al 70 %)
  return {
    valido: errores.length === 0,
    errores
  };
};
