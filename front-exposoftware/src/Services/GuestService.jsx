/**
 * GuestService.jsx
 * Servicio para gestionar operaciones de invitados
 */

const API_URL = 'https://z6gasdnp5zp6v6egg4kg3jsitu0ffcqu.lambda-url.us-east-1.on.aws';

/**
 * Obtiene headers con autenticación
 */
const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` })
  };
};

/**
 * Obtener perfil del invitado autenticado
 * Primero obtiene todos los invitados y busca el actual por correo
 */
export const obtenerMiPerfilInvitado = async () => {
  try {
    console.log('👤 Obteniendo perfil del invitado autenticado...');
    
    // Primero intentamos obtener información del usuario en localStorage
    const userData = localStorage.getItem('user');
    let userEmail = null;
    let guestId = null;
    
    if (userData) {
      try {
        const user = JSON.parse(userData);
        userEmail = user.correo || user.email;
        guestId = user.id_invitado;
        console.log('📧 Email del usuario:', userEmail);
        console.log('🆔 ID de invitado en localStorage:', guestId);
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
          guestId = authData.id_invitado;
        }
      } catch (e) {
        console.error('Error obteniendo /api/v1/auth/me:', e);
      }
    }
    
    // Si tenemos el ID directamente, usar el endpoint específico
    if (guestId) {
      console.log('📞 Usando ID directo:', guestId);
      return await obtenerPerfilInvitadoPorId(guestId);
    }
    
    // Si no tenemos ID pero tenemos email, buscar en la lista de todos los invitados
    if (!userEmail) {
      throw new Error('No se pudo obtener el email del invitado para buscar su perfil');
    }
    
    console.log('📞 Obteniendo lista de todos los invitados...');
    const response = await fetch(`${API_URL}/api/v1/invitados`, {
      method: 'GET',
      headers: getAuthHeaders()
    });

    console.log('📡 Respuesta - Status:', response.status);

    if (response.ok) {
      const data = await response.json();
      console.log('✅ Lista de invitados obtenida:', data);
      
      // La respuesta puede venir en data.data o data.invitados o directamente como array
      let invitados = data.data || data.invitados || data;
      
      // Si no es un array, puede ser un objeto con los invitados
      if (!Array.isArray(invitados)) {
        invitados = Object.values(data).find(val => Array.isArray(val)) || [];
      }
      
      console.log('📊 Total de invitados encontrados:', invitados.length);
      
      // Buscar el invitado por email (case-insensitive)
      const emailBuscado = userEmail.toLowerCase().trim();
      console.log('🔍 Buscando invitado con email:', emailBuscado);
      
      const miPerfil = invitados.find(invitado => {
        const emailInvitado = (invitado.correo || '').toLowerCase().trim();
        const match = emailInvitado === emailBuscado;
        if (match) {
          console.log('✅ ¡Invitado encontrado!', invitado);
        }
        return match;
      });
      
      if (!miPerfil) {
        console.error('❌ No se encontró ningún invitado con el email:', userEmail);
        console.log('📋 Emails disponibles:', invitados.map(i => i.correo));
        throw new Error('No se encontró el perfil del invitado. Es posible que no esté registrado correctamente.');
      }
      
      console.log('✅ Perfil del invitado encontrado:', miPerfil);
      
      // Guardar el id_invitado en localStorage para próximas consultas
      if (miPerfil.id_invitado) {
        const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
        currentUser.id_invitado = miPerfil.id_invitado;
        localStorage.setItem('user', JSON.stringify(currentUser));
        console.log('💾 ID de invitado guardado en localStorage:', miPerfil.id_invitado);
      }
      
      return procesarDatosInvitado(miPerfil);
    } else if (response.status === 401) {
      throw new Error('Sesión expirada. Por favor inicie sesión nuevamente.');
    } else if (response.status === 404) {
      throw new Error('No se encontraron invitados registrados');
    } else {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || errorData.detail || 'Error al obtener lista de invitados');
    }
  } catch (error) {
    console.error('❌ Error obteniendo perfil del invitado:', error);
    throw error;
  }
};

/**
 * Obtener perfil de un invitado específico por ID
 */
export const obtenerPerfilInvitadoPorId = async (guestId) => {
  try {
    console.log('📞 Obteniendo perfil del invitado con ID:', guestId);
    
    const response = await fetch(`${API_URL}/api/v1/invitados/${guestId}`, {
      method: 'GET',
      headers: getAuthHeaders()
    });

    console.log('📡 Respuesta - Status:', response.status);

    if (response.ok) {
      const data = await response.json();
      console.log('✅ Perfil del invitado obtenido:', data);
      
      // La respuesta puede venir en data.data o directamente
      const perfil = data.data || data;
      return procesarDatosInvitado(perfil);
    } else if (response.status === 401) {
      throw new Error('Sesión expirada. Por favor inicie sesión nuevamente.');
    } else if (response.status === 404) {
      throw new Error('Perfil de invitado no encontrado');
    } else {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || errorData.detail || 'Error al obtener perfil');
    }
  } catch (error) {
    console.error('❌ Error obteniendo perfil del invitado por ID:', error);
    throw error;
  }
};

/**
 * Actualizar perfil del invitado
 */
export const actualizarPerfilInvitado = async (guestId, datosInvitado) => {
  try {
    console.log('💾 Actualizando perfil del invitado...');
    console.log('Datos a enviar:', datosInvitado);
    
    const datosProcesados = prepararDatosParaBackend(datosInvitado);
    
    const response = await fetch(`${API_URL}/api/v1/invitados/${guestId}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(datosProcesados)
    });

    console.log('📡 Respuesta actualización - Status:', response.status);

    if (response.ok) {
      const data = await response.json();
      console.log('✅ Perfil actualizado exitosamente:', data);
      return procesarDatosInvitado(data.data || data);
    } else {
      const errorData = await response.json().catch(() => ({}));
      console.error('❌ Error en respuesta:', errorData);
      throw new Error(errorData.message || errorData.detail || 'Error al actualizar perfil');
    }
  } catch (error) {
    console.error('❌ Error actualizando perfil del invitado:', error);
    throw error;
  }
};

