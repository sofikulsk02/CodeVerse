import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { 
  Code2, Trophy, Target, TrendingUp, Calendar, 
  BookOpen, Award, Users, LogOut, Settings,
  ChevronRight, Sparkles, Zap
} from 'lucide-react';
import toast from 'react-hot-toast';
import { problemService } from '../services/problemService';

export default function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    problemsSolved: 0,
    contestRank: 'New',
    currentStreak: 0,
    successRate: 0,
    totalPoints: 0,
    totalSubmissions: 0,
    acceptedSubmissions: 0
  });
  const [recentActivity, setRecentActivity] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      
      // Try to load user stats from API
      try {
        const response = await fetch('http://localhost:5000/api/users/stats', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        
        if (response.ok) {
          const statsData = await response.json();
          setStats({
            problemsSolved: statsData.stats?.totalSolved || 0,
            contestRank: statsData.stats?.rank || 'New',
            currentStreak: statsData.stats?.streakDays || 0,
            successRate: statsData.stats?.accuracy || 0,
            totalPoints: statsData.stats?.totalPoints || 0,
            totalSubmissions: statsData.stats?.totalSubmissions || 0,
            acceptedSubmissions: statsData.stats?.acceptedSubmissions || 0
          });
        }
      } catch (apiError) {
        console.log('API not available, using mock data');
        // Use mock data if API fails
        setStats({
          problemsSolved: 0,
          contestRank: 'New',
          currentStreak: 0,
          successRate: 0,
          totalPoints: 0,
          totalSubmissions: 0,
          acceptedSubmissions: 0
        });
      }

      // Mock recent activity
      setRecentActivity([
        {
          id: 1,
          type: 'welcome',
          title: 'Welcome to CampusCode!',
          time: 'Just now',
          icon: '🎉'
        },
        {
          id: 2,
          type: 'info',
          title: 'Start solving problems to track your progress',
          time: 'Getting started',
          icon: '💡'
        }
      ]);

    } catch (error) {
      console.error('Error loading dashboard:', error);
      // Don't show error toast, just use default values
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    navigate('/auth');
  };

  const statCards = [
    {
      label: 'Problems Solved',
      value: stats.problemsSolved,
      icon: Code2,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200'
    },
    {
      label: 'Contest Rank',
      value: stats.contestRank,
      icon: Trophy,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200'
    },
    {
      label: 'Current Streak',
      value: `${stats.currentStreak} days`,
      icon: Target,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      borderColor: 'border-orange-200'
    },
    {
      label: 'Success Rate',
      value: `${Math.round(stats.successRate)}%`,
      icon: TrendingUp,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-200'
    },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <motion.div
          className="text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <div className="loading-spinner w-12 h-12 mx-auto mb-4 border-white"></div>
          <p className="text-white text-lg">Loading your dashboard...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <motion.header
        className="bg-white/10 backdrop-blur-md border-b border-white/20"
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <motion.div
                className="flex items-center space-x-3"
                whileHover={{ scale: 1.05 }}
              >
                <div className="w-8 h-8 bg-gradient-to-r from-blue-400 to-purple-500 rounded-lg flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <h1 className="text-xl font-bold text-white">CampusCode</h1>
              </motion.div>
            </div>

            <div className="flex items-center space-x-4">
              <motion.button
                onClick={() => navigate('/problems')}
                className="text-white/80 hover:text-white transition-colors duration-300"
                whileHover={{ scale: 1.05 }}
              >
                <BookOpen className="w-5 h-5" />
              </motion.button>
              <motion.button
                onClick={() => navigate('/profile')}
                className="text-white/80 hover:text-white transition-colors duration-300"
                whileHover={{ scale: 1.05 }}
              >
                <Settings className="w-5 h-5" />
              </motion.button>
              <motion.button
                onClick={handleLogout}
                className="text-white/80 hover:text-red-400 transition-colors duration-300"
                whileHover={{ scale: 1.05 }}
              >
                <LogOut className="w-5 h-5" />
              </motion.button>
              
              <div className="flex items-center space-x-3">
                <div className="text-right">
                  <div className="text-white font-medium">{user?.name}</div>
                  <div className="text-white/60 text-sm capitalize">{user?.role}</div>
                </div>
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                  {user?.name?.charAt(0)?.toUpperCase()}
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl font-bold text-white mb-2">
            Welcome back, {user?.name}! 👋
          </h2>
          <p className="text-white/70 text-lg">Ready to solve some problems today?</p>
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {statCards.map((stat, index) => (
            <motion.div
              key={stat.label}
              className={`${stat.bgColor} ${stat.borderColor} border rounded-2xl p-6 hover:shadow-lg transition-all duration-300`}
              whileHover={{ scale: 1.05, y: -5 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">{stat.label}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                </div>
                <div className={`p-3 rounded-xl ${stat.bgColor}`}>
                  <stat.icon className={`w-6 h-6 ${stat.color}`} />
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Action Cards */}
        <motion.div
          className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          {/* Quick Actions */}
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
            <h3 className="text-xl font-bold text-white mb-6 flex items-center">
              <Zap className="w-5 h-5 mr-2 text-yellow-400" />
              Quick Actions
            </h3>
            <div className="space-y-4">
              <motion.button
                onClick={() => navigate('/problems')}
                className="w-full bg-blue-500/20 hover:bg-blue-500/30 text-white p-4 rounded-xl transition-all duration-300 flex items-center justify-between group"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="flex items-center">
                  <Code2 className="w-5 h-5 mr-3" />
                  <span className="font-medium">Browse Problems</span>
                </div>
                <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
              </motion.button>

              <motion.button
                onClick={() => navigate('/contests')}
                className="w-full bg-purple-500/20 hover:bg-purple-500/30 text-white p-4 rounded-xl transition-all duration-300 flex items-center justify-between group"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="flex items-center">
                  <Trophy className="w-5 h-5 mr-3" />
                  <span className="font-medium">Join Contests</span>
                </div>
                <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
              </motion.button>

              <motion.button
                onClick={() => navigate('/leaderboard')}
                className="w-full bg-green-500/20 hover:bg-green-500/30 text-white p-4 rounded-xl transition-all duration-300 flex items-center justify-between group"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="flex items-center">
                  <Award className="w-5 h-5 mr-3" />
                  <span className="font-medium">View Leaderboard</span>
                </div>
                <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
              </motion.button>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
            <h3 className="text-xl font-bold text-white mb-6 flex items-center">
              <Calendar className="w-5 h-5 mr-2 text-blue-400" />
              Recent Activity
            </h3>
            <div className="space-y-4">
              {recentActivity.length > 0 ? (
                recentActivity.map((activity) => (
                  <div key={activity.id} className="flex items-center p-3 bg-white/5 rounded-lg">
                    <span className="text-2xl mr-3">{activity.icon}</span>
                    <div className="flex-1">
                      <p className="text-white font-medium">{activity.title}</p>
                      <p className="text-white/60 text-sm">{activity.time}</p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <div className="text-4xl mb-2">🎯</div>
                  <p className="text-white/60">No recent activity</p>
                  <p className="text-white/40 text-sm">Start solving problems to see your progress!</p>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  );
}