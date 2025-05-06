const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    items: [{
        productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
        quantity: Number
    }],
    totalAmount: Number,
    address: {
        name: String,
        houseName: String,
        street: String,
        city: String,
        district: String,
        state: String,
        pinCode: String,
        country: String,
        mobile: String
    },
    paymentMethod: String,
    status: { type: String, default: 'Pending' },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Order', orderSchema);
