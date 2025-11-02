# 📚 Sistema de Gestión de Estudiantes - Documentación

## 📋 Resumen Ejecutivo

Se ha implementado un sistema completo de gestión de estudiantes para el panel de administración, que permite listar, visualizar, editar, activar y desactivar estudiantes registrados en el sistema.

---

## 🗂️ Estructura de Archivos Creados

### 1. **Servicio de Backend** 
📁 `src/Services/StudentAdminService.jsx`

Servicio completo para la gestión de estudiantes con las siguientes funciones:

#### Funciones Principales:
- `obtenerEstudiantes(params)` - Lista todos los estudiantes con paginación
- `obtenerEstudiantePorId(studentId)` - Obtiene un estudiante específico
- `obtenerEstudianteCompleto(studentId)` - Obtiene estudiante con datos completos de usuario
- `obtenerEstudiantesPorPrograma(codigoPrograma)` - Filtra estudiantes por programa
- `actualizarEstudiante(studentId, data)` - Actualiza datos académicos
- `activarEstudiante(studentId)` - Cambia estado a activo
- `desactivarEstudiante(studentId)` - Cambia estado a inactivo
- `asignarEstudianteExistente(data)` - Asigna rol de estudiante a usuario existente

#### Funciones Auxiliares:
- `buscarEstudiantes(query, estudiantes)` - Búsqueda por nombre, ID, email
- `filtrarPorEstado(estado, estudiantes)` - Filtrar por activo/inactivo
- `formatearEstudiante(estudiante)` - Formatea datos para visualización

---

### 2. **Vistas de Administración**

#### A. Lista de Estudiantes
📁 `src/pages/Admin/StudentList.jsx`

**Características:**
- ✅ Tabla responsiva con todos los estudiantes
- ✅ Búsqueda en tiempo real (nombre, ID, email, programa)
- ✅ Filtros por estado (Todos/Activos/Inactivos)
- ✅ Paginación (10 estudiantes por página)
- ✅ Acciones rápidas: Ver, Editar, Activar/Desactivar
- ✅ Modal de confirmación para cambios de estado
- ✅ Indicadores visuales de estado (badges)
- ✅ Estadísticas en tiempo real

**Columnas de la tabla:**
- Identificación
- Nombre Completo + Email
- Programa Académico + Código
- Semestre
- Estado (Activo/Inactivo)
- Acciones (👁️ Ver | ✏️ Editar | 🔒/✅ Activar/Desactivar)

---

#### B. Detalles del Estudiante
📁 `src/pages/Admin/StudentDetails.jsx`

**Secciones de Información:**

1. **👤 Información Personal**
   - Nombre completo
   - Tipo de documento
   - Identificación
   - Género
   - Fecha de nacimiento

2. **📧 Información de Contacto**
   - Email
   - Teléfono
   - Departamento
   - Ciudad
   - Dirección

3. **🎓 Información Académica**
   - Programa académico
   - Código del programa
   - Facultad
   - Semestre actual
   - Período académico
   - Año de ingreso

4. **⚙️ Información del Sistema**
   - ID de estudiante
   - ID de usuario
   - Rol
   - Fecha de registro
   - Última actualización

5. **📝 Biografía** (opcional)

**Acciones:**
- Botón "Volver" al listado
- Botón "Editar" para modificar datos

---

#### C. Editar Estudiante
📁 `src/pages/Admin/EditStudent.jsx`

**Campos Editables:**
- Programa Académico (dropdown con todos los programas)
- Semestre Actual (1-10)
- Período Académico (formato: AAAA-P)
- Año de Ingreso (2000-presente)

**Validaciones:**
- Programa obligatorio
- Semestre entre 1 y 10
- Formato de período válido
- Año de ingreso no puede ser futuro

**Características:**
- Muestra el nombre del estudiante en el título
- Indica el programa actual
- Formulario responsive
- Indicador de carga al guardar
- Redirección automática a detalles tras guardar

