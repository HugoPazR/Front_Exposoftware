# Casos de Prueba - Servicio de Facultades

## 📋 Índice
1. Pruebas Exitosas
2. Pruebas de Validación
3. Pruebas de Errores
4. Pruebas de Integración

---

## ✅ 1. Pruebas Exitosas

### 1.1 Crear Facultad Exitosamente
```javascript
// Input
const datos = {
  id_facultad: "FAC_ING",
  nombre_facultad: "Ingenierías y Tecnologías"
};

// Resultado esperado
// Status: 201
// Respuesta: { success: true, data: { id_facultad: "FAC_ING", nombre_facultad: "Ingenierías y Tecnologías" } }

const resultado = await FacultyService.crearFacultad(datos);
console.log(resultado); // ✅ success
```

### 1.2 Obtener Todas las Facultades
```javascript
// Input: ninguno

// Resultado esperado
// Status: 200
// Array con todas las facultades

const facultades = await FacultyService.obtenerFacultades();
console.log(facultades.length); // ✅ > 0
```

### 1.3 Actualizar Facultad
```javascript
// Input
const idFacultad = "FAC_ING";
const datos = {
  nombre_facultad: "Ingenierías, Tecnologías y Ciencias"
};

// Resultado esperado
// Status: 200
// Facultad actualizada

const resultado = await FacultyService.actualizarFacultad(idFacultad, datos);
console.log(resultado.success); // ✅ true
```

### 1.4 Eliminar Facultad (sin dependencias)
```javascript
// Input
const idFacultad = "FAC_TEST";

// Resultado esperado
// Status: 200
// Facultad eliminada

const resultado = await FacultyService.eliminarFacultad(idFacultad);
console.log(resultado.success); // ✅ true
```

---

## ⚠️ 2. Pruebas de Validación

### 2.1 Validar ID de Facultad - Válidos
```javascript
console.log(FacultyService.validarIdFacultad("FAC_ING"));      // ✅ true
console.log(FacultyService.validarIdFacultad("FAC_ADM"));      // ✅ true
console.log(FacultyService.validarIdFacultad("PROG_01"));      // ✅ true
console.log(FacultyService.validarIdFacultad("FAC-DERECHOM")); // ✅ true
console.log(FacultyService.validarIdFacultad("ABC"));          // ✅ true (mínimo 3)
console.log(FacultyService.validarIdFacultad("ABC123"));       // ✅ true
```

### 2.2 Validar ID de Facultad - Inválidos
```javascript
console.log(FacultyService.validarIdFacultad("fac_ing"));      // ❌ false (minúsculas)
console.log(FacultyService.validarIdFacultad("FAC ing"));      // ❌ false (espacios)
console.log(FacultyService.validarIdFacultad("FA"));           // ❌ false (< 3 caracteres)
console.log(FacultyService.validarIdFacultad(""));             // ❌ false (vacío)
console.log(FacultyService.validarIdFacultad("FAC@ING"));      // ❌ false (caracteres especiales)
```

### 2.3 Validar Nombre de Facultad - Válidos
```javascript
console.log(FacultyService.validarNombreFacultad("Ingenierías"));                           // ✅ true
console.log(FacultyService.validarNombreFacultad("Ingenierías y Tecnologías"));             // ✅ true
console.log(FacultyService.validarNombreFacultad("Derecho Administrativo Laboral Social")); // ✅ true
console.log(FacultyService.validarNombreFacultad("A"));                                     // ✅ true (mínimo 1)
```

### 2.4 Validar Nombre de Facultad - Inválidos
```javascript
console.log(FacultyService.validarNombreFacultad(""));                    // ❌ false (vacío)
console.log(FacultyService.validarNombreFacultad("   "));                // ❌ false (solo espacios)
console.log(FacultyService.validarNombreFacultad("A".repeat(256)));     // ❌ false (> 255 caracteres)
```

### 2.5 Formatear Datos de Facultad
```javascript
// Input
const formData = {
  idFacultad: "fac_ing",
  nombreFacultad: "  Ingenierías y Tecnologías  "
};

// Resultado esperado
const resultado = FacultyService.formatearDatosFacultad(formData);
console.log(resultado);
// {
//   id_facultad: "FAC_ING",
//   nombre_facultad: "Ingenierías y Tecnologías"
// }

console.log(resultado.id_facultad === "FAC_ING");                    // ✅ true
console.log(resultado.nombre_facultad === "Ingenierías y Tecnologías"); // ✅ true
```

