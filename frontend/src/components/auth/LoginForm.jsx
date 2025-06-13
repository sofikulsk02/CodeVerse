import { useState } from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, LogIn, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';

const schema = yup.object({
  email: yup.string().email('Invalid email').required('Email is required'),
  password: yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
});

export default function LoginForm({ onSwitchToRegister }) {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      email: 'student@soma.edu', // Pre-fill for demo
      password: 'password123'
    }
  });

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      const result = await login(data.email, data.password);
      
      if (result.success) {
        toast.success(`Welcome back, ${result.user.name}!`);
        
        // Navigate based on role
        switch (result.user.role) {
          case 'admin':
            navigate('/admin/dashboard');
            break;
          case 'mentor':
            navigate('/instructor/dashboard');
            break;
          default:
            navigate('/dashboard');
        }
      } else {
        toast.error(result.error);
      }
    } catch (error) {
      toast.error('An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  // Demo account quick login
  const handleDemoLogin = async (email, role) => {
    setIsLoading(true);
    const result = await login(email, 'password123');
    
    if (result.success) {
      toast.success(`Logged in as ${role}!`);
      navigate(role === 'admin' ? '/admin/dashboard' : '/dashboard');
    } else {
      toast.error('Demo login failed');
    }
    setIsLoading(false);
  };

  return (
    <motion.div
      className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 shadow-2xl"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Email Field */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
        >
          <label className="block text-white text-sm font-medium mb-2">
            Email Address
          </label>
          <input
            {...register('email')}
            type="email"
            className={`w-full px-4 py-3 bg-white/10 border rounded-xl text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all duration-300 ${
              errors.email ? 'border-red-400' : 'border-white/30'
            }`}
            placeholder="Enter your email"
          />
          {errors.email && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center mt-2 text-red-300 text-sm"
            >
              <AlertCircle className="w-4 h-4 mr-1" />
              {errors.email.message}
            </motion.div>
          )}
        </motion.div>

        {/* Password Field */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <label className="block text-white text-sm font-medium mb-2">
            Password
          </label>
          <div className="relative">
            <input
              {...register('password')}
              type={showPassword ? 'text' : 'password'}
              className={`w-full px-4 py-3 bg-white/10 border rounded-xl text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all duration-300 pr-12 ${
                errors.password ? 'border-red-400' : 'border-white/30'
              }`}
              placeholder="Enter your password"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-blue-200 hover:text-white transition-colors duration-300"
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
          {errors.password && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center mt-2 text-red-300 text-sm"
            >
              <AlertCircle className="w-4 h-4 mr-1" />
              {errors.password.message}
            </motion.div>
          )}
        </motion.div>

        {/* Login Button */}
        <motion.button
          type="submit"
          disabled={isLoading}
          className="w-full bg-white text-purple-600 py-3 px-6 rounded-xl font-semibold hover:bg-blue-50 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed transform hover:-translate-y-1 hover:shadow-lg"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          {isLoading ? (
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-purple-600 mr-2"></div>
              Signing In...
            </div>
          ) : (
            <div className="flex items-center justify-center">
              <LogIn className="w-5 h-5 mr-2" />
              Sign In
            </div>
          )}
        </motion.button>

        {/* Demo Accounts */}
        <motion.div
          className="pt-6 border-t border-white/20"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <p className="text-blue-200 text-sm text-center mb-4">Quick Demo Login:</p>
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => handleDemoLogin('admin@soma.edu', 'admin')}
              disabled={isLoading}
              className="px-3 py-2 bg-red-500/20 text-red-200 rounded-lg text-xs font-medium hover:bg-red-500/30 transition-colors duration-300 disabled:opacity-50"
            >
              Admin
            </button>
            <button
              type="button"
              onClick={() => handleDemoLogin('mentor@soma.edu', 'mentor')}
              disabled={isLoading}
              className="px-3 py-2 bg-yellow-500/20 text-yellow-200 rounded-lg text-xs font-medium hover:bg-yellow-500/30 transition-colors duration-300 disabled:opacity-50"
            >
              Mentor
            </button>
            <button
              type="button"
              onClick={() => handleDemoLogin('student@soma.edu', 'student')}
              disabled={isLoading}
              className="px-3 py-2 bg-green-500/20 text-green-200 rounded-lg text-xs font-medium hover:bg-green-500/30 transition-colors duration-300 disabled:opacity-50"
            >
              Student
            </button>
          </div>
        </motion.div>
      </form>

      {/* Switch to Register */}
      <motion.div
        className="text-center mt-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <p className="text-blue-200 text-sm">
          Don't have an account?{' '}
          <button
            onClick={onSwitchToRegister}
            className="text-white font-semibold hover:text-blue-200 transition-colors duration-300"
          >
            Create one here
          </button>
        </p>
      </motion.div>
    </motion.div>
  );
}