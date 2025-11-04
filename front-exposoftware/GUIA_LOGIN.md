# 🔐 Sistema de Autenticación - Guía Rápida

## ✅ ¡TODO LISTO PARA PROBAR!

### 📋 Credenciales de Administrador Precargadas

```json
{
  "correo": "admin@unicesar.edu.co",
  "password": "Admin123#"
}
```

**Las credenciales YA ESTÁN PRECARGADAS en el formulario de login** ✅

---

## 🚀 Cómo Probar el Login

### **Paso 1: Ir a la Página de Login**
```
http://localhost:5173/login
```

### **Paso 2: Ver las Credenciales Precargadas**
- El formulario ya tiene las credenciales del admin listas
- Verás un mensaje verde: "✅ Credenciales de Admin precargadas - Listo para probar"

### **Paso 3: Click en "Iniciar Sesión"**
- Simplemente haz click en el botón
- Verás un spinner de carga mientras se autentica
- Si todo sale bien, serás redirigido automáticamente

### **Paso 4: Esperar Redirección Automática**
- Si el login es exitoso → `/admin/dashboard`
- Si hay error → Se mostrará el mensaje en pantalla

---

## 🔍 ¿Qué Hace el Sistema?

### **1. Autenticación**
```javascript
// Envía las credenciales al backend
POST https://z6gasdnp5zp6v6egg4kg3jsitu0ffcqu.lambda-url.us-east-1.on.aws/api/v1/auth/login/admin

// Payload enviado:
{
  "correo": "admin@unicesar.edu.co",
  "password": "Admin123#"
}
```

### **2. Almacenamiento en localStorage**
Si el login es exitoso, guarda:
- ✅ `auth_token` → Token de autenticación
- ✅ `user_data` → Datos del usuario (JSON)
- ✅ `user_role` → Rol del usuario ('admin')
- ✅ `token_expires_at` → Timestamp de expiración (24h)

### **3. Redirección Automática**
- **Admin** → `/admin/dashboard`
- **Docente** → `/teacher/dashboard`
- **Estudiante** → `/student/dashboard`

### **4. Protección de Rutas**
Todas las rutas de admin ahora requieren autenticación:
- `/admin/dashboard` ✅ Protegida
- `/admin/profile` ✅ Protegida
- `/admin/crear-grupo` ✅ Protegida
- `/admin/crear-materia` ✅ Protegida
- `/admin/crear-profesor` ✅ Protegida
- `/admin/lineas-investigacion` ✅ Protegida
- `/admin/registrar-eventos` ✅ Protegida

Si intentas acceder sin login → Redirige automáticamente a `/login`

---

## 🧪 Verificar que Funciona

### **Opción 1: Ver la Consola del Navegador (F12)**
Deberías ver estos mensajes:

```
🔐 Intentando login con: { correo: "admin@unicesar.edu.co", password: "***" }
📤 Creando sesión de administrador...
✅ Token guardado: abc123xyz...
✅ Login exitoso - Datos guardados en localStorage
👤 Usuario: { id: "...", correo: "...", ... }
👤 Rol detectado: admin
```

### **Opción 2: Inspeccionar localStorage**
En la consola del navegador ejecuta:

```javascript
// Ver token
localStorage.getItem('auth_token')

// Ver datos del usuario
JSON.parse(localStorage.getItem('user_data'))

// Ver rol
localStorage.getItem('user_role')
```

### **Opción 3: Usar el AuthService**
En la consola del navegador:

```javascript
// Importar el servicio (si estás en el contexto correcto)
AuthService.isAuthenticated()  // → true
AuthService.getUserRole()      // → "admin"
AuthService.getUserData()      // → { ... }
AuthService.getToken()         // → "token..."
```

---

## 📦 Archivos Creados/Modificados

### **Nuevos Archivos:**
1. ✅ `src/Services/AuthService.jsx`
   - `loginAdmin()` - Login de administrador
   - `loginEstudiante()` - Login de estudiante
   - `loginDocente()` - Login de docente
   - `logout()` - Cerrar sesión
   - `isAuthenticated()` - Verificar autenticación
   - `getUserData()` - Obtener datos del usuario
   - `getUserRole()` - Obtener rol
   - `getAuthHeaders()` - Headers con token para peticiones

2. ✅ `src/components/ProtectedRoute.jsx`
   - Componentes para proteger rutas
   - `<AdminRoute>`, `<DocenteRoute>`, `<EstudianteRoute>`

### **Archivos Modificados:**
1. ✅ `src/utils/constants.js`
   - Agregados endpoints de autenticación
   - `LOGIN_ADMIN`, `LOGIN_ESTUDIANTE`, `LOGIN_DOCENTE`

2. ✅ `src/pages/Auth/Login.jsx`
   - Conectado con `AuthService`
   - Manejo de estados (loading, error)
   - Validaciones
   - Redirección automática
   - Credenciales precargadas para pruebas

