import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import {
  Users, 
  BookOpen, 
  Trophy, 
  Settings, 
  Home, 
  LogOut, 
  Plus, 
  Edit3, 
  Trash2, 
  Crown, 
  UserCheck, 
  Calendar, 
  BarChart3,
  Search,
  Filter,
  Eye,
  AlertCircle,
  CheckCircle,
  Clock,
  Target,
  Award,
  Code,
  Download,
  Upload,
  ArrowLeft,
  Sparkles
} from 'lucide-react';
import toast from 'react-hot-toast';

const AdminDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [users, setUsers] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [contests, setContests] = useState([]);
  const [loading, setLoading] = useState(false);

  // Mock data - replace with actual API calls
  const mockUsers = [
    { id: 1, name: 'John Doe', email: 'john@soma.edu', role: 'student', status: 'active', joinedAt: '2024-01-15', problemsSolved: 25 },
    { id: 2, name: 'Jane Smith', email: 'jane@soma.edu', role: 'mentor', status: 'active', joinedAt: '2024-01-10', problemsSolved: 45 },
    { id: 3, name: 'Bob Wilson', email: 'bob@soma.edu', role: 'student', status: 'inactive', joinedAt: '2024-02-01', problemsSolved: 12 },
  ];

  const mockQuestions = [
    { id: 1, title: 'Two Sum', difficulty: 'Easy', category: 'Arrays', status: 'published', submissions: 150, accuracy: 85 },
    { id: 2, title: 'Binary Tree Traversal', difficulty: 'Medium', category: 'Trees', status: 'draft', submissions: 89, accuracy: 72 },
    { id: 3, title: 'Dynamic Programming - Knapsack', difficulty: 'Hard', category: 'DP', status: 'published', submissions: 45, accuracy: 58 },
  ];

  const mockContests = [
    { id: 1, title: 'Weekly Programming Challenge', status: 'ongoing', participants: 45, startDate: '2024-06-10', endDate: '2024-06-17' },
    { id: 2, title: 'Algorithm Speed Run', status: 'upcoming', participants: 23, startDate: '2024-06-20', endDate: '2024-06-20' },
    { id: 3, title: 'Data Structures Mastery', status: 'completed', participants: 67, startDate: '2024-06-01', endDate: '2024-06-07' },
  ];

  useEffect(() => {
    setUsers(mockUsers);
    setQuestions(mockQuestions);
    setContests(mockContests);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/auth');
    toast.success('Logged out successfully');
  };

  const handleBackToHome = () => {
    navigate('/dashboard');
    toast.success('Returning to main dashboard');
  };

  const handleMakeAdmin = (userId) => {
    setUsers(users.map(user => 
      user.id === userId ? { ...user, role: 'admin' } : user
    ));
    toast.success('User promoted to admin');
  };

  const handleMakeMentor = (userId) => {
    setUsers(users.map(user => 
      user.id === userId ? { ...user, role: 'mentor' } : user
    ));
    toast.success('User promoted to mentor');
  };

  const handleDeleteUser = (userId) => {
    setUsers(users.filter(user => user.id !== userId));
    toast.success('User deleted successfully');
  };

  const handleDeleteQuestion = (questionId) => {
    setQuestions(questions.filter(q => q.id !== questionId));
    toast.success('Question deleted successfully');
  };

  const handleDeleteContest = (contestId) => {
    setContests(contests.filter(c => c.id !== contestId));
    toast.success('Contest deleted successfully');
  };

  const sidebarItems = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'users', label: 'User Management', icon: Users },
    { id: 'questions', label: 'Questions', icon: BookOpen },
    { id: 'contests', label: 'Contests', icon: Trophy },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const stats = [
    { label: 'Total Users', value: users.length, icon: Users, color: 'from-blue-500 to-blue-600' },
    { label: 'Total Questions', value: questions.length, icon: BookOpen, color: 'from-green-500 to-green-600' },
    { label: 'Active Contests', value: contests.filter(c => c.status === 'ongoing').length, icon: Trophy, color: 'from-purple-500 to-purple-600' },
    { label: 'Total Submissions', value: '1,234', icon: Code, color: 'from-orange-500 to-orange-600' },
  ];

  const renderOverview = () => (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <h2 className="text-3xl font-bold text-white mb-2">Admin Control Panel</h2>
        <p className="text-white/70">Manage your SOMA Campus platform</p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 shadow-2xl"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/70 text-sm">{stat.label}</p>
                <p className="text-2xl font-bold text-white">{stat.value}</p>
              </div>
              <div className={`bg-gradient-to-r ${stat.color} p-3 rounded-lg`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 shadow-2xl"
        >
          <h3 className="text-lg font-semibold mb-4 text-white">Recent Activity</h3>
          <div className="space-y-3">
            <div className="flex items-center space-x-3 p-3 bg-green-500/20 rounded-lg">
              <CheckCircle className="w-5 h-5 text-green-400" />
              <div>
                <p className="text-sm font-medium text-white">New user registered</p>
                <p className="text-xs text-white/60">john.doe@soma.edu joined</p>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-3 bg-blue-500/20 rounded-lg">
              <BookOpen className="w-5 h-5 text-blue-400" />
              <div>
                <p className="text-sm font-medium text-white">Question submitted</p>
                <p className="text-xs text-white/60">"Array Rotation" needs review</p>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-3 bg-purple-500/20 rounded-lg">
              <Trophy className="w-5 h-5 text-purple-400" />
              <div>
                <p className="text-sm font-medium text-white">Contest completed</p>
                <p className="text-xs text-white/60">67 participants</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 shadow-2xl"
        >
          <h3 className="text-lg font-semibold mb-4 text-white">Quick Actions</h3>
          <div className="grid grid-cols-2 gap-3">
            <motion.button 
              onClick={() => setActiveTab('questions')}
              className="p-4 bg-gradient-to-r from-blue-500/20 to-blue-600/20 text-white rounded-lg hover:from-blue-500/30 hover:to-blue-600/30 transition-all duration-200 border border-blue-500/30"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Plus className="w-5 h-5 mx-auto mb-2" />
              <span className="text-sm font-medium">Add Question</span>
            </motion.button>
            <motion.button 
              onClick={() => setActiveTab('contests')}
              className="p-4 bg-gradient-to-r from-purple-500/20 to-purple-600/20 text-white rounded-lg hover:from-purple-500/30 hover:to-purple-600/30 transition-all duration-200 border border-purple-500/30"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Calendar className="w-5 h-5 mx-auto mb-2" />
              <span className="text-sm font-medium">Create Contest</span>
            </motion.button>
            <motion.button 
              onClick={() => setActiveTab('users')}
              className="p-4 bg-gradient-to-r from-green-500/20 to-green-600/20 text-white rounded-lg hover:from-green-500/30 hover:to-green-600/30 transition-all duration-200 border border-green-500/30"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <UserCheck className="w-5 h-5 mx-auto mb-2" />
              <span className="text-sm font-medium">Manage Users</span>
            </motion.button>
            <motion.button 
              className="p-4 bg-gradient-to-r from-orange-500/20 to-orange-600/20 text-white rounded-lg hover:from-orange-500/30 hover:to-orange-600/30 transition-all duration-200 border border-orange-500/30"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Download className="w-5 h-5 mx-auto mb-2" />
              <span className="text-sm font-medium">Export Data</span>
            </motion.button>
          </div>
        </motion.div>
      </div>
    </div>
  );

  const renderUsers = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-white">User Management</h2>
          <p className="text-white/70">Manage users and their roles</p>
        </div>
        <motion.button 
          className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-3 rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-300 flex items-center space-x-2 shadow-lg"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Plus className="w-4 h-4" />
          <span>Add User</span>
        </motion.button>
      </div>

      <div className="bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 shadow-2xl overflow-hidden">
        <div className="p-6 border-b border-white/20">
          <div className="flex space-x-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60" />
                <input
                  type="text"
                  placeholder="Search users..."
                  className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/30 rounded-xl text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all duration-300"
                />
              </div>
            </div>
            <button className="px-6 py-3 border border-white/30 rounded-xl hover:bg-white/10 flex items-center space-x-2 text-white transition-all duration-300">
              <Filter className="w-4 h-4" />
              <span>Filter</span>
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-white/5">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-medium text-white/70 uppercase tracking-wider">User</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-white/70 uppercase tracking-wider">Role</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-white/70 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-white/70 uppercase tracking-wider">Problems Solved</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-white/70 uppercase tracking-wider">Joined</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-white/70 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {users.map((user) => (
                <motion.tr 
                  key={user.id} 
                  className="hover:bg-white/5 transition-colors duration-200"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-white">{user.name}</div>
                      <div className="text-sm text-white/60">{user.email}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${
                      user.role === 'admin' ? 'bg-red-500/20 text-red-300 border border-red-500/30' :
                      user.role === 'mentor' ? 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/30' :
                      'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                    }`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${
                      user.status === 'active' ? 'bg-green-500/20 text-green-300 border border-green-500/30' : 'bg-gray-500/20 text-gray-300 border border-gray-500/30'
                    }`}>
                      {user.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                    {user.problemsSolved}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-white/70">
                    {user.joinedAt}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                    <button 
                      onClick={() => handleMakeMentor(user.id)}
                      className="text-yellow-400 hover:text-yellow-300 p-2 hover:bg-yellow-500/20 rounded-lg transition-all duration-200"
                      title="Make Mentor"
                    >
                      <UserCheck className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => handleMakeAdmin(user.id)}
                      className="text-red-400 hover:text-red-300 p-2 hover:bg-red-500/20 rounded-lg transition-all duration-200"
                      title="Make Admin"
                    >
                      <Crown className="w-4 h-4" />
                    </button>
                    <button className="text-blue-400 hover:text-blue-300 p-2 hover:bg-blue-500/20 rounded-lg transition-all duration-200" title="Edit">
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => handleDeleteUser(user.id)}
                      className="text-red-400 hover:text-red-300 p-2 hover:bg-red-500/20 rounded-lg transition-all duration-200"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </motion.div>
  );

  const renderQuestions = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-white">Question Management</h2>
          <p className="text-white/70">Create and manage coding challenges</p>
        </div>
        <motion.button 
          className="bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-3 rounded-xl hover:from-green-600 hover:to-green-700 transition-all duration-300 flex items-center space-x-2 shadow-lg"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Plus className="w-4 h-4" />
          <span>Add Question</span>
        </motion.button>
      </div>

      <div className="bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 shadow-2xl overflow-hidden">
        <div className="p-6 border-b border-white/20">
          <div className="flex space-x-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60" />
                <input
                  type="text"
                  placeholder="Search questions..."
                  className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/30 rounded-xl text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all duration-300"
                />
              </div>
            </div>
            <select className="px-6 py-3 bg-white/10 border border-white/30 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-400">
              <option className="bg-gray-800">All Difficulties</option>
              <option className="bg-gray-800">Easy</option>
              <option className="bg-gray-800">Medium</option>
              <option className="bg-gray-800">Hard</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-white/5">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-medium text-white/70 uppercase tracking-wider">Question</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-white/70 uppercase tracking-wider">Difficulty</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-white/70 uppercase tracking-wider">Category</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-white/70 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-white/70 uppercase tracking-wider">Submissions</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-white/70 uppercase tracking-wider">Accuracy</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-white/70 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {questions.map((question) => (
                <motion.tr 
                  key={question.id} 
                  className="hover:bg-white/5 transition-colors duration-200"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-white">{question.title}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${
                      question.difficulty === 'Easy' ? 'bg-green-500/20 text-green-300 border border-green-500/30' :
                      question.difficulty === 'Medium' ? 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/30' :
                      'bg-red-500/20 text-red-300 border border-red-500/30'
                    }`}>
                      {question.difficulty}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                    {question.category}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${
                      question.status === 'published' ? 'bg-green-500/20 text-green-300 border border-green-500/30' : 'bg-gray-500/20 text-gray-300 border border-gray-500/30'
                    }`}>
                      {question.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                    {question.submissions}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                    {question.accuracy}%
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                    <button className="text-blue-400 hover:text-blue-300 p-2 hover:bg-blue-500/20 rounded-lg transition-all duration-200" title="View">
                      <Eye className="w-4 h-4" />
                    </button>
                    <button className="text-green-400 hover:text-green-300 p-2 hover:bg-green-500/20 rounded-lg transition-all duration-200" title="Edit">
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => handleDeleteQuestion(question.id)}
                      className="text-red-400 hover:text-red-300 p-2 hover:bg-red-500/20 rounded-lg transition-all duration-200"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </motion.div>
  );

  const renderContests = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-white">Contest Management</h2>
          <p className="text-white/70">Create and manage programming contests</p>
        </div>
        <motion.button 
          className="bg-gradient-to-r from-purple-500 to-purple-600 text-white px-6 py-3 rounded-xl hover:from-purple-600 hover:to-purple-700 transition-all duration-300 flex items-center space-x-2 shadow-lg"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Plus className="w-4 h-4" />
          <span>Create Contest</span>
        </motion.button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {contests.map((contest, index) => (
          <motion.div
            key={contest.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 shadow-2xl"
          >
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-lg font-semibold text-white">{contest.title}</h3>
              <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
                contest.status === 'ongoing' ? 'bg-green-500/20 text-green-300 border border-green-500/30' :
                contest.status === 'upcoming' ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30' :
                'bg-gray-500/20 text-gray-300 border border-gray-500/30'
              }`}>
                {contest.status}
              </span>
            </div>
            
            <div className="space-y-3 mb-6">
              <div className="flex items-center space-x-2 text-sm text-white/70">
                <Users className="w-4 h-4" />
                <span>{contest.participants} participants</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-white/70">
                <Calendar className="w-4 h-4" />
                <span>{contest.startDate} - {contest.endDate}</span>
              </div>
            </div>

            <div className="flex space-x-2">
              <motion.button 
                className="flex-1 bg-blue-500/20 text-blue-300 py-2 px-3 rounded-lg hover:bg-blue-500/30 transition-colors text-sm font-medium border border-blue-500/30"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                View Details
              </motion.button>
              <button className="p-2 text-white/60 hover:text-green-400 hover:bg-green-500/20 rounded-lg transition-all duration-200">
                <Edit3 className="w-4 h-4" />
              </button>
              <button 
                onClick={() => handleDeleteContest(contest.id)}
                className="p-2 text-white/60 hover:text-red-400 hover:bg-red-500/20 rounded-lg transition-all duration-200"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );

  const renderSettings = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div>
        <h2 className="text-2xl font-bold text-white">System Settings</h2>
        <p className="text-white/70">Configure your platform settings</p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 shadow-2xl">
          <h3 className="text-lg font-semibold mb-4 text-white">Platform Settings</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-white/70 mb-2">Platform Name</label>
              <input
                type="text"
                defaultValue="SOMA Campus"
                className="w-full px-4 py-3 bg-white/10 border border-white/30 rounded-xl text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all duration-300"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-white/70 mb-2">Registration</label>
              <select className="w-full px-4 py-3 bg-white/10 border border-white/30 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-400">
                <option className="bg-gray-800">Open Registration</option>
                <option className="bg-gray-800">Invite Only</option>
                <option className="bg-gray-800">Closed</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-white/70 mb-2">Default User Role</label>
              <select className="w-full px-4 py-3 bg-white/10 border border-white/30 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-400">
                <option className="bg-gray-800">Student</option>
                <option className="bg-gray-800">Mentor</option>
              </select>
            </div>
          </div>
        </div>

        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 shadow-2xl">
          <h3 className="text-lg font-semibold mb-4 text-white">Contest Settings</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-white/70 mb-2">Default Contest Duration (hours)</label>
              <input
                type="number"
                defaultValue="24"
                className="w-full px-4 py-3 bg-white/10 border border-white/30 rounded-xl text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all duration-300"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-white/70 mb-2">Max Participants per Contest</label>
              <input
                type="number"
                defaultValue="100"
                className="w-full px-4 py-3 bg-white/10 border border-white/30 rounded-xl text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all duration-300"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-white/70 mb-2">Auto-approve Contest Registration</label>
              <select className="w-full px-4 py-3 bg-white/10 border border-white/30 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-400">
                <option className="bg-gray-800">Yes</option>
                <option className="bg-gray-800">No</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <motion.button 
          className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-8 py-3 rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-300 shadow-lg"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          Save Settings
        </motion.button>
      </div>
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Background Effects - Same as Auth Page */}
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

      <div className="relative z-10">
        {/* Top Navigation Bar - Glassmorphism Style */}
        <motion.nav 
          className="bg-white/10 backdrop-blur-md border-b border-white/20"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex justify-between items-center h-16">
              {/* Left Side - Logo and Title */}
              <motion.div 
                className="flex items-center"
                whileHover={{ scale: 1.02 }}
              >
                <div className="w-10 h-10 bg-gradient-to-r from-blue-400 to-purple-500 rounded-2xl flex items-center justify-center mr-3">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-white">CampusCode</h1>
                  <p className="text-xs text-white/60">Admin Panel</p>
                </div>
              </motion.div>
              
              {/* Right Side - Navigation Actions */}
              <div className="flex items-center space-x-4">
                <motion.button
                  onClick={handleBackToHome}
                  className="flex items-center space-x-2 px-4 py-2 bg-white/10 rounded-xl text-white hover:bg-white/20 transition-all duration-300 border border-white/20"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back to Dashboard</span>
                </motion.button>
                
                <div className="flex items-center space-x-3">
                  <div className="text-right">
                    <p className="text-sm font-medium text-white">{user?.name}</p>
                    <p className="text-xs text-white/60">Administrator</p>
                  </div>
                  <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-medium">
                      {user?.name?.charAt(0)}
                    </span>
                  </div>
                </div>
                
                <motion.button
                  onClick={handleLogout}
                  className="flex items-center space-x-2 px-4 py-2 bg-red-500/20 rounded-xl text-red-300 hover:bg-red-500/30 transition-all duration-300 border border-red-500/30"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <LogOut className="w-4 h-4" />
                  <span>Logout</span>
                </motion.button>
              </div>
            </div>
          </div>
        </motion.nav>

        <div className="flex">
          {/* Sidebar - Glassmorphism Style */}
          <motion.div 
            className="w-64 bg-white/5 backdrop-blur-md border-r border-white/20 min-h-screen"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <nav className="mt-8">
              <div className="px-4 space-y-2">
                {sidebarItems.map((item, index) => (
                  <motion.button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full flex items-center px-4 py-3 text-left rounded-xl transition-all duration-300 ${
                      activeTab === item.id
                        ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30 shadow-lg'
                        : 'text-white/70 hover:bg-white/10 hover:text-white'
                    }`}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <item.icon className="w-5 h-5 mr-3" />
                    {item.label}
                  </motion.button>
                ))}
              </div>
            </nav>
          </motion.div>

          {/* Main Content Area */}
          <div className="flex-1 p-8">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                {activeTab === 'overview' && renderOverview()}
                {activeTab === 'users' && renderUsers()}
                {activeTab === 'questions' && renderQuestions()}
                {activeTab === 'contests' && renderContests()}
                {activeTab === 'settings' && renderSettings()}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;