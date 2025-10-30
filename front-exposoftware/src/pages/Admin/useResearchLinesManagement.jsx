import { useState, useEffect } from "react";
import ResearchLinesService from "../../Services/ResearchLinesService";

export function useResearchLinesManagement() {
  const [codigoLinea, setCodigoLinea] = useState("");
  const [nombreLinea, setNombreLinea] = useState("");
  const [lineas, setLineas] = useState([]);
  const [editingLineaCodigo, setEditingLineaCodigo] = useState(null);
  const [showEditLineaModal, setShowEditLineaModal] = useState(false);
  const [searchTermLinea, setSearchTermLinea] = useState("");

  const [codigoSublinea, setCodigoSublinea] = useState("");
  const [nombreSublinea, setNombreSublinea] = useState("");
  const [idLineaParaSublinea, setIdLineaParaSublinea] = useState("");
  const [sublineas, setSublineas] = useState([]);
  const [editingSublineaCodigo, setEditingSublineaCodigo] = useState(null);
  const [editingSublineaLineaCodigo, setEditingSublineaLineaCodigo] = useState(null);
  const [showEditSublineaModal, setShowEditSublineaModal] = useState(false);
  const [searchTermSublinea, setSearchTermSublinea] = useState("");

  const [codigoArea, setCodigoArea] = useState("");
  const [nombreArea, setNombreArea] = useState("");
  const [idSublineaParaArea, setIdSublineaParaArea] = useState("");
  const [areas, setAreas] = useState([]);
  const [editingAreaCodigo, setEditingAreaCodigo] = useState(null);
  const [editingAreaSublineaCodigo, setEditingAreaSublineaCodigo] = useState(null);
  const [editingAreaLineaCodigo, setEditingAreaLineaCodigo] = useState(null);
  const [showEditAreaModal, setShowEditAreaModal] = useState(false);
  const [searchTermArea, setSearchTermArea] = useState("");

  useEffect(() => {
    cargarLineas();
    cargarTodasSublineas();
    cargarTodasAreas();
  }, []);

  const cargarLineas = async () => {
    try {
      const data = await ResearchLinesService.obtenerLineas();
      setLineas(data);
    } catch (error) {
      console.error(error);
      alert("Error al cargar las líneas");
    }
  };

  const cargarTodasSublineas = async () => {
    try {
      const data = await ResearchLinesService.obtenerTodasSublineas();
      setSublineas(data);
    } catch (error) {
      console.error(error);
      alert("Error al cargar las sublíneas");
    }
  };

  const cargarTodasAreas = async () => {
    try {
      const data = await ResearchLinesService.obtenerTodasAreas();
      setAreas(data);
    } catch (error) {
      console.error(error);
      alert("Error al cargar las áreas");
    }
  };

  const lineasFiltradas = lineas.filter((linea) =>
    linea.nombre_linea?.toLowerCase().includes(searchTermLinea.toLowerCase())
  );

  const sublineasFiltradas = sublineas.filter((sublinea) =>
    sublinea.nombre_sublinea?.toLowerCase().includes(searchTermSublinea.toLowerCase())
  );

  const areasFiltradas = areas.filter((area) =>
    area.nombre_area?.toLowerCase().includes(searchTermArea.toLowerCase())
  );

  const getLineaNombre = (codigoLinea) => {
    const linea = lineas.find((l) => l.codigo_linea === codigoLinea);
    return linea ? linea.nombre_linea : "Desconocida";
  };

  const getSublineaNombre = (codigoSublinea) => {
    const sublinea = sublineas.find((s) => s.codigo_sublinea === codigoSublinea);
    return sublinea ? sublinea.nombre_sublinea : "Desconocida";
  };

  const getSublineasPorLinea = (codigoLinea) => {
    return sublineas.filter((s) => s.codigo_linea === codigoLinea);
  };

  const handleSubmitLinea = async (e) => {
    e.preventDefault();
    if (!nombreLinea.trim()) {
      alert("El nombre es obligatorio");
      return;
    }
    try {
      await ResearchLinesService.crearLinea({ nombre_linea: nombreLinea });
      alert("Línea creada exitosamente");
      setNombreLinea("");
      await cargarLineas();
    } catch (error) {
      alert(error.message || "Error al crear");
    }
  };

  const handleEditLinea = (linea) => {
    setEditingLineaCodigo(linea.codigo_linea);
    setNombreLinea(linea.nombre_linea);
    setShowEditLineaModal(true);
  };

  const handleSaveEditLinea = async (e) => {
    e.preventDefault();
    if (!nombreLinea.trim()) {
      alert("El nombre es obligatorio");
      return;
    }
    try {
      await ResearchLinesService.actualizarLinea(editingLineaCodigo, { nombre_linea: nombreLinea });
      alert("Línea actualizada");
      setShowEditLineaModal(false);
      setEditingLineaCodigo(null);
      setNombreLinea("");
      await cargarLineas();
    } catch (error) {
      alert(error.message || "Error al actualizar");
    }
  };

  const handleCancelEditLinea = () => {
    setShowEditLineaModal(false);
    setEditingLineaCodigo(null);
    setNombreLinea("");
  };

  const handleDeleteLinea = async (codigoLinea) => {
    if (!confirm("¿Eliminar línea?")) return;
    try {
      await ResearchLinesService.eliminarLinea(codigoLinea);
      alert("Línea eliminada");
      await cargarLineas();
      await cargarTodasSublineas();
      await cargarTodasAreas();
    } catch (error) {
      alert(error.message || "Error al eliminar");
    }
  };

  const handleSubmitSublinea = async (e) => {
    e.preventDefault();
    if (!nombreSublinea.trim() || !idLineaParaSublinea) {
      alert("Campos obligatorios");
      return;
    }
    try {
      await ResearchLinesService.crearSublinea(idLineaParaSublinea, { nombre_sublinea: nombreSublinea });
      alert("Sublínea creada");
      setNombreSublinea("");
      setIdLineaParaSublinea("");
      await cargarTodasSublineas();
    } catch (error) {
      alert(error.message || "Error al crear");
    }
  };

  const handleEditSublinea = (sublinea) => {
    setEditingSublineaCodigo(sublinea.codigo_sublinea);
    setEditingSublineaLineaCodigo(sublinea.codigo_linea);
    setNombreSublinea(sublinea.nombre_sublinea);
    setIdLineaParaSublinea(sublinea.codigo_linea);
    setShowEditSublineaModal(true);
  };

  const handleSaveEditSublinea = async (e) => {
    e.preventDefault();
    if (!nombreSublinea.trim()) {
      alert("El nombre es obligatorio");
      return;
    }
    try {
      await ResearchLinesService.actualizarSublinea(editingSublineaLineaCodigo, editingSublineaCodigo, { nombre_sublinea: nombreSublinea });
      alert("Sublínea actualizada");
      setShowEditSublineaModal(false);
      setEditingSublineaCodigo(null);
      setEditingSublineaLineaCodigo(null);
      setNombreSublinea("");
      setIdLineaParaSublinea("");
      await cargarTodasSublineas();
    } catch (error) {
      alert(error.message || "Error al actualizar");
    }
  };

  const handleCancelEditSublinea = () => {
    setShowEditSublineaModal(false);
    setEditingSublineaCodigo(null);
    setEditingSublineaLineaCodigo(null);
    setNombreSublinea("");
    setIdLineaParaSublinea("");
  };

  const handleDeleteSublinea = async (codigoSublinea) => {
    if (!confirm("¿Eliminar sublínea?")) return;
    try {
      const sublinea = sublineas.find(s => s.codigo_sublinea === codigoSublinea);
      if (!sublinea) throw new Error("No encontrada");
      await ResearchLinesService.eliminarSublinea(sublinea.codigo_linea, codigoSublinea);
      alert("Sublínea eliminada");
      await cargarTodasSublineas();
      await cargarTodasAreas();
    } catch (error) {
      alert(error.message || "Error al eliminar");
    }
  };

  const handleSubmitArea = async (e) => {
    e.preventDefault();
    if (!nombreArea.trim() || !idSublineaParaArea) {
      alert("Campos obligatorios");
      return;
    }
    try {
      const sublinea = sublineas.find(s => s.codigo_sublinea === parseInt(idSublineaParaArea));
      if (!sublinea) throw new Error("Sublínea no encontrada");
      await ResearchLinesService.crearArea(sublinea.codigo_linea, idSublineaParaArea, { nombre_area: nombreArea });
      alert("Área creada");
      setNombreArea("");
      setIdSublineaParaArea("");
      await cargarTodasAreas();
    } catch (error) {
      alert(error.message || "Error al crear");
    }
  };

  const handleEditArea = (area) => {
    setEditingAreaCodigo(area.codigo_area);
    setEditingAreaSublineaCodigo(area.codigo_sublinea);
    setEditingAreaLineaCodigo(area.codigo_linea);
    setNombreArea(area.nombre_area);
    setIdSublineaParaArea(area.codigo_sublinea);
    setShowEditAreaModal(true);
  };

  const handleSaveEditArea = async (e) => {
    e.preventDefault();
    if (!nombreArea.trim()) {
      alert("El nombre es obligatorio");
      return;
    }
    try {
      await ResearchLinesService.actualizarArea(editingAreaLineaCodigo, editingAreaSublineaCodigo, editingAreaCodigo, { nombre_area: nombreArea });
      alert("Área actualizada");
      setShowEditAreaModal(false);
      setEditingAreaCodigo(null);
      setEditingAreaSublineaCodigo(null);
      setEditingAreaLineaCodigo(null);
      setNombreArea("");
      setIdSublineaParaArea("");
      await cargarTodasAreas();
    } catch (error) {
      alert(error.message || "Error al actualizar");
    }
  };

  const handleCancelEditArea = () => {
    setShowEditAreaModal(false);
    setEditingAreaCodigo(null);
    setEditingAreaSublineaCodigo(null);
    setEditingAreaLineaCodigo(null);
    setNombreArea("");
    setIdSublineaParaArea("");
  };

  const handleDeleteArea = async (codigoArea) => {
    if (!confirm("¿Eliminar área?")) return;
    try {
      const area = areas.find(a => a.codigo_area === codigoArea);
      if (!area) throw new Error("No encontrada");
      await ResearchLinesService.eliminarArea(area.codigo_linea, area.codigo_sublinea, codigoArea);
      alert("Área eliminada");
      await cargarTodasAreas();
    } catch (error) {
      alert(error.message || "Error al eliminar");
    }
  };

  return {
    codigoLinea, setCodigoLinea, nombreLinea, setNombreLinea, lineas, lineasFiltradas, searchTermLinea, setSearchTermLinea, showEditLineaModal,
    codigoSublinea, setCodigoSublinea, nombreSublinea, setNombreSublinea, idLineaParaSublinea, setIdLineaParaSublinea, sublineas, sublineasFiltradas, searchTermSublinea, setSearchTermSublinea, showEditSublineaModal,
    codigoArea, setCodigoArea, nombreArea, setNombreArea, idSublineaParaArea, setIdSublineaParaArea, areas, areasFiltradas, searchTermArea, setSearchTermArea, showEditAreaModal,
    getLineaNombre, getSublineaNombre, getSublineasPorLinea,
    handleSubmitLinea, handleEditLinea, handleSaveEditLinea, handleCancelEditLinea, handleDeleteLinea,
    handleSubmitSublinea, handleEditSublinea, handleSaveEditSublinea, handleCancelEditSublinea, handleDeleteSublinea,
    handleSubmitArea, handleEditArea, handleSaveEditArea, handleCancelEditArea, handleDeleteArea,
  };
}