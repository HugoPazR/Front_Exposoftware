import { useState, useEffect, useMemo } from "react";
import { AlertCircle, CheckCircle, Loader2 } from "lucide-react";
import {
  validateAllFields,
  hasErrors,
  validatePhone,
  formatColombianPhone,
} from "./Register/validations";
import {
  handleChange as handleChangeUtil,
  handleSelectChange as handleSelectChangeUtil,
  handleDepartamentoChange as handleDepartamentoChangeUtil,
  handlePhoneChange as handlePhoneChangeUtil,
  handleSubmit as handleSubmitUtil,
  getInputClassName as getInputClassNameUtil,
} from "./Register/formHandlers";
import RoleSections from "./Register/RoleSections";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import countryList from "react-select-country-list";
import colombia from "../../assets/colombia-json-master/colombia.json";
import vista from "../../assets/icons/vista.png";
import esconder from "../../assets/icons/esconder.png";
import Select from "react-select";

function RegisterPage() {
  const [errors, setErrors] = useState({});
  const [successFields, setSuccessFields] = useState({});
  const options = useMemo(() => countryList().getData(), []);
  const [ciudades, setciudades] = useState([]);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [cargando, setCargando] = useState(false);
  const [mensajeExito, setMensajeExito] = useState("");
  const [mensajeError, setMensajeError] = useState("");
  const [rol, setrol] = useState("");
  
  const [formData, setFormData] = useState({
    nombres: "",
    apellidos: "",
    telefono: "",
    genero: "",
    orientacionSexual: "",
    fechaNacimiento: "",
    fechaIngreso: "",
    fechaFinalizacion: "",
    departamentoResidencia: "",
    ciudadResidencia: "",
    nacionalidad: "",
    paisResidencia: "",
    direccionResidencia: "",
    rol: "",
    tipoDocumento: "",
    numeroDocumento: "",
    correo: "",
    codigoPrograma: "",
    semestre: "",
    sector: "",
    nombreEmpresa: "",
    periodo: "",
    titulado: "",
    contraseña: "",
    confirmarcontraseña: "",
  });

  // Limpiar campos específicos según el rol
  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      correo: "",
      codigoPrograma: "",
      semestre: "",
      sector: "",
      nombreEmpresa: "",
      periodo: "",
      titulado: "",
    }));
  }, [rol]);

  // Carrusel de imágenes
  const images = [
    "https://elpilon2024.s3.us-west-2.amazonaws.com/2024/12/IMG_0427.jpeg",
    "https://elpilon2024.s3.us-west-2.amazonaws.com/2025/04/upc-2.jpg",
  ];

  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) =>
        prevIndex === images.length - 1 ? 0 : prevIndex + 1
      );
    }, 5000);
    return () => clearInterval(interval);
  }, [images.length]);

  // Desactivar Departamento y Municipio si el país no es Colombia
  useEffect(() => {
    if (formData.nacionalidad !== "CO") {
      setFormData((prev) => ({
        ...prev,
        departamentoResidencia: "",
        ciudadResidencia: "",
      }));
      setciudades([]);
    }
  }, [formData.nacionalidad]);

  // Handlers llaman a las funciones utilitarias
  const handleChange = (e) => {
    handleChangeUtil(
      e,formData,setFormData,setErrors,setSuccessFields,rol,setrol
    );
  };

  const handleSelectChange = (name, option) => {
    handleSelectChangeUtil(
      name,option,formData,setFormData,setErrors,setSuccessFields,rol
    );
  };

  const handleDepartamentoChange = (e) => {
    handleDepartamentoChangeUtil(
      e,formData,setFormData,setciudades,setErrors,setSuccessFields,rol,colombia
    );
  };

  const handlePhoneChange = (value, country) => {
    handlePhoneChangeUtil(
      value,country,setFormData,setErrors,setSuccessFields,formatColombianPhone,validatePhone
    );
  };

  const handleSubmit = (e) => {
    handleSubmitUtil(
      e,formData,rol,setCargando,setMensajeExito,setMensajeError,setErrors,validateAllFields,hasErrors
    );
  };

  const getInputClassName = (fieldName) => {
    return getInputClassNameUtil(fieldName, errors, successFields, cargando);
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
      <section className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-3xl relative z-10">
        <h1 className="text-3xl font-bold text-center mb-2 text-green-700">
          Registro de Usuario
        </h1>
        <p className="text-center text-gray-600 mb-6">
          Completa los campos para crear tu cuenta en{" "}
          <span className="font-semibold text-green-600">Exposoftware</span>.
        </p>

        {mensajeExito && (
          <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-3 animate-fadeIn">
            <CheckCircle className="text-green-600 flex-shrink-0" size={24} />
            <p className="text-green-700 font-medium">{mensajeExito}</p>
          </div>
        )}

        {mensajeError && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3 animate-fadeIn">
            <AlertCircle className="text-red-600 flex-shrink-0" size={24} />
            <p className="text-red-700 font-medium">{mensajeError}</p>
          </div>
        )}

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

          <div className="relative">
            <label className="block font-medium text-gray-700 mb-1">
              Nombres *
            </label>
            <div className="relative">
              <input
                name="nombres" type="text" placeholder="Nombres" value={formData.nombres} onChange={handleChange} disabled={cargando} className={getInputClassName("nombres")}
              />
              {successFields.nombres && !errors.nombres && (
                <CheckCircle className="absolute right-3 top-3 text-green-500"size={20}/>)}
            </div>
            {errors.nombres && (<p className="text-red-500 text-sm mt-1 flex items-center gap-1"><AlertCircle size={14}/>{errors.nombres}</p>
            )}
          </div>

          <div className="relative">
            <label className="block font-medium text-gray-700 mb-1">
              Apellidos *
            </label>
            <div className="relative">
              <input
                name="apellidos" type="text" placeholder="Apellidos" value={formData.apellidos} onChange={handleChange} disabled={cargando}
                className={getInputClassName("apellidos")}
              />
              {successFields.apellidos && !errors.apellidos && (<CheckCircle className="absolute right-3 top-3 text-green-500"size={20}/>)}
            </div>
            {errors.apellidos && (<p className="text-red-500 text-sm mt-1 flex items-center gap-1"> <AlertCircle size={14} /> {errors.apellidos}</p>)}
          </div>

          <div>
            <label className="block font-medium text-gray-700 mb-1">
              Teléfono *
            </label>
            <div
              className={`w-full border rounded-lg transition-all ${
                errors.telefono
                  ? "border-red-500"
                  : successFields.telefono
                  ? "border-green-500"
                  : "border-gray-300"
              } ${cargando ? "bg-gray-100" : ""}`}
            >
              <PhoneInput
                country={"co"} 
                enableSearch={true} 
                disableDropdown={cargando} 
                countryCodeEditable={false} value={formData.telefono}
                disabled={cargando} onChange={handlePhoneChange} 
                inputClass="!border-none !outline-none !shadow-none !bg-transparent w-full p-2" buttonClass="!border-none !bg-transparent hover:bg-gray-100 !rounded-l-lg" 
                dropdownClass="!shadow-lg !border !border-gray-200" searchClass="!px-3 !py-2" placeholder="3001234567"
              />
            </div>
            {errors.telefono && (<p className="text-red-500 text-sm mt-1 flex items-center gap-1"><AlertCircle size={14} />{errors.telefono}</p>)}
          </div>

          <div>
            <label className="block font-medium text-gray-700 mb-1">
              Género *
            </label>
            <select
              name="genero" value={formData.genero} onChange={handleChange} disabled={cargando}
              className={getInputClassName("genero")}
            >
              <option value="">Selecciona Género</option>
              <option value="hombre">Hombre</option>
              <option value="mujer">Mujer</option>
              <option value="hermafrodita">Hermafrodita</option>
            </select>
            {errors.genero && (<p className="text-red-500 text-sm mt-1 flex items-center gap-1"><AlertCircle size={14}/>{errors.genero}</p>)}
          </div>

          <div>
            <label className="block font-medium text-gray-700 mb-1">
              Orientación Sexual *
            </label>
            <Select
              name="orientacionSexual"
              options={[
                { value: "", label: "Selecciona Orientación" },
                { value: "heterosexual", label: "Heterosexual" },
                { value: "homosexual", label: "Homosexual" },
                { value: "bisexual", label: "Bisexual" },
                { value: "pansexual", label: "Pansexual" },
                { value: "asexual", label: "Asexual" },
                { value: "Transexual", label: "Transexual" },
                { value: "No-Binario", label: "No-Binario" },
                { value: "Otro", label: "Otro" },
              ]}
              placeholder="Selecciona Orientación Sexual"
              value={
                formData.orientacionSexual
                  ? {
                      value: formData.orientacionSexual,
                      label:
                        formData.orientacionSexual.charAt(0).toUpperCase() +
                        formData.orientacionSexual.slice(1),
                    }
                  : null
              }
              onChange={(option) =>
                handleSelectChange("orientacionSexual", option)
              }
              isDisabled={cargando}
              classNamePrefix="react-select"
              styles={{
                control: (base) => ({
                  ...base,
                  borderColor: errors.orientacionSexual
                    ? "#ef4444"
                    : successFields.orientacionSexual
                    ? "#22c55e"
                    : "#d1d5db",
                  borderRadius: "0.5rem",
                  padding: "2px",
                  "&:hover": { borderColor: "#16a34a" },
                  boxShadow: "none",
                  backgroundColor: cargando ? "#f3f4f6" : "white",
                }),
              }}
            />
            {errors.orientacionSexual && (<p className="text-red-500 text-sm mt-1 flex items-center gap-1"><AlertCircle size={14} />{errors.orientacionSexual}</p>)}
          </div>

          <div>
            <label className="block font-medium text-gray-700 mb-1">
              Fecha de Nacimiento *
            </label>
            <input
              name="fechaNacimiento" type="date" value={formData.fechaNacimiento} onChange={handleChange} disabled={cargando}
              className={getInputClassName("fechaNacimiento")}
            />
            {errors.fechaNacimiento && (<p className="text-red-500 text-sm mt-1 flex items-center gap-1"><AlertCircle size={14} />{errors.fechaNacimiento}</p>)}
          </div>

          <div className="col-span-2">
            <label className="block font-medium text-gray-700 mb-1">
              Nacionalidad *
            </label>
            <Select
              name="paisResidencia"
              options={options}
              placeholder="Selecciona Nacionalidad"
              value={
                formData.paisResidencia
                  ? options.find(
                      (option) => option.value === formData.paisResidencia
                    )
                  : null
              }
              onChange={(option) =>
                handleSelectChange("paisResidencia", option)
              }
              isDisabled={cargando}
              classNamePrefix="react-select"
              styles={{
                control: (base) => ({
                  ...base,
                  borderColor: errors.paisResidencia
                    ? "#ef4444"
                    : successFields.paisResidencia
                    ? "#22c55e"
                    : "#d1d5db",
                  borderRadius: "0.5rem",
                  padding: "2px",
                  "&:hover": { borderColor: "#16a34a" },
                  backgroundColor: cargando ? "#f3f4f6" : "white",
                }),
              }}
            />
            {errors.paisResidencia && (<p className="text-red-500 text-sm mt-1 flex items-center gap-1"><AlertCircle size={14}/>{errors.paisResidencia}</p>)}
          </div>

          <div className="col-span-2">
            <label className="block font-medium text-gray-700 mb-1">
              País de Residencia *
            </label>
            <Select
              name="nacionalidad"
              options={options}
              placeholder="Selecciona País de Residencia"
              value={
                formData.nacionalidad
                  ? options.find(
                      (option) => option.value === formData.nacionalidad
                    )
                  : null
              }
              onChange={(option) => handleSelectChange("nacionalidad", option)}
              isDisabled={cargando}
              classNamePrefix="react-select"
              styles={{
                control: (base) => ({
                  ...base,
                  borderColor: errors.nacionalidad
                    ? "#ef4444"
                    : successFields.nacionalidad
                    ? "#22c55e"
                    : "#d1d5db",
                  borderRadius: "0.5rem",
                  padding: "2px",
                  "&:hover": { borderColor: "#16a34a" },
                  backgroundColor: cargando ? "#f3f4f6" : "white",
                }),
              }}
            />
            {errors.nacionalidad && (<p className="text-red-500 text-sm mt-1 flex items-center gap-1"><AlertCircle size={14} />{errors.nacionalidad}</p>)}
          </div>

          <div>
            <label className="block font-medium text-gray-700 mb-1">
              Departamento de Residencia{" "}
              {formData.nacionalidad === "CO" && "*"}
            </label>
            <select
              name="departamentoResidencia" value={formData.departamentoResidencia} onChange={handleDepartamentoChange} disabled={formData.nacionalidad !== "CO" || cargando}
              className={getInputClassName("departamentoResidencia")}
            >
              <option value="">Selecciona Departamento</option>
              {colombia.map((d) => (
                <option key={d.departamento} value={d.departamento}>
                  {d.departamento}
                </option>
              ))}
            </select>
            {errors.departamentoResidencia && (<p className="text-red-500 text-sm mt-1 flex items-center gap-1"><AlertCircle size={14} />{errors.departamentoResidencia}</p>)}
          </div>

          <div>
            <label className="block font-medium text-gray-700 mb-1">
              Ciudad de Residencia {formData.nacionalidad === "CO" && "*"}
            </label>
            <select
              name="ciudadResidencia" value={formData.ciudadResidencia} onChange={handleChange}
              disabled={
                !formData.departamentoResidencia ||
                formData.nacionalidad !== "CO" ||
                cargando
              }
              className={getInputClassName("ciudadResidencia")}
            >
              <option value="">Selecciona Municipio</option>
              {ciudades.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>
            {errors.ciudadResidencia && (<p className="text-red-500 text-sm mt-1 flex items-center gap-1"><AlertCircle size={14} />{errors.ciudadResidencia}</p>)}
          </div>

          <div className="col-span-2">
            <label className="block font-medium text-gray-700 mb-1">
              Dirección de Residencia *
            </label>
            <input
              name="direccionResidencia" type="text" placeholder="Dirección de Residencia" value={formData.direccionResidencia} onChange={handleChange} disabled={cargando}
              className={getInputClassName("direccionResidencia")}
            />
            {errors.direccionResidencia && (<p className="text-red-500 text-sm mt-1 flex items-center gap-1"><AlertCircle size={14} />{errors.direccionResidencia}</p>)}
          </div>

          <div className="col-span-2 border-l-4 border-green-600 pl-2 mt-4 mb-2">
            <h2 className="text-lg font-semibold text-gray-700">
              Identificación
            </h2>
          </div>

          <div className="col-span-2">
            <label className="block font-medium text-gray-700 mb-1">
              Selecciona Perfil *
            </label>
            <select
              name="rol" value={formData.rol} onChange={handleChange} disabled={cargando}
              className={getInputClassName("rol")}
            >
              <option value="">Selecciona Perfil</option>
              <option value="estudiante">Estudiante</option>
              <option value="invitado">Invitado</option>
              <option value="egresado">Egresado</option>
            </select>
            {errors.rol && (<p className="text-red-500 text-sm mt-1 flex items-center gap-1"><AlertCircle size={14} />{errors.rol}</p>)}
          </div>

          <div>
            <label className="block font-medium text-gray-700 mb-1">
              Tipo de Documento *
            </label>
            <select
              name="tipoDocumento" value={formData.tipoDocumento} onChange={handleChange} disabled={cargando}
              className={getInputClassName("tipoDocumento")}
            >
              <option value="">Tipo de Documento</option>
              <option value="CC">CC: Cédula de Ciudadanía</option>
              <option value="TI">TI: Tarjeta de Identidad</option>
              <option value="CE">CE: Cédula Extranjera</option>
              <option value="PTE">PTE: Permiso Temporal de Extranjero</option>
              <option value="PAS">PAS: Pasaporte</option>
            </select>
            {errors.tipoDocumento && (<p className="text-red-500 text-sm mt-1 flex items-center gap-1"><AlertCircle size={14} />{errors.tipoDocumento}</p>)}
          </div>

          <div>
            <label className="block font-medium text-gray-700 mb-1">
              Número de Documento *
            </label>
            <div className="relative">
              <input
                name="numeroDocumento" type="text" maxLength="10" placeholder="Número de Documento" value={formData.numeroDocumento} onChange={handleChange} disabled={cargando}
                className={getInputClassName("numeroDocumento")}
              />
              {successFields.numeroDocumento && !errors.numeroDocumento && (<CheckCircle className="absolute right-3 top-3 text-green-500" size={20}/>)}
            </div>
            {errors.numeroDocumento && (<p className="text-red-500 text-sm mt-1 flex items-center gap-1"><AlertCircle size={14} />{errors.numeroDocumento}</p>)}
          </div>

          {/* Secciones por Rol */}
          <RoleSections rol={rol} formData={formData} errors={errors} handleChange={handleChange} cargando={cargando} successFields={successFields} getInputClassName={getInputClassName}/>

          <div className="col-span-2 border-l-4 border-green-600 pl-2 mt-4 mb-2">
            <h2 className="text-lg font-semibold text-gray-700">
              Credenciales de Acceso
            </h2>
          </div>

          <div className="relative">
            <label className="block font-medium text-gray-700 mb-1">
              Contraseña *
            </label>
            <div className="relative">
              <input
                name="contraseña" type={showPassword ? "text" : "password"} placeholder="Contraseña" value={formData.contraseña} onChange={handleChange} disabled={cargando}
                className={getInputClassName("contraseña")}
              />
              <button type="button" onClick={() => setShowPassword((prev) => !prev)} disabled={cargando} className="absolute inset-y-0 right-2 flex items-center text-gray-500 hover:text-green-600 transition-colors">
                <img
                  src={showPassword ? esconder : vista}
                  alt={
                    showPassword ? "Ocultar contraseña" : "Mostrar contraseña"
                  }
                  className="w-5 h-5 transition-transform duration-200 hover:scale-110"
                />
              </button>
            </div>
            {errors.contraseña && (<p className="text-red-500 text-sm mt-1 flex items-center gap-1"><AlertCircle size={14} />{errors.contraseña}</p>)}
          </div>

          <div className="relative">
            <label className="block font-medium text-gray-700 mb-1">
              Confirmar Contraseña *
            </label>
            <div className="relative">
              <input
                name="confirmarcontraseña" type={showConfirmPassword ? "text" : "password"} placeholder="Confirmar Contraseña" value={formData.confirmarcontraseña} onChange={handleChange} disabled={cargando}
                className={getInputClassName("confirmarcontraseña")}
              />
              <button type="button" onClick={() => setShowConfirmPassword((prev) => !prev)} disabled={cargando} className="absolute inset-y-0 right-2 flex items-center text-gray-500 hover:text-green-600 transition-colors">
                <img
                  src={showConfirmPassword ? esconder : vista}
                  alt={
                    showConfirmPassword
                      ? "Ocultar contraseña"
                      : "Mostrar contraseña"
                  }
                  className="w-5 h-5 transition-transform duration-200 hover:scale-110"
                />
              </button>
            </div>
            {errors.confirmarcontraseña && (<p className="text-red-500 text-sm mt-1 flex items-center gap-1"><AlertCircle size={14} />{errors.confirmarcontraseña}</p>)}
          </div>

          <div className="col-span-2 mt-4">
            <button type="submit" disabled={cargando} className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white py-3 rounded-lg font-semibold transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2">
              {cargando ? (
                <>
                  <Loader2 className="animate-spin" size={20} />
                  Registrando usuario...
                </>
              ) : (
                "Registrar Usuario"
              )}
            </button>
          </div>
        </form>
      </section>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </main>
  );
}

export default RegisterPage;