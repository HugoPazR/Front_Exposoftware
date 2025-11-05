import { API_BASE_URL } from "../utils/constants";
import * as AuthService from "./AuthService";

/**
 * Obtener información del docente autenticado desde /api/v1/docentes/mi-perfil
 * Este endpoint devuelve toda la información del docente autenticado
 * incluyendo su usuario asociado
 * @returns {Promise<Object>} Datos completos del docente autenticado
 */
export const getTeacherProfile = async () => {
  try {
    console.log('📋 Cargando perfil del docente autenticado...');
    const headers = AuthService.getAuthHeaders();
    
    if (!headers.Authorization) {
      throw new Error("No hay sesión activa - token no encontrado");
    }

    const url = `${API_BASE_URL}/api/v1/docentes/mi-perfil`;
    console.log('🌐 URL:', url);
    
    const response = await fetch(url, {
      method: 'GET',
      headers: headers
    });

    console.log('📡 Respuesta - Status:', response.status);

    if (response.ok) {
      const result = await response.json();
      const docente = result.data || result;
      
      console.log('✅ Información del docente obtenida:', docente);
      console.log('📦 Estructura completa:', JSON.stringify(docente, null, 2));
      
      return docente;
    } else if (response.status === 404) {
      throw new Error("Perfil de docente no encontrado");
    } else if (response.status === 401) {
      throw new Error("No autorizado. Por favor, inicie sesión nuevamente");
    } else {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.detail || errorData.message || `Error al cargar perfil: ${response.statusText}`);
    }
  } catch (error) {
    console.error('❌ Error al cargar perfil del docente:', error);
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
 * ✅ ESTRATEGIA MÚLTIPLE (en orden de preferencia):
 * 1. Intenta obtener grupos del docente y extraer materias
 * 2. Si falla (404), extrae materias únicas de los proyectos proporcionados
 * @param {string} teacherId - ID del docente (id_docente)
 * @param {Array} proyectos - Array de proyectos del docente (opcional, para estrategia 2)
 * @returns {Promise<Array>} Lista de materias únicas del docente
 */
export const getTeacherSubjects = async (teacherId, proyectos = null) => {
  try {
    console.log('📚 Obteniendo materias del docente:', teacherId);
    const headers = AuthService.getAuthHeaders();
    
    // ESTRATEGIA 1: Intentar obtener grupos del docente
    console.log('🔄 Estrategia 1: Intentando obtener grupos del docente...');
    let url = `${API_BASE_URL}/api/v1/grupos/profesor/${teacherId}?limit=100`;
    console.log('🌐 URL (intento público):', url);
    
    let response = await fetch(url, {
      method: 'GET',
      headers: headers
    });

    // Si falla con 403, intentar endpoint admin
    if (response.status === 403) {
      console.log('⚠️ Endpoint público falló, intentando endpoint admin...');
      url = `${API_BASE_URL}/api/v1/admin/grupos/profesor/${teacherId}?limit=100`;
      console.log('🌐 URL (admin):', url);
      
      response = await fetch(url, {
        method: 'GET',
        headers: headers
      });
    }

    console.log('📡 Respuesta - Status:', response.status);

    // Si obtuvimos grupos exitosamente, extraer materias
    if (response.ok) {
      const result = await response.json();
      console.log('📦 Respuesta completa grupos:', result);
      
      let grupos = [];
      if (result.data && Array.isArray(result.data)) {
        grupos = result.data;
      } else if (Array.isArray(result)) {
        grupos = result;
      }
      
      if (grupos.length > 0) {
        console.log(`📋 Total de grupos del docente: ${grupos.length}`);
        
        // Extraer materias únicas de los grupos
        const materiasMap = new Map();
        grupos.forEach(grupo => {
          const codigoMateria = grupo.codigo_materia || grupo.materia_codigo;
          const nombreMateria = grupo.nombre_materia || grupo.materia_nombre;
          
          if (codigoMateria && !materiasMap.has(codigoMateria)) {
            materiasMap.set(codigoMateria, {
              codigo_materia: codigoMateria,
              codigo: codigoMateria,
              nombre_materia: nombreMateria || codigoMateria,
              nombre: nombreMateria || codigoMateria
            });
          }
        });
        
        const materias = Array.from(materiasMap.values());
        console.log(`✅ Materias extraídas de grupos: ${materias.length}`);
        console.log('📚 Materias:', materias.map(m => `${m.codigo} - ${m.nombre}`).join(', '));
        return materias;
      }
    }
    
    // ESTRATEGIA 2: Si no hay grupos o falló (404), extraer materias de proyectos
    console.log('🔄 Estrategia 2: Extrayendo materias de los proyectos del docente...');
    
    if (!proyectos || !Array.isArray(proyectos) || proyectos.length === 0) {
      console.warn('⚠️ No hay proyectos proporcionados para extraer materias');
      return [];
    }
    
    console.log(`📋 Proyectos del docente: ${proyectos.length}`);
    
    // Extraer materias únicas de los proyectos
    const materiasMap = new Map();
    proyectos.forEach(proyecto => {
      const codigoMateria = proyecto.codigo_materia;
      const nombreMateria = proyecto.nombre_materia || proyecto.materia || codigoMateria;
      
      if (codigoMateria && !materiasMap.has(codigoMateria)) {
        materiasMap.set(codigoMateria, {
          codigo_materia: codigoMateria,
          codigo: codigoMateria,
          nombre_materia: nombreMateria,
          nombre: nombreMateria
        });
      }
    });
    
    const materias = Array.from(materiasMap.values());
    console.log(`✅ Materias extraídas de proyectos: ${materias.length}`);
    console.log('📚 Materias:', materias.map(m => `${m.codigo} - ${m.nombre}`).join(', '));
    
    return materias;
    
  } catch (error) {
    console.error('❌ Error al obtener materias del docente:', error);
    console.warn('🔄 Retornando array vacío por error');
    return [];
  }
};

/**
 * Obtener grupos de una materia específica del docente
 * ✅ ESTRATEGIA MÚLTIPLE (en orden de preferencia):
 * 1. Intenta obtener grupos del docente y filtrar por materia
 * 2. Si falla (404), extrae grupos de los proyectos proporcionados filtrados por materia
 * @param {string} teacherId - ID del docente
 * @param {string} subjectCode - Código de la materia
 * @param {Array} proyectos - Array de proyectos del docente (opcional, para estrategia 2)
 * @returns {Promise<Array>} Lista de grupos de la materia del docente
 */
export const getTeacherSubjectGroups = async (teacherId, subjectCode, proyectos = null) => {
  try {
    console.log(`👥 Obteniendo grupos del docente ${teacherId} para materia ${subjectCode}`);
    const headers = AuthService.getAuthHeaders();
    
    // ESTRATEGIA 1: Intentar obtener grupos del endpoint
    console.log('🔄 Estrategia 1: Intentando obtener grupos del docente...');
    let url = `${API_BASE_URL}/api/v1/grupos/profesor/${teacherId}?limit=100`;
    console.log('🌐 URL (intento público):', url);
    
    let response = await fetch(url, {
      method: 'GET',
      headers: headers
    });

    // Si falla con 403, intentar endpoint admin
    if (response.status === 403) {
      console.log('⚠️ Endpoint público falló, intentando endpoint admin...');
      url = `${API_BASE_URL}/api/v1/admin/grupos/profesor/${teacherId}?limit=100`;
      console.log('🌐 URL (admin):', url);
      
      response = await fetch(url, {
        method: 'GET',
        headers: headers
      });
    }

    console.log('📡 Respuesta - Status:', response.status);

    // Si obtuvimos grupos exitosamente, filtrar por materia
    if (response.ok) {
      const result = await response.json();
      console.log('📦 Respuesta completa grupos:', result);
      
      let grupos = [];
      if (result.data && Array.isArray(result.data)) {
        grupos = result.data;
      } else if (Array.isArray(result)) {
        grupos = result;
      }
      
      if (grupos.length > 0) {
        console.log(`📋 Total de grupos del docente: ${grupos.length}`);
        
        // Filtrar grupos por código de materia
        const gruposFiltrados = grupos.filter(g => {
          const codigoMateria = g.codigo_materia || g.materia_codigo;
          return codigoMateria === subjectCode;
        });
        
        console.log(`✅ Grupos filtrados para materia ${subjectCode}: ${gruposFiltrados.length}`);
        
        // Formatear respuesta
        return gruposFiltrados.map(g => ({
          id_grupo: g.codigo_grupo || g.id_grupo,
          id: g.codigo_grupo || g.id_grupo,
          codigo_grupo: g.codigo_grupo,
          nombre_grupo: g.nombre_grupo || `Grupo ${g.codigo_grupo}`,
          nombre: g.nombre_grupo || `Grupo ${g.codigo_grupo}`,
          codigo_materia: g.codigo_materia || g.materia_codigo,
          nombre_materia: g.nombre_materia || g.materia_nombre,
          activo: g.activo
        }));
      }
    }
    
    // ESTRATEGIA 2: Extraer grupos de los proyectos proporcionados
    console.log('🔄 Estrategia 2: Extrayendo grupos de los proyectos del docente...');
    
    if (!proyectos || !Array.isArray(proyectos) || proyectos.length === 0) {
      console.warn('⚠️ No hay proyectos proporcionados para extraer grupos');
      return [];
    }
    
    console.log(`📋 Proyectos del docente: ${proyectos.length}`);
    
    // Filtrar proyectos por código de materia
    const proyectosFiltrados = proyectos.filter(p => p.codigo_materia === subjectCode);
    console.log(`📋 Proyectos de la materia ${subjectCode}: ${proyectosFiltrados.length}`);
    
    if (proyectosFiltrados.length === 0) {
      console.warn('⚠️ No hay proyectos de esta materia para extraer grupos');
      return [];
    }
    
    // Extraer grupos únicos de los proyectos
    const gruposMap = new Map();
    proyectosFiltrados.forEach(proyecto => {
      const idGrupo = proyecto.id_grupo;
      const nombreGrupo = proyecto.nombre_grupo || proyecto.grupo || `Grupo ${idGrupo}`;
      
      if (idGrupo && !gruposMap.has(idGrupo)) {
        gruposMap.set(idGrupo, {
          id_grupo: idGrupo,
          id: idGrupo,
          codigo_grupo: idGrupo,
          nombre_grupo: nombreGrupo,
          nombre: nombreGrupo,
          codigo_materia: subjectCode,
          nombre_materia: proyecto.nombre_materia || proyecto.materia,
          activo: true
        });
      }
    });
    
    const grupos = Array.from(gruposMap.values());
    console.log(`✅ Grupos únicos extraídos de proyectos: ${grupos.length}`);
    console.log('👥 Grupos:', grupos.map(g => `${g.id} - ${g.nombre}`).join(', '));
    
    return grupos;
    
  } catch (error) {
    console.error('❌ Error al obtener grupos de la materia:', error);
    return [];
  }
};

/**
 * Obtener todos los proyectos del docente
 * GET /api/v1/docentes/{id_docente}/proyectos
 * @param {string} teacherId - ID del docente
 * @returns {Promise<Array>} Lista de proyectos del docente
 */
export const getTeacherProjects = async (teacherId) => {
  try {
    console.log('📚 Obteniendo proyectos del docente:', teacherId);
    const headers = AuthService.getAuthHeaders();
    
    const url = `${API_BASE_URL}/api/v1/docentes/${teacherId}/proyectos`;
    console.log('🌐 URL:', url);
    
    const response = await fetch(url, {
      method: 'GET',
      headers: headers
    });

    console.log('📡 Respuesta - Status:', response.status);

    if (response.ok) {
      const result = await response.json();
      const proyectos = result.data || result;
      console.log(`✅ Proyectos obtenidos: ${proyectos.length}`);
      return proyectos;
    } else if (response.status === 404) {
      console.warn('⚠️ No se encontraron proyectos para el docente');
      return [];
    } else {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.detail || errorData.message || 'Error al obtener proyectos');
    }
  } catch (error) {
    console.error('❌ Error al obtener proyectos del docente:', error);
    throw error;
  }
};

