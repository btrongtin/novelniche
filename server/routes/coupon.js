const express = require('express');
const router = express.Router();

// middlewares
const { authCheck, adminCheck } = require('../middlewares/auth');

// controller
const { create, remove, list } = require('../controllers/coupon');
const { CLERK_WEIGHT } = require('../utils/const');

// routes
router.post('/coupon', authCheck, [adminCheck(CLERK_WEIGHT)], create);
router.get('/coupons', list);
router.delete(
  '/coupon/:couponId',
  authCheck,
  [adminCheck(CLERK_WEIGHT)],
  remove
);

module.exports = router;
