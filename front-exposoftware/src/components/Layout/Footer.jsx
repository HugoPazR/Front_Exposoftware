import { Link } from "react-router-dom";
import { FaFacebook, FaInstagram, FaWhatsapp, FaEnvelope, FaPhoneAlt, FaMapMarkerAlt } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="bg-gray-100 text-black mt-10">
      {/* Contenido principal del footer */}
      <div className="container mx-auto px-8 py-10 grid grid-cols-1 md:grid-cols-4 gap-10">
        
        {/* Sección 1: Logo y descripción */}
        <div>
          <img
            src="/src/assets/Logo-Sistemas.png"
            alt="Logo Ingenieria de sistemas"
            className="w-28 mb-3"
          />
          <p className="text-sm text-gray-600">
            Plataforma de gestión y exposición de proyectos de software de la Universidad Popular del Cesar.
          </p>
        </div>

        {/* Sección 2: Enlaces rápidos */}
        <div>
          <h3 className="text-lg font-semibold mb-3 text-green-700">Enlaces Rápidos</h3>
          <ul className="space-y-2 text-gray-700">
            <li>
              <Link to="/" className="hover:text-green-600 transition">
                Inicio
              </Link>
            </li>
            <li>
              <Link to="/projects" className="hover:text-green-600 transition">
                Proyectos
              </Link>
            </li>
            <li>
              <Link to="/about" className="hover:text-green-600 transition">
                Acerca de
              </Link>
            </li>
            <li>
              <Link to="/login" className="hover:text-green-600 transition">
                Contacto
              </Link>
            </li>
          </ul>
        </div>

        {/* Sección 3: Contacto */}
        <div>
          <h3 className="text-lg font-semibold mb-3 text-green-700">Contacto</h3>
          <ul className="space-y-2 text-gray-700">
            <li className="flex items-center gap-2">
              <FaMapMarkerAlt className="text-green-600" /> Valledupar, Cesar - Colombia
            </li>
            <li className="flex items-center gap-2">
              <FaPhoneAlt className="text-green-600" /> +57 300 000 0000
            </li>
            <li className="flex items-center gap-2">
              <FaEnvelope className="text-green-600" /> exposoftware@unicesar.edu.co
            </li>
          </ul>
        </div>

        {/* Sección 4: Redes sociales */}
        <div>
          <h3 className="text-lg font-semibold mb-3 text-green-700">Síguenos</h3>
          <div className="flex gap-5 text-green-600 text-2xl">
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="hover:text-green-700 transition">
              <FaFacebook />
            </a>
            <a href="https://www.instagram.com/ingsistemasunicesar/" target="_blank" rel="noopener noreferrer" className="hover:text-green-700 transition">
              <FaInstagram />
            </a>
            <a href="https://wa.me/573000000000" target="_blank" rel="noopener noreferrer" className="hover:text-green-700 transition">
              <FaWhatsapp />
            </a>
          </div>
        </div>
      </div>

      {/* Línea divisoria */}
      <div className="border-t border-gray-300"></div>

      {/* Derechos reservados */}
      <div className="bg-gray-100 text-center py-4 text-gray-600 text-sm">
        © {new Date().getFullYear()} Exposoftware UPC — Todos los derechos reservados.
      </div>

      {/* Línea decorativa verde */}
      <div className="bg-green-600 h-2 w-full"></div>
    </footer>
  );
}