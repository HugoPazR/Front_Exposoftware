import { useState, useEffect, useMemo } from "react";
import colombiaData from "../../data/colombia.json";
import countryList from 'react-select-country-list';
import {
  obtenerDocentes,
  crearDocente,
  actualizarDocente,
  eliminarDocente,
  filtrarDocentes,
  formatearDatosDocente,
  TIPOS_DOCUMENTO,
  GENEROS,
  IDENTIDADES_SEXUALES,
  CATEGORIAS_DOCENTE,
  DEPARTAMENTOS_COLOMBIA
} from "../../Services/CreateTeacher";

// Re-exportar constantes para mantener compatibilidad
export { TIPOS_DOCUMENTO, GENEROS, IDENTIDADES_SEXUALES, CATEGORIAS_DOCENTE, DEPARTAMENTOS_COLOMBIA };

export const PAISES = [
  "Colombia", "Argentina", "Brasil", "Chile", "Ecuador", "México", "Perú",
  "Venezuela", "Estados Unidos", "España", "Otro"
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
  // Nombres y apellidos separados según tabla DOCENTE
  const [primerNombre, setPrimerNombre] = useState("");
  const [segundoNombre, setSegundoNombre] = useState("");
  const [primerApellido, setPrimerApellido] = useState("");
  const [segundoApellido, setSegundoApellido] = useState("");
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
  const [profesores, setProfesores] = useState([]);
  // Estado de carga y mensaje de error del servidor
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState("");

  // Estados para edición
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);

  // Estado para búsqueda/filtro
  const [searchTerm, setSearchTerm] = useState("");

  // Cargar profesores al montar el componente (evitar usar función antes de definirla)
  useEffect(() => {
    (async () => {
      setLoading(true);
      setServerError("");
      try {
        console.log('🔄 Iniciando carga de profesores...');
        const data = await obtenerDocentes();
        console.log('✅ Profesores cargados exitosamente:', data);
        setProfesores(data);
      } catch (error) {
        console.error('❌ Error al cargar profesores:', error);
        setProfesores([]);
        setServerError(error.message || 'Error al cargar profesores');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // Función para (re)cargar profesores desde el backend — usada por submit/edición/eliminación
  const cargarProfesores = async () => {
    setLoading(true);
    setServerError("");
    try {
      console.log('🔄 Iniciando carga de profesores...');
      const data = await obtenerDocentes();
      console.log('✅ Profesores cargados exitosamente:', data);
      setProfesores(data);
      setServerError("");
    } catch (error) {
      console.error('❌ Error al cargar profesores:', error);
      setProfesores([]);
      setServerError(error.message || 'Error al cargar profesores');
    } finally {
      setLoading(false);
    }
  };

  // Limpiar formulario
  const limpiarFormulario = () => {
    setTipoDocumento("");
    setIdentificacion("");
    setPrimerNombre("");
    setSegundoNombre("");
    setPrimerApellido("");
    setSegundoApellido("");
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

  // Crear nuevo profesor usando el servicio
  const handleSubmit = async (e, onSuccess = null) => {
    e.preventDefault();

    setLoading(true);
    setServerError("");

    try {
      // Combinar nombres y apellidos separados en campos únicos para el servicio
      const nombresCompletos = `${primerNombre} ${segundoNombre}`.trim();
      const apellidosCompletos = `${primerApellido} ${segundoApellido}`.trim();

      const datosDocente = formatearDatosDocente({
        tipoDocumento,
        identificacion,
        nombres: nombresCompletos,
        apellidos: apellidosCompletos,
        genero,
        identidadSexual,
        fechaNacimiento,
        nacionalidad,
        pais,
        departamento,
        municipio,
        ciudadResidencia,
        direccionResidencia,
        telefono,
        correo,
        contraseña,
        categoriaDocente,
        codigoPrograma
      });

      await crearDocente(datosDocente);
      await cargarProfesores();
      // éxito: limpiar formulario y resetear errores
      limpiarFormulario();
      setServerError("");
      // Llamar callback de éxito si se proporciona
      if (onSuccess) {
        onSuccess(`✅ Profesor ${nombresCompletos} creado correctamente`);
      }
    } catch (error) {
      console.error('❌ Error creando docente:', error);
      setServerError(error.message || 'Error al crear docente');
    }
    finally {
      setLoading(false);
    }
  };

  // Iniciar edición
  const handleEdit = (profesor) => {
    console.log('🔍 Editando profesor:', profesor);
    
    setEditingId(profesor.id);
    
    // Verificar si tiene propiedad 'usuario' o si los datos están directamente en el objeto
    const datos = profesor.usuario || profesor;
    
    setTipoDocumento(datos.tipo_documento || "");
    setIdentificacion(datos.identificacion || "");
    
    // El backend retorna 'nombres' y 'apellidos' combinados, no separados
    // Separar nombres para mostrar en los campos primerNombre/segundoNombre
    const nombresArray = (datos.nombres || "").split(" ");
    const primerNom = nombresArray[0] || "";
    const segundoNom = nombresArray.slice(1).join(" ") || "";
    
    const apellidosArray = (datos.apellidos || "").split(" ");
    const primerApellido = apellidosArray[0] || "";
    const segundoApellido = apellidosArray.slice(1).join(" ") || "";
    
    setPrimerNombre(primerNom);
    setSegundoNombre(segundoNom);
    setPrimerApellido(primerApellido);
    setSegundoApellido(segundoApellido);
    
    setGenero(datos.sexo || datos.genero || ""); // Backend usa 'sexo'
    setIdentidadSexual(datos.identidad_sexual || "");
    setFechaNacimiento(datos.fecha_nacimiento || "");
    setNacionalidad(datos.nacionalidad === "Colombiana" ? "CO" : datos.nacionalidad || "CO");
    setPais(datos.pais_residencia === "Colombia" ? "CO" : datos.pais_residencia || "CO");
    setDepartamento(datos.departamento || ""); // Backend usa 'departamento' (no 'departamento_residencia')
    setMunicipio(datos.municipio || "");
    setCiudadResidencia(datos.ciudad_residencia || "");
    setDireccionResidencia(datos.direccion_residencia || "");
    setTelefono(datos.telefono || "");
    setCorreo(datos.correo || "");
    setCategoriaDocente(profesor.categoria_docente || "");
    setCodigoPrograma(profesor.codigo_programa || "");
    setActivo(profesor.activo !== undefined ? profesor.activo : true);
    setIsEditing(true);
    setShowEditModal(true);
  };

  // Guardar edición usando el servicio
  const handleSaveEdit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setServerError("");

    try {
      // Combinar nombres y apellidos separados en campos únicos para el servicio
      const nombresCompletos = `${primerNombre} ${segundoNombre}`.trim();
      const apellidosCompletos = `${primerApellido} ${segundoApellido}`.trim();

      const datosDocente = formatearDatosDocente({
        tipoDocumento,
        identificacion,
        nombres: nombresCompletos,
        apellidos: apellidosCompletos,
        genero,
        identidadSexual,
        fechaNacimiento,
        nacionalidad,
        pais,
        departamento,
        municipio,
        ciudadResidencia,
        direccionResidencia,
        telefono,
        correo,
        contraseña,
        categoriaDocente,
        codigoPrograma
      });

      await actualizarDocente(editingId, datosDocente);
      await cargarProfesores();
      setServerError("");
      handleCancelEdit();
    } catch (error) {
      console.error('❌ Error actualizando docente:', error);
      setServerError(error.message || 'Error al actualizar docente');
    }
    finally {
      setLoading(false);
    }
  };

  // Cancelar edición
  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditingId(null);
    setShowEditModal(false);
    limpiarFormulario();
  };

  // Eliminar profesor usando el servicio
  const handleDelete = async (id) => {
    const profesorAEliminar = profesores.find(p => p.id === id);
    
    // El backend retorna 'nombres' combinado, no separado
    const nombreCompleto = profesorAEliminar?.usuario?.nombres || profesorAEliminar?.nombres || "profesor";

    if (window.confirm(`¿Está seguro de que desea eliminar al profesor "${nombreCompleto}"?`)) {
      try {
        setLoading(true);
        setServerError("");
        await eliminarDocente(id);
        await cargarProfesores();
        setServerError("");
      } catch (error) {
        console.error('❌ Error eliminando docente:', error);
        setServerError(error.message || 'Error al eliminar docente');
      }
      finally {
        setLoading(false);
      }
    }
  };

  // Cancelar formulario
  const handleCancel = () => {
    limpiarFormulario();
  };

  // Filtrar profesores por búsqueda usando el servicio
  const profesoresFiltrados = filtrarDocentes(profesores, searchTerm);

  return {
    // Estados del formulario - Usuario (heredados)
    tipoDocumento,
    setTipoDocumento,
    identificacion,
    setIdentificacion,
    // Nombres y apellidos separados
    primerNombre,
    setPrimerNombre,
    segundoNombre,
    setSegundoNombre,
    primerApellido,
    setPrimerApellido,
    segundoApellido,
    setSegundoApellido,
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
    // UI states
    loading,
    serverError,
  };
}
