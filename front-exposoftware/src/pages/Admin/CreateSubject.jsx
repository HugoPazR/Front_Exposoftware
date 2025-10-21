import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import logo from "../../assets/Logo-unicesar.png";
import { API_ENDPOINTS } from "../../utils/constants";

// Mock data de docentes disponibles
const DOCENTES_MOCK = [
  { id: "BU7rpAz6Nbn9DKq517wb", nombre: "Dr. Alejandro José Meriño" },
  { id: "TEElkzBShoDC6beuFjHE", nombre: "Dr. Juan Pérez" },
  { id: "doc3", nombre: "Ing. María González" },
  { id: "doc4", nombre: "Lic. Carla Ruíz" },
  { id: "doc5", nombre: "Ing. Sofía Benítez" },
];

// Opciones de ciclo semestral
const CICLOS_SEMESTRALES = [
  "Ciclo Básico",
  "Ciclo Profesional",
  "Ciclo de Profundización"
];

// Mock data inicial de materias (según estructura backend)
const MATERIAS_INICIAL = [
  {
    id: "mat1",
    codigo_materia: "PROG3",
    nombre_materia: "Programación III",
    ciclo_semestral: "Ciclo Profesional",
    grupos_con_docentes: [
      { codigo_grupo: 101, id_docente: "BU7rpAz6Nbn9DKq517wb" },
      { codigo_grupo: 102, id_docente: "TEElkzBShoDC6beuFjHE" }
    ],
    fechaCreacion: "2025-01-15"
  },
  {
    id: "mat2",
    codigo_materia: "BD2",
    nombre_materia: "Bases de Datos II",
    ciclo_semestral: "Ciclo Profesional",
    grupos_con_docentes: [
      { codigo_grupo: 201, id_docente: "doc3" }
    ],
    fechaCreacion: "2025-01-20"
  },
];

