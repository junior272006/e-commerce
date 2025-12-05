// components/ProtectedAdminRoute.tsx
import { Navigate } from 'react-router-dom';
import { isAdminAuthenticated } from '../../api/authService';

interface ProtectedAdminRouteProps {
  children: React.ReactNode;
}

export default function ProtectedAdminRoute({ children }: ProtectedAdminRouteProps) {
  if (!isAdminAuthenticated()) {
    return <Navigate to="/admin/login" replace />;
  }

  return <>{children}</>;
}