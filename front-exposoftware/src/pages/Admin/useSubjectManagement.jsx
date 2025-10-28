import { useState, useEffect } from "react";
import { API_ENDPOINTS } from "../../utils/constants";

// Mock data de docentes disponibles
const DOCENTES_MOCK = [
  { id: 1, nombre: "Dr. Alejandro José Meriño" },
  { id: 2, nombre: "Dr. Juan Pérez" },
  { id: 3, nombre: "Ing. María González" },
  { id: 4, nombre: "Lic. Carla Ruíz" },
  { id: 5, nombre: "Ing. Sofía Benítez" },
];

// Opciones de ciclo semestral
export const CICLOS_SEMESTRALES = [
  "Ciclo Básico",
  "Ciclo Profesional",
  "Ciclo de Profundización"
];

// Mock data inicial de grupos
const GRUPOS_MOCK = [
  { id: "grp1", codigo_grupo: 101, id_docente: 1 },
  { id: "grp2", codigo_grupo: 102, id_docente: 2 },
  { id: "grp3", codigo_grupo: 201, id_docente: 3 },
  { id: "grp4", codigo_grupo: 202, id_docente: 1 },
];

// Mock data inicial de materias
const MATERIAS_INICIAL = [
  {
    id: "mat1",
    codigo_materia: "PROG3",
    nombre_materia: "Programación III",
    ciclo_semestral: "Ciclo Profesional",
    grupos_con_docentes: [
      { codigo_grupo: 101, id_docente: 1 },
      { codigo_grupo: 102, id_docente: 2 }
    ],
    fechaCreacion: "2025-01-15"
  },
  {
    id: "mat2",
    codigo_materia: "BD2",
    nombre_materia: "Bases de Datos II",
    ciclo_semestral: "Ciclo Profesional",
    grupos_con_docentes: [
      { codigo_grupo: 201, id_docente: 3 }
    ],
    fechaCreacion: "2025-01-20"
  },
];


