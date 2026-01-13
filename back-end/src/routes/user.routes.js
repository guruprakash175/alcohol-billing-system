const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const { authenticateFirebase } = require('../middlewares/firebaseAuth');

router.get('/profile', authenticateFirebase, userController.getProfile);
router.put('/profile', authenticateFirebase, userController.updateProfile);
router.get('/quota', authenticateFirebase, userController.getQuota);
router.get('/history', authenticateFirebase, userController.getHistory);

module.exports = router;