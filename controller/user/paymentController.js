const Cart = require('../../model/cart'); 
const Address = require('../../model/address');
const Order = require('../../model/order'); 
const Product = require('../../model/product'); 

const Razorpay = require('razorpay');
const crypto = require('crypto');
const dotenv = require('dotenv');
dotenv.config();

const razorpayInstance = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET
});

// Create Razorpay order
exports.createOrder = async (req, res) => {
    try {
        const { amount } = req.body;

        const options = {
            amount: amount * 1,
            currency: "INR",
            receipt: "order_rcptid_" + Date.now(),
        };

        const order = await razorpayInstance.orders.create(options);
        res.json(order);
    } catch (err) {
        console.error('Error creating Razorpay order:', err);
        res.status(500).send("Error creating Razorpay order");
    }
};
exports.verifyPayment = async (req, res) => {
    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
        const userId = req.session.user_id;

        const hmac = crypto.createHmac("sha256", process.env.RAZORPAY_KEY_SECRET);
        hmac.update(razorpay_order_id + "|" + razorpay_payment_id);
        const digest = hmac.digest("hex");

        if (digest === razorpay_signature) {
            // ✅ Payment verified

            // 🛒 Fetch cart items
            const cartItems = await Cart.find({ userId }).populate('productId');

            // 🏠 Get default or recent selected address from session or DB
            const address = await Address.findOne({ userId }); // you can customize this

            // 📝 Create order
            const order = new Order({
                userId,
                items: cartItems.map(item => ({
                    productId: item.productId._id,
                    quantity: item.quantity,
                    price: item.productId.price
                })),
                totalAmount: cartItems.reduce((acc, item) => acc + (item.productId.price * item.quantity), 0),
                address: {
                    name: address.name,
                    houseName: address.houseName,
                    street: address.street,
                    city: address.city,
                    state: address.state,
                    district: address.district,
                    country: address.country,
                    pinCode: address.pinCode,
                    mobile: address.mobile
                },
                paymentMethod: "razorpay",
                paymentStatus: "Paid",
                orderStatus: "Processing"
            });

            await order.save();

            // 📦 Decrease product stock
            for (const item of cartItems) {
                item.productId.stock -= item.quantity;
                await item.productId.save();
            }

            // 🧹 Clear cart
            await Cart.deleteMany({ userId });

            return res.json({ success: true });
        } else {
            return res.json({ success: false });
        }
    } catch (error) {
        console.error("Error verifying Razorpay payment:", error);
        res.status(500).json({ success: false });
    }
};