/**
 * Calificar un proyecto
 * PUT /api/v1/proyectos/{proyect_id}/calificacion
 * @param {string} proyectId - ID del proyecto
 * @param {number} calificacion - Calificación del proyecto (número)
 * @returns {Promise<Object>} Proyecto actualizado con la calificación
 * 
 * Nota: 
 * - Si calificacion >= 3 → estado_calificacion = 'aprobado'
 * - Si calificacion < 3 → estado_calificacion = 'reprobado'
 * - Si calificacion es null → estado_calificacion = 'pendiente'
 */
export const calificarProyecto = async (proyectId, calificacion) => {
  try {
    console.log(`📝 Calificando proyecto ${proyectId} con nota: ${calificacion}`);
    const headers = AuthService.getAuthHeaders();
    
    const url = `${API_BASE_URL}/api/v1/proyectos/${proyectId}/calificacion`;
    console.log('🌐 URL:', url);
    
    // Crear FormData con la calificación
    const formData = new URLSearchParams();
    formData.append('calificacion', calificacion);
    
    const response = await fetch(url, {
      method: 'PUT',
      headers: {
        ...headers,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: formData.toString()
    });

    console.log('📡 Respuesta - Status:', response.status);

    if (response.ok) {
      const result = await response.json();
      const proyecto = result.data || result;
      console.log('✅ Proyecto calificado exitosamente:', proyecto);
      return proyecto;
    } else {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.detail || errorData.message || 'Error al calificar proyecto');
    }
  } catch (error) {
    console.error('❌ Error al calificar proyecto:', error);
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
    console.warn('⚠️ No hay datos crudos para procesar');
    return {};
  }

  console.log('🔄 Procesando datos del docente:', datosCrudos);

  // Extraer objetos anidados
  const docente = datosCrudos.docente || datosCrudos;
  const usuario = datosCrudos.usuario || {};
  
  // Combinar nombres
  const nombres = [usuario.primer_nombre, usuario.segundo_nombre]
    .filter(Boolean)
    .join(' ');
  
  // Combinar apellidos
  const apellidos = [usuario.primer_apellido, usuario.segundo_apellido]
    .filter(Boolean)
    .join(' ');

  // Mapear sexo del backend al formato del formulario
  // Backend: "Mujer"/"Hombre" -> Formulario: "Femenino"/"Masculino"
  let sexoMapeado = usuario.sexo || "";
  if (sexoMapeado === "Mujer") sexoMapeado = "Femenino";
  if (sexoMapeado === "Hombre") sexoMapeado = "Masculino";

  // Formatear fecha de nacimiento a YYYY-MM-DD
  let fechaNacimiento = usuario.fecha_nacimiento || "";
  if (fechaNacimiento && fechaNacimiento.includes('T')) {
    // Si viene en formato ISO (2002-05-22T00:00:00), extraer solo la fecha
    fechaNacimiento = fechaNacimiento.split('T')[0];
  }

  const datosProcesados = {
    // Datos del docente
    id_docente: docente.id_docente || "",
    id_usuario: docente.id_usuario || usuario.id_usuario || "",
    categoria_docente: docente.categoria_docente || "Interno",
    codigo_programa: docente.codigo_programa || "",
    
    // Datos personales del usuario
    tipo_documento: usuario.tipo_documento || "CC",
    identificacion: usuario.identificacion || "",
    nombres: nombres || "",
    apellidos: apellidos || "",
    sexo: sexoMapeado,
    identidad_sexual: usuario.identidad_sexual || "",
    fecha_nacimiento: fechaNacimiento,
    telefono: usuario.telefono || "",
    
    // Ubicación - NOTA: Backend usa 'departamento' y 'municipio'
    pais: usuario.pais_residencia || "CO",
    nacionalidad: usuario.nacionalidad || "CO",
    departamento_residencia: usuario.departamento || "",  // ✅ Mapeo correcto
    ciudad_residencia: usuario.municipio || "",           // ✅ Mapeo correcto
    direccion_residencia: usuario.direccion_residencia || "",
    departamento: usuario.departamento || "",
    municipio: usuario.municipio || "",
    ciudad: usuario.ciudad_residencia || usuario.municipio || "",
    
    // Institucional
    correo: usuario.correo || "",
    anio_ingreso: new Date().getFullYear(),
    periodo: 1,
    rol: usuario.rol || "Docente"
  };

  console.log('✅ Datos procesados:', datosProcesados);
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
