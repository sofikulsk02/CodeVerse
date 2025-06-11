import { useState } from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useAuth } from '../../contexts/AuthContext';
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

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      await login(data.email, data.password);
      toast.success('Login successful!');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      className="card max-w-md w-full"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="card-header text-center">
        <motion.h2 
          className="text-2xl font-bold gradient-text mb-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          Welcome Back! 👋
        </motion.h2>
        <motion.p 
          className="text-secondary-600"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          Sign in to your CampusCode account
        </motion.p>
      </div>

      <div className="card-content">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            <label htmlFor="email" className="block text-sm font-medium text-secondary-700 mb-1">
              Email Address
            </label>
            <input
              {...register('email')}
              type="email"
              id="email"
              className={`input ${errors.email ? 'input-error' : ''}`}
              placeholder="Enter your email"
            />
            {errors.email && (
              <div className="flex items-center mt-1 text-danger-600 text-sm">
                <AlertCircle className="w-4 h-4 mr-1" />
                {errors.email.message}
              </div>
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
          >
            <label htmlFor="password" className="block text-sm font-medium text-secondary-700 mb-1">
              Password
            </label>
            <div className="relative">
              <input
                {...register('password')}
                type={showPassword ? 'text' : 'password'}
                id="password"
                className={`input pr-10 ${errors.password ? 'input-error' : ''}`}
                placeholder="Enter your password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-secondary-400 hover:text-secondary-600"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {errors.password && (
              <div className="flex items-center mt-1 text-danger-600 text-sm">
                <AlertCircle className="w-4 h-4 mr-1" />
                {errors.password.message}
              </div>
            )}
          </motion.div>

          <motion.button
            type="submit"
            disabled={isLoading}
            className="btn-primary w-full"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <div className="loading-spinner mr-2"></div>
                Signing in...
              </div>
            ) : (
              <div className="flex items-center justify-center">
                <LogIn className="w-4 h-4 mr-2" />
                Sign In
              </div>
            )}
          </motion.button>
        </form>
      </div>

      <div className="card-footer">
        <motion.div 
          className="text-center text-sm text-secondary-600"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
        >
          Don't have an account?{' '}
          <button
            onClick={onSwitchToRegister}
            className="text-primary-600 hover:text-primary-700 font-medium"
          >
            Create one here
          </button>
        </motion.div>
      </div>
    </motion.div>
  );
}