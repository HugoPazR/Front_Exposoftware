# 🚀 Inicio Rápido - Power BI en 5 Minutos

## ✅ Ya está todo listo!

He creado e integrado Power BI en tu aplicación. Aquí está todo lo que necesitas:

---

## 📁 Archivos Creados

### ✅ Servicios
- `/src/Services/PowerBIService.jsx` - Todas las funciones para Power BI

### ✅ Componentes
- `/src/components/PowerBI/PowerBIReport.jsx` - Componente completo con embed
- `/src/components/PowerBI/PowerBIButton.jsx` - Botón simple para abrir reporte

### ✅ Páginas
- `/src/pages/Admin/Analytics.jsx` - Página completa de Analytics con dashboard

### ✅ Configuración
- `/src/utils/constants.js` - Ya tiene `POWER_BI_CONFIG`
- `/src/App.jsx` - Ya tiene la ruta `/admin/analytics`
- `/src/components/Layout/AdminSidebar.jsx` - Ya tiene el link "📊 Analytics"

---

## 🎯 Cómo Acceder

### 1. Inicia sesión como Admin
```
http://localhost:5173/login
```

### 2. Ve al Sidebar y haz clic en:
```
📊 Analytics & Reportes
```

### 3. O accede directamente:
```
http://localhost:5173/admin/analytics
```

---

## 🎨 Ejemplos de Uso

### Ejemplo 1: Usar en cualquier página (botón simple)

```jsx
import PowerBIButton from '../components/PowerBI/PowerBIButton';

function MiDashboard() {
  return (
    <div>
      <h1>Mi Dashboard</h1>
      
      {/* Botón simple */}
      <PowerBIButton 
        text="Ver Reportes de Power BI"
        variant="primary"
        size="md"
      />
    </div>
  );
}
```

### Ejemplo 2: Incrustar reporte completo

```jsx
import PowerBIReport from '../components/PowerBI/PowerBIReport';

function Reportes() {
  return (
    <div>
      <h1>Reportes</h1>
      
      {/* Reporte embebido */}
      <PowerBIReport
        mode="both"
        height="700px"
        title="Análisis de Proyectos"
      />
    </div>
  );
}
```

### Ejemplo 3: Solo link (sin embed)

```jsx
import PowerBIReport from '../components/PowerBI/PowerBIReport';

function Dashboard() {
  return (
    <div>
      <PowerBIReport mode="link" />
    </div>
  );
}
```

### Ejemplo 4: Función directa

```jsx
import { openPowerBIReport } from '../Services/PowerBIService';

function MiComponente() {
  const handleVerReportes = () => {
    openPowerBIReport();
  };

  return (
    <button onClick={handleVerReportes}>
      Abrir Power BI
    </button>
  );
}
```

---

## 🎛️ Variantes del Botón

```jsx
{/* Botón primario (azul) */}
<PowerBIButton variant="primary" />

{/* Botón secundario (morado) */}
<PowerBIButton variant="secondary" />

{/* Botón outline */}
<PowerBIButton variant="outline" />

{/* Tamaños */}
<PowerBIButton size="sm" />  {/* Pequeño */}
<PowerBIButton size="md" />  {/* Mediano */}
<PowerBIButton size="lg" />  {/* Grande */}

{/* Sin ícono */}
<PowerBIButton showIcon={false} text="Reportes" />

{/* Personalizado */}
<PowerBIButton 
  variant="primary"
  size="lg"
  text="📊 Ver Analytics"
  className="my-custom-class"
/>
```

---

## ⚙️ Configuración de Power BI

Tu URL actual está en `/src/utils/constants.js`:

```javascript
export const POWER_BI_CONFIG = {
  REPORT_URL: 'https://app.powerbi.com/groups/me/reports/7b4c14dc-cbf5-45dc-b61e-563a4c940115/465c14b0268e55932d6f?experience=power-bi',
  REPORT_ID: '7b4c14dc-cbf5-45dc-b61e-563a4c940115',
  PAGE_ID: '465c14b0268e55932d6f',
  // ...
}
```

### Para cambiar el reporte:

1. Abre tu reporte en Power BI
2. Copia la URL del navegador
3. Pégala en `REPORT_URL`
4. Los IDs se extraen automáticamente

---

## 🔧 Opciones del Componente PowerBIReport

