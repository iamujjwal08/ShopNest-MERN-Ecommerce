const Product = require("../model/Product");
const cloudinary = require("cloudinary").v2;
const cloudinary_url = cloudinary.url;
const XLSX = require("xlsx");
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
                message: "Please upload an Excel file"
            });
        }

        // Read Excel file
        const workbook = XLSX.readFile(req.file.path);

        const sheetName = workbook.SheetNames[0];

        const sheet = workbook.Sheets[sheetName];

        const rows = XLSX.utils.sheet_to_json(sheet);

        let imported = 0;
        let skipped = 0;

        for (const row of rows) {

            // Skip duplicate product names
            const exists = await Product.findOne({ name: row.name });

            if (exists) {
                skipped++;
                continue;
            }

            await Product.create({
                name: row.name,
                description: row.description || "No description",
                price: Number(row.price),
                category: row.category,
                stock: Number(row.stock),
                imageUrl: row.image || row.imageUrl,
                ratings: Number(row.rating) || 0,
                numReviews: 0
            });

            imported++;
        }

        res.status(200).json({
            success: true,
            imported,
            skipped,
            total: rows.length
        });

    } catch (error) {
        console.log(error);

        res.status(500).json({
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