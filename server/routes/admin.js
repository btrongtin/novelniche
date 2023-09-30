const express = require("express");
const { auth } = require("../firebase");

const router = express.Router();

// middlewares
const { authCheck, adminCheck } = require("../middlewares/auth");

const { orders, orderStatus, ordersBetweenDates, orderById, getDashboard, ordersCount } = require("../controllers/admin");

// routes
router.post("/admin/orders", authCheck, adminCheck, orders);
router.get("/admin/orders/total", authCheck, adminCheck, ordersCount);
router.get("/admin/dashboard", authCheck, adminCheck, getDashboard);
// router.post("/admin/orders", authCheck, adminCheck, ordersBetweenDates);
router.get("/admin/order/:orderId", authCheck, adminCheck, orderById);
router.put("/admin/order-status", authCheck, adminCheck, orderStatus);

module.exports = router;
