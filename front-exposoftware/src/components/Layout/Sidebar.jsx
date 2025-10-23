import { Link, useLocation } from "react-router-dom";

/**
 * Componente Sidebar genérico para navegación
 * @param {Object} props - Propiedades del componente
 * @param {Array} props.menuItems - Array de items del menú
 * @param {string} props.userName - Nombre del usuario
 * @param {string} props.userRole - Rol del usuario
 */
export default function Sidebar({ menuItems = [], userName = "Usuario", userRole = "Rol" }) {
  const location = useLocation();

  // Función para determinar si un link está activo
  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <aside className="lg:col-span-1">
      {/* Navigation Menu */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <nav className="space-y-1">
          {menuItems.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                isActive(item.to)
                  ? "bg-green-50 text-green-700"
                  : "text-gray-700 hover:bg-gray-50"
              }`}
            >
              <i className={`pi ${item.icon} text-base`}></i>
              {item.label}
            </Link>
          ))}
        </nav>
      </div>

      {/* User Info Card */}
      <div className="bg-white rounded-lg border border-gray-200 p-4 mt-4">
        <div className="text-center">
          <h3 className="font-semibold text-gray-900">{userRole}</h3>
          <p className="text-sm text-gray-500">{userName}</p>
        </div>
      </div>
    </aside>
  );
}