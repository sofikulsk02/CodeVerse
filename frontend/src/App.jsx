import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import AuthPage from './pages/AuthPage';
import Dashboard from './pages/Dashboard';
import Problems from './pages/Problems';
import ProblemDetail from './pages/ProblemDetail';
import ProtectedRoute from './components/layout/ProtectedRoute';
import { Toaster } from 'react-hot-toast';
import { motion } from 'framer-motion';

function AppContent() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-800 flex items-center justify-center">
        {/* Animated Background */}
        <div className="absolute inset-0 overflow-hidden">
          <motion.div 
            className="absolute -top-40 -right-32 w-96 h-96 bg-white rounded-full opacity-10 blur-3xl"
            animate={{ 
              x: [0, 100, 0],
              y: [0, -50, 0],
              scale: [1, 1.1, 1]
            }}
            transition={{ 
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          <motion.div 
            className="absolute -bottom-40 -left-32 w-96 h-96 bg-pink-300 rounded-full opacity-10 blur-3xl"
            animate={{ 
              x: [0, -100, 0],
              y: [0, 50, 0],
              scale: [1, 1.2, 1]
            }}
            transition={{ 
              duration: 10,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          <motion.div 
            className="absolute top-1/2 left-1/2 w-72 h-72 bg-cyan-300 rounded-full opacity-5 blur-3xl"
            animate={{ 
              rotate: [0, 360],
              scale: [1, 1.3, 1]
            }}
            transition={{ 
              duration: 15,
              repeat: Infinity,
              ease: "linear"
            }}
          />
        </div>

        {/* Loading Content */}
        <div className="relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <motion.div 
              className="w-16 h-16 mx-auto mb-6 bg-white rounded-full flex items-center justify-center"
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            >
              <div className="text-2xl">🚀</div>
            </motion.div>
            <motion.h1 
              className="text-4xl font-bold text-white mb-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              CampusCode
            </motion.h1>
            <motion.p 
              className="text-xl text-blue-100 mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              Loading your coding universe...
            </motion.p>
            <motion.div 
              className="w-64 h-2 bg-white/20 rounded-full mx-auto overflow-hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              <motion.div 
                className="h-full bg-gradient-to-r from-white to-blue-200 rounded-full"
                initial={{ width: "0%" }}
                animate={{ width: "100%" }}
                transition={{ duration: 3, repeat: Infinity }}
              />
            </motion.div>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Global Background Effects */}
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
        <motion.div 
          className="absolute top-1/4 right-1/4 w-72 h-72 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-full opacity-10 blur-3xl"
          animate={{ 
            rotate: [0, 360],
            scale: [1, 1.3, 1]
          }}
          transition={{ 
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10">
        <Router>
          <div className="App">
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
                element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <AuthPage />} 
              />
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
                path="/" 
                element={<Navigate to={isAuthenticated ? "/dashboard" : "/auth"} replace />} 
              />
            </Routes>
          </div>
        </Router>
      </div>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
