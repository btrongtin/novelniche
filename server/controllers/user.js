const User = require('../models/user');
const Product = require('../models/product');
const Cart = require('../models/cart');
const Coupon = require('../models/coupon');
const Order = require('../models/order');
const uniqueid = require('uniqueid');

exports.userCart = async (req, res) => {
  // console.log(req.body); // {cart: []}
  const { cart } = req.body;

  let products = [];

  const user = await User.findOne({ email: req.user.email }).lean();

  // check if cart with logged in user id already exist
  let cartExistByThisUser = await Cart.findOne({ orderedBy: user._id });
  if (cartExistByThisUser) {
    cartExistByThisUser.deleteOne();
    console.log('removed old cart');
  }

  for (let i = 0; i < cart.length; i++) {
    let object = {};

    object.product = cart[i]._id;
    object.count = cart[i].count;
    object.color = cart[i].color;
    // get price for creating total
    let productFromDb = await Product.findById(cart[i]._id)
      .select('price')
      .lean();
    object.price = productFromDb.price;

    products.push(object);
  }

  // console.log('products', products)

  let cartTotal = 0;
  for (let i = 0; i < products.length; i++) {
    cartTotal = cartTotal + products[i].price * products[i].count;
  }

  // console.log("cartTotal", cartTotal);

  let newCart = await new Cart({
    products,
    cartTotal,
    orderedBy: user._id,
  }).save();

  console.log('new cart ----> ', newCart);
  res.json({ ok: true });
};

exports.getUserCart = async (req, res) => {
  const user = await User.findOne({ email: req.user.email }).lean();

  let cart = await Cart.findOne({ orderedBy: user._id })
    .populate('products.product', '_id title price totalAfterDiscount')
    .lean();

  const { products, cartTotal, totalAfterDiscount } = cart;
  res.json({ products, cartTotal, totalAfterDiscount, user });
};

exports.emptyCart = async (req, res) => {
  console.log('empty cart');
  const user = await User.findOne({ email: req.user.email }).lean();

  const cart = await Cart.findOneAndRemove({ orderedBy: user._id }).lean();
  res.json(cart);
};

exports.saveAddress = async (req, res) => {
  const userAddress = await User.findOneAndUpdate(
    { email: req.user.email },
    { address: req.body.address }
  ).lean();

  res.json({ ok: true });
};

exports.applyCouponToUserCart = async (req, res) => {
  const { coupon } = req.body;
  console.log('COUPON', coupon);

  const validCoupon = await Coupon.findOne({
    name: coupon,
    expiry: {
      $gte: new Date(),
    },
  }).lean();
  if (validCoupon === null) {
    return res.json({
      err: 'Sorry, you coupon does not exist or maybe expired.',
    });
  }
  console.log('VALID COUPON', validCoupon);

  const user = await User.findOne({ email: req.user.email }).lean();

  let { products, cartTotal } = await Cart.findOne({ orderedBy: user._id })
    .populate('products.product', '_id title price')
    .lean();

  console.log('cartTotal', cartTotal, 'discount%', validCoupon.discount);

  // calculate the total after discount
  let totalAfterDiscount = (
    cartTotal -
    (cartTotal * validCoupon.discount) / 100
  ).toFixed(2); // 99.99

  console.log('----------> ', totalAfterDiscount);

  const result = await Cart.findOneAndUpdate(
    { orderedBy: user._id },
    { totalAfterDiscount, coupon: validCoupon.discount },
    { new: true, upsert: true }
  ).lean();

  console.log('FINAL RESULT AFTER UPDATE CART COUPON: ', result);

  res.json(totalAfterDiscount);
};

