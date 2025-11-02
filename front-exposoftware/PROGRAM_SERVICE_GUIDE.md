# Guía de Uso del Servicio de Programas

## Descripción General

El servicio `CreateProgram.jsx` proporciona funciones para gestionar programas académicos asociados a facultades. Incluye operaciones CRUD completas y funciones auxiliares.

## Importación

```jsx
import * as ProgramService from "../Services/CreateProgram";
```

---

## Funciones Disponibles

### 1. **obtenerFacultades()**
Obtiene la lista de todas las facultades (necesario para seleccionar al crear programa).

**Parámetros:** Ninguno

**Retorna:** Promise<Array>

**Ejemplo:**
```jsx
try {
  const facultades = await ProgramService.obtenerFacultades();
  console.log("Facultades:", facultades);
} catch (error) {
  console.error("Error:", error.message);
}
```

---

### 2. **obtenerFacultadPorId(facultadId)**
Obtiene los datos de una facultad específica.

**Parámetros:**
- `facultadId`: string - ID de la facultad (ej: "FAC_ING")

**Retorna:** Promise<Object>

**Ejemplo:**
```jsx
try {
  const facultad = await ProgramService.obtenerFacultadPorId("FAC_ING");
  console.log("Facultad:", facultad.nombre_facultad);
} catch (error) {
  console.error("Error:", error.message);
}
```

---

### 3. **obtenerProgramasPorFacultad(facultadId)** ⭐
Obtiene todos los programas de una facultad específica.

**Parámetros:**
- `facultadId`: string - ID de la facultad

**Retorna:** Promise<Array>

**Ejemplo:**
```jsx
try {
  const programas = await ProgramService.obtenerProgramasPorFacultad("FAC_ING");
  console.log("Programas:", programas.length);
} catch (error) {
  console.error("Error:", error.message);
}
```

---

### 4. **crearPrograma(datosPrograma)** ⭐
Crea un nuevo programa en una facultad específica.

**Parámetros:**
```jsx
{
  codigo_programa: "ING_SIS",              // string (requerido) - Código único
  id_facultad: "FAC_ING",                  // string (requerido) - ID de la facultad
  nombre_programa: "Ingeniería de Sistemas" // string (requerido)
}
```

**Retorna:** Promise<Object> { success: true, data: {...} }

**Ejemplo de uso en un componente:**
```jsx
import { useState, useEffect } from "react";
import * as ProgramService from "../Services/CreateProgram";

function CrearProgramaForm() {
  const [cargando, setCargando] = useState(false);
  const [facultades, setFacultades] = useState([]);
  const [codigoPrograma, setCodigoPrograma] = useState("");
  const [idFacultad, setIdFacultad] = useState("");
  const [nombrePrograma, setNombrePrograma] = useState("");

  // Cargar facultades al montar
  useEffect(() => {
    cargarFacultades();
  }, []);

  const cargarFacultades = async () => {
    setCargando(true);
    try {
      const datos = await ProgramService.obtenerFacultades();
      setFacultades(datos);
      if (datos.length > 0) {
        setIdFacultad(datos[0].id_facultad); // Seleccionar primera por defecto
      }
    } catch (error) {
      alert(`Error: ${error.message}`);
    } finally {
      setCargando(false);
    }
  };

  const handleCrear = async (e) => {
    e.preventDefault();
    
    if (!codigoPrograma.trim() || !idFacultad.trim() || !nombrePrograma.trim()) {
      alert("Por favor completa todos los campos");
      return;
    }

    setCargando(true);
    try {
      const resultado = await ProgramService.crearPrograma({
        codigo_programa: codigoPrograma.toUpperCase(),
        id_facultad: idFacultad,
        nombre_programa: nombrePrograma.trim()
      });
      
      console.log("✅ Programa creado:", resultado.data);
      alert("Programa creado exitosamente");
      setCodigoPrograma("");
      setNombrePrograma("");
    } catch (error) {
      console.error("❌ Error:", error.message);
      alert(`Error: ${error.message}`);
    } finally {
      setCargando(false);
    }
  };

  return (
    <form onSubmit={handleCrear}>
      <div>
        <label>Facultad</label>
        <select 
          value={idFacultad}
          onChange={(e) => setIdFacultad(e.target.value)}
          required
          disabled={cargando}
        >
          <option value="">Seleccionar facultad</option>
          {facultades.map(fac => (
            <option key={fac.id_facultad} value={fac.id_facultad}>
              {fac.nombre_facultad}
            </option>
          ))}
        </select>
      </div>
      
      <input
        type="text"
        value={codigoPrograma}
        onChange={(e) => setCodigoPrograma(e.target.value)}
        placeholder="Código (ej: ING_SIS)"
        maxLength="50"
        required
        disabled={cargando}
      />
      
      <input
        type="text"
        value={nombrePrograma}
        onChange={(e) => setNombrePrograma(e.target.value)}
        placeholder="Nombre (ej: Ingeniería de Sistemas)"
        maxLength="255"
        required
        disabled={cargando}
      />
      
      <button type="submit" disabled={cargando}>
        {cargando ? "Creando..." : "Crear Programa"}
      </button>
    </form>
  );
}

export default CrearProgramaForm;
```

