/**
 * Formats standard API responses
 * @param {Object} res - Express response object
 * @param {number} statusCode - HTTP status code
 * @param {string} message - Response message
 * @param {Object} [data] - Optional payload data
 * @param {Array} [errors] - Optional error structures
 */
const apiResponse = (res, statusCode, message, data = null, errors = null) => {
    const success = statusCode >= 200 && statusCode < 300;
    
    const responsePayload = {
        success,
        message
    };

    if (data) {
        responsePayload.data = data;
    }

    if (errors && !success) {
        responsePayload.errors = errors;
    }

    return res.status(statusCode).json(responsePayload);
};

module.exports = apiResponse;
