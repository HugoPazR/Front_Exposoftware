# ⚡ INICIO RÁPIDO - Servicio de Facultades

## En 3 Pasos

### Paso 1: Importar
```javascript
import * as FacultyService from "../Services/CreateFaculty";
```

### Paso 2: Usar
```javascript
// Crear facultad
await FacultyService.crearFacultad({
  id_facultad: "FAC_ING",
  nombre_facultad: "Ingenierías y Tecnologías"
});

// Obtener todas
const facultades = await FacultyService.obtenerFacultades();

// Actualizar
await FacultyService.actualizarFacultad("FAC_ING", {
  nombre_facultad: "Nuevo Nombre"
});

// Eliminar
await FacultyService.eliminarFacultad("FAC_ING");
```

### Paso 3: Manejar Errores
```javascript
try {
  const resultado = await FacultyService.crearFacultad({...});
  alert("✅ Éxito: " + resultado.data.nombre_facultad);
} catch (error) {
  alert("❌ Error: " + error.message);
}
```

---

## 📦 Archivos Entregados

| Archivo | Descripción | Ubicación |
|---------|-------------|-----------|
| **CreateFaculty.jsx** | Servicio CRUD completo | `src/Services/` |
| **constants.js** | Endpoints agregados | `src/utils/` |
| **FacultyServiceExamples.jsx** | 6 ejemplos prácticos | `src/components/Examples/` |
| **FACULTY_SERVICE_GUIDE.md** | Documentación detallada | Root |
| **FACULTY_SERVICE_SUMMARY.md** | Resumen funciones | Root |
| **FACULTY_SERVICE_TEST_CASES.md** | Casos de prueba | Root |
| **OPENAPI_MAPPING.md** | Mapeo OpenAPI | Root |
| **README_FACULTY_SERVICE.md** | Resumen completo | Root |
| **QUICK_START.md** | Este archivo | Root |

---

## 🎯 Casos de Uso Comunes

### Crear Facultad en Formulario
```jsx
const [loading, setLoading] = useState(false);
const [idFacultad, setIdFacultad] = useState("");
const [nombreFacultad, setNombreFacultad] = useState("");

const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);
  try {
    await FacultyService.crearFacultad({
      id_facultad: idFacultad.toUpperCase(),
      nombre_facultad: nombreFacultad
    });
    alert("✅ Creada");
    setIdFacultad("");
    setNombreFacultad("");
  } catch (error) {
    alert(`❌ ${error.message}`);
  } finally {
    setLoading(false);
  }
};

return (
  <form onSubmit={handleSubmit}>
    <input 
      value={idFacultad}
      onChange={(e) => setIdFacultad(e.target.value)}
      placeholder="ID (ej: FAC_ING)"
      required
    />
    <input 
      value={nombreFacultad}
      onChange={(e) => setNombreFacultad(e.target.value)}
      placeholder="Nombre"
      required
    />
    <button disabled={loading}>
      {loading ? "Creando..." : "Crear"}
    </button>
  </form>
);
```

### Listar Facultades con Búsqueda
```jsx
const [facultades, setFacultades] = useState([]);
const [searchTerm, setSearchTerm] = useState("");
const [loading, setLoading] = useState(false);

useEffect(() => {
  loadFacultades();
}, []);

const loadFacultades = async () => {
  setLoading(true);
  try {
    const data = await FacultyService.obtenerFacultades();
    setFacultades(data);
  } catch (error) {
    alert(`❌ ${error.message}`);
  } finally {
    setLoading(false);
  }
};

const filtradas = FacultyService.filtrarFacultades(facultades, searchTerm);

return (
  <div>
    <input 
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
      placeholder="Buscar..."
    />
    {loading ? <p>Cargando...</p> : (
      <table>
        <tbody>
          {filtradas.map(fac => (
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
```

---

## 🔧 Validaciones Útiles

```javascript
// Validar ID antes de crear
if (!FacultyService.validarIdFacultad(idFacultad)) {
  alert("ID inválido (3-50 caracteres, A-Z, 0-9, _, -)");
  return;
}

// Validar nombre antes de crear
if (!FacultyService.validarNombreFacultad(nombreFacultad)) {
  alert("Nombre inválido (1-255 caracteres)");
  return;
}

// Formatear datos automáticamente
const datosFormateados = FacultyService.formatearDatosFacultad({
  idFacultad: "fac_ing",          // → "FAC_ING"
  nombreFacultad: "  Ingeniería  " // → "Ingeniería"
});

// Ahora crear con datos formateados
await FacultyService.crearFacultad(datosFormateados);
```

---

## 📊 Respuestas del Backend

### Éxito (201)
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

### Error (409 - Conflicto)
```json
{
  "status": "error",
  "message": "Conflicto",
  "detail": "La facultad con ID FAC_ING ya existe"
}
```

---

## 🚨 Errores Comunes

| Problema | Causa | Solución |
|----------|-------|----------|
| "TypeError: Cannot read property 'getAuthHeaders'" | AuthService no cargado | Importar AuthService en el servicio |
| "401 Unauthorized" | Token expirado | Hacer login nuevamente |
| "403 Forbidden" | Usuario no es admin | Usar cuenta administrador |
| "409 Conflict" | ID duplicado | Usar ID único |
| "422 Unprocessable Entity" | Datos inválidos | Validar antes de enviar |

---

## 🔐 Headers Automáticos

El servicio **automáticamente** agrega estos headers a cada request:

```javascript
{
  "Authorization": "Bearer <tu_token_jwt>",
  "Content-Type": "application/json"
}
```

