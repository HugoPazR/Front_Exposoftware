## Resumen del Servicio de Facultades - CreateFaculty.jsx

### 📋 Archivos Creados/Modificados

1. ✅ **CreateFaculty.jsx** (nuevo)
   - Ubicación: `src/Services/CreateFaculty.jsx`
   - 8 funciones exportadas para gestión completa de facultades

2. ✅ **constants.js** (modificado)
   - Se agregaron los endpoints de facultades:
   ```javascript
   FACULTADES: `${API_BASE_URL}/api/v1/admin/academico/facultades`
   FACULTAD_BY_ID: (id) => `${API_BASE_URL}/api/v1/admin/academico/facultades/${id}`
   ```

3. ✅ **FACULTY_SERVICE_GUIDE.md** (nuevo)
   - Guía completa de uso del servicio

---

### 🎯 Funciones Disponibles

#### 1. **obtenerFacultades()**
```javascript
// GET /api/v1/admin/academico/facultades
const facultades = await FacultyService.obtenerFacultades();
```

#### 2. **crearFacultad(datosFacultad)** ⭐
```javascript
// POST /api/v1/admin/academico/facultades
const resultado = await FacultyService.crearFacultad({
  id_facultad: "FAC_ING",
  nombre_facultad: "Ingenierías y Tecnologías"
});
// Retorna: { success: true, data: {...} }
```

#### 3. **actualizarFacultad(idFacultad, datosFacultad)**
```javascript
// PUT /api/v1/admin/academico/facultades/{id_facultad}
await FacultyService.actualizarFacultad("FAC_ING", {
  nombre_facultad: "Nuevo Nombre"
});
```

#### 4. **eliminarFacultad(idFacultad)**
```javascript
// DELETE /api/v1/admin/academico/facultades/{id_facultad}
await FacultyService.eliminarFacultad("FAC_ING");
```

#### 5. **filtrarFacultades(facultades, searchTerm)**
```javascript
// Filtro local sin llamadas a API
const filtradas = FacultyService.filtrarFacultades(facultades, "Ingeniería");
```

#### 6. **validarIdFacultad(idFacultad)**
```javascript
// Valida: 3-50 caracteres, A-Z, 0-9, _, -
FacultyService.validarIdFacultad("FAC_ING"); // true
```

#### 7. **validarNombreFacultad(nombreFacultad)**
```javascript
// Valida: no vacío, máx 255 caracteres
FacultyService.validarNombreFacultad("Ingenierías"); // true
```

#### 8. **formatearDatosFacultad(formData)**
```javascript
// Formatea datos del formulario
const datos = FacultyService.formatearDatosFacultad({
  idFacultad: "fac_ing",
  nombreFacultad: "  Ingenierías  "
});
// Retorna: { id_facultad: "FAC_ING", nombre_facultad: "Ingenierías" }
```

---

### 📡 Endpoint REST

**Base URL:** `http://localhost:8000/api/v1/admin/academico/facultades`

| Método | Ruta | Función | Parámetros |
|--------|------|---------|-----------|
| POST | `/` | crearFacultad() | body: {id_facultad, nombre_facultad} |
| GET | `/` | obtenerFacultades() | - |
| PUT | `/{id_facultad}` | actualizarFacultad() | body: {nombre_facultad} |
| DELETE | `/{id_facultad}` | eliminarFacultad() | - |

---

### 📦 Estructura del Payload

**Crear/Actualizar Facultad:**
```json
{
  "id_facultad": "FAC_ING",
  "nombre_facultad": "Ingenierías y Tecnologías"
}
```

**Respuesta Exitosa (201):**
```json
{
  "status": "success",
  "message": "Facultad creada exitosamente",
  "data": {
    "id_facultad": "FAC_ING",
    "nombre_facultad": "Ingenierías y Tecnologías"
  }
}
```

---

### ✨ Características

- ✅ Validaciones de entrada
- ✅ Manejo automático de headers de autenticación
- ✅ Manejo de errores HTTP (400, 401, 403, 404, 409, 422)
- ✅ Logging detallado para debugging
- ✅ Funciones auxiliares para validación y filtrado
- ✅ Mensajes de error descriptivos
- ✅ Compatible con async/await
- ✅ Try-catch ready

---

### 🔒 Autenticación

Todas las llamadas incluyen automáticamente headers de autenticación:
```javascript
{
  "Authorization": "Bearer <token>",
  "Content-Type": "application/json"
}
```

Los tokens se obtienen de `AuthService.getAuthHeaders()`

---

### 📝 Ejemplo Completo de Uso

```jsx
import { useState, useEffect } from "react";
import * as FacultyService from "../Services/CreateFaculty";

function CrearFacultad() {
  const [facultades, setFacultades] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    idFacultad: "",
    nombreFacultad: ""
  });

  // Cargar facultades
  useEffect(() => {
    cargarFacultades();
  }, []);

  const cargarFacultades = async () => {
    setLoading(true);
    try {
      const datos = await FacultyService.obtenerFacultades();
      setFacultades(datos);
    } catch (error) {
      console.error("Error:", error);
      alert(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleCrear = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // Formatear datos
      const datosFormateados = FacultyService.formatearDatosFacultad(formData);
      
      // Crear facultad
      const resultado = await FacultyService.crearFacultad(datosFormateados);
      
      alert("✅ Facultad creada exitosamente");
      setFormData({ idFacultad: "", nombreFacultad: "" });
      
      // Recargar lista
      await cargarFacultades();
    } catch (error) {
      alert(`❌ Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>Gestionar Facultades</h1>
      
      <form onSubmit={handleCrear}>
        <input
          type="text"
          value={formData.idFacultad}
          onChange={(e) => setFormData({...formData, idFacultad: e.target.value})}
          placeholder="ID Facultad (ej: FAC_ING)"
          required
          disabled={loading}
        />
        
        <input
          type="text"
          value={formData.nombreFacultad}
          onChange={(e) => setFormData({...formData, nombreFacultad: e.target.value})}
          placeholder="Nombre (ej: Ingenierías y Tecnologías)"
          required
          disabled={loading}
        />
        
        <button type="submit" disabled={loading}>
          {loading ? "Cargando..." : "Crear Facultad"}
        </button>
      </form>

      <h2>Facultades Registradas</h2>
      {loading ? (
        <p>Cargando...</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre</th>
            </tr>
          </thead>
          <tbody>
            {facultades.map(fac => (
              <tr key={fac.id_facultad}>
                <td>{fac.id_facultad}</td>
                <td>{fac.nombre_facultad}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default CrearFacultad;
```

---

### 🚀 Integración en tu Proyecto

1. **Importar el servicio:**
   ```jsx
   import * as FacultyService from "../Services/CreateFaculty";
   ```

2. **Usar en componentes:**
   ```jsx
   const facultades = await FacultyService.obtenerFacultades();
   await FacultyService.crearFacultad({...});
   ```

3. **Disponible en:** `src/Services/CreateFaculty.jsx`

---

### 📚 Documentación Adicional

Para una guía más detallada, consulta: `FACULTY_SERVICE_GUIDE.md`

