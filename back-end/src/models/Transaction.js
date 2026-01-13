const mongoose = require('mongoose');

const transactionItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  barcode: {
    type: String,
    required: true,
  },
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

const transactionSchema = new mongoose.Schema(
  {
    receiptNumber: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
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
    customerName: {
      type: String,
      required: true,
    },
    cashier: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    cashierUid: {
      type: String,
      required: true,
    },
    items: [transactionItemSchema],
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
    tax: {
      type: Number,
      default: 0,
    },
    discount: {
      type: Number,
      default: 0,
    },
    finalAmount: {
      type: Number,
      required: true,
    },
    paymentMethod: {
      type: String,
      enum: ['cash', 'card', 'upi', 'other'],
      default: 'cash',
    },
    paymentStatus: {
      type: String,
      enum: ['completed', 'pending', 'failed', 'refunded'],
      default: 'completed',
    },
    status: {
      type: String,
      enum: ['completed', 'cancelled', 'refunded'],
      default: 'completed',
      index: true,
    },
    // Quota tracking
    quotaUsed: {
      type: Number,
      required: true,
    },
    quotaRemaining: {
      type: Number,
      required: true,
    },
    // Verification
    idVerified: {
      type: Boolean,
      default: false,
    },
    faceVerified: {
      type: Boolean,
      default: false,
    },
    // Audit
    shop: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Shop',
    },
    terminalId: {
      type: String,
    },
    notes: {
      type: String,
      trim: true,
    },
    refundReason: {
      type: String,
      trim: true,
    },
    refundedAt: {
      type: Date,
    },
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
transactionSchema.index({ customer: 1, createdAt: -1 });
transactionSchema.index({ cashier: 1, createdAt: -1 });
transactionSchema.index({ receiptNumber: 1 });
transactionSchema.index({ createdAt: -1 });
transactionSchema.index({ status: 1, createdAt: -1 });

// Virtual for net amount
transactionSchema.virtual('netAmount').get(function () {
  return this.totalAmount - this.discount + this.tax;
});

// Methods
transactionSchema.methods.toJSON = function () {
  const transaction = this.toObject({ virtuals: true });
  delete transaction.__v;
  return transaction;
};

transactionSchema.methods.refund = async function (reason) {
  this.status = 'refunded';
  this.paymentStatus = 'refunded';
  this.refundReason = reason;
  this.refundedAt = new Date();
  await this.save();
  return this;
};

// Static methods
transactionSchema.statics.generateReceiptNumber = async function () {
  const date = new Date();
  const dateStr = date.toISOString().split('T')[0].replace(/-/g, '');
  
  const count = await this.countDocuments({
    createdAt: {
      $gte: new Date(date.setHours(0, 0, 0, 0)),
      $lt: new Date(date.setHours(23, 59, 59, 999)),
    },
  });
  
  const sequence = String(count + 1).padStart(4, '0');
  return `RCP${dateStr}${sequence}`;
};

transactionSchema.statics.findByCustomer = function (customerId) {
  return this.find({ customer: customerId })
    .populate('items.product', 'name category')
    .sort({ createdAt: -1 });
};

transactionSchema.statics.findByReceiptNumber = function (receiptNumber) {
  return this.findOne({ receiptNumber })
    .populate('customer', 'name phoneNumber')
    .populate('cashier', 'name email');
};

transactionSchema.statics.getTodayTransactions = function () {
  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);
  
  return this.find({
    createdAt: { $gte: startOfDay },
    status: 'completed',
  });
};

transactionSchema.statics.getTodaySalesTotal = async function () {
  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);
  
  const result = await this.aggregate([
    {
      $match: {
        createdAt: { $gte: startOfDay },
        status: 'completed',
      },
    },
    {
      $group: {
        _id: null,
        totalSales: { $sum: '$finalAmount' },
        totalVolume: { $sum: '$totalVolume' },
        count: { $sum: 1 },
      },
    },
  ]);
  
  return result[0] || { totalSales: 0, totalVolume: 0, count: 0 };
};

// Pre-save middleware
transactionSchema.pre('save', async function (next) {
  if (this.isNew && !this.receiptNumber) {
    this.receiptNumber = await this.constructor.generateReceiptNumber();
  }
  
  // Calculate final amount
  if (this.isModified('totalAmount') || this.isModified('tax') || this.isModified('discount')) {
    this.finalAmount = this.totalAmount + this.tax - this.discount;
  }
  
  next();
});

const Transaction = mongoose.model('Transaction', transactionSchema);

module.exports = Transaction;