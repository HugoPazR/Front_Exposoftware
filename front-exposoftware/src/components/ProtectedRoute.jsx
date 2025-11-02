import { Navigate } from 'react-router-dom';
import * as AuthService from '../Services/AuthService';

/**
 * Componente para proteger rutas que requieren autenticación
 * Redirige al login si el usuario no está autenticado
 */
export const ProtectedRoute = ({ children, requiredRole = null }) => {
  const isAuthenticated = AuthService.isAuthenticated();
  const userRole = AuthService.getUserRole();

  console.log('🔐 ProtectedRoute - Verificando acceso:');
  console.log('   - Autenticado:', isAuthenticated);
  console.log('   - Rol actual:', userRole);
  console.log('   - Rol requerido:', requiredRole);

  // Si no está autenticado, redirigir al login
  if (!isAuthenticated) {
    console.log('❌ Usuario no autenticado - Redirigiendo a login');
    return <Navigate to="/login" replace />;
  }

  // Si se requiere un rol específico, verificar
  if (requiredRole && userRole !== requiredRole) {
    console.log(`❌ Rol incorrecto. Esperado: ${requiredRole}, Actual: ${userRole}`);
    
    // Redirigir al dashboard correcto según el rol
    switch (userRole) {
      case 'admin':
        return <Navigate to="/admin/dash" replace />;
      case 'docente':
        return <Navigate to="/teacher/dashboard" replace />;
      case 'estudiante':
        return <Navigate to="/student/dashboard" replace />;
      case 'egresado':
        return <Navigate to="/graduate/dashboard" replace />;
      case 'invitado':
        return <Navigate to="/guest/dashboard" replace />;
      default:
        return <Navigate to="/login" replace />;
    }
  }

  console.log('✅ Acceso permitido');
  // Usuario autenticado y con el rol correcto
  return children;
};

/**
 * Componente para proteger rutas de admin
 */
export const AdminRoute = ({ children }) => {
  return <ProtectedRoute requiredRole="admin">{children}</ProtectedRoute>;
};

/**
 * Componente para proteger rutas de docente
 */
export const DocenteRoute = ({ children }) => {
  return <ProtectedRoute requiredRole="docente">{children}</ProtectedRoute>;
};

/**
 * Componente para proteger rutas de estudiante
 */
export const EstudianteRoute = ({ children }) => {
  return <ProtectedRoute requiredRole="estudiante">{children}</ProtectedRoute>;
};

/**
 * Componente para proteger rutas de egresado
 */
export const EgresadoRoute = ({ children }) => {
  return <ProtectedRoute requiredRole="egresado">{children}</ProtectedRoute>;
};

/**
 * Componente para proteger rutas de invitado
 */
export const InvitadoRoute = ({ children }) => {
  return <ProtectedRoute requiredRole="invitado">{children}</ProtectedRoute>;
};