---

### 5. **actualizarPrograma(facultadId, codigoPrograma, datosPrograma)**
Actualiza los datos de un programa existente.

**Parámetros:**
- `facultadId`: string - ID de la facultad
- `codigoPrograma`: string - Código del programa a actualizar
- `datosPrograma`:
```jsx
{
  nombre_programa: "Nuevo nombre" // string (requerido)
}
```

**Retorna:** Promise<Object> { success: true, data: {...} }

**Ejemplo:**
```jsx
try {
  const resultado = await ProgramService.actualizarPrograma("FAC_ING", "ING_SIS", {
    nombre_programa: "Ingeniería de Sistemas e Informática"
  });
  console.log("✅ Programa actualizado:", resultado.data);
} catch (error) {
  console.error("❌ Error:", error.message);
}
```

---

### 6. **eliminarPrograma(facultadId, codigoPrograma)**
Elimina un programa del sistema.

**Parámetros:**
- `facultadId`: string - ID de la facultad
- `codigoPrograma`: string - Código del programa a eliminar

**Retorna:** Promise<Object> { success: true }

**Ejemplo:**
```jsx
try {
  const resultado = await ProgramService.eliminarPrograma("FAC_ING", "ING_SIS");
  console.log("✅ Programa eliminado");
  alert("Programa eliminado exitosamente");
} catch (error) {
  console.error("❌ Error:", error.message);
  alert(`Error: ${error.message}`);
}
```

---

### 7. **filtrarProgramas(programas, searchTerm)**
Filtra una lista de programas por un término de búsqueda.

**Parámetros:**
- `programas`: Array - Lista de programas
- `searchTerm`: string - Término de búsqueda

**Retorna:** Array - Programas filtrados

**Ejemplo:**
```jsx
const programas = await ProgramService.obtenerProgramasPorFacultad("FAC_ING");
const filtrados = ProgramService.filtrarProgramas(programas, "Sistemas");
console.log(filtrados); // Solo programas que contengan "Sistemas"
```

---

### 8. **validarCodigoPrograma(codigoPrograma)**
Valida el formato del código del programa.

**Parámetros:**
- `codigoPrograma`: string - Código a validar

**Retorna:** boolean

**Reglas de validación:**
- Mínimo 3 caracteres, máximo 50
- Solo permite: A-Z, 0-9, _, -
- Ejemplo válido: "ING_SIS", "ING_IND", "PROG_01"

**Ejemplo:**
```jsx
console.log(ProgramService.validarCodigoPrograma("ING_SIS"));      // true
console.log(ProgramService.validarCodigoPrograma("ing_sis"));      // false (minúsculas)
console.log(ProgramService.validarCodigoPrograma("IS"));           // false (muy corto)
```

---

### 9. **validarNombrePrograma(nombrePrograma)**
Valida el nombre del programa.

**Parámetros:**
- `nombrePrograma`: string - Nombre a validar

**Retorna:** boolean

**Reglas de validación:**
- No puede estar vacío
- Mínimo 1 carácter, máximo 255

**Ejemplo:**
```jsx
console.log(ProgramService.validarNombrePrograma("Ingeniería de Sistemas")); // true
console.log(ProgramService.validarNombrePrograma(""));                      // false
```

---

### 10. **validarDatosPrograma(datosPrograma)**
Valida todos los datos del programa y retorna errores específicos.

**Parámetros:**
```jsx
{
  codigo_programa: "ING_SIS",
  id_facultad: "FAC_ING",
  nombre_programa: "Ingeniería de Sistemas"
}
```

**Retorna:**
```jsx
{
  valido: true,
  errores: [] // Array de strings con errores encontrados
}
```

