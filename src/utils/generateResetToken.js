const crypto = require('crypto');

const generateResetToken = () => {
    // Generate a random raw token
    const resetToken = crypto.randomBytes(32).toString('hex');
    
    // Hash it for DB storage
    const hashedResetToken = crypto
        .createHash('sha256')
        .update(resetToken)
        .digest('hex');

    return { resetToken, hashedResetToken };
};

module.exports = generateResetToken;
