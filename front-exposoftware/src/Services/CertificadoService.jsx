/**
 * CertificadoService.jsx
 * Servicio para manejar la generación y descarga de certificados de participación
 */

const API_URL = 'https://z6gasdnp5zp6v6egg4kg3jsitu0ffcqu.lambda-url.us-east-1.on.aws';

/**
 * Obtener headers con autenticación
 */
const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` })
  };
};

/**
 * Generar certificado individual para un estudiante en un proyecto específico
 * @param {string} idEstudiante - ID del estudiante
 * @param {string} idProyecto - ID del proyecto
 * @param {Object} opciones - Opciones adicionales
 * @param {boolean} opciones.incluir_calificacion - Incluir calificación en el certificado
 * @param {string} opciones.director_evento - Nombre del director del evento
 * @param {string} opciones.coordinador_general - Nombre del coordinador general
 * @returns {Promise<Blob>} - PDF del certificado
 */
export const generarCertificadoIndividual = async (idEstudiante, idProyecto, opciones = {}) => {
  try {
    console.log('📜 Generando certificado individual...');
    console.log('👤 ID Estudiante:', idEstudiante, '(tipo:', typeof idEstudiante, ')');
    console.log('📁 ID Proyecto:', idProyecto, '(tipo:', typeof idProyecto, ')');
    console.log('⚙️ Opciones:', opciones);

    // Asegurar que los IDs sean strings
    const payload = {
      id_estudiante: String(idEstudiante),
      id_proyecto: String(idProyecto),
      incluir_calificacion: opciones.incluir_calificacion || false,
      director_evento: opciones.director_evento || "Alvaro Oñate",
      coordinador_general: opciones.coordinador_general || "Juan Yaneth"
    };

    console.log('📦 Payload enviado:', JSON.stringify(payload, null, 2));

    const response = await fetch(
      `${API_URL}/api/v1/admin/reportes/certificados/generar-individual`,
      {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(payload)
      }
    );

    console.log('📡 Respuesta - Status:', response.status);
    console.log('📡 Respuesta - Headers:', {
      'Content-Type': response.headers.get('Content-Type'),
      'Content-Length': response.headers.get('Content-Length')
    });

    if (response.ok) {
      // Verificar que el servidor realmente está enviando un archivo PDF
      const contentType = response.headers.get('Content-Type');
      
      console.log('📡 Verificando Content-Type:', contentType);
      
      // El backend devuelve un JSON con la URL de descarga, no el archivo directamente
      if (contentType && contentType.includes('application/json')) {
        const responseData = await response.json();
        console.log('📋 Respuesta del servidor:', responseData);
        
        // Verificar si hay una URL de descarga en la respuesta
        if (responseData.data && responseData.data.url_descarga) {
          console.log('🔗 URL de descarga encontrada:', responseData.data.url_descarga);
          console.log('📦 Descargando archivo desde la URL...');
          
          // Hacer una segunda petición GET para descargar el archivo
          const downloadResponse = await fetch(responseData.data.url_descarga, {
            method: 'GET',
            headers: {
              'Authorization': getAuthHeaders().Authorization
            }
          });
          
          if (downloadResponse.ok) {
            const blob = await downloadResponse.blob();
            console.log('✅ Archivo descargado desde URL:');
            console.log('   - Tamaño:', blob.size, 'bytes');
            console.log('   - Tipo MIME:', blob.type);
            
            return blob;
          } else {
            throw new Error('Error al descargar el archivo desde la URL: ' + downloadResponse.status);
          }
        } else {
          throw new Error('El servidor no devolvió una URL de descarga válida');
        }
      }
      
      // Si el servidor envía el archivo directamente (caso antiguo)
      const blob = await response.blob();
      console.log('✅ Certificado generado:');
      console.log('   - Tamaño:', blob.size, 'bytes');
      console.log('   - Tipo MIME:', blob.type);
      console.log('   - Content-Type:', contentType);
      
      // Validar que el blob no esté vacío
      if (blob.size === 0) {
        throw new Error('El servidor devolvió un archivo vacío');
      }
      
      // Validar que sea un PDF válido (debe ser mayor a 100 bytes)
      if (blob.size < 100) {
        console.warn('⚠️ El archivo es muy pequeño, puede estar dañado');
        throw new Error('El certificado generado parece estar dañado (tamaño: ' + blob.size + ' bytes)');
      }
      
      return blob;
    } else {
      // Intentar obtener el mensaje de error del backend
      let errorMessage = `Error ${response.status}: `;
      
      try {
        const errorData = await response.json();
        console.log('📋 Error del servidor:', errorData);
        
        // Extraer el mensaje de error según la estructura del backend
        if (errorData.detail) {
          if (typeof errorData.detail === 'string') {
            errorMessage += errorData.detail;
          } else if (Array.isArray(errorData.detail)) {
            errorMessage += errorData.detail.map(e => e.msg || e.message || JSON.stringify(e)).join(', ');
          } else {
            errorMessage += JSON.stringify(errorData.detail);
          }
        } else if (errorData.message) {
          errorMessage += errorData.message;
        } else if (errorData.error) {
          errorMessage += errorData.error;
        } else {
          errorMessage += JSON.stringify(errorData);
        }
      } catch (parseError) {
        console.error('❌ No se pudo parsear error del servidor:', parseError);
        errorMessage += 'Error al generar el certificado';
      }

      // Mensajes específicos por código de estado
      if (response.status === 401) {
        errorMessage = 'Sesión expirada. Por favor inicie sesión nuevamente.';
      } else if (response.status === 404) {
        errorMessage = errorMessage.includes('detail') ? errorMessage : 'Estudiante o proyecto no encontrado';
      } else if (response.status === 422) {
        errorMessage = errorMessage.includes('detail') ? errorMessage : 'Datos inválidos para generar el certificado';
      } else if (response.status === 500) {
        if (!errorMessage.includes('detail')) {
          errorMessage = 'Error interno del servidor al generar el certificado. Contacte al administrador.';
        }
      }

      throw new Error(errorMessage);
    }
  } catch (error) {
    console.error('❌ Error generando certificado individual:', error);
    throw error;
  }
};

/**
 * Generar certificados para todos los estudiantes de un proyecto
 * @param {string} idProyecto - ID del proyecto
 * @param {Object} opciones - Opciones adicionales
 * @param {string} opciones.id_evento - ID del evento (opcional)
 * @param {boolean} opciones.incluir_calificacion - Incluir calificación en certificados
 * @param {string} opciones.director_evento - Nombre del director del evento
 * @param {string} opciones.coordinador_general - Nombre del coordinador general
 * @param {string} opciones.formato_salida - Formato de salida (zip, pdf_individual, pdf_combinado)
 * @returns {Promise<Blob>} - ZIP con todos los certificados
 */
export const generarCertificadosPorProyecto = async (idProyecto, opciones = {}) => {
  try {
    console.log('📜 Generando certificados por proyecto...');
    console.log('📁 ID Proyecto:', idProyecto, '(tipo:', typeof idProyecto, ')');
    console.log('⚙️ Opciones:', opciones);

    // Asegurar que el ID sea string y construir payload
    const payload = {
      id_proyecto: String(idProyecto),
      incluir_calificacion: opciones.incluir_calificacion || false,
      coordinador_general: opciones.coordinador_general || "Juan Yaneth",
      formato_salida: opciones.formato_salida || "zip"
    };

    // Solo agregar campos opcionales si tienen valor
    if (opciones.id_evento) {
      payload.id_evento = String(opciones.id_evento);
    }
    if (opciones.director_evento) {
      payload.director_evento = opciones.director_evento;
    }

    console.log('📦 Payload enviado:', JSON.stringify(payload, null, 2));

    const response = await fetch(
      `${API_URL}/api/v1/admin/reportes/certificados/generar-por-proyecto`,
      {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(payload)
      }
    );

    console.log('📡 Respuesta - Status:', response.status);
    console.log('📡 Respuesta - Headers:', {
      'Content-Type': response.headers.get('Content-Type'),
      'Content-Length': response.headers.get('Content-Length')
    });

    if (response.ok) {
      // Verificar que el servidor realmente está enviando un archivo
      const contentType = response.headers.get('Content-Type');
      
      console.log('📡 Verificando Content-Type:', contentType);
      
      // El backend devuelve un JSON con la URL de descarga, no el archivo directamente
      if (contentType && contentType.includes('application/json')) {
        const responseData = await response.json();
        console.log('📋 Respuesta del servidor:', responseData);
        
        // Verificar si hay una URL de descarga en la respuesta
        if (responseData.data && responseData.data.url_descarga) {
          console.log('� URL de descarga encontrada:', responseData.data.url_descarga);
          console.log('📦 Descargando archivo desde la URL...');
          
          // Hacer una segunda petición GET para descargar el archivo
          const downloadResponse = await fetch(responseData.data.url_descarga, {
            method: 'GET',
            headers: {
              'Authorization': getAuthHeaders().Authorization
            }
          });
          
          if (downloadResponse.ok) {
            const blob = await downloadResponse.blob();
            console.log('✅ Archivo descargado desde URL:');
            console.log('   - Tamaño:', blob.size, 'bytes');
            console.log('   - Tipo MIME:', blob.type);
            
            return blob;
          } else {
            throw new Error('Error al descargar el archivo desde la URL: ' + downloadResponse.status);
          }
        } else {
          throw new Error('El servidor no devolvió una URL de descarga válida');
        }
      }
      
      // Si el servidor envía el archivo directamente (caso antiguo)
      const blob = await response.blob();
      
      console.log('✅ Certificados generados:');
      console.log('   - Tamaño:', blob.size, 'bytes');
      console.log('   - Tipo MIME:', blob.type);
      console.log('   - Content-Type del servidor:', contentType);
      
      // Validar que el blob no esté vacío
      if (blob.size === 0) {
        throw new Error('El servidor devolvió un archivo vacío');
      }
      
      return blob;
    } else {
      // Intentar obtener el mensaje de error del backend
      let errorMessage = `Error ${response.status}: `;
      
      try {
        const errorData = await response.json();
        console.log('📋 Error del servidor:', errorData);
        
        if (errorData.detail) {
          if (typeof errorData.detail === 'string') {
            errorMessage += errorData.detail;
          } else if (Array.isArray(errorData.detail)) {
            errorMessage += errorData.detail.map(e => e.msg || e.message || JSON.stringify(e)).join(', ');
          } else {
            errorMessage += JSON.stringify(errorData.detail);
          }
        } else if (errorData.message) {
          errorMessage += errorData.message;
        } else if (errorData.error) {
          errorMessage += errorData.error;
        } else {
          errorMessage += JSON.stringify(errorData);
        }
      } catch (parseError) {
        console.error('❌ No se pudo parsear error del servidor:', parseError);
        errorMessage += 'Error al generar certificados';
      }

      // Mensajes específicos por código de estado
      if (response.status === 401) {
        errorMessage = 'Sesión expirada. Por favor inicie sesión nuevamente.';
      } else if (response.status === 404) {
        errorMessage = errorMessage.includes('detail') ? errorMessage : 'Proyecto no encontrado';
      } else if (response.status === 500) {
        if (!errorMessage.includes('detail')) {
          errorMessage = 'Error interno del servidor al generar certificados. Contacte al administrador.';
        }
      }

      throw new Error(errorMessage);
    }
  } catch (error) {
    console.error('❌ Error generando certificados por proyecto:', error);
    throw error;
  }
};

/**
 * Descargar el certificado (convierte el blob en archivo descargable)
 * @param {Blob} blob - El blob del PDF
 * @param {string} nombreArchivo - Nombre del archivo a descargar
 */
export const descargarCertificado = (blob, nombreArchivo = 'certificado.pdf') => {
  try {
    console.log('💾 Descargando certificado:', nombreArchivo);
    
    // Crear URL del blob
    const url = window.URL.createObjectURL(blob);
    
    // Crear elemento <a> temporal para descargar
    const link = document.createElement('a');
    link.href = url;
    link.download = nombreArchivo;
    
    // Simular clic
    document.body.appendChild(link);
    link.click();
    
    // Limpiar
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
    
    console.log('✅ Certificado descargado exitosamente');
  } catch (error) {
    console.error('❌ Error descargando certificado:', error);
    throw new Error('Error al descargar el certificado');
  }
};

/**
 * Función completa: generar y descargar certificado individual
 * @param {string} idEstudiante - ID del estudiante
 * @param {string} idProyecto - ID del proyecto
 * @param {string} nombreProyecto - Nombre del proyecto (opcional, para el nombre del archivo)
 * @param {Object} opciones - Opciones adicionales (director_evento, coordinador_general, etc.)
 */
export const generarYDescargarCertificado = async (idEstudiante, idProyecto, nombreProyecto = '', opciones = {}) => {
  try {
    // Generar certificado con las opciones proporcionadas
    const blob = await generarCertificadoIndividual(idEstudiante, idProyecto, opciones);
    
    // Crear nombre de archivo descriptivo
    const timestamp = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
    const nombreArchivo = nombreProyecto 
      ? `Certificado_${nombreProyecto.replace(/\s+/g, '_')}_${timestamp}.pdf`
      : `Certificado_Proyecto_${idProyecto}_${timestamp}.pdf`;
    
    // Descargar
    descargarCertificado(blob, nombreArchivo);
    
    return { success: true, message: 'Certificado descargado exitosamente' };
  } catch (error) {
    console.error('❌ Error en generarYDescargarCertificado:', error);
    throw error;
  }
};

/**
 * Función completa: generar y descargar todos los certificados de un proyecto
 * @param {string} idProyecto - ID del proyecto
 * @param {string} nombreProyecto - Nombre del proyecto (opcional, para el nombre del archivo)
 * @param {Object} opciones - Opciones adicionales (id_evento, director_evento, coordinador_general, etc.)
 */
export const generarYDescargarCertificadosPorProyecto = async (idProyecto, nombreProyecto = '', opciones = {}) => {
  try {
    console.log('📦 Generando todos los certificados del proyecto...');
    
    // Generar certificados con las opciones proporcionadas
    const blob = await generarCertificadosPorProyecto(idProyecto, opciones);
    
    // Detectar el tipo de archivo basándose en el blob
    const esZip = blob.type.includes('zip') || blob.type.includes('compressed');
    const esPdf = blob.type.includes('pdf');
    
    console.log('🔍 Detectando tipo de archivo:', {
      'Blob Type': blob.type,
      'Es ZIP': esZip,
      'Es PDF': esPdf,
      'formato_salida solicitado': opciones.formato_salida || 'zip'
    });
    
    // Determinar extensión del archivo
    let extension = 'zip'; // Por defecto
    if (esPdf) {
      extension = 'pdf';
    } else if (esZip) {
      extension = 'zip';
    } else if (opciones.formato_salida === 'pdf_combinado') {
      extension = 'pdf';
    }
    
    // Crear nombre de archivo descriptivo
    const timestamp = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
    const nombreArchivo = nombreProyecto 
      ? `Certificados_${nombreProyecto.replace(/\s+/g, '_')}_${timestamp}.${extension}`
      : `Certificados_Proyecto_${idProyecto}_${timestamp}.${extension}`;
    
    console.log('💾 Descargando como:', nombreArchivo);
    
    // Descargar
    descargarCertificado(blob, nombreArchivo);
    
    return { success: true, message: 'Certificados descargados exitosamente' };
  } catch (error) {
    console.error('❌ Error en generarYDescargarCertificadosPorProyecto:', error);
    throw error;
  }
};

export default {
  generarCertificadoIndividual,
  generarCertificadosPorProyecto,
  descargarCertificado,
  generarYDescargarCertificado,
  generarYDescargarCertificadosPorProyecto
};
