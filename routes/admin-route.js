const express=require('express')
const router=express.Router();
const multer = require('multer');
const {verifyLogin, loadLogin, loadHome,loadUserlist,toggleBlockUser,adminLogout}=require('../controller/admin/adminController');
const{loadCategories,loadAddCategory, addCategory,loadEditCategory,updateCategory,deleteCategory,toggleCategoryStatus}=require('../controller/admin/categoryController')
const{loadProduct,loadAddProduct,addProduct,loadEditProduct,updateProduct,deleteProduct }=require('../controller/admin/productController')
const {isAdminLoggedIn}=require('../middleware/authMiddleware')
const {loadAllOrders,updateOrderStatus,loadCancelOrders,approveCancelRequest}=require('../controller/admin/orderController')

// Multer setup
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/productImages'); // Folder to save images
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + '-' + file.originalname);
    }
});

const upload = multer({ storage: storage })
//admin auth routes

router.post('/login',verifyLogin);
router.get('/loadlogin',loadLogin);
router.get('/adminhome',loadHome);
router.get('/logout',adminLogout);

//userlist routes
router.get('/loaduselist',loadUserlist);
router.post("/block-user/:id", toggleBlockUser);
//category routes
router.get('/loadcategory',loadCategories);
router.get('/add-category',loadAddCategory);
router.post('/add-category',addCategory);
router.get('/edit-category/:id',loadEditCategory);
router.post('/edit-category/:id',updateCategory);
router.get('/delete-category/:id', deleteCategory);
router.get('/toggle-category-status/:id', toggleCategoryStatus);

//product routes
router.get('/loadproduct',loadProduct);
router.get('/add-product', loadAddProduct);
router.post('/add-product', upload.array('images', 4),addProduct);
router.get('/edit-product/:id', loadEditProduct);
router.post('/edit-product/:id',  upload.array('images', 4), updateProduct);
router.get('/delete-product/:id', deleteProduct);

//order management
router.get('/orders', loadAllOrders);
router.post('/update-order-status/:orderId', updateOrderStatus);
router.get('/cancel-order-list', loadCancelOrders);
router.post('/approve-cancel/:orderId', approveCancelRequest);

module.exports = router;