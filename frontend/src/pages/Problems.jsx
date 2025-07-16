import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { problemService } from '../services/problemService';
import { 
  Code2, 
  Filter, 
  Search, 
  Clock, 
  CheckCircle, 
  XCircle,
  TrendingUp,
  Award,
  Target
} from 'lucide-react';
import toast from 'react-hot-toast';

export default function Problems() {
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    loadProblems();
  }, [selectedDifficulty, selectedCategory]);

  const loadProblems = async () => {
    try {
      setLoading(true);
      const data = await problemService.getAllProblems(1, selectedDifficulty, selectedCategory);
      setProblems(data.problems || []);
    } catch (error) {
      toast.error('Failed to load problems');
      console.error('Error loading problems:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredProblems = problems.filter(problem =>
    problem.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    problem.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getDifficultyColor = (difficulty) => {
    const colors = {
      'Easy': 'text-green-600 bg-green-50 border-green-200',
      'Medium': 'text-orange-600 bg-orange-50 border-orange-200',
      'Hard': 'text-red-600 bg-red-50 border-red-200'
    };
    return colors[difficulty] || 'text-gray-600 bg-gray-50 border-gray-200';
  };

  const getStatusIcon = (status) => {
    if (status === 'Solved') {
      return <CheckCircle className="w-5 h-5 text-green-600" />;
    } else if (status === 'Attempted') {
      return <XCircle className="w-5 h-5 text-red-600" />;
    }
    return <Clock className="w-5 h-5 text-gray-400" />;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="loading-spinner w-8 h-8 mx-auto mb-4 text-white"></div>
          <p className="text-white">Loading problems...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
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
        <div className="bg-white/10 backdrop-blur-md border-b border-white/20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-6">
              <div>
                <motion.h1 
                  className="text-3xl font-bold text-white"
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  Problems 💻
                </motion.h1>
                <motion.p 
                  className="text-blue-100 mt-1"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  Solve coding challenges and improve your skills
                </motion.p>
              </div>
              <motion.button
                onClick={() => navigate('/dashboard')}
                className="btn-secondary"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
              >
                Back to Dashboard
              </motion.button>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <motion.div 
            className="card mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <div className="card-content">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Search problems..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="input pl-10"
                  />
                </div>
                <div className="relative">
                  <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <select
                    value={selectedDifficulty}
                    onChange={(e) => setSelectedDifficulty(e.target.value)}
                    className="input pl-10 appearance-none"
                  >
                    <option value="">All Difficulties</option>
                    <option value="Easy">Easy</option>
                    <option value="Medium">Medium</option>
                    <option value="Hard">Hard</option>
                  </select>
                </div>
                <div className="relative">
                  <Target className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="input pl-10 appearance-none"
                  >
                    <option value="">All Categories</option>
                    <option value="Array">Array</option>
                    <option value="String">String</option>
                    <option value="Dynamic Programming">Dynamic Programming</option>
                    <option value="Graph">Graph</option>
                    <option value="Tree">Tree</option>
                  </select>
                </div>

                <div className="flex items-center space-x-4 text-sm text-gray-600">
                  <span className="flex items-center">
                    <TrendingUp className="w-4 h-4 mr-1" />
                    {filteredProblems.length} problems
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredProblems.length > 0 ? (
              filteredProblems.map((problem, index) => (
                <motion.div
                  key={problem.id}
                  className="card hover:scale-105 cursor-pointer"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                  onClick={() => navigate(`/problems/${problem.id}`)}
                  whileHover={{ y: -5 }}
                >
                  <div className="card-content">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(problem.status)}
                        <h3 className="text-lg font-semibold text-gray-900 line-clamp-1">
                          {problem.title}
                        </h3>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getDifficultyColor(problem.difficulty)}`}>
                        {problem.difficulty}
                      </span>
                    </div>
                    
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                      {problem.description}
                    </p>
                    
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <div className="flex items-center space-x-4">
                        <span className="flex items-center">
                          <Award className="w-4 h-4 mr-1" />
                          {problem.points || 100} pts
                        </span>
                        <span className="flex items-center">
                          <Clock className="w-4 h-4 mr-1" />
                          {problem.timeLimit || '2s'}
                        </span>
                      </div>
                      <span className="bg-blue-50 text-blue-600 px-2 py-1 rounded text-xs">
                        {problem.category || 'General'}
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))
            ) : (
              <motion.div 
                className="col-span-full text-center py-12"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                <Code2 className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">No problems found</h3>
                <p className="text-blue-100">
                  {searchTerm || selectedDifficulty || selectedCategory
                    ? 'Try adjusting your filters'
                    : 'Problems will appear here once they are added'
                  }
                </p>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}