import { useState, useEffect } from "react";
import { API_ENDPOINTS } from "../../utils/constants";
import { researchLinesService } from '../../services/researchLinesService';

// Mock data inicial de líneas de investigación
const LINEAS_INICIAL = [
  { id: "lin1", nombre_linea: "Inteligencia Artificial", fechaCreacion: "2025-01-15" },
  { id: "lin2", nombre_linea: "Desarrollo de Software", fechaCreacion: "2025-01-20" },
];

// Mock data de sublíneas
const SUBLINEAS_INICIAL = [
  { id: "sub1", nombre_sublinea: "Deep Learning", id_linea: "lin1", fechaCreacion: "2025-01-16" },
  { id: "sub2", nombre_sublinea: "Visión por Computador", id_linea: "lin1", fechaCreacion: "2025-01-17" },
  { id: "sub3", nombre_sublinea: "Desarrollo Web", id_linea: "lin2", fechaCreacion: "2025-01-21" },
];

// Mock data de áreas temáticas
const AREAS_INICIAL = [
  { id: "area1", nombre_area: "Redes Neuronales", id_sublinea: "sub1", fechaCreacion: "2025-01-18" },
  { id: "area2", nombre_area: "Reconocimiento de Imágenes", id_sublinea: "sub2", fechaCreacion: "2025-01-19" },
  { id: "area3", nombre_area: "Frontend Frameworks", id_sublinea: "sub3", fechaCreacion: "2025-01-22" },
];

/**
 * Custom Hook para gestionar Líneas de Investigación, Sublíneas y Áreas Temáticas
 * Contiene toda la lógica de CRUD para las tres entidades
 */
