const generateRandomString = (length = 10) => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

const calculatePoints = (difficulty) => {
  const points = {
    easy: 100,
    medium: 200,
    hard: 300
  };
  return points[difficulty] || 100;
};

const formatDuration = (minutes) => {
  if (minutes < 60) {
    return `${minutes} minutes`;
  }
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  return `${hours}h ${remainingMinutes}m`;
};

const getContestStatus = (contest) => {
  const now = new Date();
  const startTime = new Date(contest.start_time);
  const endTime = new Date(contest.end_time);

  if (now < startTime) {
    return 'upcoming';
  } else if (now >= startTime && now <= endTime) {
    return 'ongoing';
  } else {
    return 'finished';
  }
};

const calculateAccuracy = (solved, attempted) => {
  if (attempted === 0) return 0;
  return ((solved / attempted) * 100).toFixed(2);
};

module.exports = {
  generateRandomString,
  calculatePoints,
  formatDuration,
  getContestStatus,
  calculateAccuracy
};