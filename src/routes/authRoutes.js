const express = require('express');
const router = express.Router();

const { register, login, logout, forgotPassword, resetPassword } = require('../controllers/authController');
const { registerValidator, loginValidator, forgotPasswordValidator, resetPasswordValidator } = require('../validators/authValidator');
const validateResults = require('../middleware/validateMiddleware');

router.post('/register', registerValidator, validateResults, register);
router.post('/login', loginValidator, validateResults, login);
router.post('/logout', logout);
router.post('/forgot-password', forgotPasswordValidator, validateResults, forgotPassword);
router.post('/reset-password/:token', resetPasswordValidator, validateResults, resetPassword);

module.exports = router;
