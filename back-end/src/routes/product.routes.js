const express = require('express');
const router = express.Router();
const productController = require('../controllers/product.controller');
const { authenticateFirebase } = require('../middlewares/firebaseAuth');
const { isAdmin } = require('../middlewares/role.middleware');

router.get('/', productController.getAllProducts);
router.get('/:id', productController.getProductById);
router.post('/', authenticateFirebase, isAdmin, productController.createProduct);
router.put('/:id', authenticateFirebase, isAdmin, productController.updateProduct);
router.delete('/:id', authenticateFirebase, isAdmin, productController.deleteProduct);

module.exports = router;