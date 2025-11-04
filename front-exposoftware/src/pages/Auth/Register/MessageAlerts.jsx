import { AlertCircle, CheckCircle } from "lucide-react";

const MessageAlerts = ({ mensajeExito, mensajeError }) => {
  return (
    <>
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
    </>
  );
};

export default MessageAlerts;