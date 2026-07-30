# 🛒 ShopNest - MERN Stack E-Commerce Platform

ShopNest is a full-stack E-Commerce web application built using the **MERN Stack (MongoDB, Express.js, React.js, Node.js)**. It provides a seamless shopping experience with secure authentication, product management, shopping cart, order management, admin dashboard, and online payment integration using Razorpay.

---

## 🚀 Features

### 👤 User Features
- User Registration & Login (JWT Authentication)
- Secure Password Encryption (bcrypt)
- Browse Products
- Product Details Page
- Add to Cart
- Update Cart Quantity
- Remove Items from Cart
- Checkout
- Cash on Delivery (COD)
- Razorpay Payment Integration
- Order History
- Order Confirmation Email

### 🛠 Admin Features
- Admin Dashboard
- Product Management (Add, Edit, Delete)
- User Management
- Order Management
- Revenue Analytics
- Order Status Update

---

## 🛠 Tech Stack

### Frontend
- React.js
- React Router DOM
- Redux Toolkit
- CSS
- Fetch API

### Backend
- Node.js
- Express.js
- MongoDB Atlas
- Mongoose
- JWT Authentication
- bcrypt.js
- Nodemailer
- Cloudinary
- Razorpay

---

## 📂 Project Structure

```
ShopNest/
│
├── Backend/
│   ├── config/
│   ├── controller/
│   ├── middleware/
│   ├── model/
│   ├── routes/
│   ├── utils/
│   ├── uploads/
│   ├── index.js
│   └── package.json
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── admin/
│   │   ├── components/
│   │   ├── context/
│   │   ├── pages/
│   │   ├── redux/
│   │   ├── App.js
│   │   └── index.js
│   └── package.json
│
├── package.json
└── README.md
```

---

## ⚙️ Installation

### Install Dependencies

Install root dependencies

```bash
npm install
```

Install backend dependencies

```bash
cd Backend
npm install
```

Install frontend dependencies

```bash
cd ../frontend
npm install
```

---

## 🔑 Environment Variables

Create a `.env` file inside the **Backend** folder.

```env
PORT=5000

MONGODB_URI=YOUR_MONGODB_URI

JWT_SECRET=YOUR_SECRET_KEY

EMAIL_USER=YOUR_EMAIL

PASSWORD=YOUR_EMAIL_APP_PASSWORD

cloudinary_name=YOUR_CLOUDINARY_NAME

cloudinary_api_key=YOUR_API_KEY

cloudinary_api_secret=YOUR_API_SECRET

RAZORPAY_KEY_ID=YOUR_KEY_ID

RAZORPAY_KEY_SECRET=YOUR_KEY_SECRET

FRONTEND_URL=http://localhost:3000

NODE_ENV=development
```

---

## ▶️ Run Project

Test the platform rapidly featuring beautiful dummy products (Unsplash) and automatic `Admin` role provisioning:
```bash
npm run seed
```
> **Seed Admin Access:** Email: `admin@shopnest.com` | Password: `password123`


Start Backend

```bash
cd Backend
npm run dev
```

Start Frontend

```bash
cd frontend
npm start
```

Or from the root folder:

```bash
npm start
```

---


## 🔒 Authentication

- JWT Authentication
- Protected Routes
- Admin Authorization
- Password Hashing using bcrypt

---

## 💳 Payment Gateway

- Razorpay Test Mode
- Payment Verification
- Cash on Delivery (COD)

---

## 📧 Email Service

- Nodemailer
- Order Confirmation Email
- Welcome Email

---

## ☁️ Cloud Storage

- Cloudinary Image Upload
- Product Image Management

---

## 📊 Admin Dashboard

- Total Products
- Total Users
- Total Orders
- Total Revenue

---

## 📦 API Modules

- Authentication API
- Product API
- Order API
- Payment API
- Analytics API

---

## 🧪 Future Improvements

- Wishlist
- Product Reviews & Ratings
- Advanced Filters
- Price Sorting
- Pagination
- Coupons & Discounts
- Invoice Generation
- Stripe Integration
- PayPal Integration
- PWA Support

---

## 👨‍💻 Author

**Ujjwal Kumar**

- GitHub: https://github.com/iamujjwal08

---


## 📄 License

This project is developed for learning and educational purposes.