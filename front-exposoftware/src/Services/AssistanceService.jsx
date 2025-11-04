import { API_ENDPOINTS } from '../utils/constants';

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
 * Servicio para la gestión de asistencias a eventos
 */
class AssistanceService {
  /**
   * Genera un código QR para registro de asistencia del evento
   * POST /api/v1/asistencia/generar-qr/{id_evento}
   * @param {string} idEvento - ID del evento
   * @param {string} urlFront - URL base del frontend (opcional)
   */
  static async generarQrEvento(idEvento, urlFront = 'https://exposoftware.unicesar.edu.co') {
    try {
      console.log('🔄 Generando QR para evento:', idEvento);
      
      const response = await fetch(
        `${API_ENDPOINTS.GENERAR_QR_EVENTO(idEvento)}?url_front=${urlFront}`, 
        {
          method: 'POST',
          headers: getAuthHeaders()
        }
      );

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      console.log('✅ QR generado exitosamente');
      return data;
    } catch (error) {
      console.error('❌ Error al generar QR:', error);
      throw error;
    }
  }

  /**
   * Registra la asistencia de un usuario en el evento
   * POST /api/v1/asistencia/registrar/{id_evento}
   * @param {string} idEvento - ID del evento
   * @param {string} correoUsuario - Correo del usuario
   */
  static async registrarAsistencia(idEvento, correoUsuario) {
    try {
      console.log('📝 Registrando asistencia para:', correoUsuario);
      
      const response = await fetch(API_ENDPOINTS.REGISTRAR_ASISTENCIA(idEvento), {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ correo_usuario: correoUsuario })
      });

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      console.log('✅ Asistencia registrada exitosamente');
      return data;
    } catch (error) {
      console.error('❌ Error al registrar asistencia:', error);
      throw error;
    }
  }

  /**
   * Obtiene todas las asistencias de un evento (requiere autenticación ADMIN)
   * GET /api/v1/asistencia/evento/{id_evento}
   * @param {string} idEvento - ID del evento
   * @param {number} limit - Límite de registros a obtener (default: 100)
   */
  static async obtenerAsistenciasEvento(idEvento, limit = 100) {
    try {
      console.log('📊 Obteniendo asistencias del evento:', idEvento);
      
      const response = await fetch(
        `${API_ENDPOINTS.OBTENER_ASISTENCIAS_EVENTO(idEvento)}?limit=${limit}`,
        {
          method: 'GET',
          headers: getAuthHeaders()
        }
      );

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      console.log('✅ Asistencias obtenidas:', data);
      return data;
    } catch (error) {
      console.error('❌ Error al obtener asistencias:', error);
      throw error;
    }
  }
}

export default AssistanceService;