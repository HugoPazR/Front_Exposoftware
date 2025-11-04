import { API_BASE_URL } from "../utils/constants";
import * as AuthService from "./AuthService";

/**
 * Obtener informacion del docente autenticado desde /api/v1/auth/me
 * Este endpoint devuelve toda la informacion del usuario autenticado
 * @returns {Promise<Object>} Datos completos del docente autenticado
 */
export const getTeacherProfile = async () => {
  try {
    console.log('Cargando perfil del docente autenticado...');
    const headers = AuthService.getAuthHeaders();
    
    if (!headers.Authorization) {
      throw new Error("No hay sesion activa - token no encontrado");
    }

    const url = `${API_BASE_URL}/api/v1/auth/me`;
    console.log('URL:', url);
    
    const response = await fetch(url, {
      method: 'GET',
      headers: headers
    });

    console.log('Respuesta - Status:', response.status);

    if (response.ok) {
      const result = await response.json();
      const docente = result.data || result;
      
      console.log('Informacion del docente obtenida:', docente);
      console.log('Estructura completa:', JSON.stringify(docente, null, 2));
      
      return docente;
    } else if (response.status === 404) {
      throw new Error("Perfil de docente no encontrado");
    } else if (response.status === 401) {
      throw new Error("No autorizado. Por favor, inicie sesion nuevamente");
    } else {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.detail || errorData.message || `Error al cargar perfil: ${response.statusText}`);
    }
  } catch (error) {
    console.error('Error al cargar perfil del docente:', error);
    throw error;
  }
};

/**
 * Obtener informacion detallada del docente por id_docente
 * GET /api/v1/teachers/{teacher_id}/profile
 * @param {string} teacherId - ID del docente
 * @returns {Promise<Object>} Perfil detallado del docente
 */
export const getTeacherProfileById = async (teacherId) => {
  try {
    console.log('Obteniendo perfil del docente:', teacherId);
    const headers = AuthService.getAuthHeaders();
    
    const url = `${API_BASE_URL}/api/v1/teachers/${teacherId}/profile`;
    console.log('URL:', url);
    
    const response = await fetch(url, {
      method: 'GET',
      headers: headers
    });

    if (response.ok) {
      const result = await response.json();
      const perfil = result.data || result;
      console.log('Perfil del docente:', perfil);
      return perfil;
    } else if (response.status === 404) {
      throw new Error("Docente no encontrado");
    } else {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.detail || errorData.message || 'Error al obtener perfil');
    }
  } catch (error) {
    console.error('Error al obtener perfil del docente:', error);
    throw error;
  }
};

/**
 * Obtener perfil completo del docente desde admin endpoint
 * GET /api/v1/admin/profesores/{teacher_id}
 * @param {string} teacherId - ID del docente (puede ser id_usuario de Firebase)
 * @returns {Promise<Object>} Perfil completo del docente con id_docente
 */
export const getTeacherProfileByAdmin = async (teacherId) => {
  try {
    console.log('📚 Obteniendo perfil completo del docente desde admin:', teacherId);
    const headers = AuthService.getAuthHeaders();
    
    const url = `${API_BASE_URL}/api/v1/admin/profesores/${teacherId}`;
    console.log('🔗 URL:', url);
    
    const response = await fetch(url, {
      method: 'GET',
      headers: headers
    });

    console.log('📡 Respuesta - Status:', response.status);

    if (response.ok) {
      const result = await response.json();
      console.log('📦 Respuesta completa:', result);
      
      const perfil = result.data || result;
      console.log('✅ Perfil del docente obtenido:', perfil);
      console.log('🔍 id_docente:', perfil.id_docente);
      console.log('🔍 id_usuario:', perfil.id_usuario);
      
      return perfil;
    } else if (response.status === 404) {
      throw new Error("Docente no encontrado en el sistema");
    } else if (response.status === 401) {
      throw new Error("No autorizado para acceder a esta información");
    } else {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.detail || errorData.message || 'Error al obtener perfil del docente');
    }
  } catch (error) {
    console.error('❌ Error al obtener perfil del docente desde admin:', error);
    throw error;
  }
};

/**
 * Obtener todas las materias asignadas al docente
 * GET /api/v1/teachers/{teacher_id}/subjects
 * @param {string} teacherId - ID del docente
 * @returns {Promise<Array>} Lista de materias del docente
 */
