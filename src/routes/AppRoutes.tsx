import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";

const Pets = lazy(() => import("../pages/Pets"));
const Tutors = lazy(() => import("../pages/Tutors"));
const Login = lazy(() => import("../pages/Login"));

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Suspense fallback={<div>Carregando...</div>}>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/pets" element={
            <ProtectedRoute>
              <Pets />
            </ProtectedRoute>
          } />
          <Route path="/tutores" element={
            <ProtectedRoute>
              <Tutors />
            </ProtectedRoute>
          } />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}
