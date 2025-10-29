# 🔗 Guía de Integración Frontend → Backend AWS

## ✅ Cambios Realizados

### 1. **Actualización de URL Base** (`utils/constants.js`)

```javascript
// ❌ ANTES (localhost)
export const API_BASE_URL = 'http://localhost:8000';

// ✅ AHORA (AWS Lambda)
export const API_BASE_URL = 'https://z6gasdnp5zp6v6egg4kg3jsitu0ffcqu.lambda-url.us-east-1.on.aws';
```

### 2. **Actualización de Endpoints**

Todos los endpoints ahora incluyen el prefijo `/api/v1/admin/`:

```javascript
// ✅ Endpoints actualizados
MATERIAS: `${API_BASE_URL}/api/v1/admin/materias`
GRUPOS: `${API_BASE_URL}/api/v1/admin/grupos`
DOCENTES: `${API_BASE_URL}/api/v1/admin/docentes`

// ✅ NUEVO: Endpoint para asignaciones docente-materia
ASIGNACIONES_DOCENTE: `${API_BASE_URL}/api/v1/admin/asignaciones-docentes`
```

### 3. **Manejo de Respuestas del Backend**

Tu backend devuelve respuestas con esta estructura:

```json
{
  "status": "success",
  "message": "Operación realizada exitosamente",
  "data": { ... },
  "code": "SUCCESS"
}
```

En caso de error:

```json
{
  "status": "error",
  "message": "Datos de entrada inválidos",
  "errors": [
    {
      "field": "codigo_materia",
      "message": "El formato del código es inválido",
      "type": "value_error",
      "value": "MAT-123"
    }
  ],
  "code": "VALIDATION_ERROR"
}
```

### 4. **Función `procesarRespuesta()` Agregada**

Esta función centraliza el manejo de respuestas:

- ✅ Extrae automáticamente `data` de respuestas exitosas
- ✅ Procesa arrays de errores del backend
- ✅ Formatea mensajes de error de forma legible
- ✅ Maneja respuestas JSON malformadas

---

## 🚀 Cómo Usar el Servicio

### **Ejemplo 1: Crear una Materia**

```javascript
import * as SubjectService from './Services/CreateSubject';

// En tu componente
const crearNuevaMateria = async () => {
  try {
    const resultado = await SubjectService.crearMateria({
      codigo_materia: "MAT101",
      nombre_materia: "Matemáticas I",
      ciclo_semestral: "Ciclo Básico"
    });
    
    console.log('✅ Materia creada:', resultado.data);
    console.log('📝 Mensaje:', resultado.message);
  } catch (error) {
    console.error('❌ Error:', error.message);
    alert(`Error: ${error.message}`);
  }
};
```

### **Ejemplo 2: Asignar Grupo a Materia (NUEVO)**

Ahora puedes usar el endpoint de asignaciones:

```javascript
// Cuando el usuario asigne un grupo a una materia
const asignarGrupoAMateria = async () => {
  try {
    const resultado = await SubjectService.crearAsignacionDocente({
      codigo_grupo: 202,
      codigo_materia: "MAT101",
      id_docente: "R9Kz4B19xUy78nQ6vT2s"
    });
    
    console.log('✅ Asignación creada:', resultado.data);
  } catch (error) {
    alert(`Error al asignar grupo: ${error.message}`);
  }
};
```

### **Ejemplo 3: Obtener Todas las Materias**

```javascript
const cargarMaterias = async () => {
  try {
    const materias = await SubjectService.obtenerMaterias();
    console.log('📚 Materias:', materias);
    // materias es un array directo, no necesitas hacer .data
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
};
```

---

## 🔍 Validación de Errores Mejorada

El backend devuelve errores detallados por campo:

```javascript
// Si envías datos inválidos, recibirás:
try {
  await SubjectService.crearMateria({
    codigo_materia: "", // ❌ vacío
    nombre_materia: "M",  // ❌ muy corto
    ciclo_semestral: ""   // ❌ vacío
  });
} catch (error) {
  // error.message contendrá:
  // "codigo_materia: El código es obligatorio
  //  nombre_materia: El nombre debe tener al menos 3 caracteres
  //  ciclo_semestral: Debe seleccionar un ciclo"
}
```

---

## 📋 Códigos de Estado HTTP Manejados

