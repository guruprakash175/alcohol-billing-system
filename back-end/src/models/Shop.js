const mongoose = require('mongoose');

const shopSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    licenseNumber: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    address: {
      street: {
        type: String,
        required: true,
      },
      city: {
        type: String,
        required: true,
      },
      state: {
        type: String,
        required: true,
      },
      zipCode: {
        type: String,
        required: true,
      },
      country: {
        type: String,
        default: 'India',
      },
    },
    contact: {
      phone: {
        type: String,
        required: true,
      },
      email: {
        type: String,
        lowercase: true,
        trim: true,
      },
      website: {
        type: String,
        trim: true,
      },
    },
    owner: {
      name: {
        type: String,
        required: true,
      },
      contact: String,
      email: String,
    },
    taxInfo: {
      gstNumber: String,
      panNumber: String,
      taxRate: {
        type: Number,
        default: 5,
      },
    },
    businessHours: {
      monday: { open: String, close: String, closed: Boolean },
      tuesday: { open: String, close: String, closed: Boolean },
      wednesday: { open: String, close: String, closed: Boolean },
      thursday: { open: String, close: String, closed: Boolean },
      friday: { open: String, close: String, closed: Boolean },
      saturday: { open: String, close: String, closed: Boolean },
      sunday: { open: String, close: String, closed: Boolean },
    },
    settings: {
      dailyQuotaLimit: {
        type: Number,
        default: 1,
      },
      allowCashPayment: {
        type: Boolean,
        default: true,
      },
      allowCardPayment: {
        type: Boolean,
        default: true,
      },
      allowUPIPayment: {
        type: Boolean,
        default: true,
      },
      requireIDVerification: {
        type: Boolean,
        default: true,
      },
      requireFaceVerification: {
        type: Boolean,
        default: false,
      },
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    logo: {
      type: String,
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
shopSchema.index({ licenseNumber: 1 });
shopSchema.index({ 'address.city': 1, 'address.state': 1 });

// Methods
shopSchema.methods.toJSON = function () {
  const shop = this.toObject();
  delete shop.__v;
  return shop;
};

shopSchema.methods.isOpenNow = function () {
  const now = new Date();
  const dayName = now.toLocaleDateString('en-US', { weekday: 'lowercase' });
  const currentTime = now.toTimeString().slice(0, 5); // HH:MM format
  
  const todayHours = this.businessHours[dayName];
  
  if (!todayHours || todayHours.closed) {
    return false;
  }
  
  return currentTime >= todayHours.open && currentTime <= todayHours.close;
};

// Static methods
shopSchema.statics.findByLicense = function (licenseNumber) {
  return this.findOne({ licenseNumber, isActive: true });
};

shopSchema.statics.findByCity = function (city) {
  return this.find({ 'address.city': city, isActive: true });
};

const Shop = mongoose.model('Shop', shopSchema);

module.exports = Shop;