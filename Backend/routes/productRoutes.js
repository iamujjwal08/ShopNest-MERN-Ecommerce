const express = require('express');
const {
    getProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct,
    importProducts
} = require('../controller/productController');

const protect = require("../middleware/authMiddleware");
const admin = require("../middleware/adminMiddleware");

const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

const router = express.Router();

// Get all products & Create product
router.route('/')
    .get(getProducts)
    .post(protect, admin, upload.single('image'), createProduct);

// Import products from Excel
router.post(
    '/import',
    protect,
    admin,
    upload.single('file'),
    importProducts
);

// Get, Update & Delete product
router.route('/:id')
    .get(getProductById)
    .put(protect, admin, upload.single('image'), updateProduct)
    .delete(protect, admin, deleteProduct);

module.exports = router;