| Código | Significado | Manejo |
|--------|-------------|--------|
| 200/201 | ✅ Éxito | Retorna `{ success: true, data, message }` |
| 400 | ❌ Solicitud incorrecta | Lanza error con mensaje detallado |
| 401 | ❌ No autorizado | Lanza error pidiendo login |
| 404 | ❌ No encontrado | Lanza error "recurso no existe" |
| 409 | ❌ Conflicto | Lanza error "ya existe" |
| 422 | ❌ Validación | Lanza error con campos específicos |
| 429 | ⏱️ Rate limit | Lanza error "demasiadas peticiones" |
| 500 | 💥 Error servidor | Lanza error "error interno" |

---

## 🧪 Pruebas Recomendadas

### **1. Probar Conexión Básica**

Abre la consola del navegador y ejecuta:

```javascript
// En DevTools Console:
fetch('https://z6gasdnp5zp6v6egg4kg3jsitu0ffcqu.lambda-url.us-east-1.on.aws/api/v1/admin/materias')
  .then(r => r.json())
  .then(data => console.log('✅ Respuesta:', data))
  .catch(err => console.error('❌ Error:', err));
```

### **2. Verificar CORS**

Si recibes errores de CORS, el backend necesita configurar:
- `Access-Control-Allow-Origin: *` (o tu dominio específico)
- `Access-Control-Allow-Methods: GET, POST, PUT, DELETE`
- `Access-Control-Allow-Headers: Content-Type, Accept`

### **3. Test de Creación**

```javascript
// Intenta crear una materia de prueba
SubjectService.crearMateria({
  codigo_materia: "TEST01",
  nombre_materia: "Materia de Prueba",
  ciclo_semestral: "Ciclo Básico"
})
.then(r => console.log('✅ Creada:', r))
.catch(e => console.error('❌ Error:', e.message));
```

---

## ⚠️ Posibles Problemas y Soluciones

### **Error: "NetworkError" o "Failed to fetch"**

**Causa:** Problemas de CORS o backend no responde

**Solución:**
1. Verifica que el backend esté activo: https://z6gasdnp5zp6v6egg4kg3jsitu0ffcqu.lambda-url.us-east-1.on.aws/docs
2. Contacta al backend para habilitar CORS
3. Verifica headers en la consola de red (F12 → Network)

### **Error: "Unauthorized" o 401**

**Causa:** Falta token de autenticación

**Solución:** Agrega headers de autenticación:

```javascript
// En Services/CreateSubject.jsx
const headers = {
  'Content-Type': 'application/json',
  'Accept': 'application/json',
  'Authorization': `Bearer ${tuTokenDeAutenticacion}`
};
```

### **Error: "La materia ya existe" (409)**

**Causa:** Código de materia duplicado

**Solución:** Usar códigos únicos o implementar lógica de actualización

---

## 📦 Nuevas Funciones Disponibles

### En `Services/CreateSubject.jsx`:

1. ✅ `obtenerMaterias()` - GET todas las materias
2. ✅ `obtenerGrupos()` - GET todos los grupos  
3. ✅ `obtenerDocentes()` - GET todos los docentes
4. ✅ `crearMateria(datos)` - POST nueva materia
5. ✅ `actualizarMateria(id, datos)` - PUT materia existente
6. ✅ `eliminarMateria(id)` - DELETE materia
7. ✅ `filtrarMaterias(materias, termino)` - Filtrado local
8. ✅ `validarDatosMateria(datos)` - Validación antes de enviar
9. ✅ **NUEVO:** `crearAsignacionDocente(datos)` - POST asignación grupo-materia

---

## 🎯 Próximos Pasos

1. **Probar endpoint de materias:** Abre `/docs` del backend y prueba GET materias
2. **Verificar estructura de respuesta:** Confirma que coincida con lo esperado
3. **Implementar autenticación:** Si el backend requiere tokens
4. **Crear funciones similares:** Para grupos, docentes, estudiantes, etc.
5. **Agregar loading states:** Mientras se hacen peticiones al backend

---

## 📞 Soporte

Si encuentras problemas:
1. Abre la consola del navegador (F12)
2. Ve a la pestaña "Network"
3. Observa las peticiones y respuestas
4. Revisa los logs con los emojis: 📤 📥 ✅ ❌

---

**Última actualización:** 28 de octubre de 2025  
**Backend URL:** https://z6gasdnp5zp6v6egg4kg3jsitu0ffcqu.lambda-url.us-east-1.on.aws  
**Documentación Backend:** [/docs](https://z6gasdnp5zp6v6egg4kg3jsitu0ffcqu.lambda-url.us-east-1.on.aws/docs)
