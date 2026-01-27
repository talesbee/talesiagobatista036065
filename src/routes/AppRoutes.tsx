import { lazy, Suspense } from 'react';
import { useTranslation } from 'react-i18next';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';

export default function AppRoutes() {
  const Pets = lazy(() => import('../pages/Pets'));
  const Tutors = lazy(() => import('../pages/Tutors'));
  const Login = lazy(() => import('../pages/Login'));
  const PetDetails = lazy(() => import('../pages/PetDetails'));

  const { t } = useTranslation();
  return (
    <BrowserRouter>
      <Suspense
        fallback={
          <div className="flex flex-1 min-h-[60vh] items-center justify-center">
            <div className="flex flex-col items-center gap-3">
              <div className="w-12 h-12 border-4 border-blue-300 border-t-blue-600 rounded-full animate-spin" />
              <span className="text-blue-700 font-medium mt-2">{t('pets.loading')}</span>
            </div>
          </div>
        }
      >
        <Routes>
          <Route path="/" element={<Login />} />
          <Route
            path="/pets"
            element={
              <ProtectedRoute>
                <Pets />
              </ProtectedRoute>
            }
          />
          <Route
            path="/pets/novo"
            element={
              <ProtectedRoute>
                <PetDetails />
              </ProtectedRoute>
            }
          />
          <Route
            path="/pets/:id"
            element={
              <ProtectedRoute>
                <PetDetails />
              </ProtectedRoute>
            }
          />
          <Route
            path="/tutores"
            element={
              <ProtectedRoute>
                <Tutors />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}
