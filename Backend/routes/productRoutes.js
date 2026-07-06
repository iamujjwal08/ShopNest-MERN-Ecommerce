const express = require('express');
const { getProducts, getProductById, createProduct, updateProduct, deleteProduct } = require('../controller/productController');
const protect = require("../middleware/authMiddleware");
const admin = require("../middleware/adminMiddleware");
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

const router = express.Router();
// all product 
router.route('/').get(getProducts).post(protect, admin, upload.single('image'), createProduct);
// specific product
router.route('/:id').get(getProductById).put(protect, admin, upload.single('image'), updateProduct).delete(protect, admin, deleteProduct);

module.exports = router;
