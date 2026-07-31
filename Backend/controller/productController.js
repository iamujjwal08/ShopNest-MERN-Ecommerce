const Product = require("../model/Product");
const cloudinary = require("cloudinary").v2;
const cloudinary_url = cloudinary.url;
const XLSX = require("xlsx");
const fs = require("fs");
// get all products
const getProducts = async (req, res) => {
    try {

        const filter = {};

        // Search
        if (req.query.search) {
            filter.name = {
                $regex: req.query.search,
                $options: "i"
            };
        }

        // Category
        if (req.query.category && req.query.category !== "All") {
            filter.category = req.query.category;
        }

        const products = await Product.find(filter);

        res.json(products);

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
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
// Import products from Excel
const importProducts = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: "Please upload a JSON file."
            });
        }

        // Read uploaded JSON file
        const rawData = fs.readFileSync(req.file.path, "utf8");
        const products = JSON.parse(rawData);

        if (!Array.isArray(products)) {
            return res.status(400).json({
                success: false,
                message: "Invalid JSON format. Expected an array of products."
            });
        }

        let imported = 0;
        let skipped = 0;
        const errors = [];

        for (const product of products) {
            try {
                // Skip duplicate product names
                const exists = await Product.findOne({
                    name: product.name
                });

                if (exists) {
                    skipped++;
                    continue;
                }

                await Product.create({
                    name: product.name,
                    description: product.description || "No description",
                    price: Number(product.price),
                    category: product.category,
                    stock: Number(product.stock),
                    imageUrl: product.imageUrl || product.image || "",
                    ratings: Number(product.ratings || product.rating || 0),
                    numReviews: Number(product.numReviews || 0)
                });

                imported++;

            } catch (err) {
                errors.push({
                    product: product.name || "Unknown Product",
                    error: err.message
                });
            }
        }

        // Delete uploaded file after import
        fs.unlinkSync(req.file.path);

        return res.status(200).json({
            success: true,
            message: "Products imported successfully.",
            imported,
            skipped,
            failed: errors.length,
            errors
        });

    } catch (error) {
        console.error(error);

        if (req.file && fs.existsSync(req.file.path)) {
            fs.unlinkSync(req.file.path);
        }

        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

module.exports = {  getProducts, 
                    getProductById, 
                    createProduct, 
                    updateProduct,
                    deleteProduct,
                    importProducts};