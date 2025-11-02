# ⚡ QUICK START - Servicio de Programas

## En 3 Pasos

### Paso 1: Importar
```javascript
import * as ProgramService from "../Services/CreateProgram";
```

### Paso 2: Obtener Facultades
```javascript
const facultades = await ProgramService.obtenerFacultades();
// Necesario para saber en qué facultad crear el programa
```

### Paso 3: Crear Programa
```javascript
await ProgramService.crearPrograma({
  codigo_programa: "ING_SIS",
  id_facultad: "FAC_ING",
  nombre_programa: "Ingeniería de Sistemas"
});
```

---

## 📊 Estructura Jerárquica

```
Facultad (FAC_ING)
  └─ Programas
      ├─ ING_SIS (Ingeniería de Sistemas)
      ├─ ING_IND (Ingeniería Industrial)
      └─ ING_CIV (Ingeniería Civil)

Facultad (FAC_ADM)
  └─ Programas
      ├─ ADM_EMP (Administración de Empresas)
      └─ ...
```

El **programa SIEMPRE** debe estar asociado a una **facultad**. No puedes crear un programa sin facultad.

---

## 🎯 Funciones Principales

| Función | Tipo | Descripción |
|---------|------|-------------|
| `obtenerFacultades()` | GET | Obtiene todas las facultades |
| `obtenerFacultadPorId()` | GET | Obtiene una facultad por ID |
| `obtenerProgramasPorFacultad()` | GET | Obtiene programas de una facultad |
| `crearPrograma()` | POST | Crea nuevo programa en una facultad |
| `actualizarPrograma()` | PUT | Actualiza un programa |
| `eliminarPrograma()` | DELETE | Elimina un programa |
| `filtrarProgramas()` | Local | Filtra sin API call |
| `validarCodigoPrograma()` | Validación | Valida formato código |
| `validarNombrePrograma()` | Validación | Valida formato nombre |
| `validarDatosPrograma()` | Validación | Valida todos los datos |
| `formatearDatosPrograma()` | Utilidad | Formatea datos |
| `obtenerNombreFacultad()` | Utilidad | Obtiene nombre facultad |

---

## 📝 Formato del Programa

```json
{
  "codigo_programa": "ING_SIS",
  "id_facultad": "FAC_ING",
  "nombre_programa": "Ingeniería de Sistemas"
}
```

**Campos obligatorios:**
- ✅ `codigo_programa` - 3-50 caracteres (A-Z, 0-9, _, -)
- ✅ `id_facultad` - ID de una facultad existente
- ✅ `nombre_programa` - 1-255 caracteres

---

## 🔄 Flujo Típico

```
1. Obtener Facultades
   ↓
2. Mostrar selector de facultades al usuario
   ↓
3. Usuario selecciona facultad
   ↓
4. Obtener programas de esa facultad (opcional)
   ↓
5. Mostrar tabla de programas (opcional)
   ↓
6. Usuario llena formulario:
   - Selecciona facultad
   - Ingresa código del programa
   - Ingresa nombre del programa
   ↓
7. Crear programa
   ↓
8. Recargar lista de programas
   ↓
9. Mostrar éxito o error
```

---

## 💻 Ejemplo Real Completo

