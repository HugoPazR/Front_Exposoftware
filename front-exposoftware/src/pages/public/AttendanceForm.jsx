import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

export default function AsistenciaForm() {
    const [email, setEmail] = useState("");
    const [mensaje, setMensaje] = useState("");
    const [validando, setValidando] = useState(false);
    const [params] = useSearchParams();
    const navigate = useNavigate();

    const idSesion = params.get("id_sesion");

    const handleSubmit = (e) => {
        e.preventDefault();
        setValidando(true);

        // Simulación de usuarios registrados
        const registrados = ["juan@gmail.com", "maria@upc.edu.co"];

        setTimeout(() => {
            if (registrados.includes(email.trim().toLowerCase())) {
                setMensaje("Asistencia registrada con éxito. ¡Gracias por participar!");
            } else {
                setMensaje("Correo no registrado. Redirigiendo al registro...");
                setTimeout(() => {
                    navigate("/register");
                }, 2000);
            }
            setValidando(false);
        }, 1000);
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100 px-4">
            <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200 w-full max-w-md">
                <h2 className="text-2xl font-bold text-center text-green-700 mb-2">
                    Registro de Asistencia
                </h2>
                <p className="text-center text-gray-500 mb-4">
                    Sesión ID: <span className="font-mono">{idSesion}</span>
                </p>

                <form onSubmit={handleSubmit} className="flex flex-col gap-3">
                    <input
                        type="email"
                        placeholder="Ingresa tu correo"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-green-500"
                        required
                    />
                    <button
                        type="submit"
                        disabled={validando}
                        className="bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition"
                    >
                        {validando ? "Verificando..." : "Registrar Asistencia"}
                    </button>
                </form>

                {mensaje && (
                    <p className="mt-4 text-center font-medium">{mensaje}</p>
                )}
            </div>
        </div>
    );
}
