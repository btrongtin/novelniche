const express = require("express");
const router = express.Router();

// middlewares
const { authCheck, adminCheck } = require("../middlewares/auth");

// controller
const {
  create,
  read,
  update,
  remove,
  list
} = require("../controllers/author");

// routes
// router.post("/author", authCheck, adminCheck, create);
router.post("/author", create);
router.get("/authors", list);
router.get("/author/:slug", read);
router.put("/author/:slug", authCheck, adminCheck, update);
router.delete("/author/:slug", authCheck, adminCheck, remove);

module.exports = router;
