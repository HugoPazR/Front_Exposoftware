/**
 * Catálogo de sectores para invitados
 * Mapeo de código/ID y nombre descriptivo
 */

export const SECTORES = [
  { id: 1, nombre: 'Educativo' },
  { id: 2, nombre: 'Empresarial' },
  { id: 3, nombre: 'Social' },
  { id: 4, nombre: 'Gubernamental' },
];

/**
 * Obtener sector por ID
 * @param {number} id - ID del sector (ej: 1, 2, 3, 4)
 * @returns {object|null} - Objeto sector o null si no existe
 */
export const getSectorById = (id) => {
  return SECTORES.find(sector => sector.id === id) || null;
};

/**
 * Obtener ID del sector por nombre
 * @param {string} value - Nombre del sector
 * @returns {number|null} - ID del sector o null si no existe
 */
export const getSectorId = (value) => {
  if (!value) return null;
  
  const sector = SECTORES.find(
    s => s.nombre.toLowerCase() === value.toLowerCase()
  );
  
  return sector ? sector.id : null;
};

export default SECTORES;
