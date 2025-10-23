// Pequeño servicio para interactuar con localStorage
export const storageService = {
  get(key, defaultValue = null) {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : defaultValue;
    } catch (e) {
      console.error('storageService.get error', e);
      return defaultValue;
    }
  },
  set(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      console.error('storageService.set error', e);
    }
  },
  remove(key) {
    try {
      localStorage.removeItem(key);
    } catch (e) {
      console.error('storageService.remove error', e);
    }
  },
  clear() {
    try {
      localStorage.clear();
    } catch (e) {
      console.error('storageService.clear error', e);
    }
  },
};
