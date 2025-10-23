import { storageService } from './storageService';

const KEY = 'exposoftware_grupos';
const INITIAL = [];

export const gruposService = {
  list() {
    return storageService.get(KEY, INITIAL);
  },
  getById(id) {
    return this.list().find((g) => g.id === id) || null;
  },
  getByMateriaId(materiaId) {
    return this.list().filter((g) => g.materiaId === materiaId);
  },
  create(payload) {
    const items = this.list();
    const newItem = {
      id: 'grp' + Date.now(),
      codigo_grupo: payload.codigo_grupo || Math.floor(Math.random() * 900) + 100,
      id_docente: payload.id_docente || null,
      materiaId: payload.materiaId || null,
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
    return true;
  },
  removeByMateriaId(materiaId) {
    let items = this.list();
    items = items.filter((m) => m.materiaId !== materiaId);
    storageService.set(KEY, items);
    return true;
  }
};
