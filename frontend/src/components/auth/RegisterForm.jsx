import { useState } from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useAuth } from '../../contexts/AuthContext';
import { Eye, EyeOff, UserPlus, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';

const schema = yup.object({
  name: yup.string().min(2, 'Name must be at least 2 characters').required('Name is required'),
  email: yup.string().email('Invalid email').required('Email is required'),
  password: yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
  confirmPassword: yup.string()
    .oneOf([yup.ref('password')], 'Passwords must match')
    .required('Confirm password is required'),
});

export default function RegisterForm({ onSwitchToLogin }) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { register: registerUser } = useAuth();

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
      await registerUser({
        name: data.name,
        email: data.email,
        password: data.password,
        role: 'student', // Default role
      });
      toast.success('Registration successful!');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Registration failed');
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
          Join CampusCode! 🚀
        </motion.h2>
        <motion.p 
          className="text-secondary-600"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          Create your account to start coding
        </motion.p>
      </div>

      <div className="card-content">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            <label htmlFor="name" className="block text-sm font-medium text-secondary-700 mb-1">
              Full Name
            </label>
            <input
              {...register('name')}
              type="text"
              id="name"
              className={`input ${errors.name ? 'input-error' : ''}`}
              placeholder="Enter your full name"
            />
            {errors.name && (
              <div className="flex items-center mt-1 text-danger-600 text-sm">
                <AlertCircle className="w-4 h-4 mr-1" />
                {errors.name.message}
              </div>
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
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
            transition={{ delay: 0.6 }}
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
                placeholder="Create a password"
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

          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.7 }}
          >
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-secondary-700 mb-1">
              Confirm Password
            </label>
            <div className="relative">
              <input
                {...register('confirmPassword')}
                type={showConfirmPassword ? 'text' : 'password'}
                id="confirmPassword"
                className={`input pr-10 ${errors.confirmPassword ? 'input-error' : ''}`}
                placeholder="Confirm your password"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-secondary-400 hover:text-secondary-600"
              >
                {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {errors.confirmPassword && (
              <div className="flex items-center mt-1 text-danger-600 text-sm">
                <AlertCircle className="w-4 h-4 mr-1" />
                {errors.confirmPassword.message}
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
            transition={{ delay: 0.8 }}
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <div className="loading-spinner mr-2"></div>
                Creating account...
              </div>
            ) : (
              <div className="flex items-center justify-center">
                <UserPlus className="w-4 h-4 mr-2" />
                Create Account
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
          transition={{ delay: 0.9 }}
        >
          Already have an account?{' '}
          <button
            onClick={onSwitchToLogin}
            className="text-primary-600 hover:text-primary-700 font-medium"
          >
            Sign in here
          </button>
        </motion.div>
      </div>
    </motion.div>
  );
}