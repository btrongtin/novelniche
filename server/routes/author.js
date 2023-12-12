const express = require('express');
const router = express.Router();

// middlewares
const { authCheck, adminCheck } = require('../middlewares/auth');

// controller
const { create, read, update, remove, list } = require('../controllers/author');
const { ADMIN_WEIGHT, CLERK_WEIGHT } = require('../utils/const');

// routes
router.post('/author', authCheck, [adminCheck(CLERK_WEIGHT)], create);
router.get('/authors', list);
router.get('/author/:slug', read);
router.put('/author/:slug', authCheck, [adminCheck(CLERK_WEIGHT)], update);
router.delete('/author/:slug', authCheck, [adminCheck(CLERK_WEIGHT)], remove);

module.exports = router;
