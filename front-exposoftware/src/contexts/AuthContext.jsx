import React, { createContext, useContext, useState, useEffect } from 'react';
import * as AuthService from '../Services/AuthService';
import * as StudentProfileService from '../Services/StudentProfileService';

// Crear el contexto de autenticación
const AuthContext = createContext(null);

// Hook personalizado para usar el contexto de autenticación
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
};

// Provider del contexto de autenticación
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Simular carga de datos del usuario desde localStorage o API
  useEffect(() => {
    const loadUserData = async () => {
      try {
        // Verificar si hay sesión activa usando AuthService
        if (AuthService.isAuthenticated()) {
          const userData = AuthService.getUserData();
          const userRole = AuthService.getUserRole();
          
          console.log('🔐 Usuario autenticado detectado:');
          console.log('   - Rol:', userRole);
          
          if (userData) {
            // 🚀 CARGAR DATOS INMEDIATAMENTE desde localStorage
            console.log('⚡ Cargando datos inmediatamente desde localStorage');
            setUser(userData);
            setLoading(false); // ← Liberar el loading INMEDIATAMENTE
            
            // Si es estudiante, cargar perfil completo desde el backend en SEGUNDO PLANO
            if (userRole === 'estudiante') {
              console.log('📚 Actualizando perfil en segundo plano...');
              
              // Esta llamada NO bloquea la UI
              StudentProfileService.obtenerMiPerfil()
                .then(resultado => {
                  if (resultado.success && resultado.data) {
                    const perfilProcesado = StudentProfileService.procesarDatosPerfil(resultado.data);
                    setUser(perfilProcesado);
                    console.log('✅ ¡PERFIL ACTUALIZADO EN SEGUNDO PLANO!');
                    console.log('   - Nombre completo:', perfilProcesado.nombre_completo);
                  } else {
                    console.warn('⚠️ Backend respondió pero sin datos válidos, manteniendo datos de localStorage');
                  }
                })
                .catch(error => {
                  console.error('❌ Error actualizando perfil en segundo plano:', error.message);
                  console.log('✅ Manteniendo datos de localStorage (ya mostrados)');
                });
            }
          } else {
            console.warn('⚠️ No hay datos de usuario en localStorage');
            setLoading(false);
          }
        } else {
          console.log('🔓 No hay sesión activa');
          setLoading(false);
        }
      } catch (error) {
        console.error('❌ Error crítico cargando datos del usuario:', error);
        setLoading(false);
      }
    };

    loadUserData();
  }, []);

  // Función para hacer login
  const login = async (credentials) => {
    try {
      setLoading(true);
      
      console.log('🔐 AuthContext - Iniciando login...');
      
      // Usar AuthService para hacer login
      const resultado = await AuthService.login(credentials);
      
      if (resultado.success && resultado.data) {
        const userRole = AuthService.getUserRole();
        
        console.log('✅ AuthContext - Login exitoso, rol:', userRole);
        console.log('📦 AuthContext - Datos del usuario:', resultado.data);
        
        // 🚀 ACTUALIZAR EL ESTADO INMEDIATAMENTE
        setUser(resultado.data);
        setLoading(false);
        
        console.log('✅ AuthContext - Estado de usuario actualizado');
        
        // Si es estudiante, cargar perfil completo en SEGUNDO PLANO
        if (userRole === 'estudiante') {
          console.log('📚 AuthContext - Actualizando perfil completo en segundo plano tras login...');
          
          // Esta llamada NO bloquea la UI
          StudentProfileService.obtenerMiPerfil()
            .then(perfilResultado => {
              if (perfilResultado.success && perfilResultado.data) {
                const perfilProcesado = StudentProfileService.procesarDatosPerfil(perfilResultado.data);
                setUser(perfilProcesado);
                // Guardar en localStorage para próximas cargas
                localStorage.setItem('user_data', JSON.stringify(perfilProcesado));
                console.log('✅ AuthContext - Perfil completo actualizado y guardado tras login');
              }
            })
            .catch(error => {
              console.error('❌ AuthContext - Error al cargar perfil tras login:', error.message);
              console.log('✅ AuthContext - Manteniendo datos básicos del login');
            });
        }
        
        return { success: true, user: resultado.data };
      }
      
      setLoading(false);
      return { success: false, error: 'Error en el login' };
    } catch (error) {
      console.error('❌ AuthContext - Error en login:', error);
      setLoading(false);
      return { success: false, error: error.message };
    }
  };

  // Función para hacer logout
  const logout = async () => {
    try {
      console.log('🚪 Cerrando sesión desde AuthContext...');
      // Llamar al servicio de logout que cierra sesión en el backend
      await AuthService.logout();
      setUser(null);
      console.log('✅ Sesión cerrada correctamente');
    } catch (error) {
      console.error('❌ Error al cerrar sesión:', error);
      // Limpiar de todas formas aunque falle el backend
      setUser(null);
      localStorage.clear();
    }
  };

  // Función para actualizar datos del usuario
  const updateUser = (newData) => {
    const updatedUser = { ...user, ...newData };
    setUser(updatedUser);
    // Actualizar también en localStorage usando las claves correctas del AuthService
    localStorage.setItem('user_data', JSON.stringify(updatedUser));
  };

  // Función para recargar el perfil del usuario (útil después de actualizar datos)
  const reloadUserProfile = async () => {
    try {
      console.log('🔄 Recargando perfil del usuario...');
      setLoading(true);
      
      const userRole = AuthService.getUserRole();
      
      if (userRole === 'estudiante') {
        const resultado = await StudentProfileService.obtenerMiPerfil();
        if (resultado.success && resultado.data) {
          const perfilProcesado = StudentProfileService.procesarDatosPerfil(resultado.data);
          setUser(perfilProcesado);
          console.log('✅ Perfil recargado exitosamente:', perfilProcesado);
          return { success: true, data: perfilProcesado };
        }
      }
      
      return { success: false, error: 'No se pudo recargar el perfil' };
    } catch (error) {
      console.error('❌ Error al recargar perfil:', error);
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  // Función para obtener el token de autenticación
  const getAuthToken = () => {
    return AuthService.getToken();
  };

  // Verificar si el usuario tiene un rol específico
  const hasRole = (role) => {
    const userRole = AuthService.getUserRole();
    return userRole === role;
  };

  // Verificar si el usuario está autenticado
  const isAuthenticated = () => {
    return AuthService.isAuthenticated();
  };

  // Obtener nombre completo del usuario
  const getFullName = () => {
    if (!user) return '';
    
    // Si tiene nombres y apellidos del backend, usarlos
    if (user.nombres && user.apellidos) {
      return `${user.nombres} ${user.apellidos}`.trim();
    }
    
    // Si tiene nombre_completo, usarlo
    if (user.nombre_completo) {
      return user.nombre_completo;
    }
    
    // Fallback: buscar en el token de Firebase (podría tener displayName)
    const storedUser = AuthService.getUserData();
    if (storedUser?.name) {
      return storedUser.name;
    }
    
    // Último recurso: usar el correo
    return user.correo || '';
  };

  // Obtener iniciales del usuario
  const getInitials = () => {
    if (user?.iniciales) return user.iniciales;
    if (!user) return '';
    
    // Si tiene nombres y apellidos del backend
    if (user.nombres && user.apellidos) {
      const nombres = user.nombres?.split(' ')[0] || '';
      const apellidos = user.apellidos?.split(' ')[0] || '';
      return `${nombres.charAt(0)}${apellidos.charAt(0)}`.toUpperCase();
    }
    
    // Si tiene nombre_completo, extraer iniciales
    if (user.nombre_completo) {
      const partes = user.nombre_completo.split(' ').filter(p => p.length > 0);
      if (partes.length >= 2) {
        return `${partes[0].charAt(0)}${partes[partes.length - 1].charAt(0)}`.toUpperCase();
      }
      if (partes.length === 1) {
        return partes[0].substring(0, 2).toUpperCase();
      }
    }
    
    // Fallback: buscar en el token de Firebase
    const storedUser = AuthService.getUserData();
    if (storedUser?.name) {
      const partes = storedUser.name.split(' ').filter(p => p.length > 0);
      if (partes.length >= 2) {
        return `${partes[0].charAt(0)}${partes[partes.length - 1].charAt(0)}`.toUpperCase();
      }
      if (partes.length === 1) {
        return partes[0].substring(0, 2).toUpperCase();
      }
    }
    
    // Último recurso: usar las primeras 2 letras del correo
    if (user.correo) {
      return user.correo.substring(0, 2).toUpperCase();
    }
    
    return '';
  };

  const value = {
    user,
    loading,
    login,
    logout,
    updateUser,
    reloadUserProfile,
    getAuthToken,
    hasRole,
    isAuthenticated,
    getFullName,
    getInitials,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