### 2.6 Filtrar Facultades
```javascript
// Input
const facultades = [
  { id_facultad: "FAC_ING", nombre_facultad: "Ingenierías" },
  { id_facultad: "FAC_ADM", nombre_facultad: "Administración" },
  { id_facultad: "FAC_DER", nombre_facultad: "Derecho" }
];

// Test 1: Búsqueda por nombre
const resultado1 = FacultyService.filtrarFacultades(facultades, "Ingeniería");
console.log(resultado1.length); // ✅ 1
console.log(resultado1[0].id_facultad); // ✅ "FAC_ING"

// Test 2: Búsqueda por ID
const resultado2 = FacultyService.filtrarFacultades(facultades, "FAC_ADM");
console.log(resultado2.length); // ✅ 1
console.log(resultado2[0].nombre_facultad); // ✅ "Administración"

// Test 3: Sin búsqueda
const resultado3 = FacultyService.filtrarFacultades(facultades, "");
console.log(resultado3.length); // ✅ 3

// Test 4: Sin coincidencias
const resultado4 = FacultyService.filtrarFacultades(facultades, "Medicina");
console.log(resultado4.length); // ✅ 0

// Test 5: Array vacío
const resultado5 = FacultyService.filtrarFacultades([], "test");
console.log(resultado5.length); // ✅ 0
```

---

## ❌ 3. Pruebas de Errores

### 3.1 Error 400 - Solicitud Incorrecta
```javascript
// Caso: ID vacío
try {
  await FacultyService.crearFacultad({
    id_facultad: "",
    nombre_facultad: "Ingenierías"
  });
} catch (error) {
  console.log(error.message); 
  // ✅ "El ID de la facultad es obligatorio"
}

// Caso: Nombre vacío
try {
  await FacultyService.crearFacultad({
    id_facultad: "FAC_ING",
    nombre_facultad: ""
  });
} catch (error) {
  console.log(error.message); 
  // ✅ "El nombre de la facultad es obligatorio"
}
```

### 3.2 Error 401 - No Autorizado
```javascript
// Caso: Token expirado o inválido
// Resultado esperado: Error 401
// Mensaje: "No autorizado: Debe iniciar sesión"

try {
  // Si el token es inválido
  const facultades = await FacultyService.obtenerFacultades();
} catch (error) {
  console.log(error.message); 
  // ✅ "No autorizado: Debe iniciar sesión"
}
```

### 3.3 Error 403 - Sin Permisos
```javascript
// Caso: Usuario sin permisos de admin
// Resultado esperado: Error 403
// Mensaje: "Sin permisos: No tiene permisos para crear facultades"

try {
  await FacultyService.crearFacultad({
    id_facultad: "FAC_ING",
    nombre_facultad: "Ingenierías"
  });
} catch (error) {
  console.log(error.message); 
  // ✅ "Sin permisos: No tiene permisos para crear facultades"
}
```

### 3.4 Error 404 - No Encontrado
```javascript
// Caso: Actualizar facultad inexistente
try {
  await FacultyService.actualizarFacultad("FAC_INEXISTENTE", {
    nombre_facultad: "Nuevo Nombre"
  });
} catch (error) {
  console.log(error.message); 
  // ✅ "No encontrada: La facultad no existe"
}

// Caso: Eliminar facultad inexistente
try {
  await FacultyService.eliminarFacultad("FAC_INEXISTENTE");
} catch (error) {
  console.log(error.message); 
  // ✅ "No encontrada: La facultad no existe"
}
```

### 3.5 Error 409 - Conflicto (Facultad duplicada)
```javascript
// Caso: Crear facultad que ya existe
try {
  // Primera creación exitosa
  await FacultyService.crearFacultad({
    id_facultad: "FAC_ING",
    nombre_facultad: "Ingenierías"
  });

  // Intentar crear duplicada
  await FacultyService.crearFacultad({
    id_facultad: "FAC_ING",
    nombre_facultad: "Ingenierías Nuevas"
  });
} catch (error) {
  console.log(error.message); 
  // ✅ "Conflicto: La facultad ya existe"
}
```

### 3.6 Error 409 - Conflicto (Con dependencias)
```javascript
// Caso: Eliminar facultad que tiene programas asociados
try {
  await FacultyService.eliminarFacultad("FAC_ING");
} catch (error) {
  console.log(error.message); 
  // ✅ "Conflicto: No se puede eliminar: la facultad tiene programas asociados"
}
```

### 3.7 Error 422 - Error de Validación
```javascript
// Caso: Datos que no pasan validación en el backend
try {
  await FacultyService.crearFacultad({
    id_facultad: "FACULTAD_INGENIERIA_MUY_LARGA_QUE_EXCEDE_LIMITES",
    nombre_facultad: "Ingenierías"
  });
} catch (error) {
  console.log(error.message); 
  // ✅ "Error de validación: Los datos no son válidos"
}
```

### 3.8 Error de Conexión
```javascript
// Caso: Sin conexión a internet o servidor caído
try {
  const facultades = await FacultyService.obtenerFacultades();
} catch (error) {
  console.log(error.message); 
  // ✅ "Error de conexión al cargar facultades. Verifique su conexión a internet."
}
```

---

## 🔗 4. Pruebas de Integración

