const API_URL = 'https://z6gasdnp5zp6v6egg4kg3jsitu0ffcqu.lambda-url.us-east-1.on.aws';

/**
 * Obtener token de autenticación
 */
const getAuthToken = () => {
  return localStorage.getItem('auth_token');
};

/**
 * Obtener headers de autenticación
 */
const getAuthHeaders = () => {
  const token = getAuthToken();
  return {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` })
  };
};

/**
 * Obtener perfil del egresado autenticado
 * Primero obtiene todos los egresados y busca el actual por correo
 */
export const obtenerMiPerfilEgresado = async () => {
  try {
    console.log('👨‍🎓 Obteniendo perfil del egresado autenticado...');
    
    // Primero intentamos obtener información del usuario en localStorage
    const userData = localStorage.getItem('user');
    let userEmail = null;
    let graduateId = null;
    
    if (userData) {
      try {
        const user = JSON.parse(userData);
        userEmail = user.correo || user.email;
        graduateId = user.id_egresado;
        console.log('📧 Email del usuario:', userEmail);
        console.log('🆔 ID de egresado en localStorage:', graduateId);
      } catch (e) {
        console.error('Error parseando userData:', e);
      }
    }
    
    // Si no tenemos email, intentamos obtenerlo desde /api/v1/auth/me
    if (!userEmail) {
      console.log('🔍 Obteniendo email desde /api/v1/auth/me...');
      try {
        const authResponse = await fetch(`${API_URL}/api/v1/auth/me`, {
          method: 'GET',
          headers: getAuthHeaders()
        });
        
        if (authResponse.ok) {
          const authData = await authResponse.json();
          console.log('✅ Datos de autenticación:', authData);
          userEmail = authData.correo || authData.email;
          graduateId = authData.id_egresado;
        }
      } catch (e) {
        console.error('Error obteniendo /api/v1/auth/me:', e);
      }
    }
    
    // Si tenemos el ID directamente, usar el endpoint específico
    if (graduateId) {
      console.log('📞 Usando ID directo:', graduateId);
      return await obtenerPerfilEgresadoPorId(graduateId);
    }
    
    // Si no tenemos ID pero tenemos email, buscar en la lista de todos los egresados
    if (!userEmail) {
      throw new Error('No se pudo obtener el email del egresado para buscar su perfil');
    }
    
    console.log('📞 Obteniendo lista de todos los egresados...');
    const response = await fetch(`${API_URL}/api/v1/egresados`, {
      method: 'GET',
      headers: getAuthHeaders()
    });

    console.log('📡 Respuesta - Status:', response.status);

    if (response.ok) {
      const data = await response.json();
      console.log('✅ Lista de egresados obtenida:', data);
      
      // La respuesta puede venir en data.data o data.egresados o directamente como array
      let egresados = data.data || data.egresados || data;
      
      // Si no es un array, puede ser un objeto con los egresados
      if (!Array.isArray(egresados)) {
        egresados = Object.values(data).find(val => Array.isArray(val)) || [];
      }
      
      console.log('📊 Total de egresados encontrados:', egresados.length);
      
      // Buscar el egresado por email (case-insensitive)
      const emailBuscado = userEmail.toLowerCase().trim();
      console.log('🔍 Buscando egresado con email:', emailBuscado);
      
      const miPerfil = egresados.find(egresado => {
        const emailEgresado = (egresado.correo || '').toLowerCase().trim();
        const match = emailEgresado === emailBuscado;
        if (match) {
          console.log('✅ ¡Egresado encontrado!', egresado);
        }
        return match;
      });
      
      if (!miPerfil) {
        console.error('❌ No se encontró ningún egresado con el email:', userEmail);
        console.log('📋 Emails disponibles:', egresados.map(e => e.correo));
        throw new Error('No se encontró el perfil del egresado. Es posible que no esté registrado correctamente.');
      }
      
      console.log('✅ Perfil del egresado encontrado:', miPerfil);
      
      // Guardar el id_egresado en localStorage para próximas consultas
      if (miPerfil.id_egresado) {
        const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
        currentUser.id_egresado = miPerfil.id_egresado;
        localStorage.setItem('user', JSON.stringify(currentUser));
        console.log('💾 ID de egresado guardado en localStorage:', miPerfil.id_egresado);
      }
      
      return procesarDatosEgresado(miPerfil);
    } else if (response.status === 401) {
      throw new Error('Sesión expirada. Por favor inicie sesión nuevamente.');
    } else if (response.status === 404) {
      throw new Error('No se encontraron egresados registrados');
    } else {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || errorData.detail || 'Error al obtener lista de egresados');
    }
  } catch (error) {
    console.error('❌ Error obteniendo perfil del egresado:', error);
    throw error;
  }
};

/**
 * Obtener perfil de un egresado por ID
 * GET /api/v1/egresados/{graduate_id}
 */
export const obtenerPerfilEgresadoPorId = async (graduateId) => {
  try {
    console.log('👨‍🎓 Obteniendo perfil del egresado:', graduateId);
    
    const response = await fetch(`${API_URL}/api/v1/egresados/${graduateId}`, {
      method: 'GET',
      headers: getAuthHeaders()
    });

    console.log('📡 Respuesta - Status:', response.status);

    if (response.ok) {
      const data = await response.json();
      console.log('✅ Perfil del egresado obtenido:', data);
      
      const perfil = data.data || data;
      return procesarDatosEgresado(perfil);
    } else if (response.status === 401) {
      throw new Error('No autorizado');
    } else if (response.status === 404) {
      throw new Error('Egresado no encontrado');
    } else {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || errorData.detail || 'Error al obtener perfil');
    }
  } catch (error) {
    console.error('❌ Error obteniendo perfil del egresado:', error);
    throw error;
  }
};

/**
 * Actualizar perfil del egresado
 * PUT /api/v1/egresados/{graduate_id}
 */
export const actualizarPerfilEgresado = async (graduateId, datosActualizados) => {
  try {
    console.log('🔄 Actualizando perfil del egresado:', graduateId);
    console.log('📝 Datos a actualizar:', datosActualizados);
    
    const response = await fetch(`${API_URL}/api/v1/egresados/${graduateId}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(datosActualizados)
    });

    console.log('📡 Respuesta - Status:', response.status);

    if (response.ok) {
      const data = await response.json();
      console.log('✅ Perfil actualizado exitosamente:', data);
      
      const perfil = data.data || data;
      return procesarDatosEgresado(perfil);
    } else if (response.status === 401) {
      throw new Error('No autorizado');
    } else if (response.status === 404) {
      throw new Error('Egresado no encontrado');
    } else if (response.status === 422) {
      const errorData = await response.json();
      const errores = errorData.detail || [];
      const mensajesError = errores.map(err => `${err.loc?.join('.')}: ${err.msg}`).join(', ');
      throw new Error(`Datos inválidos: ${mensajesError}`);
    } else {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || errorData.detail || 'Error al actualizar perfil');
    }
  } catch (error) {
    console.error('❌ Error actualizando perfil del egresado:', error);
    throw error;
  }
};