---

### 3. **Componente Principal**
📁 `src/pages/Admin/ManageStudents.jsx`

Componente contenedor que renderiza `StudentList`. Facilita futuras expansiones.

---

## 🌐 Rutas Configuradas

```javascript
// En App.jsx
<Route path="/admin/estudiantes" element={<AdminRoute><ManageStudents /></AdminRoute>} />
<Route path="/admin/estudiantes/:studentId" element={<AdminRoute><StudentDetails /></AdminRoute>} />
<Route path="/admin/estudiantes/:studentId/editar" element={<AdminRoute><EditStudent /></AdminRoute>} />
```

**Navegación:**
- `/admin/estudiantes` → Lista de estudiantes
- `/admin/estudiantes/12345` → Detalles del estudiante con ID 12345
- `/admin/estudiantes/12345/editar` → Editar estudiante con ID 12345

---

## 🔗 Endpoints del Backend

Actualizados en `src/utils/constants.js`:

```javascript
// Estudiantes (Admin)
ADMIN_ESTUDIANTES: `/api/v1/admin/estudiantes`
ADMIN_ESTUDIANTE_BY_ID: (id) => `/api/v1/admin/estudiantes/${id}`
ADMIN_ESTUDIANTE_COMPLETO: (id) => `/api/v1/admin/estudiantes/${id}/completo`
ADMIN_ESTUDIANTE_ACTIVAR: (id) => `/api/v1/admin/estudiantes/${id}/activar`
ADMIN_ESTUDIANTE_DESACTIVAR: (id) => `/api/v1/admin/estudiantes/${id}/desactivar`
ADMIN_ESTUDIANTES_POR_PROGRAMA: (codigo) => `/api/v1/admin/estudiantes/programa/${codigo}`
ADMIN_ESTUDIANTE_ASIGNAR_EXISTENTE: `/api/v1/admin/estudiantes/asignar-existente`
```

---

## 🎨 Interfaz de Usuario

### Componentes Visuales:

1. **Tabla Responsiva**
   - Diseño limpio con Tailwind CSS
   - Hover effects en filas
   - Badges de estado con colores (Verde=Activo, Rojo=Inactivo)
   - Truncado de texto largo con tooltips

2. **Barra de Búsqueda y Filtros**
   - Input de búsqueda con placeholder descriptivo
   - Dropdown de filtro por estado
   - Estadísticas en tiempo real (mostrando X de Y estudiantes)

3. **Paginación**
   - Botones Anterior/Siguiente
   - Números de página clickeables
   - Indicador de página actual
   - Resumen "Mostrando X a Y de Z resultados"

4. **Modal de Confirmación**
   - Overlay oscuro semi-transparente
   - Diseño centrado con ícono de advertencia
   - Mensaje descriptivo con nombre del estudiante
   - Botones Cancelar/Confirmar con colores apropiados

5. **Tarjetas de Información (Detalles)**
   - Layout en grid responsivo (1 columna móvil, 2 columnas desktop)
   - Íconos descriptivos para cada sección
   - Campos organizados con labels y valores
   - Diseño de tarjeta con sombra y bordes redondeados

---

## 🔧 Funcionalidades Clave

### 1. Búsqueda Inteligente
Busca en múltiples campos:
- Nombre completo del estudiante
- Número de identificación
- Email
- Nombre del programa académico

### 2. Filtros
- **Todos**: Muestra todos los estudiantes
- **Activos**: Solo estudiantes con estado activo
- **Inactivos**: Solo estudiantes desactivados

### 3. Paginación Eficiente
- 10 estudiantes por página (configurable)
- Navegación entre páginas
- Se reinicia a página 1 al aplicar filtros

### 4. Cambio de Estado Seguro
- Modal de confirmación antes de activar/desactivar
- Mensaje claro con el nombre del estudiante
- Recarga automática de la lista tras el cambio

