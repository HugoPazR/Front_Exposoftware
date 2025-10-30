import { API_ENDPOINTS } from "../utils/constants";
import * as AuthService from "./AuthService";

/**
 * Servicio para gestionar el perfil del estudiante autenticado
 */

/**
 * Obtener perfil del estudiante actual
 * @returns {Promise<Object>} Datos completos del estudiante y usuario
 */
export const obtenerMiPerfil = async () => {
  console.log('👤 Obteniendo perfil del estudiante...');
  console.log('🔗 Endpoint:', API_ENDPOINTS.MI_PERFIL_ESTUDIANTE);

  try {
    const response = await fetch(API_ENDPOINTS.MI_PERFIL_ESTUDIANTE, {
      method: 'GET',
      headers: AuthService.getAuthHeaders()
    });

    console.log('📡 Respuesta - Status:', response.status, response.statusText);

    if (response.ok) {
      const data = await response.json();
      console.log('✅ Perfil obtenido exitosamente:', data);
      
      // La respuesta tiene formato: { status, message, data, code }
      if (data.data) {
        return {
          success: true,
          data: data.data,
          message: data.message || 'Perfil obtenido correctamente'
        };
      }
      
      return {
        success: true,
        data: data,
        message: 'Perfil obtenido correctamente'
      };
    } else if (response.status === 401) {
      console.error('❌ No autorizado - Token inválido o expirado');
      throw new Error('Sesión expirada. Por favor inicie sesión nuevamente.');
    } else if (response.status === 404) {
      console.error('❌ Perfil no encontrado');
      throw new Error('No se encontró el perfil del estudiante.');
    } else {
      const errorData = await response.json().catch(() => ({}));
      console.error('❌ Error al obtener perfil:', errorData);
      throw new Error(errorData.message || 'Error al obtener el perfil');
    }
  } catch (error) {
    if (error.message) {
      throw error;
    }
    console.error('❌ Error de conexión:', error);
    throw new Error('Error de conexión. Verifique su conexión a internet.');
  }
};

/**
 * Actualizar perfil del estudiante actual
 * @param {Object} datosActualizados - Datos a actualizar
 * @param {string} datosActualizados.codigo_programa - Código del programa (opcional)
 * @returns {Promise<Object>} Datos actualizados del estudiante
 */
export const actualizarMiPerfil = async (datosActualizados) => {
  console.log('✏️ Actualizando perfil del estudiante...');
  console.log('📦 Datos a actualizar:', datosActualizados);
  console.log('🔗 Endpoint:', API_ENDPOINTS.MI_PERFIL_ESTUDIANTE);

  try {
    const response = await fetch(API_ENDPOINTS.MI_PERFIL_ESTUDIANTE, {
      method: 'PUT',
      headers: AuthService.getAuthHeaders(),
      body: JSON.stringify(datosActualizados)
    });

    console.log('📡 Respuesta - Status:', response.status, response.statusText);

    if (response.ok) {
      const data = await response.json();
      console.log('✅ Perfil actualizado exitosamente:', data);
      
      if (data.data) {
        return {
          success: true,
          data: data.data,
          message: data.message || 'Perfil actualizado correctamente'
        };
      }
      
      return {
        success: true,
        data: data,
        message: 'Perfil actualizado correctamente'
      };
    } else if (response.status === 400) {
      const errorData = await response.json().catch(() => ({}));
      console.error('❌ Datos incorrectos:', errorData);
      throw new Error(errorData.message || 'Datos incorrectos para actualizar');
    } else if (response.status === 401) {
      console.error('❌ No autorizado - Token inválido o expirado');
      throw new Error('Sesión expirada. Por favor inicie sesión nuevamente.');
    } else if (response.status === 404) {
      console.error('❌ Perfil no encontrado');
      throw new Error('No se encontró el perfil del estudiante.');
    } else if (response.status === 422) {
      const errorData = await response.json().catch(() => ({}));
      console.error('❌ Error de validación:', errorData);
      
      if (errorData.errors && Array.isArray(errorData.errors)) {
        const errorMessages = errorData.errors.map(err => 
          `• ${err.field}: ${err.message}`
        ).join('\n');
        throw new Error('Errores de validación:\n' + errorMessages);
      }
      
      throw new Error(errorData.message || 'Datos no válidos para actualizar');
    } else {
      const errorData = await response.json().catch(() => ({}));
      console.error('❌ Error al actualizar perfil:', errorData);
      throw new Error(errorData.message || 'Error al actualizar el perfil');
    }
  } catch (error) {
    if (error.message) {
      throw error;
    }
    console.error('❌ Error de conexión:', error);
    throw new Error('Error de conexión. Verifique su conexión a internet.');
  }
};

