import React, { useState, useEffect } from "react";
import { Mail, Lock, Leaf, Users, Trophy } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import * as AuthService from "../../Services/AuthService";

function LoginPage() {
  const navigate = useNavigate();
  
  // Estados del formulario
  const [correo, setCorreo] = useState("");
  const [password, setPassword] = useState("");
  const [recordarme, setRecordarme] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // Verificar si ya está autenticado al cargar la página
  useEffect(() => {
    const token = AuthService.getToken();
    if (token) {
      const userData = AuthService.getUserData();
      if (userData && userData.rol) {
        // Redirigir según el rol
        switch(userData.rol.toLowerCase()) {
          case 'estudiante':
            navigate('/student/dashboard');
            break;
          case 'docente':
          case 'profesor':
            navigate('/teacher/dashboard');
            break;
          case 'administrador':
          case 'admin':
            navigate('/admin/dashboard');
            break;
          case 'egresado':
            navigate('/graduate/dashboard');
            break;
          case 'invitado':
            navigate('/guest/dashboard');
            break;
          default:
            navigate('/');
        }
      }
    }
  }, [navigate]);

  // Cargar correo guardado
  useEffect(() => {
    const correoGuardado = localStorage.getItem("correoRecordado");
    if (correoGuardado) {
      setCorreo(correoGuardado);
      setRecordarme(true);
    }
  }, []);

  // Manejar submit del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validaciones básicas
    if (!correo.trim()) {
      setError("El correo electrónico es obligatorio");
      return;
    }
    
    if (!password.trim()) {
      setError("La contraseña es obligatoria");
      return;
    }

    setLoading(true);
    setError("");

    try {
      console.log("📤 Intentando iniciar sesión con:", correo);
      
      // Llamar al servicio de autenticación con el formato correcto
      const response = await AuthService.login({
        correo: correo,
        password: password
      });
      
      console.log("✅ Login exitoso:", response);

      // Guardar correo si "Recordarme" está activado
      if (recordarme) {
        localStorage.setItem("correoRecordado", correo);
      } else {
        localStorage.removeItem("correoRecordado");
      }

      // Obtener datos del usuario
      const userData = AuthService.getUserData();
      const userRole = AuthService.getUserRole();
      
      console.log("📦 userData obtenido:", userData);
      console.log("👤 userRole obtenido:", userRole);
      
      if (!userRole) {
        throw new Error("No se pudo obtener el rol del usuario");
      }

      // Redirigir según el rol
      const rol = userRole.toLowerCase();
      console.log("🔀 Redirigiendo usuario con rol:", rol);

      switch(rol) {
        case 'estudiante':
          navigate('/student/dashboard');
          break;
        case 'docente':
        case 'profesor':
          navigate('/teacher/dashboard');
          break;
        case 'administrador':
        case 'admin':
          navigate('/admin/dashboard');
          break;
        case 'egresado':
          navigate('/graduate/dashboard');
          break;
        case 'invitado':
          navigate('/guest/dashboard');
          break;
        default:
          console.warn("⚠️ Rol no reconocido:", rol);
          navigate('/');
      }

    } catch (err) {
      console.error("❌ Error en login:", err);
      
      // Manejar diferentes tipos de errores
      if (err.message.includes('502') || err.message.includes('503')) {
        setError("⚠️ El servidor no está disponible temporalmente. Por favor, intenta más tarde.");
      } else if (err.message.includes('conexión') || err.message.includes('network')) {
        setError("🌐 Error de conexión. Verifica tu conexión a internet.");
      } else if (err.message.includes('401') || err.message.includes('credenciales')) {
        setError("❌ Correo o contraseña incorrectos. Por favor, verifica tus datos.");
      } else {
        setError(err.message || "Error al iniciar sesión. Por favor, intenta nuevamente.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-green-50">
      <section className="flex w-full max-w-5xl bg-white rounded-2xl shadow-lg overflow-hidden">

        {/* Panel informativo */}
        <aside className="w-1/2 bg-gradient-to-r from-green-500 to-green-700 text-white p-10 flex flex-col justify-center">
          <header className="mb-6">
            <h1 className="text-3xl font-bold">&lt;/&gt; Expo-Software 2025</h1>
          </header>

          <article>
            <p className="text-lg mb-3">
              Descubre los proyectos más innovadores desarrollados por estudiantes y profesores.
            </p>
            <p className="text-sm mb-10">
              Una vitrina digital de talento tecnológico y creatividad académica.
            </p>
          </article>

          <footer className="flex gap-6 mt-auto">
            <div className="flex flex-col items-center">
              <Leaf className="mb-1" size={28} />
              <p className="text-xl font-semibold">150+</p>
              <p className="text-sm">Proyectos</p>
            </div>
            <div className="flex flex-col items-center">
              <Users className="mb-1" size={28} />
              <p className="text-xl font-semibold">500+</p>
              <p className="text-sm">Participantes</p>
            </div>
            <div className="flex flex-col items-center">
              <Trophy className="mb-1" size={28} />
              <p className="text-xl font-semibold">15</p>
              <p className="text-sm">Premios</p>
            </div>
          </footer>
        </aside>

        {/* Panel de inicio de sesión */}
        <section className="w-1/2 p-10 flex flex-col justify-center">
          <header className="mb-6">
            <h2 className="text-2xl font-semibold text-gray-800">Iniciar Sesión</h2>
            <p className="text-gray-500">Bienvenido de nuevo a Exposoftware</p>
            
            {/* Mostrar error si existe */}
            {error && (
              <div className={`mt-4 border px-4 py-3 rounded-lg text-sm ${
                error.includes('servidor') || error.includes('502') || error.includes('503')
                  ? 'bg-yellow-50 border-yellow-300 text-yellow-800'
                  : 'bg-red-50 border-red-200 text-red-700'
              }`}>
                <div className="flex items-start gap-2">
                  {error.includes('servidor') || error.includes('502') || error.includes('503') ? (
                    <span className="text-xl">⚠️</span>
                  ) : error.includes('conexión') ? (
                    <span className="text-xl">🌐</span>
                  ) : (
                    <span className="text-xl">❌</span>
                  )}
                  <div>
                    <p className="font-semibold">{error.includes('servidor') ? 'Servidor no disponible' : 'Error'}</p>
                    <p>{error}</p>
                  </div>
                </div>
              </div>
            )}
          </header>

          <form className="space-y-5" onSubmit={handleSubmit}>
            <fieldset>
              <label className="block text-sm font-medium mb-1 text-gray-600">
                Correo Electrónico
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 text-gray-400" size={18} />
                <input
                  type="email"
                  placeholder="tu@email.com"
                  value={correo}
                  onChange={(e) => setCorreo(e.target.value)}
                  disabled={loading}
                  className="w-full border border-gray-300 rounded-lg pl-10 pr-4 py-2 
                             focus:outline-none focus:ring-2 focus:ring-green-500
                             disabled:bg-gray-100 disabled:cursor-not-allowed"
                  required
                />
              </div>
            </fieldset>

            <fieldset>
              <label className="block text-sm font-medium mb-1 text-gray-600">
                Contraseña
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 text-gray-400" size={18} />
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="********"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
                  className="w-full border border-gray-300 rounded-lg pl-10 pr-12 py-2 
                             focus:outline-none focus:ring-2 focus:ring-green-500
                             disabled:bg-gray-100 disabled:cursor-not-allowed"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                  disabled={loading}
                >
                  {showPassword ? (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                      <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z" clipRule="evenodd" />
                      <path d="M12.454 16.697L9.75 13.992a4 4 0 01-3.742-3.741L2.335 6.578A9.98 9.98 0 00.458 10c1.274 4.057 5.065 7 9.542 7 .847 0 1.669-.105 2.454-.303z" />
                    </svg>
                  )}
                </button>
              </div>
            </fieldset>

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2">
                <input 
                  type="checkbox" 
                  className="accent-green-600"
                  checked={recordarme}
                  onChange={(e) => setRecordarme(e.target.checked)}
                  disabled={loading}
                />
                Recordarme
              </label>
              <a href="#" className="text-green-700 hover:underline">
                ¿Olvidaste tu contraseña?
              </a>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 rounded-lg transition
                         disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Iniciando sesión...
                </>
              ) : (
                'Iniciar Sesión'
              )}
            </button>
          </form>

          <footer className="text-sm text-center mt-5 text-gray-600">
            ¿No tienes una cuenta?{" "}
            <Link to="/register" className="text-green-700 font-semibold hover:underline">
              Regístrate aquí
            </Link>
          </footer>
        </section>
      </section>
    </main>
  );
}

export default LoginPage;
