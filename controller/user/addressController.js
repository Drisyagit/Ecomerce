const Address = require('../../model/address');

exports.addAddress = async (req, res) => {
    try {
        const {
            name, mobile, houseName, street, city,
            district, state, pinCode, country,
            isDefault, redirectTo
        } = req.body;

        const newAddress = new Address({
            userId: req.session.user_id,
            name,
            mobile,
            houseName,
            street,
            city,
            district,
            state,
            pinCode,
            country,
            isDefault: isDefault === 'on'
        });

        await newAddress.save();

        // Redirect based on where the form came from
        if (redirectTo === 'checkout') {
            res.redirect('/user/checkout');
        } else {
            res.redirect('/user/loadprofile');
        }
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
    }
};


exports.loadAddAddressPage = (req, res) => {
    try {
        const redirectTo = req.query.redirectTo || 'profile'; // fallback to 'profile' if nothing passed
        res.render('add-address', { redirectTo }); // pass to EJS
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
    }
};

exports.loadEditAddressPage = async (req, res) => {
    try {
        const addressId = req.params.id;
        const address = await Address.findById(addressId);

        if (!address) return res.status(404).send("Address not found");

        res.render('edit-address', { address });
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
    }
};

// Update address
exports.updateAddress = async (req, res) => {
    try {
        const addressId = req.params.id;
        const { name, mobile, houseName, street, city, district, state, pinCode, country, isDefault } = req.body;

        await Address.findByIdAndUpdate(addressId, {
            name,
            mobile,
            houseName,
            street,
            city,
            district,
            state,
            pinCode,
            country,
            isDefault: isDefault === 'on'
        });

        res.redirect('/user/loadprofile');
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
    }
};

// Delete address
exports.deleteAddress = async (req, res) => {
    try {
        const addressId = req.params.id;
        await Address.findByIdAndDelete(addressId);
        res.redirect('/user/loadprofile');
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
    }
};