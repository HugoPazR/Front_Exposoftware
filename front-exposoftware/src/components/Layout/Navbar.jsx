import { Link } from "react-router-dom";
import { FiLogIn } from "react-icons/fi";
import logo from "../../assets/Logo-unicesar.png";


export default function Navbar() {
  return (
    <nav className="bg-white text-black px-8 py-4 flex justify-between items-center shadow-md">
      {/* Logo + Nombre */}
      <div className="flex items-center gap-3">
        <img
          src={logo}
          alt="Logo Unicesar"
          className="w-16 h-auto"
        />
        <div>
          <h1 className="text-xl font-bold">Expo-software</h1>
          <p className="text-sm text-gray-600">Universidad Popular del Cesar</p>
        </div>
      </div>

      {/* Enlaces de navegación */}
      <ul className="flex items-center gap-8 text-base font-medium">
        <li>
          <Link to="/" className="hover:text-green-700 transition">
            Inicio
          </Link>
        </li>
        <li>
          <Link to="/projects" className="hover:text-green-700 transition">
            Proyectos
          </Link>
        </li>
        <li>
          <Link to="/about" className="hover:text-green-700 transition">
            Acerca de
          </Link>
        </li>
        <li>
          <Link
            to="/login"
            className="bg-green-600 text-white px-4 py-2 rounded-md flex items-center gap-2 hover:bg-green-700 transition"
          >
            <FiLogIn size={18} />
            Iniciar Sesión
          </Link>
        </li>
      </ul>
    </nav>
  );
}

