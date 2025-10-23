import { storageService } from './storageService';

const KEY = 'exposoftware_proyectos';
const INITIAL = [];

export const proyectosService = {
  list() {
    return storageService.get(KEY, INITIAL);
  },
  getById(id) {
    return this.list().find((p) => p.id === id) || null;
  },
  create(payload) {
    const items = this.list();
    const newItem = {
      id: 'proj' + Date.now(),
      ...payload,
      fechaCreacion: new Date().toISOString(),
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
  }
};
