import { useState, useEffect, useMemo } from "react";
import { Loader2 } from "lucide-react";
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

  const handleSubmit = (e) => {
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

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-4 text-xs md:text-base auto-rows-max">          <PersonalInfoSection
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

          <div className="col-span-2 mt-4">
            <button 
              type="submit" 
              disabled={cargando} 
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