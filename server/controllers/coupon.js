const Coupon = require('../models/coupon');
const Product = require('../models/product');
// create, remove, list

exports.create = async (req, res) => {
  try {
    const { name, expiry, discount, description, type, target } =
      req.body.coupon;

    console.log('HEHE: ', {
      name,
      expiry,
      discount,
      description,
      type,
      target,
    });
    let handledTarget = [];
    let affectedCategory = null;
    if (type === 'category') {
      const products = await Product.find({ category: target })
        .select('_id')
        .lean();
      products.forEach((prod) => handledTarget.push(prod));
      affectedCategory = target;
    } else if (type === 'product') {
      handledTarget = target;
    }

    res.json(
      await new Coupon({
        name,
        expiry,
        discount,
        type,
        description,
        target: handledTarget,
        affectedCategory,
      }).save()
    );
  } catch (err) {
    console.log(err);
  }
};

exports.remove = async (req, res) => {
  try {
    res.json(await Coupon.findByIdAndDelete(req.params.couponId));
  } catch (err) {
    console.log(err);
  }
};

exports.list = async (req, res) => {
  try {
    const coupons = await Coupon.find({})
      .sort({ createdAt: -1 })
      .populate({
        path: 'affectedCategory',
        select: '_id name',
        strictPopulate: false,
      })
      .populate({
        path: 'target',
        select: '_id title slug',
        strictPopulate: false,
      })
      .lean();

    res.json(coupons);
  } catch (err) {
    console.log(err);
  }
};