No necesitas hacer nada especial, ¡funciona automáticamente! ✅

---

## 🎬 Ejemplo Completo (Copiar y Pegar)

```jsx
import { useState, useEffect } from "react";
import * as FacultyService from "../Services/CreateFaculty";

export default function CrearFacultad() {
  const [facultades, setFacultades] = useState([]);
  const [loading, setLoading] = useState(false);
  const [idFacultad, setIdFacultad] = useState("");
  const [nombreFacultad, setNombreFacultad] = useState("");

  useEffect(() => {
    cargarFacultades();
  }, []);

  const cargarFacultades = async () => {
    setLoading(true);
    try {
      const data = await FacultyService.obtenerFacultades();
      setFacultades(data);
    } catch (error) {
      alert(`Error al cargar: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleCrear = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await FacultyService.crearFacultad({
        id_facultad: idFacultad.toUpperCase(),
        nombre_facultad: nombreFacultad
      });
      alert("✅ Facultad creada");
      setIdFacultad("");
      setNombreFacultad("");
      cargarFacultades();
    } catch (error) {
      alert(`❌ Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleEliminar = async (id) => {
    if (!confirm("¿Está seguro?")) return;
    setLoading(true);
    try {
      await FacultyService.eliminarFacultad(id);
      alert("✅ Eliminada");
      cargarFacultades();
    } catch (error) {
      alert(`❌ Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: "800px", margin: "0 auto", padding: "20px" }}>
      <h1>Gestión de Facultades</h1>

      <form onSubmit={handleCrear} style={{ marginBottom: "30px" }}>
        <div style={{ marginBottom: "10px" }}>
          <label>ID Facultad</label>
          <input
            type="text"
            value={idFacultad}
            onChange={(e) => setIdFacultad(e.target.value)}
            placeholder="FAC_ING"
            required
          />
        </div>
        <div style={{ marginBottom: "10px" }}>
          <label>Nombre</label>
          <input
            type="text"
            value={nombreFacultad}
            onChange={(e) => setNombreFacultad(e.target.value)}
            placeholder="Ingenierías"
            required
          />
        </div>
        <button type="submit" disabled={loading}>
          {loading ? "Creando..." : "Crear"}
        </button>
      </form>

      <h2>Facultades ({facultades.length})</h2>
      {loading ? (
        <p>Cargando...</p>
      ) : (
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ borderBottom: "2px solid #ddd" }}>
              <th style={{ padding: "10px", textAlign: "left" }}>ID</th>
              <th style={{ padding: "10px", textAlign: "left" }}>Nombre</th>
              <th style={{ padding: "10px", textAlign: "center" }}>Acción</th>
            </tr>
          </thead>
          <tbody>
            {facultades.map((fac) => (
              <tr key={fac.id_facultad} style={{ borderBottom: "1px solid #eee" }}>
                <td style={{ padding: "10px" }}>{fac.id_facultad}</td>
                <td style={{ padding: "10px" }}>{fac.nombre_facultad}</td>
                <td style={{ padding: "10px", textAlign: "center" }}>
                  <button 
                    onClick={() => handleEliminar(fac.id_facultad)}
                    disabled={loading}
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
```

---

## 💡 Tips & Trucos

### 1. Usar Estados de Carga Separados
```javascript
const [loadingList, setLoadingList] = useState(false);
const [loadingCreate, setLoadingCreate] = useState(false);

// Así puedes cargar mientras creas
```

### 2. Cachear Datos
```javascript
const [facultades, setFacultades] = useState(null);

const cargarFacultades = async (forzar = false) => {
  if (facultades && !forzar) return facultades;
  const data = await FacultyService.obtenerFacultades();
  setFacultades(data);
  return data;
};
```

### 3. Debouncing en Búsqueda
```javascript
const [searchTerm, setSearchTerm] = useState("");
const [searchTimeout, setSearchTimeout] = useState(null);

const handleSearch = (value) => {
  clearTimeout(searchTimeout);
  setSearchTimeout(
    setTimeout(() => setSearchTerm(value), 300)
  );
};
```

### 4. Notificaciones Toast
```javascript
// Usar una librería como react-toastify
import { toast } from "react-toastify";

try {
  await FacultyService.crearFacultad({...});
  toast.success("✅ Facultad creada");
} catch (error) {
  toast.error(`❌ ${error.message}`);
}
```

---

## 📚 Documentación Relacionada

Consulta estos archivos para más detalles:

- **FACULTY_SERVICE_GUIDE.md** - Guía completa detallada
- **FACULTY_SERVICE_TEST_CASES.md** - Casos de prueba
- **FacultyServiceExamples.jsx** - 6 ejemplos prácticos
- **OPENAPI_MAPPING.md** - Mapeo con OpenAPI

---

## ✅ Checklist de Verificación

Antes de usar en producción:

- [ ] Importar el servicio correctamente
- [ ] Verificar que AuthService está funcionando
- [ ] Probar crear una facultad
- [ ] Probar obtener facultades
- [ ] Probar actualizar facultad
- [ ] Probar eliminar facultad
- [ ] Probar manejo de errores
- [ ] Probar validaciones
- [ ] Verificar que los headers de auth se envían
- [ ] Revisar logs en DevTools (F12)

---

## 🚀 ¡Listo para Usar!

El servicio está completamente funcional y listo para producción.

**¿Preguntas?** Revisa la documentación incluida o el código comentado en `CreateFaculty.jsx`

**¡Éxito! 🎉**

