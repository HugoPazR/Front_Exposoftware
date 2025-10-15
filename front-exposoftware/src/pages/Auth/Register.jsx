import { useState } from "react";

function RegisterPage() {
  const [perfil, setPerfil] = useState("");

  return (
    <main className="min-h-screen flex items-center justify-center bg-green-50 py-20">
      <section className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-3xl">
        <h1 className="text-3xl font-bold text-center mb-2 text-green-700">
          Registro de Usuario
        </h1>
        <p className="text-center text-gray-600 mb-6">
          Completa los campos para crear tu cuenta en{" "}
          <span className="font-semibold text-green-600">Exposoftware</span>.
        </p>

        <form className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* ==== INFORMACIÓN PERSONAL ==== */}
          <div className="col-span-2 border-l-4 border-green-600 pl-2 mb-2">
            <h2 className="text-lg font-semibold text-gray-700">
              Información Personal
            </h2>
          </div>

          <div>
            <label className="block font-medium text-gray-700">Nombres</label>
            <input
              type="text"
              placeholder="Nombres"
              className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-green-400 outline-none"
            />
          </div>

          <div>
            <label className="block font-medium text-gray-700">Apellidos</label>
            <input
              type="text"
              placeholder="Apellidos"
              className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-green-400 outline-none"
            />
          </div>

          <div className="col-span-2">
            <label className="block font-medium text-gray-700">Teléfono</label>
            <input
              type="text"
              placeholder="Teléfono (+57 3011234567)"
              className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-green-400 outline-none"
            />
          </div>

          <div>
            <label className="block font-medium text-gray-700">Sexo</label>
            <select className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-green-400 outline-none">
              <option value="">Selecciona Sexo</option>
              <option>Masculino</option>
              <option>Femenino</option>
              <option>Otro</option>
            </select>
          </div>

          <div>
            <label className="block font-medium text-gray-700">
              Orientación Sexual
            </label>
            <select className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-green-400 outline-none">
              <option value="">Selecciona Identidad Sexual</option>
              <option>Heterosexual</option>
              <option>Homosexual</option>
              <option>Bisexual</option>
              <option>Asexual</option>
            </select>
          </div>

          <div>
            <label className="block font-medium text-gray-700">
              Fecha de Nacimiento
            </label>
            <input
              type="date"
              className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-green-400 outline-none"
            />
          </div>

          <div>
            <label className="block font-medium text-gray-700">
              Departamento de Nacimiento
            </label>
            <select className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-green-400 outline-none">
              <option value="">Selecciona Departamento</option>
              <option>Antioquia</option>
              <option>Cundinamarca</option>
              <option>Valle del Cauca</option>
            </select>
          </div>

          <div>
            <label className="block font-medium text-gray-700">
              Municipio de Nacimiento
            </label>
            <select className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-green-400 outline-none">
              <option value="">Selecciona Municipio</option>
              <option>Medellín</option>
              <option>Bogotá</option>
              <option>Cali</option>
            </select>
          </div>

          {/* ==== IDENTIFICACIÓN ==== */}
          <div className="col-span-2 border-l-4 border-green-600 pl-2 mt-4 mb-2">
            <h2 className="text-lg font-semibold text-gray-700">
              Identificación
            </h2>
          </div>

          <div className="col-span-2">
            <label className="block font-medium text-gray-700">
              Selecciona Perfil
            </label>
            <select
              value={perfil}
              onChange={(e) => setPerfil(e.target.value)}
              className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-green-400 outline-none"
            >
              <option value="">Selecciona Perfil</option>
              <option value="estudiante">Estudiante</option>
              <option value="profesor">Profesor</option>
              <option value="invitado">Invitado</option>
            </select>
          </div>

          <div>
            <label className="block font-medium text-gray-700">
              Tipo de Documento
            </label>
            <select className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-green-400 outline-none">
              <option>Tipo de Documento</option>
              <option>CC: Cedula de Ciudadania</option>
              <option>TI: Tarjeta de Identida</option>
              <option>CE: Cedula Extranjera</option>
              <option>PTE: Permiso temporal de Extranjero</option>
              <option>PAS: Pasaporte</option>
            </select>
          </div>

          <div>
            <label className="block font-medium text-gray-700">
              Número de Documento
            </label>
            <input
              type="text"
              placeholder="Número de Documento"
              className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-green-400 outline-none"
            />
          </div>

          {/* ==== INFORMACIÓN ESTUDIANTE ==== */}
          {perfil === "estudiante" && (
            <>
              <div className="col-span-2 border-l-4 border-green-600 pl-2 mt-4 mb-2">
                <h2 className="text-lg font-semibold text-gray-700">
                  Información Estudiante
                </h2>
              </div>

              <div className="col-span-2">
                <label className="block font-medium text-gray-700">
                  Correo Institucional
                </label>
                <input
                  type="email"
                  placeholder="usuario@unicesar.edu.co"
                  className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-green-400 outline-none"
                />
              </div>

              <div>
                <label className="block font-medium text-gray-700">
                  Facultad Perteneciente
                </label>
                <select className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-green-400 outline-none">
                  <option value="">Selecciona Facultad</option>
                  <option>Ingeniería</option>
                  <option>Ciencias de la Salud</option>
                  <option>Administración</option>
                </select>
              </div>

              <div>
                <label className="block font-medium text-gray-700">
                  Semestre
                </label>
                <input
                  type="text"
                  placeholder="Ingrese Semestre cursado"
                  className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-green-400 outline-none"
                />
              </div>

              <div>
                <label className="block font-medium text-gray-700">
                  Fecha de Ingreso
                </label>
                <input
                  type="date"
                  className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-green-400 outline-none"
                />
              </div>
            </>
          )}

          {/* ==== INFORMACIÓN PROFESOR ==== */}
          {perfil === "profesor" && (
            <>
              <div className="col-span-2 border-l-4 border-green-600 pl-2 mt-4 mb-2">
                <h2 className="text-lg font-semibold text-gray-700">
                  Información Profesor
                </h2>
              </div>

              <div className="col-span-2">
                <label className="block font-medium text-gray-700">
                  Correo Institucional
                </label>
                <input
                  type="email"
                  placeholder="usuario@unicesar.edu.co"
                  className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-green-400 outline-none"
                />
              </div>

              <div>
                <label className="block font-medium text-gray-700">
                  Facultad Perteneciente
                </label>
                <select className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-green-400 outline-none">
                  <option value="">Selecciona Facultad</option>
                  <option>Ingeniería</option>
                  <option>Ciencias de la Salud</option>
                  <option>Administración</option>
                </select>
              </div>

              <div>
                <label className="block font-medium text-gray-700">
                  Programa Academico
                </label>
                <select className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-green-400 outline-none">
                  <option value="">Selecciona Programa</option>
                </select>
              </div>

              <div className="col-span-2">
                <label className="block font-medium text-gray-700">
                  Nacionalidad
                </label>
                <select className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-green-400 outline-none">
                  <option value="">Selecciona Nacionalidad</option>
                </select>
              </div>

              <div>
                <label className="block font-medium text-gray-700">
                  Ciudad de Residencia
                </label>
                <select className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-green-400 outline-none">
                  <option value="">Selecciona Ciudad</option>
                </select>
              </div>

              <div>
                <label className="block font-medium text-gray-700">
                  Direccion de Residencia
                </label>
                <select className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-green-400 outline-none">
                  <option value="">Ingresa Direccion</option>
                </select>
              </div>
            </>
          )}

          {/* ==== INFORMACIÓN INVITADO ==== */}
          {perfil === "invitado" && (
            <>
              <div className="col-span-2 border-l-4 border-green-600 pl-2 mt-4 mb-2">
                <h2 className="text-lg font-semibold text-gray-700">
                  Información Invitado
                </h2>
              </div>

              <div className="col-span-2">
                <label className="block font-medium text-gray-700">
                  Correo Personal
                </label>
                <input
                  type="email"
                  placeholder="usuario@dominio.com"
                  className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-green-400 outline-none"
                />
              </div>

            </>
          )}

          {/* ==== CREDENCIALES ==== */}
          <div className="col-span-2 border-l-4 border-green-600 pl-2 mt-4 mb-2">
            <h2 className="text-lg font-semibold text-gray-700">
              Credenciales de Acceso
            </h2>
          </div>

          <div>
            <label className="block font-medium text-gray-700">
              Contraseña
            </label>
            <input
              type="password"
              placeholder="Contraseña"
              className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-green-400 outline-none"
            />
          </div>

          <div>
            <label className="block font-medium text-gray-700">
              Confirmar Contraseña
            </label>
            <input
              type="password"
              placeholder="Confirmar Contraseña"
              className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-green-400 outline-none"
            />
          </div>

          <div className="col-span-2 mt-4">
            <button
              type="submit"
              className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition"
            >
              Registrar Usuario
            </button>
          </div>
        </form>
      </section>
    </main>
  );
}

export default RegisterPage;
