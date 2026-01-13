const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    uid: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    email: {
      type: String,
      sparse: true,
      lowercase: true,
      trim: true,
    },
    phoneNumber: {
      type: String,
      sparse: true,
      trim: true,
    },
    name: {
      type: String,
      trim: true,
    },
    role: {
      type: String,
      enum: ['customer', 'cashier', 'admin'],
      default: 'customer',
      required: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    profileImage: {
      type: String,
    },

    // Customer-specific fields
    dateOfBirth: {
      type: Date,
    },
    address: {
      street: String,
      city: String,
      state: String,
      zipCode: String,
      country: String,
    },

    // ID verification
    idVerified: {
      type: Boolean,
      default: false,
    },
    idVerificationDate: {
      type: Date,
    },

    // Tracking
    lastLogin: {
      type: Date,
    },
    loginCount: {
      type: Number,
      default: 0,
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

/* ============================
   Indexes (NO duplicates)
============================ */
userSchema.index({ email: 1 });
userSchema.index({ phoneNumber: 1 });
userSchema.index({ role: 1 });
userSchema.index({ createdAt: -1 });

/* ============================
   Methods
============================ */
userSchema.methods.toJSON = function () {
  const user = this.toObject();
  delete user.__v;
  return user;
};

userSchema.methods.updateLastLogin = async function () {
  this.lastLogin = new Date();
  this.loginCount += 1;
  await this.save();
};

/* ============================
   Static methods
============================ */
userSchema.statics.findByUid = function (uid) {
  return this.findOne({ uid });
};

userSchema.statics.findByEmail = function (email) {
  return this.findOne({ email: email.toLowerCase() });
};

userSchema.statics.findByPhoneNumber = function (phoneNumber) {
  return this.findOne({ phoneNumber });
};

userSchema.statics.findByRole = function (role) {
  return this.find({ role, isActive: true });
};

/* ============================
   Pre-save middleware (FIXED)
============================ */
userSchema.pre('save', function (next) {
  try {
    if (this.email) {
      this.email = this.email.toLowerCase().trim();
    }
    
    // Ensure next is a function before calling it
    if (typeof next === 'function') {
      return next();
    }
  } catch (error) {
    // If next is not a function, throw the error
    if (typeof next === 'function') {
      return next(error);
    } else {
      throw error;
    }
  }
});

// Add another pre-save hook for phone number cleanup
userSchema.pre('save', function (next) {
  try {
    if (this.phoneNumber) {
      // Remove any non-numeric characters except +
      this.phoneNumber = this.phoneNumber.replace(/[^\d+]/g, '');
    }
    
    if (typeof next === 'function') {
      return next();
    }
  } catch (error) {
    if (typeof next === 'function') {
      return next(error);
    } else {
      throw error;
    }
  }
});

const User = mongoose.model('User', userSchema);

module.exports = User;