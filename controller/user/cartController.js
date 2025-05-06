const Cart = require('../../model/cart');
const Product = require('../../model/product');


exports.addToCart = async (req, res) => {
    try {
        const userId = req.session.user_id;
        const productId = req.params.productId;

        if (!userId) {
            return res.redirect('/user/loadUser');
        }

        // Get product details to check the stock
        const product = await Product.findById(productId);

        // Check if the product stock is available
        if (product.stock === 0) {
            return res.redirect('/user/cart'); // Optionally, add a message to indicate "Out of Stock"
        }

        // Check if product already exists in cart for this user
        let existingCartItem = await Cart.findOne({ userId, productId });

        if (existingCartItem) {
            // If item exists, increase quantity
            if (existingCartItem.quantity < product.stock) {
                existingCartItem.quantity += 1;
                await existingCartItem.save();
            }
        } else {
            // Else create a new cart item
            const newCartItem = new Cart({
                userId,
                productId,
                quantity: 1
            });
            await newCartItem.save();
        }

        res.redirect('/user/cart'); // Redirect to cart page
    } catch (error) {
        console.error("Error adding to cart:", error);
        res.status(500).send("Internal Server Error");
    }
};

exports.loadCart = async (req, res) => {
    try {
        const userId = req.session.user_id;

        const cartItems = await Cart.find({ userId }).populate('productId');

        if (!cartItems || cartItems.length === 0) {
            return res.render('cart', { items: [], total: 0 });
        }

        let total = 0;
        cartItems.forEach(item => {
            total += item.productId.price * item.quantity;
        });

        res.render('cart', { items: cartItems, total });
    } catch (err) {
        console.error('Error loading cart:', err);
        res.status(500).send('Internal Server Error');
    }
};
// Decrement cart item quantity
exports.decrementCart = async (req, res) => {
    try {
        const cartItemId = req.params.cartItemId;
        const cartItem = await Cart.findById(cartItemId).populate('productId');

        if (cartItem.quantity > 1) {
            cartItem.quantity -= 1;
            await cartItem.save();
        }

        res.redirect('/user/cart'); // Redirect back to cart page
    } catch (error) {
        console.error("Error decrementing cart item:", error);
        res.status(500).send("Internal Server Error");
    }
};
// Increment cart item quantity
exports.incrementCart = async (req, res) => {
    try {
        const cartItemId = req.params.cartItemId;
        const cartItem = await Cart.findById(cartItemId).populate('productId');

        // Only increment if the stock is available
        if (cartItem.quantity < cartItem.productId.stock) {
            cartItem.quantity += 1;
            await cartItem.save();
        }

        res.redirect('/user/cart'); // Redirect back to cart page
    } catch (error) {
        console.error("Error incrementing cart item:", error);
        res.status(500).send("Internal Server Error");
    }
};
//delete cart
exports.deleteCart = async (req, res) => {
    try {
        const itemId = req.body.itemId;

        await Cart.findByIdAndDelete(itemId);

        res.redirect('/user/cart');
    } catch (error) {
        console.error('Error deleting cart item:', error);
        res.status(500).send('Internal Server Error');
    }
};
exports.clearCart = async (req, res) => {
    try {
        const userId = req.session.user_id; // 🔥 fixed here

        await Cart.deleteMany({ userId: userId });

        res.redirect('/user/cart');
    } catch (error) {
        console.error('Error clearing cart:', error);
        res.status(500).send('Something went wrong');
    }
};



