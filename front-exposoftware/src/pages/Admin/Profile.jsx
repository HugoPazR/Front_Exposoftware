import React from "react";
import { Link } from "react-router-dom";
import logo from "../../assets/Logo-unicesar.png";

export default function AdminProfile() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header - Igual al dashboard */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <img src={logo} alt="Logo Unicesar" className="w-10 h-auto" />
              <div>
                <h1 className="text-lg font-bold text-gray-900">Expo-software 2025</h1>
                <p className="text-xs text-gray-500">Universidad Popular del Cesar</p>
              </div>
            </div>

            {/* User avatar and logout */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3">
                <span className="text-sm text-gray-700 hidden sm:block">Carlos </span>
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <span className="text-green-600 font-bold text-lg">C</span>
                </div>
              </div>
              
              <button className="text-sm font-medium text-red-600 hover:text-red-700 transition-colors flex items-center gap-2">
                <i className="pi pi-sign-out"></i>
                <span className="hidden sm:inline">Cerrar Sesión</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          
          {/* Sidebar */}
          <aside className="lg:col-span-1">
            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <nav className="space-y-1">
                <Link
                  to="/admin/dash"
                  className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors text-gray-700 hover:bg-gray-50"
                >
                  <i className="pi pi-home text-base"></i>
                  Dashboard
                </Link>
                <Link
                  to="/admin/crear-materia"
                  className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors text-gray-700 hover:bg-gray-50"
                >
                  <i className="pi pi-book text-base"></i>
                  Crear Materia
                </Link>
                <Link
                  to="/admin/crear-grupo"
                  className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors text-gray-700 hover:bg-gray-50"
                >
                  <i className="pi pi-users text-base"></i>
                  Crear Grupo
                </Link>
                <Link
                  to="/admin/profile"
                  className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors bg-green-50 text-green-700"
                >
                  <i className="pi pi-cog text-base"></i>
                  Configuración de Perfil
                </Link>
              </nav>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 p-4 mt-4">
              <div className="text-center">
                <h3 className="font-semibold text-gray-900">Administrador</h3>
                <p className="text-sm text-gray-500">Carlos Mendoza</p>
              </div>
            </div>
          </aside>

          {/* Main content: Configuración de Perfil */}
          <main className="lg:col-span-3">
            <div className="bg-white rounded-lg border border-gray-200 p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Configuración de Perfil</h2>

              {/* Información Personal */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-6 pb-3 border-b border-gray-200">
                  Información Personal
                </h3>

                <div className="flex flex-col md:flex-row gap-8">
                  {/* Avatar y botón de cambiar foto */}
                  <div className="flex flex-col items-center md:items-start">
                    <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center mb-4">
                      <img 
                        src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=400&auto=format&fit=crop" 
                        alt="Avatar" 
                        className="w-full h-full object-cover" 
                      />
                    </div>
                    <button className="inline-flex items-center px-4 py-2 border border-gray-300 text-gray-700 rounded-lg text-sm hover:bg-gray-50 transition-colors">
                      Cambiar Foto
                    </button>
                  </div>

                  {/* Formulario de información */}
                  <div className="flex-1 space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Nombre Completo
                      </label>
                      <input 
                        type="text" 
                        defaultValue="Carlos Mendoza" 
                        className="w-full border border-gray-300 rounded-lg px-4 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Correo Electrónico
                      </label>
                      <input 
                        type="email" 
                        defaultValue="admin@exposoftware.edu" 
                        className="w-full border border-gray-300 rounded-lg px-4 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Rol
                      </label>
                      <input 
                        type="text" 
                        defaultValue="Administrador del Sistema" 
                        disabled
                        className="w-full border border-gray-300 rounded-lg px-4 py-2 bg-gray-50 text-gray-500"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Seguridad */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-6 pb-3 border-b border-gray-200">
                  Seguridad
                </h3>

                <div className="space-y-4 max-w-2xl">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Contraseña
                    </label>
                    <input 
                      type="password" 
                      defaultValue="********" 
                      disabled
                      className="w-full border border-gray-300 rounded-lg px-4 py-2 bg-gray-50 text-gray-500"
                    />
                  </div>

                  <div>
                    <button className="inline-flex items-center px-4 py-2 border border-gray-300 text-gray-700 rounded-lg text-sm hover:bg-gray-50 transition-colors">
                      Cambiar Contraseña
                    </button>
                  </div>
                </div>
              </div>

              {/* Botón de guardar */}
              <div className="flex justify-end pt-6 border-t border-gray-200">
                <button className="bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors">
                  Guardar Cambios
                </button>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
