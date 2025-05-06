const Order = require('../../model/order');
const User = require('../../model/user');
const Product = require('../../model/product');

const ITEMS_PER_PAGE = 5;

exports.loadAllOrders = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;

        const totalOrders = await Order.countDocuments();
        const totalPages = Math.ceil(totalOrders / ITEMS_PER_PAGE);

        const orders = await Order.find()
            .sort({ createdAt: -1 })
            .skip((page - 1) * ITEMS_PER_PAGE)
            .limit(ITEMS_PER_PAGE)
            .populate('userId')
            .populate('items.productId');

        res.render('orderManagement', {
            orders,
            currentPage: page,
            totalPages,
        });
    } catch (err) {
        console.error('Error loading orders:', err);
        res.status(500).send('Server error');
    }
};
exports.updateOrderStatus = async (req, res) => {
    try {
        const { orderId } = req.params;
        const { status } = req.body;

        await Order.findByIdAndUpdate(orderId, { status });
        res.redirect('/admin/orders');
    } catch (error) {
        console.error("Error updating order status:", error);
        res.status(500).send("Internal Server Error");
    }
};
exports.loadCancelOrders = async (req, res) => {
    try {
        const cancelOrders = await Order.find({ status: 'Cancel Pending' })
            .sort({ createdAt: -1 })
            .populate('items.productId');

        res.render('cancel-order-list', { cancelOrders });
    } catch (error) {
        console.error('Error loading cancel order list:', error);
        res.status(500).send('Internal Server Error');
    }
};



exports.approveCancelRequest = async (req, res) => {
    try {
        const orderId = req.params.orderId;

        const order = await Order.findById(orderId).populate('items.productId');

        if (!order || order.status !== 'Cancel Pending') {
            return res.status(400).send('Invalid order or not eligible for cancellation');
        }

        // Restore stock
        for (const item of order.items) {
            const product = item.productId;
            product.stock += item.quantity;
            await product.save();
        }

        // Update order status to Cancelled
        order.status = 'Cancelled';
        await order.save();

        res.redirect('/admin/cancel-order-list');
    } catch (err) {
        console.error('Error approving cancel request:', err);
        res.status(500).send('Internal Server Error');
    }
};

