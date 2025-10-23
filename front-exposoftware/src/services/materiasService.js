import { storageService } from './storageService';
import { gruposService } from './gruposService';

const KEY = 'exposoftware_materias';

const INITIAL = [];

export const materiasService = {
  list() {
    return storageService.get(KEY, INITIAL);
  },
  getById(id) {
    return this.list().find((m) => m.id === id) || null;
  },
  create(payload) {
    const items = this.list();
    const newItem = {
      id: 'mat' + Date.now(),
      codigo_materia: payload.codigo_materia || '',
      nombre_materia: payload.nombre_materia || payload.name || '',
      ciclo_semestral: payload.ciclo_semestral || payload.ciclo || '',
      grupos_con_docentes: payload.grupos_con_docentes || [],
      fechaCreacion: new Date().toISOString().split('T')[0],
      ...payload,
    };
    items.push(newItem);
    storageService.set(KEY, items);
    return newItem;
  },
  update(id, changes) {
    const items = this.list();
    const idx = items.findIndex((m) => m.id === id);
    if (idx === -1) return null;
    items[idx] = { ...items[idx], ...changes };
    storageService.set(KEY, items);
    return items[idx];
  },
  remove(id) {
    let items = this.list();
    items = items.filter((m) => m.id !== id);
    storageService.set(KEY, items);
    // also remove related groups
    gruposService.removeByMateriaId(id);
    return true;
  },
  // helper used by UI: return groups for a materia
  getGroups(materiaId) {
    const materia = this.getById(materiaId);
    if (materia && materia.grupos_con_docentes && materia.grupos_con_docentes.length) {
      return materia.grupos_con_docentes.map((g, idx) => ({ id: `${materiaId}_g${idx}`, ...g }));
    }
    return gruposService.getByMateriaId(materiaId);
  }
};
