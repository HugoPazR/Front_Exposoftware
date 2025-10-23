import { storageService } from './storageService';

const KEY = 'exposoftware_estudiantes';
const INITIAL = [];

export const estudiantesService = {
  list() {
    return storageService.get(KEY, INITIAL);
  },
  getById(id) {
    return this.list().find((s) => s.id === id) || null;
  },
  create(payload) {
    const items = this.list();
    const newItem = { id: 'est' + Date.now(), ...payload };
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
