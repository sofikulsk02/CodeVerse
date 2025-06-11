import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { 
  Code2, 
  Trophy, 
  Target, 
  TrendingUp, 
  Calendar,
  Award,
  Clock,
  Users,
  LogOut,
  ArrowRight
} from 'lucide-react';

export default function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
  };

  const stats = [
    {
      label: 'Problems Solved',
      value: '0',
      icon: Code2,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      label: 'Contest Rank',
      value: 'New',
      icon: Trophy,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      label: 'Current Streak',
      value: '0 days',
      icon: Target,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
    },
    {
      label: 'Success Rate',
      value: '0%',
      icon: TrendingUp,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Background Pattern */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-32 w-80 h-80 bg-blue-100 rounded-full opacity-10 blur-3xl"></div>
        <div className="absolute -bottom-40 -left-32 w-80 h-80 bg-purple-100 rounded-full opacity-10 blur-3xl"></div>
      </div>

      {/* Header */}
      <div className="relative z-10 bg-white/10 backdrop-blur-md border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <motion.h1 
                className="text-3xl font-bold text-white"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                Welcome back, {user?.name}! 👋
              </motion.h1>
              <motion.p 
                className="text-blue-100 mt-1"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                Ready to solve some problems today?
              </motion.p>
            </div>
            <motion.div 
              className="flex items-center space-x-4"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <button
                onClick={handleLogout}
                className="inline-flex items-center px-4 py-2 border border-white/30 shadow-sm text-sm leading-4 font-medium rounded-md text-white bg-white/10 hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 backdrop-blur-md"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </button>
              <div className="text-right">
                <div className="text-sm font-medium text-white">{user?.name}</div>
                <div className="text-sm text-blue-200 capitalize">{user?.role}</div>
              </div>
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white font-medium">
                {user?.name?.charAt(0).toUpperCase()}
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Card */}
        <motion.div 
          className="card mb-8 bg-gradient-to-r from-blue-600 to-purple-600 text-white border-0"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <div className="card-content">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold mb-2">🎉 Welcome to CampusCode!</h2>
                <p className="text-blue-100 mb-4">
                  Your account has been created successfully. Start your coding journey now!
                </p>
                <div className="flex space-x-4">
                  <motion.button 
                    onClick={() => navigate('/problems')}
                    className="bg-white text-blue-600 px-6 py-3 rounded-md font-medium hover:bg-blue-50 transition-colors flex items-center"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Code2 className="w-4 h-4 mr-2" />
                    Start Solving Problems
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </motion.button>
                  <motion.button 
                    className="border border-white text-white px-4 py-2 rounded-md font-medium hover:bg-white hover:text-blue-600 transition-colors"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    View Tutorials
                  </motion.button>
                </div>
              </div>
              <div className="text-6xl opacity-20">
                🚀
              </div>
            </div>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              className="card bg-white/90 backdrop-blur-sm"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 + index * 0.1 }}
              whileHover={{ y: -2 }}
            >
              <div className="card-content">
                <div className="flex items-center">
                  <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                    <stat.icon className={`w-6 h-6 ${stat.color}`} />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                    <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <motion.div 
            className="card bg-white/90 backdrop-blur-sm"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.9 }}
          >
            <div className="card-header">
              <h3 className="text-lg font-semibold text-gray-900">Quick Actions</h3>
            </div>
            <div className="card-content space-y-3">
              <motion.button 
                onClick={() => navigate('/problems')}
                className="btn-primary w-full justify-start"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Code2 className="w-4 h-4 mr-2" />
                Browse Problems
              </motion.button>
              <motion.button 
                className="btn-outline w-full justify-start"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Trophy className="w-4 h-4 mr-2" />
                Join Contest
              </motion.button>
              <motion.button 
                className="btn-ghost w-full justify-start"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Award className="w-4 h-4 mr-2" />
                Practice Tests
              </motion.button>
            </div>
          </motion.div>

          {/* Getting Started */}
          <motion.div 
            className="card bg-white/90 backdrop-blur-sm lg:col-span-2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1.0 }}
          >
            <div className="card-header">
              <h3 className="text-lg font-semibold text-gray-900">Getting Started</h3>
            </div>
            <div className="card-content">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <motion.div 
                  className="text-center p-4 bg-blue-50 rounded-lg cursor-pointer"
                  onClick={() => navigate('/problems')}
                  whileHover={{ scale: 1.05 }}
                >
                  <Code2 className="w-8 h-8 mx-auto mb-2 text-blue-600" />
                  <h4 className="font-medium mb-1">Solve Problems</h4>
                  <p className="text-sm text-gray-600">Start with easy problems and work your way up</p>
                </motion.div>
                <motion.div 
                  className="text-center p-4 bg-green-50 rounded-lg cursor-pointer"
                  whileHover={{ scale: 1.05 }}
                >
                  <Trophy className="w-8 h-8 mx-auto mb-2 text-green-600" />
                  <h4 className="font-medium mb-1">Join Contests</h4>
                  <p className="text-sm text-gray-600">Compete with others and improve your skills</p>
                </motion.div>
                <motion.div 
                  className="text-center p-4 bg-purple-50 rounded-lg cursor-pointer"
                  whileHover={{ scale: 1.05 }}
                >
                  <Award className="w-8 h-8 mx-auto mb-2 text-purple-600" />
                  <h4 className="font-medium mb-1">Track Progress</h4>
                  <p className="text-sm text-gray-600">Monitor your coding journey and achievements</p>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}