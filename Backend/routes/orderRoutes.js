const express = require("express");

const protect = require("../middleware/authMiddleware");
const admin = require("../middleware/adminMiddleware");

const {
  addOrderItems,
  myorders,
  getOrders,
  updateOrderStatus,
} = require("../controller/orderController");

const router = express.Router();

router
  .route("/")
  .post(protect, addOrderItems)
  .get(protect, admin, getOrders);

router
  .route("/myorders")
  .get(protect, myorders);

router
  .route("/:id/status")
  .put(protect, admin, updateOrderStatus);

module.exports = router;