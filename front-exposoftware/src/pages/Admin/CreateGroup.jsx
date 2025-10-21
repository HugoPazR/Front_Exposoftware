import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import logo from "../../assets/Logo-unicesar.png";
import { API_ENDPOINTS } from "../../utils/constants";

// Mock data inicial de grupos
const GRUPOS_INICIAL = [
  { id: "grp1", codigo_grupo: 101, codigo_materia: "PROG3", fechaCreacion: "2025-01-15" },
  { id: "grp2", codigo_grupo: 202, codigo_materia: "BD2", fechaCreacion: "2025-01-20" },
];

// Mock data de materias disponibles (esto vendría del backend)
const MATERIAS_MOCK = [
  { codigo_materia: "PROG3", nombre_materia: "Programación III" },
  { codigo_materia: "BD2", nombre_materia: "Bases de Datos II" },
  { codigo_materia: "WEB1", nombre_materia: "Desarrollo Web I" },
  { codigo_materia: "IA1", nombre_materia: "Inteligencia Artificial I" },
  { codigo_materia: "SO1", nombre_materia: "Sistemas Operativos" },
];

export default function CreateGroup() {
  // Estados para el formulario
  const [codigoGrupo, setCodigoGrupo] = useState("");
  const [codigoMateria, setCodigoMateria] = useState("");
  
  // Estado para la lista de grupos
  const [grupos, setGrupos] = useState(GRUPOS_INICIAL);
  
  // Estados para edición
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  
  // Estado para búsqueda/filtro
  const [searchTerm, setSearchTerm] = useState("");

  // Cargar grupos al montar el componente
  useEffect(() => {
    cargarGrupos();
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

  // Obtener nombre de materia por código
  const getMateriaNombre = (codigoMateria) => {
    const materia = MATERIAS_MOCK.find(m => m.codigo_materia === codigoMateria);
    return materia ? materia.nombre_materia : codigoMateria;
  };

  // Crear nuevo grupo
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!codigoGrupo || !codigoMateria) {
      alert("Por favor complete todos los campos obligatorios");
      return;
    }

    // Estructura exacta que espera el backend
    const payload = {
      codigo_grupo: parseInt(codigoGrupo),
      codigo_materia: codigoMateria
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
    setCodigoMateria("");
  };

  // Iniciar edición
  const handleEdit = (grupo) => {
    setEditingId(grupo.id);
    setCodigoGrupo(grupo.codigo_grupo.toString());
    setCodigoMateria(grupo.codigo_materia);
    setIsEditing(true);
    setShowEditModal(true);
  };

  // Guardar edición
  const handleSaveEdit = async (e) => {
    e.preventDefault();
    
    if (!codigoGrupo || !codigoMateria) {
      alert("Por favor complete todos los campos obligatorios");
      return;
    }

    const payload = {
      codigo_grupo: parseInt(codigoGrupo),
      codigo_materia: codigoMateria
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
    grupo.codigo_materia.toLowerCase().includes(searchTerm.toLowerCase()) ||
    getMateriaNombre(grupo.codigo_materia).toLowerCase().includes(searchTerm.toLowerCase())
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
                  className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors text-gray-700 hover:bg-gray-50"
                >
                  <i className="pi pi-book text-base"></i>
                  Crear Materia
                </Link>
                <Link
                  to="/admin/crear-grupo"
                  className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors bg-green-50 text-green-700"
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

                {/* Código de Materia */}
                <div>
                  <label 
                    htmlFor="codigoMateria" 
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Materia <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="codigoMateria"
                    value={codigoMateria}
                    onChange={(e) => setCodigoMateria(e.target.value)}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all appearance-none bg-white cursor-pointer"
                    required
                  >
                    <option value="">Selecciona una materia</option>
                    {MATERIAS_MOCK.map((materia) => (
                      <option key={materia.codigo_materia} value={materia.codigo_materia}>
                        {materia.codigo_materia} - {materia.nombre_materia}
                      </option>
                    ))}
                  </select>
                  <p className="mt-1 text-xs text-gray-500">Materia a la que pertenece el grupo</p>
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
                          Código Materia
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Nombre Materia
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
                              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                                {grupo.codigo_materia}
                              </span>
                            </td>
                            <td className="px-6 py-4">
                              <div className="text-sm text-gray-900">{getMateriaNombre(grupo.codigo_materia)}</div>
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

              {/* Código de Materia */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Materia <span className="text-red-500">*</span>
                </label>
                <select
                  value={codigoMateria}
                  onChange={(e) => setCodigoMateria(e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
                  required
                >
                  <option value="">Seleccionar materia</option>
                  {MATERIAS_MOCK.map((materia) => (
                    <option key={materia.codigo_materia} value={materia.codigo_materia}>
                      {materia.codigo_materia} - {materia.nombre_materia}
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
