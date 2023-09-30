const express = require("express");
const router = express.Router();

// middleware
const { authCheck } = require("../middlewares/auth");
const { vnpay } = require("../controllers/vnpay");

router.post("/vnpay", authCheck, vnpay);

module.exports = router;
