# Funcionalidades de Exportación - Dashboard de Invitados

## 📊 Exportación de Gráficas

El dashboard de invitados ahora incluye funcionalidades para exportar las gráficas y datos en diferentes formatos:

### 🔧 Funcionalidades Disponibles

#### 1. **Exportar Gráfica como Imagen (PNG)**
- **Botón**: Icono de imagen (📷)
- **Función**: Captura la gráfica exactamente como se ve en pantalla
- **Formatos disponibles**:
  - Tipos de Proyectos
  - Proyectos por Línea de Investigación
- **Formato**: PNG de alta resolución
- **Uso**: Ideal para presentaciones o compartir en redes sociales

#### 2. **Exportar Gráfica como PDF**
- **Botón**: Icono de PDF (📄)
- **Contenido**: Incluye la gráfica + datos tabulares + información del invitado
- **Formatos disponibles**:
  - Tipos de Proyectos
  - Proyectos por Línea de Investigación
- **Formato**: PDF profesional con:
  - Título de la gráfica
  - Nombre del invitado y empresa
  - Fecha de generación
  - Gráfica en alta resolución
  - Tabla con datos detallados y porcentajes
  - Pie de página institucional

#### 3. **Exportar Reporte Completo**
- **Botón**: "Exportar Reporte Completo" (centrado arriba de las gráficas)
- **Contenido**: Todo el dashboard en un PDF completo que incluye:
  - Información completa del invitado (nombre, empresa, sector, correo)
  - Estadísticas generales (total proyectos, líneas activas, tipos de proyecto)
  - Ambas gráficas con sus datos
  - Datos tabulares detallados
  - Numeración de páginas automática
  - Información institucional

### 🎯 Ubicación de los Botones

- **Botones individuales**: En la esquina superior derecha de cada gráfica
- **Reporte completo**: Centrado encima de las gráficas de estadísticas

### 📋 Datos Incluidos en las Exportaciones

#### Para gráficas individuales:
- Nombre de la categoría
- Cantidad de proyectos
- Porcentaje del total
- Fecha de generación
- Nombre del invitado y empresa

#### Para reporte completo:
- **Información del invitado**:
  - Nombre completo
  - Empresa/Institución
  - Sector
  - Correo electrónico
- **Estadísticas generales**:
  - Total de proyectos registrados
  - Número de líneas de investigación activas
  - Cantidad de tipos de proyecto
- **Datos detallados de gráficas**:
  - Tipos de Proyectos: distribución por actividad (Proyecto, Taller, Ponencia, Conferencia)
  - Proyectos por Línea: distribución por línea de investigación con códigos

### 🛠️ Tecnologías Utilizadas

- **html2canvas**: Para capturar las gráficas como imágenes de alta calidad
- **jsPDF**: Para generar PDFs profesionales con múltiples páginas
- **Recharts**: Framework de gráficas (mantiene colores y estilos originales)

### 📝 Notas Importantes

- Las gráficas se exportan con la misma resolución y colores que se ven en pantalla
- Los PDFs incluyen información contextual del invitado y fecha de generación
- Los archivos se descargan automáticamente con nombres descriptivos que incluyen:
  - Nombre del invitado
  - Tipo de exportación
  - Fecha actual
- Compatible con todos los navegadores modernos
- Las exportaciones funcionan tanto en modo invitado como en otros roles

### 🔍 Solución de Problemas

Si las exportaciones no funcionan:
1. Asegúrate de tener una conexión a internet estable
2. Verifica que las gráficas tengan datos para mostrar
3. Intenta refrescar la página si hay problemas de renderizado
4. Los PDFs pueden tardar unos segundos en generarse con muchos datos
5. Si el navegador bloquea las descargas, permite las ventanas emergentes para el sitio

### 📄 Nombres de Archivos Generados

- **Imágenes PNG**: `{TipoGrafica}_{Fecha}.png`
  - Ejemplo: `Tipos_Proyectos_2025-11-23.png`
- **PDFs individuales**: `{TituloGrafica}_{Fecha}.pdf`
  - Ejemplo: `Tipos_de_Proyectos_2025-11-23.pdf`
- **Reporte completo**: `Dashboard_Invitado_{Nombre}_{Apellido}_{Fecha}.pdf`
  - Ejemplo: `Dashboard_Invitado_Juan_Perez_2025-11-23.pdf`

---

**Desarrollado para Expo-software - Universidad Popular del Cesar**