import React from "react";
import { Link } from "react-router-dom";
import logo from "../../assets/Logo-unicesar.png";

export default function Profile() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header (same style as Dashboard) */}
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

            {/* Action button then user quick badge (avatar + name) */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <span className="text-green-600 font-bold text-lg">CG</span>
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
          {/* Sidebar (reuse simplified from Dashboard) */}
          <aside className="lg:col-span-1">
            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <nav className="space-y-1">
                <Link to="/student/dashboard" className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50">
                  <i className="pi pi-home text-base"></i>
                  Dashboard
                </Link>
                <Link to="/student/proyectos" className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50">
                  <i className="pi pi-book text-base"></i>
                  Mis Proyectos
                </Link>
                <Link to="/student/configuracion" className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 bg-gray-50">
                  <i className="pi pi-cog text-base"></i>
                  Configuración
                </Link>
              </nav>
            </div>
          </aside>

          {/* Main content: Form de configuración de perfil */}
          <main className="lg:col-span-3">
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-1">Configuración de Perfil</h2>
              <p className="text-sm text-gray-500 mb-6">Actualiza tu información personal y preferencias de cuenta.</p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
                <div className="md:col-span-1 flex flex-col items-center">
                  <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center">
                    {/* Placeholder image; replace with real upload preview */}
                    <img src="https://images.unsplash.com/photo-1527980965255-d3b416303d12?q=80&w=400&auto=format&fit=crop&ixlib=rb-4.0.3&s=placeholder" alt="Avatar" className="w-full h-full object-cover" />
                  </div>
                  <button className="mt-4 inline-flex items-center px-4 py-2 border border-green-600 text-green-600 rounded-lg text-sm hover:bg-green-50 transition-colors">
                    Cambiar Foto
                  </button>
                </div>

                <div className="md:col-span-2">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
                      <input type="text" defaultValue="Cristian Guzman" className="w-full border border-gray-200 rounded-lg px-3 py-2 bg-gray-100" />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Correo Electrónico</label>
                      <input type="email" defaultValue="crguzman@example.com" className="w-full border border-gray-200 rounded-lg px-3 py-2 bg-gray-100" />
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="flex-1">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Contraseña</label>
                        <input type="password" defaultValue="********" className="w-full border border-gray-200 rounded-lg px-3 py-2 bg-gray-100" />
                      </div>
                      <div className="shrink-0">
                        <button className="mt-6 inline-flex items-center px-4 py-2 border border-green-600 text-green-600 rounded-lg text-sm hover:bg-green-50 transition-colors">Cambiar Contraseña</button>
                      </div>
                    </div>

                    <div className="pt-4">
                      <button className="w-full bg-green-700 text-white py-3 rounded-lg font-semibold hover:bg-green-800 transition-colors">Guardar cambios</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
