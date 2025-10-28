import { useState, useEffect, useMemo } from "react";
import { API_ENDPOINTS } from "../../utils/constants";
import colombiaData from "../../data/colombia.json";
import countryList from 'react-select-country-list';

// Opciones de tipo de documento
export const TIPOS_DOCUMENTO = ["CC", "TI", "CE", "PEP", "Pasaporte"];

// Opciones de género
export const GENEROS = ["Hombre", "Mujer","Hermafrodita"];

// Opciones de identidad sexual
export const IDENTIDADES_SEXUALES = [
  "Heterosexual",
  "Homosexual",
  "Bisexual",
  "Pansexual",
  "Asexual",
  "Demisexual",
  "Sapiosexual",
  "Queer",
  "Graysexual",
  "Omnisexual",
  "Androsexual",
  "Gynesexual",
  "Polysexual"
];

// Opciones de categoría docente
export const CATEGORIAS_DOCENTE = ["Interno", "Invitado", "Externo"];

// Opciones de departamentos de Colombia
export const DEPARTAMENTOS_COLOMBIA = [
  "Amazonas", "Antioquia", "Arauca", "Atlántico", "Bolívar", "Boyacá",
  "Caldas", "Caquetá", "Casanare", "Cauca", "Cesar", "Chocó", "Córdoba",
  "Cundinamarca", "Guainía", "Guaviare", "Huila", "La Guajira", "Magdalena",
  "Meta", "Nariño", "Norte de Santander", "Putumayo", "Quindío", "Risaralda",
  "San Andrés y Providencia", "Santander", "Sucre", "Tolima", "Valle del Cauca",
  "Vaupés", "Vichada"
];

