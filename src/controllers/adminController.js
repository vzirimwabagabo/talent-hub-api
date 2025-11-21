const {
  getUserCount,
  getTotalDonationsAmount,
  getMostActiveTalents,
  getMostActiveVolunteers,
  getUnreadMessagesCount,
  getStatistics
} = require('../services/adminService');

const User = require('../models/User');

// Return aggregated platform statistics for admin analytics/dashboard
exports.getAdminStats = async (req, res, next) => {
  try {
    const stats = await getStatistics();
    res.status(200).json({ success: true, stats });
  } catch (error) {
    console.error('Error fetching admin stats:', error);
    next(error);
  }
};

// Get key analytics data for admin dashboard overview
exports.getAnalytics = async (req, res, next) => {
  try {
    const totalUsers = await getUserCount();
    const totalDonations = await getTotalDonationsAmount();
    const mostActiveTalents = await getMostActiveTalents();
    const mostActiveVolunteers = await getMostActiveVolunteers();
    const unreadMessages = await getUnreadMessagesCount();

    res.status(200).json({
      success: true,
      data: {
        totalUsers,
        totalDonations,
        mostActiveTalents,
        mostActiveVolunteers,
        unreadMessages
      }
    });
  } catch (error) {
    console.error('Error fetching analytics:', error);
    next(error);
  }
};

// Retrieve all users excluding sensitive fields and excluding current logged-in user
exports.getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find({ _id: { $ne: req.user.id } })
      .select('-password -resetPasswordToken -resetPasswordExpires')
      .lean();

    res.status(200).json({ success: true, users });
  } catch (error) {
    console.error('Error fetching all users:', error);
    next(error);
  }
};

// Retrieve dashboard stats customized by user role
exports.getDashboardStats = async (req, res, next) => {
  try {
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

    res.status(200).json({ success: true, stats });
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    next(error);
  }
};

// Update user data (name, email, role) with strict allowed fields
exports.updateUser = async (req, res, next) => {
  try {
    // Allowed fields to update
    const allowedUpdates = ['name', 'email', 'role', 'supporterType'];
    const updates = {};

    for (const key of allowedUpdates) {
      if (req.body[key] !== undefined) {
        updates[key] = req.body[key];
      }
    }

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({ 
        success: false, 
        message: "No valid fields provided to update." 
      });
    }

    console.log("User ID to update:", req.params.id);
    console.log("Updates being applied:", updates);

    // Use findByIdAndUpdate with options
    const user = await User.findByIdAndUpdate(req.params.id, updates, {
      new: true,          // return the updated document
      runValidators: true // ensure schema validations are enforced
    }).select('-password -resetPasswordToken -resetPasswordExpires');

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    console.log("User updated successfully:", user);

    res.status(200).json({ success: true, user });
  } catch (error) {
    console.error('Error updating user:', error);
    next(error);
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    res.status(200).json({ success: true, message: 'User deleted successfully', user });
  } catch (err) {
    console.error(err); // <-- important for debugging
    res.status(500).json({ success: false, message: 'Server error' });
  }
};