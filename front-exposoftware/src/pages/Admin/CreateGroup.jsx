import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../../assets/Logo-unicesar.png";
import AdminSidebar from "../../components/Layout/AdminSidebar";
import * as AuthService from "../../Services/AuthService";
import {
  obtenerGrupos,
  obtenerProfesores,
  crearGrupo,
  actualizarGrupo,
  eliminarGrupo,
  obtenerNombreProfesor,
  filtrarGrupos
} from "../../Services/CreateGroup";

export default function CreateGroup() {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  
  // Cargar datos del usuario autenticado
  useEffect(() => {
    const user = AuthService.getUserData();
    if (user) {
      setUserData(user);
    }
  }, []);

  // Obtener nombre del usuario
  const getUserName = () => {
    if (!userData) return 'Usuario';
    return userData.nombre || userData.nombres || userData.correo?.split('@')[0] || 'Usuario';
  };

  const getUserInitials = () => {
    const name = getUserName();
    return name.charAt(0).toUpperCase();
  };
  
  // Estado para tabs
  const [activeTab, setActiveTab] = useState("crear"); // crear | editar

  // Función para cerrar sesión
  const handleLogout = async () => {
    if (window.confirm('¿Está seguro de que desea cerrar sesión?')) {
      try {
        await AuthService.logout();
        console.log('✅ Sesión cerrada exitosamente');
        navigate('/login');
      } catch (error) {
        console.error('❌ Error al cerrar sesión:', error);
        navigate('/login');
      }
    }
  };

  // Estados para el formulario
  const [codigoGrupo, setCodigoGrupo] = useState("");
  const [idDocente, setIdDocente] = useState("");
  
  // Estado para la lista de grupos y profesores
  const [grupos, setGrupos] = useState([]);
  const [profesores, setProfesores] = useState([]);
  
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

  // Función para cargar grupos desde el backend usando el servicio
  const cargarGrupos = async () => {
    try {
      console.log('🔄 Iniciando carga de grupos...');
      const data = await obtenerGrupos();
      console.log('✅ Grupos cargados exitosamente:', data);
      setGrupos(data);
    } catch (error) {
      console.error('❌ Error al cargar grupos:', error);
      // No mostrar alert para no bloquear la UI
      setGrupos([]);
    }
  };

  // Función para cargar profesores desde el backend usando el servicio
  const cargarProfesores = async () => {
    try {
      console.log('🔄 Iniciando carga de profesores...');
      const data = await obtenerProfesores();
      console.log('✅ Profesores cargados exitosamente:', data);
      
      // 🔍 DEBUG: Ver estructura del primer profesor
      if (data && data.length > 0) {
        console.log('🔍 ESTRUCTURA DEL PRIMER PROFESOR:', data[0]);
        console.log('🔍 CLAVES DISPONIBLES:', Object.keys(data[0]));
        console.log('🔍 ID del profesor:', data[0].id);
        console.log('🔍 ¿Tiene usuario anidado?', data[0].usuario ? 'SÍ' : 'NO');
        if (data[0].usuario) {
          console.log('🔍 Claves de usuario:', Object.keys(data[0].usuario));
        }
      }
      
      setProfesores(data);
    } catch (error) {
      console.error('❌ Error al cargar profesores:', error);
      // No mostrar alert para no bloquear la UI
      setProfesores([]);
    }
  };

  // Crear nuevo grupo usando el servicio
  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log('📝 Iniciando creación de grupo...');
    console.log('📋 Valores del formulario:');
    console.log('   - codigo_grupo:', codigoGrupo, typeof codigoGrupo);
    console.log('   - id_docente:', idDocente, typeof idDocente);
    
    // 🔍 DEBUG: Buscar el profesor seleccionado en el array
    const profesorSeleccionado = profesores.find(p => 
      p?.id_docente === idDocente 
      || p?.id === idDocente 
      || p?.identificacion === idDocente
    );
    console.log('🔍 Profesor seleccionado del array:', profesorSeleccionado);
    
    if (profesorSeleccionado) {
      console.log('✅ Profesor encontrado:');
      console.log('   - id_docente:', profesorSeleccionado.id_docente);
      console.log('   - categoria_docente:', profesorSeleccionado.categoria_docente);
      console.log('   - Objeto completo:', profesorSeleccionado);
    } else {
      console.warn('⚠️ No se encontró el profesor en el array con ID:', idDocente);
    }
    
    // Validar que se haya seleccionado un profesor válido
    if (!idDocente || idDocente === '' || idDocente.startsWith('temp_')) {
      alert('❌ Error: Debe seleccionar un profesor válido');
      console.error('❌ ID de docente inválido:', idDocente);
      return;
    }

    try {
      const resultado = await crearGrupo(codigoGrupo, idDocente);
      console.log('✅ Grupo creado, recargando lista...');
      await cargarGrupos();
      alert("✅ Grupo creado exitosamente\n\nEl grupo ha sido registrado en el sistema.");
      limpiarFormulario();
    } catch (error) {
      console.error('❌ Error en handleSubmit:', error);
      alert(`❌ Error al crear el grupo:\n\n${error.message}`);
    }
  };

  // Limpiar formulario
  const limpiarFormulario = () => {
    setCodigoGrupo("");
    setIdDocente("");
  };

  // Iniciar edición
  const handleEdit = (grupo) => {
    setEditingCodigoGrupo(grupo.codigo_grupo);
    setCodigoGrupo(grupo.codigo_grupo.toString());
    // Obtener el primer docente asignado si existe
    if (grupo.docentes_asignados && grupo.docentes_asignados.length > 0) {
      setIdDocente(grupo.docentes_asignados[0].id || "");
    } else {
      setIdDocente("");
    }
    setIsEditing(true);
    setShowEditModal(true);
  };

  // Guardar edición usando el servicio
  const handleSaveEdit = async (e) => {
    e.preventDefault();

    try {
      await actualizarGrupo(editingCodigoGrupo, codigoGrupo, idDocente);
      await cargarGrupos();
      alert("✅ Grupo actualizado exitosamente");
      handleCancelEdit();
    } catch (error) {
      alert(`❌ ${error.message}`);
    }
  };

  // Cancelar edición
  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditingCodigoGrupo(null);
    setShowEditModal(false);
    limpiarFormulario();
  };

  // Eliminar grupo usando el servicio
  const handleDelete = async (codigoGrupo) => {
    const grupoAEliminar = grupos.find(g => g.codigo_grupo === codigoGrupo);
    
    if (window.confirm(`¿Está seguro de que desea eliminar el ${grupoAEliminar?.nombre_grupo}?`)) {
      try {
        await eliminarGrupo(codigoGrupo);
        await cargarGrupos();
        alert("✅ Grupo eliminado exitosamente");
      } catch (error) {
        alert(`❌ ${error.message}`);
      }
    }
  };

  const handleCancel = () => {
    limpiarFormulario();
  };

  // Filtrar grupos por búsqueda usando el servicio
  const gruposFiltrados = filtrarGrupos(grupos, searchTerm, profesores);

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
                <span className="text-sm text-gray-700 hidden sm:block">{getUserName()}</span>
                <div className="w-10 h-10 bg-teal-100 rounded-full flex items-center justify-center">
                  <span className="text-teal-600 font-bold text-lg">{getUserInitials()}</span>
                </div>
              </div>
              
              <button 
                onClick={handleLogout}
                className="text-sm font-medium text-red-600 hover:text-red-700 transition-colors flex items-center gap-2"
              >
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
          <AdminSidebar userName={getUserName()} userRole="Administrador" />

          {/* Main Content */}
          <main className="lg:col-span-3">
            {/* Tabs de navegación */}
            <div className="bg-white rounded-lg border border-gray-200 p-2 mb-6">
              <div className="flex gap-2">
                <button
                  onClick={() => setActiveTab("crear")}
                  className={`flex-1 px-4 py-2.5 rounded-lg text-sm font-semibold transition ${
                    activeTab === "crear"
                      ? "bg-teal-600 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  ➕ Crear Grupo
                </button>
                <button
                  onClick={() => setActiveTab("editar")}
                  className={`flex-1 px-4 py-2.5 rounded-lg text-sm font-semibold transition ${
                    activeTab === "editar"
                      ? "bg-teal-600 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  ✏️ Editar Grupos
                </button>
              </div>
            </div>

            {/* ========== TAB 1: CREAR GRUPO ========== */}
            {activeTab === "crear" && (
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
                    placeholder="Ej: 101, 102, 203"
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                    required
                    min="1"
                  />
                  <p className="mt-1 text-xs text-gray-500">Código numérico único del grupo (Ej: 101, 102, 203).</p>
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
                    onChange={(e) => {
                      const selectedId = e.target.value;
                      console.log('🔄 Profesor seleccionado - ID:', selectedId);
                      setIdDocente(selectedId);
                    }}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all appearance-none bg-white cursor-pointer"
                    required
                  >
                    <option value="">Selecciona un profesor</option>
                    {Array.isArray(profesores) && profesores.length > 0 ? (
                      profesores.map((profesor, index) => {

                        const profesorId = profesor?.id_docente || profesor?.id || profesor?.identificacion || `temp_${index}`;
                        
                        // 🔍 Construir nombre del profesor
                        const primerNombre = profesor?.usuario?.primer_nombre || profesor?.primer_nombre || '';
                        const segundoNombre = profesor?.usuario?.segundo_nombre || profesor?.segundo_nombre || '';
                        const primerApellido = profesor?.usuario?.primer_apellido || profesor?.primer_apellido || '';
                        const segundoApellido = profesor?.usuario?.segundo_apellido || profesor?.segundo_apellido || '';
                        
                        const nombreCompleto = `${primerNombre} ${segundoNombre} ${primerApellido} ${segundoApellido}`.replace(/\s+/g, ' ').trim();
                        
                        // Fallback si no hay datos de nombre
                        const correo = profesor?.usuario?.correo || profesor?.correo || '';
                        const nombre = nombreCompleto || correo?.split('@')[0] || `Profesor ${profesorId}`;
                        
                        // Información adicional
                        const categoria = profesor?.categoria_docente || '';
                        const codigoPrograma = profesor?.codigo_programa || '';
                        
                        let displayText = nombre;
                        if (categoria) {
                          displayText += ` - ${categoria}`;
                        }
                        if (codigoPrograma) {
                          displayText += ` (${codigoPrograma})`;
                        }
                        
                        // 🔍 DEBUG en consola para el primer profesor
                        if (index === 0) {
                          console.log('🔍 Primer profesor en dropdown:');
                          console.log('   - profesor.id_docente:', profesor?.id_docente);
                          console.log('   - ID FINAL usado:', profesorId);
                          console.log('   - Nombre:', nombre);
                          console.log('   - Display:', displayText);
                          console.log('   - Objeto completo:', profesor);
                        }
                        
                        return (
                          <option key={`prof_${index}_${profesorId}`} value={profesorId}>
                            {displayText}
                          </option>
                        );
                      })
                    ) : (
                      <option value="" disabled>No hay profesores disponibles</option>
                    )}
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
            </div>
            )}

            {/* ========== TAB 2: EDITAR GRUPOS ========== */}
            {activeTab === "editar" && (
            <div className="bg-white rounded-lg border border-gray-200 p-8">
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Editar Grupos
                </h2>
                <p className="text-sm text-gray-600">
                  Busca y edita la información de los grupos registrados en el sistema.
                </p>
              </div>

              {/* Tabla de Grupos Registrados */}
              <div className="mb-6">
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
              </div>

              {/* Tabla */}
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Grupo
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Materia
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Fecha Creación
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Última Actualización
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
                          <tr key={grupo?.codigo_grupo || Math.random()} className="hover:bg-gray-50 transition">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex flex-col">
                                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-teal-100 text-teal-800 w-fit">
                                  Grupo {grupo?.codigo_grupo || 'N/A'}
                                </span>
                                {grupo?.codigo_materia && (
                                  <span className="text-xs text-gray-400 mt-1" title={`Materia: ${grupo.codigo_materia}`}>
                                    Materia: {grupo.codigo_materia}
                                  </span>
                                )}
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <div className="text-sm font-medium text-gray-900">{grupo?.nombre_materia || 'N/A'}</div>
                              {grupo?.docentes_asignados && grupo.docentes_asignados.length > 0 ? (
                                <div className="text-xs text-gray-500 mt-1">
                                  {grupo.docentes_asignados.map((doc, idx) => (
                                    <span key={idx} className="inline-block mr-2">
                                      {doc?.nombre || doc?.nombres || 'Sin nombre'}
                                    </span>
                                  ))}
                                </div>
                              ) : (
                                <div className="text-xs text-gray-400 mt-1 italic">Sin docentes asignados</div>
                              )}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-500">{grupo?.created_at ? new Date(grupo.created_at).toLocaleDateString() : 'N/A'}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-500">{grupo?.updated_at ? new Date(grupo.updated_at).toLocaleDateString() : 'N/A'}</div>
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
                                  onClick={() => handleDelete(grupo?.codigo_grupo)}
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
            )}
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
                  {profesores.map((profesor) => {
                    // Manejar ambas estructuras de respuesta del backend
                    const primerNombre = profesor?.usuario?.primer_nombre || profesor?.primer_nombre || '';
                    const segundoNombre = profesor?.usuario?.segundo_nombre || profesor?.segundo_nombre || '';
                    const primerApellido = profesor?.usuario?.primer_apellido || profesor?.primer_apellido || '';
                    const segundoApellido = profesor?.usuario?.segundo_apellido || profesor?.segundo_apellido || '';
                    
                    const nombreCompleto = `${primerNombre} ${segundoNombre} ${primerApellido} ${segundoApellido}`.replace(/\s+/g, ' ').trim();
                    const nombre = nombreCompleto || profesor?.nombre || `Profesor ${profesor?.identificacion || profesor?.id}`;
                    
                    const categoriaDocente = profesor?.categoria_docente || profesor?.departamento || '';
                    const displayText = categoriaDocente ? `${nombre} - ${categoriaDocente}` : nombre;
                    
                    return (
                      <option key={profesor.id} value={profesor.id}>
                        {displayText}
                      </option>
                    );
                  })}
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
