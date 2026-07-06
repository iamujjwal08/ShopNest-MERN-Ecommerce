const Product = require("../model/Product");
const cloudinary = require("cloudinary").v2;
const cloudinary_url = cloudinary.url;

// get all products
const getProducts = async (req, res) => {
  try {
    const products = await Product.find({}).select("-__v");
    res.json(products);
  } 
  catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

// get product by id
const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).select("-__v");
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.json(product);
  } 
  catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

// create product
const createProduct = async (req, res) => {
  try {
    const { name, description, price, category, stock } = req.body;
    let imageUrl="";
    if(req.file){
        const result = await cloudinary.uploader.upload(req.file.path,); 
        imageUrl = result.secure_url;
    }
    const product = new Product({
      name,
      description,
      price,
      category,
      stock,
      imageUrl,
    });
    const savedProduct = await product.save();
    res.status(201).json(savedProduct);
  } 
  catch (error) {
    console.error(error);

    res.status(500).json({
        message: error.message,
        stack: error.stack
    });
  }
};


// update product
const updateProduct = async (req, res) => {
  try {
    const { name, description, price, category, stock } = req.body;
    const product = await Product.findByIdAndUpdate(req.params.id);
    if (product) {
        product.name = name || product.name;
        product.description = description || product.description;
        product.price = price || product.price;
        product.category = category || product.category;
        product.stock = stock || product.stock;
        await product.save();
        if(req.file){
            const result = await cloudinary.uploader.upload(req.file.path,); 
            product.imageUrl = result.secure_url;
        }
        const updatedProduct = await product.save();
        res.status(200).json(updatedProduct);
    }
    else {
            res.status(404).json({ message: "Product not found" });
    }

    } 
    catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
};


// delete product
const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (product) {
        const deletedProduct = await product.deleteOne();
        res.status(200).json(deletedProduct);
    } 
    else {
      res.status(404).json({ message: "Product not found" });
    }
  } 
  catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};
module.exports = {  getProducts, 
                    getProductById, 
                    createProduct, 
                    updateProduct,
                    deleteProduct };