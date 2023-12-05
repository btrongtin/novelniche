const express = require('express');

const router = express.Router();

// middlewares
const { authCheck, adminCheck } = require('../middlewares/auth');
// controllers
const {
  userCart,
  getUserCart,
  emptyCart,
  saveAddress,
  applyCouponToUserCart,
  createOrder,
  orders,
  addToWishlist,
  wishlist,
  removeFromWishlist,
  createCashOrder,
  allUsers,
  usersCount,
  getUser,
  allEmployees,
} = require('../controllers/user');
const { CLERK_WEIGHT } = require('../utils/const');

router.post('/user/cart', authCheck, userCart); // save cart
router.get('/user/cart', authCheck, getUserCart); // get cart
router.delete('/user/cart', authCheck, emptyCart); // empty cart
router.post('/user/address', authCheck, saveAddress);

router.post('/user/order', authCheck, createOrder); // stripe
router.post('/user/cash-order', authCheck, createCashOrder); // cod
router.get('/user/orders', authCheck, orders);

// coupon
router.post('/user/cart/coupon', authCheck, applyCouponToUserCart);

// wishlist
router.post('/user/wishlist', authCheck, addToWishlist);
router.get('/user/wishlist', authCheck, wishlist);
router.put('/user/wishlist/:productId', authCheck, removeFromWishlist);

//ADMIN
router.post('/admin/users', authCheck, [adminCheck(CLERK_WEIGHT)], allUsers);
router.post(
  '/admin/employees',
  authCheck,
  [adminCheck(CLERK_WEIGHT)],
  allEmployees
);
router.get(
  '/admin/users/total',
  authCheck,
  [adminCheck(CLERK_WEIGHT)],
  usersCount
);
router.get('/admin/users/:userId', authCheck, getUser);

module.exports = router;
