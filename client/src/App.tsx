import React, { useEffect, useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { AuthProvider } from './contexts/AuthContext.tsx';
import { LoadingSpinner } from './components/ui/LoadingSpinner.tsx';
import { DashboardPage } from './pages/DashboardPage.tsx';
import { PhotosPage } from './pages/PhotosPage.tsx';
import { TinderPage } from './pages/TinderPage.tsx';
import { TrashPage } from './pages/TrashPage.tsx';
import { SettingsPage } from './pages/SettingsPage.tsx';

const AppContent: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // 테스트 모드: 바로 로딩 완료
    setIsLoading(false);
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <AnimatePresence mode="wait">
      <Routes>
        {/* Main routes - 테스트 모드에서는 인증 없이 접근 가능 */}
        <Route
          path="/dashboard"
          element={
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <DashboardPage />
            </motion.div>
          }
        />
        <Route
          path="/photos"
          element={
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <PhotosPage />
            </motion.div>
          }
        />
        <Route
          path="/tinder"
          element={
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <TinderPage />
            </motion.div>
          }
        />
        <Route
          path="/trash"
          element={
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <TrashPage />
            </motion.div>
          }
        />
        <Route
          path="/settings"
          element={
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <SettingsPage />
            </motion.div>
          }
        />

        {/* Default redirect - 바로 대시보드로 */}
        <Route
          path="/"
          element={<Navigate to="/dashboard" replace />}
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