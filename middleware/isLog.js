function isLogin(req, res, next) {
    if (req.session.user_id) {
        next();
    } else {
        res.redirect('/user/loadUser');
    }
}

function isLogout(req, res, next) {
    if (req.session.user_id) {
        res.redirect('/user/home');
    } else {
        next();
    }
}

module.exports = {
    isLogin,
    isLogout
};
