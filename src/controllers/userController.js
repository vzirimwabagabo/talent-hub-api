const userService = require('../services/userService');

// Get all users without sensitive info
exports.getAllUsers = async (req, res, next) => {
  try {
    const users = await userService.getAllUsers();
    res.status(200).json({ success: true, data: users });
  } catch (error) {
    next(error);
  }
};

// Get user by ID
exports.getUserById = async (req, res, next) => {
  try {
    const user = await userService.getUserById(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    res.status(200).json({ success: true, data: user });
  } catch (error) {
    next(error);
  }
};


// Update user (only authorized user or admin)
exports.updateUser = async (req, res, next) => {
  try {
    // Authorization logic to be handled in middleware or here

    const updatedUser = await userService.updateUser(req.params.id, req.body);
    res.status(200).json({ success: true, data: updatedUser });
  } catch (error) {
    next(error);
  }
};

// Delete user (only admin)
exports.deleteUser = async (req, res, next) => {
  try {
    const userId = req.params.id;

    // Validate MongoDB ObjectId
    if (!userId.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ success: false, message: 'Invalid user ID' });
    }

    const deletedUser = await userService.deleteUser(userId);

    if (!deletedUser) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Return JSON so frontend can handle it
    res.status(200).json({ success: true, message: 'User deleted successfully', data: { _id: deletedUser._id, name: deletedUser.name } });
  } catch (error) {
    console.error('Delete user error:', error);
    next(error); // or res.status(500).json({ success: false, message: 'Internal Server Error' })
  }
};

exports.getSuggestedUsers = async (req, res, next) => {
  try {
    const users = await userService.getSuggestedUsers(req.user.id);
    res.status(200).json({ users }); // ✅ matches frontend expectation: { users: [...] }
  } catch (error) {
    next(error);
  }
};
