import { useState, useCallback, useEffect } from 'react';
import { crearDocente, obtenerDocentes, actualizarDocente, eliminarDocente } from '../api/docentesApi';

export const useDocentesManagement = () => {
  // Estado para la lista de docentes y paginación
  const [docentes, setDocentes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Estado para la paginación
  const [paginacion, setPaginacion] = useState({
    page: 1,
    limit: 20,
    totalItems: 0,
    totalPages: 0,
    hasNext: false,
    hasPrev: false
  });
  
  // Estado para filtros
  const [filtros, setFiltros] = useState({
    activos: true,
    page: 1,
    limit: 20
  });
  
  // Estado para el profesor seleccionado
  const [docenteSeleccionado, setDocenteSeleccionado] = useState(null);

  const loadDocentes = useCallback(async () => {
    setLoading(true);
    try {
      const respuesta = await obtenerDocentes(filtros);
      setDocentes(respuesta.data);
      setPaginacion({
        page: respuesta.pagination.page,
        limit: respuesta.pagination.limit,
        totalItems: respuesta.pagination.total_items,
        totalPages: respuesta.pagination.total_pages,
        hasNext: respuesta.pagination.has_next,
        hasPrev: respuesta.pagination.has_prev
      });
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [filtros]);

  const handleCrearDocente = async (docenteData) => {
    setLoading(true);
    try {
      const nuevoDocente = await crearDocente({
        categoria_docente: docenteData.categoria_docente,
        codigo_programa: docenteData.codigo_programa,
        usuario: {
          apellidos: docenteData.usuario.apellidos,
          ciudad_residencia: docenteData.usuario.ciudad_residencia,
          contraseña: docenteData.usuario.contraseña,
          correo: docenteData.usuario.correo,
          departamento: docenteData.usuario.departamento,
          direccion_residencia: docenteData.usuario.direccion_residencia,
          fecha_nacimiento: docenteData.usuario.fecha_nacimiento,
          genero: docenteData.usuario.genero,
          identidad_sexual: docenteData.usuario.identidad_sexual,
          identificacion: docenteData.usuario.identificacion,
          municipio: docenteData.usuario.municipio,
          nacionalidad: docenteData.usuario.nacionalidad,
          nombres: docenteData.usuario.nombres,
          pais_residencia: docenteData.usuario.pais_residencia,
          rol: "Docente",
          telefono: docenteData.usuario.telefono,
          tipo_documento: docenteData.usuario.tipo_documento
        }
      });
      
      setDocentes(prev => [...prev, nuevoDocente]);
      setError(null);
      return nuevoDocente;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const handleActualizarDocente = async (id, docenteData) => {
    setLoading(true);
    try {
      // Validar los datos antes de enviar
      if (!docenteData.categoria_docente || !docenteData.codigo_programa) {
        throw new Error('La categoría del docente y el código del programa son requeridos');
      }

      // Preparar los datos para la actualización
      const datosActualizacion = {
        categoria_docente: docenteData.categoria_docente,
        codigo_programa: docenteData.codigo_programa,
        activo: docenteData.activo ?? true
      };

      // Enviar la actualización
      const docenteActualizado = await actualizarDocente(id, datosActualizacion);

      // Actualizar la lista local
      setDocentes(prev => prev.map(docente => 
        docente.id === id ? {
          ...docente,
          ...docenteActualizado
        } : docente
      ));

      setError(null);
      return docenteActualizado;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const handleDesactivarDocente = async (id, razon) => {
    if (!id) {
      setError('Se requiere el ID del profesor para desactivar');
      throw new Error('Se requiere el ID del profesor para desactivar');
    }

    if (!razon || razon.trim() === '') {
      setError('La razón de desactivación es requerida');
      throw new Error('La razón de desactivación es requerida');
    }

    setLoading(true);
    try {
      // Guardar el estado actual del docente por si necesitamos revertir
      const docenteAntes = docentes.find(d => d.id === id);
      
      // Optimistic update
      setDocentes(prev => prev.map(docente => 
        docente.id === id ? { ...docente, activo: false } : docente
      ));

      try {
        await desactivarDocente(id, razon);
        setError(null);
      } catch (error) {
        // Revertir cambios si falla
        setDocentes(prev => prev.map(docente =>
          docente.id === id ? docenteAntes : docente
        ));
        throw error;
      }
    } catch (err) {
      setError(err.message);
      
      // Manejar mensajes específicos
      if (err.message.includes('no existe')) {
        setError('El profesor que intenta desactivar ya no existe en el sistema');
      } else if (err.message.includes('no autorizado')) {
        setError('No tiene permisos para desactivar profesores');
      } else if (err.message.includes('validación')) {
        setError('La razón proporcionada no es válida');
      }
      
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const handleEliminarDocente = async (id) => {
    if (!id) {
      setError('Se requiere el ID del profesor para eliminar');
      throw new Error('Se requiere el ID del profesor para eliminar');
    }

    setLoading(true);
    try {
      // Guardar el docente antes de eliminarlo por si necesitamos revertir
      const docenteAEliminar = docentes.find(d => d.id === id);
      
      // Optimistic update - Eliminar inmediatamente de la UI
      setDocentes(prev => prev.filter(docente => docente.id !== id));
      
      try {
        await eliminarDocente(id);
        setError(null);
        // Éxito - no necesitamos hacer nada más porque ya actualizamos la UI
      } catch (error) {
        // Si falla, revertimos el cambio
        setDocentes(prev => [...prev, docenteAEliminar]);
        throw error;
      }
    } catch (err) {
      setError(err.message);
      
      // Manejar mensajes específicos según el tipo de error
      if (err.message.includes('no existe')) {
        setError('El profesor que intenta eliminar ya no existe en el sistema');
      } else if (err.message.includes('registros asociados')) {
        setError('No se puede eliminar el profesor porque tiene proyectos o registros asociados');
      } else if (err.message.includes('no autorizado')) {
        setError('No tiene permisos para eliminar profesores');
      }
      
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Función para cambiar de página
  const cambiarPagina = (nuevaPagina) => {
    setFiltros(prev => ({
      ...prev,
      page: nuevaPagina
    }));
  };

  // Función para cambiar el límite de items por página
  const cambiarLimite = (nuevoLimite) => {
    setFiltros(prev => ({
      ...prev,
      limit: nuevoLimite,
      page: 1 // Resetear a la primera página cuando cambia el límite
    }));
  };

  // Función para cambiar el filtro de activos
  const cambiarFiltroActivos = (soloActivos) => {
    setFiltros(prev => ({
      ...prev,
      activos: soloActivos,
      page: 1 // Resetear a la primera página cuando cambia el filtro
    }));
  };

  // Función para cargar un docente específico por ID
  const cargarDocentePorId = async (id) => {
    setLoading(true);
    try {
      const docente = await obtenerDocentePorId(id);
      setDocenteSeleccionado(docente);
      setError(null);
      return docente;
    } catch (err) {
      setError(err.message);
      setDocenteSeleccionado(null);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Cargar docentes cuando cambian los filtros
  useEffect(() => {
    loadDocentes();
  }, [loadDocentes]);

  return {
    // Datos y estado
    docentes,
    loading,
    error,
    paginacion,
    filtros,
    
    // Funciones de CRUD
    loadDocentes,
    crearDocente: handleCrearDocente,
    actualizarDocente: handleActualizarDocente,
    eliminarDocente: handleEliminarDocente,
    
  reactivarDocente: handleReactivarDocente,
    
  // Funciones de paginación y filtros
    cambiarPagina,
    cambiarLimite,
    cambiarFiltroActivos,

    // Estado y funciones para docente específico
    docenteSeleccionado,
    cargarDocentePorId
  };
};