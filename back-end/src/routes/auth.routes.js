const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const { authenticateFirebase } = require('../middlewares/firebaseAuth');
const { authLimiter } = require('../middlewares/rateLimiter');

router.post('/sync-user', authLimiter, authController.syncUser);
router.post('/verify-token', authenticateFirebase, authController.verifyToken);

module.exports = router;