### 4.1 Flujo Completo: CRUD
```javascript
// 1. Crear
const nuevaFacultad = await FacultyService.crearFacultad({
  id_facultad: "FAC_TEST",
  nombre_facultad: "Facultad de Prueba"
});
console.log("✅ Creada:", nuevaFacultad.data);

// 2. Leer
const facultades = await FacultyService.obtenerFacultades();
const encontrada = facultades.find(f => f.id_facultad === "FAC_TEST");
console.log("✅ Encontrada:", encontrada.nombre_facultad);

// 3. Actualizar
const actualizada = await FacultyService.actualizarFacultad("FAC_TEST", {
  nombre_facultad: "Facultad de Prueba Actualizada"
});
console.log("✅ Actualizada:", actualizada.data);

// 4. Eliminar
const eliminada = await FacultyService.eliminarFacultad("FAC_TEST");
console.log("✅ Eliminada correctamente");

// Verificar eliminación
const facultadesFinal = await FacultyService.obtenerFacultades();
const noEncontrada = facultadesFinal.find(f => f.id_facultad === "FAC_TEST");
console.log("✅ Verificado - No existe:", noEncontrada === undefined);
```

### 4.2 Filtrado y Búsqueda
```javascript
// 1. Obtener todas las facultades
const facultades = await FacultyService.obtenerFacultades();
console.log("Total:", facultades.length);

// 2. Filtrar por nombre
const ingenierias = FacultyService.filtrarFacultades(facultades, "ingeniería");
console.log("✅ Encontradas", ingenierias.length, "ingenierías");

// 3. Filtrar por ID
const facIng = FacultyService.filtrarFacultades(facultades, "FAC_ING");
console.log("✅ Facultad:", facIng[0]?.nombre_facultad);

// 4. Sin resultados
const medicina = FacultyService.filtrarFacultades(facultades, "medicina");
console.log("✅ Medicina no encontrada:", medicina.length === 0);
```

### 4.3 Validación en Formulario
```javascript
const datosFormulario = {
  idFacultad: "fac_ing",
  nombreFacultad: "  Ingenierías y Tecnologías  "
};

// Validar
const idValido = FacultyService.validarIdFacultad(datosFormulario.idFacultad);
const nombreValido = FacultyService.validarNombreFacultad(datosFormulario.nombreFacultad);

if (!idValido || !nombreValido) {
  console.log("❌ Datos inválidos");
} else {
  // Formatear
  const datosFormateados = FacultyService.formatearDatosFacultad(datosFormulario);
  
  // Crear
  const resultado = await FacultyService.crearFacultad(datosFormateados);
  console.log("✅ Facultad creada:", resultado.data);
}
```

### 4.4 Manejo de Errores en Componente
```javascript
async function crearFacultadSegura(datos) {
  try {
    // Validar antes
    if (!FacultyService.validarIdFacultad(datos.id_facultad)) {
      throw new Error("ID de facultad inválido");
    }
    if (!FacultyService.validarNombreFacultad(datos.nombre_facultad)) {
      throw new Error("Nombre de facultad inválido");
    }

    // Crear
    const resultado = await FacultyService.crearFacultad(datos);
    console.log("✅ Éxito:", resultado.data);
    return resultado;

  } catch (error) {
    // Identificar tipo de error
    if (error.message.includes("Conflicto")) {
      console.error("⚠️ Facultad ya existe");
    } else if (error.message.includes("Sin permisos")) {
      console.error("🔒 No tiene permisos");
    } else if (error.message.includes("No autorizado")) {
      console.error("🔐 Debe iniciar sesión");
    } else {
      console.error("❌ Error:", error.message);
    }
    throw error;
  }
}
```

---

## 📊 Tabla de Prueba Rápida

| Función | Input | Esperado | Status |
|---------|-------|----------|--------|
| crearFacultad | {id: "FAC_ING", nombre: "Ingeniería"} | 201 + datos | ✅ |
| obtenerFacultades | - | 200 + array | ✅ |
| actualizarFacultad | ("FAC_ING", {nombre: "New"}) | 200 + datos | ✅ |
| eliminarFacultad | "FAC_ING" | 200 + {success: true} | ✅ |
| filtrarFacultades | (array, "ingeniería") | Array filtrado | ✅ |
| validarIdFacultad | "FAC_ING" | true | ✅ |
| validarNombreFacultad | "Ingeniería" | true | ✅ |
| formatearDatosFacultad | {...} | {...formateado} | ✅ |

---

## 🚀 Cómo Ejecutar las Pruebas

### En la Consola del Navegador
```javascript
// 1. Importar el servicio (si ya está en el proyecto)
import * as FacultyService from "./Services/CreateFaculty.js";

// 2. Ejecutar prueba
const resultado = await FacultyService.crearFacultad({
  id_facultad: "FAC_TEST",
  nombre_facultad: "Test"
});
console.log(resultado);
```

### En un Componente React
```jsx
import * as FacultyService from "../Services/CreateFaculty";

function TestComponent() {
  const handleTest = async () => {
    try {
      const resultado = await FacultyService.crearFacultad({
        id_facultad: "FAC_TEST",
        nombre_facultad: "Test"
      });
      console.log("✅ Test exitoso:", resultado);
    } catch (error) {
      console.error("❌ Test fallido:", error);
    }
  };

  return <button onClick={handleTest}>Ejecutar Prueba</button>;
}
```