exports.createOrder = async (req, res) => {
  // console.log(req.body);
  // return;
  const {
    amount,
    bankCode,
    bankTranNo,
    cardType,
    transactionNo,
    responseCode,
  } = req.body.paymentData;
  console.log(
    'DATAAAAA: ',
    amount,
    bankCode,
    bankTranNo,
    cardType,
    transactionNo,
    responseCode
  );
  const user = await User.findOne({ email: req.user.email }).lean();

  let { products, coupon } = await Cart.findOne({ orderedBy: user._id }).lean();

  let newOrder = await new Order({
    products,
    paymentIntent: {
      id: uniqueid(),
      amount,
      currency: 'vnd',
      status: 'Payment success',
      created: Date.now(),
      payment_method_types: ['online_banking'],
      payment_info: {
        bankCode,
        bankTranNo,
        cardType,
        transactionNo,
        responseCode,
      },
    },
    orderedBy: user._id,
    coupon,
  }).save();

  // decrement quantity, increment sold
  let bulkOption = products.map((item) => {
    return {
      updateOne: {
        filter: { _id: item.product._id }, // IMPORTANT item.product
        update: { $inc: { quantity: -item.count, sold: +item.count } },
      },
    };
  });

  let updated = await Product.bulkWrite(bulkOption, {});
  console.log('PRODUCT QUANTITY-- AND SOLD++', updated);

  res.json({ ok: true, orderId: newOrder._id });
};

exports.orders = async (req, res) => {
  let user = await User.findOne({ email: req.user.email }).lean();

  let userOrders = await Order.find({ orderedBy: user._id })
    .populate('products.product')
    .lean();

  res.json(userOrders);
};

// addToWishlist wishlist removeFromWishlist
exports.addToWishlist = async (req, res) => {
  const { productId } = req.body;

  const user = await User.findOneAndUpdate(
    { email: req.user.email },
    { $addToSet: { wishlist: productId } }
  ).lean();

  res.json({ ok: true });
};

exports.wishlist = async (req, res) => {
  const list = await User.findOne({ email: req.user.email })
    .select('wishlist')
    .populate('wishlist')
    .lean();

  res.json(list);
};

exports.removeFromWishlist = async (req, res) => {
  const { productId } = req.params;
  const user = await User.findOneAndUpdate(
    { email: req.user.email },
    { $pull: { wishlist: productId } }
  ).lean();

  res.json({ ok: true });
};

exports.createCashOrder = async (req, res) => {
  const { COD, couponApplied } = req.body;
  // if COD is true, create order with status of Cash On Delivery

  if (!COD) return res.status(400).send('Create cash order failed');

  const user = await User.findOne({ email: req.user.email }).lean();

  let userCart = await Cart.findOne({ orderedBy: user._id }).lean();

  let finalAmount = 0;

  if (couponApplied && userCart.totalAfterDiscount) {
    finalAmount = userCart.totalAfterDiscount;
  } else {
    finalAmount = userCart.cartTotal;
  }

  let newOrder = await new Order({
    products: userCart.products,
    coupon: userCart.coupon,
    paymentIntent: {
      id: uniqueid(),
      amount: finalAmount,
      currency: 'vnd',
      status: 'Cash On Delivery',
      created: Date.now(),
      payment_method_types: ['cash_on_delivery'],
    },
    orderedBy: user._id,
    orderStatus: 'Cash On Delivery',
  }).save();

  // decrement quantity, increment sold
  let bulkOption = userCart.products.map((item) => {
    return {
      updateOne: {
        filter: { _id: item.product._id }, // IMPORTANT item.product
        update: { $inc: { quantity: -item.count, sold: +item.count } },
      },
    };
  });

  let updated = await Product.bulkWrite(bulkOption, {});
  console.log('PRODUCT QUANTITY-- AND SOLD++', updated);

  console.log('NEW ORDER SAVED', newOrder);
  res.json({ ok: true });
};

exports.allUsers = async (req, res) => {
  try {
    const { sort, order, page, perPage } = req.body;
    const currentPage = page || 1;
    const limit = perPage || 12; // 3

    const users = await User.find({})
      .skip((currentPage - 1) * perPage)
      .sort([[sort, order]])
      .limit(limit)
      .lean();

    res.json(users);
  } catch (err) {
    console.log(err);
  }
};

exports.usersCount = async (req, res) => {
  let total = await User.find({}).estimatedDocumentCount().lean();
  res.json(total);
};
