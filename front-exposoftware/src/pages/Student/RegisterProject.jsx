import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import RegisterProjectService from "../../Services/RegisterProjectService";
import EventosService from "../../Services/EventosService";

export default function RegisterProject() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(true);
  const { user, getAuthToken, getFullName } = useAuth();

  const [form, setForm] = useState({
    titulo_proyecto: "",
    tipo_actividad: "",
    id_docente: "",
    id_estudiantes: [],
    id_grupo: "",
    codigo_materia: "",
    codigo_linea: "",
    codigo_sublinea: "",
    codigo_area: "",
    id_evento: "", // Ahora será seleccionado por el usuario
    archivoPDF: null,
    archivoExtra: null, // Para póster o imagen según tipo
  });

  const tiposActividad = [
    { 
      id: 4, 
      name: "Conferencia",
      descripcion: "Artículo en PDF",
      archivos: ["pdf"]
    },
    { 
      id: 3, 
      name: "Ponencia",
      descripcion: "Artículo en PDF",
      archivos: ["pdf"]
    },
    { 
      id: 2, 
      name: "Taller",
      descripcion: "Artículo en PDF",
      archivos: ["pdf"]
    },
    { 
      id: 1, 
      name: "Proyecto (Exposoftware)",
      descripcion: "Artículo en PDF",
      archivos: ["pdf"]
    },
  ];

  const [estudiantes, setEstudiantes] = useState([]);
  const [docentes, setDocentes] = useState([]);
  const [materias, setMaterias] = useState([]);
  const [grupos, setGrupos] = useState([]);
  const [lineas, setLineas] = useState([]);
  const [sublineas, setSublineas] = useState([]);
  const [sublineasFiltradas, setSublineasFiltradas] = useState([]);
  const [areas, setAreas] = useState([]);
  const [eventos, setEventos] = useState([]); // Nuevo estado para eventos
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!open) navigate(-1);
  }, [open, navigate]);

  useEffect(() => {
    const cargarCatalogos = async () => {
      setLoadingData(true);
      setError(null);

      try {
        console.log('🔄 Cargando catálogos desde el backend...');
        console.log('👤 Usuario actual:', user);

        // 🔥 CARGAR DATOS REALES DESDE EL BACKEND
        
        // 1️⃣ Cargar árbol de investigación (líneas, sublíneas, áreas)
        const arbolInvestigacion = await RegisterProjectService.obtenerArbolInvestigacion();
        
        // Extraer líneas
        const lineasData = arbolInvestigacion.map(linea => ({
          codigo: linea.codigo_linea,
          nombre: linea.nombre_linea,
        }));

        console.log('📊 Árbol recibido para procesar:', arbolInvestigacion);

        // Extraer sublíneas con referencia a línea
        const sublineasData = [];
        arbolInvestigacion.forEach((linea, indexLinea) => {
          console.log(`🔍 Procesando línea ${indexLinea + 1}:`, {
            codigo: linea.codigo_linea,
            nombre: linea.nombre_linea,
            tiene_sublineas: !!linea.sublineas,
            tipo_sublineas: Array.isArray(linea.sublineas) ? 'array' : typeof linea.sublineas,
            cantidad_sublineas: linea.sublineas?.length || 0
          });
          
          if (Array.isArray(linea.sublineas)) {
            linea.sublineas.forEach((sublinea, indexSub) => {
              console.log(`  📌 Sublínea ${indexSub + 1}:`, {
                codigo: sublinea.codigo_sublinea,
                nombre: sublinea.nombre_sublinea,
                tiene_areas: !!sublinea.areas_tematicas,
                cantidad_areas: sublinea.areas_tematicas?.length || 0
              });
              
              sublineasData.push({
                codigo: sublinea.codigo_sublinea,
                nombre: sublinea.nombre_sublinea,
                codigoLinea: linea.codigo_linea,
              });
            });
          } else {
            console.warn(`⚠️ Línea ${linea.nombre_linea} no tiene sublíneas o no es un array`);
          }
        });

        // Extraer áreas temáticas con referencia a sublínea
        const areasData = [];
        arbolInvestigacion.forEach(linea => {
          linea.sublineas?.forEach(sublinea => {
            sublinea.areas_tematicas?.forEach(area => {
              areasData.push({
                codigo: area.codigo_area,
                nombre: area.nombre_area,
                codigoSublinea: sublinea.codigo_sublinea,
              });
            });
          });
        });

        console.log('🌳 Árbol de investigación cargado:', {
          lineas: lineasData.length,
          sublineas: sublineasData.length,
          areas: areasData.length,
        });

        // 2️⃣ Cargar docentes
        const docentesData = await RegisterProjectService.obtenerDocentes();
        console.log('👨‍🏫 Docentes cargados:', docentesData.length);

        // 3️⃣ Cargar materias del programa del estudiante
        let materiasData = [];
        if (user?.codigo_programa) {
          // Extraer facultad del código de programa (ej: "ING_SIS" -> "ING")
          const facultyId = user.codigo_programa.split('_')[0];
          materiasData = await RegisterProjectService.obtenerMateriasPorPrograma(
            facultyId, 
            user.codigo_programa
          );
          console.log('📚 Materias cargadas:', materiasData.length);
        } else {
          console.warn('⚠️ No se pudo determinar el programa del estudiante');
        }

        // 4️⃣ Cargar todos los estudiantes disponibles
        const todosLosEstudiantes = await RegisterProjectService.obtenerTodosLosEstudiantes();
        console.log('� Total de estudiantes disponibles:', todosLosEstudiantes.length);

        // Agregar estudiante actual a la lista si no está
        const estudianteActual = user ? {
          id: user.id_estudiante || user.id_usuario,
          nombreCompleto: user.nombre_completo || `${user.primer_nombre || ''} ${user.primer_apellido || ''}`.trim(),
          correo: user.correo,
          codigoEstudiante: user.codigo_estudiante,
          programa: user.codigo_programa,
        } : null;

        let listaEstudiantes = [...todosLosEstudiantes];
        
        // Si el estudiante actual no está en la lista, agregarlo al inicio
        if (estudianteActual && estudianteActual.id) {
          const yaExiste = listaEstudiantes.some(est => est.id === estudianteActual.id);
          if (!yaExiste) {
            listaEstudiantes = [estudianteActual, ...listaEstudiantes];
          }
        }

        console.log('👥 Lista de estudiantes construida:', listaEstudiantes.length);

        // 5️⃣ Cargar eventos disponibles
        let eventosData = await EventosService.obtenerEventos();
        
        // Para registro de proyectos, mostrar todos los eventos (no filtrar por fecha)
        // Los estudiantes deberían poder postular a eventos pasados si es necesario
        console.log('📅 Eventos disponibles:', eventosData.length);
        console.log('🔍 Primer evento (para debug):', eventosData[0]);
        
        // Verificar que los eventos tengan ID
        if (eventosData.length > 0) {
          const primerEvento = eventosData[0];
          console.log('🔍 Campos del evento:', Object.keys(primerEvento));
          console.log('🔍 ID posible - id_evento:', primerEvento.id_evento);
          console.log('🔍 ID posible - id:', primerEvento.id);
          console.log('🔍 ID posible - _id:', primerEvento._id);
        }

        // Actualizar estados
        setEstudiantes(listaEstudiantes);
        setDocentes(docentesData);
        setLineas(lineasData);
        setSublineas(sublineasData);
        setAreas(areasData);
        setMaterias(materiasData);
        setEventos(eventosData);

        console.log('📊 Estados actualizados:', {
          estudiantes: listaEstudiantes.length,
          docentes: docentesData.length,
          lineas: lineasData.length,
          sublineas: sublineasData.length,
          areas: areasData.length,
          materias: materiasData.length,
          eventos: eventosData.length
        });

        // Debug específico para eventos
        console.log('🎯 Eventos en estado después de setEventos:', eventosData);

        // Auto-agregar usuario actual al proyecto (estudiante o egresado)
        const userId = user?.id_estudiante || user?.id_egresado || user?.id_usuario;
        const userRole = user?.rol?.toLowerCase();
        
        if (userId) {
          console.log(`✅ Auto-agregando ${userRole} al proyecto:`, userId);
          console.log('📋 Rol del usuario:', userRole);
          setForm(prev => ({
            ...prev,
            id_estudiantes: [userId], // El backend maneja tanto estudiantes como egresados
          }));
        } else {
          console.warn('⚠️ No se pudo auto-agregar usuario. ID no disponible en user:', user);
        }

        console.log("✅ Catálogos cargados exitosamente");
      } catch (error) {
        console.error("❌ Error cargando catálogos:", error);
        
        // Mensaje específico si es error de permisos
        if (error.message && error.message.includes('rol de estudiante no tiene permisos')) {
          setError(error.message);
        } else {
          setError(error.message || "Error al cargar los datos. Por favor, intenta de nuevo.");
        }
      } finally {
        setLoadingData(false);
      }
    };

    cargarCatalogos();
  }, [user]);

  useEffect(() => {
    if (form.codigo_linea) {
      const filtradas = sublineas.filter(
        (sub) => sub.codigoLinea === parseInt(form.codigo_linea)
      );
      setSublineasFiltradas(filtradas);
    } else {
      setSublineasFiltradas([]);
    }
  }, [form.codigo_linea, sublineas]);

  // 🔥 Cargar grupos cuando se selecciona una materia
  useEffect(() => {
    const cargarGrupos = async () => {
      if (form.codigo_materia) {
        console.log('🔄 Cargando grupos de la materia:', form.codigo_materia);
        try {
          const gruposData = await RegisterProjectService.obtenerGruposPorMateria(form.codigo_materia);
          setGrupos(gruposData);
          console.log('👥 Grupos cargados:', gruposData.length);
        } catch (error) {
          console.error('❌ Error cargando grupos:', error);
          setGrupos([]);
        }
      } else {
        setGrupos([]);
        // Limpiar grupo y docente si se deselecciona la materia
        setForm(prev => ({ ...prev, id_grupo: "", id_docente: "" }));
      }
    };

    cargarGrupos();
  }, [form.codigo_materia]);

  // 🔥 Asignar docente automáticamente cuando se selecciona un grupo
  useEffect(() => {
    const asignarDocenteDelGrupo = () => {
      if (form.id_grupo) {
        const grupoSeleccionado = grupos.find(g => g.id === form.id_grupo);
        
        if (grupoSeleccionado && grupoSeleccionado.idDocente) {
          console.log('✅ Grupo seleccionado:', grupoSeleccionado);
          console.log('✅ Asignando docente del grupo:', grupoSeleccionado.idDocente);
          console.log('📝 Nombre del docente:', grupoSeleccionado.nombreDocente);
          
          // Buscar el docente en la lista de docentes disponibles
          let docenteEnLista = docentes.find(d => d.id === grupoSeleccionado.idDocente);
          
          if (!docenteEnLista && grupoSeleccionado.nombreDocente) {
            // Si no está en la lista pero el grupo trae el nombre, agregarlo
            console.log('� Agregando docente del grupo a la lista:', grupoSeleccionado.nombreDocente);
            const nuevoDocente = {
              id: grupoSeleccionado.idDocente,
              nombre: grupoSeleccionado.nombreDocente,
              correo: '',
            };
            
            setDocentes(prev => {
              // Evitar duplicados
              const existe = prev.find(d => d.id === nuevoDocente.id);
              if (existe) return prev;
              console.log('✅ Docente agregado a la lista de docentes disponibles');
              return [...prev, nuevoDocente];
            });
            
            docenteEnLista = nuevoDocente;
          }
          
          if (docenteEnLista) {
            console.log('✅ Docente encontrado/agregado:', docenteEnLista.nombre);
          } else {
            console.warn('⚠️ No se pudo obtener información del docente');
          }
          
          // Asignar el ID del docente al formulario
          setForm(prev => ({ ...prev, id_docente: grupoSeleccionado.idDocente }));
        }
      } else {
        // Limpiar docente si se deselecciona el grupo
        setForm(prev => ({ ...prev, id_docente: "" }));
      }
    };

    asignarDocenteDelGrupo();
  }, [form.id_grupo, grupos]);

  // Filtrar áreas por sublínea seleccionada
  const areasFiltradas = form.codigo_sublinea
    ? areas.filter((a) => a.codigoSublinea === parseInt(form.codigo_sublinea))
    : [];

  // Los grupos ya están filtrados por materia (se cargan cuando se selecciona materia)
  const gruposFiltrados = grupos;

  // Obtener el docente actual del grupo seleccionado
  const docenteDelGrupo = form.id_grupo 
    ? grupos.find(g => g.id === form.id_grupo)
    : null;

  const toggleStudent = (idEstudiante) => {
    setForm((s) => {
      const exists = s.id_estudiantes.includes(idEstudiante);
      return {
        ...s,
        id_estudiantes: exists
          ? s.id_estudiantes.filter((x) => x !== idEstudiante)
          : [...s.id_estudiantes, idEstudiante],
      };
    });
  };

  const addParticipant = (idEstudiante) => {
    if (!idEstudiante) return;
    setForm((s) => ({
      ...s,
      id_estudiantes: s.id_estudiantes.includes(idEstudiante)
        ? s.id_estudiantes
        : [...s.id_estudiantes, idEstudiante],
    }));
  };

  const removeParticipant = (idEstudiante) => {
    setForm((s) => ({
      ...s,
      id_estudiantes: s.id_estudiantes.filter((x) => x !== idEstudiante),
    }));
  };

  const submit = async (e) => {
    e.preventDefault();

    // Validar que el usuario esté logueado
    if (!user || !user.id_usuario) {
      alert("Debe estar logueado para registrar un proyecto");
      console.error("❌ Usuario no autenticado:", user);
      return;
    }

    // Validaciones
    if (!form.titulo_proyecto.trim()) {
      alert("El título del proyecto es obligatorio");
      return;
    }
    if (!form.tipo_actividad) {
      alert("Debe seleccionar un tipo de actividad");
      return;
    }
    if (!form.id_docente) {
      alert("Debe seleccionar un docente");
      return;
    }
    if (!form.codigo_linea) {
      alert("Debe seleccionar una línea de investigación");
      return;
    }
    if (!form.codigo_sublinea) {
      alert("Debe seleccionar una sublínea de investigación");
      return;
    }
    if (!form.codigo_area) {
      alert("Debe seleccionar un área temática");
      return;
    }
    if (!form.id_evento) {
      alert("Debe seleccionar un evento");
      return;
    }
    if (!form.archivoPDF) {
      alert("Debe adjuntar el artículo en PDF");
      return;
    }

    // Validar tamaño del archivo PDF (máximo 10MB)
    const maxSizeMB = 10;
    const maxSizeBytes = maxSizeMB * 1024 * 1024;
    
    if (form.archivoPDF.size > maxSizeBytes) {
      alert(`El archivo PDF es demasiado grande. Tamaño máximo: ${maxSizeMB}MB\nTamaño actual: ${(form.archivoPDF.size / 1024 / 1024).toFixed(2)}MB`);
      return;
    }

    // Validar archivo extra según tipo de actividad
    const tipoSeleccionado = tiposActividad.find(t => t.id.toString() === form.tipo_actividad);
    if (tipoSeleccionado && tipoSeleccionado.archivos.length > 1 && !form.archivoExtra) {
      alert(`Debe adjuntar ${tipoSeleccionado.archivos[1] === 'poster_pdf' ? 'el póster en PDF' : 'la imagen (PNG/JPG)'}`);
      return;
    }

    // Validar tamaño del archivo extra si existe
    if (form.archivoExtra && form.archivoExtra.size > maxSizeBytes) {
      alert(`El archivo extra es demasiado grande. Tamaño máximo: ${maxSizeMB}MB\nTamaño actual: ${(form.archivoExtra.size / 1024 / 1024).toFixed(2)}MB`);
      return;
    }

    setLoading(true);

    try {
      // 🔥 Agregar automáticamente el ID_ESTUDIANTE del usuario logueado como participante
      const participantes = [...form.id_estudiantes];
      const nombresParticipantes = [];
      
      console.log('🔍 DEBUG - Estudiantes seleccionados inicialmente:', form.id_estudiantes);
      console.log('🔍 DEBUG - Usuario actual:', {
        id_estudiante: user?.id_estudiante,
        id_usuario: user?.id_usuario
      });
      
      // Obtener nombres de los estudiantes seleccionados
      form.id_estudiantes.forEach(idEst => {
        const estudiante = estudiantes.find(e => e.id_estudiante === idEst);
        if (estudiante) {
          const nombreEstudiante = `${estudiante.nombres} ${estudiante.apellidos}`.trim();
          nombresParticipantes.push(nombreEstudiante);
          console.log(`   📝 Estudiante encontrado: ${idEst} -> ${nombreEstudiante}`);
        } else {
          console.warn(`   ⚠️ Estudiante NO encontrado en lista: ${idEst}`);
        }
      });
      
      console.log('📋 Nombres recopilados hasta ahora:', nombresParticipantes);
      
      // ✅ IMPORTANTE: Usar id_estudiante (backend), NO id_usuario (Firebase)
      const idEstudianteActual = user?.id_estudiante;
      
      console.log('🔍 Verificando si agregar usuario actual:', {
        idEstudianteActual,
        yaEstaEnLista: participantes.includes(idEstudianteActual),
        participantesActuales: participantes
      });
      
      if (idEstudianteActual && !participantes.includes(idEstudianteActual)) {
        participantes.push(idEstudianteActual);
        
        // Usar getFullName() del contexto que ya tiene la lógica correcta
        const nombreCompleto = getFullName();
        
        console.log('👤 Agregando usuario actual como participante:', {
          id_estudiante: idEstudianteActual,
          nombre: nombreCompleto,
          user_fields: {
            primer_nombre: user?.primer_nombre,
            segundo_nombre: user?.segundo_nombre,
            primer_apellido: user?.primer_apellido,
            segundo_apellido: user?.segundo_apellido
          }
        });
        
        nombresParticipantes.push(nombreCompleto || 'Usuario actual');
      } else if (!idEstudianteActual) {
        console.warn('⚠️ El usuario no tiene id_estudiante, usando id_usuario como fallback');

        const idUsuario = user?.id_usuario;
        if (idUsuario && !participantes.includes(idUsuario)) {
          participantes.push(idUsuario);
          nombresParticipantes.push('Usuario actual');
          console.warn('⚠️ Usando id_usuario como participante:', idUsuario);
        }
      }

      // Obtener nombre del docente
      const docenteSeleccionado = docentes.find(d => d.id_docente === form.id_docente);
      const nombreDocente = docenteSeleccionado?.nombre || '';

      const proyectoData = {
        id_docente: form.id_docente,
        nombre_docente: nombreDocente, // ✅ NUEVO: Nombre del docente
        id_estudiantes: participantes, // Incluye al usuario actual (con id_estudiante)
        nombres_estudiantes: nombresParticipantes, // ✅ NUEVO: Nombres de estudiantes
        id_grupo: form.id_grupo,
        codigo_area: form.codigo_area,
        id_evento: form.id_evento,
        codigo_materia: form.codigo_materia,
        codigo_linea: form.codigo_linea,
        codigo_sublinea: form.codigo_sublinea,
        titulo_proyecto: form.titulo_proyecto,
        tipo_actividad: form.tipo_actividad,
        // NO incluir calificacion - la asigna el profesor
      };

      console.log("📤 Enviando proyecto:", proyectoData);
      console.log("👥 Participantes (incluyendo creador):", participantes);
      console.log("📝 Nombres de participantes:", nombresParticipantes);
      console.log("👨‍🏫 Docente:", nombreDocente);
      console.log("🆔 IDs de usuario:", {
        id_estudiante: user?.id_estudiante,
        id_usuario: user?.id_usuario
      });
      console.log("📎 Archivos:", {
        pdf: form.archivoPDF?.name,
        extra: form.archivoExtra?.name
      });

      const resultado = await RegisterProjectService.crearProyecto(
        proyectoData,
        form.archivoPDF,
        form.archivoExtra
      );

      console.log("✅ Proyecto creado:", resultado);
      alert("¡Proyecto registrado exitosamente!");
      setOpen(false);
    } catch (error) {
      console.error("❌ Error al registrar proyecto:", error);
      alert(
        error.message ||
          "Error al registrar el proyecto. Por favor, intenta de nuevo."
      );
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;

  if (loadingData) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
        <div className="bg-white rounded-lg shadow-xl p-8">
          <div className="flex items-center gap-3">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600"></div>
            <p className="text-gray-700">Cargando datos...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
        <div className="bg-white rounded-lg shadow-xl p-8 max-w-2xl mx-4">
          <div className="text-center">
            <div className="text-red-500 text-5xl mb-4">⚠️</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Configuración del Backend Requerida
            </h3>
            <p className="text-gray-600 mb-4 whitespace-pre-line text-sm text-left">{error}</p>
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4 text-left">
              <p className="text-sm text-yellow-800 mb-2">
                <strong>Solución para el administrador:</strong>
              </p>
              <p className="text-xs text-yellow-700 mb-2">
                Agregar el rol "Estudiante" a los permisos del endpoint:
              </p>
              <code className="text-xs bg-yellow-100 px-2 py-1 rounded block mb-2">
                /api/v1/public-investigacion/arbol-completo
              </code>
              <p className="text-xs text-yellow-700">
                Cambiar: <code className="bg-yellow-100 px-1">@require_roles(["Administrativo", "Docente"])</code><br/>
                A: <code className="bg-yellow-100 px-1">@require_roles(["Administrativo", "Docente", "Estudiante"])</code>
              </p>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700"
            >
              Cerrar
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-black bg-opacity-50 overflow-auto">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl my-12 p-6 mx-4">
        <header className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">
            Postular a la Convocatoria
          </h3>
          <button
            onClick={() => setOpen(false)}
            className="text-gray-500 hover:text-gray-700"
            disabled={loading}
          >
            ✕
          </button>
        </header>

        <form onSubmit={submit} className="space-y-4 max-h-[70vh] overflow-auto pr-2">
          {/* Tipo de Actividad */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-sm font-medium text-gray-700 mb-2">
              Tipo de Actividad <span className="text-red-500">*</span>
            </p>
            <div className="flex flex-wrap gap-3">
              {tiposActividad.map((t) => (
                <label key={t.id} className="inline-flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="tipo_actividad"
                    value={t.id}
                    checked={form.tipo_actividad === t.id.toString()}
                    onChange={() =>
                      setForm((s) => ({ ...s, tipo_actividad: t.id.toString() }))
                    }
                    className="text-teal-600 focus:ring-teal-500"
                    required
                  />
                  <span className="text-sm">{t.name}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Título del proyecto */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Título del proyecto <span className="text-red-500">*</span>
            </label>
            <input
              value={form.titulo_proyecto}
              onChange={(e) =>
                setForm((s) => ({ ...s, titulo_proyecto: e.target.value }))
              }
              className="w-full border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
              maxLength={255}
              required
            />
            <p className="text-xs text-gray-500 mt-1">
              {form.titulo_proyecto.length}/255 caracteres
            </p>
          </div>

          {/* Participantes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Participantes (Estudiantes) <span className="text-red-500">*</span>
            </label>
            <div className="border border-gray-200 rounded-lg p-3">
              <div className="flex gap-2 flex-wrap mb-2">
                {form.id_estudiantes.map((idEst) => {
                  const est = estudiantes.find((e) => e.id === idEst);
                  
                  // Debug logging
                  if (!est) {
                    console.warn('⚠️ No se encontró estudiante con ID:', idEst, 'en lista:', estudiantes);
                  }
                  
                  return (
                    <span
                      key={idEst}
                      className="inline-flex items-center gap-2 bg-teal-50 text-teal-800 px-3 py-1 rounded-full text-sm"
                    >
                      {est?.nombre || est?.correo || `ID: ${idEst}`}
                      <button
                        type="button"
                        onClick={() => removeParticipant(idEst)}
                        className="text-teal-700 hover:text-teal-900"
                      >
                        ✕
                      </button>
                    </span>
                  );
                })}
                {form.id_estudiantes.length === 0 && (
                  <span className="text-sm text-gray-400">
                    No hay participantes agregados (el estudiante actual debería aparecer aquí)
                  </span>
                )}
              </div>

              <ParticipantCombo students={estudiantes} onAdd={addParticipant} />
            </div>
          </div>

        {/* EVENTO - Ahora primero */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Evento <span className="text-red-500">*</span>
          </label>
          <select
            value={form.id_evento}
            onChange={(e) =>
              setForm((s) => ({ ...s, id_evento: e.target.value }))
            }
            className="w-full border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
            required
          >
            <option value="">Seleccionar evento</option>
            {eventos.map((evento, index) => {
              const fechaInicio = evento.fecha_inicio ? new Date(evento.fecha_inicio).toLocaleDateString('es-CO', { 
                year: 'numeric', 
                month: 'short', 
                day: 'numeric' 
              }) : '';
              const fechaFin = evento.fecha_fin ? new Date(evento.fecha_fin).toLocaleDateString('es-CO', { 
                year: 'numeric', 
                month: 'short', 
                day: 'numeric' 
              }) : '';
              
              // 🔥 Usar ID real del evento - intentar diferentes campos posibles
              const eventoValue = evento.id_evento || evento.id || evento._id || index.toString();
              
              return (
                <option key={eventoValue} value={eventoValue}>
                  {evento.nombre_evento} {fechaInicio && `(${fechaInicio}${fechaFin && fechaFin !== fechaInicio ? ' - ' + fechaFin : ''})`}
                </option>
              );
            })}
          </select>
          {eventos.length === 0 && (
            <p className="text-xs text-amber-600 mt-1">
              ⚠️ No hay eventos disponibles. Contacta al administrador.
            </p>
          )}
          {form.id_evento && (
            <div className="mt-2 p-2 bg-teal-50 rounded text-xs text-teal-800">
              <strong>Evento seleccionado:</strong> {eventos.find(e => {
                const eventoId = e.id_evento || e.id || e._id || eventos.indexOf(e).toString();
                return eventoId === form.id_evento;
              })?.nombre_evento}
              {eventos.find(e => {
                const eventoId = e.id_evento || e.id || e._id || eventos.indexOf(e).toString();
                return eventoId === form.id_evento;
              })?.lugar && (
                <> • 📍 {eventos.find(e => {
                  const eventoId = e.id_evento || e.id || e._id || eventos.indexOf(e).toString();
                  return eventoId === form.id_evento;
                })?.lugar}</>
              )}
            </div>
          )}
        </div>

          {/* Materia */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Materia
            </label>
            <select
              value={form.codigo_materia}
              onChange={(e) =>
                setForm((s) => ({ ...s, codigo_materia: e.target.value, id_grupo: "", id_docente: "" }))
              }
              className="w-full border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
            >
              <option value="">Seleccionar materia</option>
              {materias.map((mat) => (
                <option key={mat.codigo} value={mat.codigo}>
                  {mat.codigo} - {mat.nombre}
                </option>
              ))}
            </select>
          </div>

          {/* Grupo */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Grupo
            </label>
            <select
              value={form.id_grupo}
              onChange={(e) =>
                setForm((s) => ({ ...s, id_grupo: e.target.value }))
              }
              className="w-full border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
              disabled={!form.codigo_materia}
            >
              <option value="">Seleccionar grupo</option>
              {gruposFiltrados.map((grupo) => (
                <option key={grupo.id} value={grupo.id}>
                  {grupo.nombre}
                </option>
              ))}
            </select>
            {!form.codigo_materia && (
              <p className="text-xs text-gray-500 mt-1">
                Primero selecciona una materia
              </p>
            )}
          </div>

          {/* Docente - Solo lectura, se asigna automáticamente del grupo */}
          {docenteDelGrupo && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Docente asignado
              </label>
              <div className="w-full border border-gray-200 bg-gray-50 rounded-lg px-3 py-2 text-gray-700">
                👨‍🏫 {docenteDelGrupo.nombreDocente || docenteDelGrupo.idDocente}
              </div>
              <p className="text-xs text-gray-500 mt-1">
                El docente se asigna automáticamente del grupo seleccionado
              </p>
            </div>
          )}

          {/* Línea de Investigación */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Línea de Investigación <span className="text-red-500">*</span>
            </label>
            <select
              value={form.codigo_linea}
              onChange={(e) =>
                setForm((s) => ({ 
                  ...s, 
                  codigo_linea: e.target.value,
                  codigo_sublinea: "",
                  codigo_area: ""
                }))
              }
              className="w-full border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
              required
            >
              <option value="">Seleccionar línea</option>
              {lineas.map((linea) => (
                <option key={linea.codigo} value={linea.codigo}>
                  {linea.nombre}
                </option>
              ))}
            </select>
          </div>

          {/* Sublínea de Investigación */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Sublínea de Investigación <span className="text-red-500">*</span>
            </label>
            <select
              value={form.codigo_sublinea}
              onChange={(e) =>
                setForm((s) => ({ 
                  ...s, 
                  codigo_sublinea: e.target.value,
                  codigo_area: ""
                }))
              }
              className="w-full border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
              disabled={!form.codigo_linea}
              required
            >
              <option value="">Seleccionar sublínea</option>
              {sublineasFiltradas.map((sublinea) => (
                <option key={sublinea.codigo} value={sublinea.codigo}>
                  {sublinea.nombre}
                </option>
              ))}
            </select>
          </div>

          {/* Área Temática */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Área Temática <span className="text-red-500">*</span>
            </label>
            <select
              value={form.codigo_area}
              onChange={(e) =>
                setForm((s) => ({ ...s, codigo_area: e.target.value }))
              }
              className="w-full border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
              disabled={!form.codigo_sublinea}
              required
            >
              <option value="">Seleccionar área</option>
              {areasFiltradas.map((area) => (
                <option key={area.codigo} value={area.codigo}>
                  {area.nombre}
                </option>
              ))}
            </select>
          </div>

          {/* Archivo PDF (Artículo) */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Artículo en PDF <span className="text-red-500">*</span>
            </label>
            <input
              type="file"
              accept=".pdf"
              onChange={(e) =>
                setForm((s) => ({ ...s, archivoPDF: e.target.files[0] }))
              }
              className="w-full border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
              required
            />
            {form.archivoPDF && (
              <p className="text-xs text-teal-600 mt-1">
                ✓ {form.archivoPDF.name} ({(form.archivoPDF.size / 1024 / 1024).toFixed(2)} MB)
              </p>
            )}
          </div>

          {/* Archivo Extra (Póster o Imagen según tipo) */}
          {form.tipo_actividad && tiposActividad.find(t => t.id.toString() === form.tipo_actividad)?.archivos.length > 1 && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {tiposActividad.find(t => t.id.toString() === form.tipo_actividad)?.archivos[1] === 'poster_pdf' 
                  ? 'Póster en PDF' 
                  : 'Imagen (PNG/JPG)'} <span className="text-red-500">*</span>
              </label>
              <input
                type="file"
                accept={tiposActividad.find(t => t.id.toString() === form.tipo_actividad)?.archivos[1] === 'poster_pdf' 
                  ? '.pdf' 
                  : '.png,.jpg,.jpeg'}
                onChange={(e) =>
                  setForm((s) => ({ ...s, archivoExtra: e.target.files[0] }))
                }
                className="w-full border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
                required
              />
              {form.archivoExtra && (
                <p className="text-xs text-teal-600 mt-1">
                  ✓ {form.archivoExtra.name} ({(form.archivoExtra.size / 1024 / 1024).toFixed(2)} MB)
                </p>
              )}
            </div>
          )}

          {/* Botones */}
          <div className="flex items-center justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="px-4 py-2 rounded-lg border text-gray-700 hover:bg-gray-50"
              disabled={loading}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-lg bg-teal-600 text-white hover:bg-teal-700 disabled:bg-gray-400"
              disabled={loading}
            >
              {loading ? "Enviando..." : "Enviar postulación"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function ParticipantCombo({ students, onAdd }) {
  const [q, setQ] = useState("");

  const filtered = students.filter((s) =>
    `${s.nombreCompleto || ""} ${s.correo || ""}`.toLowerCase().includes(q.toLowerCase())
  );

  return (
    <div>
      <input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Buscar estudiante por nombre o correo..."
        className="w-full border border-gray-200 rounded-lg px-3 py-2 mb-2 text-sm"
      />
      <div className="max-h-36 overflow-auto border-t pt-2">
        {filtered.length > 0 ? (
          filtered.map((s) => (
            <button
              key={s.id}
              type="button"
              onClick={() => {
                onAdd(s.id);
                setQ("");
              }}
              className="w-full text-left py-2 px-2 text-sm hover:bg-gray-50 rounded flex justify-between items-center"
            >
              <span>
                <div className="font-medium">{s.nombreCompleto}</div>
                <div className="text-xs text-gray-500">{s.correo}</div>
                {s.codigoEstudiante && (
                  <div className="text-xs text-gray-400">Código: {s.codigoEstudiante}</div>
                )}
              </span>
              <span className="text-teal-600 text-xs">+ Agregar</span>
            </button>
          ))
        ) : (
          <p className="text-sm text-gray-400 px-2">
            {q ? "No se encontraron estudiantes" : "Escribe para buscar"}
          </p>
        )}
      </div>
    </div>
  );
}
