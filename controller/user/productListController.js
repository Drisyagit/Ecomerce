const Product = require('../../model/product');
const Category = require('../../model/category');

exports.loadProductList = async (req, res) => {
    try {
        // Fetch all products and populate category details
        const products = await Product.find().populate('category');

        // Fetch dynamic categories from the database
        const categories = await Category.find();

        res.render('productList', { products, category: categories });
    } catch (error) {
        console.log(error.message);
        res.status(500).send('Internal Server Error');
    }
};

exports.signleProductLoad = async (req, res) => {
    try {
        const productId = req.params.id;
        const product = await Product.findById(productId).populate('category'); // ✅ fetch single product

        if (!product) {
            return res.status(404).send('Product not found');
        }

        const categories = await Category.find();

        res.render('singleProduct.ejs', { product, category: categories });
    } catch (error) {
        console.log(error.message);
        res.status(500).send('Internal Server Error');
    }
};