/**
 * Procesar datos del egresado desde el backend
 * Transforma la estructura del backend a la estructura del frontend
 */
export const procesarDatosEgresado = (datosCrudos) => {
  if (!datosCrudos) {
    console.warn('⚠️ No hay datos del egresado para procesar');
    return {};
  }

  console.log('🔄 Procesando datos del egresado:', datosCrudos);

  // El backend puede devolver la estructura directa
  const egresado = datosCrudos;

  // Construir nombres completos
  const nombres = [egresado.primer_nombre, egresado.segundo_nombre]
    .filter(Boolean)
    .join(' ');
  
  const apellidos = [egresado.primer_apellido, egresado.segundo_apellido]
    .filter(Boolean)
    .join(' ');

  const nombreCompleto = [nombres, apellidos]
    .filter(Boolean)
    .join(' ');

  const datosProcesados = {
    // IDs
    id_egresado: egresado.id_egresado || '',
    id_usuario: egresado.id_usuario || '',
    
    // Datos académicos del egresado
    codigo_programa: egresado.codigo_programa || '',
    anio_graduacion: egresado.año_graduacion || egresado.anio_graduacion || new Date().getFullYear(),
    modalidad_grado: egresado.modalidad_grado || '',
    programa_academico: egresado.programa_academico || '',
    titulo_obtenido: egresado.titulo_obtenido || '',
    titulado: egresado.titulado !== undefined ? egresado.titulado : false,
    
    // Datos personales
    tipo_documento: egresado.tipo_documento || 'CC',
    identificacion: egresado.identificacion || '',
    nombres: nombres || '',
    apellidos: apellidos || '',
    nombre_completo: nombreCompleto || '',
    primer_nombre: egresado.primer_nombre || '',
    segundo_nombre: egresado.segundo_nombre || '',
    primer_apellido: egresado.primer_apellido || '',
    segundo_apellido: egresado.segundo_apellido || '',
    
    // Información de contacto
    correo: egresado.correo || '',
    telefono: egresado.telefono || '',
    
    // Información demográfica
    sexo: egresado.sexo || '',
    identidad_sexual: egresado.identidad_sexual || '',
    fecha_nacimiento: egresado.fecha_nacimiento || '',
    nacionalidad: egresado.nacionalidad || 'CO',
    
    // Ubicación
    pais_residencia: egresado.pais_residencia || 'CO',
    departamento: egresado.departamento || '',
    municipio: egresado.municipio || '',
    ciudad_residencia: egresado.ciudad_residencia || '',
    direccion_residencia: egresado.direccion_residencia || '',
    
    // Sistema
    rol: egresado.rol || 'Egresado',
    activo: egresado.activo !== undefined ? egresado.activo : true,
    created_at: egresado.created_at || '',
    updated_at: egresado.updated_at || ''
  };

  console.log('✅ Datos procesados del egresado:', datosProcesados);
  return datosProcesados;
};

