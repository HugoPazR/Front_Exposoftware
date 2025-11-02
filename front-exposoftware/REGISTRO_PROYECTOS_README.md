# 📋 Documentación: Registro de Proyectos

## 🎯 Resumen de Cambios

Se ha refactorizado completamente el componente `RegisterProject.jsx` y creado el servicio `RegisterProjectService.js` para que coincida con el formato del backend.

---

## 📁 Archivos Modificados/Creados

### ✅ Nuevo Archivo
- `src/Services/RegisterProjectService.js` - Servicio completo para gestión de proyectos

### 🔧 Archivo Modificado
- `src/pages/Student/RegisterProject.jsx` - Refactorizado completamente

---

## 🔌 Endpoints Utilizados

### 1. **GET /api/v1/estudiantes**
Obtiene la lista de todos los estudiantes para seleccionar participantes.

**Respuesta transformada:**
```javascript
[
  {
    id: "CUaUUmOxHsbsv047JO9bNSoLrUh2",
    nombre: "Juan Pérez García",
    correo: "juan.perez@example.com"
  }
]
```

### 2. **GET /api/v1/docentes**
Obtiene la lista de docentes disponibles.

**Respuesta transformada:**
```javascript
[
  {
    id: "c5i6cZpo7vhBzgfyLhmOAfh22Yh2",
    nombre: "Dr. María González",
    correo: "maria.gonzalez@example.com"
  }
]
```

### 3. **GET /api/v1/lineas_investigacion**
Obtiene líneas de investigación.

**Respuesta transformada:**
```javascript
[
  {
    codigo: 1,
    nombre: "Inteligencia Artificial"
  }
]
```

### 4. **GET /api/v1/sublineas_investigacion**
Obtiene sublíneas de investigación (se filtran por línea en el frontend).

**Respuesta transformada:**
```javascript
[
  {
    codigo: 2,
    nombre: "Machine Learning",
    codigoLinea: 1
  }
]
```

### 5. **GET /api/v1/areas_tematicas**
Obtiene áreas temáticas.

**Respuesta transformada:**
```javascript
[
  {
    codigo: 1,
    nombre: "Desarrollo de Software"
  }
]
```

### 6. **GET /api/v1/materias** (Opcional)
Obtiene materias disponibles.

### 7. **GET /api/v1/grupos** (Opcional)
Obtiene grupos disponibles (se filtran por materia en el frontend).

### 8. **POST /api/v1/proyectos/**
Crea un nuevo proyecto.

---

## 📤 Formato del Payload (POST)

### Ejemplo de Envío:
```javascript
{
  "id_docente": "c5i6cZpo7vhBzgfyLhmOAfh22Yh2",
  "id_estudiantes": [
    {
      "id_estudiante": "CUaUUmOxHsbsv047JO9bNSoLrUh2"
    }
  ],
  "id_grupo": 203,
  "codigo_area": 1,
  "id_evento": "1jAZE5TKXakRd9ymq1Xu",
  "codigo_materia": "FIS201",
  "codigo_linea": 1,
  "codigo_sublinea": 2,
  "titulo_proyecto": "Sistema de Gestión Inteligente",
  "tipo_actividad": 3
}
```

### Campos Requeridos:
| Campo | Tipo | Descripción |
|-------|------|-------------|
| `id_docente` | string | ID del docente asignado |
| `id_estudiantes` | array | Array de objetos `{id_estudiante: string}` |
| `id_grupo` | number | ID del grupo |
| `codigo_area` | number | Código del área temática |
| `id_evento` | string | ID del evento (por defecto: "1jAZE5TKXakRd9ymq1Xu") |
| `codigo_materia` | string | Código de la materia |
| `codigo_linea` | number | Código de la línea de investigación |
| `codigo_sublinea` | number | Código de la sublínea |
| `titulo_proyecto` | string | Título del proyecto (máx 255 caracteres) |
| `tipo_actividad` | number | Tipo: 1=Conferencia, 2=Taller, 3=Exposoftware, 4=Ponencia |

---

## 🎨 Cambios en el Formulario

### ✅ Campos Actualizados

1. **Tipo de Actividad** - Se mantiene en la parte superior (diccionario estático)
2. **Título del Proyecto** - Límite aumentado de 60 a 255 caracteres
3. **Participantes** - Ahora usa IDs en lugar de nombres
4. **Docente** - Nuevo campo de selección (requerido)
5. **Materia** - Ahora usa `codigo_materia` (string)
6. **Grupo** - Se filtra por materia seleccionada
7. **Línea de Investigación** - Usa códigos numéricos
8. **Sublínea** - Se filtra por línea seleccionada
9. **Área Temática** - Usa códigos numéricos

### ❌ Campos Eliminados (Temporalmente)

- **Descripción** - No está en el payload del backend
- **Archivos (Poster, Artículo, Video, Imagen)** - Se manejarán en una futura implementación

---

## 🔄 Flujo de Datos

