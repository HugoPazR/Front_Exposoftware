import { storageService } from './storageService';

const KEY = 'exposoftware_docentes';
const INITIAL = [];

export const docentesService = {
  list() {
    return storageService.get(KEY, INITIAL);
  },
  getById(id) {
    return this.list().find((d) => d.id === id) || null;
  },
  create(payload) {
    const items = this.list();
    const newItem = {
      id: 'prof' + Date.now(),
      ...payload,
      fechaCreacion: new Date().toISOString().split('T')[0]
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
