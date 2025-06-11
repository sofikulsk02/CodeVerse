import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { problemService } from '../services/problemService';
import { 
  ArrowLeft, 
  Play, 
  Save, 
  Clock, 
  Award, 
  CheckCircle,
  XCircle,
  Code2,
  Send
} from 'lucide-react';
import toast from 'react-hot-toast';

export default function ProblemDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [problem, setProblem] = useState(null);
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState('javascript');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProblem();
    loadSubmissions();
  }, [id]);

  const loadProblem = async () => {
    try {
      const data = await problemService.getProblemById(id);
      setProblem(data.problem);
      setCode(getStarterCode(language));
    } catch (error) {
      toast.error('Failed to load problem');
      navigate('/problems');
    } finally {
      setLoading(false);
    }
  };

  const loadSubmissions = async () => {
    try {
      const data = await problemService.getSubmissions(id);
      setSubmissions(data.submissions || []);
    } catch (error) {
      console.error('Failed to load submissions:', error);
    }
  };

  const getStarterCode = (lang) => {
    const starters = {
      javascript: `function solution(input) {
    // Your code here
    return result;
}`,
      python: `def solution(input):
    # Your code here
    return result`,
      java: `public class Solution {
    public static String solution(String input) {
        // Your code here
        return result;
    }
}`,
      cpp: `#include <iostream>
#include <string>
using namespace std;

string solution(string input) {
    // Your code here
    return result;
}`
    };
    return starters[lang] || starters.javascript;
  };

  const handleLanguageChange = (newLang) => {
    setLanguage(newLang);
    setCode(getStarterCode(newLang));
  };

  const handleSubmit = async () => {
    if (!code.trim()) {
      toast.error('Please write some code before submitting');
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await problemService.submitSolution(id, code, language);
      toast.success('Solution submitted successfully!');
      
      // Add submission to list
      setSubmissions(prev => [result.submission, ...prev]);
      
      // Optionally navigate to submissions or show result
      if (result.submission.status === 'Accepted') {
        toast.success('🎉 Congratulations! Your solution is correct!');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Submission failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getDifficultyColor = (difficulty) => {
    const colors = {
      'Easy': 'text-green-600 bg-green-50 border-green-200',
      'Medium': 'text-orange-600 bg-orange-50 border-orange-200',
      'Hard': 'text-red-600 bg-red-50 border-red-200'
    };
    return colors[difficulty] || 'text-gray-600 bg-gray-50 border-gray-200';
  };

  const getStatusColor = (status) => {
    const colors = {
      'Accepted': 'text-green-600 bg-green-50',
      'Wrong Answer': 'text-red-600 bg-red-50',
      'Time Limit Exceeded': 'text-orange-600 bg-orange-50',
      'Runtime Error': 'text-purple-600 bg-purple-50',
      'Pending': 'text-blue-600 bg-blue-50'
    };
    return colors[status] || 'text-gray-600 bg-gray-50';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="loading-spinner w-8 h-8 mx-auto mb-4 text-white"></div>
          <p className="text-white">Loading problem...</p>
        </div>
      </div>
    );
  }

  if (!problem) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Problem not found</h2>
          <button 
            onClick={() => navigate('/problems')}
            className="btn-primary"
          >
            Back to Problems
          </button>
        </div>
      </div>
    );
  }

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
      </div>

      <div className="relative z-10">
        {/* Header */}
        <div className="bg-white/10 backdrop-blur-md border-b border-white/20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between py-4">
              <div className="flex items-center space-x-4">
                <motion.button
                  onClick={() => navigate('/problems')}
                  className="btn-ghost"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back
                </motion.button>
                <div>
                  <h1 className="text-xl font-bold text-white">{problem.title}</h1>
                  <div className="flex items-center space-x-4 mt-1">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getDifficultyColor(problem.difficulty)}`}>
                      {problem.difficulty}
                    </span>
                    <span className="text-blue-100 text-sm flex items-center">
                      <Award className="w-4 h-4 mr-1" />
                      {problem.points || 100} points
                    </span>
                    <span className="text-blue-100 text-sm flex items-center">
                      <Clock className="w-4 h-4 mr-1" />
                      {problem.timeLimit || '2s'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Problem Description */}
            <motion.div 
              className="space-y-6"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className="card">
                <div className="card-header">
                  <h2 className="text-xl font-semibold">Problem Description</h2>
                </div>
                <div className="card-content">
                  <div className="prose max-w-none">
                    <p className="text-gray-700 whitespace-pre-line">
                      {problem.description}
                    </p>
                  </div>
                </div>
              </div>

              {/* Examples */}
              {problem.examples && problem.examples.length > 0 && (
                <div className="card">
                  <div className="card-header">
                    <h3 className="text-lg font-semibold">Examples</h3>
                  </div>
                  <div className="card-content space-y-4">
                    {problem.examples.map((example, index) => (
                      <div key={index} className="bg-gray-50 rounded-lg p-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <h4 className="font-medium text-sm text-gray-600 mb-2">Input:</h4>
                            <pre className="bg-white p-2 rounded border text-sm font-mono">
                              {example.input}
                            </pre>
                          </div>
                          <div>
                            <h4 className="font-medium text-sm text-gray-600 mb-2">Output:</h4>
                            <pre className="bg-white p-2 rounded border text-sm font-mono">
                              {example.output}
                            </pre>
                          </div>
                        </div>
                        {example.explanation && (
                          <div className="mt-3">
                            <h4 className="font-medium text-sm text-gray-600 mb-1">Explanation:</h4>
                            <p className="text-sm text-gray-700">{example.explanation}</p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Recent Submissions */}
              <div className="card">
                <div className="card-header">
                  <h3 className="text-lg font-semibold">Your Submissions</h3>
                </div>
                <div className="card-content">
                  {submissions.length > 0 ? (
                    <div className="space-y-2">
                      {submissions.slice(0, 5).map((submission, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-center space-x-3">
                            {submission.status === 'Accepted' ? (
                              <CheckCircle className="w-5 h-5 text-green-600" />
                            ) : (
                              <XCircle className="w-5 h-5 text-red-600" />
                            )}
                            <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(submission.status)}`}>
                              {submission.status}
                            </span>
                            <span className="text-sm text-gray-600">{submission.language}</span>
                          </div>
                          <span className="text-sm text-gray-500">
                            {new Date(submission.createdAt).toLocaleTimeString()}
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 text-center py-4">No submissions yet</p>
                  )}
                </div>
              </div>
            </motion.div>

            {/* Code Editor */}
            <motion.div 
              className="space-y-6"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              <div className="card">
                <div className="card-header">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold">Code Editor</h3>
                    <select
                      value={language}
                      onChange={(e) => handleLanguageChange(e.target.value)}
                      className="bg-gray-100 border border-gray-300 rounded px-3 py-1 text-sm"
                    >
                      <option value="javascript">JavaScript</option>
                      <option value="python">Python</option>
                      <option value="java">Java</option>
                      <option value="cpp">C++</option>
                    </select>
                  </div>
                </div>
                <div className="card-content">
                  <textarea
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    className="w-full h-96 p-4 border border-gray-300 rounded-lg font-mono text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Write your solution here..."
                  />
                </div>
                <div className="card-footer justify-end space-x-3">
                  <motion.button
                    className="btn-ghost"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Save className="w-4 h-4 mr-2" />
                    Save
                  </motion.button>
                  <motion.button
                    className="btn-outline"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Play className="w-4 h-4 mr-2" />
                    Test
                  </motion.button>
                  <motion.button
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    className="btn-primary"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {isSubmitting ? (
                      <div className="flex items-center">
                        <div className="loading-spinner mr-2"></div>
                        Submitting...
                      </div>
                    ) : (
                      <div className="flex items-center">
                        <Send className="w-4 h-4 mr-2" />
                        Submit
                      </div>
                    )}
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}