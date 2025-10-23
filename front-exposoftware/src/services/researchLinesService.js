import { storageService } from './storageService';

const KEY_LINEAS = 'exposoftware_lineas';
const KEY_SUBLINEAS = 'exposoftware_sublineas';
const KEY_AREAS = 'exposoftware_areas';

export const researchLinesService = {
  listLineas() {
    return storageService.get(KEY_LINEAS, []);
  },
  createLinea(payload) {
    const items = this.listLineas();
    const newItem = { id: 'lin' + Date.now(), nombre_linea: payload.nombre_linea, fechaCreacion: new Date().toISOString().split('T')[0] };
    items.push(newItem);
    storageService.set(KEY_LINEAS, items);
    return newItem;
  },
  updateLinea(id, changes) {
    const items = this.listLineas();
    const idx = items.findIndex(i => i.id === id);
    if (idx === -1) return null;
    items[idx] = { ...items[idx], ...changes };
    storageService.set(KEY_LINEAS, items);
    return items[idx];
  },
  removeLinea(id) {
    let items = this.listLineas();
    items = items.filter(i => i.id !== id);
    storageService.set(KEY_LINEAS, items);
    // remove dependent sublineas and areas
    const subs = this.listSublineas().filter(s => s.id_linea !== id);
    storageService.set(KEY_SUBLINEAS, subs);
    const areas = this.listAreas().filter(a => !subs.find(s => s.id === a.id_sublinea));
    storageService.set(KEY_AREAS, areas);
    return true;
  },

  listSublineas() {
    return storageService.get(KEY_SUBLINEAS, []);
  },
  createSublinea(payload) {
    const items = this.listSublineas();
    const newItem = { id: 'sub' + Date.now(), nombre_sublinea: payload.nombre_sublinea, id_linea: payload.id_linea, fechaCreacion: new Date().toISOString().split('T')[0] };
    items.push(newItem);
    storageService.set(KEY_SUBLINEAS, items);
    return newItem;
  },
  updateSublinea(id, changes) {
    const items = this.listSublineas();
    const idx = items.findIndex(i => i.id === id);
    if (idx === -1) return null;
    items[idx] = { ...items[idx], ...changes };
    storageService.set(KEY_SUBLINEAS, items);
    return items[idx];
  },
  removeSublinea(id) {
    let items = this.listSublineas();
    items = items.filter(i => i.id !== id);
    storageService.set(KEY_SUBLINEAS, items);
    // remove related areas
    const areas = this.listAreas().filter(a => a.id_sublinea !== id);
    storageService.set(KEY_AREAS, areas);
    return true;
  },

  listAreas() {
    return storageService.get(KEY_AREAS, []);
  },
  createArea(payload) {
    const items = this.listAreas();
    const newItem = { id: 'area' + Date.now(), nombre_area: payload.nombre_area, id_sublinea: payload.id_sublinea, fechaCreacion: new Date().toISOString().split('T')[0] };
    items.push(newItem);
    storageService.set(KEY_AREAS, items);
    return newItem;
  },
  updateArea(id, changes) {
    const items = this.listAreas();
    const idx = items.findIndex(i => i.id === id);
    if (idx === -1) return null;
    items[idx] = { ...items[idx], ...changes };
    storageService.set(KEY_AREAS, items);
    return items[idx];
  },
  removeArea(id) {
    let items = this.listAreas();
    items = items.filter(i => i.id !== id);
    storageService.set(KEY_AREAS, items);
    return true;
  }
};
