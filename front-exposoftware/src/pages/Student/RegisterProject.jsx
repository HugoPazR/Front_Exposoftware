import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

// Mock data
const STUDENTS = [
  "Ana Pérez",
  "Carlos Ruiz",
  "María Gómez",
  "Luisa Fernández",
  "Pedro Castillo",
  "Jorge Martínez",
  "Lucía Herrera",
  "Andrés Ramírez",
  "Sofía López",
];

// Mock líneas y sublíneas (ejemplo simplificado MINTIC)
const LINES = [
  {
    id: 'l1',
    name: 'Ciencias de la Computación',
    sublines: [
      { id: 's1', name: 'Algoritmos y Complejidad' },
      { id: 's2', name: 'Sistemas Distribuidos' },
    ]
  },
  {
    id: 'l2',
    name: 'Ingeniería de Software',
    sublines: [
      { id: 's3', name: 'Pruebas y Calidad' },
      { id: 's4', name: 'Metodologías Ágiles' },
    ]
  },
  {
    id: 'l3',
    name: 'Inteligencia Artificial',
    sublines: [
      { id: 's5', name: 'Aprendizaje Automático' },
      { id: 's6', name: 'Visión por Computador' },
    ]
  }
];

// Mock áreas temáticas (ejemplo)
const AREAS = [
  { id: 'a1', name: 'Tecnologías de la información' },
  { id: 'a2', name: 'Ciencias de la computación' },
  { id: 'a3', name: 'Ingeniería de software' },
  { id: 'a4', name: 'Inteligencia artificial' },
];

// Mapeo de áreas por sublínea (ejemplo simplificado). Las claves son los ids de las sublíneas (s1..s6)
const AREAS_BY_SUBLINE = {
  s1: [ { id: 'a2', name: 'Ciencias de la computación' }, { id: 'a1', name: 'Tecnologías de la información' } ],
  s2: [ { id: 'a1', name: 'Tecnologías de la información' } ],
  s3: [ { id: 'a3', name: 'Ingeniería de software' } ],
  s4: [ { id: 'a3', name: 'Ingeniería de software' }, { id: 'a1', name: 'Tecnologías de la información' } ],
  s5: [ { id: 'a4', name: 'Inteligencia artificial' } ],
  s6: [ { id: 'a4', name: 'Inteligencia artificial' }, { id: 'a2', name: 'Ciencias de la computación' } ],
};

const MOCK = {
  materias: [
    { id: "m1", name: "Algoritmos" },
    { id: "m2", name: "Bases de Datos" },
    { id: "m3", name: "Ingeniería de Software" },
  ],
  grupos: {
    m1: ["G1", "G2"],
    m2: ["G1"],
    m3: ["G1", "G2", "G3"],
  },
  profesores: {
    m1: { G1: ["Dr. Pérez"], G2: ["Ing. Ruiz"] },
    m2: { G1: ["Dra. Ramírez"] },
    m3: { G1: ["Dra. Torres"], G2: ["Dr. Salas"], G3: ["Ing. Morales"] },
  },
};

