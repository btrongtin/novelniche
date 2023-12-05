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
  [adminCheck(CLERK_WEIGHT)], //update this to ADMIN_WEIGHT
  changeRole
);

module.exports = router;