/**
 * Preparar datos para enviar al backend
 * Transforma la estructura del frontend a la estructura del backend
 */
export const prepararDatosParaBackend = (datosFormulario) => {
  console.log('📦 Preparando datos para enviar al backend:', datosFormulario);

  const payload = {
    // Datos personales
    tipo_documento: datosFormulario.tipo_documento || 'CC',
    identificacion: datosFormulario.identificacion || '',
    primer_nombre: datosFormulario.primer_nombre || '',
    segundo_nombre: datosFormulario.segundo_nombre || '',
    primer_apellido: datosFormulario.primer_apellido || '',
    segundo_apellido: datosFormulario.segundo_apellido || '',
    
    // Información demográfica
    sexo: datosFormulario.sexo || '',
    identidad_sexual: datosFormulario.identidad_sexual || '',
    fecha_nacimiento: datosFormulario.fecha_nacimiento || '',
    nacionalidad: datosFormulario.nacionalidad || 'Colombiana',
    
    // Ubicación
    pais_residencia: datosFormulario.pais_residencia || 'Colombia',
    departamento: datosFormulario.departamento || '',
    municipio: datosFormulario.municipio || '',
    ciudad_residencia: datosFormulario.ciudad_residencia || datosFormulario.municipio || '',
    direccion_residencia: datosFormulario.direccion_residencia || '',
    
    // Contacto
    telefono: datosFormulario.telefono || '',
    correo: datosFormulario.correo || '',
    
    // Datos académicos
    codigo_programa: datosFormulario.codigo_programa || '',
    programa_academico: datosFormulario.programa_academico || '',
    año_graduacion: parseInt(datosFormulario.anio_graduacion) || new Date().getFullYear(),
    titulo_obtenido: datosFormulario.titulo_obtenido || '',
    titulado: datosFormulario.titulado !== undefined ? datosFormulario.titulado : true,
    
    // Sistema
    rol: 'Egresado'
  };

  // Si hay contraseña (para actualizaciones), incluirla
  if (datosFormulario.contraseña) {
    payload.contraseña = datosFormulario.contraseña;
  }

  console.log('✅ Payload preparado:', payload);
  return payload;
};

export default {
  obtenerMiPerfilEgresado,
  obtenerPerfilEgresadoPorId,
  actualizarPerfilEgresado,
  procesarDatosEgresado,
  prepararDatosParaBackend
};
