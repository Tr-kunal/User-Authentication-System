const crypto = require('crypto');
const User = require('../models/User');
const apiResponse = require('../utils/apiResponse');
const generateToken = require('../utils/generateToken');
const generateResetToken = require('../utils/generateResetToken');
const sendEmail = require('../utils/sendEmail');

exports.register = async (req, res, next) => {
    try {
        const { name, email, password, username, phone, bio, avatarUrl } = req.body;

        // Check if user already exists
        const userExists = await User.findOne({ email });
        if (userExists) {
            return apiResponse(res, 400, 'User already exists with this email');
        }

        const user = await User.create({
            name,
            email,
            password,
            username,
            phone,
            bio,
            avatarUrl
        });

        if (user) {
            const token = generateToken(user._id);
            return apiResponse(res, 201, 'User registered successfully', {
                user: { id: user._id, name: user.name, email: user.email, role: user.role },
                token
            });
        }
    } catch (error) {
        next(error);
    }
};

exports.login = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email }).select('+password');
        if (!user) {
            return apiResponse(res, 401, 'Invalid credentials');
        }

        if (user.isBlocked) {
            return apiResponse(res, 403, 'Your account has been blocked');
        }
        if (user.isDeleted) {
            return apiResponse(res, 403, 'Account is disabled. Please contact support.');
        }

        const isMatch = await user.matchPassword(password);
        if (!isMatch) {
            return apiResponse(res, 401, 'Invalid credentials');
        }

        user.lastLogin = Date.now();
        await user.save();

        const token = generateToken(user._id);

        apiResponse(res, 200, 'Login successful', {
            user: { id: user._id, name: user.name, email: user.email, role: user.role },
            token
        });
    } catch (error) {
        next(error);
    }
};

exports.logout = async (req, res, next) => {
    try {
        // Since we are using standard JWT, the client destroys the token on their end.
        // For a more advanced setup, this endpoint could append the token to a Redis blacklist.
        apiResponse(res, 200, 'Logged out successfully. Please discard the token on client side.');
    } catch (error) {
        next(error);
    }
};

exports.forgotPassword = async (req, res, next) => {
    try {
        const user = await User.findOne({ email: req.body.email });
        if (!user) {
            return apiResponse(res, 404, 'There is no user with that email');
        }

        const { resetToken, hashedResetToken } = generateResetToken();

        user.passwordResetToken = hashedResetToken;
        user.passwordResetExpires = Date.now() + 10 * 60 * 1000; // 10 Minutes
        await user.save({ validateBeforeSave: false });

        const resetUrl = `${process.env.CLIENT_URL || `http://localhost:${process.env.PORT || 5000}`}/reset-password/${resetToken}`;

        const message = `You are receiving this email because you requested a password reset.\n\nPlease make a POST request to: \n\n ${resetUrl}`;

        try {
            await sendEmail({
                email: user.email,
                subject: 'Password Reset Request',
                message
            });
            apiResponse(res, 200, 'Password reset email sent');
        } catch (error) {
            user.passwordResetToken = undefined;
            user.passwordResetExpires = undefined;
            await user.save({ validateBeforeSave: false });
            return apiResponse(res, 500, 'There was an error sending the email. Try again later');
        }
    } catch (error) {
        next(error);
    }
};

exports.resetPassword = async (req, res, next) => {
    try {
        const hashedResetToken = crypto
            .createHash('sha256')
            .update(req.params.token)
            .digest('hex');

        const user = await User.findOne({
            passwordResetToken: hashedResetToken,
            passwordResetExpires: { $gt: Date.now() }
        });

        if (!user) {
            return apiResponse(res, 400, 'Token is invalid or has expired');
        }

        user.password = req.body.password;
        user.passwordResetToken = undefined;
        user.passwordResetExpires = undefined;
        await user.save();

        apiResponse(res, 200, 'Password reset successful. You may now login.');
    } catch (error) {
        next(error);
    }
};
