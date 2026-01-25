import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';

function isAuthenticated() {
  const token = localStorage.getItem('token');
  // Simples: só verifica se existe. Para produção, decodifique e cheque expiração.
  return !!token;
}

export default function ProtectedRoute({ children }: { children: ReactNode }) {
  if (!isAuthenticated()) {
    return <Navigate to="/" replace />;
  }
  return <>{children}</>;
}
