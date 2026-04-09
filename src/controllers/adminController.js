const User = require('../models/User');
const apiResponse = require('../utils/apiResponse');

exports.getUsers = async (req, res, next) => {
    try {
        const users = await User.find({}).select('-password');
        apiResponse(res, 200, 'All users fetched successfully', users);
    } catch (error) {
        next(error);
    }
};

exports.getUserById = async (req, res, next) => {
    try {
        const user = await User.findById(req.params.id).select('-password');
        
        if (!user) {
            return apiResponse(res, 404, 'User not found');
        }
        
        apiResponse(res, 200, 'User fetched successfully', user);
    } catch (error) {
        next(error);
    }
};

exports.blockUser = async (req, res, next) => {
    try {
        const user = await User.findById(req.params.id);
        
        if (!user) {
            return apiResponse(res, 404, 'User not found');
        }

        user.isBlocked = true;
        await user.save();

        apiResponse(res, 200, 'User blocked successfully', { id: user._id, isBlocked: user.isBlocked });
    } catch (error) {
        next(error);
    }
};

exports.unblockUser = async (req, res, next) => {
    try {
        const user = await User.findById(req.params.id);
        
        if (!user) {
            return apiResponse(res, 404, 'User not found');
        }

        user.isBlocked = false;
        await user.save();

        apiResponse(res, 200, 'User unblocked successfully', { id: user._id, isBlocked: user.isBlocked });
    } catch (error) {
        next(error);
    }
};

exports.deleteUser = async (req, res, next) => {
    try {
        const user = await User.findById(req.params.id);
        
        if (!user) {
            return apiResponse(res, 404, 'User not found');
        }

        user.isDeleted = true;
        await user.save();

        apiResponse(res, 200, 'User successfully soft-deleted', { id: user._id, isDeleted: user.isDeleted });
    } catch (error) {
        next(error);
    }
};
