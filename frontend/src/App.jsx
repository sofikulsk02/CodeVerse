import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import AuthPage from './pages/AuthPage';
import Dashboard from './pages/Dashboard';
import Problems from './pages/Problems';
import ProblemDetail from './pages/ProblemDetail';
import Contests from './pages/Contests';
import Leaderboard from './pages/Leaderboard';
import AdminDashboard from './pages/admin/AdminDashboard';
import ProblemManagement from './pages/admin/ProblemManagement';
import ContestManagement from './pages/admin/ContestManagement';
import UserManagement from './components/admin/UserManagement';
import ProtectedRoute from './components/layout/ProtectedRoute';

function AppContent() {
  const { isAuthenticated, isLoading, user } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <motion.div 
          className="text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <div className="w-8 h-8 mx-auto mb-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          <p className="text-white">Loading CampusCode...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <motion.div 
          className="absolute -top-40 -right-32 w-96 h-96 bg-gradient-to-br from-blue-400 to-purple-600 rounded-full opacity-20 blur-3xl"
          animate={{ 
            x: [0, 50, 0],
            y: [0, -25, 0],
            scale: [1, 1.1, 1]
          }}
          transition={{ 
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div 
          className="absolute -bottom-40 -left-32 w-96 h-96 bg-gradient-to-br from-pink-400 to-red-600 rounded-full opacity-20 blur-3xl"
          animate={{ 
            x: [0, -50, 0],
            y: [0, 25, 0],
            scale: [1, 1.2, 1]
          }}
          transition={{ 
            duration: 15,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10">
        <Router>
          <Toaster 
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: 'rgba(255, 255, 255, 0.95)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                borderRadius: '12px',
                color: '#1f2937',
                fontWeight: '500',
              },
              success: {
                iconTheme: {
                  primary: '#10b981',
                  secondary: '#ffffff',
                },
              },
              error: {
                iconTheme: {
                  primary: '#ef4444',
                  secondary: '#ffffff',
                },
              },
            }}
          />
          <Routes>
            <Route 
              path="/auth" 
              element={isAuthenticated ? <Navigate to={getHomeRoute(user?.role)} replace /> : <AuthPage />} 
            />
            
            {/* Regular User Routes */}
            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/problems" 
              element={
                <ProtectedRoute>
                  <Problems />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/problems/:id" 
              element={
                <ProtectedRoute>
                  <ProblemDetail />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/contests" 
              element={
                <ProtectedRoute>
                  <Contests />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/leaderboard" 
              element={
                <ProtectedRoute>
                  <Leaderboard />
                </ProtectedRoute>
              } 
            />
            
            {/* Admin Routes */}
            <Route 
              path="/admin/dashboard" 
              element={
                <ProtectedRoute requiredRole="admin">
                  <AdminDashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin/problems" 
              element={
                <ProtectedRoute requiredRole="admin">
                  <ProblemManagement />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin/contests" 
              element={
                <ProtectedRoute requiredRole="admin">
                  <ContestManagement />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin/users" 
              element={
                <ProtectedRoute requiredRole="admin">
                  <UserManagement />
                </ProtectedRoute>
              } 
            />
            
            <Route 
              path="/" 
              element={<Navigate to={isAuthenticated ? getHomeRoute(user?.role) : "/auth"} replace />} 
            />
            <Route 
              path="*" 
              element={<Navigate to="/" replace />} 
            />
          </Routes>
        </Router>
      </div>
    </div>
  );
}

// Helper function to get home route based on role
function getHomeRoute(role) {
  switch (role) {
    case 'admin':
      return '/admin/dashboard';
    case 'mentor':
      return '/dashboard';
    case 'student':
      return '/dashboard';
    default:
      return '/dashboard';
  }
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;