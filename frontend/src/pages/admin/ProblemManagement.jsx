import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import {
  Plus,
  Search,
  Filter,
  Eye,
  Edit3,
  Trash2,
  Save,
  X,
  Upload,
  Download,
  FileText,
  Code,
  Clock,
  Database,
  ArrowLeft,
  CheckCircle,
  AlertCircle,
  Sparkles
} from 'lucide-react';
import toast from 'react-hot-toast';

const ProblemManagement = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [problems, setProblems] = useState([]);
  const [selectedProblem, setSelectedProblem] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDifficulty, setFilterDifficulty] = useState('');
  const [filterStatus, setFilterStatus] = useState('');

  // Form state for problem creation/editing
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    difficulty: 'easy',
    category: 'array',
    tags: '',
    timeLimit: 1000,
    memoryLimit: 128,
    status: 'draft',
    examples: [
      {
        input: '',
        output: '',
        explanation: ''
      }
    ],
    testCases: [
      {
        input: '',
        output: '',
        isHidden: false
      }
    ]
  });

  // Mock data for initial display
  const mockProblems = [
    {
      id: 1,
      title: "Two Sum",
      description: "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.",
      difficulty: "easy",
      category: "array",
      status: "published",
      tags: ["array", "hash-table"],
      createdAt: "2024-02-15T10:00:00Z",
      author: "Admin User",
      acceptanceRate: 72,
      submissions: 1523,
      timeLimit: 1000,
      memoryLimit: 128,
      examples: [
        {
          input: "[2,7,11,15], target = 9",
          output: "[0,1]",
          explanation: "Because nums[0] + nums[1] = 2 + 7 = 9"
        }
      ]
    },
    {
      id: 2,
      title: "Reverse Linked List",
      description: "Reverse a singly linked list.",
      difficulty: "medium",
      category: "linked-lists",
      status: "published",
      tags: ["linked-list", "recursion"],
      createdAt: "2024-02-20T14:00:00Z",
      author: "Bob Smith",
      acceptanceRate: 65,
      submissions: 2789,
      timeLimit: 1000,
      memoryLimit: 64,
      examples: [
        {
          input: "1->2->3->4->5",
          output: "5->4->3->2->1",
          explanation: "Reversed linked list"
        }
      ]
    },
    {
      id: 3,
      title: "Maximum Path Sum",
      description: "Find the maximum sum in a binary tree.",
      difficulty: "hard",
      category: "trees",
      status: "draft",
      tags: ["tree", "recursion"],
      createdAt: "2024-03-10T16:30:00Z",
      author: "Alice Johnson",
      acceptanceRate: 0,
      submissions: 0,
      timeLimit: 2000,
      memoryLimit: 256,
      examples: [
        {
          input: "[1,2,3]",
          output: "6",
          explanation: "Maximum path: 2 -> 1 -> 3"
        }
      ]
    }
  ];

  useEffect(() => {
    loadProblems();
  }, []);

  const loadProblems = async () => {
    try {
      setIsLoading(true);
      
      // Try to fetch from API first
      const response = await fetch('http://localhost:5000/api/problems', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success && data.data) {
          setProblems(data.data.problems || []);
          toast.success('Problems loaded from database');
          return;
        }
      }
      
      // Fallback to mock data if API fails
      console.log('API not available, using mock data');
      setProblems(mockProblems);
      toast('Using demo data - API not connected'); // Changed from toast.info to toast
      
    } catch (error) {
      console.error('Error loading problems:', error);
      setProblems(mockProblems);
      toast.error('API error - using demo data');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateProblem = () => {
    setSelectedProblem(null);
    setFormData({
      title: '',
      description: '',
      difficulty: 'easy',
      category: 'array',
      tags: '',
      timeLimit: 1000,
      memoryLimit: 128,
      status: 'draft',
      examples: [
        {
          input: '',
          output: '',
          explanation: ''
        }
      ],
      testCases: [
        {
          input: '',
          output: '',
          isHidden: false
        }
      ]
    });
    setIsModalOpen(true);
  };

  const handleEditProblem = (problem) => {
    setSelectedProblem(problem);
    setFormData({
      title: problem.title,
      description: problem.description,
      difficulty: problem.difficulty,
      category: problem.category,
      tags: problem.tags?.join(', ') || '',
      timeLimit: problem.timeLimit,
      memoryLimit: problem.memoryLimit,
      status: problem.status,
      examples: problem.examples || [{ input: '', output: '', explanation: '' }],
      testCases: problem.testCases || [{ input: '', output: '', isHidden: false }]
    });
    setIsModalOpen(true);
  };

  const handleSaveProblem = async (isDraft = false) => {
    try {
      setIsLoading(true);
      
      // Validate form data
      if (!formData.title.trim()) {
        toast.error('Title is required');
        return;
      }
      if (!formData.description.trim()) {
        toast.error('Description is required');
        return;
      }

      // Prepare the problem data
      const problemData = {
        title: formData.title,
        description: formData.description,
        difficulty: formData.difficulty,
        category: formData.category,
        tags: formData.tags.split(',').map(tag => tag.trim()).filter(Boolean),
        timeLimit: formData.timeLimit,
        memoryLimit: formData.memoryLimit,
        status: isDraft ? 'draft' : 'published',
        examples: formData.examples,
        testCases: formData.testCases || []
      };

      console.log('💾 Saving problem to API:', problemData);

      const url = selectedProblem 
        ? `http://localhost:5000/api/problems/${selectedProblem.id}`
        : 'http://localhost:5000/api/problems';
      
      const method = selectedProblem ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method: method,
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(problemData)
      });

      const data = await response.json();

      if (data.success) {
        toast.success(selectedProblem ? 'Problem updated successfully!' : 'Problem created successfully!');
        setIsModalOpen(false);
        
        // Reload problems from API to get the latest data
        await loadProblems();
      } else {
        throw new Error(data.message || 'Failed to save problem');
      }

    } catch (error) {
      console.error('❌ Error saving problem:', error);
      
      // Fallback to local state update if API fails
      const problemDataWithMeta = {
        ...formData,
        status: isDraft ? 'draft' : 'published',
        tags: formData.tags.split(',').map(tag => tag.trim()).filter(Boolean),
        author: user?.name || 'Unknown',
        createdAt: selectedProblem?.createdAt || new Date().toISOString(),
        acceptanceRate: selectedProblem?.acceptanceRate || 0,
        submissions: selectedProblem?.submissions || 0,
        id: selectedProblem?.id || Date.now()
      };

      if (selectedProblem) {
        setProblems(prevProblems => 
          prevProblems.map(p => 
            p.id === selectedProblem.id 
              ? { ...p, ...problemDataWithMeta }
              : p
          )
        );
      } else {
        setProblems(prevProblems => [problemDataWithMeta, ...prevProblems]);
      }
      
      setIsModalOpen(false);
      toast.error('API error - saved locally. Changes may not persist.');
      
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteProblem = async (problemId) => {
    if (!window.confirm('Are you sure you want to delete this problem?')) {
      return;
    }

    try {
      setIsLoading(true);
      
      // Try API delete first
      const response = await fetch(`http://localhost:5000/api/problems/${problemId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          toast.success('Problem deleted successfully!');
          // Reload problems from API
          await loadProblems();
          return;
        }
      }
      
      // Fallback to local state if API fails
      setProblems(prevProblems => prevProblems.filter(p => p.id !== problemId));
      toast.error('API error - deleted locally only');
      
    } catch (error) {
      console.error('❌ Error deleting problem:', error);
      // Fallback to local state
      setProblems(prevProblems => prevProblems.filter(p => p.id !== problemId));
      toast.error('API error - deleted locally only');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleExampleChange = (index, field, value) => {
    const newExamples = [...formData.examples];
    newExamples[index] = { ...newExamples[index], [field]: value };
    setFormData(prev => ({ ...prev, examples: newExamples }));
  };

  const addExample = () => {
    setFormData(prev => ({
      ...prev,
      examples: [...prev.examples, { input: '', output: '', explanation: '' }]
    }));
  };

  const removeExample = (index) => {
    if (formData.examples.length > 1) {
      setFormData(prev => ({
        ...prev,
        examples: prev.examples.filter((_, i) => i !== index)
      }));
    }
  };

  const handleBackToAdmin = () => {
    // Set flag to refresh questions when returning to dashboard
    sessionStorage.setItem('shouldRefreshQuestions', 'true');
    navigate('/admin/dashboard');
    toast.success('Returning to admin dashboard');
  };

  const handleLogout = () => {
    logout();
    navigate('/auth');
    toast.success('Logged out successfully');
  };

  const filteredProblems = problems.filter(problem => {
    const matchesSearch = problem.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         problem.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDifficulty = !filterDifficulty || problem.difficulty === filterDifficulty;
    const matchesStatus = !filterStatus || problem.status === filterStatus;
    return matchesSearch && matchesDifficulty && matchesStatus;
  });

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-500/20 text-green-300 border-green-500/30';
      case 'medium': return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30';
      case 'hard': return 'bg-red-500/20 text-red-300 border-red-500/30';
      default: return 'bg-gray-500/20 text-gray-300 border-gray-500/30';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'published': return 'bg-green-500/20 text-green-300 border-green-500/30';
      case 'draft': return 'bg-gray-500/20 text-gray-300 border-gray-500/30';
      case 'pending': return 'bg-blue-500/20 text-blue-300 border-blue-500/30';
      default: return 'bg-gray-500/20 text-gray-300 border-gray-500/30';
    }
  };

  const categories = [
    'array', 'string', 'linked-lists', 'trees', 'dynamic-programming',
    'graph', 'sorting', 'searching', 'hash-table', 'stack', 'queue',
    'heap', 'trie', 'binary-search', 'two-pointers', 'sliding-window'
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Background Effects */}
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
        {/* Top Navigation */}
        <motion.nav 
          className="bg-white/10 backdrop-blur-md border-b border-white/20"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex justify-between items-center h-16">
              <motion.div 
                className="flex items-center"
                whileHover={{ scale: 1.02 }}
              >
                <div className="w-10 h-10 bg-gradient-to-r from-blue-400 to-purple-500 rounded-2xl flex items-center justify-center mr-3">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-white">Problem Management</h1>
                  <p className="text-xs text-white/60">Create and manage coding challenges</p>
                </div>
              </motion.div>
              
              <div className="flex items-center space-x-4">
                <motion.button
                  onClick={handleBackToAdmin}
                  className="flex items-center space-x-2 px-4 py-2 bg-white/10 rounded-xl text-white hover:bg-white/20 transition-all duration-300 border border-white/20"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back to Admin</span>
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
                  <span>Logout</span>
                </motion.button>
              </div>
            </div>
          </div>
        </motion.nav>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-6 py-8">
          {/* Header */}
          <motion.div 
            className="flex justify-between items-center mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div>
              <h2 className="text-3xl font-bold text-white mb-2">Problems</h2>
              <p className="text-white/70">Create, edit, and manage all problems in your platform</p>
            </div>
            <motion.button
              onClick={handleCreateProblem}
              className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all duration-300 flex items-center space-x-2 shadow-lg"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Plus className="w-5 h-5" />
              <span>Add Problem</span>
            </motion.button>
          </motion.div>

          {/* Filters and Search */}
          <motion.div 
            className="bg-white/10 backdrop-blur-md rounded-2xl p-6 mb-8 border border-white/20"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search problems..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/30 rounded-xl text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>
              
              <select
                value={filterDifficulty}
                onChange={(e) => setFilterDifficulty(e.target.value)}
                className="w-full px-4 py-3 bg-white/10 border border-white/30 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-400"
              >
                <option value="" className="bg-gray-800">All Difficulties</option>
                <option value="easy" className="bg-gray-800">Easy</option>
                <option value="medium" className="bg-gray-800">Medium</option>
                <option value="hard" className="bg-gray-800">Hard</option>
              </select>

              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full px-4 py-3 bg-white/10 border border-white/30 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-400"
              >
                <option value="" className="bg-gray-800">All Status</option>
                <option value="published" className="bg-gray-800">Published</option>
                <option value="draft" className="bg-gray-800">Draft</option>
                <option value="pending" className="bg-gray-800">Pending</option>
              </select>

              <div className="flex space-x-2">
                <motion.button
                  className="flex-1 bg-green-500/20 text-green-300 py-3 px-4 rounded-xl hover:bg-green-500/30 transition-colors border border-green-500/30"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Upload className="w-4 h-4 mx-auto" />
                </motion.button>
                <motion.button
                  className="flex-1 bg-blue-500/20 text-blue-300 py-3 px-4 rounded-xl hover:bg-blue-500/30 transition-colors border border-blue-500/30"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Download className="w-4 h-4 mx-auto" />
                </motion.button>
              </div>
            </div>
          </motion.div>

          {/* Problems Grid */}
          <motion.div 
            className="grid grid-cols-1 lg:grid-cols-3 gap-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            {/* Problems List */}
            <div className="lg:col-span-1 space-y-4 max-h-[800px] overflow-y-auto">
              <h3 className="text-lg font-semibold text-white mb-4">
                Showing {filteredProblems.length} of {problems.length} problems
              </h3>
              
              {filteredProblems.map((problem, index) => (
                <motion.div
                  key={problem.id}
                  className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20 hover:bg-white/15 transition-all duration-300 cursor-pointer"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  onClick={() => handleEditProblem(problem)}
                  whileHover={{ scale: 1.02 }}
                >
                  <div className="flex justify-between items-start mb-3">
                    <h4 className="font-semibold text-white">{problem.title}</h4>
                    <div className="flex space-x-2">
                      <span className={`px-2 py-1 text-xs font-medium rounded-lg border ${getDifficultyColor(problem.difficulty)}`}>
                        {problem.difficulty.charAt(0).toUpperCase() + problem.difficulty.slice(1)}
                      </span>
                      <span className={`px-2 py-1 text-xs font-medium rounded-lg border ${getStatusColor(problem.status)}`}>
                        {problem.status === 'published' ? '✅' : problem.status === 'draft' ? '📝' : '⏳'}
                      </span>
                    </div>
                  </div>
                  
                  <p className="text-sm text-white/70 mb-3 line-clamp-2">
                    {problem.description}
                  </p>
                  
                  <div className="flex justify-between items-center text-xs text-white/60">
                    <span>{problem.submissions} submissions</span>
                    <span>{problem.acceptanceRate}% acceptance</span>
                  </div>
                  
                  <div className="flex justify-between items-center mt-3">
                    <div className="flex space-x-1">
                      {problem.tags?.slice(0, 2).map((tag, i) => (
                        <span key={i} className="px-2 py-1 bg-blue-500/20 text-blue-300 text-xs rounded">
                          {tag}
                        </span>
                      ))}
                    </div>
                    <div className="flex space-x-2">
                      <motion.button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEditProblem(problem);
                        }}
                        className="p-2 text-blue-400 hover:text-blue-300 hover:bg-blue-500/20 rounded-lg transition-all"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <Edit3 className="w-4 h-4" />
                      </motion.button>
                      <motion.button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteProblem(problem.id);
                        }}
                        className="p-2 text-red-400 hover:text-red-300 hover:bg-red-500/20 rounded-lg transition-all"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <Trash2 className="w-4 h-4" />
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Problem Details/Preview */}
            <div className="lg:col-span-2">
              {selectedProblem ? (
                <motion.div
                  className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <h3 className="text-2xl font-bold text-white mb-2">{selectedProblem.title}</h3>
                      <div className="flex space-x-3">
                        <span className={`px-3 py-1 text-sm font-medium rounded-lg border ${getDifficultyColor(selectedProblem.difficulty)}`}>
                          {selectedProblem.difficulty.charAt(0).toUpperCase() + selectedProblem.difficulty.slice(1)}
                        </span>
                        <span className={`px-3 py-1 text-sm font-medium rounded-lg border ${getStatusColor(selectedProblem.status)}`}>
                          {selectedProblem.status.charAt(0).toUpperCase() + selectedProblem.status.slice(1)}
                        </span>
                      </div>
                    </div>
                    <motion.button
                      onClick={() => handleEditProblem(selectedProblem)}
                      className="bg-blue-500/20 text-blue-300 px-4 py-2 rounded-lg hover:bg-blue-500/30 transition-colors border border-blue-500/30"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Edit3 className="w-4 h-4 inline mr-2" />
                      Edit
                    </motion.button>
                  </div>

                  <div className="space-y-6">
                    <div>
                      <h4 className="text-lg font-semibold text-white mb-3">Description</h4>
                      <div className="bg-white/5 rounded-lg p-4 text-white/80">
                        {selectedProblem.description}
                      </div>
                    </div>

                    {selectedProblem.examples && selectedProblem.examples.length > 0 && (
                      <div>
                        <h4 className="text-lg font-semibold text-white mb-3">Examples</h4>
                        {selectedProblem.examples.map((example, index) => (
                          <div key={index} className="bg-white/5 rounded-lg p-4 mb-3">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <p className="text-sm font-medium text-white/70 mb-2">Input:</p>
                                <code className="text-green-400 text-sm">{example.input}</code>
                              </div>
                              <div>
                                <p className="text-sm font-medium text-white/70 mb-2">Output:</p>
                                <code className="text-blue-400 text-sm">{example.output}</code>
                              </div>
                            </div>
                            {example.explanation && (
                              <div className="mt-3">
                                <p className="text-sm font-medium text-white/70 mb-2">Explanation:</p>
                                <p className="text-white/80 text-sm">{example.explanation}</p>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}

                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-white/5 rounded-lg p-4">
                        <div className="flex items-center space-x-2 mb-2">
                          <Clock className="w-4 h-4 text-orange-400" />
                          <span className="text-sm font-medium text-white/70">Time Limit</span>
                        </div>
                        <p className="text-white font-semibold">{selectedProblem.timeLimit}ms</p>
                      </div>
                      <div className="bg-white/5 rounded-lg p-4">
                        <div className="flex items-center space-x-2 mb-2">
                          <Database className="w-4 h-4 text-blue-400" />
                          <span className="text-sm font-medium text-white/70">Memory Limit</span>
                        </div>
                        <p className="text-white font-semibold">{selectedProblem.memoryLimit}MB</p>
                      </div>
                    </div>

                    <div className="flex space-x-3">
                      <span className="text-sm text-white/70">Tags:</span>
                      <div className="flex flex-wrap gap-2">
                        {selectedProblem.tags?.map((tag, index) => (
                          <span key={index} className="px-2 py-1 bg-purple-500/20 text-purple-300 text-xs rounded border border-purple-500/30">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  className="bg-white/10 backdrop-blur-md rounded-2xl p-12 border border-white/20 text-center"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <Code className="w-16 h-16 text-white/40 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-white mb-2">Select a Problem</h3>
                  <p className="text-white/60 mb-6">Choose a problem from the list to view its details, or create a new one.</p>
                  <motion.button
                    onClick={handleCreateProblem}
                    className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all duration-300"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Create Your First Problem
                  </motion.button>
                </motion.div>
              )}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Create/Edit Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-slate-800 rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto border border-white/20"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
            >
              {/* Modal Header */}
              <div className="sticky top-0 bg-slate-800 border-b border-white/20 p-6 z-10">
                <div className="flex justify-between items-center">
                  <h3 className="text-2xl font-bold text-white">
                    {selectedProblem ? 'Edit Problem' : 'Create New Problem'}
                  </h3>
                  <motion.button
                    onClick={() => setIsModalOpen(false)}
                    className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-all"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <X className="w-6 h-6" />
                  </motion.button>
                </div>
              </div>

              {/* Modal Content */}
              <div className="p-6 space-y-6">
                {/* Basic Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-white/70 mb-2">
                      Problem Title *
                    </label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) => handleInputChange('title', e.target.value)}
                      className="w-full px-4 py-3 bg-white/10 border border-white/30 rounded-xl text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-blue-400"
                      placeholder="Enter problem title..."
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-white/70 mb-2">
                        Difficulty
                      </label>
                      <select
                        value={formData.difficulty}
                        onChange={(e) => handleInputChange('difficulty', e.target.value)}
                        className="w-full px-4 py-3 bg-white/10 border border-white/30 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-400"
                      >
                        <option value="easy" className="bg-gray-800">Easy</option>
                        <option value="medium" className="bg-gray-800">Medium</option>
                        <option value="hard" className="bg-gray-800">Hard</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-white/70 mb-2">
                        Category
                      </label>
                      <select
                        value={formData.category}
                        onChange={(e) => handleInputChange('category', e.target.value)}
                        className="w-full px-4 py-3 bg-white/10 border border-white/30 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-400"
                      >
                        {categories.map(category => (
                          <option key={category} value={category} className="bg-gray-800">
                            {category.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-white/70 mb-2">
                    Problem Description *
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    rows={6}
                    className="w-full px-4 py-3 bg-white/10 border border-white/30 rounded-xl text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none"
                    placeholder="Describe the problem clearly and concisely..."
                  />
                </div>

                {/* Tags */}
                <div>
                  <label className="block text-sm font-medium text-white/70 mb-2">
                    Tags (comma separated)
                  </label>
                  <input
                    type="text"
                    value={formData.tags}
                    onChange={(e) => handleInputChange('tags', e.target.value)}
                    className="w-full px-4 py-3 bg-white/10 border border-white/30 rounded-xl text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-blue-400"
                    placeholder="array, hash-table, two-pointers..."
                  />
                </div>

                {/* Examples */}
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <h4 className="text-lg font-semibold text-white">Example Cases</h4>
                    <motion.button
                      onClick={addExample}
                      className="bg-green-500/20 text-green-300 px-4 py-2 rounded-lg hover:bg-green-500/30 transition-colors border border-green-500/30"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Plus className="w-4 h-4 inline mr-2" />
                      Add Example
                    </motion.button>
                  </div>
                  
                  {formData.examples.map((example, index) => (
                    <div key={index} className="bg-white/5 rounded-lg p-4 mb-4">
                      <div className="flex justify-between items-center mb-3">
                        <h5 className="font-medium text-white">Example {index + 1}</h5>
                        {formData.examples.length > 1 && (
                          <motion.button
                            onClick={() => removeExample(index)}
                            className="text-red-400 hover:text-red-300 p-1"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                          >
                            <X className="w-4 h-4" />
                          </motion.button>
                        )}
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                          <label className="block text-sm font-medium text-white/70 mb-2">Input</label>
                          <textarea
                            value={example.input}
                            onChange={(e) => handleExampleChange(index, 'input', e.target.value)}
                            rows={3}
                            className="w-full px-3 py-2 bg-white/10 border border-white/30 rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none"
                            placeholder="Example input..."
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-white/70 mb-2">Output</label>
                          <textarea
                            value={example.output}
                            onChange={(e) => handleExampleChange(index, 'output', e.target.value)}
                            rows={3}
                            className="w-full px-3 py-2 bg-white/10 border border-white/30 rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none"
                            placeholder="Expected output..."
                          />
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-white/70 mb-2">Explanation</label>
                        <textarea
                          value={example.explanation}
                          onChange={(e) => handleExampleChange(index, 'explanation', e.target.value)}
                          rows={2}
                          className="w-full px-3 py-2 bg-white/10 border border-white/30 rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none"
                          placeholder="Explain the example..."
                        />
                      </div>
                    </div>
                  ))}
                </div>

                {/* Constraints */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-white/70 mb-2">
                      Time Limit (ms)
                    </label>
                    <input
                      type="number"
                      value={formData.timeLimit}
                      onChange={(e) => handleInputChange('timeLimit', parseInt(e.target.value) || 1000)}
                      className="w-full px-4 py-3 bg-white/10 border border-white/30 rounded-xl text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-blue-400"
                      min="100"
                      max="10000"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-white/70 mb-2">
                      Memory Limit (MB)
                    </label>
                    <input
                      type="number"
                      value={formData.memoryLimit}
                      onChange={(e) => handleInputChange('memoryLimit', parseInt(e.target.value) || 128)}
                      className="w-full px-4 py-3 bg-white/10 border border-white/30 rounded-xl text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-blue-400"
                      min="16"
                      max="512"
                    />
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="sticky bottom-0 bg-slate-800 border-t border-white/20 p-6">
                <div className="flex justify-end space-x-4">
                  <motion.button
                    onClick={() => setIsModalOpen(false)}
                    className="px-6 py-3 border border-white/30 rounded-xl text-white hover:bg-white/10 transition-all duration-300"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Cancel
                  </motion.button>
                  
                  <motion.button
                    onClick={() => handleSaveProblem(true)}
                    disabled={isLoading}
                    className="px-6 py-3 bg-gray-500/20 text-gray-300 rounded-xl hover:bg-gray-500/30 transition-all duration-300 disabled:opacity-50 border border-gray-500/30"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {isLoading ? (
                      <div className="flex items-center space-x-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>Saving...</span>
                      </div>
                    ) : (
                      <>
                        <FileText className="w-4 h-4 inline mr-2" />
                        Save as Draft
                      </>
                    )}
                  </motion.button>
                  
                  <motion.button
                    onClick={() => handleSaveProblem(false)}
                    disabled={isLoading}
                    className="px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl hover:from-green-600 hover:to-green-700 transition-all duration-300 disabled:opacity-50"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {isLoading ? (
                      <div className="flex items-center space-x-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>Publishing...</span>
                      </div>
                    ) : (
                      <>
                        <CheckCircle className="w-4 h-4 inline mr-2" />
                        {selectedProblem ? 'Update Problem' : 'Publish Problem'}
                      </>
                    )}
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ProblemManagement;