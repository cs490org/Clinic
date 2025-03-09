import { Navigate } from 'react-router';
import { useAuth } from './AuthProvider';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { isAuthenticated, user } = useAuth();

  // Check if user is authenticated and has a valid role
  if (!isAuthenticated || !user || !user.role || !allowedRoles.includes(user.role)) {
    return <Navigate to="signin" replace />;
  }

  return children;
}

export default ProtectedRoute; 