// Opciones de países
export const PAISES = [
  "Colombia", "Argentina", "Brasil", "Chile", "Ecuador", "México", "Perú",
  "Venezuela", "Estados Unidos", "España", "Otro"
];

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
  // Opciones de países/nacionalidades
  const opcionesPaises = useMemo(() => countryList().getData(), []);

  // Estados para el formulario - Datos del Usuario (heredados)
  const [tipoDocumento, setTipoDocumento] = useState("");
  const [identificacion, setIdentificacion] = useState("");
  const [nombres, setNombres] = useState("");
  const [apellidos, setApellidos] = useState("");
  const [genero, setGenero] = useState("");
  const [identidadSexual, setIdentidadSexual] = useState("");
  const [fechaNacimiento, setFechaNacimiento] = useState("");
  const [nacionalidad, setNacionalidad] = useState("CO"); // Código ISO de Colombia
  const [pais, setPais] = useState("CO"); // Código ISO de Colombia (pais_residencia en backend)
  const [departamento, setDepartamento] = useState("");
  const [municipio, setMunicipio] = useState("");
  const [ciudadResidencia, setCiudadResidencia] = useState("");
  const [direccionResidencia, setDireccionResidencia] = useState("");
  const [telefono, setTelefono] = useState("");
  const [correo, setCorreo] = useState("");
  const [contraseña, setContraseña] = useState("");

  // Estados para el formulario - Datos del Docente (propios)
  const [categoriaDocente, setCategoriaDocente] = useState("");
  const [codigoPrograma, setCodigoPrograma] = useState("");
  const [activo, setActivo] = useState(true);

  // Estados para manejar municipios dinámicos
  const [municipios, setMunicipios] = useState([]);

  // Limpiar código de programa cuando la categoría cambie a Invitado o Externo
  useEffect(() => {
    if (categoriaDocente === "Invitado" || categoriaDocente === "Externo") {
      setCodigoPrograma("");
    }
  }, [categoriaDocente]);

  // Actualizar municipios cuando cambie el departamento
  useEffect(() => {
    if (departamento) {
      const depto = colombiaData.find((d) => d.departamento === departamento);
      setMunicipios(depto && Array.isArray(depto.ciudades) ? depto.ciudades : []);
    } else {
      setMunicipios([]);
      setMunicipio("");
    }
  }, [departamento]);

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
      console.log('⚠️ Usando datos mock locales');
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
    setNacionalidad("CO"); // Código ISO de Colombia
    setPais("CO"); // Código ISO de Colombia
    setDepartamento("");
    setMunicipio("");
    setCiudadResidencia("");
    setDireccionResidencia("");
    setTelefono("");
    setCorreo("");
    setContraseña("");
    setCategoriaDocente("");
    setCodigoPrograma("");
    setActivo(true);
    // Limpiar listas de municipios
    setMunicipios([]);
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
        nacionalidad: nacionalidad,
        pais_residencia: pais, // ⚠️ CORREGIDO: backend espera pais_residencia
        departamento: departamento,
        municipio: municipio,
        ciudad_residencia: ciudadResidencia,
        direccion_residencia: direccionResidencia,
        telefono: telefono,
        correo: correo,
        rol: "Docente",
        contraseña: contraseña
      }
    };

    console.log('📤 Enviando al backend:', JSON.stringify(payload, null, 2));

    try {
      const response = await fetch(API_ENDPOINTS.DOCENTES, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        const data = await response.json();
        console.log('✅ Respuesta del backend:', data);

        await cargarProfesores();
        alert("✅ Profesor creado exitosamente");
        limpiarFormulario();
      } else {
        const errorData = await response.json();
        console.error('❌ Error del servidor:', errorData);
        alert(`❌ Error al crear el profesor: ${errorData.message || 'Error desconocido'}`);
      }
    } catch (error) {
      console.error('❌ Error al crear profesor:', error);
      alert("❌ Error de conexión al crear el profesor");
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
    setNacionalidad(profesor.usuario.nacionalidad || "CO");
    setPais(profesor.usuario.pais_residencia || "CO");
    setDepartamento(profesor.usuario.departamento || "");
    setMunicipio(profesor.usuario.municipio || "");
    setCiudadResidencia(profesor.usuario.ciudad_residencia || "");
    setDireccionResidencia(profesor.usuario.direccion_residencia || "");
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
        nacionalidad: nacionalidad,
        pais_residencia: pais, // ⚠️ CORREGIDO: backend espera pais_residencia
        departamento: departamento,
        municipio: municipio,
        ciudad_residencia: ciudadResidencia,
        direccion_residencia: direccionResidencia,
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
      const response = await fetch(API_ENDPOINTS.DOCENTE_BY_ID(editingId), {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        const data = await response.json();
        console.log('✅ Respuesta del backend:', data);

        await cargarProfesores();
        alert("✅ Profesor actualizado exitosamente");
        handleCancelEdit();
      } else {
        const errorData = await response.json();
        console.error('❌ Error del servidor:', errorData);
        alert(`❌ Error al actualizar el profesor: ${errorData.message || 'Error desconocido'}`);
      }
    } catch (error) {
      console.error('❌ Error al actualizar profesor:', error);
      alert("❌ Error de conexión al actualizar el profesor");
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
        const response = await fetch(API_ENDPOINTS.DOCENTE_BY_ID(id), {
          method: 'DELETE'
        });

        if (response.ok) {
          console.log('✅ Profesor eliminado del backend');
          await cargarProfesores();
          alert("✅ Profesor eliminado exitosamente");
        } else {
          const errorData = await response.json();
          console.error('❌ Error del servidor:', errorData);
          alert(`❌ Error al eliminar el profesor: ${errorData.message || 'Error desconocido'}`);
        }
      } catch (error) {
        console.error('❌ Error al eliminar profesor:', error);
        alert("❌ Error de conexión al eliminar el profesor");
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
    // Estados del formulario - Usuario (heredados)
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
    nacionalidad,
    setNacionalidad,
    pais,
    setPais,
    departamento,
    setDepartamento,
    municipio,
    setMunicipio,
    ciudadResidencia,
    setCiudadResidencia,
    direccionResidencia,
    setDireccionResidencia,
    telefono,
    setTelefono,
    correo,
    setCorreo,
    contraseña,
    setContraseña,

    // Estados del formulario - Docente (propios)
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

    // Estados para municipios dinámicos
    municipios,

    // Opciones de países/nacionalidades
    opcionesPaises,

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
