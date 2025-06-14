import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';

const MentorDashboard = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [stats, setStats] = useState({
    studentsManaged: 25,
    problemsCreated: 15,
    contestsOrganized: 3,
    totalReviews: 89
  });
  const { user, logout } = useAuth();

  const renderContent = () => {
    return (
      <div className="space-y-8">
        <div className="bg-gradient-to-r from-green-500 to-blue-600 rounded-2xl p-8 text-white">
          <h2 className="text-3xl font-bold mb-2">Welcome back, {user?.name}! 👨‍🏫</h2>
          <p className="text-blue-100">Ready to guide your students today?</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 rounded-lg">
                <span className="text-3xl">👥</span>
              </div>
              <div className="ml-4">
                <h3 className="text-2xl font-bold text-gray-800">{stats.studentsManaged}</h3>
                <p className="text-gray-600 font-medium">Students Managed</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
            <div className="flex items-center">
              <div className="p-3 bg-green-100 rounded-lg">
                <span className="text-3xl">📝</span>
              </div>
              <div className="ml-4">
                <h3 className="text-2xl font-bold text-gray-800">{stats.problemsCreated}</h3>
                <p className="text-gray-600 font-medium">Problems Created</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
            <div className="flex items-center">
              <div className="p-3 bg-yellow-100 rounded-lg">
                <span className="text-3xl">🏆</span>
              </div>
              <div className="ml-4">
                <h3 className="text-2xl font-bold text-gray-800">{stats.contestsOrganized}</h3>
                <p className="text-gray-600 font-medium">Contests Organized</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
            <div className="flex items-center">
              <div className="p-3 bg-purple-100 rounded-lg">
                <span className="text-3xl">⭐</span>
              </div>
              <div className="ml-4">
                <h3 className="text-2xl font-bold text-gray-800">{stats.totalReviews}</h3>
                <p className="text-gray-600 font-medium">Reviews Given</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
          <h3 className="text-xl font-bold text-gray-800 mb-4">Mentor Tools</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button className="p-4 bg-blue-50 hover:bg-blue-100 rounded-lg border border-blue-200 transition-colors">
              <span className="text-2xl block mb-2">👥</span>
              <span className="text-sm font-medium text-blue-800">Manage Students</span>
            </button>
            <button className="p-4 bg-green-50 hover:bg-green-100 rounded-lg border border-green-200 transition-colors">
              <span className="text-2xl block mb-2">➕</span>
              <span className="text-sm font-medium text-green-800">Create Problem</span>
            </button>
            <button className="p-4 bg-purple-50 hover:bg-purple-100 rounded-lg border border-purple-200 transition-colors">
              <span className="text-2xl block mb-2">📊</span>
              <span className="text-sm font-medium text-purple-800">View Analytics</span>
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-8">
              <h2 className="text-2xl font-bold text-gray-800">SOMA Campus</h2>
              <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">Mentor</span>
            </div>

            <div className="flex items-center space-x-4">
              <span className="text-gray-700 font-medium">{user?.name}</span>
              <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                {user?.name?.charAt(0)}
              </div>
              <button
                onClick={logout}
                className="text-gray-500 hover:text-red-600 transition-colors duration-300"
              >
                🚪
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

export default MentorDashboard;