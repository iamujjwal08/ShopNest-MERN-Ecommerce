const Order = require("../model/Order");

const sendEmail = require("../utils/sendEmail");

// create order
const addOrderItems = async (req, res) => {
  try {
    const {
      items,
      totalAmount,
      address,
      paymentId,
      paymentMethod,
    } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({
        message: "No order items",
      });
    }

    const order = new Order({
      userId: req.user._id,
      items,
      totalAmount,
      address,
      paymentMethod,
      paymentId,    
    });

    const createdOrder = await order.save();

    const message = `Order Confirmation Hello ${req.user.name},Your order has been successfully placed! Order ID: ${createdOrder._id}Total Amount Paid: ₹${Number(totalAmount).toFixed(2)}
    Shipping Address:${address.street}, ${address.city}
    Thank you for shopping with ShopNest!`;

    await sendEmail(
      req.user.email,
      "ShopNest - Order Confirmation",
      message
    );

    res.status(201).json(createdOrder);
  } 
  catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const myorders = async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.user._id });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getOrders = async (req, res) => {
  try {
    const orders = await Order.find({}).populate('userId', 'id name');
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateOrderStatus = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (order) {
      order.status = req.body.status || order.status;
      const updatedOrder = await order.save();
      res.json(updatedOrder);
    } else {
      res.status(404).json({ message: 'Order not found' });
    }
  } catch (error) {
    console.error("Order Error:", error);

    res.status(500).json({
    success: false,
    message: error.message,
    stack: error.stack,
  });
}
};

module.exports = {
  addOrderItems,
  myorders,
  getOrders,
  updateOrderStatus,
};