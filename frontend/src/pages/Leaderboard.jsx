import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { 
  Trophy, Medal, Crown, Star, TrendingUp, 
  ArrowLeft, Users, Target, Award 
} from 'lucide-react';

export default function Leaderboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [leaderboard, setLeaderboard] = useState([]);
  const [timeframe, setTimeframe] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadLeaderboard();
  }, [timeframe]);

  const loadLeaderboard = async () => {
    try {
      setLoading(true);
      
      // Mock leaderboard data
      const mockLeaderboard = [
        {
          rank: 1,
          name: 'Alex Chen',
          points: 2850,
          problemsSolved: 95,
          accuracy: 92,
          streak: 15,
          avatar: 'AC'
        },
        {
          rank: 2,
          name: 'sofikul sk',
          points: 2640,
          problemsSolved: 88,
          accuracy: 89,
          streak: 12,
          avatar: 'S',
          isCurrentUser: user?.name === 'sofikul sk'
        },
        {
          rank: 3,
          name: 'Maria Garcia',
          points: 2420,
          problemsSolved: 81,
          accuracy: 94,
          streak: 8,
          avatar: 'MG'
        },
        {
          rank: 4,
          name: 'David Kim',
          points: 2180,
          problemsSolved: 73,
          accuracy: 87,
          streak: 10,
          avatar: 'DK'
        },
        {
          rank: 5,
          name: 'Sarah Wilson',
          points: 1950,
          problemsSolved: 67,
          accuracy: 91,
          streak: 6,
          avatar: 'SW'
        }
      ];

      setLeaderboard(mockLeaderboard);
    } catch (error) {
      console.error('Error loading leaderboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const getRankIcon = (rank) => {
    switch (rank) {
      case 1: return <Crown className="w-6 h-6 text-yellow-400" />;
      case 2: return <Medal className="w-6 h-6 text-gray-300" />;
      case 3: return <Medal className="w-6 h-6 text-amber-600" />;
      default: return <span className="text-white/60 font-bold">#{rank}</span>;
    }
  };

  const getRankColor = (rank) => {
    switch (rank) {
      case 1: return 'bg-gradient-to-r from-yellow-400/20 to-orange-400/20 border-yellow-400/30';
      case 2: return 'bg-gradient-to-r from-gray-300/20 to-gray-400/20 border-gray-300/30';
      case 3: return 'bg-gradient-to-r from-amber-600/20 to-amber-700/20 border-amber-600/30';
      default: return 'bg-white/5 border-white/10';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <motion.div 
          className="text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <div className="w-8 h-8 mx-auto mb-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          <p className="text-white">Loading leaderboard...</p>
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
                  <h1 className="text-xl font-bold text-white">Leaderboard</h1>
                  <p className="text-white/60 text-sm">Top performers in CampusCode</p>
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
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Timeframe Selector */}
        <motion.div
          className="flex justify-center mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex space-x-1 bg-white/10 backdrop-blur-md rounded-xl p-1">
            {[
              { id: 'all', label: 'All Time' },
              { id: 'month', label: 'This Month' },
              { id: 'week', label: 'This Week' }
            ].map((option) => (
              <button
                key={option.id}
                onClick={() => setTimeframe(option.id)}
                className={`px-6 py-2 rounded-lg font-medium transition-all duration-300 ${
                  timeframe === option.id
                    ? 'bg-white text-purple-700 shadow-lg'
                    : 'text-white hover:bg-white/20'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Top 3 Podium */}
        <motion.div
          className="grid grid-cols-3 gap-4 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {leaderboard.slice(0, 3).map((user, index) => {
            const positions = [1, 0, 2]; // Second, First, Third
            const actualIndex = positions[index];
            const actualUser = leaderboard[actualIndex];
            
            return (
              <motion.div
                key={actualUser.rank}
                className={`text-center ${actualIndex === 0 ? 'order-2' : actualIndex === 1 ? 'order-1' : 'order-3'}`}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 + actualIndex * 0.1 }}
              >
                <div className={`${getRankColor(actualUser.rank)} backdrop-blur-md rounded-2xl p-6 border relative ${actualUser.rank === 1 ? 'scale-110' : ''}`}>
                  {actualUser.rank === 1 && (
                    <motion.div
                      className="absolute -top-3 left-1/2 transform -translate-x-1/2"
                      animate={{ rotate: [0, 10, -10, 0] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      <Crown className="w-8 h-8 text-yellow-400" />
                    </motion.div>
                  )}
                  
                  <div className={`w-16 h-16 mx-auto mb-4 ${actualUser.rank === 1 ? 'bg-gradient-to-r from-yellow-400 to-orange-500' : actualUser.rank === 2 ? 'bg-gradient-to-r from-gray-300 to-gray-400' : 'bg-gradient-to-r from-amber-600 to-amber-700'} rounded-full flex items-center justify-center text-white font-bold text-lg`}>
                    {actualUser.avatar}
                  </div>
                  
                  <h3 className="text-white font-bold text-lg mb-2">{actualUser.name}</h3>
                  <div className="text-2xl font-bold text-white mb-1">{actualUser.points}</div>
                  <div className="text-white/60 text-sm">points</div>
                  
                  <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
                    <div className="bg-white/10 rounded-lg p-2">
                      <div className="text-white font-medium">{actualUser.problemsSolved}</div>
                      <div className="text-white/60">Solved</div>
                    </div>
                    <div className="bg-white/10 rounded-lg p-2">
                      <div className="text-white font-medium">{actualUser.accuracy}%</div>
                      <div className="text-white/60">Accuracy</div>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Rest of Leaderboard */}
        <motion.div
          className="space-y-3"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          {leaderboard.slice(3).map((user, index) => (
            <motion.div
              key={user.rank}
              className={`${getRankColor(user.rank)} ${user.isCurrentUser ? 'ring-2 ring-blue-400' : ''} backdrop-blur-md rounded-xl p-4 border transition-all duration-300 hover:border-white/30`}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.5 + index * 0.05 }}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center justify-center w-8 h-8">
                    {getRankIcon(user.rank)}
                  </div>
                  
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                    {user.avatar}
                  </div>
                  
                  <div>
                    <h3 className={`font-semibold ${user.isCurrentUser ? 'text-blue-300' : 'text-white'}`}>
                      {user.name}
                      {user.isCurrentUser && <span className="ml-2 text-xs bg-blue-500 px-2 py-1 rounded-full">You</span>}
                    </h3>
                    <div className="text-white/60 text-sm">
                      {user.problemsSolved} problems solved
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-6">
                  <div className="text-center">
                    <div className="text-white font-bold">{user.points}</div>
                    <div className="text-white/60 text-xs">Points</div>
                  </div>
                  
                  <div className="text-center">
                    <div className="text-white font-bold">{user.accuracy}%</div>
                    <div className="text-white/60 text-xs">Accuracy</div>
                  </div>
                  
                  <div className="text-center">
                    <div className="text-white font-bold">{user.streak}</div>
                    <div className="text-white/60 text-xs">Streak</div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </main>
    </div>
  );
}