import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import RegisterProjectService from "../../Services/RegisterProjectService";

export default function RegisterProject() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(true);
  const { user, getAuthToken } = useAuth();

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
    id_evento: "1jAZE5TKXakRd9ymq1Xu",
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
      descripcion: "Póster y Artículo en PDF",
      archivos: ["pdf", "poster_pdf"]
    },
    { 
      id: 2, 
      name: "Taller",
      descripcion: "Artículo PDF e Imagen (PNG/JPG)",
      archivos: ["pdf", "imagen"]
    },
    { 
      id: 1, 
      name: "Proyecto (Exposoftware)",
      descripcion: "Póster y Artículo en PDF",
      archivos: ["pdf", "poster_pdf"]
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
        // 🚧 MODO PRUEBA: Comentar APIs y usar datos hardcodeados
        
        /* DESCOMENTAR ESTO PARA VOLVER A USAR LAS APIS
        const [
          estudiantesData,
          docentesData,
          lineasData,
          sublineasData,
          areasData,
          materiasData,
          gruposData,
        ] = await Promise.all([
          RegisterProjectService.obtenerEstudiantes(),
          RegisterProjectService.obtenerDocentes(),
          RegisterProjectService.obtenerLineasInvestigacion(),
          RegisterProjectService.obtenerSublineasInvestigacion(),
          RegisterProjectService.obtenerAreasTematicas(),
          RegisterProjectService.obtenerMaterias().catch(() => []),
          RegisterProjectService.obtenerGrupos().catch(() => []),
        ]);

        // 🔥 Si la API devuelve results dentro de data
        const listaEstudiantes = estudiantesData?.data?.results || estudiantesData || [];
        const listaDocentes = docentesData?.data?.results || docentesData || [];

        setEstudiantes(listaEstudiantes);
        setDocentes(listaDocentes);
        setLineas(lineasData);
        setSublineas(sublineasData);
        setAreas(areasData);
        setMaterias(materiasData);
        setGrupos(gruposData);
        */

        // 🧪 DATOS DE PRUEBA HARDCODEADOS (estructura corregida)
        const listaEstudiantes = [
          { 
            id: "CUaUUmOxHsbsv047JO9bNSoLrUh2", 
            usuario: { nombres: "Estudiante", apellidos: "Prueba", correo: "estudiante@test.com" }
          }
        ];
        const listaDocentes = [
          { 
            id: "c5i6cZpo7vhBzgfyLhmOAfh22Yh2", 
            nombre: "Docente Prueba",
            usuario: { nombres: "Docente", apellidos: "Prueba", correo: "docente@test.com" }
          }
        ];
        const lineasData = [
          { codigo_linea: 1, nombre_linea: "Línea Prueba 1" }
        ];
        const sublineasData = [
          { codigo_sublinea: 2, nombre_sublinea: "Sublínea Prueba 2", codigoLinea: 1 }
        ];
        const areasData = [
          { codigo_area: 1, nombre_area: "Área Prueba 1", codigoSublinea: 2 }
        ];
        const materiasData = [
          { codigo_materia: "FIS201", nombre_materia: "Física 201" }
        ];
        const gruposData = [
          { id_grupo: 203, nombre_grupo: "Grupo 203", codigoMateria: "FIS201" }
        ];

        setEstudiantes(listaEstudiantes);
        setDocentes(listaDocentes);
        setLineas(lineasData);
        setSublineas(sublineasData);
        setAreas(areasData);
        setMaterias(materiasData);
        setGrupos(gruposData);

        console.log("✅ Catálogos cargados (MODO PRUEBA):", {
          estudiantes: listaEstudiantes.length,
          docentes: listaDocentes.length,
        });
      } catch (error) {
        console.error("❌ Error cargando catálogos:", error);
        
        // Mensaje específico si es error de permisos
        if (error.message && error.message.includes('rol de estudiante no tiene permisos')) {
          setError(error.message);
        } else {
          setError("Error al cargar los datos. Por favor, intenta de nuevo.");
        }
      } finally {
        setLoadingData(false);
      }
    };

    cargarCatalogos();
  }, []);

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

  const areasFiltradas = form.codigo_sublinea
    ? areas.filter((a) => a.codigoSublinea === parseInt(form.codigo_sublinea))
    : [];

  const gruposFiltrados = form.codigo_materia
    ? grupos.filter((g) => g.codigoMateria === form.codigo_materia)
    : [];

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
      // 🔥 Agregar automáticamente el ID del usuario logueado como participante
      const participantes = [...form.id_estudiantes];
      if (user?.id_usuario && !participantes.includes(user.id_usuario)) {
        participantes.push(user.id_usuario);
        console.log('👤 Agregando usuario actual como participante:', user.id_usuario);
      }

      const proyectoData = {
        id_docente: form.id_docente,
        id_estudiantes: participantes, // Incluye al usuario actual
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
      console.log("� Participantes (incluyendo creador):", participantes);
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
                  return (
                    <span
                      key={idEst}
                      className="inline-flex items-center gap-2 bg-teal-50 text-teal-800 px-3 py-1 rounded-full text-sm"
                    >
                      {est?.usuario
                        ? `${est.usuario.nombres} ${est.usuario.apellidos}`
                        : idEst}
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
                    No hay participantes agregados
                  </span>
                )}
              </div>

              <ParticipantCombo students={estudiantes} onAdd={addParticipant} />
            </div>
          </div>

          {/* Docente */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Docente asignado <span className="text-red-500">*</span>
            </label>
            <select
              value={form.id_docente}
              onChange={(e) =>
                setForm((s) => ({ ...s, id_docente: e.target.value }))
              }
              className="w-full border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
              required
            >
              <option value="">Seleccionar docente</option>
              {docentes.map((doc) => (
                <option key={doc.id} value={doc.id}>
                  {doc.nombre || `${doc.usuario?.nombres} ${doc.usuario?.apellidos}`}
                </option>
              ))}
            </select>
          </div>

          {/* Materia, Grupo, Línea, Sublinea y Área */}
          
          {/* Materia */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Materia
            </label>
            <select
              value={form.codigo_materia}
              onChange={(e) =>
                setForm((s) => ({ ...s, codigo_materia: e.target.value, id_grupo: "" }))
              }
              className="w-full border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
            >
              <option value="">Seleccionar materia</option>
              {materias.map((mat) => (
                <option key={mat.codigo_materia} value={mat.codigo_materia}>
                  {mat.codigo_materia} - {mat.nombre_materia}
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
                <option key={grupo.id_grupo} value={grupo.id_grupo}>
                  Grupo {grupo.id_grupo}
                </option>
              ))}
            </select>
          </div>

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
                <option key={linea.codigo_linea} value={linea.codigo_linea}>
                  {linea.nombre_linea}
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
                <option key={sublinea.codigo_sublinea} value={sublinea.codigo_sublinea}>
                  {sublinea.nombre_sublinea}
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
                <option key={area.codigo_area} value={area.codigo_area}>
                  {area.nombre_area}
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
    `${s.usuario?.nombres || ""} ${s.usuario?.apellidos || ""} ${
      s.usuario?.correo || ""
    }`.toLowerCase().includes(q.toLowerCase())
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
                <span className="font-medium">
                  {s.usuario?.nombres} {s.usuario?.apellidos}
                </span>
                <span className="text-gray-500 text-xs ml-2">
                  {s.usuario?.correo}
                </span>
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
