import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import ProblemList from './ProblemList';
import ContestList from './ContestList';
import Profile from './Profile';

const StudentDashboard = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [stats, setStats] = useState({
    problemsSolved: 42,
    contestsParticipated: 8,
    currentStreak: 5,
    totalPoints: 1250,
    rank: 23
  });
  const { user, token, logout } = useAuth();

  useEffect(() => {
    fetchUserStats();
  }, []);

  const fetchUserStats = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/users/stats', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        setStats(data);
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'problems':
        return <ProblemList />;
      case 'contests':
        return <ContestList />;
      case 'profile':
        return <Profile />;
      default:
        return (
          <div className="space-y-8">
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl p-8 text-white">
              <h2 className="text-3xl font-bold mb-2">Welcome back, {user?.name}! 👋</h2>
              <p className="text-blue-100">Ready to solve some problems today?</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300">
                <div className="flex items-center">
                  <div className="p-3 bg-green-100 rounded-lg">
                    <span className="text-3xl">✅</span>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-2xl font-bold text-gray-800">{stats.problemsSolved}</h3>
                    <p className="text-gray-600 font-medium">Problems Solved</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300">
                <div className="flex items-center">
                  <div className="p-3 bg-yellow-100 rounded-lg">
                    <span className="text-3xl">🏆</span>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-2xl font-bold text-gray-800">{stats.contestsParticipated}</h3>
                    <p className="text-gray-600 font-medium">Contests Joined</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300">
                <div className="flex items-center">
                  <div className="p-3 bg-red-100 rounded-lg">
                    <span className="text-3xl">🔥</span>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-2xl font-bold text-gray-800">{stats.currentStreak}</h3>
                    <p className="text-gray-600 font-medium">Current Streak</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300">
                <div className="flex items-center">
                  <div className="p-3 bg-purple-100 rounded-lg">
                    <span className="text-3xl">⭐</span>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-2xl font-bold text-gray-800">{stats.totalPoints}</h3>
                    <p className="text-gray-600 font-medium">Total Points</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
                <h3 className="text-xl font-bold text-gray-800 mb-4">Recent Activity</h3>
                <div className="space-y-4">
                  <div className="flex items-center p-3 bg-green-50 rounded-lg border border-green-200">
                    <div className="p-2 bg-green-100 rounded-full mr-3">
                      <span className="text-green-600">✅</span>
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-800">Solved "Two Sum" problem</p>
                      <p className="text-sm text-gray-500">2 hours ago</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center p-3 bg-blue-50 rounded-lg border border-blue-200">
                    <div className="p-2 bg-blue-100 rounded-full mr-3">
                      <span className="text-blue-600">🏆</span>
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-800">Participated in Weekly Contest #45</p>
                      <p className="text-sm text-gray-500">1 day ago</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center p-3 bg-purple-50 rounded-lg border border-purple-200">
                    <div className="p-2 bg-purple-100 rounded-full mr-3">
                      <span className="text-purple-600">🎯</span>
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-800">Achieved 5-day solving streak</p>
                      <p className="text-sm text-gray-500">3 days ago</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
                <h3 className="text-xl font-bold text-gray-800 mb-4">Recommended for You</h3>
                <div className="space-y-4">
                  <div className="p-4 bg-gray-50 rounded-lg border border-gray-200 hover:border-blue-300 transition-colors duration-300 cursor-pointer">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-semibold text-gray-800">Binary Search</h4>
                      <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs font-medium">Easy</span>
                    </div>
                    <p className="text-gray-600 text-sm">Practice your search algorithms with this fundamental problem.</p>
                    <div className="mt-2 flex items-center text-xs text-gray-500">
                      <span>🎯 Arrays • Searching</span>
                    </div>
                  </div>
                  
                  <div className="p-4 bg-gray-50 rounded-lg border border-gray-200 hover:border-blue-300 transition-colors duration-300 cursor-pointer">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-semibold text-gray-800">Merge Sort Implementation</h4>
                      <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded text-xs font-medium">Medium</span>
                    </div>
                    <p className="text-gray-600 text-sm">Implement the classic divide-and-conquer sorting algorithm.</p>
                    <div className="mt-2 flex items-center text-xs text-gray-500">
                      <span>🎯 Sorting • Recursion</span>
                    </div>
                  </div>
                  
                  <div className="p-4 bg-gray-50 rounded-lg border border-gray-200 hover:border-blue-300 transition-colors duration-300 cursor-pointer">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-semibold text-gray-800">Dynamic Programming Basics</h4>
                      <span className="px-2 py-1 bg-red-100 text-red-800 rounded text-xs font-medium">Hard</span>
                    </div>
                    <p className="text-gray-600 text-sm">Challenge yourself with optimization problems.</p>
                    <div className="mt-2 flex items-center text-xs text-gray-500">
                      <span>🎯 DP • Optimization</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-8">
              <h2 className="text-2xl font-bold text-gray-800">SOMA Campus</h2>
              
              <div className="hidden md:flex space-x-1">
                {[
                  { id: 'dashboard', label: 'Dashboard' },
                  { id: 'problems', label: 'Problems' },
                  { id: 'contests', label: 'Contests' },
                  { id: 'profile', label: 'Profile' }
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors duration-300 ${
                      activeTab === tab.id
                        ? 'bg-blue-100 text-blue-700'
                        : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 bg-gray-100 px-3 py-1 rounded-lg">
                <span className="text-sm font-medium text-gray-700">Rank</span>
                <span className="text-sm font-bold text-blue-600">#{stats.rank}</span>
              </div>
              
              <div className="flex items-center space-x-3">
                <span className="text-gray-700 font-medium">{user?.name}</span>
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                  {user?.name?.charAt(0)}
                </div>
              </div>
              
              <button
                onClick={logout}
                className="text-gray-500 hover:text-red-600 transition-colors duration-300"
              >
                <span className="text-xl">🚪</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {renderContent()}
      </main>
    </div>
  );
};

export default StudentDashboard;