### 5. Edición Controlada
- Solo campos académicos editables
- Validaciones en tiempo real
- Mensaje informativo sobre limitaciones
- Guardado con feedback visual

---

## 📊 Flujo de Navegación

```
/admin/estudiantes (Lista)
    ↓
    ├── 👁️ Ver → /admin/estudiantes/:id (Detalles)
    │                ↓
    │                ├── ✏️ Editar → /admin/estudiantes/:id/editar
    │                │                        ↓
    │                │                   [Guardar] → Volver a Detalles
    │                │                        ↓
    │                │                   [Cancelar] → Volver a Detalles
    │                └── ← Volver → Lista
    │
    ├── ✏️ Editar → /admin/estudiantes/:id/editar
    │                        ↓
    │                   [Guardar] → Detalles
    │                        ↓
    │                   [Cancelar] → Detalles
    │
    └── 🔒/✅ Activar/Desactivar
                 ↓
            [Modal Confirmación]
                 ↓
            [Confirmar] → Actualizar lista
                 ↓
            [Cancelar] → Cerrar modal
```

---

## 🔐 Seguridad y Autenticación

- ✅ Todas las rutas protegidas con `<AdminRoute>`
- ✅ Token JWT enviado en headers `Authorization: Bearer <token>`
- ✅ Validación de permisos en el backend
- ✅ Manejo de errores 401/403 (no autenticado/no autorizado)

---

## 🎯 Integración con el Sidebar

Se agregó el enlace en `src/components/Layout/AdminSidebar.jsx`:

```javascript
{
  to: "/admin/estudiantes",
  icon: "pi-graduation-cap",
  label: "Gestión de Estudiantes"
}
```

Icono: 🎓 (`pi-graduation-cap` de PrimeIcons)

---

## 🧪 Casos de Uso

### 1. Listar Estudiantes
```
GIVEN el administrador está en /admin/estudiantes
WHEN la página carga
THEN se muestra una tabla con todos los estudiantes
AND se muestra el total de estudiantes registrados
```

### 2. Buscar Estudiante
```
GIVEN hay 100 estudiantes en el sistema
WHEN el admin escribe "Juan" en el buscador
THEN solo se muestran estudiantes con "Juan" en nombre, email o programa
AND la paginación se resetea a la página 1
```

### 3. Filtrar por Estado
```
GIVEN hay estudiantes activos e inactivos
WHEN el admin selecciona "Activos" en el filtro
THEN solo se muestran estudiantes con estado activo
```

### 4. Ver Detalles
```
GIVEN el admin hace clic en 👁️ Ver de un estudiante
WHEN la página de detalles carga
THEN se muestra toda la información del estudiante en tarjetas organizadas
```

### 5. Editar Estudiante
```
GIVEN el admin está viendo los detalles de un estudiante
WHEN hace clic en "Editar"
THEN se abre el formulario de edición con los datos actuales
AND puede modificar: programa, semestre, período, año de ingreso
AND al guardar, vuelve a la página de detalles
```

### 6. Desactivar Estudiante
```
GIVEN el admin hace clic en 🔒 Desactivar
WHEN aparece el modal de confirmación
THEN el admin ve el nombre del estudiante a desactivar
AND al confirmar, el estudiante cambia a estado inactivo
AND la lista se actualiza automáticamente
```

---

## 🚀 Cómo Usar

### Para el Administrador:

1. **Acceder al módulo:**
   - Iniciar sesión como administrador
   - Ir al sidebar izquierdo
   - Hacer clic en "Gestión de Estudiantes" (ícono 🎓)

2. **Buscar un estudiante:**
   - Escribir nombre, ID, email o programa en la barra de búsqueda
   - Los resultados se filtran automáticamente

3. **Filtrar por estado:**
   - Usar el dropdown "Filtrar por estado"
   - Seleccionar: Todos, Activos o Inactivos

