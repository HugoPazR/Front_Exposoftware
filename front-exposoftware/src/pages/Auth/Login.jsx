import React, { useState, useEffect } from "react";
import { Mail, Lock, Leaf, Users, Trophy, Eye, EyeOff } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import * as AuthService from "../../Services/AuthService";
import { useAuth } from "../../contexts/AuthContext";

export default function LoginPage() {
  const navigate = useNavigate();
  const { login: loginContext } = useAuth();
  
  // Estados del formulario
  const [correo, setCorreo] = useState("");
  const [password, setPassword] = useState("");
  const [recordarme, setRecordarme] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // Si ya está autenticado
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
      
      // ✅ Usar el contexto de autenticación para hacer login
      const resultado = await loginContext({
        correo: correo,
        password: password
      });
      
      console.log("✅ Login exitoso:", resultado);

      if (!resultado.success) {
        throw new Error(resultado.error || "Error al iniciar sesión");
      }

      // Guardar correo si "Recordarme" está activado
      if (recordarme) {
        localStorage.setItem("correoRecordado", correo);
      } else {
        localStorage.removeItem("correoRecordado");
      }

      // Obtener rol del usuario
      const userRole = AuthService.getUserRole();
      
      console.log("👤 userRole obtenido:", userRole);
      
      if (!userRole) {
        throw new Error("No se pudo obtener el rol del usuario");
      }

      // ⏱️ Pequeño delay para asegurar que el estado se propagó
      await new Promise(resolve => setTimeout(resolve, 150));

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
    <main className="min-h-screen flex items-center justify-center bg-green-50 p-4">
      <section className="flex flex-col lg:flex-row w-full max-w-5xl bg-white rounded-2xl shadow-lg overflow-hidden">

        {/* Panel Izquierdo - Info */}
        <aside className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-green-500 via-green-600 to-green-700 text-white p-10 flex-col justify-center relative overflow-hidden">
          <header className="mb-6 relative z-10">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                <span className="text-2xl font-bold">&lt;/&gt;</span>
              </div>
              <h1 className="text-2xl lg:text-3xl font-bold">Expo-Software 2025</h1>
            </div>
            <div className="h-1 w-20 bg-white rounded-full"></div>
          </header>

          <article className="relative z-10">
            <p className="text-lg mb-3 leading-relaxed">
              Descubre los proyectos más innovadores desarrollados por
              estudiantes y profesores.
            </p>
            <p className="text-sm mb-10 text-green-100">
              Una vitrina digital de talento tecnológico y creatividad académica.
            </p>
          </article>

          <footer className="flex gap-8 mt-auto relative z-10">
            <div className="flex flex-col items-center group hover:scale-110 transition-transform">
              <div className="w-14 h-14 bg-white/20 rounded-full flex items-center justify-center mb-2">
                <Leaf size={28} />
              </div>
              <p className="text-2xl font-bold">150+</p>
              <p className="text-sm text-green-100">Proyectos</p>
            </div>
            <div className="flex flex-col items-center group hover:scale-110 transition-transform">
              <div className="w-14 h-14 bg-white/20 rounded-full flex items-center justify-center mb-2">
                <Users size={28} />
              </div>
              <p className="text-2xl font-bold">500+</p>
              <p className="text-sm text-green-100">Participantes</p>
            </div>
            <div className="flex flex-col items-center group hover:scale-110 transition-transform">
              <div className="w-14 h-14 bg-white/20 rounded-full flex items-center justify-center mb-2">
                <Trophy size={28} />
              </div>
              <p className="text-2xl font-bold">15</p>
              <p className="text-sm text-green-100">Premios</p>
            </div>
          </footer>
        </aside>

        {/* Panel Derecho - Formulario */}
        <section className="w-full lg:w-1/2 p-6 sm:p-8 lg:p-10 flex flex-col justify-center">
          {/* Header móvil - Solo visible en móvil/tablet */}
          <header className="lg:hidden mb-6 text-center">
            <div className="flex items-center justify-center gap-2 mb-3">
              <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center">
                <span className="text-2xl font-bold text-white">&lt;/&gt;</span>
              </div>
              <h1 className="text-2xl font-bold text-green-800">Expo-Software 2025</h1>
            </div>
            <div className="h-1 w-20 bg-green-600 rounded-full mx-auto mb-2"></div>
            <p className="text-gray-600 text-sm">Universidad Popular del Cesar</p>
          </header>

          <header className="mb-6">
            <h2 className="text-xl sm:text-2xl font-semibold text-gray-800">Iniciar Sesión</h2>
            <p className="text-gray-500 text-sm sm:text-base">Bienvenido de nuevo a Exposoftware</p>
            
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

          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Correo</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="email"
                  className="w-full border border-gray-300 rounded-lg pl-10 pr-4 py-2 sm:py-3 focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
                  placeholder="usuario@unicesar.edu.co"
                  value={correo}
                  onChange={(e) => setCorreo(e.target.value)}
                  disabled={loading}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Contraseña</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type={showPassword ? "text" : "password"}
                  className="w-full border border-gray-300 rounded-lg pl-10 pr-12 py-2 sm:py-3 focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
                  placeholder="********"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition"
                  aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between text-sm gap-2 sm:gap-0">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={recordarme}
                  onChange={(e) => setRecordarme(e.target.checked)}
                  className="accent-green-600 w-4 h-4"
                />
                <span className="text-gray-700">Recordarme</span>
              </label>
              <a href="#" className="text-green-700 hover:underline text-sm">
                ¿Olvidaste tu contraseña?
              </a>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-lg transition disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Iniciando sesión...
                </>
              ) : (
                "Iniciar Sesión"
              )}
            </button>
          </form>

          <p className="text-sm text-gray-600 text-center mt-6">
            ¿No tienes una cuenta?{" "}
            <Link 
              to="/register" 
              className="text-green-700 font-semibold hover:underline transition"
            >
              Regístrate aquí
            </Link>
          </p>
        </section>
      </section>
    </main>
  );
}