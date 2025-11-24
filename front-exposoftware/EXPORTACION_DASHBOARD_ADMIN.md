# Funcionalidades de Exportación - Dashboard del Administrador

## 📊 Exportación de Gráficas

El dashboard del administrador ahora incluye funcionalidades para exportar las gráficas y datos en diferentes formatos:

### 🔧 Funcionalidades Disponibles

#### 1. **Exportar Gráfica como Imagen (PNG)**
- **Botón**: Icono de imagen (📷)
- **Función**: Captura la gráfica exactamente como se ve en pantalla
- **Formatos disponibles**:
  - Proyectos por Tipo de Actividad
- **Formato**: PNG de alta resolución
- **Uso**: Ideal para presentaciones o compartir en informes administrativos

#### 2. **Exportar Gráfica como PDF**
- **Botón**: Icono de PDF (📄)
- **Contenido**: Incluye la gráfica + datos tabulares + información del administrador
- **Formatos disponibles**:
  - Proyectos por Tipo de Actividad
- **Formato**: PDF profesional con:
  - Título de la gráfica
  - Nombre del administrador
  - Fecha de generación
  - Gráfica en alta resolución
  - Tabla con datos detallados y porcentajes
  - Pie de página institucional

#### 3. **Exportar Reporte Completo**
- **Botón**: "Exportar Reporte Completo" (centrado arriba de las gráficas)
- **Contenido**: Todo el dashboard en un PDF completo que incluye:
  - Información completa del administrador
  - Estadísticas generales del sistema (proyectos, estudiantes, docentes)
  - Gráfica de proyectos por tipo de actividad
  - Datos tabulares detallados
  - Lista de proyectos recientes con calificaciones
  - Numeración de páginas automática
  - Información institucional

### 🎯 Ubicación de los Botones

- **Botones individuales**: En la esquina superior derecha de la gráfica
- **Reporte completo**: Centrado encima de las gráficas de estadísticas

### 📋 Datos Incluidos en las Exportaciones

#### Para gráficas individuales:
- Nombre de la categoría (tipo de actividad)
- Cantidad de proyectos
- Porcentaje del total
- Fecha de generación
- Nombre del administrador

#### Para reporte completo:
- **Información del administrador**:
  - Nombre completo
  - Rol (Administrador)
  - Fecha del reporte
- **Estadísticas del sistema**:
  - Total de proyectos registrados
  - Número de estudiantes inscritos
  - Número de docentes inscritos
  - Total de proyectos por tipo
- **Datos detallados de gráfica**:
  - Proyectos por Tipo: distribución por actividad (Exposoftware, Ponencia, Taller, Conferencia)
- **Lista de proyectos recientes**:
  - Título del proyecto
  - Tipo de actividad
  - Calificación (si está disponible)

### 🛠️ Tecnologías Utilizadas

- **html2canvas**: Para capturar las gráficas como imágenes de alta calidad
- **jsPDF**: Para generar PDFs profesionales con múltiples páginas
- **PrimeReact Chart**: Framework de gráficas (mantiene colores y estilos originales)

### 📝 Notas Importantes

- Las gráficas se exportan con la misma resolución y colores que se ven en pantalla
- Los PDFs incluyen información contextual del administrador y fecha de generación
- Los archivos se descargan automáticamente con nombres descriptivos que incluyen:
  - Nombre del administrador
  - Tipo de exportación
  - Fecha actual
- Compatible con todos los navegadores modernos
- Las exportaciones funcionan tanto en modo administrador como en otros roles

### 🔍 Solución de Problemas

Si las exportaciones no funcionan:
1. Asegúrate de tener una conexión a internet estable
2. Verifica que las gráficas tengan datos para mostrar
3. Intenta refrescar la página si hay problemas de renderizado
4. Los PDFs pueden tardar unos segundos en generarse con muchos datos
5. Si el navegador bloquea las descargas, permite las ventanas emergentes para el sitio

### 📄 Nombres de Archivos Generados

- **Imágenes PNG**: `{TipoGrafica}_{Fecha}.png`
  - Ejemplo: `Proyectos_por_Tipo_2025-11-23.png`
- **PDFs individuales**: `{TituloGrafica}_{Fecha}.pdf`
  - Ejemplo: `Proyectos_por_Tipo_de_Actividad_2025-11-23.pdf`
- **Reporte completo**: `Dashboard_Administrador_{Nombre}_{Fecha}.pdf`
  - Ejemplo: `Dashboard_Administrador_Juan_Perez_2025-11-23.pdf`

---

**Desarrollado para Expo-software - Universidad Popular del Cesar**