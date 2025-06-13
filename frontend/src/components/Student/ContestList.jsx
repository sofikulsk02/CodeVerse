import React, { useState } from 'react';

const ContestList = () => {
  const [contests] = useState([
    {
      id: 1,
      title: "Weekly Challenge #45",
      description: "Test your algorithmic skills with a mix of easy to medium problems.",
      startTime: "2024-06-15T10:00:00",
      endTime: "2024-06-15T12:00:00",
      duration: "2 hours",
      participants: 234,
      problems: 4,
      status: "upcoming",
      difficulty: "Mixed"
    },
    {
      id: 2,
      title: "Data Structures Marathon",
      description: "Deep dive into arrays, linked lists, stacks, and queues.",
      startTime: "2024-06-12T09:00:00",
      endTime: "2024-06-12T12:00:00",
      duration: "3 hours",
      participants: 156,
      problems: 6,
      status: "completed",
      difficulty: "Medium",
      rank: 23,
      score: 450
    },
    {
      id: 3,
      title: "Beginner's Cup",
      description: "Perfect for newcomers to competitive programming.",
      startTime: "2024-06-20T14:00:00",
      endTime: "2024-06-20T16:00:00",
      duration: "2 hours",
      participants: 89,
      problems: 3,
      status: "upcoming",
      difficulty: "Easy"
    },
    {
      id: 4,
      title: "Advanced Algorithms Challenge",
      description: "Complex problems requiring advanced algorithmic knowledge.",
      startTime: "2024-06-18T15:00:00",
      endTime: "2024-06-18T18:00:00",
      duration: "3 hours",
      participants: 67,
      problems: 5,
      status: "live",
      difficulty: "Hard"
    }
  ]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'upcoming':
        return 'bg-blue-100 text-blue-800';
      case 'live':
        return 'bg-green-100 text-green-800';
      case 'completed':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty.toLowerCase()) {
      case 'easy':
        return 'bg-green-100 text-green-800';
      case 'medium':
      case 'mixed':
        return 'bg-yellow-100 text-yellow-800';
      case 'hard':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDateTime = (dateTime) => {
    const date = new Date(dateTime);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
  };

  const getActionButton = (contest) => {
    switch (contest.status) {
      case 'upcoming':
        return (
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-300">
            Register
          </button>
        );
      case 'live':
        return (
          <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-300 animate-pulse">
            Join Now
          </button>
        );
      case 'completed':
        return (
          <button className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors duration-300">
            View Results
          </button>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Contests</h2>
        <div className="flex space-x-2">
          <button className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg font-medium">
            All
          </button>
          <button className="px-4 py-2 bg-gray-100 text-gray-600 rounded-lg font-medium hover:bg-gray-200 transition-colors duration-300">
            Upcoming
          </button>
          <button className="px-4 py-2 bg-gray-100 text-gray-600 rounded-lg font-medium hover:bg-gray-200 transition-colors duration-300">
            Completed
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {contests.map((contest) => (
          <div
            key={contest.id}
            className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-300"
          >
            <div className="flex justify-between items-start mb-4">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <h3 className="text-xl font-semibold text-gray-800">{contest.title}</h3>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(contest.status)}`}>
                    {contest.status.charAt(0).toUpperCase() + contest.status.slice(1)}
                  </span>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getDifficultyColor(contest.difficulty)}`}>
                    {contest.difficulty}
                  </span>
                </div>
                <p className="text-gray-600 mb-3">{contest.description}</p>
              </div>
              
              <div className="ml-6">
                {getActionButton(contest)}
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
              <div className="bg-gray-50 p-3 rounded-lg">
                <div className="text-sm text-gray-500">Start Time</div>
                <div className="font-medium text-gray-800">{formatDateTime(contest.startTime)}</div>
              </div>
              
              <div className="bg-gray-50 p-3 rounded-lg">
                <div className="text-sm text-gray-500">Duration</div>
                <div className="font-medium text-gray-800">{contest.duration}</div>
              </div>
              
              <div className="bg-gray-50 p-3 rounded-lg">
                <div className="text-sm text-gray-500">Participants</div>
                <div className="font-medium text-gray-800">{contest.participants}</div>
              </div>
              
              <div className="bg-gray-50 p-3 rounded-lg">
                <div className="text-sm text-gray-500">Problems</div>
                <div className="font-medium text-gray-800">{contest.problems}</div>
              </div>
            </div>

            {contest.status === 'completed' && contest.rank && (
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <div className="flex justify-between items-center">
                  <div>
                    <span className="text-sm text-blue-600 font-medium">Your Performance</span>
                  </div>
                  <div className="flex space-x-6">
                    <div className="text-right">
                      <div className="text-sm text-blue-600">Rank</div>
                      <div className="font-bold text-blue-800">#{contest.rank}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-blue-600">Score</div>
                      <div className="font-bold text-blue-800">{contest.score}</div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ContestList;