4. **Ver detalles:**
   - Hacer clic en el ícono 👁️ en la columna de acciones
   - Se abre la página de detalles completos

5. **Editar información académica:**
   - Desde la lista: clic en ✏️
   - Desde detalles: clic en botón "Editar"
   - Modificar los campos necesarios
   - Guardar cambios

6. **Activar/Desactivar:**
   - Hacer clic en 🔒 (desactivar) o ✅ (activar)
   - Confirmar en el modal
   - El estado cambia inmediatamente

---

## 📝 Notas Técnicas

### Estado de Estudiantes:
- `true` = Activo (puede acceder al sistema)
- `false` = Inactivo (bloqueado)

### Formato de Datos del Backend:

**Estudiante Básico:**
```json
{
  "id_estudiante": "uuid",
  "codigo_programa": "ING_SIS",
  "semestre": 8,
  "periodo": "2024-2",
  "anio_ingreso": 2021,
  "estado": true,
  "fecha_creacion": "2024-01-15T10:30:00",
  "fecha_actualizacion": "2024-11-01T14:20:00"
}
```

**Estudiante Completo (incluye usuario):**
```json
{
  "id_estudiante": "uuid",
  "codigo_programa": "ING_SIS",
  "semestre": 8,
  "periodo": "2024-2",
  "anio_ingreso": 2021,
  "estado": true,
  "usuario": {
    "id_usuario": "uuid",
    "nombres": "Juan Carlos",
    "apellidos": "Pérez García",
    "tipo_documento": "CC",
    "identificacion": "1234567890",
    "email": "juan.perez@unicesar.edu.co",
    "telefono": "3001234567",
    "sexo": "M",
    "fecha_nacimiento": "2000-05-15",
    "departamento": "Cesar",
    "ciudad": "Valledupar",
    "direccion": "Calle 123 #45-67",
    "rol": "estudiante"
  },
  "programa": {
    "codigo_programa": "ING_SIS",
    "nombre_programa": "Ingeniería de Sistemas",
    "nivel_formacion": "Pregrado",
    "facultad": {
      "id_facultad": "FAC_ING",
      "nombre": "Ingenierías y Tecnologías"
    }
  }
}
```

---

## ⚠️ Limitaciones Actuales

1. **Edición de Datos Personales:**
   - Solo se pueden editar datos académicos desde esta interfaz
   - Para modificar nombre, email, etc., se requiere otra vista (futuro)

2. **Eliminación Física:**
   - No se implementó eliminación física de estudiantes
   - Solo desactivación (soft delete)

3. **Paginación Backend:**
   - Actualmente carga todos los estudiantes (limit=1000)
   - Para producción, implementar paginación real con el backend

4. **Ordenamiento:**
   - No hay ordenamiento por columnas
   - Posible mejora futura

---

## 🔮 Futuras Mejoras

1. **Exportar Datos:**
   - Exportar lista a CSV/Excel
   - Exportar detalles de estudiante a PDF

2. **Filtros Avanzados:**
   - Filtrar por facultad
   - Filtrar por programa
   - Filtrar por semestre
   - Rango de fechas de ingreso

3. **Estadísticas:**
   - Gráficos de estudiantes por programa
   - Gráficos de estudiantes por semestre
   - Tendencias de inscripción

4. **Acciones en Masa:**
   - Activar/desactivar múltiples estudiantes
   - Cambiar programa a varios estudiantes
   - Exportar selección

5. **Historial de Cambios:**
   - Ver quién modificó qué y cuándo
   - Auditoría de cambios

6. **Asignación de Estudiante a Usuario Existente:**
   - Interfaz para usar `asignarEstudianteExistente()`
   - Buscar usuarios sin rol de estudiante

---

## 📞 Soporte

Para problemas o preguntas sobre este módulo, contactar al equipo de desarrollo.

---

**Última actualización:** 1 de noviembre de 2025
**Versión:** 1.0.0
**Autor:** Sistema de Gestión Académica UPC
