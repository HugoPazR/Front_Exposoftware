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
  });

  const tiposActividad = [
    { id: 1, name: "Conferencia" },
    { id: 2, name: "Taller" },
    { id: 3, name: "Exposoftware" },
    { id: 4, name: "Ponencia" },
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

        console.log("✅ Catálogos cargados:", {
          estudiantes: listaEstudiantes.length,
          docentes: listaDocentes.length,
        });
      } catch (error) {
        console.error("❌ Error cargando catálogos:", error);
        setError("Error al cargar los datos. Por favor, intenta de nuevo.");
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

    if (!form.titulo_proyecto.trim()) {
      alert("El título del proyecto es obligatorio");
      return;
    }
    if (form.id_estudiantes.length === 0) {
      alert("Debe agregar al menos un participante");
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

    setLoading(true);

    try {
      const proyectoData = {
        id_docente: form.id_docente,
        id_estudiantes: form.id_estudiantes,
        id_grupo: form.id_grupo,
        codigo_area: form.codigo_area,
        id_evento: form.id_evento,
        codigo_materia: form.codigo_materia,
        codigo_linea: form.codigo_linea,
        codigo_sublinea: form.codigo_sublinea,
        titulo_proyecto: form.titulo_proyecto,
        tipo_actividad: form.tipo_actividad,
      };

      console.log("📤 Enviando proyecto:", proyectoData);

      const resultado = await RegisterProjectService.crearProyecto(proyectoData);

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
        <div className="bg-white rounded-lg shadow-xl p-8 max-w-md">
          <div className="text-center">
            <div className="text-red-500 text-5xl mb-4">⚠️</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Error al cargar
            </h3>
            <p className="text-gray-600 mb-4">{error}</p>
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
          {/* (Mantén igual tu bloque anterior de selects) */}

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