export const getTeacherSubjects = async (teacherId) => {
  try {
    console.log('Obteniendo materias del docente:', teacherId);
    const headers = AuthService.getAuthHeaders();
    
    const url = `${API_BASE_URL}/api/v1/teachers/${teacherId}/subjects`;
    console.log('URL:', url);
    
    const response = await fetch(url, {
      method: 'GET',
      headers: headers
    });

    if (response.ok) {
      const result = await response.json();
      const materias = result.data || result;
      console.log(`Materias obtenidas: ${materias.length}`);
      return materias;
    } else if (response.status === 404) {
      console.warn('No se encontraron materias para el docente');
      return [];
    } else {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.detail || errorData.message || 'Error al obtener materias');
    }
  } catch (error) {
    console.error('Error al obtener materias del docente:', error);
    throw error;
  }
};

/**
 * Obtener grupos de una materia especifica del docente
 * GET /api/v1/teachers/{teacher_id}/subjects/{subject_code}/groups
 * @param {string} teacherId - ID del docente
 * @param {string} subjectCode - Codigo de la materia
 * @returns {Promise<Array>} Lista de grupos de la materia
 */
export const getTeacherSubjectGroups = async (teacherId, subjectCode) => {
  try {
    console.log(`Obteniendo grupos de materia ${subjectCode} para docente ${teacherId}`);
    const headers = AuthService.getAuthHeaders();
    
    const url = `${API_BASE_URL}/api/v1/teachers/${teacherId}/subjects/${subjectCode}/groups`;
    console.log('URL:', url);
    
    const response = await fetch(url, {
      method: 'GET',
      headers: headers
    });

    if (response.ok) {
      const result = await response.json();
      const grupos = result.data || result;
      console.log(`Grupos obtenidos: ${grupos.length}`);
      return grupos;
    } else if (response.status === 404) {
      console.warn('No se encontraron grupos para esta materia');
      return [];
    } else {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.detail || errorData.message || 'Error al obtener grupos');
    }
  } catch (error) {
    console.error('Error al obtener grupos de la materia:', error);
    throw error;
  }
};

/**
 * Obtener todos los proyectos del docente
 * GET /api/v1/teachers/{teacher_id}/projects
 * @param {string} teacherId - ID del docente
 * @returns {Promise<Array>} Lista de proyectos del docente
 */
export const getTeacherProjects = async (teacherId) => {
  try {
    console.log('Obteniendo proyectos del docente:', teacherId);
    const headers = AuthService.getAuthHeaders();
    
    const url = `${API_BASE_URL}/api/v1/teachers/${teacherId}/projects`;
    console.log('URL:', url);
    
    const response = await fetch(url, {
      method: 'GET',
      headers: headers
    });

    if (response.ok) {
      const result = await response.json();
      const proyectos = result.data || result;
      console.log(`Proyectos obtenidos: ${proyectos.length}`);
      return proyectos;
    } else if (response.status === 404) {
      console.warn('No se encontraron proyectos para el docente');
      return [];
    } else {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.detail || errorData.message || 'Error al obtener proyectos');
    }
  } catch (error) {
    console.error('Error al obtener proyectos del docente:', error);
    throw error;
  }
};

/**
 * Obtener detalle de un proyecto especifico del docente
 * GET /api/v1/teachers/{teacher_id}/projects/{project_id}
 * @param {string} teacherId - ID del docente
 * @param {string} projectId - ID del proyecto
 * @returns {Promise<Object>} Detalle completo del proyecto
 */
export const getTeacherProjectDetail = async (teacherId, projectId) => {
  try {
    console.log(`Obteniendo detalle del proyecto ${projectId} para docente ${teacherId}`);
    const headers = AuthService.getAuthHeaders();
    
    const url = `${API_BASE_URL}/api/v1/teachers/${teacherId}/projects/${projectId}`;
    console.log('URL:', url);
    
    const response = await fetch(url, {
      method: 'GET',
      headers: headers
    });

    if (response.ok) {
      const result = await response.json();
      const proyecto = result.data || result;
      console.log('Detalle del proyecto obtenido:', proyecto);
      return proyecto;
    } else if (response.status === 404) {
      throw new Error("Proyecto no encontrado");
    } else {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.detail || errorData.message || 'Error al obtener detalle del proyecto');
    }
  } catch (error) {
    console.error('Error al obtener detalle del proyecto:', error);
    throw error;
  }
};

/**
 * Obtener todos los proyectos (endpoint general)
 * GET /api/v1/teachers/projects
 * @returns {Promise<Array>} Lista de todos los proyectos
 */
export const getAllProjects = async () => {
  try {
    console.log('Obteniendo todos los proyectos...');
    const headers = AuthService.getAuthHeaders();
    
    const url = `${API_BASE_URL}/api/v1/teachers/projects`;
    console.log('URL:', url);
    
    const response = await fetch(url, {
      method: 'GET',
      headers: headers
    });

    if (response.ok) {
      const result = await response.json();
      const proyectos = result.data || result;
      console.log(`Total de proyectos: ${proyectos.length}`);
      return proyectos;
    } else if (response.status === 404) {
      console.warn('No se encontraron proyectos');
      return [];
    } else {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.detail || errorData.message || 'Error al obtener proyectos');
    }
  } catch (error) {
    console.error('Error al obtener proyectos:', error);
    throw error;
  }
};

