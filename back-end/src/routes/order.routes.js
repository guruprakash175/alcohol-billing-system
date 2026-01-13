const express = require('express');
const router = express.Router();
const orderController = require('../controllers/order.controller');
const { authenticateFirebase } = require('../middlewares/firebaseAuth');
const { isCustomer } = require('../middlewares/role.middleware');
const { validateOrderQuota, checkQuotaAvailability } = require('../middlewares/quota.middleware');

router.post('/', 
  authenticateFirebase, 
  isCustomer, 
  validateOrderQuota,
  checkQuotaAvailability,
  orderController.createOrder
);

router.get('/my-orders', authenticateFirebase, isCustomer, orderController.getMyOrders);
router.get('/:id', authenticateFirebase, isCustomer, orderController.getOrderById);
router.put('/:id/cancel', authenticateFirebase, isCustomer, orderController.cancelOrder);

module.exports = router;