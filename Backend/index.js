const express = require("express");
const cors =require("cors");
const dotenv = require("dotenv");
const path = require("path");
const connectDB= require("./config/db");
const userRoutes = require("./routes/authRoutes");
const productRoutes = require("./routes/productRoutes");
const orderRoutes = require("./routes/orderRoutes");
const paymentRoutes = require("./routes/paymentRoutes");
const analyticsRoutes = require("./routes/analyticsRoutes");
dotenv.config();

require("./config/cloudinary"); 
const app = express();
app.use(cors(
  {
    origin: ["http://localhost:3000",'http://127.0.0.1:3000',process.env.FRONTEND_URL],
    credentials: true,
  }
));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

connectDB();
app.get("/", (req, res) => {
  res.send("shopNest Backend is working properly");
});

app.use("/api/auth", userRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/payment", paymentRoutes);
app.use("/api/analytics", analyticsRoutes);



// Serve frontend in production
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../Frontend/dist")));

app.use((req, res) => {
  res.sendFile(path.resolve(__dirname, "../Frontend/dist/index.html"));
});
} else {
  app.get("/", (req, res) => {
    res.send("ShopNest API is running in Development mode...");
  });
}


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});