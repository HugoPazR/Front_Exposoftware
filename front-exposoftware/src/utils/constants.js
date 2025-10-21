// URL base del backend API
export const API_BASE_URL = 'http://localhost:8000'; // Ajusta según tu configuración

// Endpoints de la API
export const API_ENDPOINTS = {
  // Materias
  MATERIAS: `${API_BASE_URL}/materias`,
  MATERIA_BY_ID: (id) => `${API_BASE_URL}/materias/${id}`,
  
  // Grupos
  GRUPOS: `${API_BASE_URL}/grupos`,
  GRUPO_BY_ID: (id) => `${API_BASE_URL}/grupos/${id}`,
  
  // Docentes
  DOCENTES: `${API_BASE_URL}/docentes`,
  DOCENTE_BY_ID: (id) => `${API_BASE_URL}/docentes/${id}`,
  
  // Estudiantes
  ESTUDIANTES: `${API_BASE_URL}/estudiantes`,
  ESTUDIANTE_BY_ID: (id) => `${API_BASE_URL}/estudiantes/${id}`,
  
  // Proyectos
  PROYECTOS: `${API_BASE_URL}/proyectos`,
  PROYECTO_BY_ID: (id) => `${API_BASE_URL}/proyectos/${id}`,
};
