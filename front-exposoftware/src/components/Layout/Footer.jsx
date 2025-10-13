import { FaFacebook, FaInstagram, FaWhatsapp } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="bg-gray-100 text-black py-6 mt-10 shadow-inner">
      <div className="container mx-auto px-8 flex flex-col md:flex-row justify-between items-center gap-4">
        
        {/* Texto de la izquierda */}
        <div className="text-center md:text-left">
          <h2 className="text-lg font-semibold">Expo-software</h2>
          <p className="text-sm text-gray-600">
            © {new Date().getFullYear()} Universidad Popular del Cesar — Todos los derechos reservados.
          </p>
        </div>

        {/* Redes sociales */}
        <div className="flex items-center gap-6 text-green-600 text-2xl">
          <a
            href="https://facebook.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-green-700 transition"
          >
            <FaFacebook />
          </a>
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-green-700 transition"
          >
            <FaInstagram />
          </a>
          <a
            href="https://wa.me/573000000000"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-green-700 transition"
          >
            <FaWhatsapp />
          </a>
        </div>
      </div>
    </footer>
  );
}
