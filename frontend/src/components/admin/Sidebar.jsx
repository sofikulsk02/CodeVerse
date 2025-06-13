import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const Sidebar = ({ activeTab, setActiveTab }) => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const menuItems = [
    { id: 'overview', label: 'Overview', icon: '📊' },
    { id: 'users', label: 'Users', icon: '👥' },
    { id: 'problems', label: 'Problems', icon: '📝' },
    { id: 'contests', label: 'Contests', icon: '🏆' },
    { id: 'analytics', label: 'Analytics', icon: '📈' },
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="w-64 bg-gray-900 text-white flex flex-col shadow-xl">
      <div className="p-6 border-b border-gray-700">
        <h2 className="text-2xl font-bold text-blue-400 mb-1">SOMA Campus</h2>
        <p className="text-gray-400 text-sm">Admin Panel</p>
      </div>
      
      <nav className="flex-1 py-6">
        {menuItems.map(item => (
          <button
            key={item.id}
            className={`w-full px-6 py-3 flex items-center space-x-3 text-left transition-all duration-300 hover:bg-gray-800 hover:border-r-4 hover:border-blue-500 ${
              activeTab === item.id 
                ? 'bg-gray-800 border-r-4 border-blue-500 text-blue-400' 
                : 'text-gray-300'
            }`}
            onClick={() => setActiveTab(item.id)}
          >
            <span className="text-xl">{item.icon}</span>
            <span className="font-medium">{item.label}</span>
          </button>
        ))}
      </nav>
      
      <div className="p-6 border-t border-gray-700">
        <button 
          className="w-full flex items-center space-x-3 px-4 py-3 text-gray-300 hover:text-white hover:bg-red-600 rounded-lg transition-all duration-300"
          onClick={handleLogout}
        >
          <span className="text-xl">🚪</span>
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;