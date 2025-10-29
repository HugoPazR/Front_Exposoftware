import { API_ENDPOINTS } from "../utils/constants";

const STORAGE_KEYS = {
  TOKEN: 'auth_token',
  USER_DATA: 'user_data',
  USER_ROLE: 'user_role',
  EXPIRES_AT: 'token_expires_at'
};

/**
 * Función auxiliar para procesar respuestas del backend
 */
const procesarRespuesta = async (response) => {
  const contentType = response.headers.get("content-type");
  let responseData = {};

  if (contentType && contentType.includes("application/json")) {
    try {
      responseData = await response.json();
    } catch (error) {
      console.error('❌ Error al parsear JSON:', error);
    }
  }

  if (response.ok) {
    return {
      success: true,
      data: responseData.data || responseData,
      message: responseData.message || 'Operación exitosa',
      code: responseData.code || 'SUCCESS'
    };
  }

  let errorMessage = responseData.message || 'Error desconocido';
  
  if (responseData.errors && Array.isArray(responseData.errors)) {
    const errorMessages = responseData.errors.map(err => 
      `${err.field}: ${err.message}`
    ).join('\n');
    errorMessage = errorMessages || errorMessage;
  }

  throw new Error(errorMessage);
};

/**
 * Login Universal para todos los roles
 * El backend detecta automáticamente el rol del usuario según el correo y contraseña
 * @param {Object} credentials - Credenciales de acceso
 * @param {string} credentials.correo - Correo electrónico
 * @param {string} credentials.password - Contraseña
 * @returns {Promise<Object>} Datos del usuario, token y rol detectado
 */
export const login = async (credentials) => {
  console.log('🔐 Intentando login universal...');
  console.log('📧 Correo:', credentials.correo);
  
  const payload = {
    correo: credentials.correo,
    password: credentials.password
  };

  try {
    const response = await fetch(API_ENDPOINTS.LOGIN, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    const resultado = await procesarRespuesta(response);
    
    // Guardar datos en localStorage
    if (resultado.success && resultado.data) {
      const userData = resultado.data;
      
      console.log('📦 Datos completos recibidos del backend:', userData);

      const rol = userData.rol || 
                  userData.role || 
                  userData.tipo_usuario || 
                  userData.tipoUsuario ||
                  userData.tipo ||
                  userData.user_role ||
                  userData.perfil ||
                  'user';
                  
      console.log('👤 Rol detectado del backend:', rol);
      
      // Si no se detecta el rol pero el correo contiene "admin", asignar rol admin
      let rolFinal = rol;
      if (rol === 'user' && credentials.correo.toLowerCase().includes('admin')) {
        rolFinal = 'Administrador';
        console.log('🔍 Rol detectado por patrón de correo: Administrador');
      }
      
      // Guardar token (puede venir en data.token o data.access_token)
      const token = userData.token || userData.access_token || userData.id;
      if (token) {
        localStorage.setItem(STORAGE_KEYS.TOKEN, token);
        console.log('✅ Token guardado:', token.substring(0, 20) + '...');
      }
      
      // Guardar datos del usuario
      localStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(userData));
      
      // Guardar rol normalizado (admin, docente, estudiante)
      const rolNormalizado = normalizarRol(rolFinal);
      localStorage.setItem(STORAGE_KEYS.USER_ROLE, rolNormalizado);
      
      // Guardar tiempo de expiración (24 horas por defecto)
      const expiresAt = Date.now() + (24 * 60 * 60 * 1000);
      localStorage.setItem(STORAGE_KEYS.EXPIRES_AT, expiresAt.toString());
      
      console.log('✅ Login exitoso');
      console.log('👤 Rol normalizado final:', rolNormalizado);
      console.log('� Usuario guardado:', userData);
    }
    
    return resultado;
  } catch (error) {
    console.error('❌ Error en login:', error.message);
    throw error;
  }
};

/**
 * Normalizar rol del usuario para consistencia interna
 * @param {string} rol - Rol recibido del backend
 * @returns {string} Rol normalizado: 'admin', 'docente', 'estudiante'
 */