```
1. Usuario abre el formulario
   ↓
2. Se cargan todos los catálogos (estudiantes, docentes, líneas, etc.)
   ↓
3. Usuario completa el formulario:
   - Selecciona tipo de actividad
   - Escribe título del proyecto
   - Agrega participantes (estudiantes) por ID
   - Selecciona docente
   - Selecciona materia → grupos se filtran automáticamente
   - Selecciona grupo
   - Selecciona línea → sublíneas se filtran automáticamente
   - Selecciona sublínea
   - Selecciona área temática
   ↓
4. Al enviar, se validan todos los campos requeridos
   ↓
5. Se construye el payload según formato del backend
   ↓
6. Se envía a POST /api/v1/proyectos/
   ↓
7. Si es exitoso, se cierra el modal y se muestra mensaje de éxito
```

---

## 🧪 Validaciones Implementadas

### Frontend (antes de enviar):
- ✅ Título no vacío
- ✅ Al menos 1 participante
- ✅ Tipo de actividad seleccionado
- ✅ Docente seleccionado
- ✅ Grupo seleccionado
- ✅ Línea de investigación seleccionada
- ✅ Sublínea seleccionada
- ✅ Área temática seleccionada

### Service (RegisterProjectService.js):
- ✅ Conversión de IDs de estudiantes al formato `[{id_estudiante: string}]`
- ✅ Conversión de strings a números (id_grupo, códigos)
- ✅ Validación de campos requeridos con mensajes específicos

---

## 🎯 Uso del Servicio

### Importar el servicio:
```javascript
import RegisterProjectService from '../../Services/RegisterProjectService';
```

### Cargar catálogos:
```javascript
const estudiantes = await RegisterProjectService.obtenerEstudiantes();
const docentes = await RegisterProjectService.obtenerDocentes();
const lineas = await RegisterProjectService.obtenerLineasInvestigacion();
const sublineas = await RegisterProjectService.obtenerSublineasInvestigacion();
const areas = await RegisterProjectService.obtenerAreasTematicas();
```

### Crear proyecto:
```javascript
const proyectoData = {
  id_docente: "c5i6cZpo7vhBzgfyLhmOAfh22Yh2",
  id_estudiantes: ["CUaUUmOxHsbsv047JO9bNSoLrUh2"],
  id_grupo: 203,
  codigo_area: 1,
  codigo_materia: "FIS201",
  codigo_linea: 1,
  codigo_sublinea: 2,
  titulo_proyecto: "Mi Proyecto",
  tipo_actividad: 3
};

const resultado = await RegisterProjectService.crearProyecto(proyectoData);
```

---

## 🚀 Mejoras Implementadas

### 1. **Loading States**
- Spinner mientras se cargan los datos iniciales
- Botón deshabilitado durante el envío
- Texto del botón cambia a "Enviando..."

### 2. **Error Handling**
- Modal de error si falla la carga de datos
- Mensajes de error específicos en validaciones
- Console logs detallados para debugging

### 3. **UX Mejorada**
- Búsqueda de estudiantes por nombre O correo
- Filtrado automático de sublíneas por línea
- Filtrado automático de grupos por materia
- Avisos cuando no hay datos disponibles
- Campos deshabilitados hasta que se seleccionen dependencias

### 4. **Separación de Responsabilidades**
- Toda la lógica de API está en el servicio
- El componente solo maneja la UI y el estado local
- Transformaciones de datos centralizadas

---

## 📝 Notas Importantes

### ⚠️ ID del Evento
El campo `id_evento` está hardcodeado con el valor `"1jAZE5TKXakRd9ymq1Xu"` que corresponde a Exposoftware 2025. Si hay múltiples eventos, esto debe ser dinámico.

### ⚠️ Archivos
La funcionalidad de carga de archivos (poster, artículo, video, imagen) ha sido removida temporalmente ya que no está en el payload actual del backend. Deberá implementarse en una fase posterior.

### ⚠️ Materias y Grupos
Los endpoints de materias y grupos están marcados como opcionales porque pueden no existir aún en el backend. Si fallan, el componente seguirá funcionando pero esos campos no estarán disponibles.

---

## 🐛 Debugging

### Console Logs Implementados:
- ✅ "Catálogos cargados" - Muestra cuántos registros se cargaron
- 📤 "Enviando proyecto" - Muestra el payload antes de enviar
- ✅ "Proyecto creado exitosamente" - Muestra la respuesta del backend
- ❌ "Error..." - Muestra errores en cada operación

### Verifica en DevTools:
1. Network tab para ver las peticiones HTTP
2. Console para ver los logs de debugging
3. React DevTools para ver el estado del componente

---

## ✅ Checklist de Implementación

- [x] Crear RegisterProjectService.js
- [x] Refactorizar RegisterProject.jsx
- [x] Integrar todos los endpoints GET
- [x] Implementar POST de proyecto con formato correcto
- [x] Agregar validaciones
- [x] Implementar loading states
- [x] Mejorar UX con filtros y búsquedas
- [x] Agregar error handling
- [ ] Implementar carga de archivos (pendiente backend)
- [ ] Implementar campo descripción (si backend lo soporta)
- [ ] Hacer dinámico el id_evento si hay múltiples eventos

---

## 🎉 ¡Listo para Probar!

El componente está completamente funcional y listo para integrarse con el backend. Solo asegúrate de que todos los endpoints estén disponibles y devuelvan datos en el formato esperado.
