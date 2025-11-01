// URL base del backend API - Backend desplegado en AWS Lambda
export const API_BASE_URL = 'https://z6gasdnp5zp6v6egg4kg3jsitu0ffcqu.lambda-url.us-east-1.on.aws';

// Endpoints de la API
export const API_ENDPOINTS = {
  // Autenticación - Login universal para todos los roles
  LOGIN: `${API_BASE_URL}/api/v1/auth/login`,
  AUTH_ME: `${API_BASE_URL}/api/v1/auth/me`,
  AUTH_REFRESH: `${API_BASE_URL}/api/v1/auth/refresh`,
  AUTH_LOGOUT: `${API_BASE_URL}/api/v1/auth/logout`,
  
  // Registro público
  REGISTRO_ESTUDIANTE: `${API_BASE_URL}/api/v1/estudiantes/registro`,
  
  // Usuarios
  USUARIOS: `${API_BASE_URL}/api/v1/usuarios`,
  USUARIO_BY_ID: (id) => `${API_BASE_URL}/api/v1/usuarios/${id}`,
  
  // Materias
  MATERIAS: `${API_BASE_URL}/api/v1/admin/materias`,
  MATERIA_BY_ID: (id) => `${API_BASE_URL}/api/v1/admin/materias/${id}`,
  
  // Grupos
  GRUPOS: `${API_BASE_URL}/api/v1/admin/grupos`,
  GRUPO_BY_ID: (id) => `${API_BASE_URL}/api/v1/admin/grupos/${id}`,
  
  // Docentes/Profesores
  DOCENTES: `${API_BASE_URL}/api/v1/docentes`,
  PROFESORES: `${API_BASE_URL}/api/v1/admin/profesores`,
  DOCENTE_BY_ID: (id) => `${API_BASE_URL}/api/v1/docentes/${id}`,
  PROFESOR_BY_ID: (id) => `${API_BASE_URL}/api/v1/admin/profesores/${id}`,
  
  // Asignaciones Docente-Materia (para asociar grupos con materias)
  ASIGNACIONES_DOCENTE: `${API_BASE_URL}/api/v1/admin/asignaciones-docentes`,
  ASIGNACION_BY_ID: (id) => `${API_BASE_URL}/api/v1/admin/asignaciones-docentes/${id}`,
  
  // Estudiantes
  ESTUDIANTES: `${API_BASE_URL}/estudiantes`,
  ESTUDIANTE_BY_ID: (id) => `${API_BASE_URL}/estudiantes/${id}`,
  MI_PERFIL_ESTUDIANTE: `${API_BASE_URL}/api/v1/estudiantes/mi-perfil`,
  
  // Proyectos
  PROYECTOS: `${API_BASE_URL}/proyectos`,
  PROYECTO_BY_ID: (id) => `${API_BASE_URL}/proyectos/${id}`,
  
  // Líneas de Investigación
  LINEAS_INVESTIGACION: `${API_BASE_URL}/lineas-investigacion`,
  LINEA_BY_ID: (id) => `${API_BASE_URL}/lineas-investigacion/${id}`,
  
  // Sublíneas de Investigación
  SUBLINEAS_INVESTIGACION: `${API_BASE_URL}/sublineas-investigacion`,
  SUBLINEA_BY_ID: (id) => `${API_BASE_URL}/sublineas-investigacion/${id}`,
  
  // Áreas Temáticas
  AREAS_TEMATICAS: `${API_BASE_URL}/areas-tematicas`,
  AREA_BY_ID: (id) => `${API_BASE_URL}/areas-tematicas/${id}`,
  
  // Asistencias
  ASISTENCIAS: `${API_BASE_URL}/asistencias`,
  ASISTENCIA_BY_ID: (id) => `${API_BASE_URL}/asistencias/${id}`,
  
  // Eventos
  EVENTOS: `${API_BASE_URL}/eventos`,
  EVENTO_BY_ID: (id) => `${API_BASE_URL}/eventos/${id}`,

  // Facultades (Admin) - Gestión de facultades académicas
  FACULTADES: `${API_BASE_URL}/api/v1/admin/academico/facultades`,
  FACULTAD_BY_ID: (id) => `${API_BASE_URL}/api/v1/admin/academico/facultades/${id}`,
  
  // Programas Académicos (Admin) - Asociados a Facultades
  PROGRAMAS_BY_FACULTAD: (facultadId) => `${API_BASE_URL}/api/v1/admin/academico/facultades/${facultadId}/programas`,
  PROGRAMA_BY_ID: (facultadId, codigoPrograma) => `${API_BASE_URL}/api/v1/admin/academico/facultades/${facultadId}/programas/${codigoPrograma}`,
  PROGRAMAS: `${API_BASE_URL}/api/v1/admin/academico/programas`, // Endpoint para listar todos los programas
};