export function useResearchLinesManagement() {
  // ========== ESTADOS PARA LÍNEAS ==========
  const [nombreLinea, setNombreLinea] = useState("");
  const [lineas, setLineas] = useState(LINEAS_INICIAL);
  const [isEditingLinea, setIsEditingLinea] = useState(false);
  const [editingLineaId, setEditingLineaId] = useState(null);
  const [showEditLineaModal, setShowEditLineaModal] = useState(false);
  const [searchTermLinea, setSearchTermLinea] = useState("");

  // ========== ESTADOS PARA SUBLÍNEAS ==========
  const [nombreSublinea, setNombreSublinea] = useState("");
  const [idLineaParaSublinea, setIdLineaParaSublinea] = useState("");
  const [sublineas, setSublineas] = useState(SUBLINEAS_INICIAL);
  const [isEditingSublinea, setIsEditingSublinea] = useState(false);
  const [editingSublineaId, setEditingSublineaId] = useState(null);
  const [showEditSublineaModal, setShowEditSublineaModal] = useState(false);
  const [searchTermSublinea, setSearchTermSublinea] = useState("");

  // ========== ESTADOS PARA ÁREAS TEMÁTICAS ==========
  const [nombreArea, setNombreArea] = useState("");
  const [idSublineaParaArea, setIdSublineaParaArea] = useState("");
  const [areas, setAreas] = useState(AREAS_INICIAL);
  const [isEditingArea, setIsEditingArea] = useState(false);
  const [editingAreaId, setEditingAreaId] = useState(null);
  const [showEditAreaModal, setShowEditAreaModal] = useState(false);
  const [searchTermArea, setSearchTermArea] = useState("");

  // Cargar datos al inicializar
  useEffect(() => {
    cargarLineas();
    cargarSublineas();
    cargarAreas();
  }, []);

  // ========== FUNCIONES DE CARGA ==========
  const cargarLineas = async () => {
    try {
      const data = researchLinesService.listLineas();
      setLineas(data.length ? data : LINEAS_INICIAL);
      console.log('📥 Líneas cargadas (local):', data.length);
    } catch (error) {
      console.error('❌ Error cargando líneas locales:', error);
    }
  };

  const cargarSublineas = async () => {
    try {
      const data = researchLinesService.listSublineas();
      setSublineas(data.length ? data : SUBLINEAS_INICIAL);
      console.log('📥 Sublíneas cargadas (local):', data.length);
    } catch (error) {
      console.error('❌ Error cargando sublíneas locales:', error);
    }
  };

  const cargarAreas = async () => {
    try {
      const data = researchLinesService.listAreas();
      setAreas(data.length ? data : AREAS_INICIAL);
      console.log('📥 Áreas cargadas (local):', data.length);
    } catch (error) {
      console.error('❌ Error cargando áreas locales:', error);
    }
  };

  // ========== FUNCIONES AUXILIARES ==========
  const getLineaNombre = (idLinea) => {
    const linea = lineas.find(l => l.id === idLinea);
    return linea ? linea.nombre_linea : 'Sin asignar';
  };

  const getSublineaNombre = (idSublinea) => {
    const sublinea = sublineas.find(s => s.id === idSublinea);
    return sublinea ? sublinea.nombre_sublinea : 'Sin asignar';
  };

  const getSublineasPorLinea = (idLinea) => {
    return sublineas.filter(s => s.id_linea === idLinea);
  };

  // ========== CRUD LÍNEAS ==========
  const limpiarFormularioLinea = () => {
    setNombreLinea("");
  };

  const handleSubmitLinea = async (e) => {
    e.preventDefault();
    
    if (!nombreLinea) {
      alert("Por favor ingrese el nombre de la línea");
      return;
    }

    const payload = {
      nombre_linea: nombreLinea
    };

    console.log('📤 Enviando línea al backend:', JSON.stringify(payload, null, 2));

    try {
      const created = researchLinesService.createLinea(payload);
      console.log('✅ Línea creada (local):', created);
      await cargarLineas();
      alert("✅ Línea de investigación creada exitosamente");
      limpiarFormularioLinea();
    } catch (error) {
      console.error('❌ Error al crear línea local:', error);
      alert("❌ Error al crear la línea");
    }
  };

  const handleEditLinea = (linea) => {
    setEditingLineaId(linea.id);
    setNombreLinea(linea.nombre_linea);
    setIsEditingLinea(true);
    setShowEditLineaModal(true);
  };

  const handleSaveEditLinea = async (e) => {
    e.preventDefault();
    
    if (!nombreLinea) {
      alert("Por favor ingrese el nombre de la línea");
      return;
    }

    const payload = {
      nombre_linea: nombreLinea
    };

    console.log('📤 Actualizando línea (ID: ' + editingLineaId + '):', JSON.stringify(payload, null, 2));

    try {
      const updated = researchLinesService.updateLinea(editingLineaId, payload);
      if (updated) {
        console.log('✅ Línea actualizada (local):', updated);
        await cargarLineas();
        alert("✅ Línea actualizada exitosamente");
        handleCancelEditLinea();
      } else {
        alert('❌ Línea no encontrada');
      }
    } catch (error) {
      console.error('❌ Error al actualizar línea local:', error);
      alert("❌ Error al actualizar la línea");
    }
  };

  const handleCancelEditLinea = () => {
    setIsEditingLinea(false);
    setEditingLineaId(null);
    setShowEditLineaModal(false);
    limpiarFormularioLinea();
  };

  const handleDeleteLinea = async (id) => {
    const lineaAEliminar = lineas.find(l => l.id === id);
    
    if (window.confirm(`¿Está seguro de eliminar la línea "${lineaAEliminar?.nombre_linea}"? Esto también eliminará sus sublíneas y áreas temáticas.`)) {
      console.log('🗑️ Eliminando línea - ID:', id);
      
      try {
        researchLinesService.removeLinea(id);
        console.log('✅ Línea eliminada (local):', id);
        await cargarLineas();
        await cargarSublineas();
        await cargarAreas();
        alert("✅ Línea eliminada exitosamente");
      } catch (error) {
        console.error('❌ Error al eliminar línea local:', error);
        alert("❌ Error al eliminar la línea");
      }
    }
  };

  // ========== CRUD SUBLÍNEAS ==========
  const limpiarFormularioSublinea = () => {
    setNombreSublinea("");
    setIdLineaParaSublinea("");
  };

  const handleSubmitSublinea = async (e) => {
    e.preventDefault();
    
    if (!nombreSublinea || !idLineaParaSublinea) {
      alert("Por favor complete todos los campos obligatorios");
      return;
    }

    const payload = {
      nombre_sublinea: nombreSublinea,
      id_linea: idLineaParaSublinea
    };

    console.log('📤 Enviando sublínea al backend:', JSON.stringify(payload, null, 2));

    try {
      const response = await fetch(API_ENDPOINTS.SUBLINEAS_INVESTIGACION, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        const data = await response.json();
        console.log('✅ Sublínea creada:', data);
        await cargarSublineas();
        alert("✅ Sublínea creada exitosamente");
        limpiarFormularioSublinea();
      } else {
        const errorData = await response.json();
        console.error('❌ Error del servidor:', errorData);
        alert(`❌ Error: ${errorData.message || 'Error desconocido'}`);
      }
    } catch (error) {
      console.error('❌ Error al crear sublínea:', error);
      alert("❌ Error de conexión al crear la sublínea");
    }
  };

  const handleEditSublinea = (sublinea) => {
    setEditingSublineaId(sublinea.id);
    setNombreSublinea(sublinea.nombre_sublinea);
    setIdLineaParaSublinea(sublinea.id_linea);
    setIsEditingSublinea(true);
    setShowEditSublineaModal(true);
  };

  const handleSaveEditSublinea = async (e) => {
    e.preventDefault();
    
    if (!nombreSublinea || !idLineaParaSublinea) {
      alert("Por favor complete todos los campos obligatorios");
      return;
    }

    const payload = {
      nombre_sublinea: nombreSublinea,
      id_linea: idLineaParaSublinea
    };

    console.log('📤 Actualizando sublínea (ID: ' + editingSublineaId + '):', JSON.stringify(payload, null, 2));

    try {
      const response = await fetch(API_ENDPOINTS.SUBLINEA_BY_ID(editingSublineaId), {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        const data = await response.json();
        console.log('✅ Sublínea actualizada:', data);
        await cargarSublineas();
        alert("✅ Sublínea actualizada exitosamente");
        handleCancelEditSublinea();
      } else {
        const errorData = await response.json();
        console.error('❌ Error del servidor:', errorData);
        alert(`❌ Error: ${errorData.message || 'Error desconocido'}`);
      }
    } catch (error) {
      console.error('❌ Error al actualizar sublínea:', error);
      alert("❌ Error de conexión al actualizar la sublínea");
    }
  };

  const handleCancelEditSublinea = () => {
    setIsEditingSublinea(false);
    setEditingSublineaId(null);
    setShowEditSublineaModal(false);
    limpiarFormularioSublinea();
  };

  const handleDeleteSublinea = async (id) => {
    const sublineaAEliminar = sublineas.find(s => s.id === id);
    
    if (window.confirm(`¿Está seguro de eliminar la sublínea "${sublineaAEliminar?.nombre_sublinea}"? Esto también eliminará sus áreas temáticas.`)) {
      console.log('🗑️ Eliminando sublínea - ID:', id);
      
      try {
        const response = await fetch(API_ENDPOINTS.SUBLINEA_BY_ID(id), { 
          method: 'DELETE' 
        });
        
        if (response.ok) {
          console.log('✅ Sublínea eliminada del backend');
          await cargarSublineas();
          await cargarAreas();
          alert("✅ Sublínea eliminada exitosamente");
        } else {
          const errorData = await response.json();
          console.error('❌ Error del servidor:', errorData);
          alert(`❌ Error: ${errorData.message || 'Error desconocido'}`);
        }
      } catch (error) {
        console.error('❌ Error al eliminar sublínea:', error);
        alert("❌ Error de conexión al eliminar la sublínea");
      }
    }
  };

  // ========== CRUD ÁREAS TEMÁTICAS ==========
  const limpiarFormularioArea = () => {
    setNombreArea("");
    setIdSublineaParaArea("");
  };

  const handleSubmitArea = async (e) => {
    e.preventDefault();
    
    if (!nombreArea || !idSublineaParaArea) {
      alert("Por favor complete todos los campos obligatorios");
      return;
    }

    const payload = {
      nombre_area: nombreArea,
      id_sublinea: idSublineaParaArea
    };

    console.log('📤 Enviando área al backend:', JSON.stringify(payload, null, 2));

    try {
      const response = await fetch(API_ENDPOINTS.AREAS_TEMATICAS, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        const data = await response.json();
        console.log('✅ Área temática creada:', data);
        await cargarAreas();
        alert("✅ Área temática creada exitosamente");
        limpiarFormularioArea();
      } else {
        const errorData = await response.json();
        console.error('❌ Error del servidor:', errorData);
        alert(`❌ Error: ${errorData.message || 'Error desconocido'}`);
      }
    } catch (error) {
      console.error('❌ Error al crear área:', error);
      alert("❌ Error de conexión al crear el área temática");
    }
  };

  const handleEditArea = (area) => {
    setEditingAreaId(area.id);
    setNombreArea(area.nombre_area);
    setIdSublineaParaArea(area.id_sublinea);
    setIsEditingArea(true);
    setShowEditAreaModal(true);
  };

  const handleSaveEditArea = async (e) => {
    e.preventDefault();
    
    if (!nombreArea || !idSublineaParaArea) {
      alert("Por favor complete todos los campos obligatorios");
      return;
    }

    const payload = {
      nombre_area: nombreArea,
      id_sublinea: idSublineaParaArea
    };

    console.log('📤 Actualizando área (ID: ' + editingAreaId + '):', JSON.stringify(payload, null, 2));

    try {
      const response = await fetch(API_ENDPOINTS.AREA_BY_ID(editingAreaId), {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        const data = await response.json();
        console.log('✅ Área actualizada:', data);
        await cargarAreas();
        alert("✅ Área temática actualizada exitosamente");
        handleCancelEditArea();
      } else {
        const errorData = await response.json();
        console.error('❌ Error del servidor:', errorData);
        alert(`❌ Error: ${errorData.message || 'Error desconocido'}`);
      }
    } catch (error) {
      console.error('❌ Error al actualizar área:', error);
      alert("❌ Error de conexión al actualizar el área");
    }
  };

  const handleCancelEditArea = () => {
    setIsEditingArea(false);
    setEditingAreaId(null);
    setShowEditAreaModal(false);
    limpiarFormularioArea();
  };

  const handleDeleteArea = async (id) => {
    const areaAEliminar = areas.find(a => a.id === id);
    
    if (window.confirm(`¿Está seguro de eliminar el área "${areaAEliminar?.nombre_area}"?`)) {
      console.log('🗑️ Eliminando área - ID:', id);
      
      try {
        const response = await fetch(API_ENDPOINTS.AREA_BY_ID(id), { 
          method: 'DELETE' 
        });
        
        if (response.ok) {
          console.log('✅ Área eliminada del backend');
          await cargarAreas();
          alert("✅ Área temática eliminada exitosamente");
        } else {
          const errorData = await response.json();
          console.error('❌ Error del servidor:', errorData);
          alert(`❌ Error: ${errorData.message || 'Error desconocido'}`);
        }
      } catch (error) {
        console.error('❌ Error al eliminar área:', error);
        alert("❌ Error de conexión al eliminar el área");
      }
    }
  };

  // ========== FILTROS ==========
  const lineasFiltradas = lineas.filter(linea =>
    linea.nombre_linea.toLowerCase().includes(searchTermLinea.toLowerCase())
  );

  const sublineasFiltradas = sublineas.filter(sublinea =>
    sublinea.nombre_sublinea.toLowerCase().includes(searchTermSublinea.toLowerCase()) ||
    getLineaNombre(sublinea.id_linea).toLowerCase().includes(searchTermSublinea.toLowerCase())
  );

  const areasFiltradas = areas.filter(area =>
    area.nombre_area.toLowerCase().includes(searchTermArea.toLowerCase()) ||
    getSublineaNombre(area.id_sublinea).toLowerCase().includes(searchTermArea.toLowerCase())
  );

  // ========== RETORNAR TODO ==========
  return {
    // Estados de líneas
    nombreLinea,
    setNombreLinea,
    lineas,
    lineasFiltradas,
    searchTermLinea,
    setSearchTermLinea,
    showEditLineaModal,

    // Estados de sublíneas
    nombreSublinea,
    setNombreSublinea,
    idLineaParaSublinea,
    setIdLineaParaSublinea,
    sublineas,
    sublineasFiltradas,
    searchTermSublinea,
    setSearchTermSublinea,
    showEditSublineaModal,

    // Estados de áreas
    nombreArea,
    setNombreArea,
    idSublineaParaArea,
    setIdSublineaParaArea,
    areas,
    areasFiltradas,
    searchTermArea,
    setSearchTermArea,
    showEditAreaModal,

    // Funciones auxiliares
    getLineaNombre,
    getSublineaNombre,
    getSublineasPorLinea,

    // CRUD Líneas
    handleSubmitLinea,
    handleEditLinea,
    handleSaveEditLinea,
    handleCancelEditLinea,
    handleDeleteLinea,

    // CRUD Sublíneas
    handleSubmitSublinea,
    handleEditSublinea,
    handleSaveEditSublinea,
    handleCancelEditSublinea,
    handleDeleteSublinea,

    // CRUD Áreas
    handleSubmitArea,
    handleEditArea,
    handleSaveEditArea,
    handleCancelEditArea,
    handleDeleteArea,
  };
}
