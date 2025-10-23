import React, { createContext, useContext, useState, useEffect } from 'react';

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
        // Intentar obtener datos del usuario desde localStorage
        const storedUser = localStorage.getItem('userData');
        
        if (storedUser) {
          const userData = JSON.parse(storedUser);
          setUser(userData);
        } else {
          // Si no hay datos en localStorage, usar datos de prueba
          // En producción, esto vendría de tu API
          
          // EJEMPLO ESTUDIANTE:
          const mockUser = {
            id_usuario: 1,
            identificacion: "1098765432",
            nombres: "Cristian Ricardo",
            apellidos: "Guzman Martinez",
            correo: "crguzman@unicesar.edu.co",
            telefono: "3001234567",
            rol: "estudiante", // "estudiante", "docente", "administrador"
            
            // Datos específicos para estudiantes
            id_estudiante: 101,
            codigo_programa: "12345",
            semestre: 5,
            fecha_ingreso: "2022-02-01",
            anio_ingreso: "2022",
            periodo: "2022-I",
            
            // Datos personales adicionales
            tipo_documento: "CC",
            genero: "Masculino",
            fecha_nacimiento: "2000-05-15",
            pais: "CO",
            nacionalidad: "CO",
            departamento_residencia: "Cesar",
            ciudad_residencia: "Valledupar",
            
            // Avatar/Iniciales
            avatar: null,
            iniciales: "CG",
            
            // Metadata
            fecha_creacion: new Date().toISOString(),
            ultimo_acceso: new Date().toISOString(),
          };

          // EJEMPLO DOCENTE (Para probar el perfil de docente, descomenta esto y comenta el mockUser de arriba):
          /*
          const mockUser = {
            id_usuario: 2,
            identificacion: "40123456",
            nombres: "María Elena",
            apellidos: "Rodriguez Pérez",
            correo: "merodriguez@unicesar.edu.co",
            telefono: "3201234567",
            rol: "docente",
            
            // Datos específicos para docentes (3 campos propios)
            id_docente: 201,
            categoria_docente: "Interno", // "Interno", "Invitado", "Externo"
            codigo_programa: "67890",
            
            // Datos personales adicionales (heredados de Usuarios)
            tipo_documento: "CC",
            genero: "Femenino",
            identidad_sexual: "Heterosexual",
            fecha_nacimiento: "1980-03-15",
            direccion_residencia: "Calle 15 #23-45",
            anio_ingreso: "2015",
            periodo: 1,
            ciudad_residencia: "Valledupar",
            departamento_residencia: "Cesar",
            departamento: "Cesar",
            municipio: "Valledupar",
            pais: "CO",
            nacionalidad: "CO",
            ciudad: "Valledupar",
            
            // Avatar/Iniciales
            avatar: null,
            iniciales: "MR",
            
            // Metadata
            fecha_creacion: new Date().toISOString(),
            ultimo_acceso: new Date().toISOString(),
          };
          */
          
          setUser(mockUser);
          // Guardar en localStorage para persistencia
          localStorage.setItem('userData', JSON.stringify(mockUser));
        }
      } catch (error) {
        console.error('Error cargando datos del usuario:', error);
      } finally {
        setLoading(false);
      }
    };

    loadUserData();
  }, []);

  // Función para hacer login
  const login = async (credentials) => {
    try {
      setLoading(true);
      
      //  la llamada a la API
      // const response = await fetch('/api/auth/login', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(credentials)
      // });
      // const userData = await response.json();
      
      // Por ahora, usar datos de prueba
      const userData = {
        id_usuario: 1,
        identificacion: credentials.identificacion || "1098765432",
        nombres: "Cristian Ricardo",
        apellidos: "Guzman Martinez",
        correo: credentials.correo || "crguzman@unicesar.edu.co",
        telefono: "3001234567",
        rol: "estudiante",
        id_estudiante: 101,
        codigo_programa: "12345",
        semestre: 5,
        fecha_ingreso: "2022-02-01",
        anio_ingreso: "2022",
        periodo: "2022-I",
        tipo_documento: "CC",
        genero: "Masculino",
        fecha_nacimiento: "2000-05-15",
        pais: "CO",
        nacionalidad: "CO",
        departamento_residencia: "Cesar",
        ciudad_residencia: "Valledupar",
        avatar: null,
        iniciales: "CG",
        fecha_creacion: new Date().toISOString(),
        ultimo_acceso: new Date().toISOString(),
      };

      setUser(userData);
      localStorage.setItem('userData', JSON.stringify(userData));
      localStorage.setItem('authToken', 'mock-token-12345'); // Token de autenticación
      
      return { success: true, user: userData };
    } catch (error) {
      console.error('Error en login:', error);
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  // Función para hacer logout
  const logout = () => {
    setUser(null);
    localStorage.removeItem('userData');
    localStorage.removeItem('authToken');
  };

  // Función para actualizar datos del usuario
  const updateUser = (newData) => {
    const updatedUser = { ...user, ...newData };
    setUser(updatedUser);
    localStorage.setItem('userData', JSON.stringify(updatedUser));
  };

  // Función para obtener el token de autenticación
  const getAuthToken = () => {
    return localStorage.getItem('authToken');
  };

  // Verificar si el usuario tiene un rol específico
  const hasRole = (role) => {
    return user?.rol === role;
  };

  // Verificar si el usuario está autenticado
  const isAuthenticated = () => {
    return user !== null && getAuthToken() !== null;
  };

  // Obtener nombre completo del usuario
  const getFullName = () => {
    if (!user) return '';
    return `${user.nombres} ${user.apellidos}`.trim();
  };

  // Obtener iniciales del usuario
  const getInitials = () => {
    if (user?.iniciales) return user.iniciales;
    if (!user) return '';
    
    const nombres = user.nombres?.split(' ')[0] || '';
    const apellidos = user.apellidos?.split(' ')[0] || '';
    return `${nombres.charAt(0)}${apellidos.charAt(0)}`.toUpperCase();
  };

  const value = {
    user,
    loading,
    login,
    logout,
    updateUser,
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
