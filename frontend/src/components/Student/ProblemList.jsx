import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';

const ProblemList = () => {
  const [problems, setProblems] = useState([
    {
      id: 1,
      title: "Two Sum",
      difficulty: "Easy",
      category: "Arrays",
      description: "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.",
      solved: true,
      attempts: 3,
      successRate: 65
    },
    {
      id: 2,
      title: "Binary Search",
      difficulty: "Easy",
      category: "Searching",
      description: "Given an array of integers nums which is sorted in ascending order, find the target value.",
      solved: false,
      attempts: 0,
      successRate: 78
    },
    {
      id: 3,
      title: "Merge Sort",
      difficulty: "Medium",
      category: "Sorting",
      description: "Implement merge sort algorithm to sort an array of integers.",
      solved: true,
      attempts: 5,
      successRate: 45
    },
    {
      id: 4,
      title: "Longest Palindromic Substring",
      difficulty: "Medium",
      category: "Strings",
      description: "Given a string s, return the longest palindromic substring in s.",
      solved: false,
      attempts: 2,
      successRate: 38
    },
    {
      id: 5,
      title: "N-Queens",
      difficulty: "Hard",
      category: "Backtracking",
      description: "The n-queens puzzle is the problem of placing n queens on an n×n chessboard.",
      solved: false,
      attempts: 0,
      successRate: 22
    }
  ]);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const { token } = useAuth();

  const getDifficultyColor = (difficulty) => {
    switch (difficulty.toLowerCase()) {
      case 'easy':
        return 'bg-green-100 text-green-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'hard':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredProblems = problems.filter(problem => {
    const matchesFilter = filter === 'all' || 
                         (filter === 'solved' && problem.solved) ||
                         (filter === 'unsolved' && !problem.solved) ||
                         problem.difficulty.toLowerCase() === filter.toLowerCase();
    const matchesSearch = problem.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         problem.category.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Problem Set</h2>
        <div className="bg-white px-4 py-2 rounded-lg shadow-sm border border-gray-200">
          <span className="text-sm text-gray-600">
            Solved: <span className="font-bold text-green-600">{problems.filter(p => p.solved).length}</span> / {problems.length}
          </span>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search problems..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
            />
          </div>
          
          <div className="flex gap-2">
            {['all', 'solved', 'unsolved', 'easy', 'medium', 'hard'].map((filterOption) => (
              <button
                key={filterOption}
                onClick={() => setFilter(filterOption)}
                className={`px-4 py-2 rounded-lg font-medium capitalize transition-colors duration-300 ${
                  filter === filterOption
                    ? 'bg-blue-100 text-blue-700'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {filterOption}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {filteredProblems.map((problem) => (
          <div
            key={problem.id}
            className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-300 cursor-pointer"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-4">
                <div className={`w-3 h-3 rounded-full ${problem.solved ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                <h3 className="text-lg font-semibold text-gray-800">{problem.title}</h3>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${getDifficultyColor(problem.difficulty)}`}>
                  {problem.difficulty}
                </span>
                <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium">
                  {problem.category}
                </span>
              </div>
              
              <div className="flex items-center space-x-4 text-sm text-gray-500">
                <span>Success Rate: {problem.successRate}%</span>
                <span>Attempts: {problem.attempts}</span>
              </div>
            </div>
            
            <p className="text-gray-600 mb-4">{problem.description}</p>
            
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-2">
                {problem.solved && (
                  <span className="flex items-center text-green-600 text-sm font-medium">
                    <span className="mr-1">✅</span>
                    Solved
                  </span>
                )}
              </div>
              
              <div className="flex space-x-2">
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-300">
                  {problem.solved ? 'View Solution' : 'Solve Problem'}
                </button>
                <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors duration-300">
                  View Details
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {filteredProblems.length === 0 && (
        <div className="text-center py-12">
          <span className="text-6xl mb-4 block">🔍</span>
          <h3 className="text-xl font-semibold text-gray-600 mb-2">No problems found</h3>
          <p className="text-gray-500">Try adjusting your search or filter criteria.</p>
        </div>
      )}
    </div>
  );
};

export default ProblemList;