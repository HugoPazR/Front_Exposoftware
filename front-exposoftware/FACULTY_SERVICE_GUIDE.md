# Guía de Uso del Servicio de Facultades

## Descripción General

El servicio `CreateFaculty.jsx` proporciona funciones para gestionar facultades a través de la API del backend. Incluye operaciones CRUD (Create, Read, Update, Delete) completas.

## Importación

```jsx
import * as FacultyService from "../Services/CreateFaculty";
```

## Funciones Disponibles

### 1. **obtenerFacultades()**
Obtiene la lista de todas las facultades registradas en el sistema.

**Parámetros:** Ninguno

**Retorna:** Promise<Array>

**Ejemplo:**
```jsx
try {
  const facultades = await FacultyService.obtenerFacultades();
  console.log("Facultades:", facultades);
} catch (error) {
  console.error("Error:", error.message);
}
```

---

### 2. **crearFacultad(datosFacultad)**
Crea una nueva facultad en el backend.

**Parámetros:**
```jsx
{
  id_facultad: "FAC_ING",           // string (requerido) - ID único
  nombre_facultad: "Ingenierías y Tecnologías"  // string (requerido)
}
```

**Retorna:** Promise<Object> { success: true, data: {...} }

**Ejemplo de uso en un componente:**
```jsx
import { useState } from "react";
import * as FacultyService from "../Services/CreateFaculty";

function CrearFacultadForm() {
  const [cargando, setCargando] = useState(false);
  const [idFacultad, setIdFacultad] = useState("");
  const [nombreFacultad, setNombreFacultad] = useState("");

  const handleCrear = async (e) => {
    e.preventDefault();
    
    if (!idFacultad.trim() || !nombreFacultad.trim()) {
      alert("Por favor completa todos los campos");
      return;
    }

    setCargando(true);
    try {
      const resultado = await FacultyService.crearFacultad({
        id_facultad: idFacultad.toUpperCase(),
        nombre_facultad: nombreFacultad.trim()
      });
      
      console.log("✅ Facultad creada:", resultado.data);
      alert("Facultad creada exitosamente");
      setIdFacultad("");
      setNombreFacultad("");
    } catch (error) {
      console.error("❌ Error:", error.message);
      alert(`Error: ${error.message}`);
    } finally {
      setCargando(false);
    }
  };

  return (
    <form onSubmit={handleCrear}>
      <input
        type="text"
        value={idFacultad}
        onChange={(e) => setIdFacultad(e.target.value)}
        placeholder="ID Facultad (ej: FAC_ING)"
        maxLength="10"
        required
      />
      
      <input
        type="text"
        value={nombreFacultad}
        onChange={(e) => setNombreFacultad(e.target.value)}
        placeholder="Nombre Facultad (ej: Ingenierías y Tecnologías)"
        maxLength="100"
        required
      />
      
      <button type="submit" disabled={cargando}>
        {cargando ? "Creando..." : "Crear Facultad"}
      </button>
    </form>
  );
}

export default CrearFacultadForm;
```

---

### 3. **actualizarFacultad(idFacultad, datosFacultad)**
Actualiza los datos de una facultad existente.

**Parámetros:**
- `idFacultad`: string - ID de la facultad a actualizar (ej: "FAC_ING")
- `datosFacultad`:
```jsx
{
  nombre_facultad: "Nuevo nombre" // string (requerido)
}
```

**Retorna:** Promise<Object> { success: true, data: {...} }

**Ejemplo:**
```jsx
try {
  const resultado = await FacultyService.actualizarFacultad("FAC_ING", {
    nombre_facultad: "Ingenierías, Tecnologías y Ciencias"
  });
  console.log("✅ Facultad actualizada:", resultado.data);
} catch (error) {
  console.error("❌ Error:", error.message);
}
```

---

### 4. **eliminarFacultad(idFacultad)**
Elimina una facultad del sistema.

**Parámetros:**
- `idFacultad`: string - ID de la facultad a eliminar

**Retorna:** Promise<Object> { success: true }

**Ejemplo:**
```jsx
try {
  const resultado = await FacultyService.eliminarFacultad("FAC_ING");
  console.log("✅ Facultad eliminada");
  alert("Facultad eliminada exitosamente");
} catch (error) {
  console.error("❌ Error:", error.message);
  alert(`Error: ${error.message}`);
}
```

---

### 5. **filtrarFacultades(facultades, searchTerm)**
Filtra una lista de facultades por un término de búsqueda.

**Parámetros:**
- `facultades`: Array - Lista de facultades
- `searchTerm`: string - Término de búsqueda

**Retorna:** Array - Facultades filtradas

**Ejemplo:**
```jsx
const facultades = await FacultyService.obtenerFacultades();
const filtradas = FacultyService.filtrarFacultades(facultades, "Ingeniería");
console.log(filtradas); // Solo facultades que contengan "Ingeniería"
```

---

### 6. **validarIdFacultad(idFacultad)**
Valida el formato del ID de la facultad.

**Parámetros:**
- `idFacultad`: string - ID a validar

**Retorna:** boolean

**Reglas de validación:**
- Mínimo 3 caracteres, máximo 50
- Solo permite: A-Z, 0-9, _, -
- Ejemplo válido: "FAC_ING", "FAC_ADM", "PROG_01"

**Ejemplo:**
```jsx
console.log(FacultyService.validarIdFacultad("FAC_ING"));      // true
console.log(FacultyService.validarIdFacultad("fac_ing"));      // false (minúsculas)
console.log(FacultyService.validarIdFacultad("FA"));           // false (muy corto)
```

---

### 7. **validarNombreFacultad(nombreFacultad)**
Valida el nombre de la facultad.

