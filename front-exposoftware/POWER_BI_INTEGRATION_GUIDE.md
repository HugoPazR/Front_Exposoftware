# 📊 Guía de Integración de Power BI

## 🎯 Resumen
Esta guía te explica cómo integrar reportes de Power BI en tu aplicación React de ExpoSoftware.

---

## 📁 Archivos Creados

### 1. **`/src/utils/constants.js`** ✅ Actualizado
```javascript
export const POWER_BI_CONFIG = {
  REPORT_URL: 'URL_DE_TU_REPORTE',
  REPORT_ID: 'ID_DEL_REPORTE',
  // ... configuración de Power BI
}
```

### 2. **`/src/Services/PowerBIService.jsx`** ✅ Nuevo
Servicio con funciones para:
- Obtener URLs de embed
- Abrir reportes en nueva pestaña
- Configurar Power BI client
- Extraer IDs de URLs

### 3. **`/src/components/PowerBI/PowerBIReport.jsx`** ✅ Nuevo
Componente React para mostrar reportes con 3 modos:
- `embed`: Incrusta el reporte en un iframe
- `link`: Solo botón para abrir en nueva pestaña
- `both`: Ambas opciones (recomendado)

### 4. **`/src/pages/Admin/Analytics.jsx`** ✅ Nuevo
Página completa de Analytics con:
- Dashboard de estadísticas
- Reporte de Power BI integrado
- Controles de personalización
- Información contextual

---

## 🚀 Cómo Usar

### Opción 1: Agregar ruta en App.jsx (Recomendado)

```jsx
// 1. Importar la página
import Analytics from "./pages/Admin/Analytics";

// 2. Agregar la ruta en tu componente Routes
<Routes>
  {/* ... otras rutas ... */}
  
  {/* Ruta para Admin */}
  <Route 
    path="/admin/analytics" 
    element={
      <AdminRoute>
        <Analytics />
      </AdminRoute>
    } 
  />
  
  {/* También puedes agregar para Teacher o Student */}
  <Route 
    path="/teacher/analytics" 
    element={
      <DocenteRoute>
        <Analytics />
      </DocenteRoute>
    } 
  />
</Routes>
```

### Opción 2: Usar el componente directamente en cualquier página

```jsx
import PowerBIReport from '../components/PowerBI/PowerBIReport';

function MiPagina() {
  return (
    <div>
      <h1>Mi Dashboard</h1>
      
      {/* Modo: Ambos (embed + link) */}
      <PowerBIReport
        mode="both"
        showFilters={false}
        showNavigation={false}
        height="700px"
        title="Reportes de Proyectos"
      />
    </div>
  );
}
```

### Opción 3: Solo abrir en nueva pestaña

```jsx
import { openPowerBIReport } from '../Services/PowerBIService';

function MiComponente() {
  const handleOpenReport = () => {
    openPowerBIReport();
  };

  return (
    <button onClick={handleOpenReport}>
      Ver Reporte en Power BI
    </button>
  );
}
```

---

## 🎨 Agregar al Sidebar/Navbar

### Para AdminSidebar.jsx:

```jsx
// Agregar esta sección al array de menuItems
{
  label: "📊 Analytics",
  to: "/admin/analytics",
  icon: "pi pi-chart-bar"
},
```

### Ejemplo completo:

```jsx
const menuItems = [
  { label: "Dashboard", to: "/admin/dashboard", icon: "pi pi-home" },
  { label: "Gestión de Estudiantes", to: "/admin/students", icon: "pi pi-users" },
  { label: "📊 Analytics", to: "/admin/analytics", icon: "pi pi-chart-bar" }, // NUEVO
  // ... más items
];
```

---

## ⚙️ Configuración de Power BI

### Paso 1: Obtener URL del reporte

1. Abre tu reporte en Power BI: https://app.powerbi.com
2. Copia la URL completa del navegador
3. Pégala en `constants.js` → `POWER_BI_CONFIG.REPORT_URL`

### Paso 2: Habilitar compartir (importante)

**Para que funcione el embed, necesitas:**

#### Opción A: Reporte público ⭐ MÁS FÁCIL
1. En Power BI → Archivo → Publicar en la web
2. Genera el enlace público
3. Usa ese enlace en tu app

#### Opción B: Con autenticación (requiere Azure AD)
1. Configurar Azure AD App Registration
2. Obtener Client ID y Client Secret
3. Implementar backend para tokens
4. Usar Power BI REST API

---

