import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import logo from "../../assets/Logo-unicesar.png";
import AdminSidebar from "../../components/Layout/AdminSidebar";
import { API_ENDPOINTS } from "../../utils/constants";

// Mock data inicial de grupos
const GRUPOS_INICIAL = [
  { 
    codigo_grupo: "L7Tz5A23fWx19oK9jK1a", 
    nombre_grupo: "Grupo 01", 
    id_docente: "BU7rpAz6Nbn9DKq517wb",
    fecha_creacion: "12/05/2025",
    fecha_modificacion: "12/05/2025"
  },
  { 
    codigo_grupo: "X3Kp9B47mNr82pL5fT6z", 
    nombre_grupo: "Grupo 02", 
    id_docente: "TEElkzBShoDC6beuFjHE",
    fecha_creacion: "15/05/2025",
    fecha_modificacion: "15/05/2025"
  },
];

// Mock data de profesores disponibles (esto vendrá del backend)
const PROFESORES_MOCK = [
  { id: "BU7rpAz6Nbn9DKq517wb", nombre: "Dr. Alejandro José Meriño", departamento: "Ingeniería de Software" },
  { id: "TEElkzBShoDC6beuFjHE", nombre: "Ing. Sofía Benítez", departamento: "Redes de Computadoras" },
  { id: "P9Qm3Z8yRfK21sN4xL7w", nombre: "Lic. Carla Ruíz", departamento: "Inteligencia Artificial" },
  { id: "A5Vh2T6kMpD93jB8xC4q", nombre: "Dr. Fernando Vargas", departamento: "Sistemas Operativos" },
  { id: "W7Jn4F9cLsX62oP5yR3m", nombre: "Ing. María González", departamento: "Bases de Datos" },
  { id: "E8Kp1G6vNrT45hM9zQ2s", nombre: "Dr. Juan Pérez", departamento: "Desarrollo Web" },
];

