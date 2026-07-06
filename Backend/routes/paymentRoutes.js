const express = require("express");
const { createOrder,verifyPayment,createRefund } = require("../controller/paymentController");
const router = express.Router();

router.post("/order",createOrder);
router.post("/verify",verifyPayment);
// router.post("/refund",createRefund);

module.exports = router;