import { useState } from "react";
import { useNavigate, useSearchParams, useParams } from "react-router-dom";
import AssistanceService from "../../services/AssistanceService"; // 👈 importamos el servicio real

export default function AsistenciaForm() {
    const [email, setEmail] = useState("");
    const [mensaje, setMensaje] = useState("");
    const [validando, setValidando] = useState(false);
    const navigate = useNavigate();
    const [error, setError] = useState("");    
    const { id_evento } = useParams();
    const [params] = useSearchParams();
    const idEvento = id_evento || params.get("id_evento") || params.get("id_sesion");

    const handleChange = (e) => {
        const val = e.target.value;
        setEmail(val);

        if (val === "") {
            setError("El correo no puede estar vacío.");
        } else if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(val)) {
            setError("Correo inválido. Asegúrate de ingresar un correo válido.");
        } else {
            setError("");
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setValidando(true);
        setMensaje("");

        try {
            // ✅ Si pasa la validación, registrar asistencia
            const response = await AssistanceService.registrarAsistencia(idEvento, email);

            console.log("✅ Asistencia registrada:", response);
            setMensaje("✅ Asistencia registrada con éxito. ¡Gracias por participar!");
        } catch (error) {
            setMensaje("⚠️ Correo no registrado. Redirigiendo al registro...");
            setTimeout(() => navigate("/register"), 2000);
        } finally {
            setValidando(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100 px-4">
            <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200 w-full max-w-md">
                <h2 className="text-2xl font-bold text-center text-green-700 mb-2">
                    Registro de Asistencia
                </h2>

                {idEvento ? (
                    <p className="text-center text-gray-500 mb-4">
                        Evento ID: <span className="font-mono">{idEvento}</span>
                    </p>
                ) : (
                    <p className="text-center text-red-600 font-medium mb-4">
                        ❌ Enlace inválido. No se proporcionó un ID de evento.
                    </p>
                )}

                <form onSubmit={handleSubmit} className="flex flex-col gap-3">
                    <input
                        type="email"
                        placeholder="Ingresa tu correo institucional"
                        value={email}
                        onChange={handleChange}
                        className="border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-green-500"
                        required
                    />
                    {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
                    <button
                        type="submit"
                        disabled={validando || !idEvento}
                        className="bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition disabled:opacity-50"
                    >
                        {validando ? "Verificando..." : "Registrar Asistencia"}
                    </button>
                </form>

                {mensaje && (
                    <p
                        className={`mt-4 text-center font-medium ${mensaje.startsWith("✅")
                            ? "text-green-700"
                            : mensaje.startsWith("⚠️")
                                ? "text-yellow-700"
                                : "text-red-700"
                            }`}
                    >
                        {mensaje}
                    </p>
                )}
            </div>
        </div>
    );
}