const normalizarRol = (rol) => {
  if (!rol) {
    console.warn('⚠️ Rol vacío o undefined');
    return 'user';
  }
  
  const rolLower = String(rol).toLowerCase().trim();
  console.log('🔄 Normalizando rol:', rol, '→', rolLower);
  
  // Administrador
  if (rolLower.includes('admin') || 
      rolLower.includes('administrador') || 
      rolLower === 'admin') {
    console.log('✅ Rol normalizado a: admin');
    return 'admin';
  }
  
  // Docente/Profesor
  if (rolLower.includes('docente') || 
      rolLower.includes('profesor') || 
      rolLower.includes('teacher') ||
      rolLower === 'docente' ||
      rolLower === 'profesor') {
    console.log('✅ Rol normalizado a: docente');
    return 'docente';
  }
  
  // Estudiante
  if (rolLower.includes('estudiante') || 
      rolLower.includes('alumno') || 
      rolLower.includes('student') ||
      rolLower === 'estudiante') {
    console.log('✅ Rol normalizado a: estudiante');
    return 'estudiante';
  }
  
  // Egresado
  if (rolLower.includes('egresado') || 
      rolLower.includes('graduate')) {
    console.log('✅ Rol normalizado a: egresado');
    return 'egresado';
  }
  
  // Invitado
  if (rolLower.includes('invitado') || 
      rolLower.includes('guest')) {
    console.log('✅ Rol normalizado a: invitado');
    return 'invitado';
  }
  
  console.warn('⚠️ Rol no reconocido, usando tal cual:', rolLower);
  return rolLower; // Retornar como está si no coincide
};

/**
 * Login de Administrador (DEPRECATED - usar login())
 * @deprecated Usar login() en su lugar
 */
export const loginAdmin = async (credentials) => {
  console.warn('⚠️ loginAdmin() está deprecado. Usa login() en su lugar.');
  return await login(credentials);
};

/**
 * Login de Estudiante (DEPRECATED - usar login())
 * @deprecated Usar login() en su lugar
 */
export const loginEstudiante = async (credentials) => {
  console.warn('⚠️ loginEstudiante() está deprecado. Usa login() en su lugar.');
  return await login(credentials);
};

/**
 * Login de Docente (DEPRECATED - usar login())
 * @deprecated Usar login() en su lugar
 */
export const loginDocente = async (credentials) => {
  console.warn('⚠️ loginDocente() está deprecado. Usa login() en su lugar.');
  return await login(credentials);
};

/**
 * Cerrar sesión en el backend y limpiar localStorage
 */
export const logout = async () => {
  console.log('🚪 Cerrando sesión...');
  
  const token = getToken();
  
  // Intentar cerrar sesión en el backend si hay token
  if (token) {
    try {
      const response = await fetch(API_ENDPOINTS.AUTH_LOGOUT, {
        method: 'POST',
        headers: getAuthHeaders()
      });
      
      if (response.ok) {
        console.log('✅ Sesión cerrada en el backend');
      }
    } catch (error) {
      console.warn('⚠️ No se pudo cerrar sesión en el backend:', error.message);
    }
  }
  
  // Limpiar localStorage siempre
  localStorage.removeItem(STORAGE_KEYS.TOKEN);
  localStorage.removeItem(STORAGE_KEYS.USER_DATA);
  localStorage.removeItem(STORAGE_KEYS.USER_ROLE);
  localStorage.removeItem(STORAGE_KEYS.EXPIRES_AT);
  console.log('✅ Sesión cerrada - localStorage limpio');
};

/**
 * Obtener información del usuario actual desde el backend
 * @returns {Promise<Object>} Datos actualizados del usuario
 */
export const getCurrentUserInfo = async () => {
  console.log('👤 Obteniendo información del usuario...');
  
  try {
    const response = await fetch(API_ENDPOINTS.AUTH_ME, {
      method: 'GET',
      headers: getAuthHeaders()
    });

    const resultado = await procesarRespuesta(response);
    
    // Actualizar datos en localStorage
    if (resultado.success && resultado.data) {
      localStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(resultado.data));
      console.log('✅ Información del usuario actualizada');
    }
    
    return resultado;
  } catch (error) {
    console.error('❌ Error al obtener información del usuario:', error.message);
    throw error;
  }
};

