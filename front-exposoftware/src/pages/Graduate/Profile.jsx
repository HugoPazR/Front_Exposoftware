import React from "react";
import { Link } from "react-router-dom";
import logo from "../../assets/Logo-unicesar.png";

export default function GraduateProfile() {
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
                  <span className="text-green-600 font-bold text-lg">EG</span>
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
                <Link to="/graduate/dashboard" className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50">
                  <i className="pi pi-home text-base"></i>
                  Dashboard
                </Link>
                <Link to="/graduate/proyectos" className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50">
                  <i className="pi pi-briefcase text-base"></i>
                  Mis Proyectos
                </Link>
                <Link to="/graduate/profile" className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 bg-green-50 text-green-700">
                  <i className="pi pi-cog text-base"></i>
                  Configuración
                </Link>
              </nav>
            </div>
          </aside>

          {/* Main content: Form de configuración de perfil */}
          <main className="lg:col-span-3">
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-1">Perfil Profesional</h2>
              <p className="text-sm text-gray-500 mb-6">Actualiza tu información profesional y de contacto.</p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
                <div className="md:col-span-1 flex flex-col items-center">
                  <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center">
                    {/* Placeholder image; replace with real upload preview */}
                    <img src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=400&auto=format&fit=crop&ixlib=rb-4.0.3" alt="Avatar" className="w-full h-full object-cover" />
                  </div>
                  <button className="mt-4 inline-flex items-center px-4 py-2 border border-green-600 text-green-600 rounded-lg text-sm hover:bg-green-50 transition-colors">
                    Cambiar Foto
                  </button>
                  <div className="mt-6 text-center">
                    <p className="text-sm font-medium text-gray-700">Egresado UPC</p>
                    <p className="text-xs text-gray-500 mt-1">Promoción 2023</p>
                  </div>
                </div>

                <div className="md:col-span-2">
                  <div className="space-y-4">
                    {/* Información Personal */}
                    <div className="border-b pb-4">
                      <h3 className="text-md font-semibold text-gray-900 mb-3 flex items-center gap-2">
                        <i className="pi pi-user text-green-600"></i>
                        Información Personal
                      </h3>
                      <div className="space-y-3">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Nombre Completo</label>
                          <input type="text" defaultValue="Juan Carlos Pérez" className="w-full border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500" />
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Cédula</label>
                            <input type="text" defaultValue="1065123456" className="w-full border border-gray-200 rounded-lg px-3 py-2 bg-gray-100" readOnly />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Año de Graduación</label>
                            <input type="text" defaultValue="2023" className="w-full border border-gray-200 rounded-lg px-3 py-2 bg-gray-100" readOnly />
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Correo Electrónico</label>
                          <input type="email" defaultValue="jc.perez@example.com" className="w-full border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500" />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Teléfono</label>
                          <input type="tel" defaultValue="+57 300 123 4567" className="w-full border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500" />
                        </div>
                      </div>
                    </div>

                    {/* Información Profesional */}
                    <div className="border-b pb-4">
                      <h3 className="text-md font-semibold text-gray-900 mb-3 flex items-center gap-2">
                        <i className="pi pi-briefcase text-green-600"></i>
                        Información Profesional
                      </h3>
                      <div className="space-y-3">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Empresa Actual</label>
                          <input type="text" defaultValue="Tech Solutions S.A.S" className="w-full border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500" />
                        </div>

                      </div>
                    </div>

                    {/* Seguridad */}
                    <div className="pb-4">
                      <h3 className="text-md font-semibold text-gray-900 mb-3 flex items-center gap-2">
                        <i className="pi pi-lock text-green-600"></i>
                        Seguridad
                      </h3>
                      <div className="flex items-center gap-4">
                        <div className="flex-1">
                          <label className="block text-sm font-medium text-gray-700 mb-1">Contraseña</label>
                          <input type="password" defaultValue="********" className="w-full border border-gray-200 rounded-lg px-3 py-2 bg-gray-100" readOnly />
                        </div>
                        <div className="shrink-0">
                          <button className="mt-6 inline-flex items-center px-4 py-2 border border-green-600 text-green-600 rounded-lg text-sm hover:bg-green-50 transition-colors">
                            Cambiar Contraseña
                          </button>
                        </div>
                      </div>
                    </div>


                    <div className="pt-4 flex gap-3">
                      <button className="flex-1 bg-green-700 text-white py-3 rounded-lg font-semibold hover:bg-green-800 transition-colors">
                        Guardar Cambios
                      </button>
                      <button className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors">
                        Cancelar
                      </button>
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
