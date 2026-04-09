const express = require('express');
const router = express.Router();

const { getMe, updateMe, changePassword, deleteMe } = require('../controllers/userController');
const { updateProfileValidator, changePasswordValidator } = require('../validators/userValidator');
const validateResults = require('../middleware/validateMiddleware');
const { protect } = require('../middleware/authMiddleware');

// All profile routes require authentication
router.use(protect);

router.get('/me', getMe);
router.put('/me', updateProfileValidator, validateResults, updateMe);
router.patch('/change-password', changePasswordValidator, validateResults, changePassword);
router.delete('/me', deleteMe);

module.exports = router;