## 🔧 Props del Componente PowerBIReport

| Prop | Tipo | Default | Descripción |
|------|------|---------|-------------|
| `mode` | string | 'both' | 'embed', 'link', o 'both' |
| `showFilters` | boolean | false | Mostrar panel de filtros |
| `showNavigation` | boolean | false | Mostrar navegación de páginas |
| `height` | string | '600px' | Altura del iframe |
| `title` | string | 'Reporte...' | Título del reporte |

### Ejemplos:

```jsx
// Solo embed sin controles
<PowerBIReport
  mode="embed"
  showFilters={false}
  showNavigation={false}
  height="800px"
/>

// Solo link (botón para abrir)
<PowerBIReport
  mode="link"
/>

// Embed con filtros y navegación
<PowerBIReport
  mode="embed"
  showFilters={true}
  showNavigation={true}
  height="900px"
/>
```

---

## 📝 Ejemplo Completo en App.jsx

```jsx
import { Routes, Route } from "react-router-dom";
import Analytics from "./pages/Admin/Analytics";
import { AdminRoute } from "./components/ProtectedRoute";

function App() {
  return (
    <Routes>
      {/* ... otras rutas ... */}
      
      {/* 📊 ANALYTICS - Power BI */}
      <Route 
        path="/admin/analytics" 
        element={
          <AdminRoute>
            <Analytics />
          </AdminRoute>
        } 
      />
    </Routes>
  );
}
```

---

## 🎯 Funciones Disponibles en PowerBIService

### Funciones básicas (disponibles ahora):

```jsx
import {
  getPowerBIReportURL,      // Obtiene URL completa del reporte
  getPowerBIEmbedURL,        // Obtiene URL para embed en iframe
  openPowerBIReport,         // Abre reporte en nueva pestaña
  getPowerBIConfig,          // Configuración para Power BI Client
  isValidPowerBIURL,         // Valida URLs de Power BI
  extractPowerBIIds          // Extrae IDs de una URL
} from '../Services/PowerBIService';

// Ejemplo: Abrir reporte
const handleOpen = () => {
  openPowerBIReport();
};

// Ejemplo: Obtener URL para embed
const embedUrl = getPowerBIEmbedURL({
  filterPaneEnabled: true,
  navContentPaneEnabled: true
});
```

### Funciones avanzadas (requieren Azure AD):

```jsx
// NOTA: Estas requieren configuración adicional
getPowerBIAccessToken()     // Obtiene token de Azure AD
queryPowerBIData()          // Extrae datos específicos vía API
```

---

## 🔐 Solución de Problemas

### ❌ Error: "No se pudo cargar el reporte embebido"

**Causa:** El reporte no está configurado para compartir

**Solución:**
1. Publica el reporte como público en Power BI
2. O usa el modo `link` en lugar de `embed`:
   ```jsx
   <PowerBIReport mode="link" />
   ```

### ❌ Error: "Access Denied"

**Causa:** Requiere autenticación de Power BI

**Solución:**
1. Configura Azure AD (ver documentación avanzada)
2. O usa el botón "Abrir en Power BI" que abre en nueva pestaña

### ❌ El iframe está en blanco

**Causa:** CORS o permisos de iframe

**Solución:**
1. Verifica que el reporte sea público
2. Usa el modo `link`:
   ```jsx
   <PowerBIReport mode="link" />
   ```

---

## 📚 Recursos Adicionales

- [Documentación oficial de Power BI](https://docs.microsoft.com/power-bi/)
- [Power BI Embedded](https://docs.microsoft.com/power-bi/developer/embedded/)
- [Power BI REST API](https://docs.microsoft.com/rest/api/power-bi/)

---

## 🎉 ¡Listo!

Ahora tienes Power BI completamente integrado en tu app. 

**Próximos pasos recomendados:**

1. ✅ Agregar la ruta `/admin/analytics` en `App.jsx`
2. ✅ Agregar el link en `AdminSidebar.jsx`
3. ✅ Configurar el reporte como público en Power BI
4. ✅ Probar las diferentes vistas (embed, link, both)

**¿Dudas?** Revisa los ejemplos en:
- `/pages/Admin/Analytics.jsx` - Página completa
- `/components/PowerBI/PowerBIReport.jsx` - Componente
- `/Services/PowerBIService.jsx` - Servicios

---

**Creado para:** ExpoSoftware Frontend  
**Fecha:** Noviembre 2025  
**Autor:** GitHub Copilot
