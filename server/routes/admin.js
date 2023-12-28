const express = require('express');
const { auth } = require('../firebase');

const router = express.Router();

// middlewares
const { authCheck, adminCheck } = require('../middlewares/auth');

const {
  orders,
  orderStatus,
  orderById,
  getDashboard,
  ordersCount,
  changeRole,
  changeState,
  searchUser,
} = require('../controllers/admin');
const { ADMIN_WEIGHT, CLERK_WEIGHT } = require('../utils/const');

// routes
router.post('/admin/orders', authCheck, [adminCheck(CLERK_WEIGHT)], orders);
router.get(
  '/admin/orders/total',
  authCheck,
  [adminCheck(CLERK_WEIGHT)],
  ordersCount
);
router.get(
  '/admin/dashboard',
  authCheck,
  [adminCheck(CLERK_WEIGHT)],
  getDashboard
);
router.get(
  '/admin/order/:orderId',
  authCheck,
  [adminCheck(CLERK_WEIGHT)],
  orderById
);
router.put(
  '/admin/order-status',
  authCheck,
  [adminCheck(CLERK_WEIGHT)],
  orderStatus
);
router.put(
  '/admin/changeRole',
  authCheck,
  [adminCheck(ADMIN_WEIGHT)],
  changeRole
);
router.put(
  '/admin/changeState',
  authCheck,
  [adminCheck(ADMIN_WEIGHT)],
  changeState
);
router.post(
  '/admin/searchUser',
  authCheck,
  [adminCheck(CLERK_WEIGHT)],
  searchUser
);

module.exports = router;
