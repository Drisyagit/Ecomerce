const Address = require('../../model/address');

exports.loadCheckoutPage = async (req, res) => {
    try {
        const userId = req.session.user_id;

        const addresses = await Address.find({ userId });

        res.render('checkout-address', { addresses }); 
    } catch (error) {
        console.error('Error loading checkout page:', error);
        res.status(500).send('Internal Server Error');
    }
};
