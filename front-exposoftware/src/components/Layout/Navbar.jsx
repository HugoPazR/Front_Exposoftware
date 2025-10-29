import { Link, useLocation } from "react-router-dom";
import { FiLogIn } from "react-icons/fi";
import logo from "../../assets/Logo-unicesar.png";

export default function Navbar() {
  const location = useLocation();
  const hideLoginButton =
    location.pathname === "/login" || location.pathname === "/register";

  return (
    <nav className="bg-white text-black px-8 py-4 flex justify-between items-center shadow-md">

      {/* Logo + Nombre clickeable */}
      <Link to="/" className="flex items-center gap-3 cursor-pointer">
        <img src={logo} alt="Logo Unicesar" className="w-16 h-auto" />
        <div>
          <h1 className="text-xl font-bold">Expo-software</h1>
          <p className="text-sm text-gray-600">Universidad Popular del Cesar</p>
        </div>
      </Link>

      <ul className="flex items-center gap-8 text-base font-medium">
        <li>
          <Link to="/" className="hover:text-green-700 transition">Inicio</Link>
        </li>
        <li>
          <Link to="/projects" className="hover:text-green-700 transition">Proyectos</Link>
        </li>
        <li>
          <Link to="/about" className="hover:text-green-700 transition">Acerca de</Link>
        </li>

        {/* Ocultar este botón en login/register */}
        {!hideLoginButton && (
          <li>
            <Link
              to="/login"
              className="bg-green-600 text-white px-4 py-2 rounded-md flex items-center gap-2 hover:bg-green-700 transition"
            >
              <FiLogIn size={18} />
              Iniciar Sesión
            </Link>
          </li>
        )}
      </ul>
    </nav>
  );
}
