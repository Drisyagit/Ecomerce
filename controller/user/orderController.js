const Cart = require('../../model/cart');
const Order = require('../../model/order');
const Product = require('../../model/product');
const Address = require('../../model/address');
const ITEMS_PER_PAGE = 5;
exports.loadOrderReview = async (req, res) => {
    try {
        const userId = req.session.user_id;
        const addressId = req.body.addressId;

        const selectedAddress = await Address.findById(addressId);
        const cartItems = await Cart.find({ userId }).populate('productId');

        if (!selectedAddress || cartItems.length === 0) {
            return res.redirect('/user/cart');
        }

        let totalAmount = 0;
        cartItems.forEach(item => {
            totalAmount += item.productId.price * item.quantity;
        });

        res.render('order-review', {
            address: selectedAddress,
          items: cartItems,
           total: totalAmount
        });

    } catch (error) {
        console.error('Error loading order review:', error);
        res.status(500).send('Internal Server Error');
    }
};
exports.placeOrder = async (req, res) => {
    try {
        const userId = req.session.user_id;
        const { addressId, paymentMethod } = req.body;

        if (paymentMethod === 'razorpay') {
            req.session.razorpay_address_id = addressId;
            return res.json({ paymentMethod: 'razorpay' });
        }

        const cartItems = await Cart.find({ userId }).populate('productId');
        const address = await Address.findById(addressId);

        if (!cartItems || cartItems.length === 0) {
            return res.redirect('/user/cart');
        }

        let total = 0;
        const items = cartItems.map(item => {
            total += item.productId.price * item.quantity;
            return {
                productId: item.productId._id,
                quantity: item.quantity
            };
        });

        const order = new Order({
            userId,
            items,
            totalAmount: total,
            address,
            paymentMethod: 'cod'
        });

        await order.save();

        for (const item of cartItems) {
            const product = await Product.findById(item.productId._id);
            product.stock -= item.quantity;
            await product.save();
        }

        await Cart.deleteMany({ userId });

        res.redirect('/user/order-success');
    } catch (err) {
        console.error('Order placement error:', err);
        res.status(500).send('Something went wrong!');
    }
};

exports.loadOrderSuccess = (req, res) => {
    try {
        const orderId = req.query.orderId; // ✅ Get from query
        res.render('order-success', { orderId }); // ✅ Pass to view
    } catch (error) {
        res.status(500).send('Something went wrong!');
    }
};





exports.loadMyOrders = async (req, res) => {
    try {
        const userId = req.session.user_id;
        const page = parseInt(req.query.page) || 1;

        const totalOrders = await Order.countDocuments({ userId });
        const totalPages = Math.ceil(totalOrders / ITEMS_PER_PAGE);

        const orders = await Order.find({ userId })
            .sort({ createdAt: -1 })
            .skip((page - 1) * ITEMS_PER_PAGE)
            .limit(ITEMS_PER_PAGE)
            .populate("items.productId");

        res.render("my-orders", {
            orders,
            currentPage: page,
            totalPages
        });
    } catch (err) {
        console.error("Error loading orders:", err);
        res.status(500).send("Internal Server Error");
    }
};
exports.cancelOrder = async (req, res) => {
    try {
        const orderId = req.params.orderId;
        const order = await Order.findById(orderId);

        if (!order) return res.status(404).send('Order not found');

        order.status = 'Cancel Pending';
        await order.save();

        res.redirect('/user/my-orders'); // Or respond with JSON if using AJAX
    } catch (error) {
        console.error('Cancel order error:', error);
        res.status(500).send('Internal Server Error');
    }
};
