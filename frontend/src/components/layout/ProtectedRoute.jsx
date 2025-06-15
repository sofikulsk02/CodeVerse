import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { motion } from 'framer-motion';

const ProtectedRoute = ({ children, requiredRole = null }) => {
  const { isAuthenticated, user, isLoading } = useAuth();
  const location = useLocation();

  console.log('🛡️ ProtectedRoute check:', { 
    isAuthenticated, 
    userRole: user?.role, 
    requiredRole, 
    path: location.pathname 
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <motion.div 
          className="text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <div className="w-8 h-8 mx-auto mb-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          <p className="text-white">Checking authentication...</p>
        </motion.div>
      </div>
    );
  }

  if (!isAuthenticated) {
    console.log('🚫 Not authenticated, redirecting to /auth');
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  if (requiredRole && user?.role !== requiredRole) {
    console.log('🚫 Insufficient permissions:', { userRole: user?.role, requiredRole });
    
    // Redirect based on user's actual role
    const redirectPath = user?.role === 'admin' ? '/admin/dashboard' : '/dashboard';
    return <Navigate to={redirectPath} replace />;
  }

  console.log('✅ Access granted');
  return children;
};

export default ProtectedRoute;