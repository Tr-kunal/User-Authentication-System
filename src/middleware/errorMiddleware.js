const apiResponse = require('../utils/apiResponse');

/**
 * Global API response error boundary
 */
// eslint-disable-next-line no-unused-vars
const errorHandler = (err, req, res, next) => {
    let statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    let message = err.message || 'Internal Server Error';

    // Mongoose bad ObjectId
    if (err.name === 'CastError' && err.kind === 'ObjectId') {
        statusCode = 404;
        message = 'Resource not found or invalid format';
    }

    // Mongoose duplicate key
    if (err.code === 11000) {
        statusCode = 400;
        const field = Object.keys(err.keyValue || {});
        message = `Duplicate field value entered: ${field.join(', ')}`;
    }

    // JWT Errors
    if (err.name === 'JsonWebTokenError') {
        statusCode = 401;
        message = 'Not authorized, token failed';
    }
    
    if (err.name === 'TokenExpiredError') {
        statusCode = 401;
        message = 'Not authorized, token expired';
    }

    res.status(statusCode);
    apiResponse(res, statusCode, message, null, process.env.NODE_ENV === 'production' ? null : [{ stack: err.stack }]);
};

module.exports = { errorHandler };
