const apiResponse = require('../utils/apiResponse');

/**
 * Role based access control checker. Use after protect middleware.
 * @param  {...string} roles - array of roles permitted to access endpoint
 */
const authorize = (...roles) => {
    return (req, res, next) => {
        if (!req.user || !roles.includes(req.user.role)) {
            return apiResponse(res, 403, `User role ${req.user ? req.user.role : 'Unknown'} is not authorized to access this route`);
        }
        next();
    };
};

module.exports = { authorize };
