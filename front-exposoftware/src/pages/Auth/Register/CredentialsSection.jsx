import { AlertCircle } from "lucide-react";
import vista from "../../../assets/icons/vista.png";
//import esconder from "../../../assets/icons/esconder.png";
import esconder from "../../../assets/icons/vista.png";

const CredentialsSection = ({
  formData,
  errors,
  handleChange,
  getInputClassName,
  cargando,
  showPassword,
  setShowPassword,
  showConfirmPassword,
  setShowConfirmPassword,
}) => {
  return (
    <>
      <div className="col-span-2 border-l-4 border-green-600 pl-2 mt-4 mb-2">
        <h2 className="text-lg font-semibold text-gray-700">
          🔐 Credenciales de Acceso
        </h2>
        <p className="text-sm text-gray-500 mt-1">Crea una contraseña segura para tu cuenta</p>
      </div>

      <div className="relative">
        <label className="block font-medium text-gray-700 mb-1">
          Contraseña *
        </label>
        <div className="relative">
          <input
            name="contraseña"
            type={showPassword ? "text" : "password"}
            placeholder="Mínimo 8 caracteres"
            value={formData.contraseña}
            onChange={handleChange}
            disabled={cargando}
            className={getInputClassName("contraseña")}
          />
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            disabled={cargando}
            className="absolute inset-y-0 right-2 flex items-center text-gray-500 hover:text-green-600 transition-colors"
          >
            <img
              src={showPassword ? esconder : vista}
              alt={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
              className="w-5 h-5 transition-transform duration-200 hover:scale-110"
            />
          </button>
        </div>
        {errors.contraseña && (
          <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
            <AlertCircle size={14} />
            {errors.contraseña}
          </p>
        )}
        <p className="text-xs text-gray-500 mt-1">
          Debe tener al menos 8 caracteres
        </p>
      </div>

      <div className="relative">
        <label className="block font-medium text-gray-700 mb-1">
          Confirmar Contraseña *
        </label>
        <div className="relative">
          <input
            name="confirmarcontraseña"
            type={showConfirmPassword ? "text" : "password"}
            placeholder="Repite tu contraseña"
            value={formData.confirmarcontraseña}
            onChange={handleChange}
            disabled={cargando}
            className={getInputClassName("confirmarcontraseña")}
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword((prev) => !prev)}
            disabled={cargando}
            className="absolute inset-y-0 right-2 flex items-center text-gray-500 hover:text-green-600 transition-colors"
          >
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
        {errors.confirmarcontraseña && (
          <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
            <AlertCircle size={14} />
            {errors.confirmarcontraseña}
          </p>
        )}
      </div>
    </>
  );
};

export default CredentialsSection;