**Parámetros:**
- `nombreFacultad`: string - Nombre a validar

**Retorna:** boolean

**Reglas de validación:**
- No puede estar vacío
- Mínimo 1 carácter, máximo 255

**Ejemplo:**
```jsx
console.log(FacultyService.validarNombreFacultad("Ingenierías y Tecnologías"));  // true
console.log(FacultyService.validarNombreFacultad(""));                          // false
```

---

### 8. **formatearDatosFacultad(formData)**
Formatea datos del formulario para envío al backend.

**Parámetros:**
```jsx
{
  idFacultad: "fac_ing",
  nombreFacultad: "  Ingenierías  "
}
```

**Retorna:**
```jsx
{
  id_facultad: "FAC_ING",
  nombre_facultad: "Ingenierías"
}
```

**Ejemplo:**
```jsx
const datosFormulario = {
  idFacultad: "fac_admin",
  nombreFacultad: "  Administración y Negocios  "
};

const datosFormateados = FacultyService.formatearDatosFacultad(datosFormulario);
console.log(datosFormateados);
// { id_facultad: "FAC_ADMIN", nombre_facultad: "Administración y Negocios" }
```

---

## Manejo de Errores

El servicio maneja automáticamente diferentes tipos de errores HTTP:

| Código | Situación | Error Típico |
|--------|-----------|--------------|
| 400 | Solicitud incorrecta | Datos inválidos |
| 401 | No autorizado | Token expirado |
| 403 | Sin permisos | Usuario no tiene permisos de admin |
| 404 | No encontrado | Facultad no existe |
| 409 | Conflicto | Facultad ya existe o tiene dependencias |
| 422 | Error de validación | Datos no cumplen validaciones |

**Ejemplo de manejo de errores:**
```jsx
try {
  await FacultyService.crearFacultad(datos);
} catch (error) {
  if (error.message.includes("Conflicto")) {
    alert("La facultad ya existe");
  } else if (error.message.includes("Sin permisos")) {
    alert("No tiene permisos para crear facultades");
  } else {
    alert(`Error: ${error.message}`);
  }
}
```

---

## Características de Logging

El servicio incluye logging automático para debugging:

```
📥 Cargando facultades desde: http://localhost:8000/api/v1/admin/academico/facultades
🔑 Headers de autenticación: { Authorization: "Bearer ..." }
📡 Respuesta del servidor - Status: 200 OK
✅ Facultades cargadas: 5
```

---

## Integración con Componentes

Ejemplo completo de componente React usando el servicio:

```jsx
import { useState, useEffect } from "react";
import * as FacultyService from "../Services/CreateFaculty";

function GestionarFacultades() {
  const [facultades, setFacultades] = useState([]);
  const [cargando, setCargando] = useState(false);
  const [idFacultad, setIdFacultad] = useState("");
  const [nombreFacultad, setNombreFacultad] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  // Cargar facultades al montar el componente
  useEffect(() => {
    cargarFacultades();
  }, []);

  const cargarFacultades = async () => {
    setCargando(true);
    try {
      const datos = await FacultyService.obtenerFacultades();
      setFacultades(datos);
    } catch (error) {
      console.error("Error al cargar:", error);
      alert(`Error: ${error.message}`);
    } finally {
      setCargando(false);
    }
  };

  const handleCrear = async (e) => {
    e.preventDefault();
    setCargando(true);
    try {
      await FacultyService.crearFacultad({
        id_facultad: idFacultad.toUpperCase(),
        nombre_facultad: nombreFacultad
      });
      alert("Facultad creada");
      setIdFacultad("");
      setNombreFacultad("");
      cargarFacultades();
    } catch (error) {
      alert(`Error: ${error.message}`);
    } finally {
      setCargando(false);
    }
  };

  const facultadesFiltradas = FacultyService.filtrarFacultades(
    facultades,
    searchTerm
  );

  return (
    <div>
      <h1>Gestionar Facultades</h1>

      {/* Formulario */}
      <form onSubmit={handleCrear}>
        <input
          type="text"
          value={idFacultad}
          onChange={(e) => setIdFacultad(e.target.value)}
          placeholder="ID"
          required
        />
        <input
          type="text"
          value={nombreFacultad}
          onChange={(e) => setNombreFacultad(e.target.value)}
          placeholder="Nombre"
          required
        />
        <button type="submit" disabled={cargando}>
          Crear
        </button>
      </form>

      {/* Búsqueda */}
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Buscar..."
      />

      {/* Lista */}
      {cargando ? (
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
            {facultadesFiltradas.map((fac) => (
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

export default GestionarFacultades;
```

---

## Estructura de Respuesta del Backend

El backend retorna respuestas en el siguiente formato:

**Éxito (201 - Created):**
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

**Error (4xx):**
```json
{
  "status": "error",
  "message": "Error al crear facultad",
  "detail": "La facultad con ID FAC_ING ya existe"
}
```

---

## Constantes de la API

Los endpoints están definidos en `src/utils/constants.js`:

```javascript
FACULTADES: `${API_BASE_URL}/api/v1/admin/academico/facultades`
FACULTAD_BY_ID: (id) => `${API_BASE_URL}/api/v1/admin/academico/facultades/${id}`
```

---

## Notas Importantes

1. **Autenticación**: Todas las llamadas requieren autenticación. Los headers se incluyen automáticamente desde `AuthService`.
2. **Manejo de Errores**: Siempre usa try-catch al llamar las funciones.
3. **Validación**: Valida los datos antes de enviar al backend.
4. **Logging**: Las funciones incluyen console.log para debugging (usa las DevTools del navegador).
5. **Estados de Carga**: Siempre actualiza el estado de cargando para mejorar UX.

