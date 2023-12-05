const mongoose = require('mongoose');
const { ROLES, GUEST } = require('../utils/const');
const { ObjectId } = mongoose.Schema;

const userSchema = new mongoose.Schema(
  {
    name: String,
    email: {
      type: String,
      required: true,
      index: true,
    },
    cart: {
      type: Array,
      default: [],
    },
    address: String,
    wishlist: [{ type: ObjectId, ref: 'Product' }],
    phone: String,
    role: {
      type: String,
      enum: ROLES,
      default: GUEST,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('User', userSchema);
