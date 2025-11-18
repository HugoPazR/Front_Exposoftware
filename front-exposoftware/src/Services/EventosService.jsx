const API_URL = 'https://z6gasdnp5zp6v6egg4kg3jsitu0ffcqu.lambda-url.us-east-1.on.aws';

/**
 * Obtener el token de autenticación
 */
const getAuthToken = () => {
  return localStorage.getItem('auth_token');
};

/**
 * Headers comunes con autenticación
 */
const getAuthHeaders = () => {
  const token = getAuthToken();
  return {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` })
  };
};

/**
 * Servicio para la gestión de eventos
 */
class EventosService {
  
  /**
   * Obtener todos los eventos
   * GET /api/v1/admin/eventos (requiere autenticación de admin)
   */
  static async obtenerEventos() {
    try {
      console.log('📅 Obteniendo todos los eventos...');
      
      const response = await fetch(`${API_URL}/api/v1/admin/eventos`, {
        method: 'GET',
        headers: getAuthHeaders()
      });

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      console.log('✅ Eventos obtenidos:', data);
      
      let eventos = [];
      if (Array.isArray(data)) {
        eventos = data;
      } else if (data.data && Array.isArray(data.data)) {
        eventos = data.data;
      } else if (data.eventos && Array.isArray(data.eventos)) {
        eventos = data.eventos;
      }
      
      return eventos;
      
    } catch (error) {
      console.error('❌ Error obteniendo eventos:', error);
      throw new Error('No se pudieron cargar los eventos');
    }
  }

  /**
   * Obtener un evento por ID
   * GET /api/v1/eventos/{evento_id}
   */
  static async obtenerEventoPorId(eventoId) {
    try {
      console.log(`📅 Obteniendo evento con ID ${eventoId}...`);
      
      const response = await fetch(`${API_URL}/api/v1/admin/eventos/${eventoId}`, {
        method: 'GET',
        headers: getAuthHeaders()
      });

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      console.log(`✅ Evento ${eventoId} obtenido:`, data);
      
      return data.data || data;
      
    } catch (error) {
      console.error(`❌ Error obteniendo evento ${eventoId}:`, error);
      throw new Error('No se pudo cargar el evento');
    }
  }

  /**
   * Crear un nuevo evento
   * POST /api/v1/admin/eventos
   */
  static async crearEvento(eventoData) {
    try {
      console.log('📤 Creando nuevo evento...', eventoData);
      
      // Validar campos requeridos según OpenAPI: nombre_evento, fecha_inicio, fecha_fin
      if (!eventoData.nombre_evento || !eventoData.fecha_inicio || !eventoData.fecha_fin) {
        throw new Error('Faltan campos requeridos: nombre_evento, fecha_inicio, fecha_fin');
      }

      const fechaInicio = new Date(eventoData.fecha_inicio);
      const fechaFin = new Date(eventoData.fecha_fin);
      
      if (fechaFin < fechaInicio) {
        throw new Error('La fecha de fin no puede ser anterior a la fecha de inicio');
      }

      // Construir payload solo con campos que tienen valores
      const payload = {
        nombre_evento: eventoData.nombre_evento,
        fecha_inicio: eventoData.fecha_inicio,
        fecha_fin: eventoData.fecha_fin
      };

      // Agregar campos opcionales solo si tienen valores válidos
      if (eventoData.descripcion && eventoData.descripcion.trim()) {
        payload.descripcion = eventoData.descripcion.trim();
      }
      
      if (eventoData.lugar && eventoData.lugar.trim()) {
        payload.lugar = eventoData.lugar.trim();
      }
      
      // Validar y convertir cupo_maximo correctamente
      if (eventoData.cupo_maximo !== null && eventoData.cupo_maximo !== undefined && eventoData.cupo_maximo !== '') {
        const cupoParsed = parseInt(eventoData.cupo_maximo);
        console.log(`🔍 Validando cupo_maximo: valor=${eventoData.cupo_maximo}, tipo=${typeof eventoData.cupo_maximo}, parsed=${cupoParsed}`);
        
        if (isNaN(cupoParsed)) {
          throw new Error(`cupo_maximo debe ser un número válido, recibido: ${eventoData.cupo_maximo}`);
        }
        
        if (cupoParsed <= 0) {
          throw new Error(`cupo_maximo debe ser mayor a 0, recibido: ${cupoParsed}`);
        }
        
        payload.cupo_maximo = cupoParsed;
      }
      
      console.log('📦 Payload final a enviar:', JSON.stringify(payload, null, 2));

      const response = await fetch(`${API_URL}/api/v1/admin/eventos`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('❌ Error del servidor - Status:', response.status);
        console.error('❌ Error del servidor - Response:', errorData);
        throw new Error(errorData.message || `Error ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      console.log('✅ Evento creado exitosamente:', data);
      
      return data.data || data;
      
    } catch (error) {
      console.error('❌ Error creando evento:', error);
      throw error;
    }
  }

  /**
   * Actualizar un evento
   * PUT /api/v1/admin/eventos/{evento_id}
   */
  static async actualizarEvento(eventoId, eventoData) {
    try {
      console.log(`📝 Actualizando evento ${eventoId}...`, eventoData);
      
      const payload = {};
      
      if (eventoData.nombre_evento) payload.nombre_evento = eventoData.nombre_evento;
      if (eventoData.descripcion) payload.descripcion = eventoData.descripcion;
      if (eventoData.fecha_inicio) payload.fecha_inicio = eventoData.fecha_inicio;
      if (eventoData.fecha_fin) payload.fecha_fin = eventoData.fecha_fin;
      if (eventoData.lugar) payload.lugar = eventoData.lugar;
      if (eventoData.cupo_maximo) payload.cupo_maximo = eventoData.cupo_maximo;

      if (Object.keys(payload).length === 0) {
        throw new Error('No hay datos para actualizar');
      }

      const response = await fetch(`${API_URL}/api/v1/admin/eventos/${eventoId}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Error ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      console.log(`✅ Evento ${eventoId} actualizado:`, data);
      
      return data.data || data;
      
    } catch (error) {
      console.error(`❌ Error actualizando evento ${eventoId}:`, error);
      throw error;
    }
  }

  /**
   * Eliminar un evento
   * DELETE /api/v1/admin/eventos/{evento_id}
   */
  static async eliminarEvento(eventoId) {
    try {
      console.log(`🗑️ Eliminando evento ${eventoId}...`);
      
      const response = await fetch(`${API_URL}/api/v1/admin/eventos/${eventoId}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Error ${response.status}: ${response.statusText}`);
      }

      console.log(`✅ Evento ${eventoId} eliminado exitosamente`);
      return true;
      
    } catch (error) {
      console.error(`❌ Error eliminando evento ${eventoId}:`, error);
      throw error;
    }
  }

  /**
   * Obtener asistentes de un evento
   * GET /api/v1/eventos/{evento_id}/asistentes
   */
  static async obtenerAsistentes(eventoId) {
    try {
      console.log(`👥 Obteniendo asistentes del evento ${eventoId}...`);
      
      const response = await fetch(`${API_URL}/api/v1/eventos/${eventoId}/asistentes`, {
        method: 'GET',
        headers: getAuthHeaders()
      });

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      console.log(`✅ Asistentes obtenidos (${data.length || 0}):`, data);
      
      return Array.isArray(data) ? data : (data.data || data.asistentes || []);
      
    } catch (error) {
      console.error(`❌ Error obteniendo asistentes del evento ${eventoId}:`, error);
      throw error;
    }
  }

  /**
   * Obtener todos los eventos (Admin)
   * GET /api/v1/admin/eventos
   */
  static async obtenerEventosAdmin() {
    try {
      console.log('📅 [Admin] Obteniendo todos los eventos...');
      
      const response = await fetch(`${API_URL}/api/v1/admin/eventos`, {
        method: 'GET',
        headers: getAuthHeaders()
      });

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      console.log('✅ Eventos admin obtenidos:', data);
      
      return Array.isArray(data) ? data : (data.data || data.eventos || []);
      
    } catch (error) {
      console.error('❌ Error obteniendo eventos (admin):', error);
      throw new Error('No se pudieron cargar los eventos');
    }
  }

  /**
   * Obtener un evento por ID (Admin)
   * GET /api/v1/admin/eventos/{id}
   */
  static async obtenerEventoPorIdAdmin(eventoId) {
    try {
      console.log(`📅 [Admin] Obteniendo evento ${eventoId}...`);
      
      const response = await fetch(`${API_URL}/api/v1/admin/eventos/${eventoId}`, {
        method: 'GET',
        headers: getAuthHeaders()
      });

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      console.log(`✅ Evento ${eventoId} obtenido:`, data);
      
      return data.data || data;
      
    } catch (error) {
      console.error(`❌ Error obteniendo evento ${eventoId}:`, error);
      throw error;
    }
  }

  /**
   * Cambiar estado de un evento
   * PATCH /api/v1/admin/eventos/{id}/estado
   */
  static async cambiarEstadoEvento(eventoId, estado) {
    try {
      console.log(`🔄 Cambiando estado del evento ${eventoId} a ${estado}...`);
      
      const response = await fetch(`${API_URL}/api/v1/admin/eventos/${eventoId}/estado`, {
        method: 'PATCH',
        headers: getAuthHeaders(),
        body: JSON.stringify({ estado })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Error ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      console.log(`✅ Estado del evento ${eventoId} actualizado:`, data);
      
      return data;
      
    } catch (error) {
      console.error(`❌ Error cambiando estado del evento ${eventoId}:`, error);
      throw error;
    }
  }

  /**
   * Verificar capacidad de un evento
   * GET /api/v1/admin/eventos/{id}/capacidad
   */
  static async verificarCapacidad(eventoId) {
    try {
      console.log(`📊 Verificando capacidad del evento ${eventoId}...`);
      
      const response = await fetch(`${API_URL}/api/v1/admin/eventos/${eventoId}/capacidad`, {
        method: 'GET',
        headers: getAuthHeaders()
      });

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      console.log(`✅ Capacidad del evento ${eventoId}:`, data);
      
      return data;
      
    } catch (error) {
      console.error(`❌ Error verificando capacidad del evento ${eventoId}:`, error);
      throw error;
    }
  }

  /**
   * Obtener eventos próximos
   * GET /api/v1/admin/eventos/proximos/listado
   */
  static async obtenerEventosProximos() {
    try {
      console.log('📅 Obteniendo eventos próximos...');
      
      const response = await fetch(`${API_URL}/api/v1/admin/eventos/proximos/listado`, {
        method: 'GET',
        headers: getAuthHeaders()
      });

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      console.log('✅ Eventos próximos obtenidos:', data);
      
      return Array.isArray(data) ? data : (data.data || data.eventos || []);
      
    } catch (error) {
      console.error('❌ Error obteniendo eventos próximos:', error);
      throw error;
    }
  }

  /**
   * Obtener estadísticas generales de eventos
   * GET /api/v1/admin/eventos/estadisticas/generales
   */
  static async obtenerEstadisticasGenerales() {
    try {
      console.log('📊 Obteniendo estadísticas generales...');
      
      const response = await fetch(`${API_URL}/api/v1/admin/eventos/estadisticas/generales`, {
        method: 'GET',
        headers: getAuthHeaders()
      });

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      console.log('✅ Estadísticas generales obtenidas:', data);
      
      return data;
      
    } catch (error) {
      console.error('❌ Error obteniendo estadísticas generales:', error);
      throw error;
    }
  }
}

export default EventosService;
