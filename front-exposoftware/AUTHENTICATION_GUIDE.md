# 🔐 Guía de Autenticación - Expo-software 2025

## 📋 Tabla de Contenidos
1. [Descripción General](#descripción-general)
2. [Estructura de Datos del Usuario](#estructura-de-datos-del-usuario)
3. [Uso del AuthContext](#uso-del-authcontext)
4. [Funciones Disponibles](#funciones-disponibles)
5. [Ejemplos de Implementación](#ejemplos-de-implementación)
6. [Integración con Backend](#integración-con-backend)

---

## 📖 Descripción General

El sistema de autenticación utiliza **React Context API** para gestionar el estado global del usuario autenticado. Esto permite que cualquier componente de la aplicación pueda acceder a los datos del usuario sin necesidad de pasar props manualmente.

### Características principales:
- ✅ Gestión centralizada del estado de autenticación
- ✅ Persistencia en localStorage
- ✅ Datos específicos por rol (estudiante, docente, administrador)
- ✅ Funciones helper para nombre completo, iniciales, etc.
- ✅ Verificación de roles
- ✅ Tokens de autenticación

---

## 👤 Estructura de Datos del Usuario

### Datos Comunes (Todos los roles)
```javascript
{
  // Identificación
  id_usuario: 1,
  identificacion: "1098765432",
  tipo_documento: "CC",
  
  // Información personal
  nombres: "Cristian Ricardo",
  apellidos: "Guzman Martinez",
  correo: "crguzman@unicesar.edu.co",
  telefono: "3001234567",
  genero: "Masculino",
  fecha_nacimiento: "2000-05-15",
  
  // Ubicación
  pais: "CO",
  nacionalidad: "CO",
  departamento_residencia: "Cesar",
  ciudad_residencia: "Valledupar",
  
  // Rol y acceso
  rol: "estudiante", // "estudiante", "docente", "administrador"
  
  // UI
  avatar: null,
  iniciales: "CG",
  
  // Metadata
  fecha_creacion: "2025-10-23T10:00:00Z",
  ultimo_acceso: "2025-10-23T10:00:00Z"
}
```

### Datos Específicos - Estudiante
```javascript
{
  // ... datos comunes
  id_estudiante: 101,
  codigo_programa: "12345",
  semestre: 5,
  fecha_ingreso: "2022-02-01",
  anio_ingreso: "2022",
  periodo: "2022-I"
}
```

### Datos Específicos - Docente
```javascript
{
  // ... datos comunes
  id_docente: 201,
  categoria_docente: "Titular",
  codigo_programa: "67890",
  activo: true
}
```

### Datos Específicos - Administrador
```javascript
{
  // ... datos comunes
  id_administrador: 301,
  departamento: "Sistemas e Informática",
  permisos: ["gestionar_usuarios", "gestionar_proyectos", "gestionar_convocatorias"]
}
```

---

## 🎯 Uso del AuthContext

### 1. Importar el Hook
```javascript
import { useAuth } from "../../contexts/AuthContext";
```

### 2. Usar en un Componente
```javascript
export default function MiComponente() {
  const { user, getFullName, getInitials, logout, loading } = useAuth();
  
  if (loading) {
    return <div>Cargando...</div>;
  }
  
  return (
    <div>
      <h1>Bienvenido, {getFullName()}</h1>
      <p>Rol: {user?.rol}</p>
    </div>
  );
}
```

---

## 🛠️ Funciones Disponibles

### `user`
Objeto con todos los datos del usuario autenticado.

```javascript
const { user } = useAuth();
console.log(user.nombres); // "Cristian Ricardo"
console.log(user.correo); // "crguzman@unicesar.edu.co"
console.log(user.rol); // "estudiante"
```

### `loading`
Booleano que indica si se están cargando los datos del usuario.

```javascript
const { loading } = useAuth();
if (loading) return <LoadingSpinner />;
```

### `login(credentials)`
Función para iniciar sesión. Retorna un objeto con `success` y `user` o `error`.

```javascript
const { login } = useAuth();

const handleLogin = async () => {
  const result = await login({
    correo: "usuario@unicesar.edu.co",
    password: "contraseña123"
  });
  
  if (result.success) {
    console.log("Login exitoso", result.user);
    navigate("/dashboard");
  } else {
    console.error("Error:", result.error);
  }
};
```

### `logout()`
Función para cerrar sesión. Limpia el usuario y el localStorage.

```javascript
const { logout } = useAuth();
const navigate = useNavigate();

const handleLogout = () => {
  logout();
  navigate('/login');
};
```

### `updateUser(newData)`
Función para actualizar datos del usuario en el contexto y localStorage.

```javascript
const { updateUser } = useAuth();

const actualizarPerfil = () => {
  updateUser({
    telefono: "3001234567",
    ciudad_residencia: "Valledupar"
  });
};
```

### `getAuthToken()`
Retorna el token de autenticación almacenado.

```javascript
const { getAuthToken } = useAuth();

const fetchData = async () => {
  const token = getAuthToken();
  const response = await fetch('/api/data', {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
};
```

### `hasRole(role)`
Verifica si el usuario tiene un rol específico.

```javascript
const { hasRole } = useAuth();

if (hasRole('administrador')) {
  // Mostrar panel de administrador
}
```

### `isAuthenticated()`
Verifica si hay un usuario autenticado.

```javascript
const { isAuthenticated } = useAuth();

if (!isAuthenticated()) {
  navigate('/login');
}
```

### `getFullName()`
Retorna el nombre completo del usuario.

```javascript
const { getFullName } = useAuth();
console.log(getFullName()); // "Cristian Ricardo Guzman Martinez"
```

### `getInitials()`
Retorna las iniciales del usuario.

```javascript
const { getInitials } = useAuth();
console.log(getInitials()); // "CG"
```

---

## 💡 Ejemplos de Implementación

### Ejemplo 1: Header con información del usuario
```javascript
import { useAuth } from "../../contexts/AuthContext";

export default function Header() {
  const { user, getFullName, getInitials, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="bg-white border-b">
      <div className="flex items-center justify-between">
        <h1>Expo-software 2025</h1>
        
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
              <span className="text-green-600 font-bold">{getInitials()}</span>
            </div>
            <div>
              <p className="font-medium">{getFullName()}</p>
              <p className="text-sm text-gray-500 capitalize">{user?.rol}</p>
            </div>
          </div>
          
          <button onClick={handleLogout} className="text-red-600">
            Cerrar Sesión
          </button>
        </div>
      </div>
    </header>
  );
}
```

### Ejemplo 2: Proteger rutas según rol
```javascript
import { useAuth } from "../../contexts/AuthContext";
import { Navigate } from "react-router-dom";

export default function AdminRoute({ children }) {
  const { user, loading, isAuthenticated, hasRole } = useAuth();

  if (loading) {
    return <div>Cargando...</div>;
  }

  if (!isAuthenticated()) {
    return <Navigate to="/login" />;
  }

  if (!hasRole('administrador')) {
    return <Navigate to="/unauthorized" />;
  }

  return children;
}
```

### Ejemplo 3: Formulario de perfil
```javascript
import { useState } from "react";
import { useAuth } from "../../contexts/AuthContext";

export default function Profile() {
  const { user, updateUser } = useAuth();
  const [formData, setFormData] = useState({
    telefono: user?.telefono || "",
    ciudad_residencia: user?.ciudad_residencia || ""
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    updateUser(formData);
    alert("Perfil actualizado");
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        value={formData.telefono}
        onChange={(e) => setFormData({...formData, telefono: e.target.value})}
        placeholder="Teléfono"
      />
      <input
        value={formData.ciudad_residencia}
        onChange={(e) => setFormData({...formData, ciudad_residencia: e.target.value})}
        placeholder="Ciudad"
      />
      <button type="submit">Guardar</button>
    </form>
  );
}
```

### Ejemplo 4: Registrar proyecto con datos del usuario
```javascript
import { useAuth } from "../../contexts/AuthContext";

export default function RegisterProject() {
  const { user, getAuthToken } = useAuth();

  const submitProject = async (formData) => {
    const token = getAuthToken();
    
    // Agregar datos del usuario al formulario
    const dataToSend = {
      ...formData,
      id_estudiante: user.id_estudiante,
      id_usuario: user.id_usuario,
      correo_autor: user.correo,
      nombre_autor: `${user.nombres} ${user.apellidos}`
    };

    const response = await fetch('/api/proyectos', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(dataToSend)
    });

    return await response.json();
  };

  return (
    <div>
      {/* Formulario aquí */}
    </div>
  );
}
```

---

## 🔌 Integración con Backend

### Configurar el Login
Edita la función `login` en `src/contexts/AuthContext.jsx`:

```javascript
const login = async (credentials) => {
  try {
    setLoading(true);
    
    // Llamada real a tu API
    const response = await fetch('http://tu-api.com/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials)
    });

    if (!response.ok) {
      throw new Error('Credenciales inválidas');
    }

    const data = await response.json();
    const userData = data.user;
    const token = data.token;

    setUser(userData);
    localStorage.setItem('userData', JSON.stringify(userData));
    localStorage.setItem('authToken', token);
    
    return { success: true, user: userData };
  } catch (error) {
    console.error('Error en login:', error);
    return { success: false, error: error.message };
  } finally {
    setLoading(false);
  }
};
```

### Cargar Usuario desde Token
Edita el `useEffect` inicial en `src/contexts/AuthContext.jsx`:

```javascript
useEffect(() => {
  const loadUserData = async () => {
    try {
      const token = localStorage.getItem('authToken');
      
      if (token) {
        // Validar token con el backend
        const response = await fetch('http://tu-api.com/api/auth/me', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.ok) {
          const userData = await response.json();
          setUser(userData);
          localStorage.setItem('userData', JSON.stringify(userData));
        } else {
          // Token inválido
          localStorage.removeItem('authToken');
          localStorage.removeItem('userData');
        }
      }
    } catch (error) {
      console.error('Error cargando datos del usuario:', error);
    } finally {
      setLoading(false);
    }
  };

  loadUserData();
}, []);
```

---

## 🎨 Personalización

### Cambiar datos de prueba
Edita `src/contexts/AuthContext.jsx` en el `useEffect` inicial:

```javascript
const mockUser = {
  // Personaliza estos datos según necesites
  nombres: "Tu Nombre",
  apellidos: "Tus Apellidos",
  correo: "tu@email.com",
  rol: "estudiante", // o "docente", "administrador"
  // ... más datos
};
```

---

## 🐛 Troubleshooting

### El usuario no se carga
1. Verifica que `AuthProvider` esté envolviendo tu aplicación en `main.jsx`
2. Revisa la consola del navegador en busca de errores
3. Verifica que localStorage esté habilitado en tu navegador

### Los datos no persisten al recargar
1. Asegúrate de que `localStorage.setItem` se esté llamando correctamente
2. Verifica que no haya código que limpie localStorage inadvertidamente

### Problemas con el token
1. Verifica que el token se esté guardando: `localStorage.getItem('authToken')`
2. Asegúrate de que el backend esté aceptando el formato del token
3. Revisa que el header Authorization se esté enviando correctamente

---

## 📞 Soporte

Para preguntas o problemas, contacta al equipo de desarrollo de Expo-software 2025.

**Fecha de actualización:** 23 de octubre de 2025