export default function CreateGroup() {
  // Estados para el formulario
  const [nombreGrupo, setNombreGrupo] = useState("");
  const [idDocente, setIdDocente] = useState("");
  
  // Estado para la lista de grupos y profesores
  const [grupos, setGrupos] = useState(GRUPOS_INICIAL);
  const [profesores, setProfesores] = useState(PROFESORES_MOCK);
  
  // Estados para edición
  const [isEditing, setIsEditing] = useState(false);
  const [editingCodigoGrupo, setEditingCodigoGrupo] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  
  // Estado para búsqueda/filtro
  const [searchTerm, setSearchTerm] = useState("");

  // Cargar grupos y profesores al montar el componente
  useEffect(() => {
    cargarGrupos();
    cargarProfesores();
  }, []);

  // Función para cargar grupos desde el backend
  const cargarGrupos = async () => {
    try {
      const response = await fetch(API_ENDPOINTS.GRUPOS);
      if (response.ok) {
        const data = await response.json();
        setGrupos(data);
        console.log('📥 Grupos cargados:', data.length);
      } else {
        console.error('❌ Error al cargar grupos:', response.statusText);
      }
    } catch (error) {
      console.error('❌ Error de conexión al cargar grupos:', error);
      console.log('⚠️ Usando datos mock locales');
    }
  };

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
      console.log('⚠️ Usando datos mock de profesores');
    }
  };

  // Obtener nombre de profesor por ID
  const getProfesorNombre = (idDocente) => {
    const profesor = profesores.find(p => p.id === idDocente);
    return profesor ? profesor.nombre : 'Sin asignar';
  };

  // Crear nuevo grupo
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!nombreGrupo || !idDocente) {
      alert("Por favor complete todos los campos obligatorios");
      return;
    }

    // Validar longitud del nombre
    if (nombreGrupo.length > 10) {
      alert("El nombre del grupo no puede exceder 10 caracteres");
      return;
    }

    // Estructura exacta que espera el backend
    // codigo_grupo se genera automáticamente en Firebase
    // fecha_creacion y fecha_modificacion se asignan automáticamente
    const payload = {
      nombre_grupo: nombreGrupo,
      id_docente: idDocente
    };

    console.log('📤 Enviando al backend:', JSON.stringify(payload, null, 2));

    try {
      const response = await fetch(API_ENDPOINTS.GRUPOS, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      // Manejo específico de códigos de estado HTTP
      if (response.status === 201) {
        // 201: Recurso creado exitosamente
        const data = await response.json();
        console.log('✅ Respuesta del backend:', data);
        
        await cargarGrupos();
        alert("✅ Grupo creado exitosamente");
        limpiarFormulario();
      } else if (response.status === 400) {
        const errorData = await response.json().catch(() => ({}));
        console.error('❌ Solicitud incorrecta:', errorData);
        alert(`❌ Solicitud incorrecta: ${errorData.message || errorData.detail || 'Verifique los datos ingresados'}`);
      } else if (response.status === 401) {
        const errorData = await response.json().catch(() => ({}));
        console.error('❌ No autorizado:', errorData);
        alert(`❌ No autorizado: ${errorData.message || errorData.detail || 'Debe iniciar sesión'}`);
      } else if (response.status === 403) {
        const errorData = await response.json().catch(() => ({}));
        console.error('❌ Sin permisos:', errorData);
        alert(`❌ Sin permisos: ${errorData.message || errorData.detail || 'No tiene permisos para crear grupos'}`);
      } else if (response.status === 409) {
        const errorData = await response.json().catch(() => ({}));
        console.error('❌ Conflicto:', errorData);
        alert(`❌ Conflicto: ${errorData.message || errorData.detail || 'El grupo ya existe'}`);
      } else if (response.status === 422) {
        const errorData = await response.json().catch(() => ({}));
        console.error('❌ Error de validación:', errorData);
        alert(`❌ Error de validación: ${errorData.message || errorData.detail || 'Los datos no son válidos'}`);
      } else {
        const errorData = await response.json().catch(() => ({}));
        console.error('❌ Error del servidor:', errorData);
        alert(`❌ Error al crear el grupo (${response.status}): ${errorData.message || errorData.detail || 'Error desconocido'}`);
      }
    } catch (error) {
      console.error('❌ Error al crear grupo:', error);
      alert("❌ Error de conexión al crear el grupo. Verifique su conexión a internet.");
    }
  };

  // Limpiar formulario
  const limpiarFormulario = () => {
    setNombreGrupo("");
    setIdDocente("");
  };

  // Iniciar edición
  const handleEdit = (grupo) => {
    setEditingCodigoGrupo(grupo.codigo_grupo); // Firebase ID
    setNombreGrupo(grupo.nombre_grupo);
    setIdDocente(grupo.id_docente);
    setIsEditing(true);
    setShowEditModal(true);
  };

  // Guardar edición
  const handleSaveEdit = async (e) => {
    e.preventDefault();
    
    if (!nombreGrupo || !idDocente) {
      alert("Por favor complete todos los campos obligatorios");
      return;
    }

    // Validar longitud del nombre
    if (nombreGrupo.length > 10) {
      alert("El nombre del grupo no puede exceder 10 caracteres");
      return;
    }

    // fecha_modificacion se actualiza automáticamente en el backend
    const payload = {
      nombre_grupo: nombreGrupo,
      id_docente: idDocente
    };

    console.log('📤 Actualizando en backend (codigo_grupo: ' + editingCodigoGrupo + '):', JSON.stringify(payload, null, 2));

    try {
      const response = await fetch(API_ENDPOINTS.GRUPO_BY_ID(editingCodigoGrupo), {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        const data = await response.json();
        console.log('✅ Respuesta del backend:', data);
        
        await cargarGrupos();
        alert("✅ Grupo actualizado exitosamente");
        handleCancelEdit();
      } else if (response.status === 400) {
        const errorData = await response.json().catch(() => ({}));
        console.error('❌ Solicitud incorrecta:', errorData);
        alert(`❌ Solicitud incorrecta: ${errorData.message || errorData.detail || 'Verifique los datos'}`);
      } else if (response.status === 401) {
        const errorData = await response.json().catch(() => ({}));
        console.error('❌ No autorizado:', errorData);
        alert(`❌ No autorizado: ${errorData.message || errorData.detail || 'Debe iniciar sesión'}`);
      } else if (response.status === 403) {
        const errorData = await response.json().catch(() => ({}));
        console.error('❌ Sin permisos:', errorData);
        alert(`❌ Sin permisos: ${errorData.message || errorData.detail || 'No tiene permisos para editar grupos'}`);
      } else if (response.status === 404) {
        const errorData = await response.json().catch(() => ({}));
        console.error('❌ No encontrado:', errorData);
        alert(`❌ No encontrado: ${errorData.message || errorData.detail || 'El grupo no existe'}`);
      } else if (response.status === 422) {
        const errorData = await response.json().catch(() => ({}));
        console.error('❌ Error de validación:', errorData);
        alert(`❌ Error de validación: ${errorData.message || errorData.detail || 'Los datos no son válidos'}`);
      } else {
        const errorData = await response.json().catch(() => ({}));
        console.error('❌ Error del servidor:', errorData);
        alert(`❌ Error al actualizar el grupo (${response.status}): ${errorData.message || errorData.detail || 'Error desconocido'}`);
      }
    } catch (error) {
      console.error('❌ Error al actualizar grupo:', error);
      alert("❌ Error de conexión al actualizar el grupo. Verifique su conexión a internet.");
    }
  };

  // Cancelar edición
  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditingCodigoGrupo(null);
    setShowEditModal(false);
    limpiarFormulario();
  };

  // Eliminar grupo
  const handleDelete = async (codigoGrupo) => {
    const grupoAEliminar = grupos.find(g => g.codigo_grupo === codigoGrupo);
    
    if (window.confirm(`¿Está seguro de que desea eliminar el ${grupoAEliminar?.nombre_grupo}?`)) {
      console.log('🗑️ Eliminando del backend - codigo_grupo:', codigoGrupo);
      console.log('📋 Grupo a eliminar:', grupoAEliminar?.nombre_grupo);
      
      try {
        const response = await fetch(API_ENDPOINTS.GRUPO_BY_ID(codigoGrupo), { 
          method: 'DELETE' 
        });
        
        if (response.ok) {
          console.log('✅ Grupo eliminado del backend');
          await cargarGrupos();
          alert("✅ Grupo eliminado exitosamente");
        } else if (response.status === 401) {
          const errorData = await response.json().catch(() => ({}));
          console.error('❌ No autorizado:', errorData);
          alert(`❌ No autorizado: ${errorData.message || errorData.detail || 'Debe iniciar sesión'}`);
        } else if (response.status === 403) {
          const errorData = await response.json().catch(() => ({}));
          console.error('❌ Sin permisos:', errorData);
          alert(`❌ Sin permisos: ${errorData.message || errorData.detail || 'No tiene permisos para eliminar grupos'}`);
        } else if (response.status === 404) {
          const errorData = await response.json().catch(() => ({}));
          console.error('❌ No encontrado:', errorData);
          alert(`❌ No encontrado: ${errorData.message || errorData.detail || 'El grupo no existe'}`);
        } else {
          const errorData = await response.json().catch(() => ({}));
          console.error('❌ Error del servidor:', errorData);
          alert(`❌ Error al eliminar el grupo (${response.status}): ${errorData.message || errorData.detail || 'Error desconocido'}`);
        }
      } catch (error) {
        console.error('❌ Error al eliminar grupo:', error);
        alert("❌ Error de conexión al eliminar el grupo. Verifique su conexión a internet.");
      }
    }
  };

  const handleCancel = () => {
    limpiarFormulario();
  };

  // Filtrar grupos por búsqueda
  const gruposFiltrados = grupos.filter(grupo =>
    grupo.nombre_grupo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    getProfesorNombre(grupo.id_docente).toLowerCase().includes(searchTerm.toLowerCase())
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
                <div className="w-10 h-10 bg-teal-100 rounded-full flex items-center justify-center">
                  <span className="text-teal-600 font-bold text-lg">C</span>
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
          
          {/* Sidebar Component */}
          <AdminSidebar userName="Carlos Mendoza" userRole="Administrador" />

          {/* Main Content */}
          <main className="lg:col-span-3">
            <div className="bg-white rounded-lg border border-gray-200 p-8">
              {/* Título y descripción */}
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Crear Nuevo Grupo
                </h2>
                <p className="text-sm text-gray-600">
                  Ingresa el código del grupo y la materia asociada.
                </p>
              </div>

              {/* Formulario */}
              <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
                {/* Nombre del Grupo */}
                <div>
                  <label 
                    htmlFor="nombreGrupo" 
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Nombre del Grupo <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="nombreGrupo"
                    value={nombreGrupo}
                    onChange={(e) => setNombreGrupo(e.target.value)}
                    placeholder="Ej: Grupo 01, Grupo 02"
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                    required
                    maxLength="10"
                  />
                  <p className="mt-1 text-xs text-gray-500">Nombre descriptivo del grupo (máx. 10 caracteres). El código único se genera automáticamente.</p>
                </div>

                {/* Asignar Profesor */}
                <div>
                  <label 
                    htmlFor="idDocente" 
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Asignar Profesor <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="idDocente"
                    value={idDocente}
                    onChange={(e) => setIdDocente(e.target.value)}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all appearance-none bg-white cursor-pointer"
                    required
                  >
                    <option value="">Selecciona un profesor</option>
                    {profesores.map((profesor) => (
                      <option key={profesor.id} value={profesor.id}>
                        {profesor.nombre} - {profesor.departamento}
                      </option>
                    ))}
                  </select>
                  <p className="mt-1 text-xs text-gray-500">Profesor responsable del grupo</p>
                </div>

                {/* Botón de envío */}
                <div className="pt-4">
                  <button
                    type="submit"
                    className="w-full bg-teal-600 text-white px-6 py-3 rounded-lg text-sm font-semibold hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 transition-all shadow-md hover:shadow-lg"
                  >
                    Crear Grupo
                  </button>
                </div>
              </form>

              {/* Tabla de Grupos Registrados */}
              <div className="mt-12 pt-8 border-t border-gray-200">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">Grupos Registrados</h3>
                    <p className="text-sm text-gray-500 mt-1">
                      {gruposFiltrados.length} {gruposFiltrados.length === 1 ? 'grupo' : 'grupos'} encontrados
                    </p>
                  </div>
                  
                  {/* Barra de búsqueda */}
                  <div className="relative w-64">
                    <input
                      type="text"
                      placeholder="Buscar grupos..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    />
                    <i className="pi pi-search absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"></i>
                  </div>
                </div>

                {/* Tabla */}
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Nombre Grupo
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Profesor Asignado
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Fecha Creación
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Última Modificación
                        </th>
                        <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Acciones
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {gruposFiltrados.length === 0 ? (
                        <tr>
                          <td colSpan="5" className="px-6 py-12 text-center text-gray-500">
                            <i className="pi pi-inbox text-4xl mb-3 block"></i>
                            <p className="text-sm">No se encontraron grupos</p>
                          </td>
                        </tr>
                      ) : (
                        gruposFiltrados.map((grupo) => (
                          <tr key={grupo.codigo_grupo} className="hover:bg-gray-50 transition">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex flex-col">
                                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-teal-100 text-teal-800 w-fit">
                                  {grupo.nombre_grupo}
                                </span>
                                <span className="text-xs text-gray-400 mt-1" title={grupo.codigo_grupo}>
                                  ID: {grupo.codigo_grupo.substring(0, 8)}...
                                </span>
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <div className="text-sm text-gray-900">{getProfesorNombre(grupo.id_docente)}</div>
                              <div className="text-xs text-gray-400 mt-1" title={grupo.id_docente}>
                                ID: {grupo.id_docente.substring(0, 8)}...
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-500">{grupo.fecha_creacion || 'N/A'}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-500">{grupo.fecha_modificacion || 'N/A'}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-center">
                              <div className="flex items-center justify-center gap-2">
                                <button
                                  onClick={() => handleEdit(grupo)}
                                  className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                                  title="Editar"
                                >
                                  <i className="pi pi-pencil"></i>
                                </button>
                                <button
                                  onClick={() => handleDelete(grupo.codigo_grupo)}
                                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                                  title="Eliminar"
                                >
                                  <i className="pi pi-trash"></i>
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
            </div>
          </main>
        </div>
      </div>

      {/* Modal de Edición */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-xl font-bold text-gray-900">Editar Grupo</h3>
            </div>
            
            <form onSubmit={handleSaveEdit} className="p-6 space-y-6">
              {/* Código del Grupo (No editable - ID de Firebase) */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Código del Grupo (ID único)
                </label>
                <input
                  type="text"
                  value={editingCodigoGrupo || ''}
                  disabled
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg bg-gray-100 text-gray-500 cursor-not-allowed"
                  placeholder="Generado automáticamente por Firebase"
                />
                <p className="mt-1 text-xs text-gray-500">Este código se genera automáticamente y no puede modificarse</p>
              </div>

              {/* Nombre del Grupo */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nombre del Grupo <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={nombreGrupo}
                  onChange={(e) => setNombreGrupo(e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition"
                  placeholder="Ej: Grupo 01, Grupo 02"
                  required
                  maxLength="10"
                />
                <p className="mt-1 text-xs text-gray-500">Máximo 10 caracteres</p>
              </div>

              {/* Asignar Profesor */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Asignar Profesor <span className="text-red-500">*</span>
                </label>
                <select
                  value={idDocente}
                  onChange={(e) => setIdDocente(e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition"
                  required
                >
                  <option value="">Seleccionar profesor</option>
                  {profesores.map((profesor) => (
                    <option key={profesor.id} value={profesor.id}>
                      {profesor.nombre} - {profesor.departamento}
                    </option>
                  ))}
                </select>
              </div>

              {/* Botones del Modal */}
              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={handleCancelEdit}
                  className="px-6 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 text-sm font-medium text-white bg-teal-600 rounded-lg hover:bg-teal-700 transition"
                >
                  💾 Guardar Cambios
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
