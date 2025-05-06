exports.isAdminLoggedIn = (req, res, next) => {
    if (req.session.admin_id) {
        next(); // ✅ logged in, continue
    } else {
        res.redirect('/admin'); //  not logged in, go to login page
    }
};
