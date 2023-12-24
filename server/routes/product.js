const express = require('express');
const router = express.Router();

// middlewares
const { authCheck, adminCheck } = require('../middlewares/auth');

// controller
const {
  create,
  remove,
  read,
  update,
  list,
  productsCount,
  productStar,
  listRelated,
  searchFilters,
  searchFiltersAdmin,
} = require('../controllers/product');
const { CLERK_WEIGHT } = require('../utils/const');

// routes
router.post('/product', create);
router.get('/products/total', productsCount);
router.delete('/product/:slug', authCheck, [adminCheck(CLERK_WEIGHT)], remove);
router.get('/product/:slug', read);
router.put('/product/:slug', authCheck, [adminCheck(CLERK_WEIGHT)], update);

router.post('/products', list);
// rating
router.put('/product/star/:productId', authCheck, productStar);
// related
router.get('/product/related/:productId', listRelated);
// search
router.post('/search/filters', searchFilters);
router.post('/search/filters-admin', searchFiltersAdmin);

module.exports = router;
