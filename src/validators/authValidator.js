const { body } = require('express-validator');

// Password rules: 8 chars minimum, 1 uppercase, 1 lowercase, 1 number, 1 special
const passwordValidation = body('password')
    .isLength({ min: 8 }).withMessage('Password must be at least 8 characters long')
    .matches(/(?=.*[a-z])/).withMessage('Password must contain a lowercase letter')
    .matches(/(?=.*[A-Z])/).withMessage('Password must contain an uppercase letter')
    .matches(/(?=.*\d)/).withMessage('Password must contain a number')
    .matches(/(?=.*[!@#$%^&*()[\]{}><.,/?'";:|`~])/).withMessage('Password must contain a special character');

exports.registerValidator = [
    body('name').notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Please include a valid email'),
    passwordValidation,
    body('confirmPassword').custom((value, { req }) => {
        if (value !== req.body.password) {
            throw new Error('Passwords do not match');
        }
        return true;
    }),
];

exports.loginValidator = [
    body('email').isEmail().withMessage('Please include a valid email'),
    body('password').notEmpty().withMessage('Password is required'),
];

exports.forgotPasswordValidator = [
    body('email').isEmail().withMessage('Please include a valid email'),
];

exports.resetPasswordValidator = [
    passwordValidation,
];
