const PDFDocument = require('pdfkit');
const Order = require('../../model/order');

exports.downloadInvoice = async (req, res) => {
    try {
        const orderId = req.params.id;
        const order = await Order.findById(orderId).populate('items.productId');

        if (!order) return res.status(404).send('Order not found');

        const doc = new PDFDocument();
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename=invoice-${order._id}.pdf`);

        doc.fontSize(20).text('🧾 Order Invoice', { align: 'center' });
        doc.moveDown();

        doc.fontSize(12).text(`Order ID: ${order._id}`);
        doc.text(`Date: ${order.createdAt.toDateString()}`);
        doc.text(`Payment Method: ${order.paymentMethod}`);
        doc.text(`Total Amount: ₹${order.totalAmount}`);
        doc.moveDown();

        doc.fontSize(14).text('Products:', { underline: true });
        doc.moveDown();

        order.items.forEach(item => {
            doc.text(`${item.productId.name} - ₹${item.productId.price} × ${item.quantity} = ₹${item.productId.price * item.quantity}`);
        });

        doc.end();
        doc.pipe(res);

    } catch (error) {
        console.error("Error generating invoice:", error);
        res.status(500).send('Error generating invoice');
    }
};