export default function RegisterProject() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(true);
  const [tipo, setTipo] = useState("Proyecto");
  const [form, setForm] = useState({
    nombre: "",
    descripcion: "",
    poster: null,
    diapositivas: null,
    participantes: [],
    materia: "",
    grupo: "",
    profesor: "",
    linea: "",
    sublinea: "",
    area: "",
  });

  useEffect(() => {
    if (!open) navigate(-1);
  }, [open, navigate]);

  const grupos = form.materia ? MOCK.grupos[form.materia] || [] : [];
  const profesores = form.materia && form.grupo ? (MOCK.profesores[form.materia] || {})[form.grupo] || [] : [];

  useEffect(() => {
    // si materia y grupo están seleccionados, asignar profesor automáticamente si hay uno
    if (form.materia && form.grupo) {
      const profList = (MOCK.profesores[form.materia] || {})[form.grupo] || [];
      setForm(s => ({...s, profesor: profList[0] || ''}));
    }
  }, [form.materia, form.grupo]);

  // Limpiar área cuando cambia la línea o la sublínea
  useEffect(() => {
    // si se quita la sublínea, limpiar el área
    setForm(s => ({ ...s, area: s.sublinea ? s.area : '' }));
    // nota: también dejamos la lógica de limpieza directa en los onChange para más claridad
  }, [form.linea, form.sublinea]);

  const toggleStudent = (name) => {
    setForm(s => {
      const exists = s.participantes.includes(name);
      return { ...s, participantes: exists ? s.participantes.filter(x => x !== name) : [...s.participantes, name] };
    });
  };

  // Añadir participante desde combobox
  const addParticipant = (name) => {
    if (!name) return;
    setForm(s => ({ ...s, participantes: s.participantes.includes(name) ? s.participantes : [...s.participantes, name] }));
  };

  const removeParticipant = (name) => {
    setForm(s => ({ ...s, participantes: s.participantes.filter(x => x !== name) }));
  };

  const handleFile = (e, field) => {
    const file = e.target.files[0];
    setForm((s) => ({ ...s, [field]: file }));
  };

  const submit = (e) => {
    e.preventDefault();
    console.log('Enviar:', { tipo, ...form });
    // aquí llamarías al backend
    setOpen(false);
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-black bg-opacity-50 overflow-auto">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl my-12 p-6 mx-4">
        <header className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Postular a la Convocatoria</h3>
          <button onClick={() => setOpen(false)} className="text-gray-500 hover:text-gray-700">✕</button>
        </header>

        <form onSubmit={submit} className="space-y-4 max-h-[70vh] overflow-auto pr-2">
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-sm text-gray-600 mb-2">Tipo de postulación</p>
            <div className="flex flex-wrap gap-3">
              {['Proyecto','Ponencia','Póster','Otro'].map(t => (
                <label key={t} className="inline-flex items-center gap-2">
                  <input type="radio" name="tipo" value={t} checked={tipo===t} onChange={() => setTipo(t)} />
                  <span className="text-sm">{t}</span>
                </label>
              ))}
            </div>
          </div>

          {tipo === 'Proyecto' && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nombre del proyecto</label>
                <input value={form.nombre} onChange={e => setForm(s=>({...s,nombre:e.target.value}))} className="w-full border border-gray-200 rounded-lg px-3 py-2" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
                <textarea value={form.descripcion} onChange={e => setForm(s=>({...s,descripcion:e.target.value}))} rows={4} className="w-full border border-gray-200 rounded-lg px-3 py-2" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Subida de poster.pdf</label>
                  <input type="file" accept=".pdf,application/pdf" onChange={e=>handleFile(e,'poster')} className="w-full text-sm" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Subida de diapositivas.ppt</label>
                  <input type="file" accept=".ppt,.pptx" onChange={e=>handleFile(e,'diapositivas')} className="w-full text-sm" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Participantes</label>
                <div className="border border-gray-200 rounded-lg p-2">
                  <div className="flex gap-2 flex-wrap mb-2">
                    {form.participantes.map(p => (
                      <span key={p} className="inline-flex items-center gap-2 bg-green-50 text-green-800 px-2 py-1 rounded-full text-sm">
                        {p}
                        <button type="button" onClick={() => removeParticipant(p)} className="text-green-700 hover:text-green-900">✕</button>
                      </span>
                    ))}
                  </div>

                  {/* Combobox simple con búsqueda */}
                  <ParticipantCombo students={STUDENTS} onAdd={addParticipant} />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Materia asignada</label>
                  <select value={form.materia} onChange={e=>setForm(s=>({...s,materia:e.target.value,grupo:'',profesor:''}))} className="w-full border border-gray-200 rounded-lg px-3 py-2">
                    <option value="">Seleccionar materia</option>
                    {MOCK.materias.map(m=> <option key={m.id} value={m.id}>{m.name}</option>)}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Grupo</label>
                  <select value={form.grupo} onChange={e=>setForm(s=>({...s,grupo:e.target.value,profesor:''}))} className="w-full border border-gray-200 rounded-lg px-3 py-2">
                    <option value="">Seleccionar grupo</option>
                    {grupos.map(g=> <option key={g} value={g}>{g}</option>)}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Profesor</label>
                  <input value={form.profesor} readOnly className="w-full border border-gray-200 rounded-lg px-3 py-2 bg-gray-100" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Línea de investigación</label>
                  <select value={form.linea} onChange={e=>{ const lineId = e.target.value; setForm(s=>({...s,linea: lineId, sublinea: '', area: ''})); }} className="w-full border border-gray-200 rounded-lg px-3 py-2">
                    <option value="">Seleccionar línea</option>
                    {LINES.map(l => (<option key={l.id} value={l.id}>{l.name}</option>))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Sublínea</label>
                  <select value={form.sublinea} onChange={e=>setForm(s=>({...s,sublinea:e.target.value, area: ''}))} className="w-full border border-gray-200 rounded-lg px-3 py-2">
                    <option value="">Seleccionar sublínea</option>
                    {(LINES.find(l => l.id === form.linea)?.sublines || []).map(sl => (
                      <option key={sl.id} value={sl.id}>{sl.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Área temática</label>
                  {/* Mostrar solo áreas asociadas a la sublínea seleccionada. Si no hay sublínea, deshabilitar. */}
                  {(() => {
                    const availableAreas = AREAS_BY_SUBLINE[form.sublinea] || [];
                    return (
                      <select value={form.area} onChange={e=>setForm(s=>({...s,area:e.target.value}))} className="w-full border border-gray-200 rounded-lg px-3 py-2" disabled={availableAreas.length===0}>
                        <option value="">{availableAreas.length===0 ? 'Selecciona línea y sublínea primero' : 'Seleccionar área temática'}</option>
                        {availableAreas.map(a => (<option key={a.id} value={a.id}>{a.name}</option>))}
                      </select>
                    );
                  })()}
                </div>
              </div>
            </>
          )}

          <div className="flex items-center justify-end gap-3 pt-4">
            <button type="button" onClick={()=>setOpen(false)} className="px-4 py-2 rounded-lg border text-gray-700 hover:bg-gray-50">Cancelar</button>
            <button type="submit" className="px-4 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700">Enviar postulación</button>
          </div>
        </form>
      </div>
    </div>
  );
}

function ParticipantCombo({ students, onAdd }){
  const [q, setQ] = useState("");
  const filtered = students.filter(s => s.toLowerCase().includes(q.toLowerCase()));
  return (
    <div>
      <input value={q} onChange={e=>setQ(e.target.value)} placeholder="Buscar estudiante..." className="w-full border border-gray-200 rounded-lg px-3 py-2 mb-2" />
      <div className="max-h-36 overflow-auto border-t pt-2">
        {filtered.map(s => (
          <button key={s} type="button" onClick={()=>{ onAdd(s); setQ(''); }} className="w-full text-left py-1 text-sm hover:bg-gray-50">{s}</button>
        ))}
      </div>
    </div>
  );
}
