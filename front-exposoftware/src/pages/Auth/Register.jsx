import { useState, useEffect } from "react";
import {
  validateField,
  validateAllFields,
  isNumericField,
  hasErrors,
} from "./validations";

function RegisterPage() {
  const [rol, setrol] = useState("");
  const [errors, setErrors] = useState({});

  const [formData, setFormData] = useState({
    nombres: "",
    apellidos: "",
    telefono: "",
    sexo: "",
    orientacionSexual: "",
    fechaNacimiento: "",
    fechaIngreso: "",
    fechaFinalizacion: "",
    departamentoNacimiento: "",
    municipioNacimineto: "",
    nacionalidad: "",
    ciudadResidencia: "",
    direccionResidencia: "",
    rol: "",
    tipoDocumento: "",
    numeroDocumento: "",
    correo: "",
    codigoPrograma: "",
    semestre: "",
    tipoDocente: "",
    sector: "",
    nombreEmpresa: "",
    categoriaDocente: "",
    titulado: "",
    contraseña: "",
    confirmarcontraseña: "",
  });

  // Imágenes del fondo
  const images = [
    "https://elpilon2024.s3.us-west-2.amazonaws.com/2024/12/IMG_0427.jpeg",
    "https://elpilon2024.s3.us-west-2.amazonaws.com/2025/04/upc-2.jpg",
  ];

  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Cambia automáticamente la imagen cada 5 segundos
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) =>
        prevIndex === images.length - 1 ? 0 : prevIndex + 1
      );
    }, 5000);
    return () => clearInterval(interval);
  }, [images.length]);

  // Manejo del cambio en los inputs
  const handleChange = (e) => {
    const { name, value } = e.target;

    if (isNumericField(name) && value !== "" && /[^\d]/.test(value)) {
      return;
    }

    setFormData((prev) => ({ ...prev, [name]: value }));


    const error = validateField(name, value, formData, rol);
    setErrors((prev) => ({ ...prev, [name]: error }));
  };

  // Manejo del envío del formulario
  const handleSubmit = (e) => {
    e.preventDefault();

    // Validar todos los campos
    const allErrors = validateAllFields(formData, rol);
    setErrors(allErrors);

    // Si no hay errores, proceder con el envío
    if (!hasErrors(allErrors)) {
      console.log("Formulario válido, enviando datos:", formData);
      // Aquí iría la lógica para enviar los datos al backend
    } else {
      console.log("Hay errores en el formulario:", allErrors);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center relative overflow-hidden py-20">
      {/* Carrusel de fondo */}
      {images.map((img, index) => (
        <div
          key={index}
          className={`absolute inset-0 bg-cover bg-center transition-all duration-1000 ease-in-out ${
            index === currentImageIndex
              ? "opacity-100 scale-100"
              : "opacity-0 scale-105"
          }`}
          style={{ backgroundImage: `url(${img})` }}
        ></div>
      ))}

      <div className="absolute inset-0 bg-gradient-to-br from-white/85 via-white/80 to-green-50/85"></div>

      {/* Contenido del formulario */}
      <section className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-3xl relative z-10">
        <h1 className="text-3xl font-bold text-center mb-2 text-green-700">
          Registro de Usuario
        </h1>
        <p className="text-center text-gray-600 mb-6">
          Completa los campos para crear tu cuenta en{" "}
          <span className="font-semibold text-green-600">Exposoftware</span>.
        </p>

        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
        >
          {/* ==== INFORMACIÓN PERSONAL ==== */}
          <div className="col-span-2 border-l-4 border-green-600 pl-2 mb-2">
            <h2 className="text-lg font-semibold text-gray-700">
              Información Personal
            </h2>
          </div>

          <div>
            <label className="block font-medium text-gray-700">Nombres</label>
            <input
              name="nombres" type="text" placeholder="Nombres"value={formData.nombres} onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-green-400 outline-none"
            />
            {errors.nombres && (
              <p className="text-red-500 text-sm mt-1">{errors.nombres}</p>
            )}
          </div>

          <div>
            <label className="block font-medium text-gray-700">Apellidos</label>
            <input
              name="apellidos" type="text" placeholder="Apellidos" value={formData.apellidos} onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-green-400 outline-none"
            />
            {errors.apellidos && (
              <p className="text-red-500 text-sm mt-1">{errors.apellidos}</p>
            )}
          </div>

          <div className="col-span-2">
            <label className="block font-medium text-gray-700">Teléfono</label>
            <input
              name="telefono" type="text" placeholder="Teléfono (+57 3011234567)" value={formData.telefono} onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-green-400 outline-none"
            />
            {errors.telefono && (
              <p className="text-red-500 text-sm mt-1">{errors.telefono}</p>
            )}
          </div>

          <div>
            <label className="block font-medium text-gray-700">Sexo</label>
            <select
              name="sexo" value={formData.sexo} onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-green-400 outline-none"
            >
              <option value="">Selecciona Sexo</option>
              <option value="hombre">Hombre</option>
              <option value="mujer">Mujer</option>
              <option value="hermafrodita">Hermafrodita</option>
            </select>
            {errors.sexo && (<p className="text-red-500 text-sm mt-1">{errors.sexo}</p>)}
          </div>

          <div>
            <label className="block font-medium text-gray-700">
              Orientación Sexual
            </label>
            <select
              name="orientacionSexual" value={formData.orientacionSexual} onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-green-400 outline-none"
            >
              <option value="">Selecciona Identidad Sexual</option>
              <option value="heterosexual">Heterosexual</option>
              <option value="homosexual">Homosexual</option>
              <option value="bisexual">Bisexual</option>
              <option value="asexual">Asexual</option>
            </select>
            {errors.orientacionSexual && (<p className="text-red-500 text-sm mt-1">{errors.orientacionSexual}</p>
            )}
          </div>

          <div>
            <label className="block font-medium text-gray-700">
              Fecha de Nacimiento
            </label>
            <input
              name="fechaNacimiento" type="date" value={formData.fechaNacimiento} onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-green-400 outline-none"
            />
            {errors.fechaNacimiento && (<p className="text-red-500 text-sm mt-1">{errors.fechaNacimiento}</p>
            )}
          </div>

          <div>
            <label className="block font-medium text-gray-700">
              Departamento de Nacimiento
            </label>
            <select
              name="departamentoNacimiento"value={formData.departamentoNacimiento}onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-green-400 outline-none"
            >
              <option value="">Selecciona Departamento</option>
              <option value="antioquia">Antioquia</option>
              <option value="cundinamarca">Cundinamarca</option>
              <option value="valle del cauca">Valle del Cauca</option>
            </select>
            {errors.departamentoNacimiento && (<p className="text-red-500 text-sm mt-1">{errors.departamentoNacimiento}</p>
            )}
          </div>

          <div>
            <label className="block font-medium text-gray-700">
              Municipio de Nacimiento
            </label>
            <select
              name="municipioNacimineto"value={formData.municipioNacimineto}onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-green-400 outline-none"
            >
              <option value="">Selecciona Municipio</option>
              <option value="medellin">Medellín</option>
              <option value="bogota">Bogotá</option>
              <option value="cali">Cali</option>
            </select>
            {errors.municipioNacimineto && (<p className="text-red-500 text-sm mt-1">{errors.municipioNacimineto}</p>
            )}
          </div>

          <div className="col-span-2">
            <label className="block font-medium text-gray-700">
              Nacionalidad
            </label>
            <select
              name="nacionalidad" value={formData.nacionalidad} onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-green-400 outline-none"
            >
              <option value="">Selecciona Nacionalidad</option>
              <option value="colombia">Colombia</option>
              <option value="venezuela">Venezuela</option>
              <option value="estados unidos">Estados Unidos</option>
            </select>
            {errors.nacionalidad && (<p className="text-red-500 text-sm mt-1">{errors.nacionalidad}</p>)}
          </div>

          <div>
            <label className="block font-medium text-gray-700">
              Ciudad de Residencia
            </label>
            <select
              name="ciudadResidencia" value={formData.ciudadResidencia} onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-green-400 outline-none"
            >
              <option value="">Selecciona Ciudad</option>
              <option value="cucuta">Cucuta</option>
              <option value="valledupar">Valledupar</option>
              <option value="bogota">Bogota</option>
            </select>
            {errors.ciudadResidencia && (<p className="text-red-500 text-sm mt-1">{errors.ciudadResidencia}</p>)}
          </div>

          <div>
            <label className="block font-medium text-gray-700">
              Dirección de Residencia
            </label>
            <input
              name="direccionResidencia" type="text" placeholder="Dirección de Residencia" value={formData.direccionResidencia} onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-green-400 outline-none"
            />
            {errors.direccionResidencia && (<p className="text-red-500 text-sm mt-1">{errors.direccionResidencia}</p>
            )}
          </div>

          {/* ==== IDENTIFICACIÓN ==== */}
          <div className="col-span-2 border-l-4 border-green-600 pl-2 mt-4 mb-2">
            <h2 className="text-lg font-semibold text-gray-700">
              Identificación
            </h2>
          </div>

          <div className="col-span-2">
            <label className="block font-medium text-gray-700">
              Selecciona Perfil
            </label>
            <select
              name="rol" value={formData.rol}  onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-green-400 outline-none"
            >
              <option value="">Selecciona Perfil</option>
              <option value="estudiante">Estudiante</option>
              <option value="profesor">Profesor</option>
              <option value="invitado">Invitado</option>
              <option value="egresado">Egresado</option>
            </select>
            {errors.rol && (<p className="text-red-500 text-sm mt-1">{errors.rol}</p>)}
          </div>

          <div>
            <label className="block font-medium text-gray-700">
              Tipo de Documento
            </label>
            <select
              name="tipoDocumento"
              value={formData.tipoDocumento}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-green-400 outline-none"
            >
              <option value="">Tipo de Documento</option>
              <option value="CC">CC: Cédula de Ciudadanía</option>
              <option value="TI">TI: Tarjeta de Identidad</option>
              <option value="CE">CE: Cédula Extranjera</option>
              <option value="PTE">PTE: Permiso Temporal de Extranjero</option>
              <option value="PAS">PAS: Pasaporte</option>
            </select>
            {errors.tipoDocumento && (<p className="text-red-500 text-sm mt-1">{errors.tipoDocumento}</p>)}
          </div>

          <div>
            <label className="block font-medium text-gray-700">
              Número de Documento
            </label>
            <input
              name="numeroDocumento" type="text" placeholder="Número de Documento" value={formData.numeroDocumento} onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-green-400 outline-none"
            />
            {errors.numeroDocumento && (<p className="text-red-500 text-sm mt-1">{errors.numeroDocumento}</p>)}
          </div>

          {/* ==== INFORMACIÓN ESTUDIANTE ==== */}
          {rol === "estudiante" && (
            <>
              <div className="col-span-2 border-l-4 border-green-600 pl-2 mt-4 mb-2">
                <h2 className="text-lg font-semibold text-gray-700">
                  Información Estudiante
                </h2>
              </div>

              <div className="col-span-2">
                <label className="block font-medium text-gray-700">
                  Correo Institucional
                </label>
                <input
                  name="correo" type="email" value={formData.correo} onChange={handleChange} placeholder="usuario@unicesar.edu.co"
                  className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-green-400 outline-none"
                />
                {errors.correo && (<p className="text-red-500 text-sm mt-1">{errors.correo}</p>)}
              </div>

              <div>
                <label className="block font-medium text-gray-700">
                  Codigo del Programa
                </label>
                <input
                  name="codigoPrograma" type="text" placeholder="Codigo del Programa" value={formData.codigoPrograma} onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-green-400 outline-none"
                />
                {errors.codigoPrograma && (<p className="text-red-500 text-sm mt-1">{errors.codigoPrograma}</p>)}
              </div>

              <div>
                <label className="block font-medium text-gray-700">
                  Semestre
                </label>
                <select
                  name="semestre" value={formData.semestre} onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-green-400 outline-none"
                >
                  <option value="">Selecciona Semestre</option>
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                  <option value="4">4</option>
                  <option value="5">5</option>
                  <option value="6">6</option>
                  <option value="7">7</option>
                  <option value="8">8</option>
                  <option value="9">9</option>
                  <option value="10">10</option>
                  <option value="+10">+10</option>
                </select>
                {errors.semestre && (<p className="text-red-500 text-sm mt-1">{errors.semestre}</p>)}
              </div>

              <div>
                <label className="block font-medium text-gray-700">
                  Fecha de Ingreso
                </label>
                <input
                  name="fechaIngreso" type="date" value={formData.fechaIngreso} onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-green-400 outline-none"
                />
              </div>
            </>
          )}

          {/* ==== INFORMACIÓN PROFESOR ==== */}
          {rol === "profesor" && (
            <>
              <div className="col-span-2 border-l-4 border-green-600 pl-2 mt-4 mb-2">
                <h2 className="text-lg font-semibold text-gray-700">
                  Información Profesor
                </h2>
              </div>

              <div className="col-span-2">
                <label className="block font-medium text-gray-700">
                  Correo Institucional
                </label>
                <input
                  name="correo" type="email" value={formData.correo} onChange={handleChange} placeholder="usuario@unicesar.edu.co"
                  className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-green-400 outline-none"
                />
                {errors.correo && (
                  <p className="text-red-500 text-sm mt-1">{errors.correo}</p>
                )}
              </div>

              <div>
                <label className="block font-medium text-gray-700">
                  Tipo de Docente
                </label>
                <select
                  name="tipoDocente" value={formData.tipoDocente} onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-green-400 outline-none"
                >
                  <option value="">Selecciona Tipo</option>
                  <option value="Interno">Interno</option>
                  <option value="Invitado">Invitado</option>
                  <option value="Externo">Externo</option>
                </select>
                {errors.tipoDocente && (<p className="text-red-500 text-sm mt-1">{errors.tipoDocente}</p>)}
              </div>

              <div>
                <label className="block font-medium text-gray-700">
                  Codigo del Programa
                </label>
                <input
                  name="codigoPrograma" type="text" placeholder="Codigo del Programa" value={formData.codigoPrograma} onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-green-400 outline-none"
                />
                {errors.codigoPrograma && (<p className="text-red-500 text-sm mt-1">{errors.codigoPrograma}</p>)}
              </div>
            </>
          )}

          {/* ==== INFORMACIÓN INVITADO ==== */}
          {rol === "invitado" && (
            <>
              <div className="col-span-2 border-l-4 border-green-600 pl-2 mt-4 mb-2">
                <h2 className="text-lg font-semibold text-gray-700">
                  Información Invitado
                </h2>
              </div>

              <div className="col-span-2">
                <label className="block font-medium text-gray-700">
                  Correo Personal
                </label>
                <input
                  name="correo" type="email" placeholder="usuario@dominio.com" value={formData.correo} onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-green-400 outline-none"
                />
                {errors.correo && (<p className="text-red-500 text-sm mt-1">{errors.correo}</p>)}
              </div>

              <div>
                <label className="block font-medium text-gray-700">
                  Sector
                </label>
                <select
                  name="sector" value={formData.sector} onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-green-400 outline-none"
                >
                  <option value="">Selecciona Sector</option>
                  <option value="agricola">Agricola</option>
                </select>
                {errors.sector && (<p className="text-red-500 text-sm mt-1">{errors.sector}</p>)}
              </div>

              <div>
                <label className="block font-medium text-gray-700">
                  Nombre de la Empresa
                </label>
                <select
                  name="nombreEmpresa" value={formData.nombreEmpresa} onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-green-400 outline-none"
                >
                  <option value="">Selecciona</option>
                  <option value="AgroSostenible">AgroSostenible</option>
                </select>
                {errors.nombreEmpresa && (<p className="text-red-500 text-sm mt-1">{errors.nombreEmpresa}</p>)}
              </div>
            </>
          )}

          {/* ==== INFORMACIÓN EGRESADO ==== */}
          {rol === "egresado" && (
            <>
              <div className="col-span-2 border-l-4 border-green-600 pl-2 mt-4 mb-2">
                <h2 className="text-lg font-semibold text-gray-700">
                  Información Egresado
                </h2>
              </div>

              <div className="col-span-2">
                <label className="block font-medium text-gray-700">
                  Correo Institucional
                </label>
                <input
                  name="correo" type="email" placeholder="usuario@unicesar.edu.co" value={formData.correo} onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-green-400 outline-none"
                />
                {errors.correo && (<p className="text-red-500 text-sm mt-1">{errors.correo}</p>)}
              </div>

              <div>
                <label className="block font-medium text-gray-700">
                  Titulado
                </label>
                <select
                  name="titulado" value={formData.titulado} onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-green-400 outline-none"
                >
                  <option value="">Selecciona</option>
                  <option value="si">Si</option>
                  <option value="no">No</option>
                </select>
                {errors.titulado && (<p className="text-red-500 text-sm mt-1">{errors.titulado}</p>)}
              </div>

              <div>
                <label className="block font-medium text-gray-700">
                  Año de Finalización
                </label>
                <input
                  name="fechaFinalizacion" type="date" value={ormData.fechaFinalizacion} onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-green-400 outline-none"
                />
              </div>
            </>
          )}

          {/* ==== CREDENCIALES ==== */}
          <div className="col-span-2 border-l-4 border-green-600 pl-2 mt-4 mb-2">
            <h2 className="text-lg font-semibold text-gray-700">
              Credenciales de Acceso
            </h2>
          </div>

          <div>
            <label className="block font-medium text-gray-700">
              Contraseña
            </label>
            <input
              name="contraseña" type="password" placeholder="Contraseña" value={formData.contraseña} onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-green-400 outline-none"
            />
            {errors.contraseña && (<p className="text-red-500 text-sm mt-1">{errors.contraseña}</p>)}
          </div>

          <div>
            <label className="block font-medium text-gray-700">
              Confirmar Contraseña
            </label>
            <input
              name="confirmarcontraseña" type="password" placeholder="Confirmar Contraseña" value={formData.confirmarcontraseña} onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-green-400 outline-none"
            />
            {errors.confirmarcontraseña && (<p className="text-red-500 text-sm mt-1">{errors.confirmarcontraseña}</p>)}
          </div>

          <div className="col-span-2 mt-4">
            <button
              type="submit"
              className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition"
            >
              Registrar Usuario
            </button>
          </div>
        </form>
      </section>
    </main>
  );
}

export default RegisterPage;
