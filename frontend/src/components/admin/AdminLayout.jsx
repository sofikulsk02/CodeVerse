import React, { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, Users, BookOpen, Trophy, FileText, Settings,
  MessageSquare, BarChart3, Bell, Search, Menu, X, ChevronDown,
  LogOut, User, Shield, HelpCircle, Moon, Sun
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import toast from 'react-hot-toast';

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [darkMode, setDarkMode] = useState(true);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const sidebarItems = [
    {
      section: 'Overview',
      items: [
        { icon: LayoutDashboard, label: 'Dashboard', path: '/admin/dashboard' },
        { icon: BarChart3, label: 'Analytics', path: '/admin/analytics' }
      ]
    },
    {
      section: 'User Management',
      items: [
        { icon: Users, label: 'All Users', path: '/admin/users' },
        { icon: Users, label: 'Batches', path: '/admin/batches' },
        { icon: Shield, label: 'Roles & Permissions', path: '/admin/roles' }
      ]
    },
    {
      section: 'Content Management',
      items: [
        { icon: BookOpen, label: 'Problems', path: '/admin/problems' },
        { icon: Trophy, label: 'Contests', path: '/admin/contests' },
        { icon: FileText, label: 'Resources', path: '/admin/resources' },
        { icon: FileText, label: 'Submissions', path: '/admin/submissions' }
      ]
    },
    {
      section: 'Communication',
      items: [
        { icon: Bell, label: 'Announcements', path: '/admin/announcements' },
        { icon: MessageSquare, label: 'Messages', path: '/admin/messages' }
      ]
    },
    {
      section: 'System',
      items: [
        { icon: Settings, label: 'Settings', path: '/admin/settings' },
        { icon: FileText, label: 'Audit Logs', path: '/admin/audit-logs' }
      ]
    }
  ];

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/auth');
      toast.success('Logged out successfully');
    } catch (error) {
      toast.error('Logout failed');
    }
  };

  return (
    <div className={`min-h-screen ${darkMode ? 'dark' : ''}`}>
      <div className="bg-gray-50 dark:bg-gray-900 min-h-screen">
        {/* Sidebar */}
        <AnimatePresence>
          {sidebarOpen && (
            <motion.div
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="fixed inset-y-0 left-0 z-50 w-70 bg-white dark:bg-gray-800 shadow-xl lg:translate-x-0"
            >
              <div className="flex h-full flex-col">
                {/* Logo */}
                <div className="flex h-16 shrink-0 items-center justify-between px-6 border-b border-gray-200 dark:border-gray-700">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
                      <Shield className="w-5 h-5 text-white" />
                    </div>
                    <span className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                      Admin Panel
                    </span>
                  </div>
                  <button
                    onClick={() => setSidebarOpen(false)}
                    className="lg:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Navigation */}
                <nav className="flex-1 px-4 py-6 space-y-8 overflow-y-auto">
                  {sidebarItems.map((section, sectionIndex) => (
                    <div key={sectionIndex}>
                      <h3 className="px-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
                        {section.section}
                      </h3>
                      <div className="space-y-1">
                        {section.items.map((item, itemIndex) => {
                          const isActive = location.pathname === item.path;
                          return (
                            <motion.button
                              key={itemIndex}
                              onClick={() => navigate(item.path)}
                              whileHover={{ x: 4 }}
                              whileTap={{ scale: 0.98 }}
                              className={`w-full flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 ${
                                isActive
                                  ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg'
                                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                              }`}
                            >
                              <item.icon className={`mr-3 h-5 w-5 ${
                                isActive ? 'text-white' : 'text-gray-400'
                              }`} />
                              {item.label}
                            </motion.button>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </nav>

                {/* User profile */}
                <div className="border-t border-gray-200 dark:border-gray-700 p-4">
                  <div className="relative">
                    <button
                      onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                      className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center">
                          <User className="w-4 h-4 text-white" />
                        </div>
                        <div className="text-left">
                          <p className="text-sm font-medium text-gray-900 dark:text-white">
                            {user?.name}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">
                            {user?.role}
                          </p>
                        </div>
                      </div>
                      <ChevronDown className="w-4 h-4 text-gray-400" />
                    </button>

                    <AnimatePresence>
                      {profileDropdownOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          className="absolute bottom-full left-0 right-0 mb-2 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700"
                        >
                          <div className="p-2">
                            <button
                              onClick={() => setDarkMode(!darkMode)}
                              className="w-full flex items-center px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                            >
                              {darkMode ? (
                                <Sun className="w-4 h-4 mr-3" />
                              ) : (
                                <Moon className="w-4 h-4 mr-3" />
                              )}
                              {darkMode ? 'Light Mode' : 'Dark Mode'}
                            </button>
                            <button
                              onClick={() => navigate('/admin/help')}
                              className="w-full flex items-center px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                            >
                              <HelpCircle className="w-4 h-4 mr-3" />
                              Help & Support
                            </button>
                            <hr className="my-2 border-gray-200 dark:border-gray-700" />
                            <button
                              onClick={handleLogout}
                              className="w-full flex items-center px-3 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg"
                            >
                              <LogOut className="w-4 h-4 mr-3" />
                              Sign out
                            </button>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* main Content */}
        <div className={`${sidebarOpen ? 'lg:pl-70' : ''} transition-all duration-300`}>
          {/* top header */}
          <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
            <div className="px-4 sm:px-6 lg:px-8">
              <div className="flex h-16 justify-between items-center">
                <div className="flex items-center space-x-4">
                  <button
                    onClick={() => setSidebarOpen(!sidebarOpen)}
                    className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  >
                    <Menu className="w-5 h-5" />
                  </button>

                  {/* search Bar */}
                  <div className="hidden md:flex relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Search className="h-4 w-4 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      placeholder="Search users, problems, contests..."
                      className="block w-80 pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    />
                  </div>
                </div>

                {/* right side actions */}
                <div className="flex items-center space-x-4">
                  {/* notifications */}
                  <button className="relative p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                    <Bell className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                    <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                  </button>

                  {/* quick Action */}
                  <div className="hidden sm:flex items-center space-x-2">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => navigate('/admin/users/new')}
                      className="px-3 py-1.5 text-sm bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-lg hover:shadow-lg transition-all duration-200"
                    >
                      Add User
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => navigate('/admin/contests/new')}
                      className="px-3 py-1.5 text-sm border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200"
                    >
                      New Contest
                    </motion.button>
                  </div>
                </div>
              </div>
            </div>
          </header>

          {/* page content */}
          <main className="p-4 sm:p-6 lg:p-8">
            <Outlet />
          </main>
        </div>

        {/* mobile sidebar Overlay */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 z-40 bg-gray-600 bg-opacity-75 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </div>
    </div>
  );
};

export default AdminLayout;