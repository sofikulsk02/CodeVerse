import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import Sidebar from './Sidebar';
import UserManagement from './UserManagement';
import ProblemManagement from './ProblemManagement';
import ContestManagement from './ContestManagement';
import Analytics from './Analytics';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState({
    totalUsers: 156,
    totalProblems: 89,
    totalContests: 12,
    totalSubmissions: 2847
  });
  const { user, token } = useAuth();

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/admin/stats', {
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
      case 'users':
        return <UserManagement />;
      case 'problems':
        return <ProblemManagement />;
      case 'contests':
        return <ContestManagement />;
      case 'analytics':
        return <Analytics />;
      default:
        return (
          <div className="space-y-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-800 mb-2">Dashboard Overview</h2>
              <p className="text-gray-600">Welcome back, {user?.name}! Here's what's happening today.</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300">
                <div className="flex items-center">
                  <div className="p-3 bg-blue-100 rounded-lg">
                    <span className="text-3xl">👥</span>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-2xl font-bold text-gray-800">{stats.totalUsers}</h3>
                    <p className="text-gray-600 font-medium">Total Users</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300">
                <div className="flex items-center">
                  <div className="p-3 bg-green-100 rounded-lg">
                    <span className="text-3xl">📝</span>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-2xl font-bold text-gray-800">{stats.totalProblems}</h3>
                    <p className="text-gray-600 font-medium">Problems</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300">
                <div className="flex items-center">
                  <div className="p-3 bg-yellow-100 rounded-lg">
                    <span className="text-3xl">🏆</span>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-2xl font-bold text-gray-800">{stats.totalContests}</h3>
                    <p className="text-gray-600 font-medium">Contests</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300">
                <div className="flex items-center">
                  <div className="p-3 bg-purple-100 rounded-lg">
                    <span className="text-3xl">📊</span>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-2xl font-bold text-gray-800">{stats.totalSubmissions}</h3>
                    <p className="text-gray-600 font-medium">Submissions</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
                <h3 className="text-xl font-bold text-gray-800 mb-4">Recent Activity</h3>
                <div className="space-y-4">
                  <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                    <div className="p-2 bg-green-100 rounded-full mr-3">
                      <span className="text-green-600">✅</span>
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-800">New user registered: John Doe</p>
                      <p className="text-sm text-gray-500">2 hours ago</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                    <div className="p-2 bg-blue-100 rounded-full mr-3">
                      <span className="text-blue-600">🏆</span>
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-800">Contest "Weekly Challenge" started</p>
                      <p className="text-sm text-gray-500">4 hours ago</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                    <div className="p-2 bg-yellow-100 rounded-full mr-3">
                      <span className="text-yellow-600">📝</span>
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-800">Problem "Binary Search" was solved 25 times</p>
                      <p className="text-sm text-gray-500">1 day ago</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
                <h3 className="text-xl font-bold text-gray-800 mb-4">Quick Actions</h3>
                <div className="grid grid-cols-2 gap-4">
                  <button 
                    onClick={() => setActiveTab('users')}
                    className="p-4 bg-blue-50 hover:bg-blue-100 rounded-lg border border-blue-200 transition-colors duration-300"
                  >
                    <span className="text-2xl block mb-2">👤</span>
                    <span className="text-sm font-medium text-blue-800">Add User</span>
                  </button>
                  
                  <button 
                    onClick={() => setActiveTab('problems')}
                    className="p-4 bg-green-50 hover:bg-green-100 rounded-lg border border-green-200 transition-colors duration-300"
                  >
                    <span className="text-2xl block mb-2">➕</span>
                    <span className="text-sm font-medium text-green-800">Add Problem</span>
                  </button>
                  
                  <button 
                    onClick={() => setActiveTab('contests')}
                    className="p-4 bg-yellow-50 hover:bg-yellow-100 rounded-lg border border-yellow-200 transition-colors duration-300"
                  >
                    <span className="text-2xl block mb-2">🎯</span>
                    <span className="text-sm font-medium text-yellow-800">New Contest</span>
                  </button>
                  
                  <button 
                    onClick={() => setActiveTab('analytics')}
                    className="p-4 bg-purple-50 hover:bg-purple-100 rounded-lg border border-purple-200 transition-colors duration-300"
                  >
                    <span className="text-2xl block mb-2">📈</span>
                    <span className="text-sm font-medium text-purple-800">View Reports</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <div className="flex-1 flex flex-col">
        <header className="bg-white shadow-sm border-b border-gray-200 px-8 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-800">Admin Dashboard</h1>
            <div className="flex items-center space-x-4">
              <span className="text-gray-600">Welcome, {user?.name}</span>
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                {user?.name?.charAt(0)}
              </div>
            </div>
          </div>
        </header>
        
        <main className="flex-1 p-8 overflow-y-auto">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;