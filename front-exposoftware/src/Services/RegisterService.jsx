import { API_ENDPOINTS } from "../utils/constants";

/**
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
      rol: "Estudiante", // Debe ser con mayúscula inicial
      contraseña: studentData.contraseña
    },
    codigo_programa: studentData.codigo_programa,
    semestre: parseInt(studentData.semestre),
    periodo: parseInt(studentData.periodo),
    anio_ingreso: parseInt(studentData.anio_ingreso)
  };

  console.log('📤 Registrando estudiante:', {
    ...payload,
    usuario: { ...payload.usuario, contraseña: '***' } // Ocultar contraseña en logs
  });
  console.log('🔗 Endpoint:', API_ENDPOINTS.REGISTRO_ESTUDIANTE);
  console.log('📦 Payload completo (JSON):', JSON.stringify(payload, null, 2));

  try {
    const response = await fetch(API_ENDPOINTS.REGISTRO_ESTUDIANTE, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(payload)
    });

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
 * Validar datos del formulario
 * @param {Object} formData - Datos del formulario
 * @returns {Object} {valido: boolean, errores: string[]}
 */
export const validarDatosRegistro = (formData) => {
  const errores = [];

  // Validar usuario
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

  // Validar datos de estudiante
  if (!formData.codigo_programa) errores.push('Código de programa es requerido');
  if (!formData.semestre) errores.push('Semestre es requerido');
  if (!formData.periodo) errores.push('Periodo académico es requerido');
  if (!formData.anio_ingreso) errores.push('Año de ingreso es requerido');

  return {
    valido: errores.length === 0,
    errores
  };
};
