# Estructura del Endpoint de Crear Materia

## 📋 Resumen
Este documento describe la estructura de datos y el manejo de respuestas para el endpoint de creación de materias en el sistema Expo-software 2025.

---

## 🔗 Endpoint
```
POST /materias
PUT /materias/:id
DELETE /materias/:id
GET /materias
```

---

## 📤 Estructura del Request (Payload)

### Objeto Principal
```json
{
  "materia": {
    "codigo_materia": "PROG3",
    "nombre_materia": "Programación III",
    "ciclo_semestral": "Ciclo Profesional"
  },
  "grupos_con_docentes": [
    {
      "codigo_grupo": 101,
      "id_docente": "BU7rpAz6Nbn9DKq517wb"
    },
    {
      "codigo_grupo": 102,
      "id_docente": "TEElkzBShoDC6beuFjHE"
    }
  ]
}
```

### Descripción de Campos

#### `materia` (Object - Requerido)
Información principal de la materia a crear.

| Campo | Tipo | Requerido | Descripción | Ejemplo |
|-------|------|-----------|-------------|---------|
| `codigo_materia` | String | ✅ Sí | Código único de identificación de la materia (se convierte a mayúsculas automáticamente) | `"PROG3"`, `"BD2"`, `"IA1"` |
| `nombre_materia` | String | ✅ Sí | Nombre completo de la materia | `"Programación III"` |
| `ciclo_semestral` | String | ✅ Sí | Ciclo al que pertenece la materia | `"Ciclo Básico"`, `"Ciclo Profesional"`, `"Ciclo de Profundización"` |

#### `grupos_con_docentes` (Array - Requerido)
Lista de grupos asignados a la materia, cada uno con su docente responsable.

| Campo | Tipo | Requerido | Descripción | Ejemplo |
|-------|------|-----------|-------------|---------|
| `codigo_grupo` | Number | ✅ Sí | Número identificador del grupo | `101`, `102`, `201` |
| `id_docente` | String | ✅ Sí | ID del docente asignado al grupo (Firebase ID) | `"BU7rpAz6Nbn9DKq517wb"` |

**Nota:** Debe haber al menos un grupo asignado. Cada grupo debe tener un docente asociado.

---

## 📥 Códigos de Respuesta HTTP

### ✅ Respuestas Exitosas

#### 201 - Created
**Descripción:** Recurso creado exitosamente

**Ejemplo de Respuesta:**
```json
{
  "message": "Materia creada exitosamente",
  "id": "mat123abc",
  "data": {
    "codigo_materia": "PROG3",
    "nombre_materia": "Programación III",
    "ciclo_semestral": "Ciclo Profesional",
    "grupos_con_docentes": [...]
  }
}
```

**Acción en el Frontend:**
- Mostrar mensaje de éxito
- Recargar lista de materias
- Limpiar formulario

---

### ❌ Respuestas de Error

#### 400 - Bad Request
**Descripción:** Solicitud incorrecta - Los datos enviados no tienen el formato correcto

**Causas Comunes:**
- Falta algún campo requerido
- Tipo de dato incorrecto (ej: enviar string donde se espera número)
- Array de grupos vacío
- Estructura JSON malformada

**Ejemplo de Respuesta:**
```json
{
  "message": "Solicitud incorrecta",
  "detail": "El campo 'codigo_materia' es requerido"
}
```

**Validaciones en el Frontend:**
```javascript
// Validar campos requeridos
if (!codigoMateria || !nombreMateria || !cicloSemestral) {
  alert("Por favor complete todos los campos obligatorios");
  return;
}

// Validar al menos un grupo
if (gruposSeleccionados.length === 0) {
  alert("Por favor seleccione al menos un grupo");
  return;
}
```

---

#### 401 - Unauthorized
**Descripción:** No autorizado - El usuario no ha iniciado sesión o su token ha expirado

**Causas Comunes:**
- Token de autenticación faltante o inválido
- Sesión expirada
- Usuario no autenticado

**Ejemplo de Respuesta:**
```json
{
  "message": "No autorizado",
  "detail": "Debe iniciar sesión para realizar esta acción"
}
```

**Acción en el Frontend:**
- Redirigir al usuario a la página de login
- Limpiar tokens almacenados
- Mostrar mensaje solicitando nueva autenticación

---

#### 403 - Forbidden
**Descripción:** Sin permisos suficientes - El usuario no tiene los privilegios necesarios

**Causas Comunes:**
- Usuario autenticado pero sin rol de administrador
- Permisos insuficientes para crear/editar materias
- Restricciones por tipo de cuenta

**Ejemplo de Respuesta:**
```json
{
  "message": "Sin permisos suficientes",
  "detail": "Solo los administradores pueden crear materias"
}
```

**Acción en el Frontend:**
- Mostrar mensaje de permisos insuficientes
- Deshabilitar botones de creación/edición según rol
- Verificar rol del usuario antes de mostrar formulario

