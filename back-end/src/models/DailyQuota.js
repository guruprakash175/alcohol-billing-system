const mongoose = require('mongoose');

const dailyQuotaSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    userUid: {
      type: String,
      required: true,
      index: true,
    },
    date: {
      type: Date,
      required: true,
      index: true,
    },
    limit: {
      type: Number,
      required: true,
      default: 1, // 1 liter per day
    },
    consumed: {
      type: Number,
      required: true,
      default: 0,
      min: 0,
    },
    transactions: [
      {
        transaction: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Transaction',
        },
        volume: Number,
        timestamp: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    lastReset: {
      type: Date,
      default: Date.now,
    },
    warnings: [
      {
        type: String,
        timestamp: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Compound index for user and date
dailyQuotaSchema.index({ user: 1, date: 1 }, { unique: true });
dailyQuotaSchema.index({ userUid: 1, date: 1 });

// Virtual for remaining quota
dailyQuotaSchema.virtual('remaining').get(function () {
  return Math.max(0, this.limit - this.consumed);
});

// Virtual for percentage used
dailyQuotaSchema.virtual('percentageUsed').get(function () {
  return (this.consumed / this.limit) * 100;
});

// Virtual for status
dailyQuotaSchema.virtual('status').get(function () {
  const percentage = this.percentageUsed;
  if (percentage >= 100) return 'exceeded';
  if (percentage >= 90) return 'critical';
  if (percentage >= 70) return 'warning';
  return 'ok';
});

// Methods
dailyQuotaSchema.methods.toJSON = function () {
  const quota = this.toObject({ virtuals: true });
  delete quota.__v;
  return quota;
};

dailyQuotaSchema.methods.addConsumption = async function (volume, transactionId) {
  this.consumed += volume;
  
  if (transactionId) {
    this.transactions.push({
      transaction: transactionId,
      volume: volume,
      timestamp: new Date(),
    });
  }
  
  // Add warning if approaching limit
  if (this.percentageUsed >= 90 && this.status === 'critical') {
    this.warnings.push({
      type: 'Approaching daily limit',
      timestamp: new Date(),
    });
  }
  
  await this.save();
  return this;
};

dailyQuotaSchema.methods.reset = async function () {
  this.consumed = 0;
  this.transactions = [];
  this.lastReset = new Date();
  await this.save();
  return this;
};

dailyQuotaSchema.methods.canConsume = function (volume) {
  return this.consumed + volume <= this.limit;
};

// Static methods
dailyQuotaSchema.statics.getTodayQuota = async function (userId) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  let quota = await this.findOne({
    user: userId,
    date: today,
  });
  
  // Create if doesn't exist
  if (!quota) {
    quota = await this.create({
      user: userId,
      userUid: userId.toString(),
      date: today,
      limit: parseFloat(process.env.DAILY_ALCOHOL_LIMIT) || 1,
      consumed: 0,
    });
  }
  
  return quota;
};

dailyQuotaSchema.statics.getTodayQuotaByUid = async function (userUid) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  let quota = await this.findOne({
    userUid: userUid,
    date: today,
  });
  
  // Create if doesn't exist
  if (!quota) {
    const User = mongoose.model('User');
    const user = await User.findByUid(userUid);
    
    if (user) {
      quota = await this.create({
        user: user._id,
        userUid: userUid,
        date: today,
        limit: parseFloat(process.env.DAILY_ALCOHOL_LIMIT) || 1,
        consumed: 0,
      });
    }
  }
  
  return quota;
};

dailyQuotaSchema.statics.getQuotaHistory = function (userId, days = 30) {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);
  
  return this.find({
    user: userId,
    date: { $gte: startDate },
  }).sort({ date: -1 });
};

dailyQuotaSchema.statics.getUsersExceedingLimit = function () {
  return this.find({
    $expr: { $gte: ['$consumed', '$limit'] },
    date: {
      $gte: new Date(new Date().setHours(0, 0, 0, 0)),
    },
  }).populate('user', 'name phoneNumber email');
};

// Pre-save middleware
dailyQuotaSchema.pre('save', function (next) {
  // Ensure date is start of day
  if (this.isModified('date')) {
    this.date.setHours(0, 0, 0, 0);
  }
  next();
});

const DailyQuota = mongoose.model('DailyQuota', dailyQuotaSchema);

module.exports = DailyQuota;