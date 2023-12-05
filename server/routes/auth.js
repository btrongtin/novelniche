const express = require('express');

const router = express.Router();

// middlewares
const { authCheck, adminCheck } = require('../middlewares/auth');

// controller
const {
  createOrUpdateUser,
  currentUser,
  createNewUser,
} = require('../controllers/auth');
const { ADMIN_WEIGHT, CLERK_WEIGHT } = require('../utils/const');

router.post('/create-or-update-user', authCheck, createOrUpdateUser);
router.post(
  '/createNewUser',
  authCheck,
  [adminCheck(ADMIN_WEIGHT)],
  createNewUser
); // CHANGE THIS ROUTE TO ADMIN_WEIGHT
router.post('/current-user', authCheck, currentUser);
router.post(
  '/current-admin',
  authCheck,
  [adminCheck(CLERK_WEIGHT)],
  currentUser
);

module.exports = router;
