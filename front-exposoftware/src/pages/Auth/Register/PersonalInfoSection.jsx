import { AlertCircle, CheckCircle } from "lucide-react";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import Select from "react-select";

const PersonalInfoSection = ({
  formData,
  errors,
  successFields,
  handleChange,
  handleSelectChange,
  handlePhoneChange,
  handleDepartamentoChange,
  getInputClassName,
  cargando,
  options,
  ciudades,
  colombia,
}) => {
  return (
    <>
      <div className="col-span-2 border-l-4 border-green-600 pl-2 mb-2">
        <h2 className="text-lg font-semibold text-gray-700">
          Información Personal
        </h2>
      </div>

      <div className="relative">
        <label className="block font-medium text-gray-700 mb-1">
          Primer Nombre *
        </label>
        <div className="relative">
          <input
            name="primerNombre"
            type="text"
            placeholder="Primer Nombre"
            value={formData.primerNombre}
            onChange={handleChange}
            disabled={cargando}
            className={getInputClassName("primerNombre")}
          />
          {successFields.primerNombre && !errors.primerNombre && (
            <CheckCircle className="absolute right-3 top-3 text-green-500" size={20} />
          )}
        </div>
        {errors.primerNombre && (
          <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
            <AlertCircle size={14} />
            {errors.primerNombre}
          </p>
        )}
      </div>

      <div className="relative">
        <label className="block font-medium text-gray-700 mb-1">
          Segundo Nombre (opcional)
        </label>
        <div className="relative">
          <input
            name="segundoNombre"
            type="text"
            placeholder="Segundo Nombre"
            value={formData.segundoNombre}
            onChange={handleChange}
            disabled={cargando}
            className={getInputClassName("segundoNombre")}
          />
          {successFields.segundoNombre && !errors.segundoNombre && (
            <CheckCircle className="absolute right-3 top-3 text-green-500" size={20} />
          )}
        </div>
        {errors.segundoNombre && (
          <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
            <AlertCircle size={14} />
            {errors.segundoNombre}
          </p>
        )}
      </div>

      <div className="relative">
        <label className="block font-medium text-gray-700 mb-1">
          Primer Apellido *
        </label>
        <div className="relative">
          <input
            name="primerApellido"
            type="text"
            placeholder="Primer Apellido"
            value={formData.primerApellido}
            onChange={handleChange}
            disabled={cargando}
            className={getInputClassName("primerApellido")}
          />
          {successFields.primerApellido && !errors.primerApellido && (
            <CheckCircle className="absolute right-3 top-3 text-green-500" size={20} />
          )}
        </div>
        {errors.primerApellido && (
          <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
            <AlertCircle size={14} />
            {errors.primerApellido}
          </p>
        )}
      </div>

      <div className="relative">
        <label className="block font-medium text-gray-700 mb-1">
          Segundo Apellido *
        </label>
        <div className="relative">
          <input
            name="segundoApellido"
            type="text"
            placeholder="Segundo Apellido"
            value={formData.segundoApellido}
            onChange={handleChange}
            disabled={cargando}
            className={getInputClassName("segundoApellido")}
          />
          {successFields.segundoApellido && !errors.segundoApellido && (
            <CheckCircle className="absolute right-3 top-3 text-green-500" size={20} />
          )}
        </div>
        {errors.segundoApellido && (
          <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
            <AlertCircle size={14} />
            {errors.segundoApellido}
          </p>
        )}
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
            countryCodeEditable={false}
            value={formData.telefono}
            onChange={handlePhoneChange}
            disabled={cargando}
            inputClass="!border-none !outline-none !shadow-none !bg-transparent w-full p-2"
            buttonClass="!border-none !bg-transparent hover:bg-gray-100 !rounded-l-lg"
            dropdownClass="!shadow-lg !border !border-gray-200"
            searchClass="!px-3 !py-2"
            placeholder="3001234567"
          />
        </div>
        {errors.telefono && (
          <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
            <AlertCircle size={14} />
            {errors.telefono}
          </p>
        )}
      </div>

      <div>
        <label className="block font-medium text-gray-700 mb-1">
          Género *
        </label>
        <select
          name="genero"
          value={formData.genero}
          onChange={handleChange}
          disabled={cargando}
          className={getInputClassName("genero")}
        >
          <option value="">Selecciona Género</option>
          <option value="hombre">Hombre</option>
          <option value="mujer">Mujer</option>
          <option value="hermafrodita">Hermafrodita</option>
        </select>
        {errors.genero && (
          <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
            <AlertCircle size={14} />
            {errors.genero}
          </p>
        )}
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
          onChange={(option) => handleSelectChange("orientacionSexual", option)}
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
        {errors.orientacionSexual && (
          <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
            <AlertCircle size={14} />
            {errors.orientacionSexual}
          </p>
        )}
      </div>

      <div>
        <label className="block font-medium text-gray-700 mb-1">
          Fecha de Nacimiento *
        </label>
        <input
          name="fechaNacimiento"
          type="date"
          value={formData.fechaNacimiento}
          onChange={handleChange}
          disabled={cargando}
          className={getInputClassName("fechaNacimiento")}
        />
        {errors.fechaNacimiento && (
          <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
            <AlertCircle size={14} />
            {errors.fechaNacimiento}
          </p>
        )}
      </div>

      <div className="col-span-2">
        <label className="block font-medium text-gray-700 mb-1">
          Nacionalidad *
        </label>
        <Select
          name="paisNacimiento"
          options={options}
          placeholder="Selecciona Nacionalidad"
          value={
            formData.paisNacimiento
              ? options.find((option) => option.value === formData.paisNacimiento)
              : null
          }
          onChange={(option) => handleSelectChange("paisNacimiento", option)}
          isDisabled={cargando}
          classNamePrefix="react-select"
          styles={{
            control: (base) => ({
              ...base,
              borderColor: errors.paisNacimiento
                ? "#ef4444"
                : successFields.paisNacimiento
                ? "#22c55e"
                : "#d1d5db",
              borderRadius: "0.5rem",
              padding: "2px",
              "&:hover": { borderColor: "#16a34a" },
              backgroundColor: cargando ? "#f3f4f6" : "white",
            }),
          }}
        />
        {errors.paisNacimiento && (
          <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
            <AlertCircle size={14} />
            {errors.paisNacimiento}
          </p>
        )}
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
              ? options.find((option) => option.value === formData.nacionalidad)
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
        {errors.nacionalidad && (
          <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
            <AlertCircle size={14} />
            {errors.nacionalidad}
          </p>
        )}
      </div>

      <div>
        <label className="block font-medium text-gray-700 mb-1">
          Departamento de Residencia{" "}
          {formData.nacionalidad === "CO" && "*"}
        </label>
        <select
          name="departamentoResidencia"
          value={formData.departamentoResidencia}
          onChange={handleDepartamentoChange}
          disabled={formData.nacionalidad !== "CO" || cargando}
          className={getInputClassName("departamentoResidencia")}
        >
          <option value="">Selecciona Departamento</option>
          {colombia.map((d) => (
            <option key={d.departamento} value={d.departamento}>
              {d.departamento}
            </option>
          ))}
        </select>
        {errors.departamentoResidencia && (
          <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
            <AlertCircle size={14} />
            {errors.departamentoResidencia}
          </p>
        )}
      </div>

      <div>
        <label className="block font-medium text-gray-700 mb-1">
          Ciudad de Residencia {formData.nacionalidad === "CO" && "*"}
        </label>
        <select
          name="ciudadResidencia"
          value={formData.ciudadResidencia}
          onChange={handleChange}
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
        {errors.ciudadResidencia && (
          <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
            <AlertCircle size={14} />
            {errors.ciudadResidencia}
          </p>
        )}
      </div>

      <div className="col-span-2">
        <label className="block font-medium text-gray-700 mb-1">
          Dirección de Residencia *
        </label>
        <input
          name="direccionResidencia"
          type="text"
          placeholder="Dirección de Residencia"
          value={formData.direccionResidencia}
          onChange={handleChange}
          disabled={cargando}
          className={getInputClassName("direccionResidencia")}
        />
        {errors.direccionResidencia && (
          <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
            <AlertCircle size={14} />
            {errors.direccionResidencia}
          </p>
        )}
      </div>
    </>
  );
};

export default PersonalInfoSection;