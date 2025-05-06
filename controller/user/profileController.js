const User = require('../../model/user');
const Address=require('../../model/address')
exports.loadProfile = async (req, res) => {
    try {
        console.log("Session user_id:", req.session.user_id); // check this

        const userId = req.session.user_id;
        if (!userId) {
            return res.redirect('/login');
        }

        const user = await User.findById(userId);
        const addresses = await Address.find({ userId });

        if (!user) {
            return res.redirect('/login');
        }

        res.render('profile', { user ,addresses });
    } catch (error) {
        console.log(error.message);
    }
};
exports.updateProfile = async (req, res) => {
    try {
        const userId = req.session.user_id; // ✅ fixed line
        const { username, email, mobile } = req.body;

        await User.findByIdAndUpdate(userId, {
            username,
            email,
            mobile
        });

        res.redirect('/user/loadprofile'); 
    } catch (err) {
        console.error('Profile update failed:', err);
        res.status(500).send('Internal Server Error');
    }
};


