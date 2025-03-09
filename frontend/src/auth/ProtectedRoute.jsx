import { Navigate } from 'react-router';
import { useAuth } from './AuthProvider';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { isAuthenticated, userRole } = useAuth();

  if (!isAuthenticated || !allowedRoles.includes(userRole)) {
    return <Navigate to="signin" replace />;
  }

  return children;
}

export default ProtectedRoute; 