---

#### 409 - Conflict
**Descripción:** Conflicto - El recurso ya existe

**Causas Comunes:**
- Código de materia duplicado
- Grupo ya asignado a otra materia
- Conflicto en la base de datos

**Ejemplo de Respuesta:**
```json
{
  "message": "Conflicto",
  "detail": "Ya existe una materia con el código 'PROG3'"
}
```

**Acción en el Frontend:**
- Resaltar el campo conflictivo (código_materia)
- Sugerir código alternativo
- Permitir al usuario modificar el código

---

#### 422 - Unprocessable Entity
**Descripción:** Error de validación - Los datos son correctos en formato pero no pasan las reglas de negocio

**Causas Comunes:**
- Código de materia con formato inválido
- Ciclo semestral no válido
- ID de docente no existe
- Código de grupo no existe
- Reglas de negocio no cumplidas

**Ejemplo de Respuesta:**
```json
{
  "message": "Error de validación",
  "detail": "El código de materia debe tener entre 2 y 10 caracteres",
  "errors": {
    "codigo_materia": "Formato inválido",
    "grupos_con_docentes[0].id_docente": "El docente no existe"
  }
}
```

**Validaciones en el Frontend:**
```javascript
// Validar formato de código
const codigoValido = /^[A-Z0-9]{2,10}$/.test(codigoMateria);

// Validar ciclo semestral
const ciclosPermitidos = [
  "Ciclo Básico",
  "Ciclo Profesional", 
  "Ciclo de Profundización"
];
const cicloValido = ciclosPermitidos.includes(cicloSemestral);

// Validar que los IDs de docentes existan
const docentesValidos = gruposSeleccionados.every(grupo => 
  grupo.id_docente && grupo.id_docente.trim() !== ""
);
```

---

## 🔄 Flujo Completo de Creación

### 1. Validación en el Frontend
```javascript
// Paso 1: Validar campos requeridos
if (!codigoMateria || !nombreMateria || !cicloSemestral) {
  alert("Complete todos los campos obligatorios");
  return;
}

// Paso 2: Validar al menos un grupo
if (gruposSeleccionados.length === 0) {
  alert("Seleccione al menos un grupo");
  return;
}

// Paso 3: Construir payload
const payload = {
  materia: {
    codigo_materia: codigoMateria.toUpperCase(),
    nombre_materia: nombreMateria,
    ciclo_semestral: cicloSemestral
  },
  grupos_con_docentes: gruposSeleccionados
};
```

### 2. Envío al Backend
```javascript
const response = await fetch(API_ENDPOINTS.MATERIAS, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(payload)
});
```

### 3. Manejo de Respuesta
```javascript
if (response.status === 201) {
  // Éxito
  await cargarMaterias();
  alert("✅ Materia creada exitosamente");
  limpiarFormulario();
} else if (response.status === 400) {
  // Solicitud incorrecta
  alert("❌ Verifique los datos ingresados");
} else if (response.status === 401) {
  // No autorizado
  redirectToLogin();
} else if (response.status === 403) {
  // Sin permisos
  alert("❌ No tiene permisos para crear materias");
} else if (response.status === 409) {
  // Conflicto
  alert("❌ Ya existe una materia con ese código");
} else if (response.status === 422) {
  // Error de validación
  alert("❌ Los datos no son válidos");
}
```

---

## 🛠️ Implementación Actual

### Archivos Involucrados

1. **`src/pages/Admin/CreateSubject.jsx`**
   - Componente de interfaz de usuario
   - Formulario de creación/edición
   - Tabla de materias existentes

2. **`src/pages/Admin/useSubjectManagement.jsx`**
   - Custom Hook con toda la lógica
   - Funciones CRUD (Create, Read, Update, Delete)
   - Manejo de estados y validaciones

3. **`src/utils/constants.js`**
   - Definición de endpoints
   - URL base del API

### Variables en el Hook

```javascript
// Estado del formulario
const [codigoMateria, setCodigoMateria] = useState("");
const [nombreMateria, setNombreMateria] = useState("");
const [cicloSemestral, setCicloSemestral] = useState("");

// Grupos
const [gruposDisponibles, setGruposDisponibles] = useState([]);
const [gruposSeleccionados, setGruposSeleccionados] = useState([]);

// Materias
const [materias, setMaterias] = useState([]);

// Profesores
const [profesores, setProfesores] = useState([]);
```

### Funciones Principales

```javascript
// Crear materia
handleSubmit(e) - Envía POST a /materias

// Editar materia
handleEdit(materia) - Carga datos en el formulario
handleSaveEdit(e) - Envía PUT a /materias/:id

// Eliminar materia
handleDelete(id) - Envía DELETE a /materias/:id

// Cargar datos
cargarMaterias() - GET /materias
cargarGrupos() - GET /grupos
cargarProfesores() - GET /docentes
```

