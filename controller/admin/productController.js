const Product = require('../../model/product'); 
const Category = require('../../model/category'); 
exports.loadProduct = async (req, res) => {
    try {
        const products = await Product.find().populate('category');
        res.render('product', { products }); 
    } catch (error) {
        console.error(error);
        res.status(500).send('Error loading products');
    }
};




// Load Add Product Page
exports.loadAddProduct = async (req, res) => {
    try {
        const categories = await Category.find({ status: true }); 
        res.render('addProduct', { categories });
    } catch (error) {
        console.error(error);
        res.status(500).send('Error loading add product page');
    }
};

// Add Product
exports.addProduct = async (req, res) => {
    try {
        const images = req.files.map(file => file.filename);

        const newProduct = new Product({
            name: req.body.name,
            description: req.body.description,
            price: req.body.price,
            category: req.body.category,
            stock: req.body.stock,
            images: images,
            createdAt: new Date()
        });

        await newProduct.save();
        res.redirect('/admin/loadproduct');
    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
};

//edit productload

exports.loadEditProduct = async (req, res) => {
    try {
        const productId = req.params.id;

        const product = await Product.findById(productId).populate('category');
        const categories = await Category.find({ status: true });

        if (!product) {
            return res.status(404).send('Product not found');
        }

        res.render('editProduct', { product, categories });
    } catch (error) {
        console.error(error);
        res.status(500).send('Error loading edit product page');
    }
};

//update product
exports.updateProduct = async (req, res) => {
    try {
        const productId = req.params.id;

        const { name, description, price, category, stock, status } = req.body;

        await Product.findByIdAndUpdate(productId, {
            name,
            description,
            price,
            category,
            stock,
            status: status === 'on' // checkbox returns 'on' if checked
        });

        res.redirect('/admin/loadproduct');
    } catch (error) {
        console.error(error);
        res.status(500).send('Error updating product');
    }
};

//delete product

exports.deleteProduct = async (req, res) => {
    try {
        const productId = req.params.id;

        await Product.findByIdAndDelete(productId);

        res.redirect('/admin/loadproduct');
    } catch (error) {
        console.error(error);
        res.status(500).send('Error deleting product');
    }
};