/**
 * Procesar datos del docente desde el backend
 * Convierte los datos anidados del backend al formato que espera el frontend
 * @param {Object} datosCrudos - Datos directos del backend
 * @returns {Object} Datos procesados para el formulario
 */
export const procesarDatosDocente = (datosCrudos) => {
  if (!datosCrudos) {
    console.warn('No hay datos crudos para procesar');
    return {};
  }

  console.log('Procesando datos del docente:', datosCrudos);

  const usuario = datosCrudos.usuario || {};
  
  const nombres = [usuario.primer_nombre, usuario.segundo_nombre]
    .filter(Boolean)
    .join(' ');
  
  const apellidos = [usuario.primer_apellido, usuario.segundo_apellido]
    .filter(Boolean)
    .join(' ');

  const datosProcesados = {
    id_docente: datosCrudos.id_docente || "",
    id_usuario: datosCrudos.id_usuario || "",
    categoria_docente: datosCrudos.categoria_docente || "Interno",
    codigo_programa: datosCrudos.codigo_programa || "",
    tipo_documento: usuario.tipo_documento || "CC",
    identificacion: usuario.identificacion || "",
    nombres: nombres || "",
    apellidos: apellidos || "",
    genero: usuario.sexo || usuario.genero || "",
    identidad_sexual: usuario.identidad_sexual || "",
    fecha_nacimiento: usuario.fecha_nacimiento || "",
    telefono: usuario.telefono || "",
    pais: usuario.pais_residencia || "CO",
    nacionalidad: usuario.nacionalidad || "CO",
    departamento_residencia: usuario.departamento_residencia || "",
    ciudad_residencia: usuario.ciudad_residencia || "",
    direccion_residencia: usuario.direccion_residencia || "",
    departamento: usuario.departamento_residencia || "",
    municipio: usuario.ciudad_residencia || "",
    ciudad: usuario.ciudad_residencia || "",
    correo: usuario.correo || "",
    anio_ingreso: new Date().getFullYear(),
    periodo: 1,
    rol: usuario.rol || "Docente"
  };

  console.log('Datos procesados:', datosProcesados);
  return datosProcesados;
};

/**
 * Actualizar perfil del docente
 * PUT /api/v1/teachers/{teacher_id}/profile
 * @param {string} identificacion - Identificacion del docente
 * @param {Object} datosActualizados - Datos a actualizar
 * @returns {Promise<Object>} Datos actualizados
 */
export const updateTeacherProfile = async (identificacion, datosActualizados) => {
  try {
    console.log('Actualizando perfil del docente:', identificacion);
    const headers = AuthService.getAuthHeaders();

    const nombres = datosActualizados.nombres?.split(' ') || [];
    const apellidos = datosActualizados.apellidos?.split(' ') || [];

    const payload = {
      tipo_documento: datosActualizados.tipo_documento,
      identificacion: identificacion,
      primer_nombre: nombres[0] || "",
      segundo_nombre: nombres.slice(1).join(' ') || "",
      primer_apellido: apellidos[0] || "",
      segundo_apellido: apellidos.slice(1).join(' ') || "",
      sexo: datosActualizados.genero,
      identidad_sexual: datosActualizados.identidad_sexual || "",
      fecha_nacimiento: datosActualizados.fecha_nacimiento || "",
      nacionalidad: datosActualizados.nacionalidad || "CO",
      pais_residencia: datosActualizados.pais || "CO",
      departamento_residencia: datosActualizados.departamento_residencia || "",
      ciudad_residencia: datosActualizados.ciudad_residencia || "",
      direccion_residencia: datosActualizados.direccion_residencia || "",
      telefono: datosActualizados.telefono,
      correo: datosActualizados.correo,
      rol: "Docente",
      activo: true,
      categoria_docente: datosActualizados.categoria_docente,
      codigo_programa: datosActualizados.codigo_programa || ""
    };

    console.log('Payload:', payload);

    const response = await fetch(
      `${API_BASE_URL}/api/v1/teachers/${identificacion}/profile`,
      {
        method: 'PUT',
        headers: headers,
        body: JSON.stringify(payload)
      }
    );

    if (response.ok) {
      const data = await response.json();
      console.log('Perfil actualizado:', data);
      return { success: true, data };
    } else {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(`Error al actualizar perfil (${response.status}): ${errorData.message || errorData.detail || 'Error desconocido'}`);
    }
  } catch (error) {
    console.error('Error al actualizar perfil:', error);
    throw error;
  }
};
