import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';

function isAuthenticated() {
  const token = localStorage.getItem('token');
  return !!token;
}

export default function ProtectedRoute({ children }: { children: ReactNode }) {
  if (!isAuthenticated()) {
    return <Navigate to="/" replace />;
  }
  return <>{children}</>;
}
