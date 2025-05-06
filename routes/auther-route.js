const express=require('express')
const router=express.Router();
const{registerUser,verifyLogin,emailVerification,loadRegister,loadLogin,loadHome,logout}=require('../controller/user/authController');
const{loadProductList,signleProductLoad}=require('../controller/user/productListController')
const {loadProfile,updateProfile} =require('../controller/user/profileController')
const{loadAddAddressPage,addAddress,loadEditAddressPage,updateAddress,deleteAddress}=require('../controller/user/addressController')
const { isLogin, isLogout } = require('../middleware/isLog');
const {addToCart,loadCart,decrementCart,incrementCart,deleteCart,clearCart}=require('../controller/user/cartController')
const {loadCheckoutPage}=require('../controller/user/checkoutController')
const {loadOrderReview,loadOrderSuccess,placeOrder,loadMyOrders,cancelOrder}=require('../controller/user/orderController')
const {createOrder,verifyPayment}=require('../controller/user/paymentController')
const { downloadInvoice } = require('../controller/user/invoiceController');

// auth routes
router.post('/register',registerUser);
router.post('/login',verifyLogin);
router.get('/verify-email',emailVerification);
router.get('/logout', logout);

router.get('/loadRegister', isLogout, loadRegister); // add isLogout
router.get('/loadUser', isLogout, loadLogin); // add isLogout
router.get('/home', isLogin, loadHome);

//product list
router.get('/product-list', loadProductList);
router.get('/product/:id', signleProductLoad);

// profile
router.get('/loadprofile/', isLogin, loadProfile);
router.post('/update-profile',updateProfile);

//address
router.get('/add-address', loadAddAddressPage); 
router.post('/add-address',addAddress);
router.get('/edit-address/:id', loadEditAddressPage);
router.post('/edit-address/:id', updateAddress);
router.post('/delete-address/:id',deleteAddress);

//cart
router.post('/add-to-cart/:productId', addToCart);
router.get('/cart', loadCart); 
router.get('/decrement-cart/:cartItemId', decrementCart);
router.get('/increment-cart/:cartItemId', incrementCart);

router.post('/delete-cart-item', deleteCart);
router.get('/clear-cart', clearCart);

//check-out

router.get('/checkout', isLogin, loadCheckoutPage);
router.post('/order-review', loadOrderReview);

//order
router.get('/order-success', loadOrderSuccess);
router.post('/place-order', placeOrder); 
router.post('/create-razorpay-order', createOrder);
router.post("/verify-payment", verifyPayment);
router.get('/my-orders', loadMyOrders);

router.post('/cancel-order/:orderId', cancelOrder);

//download invoice

router.get('/download-invoice/:id', downloadInvoice);


module.exports = router;