**Ejemplo:**
```jsx
const validacion = ProgramService.validarDatosPrograma({
  codigo_programa: "ING_SIS",
  id_facultad: "FAC_ING",
  nombre_programa: "Ingeniería de Sistemas"
});

if (!validacion.valido) {
  console.log("Errores:", validacion.errores);
  // ["El código del programa es obligatorio", ...]
}
```

---

### 11. **formatearDatosPrograma(formData)**
Formatea datos del formulario para envío al backend.

**Parámetros:**
```jsx
{
  codigoPrograma: "ing_sis",
  idFacultad: "FAC_ING",
  nombrePrograma: "  Ingeniería de Sistemas  "
}
```

**Retorna:**
```jsx
{
  codigo_programa: "ING_SIS",
  id_facultad: "FAC_ING",
  nombre_programa: "Ingeniería de Sistemas"
}
```

---

### 12. **obtenerNombreFacultad(facultades, facultadId)**
Obtiene el nombre de una facultad por su ID.

**Parámetros:**
- `facultades`: Array - Lista de facultades
- `facultadId`: string - ID a buscar

**Retorna:** string - Nombre de la facultad

**Ejemplo:**
```jsx
const facultades = await ProgramService.obtenerFacultades();
const nombre = ProgramService.obtenerNombreFacultad(facultades, "FAC_ING");
console.log(nombre); // "Ingenierías y Tecnologías"
```

---

## Manejo de Errores

El servicio maneja automáticamente diferentes tipos de errores HTTP:

| Código | Situación | Error Típico |
|--------|-----------|--------------|
| 201 | Creado exitosamente | N/A - Éxito |
| 200 | Ok | N/A - Éxito |
| 400 | Solicitud incorrecta | Datos inválidos |
| 401 | No autorizado | Token expirado |
| 403 | Sin permisos | Usuario no es admin |
| 404 | No encontrado | Facultad o programa no existe |
| 409 | Conflicto | Programa ya existe |
| 422 | Error de validación | Datos no válidos |

**Ejemplo de manejo de errores:**
```jsx
try {
  await ProgramService.crearPrograma(datos);
} catch (error) {
  if (error.message.includes("Conflicto")) {
    alert("El programa ya existe");
  } else if (error.message.includes("No encontrada")) {
    alert("La facultad no existe");
  } else if (error.message.includes("Sin permisos")) {
    alert("No tiene permisos para crear programas");
  } else {
    alert(`Error: ${error.message}`);
  }
}
```

---

## Flujo Completo: Crear Programa