/**
 * Refrescar el token de acceso
 * @returns {Promise<Object>} Nuevo token
 */
export const refreshToken = async () => {
  console.log('🔄 Refrescando token...');
  
  try {
    const response = await fetch(API_ENDPOINTS.AUTH_REFRESH, {
      method: 'POST',
      headers: getAuthHeaders()
    });

    const resultado = await procesarRespuesta(response);
    
    // Actualizar token en localStorage
    if (resultado.success && resultado.data) {
      const newToken = resultado.data.token || resultado.data.access_token;
      if (newToken) {
        localStorage.setItem(STORAGE_KEYS.TOKEN, newToken);
        
        // Actualizar tiempo de expiración
        const expiresAt = Date.now() + (24 * 60 * 60 * 1000);
        localStorage.setItem(STORAGE_KEYS.EXPIRES_AT, expiresAt.toString());
        
        console.log('✅ Token refrescado exitosamente');
      }
    }
    
    return resultado;
  } catch (error) {
    console.error('❌ Error al refrescar token:', error.message);
    // Si falla el refresh, cerrar sesión
    logout();
    throw error;
  }
};

/**
 * Verificar si el usuario está autenticado
 * @returns {boolean}
 */
export const isAuthenticated = () => {
  const token = localStorage.getItem(STORAGE_KEYS.TOKEN);
  const expiresAt = localStorage.getItem(STORAGE_KEYS.EXPIRES_AT);
  
  if (!token || !expiresAt) {
    return false;
  }
  
  // Verificar si el token ha expirado
  if (Date.now() > parseInt(expiresAt)) {
    console.log('⏰ Token expirado - limpiando sesión');
    logout();
    return false;
  }
  
  return true;
};

/**
 * Obtener token actual
 * @returns {string|null}
 */
export const getToken = () => {
  return localStorage.getItem(STORAGE_KEYS.TOKEN);
};

/**
 * Obtener datos del usuario actual
 * @returns {Object|null}
 */
export const getUserData = () => {
  const userData = localStorage.getItem(STORAGE_KEYS.USER_DATA);
  if (!userData) return null;
  
  try {
    return JSON.parse(userData);
  } catch (error) {
    console.error('❌ Error al parsear datos de usuario:', error);
    return null;
  }
};

/**
 * Obtener rol del usuario actual
 * @returns {string|null} 'admin' | 'estudiante' | 'docente'
 */
export const getUserRole = () => {
  return localStorage.getItem(STORAGE_KEYS.USER_ROLE);
};

/**
 * Verificar si el usuario es administrador
 * @returns {boolean}
 */
export const isAdmin = () => {
  return getUserRole() === 'admin' && isAuthenticated();
};

/**
 * Verificar si el usuario es estudiante
 * @returns {boolean}
 */
export const isEstudiante = () => {
  return getUserRole() === 'estudiante' && isAuthenticated();
};

/**
 * Verificar si el usuario es docente
 * @returns {boolean}
 */
export const isDocente = () => {
  return getUserRole() === 'docente' && isAuthenticated();
};

/**
 * Obtener headers con autorización para peticiones
 * @returns {Object} Headers con token
 */
export const getAuthHeaders = () => {
  const token = getToken();
  
  if (!token) {
    return {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    };
  }
  
  return {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'Authorization': `Bearer ${token}`
  };
};

/**
 * Validar formato de correo
 * @param {string} correo
 * @returns {boolean}
 */
export const validarCorreo = (correo) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(correo);
};

/**
 * Validar formato de contraseña
 * @param {string} password
 * @returns {Object} { valido: boolean, errores: Array }
 */
export const validarPassword = (password) => {
  const errores = [];
  
  if (password.length < 8) {
    errores.push('La contraseña debe tener al menos 8 caracteres');
  }
  
  if (!/[A-Z]/.test(password)) {
    errores.push('Debe contener al menos una mayúscula');
  }
  
  if (!/[a-z]/.test(password)) {
    errores.push('Debe contener al menos una minúscula');
  }
  
  if (!/[0-9]/.test(password)) {
    errores.push('Debe contener al menos un número');
  }
  
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    errores.push('Debe contener al menos un carácter especial');
  }
  
  return {
    valido: errores.length === 0,
    errores
  };
};
