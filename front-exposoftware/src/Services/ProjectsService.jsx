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
export const obtenerMisProyectos = async (idEstudiante) => {
  try {
    console.log('📊 Obteniendo proyectos del estudiante...', { idEstudiante });
    
    // ESTRATEGIA: Intentar múltiples endpoints hasta encontrar uno que funcione
    let proyectos = [];
    
    // Intento 1: Endpoint simple GET /api/v1/proyectos (el más común)
    try {
      console.log('🔄 Intento 1: GET /api/v1/proyectos (endpoint simple)');
      const response = await fetch(`${API_URL}/api/v1/proyectos`, {
        method: 'GET',
        headers: getAuthHeaders()
      });

      console.log('📡 Status:', response.status);

      if (response.ok) {
        const data = await response.json();
        const todosProyectos = Array.isArray(data) ? data : (data.data || data.proyectos || []);
        
        console.log('📋 Total proyectos:', todosProyectos.length);
        console.log('🔍 Filtrando por estudiante:', idEstudiante);
        
        // DEBUG: Ver estructura del primer proyecto
        if (todosProyectos.length > 0) {
          console.log('🔍 DEBUG - Estructura del primer proyecto:', {
            id: todosProyectos[0].id_proyecto,
            titulo: todosProyectos[0].titulo_proyecto,
            id_estudiantes: todosProyectos[0].id_estudiantes,
            id_estudiantes_type: typeof todosProyectos[0].id_estudiantes,
            id_estudiantes_isArray: Array.isArray(todosProyectos[0].id_estudiantes)
          });
          
          // Ver cada estudiante
          if (Array.isArray(todosProyectos[0].id_estudiantes)) {
            todosProyectos[0].id_estudiantes.forEach((est, idx) => {
              console.log(`   📍 Estudiante [${idx}]:`, {
                tipo: typeof est,
                valor: est,
                id_estudiante: est?.id_estudiante,
                nombre: est?.nombre
              });
            });
          }
        }
        
        // Filtrar proyectos donde aparece el estudiante
        proyectos = todosProyectos.filter(proyecto => {
          const esParticipante = proyecto.id_estudiantes?.some(est => {
            const estudianteId = est?.id_estudiante || est;
            const match = estudianteId === idEstudiante;
            
            // DEBUG: Ver cada comparación
            if (proyecto.id_estudiantes?.length > 0) {
              console.log(`   🔎 Comparando en proyecto "${proyecto.titulo_proyecto}":`, {
                estudianteId,
                buscando: idEstudiante,
                match
              });
            }
            
            return match;
          });
          return esParticipante;
        });
        
        console.log('✅ Proyectos filtrados:', proyectos.length);
        if (proyectos.length > 0) {
          console.log('📊 Proyectos encontrados:', proyectos.map(p => ({
            id: p.id_proyecto,
            titulo: p.titulo_proyecto
          })));
        }
        return proyectos;
      } else {
        console.warn('⚠️ Endpoint /api/v1/proyectos falló con status:', response.status);
      }
    } catch (error) {
      console.warn('⚠️ Endpoint /api/v1/proyectos falló:', error.message);
    }
    
    // Intento 2: Endpoint específico del estudiante (puede no estar implementado)
    try {
      console.log('🔄 Intento 2: /api/v1/estudiantes/{id}/proyectos');
      const response = await fetch(`${API_URL}/api/v1/estudiantes/${idEstudiante}/proyectos`, {
        method: 'GET',
        headers: getAuthHeaders()
      });

      if (response.ok) {
        const data = await response.json();
        proyectos = Array.isArray(data) ? data : (data.data || data.proyectos || []);
        console.log('✅ Proyectos obtenidos (endpoint estudiante):', proyectos.length);
        return proyectos;
      }
    } catch (error) {
      console.warn('⚠️ Endpoint de estudiante falló:', error.message);
    }

    // Intento 3: Endpoint admin con filtro (requiere permisos pero puede funcionar)
    try {
      console.log('🔄 Intento 3: /api/v1/admin/proyectos');
      const response = await fetch(`${API_URL}/api/v1/admin/proyectos?limit=100`, {
        method: 'GET',
        headers: getAuthHeaders()
      });

      if (response.ok) {
        const data = await response.json();
        const todosProyectos = Array.isArray(data) ? data : (data.data || data.proyectos || []);
        
        console.log('📋 Total proyectos (admin):', todosProyectos.length);
        console.log('🔍 Filtrando por estudiante:', idEstudiante);
        
        // Filtrar proyectos donde aparece el estudiante
        proyectos = todosProyectos.filter(proyecto => {
          const esParticipante = proyecto.id_estudiantes?.some(est => {
            const estudianteId = est?.id_estudiante || est;
            return estudianteId === idEstudiante;
          });
          return esParticipante;
        });
        
        console.log('✅ Proyectos filtrados:', proyectos.length);
        return proyectos;
      }
    } catch (error) {
      console.warn('⚠️ Endpoint admin falló:', error.message);
    }

    // Si llegamos aquí, ningún endpoint funcionó
    console.error('❌ Ningún endpoint de proyectos está disponible');
    console.log('💡 Sugerencia: Verifica que el backend tenga implementado al menos uno de estos endpoints:');
    console.log('   - GET /api/v1/proyectos');
    console.log('   - GET /api/v1/estudiantes/{id}/proyectos');
    console.log('   - GET /api/v1/admin/proyectos');
    
    return [];
    
  } catch (error) {
    console.error('❌ Error crítico obteniendo proyectos:', error);
    return [];
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