```jsx
import { useState, useEffect } from "react";
import * as ProgramService from "../Services/CreateProgram";

function CrearProgramaCompleto() {
  const [facultades, setFacultades] = useState([]);
  const [programas, setProgramas] = useState([]);
  const [cargando, setCargando] = useState(false);
  const [codigoPrograma, setCodigoPrograma] = useState("");
  const [idFacultad, setIdFacultad] = useState("");
  const [nombrePrograma, setNombrePrograma] = useState("");
  const [erroresValidacion, setErroresValidacion] = useState([]);

  // Cargar facultades al montar
  useEffect(() => {
    cargarFacultades();
  }, []);

  // Cargar programas cuando cambia la facultad
  useEffect(() => {
    if (idFacultad) {
      cargarProgramas(idFacultad);
    }
  }, [idFacultad]);

  const cargarFacultades = async () => {
    setCargando(true);
    try {
      const datos = await ProgramService.obtenerFacultades();
      setFacultades(datos);
      if (datos.length > 0) {
        setIdFacultad(datos[0].id_facultad);
      }
    } catch (error) {
      alert(`Error al cargar facultades: ${error.message}`);
    } finally {
      setCargando(false);
    }
  };

  const cargarProgramas = async (facultadId) => {
    setCargando(true);
    try {
      const datos = await ProgramService.obtenerProgramasPorFacultad(facultadId);
      setProgramas(datos);
    } catch (error) {
      console.error("Error al cargar programas:", error);
      setProgramas([]);
    } finally {
      setCargando(false);
    }
  };

  const handleCrear = async (e) => {
    e.preventDefault();

    // Validar
    const validacion = ProgramService.validarDatosPrograma({
      codigo_programa: codigoPrograma,
      id_facultad: idFacultad,
      nombre_programa: nombrePrograma
    });

    if (!validacion.valido) {
      setErroresValidacion(validacion.errores);
      return;
    }

    setErroresValidacion([]);
    setCargando(true);

    try {
      const datosFormateados = ProgramService.formatearDatosPrograma({
        codigoPrograma,
        idFacultad,
        nombrePrograma
      });

      await ProgramService.crearPrograma(datosFormateados);

      alert("✅ Programa creado exitosamente");
      setCodigoPrograma("");
      setNombrePrograma("");
      
      // Recargar lista
      if (idFacultad) {
        await cargarProgramas(idFacultad);
      }
    } catch (error) {
      alert(`❌ Error: ${error.message}`);
    } finally {
      setCargando(false);
    }
  };

  return (
    <div>
      <h1>Crear Nuevo Programa</h1>

      <form onSubmit={handleCrear}>
        <div>
          <label>Facultad</label>
          <select 
            value={idFacultad}
            onChange={(e) => setIdFacultad(e.target.value)}
            required
            disabled={cargando}
          >
            <option value="">Seleccionar facultad</option>
            {facultades.map(fac => (
              <option key={fac.id_facultad} value={fac.id_facultad}>
                {fac.nombre_facultad}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label>Código del Programa</label>
          <input
            type="text"
            value={codigoPrograma}
            onChange={(e) => setCodigoPrograma(e.target.value)}
            placeholder="ING_SIS"
            maxLength="50"
            required
            disabled={cargando}
          />
        </div>

        <div>
          <label>Nombre del Programa</label>
          <input
            type="text"
            value={nombrePrograma}
            onChange={(e) => setNombrePrograma(e.target.value)}
            placeholder="Ingeniería de Sistemas"
            maxLength="255"
            required
            disabled={cargando}
          />
        </div>

        {erroresValidacion.length > 0 && (
          <div style={{ color: "red" }}>
            <h4>Errores:</h4>
            <ul>
              {erroresValidacion.map((error, idx) => (
                <li key={idx}>{error}</li>
              ))}
            </ul>
          </div>
        )}

        <button type="submit" disabled={cargando}>
          {cargando ? "Creando..." : "Crear Programa"}
        </button>
      </form>

      <h2>Programas de {idFacultad ? ProgramService.obtenerNombreFacultad(facultades, idFacultad) : "la facultad"}</h2>
      {cargando ? (
        <p>Cargando...</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Código</th>
              <th>Nombre</th>
            </tr>
          </thead>
          <tbody>
            {programas.map(prog => (
              <tr key={prog.codigo_programa}>
                <td>{prog.codigo_programa}</td>
                <td>{prog.nombre_programa}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default CrearProgramaCompleto;
```

---

## Estructura de Respuesta del Backend

El backend retorna respuestas en el siguiente formato:

**Éxito (201 - Created):**
```json
{
  "status": "success",
  "message": "Programa creado exitosamente",
  "data": {
    "codigo_programa": "ING_SIS",
    "id_facultad": "FAC_ING",
    "nombre_programa": "Ingeniería de Sistemas"
  }
}
```

**Éxito (200 - OK):**
```json
{
  "status": "success",
  "message": "Operación realizada exitosamente",
  "data": {...}
}
```

**Error (4xx):**
```json
{
  "status": "error",
  "message": "Error al crear programa",
  "detail": "El programa con código ING_SIS ya existe"
}
```

---

## Constantes de la API

Los endpoints están definidos en `src/utils/constants.js`:

```javascript
FACULTADES: `${API_BASE_URL}/api/v1/admin/academico/facultades`
FACULTAD_BY_ID: (id) => `${API_BASE_URL}/api/v1/admin/academico/facultades/${id}`
PROGRAMAS_BY_FACULTAD: (facultadId) => `${API_BASE_URL}/api/v1/admin/academico/facultades/${facultadId}/programas`
PROGRAMA_BY_ID: (facultadId, codigoPrograma) => `${API_BASE_URL}/api/v1/admin/academico/facultades/${facultadId}/programas/${codigoPrograma}`
```

---

## Notas Importantes

1. **Los Programas dependen de Facultades**: Siempre debes tener una facultad válida
2. **Autenticación**: Todas las llamadas requieren autenticación. Los headers se incluyen automáticamente
3. **Validación**: Valida los datos antes de enviar al backend
4. **Logging**: Las funciones incluyen console.log para debugging
5. **Estados de Carga**: Siempre actualiza el estado de cargando para mejorar UX
6. **IDs anidados**: El ID de la facultad va en la URL, no en el body (excepto en creación)