export const useSubjectManagement = () => {

  const [codigoMateria, setCodigoMateria] = useState("");
  const [nombreMateria, setNombreMateria] = useState("");
  const [cicloSemestral, setCicloSemestral] = useState("");
  
  // Estados para grupos disponibles y seleccionados
  const [gruposDisponibles, setGruposDisponibles] = useState(GRUPOS_MOCK);
  const [gruposSeleccionados, setGruposSeleccionados] = useState([]);
  const [profesores, setProfesores] = useState(DOCENTES_MOCK);
  
  // Estado para la lista de materias
  const [materias, setMaterias] = useState(MATERIAS_INICIAL);
  
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
   * Cargar materias desde el backend
   */
  const cargarMaterias = async () => {
    try {
      const response = await fetch(API_ENDPOINTS.MATERIAS);
      if (response.ok) {
        const data = await response.json();
        setMaterias(data);
        console.log('📥 Materias cargadas:', data.length);
      } else {
        console.error('❌ Error al cargar materias:', response.statusText);
      }
    } catch (error) {
      console.error('❌ Error de conexión al cargar materias:', error);
      console.log('⚠️ Usando datos mock locales');
    }
  };

  /**
   * Cargar grupos desde el backend
   */
  const cargarGrupos = async () => {
    try {
      const response = await fetch(API_ENDPOINTS.GRUPOS);
      if (response.ok) {
        const data = await response.json();
        setGruposDisponibles(data);
        console.log('📥 Grupos cargados:', data.length);
      } else {
        console.error('❌ Error al cargar grupos:', response.statusText);
      }
    } catch (error) {
      console.error('❌ Error de conexión al cargar grupos:', error);
      console.log('⚠️ Usando grupos mock locales');
    }
  };

  /**
   * Cargar profesores desde el backend
   */
  const cargarProfesores = async () => {
    try {
      const response = await fetch(API_ENDPOINTS.DOCENTES);
      if (response.ok) {
        const data = await response.json();
        setProfesores(data);
        console.log('📥 Profesores cargados:', data.length);
      } else {
        console.error('❌ Error al cargar profesores:', response.statusText);
      }
    } catch (error) {
      console.error('❌ Error de conexión al cargar profesores:', error);
      console.log('⚠️ Usando profesores mock locales');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!codigoMateria || !nombreMateria || !cicloSemestral) {
      alert("Por favor complete todos los campos obligatorios");
      return;
    }

    // Payload SOLO con información de la materia (sin grupos)
    const payload = {
      codigo_materia: codigoMateria.toUpperCase(),
      nombre_materia: nombreMateria,
      ciclo_semestral: cicloSemestral
    };

    console.log('📤 Enviando al backend:', JSON.stringify(payload, null, 2));

    try {
      const response = await fetch(API_ENDPOINTS.MATERIAS, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      // Manejo específico de códigos de estado HTTP
      if (response.status === 201) {
        // 201: Recurso creado exitosamente
        const data = await response.json();
        console.log('✅ Respuesta del backend:', data);
        
        await cargarMaterias();
        alert("✅ Materia creada exitosamente. Ahora puede asignarle grupos desde la lista de materias.");
        limpiarFormulario();
      } else if (response.status === 400) {
        // 400: Solicitud incorrecta
        const errorData = await response.json().catch(() => ({}));
        console.error('❌ Solicitud incorrecta:', errorData);
        alert(`❌ Solicitud incorrecta: ${errorData.message || errorData.detail || 'Verifique los datos ingresados'}`);
      } else if (response.status === 401) {
        // 401: No autorizado
        const errorData = await response.json().catch(() => ({}));
        console.error('❌ No autorizado:', errorData);
        alert(`❌ No autorizado: ${errorData.message || errorData.detail || 'Debe iniciar sesión para realizar esta acción'}`);
      } else if (response.status === 403) {
        // 403: Sin permisos suficientes
        const errorData = await response.json().catch(() => ({}));
        console.error('❌ Sin permisos:', errorData);
        alert(`❌ Sin permisos: ${errorData.message || errorData.detail || 'No tiene permisos para crear materias'}`);
      } else if (response.status === 409) {
        // 409: Conflicto - El recurso ya existe
        const errorData = await response.json().catch(() => ({}));
        console.error('❌ Conflicto:', errorData);
        alert(`❌ Conflicto: ${errorData.message || errorData.detail || 'La materia con ese código ya existe'}`);
      } else if (response.status === 422) {
        // 422: Error de validación
        const errorData = await response.json().catch(() => ({}));
        console.error('❌ Error de validación:', errorData);
        alert(`❌ Error de validación: ${errorData.message || errorData.detail || 'Los datos enviados no son válidos'}`);
      } else {
        // Otros errores
        const errorData = await response.json().catch(() => ({}));
        console.error('❌ Error del servidor:', errorData);
        alert(`❌ Error al crear la materia (${response.status}): ${errorData.message || errorData.detail || 'Error desconocido'}`);
      }
    } catch (error) {
      console.error('❌ Error al crear materia:', error);
      alert("❌ Error de conexión al crear la materia. Verifique su conexión a internet.");
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
    
    if (!codigoMateria || !nombreMateria || !cicloSemestral) {
      alert("Por favor complete todos los campos obligatorios");
      return;
    }

    // Ahora los grupos son opcionales en la edición
    const payload = {
      codigo_materia: codigoMateria.toUpperCase(),
      nombre_materia: nombreMateria,
      ciclo_semestral: cicloSemestral,
      grupos_con_docentes: gruposSeleccionados // Puede ser un array vacío
    };

    console.log('📤 Actualizando en backend (ID: ' + editingId + '):', JSON.stringify(payload, null, 2));

    try {
      const response = await fetch(API_ENDPOINTS.MATERIA_BY_ID(editingId), {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      // Manejo específico de códigos de estado HTTP
      if (response.ok) {
        // 200 o 201: Actualización exitosa
        const data = await response.json();
        console.log('✅ Respuesta del backend:', data);
        
        await cargarMaterias();
        alert("✅ Materia actualizada exitosamente");
        handleCancelEdit();
      } else if (response.status === 400) {
        // 400: Solicitud incorrecta
        const errorData = await response.json().catch(() => ({}));
        console.error('❌ Solicitud incorrecta:', errorData);
        alert(`❌ Solicitud incorrecta: ${errorData.message || errorData.detail || 'Verifique los datos ingresados'}`);
      } else if (response.status === 401) {
        // 401: No autorizado
        const errorData = await response.json().catch(() => ({}));
        console.error('❌ No autorizado:', errorData);
        alert(`❌ No autorizado: ${errorData.message || errorData.detail || 'Debe iniciar sesión para realizar esta acción'}`);
      } else if (response.status === 403) {
        // 403: Sin permisos suficientes
        const errorData = await response.json().catch(() => ({}));
        console.error('❌ Sin permisos:', errorData);
        alert(`❌ Sin permisos: ${errorData.message || errorData.detail || 'No tiene permisos para editar materias'}`);
      } else if (response.status === 404) {
        // 404: No encontrado
        const errorData = await response.json().catch(() => ({}));
        console.error('❌ No encontrado:', errorData);
        alert(`❌ No encontrado: ${errorData.message || errorData.detail || 'La materia no existe'}`);
      } else if (response.status === 409) {
        // 409: Conflicto
        const errorData = await response.json().catch(() => ({}));
        console.error('❌ Conflicto:', errorData);
        alert(`❌ Conflicto: ${errorData.message || errorData.detail || 'Ya existe una materia con ese código'}`);
      } else if (response.status === 422) {
        // 422: Error de validación
        const errorData = await response.json().catch(() => ({}));
        console.error('❌ Error de validación:', errorData);
        alert(`❌ Error de validación: ${errorData.message || errorData.detail || 'Los datos enviados no son válidos'}`);
      } else {
        // Otros errores
        const errorData = await response.json().catch(() => ({}));
        console.error('❌ Error del servidor:', errorData);
        alert(`❌ Error al actualizar la materia (${response.status}): ${errorData.message || errorData.detail || 'Error desconocido'}`);
      }
    } catch (error) {
      console.error('❌ Error al actualizar materia:', error);
      alert("❌ Error de conexión al actualizar la materia. Verifique su conexión a internet.");
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
   * Eliminar materia
   */
  const handleDelete = async (id) => {
    const materiaAEliminar = materias.find(m => m.id === id);
    
    if (window.confirm(`¿Está seguro de que desea eliminar la materia "${materiaAEliminar?.nombre_materia}"? Esta acción también eliminará todos los grupos asociados.`)) {
      console.log('🗑️ Eliminando del backend - ID:', id);
      console.log('📋 Materia a eliminar:', materiaAEliminar?.codigo_materia);
      
      try {
        const response = await fetch(API_ENDPOINTS.MATERIA_BY_ID(id), { 
          method: 'DELETE' 
        });
        
        if (response.ok) {
          console.log('✅ Materia eliminada del backend');
          await cargarMaterias();
          alert("✅ Materia eliminada exitosamente");
        } else {
          const errorData = await response.json();
          console.error('❌ Error del servidor:', errorData);
          alert(`❌ Error al eliminar la materia: ${errorData.message || 'Error desconocido'}`);
        }
      } catch (error) {
        console.error('❌ Error al eliminar materia:', error);
        alert("❌ Error de conexión al eliminar la materia");
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

  const materiasFiltradas = materias.filter(materia =>
    materia.codigo_materia.toLowerCase().includes(searchTerm.toLowerCase()) ||
    materia.nombre_materia.toLowerCase().includes(searchTerm.toLowerCase()) ||
    materia.ciclo_semestral.toLowerCase().includes(searchTerm.toLowerCase())
  );


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
