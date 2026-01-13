const Product = require('../models/Product');
const { sendSuccess, sendCreated, sendNotFound, sendBadRequest } = require('../utils/response');
const logger = require('../utils/logger');

exports.getAllProducts = async (req, res) => {
  try {
    const { category, inStock, search } = req.query;
    
    let query = { isActive: true };
    
    if (category) query.category = category;
    if (inStock === 'true') query.stock = { $gt: 0 };
    
    let products;
    if (search) {
      products = await Product.searchProducts(search);
    } else {
      products = await Product.find(query).sort({ name: 1 });
    }
    
    return sendSuccess(res, { products, count: products.length });
  } catch (error) {
    logger.error('Get products error:', error);
    return sendBadRequest(res, error.message);
  }
};

exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return sendNotFound(res, 'Product not found');
    }
    return sendSuccess(res, { product });
  } catch (error) {
    logger.error('Get product error:', error);
    return sendBadRequest(res, error.message);
  }
};

exports.createProduct = async (req, res) => {
  try {
    const product = await Product.create(req.body);
    logger.info(`Product created: ${product._id}`);
    return sendCreated(res, { product });
  } catch (error) {
    logger.error('Create product error:', error);
    return sendBadRequest(res, error.message);
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!product) {
      return sendNotFound(res, 'Product not found');
    }
    return sendSuccess(res, { product }, 'Product updated');
  } catch (error) {
    logger.error('Update product error:', error);
    return sendBadRequest(res, error.message);
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    );
    if (!product) {
      return sendNotFound(res, 'Product not found');
    }
    return sendSuccess(res, { product }, 'Product deleted');
  } catch (error) {
    logger.error('Delete product error:', error);
    return sendBadRequest(res, error.message);
  }
};