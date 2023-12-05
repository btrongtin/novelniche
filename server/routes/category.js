const express = require('express');
const router = express.Router();

// middlewares
const { authCheck, adminCheck } = require('../middlewares/auth');

// controller
const {
  create,
  read,
  update,
  remove,
  list,
} = require('../controllers/category');
const { CLERK_WEIGHT } = require('../utils/const');

// routes
router.post('/category', create);
router.get('/categories', list);
router.get('/category/:slug', read);
router.put('/category/:slug', authCheck, [adminCheck(CLERK_WEIGHT)], update);
router.delete('/category/:slug', authCheck, [adminCheck(CLERK_WEIGHT)], remove);

module.exports = router;
