# Funcionalidades de Exportación del Dashboard

## 📊 Exportación de Gráficas

El dashboard del estudiante ahora incluye funcionalidades para exportar las gráficas y datos en diferentes formatos:

### 🔧 Funcionalidades Disponibles

#### 1. **Exportar Gráfica como Imagen (PNG)**
- **Botón**: Icono de imagen (📷)
- **Función**: Captura la gráfica exactamente como se ve en pantalla
- **Formato**: PNG de alta resolución
- **Uso**: Ideal para presentaciones o compartir en redes sociales

#### 2. **Exportar Gráfica como PDF**
- **Botón**: Icono de PDF (📄)
- **Contenido**: Incluye la gráfica + datos tabulares + información del estudiante
- **Formato**: PDF profesional con:
  - Título de la gráfica
  - Nombre del estudiante y fecha
  - Gráfica en alta resolución
  - Tabla con datos detallados y porcentajes
  - Pie de página institucional

#### 3. **Exportar Reporte Completo**
- **Botón**: "Exportar Reporte Completo" (arriba de las estadísticas)
- **Contenido**: Todo el dashboard en un PDF completo que incluye:
  - Estadísticas principales (total, aprobados, reprobados)
  - Ambas gráficas (Materias y Sublíneas)
  - Datos tabulares detallados
  - Información del estudiante
  - Numeración de páginas

### 🎯 Ubicación de los Botones

- **Botones individuales**: En la esquina superior derecha de cada gráfica
- **Reporte completo**: Encima de las tarjetas de estadísticas

### 📋 Datos Incluidos en las Exportaciones

#### Para gráficas individuales:
- Nombre de la categoría
- Cantidad de proyectos
- Porcentaje del total
- Fecha de generación
- Nombre del estudiante

#### Para reporte completo:
- Todas las métricas del dashboard
- Ambas gráficas con sus datos
- Información institucional
- Numeración automática de páginas

### 🛠️ Tecnologías Utilizadas

- **html2canvas**: Para capturar las gráficas como imágenes
- **jsPDF**: Para generar PDFs profesionales
- **Recharts**: Framework de gráficas (mantiene colores y estilos)

### 📝 Notas Importantes

- Las gráficas se exportan con la misma resolución y colores que se ven en pantalla
- Los PDFs incluyen información contextual (estudiante, fecha, institución)
- Los archivos se descargan automáticamente con nombres descriptivos
- Compatible con todos los navegadores modernos

### 🔍 Solución de Problemas

Si las exportaciones no funcionan:
1. Asegúrate de tener una conexión a internet estable
2. Verifica que las gráficas tengan datos para mostrar
3. Intenta refrescar la página si hay problemas de renderizado
4. Los PDFs pueden tardar unos segundos en generarse con muchos datos

---

**Desarrollado para Expo-software - Universidad Popular del Cesar**