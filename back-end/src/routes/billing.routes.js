const express = require('express');
const router = express.Router();
const billingController = require('../controllers/billing.controller');
const { authenticateFirebase } = require('../middlewares/firebaseAuth');
const { isCashierOrAdmin } = require('../middlewares/role.middleware');
const { checkQuotaAvailability } = require('../middlewares/quota.middleware');
const { billingLimiter } = require('../middlewares/rateLimiter');

router.post('/transaction',
  authenticateFirebase,
  isCashierOrAdmin,
  billingLimiter,
  checkQuotaAvailability,
  billingController.createTransaction
);

router.get('/verify-customer/:customerId', authenticateFirebase, isCashierOrAdmin, billingController.verifyCustomer);
router.get('/check-quota/:customerId', authenticateFirebase, isCashierOrAdmin, billingController.checkQuota);
router.get('/scan/:barcode', authenticateFirebase, isCashierOrAdmin, billingController.scanProduct);

module.exports = router;