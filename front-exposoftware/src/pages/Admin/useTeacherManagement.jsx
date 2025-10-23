import { useState, useEffect } from "react";
import { API_ENDPOINTS } from "../../utils/constants";
import { docentesService } from '../../services/docentesService';

// Opciones de tipo de documento
export const TIPOS_DOCUMENTO = ["CC", "TI", "CE", "PEP", "Pasaporte"];

// Opciones de género
export const GENEROS = ["Hombre", "Mujer", "Otro", "Prefiero no decirlo"];

// Opciones de identidad sexual
export const IDENTIDADES_SEXUALES = [
  "Heterosexual",
  "Homosexual",
  "Bisexual",
  "Otro",
  "Prefiero no decirlo"
];

// Opciones de categoría docente
export const CATEGORIAS_DOCENTE = ["Interno", "Invitado", "Externo"];

// Mock data inicial de profesores
const PROFESORES_INICIAL = [
  {
    id: "prof1",
    categoria_docente: "Interno",
    codigo_programa: "ING01",
    activo: true,
    usuario: {
      tipo_documento: "CC",
      identificacion: "1023456789",
      nombres: "María José",
      apellidos: "Pérez García",
      genero: "Mujer",
      correo: "maria.perez@unicesar.edu.co",
      telefono: "+573001234567"
    },
    fechaCreacion: "2025-01-15"
  },
  {
    id: "prof2",
    categoria_docente: "Interno",
    codigo_programa: "ING02",
    activo: true,
    usuario: {
      tipo_documento: "CC",
      identificacion: "1087654321",
      nombres: "Carlos Alberto",
      apellidos: "Mendoza López",
      genero: "Hombre",
      correo: "carlos.mendoza@unicesar.edu.co",
      telefono: "+573009876543"
    },
    fechaCreacion: "2025-01-20"
  },
];

/**
 * Custom Hook para gestionar la lógica de creación y manejo de profesores
 */
