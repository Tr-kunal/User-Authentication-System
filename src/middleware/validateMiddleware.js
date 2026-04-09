const { validationResult } = require('express-validator');
const apiResponse = require('../utils/apiResponse');

/**
 * Middleware that runs after express-validator rules.
 * Extracts and formats validation errors if any exist.
 */
const validateResults = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const extractedErrors = errors.array().map(err => ({ [err.path]: err.msg }));
        return apiResponse(res, 400, 'Validation Error', null, extractedErrors);
    }
    next();
};

module.exports = validateResults;
