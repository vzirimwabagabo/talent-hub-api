const { success } = require('../utils/response');

// A placeholder for fetching real dashboard statistics
exports.getDashboardStats = async (req, res, next) => {

  const { role } = req.user; 

  let stats = {};

  if (role === 'participant') {
    stats = {
      applicationsSubmitted: 5,
      profileViews: 25,
      newMessages: 2,
    };
  } else if (role === 'supporter') {
    stats = {
      jobsPosted: 3,
      applicantsTotal: 45,
      newMessages: 5,
    };
  } else if (role === 'admin') {
    stats = {
      totalUsers: 150,
      totalJobs: 25,
      pendingApprovals: 4,
    };
  }

  success(res, 'Dashboard statistics retrieved successfully', stats);
};