3. ✅ `src/App.jsx`
   - Rutas de admin protegidas con `<AdminRoute>`
   - Redireccionamiento `/admin/dash` → `/admin/dashboard`

---

## 🎯 Casos de Uso

### **Caso 1: Login Exitoso**
```
1. Usuario ingresa credenciales correctas
2. Backend responde con status: "success"
3. Se guarda token y datos en localStorage
4. Usuario es redirigido a su dashboard
5. Puede navegar por todas las páginas protegidas
```

### **Caso 2: Credenciales Incorrectas**
```
1. Usuario ingresa credenciales incorrectas
2. Backend responde con status: "error"
3. Se muestra mensaje de error en pantalla
4. No se guarda nada en localStorage
5. Usuario permanece en /login
```

### **Caso 3: Token Expirado**
```
1. Usuario intenta acceder a ruta protegida
2. Sistema verifica expiración del token (24h)
3. Si expiró: se limpia localStorage y redirige a /login
4. Usuario debe iniciar sesión nuevamente
```

### **Caso 4: Acceso Directo a Ruta Protegida**
```
1. Usuario escribe /admin/dashboard en la URL
2. Sistema verifica autenticación
3. Si no está autenticado: redirige a /login
4. Si está autenticado: permite el acceso
```

---

## 🔧 Funciones Útiles del AuthService

### **Cerrar Sesión**
```javascript
import * as AuthService from './Services/AuthService';

// En cualquier componente:
const handleLogout = () => {
  AuthService.logout();
  navigate('/login');
};
```

### **Verificar Autenticación**
```javascript
if (AuthService.isAuthenticated()) {
  console.log('Usuario autenticado ✅');
} else {
  console.log('Usuario NO autenticado ❌');
}
```

### **Obtener Datos del Usuario**
```javascript
const userData = AuthService.getUserData();
console.log('Nombre:', userData.nombre);
console.log('Correo:', userData.correo);
```

### **Hacer Peticiones con Token**
```javascript
const response = await fetch(API_ENDPOINTS.MATERIAS, {
  method: 'GET',
  headers: AuthService.getAuthHeaders()
});
```

---

## ⚠️ Posibles Errores y Soluciones

### **Error: "No autorizado" (401)**
**Causa:** El backend requiere token válido
**Solución:** Verifica que el backend acepte el token que estás enviando

### **Error: "CORS bloqueado"**
**Causa:** Backend no tiene CORS habilitado
**Solución:** Contacta al equipo de backend para habilitar CORS

### **Error: "Failed to fetch"**
**Causa:** Backend no responde o hay problemas de red
**Solución:** 
1. Verifica que el backend esté activo
2. Prueba la URL en el navegador
3. Revisa tu conexión a internet

### **Error: No redirige después del login**
**Causa:** Posible error en la respuesta del backend
**Solución:**
1. Abre la consola (F12)
2. Revisa los logs
3. Verifica que `resultado.success === true`
4. Verifica que `resultado.data` contenga los datos esperados

---

## 📊 Estructura de Respuesta del Backend Esperada

### **Login Exitoso:**
```json
{
  "status": "success",
  "message": "Inicio de sesión exitoso",
  "data": {
    "id": "abc123",
    "correo": "admin@unicesar.edu.co",
    "nombre": "Administrador",
    "token": "eyJhbGciOiJIUzI1NiIs...",
    "rol": "admin"
  },
  "code": "SUCCESS"
}
```

### **Login Fallido:**
```json
{
  "status": "error",
  "message": "Credenciales incorrectas",
  "errors": [
    {
      "field": "password",
      "message": "La contraseña es incorrecta"
    }
  ],
  "code": "VALIDATION_ERROR"
}
```

---

## 🎉 ¡Listo para Probar!

1. **Abre tu aplicación:** `http://localhost:5173/login`
2. **Las credenciales ya están cargadas**
3. **Click en "Iniciar Sesión"**
4. **Espera la redirección automática**
5. **Disfruta del dashboard de admin** 🎊

---

## 📞 Debugging

Si algo no funciona:

1. **Abre la consola del navegador (F12)**
2. **Ve a la pestaña "Console"**
3. **Busca mensajes con emojis:**
   - 🔐 = Intentando login
   - ✅ = Operación exitosa
   - ❌ = Error
   - 📤 = Enviando datos
   - 📥 = Recibiendo datos
   - 👤 = Información de usuario

4. **Ve a la pestaña "Network"**
5. **Busca la petición a `/api/v1/auth/login/admin`**
6. **Revisa la respuesta del backend**

---

**Última actualización:** 29 de octubre de 2025  
**Endpoint de login:** `POST /api/v1/auth/login/admin`  
**Backend:** AWS Lambda
