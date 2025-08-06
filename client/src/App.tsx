import React, { useEffect, useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useQuery } from 'react-query';
import { motion, AnimatePresence } from 'framer-motion';
import api from './services/api.ts';
import { AuthProvider, useAuth } from './contexts/AuthContext.tsx';
import { LoadingSpinner } from './components/ui/LoadingSpinner.tsx';
import { LoginPage } from './pages/LoginPage.tsx';
import { RegisterPage } from './pages/RegisterPage.tsx';
import { DashboardPage } from './pages/DashboardPage.tsx';
import { PhotosPage } from './pages/PhotosPage.tsx';
import { TinderPage } from './pages/TinderPage.tsx';
import { TrashPage } from './pages/TrashPage.tsx';
import { SettingsPage } from './pages/SettingsPage.tsx';
import { ProtectedRoute } from './components/auth/ProtectedRoute.tsx';

const AppContent: React.FC = () => {
  const { setUser, isAuthenticated } = useAuth();
  const [isLoading, setIsLoading] = useState(true);

  // Check authentication status on app load
  const { data: userData, isLoading: isUserLoading } = useQuery(
    'currentUser',
    api.getCurrentUser,
    {
      enabled: isAuthenticated,
      retry: false,
      onError: () => {
        api.logout();
        setUser(null);
      },
    }
  );

  useEffect(() => {
    if (userData?.user) {
      setUser(userData.user);
    }
    setIsLoading(false);
  }, [userData, setUser]);

  if (isLoading || isUserLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <AnimatePresence mode="wait">
      <Routes>
        {/* Public routes */}
        <Route
          path="/login"
          element={
            isAuthenticated ? (
              <Navigate to="/dashboard" replace />
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <LoginPage />
              </motion.div>
            )
          }
        />
        <Route
          path="/register"
          element={
            isAuthenticated ? (
              <Navigate to="/dashboard" replace />
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <RegisterPage />
              </motion.div>
            )
          }
        />

        {/* Protected routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <DashboardPage />
              </motion.div>
            </ProtectedRoute>
          }
        />
        <Route
          path="/photos"
          element={
            <ProtectedRoute>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <PhotosPage />
              </motion.div>
            </ProtectedRoute>
          }
        />
        <Route
          path="/tinder"
          element={
            <ProtectedRoute>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <TinderPage />
              </motion.div>
            </ProtectedRoute>
          }
        />
        <Route
          path="/trash"
          element={
            <ProtectedRoute>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <TrashPage />
              </motion.div>
            </ProtectedRoute>
          }
        />
        <Route
          path="/settings"
          element={
            <ProtectedRoute>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <SettingsPage />
              </motion.div>
            </ProtectedRoute>
          }
        />

        {/* Default redirect */}
        <Route
          path="/"
          element={
            isAuthenticated ? (
              <Navigate to="/dashboard" replace />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        {/* 404 route */}
        <Route
          path="*"
          element={
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="min-h-screen bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center"
            >
              <div className="text-center text-white">
                <h1 className="text-6xl font-bold mb-4">404</h1>
                <p className="text-xl mb-8">페이지를 찾을 수 없습니다</p>
                <button
                  onClick={() => window.history.back()}
                  className="btn btn-primary btn-lg"
                >
                  뒤로 가기
                </button>
              </div>
            </motion.div>
          }
        />
      </Routes>
    </AnimatePresence>
  );
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
};

export default App; 