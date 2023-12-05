const express = require('express');
const router = express.Router();

// middlewares
const { authCheck, adminCheck } = require('../middlewares/auth');

// controllers
const { upload, remove } = require('../controllers/cloudinary');
const { CLERK_WEIGHT } = require('../utils/const');

router.post('/uploadimages', authCheck, [adminCheck(CLERK_WEIGHT)], upload);
router.post('/removeimage', authCheck, [adminCheck(CLERK_WEIGHT)], remove);

module.exports = router;