export default function CreateSubject() {
  // Estados para el formulario principal
  const [codigoMateria, setCodigoMateria] = useState("");
  const [nombreMateria, setNombreMateria] = useState("");
  const [cicloSemestral, setCicloSemestral] = useState("");
  
  // Estados para gestionar grupos y docentes
  const [gruposConDocentes, setGruposConDocentes] = useState([
    { codigo_grupo: "", id_docente: "" }
  ]);
  
  // Estado para la lista de materias
  const [materias, setMaterias] = useState(MATERIAS_INICIAL);
  
  // Estados para edición
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  
  // Estado para búsqueda/filtro
  const [searchTerm, setSearchTerm] = useState("");

  // Obtener nombre del docente por ID
  const getDocenteNombre = (docenteId) => {
    const docente = DOCENTES_MOCK.find(d => d.id === docenteId);
    return docente ? docente.nombre : "Sin asignar";
  };

  // Agregar nuevo grupo-docente al formulario
  const agregarGrupoDocente = () => {
    setGruposConDocentes([...gruposConDocentes, { codigo_grupo: "", id_docente: "" }]);
  };

  // Eliminar grupo-docente del formulario
  const eliminarGrupoDocente = (index) => {
    if (gruposConDocentes.length > 1) {
      setGruposConDocentes(gruposConDocentes.filter((_, i) => i !== index));
    }
  };

  // Actualizar un grupo-docente específico
  const actualizarGrupoDocente = (index, campo, valor) => {
    const nuevosGrupos = [...gruposConDocentes];
    nuevosGrupos[index][campo] = campo === 'codigo_grupo' ? parseInt(valor) || "" : valor;
    setGruposConDocentes(nuevosGrupos);
  };

  // Crear nueva materia
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!codigoMateria || !nombreMateria || !cicloSemestral) {
      alert("Por favor complete todos los campos obligatorios");
      return;
    }

    // Validar que haya al menos un grupo con docente
    const gruposValidos = gruposConDocentes.filter(g => g.codigo_grupo && g.id_docente);
    if (gruposValidos.length === 0) {
      alert("Por favor agregue al menos un grupo con su docente asignado");
      return;
    }

    // Estructura exacta que espera el backend
    const payload = {
      materia: {
        codigo_materia: codigoMateria.toUpperCase(),
        nombre_materia: nombreMateria,
        ciclo_semestral: cicloSemestral
      },
      grupos_con_docentes: gruposValidos
    };

    console.log('📤 Enviando al backend:', JSON.stringify(payload, null, 2));

    try {
      const response = await fetch(API_ENDPOINTS.MATERIAS, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        const data = await response.json();
        console.log('✅ Respuesta del backend:', data);
        
        // Recargar la lista de materias desde el backend
        await cargarMaterias();
        
        alert("✅ Materia creada exitosamente");
        limpiarFormulario();
      } else {
        const errorData = await response.json();
        console.error('❌ Error del servidor:', errorData);
        alert(`❌ Error al crear la materia: ${errorData.message || 'Error desconocido'}`);
      }
    } catch (error) {
      console.error('❌ Error al crear materia:', error);
      alert("❌ Error de conexión al crear la materia");
    }
  };

  // Limpiar formulario
  const limpiarFormulario = () => {
    setCodigoMateria("");
    setNombreMateria("");
    setCicloSemestral("");
    setGruposConDocentes([{ codigo_grupo: "", id_docente: "" }]);
  };

  // Iniciar edición
  const handleEdit = (materia) => {
    setEditingId(materia.id);
    setCodigoMateria(materia.codigo_materia);
    setNombreMateria(materia.nombre_materia);
    setCicloSemestral(materia.ciclo_semestral);
    setGruposConDocentes(materia.grupos_con_docentes.length > 0 
      ? [...materia.grupos_con_docentes] 
      : [{ codigo_grupo: "", id_docente: "" }]
    );
    setIsEditing(true);
    setShowEditModal(true);
  };

  // Guardar edición
  const handleSaveEdit = async (e) => {
    e.preventDefault();
    
    if (!codigoMateria || !nombreMateria || !cicloSemestral) {
      alert("Por favor complete todos los campos obligatorios");
      return;
    }

    const gruposValidos = gruposConDocentes.filter(g => g.codigo_grupo && g.id_docente);
    if (gruposValidos.length === 0) {
      alert("Por favor agregue al menos un grupo con su docente asignado");
      return;
    }

    // Estructura exacta que espera el backend
    const payload = {
      materia: {
        codigo_materia: codigoMateria.toUpperCase(),
        nombre_materia: nombreMateria,
        ciclo_semestral: cicloSemestral
      },
      grupos_con_docentes: gruposValidos
    };

    console.log('📤 Actualizando en backend (ID: ' + editingId + '):', JSON.stringify(payload, null, 2));

    try {
      const response = await fetch(API_ENDPOINTS.MATERIA_BY_ID(editingId), {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        const data = await response.json();
        console.log('✅ Respuesta del backend:', data);
        
        // Recargar la lista de materias desde el backend
        await cargarMaterias();
        
        alert("✅ Materia actualizada exitosamente");
        handleCancelEdit();
      } else {
        const errorData = await response.json();
        console.error('❌ Error del servidor:', errorData);
        alert(`❌ Error al actualizar la materia: ${errorData.message || 'Error desconocido'}`);
      }
    } catch (error) {
      console.error('❌ Error al actualizar materia:', error);
      alert("❌ Error de conexión al actualizar la materia");
    }
  };

  // Cancelar edición
  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditingId(null);
    setShowEditModal(false);
    limpiarFormulario();
  };

  // Eliminar materia
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
          
          // Recargar la lista de materias desde el backend
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

  // Cargar materias al montar el componente
  useEffect(() => {
    cargarMaterias();
  }, []);

  // Función para cargar materias desde el backend
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
      // Si falla, mantener las materias mock
    }
  };

  // Filtrar materias por búsqueda
  const materiasFiltradas = materias.filter(materia =>
    materia.codigo_materia.toLowerCase().includes(searchTerm.toLowerCase()) ||
    materia.nombre_materia.toLowerCase().includes(searchTerm.toLowerCase()) ||
    materia.ciclo_semestral.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header - Igual al dashboard */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <img src={logo} alt="Logo Unicesar" className="w-10 h-auto" />
              <div>
                <h1 className="text-lg font-bold text-gray-900">Expo-software 2025</h1>
                <p className="text-xs text-gray-500">Universidad Popular del Cesar</p>
              </div>
            </div>

            {/* User avatar and logout */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3">
                <span className="text-sm text-gray-700 hidden sm:block">Carlos</span>
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <span className="text-green-600 font-bold text-lg">C</span>
                </div>
              </div>
              
              <button className="text-sm font-medium text-red-600 hover:text-red-700 transition-colors flex items-center gap-2">
                <i className="pi pi-sign-out"></i>
                <span className="hidden sm:inline">Cerrar Sesión</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          
          {/* Sidebar */}
          <aside className="lg:col-span-1">
            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <nav className="space-y-1">
                <Link
                  to="/admin/dash"
                  className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors text-gray-700 hover:bg-gray-50"
                >
                  <i className="pi pi-home text-base"></i>
                  Dashboard
                </Link>
                <Link
                  to="/admin/crear-materia"
                  className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors bg-green-50 text-green-700"
                >
                  <i className="pi pi-book text-base"></i>
                  Crear Materia
                </Link>
                <Link
                  to="/admin/crear-grupo"
                  className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors text-gray-700 hover:bg-gray-50"
                >
                  <i className="pi pi-users text-base"></i>
                  Crear Grupo
                </Link>
                <Link
                  to="/admin/profile"
                  className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors text-gray-700 hover:bg-gray-50"
                >
                  <i className="pi pi-cog text-base"></i>
                  Configuración de Perfil
                </Link>
              </nav>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 p-4 mt-4">
              <div className="text-center">
                <h3 className="font-semibold text-gray-900">Administrador</h3>
                <p className="text-sm text-gray-500">Carlos Mendoza</p>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <main className="lg:col-span-3 space-y-6">
            {/* Formulario de Crear Materia */}
            <div className="bg-white rounded-lg border border-gray-200 p-8">
              {/* Título y descripción */}
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Crear Nueva Materia
                </h2>
                <p className="text-sm text-gray-600">
                  Complete los siguientes campos para añadir una nueva materia al sistema.
                </p>
              </div>

              {/* Formulario */}
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Código de la Materia */}
                  <div>
                    <label 
                      htmlFor="codigoMateria" 
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Código de la Materia <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="codigoMateria"
                      value={codigoMateria}
                      onChange={(e) => setCodigoMateria(e.target.value)}
                      placeholder="Ej: PROG3, BD2, IA1"
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all uppercase"
                      required
                    />
                  </div>

                  {/* Ciclo Semestral */}
                  <div>
                    <label 
                      htmlFor="cicloSemestral" 
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Ciclo Semestral <span className="text-red-500">*</span>
                    </label>
                    <select
                      id="cicloSemestral"
                      value={cicloSemestral}
                      onChange={(e) => setCicloSemestral(e.target.value)}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all appearance-none bg-white cursor-pointer"
                      required
                    >
                      <option value="">Seleccione un ciclo</option>
                      {CICLOS_SEMESTRALES.map((ciclo) => (
                        <option key={ciclo} value={ciclo}>
                          {ciclo}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Nombre de la Materia */}
                <div>
                  <label 
                    htmlFor="nombreMateria" 
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Nombre de la Materia <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="nombreMateria"
                    value={nombreMateria}
                    onChange={(e) => setNombreMateria(e.target.value)}
                    placeholder="Ingrese el nombre completo de la materia"
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                    required
                  />
                </div>

                {/* Grupos con Docentes */}
                <div className="border-t pt-6">
                  <div className="flex items-center justify-between mb-4">
                    <label className="block text-sm font-medium text-gray-700">
                      Grupos y Docentes Asignados <span className="text-red-500">*</span>
                    </label>
                    <button
                      type="button"
                      onClick={agregarGrupoDocente}
                      className="inline-flex items-center px-3 py-1.5 border border-green-600 text-green-600 rounded-lg hover:bg-green-50 transition-colors text-xs font-medium"
                    >
                      <i className="pi pi-plus mr-1.5"></i>
                      Agregar Grupo
                    </button>
                  </div>

                  <div className="space-y-3">
                    {gruposConDocentes.map((grupo, index) => (
                      <div key={index} className="flex gap-3 items-start bg-gray-50 p-4 rounded-lg">
                        <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-3">
                          {/* Código de Grupo */}
                          <div>
                            <label className="block text-xs font-medium text-gray-600 mb-1">
                              Código de Grupo
                            </label>
                            <input
                              type="number"
                              value={grupo.codigo_grupo}
                              onChange={(e) => actualizarGrupoDocente(index, 'codigo_grupo', e.target.value)}
                              placeholder="Ej: 101, 102"
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                              required
                            />
                          </div>

                          {/* Docente Asignado */}
                          <div>
                            <label className="block text-xs font-medium text-gray-600 mb-1">
                              Docente Asignado
                            </label>
                            <select
                              value={grupo.id_docente}
                              onChange={(e) => actualizarGrupoDocente(index, 'id_docente', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500 bg-white"
                              required
                            >
                              <option value="">Seleccione un docente</option>
                              {DOCENTES_MOCK.map((docente) => (
                                <option key={docente.id} value={docente.id}>
                                  {docente.nombre}
                                </option>
                              ))}
                            </select>
                          </div>
                        </div>

                        {/* Botón Eliminar */}
                        {gruposConDocentes.length > 1 && (
                          <button
                            type="button"
                            onClick={() => eliminarGrupoDocente(index)}
                            className="mt-6 p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Eliminar grupo"
                          >
                            <i className="pi pi-trash"></i>
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Botones de acción */}
                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg text-sm font-semibold hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-all"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="flex-1 bg-green-600 text-white px-6 py-3 rounded-lg text-sm font-semibold hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-all shadow-md hover:shadow-lg"
                  >
                    Crear Materia
                  </button>
                </div>
              </form>
            </div>

            {/* Lista de Materias */}
            <div className="bg-white rounded-lg border border-gray-200 p-8">
              {/* Header de la lista */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-1">
                      Lista de Materias
                    </h2>
                    <p className="text-sm text-gray-600">
                      Total de materias registradas: <span className="font-semibold text-green-600">{materias.length}</span>
                    </p>
                  </div>
                </div>

                {/* Buscador */}
                <div className="relative">
                  <i className="pi pi-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
                  <input
                    type="text"
                    placeholder="Buscar materia por nombre o grupo..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Tabla de materias */}
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Código
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Nombre de la Materia
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Ciclo Semestral
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Grupos
                      </th>
                      <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Acciones
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {materiasFiltradas.length === 0 ? (
                      <tr>
                        <td colSpan="5" className="px-6 py-8 text-center">
                          <div className="flex flex-col items-center justify-center">
                            <i className="pi pi-inbox text-4xl text-gray-300 mb-3"></i>
                            <p className="text-gray-500 text-sm">
                              {searchTerm ? "No se encontraron materias con ese criterio de búsqueda" : "No hay materias registradas"}
                            </p>
                          </div>
                        </td>
                      </tr>
                    ) : (
                      materiasFiltradas.map((materia) => (
                        <tr key={materia.id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-bold bg-green-100 text-green-800">
                              {materia.codigo_materia}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-sm font-medium text-gray-900">{materia.nombre_materia}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                              {materia.ciclo_semestral}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex flex-wrap gap-1">
                              {materia.grupos_con_docentes.map((grupo, idx) => (
                                <div key={idx} className="group relative">
                                  <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-blue-100 text-blue-800 cursor-help">
                                    Grupo {grupo.codigo_grupo}
                                  </span>
                                  {/* Tooltip con nombre del docente */}
                                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
                                    {getDocenteNombre(grupo.id_docente)}
                                    <div className="absolute top-full left-1/2 transform -translate-x-1/2 -mt-1">
                                      <div className="border-4 border-transparent border-t-gray-900"></div>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                            <div className="flex items-center justify-center gap-2">
                              <button
                                onClick={() => handleEdit(materia)}
                                className="inline-flex items-center px-3 py-1.5 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors text-xs font-medium"
                                title="Editar materia"
                              >
                                <i className="pi pi-pencil mr-1.5"></i>
                                Editar
                              </button>
                              <button
                                onClick={() => handleDelete(materia.id)}
                                className="inline-flex items-center px-3 py-1.5 border border-red-600 text-red-600 rounded-lg hover:bg-red-50 transition-colors text-xs font-medium"
                                title="Eliminar materia"
                              >
                                <i className="pi pi-trash mr-1.5"></i>
                                Eliminar
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </main>
        </div>
      </div>

      {/* Modal de Edición */}
      {showEditModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl">
            {/* Header del modal */}
            <div className="bg-green-600 px-6 py-4 rounded-t-lg flex items-center justify-between">
              <h3 className="text-xl font-bold text-white">Editar Materia</h3>
              <button 
                onClick={handleCancelEdit}
                className="text-white hover:text-gray-200 transition-colors"
              >
                <i className="pi pi-times text-xl"></i>
              </button>
            </div>

            {/* Contenido del modal */}
            <form onSubmit={handleSaveEdit} className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
              <p className="text-sm text-gray-600">
                Modifique los campos necesarios y guarde los cambios.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Código de la Materia */}
                <div>
                  <label 
                    htmlFor="editCodigoMateria" 
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Código de la Materia <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="editCodigoMateria"
                    value={codigoMateria}
                    onChange={(e) => setCodigoMateria(e.target.value)}
                    placeholder="Ej: PROG3, BD2, IA1"
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all uppercase"
                    required
                  />
                </div>

                {/* Ciclo Semestral */}
                <div>
                  <label 
                    htmlFor="editCicloSemestral" 
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Ciclo Semestral <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="editCicloSemestral"
                    value={cicloSemestral}
                    onChange={(e) => setCicloSemestral(e.target.value)}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all appearance-none bg-white cursor-pointer"
                    required
                  >
                    <option value="">Seleccione un ciclo</option>
                    {CICLOS_SEMESTRALES.map((ciclo) => (
                      <option key={ciclo} value={ciclo}>
                        {ciclo}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Nombre de la Materia */}
              <div>
                <label 
                  htmlFor="editNombreMateria" 
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Nombre de la Materia <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="editNombreMateria"
                  value={nombreMateria}
                  onChange={(e) => setNombreMateria(e.target.value)}
                  placeholder="Ingrese el nombre completo de la materia"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                  required
                />
              </div>

              {/* Grupos con Docentes */}
              <div className="border-t pt-6">
                <div className="flex items-center justify-between mb-4">
                  <label className="block text-sm font-medium text-gray-700">
                    Grupos y Docentes Asignados <span className="text-red-500">*</span>
                  </label>
                  <button
                    type="button"
                    onClick={agregarGrupoDocente}
                    className="inline-flex items-center px-3 py-1.5 border border-green-600 text-green-600 rounded-lg hover:bg-green-50 transition-colors text-xs font-medium"
                  >
                    <i className="pi pi-plus mr-1.5"></i>
                    Agregar Grupo
                  </button>
                </div>

                <div className="space-y-3">
                  {gruposConDocentes.map((grupo, index) => (
                    <div key={index} className="flex gap-3 items-start bg-gray-50 p-4 rounded-lg">
                      <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-3">
                        {/* Código de Grupo */}
                        <div>
                          <label className="block text-xs font-medium text-gray-600 mb-1">
                            Código de Grupo
                          </label>
                          <input
                            type="number"
                            value={grupo.codigo_grupo}
                            onChange={(e) => actualizarGrupoDocente(index, 'codigo_grupo', e.target.value)}
                            placeholder="Ej: 101, 102"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                            required
                          />
                        </div>

                        {/* Docente Asignado */}
                        <div>
                          <label className="block text-xs font-medium text-gray-600 mb-1">
                            Docente Asignado
                          </label>
                          <select
                            value={grupo.id_docente}
                            onChange={(e) => actualizarGrupoDocente(index, 'id_docente', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500 bg-white"
                            required
                          >
                            <option value="">Seleccione un docente</option>
                            {DOCENTES_MOCK.map((docente) => (
                              <option key={docente.id} value={docente.id}>
                                {docente.nombre}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>

                      {/* Botón Eliminar */}
                      {gruposConDocentes.length > 1 && (
                        <button
                          type="button"
                          onClick={() => eliminarGrupoDocente(index)}
                          className="mt-6 p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Eliminar grupo"
                        >
                          <i className="pi pi-trash"></i>
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Botones de acción del modal */}
              <div className="flex gap-3 pt-4 sticky bottom-0 bg-white">
                <button
                  type="button"
                  onClick={handleCancelEdit}
                  className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg text-sm font-semibold hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-all"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-green-600 text-white px-6 py-3 rounded-lg text-sm font-semibold hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-all shadow-md hover:shadow-lg"
                >
                  Guardar Cambios
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