---

## ✅ Checklist de Validaciones

### Frontend (Antes de enviar)
- [x] Código de materia no vacío
- [x] Nombre de materia no vacío
- [x] Ciclo semestral seleccionado
- [x] Al menos un grupo seleccionado
- [x] Código de materia en mayúsculas
- [x] Cada grupo tiene un docente asignado

### Backend (Esperado)
- [ ] Código de materia único
- [ ] Formato de código válido
- [ ] Ciclo semestral válido
- [ ] IDs de docentes existen
- [ ] Códigos de grupos existen
- [ ] Usuario autenticado
- [ ] Usuario tiene permisos de administrador

---

## 🎯 Mejoras Implementadas

1. **Manejo específico de códigos HTTP**
   - Cada código de error tiene su propio manejo
   - Mensajes descriptivos para el usuario

2. **Validaciones en el frontend**
   - Campos requeridos antes de enviar
   - Al menos un grupo obligatorio
   - Conversión automática a mayúsculas del código

3. **Logging detallado**
   - Console.log con emojis para mejor visualización
   - JSON formateado para debugging
   - Tracking de respuestas del servidor

4. **Manejo de errores robusto**
   - Try-catch para errores de conexión
   - .catch() para JSONs inválidos
   - Mensajes alternativos si no hay detail/message

---

## 📝 Ejemplo Completo de Uso

```javascript
// 1. Usuario llena el formulario
codigoMateria = "PROG3"
nombreMateria = "Programación III"
cicloSemestral = "Ciclo Profesional"

// 2. Usuario selecciona grupos
gruposSeleccionados = [
  { codigo_grupo: 101, id_docente: "BU7rpAz6Nbn9DKq517wb" },
  { codigo_grupo: 102, id_docente: "TEElkzBShoDC6beuFjHE" }
]

// 3. Usuario hace clic en "Crear Materia"
handleSubmit() se ejecuta

// 4. Se construye el payload
{
  "materia": {
    "codigo_materia": "PROG3",
    "nombre_materia": "Programación III",
    "ciclo_semestral": "Ciclo Profesional"
  },
  "grupos_con_docentes": [
    { "codigo_grupo": 101, "id_docente": "BU7rpAz6Nbn9DKq517wb" },
    { "codigo_grupo": 102, "id_docente": "TEElkzBShoDC6beuFjHE" }
  ]
}

// 5. Se envía POST a http://localhost:8000/materias

// 6. Backend responde con 201
{
  "message": "Materia creada exitosamente",
  "id": "mat_xyz123"
}

// 7. Frontend recarga la lista y muestra mensaje de éxito
✅ Materia creada exitosamente
```

---

## 🚨 Casos de Error Comunes

### Error 400 - Grupo vacío
```javascript
// ❌ MAL - No hay grupos
grupos_con_docentes: []

// ✅ BIEN - Al menos un grupo
grupos_con_docentes: [
  { codigo_grupo: 101, id_docente: "abc123" }
]
```

### Error 409 - Código duplicado
```javascript
// Si ya existe una materia con código "PROG3"
// Usuario intenta crear otra con el mismo código
// Backend rechaza con 409

// Solución: Cambiar el código
codigo_materia: "PROG3B" // o "PROG4", etc.
```

### Error 422 - Docente no existe
```javascript
// ❌ MAL - ID de docente inválido
{ codigo_grupo: 101, id_docente: "id_falso_123" }

// ✅ BIEN - ID de docente válido de la base de datos
{ codigo_grupo: 101, id_docente: "BU7rpAz6Nbn9DKq517wb" }
```

---

## 🔍 Testing y Debugging

### Console Logs Implementados
```javascript
// Al enviar
console.log('📤 Enviando al backend:', JSON.stringify(payload, null, 2));

// Al recibir éxito
console.log('✅ Respuesta del backend:', data);

// Al recibir error
console.error('❌ Error del servidor:', errorData);

// Al actualizar
console.log('📤 Actualizando en backend (ID: ' + editingId + ')');

// Al eliminar
console.log('🗑️ Eliminando del backend - ID:', id);
```

### Cómo Probar
1. Abrir Developer Tools (F12)
2. Ir a la pestaña Console
3. Intentar crear una materia
4. Observar los logs con emojis
5. Verificar el payload enviado
6. Verificar la respuesta recibida

---

## 📚 Referencias

- **Hook Principal:** `src/pages/Admin/useSubjectManagement.jsx`
- **Componente UI:** `src/pages/Admin/CreateSubject.jsx`
- **Constantes:** `src/utils/constants.js`
- **Endpoint Base:** `http://localhost:8000/materias`

---

**Última actualización:** 27 de octubre de 2025
**Autor:** Sistema Expo-software 2025
**Versión:** 1.0.0
