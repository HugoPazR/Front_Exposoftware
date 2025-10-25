import React, { useState, useEffect } from "react";
import { Mail, Lock, Leaf, Users, Trophy, Eye, EyeOff, AlertCircle, CheckCircle } from "lucide-react";
import { Link } from "react-router-dom";

function LoginPage() {
  const images = [
    "https://elpilon2024.s3.us-west-2.amazonaws.com/2024/12/IMG_0427.jpeg",
    "https://elpilon2024.s3.us-west-2.amazonaws.com/2025/04/upc-2.jpg",
  ];

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [correo, setCorreo] = useState("");
  const [contraseña, setContraseña] = useState("");
  const [errores, setErrores] = useState({});
  const [mostrarContraseña, setMostrarContraseña] = useState(false);
  const [recordarme, setRecordarme] = useState(false);

  // Carrusel automático
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) =>
        prevIndex === images.length - 1 ? 0 : prevIndex + 1
      );
    }, 5000);
    return () => clearInterval(interval);
  }, [images.length]);

  // Cargar correo guardado
  useEffect(() => {
    const correoGuardado = localStorage.getItem("correoRecordado");
    if (correoGuardado) {
      setCorreo(correoGuardado);
      setRecordarme(true);
    }
  }, []);

  // Validar campos
  const validarCampo = (nombre, valor) => {
    let error = "";
    const correoValido = /^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}$/;

    if (nombre === "correo") {
      if (!valor.trim()) {
        error = "El correo electrónico es obligatorio.";
      } else if (!correoValido.test(valor)) {
        error = "Por favor ingresa un correo electrónico válido.";
      }
    }

    if (nombre === "contraseña") {
      if (!valor.trim()) {
        error = "La contraseña es obligatoria.";
      } else if (valor.length < 8) {
        error = "Debe tener al menos 8 caracteres.";
      }
    }

    setErrores((prev) => ({ ...prev, [nombre]: error }));
    return error === "";
  };

  const validarCampos = () => {
    const correoValido = validarCampo("correo", correo);
    const contraseñaValida = validarCampo("contraseña", contraseña);
    return correoValido && contraseñaValida;
  };

  // Guardar o eliminar "Recordarme"
  const manejarRecordarme = (checked) => {
    setRecordarme(checked);
    if (checked) {
      localStorage.setItem("correoRecordado", correo);
    } else {
      localStorage.removeItem("correoRecordado");
    }
  };

  // Envío del formulario
  const manejarSubmit = (e) => {
    e.preventDefault();

    if (!validarCampos()) return;

    alert(`✅ Inicio de sesión exitoso para: ${correo}`);
  };

  return (
    <main className="min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* Fondo */}
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

      {/* Contenido */}
      <section className="flex w-full max-w-5xl bg-white rounded-2xl shadow-2xl overflow-hidden relative z-10">
        {/* Panel informativo */}
        <aside className="w-1/2 bg-gradient-to-br from-green-500 via-green-600 to-green-700 text-white p-10 flex flex-col justify-center relative overflow-hidden">
          <header className="mb-6 relative z-10">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                <span className="text-2xl font-bold">&lt;/&gt;</span>
              </div>
              <h1 className="text-3xl font-bold">Expo-Software 2025</h1>
            </div>
            <div className="h-1 w-20 bg-white rounded-full"></div>
          </header>

          <article className="relative z-10">
            <p className="text-lg mb-3 leading-relaxed">
              Descubre los proyectos más innovadores desarrollados por
              estudiantes y profesores.
            </p>
            <p className="text-sm mb-10 text-green-100">
              Una vitrina digital de talento tecnológico y creatividad académica.
            </p>
          </article>

          <footer className="flex gap-8 mt-auto relative z-10">
            <div className="flex flex-col items-center group hover:scale-110 transition-transform">
              <div className="w-14 h-14 bg-white/20 rounded-full flex items-center justify-center mb-2">
                <Leaf size={28} />
              </div>
              <p className="text-2xl font-bold">150+</p>
              <p className="text-sm text-green-100">Proyectos</p>
            </div>
            <div className="flex flex-col items-center group hover:scale-110 transition-transform">
              <div className="w-14 h-14 bg-white/20 rounded-full flex items-center justify-center mb-2">
                <Users size={28} />
              </div>
              <p className="text-2xl font-bold">500+</p>
              <p className="text-sm text-green-100">Participantes</p>
            </div>
            <div className="flex flex-col items-center group hover:scale-110 transition-transform">
              <div className="w-14 h-14 bg-white/20 rounded-full flex items-center justify-center mb-2">
                <Trophy size={28} />
              </div>
              <p className="text-2xl font-bold">15</p>
              <p className="text-sm text-green-100">Premios</p>
            </div>
          </footer>
        </aside>

        {/* Panel de login */}
        <section className="w-1/2 p-10 flex flex-col justify-center">
          <header className="mb-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-2">¡Bienvenido!</h2>
            <p className="text-gray-500">Inicia sesión para continuar</p>
          </header>

          <form className="space-y-5" onSubmit={manejarSubmit}>
            {/* CORREO */}
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700">
                Correo Electrónico
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 text-gray-400" size={20} />
                <input
                  type="email"
                  value={correo}
                  onChange={(e) => {
                    setCorreo(e.target.value);
                    validarCampo("correo", e.target.value);
                  }}
                  placeholder="tu@email.com"
                  className={`w-full border ${
                    errores.correo ? "border-red-500" : "border-gray-300"
                  } rounded-lg pl-11 pr-4 py-3 focus:outline-none focus:ring-2 ${
                    errores.correo ? "focus:ring-red-500" : "focus:ring-green-500"
                  } transition-all`}
                />
              </div>
              {errores.correo && (
                <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                  <AlertCircle size={14} />
                  {errores.correo}
                </p>
              )}
            </div>

            {/* CONTRASEÑA */}
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700">
                Contraseña
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 text-gray-400" size={20} />
                <input
                  type={mostrarContraseña ? "text" : "password"}
                  value={contraseña}
                  onChange={(e) => {
                    setContraseña(e.target.value);
                    validarCampo("contraseña", e.target.value);
                  }}
                  placeholder="••••••••"
                  className={`w-full border ${
                    errores.contraseña ? "border-red-500" : "border-gray-300"
                  } rounded-lg pl-11 pr-11 py-3 focus:outline-none focus:ring-2 ${
                    errores.contraseña ? "focus:ring-red-500" : "focus:ring-green-500"
                  } transition-all`}
                />
                <button
                  type="button"
                  onClick={() => setMostrarContraseña(!mostrarContraseña)}
                  className="absolute right-3 top-3 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {mostrarContraseña ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {errores.contraseña && (
                <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                  <AlertCircle size={14} />
                  {errores.contraseña}
                </p>
              )}
            </div>

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={recordarme}
                  onChange={(e) => manejarRecordarme(e.target.checked)}
                  className="w-4 h-4 accent-green-600"
                />
                <span className="text-gray-600">Recordarme</span>
              </label>
              <a
                href="#"
                className="text-green-700 hover:text-green-800 font-medium hover:underline"
              >
                ¿Olvidaste tu contraseña?
              </a>
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-semibold py-3 rounded-lg transition-all shadow-md hover:shadow-lg"
            >
              Iniciar Sesión
            </button>
          </form>

          <footer className="text-sm text-center mt-6 text-gray-600">
            ¿No tienes una cuenta?{" "}
            <Link
              to="/register"
              className="text-green-700 font-semibold hover:text-green-800 hover:underline"
            >
              Regístrate aquí
            </Link>
          </footer>
        </section>
      </section>
    </main>
  );
}

export default LoginPage;
