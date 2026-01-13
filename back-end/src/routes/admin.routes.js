const express = require('express');
const router = express.Router();
const adminController = require('../controllers/admin.controller');
const { authenticateFirebase } = require('../middlewares/firebaseAuth');
const { isAdmin } = require('../middlewares/role.middleware');

router.use(authenticateFirebase, isAdmin);

router.get('/dashboard/stats', adminController.getDashboardStats);
router.get('/users', adminController.getUsers);
router.get('/transactions', adminController.getTransactions);

module.exports = router;