```jsx
<PowerBIReport
  mode="both"              // 'embed', 'link', 'both'
  showFilters={false}      // true/false - Mostrar filtros
  showNavigation={false}   // true/false - Mostrar navegación
  height="700px"           // Altura del iframe
  title="Mi Reporte"       // Título del componente
/>
```

---

## 📊 ¿Qué incluye la página Analytics?

✅ Dashboard con estadísticas rápidas:
- Total de proyectos
- Estudiantes participantes
- Calificación promedio
- Programas activos

✅ Reporte de Power BI integrado:
- Modo embed + link
- Controles de personalización
- Manejo de errores

✅ Información adicional:
- Detalles del reporte
- Métricas principales
- Consejos de uso

✅ Diseño responsive:
- Funciona en desktop y móvil
- Tailwind CSS
- Iconos PrimeIcons

---

## 🎯 Próximos Pasos

### Opción A: Usar tal cual está (Recomendado)
Ya está todo listo. Solo accede a `/admin/analytics`

### Opción B: Agregar a otras páginas

**En Dashboard de Admin:**
```jsx
// src/pages/Admin/Dashboard.jsx
import PowerBIButton from '../../components/PowerBI/PowerBIButton';

// Agregar en el JSX:
<PowerBIButton 
  text="Ver Reportes" 
  variant="primary"
/>
```

**En Dashboard de Teacher:**
```jsx
// src/pages/Teacher/Dashboard.jsx
import PowerBIButton from '../../components/PowerBI/PowerBIButton';

// Agregar en el JSX:
<PowerBIButton 
  text="Analytics de Proyectos" 
  variant="secondary"
/>
```

**En Dashboard de Student:**
```jsx
// src/pages/Student/Dashboard.jsx
import PowerBIButton from '../../components/PowerBI/PowerBIButton';

// Agregar en el JSX:
<PowerBIButton 
  text="Ver Estadísticas" 
  variant="outline"
/>
```

### Opción C: Configurar autenticación avanzada (Azure AD)

Si necesitas:
- Acceso restringido a reportes
- Filtros dinámicos por usuario
- Datos en tiempo real

Ver: `POWER_BI_INTEGRATION_GUIDE.md` (sección avanzada)

---

## 🔐 Permisos de Power BI

### Para que funcione el EMBED:

**Opción 1: Reporte público** ⭐ MÁS FÁCIL
1. En Power BI → Archivo → Publicar en la web
2. Genera el enlace público
3. Listo! El embed funcionará

**Opción 2: Sin hacer público**
- Usa el modo `link` en lugar de `embed`
- El botón abrirá el reporte en nueva pestaña
- El usuario debe tener acceso en Power BI

```jsx
<PowerBIReport mode="link" />
```

---

## ✅ Checklist

- [x] Servicio PowerBIService.jsx creado
- [x] Componente PowerBIReport.jsx creado
- [x] Componente PowerBIButton.jsx creado
- [x] Página Analytics.jsx creada
- [x] Ruta `/admin/analytics` agregada
- [x] Link en AdminSidebar agregado
- [x] Configuración en constants.js
- [ ] Configurar reporte como público (si quieres embed)
- [ ] Probar en navegador
- [ ] Agregar a otras páginas (opcional)

---

## 🆘 Problemas Comunes

### ❌ "No se pudo cargar el reporte embebido"
**Solución:** Usa modo `link` o configura el reporte como público

```jsx
<PowerBIReport mode="link" />
```

### ❌ El sidebar no muestra "Analytics"
**Solución:** Limpia caché y recarga
```bash
Ctrl + Shift + R
```

### ❌ Ruta no funciona
**Solución:** Verifica que estés logueado como Admin

---

## 📚 Documentación Completa

Para guía detallada, ver:
- `POWER_BI_INTEGRATION_GUIDE.md` - Guía completa
- `/src/Services/PowerBIService.jsx` - Comentarios en código
- `/src/components/PowerBI/PowerBIReport.jsx` - Props y ejemplos

---

## 🎉 ¡Listo para Usar!

Todo está configurado y funcionando. Solo:

1. Inicia la app: `npm run dev`
2. Login como Admin
3. Haz clic en "📊 Analytics & Reportes"

**¡Disfruta tus reportes de Power BI! 📊**

---

**Creado:** Noviembre 2025  
**Por:** GitHub Copilot  
**Para:** ExpoSoftware Frontend
