const User = require('../models/user');
const Product = require('../models/product');
const Cart = require('../models/cart');
const Coupon = require('../models/coupon');
const Order = require('../models/order');
const uniqueid = require('uniqueid');
const { sendMail } = require('../utils/mailer/mailer');
const { receipt } = require('../utils/mailer/mail.template');
const { getOrderById } = require('./admin');
const admin = require('../firebase');
const mongoose = require('mongoose');

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

exports.getUser = async (req, res) => {
  try {
    const userDb = await User.findById(req.params.userId).lean();
    const { displayName, photoURL, metadata } = await admin
      .auth()
      .getUserByEmail(userDb.email);

    const ordersByUser = await Order.find({ orderedBy: req.params.userId });

    const ordersTotalValue = ordersByUser.reduce(
      (accu, current) => accu + (+current.paymentIntent?.amount || 0),
      0
    );
    const ordersTotalProd = await getDistinctOrdersByUser(req.params.userId);
    const orderTotalProdCount = ordersTotalProd.reduce(
      (accu, curr) => accu + (curr.count || 0),
      0
    );
    const result = {
      ...userDb,
      displayName,
      photoURL,
      metadata,
      ordersTotalValue,
      orderTotalProdCount,
      ordersCount: ordersByUser.length || 0,
      orders: ordersByUser,
    };
    res.json(result);
  } catch (err) {
    console.log('err: ', err);
  }
};
const getDistinctOrdersByUser = async (userId) => {
  try {
    const orders = await Order.find({ orderedBy: userId })
      .select('products')
      .populate('products.product', 'title');

    const distinctProducts = [];
    const productMap = new Map();

    orders.forEach((order) => {
      order.products.forEach((product) => {
        const productId = product.product._id.toString();

        if (!productMap.has(productId)) {
          productMap.set(productId, {
            product: product.product,
            count: product.count,
          });
        } else {
          productMap.get(productId).count += product.count;
        }
      });
    });

    productMap.forEach((value) => {
      distinctProducts.push(value);
    });
    return distinctProducts;
  } catch (err) {
    console.log(err);
  }
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
  let discountProducts = [];
  console.log('COUPON', coupon);

  const validCoupon = await Coupon.findOne({
    name: coupon,
    expiry: {
      $gte: new Date(),
    },
  }).lean();
  if (validCoupon === null) {
    return res.json({
      err: 'Lỗi: Coupon của bạn không tồn tại hoặc không hợp lệ.',
    });
  }

  console.log('VALID COUPON', validCoupon);

  const user = await User.findOne({ email: req.user.email }).lean();

  let { cartTotal, products } = await Cart.findOne({ orderedBy: user._id })
    .populate('products.product', '_id title price category')
    .lean();
  let totalAfterDiscount = cartTotal;
  if (validCoupon.type !== 'all') {
    const targetStrings = validCoupon.target.map((id) => id.toString());

    products.forEach((product) => {
      const productIdString = product.product._id.toString();
      if (targetStrings.includes(productIdString)) {
        product.price =
          product.price - (product.price * validCoupon.discount) / 100;
        console.log('PROD: ', product.title, product.price);
      }
    });

    totalAfterDiscount = products.reduce(
      (total, product) =>
        total + parseFloat(product.price) * (product.count || 1),
      0
    );
    await Cart.findOneAndUpdate(
      { orderedBy: user._id },
      { totalAfterDiscount, coupon: validCoupon.discount },
      { new: true, upsert: true }
    );
  } else {
    totalAfterDiscount = cartTotal - (cartTotal * validCoupon.discount) / 100;

    await Cart.findOneAndUpdate(
      { orderedBy: user._id },
      { totalAfterDiscount, coupon: validCoupon.discount },
      { new: true, upsert: true }
    );
  }

  return res.json(totalAfterDiscount);
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
  const { shippingAddress } = req.body;
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
    address: shippingAddress || user.address,
    coupon: coupon,
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
  const orderForMail = await getOrderById(newOrder._id);
  // Send email
  sendMail(
    user.email,
    '[NovelNiche] - Đặt hàng thành công',
    receipt(user, orderForMail)
  );

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
  const { COD, couponApplied, shippingAddress } = req.body;
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
    address: shippingAddress || user.address || '',
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
  const orderForMail = await getOrderById(newOrder._id);
  // Send email
  sendMail(
    user.email,
    '[NovelNiche] - Đặt hàng thành công',
    receipt(user, orderForMail)
  );
  res.json({ ok: true });
};

exports.allUsers = async (req, res) => {
  try {
    const { sort, order, page, perPage } = req.body;
    const currentPage = page || 1;
    const limit = perPage || 12; // 3

    const users = await User.find({ role: 'guest' })
      .skip((currentPage - 1) * perPage)
      .sort([[sort, order]])
      .limit(limit)
      .lean();

    res.json(users);
  } catch (err) {
    console.log(err);
  }
};

exports.allEmployees = async (req, res) => {
  try {
    const { sort, order, page, perPage } = req.body;
    const currentPage = page || 1;
    const limit = perPage || 12; // 3

    const users = await User.find({ role: { $ne: 'guest' } })
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
  const users = await User.find({ role: 'guest' }).lean();
  res.json(users.length);
};
exports.employeesCount = async (req, res) => {
  const users = await User.find({ role: { $ne: 'guest' } }).lean();
  res.json(users.length);
};
