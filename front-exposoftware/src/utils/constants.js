// URL base del backend API
export const API_BASE_URL = 'http://localhost:8000'; // Ajusta según tu configuración

// Constantes para formularios
export const TIPOS_DOCUMENTO = [
  { value: 'CC', label: 'Cédula de Ciudadanía' },
  { value: 'CE', label: 'Cédula de Extranjería' },
  { value: 'TI', label: 'Tarjeta de Identidad' },
  { value: 'PP', label: 'Pasaporte' }
];

export const GENEROS = [
  { value: 'Hombre', label: 'Hombre' },
  { value: 'Mujer', label: 'Mujer' },
  { value: 'No binario', label: 'No binario' },
  { value: 'Otro', label: 'Otro' }
];

export const IDENTIDADES_SEXUALES = [
  { value: 'Heterosexual', label: 'Heterosexual' },
  { value: 'Homosexual', label: 'Homosexual' },
  { value: 'Bisexual', label: 'Bisexual' },
  { value: 'Otro', label: 'Otro' }
];

export const CATEGORIAS_DOCENTE = [
  { value: 'Interno', label: 'Interno' },
  { value: 'Catedrático', label: 'Catedrático' }
];

export const DEPARTAMENTOS_COLOMBIA = [
  { value: 'Amazonas', label: 'Amazonas' },
  { value: 'Antioquia', label: 'Antioquia' },
  { value: 'Arauca', label: 'Arauca' },
  { value: 'Atlántico', label: 'Atlántico' },
  { value: 'Bolívar', label: 'Bolívar' },
  { value: 'Boyacá', label: 'Boyacá' },
  { value: 'Caldas', label: 'Caldas' },
  { value: 'Caquetá', label: 'Caquetá' },
  { value: 'Casanare', label: 'Casanare' },
  { value: 'Cauca', label: 'Cauca' },
  { value: 'Cesar', label: 'Cesar' },
  { value: 'Chocó', label: 'Chocó' },
  { value: 'Córdoba', label: 'Córdoba' },
  { value: 'Cundinamarca', label: 'Cundinamarca' },
  { value: 'Guainía', label: 'Guainía' },
  { value: 'Guaviare', label: 'Guaviare' },
  { value: 'Huila', label: 'Huila' },
  { value: 'La Guajira', label: 'La Guajira' },
  { value: 'Magdalena', label: 'Magdalena' },
  { value: 'Meta', label: 'Meta' },
  { value: 'Nariño', label: 'Nariño' },
  { value: 'Norte de Santander', label: 'Norte de Santander' },
  { value: 'Putumayo', label: 'Putumayo' },
  { value: 'Quindío', label: 'Quindío' },
  { value: 'Risaralda', label: 'Risaralda' },
  { value: 'San Andrés y Providencia', label: 'San Andrés y Providencia' },
  { value: 'Santander', label: 'Santander' },
  { value: 'Sucre', label: 'Sucre' },
  { value: 'Tolima', label: 'Tolima' },
  { value: 'Valle del Cauca', label: 'Valle del Cauca' },
  { value: 'Vaupés', label: 'Vaupés' },
  { value: 'Vichada', label: 'Vichada' }
];

export const PAISES = [
  { value: 'Colombia', label: 'Colombia' },
  { value: 'Venezuela', label: 'Venezuela' },
  { value: 'Ecuador', label: 'Ecuador' },
  { value: 'Perú', label: 'Perú' },
  { value: 'Brasil', label: 'Brasil' },
  { value: 'Panamá', label: 'Panamá' }
];

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
  
  // Líneas de Investigación
  LINEAS_INVESTIGACION: `${API_BASE_URL}/lineas-investigacion`,
  LINEA_BY_ID: (id) => `${API_BASE_URL}/lineas-investigacion/${id}`,
  
  // Sublíneas de Investigación
  SUBLINEAS_INVESTIGACION: `${API_BASE_URL}/sublineas-investigacion`,
  SUBLINEA_BY_ID: (id) => `${API_BASE_URL}/sublineas-investigacion/${id}`,
  
  // Áreas Temáticas
  AREAS_TEMATICAS: `${API_BASE_URL}/areas-tematicas`,
  AREA_BY_ID: (id) => `${API_BASE_URL}/areas-tematicas/${id}`,
};
