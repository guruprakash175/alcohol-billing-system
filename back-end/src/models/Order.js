const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  barcode: String,
  quantity: {
    type: Number,
    required: true,
    min: 1,
  },
  volume: {
    type: Number,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  alcoholContent: {
    type: Number,
    required: true,
  },
});

const orderSchema = new mongoose.Schema(
  {
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    customerUid: {
      type: String,
      required: true,
      index: true,
    },
    items: [orderItemSchema],
    totalAmount: {
      type: Number,
      required: true,
      min: 0,
    },
    totalVolume: {
      type: Number,
      required: true,
      min: 0,
    },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'processing', 'completed', 'cancelled'],
      default: 'pending',
      index: true,
    },
    paymentStatus: {
      type: String,
      enum: ['pending', 'paid', 'failed', 'refunded'],
      default: 'pending',
    },
    deliveryInfo: {
      address: String,
      city: String,
      state: String,
      zipCode: String,
      phone: String,
      notes: String,
    },
    notes: {
      type: String,
      trim: true,
    },
    cancelReason: {
      type: String,
      trim: true,
    },
    cancelledAt: {
      type: Date,
    },
    completedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
orderSchema.index({ customer: 1, createdAt: -1 });
orderSchema.index({ status: 1, createdAt: -1 });
orderSchema.index({ customerUid: 1, createdAt: -1 });

// Methods
orderSchema.methods.toJSON = function () {
  const order = this.toObject();
  delete order.__v;
  return order;
};

orderSchema.methods.cancel = async function (reason) {
  this.status = 'cancelled';
  this.cancelReason = reason;
  this.cancelledAt = new Date();
  await this.save();
  return this;
};

orderSchema.methods.complete = async function () {
  this.status = 'completed';
  this.completedAt = new Date();
  await this.save();
  return this;
};

orderSchema.methods.updateStatus = async function (newStatus) {
  this.status = newStatus;
  if (newStatus === 'completed') {
    this.completedAt = new Date();
  }
  await this.save();
  return this;
};

// Static methods
orderSchema.statics.findByCustomer = function (customerId) {
  return this.find({ customer: customerId })
    .populate('items.product', 'name category')
    .sort({ createdAt: -1 });
};

orderSchema.statics.findByCustomerUid = function (customerUid) {
  return this.find({ customerUid })
    .populate('items.product', 'name category')
    .sort({ createdAt: -1 });
};

orderSchema.statics.findByStatus = function (status) {
  return this.find({ status })
    .populate('customer', 'name phoneNumber email')
    .sort({ createdAt: -1 });
};

orderSchema.statics.getTodayOrders = function () {
  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);
  
  return this.find({
    createdAt: { $gte: startOfDay },
  });
};

// Pre-save middleware
orderSchema.pre('save', function (next) {
  // Calculate totals if items changed
  if (this.isModified('items')) {
    this.totalAmount = this.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    this.totalVolume = this.items.reduce((sum, item) => sum + item.volume * item.quantity, 0);
  }
  next();
});

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;