import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import logo from "../../assets/Logo-unicesar.png";
import AdminSidebar from "../../components/Layout/AdminSidebar";
import { API_ENDPOINTS } from "../../utils/constants";

// Mock data inicial de grupos
const GRUPOS_INICIAL = [
  { id: "grp1", codigo_grupo: 101, id_docente: 1, fechaCreacion: "2025-01-15" },
  { id: "grp2", codigo_grupo: 202, id_docente: 2, fechaCreacion: "2025-01-20" },
];

// Mock data de profesores disponibles (esto vendrá del backend)
const PROFESORES_MOCK = [
  { id: 1, nombre: "Dr. Alejandro José Meriño", departamento: "Ingeniería de Software" },
  { id: 2, nombre: "Ing. Sofía Benítez", departamento: "Redes de Computadoras" },
  { id: 3, nombre: "Lic. Carla Ruíz", departamento: "Inteligencia Artificial" },
  { id: 4, nombre: "Dr. Fernando Vargas", departamento: "Sistemas Operativos" },
  { id: 5, nombre: "Ing. María González", departamento: "Bases de Datos" },
  { id: 6, nombre: "Dr. Juan Pérez", departamento: "Desarrollo Web" },
];

export default function CreateGroup() {
  // Estados para el formulario
  const [codigoGrupo, setCodigoGrupo] = useState("");
  const [idDocente, setIdDocente] = useState("");
  
  // Estado para la lista de grupos y profesores
  const [grupos, setGrupos] = useState(GRUPOS_INICIAL);
  const [profesores, setProfesores] = useState(PROFESORES_MOCK);
  
  // Estados para edición
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState(null);
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
    
    if (!codigoGrupo || !idDocente) {
      alert("Por favor complete todos los campos obligatorios");
      return;
    }

    // Estructura exacta que espera el backend
    const payload = {
      codigo_grupo: parseInt(codigoGrupo),
      id_docente: parseInt(idDocente)
    };

    console.log('📤 Enviando al backend:', JSON.stringify(payload, null, 2));

    try {
      const response = await fetch(API_ENDPOINTS.GRUPOS, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        const data = await response.json();
        console.log('✅ Respuesta del backend:', data);
        
        await cargarGrupos();
        alert("✅ Grupo creado exitosamente");
        limpiarFormulario();
      } else {
        const errorData = await response.json();
        console.error('❌ Error del servidor:', errorData);
        alert(`❌ Error al crear el grupo: ${errorData.message || 'Error desconocido'}`);
      }
    } catch (error) {
      console.error('❌ Error al crear grupo:', error);
      alert("❌ Error de conexión al crear el grupo");
    }
  };

  // Limpiar formulario
  const limpiarFormulario = () => {
    setCodigoGrupo("");
    setIdDocente("");
  };

  // Iniciar edición
  const handleEdit = (grupo) => {
    setEditingId(grupo.id);
    setCodigoGrupo(grupo.codigo_grupo.toString());
    setIdDocente(grupo.id_docente.toString());
    setIsEditing(true);
    setShowEditModal(true);
  };

  // Guardar edición
  const handleSaveEdit = async (e) => {
    e.preventDefault();
    
    if (!codigoGrupo || !idDocente) {
      alert("Por favor complete todos los campos obligatorios");
      return;
    }

    const payload = {
      codigo_grupo: parseInt(codigoGrupo),
      id_docente: parseInt(idDocente)
    };

    console.log('📤 Actualizando en backend (ID: ' + editingId + '):', JSON.stringify(payload, null, 2));

    try {
      const response = await fetch(API_ENDPOINTS.GRUPO_BY_ID(editingId), {
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
      } else {
        const errorData = await response.json();
        console.error('❌ Error del servidor:', errorData);
        alert(`❌ Error al actualizar el grupo: ${errorData.message || 'Error desconocido'}`);
      }
    } catch (error) {
      console.error('❌ Error al actualizar grupo:', error);
      alert("❌ Error de conexión al actualizar el grupo");
    }
  };

  // Cancelar edición
  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditingId(null);
    setShowEditModal(false);
    limpiarFormulario();
  };

  // Eliminar grupo
  const handleDelete = async (id) => {
    const grupoAEliminar = grupos.find(g => g.id === id);
    
    if (window.confirm(`¿Está seguro de que desea eliminar el Grupo ${grupoAEliminar?.codigo_grupo}?`)) {
      console.log('🗑️ Eliminando del backend - ID:', id);
      console.log('📋 Grupo a eliminar:', grupoAEliminar?.codigo_grupo);
      
      try {
        const response = await fetch(API_ENDPOINTS.GRUPO_BY_ID(id), { 
          method: 'DELETE' 
        });
        
        if (response.ok) {
          console.log('✅ Grupo eliminado del backend');
          await cargarGrupos();
          alert("✅ Grupo eliminado exitosamente");
        } else {
          const errorData = await response.json();
          console.error('❌ Error del servidor:', errorData);
          alert(`❌ Error al eliminar el grupo: ${errorData.message || 'Error desconocido'}`);
        }
      } catch (error) {
        console.error('❌ Error al eliminar grupo:', error);
        alert("❌ Error de conexión al eliminar el grupo");
      }
    }
  };

  const handleCancel = () => {
    limpiarFormulario();
  };

  // Filtrar grupos por búsqueda
  const gruposFiltrados = grupos.filter(grupo =>
    grupo.codigo_grupo.toString().includes(searchTerm) ||
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
                {/* Código del Grupo */}
                <div>
                  <label 
                    htmlFor="codigoGrupo" 
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Código del Grupo <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    id="codigoGrupo"
                    value={codigoGrupo}
                    onChange={(e) => setCodigoGrupo(e.target.value)}
                    placeholder="Ej: 101, 202, 303"
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                    required
                    min="1"
                  />
                  <p className="mt-1 text-xs text-gray-500">Número único que identifica el grupo</p>
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
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all appearance-none bg-white cursor-pointer"
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
                    className="w-full bg-green-600 text-white px-6 py-3 rounded-lg text-sm font-semibold hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-all shadow-md hover:shadow-lg"
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
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-green-500 focus:border-transparent"
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
                          Código Grupo
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          ID Docente
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Profesor Asignado
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Fecha Creación
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
                          <tr key={grupo.id} className="hover:bg-gray-50 transition">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                                {grupo.codigo_grupo}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800">
                                {grupo.id_docente}
                              </span>
                            </td>
                            <td className="px-6 py-4">
                              <div className="text-sm text-gray-900">{getProfesorNombre(grupo.id_docente)}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-500">{grupo.fechaCreacion || 'N/A'}</div>
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
                                  onClick={() => handleDelete(grupo.id)}
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
              {/* Código del Grupo */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Código del Grupo <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  value={codigoGrupo}
                  onChange={(e) => setCodigoGrupo(e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
                  placeholder="Ej: 101, 202, 303"
                  required
                  min="1"
                />
              </div>

              {/* Asignar Profesor */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Asignar Profesor <span className="text-red-500">*</span>
                </label>
                <select
                  value={idDocente}
                  onChange={(e) => setIdDocente(e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
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
                  className="px-6 py-2.5 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 transition"
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
