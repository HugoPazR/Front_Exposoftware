import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

export default function RegisterProject() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(true);
  const { user, getAuthToken } = useAuth();
  
  // Estado del formulario
  const [form, setForm] = useState({
    titulo_proyecto: "",
    descripcion: "",
    poster: null,
    articulo: null,
    video: null,
    imagen: null,
    participantes: [],
    id_materia: "",
    id_grupo: "",
    tipo_actividad: "",
    codigo_linea: "",
    codigo_sublinea: "",
    area: "",
  });

  // Tipos de actividad - Diccionario estático (no viene del backend)
  const tiposActividad = [
    { id: 1, name: "Conferencia" },
    { id: 2, name: "Taller" },
    { id: 3, name: "Exposoftware" },
    { id: 4, name: "Ponencia" },
  ];

  // Estados para datos del backend
  const [materias, setMaterias] = useState([]);
  const [grupos, setGrupos] = useState([]);
  const [lineas, setLineas] = useState([]);
  const [sublineas, setSublineas] = useState([]);
  const [areas, setAreas] = useState([]);
  const [estudiantes, setEstudiantes] = useState([]);
  const [docenteAsignado, setDocenteAsignado] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!open) navigate(-1);
  }, [open, navigate]);

  // Cargar catálogos iniciales (sin tipos de actividad que son estáticos)
  useEffect(() => {
    const cargarCatalogos = async () => {
      try {
        const [materiasRes, lineasRes, estudiantesRes] = await Promise.all([
          fetch('/api/materias'),
          fetch('/api/lineas'),
          fetch('/api/estudiantes')
        ]);

        setMaterias(await materiasRes.json());
        setLineas(await lineasRes.json());
        setEstudiantes(await estudiantesRes.json());
      } catch (error) {
        console.error('Error cargando catálogos:', error);
        alert('Error al cargar los datos iniciales');
      }
    };

    cargarCatalogos();
  }, []);

  // Limpiar archivos cuando cambia el tipo de actividad
  useEffect(() => {
    if (form.tipo_actividad) {
      setForm(s => ({
        ...s,
        poster: null,
        articulo: null,
        video: null,
        imagen: null,
      }));
    }
  }, [form.tipo_actividad]);

  // Cargar grupos cuando cambia la materia
  useEffect(() => {
    if (form.id_materia) {
      fetch(`/api/materias/${form.id_materia}/grupos`)
        .then(res => res.json())
        .then(data => setGrupos(data))
        .catch(err => console.error('Error cargando grupos:', err));
    } else {
      setGrupos([]);
    }
  }, [form.id_materia]);

  // Cargar docente cuando cambian materia y grupo
  useEffect(() => {
    if (form.id_materia && form.id_grupo) {
      fetch(`/api/materias/${form.id_materia}/grupos/${form.id_grupo}/docente`)
        .then(res => res.json())
        .then(data => setDocenteAsignado(data.nombre_docente || ''))
        .catch(err => console.error('Error cargando docente:', err));
    } else {
      setDocenteAsignado('');
    }
  }, [form.id_materia, form.id_grupo]);

  // Cargar sublíneas cuando cambia la línea
  useEffect(() => {
    if (form.codigo_linea) {
      fetch(`/api/lineas/${form.codigo_linea}/sublineas`)
        .then(res => res.json())
        .then(data => setSublineas(data))
        .catch(err => console.error('Error cargando sublíneas:', err));
    } else {
      setSublineas([]);
    }
  }, [form.codigo_linea]);

  // Cargar áreas cuando cambia la sublínea
  useEffect(() => {
    if (form.codigo_sublinea) {
      fetch(`/api/sublineas/${form.codigo_sublinea}/areas`)
        .then(res => res.json())
        .then(data => setAreas(data))
        .catch(err => console.error('Error cargando áreas:', err));
    } else {
      setAreas([]);
    }
  }, [form.codigo_sublinea]);

  const toggleStudent = (name) => {
    setForm(s => {
      const exists = s.participantes.includes(name);
      return { 
        ...s, 
        participantes: exists 
          ? s.participantes.filter(x => x !== name) 
          : [...s.participantes, name] 
      };
    });
  };

  const addParticipant = (name) => {
    if (!name) return;
    setForm(s => ({ 
      ...s, 
      participantes: s.participantes.includes(name) 
        ? s.participantes 
        : [...s.participantes, name] 
    }));
  };

  const removeParticipant = (name) => {
    setForm(s => ({ 
      ...s, 
      participantes: s.participantes.filter(x => x !== name) 
    }));
  };

  const handleFile = (e, field) => {
    const file = e.target.files[0];
    setForm((s) => ({ ...s, [field]: file }));
  };

  const submit = async (e) => {
    e.preventDefault();
    
    // Validación básica
    if (!form.titulo_proyecto.trim()) {
      alert('El título del proyecto es obligatorio');
      return;
    }

    if (form.participantes.length === 0) {
      alert('Debe agregar al menos un participante');
      return;
    }

    setLoading(true);

    try {
      // Crear FormData para enviar archivos
      const formData = new FormData();
      formData.append('titulo_proyecto', form.titulo_proyecto);
      formData.append('descripcion', form.descripcion);
      formData.append('tipo_actividad', form.tipo_actividad);
      formData.append('id_materia', form.id_materia);
      formData.append('id_grupo', form.id_grupo);
      formData.append('codigo_linea', form.codigo_linea);
      formData.append('codigo_sublinea', form.codigo_sublinea);
      formData.append('area', form.area);
      formData.append('participantes', JSON.stringify(form.participantes));
      
      // Agregar datos del usuario que está creando el proyecto
      if (user) {
        formData.append('id_estudiante', user.id_estudiante);
        formData.append('id_usuario', user.id_usuario);
        formData.append('correo_autor', user.correo);
        formData.append('nombre_autor', `${user.nombres} ${user.apellidos}`);
      }
      
      if (form.poster) {
        formData.append('poster', form.poster);
      }
      if (form.articulo) {
        formData.append('articulo', form.articulo);
      }
      if (form.video) {
        formData.append('video', form.video);
      }
      if (form.imagen) {
        formData.append('imagen', form.imagen);
      }

      // Obtener token de autenticación del contexto
      const token = getAuthToken();

      const response = await fetch('/api/proyectos', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Error al crear el proyecto');
      }

      const result = await response.json();
      console.log('Proyecto creado exitosamente:', result);
      
      alert('Proyecto registrado exitosamente');
      setOpen(false);
      
    } catch (error) {
      console.error('Error al enviar proyecto:', error);
      alert(error.message || 'Error al registrar el proyecto');
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-black bg-opacity-50 overflow-auto">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl my-12 p-6 mx-4">
        <header className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Postular a la Convocatoria</h3>
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
              {tiposActividad.map(t => (
                <label key={t.id} className="inline-flex items-center gap-2 cursor-pointer">
                  <input 
                    type="radio" 
                    name="tipo_actividad" 
                    value={t.id} 
                    checked={form.tipo_actividad === t.id.toString()} 
                    onChange={() => setForm(s => ({...s, tipo_actividad: t.id.toString()}))} 
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
              onChange={e => setForm(s=>({...s,titulo_proyecto:e.target.value}))} 
              className="w-full border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
              maxLength={60}
              required
            />
            <p className="text-xs text-gray-500 mt-1">{form.titulo_proyecto.length}/60 caracteres</p>
          </div>

          {/* Descripción */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
            <textarea 
              value={form.descripcion} 
              onChange={e => setForm(s=>({...s,descripcion:e.target.value}))} 
              rows={4} 
              className="w-full border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500" 
            />
          </div>

          {/* Archivos - Dinámicos según tipo de actividad */}
          {form.tipo_actividad && (
            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="text-sm font-semibold text-gray-800 mb-3">
                Archivos requeridos
              </h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Conferencia: artículo + video */}
                {form.tipo_actividad === "1" && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Artículo (PDF) <span className="text-red-500">*</span>
                      </label>
                      <input 
                        type="file" 
                        accept=".pdf,application/pdf" 
                        onChange={e=>handleFile(e,'articulo')} 
                        className="w-full text-sm" 
                        required
                      />
                      {form.articulo && (
                        <p className="text-xs text-teal-600 mt-1">✓ {form.articulo.name}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Video (MP4) <span className="text-red-500">*</span>
                      </label>
                      <input 
                        type="file" 
                        accept=".mp4,video/mp4" 
                        onChange={e=>handleFile(e,'video')} 
                        className="w-full text-sm" 
                        required
                      />
                      {form.video && (
                        <p className="text-xs text-teal-600 mt-1">✓ {form.video.name}</p>
                      )}
                    </div>
                  </>
                )}

                {/* Taller: artículo + imagen */}
                {form.tipo_actividad === "2" && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Artículo (PDF) <span className="text-red-500">*</span>
                      </label>
                      <input 
                        type="file" 
                        accept=".pdf,application/pdf" 
                        onChange={e=>handleFile(e,'articulo')} 
                        className="w-full text-sm" 
                        required
                      />
                      {form.articulo && (
                        <p className="text-xs text-teal-600 mt-1">✓ {form.articulo.name}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Imagen (JPG/PNG) <span className="text-red-500">*</span>
                      </label>
                      <input 
                        type="file" 
                        accept=".jpg,.jpeg,.png,image/jpeg,image/png" 
                        onChange={e=>handleFile(e,'imagen')} 
                        className="w-full text-sm" 
                        required
                      />
                      {form.imagen && (
                        <p className="text-xs text-teal-600 mt-1">✓ {form.imagen.name}</p>
                      )}
                    </div>
                  </>
                )}

                {/* Exposoftware (Proyecto): poster + artículo */}
                {form.tipo_actividad === "3" && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Póster (PDF) <span className="text-red-500">*</span>
                      </label>
                      <input 
                        type="file" 
                        accept=".pdf,application/pdf" 
                        onChange={e=>handleFile(e,'poster')} 
                        className="w-full text-sm" 
                        required
                      />
                      {form.poster && (
                        <p className="text-xs text-teal-600 mt-1">✓ {form.poster.name}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Artículo (PDF) <span className="text-red-500">*</span>
                      </label>
                      <input 
                        type="file" 
                        accept=".pdf,application/pdf" 
                        onChange={e=>handleFile(e,'articulo')} 
                        className="w-full text-sm" 
                        required
                      />
                      {form.articulo && (
                        <p className="text-xs text-teal-600 mt-1">✓ {form.articulo.name}</p>
                      )}
                    </div>
                  </>
                )}

                {/* Ponencia: poster + artículo */}
                {form.tipo_actividad === "4" && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Póster (PDF) <span className="text-red-500">*</span>
                      </label>
                      <input 
                        type="file" 
                        accept=".pdf,application/pdf" 
                        onChange={e=>handleFile(e,'poster')} 
                        className="w-full text-sm" 
                        required
                      />
                      {form.poster && (
                        <p className="text-xs text-teal-600 mt-1">✓ {form.poster.name}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Artículo (PDF) <span className="text-red-500">*</span>
                      </label>
                      <input 
                        type="file" 
                        accept=".pdf,application/pdf" 
                        onChange={e=>handleFile(e,'articulo')} 
                        className="w-full text-sm" 
                        required
                      />
                      {form.articulo && (
                        <p className="text-xs text-teal-600 mt-1">✓ {form.articulo.name}</p>
                      )}
                    </div>
                  </>
                )}
              </div>
            </div>
          )}

          {/* Participantes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Participantes <span className="text-red-500">*</span>
            </label>
            <p className="text-xs text-gray-500 mb-2">Agrega los estudiantes que participan en este proyecto</p>
            <div className="border border-gray-200 rounded-lg p-3">
              <div className="flex gap-2 flex-wrap mb-2">
                {form.participantes.map(p => (
                  <span key={p} className="inline-flex items-center gap-2 bg-teal-50 text-teal-800 px-3 py-1 rounded-full text-sm">
                    {p}
                    <button 
                      type="button" 
                      onClick={() => removeParticipant(p)} 
                      className="text-teal-700 hover:text-teal-900"
                    >
                      ✕
                    </button>
                  </span>
                ))}
                {form.participantes.length === 0 && (
                  <span className="text-sm text-gray-400">No hay participantes agregados</span>
                )}
              </div>

              <ParticipantCombo students={estudiantes} onAdd={addParticipant} />
            </div>
          </div>

          {/* Materia, Grupo, Profesor */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Materia asignada</label>
              <select 
                value={form.id_materia} 
                onChange={e=>setForm(s=>({...s,id_materia:e.target.value,id_grupo:'',area:''}))} 
                className="w-full border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
              >
                <option value="">Seleccionar materia</option>
                {materias.map(m=> <option key={m.id} value={m.id}>{m.name}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Grupo</label>
              <select 
                value={form.id_grupo} 
                onChange={e=>setForm(s=>({...s,id_grupo:e.target.value}))} 
                className="w-full border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
                disabled={!form.id_materia}
              >
                <option value="">Seleccionar grupo</option>
                {grupos.map(g=> <option key={g.id} value={g.id}>{g.name}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Profesor</label>
              <input 
                value={docenteAsignado} 
                readOnly 
                placeholder="Se asignará automáticamente"
                className="w-full border border-gray-200 rounded-lg px-3 py-2 bg-gray-100" 
              />
            </div>
          </div>

          {/* Línea, Sublínea, Área */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Línea de investigación</label>
              <select 
                value={form.codigo_linea} 
                onChange={e=>setForm(s=>({...s,codigo_linea:e.target.value, codigo_sublinea:'', area:''}))} 
                className="w-full border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
              >
                <option value="">Seleccionar línea</option>
                {lineas.map(l => <option key={l.id} value={l.id}>{l.name}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Sublínea</label>
              <select 
                value={form.codigo_sublinea} 
                onChange={e=>setForm(s=>({...s,codigo_sublinea:e.target.value, area:''}))} 
                className="w-full border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
                disabled={!form.codigo_linea}
              >
                <option value="">Seleccionar sublínea</option>
                {sublineas.map(sl => <option key={sl.id} value={sl.id}>{sl.name}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Área temática</label>
              <select 
                value={form.area} 
                onChange={e=>setForm(s=>({...s,area:e.target.value}))} 
                className="w-full border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
                disabled={!form.codigo_sublinea || areas.length === 0}
              >
                <option value="">
                  {!form.codigo_sublinea ? 'Selecciona sublínea primero' : 'Seleccionar área temática'}
                </option>
                {areas.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
              </select>
            </div>
          </div>

          {/* Botones */}
          <div className="flex items-center justify-end gap-3 pt-4">
            <button 
              type="button" 
              onClick={()=>setOpen(false)} 
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
              {loading ? 'Enviando...' : 'Enviar postulación'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function ParticipantCombo({ students, onAdd }) {
  const [q, setQ] = useState("");
  const filtered = students.filter(s => 
    s.name?.toLowerCase().includes(q.toLowerCase())
  );
  
  return (
    <div>
      <input 
        value={q} 
        onChange={e=>setQ(e.target.value)} 
        placeholder="Buscar estudiante..." 
        className="w-full border border-gray-200 rounded-lg px-3 py-2 mb-2" 
      />
      <div className="max-h-36 overflow-auto border-t pt-2">
        {filtered.length > 0 ? (
          filtered.map(s => (
            <button 
              key={s.id} 
              type="button" 
              onClick={()=>{ onAdd(s.name); setQ(''); }} 
              className="w-full text-left py-1 px-2 text-sm hover:bg-gray-50 rounded"
            >
              {s.name}
            </button>
          ))
        ) : (
          <p className="text-sm text-gray-400 px-2">No se encontraron estudiantes</p>
        )}
      </div>
    </div>
  );
}