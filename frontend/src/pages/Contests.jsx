import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { 
  Trophy, Clock, Users, Calendar, ChevronRight, 
  Award, Target, Zap, ArrowLeft 
} from 'lucide-react';
import toast from 'react-hot-toast';

export default function Contests() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [contests, setContests] = useState([]);
  const [activeTab, setActiveTab] = useState('upcoming');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadContests();
  }, []);

  const loadContests = async () => {
    try {
      setLoading(true);
      
      // Mock contests data (replace with real API call later)
      const mockContests = [
        {
          id: 1,
          name: 'Weekly Challenge #46',
          description: 'Test your skills with array and string problems',
          startTime: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
          duration: 120, // minutes
          participants: 245,
          problems: 4,
          difficulty: 'Medium',
          status: 'upcoming',
          prize: '1000 Points'
        },
        {
          id: 2,
          name: 'Algorithm Sprint',
          description: 'Fast-paced algorithmic problem solving',
          startTime: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
          duration: 90,
          participants: 189,
          problems: 3,
          difficulty: 'Hard',
          status: 'upcoming',
          prize: '1500 Points'
        },
        {
          id: 3,
          name: 'Beginner Bootcamp',
          description: 'Perfect for students just starting out',
          startTime: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
          duration: 150,
          participants: 324,
          problems: 5,
          difficulty: 'Easy',
          status: 'completed',
          prize: '500 Points'
        }
      ];

      setContests(mockContests);
    } catch (error) {
      console.error('Error loading contests:', error);
      toast.error('Failed to load contests');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty.toLowerCase()) {
      case 'easy': return 'text-green-400 bg-green-400/10';
      case 'medium': return 'text-yellow-400 bg-yellow-400/10';
      case 'hard': return 'text-red-400 bg-red-400/10';
      default: return 'text-gray-400 bg-gray-400/10';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'upcoming': return 'text-blue-400 bg-blue-400/10';
      case 'live': return 'text-green-400 bg-green-400/10';
      case 'completed': return 'text-gray-400 bg-gray-400/10';
      default: return 'text-gray-400 bg-gray-400/10';
    }
  };

  const filteredContests = contests.filter(contest => {
    if (activeTab === 'upcoming') return contest.status === 'upcoming';
    if (activeTab === 'live') return contest.status === 'live';
    if (activeTab === 'completed') return contest.status === 'completed';
    return true;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <motion.div 
          className="text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <div className="w-8 h-8 mx-auto mb-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          <p className="text-white">Loading contests...</p>
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
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/dashboard')}
                className="text-white/80 hover:text-white transition-colors duration-300"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div className="flex items-center space-x-3">
                <Trophy className="w-8 h-8 text-yellow-400" />
                <div>
                  <h1 className="text-xl font-bold text-white">Contests</h1>
                  <p className="text-white/60 text-sm">Compete and improve your skills</p>
                </div>
              </div>
            </div>

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
      </motion.header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tabs */}
        <motion.div
          className="flex space-x-1 bg-white/10 backdrop-blur-md rounded-xl p-1 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {[
            { id: 'upcoming', label: 'Upcoming', icon: Calendar },
            { id: 'live', label: 'Live', icon: Zap },
            { id: 'completed', label: 'Completed', icon: Award }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-medium transition-all duration-300 ${
                activeTab === tab.id
                  ? 'bg-white text-purple-700 shadow-lg'
                  : 'text-white hover:bg-white/20'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          ))}
        </motion.div>

        {/* Contests Grid */}
        <motion.div
          className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {filteredContests.length > 0 ? (
            filteredContests.map((contest, index) => (
              <motion.div
                key={contest.id}
                className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 hover:border-white/40 transition-all duration-300 group cursor-pointer"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                whileHover={{ scale: 1.02, y: -5 }}
                onClick={() => toast.info('Contest details coming soon!')}
              >
                <div className="flex items-start justify-between mb-4">
                  <h3 className="text-white font-bold text-lg group-hover:text-blue-300 transition-colors duration-300">
                    {contest.name}
                  </h3>
                  <div className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(contest.status)}`}>
                    {contest.status}
                  </div>
                </div>

                <p className="text-white/70 text-sm mb-4 line-clamp-2">
                  {contest.description}
                </p>

                <div className="space-y-3 mb-4">
                  <div className="flex items-center text-white/60 text-sm">
                    <Calendar className="w-4 h-4 mr-2" />
                    {formatDate(contest.startTime)}
                  </div>
                  
                  <div className="flex items-center text-white/60 text-sm">
                    <Clock className="w-4 h-4 mr-2" />
                    {contest.duration} minutes
                  </div>
                  
                  <div className="flex items-center text-white/60 text-sm">
                    <Users className="w-4 h-4 mr-2" />
                    {contest.participants} participants
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`px-2 py-1 rounded text-xs font-medium ${getDifficultyColor(contest.difficulty)}`}>
                      {contest.difficulty}
                    </div>
                    <div className="text-white/60 text-sm">
                      {contest.problems} problems
                    </div>
                  </div>
                  
                  <div className="flex items-center text-yellow-400 text-sm font-medium">
                    <Trophy className="w-4 h-4 mr-1" />
                    {contest.prize}
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-white/10">
                  <button className="w-full flex items-center justify-center space-x-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white py-2 rounded-lg font-medium hover:from-blue-600 hover:to-purple-700 transition-all duration-300 group-hover:shadow-lg">
                    <span>
                      {contest.status === 'upcoming' ? 'Register' : 
                       contest.status === 'live' ? 'Join Now' : 'View Results'}
                    </span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <Trophy className="w-16 h-16 text-white/30 mx-auto mb-4" />
              <h3 className="text-white text-xl font-semibold mb-2">
                No {activeTab} contests
              </h3>
              <p className="text-white/60">
                {activeTab === 'upcoming' ? 'New contests will be announced soon!' :
                 activeTab === 'live' ? 'No contests are currently running.' :
                 'Check back later for completed contest results.'}
              </p>
            </div>
          )}
        </motion.div>
      </main>
    </div>
  );
}