/**
 * Extraer información del perfil para mostrar en el dashboard
 * @param {Object} perfil - Datos completos del perfil (puede venir anidado)
 * @returns {Object} Información procesada del perfil
 */
export const procesarDatosPerfil = (perfil) => {
  if (!perfil) return null;

  console.log('🔄 Procesando datos del perfil:', perfil);

  // El perfil viene con estructura: { id, codigo_programa, semestre, usuario: {...} }
  // Extraer datos del usuario (vienen en perfil.usuario)
  const usuario = perfil.usuario || perfil;
  
  // Los datos del estudiante están en el nivel raíz del perfil
  const estudiante = perfil;
  
  const datosProcessados = {
    // Datos de usuario (desde perfil.usuario)
    id_usuario: usuario.id || usuario.id_usuario,
    identificacion: usuario.identificacion || '',
    nombres: usuario.nombres || '',
    apellidos: usuario.apellidos || '',
    nombre_completo: `${usuario.nombres || ''} ${usuario.apellidos || ''}`.trim(),
    correo: usuario.correo || '',
    telefono: usuario.telefono || '',
    rol: usuario.rol || 'Estudiante',
    
    // Datos personales (desde perfil.usuario)
    tipo_documento: usuario.tipo_documento || '',
    sexo: usuario.genero || usuario.sexo || '',
    genero: usuario.genero || usuario.sexo || '',
    identidad_sexual: usuario.identidad_sexual || '',
    fecha_nacimiento: usuario.fecha_nacimiento || '',
    nacionalidad: usuario.nacionalidad || '',
    pais_residencia: usuario.pais_residencia || '',
    departamento: usuario.departamento || '',
    municipio: usuario.municipio || '',
    ciudad_residencia: usuario.ciudad_residencia || '',
    direccion_residencia: usuario.direccion_residencia || '',
    
    // Datos de estudiante (desde nivel raíz del perfil)
    id_estudiante: estudiante.id || estudiante.id_estudiante,
    codigo_programa: estudiante.codigo_programa || '',
    semestre: estudiante.semestre || null,
    anio_ingreso: estudiante.anio_ingreso || null,
    periodo: estudiante.periodo || null,
    activo: usuario.activo !== undefined ? usuario.activo : true,
    
    // Metadata
    fecha_creacion: usuario.fecha_creacion || estudiante.fecha_creacion || null,
    fecha_actualizacion: usuario.fecha_actualizacion || estudiante.fecha_actualizacion || null,
    
    // Iniciales para avatar
    iniciales: getIniciales(usuario.nombres, usuario.apellidos)
  };
  
  console.log('✅ Datos procesados:', datosProcessados);
  return datosProcessados;
};

/**
 * Obtener iniciales de nombres y apellidos
 * @param {string} nombres 
 * @param {string} apellidos 
 * @returns {string} Iniciales (ej: "JD" para Juan Pérez)
 */
const getIniciales = (nombres, apellidos) => {
  const primerosNombres = (nombres || '').split(' ')[0] || '';
  const primerosApellidos = (apellidos || '').split(' ')[0] || '';
  return `${primerosNombres.charAt(0)}${primerosApellidos.charAt(0)}`.toUpperCase();
};
