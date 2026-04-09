const User = require('../models/User');
const apiResponse = require('../utils/apiResponse');

exports.getMe = async (req, res, next) => {
    try {
        // req.user is populated by protect middleware
        apiResponse(res, 200, 'User profile fetched successfully', req.user);
    } catch (error) {
        next(error);
    }
};

exports.updateMe = async (req, res, next) => {
    try {
        // Define fields permitted to be updated directly
        const { name, username, phone, bio, avatarUrl } = req.body;
        
        const updateFields = {};
        if (name) updateFields.name = name;
        if (username) updateFields.username = username;
        if (phone) updateFields.phone = phone;
        if (bio) updateFields.bio = bio;
        if (avatarUrl) updateFields.avatarUrl = avatarUrl;
        
        const updatedUser = await User.findByIdAndUpdate(req.user.id, updateFields, {
            new: true,
            runValidators: true,
            select: '-password -isDeleted -isBlocked -role'
        });

        apiResponse(res, 200, 'Profile updated successfully', updatedUser);
    } catch (error) {
        next(error);
    }
};

exports.changePassword = async (req, res, next) => {
    try {
        const { currentPassword, newPassword } = req.body;

        const user = await User.findById(req.user.id).select('+password');

        if (!(await user.matchPassword(currentPassword))) {
            return apiResponse(res, 401, 'Incorrect current password');
        }

        user.password = newPassword;
        await user.save();

        apiResponse(res, 200, 'Password changed successfully. You may need to log in again.');
    } catch (error) {
        next(error);
    }
};

exports.deleteMe = async (req, res, next) => {
    try {
        const user = req.user;
        user.isDeleted = true;
        await user.save();

        apiResponse(res, 200, 'Your account has been deleted successfully.');
    } catch (error) {
        next(error);
    }
};
