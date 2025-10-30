import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import * as RegisterService from "../../Services/RegisterService";
import logo from "../../assets/Logo-unicesar.png";
import colombiaData from "../../data/colombia.json";

const TIPOS_DOCUMENTO = ["CC", "TI", "CE", "Pasaporte"];
const SEXOS = ["Hombre", "Mujer", "Hermafrodita"];
const IDENTIDADES_SEXUALES = ["Heterosexual", "Homosexual", "Bisexual", "Asexual", "Otro"];
const PROGRAMAS = [
  { codigo: "ING01", nombre: "Ingeniería de Sistemas" },
  { codigo: "ING02", nombre: "Ingeniería Civil" },
  { codigo: "ING03", nombre: "Ingeniería Industrial" }
];

function RegisterPage() {
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    tipo_documento: "",
    identificacion: "",
    nombres: "",
    apellidos: "",
    sexo: "",
    identidad_sexual: "",
    fecha_nacimiento: "",
    nacionalidad: "Colombiana",
    pais_residencia: "Colombia",
    departamento: "",
    municipio: "",
    ciudad_residencia: "",
    direccion_residencia: "",
    telefono: "",
    correo: "",
    contraseña: "",
    confirmar_contraseña: "",
    codigo_programa: "",
    semestre: "",
    periodo: "",
    anio_ingreso: new Date().getFullYear()
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [ciudadesDisponibles, setCiudadesDisponibles] = useState([]);

  // Cuando cambia el departamento, actualizar las ciudades disponibles
  useEffect(() => {
    if (formData.departamento) {
      const deptData = colombiaData.find(d => d.departamento === formData.departamento);
      if (deptData) {
        setCiudadesDisponibles(deptData.ciudades);
        // Si la ciudad/municipio actual no está en la nueva lista, limpiarlos
        if (!deptData.ciudades.includes(formData.municipio)) {
          setFormData(prev => ({
            ...prev,
            municipio: "",
            ciudad_residencia: ""
          }));
        }
      }
    } else {
      setCiudadesDisponibles([]);
    }
  }, [formData.departamento]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    console.log(" Iniciando registro...");
    
    const validacion = RegisterService.validarDatosRegistro(formData);
    if (!validacion.valido) {
      alert(" Por favor complete todos los campos requeridos:\n\n" + validacion.errores.join("\n"));
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const resultado = await RegisterService.registrarEstudiante(formData);
      
      if (resultado.success) {
        alert(" ¡Registro exitoso!\n\nYa puedes iniciar sesión con tu correo y contraseña.");
        navigate("/login");
      }
    } catch (error) {
      console.error(" Error en registro:", error);
      alert(" Error al registrarse:\n\n" + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-teal-50 to-green-50 py-12 px-4">
      <section className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-5xl">
        <div className="text-center mb-8">
          <img src={logo} alt="Logo Unicesar" className="w-20 h-auto mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Registro de Estudiante
          </h1>
          <p className="text-gray-600">
            Completa todos los campos para crear tu cuenta en <span className="font-semibold text-teal-600">Expo-software 2025</span>
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">          <div>
            <div className="border-l-4 border-teal-600 pl-4 mb-6">
              <h2 className="text-xl font-bold text-gray-800">Información Personal</h2>
              <p className="text-sm text-gray-600">Datos básicos de identificación</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tipo de Documento <span className="text-red-500">*</span>
                </label>
                <select name="tipo_documento" value={formData.tipo_documento} onChange={handleChange} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent" required>
                  <option value="">Seleccione</option>
                  {TIPOS_DOCUMENTO.map(tipo => (<option key={tipo} value={tipo}>{tipo}</option>))}
                </select>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Número de Identificación <span className="text-red-500">*</span>
                </label>
                <input type="text" name="identificacion" value={formData.identificacion} onChange={handleChange} placeholder="1234567890" className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent" required />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nombres Completos <span className="text-red-500">*</span>
                </label>
                <input type="text" name="nombres" value={formData.nombres} onChange={handleChange} placeholder="Juan Carlos" className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent" required />
              </div>
              <div className="md:col-span-1">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Apellidos <span className="text-red-500">*</span>
                </label>
                <input type="text" name="apellidos" value={formData.apellidos} onChange={handleChange} placeholder="Pérez García" className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Sexo <span className="text-red-500">*</span>
                </label>
                <select name="sexo" value={formData.sexo} onChange={handleChange} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent" required>
                  <option value="">Seleccione</option>
                  {SEXOS.map(sexo => (<option key={sexo} value={sexo}>{sexo}</option>))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Identidad Sexual <span className="text-red-500">*</span>
                </label>
                <select name="identidad_sexual" value={formData.identidad_sexual} onChange={handleChange} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent" required>
                  <option value="">Seleccione</option>
                  {IDENTIDADES_SEXUALES.map(identidad => (<option key={identidad} value={identidad}>{identidad}</option>))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Fecha de Nacimiento <span className="text-red-500">*</span>
                </label>
                <input type="date" name="fecha_nacimiento" value={formData.fecha_nacimiento} onChange={handleChange} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent" required />
              </div>
            </div>
          </div>
          <div>
            <div className="border-l-4 border-teal-600 pl-4 mb-6">
              <h2 className="text-xl font-bold text-gray-800">Información de Residencia</h2>
              <p className="text-sm text-gray-600">Datos de ubicación actual</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Departamento <span className="text-red-500">*</span>
                </label>
                <select 
                  name="departamento" 
                  value={formData.departamento} 
                  onChange={handleChange} 
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent" 
                  required
                >
                  <option value="">Seleccione un departamento</option>
                  {colombiaData.map(dept => (
                    <option key={dept.departamento} value={dept.departamento}>
                      {dept.departamento}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Municipio <span className="text-red-500">*</span>
                </label>
                <select 
                  name="municipio" 
                  value={formData.municipio} 
                  onChange={handleChange} 
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent" 
                  required
                  disabled={!formData.departamento}
                >
                  <option value="">Seleccione un municipio</option>
                  {ciudadesDisponibles.map(ciudad => (
                    <option key={ciudad} value={ciudad}>
                      {ciudad}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Ciudad de Residencia <span className="text-red-500">*</span>
                </label>
                <select 
                  name="ciudad_residencia" 
                  value={formData.ciudad_residencia} 
                  onChange={handleChange} 
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent" 
                  required
                  disabled={!formData.departamento}
                >
                  <option value="">Seleccione una ciudad</option>
                  {ciudadesDisponibles.map(ciudad => (
                    <option key={ciudad} value={ciudad}>
                      {ciudad}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Teléfono <span className="text-red-500">*</span>
                </label>
                <input type="tel" name="telefono" value={formData.telefono} onChange={handleChange} placeholder="+57 3001234567" className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent" required />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Dirección de Residencia <span className="text-red-500">*</span>
                </label>
                <input type="text" name="direccion_residencia" value={formData.direccion_residencia} onChange={handleChange} placeholder="Calle 12 # 34-56" className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent" required />
                <p className="text-xs text-gray-500 mt-1">⚠️ No use tildes ni letra ñ. Solo letras, números, espacios, # , -</p>
              </div>
            </div>
          </div>
          <div>
            <div className="border-l-4 border-teal-600 pl-4 mb-6">
              <h2 className="text-xl font-bold text-gray-800">Información Académica</h2>
              <p className="text-sm text-gray-600">Datos de programa y semestre</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Programa Académico <span className="text-red-500">*</span>
                </label>
                <select name="codigo_programa" value={formData.codigo_programa} onChange={handleChange} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent" required>
                  <option value="">Seleccione un programa</option>
                  {PROGRAMAS.map(prog => (<option key={prog.codigo} value={prog.codigo}>{prog.nombre}</option>))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Semestre Actual <span className="text-red-500">*</span>
                </label>
                <select name="semestre" value={formData.semestre} onChange={handleChange} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent" required>
                  <option value="">Seleccione</option>
                  {[1,2,3,4,5,6,7,8,9,10].map(sem => (<option key={sem} value={sem}>{sem}</option>))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Periodo Académico <span className="text-red-500">*</span>
                </label>
                <select name="periodo" value={formData.periodo} onChange={handleChange} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent" required>
                  <option value="">Seleccione</option>
                  <option value="1">Periodo 1</option>
                  <option value="2">Periodo 2</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Año de Ingreso <span className="text-red-500">*</span>
                </label>
                <input type="number" name="anio_ingreso" value={formData.anio_ingreso} onChange={handleChange} min="2010" max={new Date().getFullYear()} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent" required />
              </div>
            </div>
          </div>
          <div>
            <div className="border-l-4 border-teal-600 pl-4 mb-6">
              <h2 className="text-xl font-bold text-gray-800">Cuenta y Contraseña</h2>
              <p className="text-sm text-gray-600">Credenciales de acceso</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Correo Electrónico <span className="text-red-500">*</span>
                </label>
                <input type="email" name="correo" value={formData.correo} onChange={handleChange} placeholder="estudiante@unicesar.edu.co" className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Contraseña <span className="text-red-500">*</span>
                </label>
                <input type="password" name="contraseña" value={formData.contraseña} onChange={handleChange} placeholder="Mínimo 8 caracteres" className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent" required minLength="8" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Confirmar Contraseña <span className="text-red-500">*</span>
                </label>
                <input type="password" name="confirmar_contraseña" value={formData.confirmar_contraseña} onChange={handleChange} placeholder="Repita la contraseña" className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent" required />
              </div>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t">
            <button type="submit" disabled={isSubmitting} className={`flex-1 py-3 px-6 rounded-lg text-white font-semibold transition-all ${isSubmitting ? "bg-gray-400 cursor-not-allowed" : "bg-teal-600 hover:bg-teal-700 shadow-lg hover:shadow-xl"}`}>
              {isSubmitting ? " Registrando..." : " Registrarse"}
            </button>
            <Link to="/login" className="flex-1 py-3 px-6 rounded-lg text-gray-700 font-semibold border-2 border-gray-300 hover:border-teal-500 hover:text-teal-600 transition-all text-center">
               Ya tengo cuenta
            </Link>
          </div>
        </form>
      </section>
    </main>
  );
}

export default RegisterPage;
