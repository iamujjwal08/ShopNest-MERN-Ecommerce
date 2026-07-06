const Razorpay = require("razorpay");
const crypto = require("crypto");
require("dotenv").config();

const createOrder = async (req, res) => {
  try {
    console.log("========== CREATE ORDER ==========");
    console.log("Body:", req.body);
    console.log("KEY ID:", process.env.RAZORPAY_KEY_ID);
    console.log("KEY SECRET:", process.env.RAZORPAY_KEY_SECRET ? "Loaded" : "Missing");

    const instance = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });

    const options = {
      amount: Number(req.body.amount) * 100,
      currency: "INR",
      receipt: "receipt_" + Date.now(),
    };

    console.log("Options:", options);

    console.log("Creating Razorpay Order...");

    const order = await instance.orders.create(options);

    console.log(order);


    console.log("Order Created:", order);

    return res.status(201).json(order);
  } catch (error) {
    console.error("========== RAZORPAY ERROR ==========");
    console.error(error);

    return res.status(500).json({
      success: false,
      message: error.message,
      error,
    });
  }
};


const verifyPayment = async (req, res) => {
  try {
    const {
      razorpay_payment_id,
      razorpay_order_id,
      razorpay_signature,
    } = req.body;

    console.log("========== PAYMENT VERIFY ==========");
    console.log(req.body);

    const generated_signature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    console.log("Generated Signature :", generated_signature);
    console.log("Received Signature  :", razorpay_signature);

    if (generated_signature === razorpay_signature) {
      return res.status(200).json({
        success: true,
        message: "Payment verified successfully",
      });
    }

    return res.status(400).json({
      success: false,
      message: "Payment Verification Failed",
    });

  } catch (error) {
    console.error("Verification Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  createOrder,
  verifyPayment,
};
    

