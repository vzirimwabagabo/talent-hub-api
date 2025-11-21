// src/middlewares/index.js

const { protect, adminOnly } = require('./authMiddleware'); 


// 2. Define the authorize middleware
const authorize = (...roles) => (req, res, next) => {
    // Check if the user role is included in the authorized roles list
    if (!req.user || !roles.includes(req.user.role)) {
        return res.status(403).json({ 
            success: false, 
            message: `User role (${req.user ? req.user.role : 'none'}) is not authorized to access this route.` 
        });
    }
    next();
};

// 3. Export all required middlewares so userRoutes.js can find them
module.exports = {
    protect,
    authorize,
    adminOnly
};