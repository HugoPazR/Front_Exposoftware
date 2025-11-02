const API_URL = 'https://z6gasdnp5zp6v6egg4kg3jsitu0ffcqu.lambda-url.us-east-1.on.aws';

const getAuthToken = () => {
  return localStorage.getItem('auth_token');
};

const getAuthHeaders = () => {
  const token = getAuthToken();
  return {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` })
  };
};

/**
 * Obtener todos los proyectos
 */
export const obtenerProyectos = async () => {
  try {
    console.log('📊 Obteniendo todos los proyectos...');
    
    const response = await fetch(`${API_URL}/api/v1/proyectos`, {
      method: 'GET',
      headers: getAuthHeaders()
    });

    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    console.log('✅ Proyectos obtenidos:', data);
    
    return Array.isArray(data) ? data : (data.data || data.proyectos || []);
  } catch (error) {
    console.error('❌ Error obteniendo proyectos:', error);
    throw error;
  }
};

/**
 * Obtener proyectos del usuario actual (estudiante)
 * 
 * ⚠️ TEMPORAL: El backend NO devuelve id_usuario_creador en GET /proyectos
 * Por ahora devuelve TODOS los proyectos. 
 * 
 * TODO: Cuando el backend agregue id_usuario_creador a la respuesta,
 * descomentar el filtro para mostrar solo los proyectos del usuario.
 */
export const obtenerMisProyectos = async (idUsuario) => {
  try {
    console.log('📊 Obteniendo mis proyectos...', { idUsuario });
    
    const response = await fetch(`${API_URL}/api/v1/proyectos`, {
      method: 'GET',
      headers: getAuthHeaders()
    });

    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    const todosProyectos = Array.isArray(data) ? data : (data.data || data.proyectos || []);
    
    console.log('📋 Total de proyectos recibidos:', todosProyectos.length);
    console.log('🔍 Filtrando proyectos donde usuario es participante:', idUsuario);
    
    // Filtrar proyectos donde el usuario aparece en id_estudiantes
    const misProyectos = todosProyectos.filter(proyecto => {
      // Verificar si el usuario está en el array de estudiantes
      const esParticipante = proyecto.id_estudiantes?.some(est => {
        // Manejar ambos casos: objeto {id_estudiante: "..."} o string directo
        const estudianteId = typeof est === 'string' ? est : est.id_estudiante;
        return estudianteId === idUsuario;
      });
      
      if (esParticipante) {
        console.log('   ✅ Proyecto del usuario:', proyecto.titulo_proyecto);
      }
      
      return esParticipante;
    });
    
    console.log('✅ Mis proyectos filtrados:', misProyectos.length);
    return misProyectos;
    
  } catch (error) {
    console.error('❌ Error obteniendo proyectos:', error);
    throw error;
  }
};

/**
 * Obtener proyecto por ID
 */
export const obtenerProyectoPorId = async (projectId) => {
  try {
    console.log(`📊 Obteniendo proyecto ${projectId}...`);
    
    const response = await fetch(`${API_URL}/api/v1/proyectos/${projectId}`, {
      method: 'GET',
      headers: getAuthHeaders()
    });

    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    console.log(`✅ Proyecto ${projectId} obtenido:`, data);
    
    return data.data || data;
  } catch (error) {
    console.error(`❌ Error obteniendo proyecto:`, error);
    throw error;
  }
};

/**
 * Crear un nuevo proyecto
 */
export const crearProyecto = async (projectData) => {
  try {
    console.log('📤 Creando nuevo proyecto...', projectData);
    
    const response = await fetch(`${API_URL}/api/v1/proyectos`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(projectData)
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || `Error ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    console.log('✅ Proyecto creado:', data);
    
    return data.data || data;
  } catch (error) {
    console.error('❌ Error creando proyecto:', error);
    throw error;
  }
};

/**
 * Actualizar un proyecto
 */
export const actualizarProyecto = async (projectId, projectData) => {
  try {
    console.log(`📝 Actualizando proyecto ${projectId}...`, projectData);
    
    const response = await fetch(`${API_URL}/api/v1/proyectos/${projectId}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(projectData)
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || `Error ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    console.log(`✅ Proyecto ${projectId} actualizado:`, data);
    
    return data.data || data;
  } catch (error) {
    console.error(`❌ Error actualizando proyecto:`, error);
    throw error;
  }
};

/**
 * Obtener proyectos del docente
 * Filtra por id_docente (proyectos asignados al docente)
 */
export const getTeacherProjects = async (teacherId) => {
  try {
    console.log(`👨‍🏫 Obteniendo proyectos del docente...`, { teacherId });
    
    const response = await fetch(`${API_URL}/api/v1/proyectos`, {
      method: 'GET',
      headers: getAuthHeaders()
    });

    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    const todosProyectos = Array.isArray(data) ? data : (data.data || data.proyectos || []);
    
    console.log('📋 Total de proyectos recibidos:', todosProyectos.length);
    console.log('🔍 Filtrando proyectos del docente:', teacherId);
    
    // Filtrar proyectos donde el docente está asignado
    const proyectosDocente = todosProyectos.filter(proyecto => {
      const esDelDocente = proyecto.id_docente === teacherId;
      
      if (esDelDocente) {
        console.log('   ✅ Proyecto del docente:', proyecto.titulo_proyecto);
      }
      
      return esDelDocente;
    });
    
    console.log('✅ Proyectos del docente filtrados:', proyectosDocente.length);
    return proyectosDocente;
    
  } catch (error) {
    console.error('❌ Error obteniendo proyectos del docente:', error);
    throw error;
  }
};

/**
 * Actualizar estado de un proyecto
 */
export const updateProjectStatus = async (projectId, status) => {
  try {
    console.log(`🔄 Actualizando estado del proyecto ${projectId} a ${status}...`);
    
    const response = await fetch(`${API_URL}/api/v1/proyectos/${projectId}/estado`, {
      method: 'PATCH',
      headers: getAuthHeaders(),
      body: JSON.stringify({ estado: status })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || `Error ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    console.log(`✅ Estado del proyecto ${projectId} actualizado:`, data);
    
    return data.data || data;
  } catch (error) {
    console.error(`❌ Error actualizando estado del proyecto:`, error);
    throw error;
  }
};

/**
 * Obtener miembros de un proyecto
 */
export const obtenerMiembrosProyecto = async (projectId) => {
  try {
    console.log(`👥 Obteniendo miembros del proyecto ${projectId}...`);
    
    const response = await fetch(`${API_URL}/api/v1/proyectos/${projectId}/miembros`, {
      method: 'GET',
      headers: getAuthHeaders()
    });

    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    console.log('✅ Miembros obtenidos:', data);
    
    return Array.isArray(data) ? data : (data.data || data.miembros || []);
  } catch (error) {
    console.error('❌ Error obteniendo miembros:', error);
    throw error;
  }
};

/**
 * Eliminar un proyecto
 */
export const eliminarProyecto = async (projectId) => {
  try {
    console.log(`🗑️ Eliminando proyecto ${projectId}...`);
    
    const response = await fetch(`${API_URL}/api/v1/proyectos/${projectId}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || `Error ${response.status}: ${response.statusText}`);
    }

    console.log(`✅ Proyecto ${projectId} eliminado`);
    return true;
  } catch (error) {
    console.error(`❌ Error eliminando proyecto:`, error);
    throw error;
  }
};
