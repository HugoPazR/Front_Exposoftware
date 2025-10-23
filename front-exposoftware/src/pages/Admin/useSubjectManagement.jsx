import { useState, useEffect } from "react";
import { API_ENDPOINTS } from "../../utils/constants";
import { materiasService } from '../../services/materiasService';
import { gruposService } from '../../services/gruposService';
import { docentesService } from '../../services/docentesService';

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

/**
 * Custom Hook para gestionar la lógica de materias
 * Contiene todos los estados y funciones necesarias para el CRUD de materias
 */
export const useSubjectManagement = () => {
  // ==================== ESTADOS ====================
  
  // Estados para el formulario principal
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

  // ==================== FUNCIONES AUXILIARES ====================

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

  /**
   * Limpiar formulario
   */
  const limpiarFormulario = () => {
    setCodigoMateria("");
    setNombreMateria("");
    setCicloSemestral("");
    setGruposSeleccionados([]);
  };

  // ==================== FUNCIONES DE CARGA ====================

  /**
   * Cargar materias desde el backend
   */
  const cargarMaterias = async () => {
    try {
      const data = materiasService.list();
      setMaterias(data.length ? data : MATERIAS_INICIAL);
      console.log('📥 Materias cargadas (local):', data.length);
    } catch (error) {
      console.error('❌ Error cargando materias locales:', error);
    }
  };

  /**
   * Cargar grupos desde el backend
   */
  const cargarGrupos = async () => {
    try {
      const data = gruposService.list();
      setGruposDisponibles(data.length ? data : GRUPOS_MOCK);
      console.log('📥 Grupos cargados (local):', data.length);
    } catch (error) {
      console.error('❌ Error cargando grupos locales:', error);
    }
  };

  /**
   * Cargar profesores desde el backend
   */
  const cargarProfesores = async () => {
    try {
      const data = docentesService.list();
      setProfesores(data.length ? data : DOCENTES_MOCK);
      console.log('📥 Profesores cargados (local):', data.length);
    } catch (error) {
      console.error('❌ Error cargando profesores locales:', error);
    }
  };

  // ==================== OPERACIONES CRUD ====================

  /**
   * Crear nueva materia
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!codigoMateria || !nombreMateria || !cicloSemestral) {
      alert("Por favor complete todos los campos obligatorios");
      return;
    }

    if (gruposSeleccionados.length === 0) {
      alert("Por favor seleccione al menos un grupo para asignar a la materia");
      return;
    }

    const payload = {
      materia: {
        codigo_materia: codigoMateria.toUpperCase(),
        nombre_materia: nombreMateria,
        ciclo_semestral: cicloSemestral
      },
      grupos_con_docentes: gruposSeleccionados
    };

    console.log('📤 Enviando al backend:', JSON.stringify(payload, null, 2));

    try {
      const created = materiasService.create({ materia: payload.materia, grupos_con_docentes: payload.grupos_con_docentes });
      console.log('✅ Materia creada (local):', created);
      await cargarMaterias();
      alert("✅ Materia creada exitosamente");
      limpiarFormulario();
    } catch (error) {
      console.error('❌ Error al crear materia local:', error);
      alert("❌ Error al crear la materia");
    }
  };

  /**
   * Iniciar edición de materia
   */
  const handleEdit = (materia) => {
    setEditingId(materia.id);
    setCodigoMateria(materia.codigo_materia);
    setNombreMateria(materia.nombre_materia);
    setCicloSemestral(materia.ciclo_semestral);
    setGruposSeleccionados(materia.grupos_con_docentes.length > 0 
      ? [...materia.grupos_con_docentes] 
      : []
    );
    setIsEditing(true);
    setShowEditModal(true);
  };

  /**
   * Guardar edición de materia
   */
  const handleSaveEdit = async (e) => {
    e.preventDefault();
    
    if (!codigoMateria || !nombreMateria || !cicloSemestral) {
      alert("Por favor complete todos los campos obligatorios");
      return;
    }

    if (gruposSeleccionados.length === 0) {
      alert("Por favor seleccione al menos un grupo para asignar a la materia");
      return;
    }

    const payload = {
      materia: {
        codigo_materia: codigoMateria.toUpperCase(),
        nombre_materia: nombreMateria,
        ciclo_semestral: cicloSemestral
      },
      grupos_con_docentes: gruposSeleccionados
    };

    console.log('📤 Actualizando en backend (ID: ' + editingId + '):', JSON.stringify(payload, null, 2));

    try {
      const updated = materiasService.update(editingId, payload);
      if (updated) {
        console.log('✅ Materia actualizada (local):', updated);
        await cargarMaterias();
        alert("✅ Materia actualizada exitosamente");
        handleCancelEdit();
      } else {
        alert('❌ Materia no encontrada');
      }
    } catch (error) {
      console.error('❌ Error al actualizar materia local:', error);
      alert("❌ Error al actualizar la materia");
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
        materiasService.remove(id);
        console.log('✅ Materia eliminada (local):', id);
        await cargarMaterias();
        alert("✅ Materia eliminada exitosamente");
      } catch (error) {
        console.error('❌ Error al eliminar materia local:', error);
        alert("❌ Error al eliminar la materia");
      }
    }
  };

  /**
   * Manejar cancelación del formulario
   */
  const handleCancel = () => {
    limpiarFormulario();
  };

  // ==================== EFECTOS ====================

  /**
   * Cargar datos iniciales al montar el componente
   */
  useEffect(() => {
    cargarMaterias();
    cargarGrupos();
    cargarProfesores();
  }, []);

  // ==================== DATOS COMPUTADOS ====================

  /**
   * Filtrar materias por búsqueda
   */
  const materiasFiltradas = materias.filter(materia =>
    materia.codigo_materia.toLowerCase().includes(searchTerm.toLowerCase()) ||
    materia.nombre_materia.toLowerCase().includes(searchTerm.toLowerCase()) ||
    materia.ciclo_semestral.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // ==================== RETORNO DEL HOOK ====================

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
