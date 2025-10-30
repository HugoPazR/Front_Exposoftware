import React, { useState, useEffect } from "react";
import { Mail, Lock, Leaf, Users, Trophy } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import * as AuthService from "../../Services/AuthService";

export default function LoginPage() {
  const navigate = useNavigate();

  // Carrusel de fondo
  const images = [
    "https://elpilon2024.s3.us-west-2.amazonaws.com/2025/04/upc-2.jpg",
    "https://www.unicesar.edu.co/wp-content/uploads/2025/06/66_11zon.webp",
    "https://www.unicesar.edu.co/wp-content/uploads/2025/06/Registro-4._11zon-980x653.webp",
  ];

  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(
      () =>
        setCurrentImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1)),
      5000
    );
    return () => clearInterval(interval);
  }, []);

  // Estados del login
  const [correo, setCorreo] = useState("");
  const [password, setPassword] = useState("");
  const [recordarme, setRecordarme] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // Si ya está autenticado
  useEffect(() => {
    if (AuthService.isAuthenticated()) {
      const role = AuthService.getUserRole();
      redirigirSegunRol(role);
    }
  }, []);

  const redirigirSegunRol = (role) => {
    switch (role) {
      case "admin":
        navigate("/admin/dash");
        break;
      case "docente":
        navigate("/teacher/dashboard");
        break;
      case "estudiante":
        navigate("/student/dashboard");
        break;
      default:
        navigate("/");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!correo || !password) {
      setError("Por favor complete todos los campos");
      return;
    }

    if (!AuthService.validarCorreo(correo)) {
      setError("Por favor ingrese un correo válido");
      return;
    }

    setLoading(true);
    try {
      const resultado = await AuthService.login({ correo, password });
      if (resultado.success) {
        const role = AuthService.getUserRole();
        redirigirSegunRol(role);
      }
    } catch (err) {
      setError(err.message || "Error al iniciar sesión");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center relative overflow-hidden bg-green-50">
      {/* Fondo animado */}
      {images.map((img, i) => (
        <div
          key={i}
          className={`absolute inset-0 bg-cover bg-center transition-all duration-1000 ease-in-out ${
            i === currentImageIndex ? "opacity-100 scale-100" : "opacity-0 scale-105"
          }`}
          style={{ backgroundImage: `url(${img})` }}
        ></div>
      ))}
      <div className="absolute inset-0 bg-gradient-to-br from-white/85 via-white/80 to-green-50/85"></div>

      {/* Contenedor */}
      <section className="flex w-full max-w-5xl bg-white rounded-2xl shadow-2xl overflow-hidden relative z-10">
        {/* Panel Izquierdo */}
        <aside className="w-1/2 bg-gradient-to-br from-green-500 via-green-600 to-green-700 text-white p-10 flex flex-col justify-center">
          <header className="mb-6">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                <span className="text-2xl font-bold">&lt;/&gt;</span>
              </div>
              <h1 className="text-3xl font-bold">Expo-Software 2025</h1>
            </div>
            <div className="h-1 w-20 bg-white rounded-full"></div>
          </header>

          <p className="text-lg leading-relaxed">
            Descubre los proyectos más innovadores desarrollados por estudiantes y profesores.
          </p>
          <p className="text-sm mt-2 text-green-100">
            Una vitrina digital de talento tecnológico y creatividad académica.
          </p>

          <footer className="flex gap-8 mt-10">
            <div className="text-center">
              <Leaf size={30} className="mx-auto mb-2" />
              <p className="font-bold text-2xl">150+</p>
              <p className="text-sm">Proyectos</p>
            </div>
            <div className="text-center">
              <Users size={30} className="mx-auto mb-2" />
              <p className="font-bold text-2xl">500+</p>
              <p className="text-sm">Participantes</p>
            </div>
            <div className="text-center">
              <Trophy size={30} className="mx-auto mb-2" />
              <p className="font-bold text-2xl">15</p>
              <p className="text-sm">Premios</p>
            </div>
          </footer>
        </aside>

        {/* Panel Derecho */}
        <section className="w-1/2 p-10 flex flex-col justify-center">
          <h2 className="text-2xl font-semibold text-gray-800 mb-1">Iniciar Sesión</h2>
          <p className="text-gray-500 mb-4">Bienvenido a Exposoftware</p>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Correo</label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 text-gray-400" size={20} />
                <input
                  type="email"
                  className="w-full border border-gray-300 rounded-lg pl-10 pr-4 py-2 focus:ring-2 focus:ring-green-500"
                  placeholder="usuario@unicesar.edu.co"
                  value={correo}
                  onChange={(e) => setCorreo(e.target.value)}
                  disabled={loading}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Contraseña</label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 text-gray-400" size={20} />
                <input
                  type={showPassword ? "text" : "password"}
                  className="w-full border border-gray-300 rounded-lg pl-10 pr-12 py-2 focus:ring-2 focus:ring-green-500"
                  placeholder="********"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? "🙈" : "👁️"}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={recordarme}
                  onChange={(e) => setRecordarme(e.target.checked)}
                  className="accent-green-600"
                />
                Recordarme
              </label>
              <a href="#" className="text-green-700 hover:underline">
                ¿Olvidaste tu contraseña?
              </a>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 rounded-lg transition disabled:bg-gray-400 flex items-center justify-center gap-2"
            >
              {loading ? "Iniciando sesión..." : "Iniciar Sesión"}
            </button>
          </form>

          <p className="text-sm text-gray-600 text-center mt-6">
            ¿No tienes una cuenta?{" "}
            <Link to="/register" className="text-green-700 font-semibold hover:underline">
              Regístrate aquí
            </Link>
          </p>
        </section>
      </section>
    </main>
  );
}
