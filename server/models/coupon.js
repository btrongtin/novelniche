const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema;

const couponSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      unique: true,
      uppercase: true,
      required: 'Nmae is required',
      minlength: [6, 'Too short'],
      maxlength: [20, 'Too long'],
    },
    expiry: {
      type: Date,
      required: true,
    },
    discount: {
      type: Number,
      requred: true,
    },
    type: {
      type: String,
      enum: ['all', 'category', 'product'],
      default: 'all',
    },
    affectedCategory: {
      type: ObjectId,
      ref: 'Category',
      default: null,
    },
    target: [{ type: ObjectId, ref: 'Product' }],
    description: {
      type: String,
      default: '',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Coupon', couponSchema);
