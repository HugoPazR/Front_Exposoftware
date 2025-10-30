import { useState, useEffect } from "react";
import * as SubjectService from "../../Services/CreateSubject";

// Opciones de ciclo semestral
export const CICLOS_SEMESTRALES = [
  "Ciclo Básico",
  "Ciclo Profesional",
  "Ciclo de Profundización"
];


export const useSubjectManagement = () => {

  const [codigoMateria, setCodigoMateria] = useState("");
  const [nombreMateria, setNombreMateria] = useState("");
  const [cicloSemestral, setCicloSemestral] = useState("");
  
  // Estados para grupos disponibles y seleccionados
  const [gruposDisponibles, setGruposDisponibles] = useState([]);
  const [gruposSeleccionados, setGruposSeleccionados] = useState([]);
  const [profesores, setProfesores] = useState([]);
  
  // Estado para la lista de materias
  const [materias, setMaterias] = useState([]);
  
  // Estados para edición
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  
  // Estado para búsqueda/filtro
  const [searchTerm, setSearchTerm] = useState("");

 

  /**
   * Obtener nombre del docente por ID
   */
  const getDocenteNombre = (docenteId) => {
    const docente = profesores.find(d => d.id === parseInt(docenteId));
    return docente ? docente.nombre : "Sin asignar";
  };

  /**
   * Obtener grupo completo por código
   */
  const getGrupoCompleto = (codigoGrupo) => {
    return gruposDisponibles.find(g => g.codigo_grupo === codigoGrupo);
  };

  /**
   * Agregar grupo seleccionado
   */
  const agregarGrupoSeleccionado = (codigoGrupo) => {
    const grupo = gruposDisponibles.find(g => g.codigo_grupo === parseInt(codigoGrupo));
    if (grupo && !gruposSeleccionados.find(g => g.codigo_grupo === grupo.codigo_grupo)) {
      setGruposSeleccionados([...gruposSeleccionados, { 
        codigo_grupo: grupo.codigo_grupo, 
        id_docente: grupo.id_docente 
      }]);
    }
  };

  /**
   * Eliminar grupo seleccionado
   */
  const eliminarGrupoSeleccionado = (codigoGrupo) => {
    setGruposSeleccionados(gruposSeleccionados.filter(g => g.codigo_grupo !== codigoGrupo));
  };

  const limpiarFormulario = () => {
    setCodigoMateria("");
    setNombreMateria("");
    setCicloSemestral("");
    setGruposSeleccionados([]);
  };



  /**
   * Cargar materias desde el backend usando el servicio
   */
  const cargarMaterias = async () => {
    try {
      console.log('🔄 Iniciando carga de materias...');
      const data = await SubjectService.obtenerMaterias();
      console.log('✅ Materias cargadas exitosamente:', data);
      setMaterias(data);
    } catch (error) {
      console.error('❌ Error al cargar materias:', error);
      // No mostrar alert para no bloquear la UI
      setMaterias([]);
    }
  };

  /**
   * Cargar grupos desde el backend usando el servicio
   */
  const cargarGrupos = async () => {
    try {
      const data = await SubjectService.obtenerGrupos();
      setGruposDisponibles(data);
    } catch (error) {
      console.log('⚠️ Error al cargar grupos del backend');
      setGruposDisponibles([]);
    }
  };

  /**
   * Cargar profesores desde el backend usando el servicio
   */
  const cargarProfesores = async () => {
    try {
      const data = await SubjectService.obtenerDocentes();
      setProfesores(data);
    } catch (error) {
      console.log('⚠️ Error al cargar profesores del backend');
      setProfesores([]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    console.log('📝 Iniciando creación de materia...');
    console.log('📋 Datos del formulario:', {
      codigo_materia: codigoMateria,
      nombre_materia: nombreMateria,
      ciclo_semestral: cicloSemestral
    });
    
    // Validar campos usando el servicio
    const validacion = SubjectService.validarDatosMateria({
      codigo_materia: codigoMateria,
      nombre_materia: nombreMateria,
      ciclo_semestral: cicloSemestral
    });

    if (!validacion.valido) {
      console.error('❌ Validación fallida:', validacion.errores);
      alert('⚠️ Por favor complete todos los campos requeridos:\n\n' + validacion.errores.join('\n'));
      return;
    }

    try {
      const resultado = await SubjectService.crearMateria({
        codigo_materia: codigoMateria,
        nombre_materia: nombreMateria,
        ciclo_semestral: cicloSemestral
      });

      if (resultado.success) {
        console.log('✅ Materia creada, recargando lista...');
        await cargarMaterias();
        alert("✅ " + resultado.message + "\n\nLa materia ha sido creada exitosamente. Ahora puede asignarle grupos desde la pestaña 'Editar Materias'.");
        limpiarFormulario();
      }
    } catch (error) {
      console.error('❌ Error en handleSubmit:', error);
      alert("❌ Error al crear la materia:\n\n" + error.message);
    }
  };

  /**
   * Iniciar edición de materia (para asignar grupos)
   */
  const handleEdit = (materia) => {
    setEditingId(materia.id);
    setCodigoMateria(materia.codigo_materia);
    setNombreMateria(materia.nombre_materia);
    setCicloSemestral(materia.ciclo_semestral);
    setGruposSeleccionados(materia.grupos_con_docentes && materia.grupos_con_docentes.length > 0 
      ? [...materia.grupos_con_docentes] 
      : []
    );
    setIsEditing(true);
    setShowEditModal(true);
  };

  /**
   * Guardar edición de materia (actualizar información básica y grupos)
   */
  const handleSaveEdit = async (e) => {
    e.preventDefault();
    
    // Validar campos usando el servicio
    const validacion = SubjectService.validarDatosMateria({
      codigo_materia: codigoMateria,
      nombre_materia: nombreMateria,
      ciclo_semestral: cicloSemestral
    });

    if (!validacion.valido) {
      alert(validacion.errores.join('\n'));
      return;
    }

    try {
      const resultado = await SubjectService.actualizarMateria(editingId, {
        codigo_materia: codigoMateria,
        nombre_materia: nombreMateria,
        ciclo_semestral: cicloSemestral,
        grupos_con_docentes: gruposSeleccionados
      });

      if (resultado.success) {
        await cargarMaterias();
        alert("✅ " + resultado.message);
        handleCancelEdit();
      }
    } catch (error) {
      alert("❌ Error al actualizar la materia: " + error.message);
    }
  };

  /**
   * Cancelar edición
   */
  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditingId(null);
    setShowEditModal(false);
    limpiarFormulario();
  };

  /**
   * Eliminar materia usando el servicio
   */
  const handleDelete = async (id) => {
    const materiaAEliminar = materias.find(m => m.id === id);
    
    if (window.confirm(`¿Está seguro de que desea eliminar la materia "${materiaAEliminar?.nombre_materia}"? Esta acción también eliminará todos los grupos asociados.`)) {
      try {
        const resultado = await SubjectService.eliminarMateria(id);
        
        if (resultado.success) {
          await cargarMaterias();
          alert("✅ " + resultado.message);
        }
      } catch (error) {
        alert("❌ Error al eliminar la materia: " + error.message);
      }
    }
  };

  const handleCancel = () => {
    limpiarFormulario();
  };

  useEffect(() => {
    cargarMaterias();
    cargarGrupos();
    cargarProfesores();
  }, []);

  // Filtrar materias usando el servicio
  const materiasFiltradas = SubjectService.filtrarMaterias(materias, searchTerm);


  return {
    // Estados del formulario
    codigoMateria,
    setCodigoMateria,
    nombreMateria,
    setNombreMateria,
    cicloSemestral,
    setCicloSemestral,
    
    // Estados de grupos
    gruposDisponibles,
    gruposSeleccionados,
    profesores,
    
    // Estados de materias
    materias,
    materiasFiltradas,
    
    // Estados de edición
    isEditing,
    editingId,
    showEditModal,
    
    // Estado de búsqueda
    searchTerm,
    setSearchTerm,
    
    // Funciones auxiliares
    getDocenteNombre,
    getGrupoCompleto,
    agregarGrupoSeleccionado,
    eliminarGrupoSeleccionado,
    
    // Funciones CRUD
    handleSubmit,
    handleEdit,
    handleSaveEdit,
    handleCancelEdit,
    handleDelete,
    handleCancel,
    
    // Funciones de carga
    cargarMaterias,
    cargarGrupos,
    cargarProfesores,
  };
};
