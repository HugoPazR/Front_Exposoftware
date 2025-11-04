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

  // Manejar errores de red/servidor antes de parsear
  if (response.status === 502 || response.status === 503 || response.status === 504) {
    throw new Error('El servidor no está disponible en este momento. Por favor, intenta más tarde.');
  }

  if (contentType && contentType.includes("application/json")) {
    try {
      responseData = await response.json();
    } catch (error) {
      console.error('❌ Error al parsear JSON:', error);
      
      // Si no podemos parsear el JSON, es probable que el servidor esté caído
      if (!response.ok) {
        const textResponse = await response.text();
        console.error('📄 Respuesta del servidor (texto):', textResponse);
        throw new Error(`Error del servidor (${response.status}): El servidor no respondió correctamente.`);
      }
    }
  } else {
    // Si no es JSON, intentar leer como texto para debugging
    const textResponse = await response.text();
    console.error('📄 Respuesta no-JSON del servidor:', textResponse);
    
    if (!response.ok) {
      throw new Error(`Error del servidor (${response.status}): ${textResponse.substring(0, 100)}`);
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

  let errorMessage = responseData.message || `Error del servidor (${response.status})`;
  
  if (responseData.errors && Array.isArray(responseData.errors)) {
    const errorMessages = responseData.errors.map(err => 
      `${err.field}: ${err.message}`
    ).join('\n');
    errorMessage = errorMessages || errorMessage;
  }

  throw new Error(errorMessage);
};

/**
 * Extraer información del JWT (sin verificar firma)
 * SOLO para desarrollo - en producción esto debe hacerse en el backend
 */
const extraerInfoJWT = (token) => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(c => {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error('Error al decodificar JWT:', error);
    return null;
  }
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
      console.log('📦 Keys del userData:', Object.keys(userData));
      console.log('📦 userData.rol:', userData.rol);
      console.log('📦 userData.role:', userData.role);
      console.log('📦 userData.usuario:', userData.usuario);
      console.log('📦 userData.user:', userData.user);

      // Extraer el rol - puede estar en varios lugares
      let rol = userData.rol || 
                userData.role || 
                userData.usuario?.rol ||
                userData.user?.rol ||
                userData.tipo_usuario || 
                userData.tipoUsuario ||
                userData.tipo ||
                userData.user_role ||
                userData.perfil ||
                'user';
      
      // Limpiar espacios y caracteres invisibles
      rol = String(rol).trim().replace(/\s+/g, ' ');
                  
      console.log('👤 Rol detectado del backend:', rol);
      console.log('📋 Tipo del rol:', typeof rol);
      console.log('� Longitud del rol:', rol.length);
      console.log('�📝 Rol en minúsculas:', rol.toLowerCase());
      console.log('🔍 Caracteres del rol:', Array.from(rol).map((c, i) => `[${i}]='${c}' (${c.charCodeAt(0)})`).join(' '));
      
      // Si no se detecta el rol pero el correo contiene "admin", asignar rol admin
      let rolFinal = rol;
      if (rol === 'user' && credentials.correo.toLowerCase().includes('admin')) {
        rolFinal = 'Administrador';
        console.log('🔍 Rol detectado por patrón de correo: Administrador');
      }
      
      console.log('🎯 Rol final antes de normalizar:', rolFinal);
      
      // Guardar token (puede venir en data.token o data.access_token)
      const token = userData.token || userData.access_token || userData.id;
      if (token) {
        localStorage.setItem(STORAGE_KEYS.TOKEN, token);
        console.log('✅ Token guardado:', token.substring(0, 20) + '...');
        
        // Intentar extraer el nombre del JWT de Firebase
        const jwtInfo = extraerInfoJWT(token);
        if (jwtInfo && jwtInfo.name) {
          console.log('👤 Nombre extraído del JWT:', jwtInfo.name);
          userData.name = jwtInfo.name;
          userData.nombre_completo = jwtInfo.name;
        }
      }
      
      // Guardar datos del usuario (ahora incluye el nombre si estaba en el JWT)
      localStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(userData));
      
      // Guardar rol normalizado (admin, docente, estudiante)
      const rolNormalizado = normalizarRol(rolFinal);
      console.log('🎯 Rol después de normalizar:', rolNormalizado);
      console.log('💾 Guardando en localStorage con key:', STORAGE_KEYS.USER_ROLE);
      localStorage.setItem(STORAGE_KEYS.USER_ROLE, rolNormalizado);
      
      // Verificar que se guardó correctamente
      const rolGuardado = localStorage.getItem(STORAGE_KEYS.USER_ROLE);
      console.log('✅ Rol guardado verificado:', rolGuardado);
      
      // Guardar tiempo de expiración (24 horas por defecto)
      const expiresAt = Date.now() + (24 * 60 * 60 * 1000);
      localStorage.setItem(STORAGE_KEYS.EXPIRES_AT, expiresAt.toString());
      
      console.log('✅ Login exitoso');
      console.log('👤 Rol normalizado final:', rolNormalizado);
      console.log('📦 Usuario guardado:', userData);
    }
    
    return resultado;
  } catch (error) {
    console.error('❌ Error en login:', error.message);
    
    // Mejorar mensajes de error para el usuario
    if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
      throw new Error('No se puede conectar con el servidor. Verifica tu conexión a internet.');
    }
    
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
  
  const rolOriginal = String(rol);
  const rolLower = rolOriginal.toLowerCase().trim();
  console.log('🔄 Normalizando rol:');
  console.log('   - Original:', rolOriginal);
  console.log('   - En minúsculas:', rolLower);
  
  // Administrador
  if (rolLower.includes('admin') || 
      rolLower.includes('administrador') || 
      rolLower === 'administrativo') {
    console.log('✅ Rol normalizado a: admin');
    return 'admin';
  }
  
  // Docente/Profesor
  if (rolLower.includes('docente') || 
      rolLower.includes('profesor') || 
      rolLower.includes('teacher')) {
    console.log('✅ Rol normalizado a: docente');
    return 'docente';
  }
  
  // Estudiante (la palabra "estudiante" en español)
  if (rolLower.includes('Estudiante') || 
      rolLower.includes('alumno') || 
      rolLower.includes('student')) {
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
  
  console.warn('⚠️ Rol no reconocido:', rolOriginal, '(en minúsculas:', rolLower + ')');
  console.warn('⚠️ Retornando rol sin normalizar:', rolLower);
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
