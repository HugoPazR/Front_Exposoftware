import React, { useState, useEffect } from "react";
import { Mail, Lock, Leaf, Users, Trophy } from "lucide-react";
import { Link } from "react-router-dom";

function LoginPage() {
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

  return (
    <main className="min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* Carrusel de fondo */}
      {images.map((img, index) => (
        <div
          key={index}
          className={`absolute inset-0 bg-cover bg-center transition-all duration-1000 ease-in-out ${
            index === currentImageIndex ? "opacity-100 scale-100" : "opacity-0 scale-105"
          }`}
          style={{ backgroundImage: `url(${img})` }}
        ></div>
      ))}

      {/* Capa translúcida */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/85 via-white/80 to-green-50/85"></div>

      {/* Contenido principal (tu código intacto) */}
      <section className="flex w-full max-w-5xl bg-white rounded-2xl shadow-lg overflow-hidden relative z-10">
        {/* Panel informativo */}
        <aside className="w-1/2 bg-gradient-to-r from-green-500 to-green-700 text-white p-10 flex flex-col justify-center">
          <header className="mb-6">
            <h1 className="text-3xl font-bold">&lt;/&gt; Expo-Software 2025</h1>
          </header>

          <article>
            <p className="text-lg mb-3">
              Descubre los proyectos más innovadores desarrollados por estudiantes y profesores.
            </p>
            <p className="text-sm mb-10">
              Una vitrina digital de talento tecnológico y creatividad académica.
            </p>
          </article>

          <footer className="flex gap-6 mt-auto">
            <div className="flex flex-col items-center">
              <Leaf className="mb-1" size={28} />
              <p className="text-xl font-semibold">150+</p>
              <p className="text-sm">Proyectos</p>
            </div>
            <div className="flex flex-col items-center">
              <Users className="mb-1" size={28} />
              <p className="text-xl font-semibold">500+</p>
              <p className="text-sm">Participantes</p>
            </div>
            <div className="flex flex-col items-center">
              <Trophy className="mb-1" size={28} />
              <p className="text-xl font-semibold">15</p>
              <p className="text-sm">Premios</p>
            </div>
          </footer>
        </aside>

        {/* Panel de inicio de sesión */}
        <section className="w-1/2 p-10 flex flex-col justify-center">
          <header className="mb-6">
            <h2 className="text-2xl font-semibold text-gray-800">Iniciar Sesión</h2>
            <p className="text-gray-500">Bienvenido de nuevo a Exposoftware</p>
          </header>

          <form className="space-y-5">
            <fieldset>
              <label className="block text-sm font-medium mb-1 text-gray-600">
                Correo Electrónico
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 text-gray-400" size={18} />
                <input
                  type="email"
                  placeholder="tu@email.com"
                  className="w-full border border-gray-300 rounded-lg pl-10 pr-4 py-2 
                             focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
            </fieldset>

            <fieldset>
              <label className="block text-sm font-medium mb-1 text-gray-600">
                Contraseña
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 text-gray-400" size={18} />
                <input
                  type="password"
                  placeholder="********"
                  className="w-full border border-gray-300 rounded-lg pl-10 pr-4 py-2 
                             focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
            </fieldset>

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2">
                <input type="checkbox" className="accent-green-600" />
                Recordarme
              </label>
              <a href="#" className="text-green-700 hover:underline">
                ¿Olvidaste tu contraseña?
              </a>
            </div>

            <button
              type="submit"
              className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 rounded-lg transition"
            >
              Iniciar Sesión
            </button>
          </form>

          <footer className="text-sm text-center mt-5 text-gray-600">
            ¿No tienes una cuenta?{" "}
            <Link to="/register" className="text-green-700 font-semibold hover:underline">
              Regístrate aquí
            </Link>
          </footer>
        </section>
      </section>
    </main>
  );
}

export default LoginPage;
