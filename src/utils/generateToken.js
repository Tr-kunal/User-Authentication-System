const jwt = require('jsonwebtoken');

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET || 'fallback_secret_do_not_use_in_prod', {
        expiresIn: process.env.JWT_EXPIRES_IN || '1d',
    });
};

module.exports = generateToken;
