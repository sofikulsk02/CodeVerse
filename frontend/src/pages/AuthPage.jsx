import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Toaster } from 'react-hot-toast';
import LoginForm from '../components/auth/LoginForm';
import RegisterForm from '../components/auth/RegisterForm';
import { APP_NAME } from '../constants';

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);

  const switchToRegister = () => setIsLogin(false);
  const switchToLogin = () => setIsLogin(true);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated Background Patterns */}
      <div className="absolute inset-0">
        <motion.div 
          className="absolute -top-40 -right-32 w-96 h-96 bg-gradient-to-br from-blue-400 to-cyan-600 rounded-full opacity-30 blur-3xl"
          animate={{ 
            x: [0, 100, 0],
            y: [0, -50, 0],
            scale: [1, 1.2, 1]
          }}
          transition={{ 
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div 
          className="absolute -bottom-40 -left-32 w-96 h-96 bg-gradient-to-br from-pink-400 to-rose-600 rounded-full opacity-30 blur-3xl"
          animate={{ 
            x: [0, -100, 0],
            y: [0, 50, 0],
            scale: [1, 1.1, 1]
          }}
          transition={{ 
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div 
          className="absolute top-1/2 left-1/2 w-72 h-72 bg-gradient-to-br from-yellow-400 to-orange-600 rounded-full opacity-20 blur-3xl"
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

      {/* Grid Pattern Overlay */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
          backgroundSize: '40px 40px'
        }} />
      </div>

      <div className="relative z-10 w-full max-w-md">
        {/* Logo Header */}
        <motion.div 
          className="text-center mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <motion.div
            className="inline-block mb-4"
            whileHover={{ scale: 1.1, rotate: 5 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <div className="w-16 h-16 bg-gradient-to-br from-white to-blue-100 rounded-2xl flex items-center justify-center shadow-2xl">
              <span className="text-2xl">🚀</span>
            </div>
          </motion.div>
          <motion.h1 
            className="text-5xl font-bold bg-gradient-to-r from-white via-blue-100 to-cyan-200 bg-clip-text text-transparent mb-2"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 100 }}
          >
            {APP_NAME}
          </motion.h1>
          <motion.p 
            className="text-blue-100 text-lg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            Your Gateway to Competitive Programming
          </motion.p>
        </motion.div>

        {/* Tab Switcher */}
        <motion.div 
          className="flex bg-white/10 backdrop-blur-md rounded-xl p-1 mb-6 border border-white/20"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
        >
          <button
            onClick={switchToLogin}
            className={`flex-1 py-3 px-4 rounded-lg text-sm font-medium transition-all duration-300 ${
              isLogin
                ? 'bg-white text-purple-600 shadow-lg'
                : 'text-white hover:text-blue-200'
            }`}
          >
            Sign In
          </button>
          <button
            onClick={switchToRegister}
            className={`flex-1 py-3 px-4 rounded-lg text-sm font-medium transition-all duration-300 ${
              !isLogin
                ? 'bg-white text-purple-600 shadow-lg'
                : 'text-white hover:text-blue-200'
            }`}
          >
            Sign Up
          </button>
        </motion.div>

        {/* Form Container */}
        <AnimatePresence mode="wait">
          {isLogin ? (
            <motion.div
              key="login"
              initial={{ opacity: 0, x: -20, rotateY: -15 }}
              animate={{ opacity: 1, x: 0, rotateY: 0 }}
              exit={{ opacity: 0, x: 20, rotateY: 15 }}
              transition={{ duration: 0.4 }}
            >
              <LoginForm onSwitchToRegister={switchToRegister} />
            </motion.div>
          ) : (
            <motion.div
              key="register"
              initial={{ opacity: 0, x: 20, rotateY: 15 }}
              animate={{ opacity: 1, x: 0, rotateY: 0 }}
              exit={{ opacity: 0, x: -20, rotateY: -15 }}
              transition={{ duration: 0.4 }}
            >
              <RegisterForm onSwitchToLogin={switchToLogin} />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Footer */}
        <motion.div 
          className="text-center mt-8 text-sm text-blue-200"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          <motion.p
            className="inline-block"
            animate={{ 
              backgroundPosition: ['0% 50%', '100% 50%', '0% 50%']
            }}
            transition={{ 
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            style={{
              background: 'linear-gradient(270deg, #60a5fa, #a78bfa, #f472b6, #60a5fa)',
              backgroundSize: '200% 200%',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}
          >
            © 2025 {APP_NAME}. Empowering the next generation of coders.
          </motion.p>
        </motion.div>
      </div>
    </div>
  );
}