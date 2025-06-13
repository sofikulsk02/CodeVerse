// filepath: c:\soma.campus\frontend\src\pages\admin\ContestManagement.jsx
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Trophy, Plus, Search, Filter, MoreVertical, Edit, Trash2, Eye,
  Download, Upload, Calendar, Clock, Users, Play, Pause, AlertTriangle,
  Check, X, ChevronLeft, ChevronRight, RefreshCw, FileText,
  Flag, Award, Timer, Settings, ArrowRight, ArrowLeft, BookOpen,
  List, Grid, Calendar as CalendarIcon, UserPlus, Save, BarChart
} from 'lucide-react';
import ContestModal from '../../components/admin/ContestModal';

const ContestManagement = () => {
  // State variables
  const [contests, setContests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterType, setFilterType] = useState('all');
  const [selectedContests, setSelectedContests] = useState(new Set());
  const [currentPage, setCurrentPage] = useState(1);
  const [contestsPerPage] = useState(6);
  const [showContestModal, setShowContestModal] = useState(false);
  const [editingContest, setEditingContest] = useState(null);
  const [showBulkActions, setShowBulkActions] = useState(false);
  const [viewMode, setViewMode] = useState('grid');
  const [showCalendarView, setShowCalendarView] = useState(false);

  // Mock data for contests
  const mockContests = [
    {
      id: 1,
      title: "Weekly Algorithm Challenge #45",
      description: "Solve algorithmic challenges focusing on dynamic programming and graph theory.",
      status: "active",
      type: "weekly",
      startDate: "2024-06-10T14:00:00Z",
      endDate: "2024-06-17T14:00:00Z",
      participants: 234,
      problemCount: 8,
      visibility: "public",
      createdBy: "Alice Johnson",
      createdAt: "2024-06-01T10:00:00Z",
      rules: [
        "No external libraries allowed",
        "Solutions must run within the time constraints",
        "Collaboration is not permitted"
      ],
      bannerImage: null,
      problems: [
        { id: 101, title: "Two Sum", difficulty: "easy" },
        { id: 102, title: "LRU Cache Implementation", difficulty: "medium" },
        { id: 103, title: "Binary Tree Maximum Path Sum", difficulty: "hard" }
      ]
    },
    {
      id: 2,
      title: "AI and ML Coding Competition",
      description: "Implement machine learning algorithms from scratch.",
      status: "upcoming",
      type: "special",
      startDate: "2024-06-20T09:00:00Z",
      endDate: "2024-06-22T18:00:00Z",
      participants: 150,
      problemCount: 5,
      visibility: "private",
      createdBy: "Bob Smith",
      createdAt: "2024-05-15T14:00:00Z",
      rules: [
        "No pre-trained models allowed",
        "Solutions will be judged on accuracy and efficiency",
        "Top 3 winners will receive prizes"
      ],
      bannerImage: "https://example.com/contest-banner.jpg",
      problems: [
        { id: 201, title: "Linear Regression Implementation", difficulty: "medium" },
        { id: 202, title: "K-means Clustering", difficulty: "medium" },
        { id: 203, title: "Neural Network from Scratch", difficulty: "hard" }
      ]
    },
    {
      id: 3,
      title: "Frontend Development Challenge",
      description: "Create responsive UI components and optimize performance.",
      status: "completed",
      type: "minithon",
      startDate: "2024-05-01T10:00:00Z",
      endDate: "2024-05-03T10:00:00Z",
      participants: 345,
      problemCount: 4,
      visibility: "public",
      createdBy: "Carol Wilson",
      createdAt: "2024-04-15T09:45:00Z",
      rules: [
        "Only vanilla JavaScript, HTML, and CSS allowed",
        "Solutions must be cross-browser compatible",
        "Accessibility guidelines must be followed"
      ],
      bannerImage: null,
      problems: [
        { id: 301, title: "Responsive Navigation Bar", difficulty: "easy" },
        { id: 302, title: "Interactive Data Table", difficulty: "medium" },
        { id: 303, title: "Real-time Chat Interface", difficulty: "hard" }
      ]
    }
  ];

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setContests(mockContests);
      setLoading(false);
    }, 1000);
  }, []);

  // Filter contests based on search term and filters
  const filteredContests = contests.filter(contest => {
    const matchesSearch = contest.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         contest.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || contest.status === filterStatus;
    const matchesType = filterType === 'all' || contest.type === filterType;
    
    return matchesSearch && matchesStatus && matchesType;
  });

  // Pagination
  const indexOfLastContest = currentPage * contestsPerPage;
  const indexOfFirstContest = indexOfLastContest - contestsPerPage;
  const currentContests = filteredContests.slice(indexOfFirstContest, indexOfLastContest);
  const totalPages = Math.ceil(filteredContests.length / contestsPerPage);

  // Handle selection of contests
  const handleSelectContest = (contestId) => {
    const newSelected = new Set(selectedContests);
    if (newSelected.has(contestId)) {
      newSelected.delete(contestId);
    } else {
      newSelected.add(contestId);
    }
    setSelectedContests(newSelected);
    setShowBulkActions(newSelected.size > 0);
  };

  const handleSelectAll = () => {
    if (selectedContests.size === currentContests.length) {
      setSelectedContests(new Set());
      setShowBulkActions(false);
    } else {
      setSelectedContests(new Set(currentContests.map(contest => contest.id)));
      setShowBulkActions(true);
    }
  };

  // Get status badge
  const getStatusBadge = (status) => {
    const statusConfig = {
      active: {
        color: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400',
        icon: Play
      },
      completed: {
        color: 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400',
        icon: Check
      },
      upcoming: {
        color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400',
        icon: Clock
      },
      canceled: {
        color: 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400',
        icon: X
      }
    };
    
    const { color, icon: Icon } = statusConfig[status] || statusConfig.upcoming;
    
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${color}`}>
        <Icon className="w-3 h-3 mr-1" />
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Calculate time remaining or time elapsed
  const getTimeStatus = (startDate, endDate) => {
    const now = new Date();
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    if (now < start) {
      // Upcoming contest
      const diffTime = Math.abs(start - now);
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
      const diffHours = Math.floor((diffTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      
      if (diffDays > 0) {
        return `Starts in ${diffDays}d ${diffHours}h`;
      } else {
        const diffMinutes = Math.floor((diffTime % (1000 * 60 * 60)) / (1000 * 60));
        return `Starts in ${diffHours}h ${diffMinutes}m`;
      }
    } else if (now > end) {
      // Completed contest
      return `Ended ${formatDate(endDate)}`;
    } else {
      // Active contest
      const diffTime = Math.abs(end - now);
      const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
      const diffMinutes = Math.floor((diffTime % (1000 * 60 * 60)) / (1000 * 60));
      
      return `Ends in ${diffHours}h ${diffMinutes}m`;
    }
  };

  // Contest actions
  const handleCreateContest = () => {
    setEditingContest(null);
    setShowContestModal(true);
  };

  const handleEditContest = (contest) => {
    setEditingContest(contest);
    setShowContestModal(true);
  };

  const handleSaveContest = async (contestData) => {
    if (editingContest) {
      // Update existing contest
      setContests(prev => prev.map(contest => 
        contest.id === editingContest.id ? contestData : contest
      ));
    } else {
      // Add new contest
      setContests(prev => [...prev, contestData]);
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="flex items-center space-x-3">
          <RefreshCw className="w-6 h-6 animate-spin text-purple-400" />
          <span className="text-lg font-medium text-white">Loading contests...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Contest Management</h1>
            <p className="text-gray-300">Create and manage coding competitions</p>
          </div>
          <div className="flex items-center space-x-4 mt-4 lg:mt-0">
            <button className="flex items-center space-x-2 px-4 py-2 bg-gray-700 text-white rounded-xl hover:bg-gray-600 transition-colors">
              <Upload className="w-4 h-4" />
              <span>Import</span>
            </button>
            <button className="flex items-center space-x-2 px-4 py-2 bg-gray-700 text-white rounded-xl hover:bg-gray-600 transition-colors">
              <Download className="w-4 h-4" />
              <span>Export</span>
            </button>
            <button 
              onClick={handleCreateContest}
              className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-xl hover:shadow-lg transition-all duration-200"
            >
              <Plus className="w-4 h-4" />
              <span>Create Contest</span>
            </button>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-gray-800/50 backdrop-blur-lg rounded-2xl p-6 mb-6 border border-gray-700">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            <div className="flex flex-wrap items-center gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search contests..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 w-80 bg-gray-700 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-4 py-2 bg-gray-700 border border-gray-600 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="upcoming">Upcoming</option>
                <option value="completed">Completed</option>
                <option value="canceled">Canceled</option>
              </select>
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="px-4 py-2 bg-gray-700 border border-gray-600 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="all">All Types</option>
                <option value="weekly">Weekly</option>
                <option value="special">Special</option>
                <option value="minithon">Mini Hackathon</option>
                <option value="practice">Practice</option>
              </select>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-300">
                Showing {currentContests.length} of {filteredContests.length} contests
              </div>
              <div className="flex items-center space-x-1 border border-gray-600 rounded-lg">
                <button 
                  onClick={() => setViewMode('grid')} 
                  className={`p-2 ${viewMode === 'grid' ? 'bg-purple-600 text-white' : 'text-gray-400'} rounded-l-lg transition-colors`}
                >
                  <Grid className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => setViewMode('list')} 
                  className={`p-2 ${viewMode === 'list' ? 'bg-purple-600 text-white' : 'text-gray-400'} transition-colors`}
                >
                  <List className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => setShowCalendarView(!showCalendarView)} 
                  className={`p-2 ${showCalendarView ? 'bg-purple-600 text-white' : 'text-gray-400'} rounded-r-lg transition-colors`}
                >
                  <CalendarIcon className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Bulk Actions */}
        <AnimatePresence>
          {showBulkActions && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="bg-gray-800/50 backdrop-blur-lg rounded-2xl p-4 mb-6 border border-gray-700"
            >
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-300">
                  {selectedContests.size} contest{selectedContests.size !== 1 ? 's' : ''} selected
                </div>
                <div className="flex items-center space-x-2">
                  <button className="px-4 py-2 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-colors">
                    <Trash2 className="w-4 h-4 mr-2 inline" />
                    Delete
                  </button>
                  <button className="px-4 py-2 bg-green-500 text-white rounded-xl hover:bg-green-600 transition-colors">
                    <Play className="w-4 h-4 mr-2 inline" />
                    Start
                  </button>
                  <button className="px-4 py-2 bg-yellow-500 text-white rounded-xl hover:bg-yellow-600 transition-colors">
                    <Pause className="w-4 h-4 mr-2 inline" />
                    Pause
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Calendar View */}
        {showCalendarView && (
          <div className="bg-gray-800/50 backdrop-blur-lg rounded-2xl p-6 mb-6 border border-gray-700">
            <h3 className="text-xl font-semibold text-white mb-4">Contest Calendar</h3>
            <div className="text-gray-300 text-center py-8">
              Calendar view will be implemented here
            </div>
          </div>
        )}

        {/* Contests Grid/List View */}
        {viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {currentContests.map((contest) => (
              <motion.div
                key={contest.id}
                whileHover={{ y: -5, boxShadow: '0 10px 20px rgba(0,0,0,0.3)' }}
                className="bg-gray-800/50 backdrop-blur-lg rounded-2xl p-6 border border-gray-700 relative"
              >
                <div className="absolute top-4 right-4">
                  <input
                    type="checkbox"
                    checked={selectedContests.has(contest.id)}
                    onChange={() => handleSelectContest(contest.id)}
                    className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                  />
                </div>

                <div className="flex items-start justify-between mb-4">
                  {getStatusBadge(contest.status)}
                  <span className="text-xs text-gray-400 bg-gray-700 px-2 py-1 rounded">
                    {contest.type}
                  </span>
                </div>

                <h3 className="text-xl font-bold text-white mb-2">{contest.title}</h3>
                
                <p className="text-gray-300 text-sm mb-4 line-clamp-2">
                  {contest.description}
                </p>

                <div className="space-y-2 text-sm text-gray-400 mb-4">
                  <div className="flex items-center">
                    <Calendar className="w-4 h-4 mr-2" />
                    <span>{formatDate(contest.startDate)}</span>
                  </div>
                  <div className="flex items-center">
                    <Clock className="w-4 h-4 mr-2" />
                    <span>{getTimeStatus(contest.startDate, contest.endDate)}</span>
                  </div>
                  <div className="flex items-center">
                    <Users className="w-4 h-4 mr-2" />
                    <span>{contest.participants} participants</span>
                  </div>
                  <div className="flex items-center">
                    <BookOpen className="w-4 h-4 mr-2" />
                    <span>{contest.problemCount} problems</span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="text-xs text-gray-400">
                    by {contest.createdBy}
                  </div>
                  <div className="flex items-center space-x-1">
                    <button 
                      onClick={() => handleEditContest(contest)}
                      className="p-2 hover:bg-gray-700 rounded-lg transition-colors text-blue-400"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button className="p-2 hover:bg-gray-700 rounded-lg transition-colors text-green-400">
                      <Eye className="w-4 h-4" />
                    </button>
                    <button className="p-2 hover:bg-gray-700 rounded-lg transition-colors text-red-400">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="bg-gray-800/50 backdrop-blur-lg rounded-2xl border border-gray-700 overflow-hidden mb-8">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-700">
                <thead className="bg-gray-700">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      <input
                        type="checkbox"
                        onChange={handleSelectAll}
                        checked={selectedContests.size === currentContests.length && currentContests.length > 0}
                        className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                      />
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Contest
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Status
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Participants
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Start Date
                    </th>
                    <th scope="col" className="relative px-6 py-3">
                      <span className="sr-only">Actions</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-gray-800 divide-y divide-gray-700">
                  {currentContests.map((contest) => (
                    <tr key={contest.id} className="hover:bg-gray-750 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <input
                          type="checkbox"
                          checked={selectedContests.has(contest.id)}
                          onChange={() => handleSelectContest(contest.id)}
                          className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                        />
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <div className="text-sm font-medium text-white">{contest.title}</div>
                          <div className="text-xs text-gray-400">{contest.type} • {contest.problemCount} problems</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getStatusBadge(contest.status)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-white">{contest.participants}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-white">{formatDate(contest.startDate)}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center space-x-2 justify-end">
                          <button 
                            onClick={() => handleEditContest(contest)}
                            className="text-blue-400 hover:text-blue-300"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button className="text-green-400 hover:text-green-300">
                            <Eye className="w-4 h-4" />
                          </button>
                          <button className="text-red-400 hover:text-red-300">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Pagination */}
        <div className="flex items-center justify-between text-sm text-gray-300">
          <div>
            Showing page {currentPage} of {totalPages}
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              className="px-3 py-2 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors"
              disabled={currentPage === 1}
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              className="px-3 py-2 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors"
              disabled={currentPage === totalPages}
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Contest Modal */}
        <ContestModal
          isOpen={showContestModal}
          onClose={() => setShowContestModal(false)}
          contest={editingContest}
          onSave={handleSaveContest}
        />
      </div>
    </div>
  );
};

export default ContestManagement;