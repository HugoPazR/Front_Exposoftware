import React, { useState } from "react";
import { FaEnvelope, FaPhoneAlt, FaMapMarkerAlt } from "react-icons/fa";
import Navbar from "../../components/Layout/Navbar";
import Footer from "../../components/Layout/Footer";

export default function Contact() {
  const [formData, setFormData] = useState({
    nombre: "",
    correo: "",
    mensaje: "",
  });

  const [enviado, setEnviado] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setEnviado(true);
    setTimeout(() => setEnviado(false), 4000);
    setFormData({ nombre: "", correo: "", mensaje: "" });
  };

  return (
    <div className="flex flex-col min-h-screen">
    

      {/* Encabezado */}
      <header className="bg-green-600 text-white py-16 text-center">
        <h1 className="text-4xl font-bold mb-3">Contáctanos</h1>
        <p className="text-lg max-w-2xl mx-auto">
          Si tienes dudas, sugerencias o deseas colaborar con el evento Exposoftware,
          no dudes en comunicarte con nosotros.
        </p>
      </header>

      {/* Contenido principal */}
      <main className="flex-grow container mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Formulario de contacto */}
        <section>
          <h2 className="text-2xl font-semibold mb-6 text-gray-800">
            Envíanos un mensaje
          </h2>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nombre completo
              </label>
              <input
                type="text"
                name="nombre"
                value={formData.nombre}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-green-600"
                placeholder="Tu nombre"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Correo electrónico
              </label>
              <input
                type="email"
                name="correo"
                value={formData.correo}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-green-600"
                placeholder="tu@email.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Mensaje
              </label>
              <textarea
                name="mensaje"
                value={formData.mensaje}
                onChange={handleChange}
                required
                rows="5"
                className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-green-600"
                placeholder="Escribe tu mensaje aquí..."
              />
            </div>

            <button
              type="submit"
              className="bg-green-600 text-white font-semibold px-6 py-2 rounded-lg hover:bg-green-700 transition"
            >
              Enviar mensaje
            </button>

            {enviado && (
              <p className="text-green-700 font-medium mt-3 bg-green-50 p-2 rounded-md text-center">
                ✅ ¡Tu mensaje ha sido enviado con éxito!
              </p>
            )}
          </form>
        </section>

        {/* Información de contacto */}
        <section>
          <h2 className="text-2xl font-semibold mb-6 text-gray-800">
            Información de contacto
          </h2>
          <ul className="space-y-5 text-gray-700">
            <li className="flex items-center gap-3">
              <FaMapMarkerAlt className="text-green-600 text-xl" />
              <span>Universidad Popular del Cesar, Valledupar - Colombia</span>
            </li>
            <li className="flex items-center gap-3">
              <FaPhoneAlt className="text-green-600 text-xl" />
              <span>+57 300 000 0000</span>
            </li>
            <li className="flex items-center gap-3">
              <FaEnvelope className="text-green-600 text-xl" />
              <span>exposoftware@unicesar.edu.co</span>
            </li>
          </ul>

          {/* Mapa (opcional) */}
          <div className="mt-8">
            <iframe
              title="Ubicación Unicesar"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d7847.251297695486!2d-73.2609431920349!3d10.451251191217056!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8e8ab9f0380dfce7%3A0x48c70aed89305d79!2sUniversidad%20Popular%20Del%20Cesar!5e0!3m2!1ses!2sco!4v1761852874029!5m2!1ses!2sco"
              width="100%"
              height="250"
              allowFullScreen=""
              loading="lazy"
              className="rounded-lg border border-gray-300"
            ></iframe>
          </div>
        </section>
      </main>

    
    </div>
  );
}
