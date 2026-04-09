const { body } = require('express-validator');

exports.updateProfileValidator = [
    body('name').optional().notEmpty().withMessage('Name cannot be empty'),
    body('email').optional().isEmail().withMessage('Provide a valid email'),
    body('username').optional().isString().withMessage('Username must be a string'),
    body('phone').optional().isString().withMessage('Phone must be a string'),
];

const passwordValidation = body('newPassword')
    .isLength({ min: 8 }).withMessage('Password must be at least 8 characters long')
    .matches(/(?=.*[a-z])/).withMessage('Password must contain a lowercase letter')
    .matches(/(?=.*[A-Z])/).withMessage('Password must contain an uppercase letter')
    .matches(/(?=.*\d)/).withMessage('Password must contain a number')
    .matches(/(?=.*[!@#$%^&*()[\]{}><.,/?'";:|`~])/).withMessage('Password must contain a special character');

exports.changePasswordValidator = [
    body('currentPassword').notEmpty().withMessage('Current password is required'),
    passwordValidation,
    body('confirmNewPassword').custom((value, { req }) => {
        if (value !== req.body.newPassword) {
            throw new Error('New passwords do not match');
        }
        return true;
    })
];
