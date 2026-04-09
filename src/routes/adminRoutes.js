const express = require('express');
const router = express.Router();

const { getUsers, getUserById, blockUser, unblockUser, deleteUser } = require('../controllers/adminController');
const { checkIdParamValidator } = require('../validators/adminValidator');
const validateResults = require('../middleware/validateMiddleware');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

// All admin routes require authentication and "admin" role
router.use(protect);
router.use(authorize('admin'));

router.get('/users', getUsers);
router.get('/users/:id', checkIdParamValidator, validateResults, getUserById);
router.patch('/users/:id/block', checkIdParamValidator, validateResults, blockUser);
router.patch('/users/:id/unblock', checkIdParamValidator, validateResults, unblockUser);
router.delete('/users/:id', checkIdParamValidator, validateResults, deleteUser);

module.exports = router;