```jsx
import { useState, useEffect } from "react";
import * as ProgramService from "../Services/CreateProgram";

function GestionarProgramas() {
  const [facultades, setFacultades] = useState([]);
  const [programas, setProgramas] = useState([]);
  const [cargando, setCargando] = useState(false);
  const [idFacultadSeleccionada, setIdFacultadSeleccionada] = useState("");
  const [codigoPrograma, setCodigoPrograma] = useState("");
  const [nombrePrograma, setNombrePrograma] = useState("");

  // 1. Cargar facultades al iniciar
  useEffect(() => {
    cargarFacultades();
  }, []);

  // 2. Cargar programas cuando cambia de facultad
  useEffect(() => {
    if (idFacultadSeleccionada) {
      cargarProgramas(idFacultadSeleccionada);
    }
  }, [idFacultadSeleccionada]);

  const cargarFacultades = async () => {
    setCargando(true);
    try {
      const datos = await ProgramService.obtenerFacultades();
      setFacultades(datos);
      // Seleccionar primera por defecto
      if (datos.length > 0) {
        setIdFacultadSeleccionada(datos[0].id_facultad);
      }
    } catch (error) {
      alert(`Error: ${error.message}`);
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
      console.error("Error:", error);
      setProgramas([]);
    } finally {
      setCargando(false);
    }
  };

  const handleCrear = async (e) => {
    e.preventDefault();

    if (!codigoPrograma.trim() || !nombrePrograma.trim()) {
      alert("Completa todos los campos");
      return;
    }

    setCargando(true);
    try {
      await ProgramService.crearPrograma({
        codigo_programa: codigoPrograma.toUpperCase(),
        id_facultad: idFacultadSeleccionada,
        nombre_programa: nombrePrograma.trim()
      });

      alert("✅ Programa creado");
      setCodigoPrograma("");
      setNombrePrograma("");
      
      // Recargar programas
      await cargarProgramas(idFacultadSeleccionada);
    } catch (error) {
      alert(`❌ ${error.message}`);
    } finally {
      setCargando(false);
    }
  };

  const handleEliminar = async (codigoPrograma) => {
    if (!window.confirm("¿Está seguro?")) return;

    setCargando(true);
    try {
      await ProgramService.eliminarPrograma(
        idFacultadSeleccionada,
        codigoPrograma
      );
      alert("✅ Programa eliminado");
      await cargarProgramas(idFacultadSeleccionada);
    } catch (error) {
      alert(`❌ ${error.message}`);
    } finally {
      setCargando(false);
    }
  };

  return (
    <div style={{ maxWidth: "1000px", margin: "0 auto", padding: "20px" }}>
      <h1>Gestión de Programas</h1>

      {/* Formulario */}
      <form onSubmit={handleCrear} style={{ marginBottom: "30px", padding: "20px", background: "#f5f5f5", borderRadius: "8px" }}>
        <h2>Crear Programa</h2>

        <div style={{ marginBottom: "10px" }}>
          <label>Facultad</label>
          <select
            value={idFacultadSeleccionada}
            onChange={(e) => setIdFacultadSeleccionada(e.target.value)}
            required
            disabled={cargando}
          >
            {facultades.map(fac => (
              <option key={fac.id_facultad} value={fac.id_facultad}>
                {fac.nombre_facultad}
              </option>
            ))}
          </select>
        </div>

        <div style={{ marginBottom: "10px" }}>
          <label>Código Programa</label>
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

        <div style={{ marginBottom: "10px" }}>
          <label>Nombre Programa</label>
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

        <button type="submit" disabled={cargando}>
          {cargando ? "Creando..." : "Crear"}
        </button>
      </form>

      {/* Tabla */}
      <div>
        <h2>Programas</h2>
        <p>Facultad: <strong>{ProgramService.obtenerNombreFacultad(facultades, idFacultadSeleccionada)}</strong></p>

        {cargando ? (
          <p>Cargando...</p>
        ) : programas.length === 0 ? (
          <p>No hay programas</p>
        ) : (
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ borderBottom: "2px solid #ddd" }}>
                <th style={{ padding: "10px", textAlign: "left" }}>Código</th>
                <th style={{ padding: "10px", textAlign: "left" }}>Nombre</th>
                <th style={{ padding: "10px", textAlign: "center" }}>Acción</th>
              </tr>
            </thead>
            <tbody>
              {programas.map(prog => (
                <tr key={prog.codigo_programa} style={{ borderBottom: "1px solid #eee" }}>
                  <td style={{ padding: "10px" }}>
                    <strong>{prog.codigo_programa}</strong>
                  </td>
                  <td style={{ padding: "10px" }}>{prog.nombre_programa}</td>
                  <td style={{ padding: "10px", textAlign: "center" }}>
                    <button
                      onClick={() => handleEliminar(prog.codigo_programa)}
                      disabled={cargando}
                      style={{ 
                        background: "red", 
                        color: "white", 
                        padding: "5px 10px",
                        cursor: cargando ? "not-allowed" : "pointer"
                      }}
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
    </div>
  );
}

export default GestionarProgramas;
```

---

## 🔍 Endpoint REST Actualizado

| Método | Ruta | Función |
|--------|------|---------|
| GET | `/api/v1/admin/academico/facultades` | `obtenerFacultades()` |
| GET | `/api/v1/admin/academico/facultades/{id}` | `obtenerFacultadPorId()` |
| GET | `/api/v1/admin/academico/facultades/{facultadId}/programas` | `obtenerProgramasPorFacultad()` |
| POST | `/api/v1/admin/academico/facultades/{facultadId}/programas` | `crearPrograma()` |
| PUT | `/api/v1/admin/academico/facultades/{facultadId}/programas/{codigo}` | `actualizarPrograma()` |
| DELETE | `/api/v1/admin/academico/facultades/{facultadId}/programas/{codigo}` | `eliminarPrograma()` |

---

## ✨ Características

✅ Validaciones de entrada  
✅ Manejo de errores HTTP  
✅ Autenticación automática  
✅ Dependencia de Facultades  
✅ Filtrado local  
✅ Formateo automático  
✅ Logging para debugging  

---

## 🚀 ¡Listo para usar!

El servicio está completamente funcional y listo para integrarse en tu aplicación.

**Documentación completa:** Ver `PROGRAM_SERVICE_GUIDE.md`

