const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    barcode: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    category: {
      type: String,
      required: true,
      enum: ['beer', 'wine', 'whiskey', 'vodka', 'rum', 'gin', 'tequila', 'brandy', 'liqueur', 'other'],
      index: true,
    },
    brand: {
      type: String,
      trim: true,
    },
    volume: {
      type: Number,
      required: true,
      min: 0,
    },
    volumeUnit: {
      type: String,
      enum: ['ml', 'L'],
      default: 'L',
    },
    alcoholContent: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    stock: {
      type: Number,
      required: true,
      default: 0,
      min: 0,
    },
    reorderLevel: {
      type: Number,
      default: 10,
    },
    description: {
      type: String,
      trim: true,
    },
    imageUrl: {
      type: String,
    },
    manufacturer: {
      type: String,
      trim: true,
    },
    country: {
      type: String,
      trim: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    tags: [String],
    metadata: {
      type: Map,
      of: String,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
productSchema.index({ name: 'text', description: 'text', brand: 'text' });
productSchema.index({ category: 1, isActive: 1 });
productSchema.index({ price: 1 });
productSchema.index({ stock: 1 });

// Virtual for stock status
productSchema.virtual('stockStatus').get(function () {
  if (this.stock === 0) return 'out_of_stock';
  if (this.stock <= this.reorderLevel) return 'low_stock';
  return 'in_stock';
});

// Methods
productSchema.methods.toJSON = function () {
  const product = this.toObject({ virtuals: true });
  delete product.__v;
  return product;
};

productSchema.methods.updateStock = async function (quantity) {
  this.stock += quantity;
  if (this.stock < 0) {
    throw new Error('Insufficient stock');
  }
  await this.save();
  return this;
};

productSchema.methods.decreaseStock = async function (quantity) {
  if (this.stock < quantity) {
    throw new Error(`Insufficient stock. Available: ${this.stock}, Required: ${quantity}`);
  }
  this.stock -= quantity;
  await this.save();
  return this;
};

// Static methods
productSchema.statics.findByBarcode = function (barcode) {
  return this.findOne({ barcode, isActive: true });
};

productSchema.statics.findByCategory = function (category) {
  return this.find({ category, isActive: true });
};

productSchema.statics.findLowStock = function () {
  return this.find({
    $expr: { $lte: ['$stock', '$reorderLevel'] },
    isActive: true,
  });
};

productSchema.statics.searchProducts = function (searchTerm) {
  return this.find({
    $text: { $search: searchTerm },
    isActive: true,
  }).select('-__v');
};

// Pre-save middleware
productSchema.pre('save', function (next) {
  // Convert volume to liters if in ml
  if (this.volumeUnit === 'ml' && this.isModified('volume')) {
    this.volume = this.volume / 1000;
    this.volumeUnit = 'L';
  }
  next();
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;