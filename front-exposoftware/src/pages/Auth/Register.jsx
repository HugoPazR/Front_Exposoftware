import { useState, useEffect, useMemo } from "react";
import { Loader2, ChevronDown, ChevronUp, AlertCircle } from "lucide-react";
import {
  validateAllFields,
  hasErrors,
} from "./Register/validations";
import {
  handleChange as handleChangeUtil,
  handleSelectChange as handleSelectChangeUtil,
  handleDepartamentoChange as handleDepartamentoChangeUtil,
  handlePhoneChange as handlePhoneChangeUtil,
  handleSubmit as handleSubmitUtil,
  getInputClassName as getInputClassNameUtil,
} from "./Register/formHandlers";
import RoleSections from "./RoleSections/RoleSections";
import countryList from "react-select-country-list";
import colombia from "../../assets/colombia-json-master/colombia.json";
import BackgroundCarousel from "./Register/BackgroundCarousel";
import MessageAlerts from "./Register/MessageAlerts";
import PersonalInfoSection from "./Register/PersonalInfoSection";
import IdentificationSection from "./Register/IdentificationSection";
import CredentialsSection from "./Register/CredentialsSection";
import * as AcademicService from "../../Services/AcademicService";

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
  
  // Estados para términos y condiciones
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [showTerms, setShowTerms] = useState(false);
  
  // Estados para datos académicos
  const [facultades, setFacultades] = useState([]);
  const [programas, setProgramas] = useState([]);
  const [cargandoFacultades, setCargandoFacultades] = useState(false);
  const [cargandoProgramas, setCargandoProgramas] = useState(false);
  
  const [formData, setFormData] = useState({
    primerNombre: "",
    segundoNombre: "",
    primerApellido: "",
    segundoApellido: "",
    telefono: "",
    genero: "",
    orientacionSexual: "",
    fechaNacimiento: "",
    fechaIngreso: "",
    fechaFinalizacion: "",
    departamentoResidencia: "",
    ciudadResidencia: "",
    nacionalidad: "",
    paisNacimiento: "",
    direccionResidencia: "",
    rol: "",
    tipoDocumento: "",
    numeroDocumento: "",
    correo: "",
    programa: "",
    facultad: "",
    semestre: "",
    sector: "",
    intitucionOrigen: "",
    nombreEmpresa: "",
    periodo: "",
    titulado: "",
    tituloObtenido: "",
    contraseña: "",
    confirmarcontraseña: "",
  });

  // Limpiar campos específicos según el rol
  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      correo: "",
      programa: "",
      facultad: "",
      semestre: "",
      sector: "",
      nombreEmpresa: "",
      periodo: "",
      titulado: "",
      tituloObtenido: "",
      fechaIngreso: "",
      fechaFinalizacion: "",
      intitucionOrigen: "",
    }));
    
    const camposRol = [
      "correo", "programa", "facultad", "semestre", 
      "sector", "nombreEmpresa", "periodo", "titulado", "tituloObtenido",
      "fechaIngreso", "fechaFinalizacion", "intitucionOrigen"
    ];
    
    setErrors((prev) => {
      const newErrors = { ...prev };
      camposRol.forEach(campo => delete newErrors[campo]);
      return newErrors;
    });
    
    setSuccessFields((prev) => {
      const newSuccess = { ...prev };
      camposRol.forEach(campo => delete newSuccess[campo]);
      return newSuccess;
    });
  }, [rol]);

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

  // Cargar facultades al montar el componente
  useEffect(() => {
    const cargarFacultades = async () => {
      setCargandoFacultades(true);
      try {
        const facultadesData = await AcademicService.obtenerFacultades();
        setFacultades(facultadesData);
        console.log('✅ Facultades cargadas:', facultadesData);
      } catch (error) {
        console.error('❌ Error al cargar facultades:', error);
        setMensajeError('No se pudieron cargar las facultades. Intenta recargar la página.');
      } finally {
        setCargandoFacultades(false);
      }
    };

    cargarFacultades();
  }, []);

  // Cargar programas cuando se selecciona una facultad
  useEffect(() => {
    const cargarProgramas = async () => {
      if (!formData.facultad) {
        setProgramas([]);
        return;
      }

      setCargandoProgramas(true);
      try {
        const programasData = await AcademicService.obtenerProgramasPorFacultad(formData.facultad);
        setProgramas(programasData);
        console.log('✅ Programas cargados para facultad', formData.facultad, ':', programasData);
        
        // Limpiar programa seleccionado si ya no está disponible
        if (formData.programa && !programasData.find(p => p.codigo === formData.programa)) {
          setFormData(prev => ({ ...prev, programa: "" }));
        }
      } catch (error) {
        console.error('❌ Error al cargar programas:', error);
        setProgramas([]);
        setMensajeError('No se pudieron cargar los programas. Intenta seleccionar otra facultad.');
      } finally {
        setCargandoProgramas(false);
      }
    };

    cargarProgramas();
  }, [formData.facultad]);

  // Handlers
  const handleChange = (e) => {
    handleChangeUtil(e, formData, setFormData, setErrors, setSuccessFields, rol, setrol);
    if (e.target.name === "rol") {
      setrol(e.target.value);
    }
  };

  const handleSelectChange = (name, option) => {
    handleSelectChangeUtil(name, option, formData, setFormData, setErrors, setSuccessFields, rol);
  };

  const handlePhoneChange = (value) => {
    handlePhoneChangeUtil(value, formData, setFormData, setErrors, setSuccessFields, rol);
  };

  const handleDepartamentoChange = (e) => {
    handleDepartamentoChangeUtil(e, formData, setFormData, setciudades, setErrors, setSuccessFields, rol, colombia);
  };

  const handleTermsChange = (e) => {
    setAcceptedTerms(e.target.checked);
  };

  const handleSubmit = (e) => {
    // Validar que acepte términos y condiciones
    if (!acceptedTerms) {
      setMensajeError("Debes aceptar los términos y condiciones para continuar.");
      return;
    }
    
    handleSubmitUtil(e, formData, rol, setCargando, setMensajeExito, setMensajeError, setErrors, validateAllFields, hasErrors);
  };

  const getInputClassName = (fieldName) => {
    return getInputClassNameUtil(fieldName, errors, successFields, cargando);
  };

  return (
    <main className="min-h-screen flex items-center justify-center relative overflow-hidden py-20">
      <BackgroundCarousel />

      {/* Contenido del formulario */}
      <section className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-3xl relative z-10">
        <h1 className="text-3xl font-bold text-center mb-2 text-green-700">
          Registro de Usuario
        </h1>
        <p className="text-center text-gray-600 mb-6">
          Completa los campos para crear tu cuenta en{" "}
          <span className="font-semibold text-green-600">Exposoftware</span>.
        </p>

        <MessageAlerts 
          mensajeExito={mensajeExito} 
          mensajeError={mensajeError} 
        />

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-4 text-xs md:text-base auto-rows-max"> 
          <PersonalInfoSection
            formData={formData}
            errors={errors}
            successFields={successFields}
            handleChange={handleChange}
            handleSelectChange={handleSelectChange}
            handlePhoneChange={handlePhoneChange}
            handleDepartamentoChange={handleDepartamentoChange}
            getInputClassName={getInputClassName}
            cargando={cargando}
            options={options}
            ciudades={ciudades}
            colombia={colombia}
          />

          <IdentificationSection
            formData={formData}
            errors={errors}
            successFields={successFields}
            handleChange={handleChange}
            getInputClassName={getInputClassName}
            cargando={cargando}
            rol={rol}
          />

          <RoleSections 
            rol={rol} 
            formData={formData} 
            errors={errors} 
            handleChange={handleChange} 
            cargando={cargando} 
            successFields={successFields} 
            getInputClassName={getInputClassName}
            facultades={facultades}
            programas={programas}
            cargandoFacultades={cargandoFacultades}
            cargandoProgramas={cargandoProgramas}
          />

          <CredentialsSection
            formData={formData}
            errors={errors}
            handleChange={handleChange}
            getInputClassName={getInputClassName}
            cargando={cargando}
            showPassword={showPassword}
            setShowPassword={setShowPassword}
            showConfirmPassword={showConfirmPassword}
            setShowConfirmPassword={setShowConfirmPassword}
          />

          {/* SECCIÓN DE TÉRMINOS Y CONDICIONES */}
          <div className="col-span-2 border-t pt-6 mt-4">
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              {/* Botón para expandir/contraer */}
              <button
                type="button"
                onClick={() => setShowTerms(!showTerms)}
                className="w-full flex items-center justify-between hover:bg-gray-100 p-2 rounded transition-colors"
              >
                <span className="font-semibold text-gray-800 text-sm md:text-base">
                  Términos y Condiciones
                </span>
                {showTerms ? (
                  <ChevronUp size={20} className="text-green-600" />
                ) : (
                  <ChevronDown size={20} className="text-green-600" />
                )}
              </button>

              {/* Contenido expandible */}
              {showTerms && (
                <div className="mt-4 bg-white p-4 rounded border border-gray-200 max-h-64 overflow-y-auto text-xs md:text-sm text-gray-700 space-y-3">
                  <p>
                    <strong>1. Aceptación de los Términos</strong>
                    <br />
                    Al registrarte en Exposoftware, aceptas cumplir con estos términos y condiciones. Si no estás de acuerdo, no debes usar nuestro servicio.
                  </p>

                  <p>
                    <strong>2. Uso de Datos Personales</strong>
                    <br />
                    Recopilamos y procesamos tus datos personales según nuestra Política de Privacidad. Utilizamos tu información para:
                    <br />
                    • Crear y mantener tu cuenta
                    <br />
                    • Comunicarnos contigo sobre actualizaciones
                    <br />
                    • Mejorar nuestros servicios
                  </p>

                  <p>
                    <strong>3. Consentimiento para Comunicaciones</strong>
                    <br />
                    Consientes recibir correos electrónicos, notificaciones y mensajes relacionados con tu registro y actividad en la plataforma.
                  </p>

                  <p>
                    <strong>4. Responsabilidad del Usuario</strong>
                    <br />
                    Eres responsable de mantener la confidencialidad de tu contraseña y de toda actividad que ocurra bajo tu cuenta.
                  </p>

                  <p>
                    <strong>5. Modificación de Términos</strong>
                    <br />
                    Nos reservamos el derecho de modificar estos términos en cualquier momento. Los cambios entrarán en vigor inmediatamente.
                  </p>

                  <p>
                    <strong>6. Limitación de Responsabilidad</strong>
                    <br />
                    Exposoftware no será responsable de daños indirectos o consecuentes derivados del uso de nuestro servicio.
                  </p>

                  <p>
                    <strong>7. Protección de Datos</strong>
                    <br />
                    Tus datos están protegidos con los más altos estándares de seguridad. Nos comprometemos a proteger tu privacidad y cumplir con todas las regulaciones aplicables.
                  </p>
                </div>
              )}

              {/* Checkbox de aceptación */}
              <div className="mt-4 flex items-start gap-3 p-2 rounded hover:bg-gray-100 transition-colors">
                <input
                  type="checkbox"
                  id="termsCheckbox"
                  checked={acceptedTerms}
                  onChange={handleTermsChange}
                  className="mt-1 w-5 h-5 text-green-600 rounded focus:ring-2 focus:ring-green-500 cursor-pointer accent-green-600"
                />
                <label
                  htmlFor="termsCheckbox"
                  className="text-xs md:text-sm text-gray-700 cursor-pointer leading-tight"
                >
                  Acepto los{" "}
                  <span className="font-semibold text-green-600">
                    términos y condiciones
                  </span>
                  {" "}y autorizo el procesamiento de mis datos personales conforme a la política de privacidad de{" "}
                  <span className="font-semibold text-green-600">Exposoftware</span>.
                </label>
              </div>

              {/* Advertencia si no está aceptado */}
              {!acceptedTerms && (
                <div className="mt-3 flex items-start gap-2 p-2 bg-red-50 rounded border border-red-200">
                  <AlertCircle size={16} className="text-red-600 mt-0.5 flex-shrink-0" />
                  <p className="text-xs text-red-700">
                    Debes aceptar los términos y condiciones para continuar con el registro.
                  </p>
                </div>
              )}
            </div>
          </div>

          <div className="col-span-2 mt-4">
            <button 
              type="submit" 
              disabled={cargando || !acceptedTerms} 
              className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white py-3 rounded-lg font-semibold transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
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
        <div className="mt-6 text-center">
          <p className="text-gray-600">
            ¿Ya tienes una cuenta?{" "}
            <a 
              href="/login" 
              className="text-green-600 hover:text-green-700 font-semibold hover:underline transition-colors"
            >
              Inicia sesión aquí
            </a>
          </p>
        </div>
      </section>
              
      <style>{`
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