export function useTeacherManagement() {
  // Estados para el formulario - Datos del Usuario
  const [tipoDocumento, setTipoDocumento] = useState("");
  const [identificacion, setIdentificacion] = useState("");
  const [nombres, setNombres] = useState("");
  const [apellidos, setApellidos] = useState("");
  const [genero, setGenero] = useState("");
  const [identidadSexual, setIdentidadSexual] = useState("");
  const [fechaNacimiento, setFechaNacimiento] = useState("");
  const [direccion, setDireccion] = useState("");
  const [pais, setPais] = useState("Colombia");
  const [ciudad, setCiudad] = useState("");
  const [telefono, setTelefono] = useState("");
  const [correo, setCorreo] = useState("");
  const [contraseña, setContraseña] = useState("");

  // Estados para el formulario - Datos del Docente
  const [categoriaDocente, setCategoriaDocente] = useState("");
  const [codigoPrograma, setCodigoPrograma] = useState("");
  const [activo, setActivo] = useState(true);

  // Estado para la lista de profesores
  const [profesores, setProfesores] = useState(PROFESORES_INICIAL);

  // Estados para edición
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);

  // Estado para búsqueda/filtro
  const [searchTerm, setSearchTerm] = useState("");

  // Cargar profesores al montar el componente
  useEffect(() => {
    cargarProfesores();
  }, []);

  // Función para cargar profesores desde el backend
  const cargarProfesores = async () => {
    try {
      const data = docentesService.list();
      setProfesores(data.length ? data : PROFESORES_INICIAL);
      console.log('📥 Profesores cargados (local):', data.length);
    } catch (error) {
      console.error('❌ Error cargando profesores locales:', error);
    }
  };

  // Limpiar formulario
  const limpiarFormulario = () => {
    setTipoDocumento("");
    setIdentificacion("");
    setNombres("");
    setApellidos("");
    setGenero("");
    setIdentidadSexual("");
    setFechaNacimiento("");
    setDireccion("");
    setPais("Colombia");
    setCiudad("");
    setTelefono("");
    setCorreo("");
    setContraseña("");
    setCategoriaDocente("");
    setCodigoPrograma("");
    setActivo(true);
  };

  // Crear nuevo profesor
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!tipoDocumento || !identificacion || !nombres || !apellidos || !correo || !contraseña) {
      alert("Por favor complete todos los campos obligatorios");
      return;
    }

    // Estructura exacta que espera el backend
    const payload = {
      categoria_docente: categoriaDocente,
      codigo_programa: codigoPrograma,
      activo: activo,
      usuario: {
        tipo_documento: tipoDocumento,
        identificacion: identificacion,
        nombres: nombres,
        apellidos: apellidos,
        genero: genero,
        identidad_sexual: identidadSexual,
        fecha_nacimiento: fechaNacimiento,
        direccion: direccion,
        pais: pais,
        ciudad: ciudad,
        telefono: telefono,
        correo: correo,
        rol: "Docente",
        contraseña: contraseña
      }
    };

    console.log('📤 Enviando al backend:', JSON.stringify(payload, null, 2));

    try {
      const created = docentesService.create(payload);
      console.log('✅ Profesor creado (local):', created);
      await cargarProfesores();
      alert("✅ Profesor creado exitosamente");
      limpiarFormulario();
    } catch (error) {
      console.error('❌ Error al crear profesor local:', error);
      alert("❌ Error al crear el profesor");
    }
  };

  // Iniciar edición
  const handleEdit = (profesor) => {
    setEditingId(profesor.id);
    setTipoDocumento(profesor.usuario.tipo_documento);
    setIdentificacion(profesor.usuario.identificacion);
    setNombres(profesor.usuario.nombres);
    setApellidos(profesor.usuario.apellidos);
    setGenero(profesor.usuario.genero);
    setIdentidadSexual(profesor.usuario.identidad_sexual || "");
    setFechaNacimiento(profesor.usuario.fecha_nacimiento || "");
    setDireccion(profesor.usuario.direccion || "");
    setPais(profesor.usuario.pais || "Colombia");
    setCiudad(profesor.usuario.ciudad || "");
    setTelefono(profesor.usuario.telefono);
    setCorreo(profesor.usuario.correo);
    setCategoriaDocente(profesor.categoria_docente);
    setCodigoPrograma(profesor.codigo_programa);
    setActivo(profesor.activo);
    setIsEditing(true);
    setShowEditModal(true);
  };

  // Guardar edición
  const handleSaveEdit = async (e) => {
    e.preventDefault();

    if (!tipoDocumento || !identificacion || !nombres || !apellidos || !correo) {
      alert("Por favor complete todos los campos obligatorios");
      return;
    }

    const payload = {
      categoria_docente: categoriaDocente,
      codigo_programa: codigoPrograma,
      activo: activo,
      usuario: {
        tipo_documento: tipoDocumento,
        identificacion: identificacion,
        nombres: nombres,
        apellidos: apellidos,
        genero: genero,
        identidad_sexual: identidadSexual,
        fecha_nacimiento: fechaNacimiento,
        direccion: direccion,
        pais: pais,
        ciudad: ciudad,
        telefono: telefono,
        correo: correo,
        rol: "Docente"
      }
    };

    // Solo agregar contraseña si se proporcionó una nueva
    if (contraseña) {
      payload.usuario.contraseña = contraseña;
    }

    console.log('📤 Actualizando en backend (ID: ' + editingId + '):', JSON.stringify(payload, null, 2));

    try {
      const updated = docentesService.update(editingId, payload);
      if (updated) {
        console.log('✅ Profesor actualizado (local):', updated);
        await cargarProfesores();
        alert("✅ Profesor actualizado exitosamente");
        handleCancelEdit();
      } else {
        alert('❌ Profesor no encontrado');
      }
    } catch (error) {
      console.error('❌ Error al actualizar profesor local:', error);
      alert("❌ Error al actualizar el profesor");
    }
  };

  // Cancelar edición
  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditingId(null);
    setShowEditModal(false);
    limpiarFormulario();
  };

  // Eliminar profesor
  const handleDelete = async (id) => {
    const profesorAEliminar = profesores.find(p => p.id === id);

    if (window.confirm(`¿Está seguro de que desea eliminar al profesor "${profesorAEliminar?.usuario.nombres} ${profesorAEliminar?.usuario.apellidos}"?`)) {
      console.log('🗑️ Eliminando del backend - ID:', id);
      console.log('📋 Profesor a eliminar:', `${profesorAEliminar?.usuario.nombres} ${profesorAEliminar?.usuario.apellidos}`);

      try {
        docentesService.remove(id);
        console.log('✅ Profesor eliminado (local) ID:', id);
        await cargarProfesores();
        alert("✅ Profesor eliminado exitosamente");
      } catch (error) {
        console.error('❌ Error al eliminar profesor local:', error);
        alert("❌ Error al eliminar el profesor");
      }
    }
  };

  // Cancelar formulario
  const handleCancel = () => {
    limpiarFormulario();
  };

  // Filtrar profesores por búsqueda
  const profesoresFiltrados = profesores.filter(profesor =>
    profesor.usuario.nombres.toLowerCase().includes(searchTerm.toLowerCase()) ||
    profesor.usuario.apellidos.toLowerCase().includes(searchTerm.toLowerCase()) ||
    profesor.usuario.identificacion.includes(searchTerm) ||
    profesor.usuario.correo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    profesor.codigo_programa.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return {
    // Estados del formulario - Usuario
    tipoDocumento,
    setTipoDocumento,
    identificacion,
    setIdentificacion,
    nombres,
    setNombres,
    apellidos,
    setApellidos,
    genero,
    setGenero,
    identidadSexual,
    setIdentidadSexual,
    fechaNacimiento,
    setFechaNacimiento,
    direccion,
    setDireccion,
    pais,
    setPais,
    ciudad,
    setCiudad,
    telefono,
    setTelefono,
    correo,
    setCorreo,
    contraseña,
    setContraseña,

    // Estados del formulario - Docente
    categoriaDocente,
    setCategoriaDocente,
    codigoPrograma,
    setCodigoPrograma,
    activo,
    setActivo,

    // Estados de la lista y UI
    profesores,
    searchTerm,
    setSearchTerm,
    profesoresFiltrados,

    // Estados de edición
    isEditing,
    showEditModal,

    // Funciones
    handleSubmit,
    handleEdit,
    handleSaveEdit,
    handleCancelEdit,
    handleDelete,
    handleCancel,
  };
}