/**
 * Procesa los datos del invitado del backend al formato del frontend
 */
const procesarDatosInvitado = (invitado) => {
  console.log('🔄 Procesando datos del invitado:', invitado);
  
  return {
    // IDs
    id_invitado: invitado.id_invitado || '',
    id_usuario: invitado.id_usuario || '',
    id_sector: invitado.id_sector || '',
    
    // Información personal
    tipo_documento: invitado.tipo_documento || '',
    identificacion: invitado.identificacion || '',
    primer_nombre: invitado.primer_nombre || '',
    segundo_nombre: invitado.segundo_nombre || '',
    primer_apellido: invitado.primer_apellido || '',
    segundo_apellido: invitado.segundo_apellido || '',
    
    // Datos combinados para compatibilidad
    nombres: invitado.nombres || `${invitado.primer_nombre || ''} ${invitado.segundo_nombre || ''}`.trim(),
    apellidos: invitado.apellidos || `${invitado.primer_apellido || ''} ${invitado.segundo_apellido || ''}`.trim(),
    
    // Información demográfica
    sexo: invitado.sexo || invitado.genero || '',
    genero: invitado.genero || invitado.sexo || '',
    identidad_sexual: invitado.identidad_sexual || '',
    fecha_nacimiento: invitado.fecha_nacimiento || '',
    nacionalidad: invitado.nacionalidad || '',
    
    // Ubicación
    pais: invitado.pais || invitado.pais_residencia || '',
    pais_residencia: invitado.pais_residencia || invitado.pais || '',
    departamento: invitado.departamento || invitado.departamento_residencia || '',
    departamento_residencia: invitado.departamento_residencia || invitado.departamento || '',
    municipio: invitado.municipio || '',
    ciudad: invitado.ciudad || invitado.ciudad_residencia || '',
    ciudad_residencia: invitado.ciudad_residencia || invitado.ciudad || '',
    direccion_residencia: invitado.direccion_residencia || '',
    
    // Contacto
    telefono: invitado.telefono || '',
    correo: invitado.correo || invitado.email || '',
    email: invitado.email || invitado.correo || '',
    
    // Información de empresa
    nombre_empresa: invitado.nombre_empresa || '',
    
    // Rol
    rol: invitado.rol || 'Invitado'
  };
};

/**
 * Prepara los datos del frontend para enviar al backend
 */
const prepararDatosParaBackend = (datosInvitado) => {
  console.log('📦 Preparando datos para backend:', datosInvitado);
  
  // Estructura plana según el backend
  const payload = {
    tipo_documento: datosInvitado.tipo_documento,
    identificacion: datosInvitado.identificacion,
    primer_nombre: datosInvitado.primer_nombre,
    segundo_nombre: datosInvitado.segundo_nombre || '',
    primer_apellido: datosInvitado.primer_apellido,
    segundo_apellido: datosInvitado.segundo_apellido || '',
    sexo: datosInvitado.sexo || datosInvitado.genero,
    identidad_sexual: datosInvitado.identidad_sexual || '',
    fecha_nacimiento: datosInvitado.fecha_nacimiento,
    nacionalidad: datosInvitado.nacionalidad,
    pais_residencia: datosInvitado.pais_residencia || datosInvitado.pais,
    departamento: datosInvitado.departamento || datosInvitado.departamento_residencia,
    municipio: datosInvitado.municipio,
    ciudad_residencia: datosInvitado.ciudad_residencia || datosInvitado.ciudad,
    direccion_residencia: datosInvitado.direccion_residencia,
    telefono: datosInvitado.telefono,
    correo: datosInvitado.correo || datosInvitado.email,
    id_sector: datosInvitado.id_sector,
    nombre_empresa: datosInvitado.nombre_empresa
  };
  
  console.log('✅ Payload preparado:', payload);
  return payload;
};

/**
 * Obtener todos los proyectos disponibles
 */
export const obtenerTodosLosProyectos = async () => {
  try {
    console.log('📚 Obteniendo todos los proyectos...');
    
    const response = await fetch(`${API_URL}/api/v1/proyectos`, {
      method: 'GET',
      headers: getAuthHeaders()
    });

    console.log('📡 Respuesta proyectos - Status:', response.status);

    if (response.ok) {
      const data = await response.json();
      console.log('✅ Proyectos obtenidos:', data);
      
      // La respuesta puede venir en diferentes formatos
      let proyectos = data.data || data.proyectos || data;
      
      if (!Array.isArray(proyectos)) {
        proyectos = Object.values(data).find(val => Array.isArray(val)) || [];
      }
      
      console.log('📊 Total de proyectos:', proyectos.length);
      return proyectos;
    } else if (response.status === 401) {
      throw new Error('Sesión expirada. Por favor inicie sesión nuevamente.');
    } else if (response.status === 404) {
      return [];
    } else {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || errorData.detail || 'Error al obtener proyectos');
    }
  } catch (error) {
    console.error('❌ Error obteniendo proyectos:', error);
    throw error;
  }
};

export default {
  obtenerMiPerfilInvitado,
  obtenerPerfilInvitadoPorId,
  actualizarPerfilInvitado,
  obtenerTodosLosProyectos
};
