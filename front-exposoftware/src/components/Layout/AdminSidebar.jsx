import { Link, useLocation } from "react-router-dom";

/**
 * Sidebar para el panel de administración
 * @param {Object} props - Propiedades del componente
 * @param {string} props.userName - Nombre del usuario administrador (opcional, default: "Carlos Mendoza")
 * @param {string} props.userRole - Rol del usuario (opcional, default: "Administrador")
 */
export default function AdminSidebar({ userName = "Carlos Mendoza", userRole = "Administrador" }) {
  const location = useLocation();

  // Función para determinar si un link está activo
  const isActive = (path) => {
    return location.pathname === path;
  };

  // Configuración de los enlaces del sidebar
  const menuItems = [
    {
      to: "/admin/dash",
      icon: "pi-home",
      label: "Dashboard"
    },
    {
      to: "/admin/crear-materia",
      icon: "pi-book",
      label: "Crear Materia"
    },
    {
      to: "/admin/crear-grupo",
      icon: "pi-users",
      label: "Crear Grupo"
    },
    {
      to: "/admin/crear-profesor",
      icon: "pi-user-plus",
      label: "Gestión de Profesores"
    },
    {
      to: "/admin/lineas-investigacion",
      icon: "pi-lightbulb",
      label: "Gestión de Líneas de Investigación"
    },
    {
      to: "/admin/profile",
      icon: "pi-cog",
      label: "Configuración de Perfil"
    }
  ];

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
