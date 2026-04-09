const jwt = require('jsonwebtoken');
const User = require('../models/User');
const apiResponse = require('../utils/apiResponse');

const protect = async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1];

            // Verify
            const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret_do_not_use_in_prod');

            // Attach user to req, barring password
            req.user = await User.findById(decoded.id).select('-password');
            
            if (!req.user) {
                return apiResponse(res, 401, 'User associated with token no longer exists.');
            }

            if (req.user.isBlocked) {
                return apiResponse(res, 403, 'User account is blocked.');
            }

            next();
        } catch (error) {
            console.error(error);
            return apiResponse(res, 401, 'Not authorized, token failed');
        }
    } else {
        return apiResponse(res, 401, 'Not authorized, no token provided');
    }
};

module.exports = { protect };
