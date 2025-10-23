import { useState, useEffect } from "react";
import {validateField,validateAllFields,isNumericField,hasErrors,validatePhone,formatColombianPhone}
from "./validations";
import RoleSections from "./RoleSections"; // 👈 importa el nuevo componente
//import 'react-international-phone/style.css';
import PhoneInput from "react-phone-input-2";

import 'react-phone-input-2/lib/style.css';
import { parsePhoneNumberFromString } from 'libphonenumber-js';

import countryList from 'react-select-country-list';
import colombia from "../../assets/colombia-json-master/colombia.json"
import vista from "../../assets/icons/vista.png"
import esconder from "../../assets/icons/esconder.png"
import Select from 'react-select';
import { useMemo } from 'react';

function RegisterPage() {
  const [errors, setErrors] = useState({});
  const options = useMemo(() => countryList().getData(), []);

  const [ciudades, setciudades] = useState([]);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

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
    departamentoNacimiento: "",
    ciudadNacimiento: "",
    nacionalidad: "",
    paisResidencia: "",
    ciudadResidencia: "",
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

  useEffect(() => {
  setFormData({
    correo: "",
    codigoPrograma: "",
    semestre: "",
    sector: "",
    nombreEmpresa: "",
    periodo: "",
    titulado: "",
  });
}, [rol]);

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
  let cleanValue = value;

  // 🔹 Limpiar caracteres no alfabéticos en campos de texto (elimina números automáticamente)
  if (name === "nombres" || name === "apellidos" || name === "ciudadResidencia") {
    cleanValue = value.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ\s]/g, "");
  }

  // 🔹 Limpiar caracteres no numéricos en campos numéricos
  if (isNumericField(name)) {
    cleanValue = value.replace(/[^\d]/g, "");
  }

  // 🔹 Permitir alfanumérico en código de programa
  if (name === "codigoPrograma") {
    cleanValue = value.replace(/[^a-zA-Z0-9\s-]/g, "");
  }

  if (name === "rol") {
    setrol(cleanValue);
  }

  setFormData((prev) => {
    const updatedForm = { ...prev, [name]: cleanValue };

    const error = validateField(name, cleanValue, updatedForm, name === "rol" ? cleanValue : rol);
    setErrors((prevErrors) => ({ ...prevErrors, [name]: error }));

    return updatedForm;
  });
};


  // Manejo de cambios en Selects (react-select)
  const handleSelectChange = (name, option) => {
    const value = option ? option.value : "";

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Validar el campo correspondiente
    const error = validateField(name, value, formData, rol);
    setErrors((prev) => ({ ...prev, [name]: error }));
  };

  // 🔹 Desactivar Departamento y Municipio si el país no es Colombia
  useEffect(() => {
    if (formData.nacionalidad !== "CO") { // "CO" es el código ISO de Colombia en react-select-country-list
      setFormData((prev) => ({
        ...prev,
        departamentoNacimiento: "",
        ciudadNacimiento: "",
      }));
      setciudades([]); // limpia lista de ciudades
    }
  }, [formData.nacionalidad]);

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

          <div>
            <label className="block font-medium text-gray-700">Teléfono</label>
            <div className="w-full border border-gray-300 rounded-lg focus-within:ring-2 focus-within:ring-green-400 focus-within:border-green-400 transition duration-200">
              <PhoneInput
                country={"co"}
                enableSearch={true}
                disableDropdown={false}
                countryCodeEditable={false}
                value={formData.telefono}
                onChange={(value, country, e, formattedValue) => {
                  const countryCode = country.dialCode;
                  const countryISO = country.countryCode;
                  
                  let phone = value;

                  // 🇨🇴 Si es Colombia, forzar el 3 inicial
                  if (countryISO === "co") {
                    phone = formatColombianPhone(phone, countryCode);
                  }

                  // 🔹 Validar teléfono según el país
                  validatePhone(phone, countryCode, setErrors);

                  // 🔹 Guardar con formato +XX
                  setFormData((prev) => ({
                    ...prev,
                    telefono: value.startsWith("+") ? value : "+" + value,
                  }));
                }}
                inputClass="!border-none !outline-none !shadow-none !bg-transparent w-full p-2"
                buttonClass="!border-none !bg-transparent hover:bg-gray-100 !rounded-l-lg"
                dropdownClass="!shadow-lg !border !border-gray-200"
                searchClass="!px-3 !py-2"
                placeholder="3001234567"
              />
            </div>
            {errors.telefono && (
              <p className="text-red-500 text-sm mt-1">{errors.telefono}</p>
            )}
          </div>

          <div>
            <label className="block font-medium text-gray-700">genero</label>
            <select
              name="genero" value={formData.genero} onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-green-400 outline-none"
            >
              <option value="">Selecciona genero</option>
              <option value="hombre">Hombre</option>
              <option value="mujer">Mujer</option>
              <option value="hermafrodita">Hermafrodita</option>
            </select>
            {errors.genero && (<p className="text-red-500 text-sm mt-1">{errors.genero}</p>)}
          </div>

          <div>
            <label className="block font-medium text-gray-700">
              Orientación Sexual
            </label>
            <Select
              name="orientacionSexual"
              options={[
                { value: "", label: "Selecciona Orientacion" },
                { value: "heterosexual", label: "Heterosexual" },
                { value: "homosexual", label: "Homosexual" },
                { value: "bisexual", label: "Bisexual" },
                { value: "pansexual", label: "Pansexual" },
                { value: "asexual", label: "Asexual" },
                { value: "Transexual", label: "Transexual" },
                { value: "No-Binario", label: "No-Binario" },
                { value: "Otro", label: "Otro" },
              ]}
              placeholder="Selecciona Identidad Sexual"
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
              classNamePrefix="react-select"
              styles={{
                control: (base) => ({...base,borderColor: "#d1d5db",borderRadius: "0.5rem",padding: "2px","&:hover": { borderColor: "#16a34a" },boxShadow: "0 0 0 1px #d1d5db",
                }),
              }}
            />
            {errors.orientacionSexual && (<p className="text-red-500 text-sm mt-1">{errors.orientacionSexual}</p>)}
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

          <div className="col-span-2">
            <label className="block font-medium text-gray-700">
              Nacionalidad
            </label>
            <Select
              name="nacionalidad" options={options} placeholder="Selecciona Nacionalidad"
              value={
                formData.nacionalidad
                  ? options.find(
                      (option) => option.value === formData.nacionalidad
                    )
                  : null
              }
              onChange={(option) => handleSelectChange("nacionalidad", option)}
              classNamePrefix="react-select"
              styles={{
                control: (base) => ({...base,borderColor: "#d1d5db",borderRadius: "0.5rem",padding: "2px","&:hover": { borderColor: "#16a34a" },boxShadow: "0 0 0 1px #d1d5db",}),
              }}
            />
            {errors.nacionalidad && (<p className="text-red-500 text-sm mt-1">{errors.nacionalidad}</p>)}
          </div>

          <div>
            <label className="block font-medium text-gray-700">
              Departamento de Nacimiento
            </label>
            <select
              name="departamentoNacimiento" value={formData.departamentoNacimiento}
              onChange={(e) => {
                const selectedDepartamento = e.target.value;
                setFormData((prev) => ({
                  ...prev,
                  departamentoNacimiento: selectedDepartamento,
                  ciudadNacimiento: "",
                }));

                const depto = colombia.find((d) => d.departamento === selectedDepartamento);
                setciudades(depto && Array.isArray(depto.ciudades) ? depto.ciudades : []);

                const error = validateField("departamentoNacimiento",selectedDepartamento,formData,rol);
                setErrors((prev) => ({...prev,departamentoNacimiento: error,}));
              }}
              disabled={formData.nacionalidad !== "CO"}
              className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-green-400 outline-none"
            >
              <option value="">Selecciona Departamento</option>
              {colombia.map((d) => (
                <option key={d.departamento} value={d.departamento}>
                  {d.departamento}
                </option>
              ))}
            </select>
            {errors.departamentoNacimiento && (<p className="text-red-500 text-sm mt-1">{errors.departamentoNacimiento}</p>)}
          </div>

          <div>
            <label className="block font-medium text-gray-700">
              Ciudad de Nacimiento
            </label>
            <select
              name="ciudadNacimiento" value={formData.ciudadNacimiento} onChange={handleChange} disabled={!formData.departamentoNacimiento || formData.nacionalidad !== "CO"}
              className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-green-400 outline-none"
            >
              <option value="">Selecciona Municipio</option>
              {ciudades.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>
            {errors.ciudadNacimiento && (<p className="text-red-500 text-sm mt-1"> {errors.ciudadNacimiento} </p>)}
          </div>

          <div className="col-span-2">
            <label className="block font-medium text-gray-700">
              Pais de Recidencia
            </label>
            <Select
              name="paisResidencia" options={options} placeholder="Selecciona Nacionalidad"
              value={
                formData.paisResidencia
                  ? options.find(
                      (option) => option.value === formData.paisResidencia
                    )
                  : null
              }
              onChange={(option) => handleSelectChange("paisResidencia", option)}
              classNamePrefix="react-select"
              styles={{
                control: (base) => ({...base,borderColor: "#d1d5db",borderRadius: "0.5rem",padding: "2px","&:hover": { borderColor: "#16a34a" },boxShadow: "0 0 0 1px #d1d5db",}),
              }}
            />
            {errors.paisResidencia && (<p className="text-red-500 text-sm mt-1">{errors.paisResidencia}</p>)}
          </div>

          

          <div>
            <label className="block font-medium text-gray-700">
              Ciudad de Residencia
            </label>
            <input
              type="text" name="ciudadResidencia" value={formData.ciudadResidencia} onChange={handleChange}
              placeholder="Escribe tu ciudad"
              className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-green-400 outline-none"
            />
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
              name="tipoDocumento" value={formData.tipoDocumento} onChange={handleChange}
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
              name="numeroDocumento" type="text" maxLength="10" placeholder="Número de Documento" value={formData.numeroDocumento} onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-green-400 outline-none"
            />
            {errors.numeroDocumento && (<p className="text-red-500 text-sm mt-1">{errors.numeroDocumento}</p>)}
          </div>

          <RoleSections
            rol={rol}
            formData={formData}
            errors={errors}
            handleChange={handleChange}
          />

          {/* ==== CREDENCIALES ==== */}
          <div className="col-span-2 border-l-4 border-green-600 pl-2 mt-4 mb-2">
            <h2 className="text-lg font-semibold text-gray-700">
              Credenciales de Acceso
            </h2>
          </div>

          <div className="relative">
            <label className="block font-medium text-gray-700">Contraseña</label>
            <div className="relative">
              <input
                name="contraseña" type={showPassword ? "text" : "password"} placeholder="Contraseña" value={formData.contraseña} onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg p-2 pr-10 focus:ring-2 focus:ring-green-400 outline-none"
              />
              <button
                type="button" onClick={() => setShowPassword((prev) => !prev)}
                className="absolute inset-y-0 right-2 flex items-center text-gray-500 hover:text-green-600"
              >
                <img
                  src={showPassword ? esconder : vista}
                  alt={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                  className="w-5 h-5 transition-transform duration-200 hover:scale-110"
                />
              </button>
            </div>
            {errors.contraseña && (
              <p className="text-red-500 text-sm mt-1">{errors.contraseña}</p>
            )}
          </div>

          <div className="relative">
            <label className="block font-medium text-gray-700">Confirmar Contraseña</label>
            <div className="relative">
              <input
                name="confirmarcontraseña" type={showConfirmPassword ? "text" : "password"} placeholder="Confirmar Contraseña" value={formData.confirmarcontraseña} onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg p-2 pr-10 focus:ring-2 focus:ring-green-400 outline-none"
              />
              <button
                type="button" onClick={() => setShowConfirmPassword((prev) => !prev)}
                className="absolute inset-y-0 right-2 flex items-center text-gray-500 hover:text-green-600"
              >
                <img
                  src={showConfirmPassword ? esconder : vista}
                  alt={showConfirmPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                  className="w-5 h-5 transition-transform duration-200 hover:scale-110"
                />
              </button>
            </div>
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
