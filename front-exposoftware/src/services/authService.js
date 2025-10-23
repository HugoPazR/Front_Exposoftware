import { storageService } from './storageService';

const USERS_KEY = 'exposoftware_users';
const SESSION_KEY = 'exposoftware_session';

function _loadUsers() {
  return storageService.get(USERS_KEY, []);
}

function _saveUsers(users) {
  storageService.set(USERS_KEY, users);
}

export const authService = {
  register(user) {
    const users = _loadUsers();
    // Simple uniqueness check by email
    if (users.find((u) => u.correo === user.correo)) {
      throw new Error('El correo ya está registrado');
    }

    const newUser = { ...user, id: Date.now() };
    users.push(newUser);
    _saveUsers(users);
    // Auto login after register
    storageService.set(SESSION_KEY, { user: newUser });
    return newUser;
  },
  login({ correo, contraseña }) {
    const users = _loadUsers();
    const user = users.find((u) => u.correo === correo && u.contraseña === contraseña);
    if (!user) {
      throw new Error('Credenciales inválidas');
    }
    storageService.set(SESSION_KEY, { user });
    return user;
  },
  logout() {
    storageService.remove(SESSION_KEY);
  },
  getSession() {
    return storageService.get(SESSION_KEY, null);
  },
  getUsers() {
    return _loadUsers();
  }
};
